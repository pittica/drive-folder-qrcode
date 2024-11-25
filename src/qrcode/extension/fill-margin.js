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

export default (context, width, height, margin, color, rounded) => {
  const over = margin * 2

  context.fillStyle = color
  context.roundRect(0, 0, width, height + over, rounded ? margin : 0)
  context.roundRect(
    margin,
    margin,
    width - over,
    height - over,
    rounded ? margin : 0
  )
  context.fill("evenodd")
}
