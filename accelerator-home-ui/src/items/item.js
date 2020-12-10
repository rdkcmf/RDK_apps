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
import { Lightning } from '@lightningjs/sdk'
import { COLORS } from '../colors/Colors'

/**
 * Class for rendering items in UI list.
 */
export default class Item extends Lightning.Component {
  static _template() {
    return {
      Item: {
        w: 200,
        h: 65,
        rect: true,
        color: COLORS.hightlightColor,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 9 },
      },
    }
  }

  /**
   * Function to set contents for an item in UI list.
   */
  set item(item) {
    this._item = item
    this.tag('Item').patch({
      Name: {
        x: 100,
        y: 32.5,
        mount: 0.5,
        text: { text: item.title, textColor: 0xffffffff, fontSize: 35 },
      },
    })
  }

  /**
   * Set width of the item.
   */
  set width(width) {
    this.tag('Item').w = width
  }

  /**
   * Set height of the item.
   */
  set height(height) {
    this.tag('Item').h = height
  }

  _focus() {
    this.tag('Item').scale = 1.1
  }

  _unfocus() {
    this.tag('Item').scale = 1
  }
}
