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

export default async (
  drive,
  output,
  logo,
  colors,
  font,
  size,
  margin,
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
    qr
      .getRawData("svg")
      .then((buffer) =>
        uploadFile(
          output,
          buffer.toString(),
          `${name} - ${id}.svg`,
          "image/svg+xml",
          credentials
        )
      )
  )
}