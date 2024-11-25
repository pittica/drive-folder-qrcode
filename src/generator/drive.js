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
import { uploadFile } from "../drive/folder"
import pdf from "./pdf"
import MemoryStream from "memorystream"

export default async (
  drive,
  output,
  logo,
  colors,
  font,
  size,
  margin,
  rounded = false,
  format = "PDF",
  credentials = null
) =>
  await generate(
    drive,
    logo,
    colors,
    font,
    size,
    margin,
    rounded,
    credentials
  ).then(
    async (images) =>
      await Promise.all(
        images.map(
          async ({ folder: { id, name }, qr }) =>
            await qr.getRawData("svg").then(async (buffer) => {
              switch (format.toUpperCase()) {
                case "PDF":
                  const doc = pdf(size, margin, buffer)
                  const stream = new MemoryStream(null, {
                    readable: false,
                  })

                  doc.pipe(stream)

                  doc.on("end", async () => {
                    await uploadFile(
                      output,
                      Buffer.concat(stream.queue).toString(),
                      `${name} - ${id}.pdf`,
                      "application/pdf",
                      credentials
                    )

                    stream.destroy()
                  })

                  doc.end()

                  return id
                case "SVG":
                  const s = await uploadFile(
                    output,
                    buffer.toString(),
                    `${name} - ${id}.svg`,
                    "image/svg+xml",
                    credentials
                  )

                  return id
              }
            })
        )
      )
  )
