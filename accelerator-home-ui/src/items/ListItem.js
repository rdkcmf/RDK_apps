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
import { CONFIG } from '../Config/Config';

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
        Shadow: {
          alpha: 0,
          color: CONFIG.theme.hex,
        },
        y: 20,
        Image: {
          y: this.y
        },
        Info: {},
      },
    }
  }

  _init() {
    if (this.data.url.startsWith('/images')) {
      this.tag('Image').patch({
        rtt: true,
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h,
        src: Utils.asset(this.data.url),
        scale: this.unfocus,
      });
    } else {
      this.tag('Image').patch({
        rtt: true,
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h,
        src: this.data.url,
      });
    }

    /* Used static data for develpment purpose ,
    it wil replaced with Dynamic data once implimetation is completed.*/
    this.tag('Info').patch({
      x: this.x,
      y: this.y + this.h + 25,
      w: this.w,
      h: 140,
      alpha: 0,
      PlayIcon: {
        // x: this.x + 20,
        // y: this.y + 20,
        // texture: Lightning.Tools.getSvgTexture(Utils.asset('images/player/play_icon_new.png'), 50, 50),
        Label: {
          x: this.x,
          y: this.y + 10,
          text: {
            fontFace: CONFIG.language.font,
            text: this.data.displayName,
            fontSize: 25,
            maxLines: 2,
            wordWrapWidth: this.w
          },
        }
      },
      IMDb: {
        x: this.x,
        y: this.y + 40,
        texture: Lightning.Tools.getSvgTexture(Utils.asset('images/player/IMDb.png'), 30, 20),
        Rating: {
          x: this.x + 30,
          y: this.y - 3,
          text: {
            fontFace: CONFIG.language.font,
            text: '8.8/10',
            fontSize: 20,
            maxLines: 2,
            wordWrapWidth: 150
          },
        },
        Ua: {
          text: {
            fontFace: CONFIG.language.font,
            text: 'R',
            fontSize: 20
          },
          x: this.x + 110,
          y: this.y - 3
        },
        Duration: {
          x: this.x + 140,
          y: this.y - 3,
          text: {
            fontFace: CONFIG.language.font,
            text: '2h 30min',
            fontSize: 20,
            maxLines: 2,
            wordWrapWidth: 150
          },
        },
        Year:{
          x: this.x + 240,
          y: this.y - 3,
          text: {
            fontFace: CONFIG.language.font,
            text: '2017',
            fontSize: 20,
            maxLines: 2,
            wordWrapWidth: 150
          },
        }
      }
    })
  }

  /**
   * Function to change properties of item during focus.
   */
  _focus() {
    this.tag('Image').patch({
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      zIndex: 1,
      scale: this.focus,
    })

    this.tag('Info').alpha = 1
    this.tag('Info').patch({
      smooth: {
        x: this.x,
        w: this.w,
        h: 140,
        scale: this.focus
      }
    })
    this.tag('Item').patch({
      zIndex: 2,
    })
    this.tag('Shadow').patch({
      scale: this.focus,
      alpha: 1,
      y: -10,
      texture: lng.Tools.getShadowRect(this.w, this.h + 20, 0, 0, 0),
    });
  }

  /**
   * Function to change properties of item during unfocus.
   */
  _unfocus() {
    this.tag('Image').patch({
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      scale: this.unfocus,
    })
    this.tag('Item').patch({
      smooth: {
        zIndex: 0,
        y: this.y + 20
      }
    })
    this.tag('Info').alpha = 0
    this.tag('Shadow').patch({
      smooth: {
        alpha: 0
      }
    });
  }
}
