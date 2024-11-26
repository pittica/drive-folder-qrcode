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
import image from "../qrcode/image"
import { getData } from "../qrcode/logo"

export default async (
  drive,
  logo,
  colors,
  font,
  size,
  margin,
  rounded = false,
  credentials = null
) => {
  if (drive) {
    const folders = await list(drive, credentials)
    const data = await getData(logo)

    console.info(`Processing "${drive}"...`)

    return folders.map((folder) => {
      try {
        const qr = image(
          folder,
          size,
          margin,
          logo,
          data,
          colors,
          font,
          rounded
        )

        console.info(`Creating QR code for "${folder.name}".`)

        return {
          folder,
          qr,
        }
      } catch {
        console.error(`Error creating QR code for "${folder.name}".`)
      }
    })
  } else {
    console.error("Source Drive or folder is required.")
  }

  return []
}
