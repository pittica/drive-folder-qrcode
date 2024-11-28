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

import { list } from "../drive/folder"
import Image from "../qrcode/image"
import { getData } from "../qrcode/logo"
import { filename, hasFile } from "../drive/folder"
import { join } from "path"
import { existsSync } from "fs"

export default async (
  drive,
  output,
  logo,
  colors,
  font,
  size,
  margin,
  rounded = false,
  credentials = null,
  format = "PDF",
  local = true,
  captionCallback = null
) => {
  const result = []

  if (drive) {
    const folders = await list(drive, credentials)
    const data = await getData(logo, size)

    console.info(`Processing "${drive}"...`)

    await process(
      folders,
      output,
      size,
      margin,
      logo,
      data,
      colors,
      font,
      rounded,
      format,
      local,
      credentials,
      captionCallback,
      result
    )
  } else {
    console.error("Source Google Drive or folder is required.")
  }

  return result
}

export const exists = async (
  output,
  folder,
  format,
  local,
  credentials = null
) => {
  if (local) {
    return existsSync(join(output, filename(folder, format)))
  } else {
    return await hasFile(output, filename(folder, format), credentials)
  }
}

export const process = async (
  folders,
  output,
  size,
  margin,
  logo,
  data,
  colors,
  font,
  rounded,
  format,
  local,
  credentials,
  captionCallback,
  result,
  index = 0
) => {
  if (typeof folders[index] !== "undefined") {
    const folder = folders[index]

    try {
      if (!(await exists(output, folder, format, local, credentials))) {
        const qr = new Image(
          folder,
          size,
          margin,
          logo,
          data,
          colors,
          font,
          rounded,
          typeof captionCallback === "function"
            ? captionCallback(folder)
            : folder.name
        )

        console.info(`Creating QR code for "${folder.name}".`)

        if (local) {
          result.push(await qr.save(output, format))
        } else {
          result.push(await qr.upload(output, format, credentials))
        }
      }

      await process(
        folders,
        output,
        size,
        margin,
        logo,
        data,
        colors,
        font,
        rounded,
        format,
        local,
        credentials,
        captionCallback,
        result,
        index + 1
      )
    } catch (error) {
      console.error(`Error creating QR code for "${folder.name}".`, error)
    }
  }
}
