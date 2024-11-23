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

import localGenerator from "./generator/local"
import driveGenerator from "./generator/drive"

export const drive = async (
  drive,
  output,
  logo,
  size,
  margin,
  credentials = null,
  colorFore = "#000000",
  colorDots = "#000000",
  colorSquare = "#000000",
  colorBackground = "#ffffff",
  colorBorder = "#000000",
  fontPath = null,
  fontFamily = "Arial"
) =>
  await driveGenerator(
    drive,
    output,
    logo,
    {
      fore: colorFore,
      dots: colorDots,
      square: colorSquare,
      background: colorBackground,
      border: colorBorder,
    },
    {
      path: fontPath,
      family: fontFamily,
    },
    size,
    margin,
    credentials
  )

export const local = async (
  drive,
  output,
  logo,
  size,
  margin,
  credentials = null,
  colorFore = "#000000",
  colorDots = "#000000",
  colorSquare = "#000000",
  colorBackground = "#ffffff",
  colorBorder = "#000000",
  fontPath = null,
  fontFamily = "Arial"
) =>
  await localGenerator(
    drive,
    output,
    logo,
    {
      fore: colorFore,
      dots: colorDots,
      square: colorSquare,
      background: colorBackground,
      border: colorBorder,
    },
    {
      path: fontPath,
      family: fontFamily,
    },
    size,
    margin,
    credentials
  )

export default {
  local,
  drive,
}
