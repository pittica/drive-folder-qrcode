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

import SVGtoPDF from "svg-to-pdfkit"
import PDFDocument from "pdfkit"

export default (size, margin, buffer) => {
  const pdf = new PDFDocument({
    compress: false,
    size: [size * 0.75, (size + margin * 2) * 0.75],
  })

  SVGtoPDF(pdf, buffer.toString(), 0, 0, {
    width: size * 0.75,
    height: (size + margin) * 0.75,
    useCSS: false,
  })

  return pdf
}
