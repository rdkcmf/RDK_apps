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
 * Class to render items in side panel.
 */
export default class SidePanelItem extends Lightning.Component {
  /**
   * Function to render various elements in the side panel item.
   */
  static _template() {
    return {
      Item: {
        Title: {
          text: {
            fontSize: 27,
            textColor: 0xffffffff,
          },
          mountX: 0.5,
          alpha: 0,
        },
        Image: {
          x: 0,
        },
      },
    }
  }

  _init() {
    this.tag('Title').patch({ x: this.x_text, y: this.y_text, text: { text: this.data.title } })
    this.tag('Image').patch({
      src: Utils.asset(this.data.url),
      w: this.w,
      h: this.h,
      scale: this.unfocus,
    })
  }

  /**
   * Function to change properties of item during focus.
   */
  _focus() {
    this.tag('Image').patch({ w: this.w, h: this.h, scale: this.focus })
    this.tag('Title').patch({ alpha: 1 })
    this.tag('Item').patch({ zIndex: 1 })
  }

  /**
   * Function to change properties of item during unfocus.
   */
  _unfocus() {
    this.tag('Image').patch({ w: this.w, h: this.h, scale: this.unfocus })
    this.tag('Title').patch({ alpha: 0 })
    this.tag('Item').patch({ zIndex: 0 })
  }
}
