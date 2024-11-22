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
import extension from "./extension"

export default (
  { name, webViewLink },
  size,
  margin,
  image,
  logo,
  { fore, dots, square, background, border },
  font
) => {
  const qr = new QRCodeStyling({
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
      type: "dots",
    },
    cornersDotOptions: {
      color: dots,
      type: "dot",
    },
    cornersSquareOptions: {
      color: square,
      type: "extra-rounded",
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
    caption: name,
    logo,
    font,
  })

  qr.applyExtension(extension)

  return qr
}
