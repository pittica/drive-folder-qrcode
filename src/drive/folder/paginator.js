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

import drive from "../client"

export default async (id, pageToken = null, credentials) =>
  await drive(credentials)
    .files.list({
      q: `'${id}' in parents AND mimeType = 'application/vnd.google-apps.folder'`,
      pageToken,
      pageSize: 15,
      fields: "nextPageToken, files(id, name, webViewLink)",
      spaces: "drive",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    })
    .then(({ data }) => data)
    .catch(({ code, errors }) => {
      if (errors) {
        errors.forEach(({ message }) => console.error(code, message))
      } else {
        console.error(code)
      }

      return null
    })
