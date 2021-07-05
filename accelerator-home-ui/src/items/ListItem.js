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
import {
  Lightning,
  Utils
} from '@lightningjs/sdk'

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
          x: -45,
          y: -40,
          color: 0x66000000,
          texture: lng.Tools.getShadowRect(375, 420, 0, 10, 20),
        },
        x: 0,
        y: 18,
        Image: {},
        Info: {},
      },
    }
  }

  _init() {
    if (this.data.url.startsWith('/images')) {
      this.tag('Image').patch({
        rtt: true,
        w: this.w,
        h: this.h,
        shader: {
          type: lng.shaders.RoundedRectangle,
          radius: 10
        },
        src: Utils.asset(this.data.url),
        scale: this.unfocus,
      });
    } else {
      this.tag('Image').patch({
        rtt: true,
        w: this.w,
        h: this.h,
        shader: {
          type: lng.shaders.RoundedRectangle,
          radius: 10
        },
        src: this.data.url,
      });
    }

    /* Used static data for develpment purpose ,
    it wil replaced with Dynamic data once implimetation is completed.*/
    this.tag('Info').patch({
      rect: true,
      color: 0xff141F31,
      x: this.x,
      y: this.y + this.h + 30,
      w: this.w,
      h: 140,
      alpha: 0,
      PlayIcon: {
        x: this.x + 20,
        y: this.y + 20,
        texture: Lightning.Tools.getSvgTexture(Utils.asset('images/player/play_icon_new.png'), 50, 50),
        Label: {
          x: this.x + 65,
          y: this.y + 10,
          text: {
            text: this.data.displayName,
            fontSize: 25,
            maxLines: 2,
            wordWrapWidth: 150
          },
        }
      },
      IMDb: {
        x: this.x + 25,
        y: this.y + 90,
        texture: Lightning.Tools.getSvgTexture(Utils.asset('images/player/IMDb.png'), 45, 30),
        Rating: {
          x: this.x + 65,
          y: this.y,
          text: {
            text: '8.8/10',
            fontSize: 20,
            maxLines: 2,
            wordWrapWidth: 150
          },
        },
        Ua: {
          text: {
            text: '16+',
            fontSize: 18
          },
          x: this.x + 135,
          y: this.y,
          RoundRectangle: {
            zIndex: 2,
            texture: lng.Tools.getRoundRect(30, 20, 4, 3, 0xffff00ff, false, 0xff00ffff),
          },
        },
        Duration: {
          x: this.x + 190,
          y: this.y,
          text: {
            text: '2h 30m',
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
      w: this.w,
      h: this.h,
      scale: this.focus,
      shader: {
        type: lng.shaders.RoundRectangle,
        radius: 0
      }
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
      smooth: {
        zIndex: 1,
        y: this.y - 65,
      }
    })
    this.tag('Shadow').patch({
      smooth: {
        alpha: 1
      }
    });
  }

  /**
   * Function to change properties of item during unfocus.
   */
  _unfocus() {
    this.tag('Image').patch({
      x: 0,
      y: 0,
      w: this.w,
      h: this.h,
      scale: this.unfocus,
      shader: {
        type: lng.shaders.RoundedRectangle,
        radius: 10
      }
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