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

export async function getContent(file) {
  try {
    const url = new URL(file)
    const protocol = url.protocol.toUpperCase()

    if (protocol === "HTTPS:" || protocol === "HTTP:") {
      const { data } = await axios.get(url).then(({ data }) => optimize(data))

      return data
    } else {
      const { data } = optimize(fs.readFileSync(file))

      return data
    }
  } catch (ex) {
    const { data } = optimize(fs.readFileSync(file))

    return data
  }
}

export function resize(data, size) {
  const win = window(data)

  registerWindow(win, win.document)

  const svg = SVG(data)
  const width = size / 5
  const x = size / 2 - width / 2

  svg.size(width, width)
  svg.move(x, x)

  return svg.xml()
}
