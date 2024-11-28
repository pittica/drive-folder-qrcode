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

import { optimize } from "svgo"
import axios from "axios"
import { SVG, registerWindow } from "@svgdotjs/svg.js"
import { URL } from "url"
import fs from "fs"
import window from "./window"

/**
 * Gets the logo content.
 *
 * @param {string} file File path or URL.
 * @returns {Output} The logo content.
 */
export const getContent = async (file) => {
  try {
    const url = new URL(file)
    const protocol = url.protocol.toUpperCase()

    if (protocol === "HTTPS:" || protocol === "HTTP:") {
      const { data } = await axios.get(url).then(({ data }) => optimize(data))

      return data
    } else {
      return getFile(file)
    }
  } catch (ex) {
    return getFile(file)
  }
}

/**
 * Gets file content from the given file path
 *
 * @param {string} file File path.
 * @param {Number} size Resize size.
 * @returns {string} File content from the given file path
 */
export const getData = async (file, size) => {
  const data = await getContent(file)

  return data ? resize(data, size) : null
}

/**
 * Gets file content from the given file path
 *
 * @param {string} file File path.
 * @returns {string} File content from the given file path
 */
export const getFile = (file) => {
  try {
    const { data } = optimize(fs.readFileSync(file))

    return data
  } catch {
    return null
  }
}

/**
 * Resizes a logo from the given data.
 *
 * @param {string} data SVG data.
 * @param {Number} size Greather side size of the logo.
 * @returns {string} Resized logo.
 */
export const resize = (data, size) => {
  const win = window(data)

  registerWindow(win, win.document)

  const svg = SVG(data)
  const width = size / 5
  const x = size / 2 - width / 2

  svg.size(width, width)
  svg.move(x, x)

  return svg.xml()
}
