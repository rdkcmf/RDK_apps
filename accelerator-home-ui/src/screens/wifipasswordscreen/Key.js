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
import { Lightning, Utils } from '@lightningjs/sdk'

/**
 * Class to render the key for wifi screen
 */
export default class Key extends Lightning.Component {
  _construct() {
    this._keyType = 'alphanum'
    this._fontSize = 36
  }
  static _template() {
    return {
      Border: {
        w: this.width,
        h: this.height,
        type: Lightning.components.BorderComponent,
        colorBorder: 0xff000000,
      },
    }
  }
  set item(item) {
    this._key = item
    this.tag('Border').w = this.w
    this.tag('Border').h = this.h
    this.tag('Border').colorBorder = 0xff000000
    this.tag('Border').content = {
      Focus: {
        rect: true,
        w: this.w,
        h: this.h,
        color: 0x00c0c0c0,
      },

      Key: {
        x: this.w / 2,
        y: this.h / 2,
        mount: 0.5,
        text: { text: item, fontSize: this._fontSize, fontFace: 'MS-Light' },
      },
    }
    if (this._keyType == 'delete') {
      this.tag('Border').content = {
        Key: {
          src: Utils.asset('images/del.png'),
          zIndex: 10,
        },
      }
    }
  }
  set keyType(type) {
    this._keyType = type
  }
  set fontSize(size) {
    this._fontSize = size
  }
  _focus() {
    this.tag('Border').content = {
      Focus: { color: 0xffc0c0c0 },
      Key: {
        color: 0xff000000,
      },
    }
    this.tag('Border').colorBorder = 0xffc0c0c0
  }
  _unfocus() {
    this.tag('Border').content = {
      Focus: { color: 0x00c0c0c0 },
      Key: {
        color: 0xffffffff,
      },
    }
    this.tag('Border').colorBorder = 0xff000000
  }
  _handleEnter() {
    this.fireAncestors('$pressedKey', this._key, this._keyType)
  }
}
