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

import generate from "./generate"
import { join } from "path"
import { writeFileSync, createWriteStream } from "fs"
import pdf from "./pdf"

export default async (
  drive,
  output,
  logo,
  colors,
  font,
  size,
  margin,
  format = "PDF",
  credentials = null
) => {
  const images = await generate(
    drive,
    logo,
    colors,
    font,
    size,
    margin,
    credentials
  )

  images.forEach(({ folder: { id, name }, qr }) =>
    qr.getRawData("svg").then((buffer) => {
      switch (format.toUpperCase()) {
        case "PDF":
          const doc = pdf(size, margin, buffer)
          const stream = createWriteStream(join(output, `${name} - ${id}.pdf`))

          doc.pipe(stream)
          doc.end()

          break
        case "SVG":
          writeFileSync(join(output, `${name} - ${id}.svg`), buffer.toString())
          break
      }
    })
  )
}
