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

import paginator from "./folder/paginator"
import drive from "./client"

/**
 * Lists all files in the folder with the given ID.
 *
 * @param {string} id Folder ID.
 * @param {string} credentials Service account path.
 * @returns {Array} All files in the folder with the given ID.
 */
export const list = async (id, credentials = null) => {
  const files = []
  let token = null

  while (true) {
    const results = await paginator(id, token, credentials)

    if (results) {
      results.files.forEach((file) => files.push(file))

      if (!results.nextPageToken) {
        break
      } else {
        token = results.nextPageToken
      }
    } else {
      break
    }
  }

  return files
}

/**
 * Creates a file in the given Drive folder.
 *
 * @param {GoogleAuth} client Google Auth client instance.
 * @param {string} folder Folder ID.
 * @param {string} content File content.
 * @param {string} name File name.
 * @param {string} mimeType MIME type in "type/sub" format.
 * @param {string} credentials Service account path.
 * @returns {File} The created file.
 */
export const createFile = async (client, folder, content, name, mimeType) =>
  await client.files
    .create({
      requestBody: {
        name,
        parents: [folder],
      },
      media: {
        mimeType,
        body: content,
      },
      fields: ["id", "name"],
      uploadType: "multipart",
      supportsAllDrives: true,
    })
    .then(({ data, status }) => {
      if (status >= 200 && status < 300) {
        console.info(`QR code for "${folder}", "${data.id}", created.`)
      } else {
        console.error(`Errore creating QR code for "${folder}".`)
      }

      return data
    })
    .catch(() => console.error(`Errore creating QR code for "${folder}".`))

/**
 * Creates a file in the given Drive folder, whether it doesn't exist.
 *
 * @param {string} folder Folder ID.
 * @param {string} content File content.
 * @param {string} name File name.
 * @param {string} mimeType MIME type in "type/sub" format.
 * @param {string} credentials Service account path.
 * @returns {File} The created file.
 */
export const uploadFile = async (
  folder,
  content,
  name,
  mimeType,
  credentials
) => {
  const client = await drive(credentials)

  return await client.files
    .list({
      q: `'${folder}' in parents AND mimeType = '${mimeType}' AND name = '${name}' AND trashed = false`,
      pageSize: 1,
      fields: "files(id, name, trashed, webViewLink)",
      spaces: "drive",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    })
    .then(async ({ data: { files } }) => {
      if (files.length > 0) {
        console.info(
          `QR code for "${folder}", "${files[0].name}", already exists.`,
          files[0].webViewLink
        )

        return await client.files.get({
          fileId: files[0].id,
          alt: "media",
          supportsAllDrives: true,
        })
      } else {
        return await createFile(client, folder, content, name, mimeType)
      }
    })
    .catch(
      async () => await createFile(client, folder, content, name, mimeType)
    )
}
