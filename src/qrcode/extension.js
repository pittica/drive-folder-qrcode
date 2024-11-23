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

import path from "path"
import { optimize } from "svgo"
import fillCaption from "./extension/fill-caption"
import fillMargin from "./extension/fill-margin"
import document from "./extension/document"
import undef from "./extension/undef"

export default async (
  svg,
  {
    nodeCanvas: { createCanvas, registerFont },
    width,
    height,
    margin,
    caption,
    image,
    logo,
    backgroundOptions,
    borderOptions,
    font,
  }
) => {
  if (font.path) {
    registerFont(font.path, {
      family: font.family,
    })
  }

  const canvas = createCanvas(width, height + margin, "svg")
  const context = canvas.getContext("2d")

  fillMargin(context, width, height, margin, borderOptions.color)

  context.font = `${margin}px "${font.family}"`
  context.fillStyle = backgroundOptions.color

  fillCaption(caption.toUpperCase(), context, canvas, margin)

  const frame = document(canvas.toBuffer().toString())
  const elements = frame
    .getElementsByTagName("svg")[0]
    .getElementsByTagName("path")

  if (image && path.extname(image).toUpperCase() == ".SVG") {
    const images = svg.getElementsByTagName("image")

    svg.removeChild(images[0])
  }

  svg.innerHTML += elements[0].outerHTML + elements[1].outerHTML + logo

  const h = height + margin * 2

  svg.setAttribute("width", width)
  svg.setAttribute("height", h)
  svg.setAttribute("viewBox", `0 0 ${width} ${h}`)

  const { data } = optimize(undef(svg).outerHTML, {
    multipass: true,
    plugins: [
      "collapseGroups",
      "convertColors",
      "inlineStyles",
      "removeUselessDefs",
      "removeUselessStrokeAndFill",
      "removeComments",
      "mergePaths",
      "removeOffCanvasPaths",
      "convertPathData",
      "convertStyleToAttrs",
      "removeEmptyContainers",
    ],
  })
  const optimized = document(data)

  svg.innerHTML = optimized.getElementsByTagName("svg")[0].innerHTML
}
