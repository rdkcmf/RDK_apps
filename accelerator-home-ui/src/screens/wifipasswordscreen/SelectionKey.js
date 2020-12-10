/**
 * If not stated otherwise in this file or this component's LICENSE
 * file the following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import Key from './Key'
import { Lightning, Utils } from '@lightningjs/sdk'

/**
 * Class to render the key for type selection
 */
export default class SelectionKey extends Key {
  set item(item) {
    this._key = item
  }
  _init() {
    this._arr = [
      [25, 0, 0, 25],
      [0, 0, 0, 0],
      [0, 25, 25, 0],
    ]
    this.patch({
      Bg: {
        x: 0,
        y: 0,
        texture: Lightning.Tools.getRoundRect(
          143,
          53,
          this._arr[this._keyType],
          1,
          0xff000000,
          true,
          0x00000000
        ),
      },
      Text: {
        x: this.w / 2,
        y: this.h / 2,
        mount: 0.5,
        text: { text: this._key, fontSize: 24, textColor: 0xffffffff, fontFace: 'Regular' },
      },
    })
  }

  _focus() {
    this.tag('Text').text.fontStyle = 'Bold'
    this.tag('Text').text.textColor = 0xff000000
    this.patch({
      Bg: {
        x: 0,
        y: 0,
        texture: Lightning.Tools.getRoundRect(
          143,
          56,
          this._arr[this._keyType],
          0,
          0xffc0c0c0,
          true,
          0xffc0c0c0
        ),
      },
    })
  }

  _unfocus() {
    this.tag('Text').text.fontStyle = 'normal'
    this.tag('Text').text.textColor = 0xffffffff
    this.patch({
      Bg: {
        x: 0,
        y: 0,
        texture: Lightning.Tools.getRoundRect(
          143,
          53,
          this._arr[this._keyType],
          1,
          0xff000000,
          true,
          0x00000000
        ),
      },
    })
  }
}
