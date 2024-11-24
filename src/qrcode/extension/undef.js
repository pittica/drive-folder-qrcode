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

export default (svg) => {
  const uses = svg.querySelectorAll("rect[clip-path^='url(']")

  for (let i = 0; i < uses.length; i++) {
    const id = /^url\('#(.*)'\)$/gs.exec(uses[i].getAttribute("clip-path"))[1]
    const clip = svg.getElementById(id)

    for (let j = 0; j < clip.children.length; j++) {
      if (clip.children[j]) {
        clip.children[j].setAttribute("fill", uses[i].getAttribute("fill"))
      }
    }

    uses[i].outerHTML = clip.innerHTML
    clip.parentElement.removeChild(clip)
  }

  const defs = svg.querySelector("defs")
  defs.parentElement.removeChild(defs)

  return svg
}
