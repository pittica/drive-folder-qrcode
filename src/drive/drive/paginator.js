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

export default async (pageToken = null, credentials = null) =>
  await drive(credentials)
    .drives.list({
      pageToken,
      pageSize: 15,
      fields: "nextPageToken, drives(id)",
    })
    .then(({ data }) => data)
    .catch(() => null)
