// Copyright 2024 Pittica S.r.l.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import QRCodeStyling from "qr-code-styling"
import { JSDOM } from "jsdom"
import nodeCanvas from "canvas"
import { loopWhile } from "deasync"
import { join } from "path"
import { writeFileSync, createWriteStream } from "fs"
import MemoryStream from "memorystream"
import pdf from "../generator/pdf"
import extension from "./extension"
import { filename, uploadFile } from "../drive/folder"

/**
 * QR code image class.
 */
export default class Image {
  _buffer = null

  /**
   *
   * @param {object} folder Google Drive input folder.
   * @param {Number} size QR code size.
   * @param {Number} margin QR code margin.
   * @param {string} image Logo path.
   * @param {string} logo Logo XML/SVG data.
   * @param {object} setting QR code settings.
   * @param {object} font Font settings.
   * @param {boolean} rounded A value indicating whetherthe QR code uses rounded corners and dots.
   * @param {string} caption QR code caption.
   */
  constructor(
    { id, name, webViewLink },
    size,
    margin,
    image,
    logo,
    { fore, dots, square, background, border },
    font,
    rounded = false,
    caption = null
  ) {
    this._settings = { id, name, webViewLink, size, margin }

    this._qr = new QRCodeStyling({
      jsdom: JSDOM,
      nodeCanvas,
      type: "svg",
      width: size,
      height: size,
      margin,
      data: webViewLink,
      image,
      dotsOptions: {
        color: fore,
        type: rounded ? "dots" : "square",
      },
      cornersDotOptions: {
        color: dots,
        type: rounded ? "dot" : "square",
      },
      cornersSquareOptions: {
        color: square,
        type: rounded ? "extra-rounded" : "square",
      },
      backgroundOptions: {
        color: background,
      },
      borderOptions: {
        color: border,
      },
      imageOptions: {
        saveAsBlob: false,
        crossOrigin: "anonymous",
        margin,
      },
      caption: caption || name,
      logo,
      font,
      rounded,
    })

    this._qr.applyExtension(extension)
  }

  /**
   * Gets an output filename.
   *
   * @param {string} extension File extension.
   * @returns {string} Output filename.
   */
  filename(extension) {
    return filename(this._settings, extension)
  }

  pdf(stream, buffer, callback) {
    let lock = true
    let result = null

    const doc = pdf(this._settings.size, this._settings.margin, buffer)

    doc.pipe(stream)

    doc.once("end", () => {
      if (typeof callback === "function") {
        result = callback(stream)
      }

      lock = false
    })

    doc.end()

    loopWhile(() => lock)

    return result
  }

  /**
   * Saves the QR code locally.
   *
   * @param {string} output Output folder.
   * @param {string} format Output format.
   * @returns {string} The destination path.
   */
  async save(output, format = "PDF") {
    return await this._qr.getRawData("svg").then((buffer) => {
      switch (format.toUpperCase()) {
        case "PDF":
          const stream = createWriteStream(join(output, this.filename(format)))

          const result = this.pdf(stream, buffer, ({ path }) => path)

          stream.close()

          return result
        case "SVG":
          const dest = join(output, this.filename(format))

          writeFileSync(dest, buffer.toString())

          return dest
        default:
          return null
      }
    })
  }

  /**
   * Saves the QR code to Google Drive.
   *
   * @param {string} output Google Drive output folder ID.
   * @param {string} format Output format.
   * @param {string} credentials Service account JSON file path.
   * @returns {string} The destination ID.
   */
  async upload(output, format = "PDF", credentials) {
    return await this._qr.getRawData("svg").then(async (buffer) => {
      switch (format.toUpperCase()) {
        case "PDF":
          const stream = new MemoryStream(null, {
            readable: false,
          })

          const file = this.pdf(
            stream,
            buffer,
            async ({ queue }) =>
              await uploadFile(
                output,
                Buffer.concat(queue).toString(),
                this.filename(format),
                "application/pdf",
                credentials
              )
          )

          stream.destroy()

          return file
        case "SVG":
          return await uploadFile(
            output,
            buffer.toString(),
            this.filename(format),
            "image/svg+xml",
            credentials
          )
        default:
          return null
      }
    })
  }
}
