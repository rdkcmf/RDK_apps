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
 * Class to render items in main view.
 */
export default class ListItem extends Lightning.Component {
  /**
   * Function to render various elements in the main view item.
   */
  static _template() {
    return {
      Item: {
        x: 30,
        y: 18,
        Shadow: {
          alpha: 0,
          color: 0xffa9a9a9,
        },
        Title: {
          text: {
            fontSize: 27,
            textColor: 0xffffffff,
          },
          mountX: 0.5,
          alpha: 0,
        },
        Bg: {},
        Image: {},
      },
    }
  }

  _init() {
    if (this.data.show) {
      this.tag('Title').patch({
        x: this.x_text,
        y: this.y_text,
        alpha: 1,
        text: { text: this.data.title },
      })
    }
    this.tag('Title').patch({
      x: this.x_text,
      y: this.y_text,
      text: { text: this.data.displayName },
    })
    this.tag('Shadow').patch({
      scale: this.unfocus,
      texture: Lightning.Tools.getShadowRect(this.w, this.h, 4, 10, 0),
    })
    this.tag('Bg').patch({
      rect: true,
      color: 0xff000000,
      w: this.w,
      h: this.h,
    })
    if (this.data.url.startsWith('/images')) {
      this.tag('Image').patch({
        src: Utils.asset(this.data.url),
        w: this.w,
        h: this.h,
        scale: this.unfocus,
      })
    } else {
      this.tag('Image').patch({ src: this.data.url, w: this.w, h: this.h })
    }
  }

  /**
   * Function to change properties of item during focus.
   */
  _focus() {
    this.tag('Bg').scale = this.focus
    this.tag('Image').patch({ w: this.w, h: this.h, scale: this.focus })
    this.tag('Title').patch({
      x: this.x_text,
      y: this.y_text,
      text: { text: this.data.displayName },
    })
    this.tag('Shadow').patch({
      scale: this.focus,
      x: -7,
      y: -7,
      alpha: 1,
      texture: Lightning.Tools.getShadowRect(this.w + 14, this.h + 14, 4, 10, 0),
    })
    this.tag('Title').patch({ alpha: 1 })
    this.tag('Item').patch({ zIndex: 1 })
  }

  /**
   * Function to change properties of item during unfocus.
   */
  _unfocus() {
    this.tag('Bg').scale = this.unfocus
    this.tag('Image').patch({ x: 0, y: 0, w: this.w, h: this.h, scale: this.unfocus })
    this.tag('Shadow').patch({ scale: this.unfocus, alpha: 0 })
    this.tag('Title').patch({ alpha: 0 })
    this.tag('Item').patch({ zIndex: 0 })
  }
}
