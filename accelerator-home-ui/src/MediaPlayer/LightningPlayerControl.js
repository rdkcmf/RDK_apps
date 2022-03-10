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
import { CONFIG } from '../Config/Config'

/**
 * Variable to store the timer
 */
var timeout

/**
 * Class to render the UI controls for the video player.
 */
export default class LightningPlayerControls extends Lightning.Component {
  /**
   * Function to create components for the player controls.
   */
  static _template() {
    return {
      TimeBar: {
        x: 90,
        y: 93.5,
        texture: Lightning.Tools.getRoundRect(1740, 20, 10, 0, 0, true, 0xffffffff),
      },
      ProgressWrapper: {
        x: 90,
        y: 93.5,
        w: 0,
        h: 35,
        clipping: true,
        ProgressBar: {
          texture: Lightning.Tools.getRoundRect(
            1740,
            20,
            10,
            0,
            0,
            true,
            CONFIG.theme.hex
          ),
          // x: 90,
          // y: 93.5,
        },
      },
      CurrentTime: {
        x: 90,
        y: 184.5,
      },
      Buttons: {
        x: 820,
        y: 125,
        children: [
          { src: Utils.asset('images/Media Player/Icon_Back_White_16k.png'), x: 17, y: 17 },
          { src: Utils.asset('images/Media Player/Icon_Pause_White_16k.png'), x: 17, y: 17 },
          { src: Utils.asset('images/Media Player/Icon_Next_White_16k.png'), x: 17, y: 17 },
        ].map((item, idx) => ({
          x: idx * 75,
          // texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
          ControlIcon: {
            x: item.x,
            y: item.y,
            texture: Lightning.Tools.getSvgTexture(item.src, 50, 50),
          },
        })),
      },
    }
  }

  _init() {
    /**
     * Variable to store the duration of the video content.
     */
    this.videoDuration = 0
    this.tag('Buttons').children[0].patch({
      alpha: 1
    })
    this.tag('Buttons').children[2].patch({
      alpha: 1
    })
    this.toggle = false
  }

  /**
   * Function to set focus to player controls when the player controls are shown.
   */
  _focus() {
    this._index = 1
    this._setState('PlayPause')
  }

  /**
   * Function to handle the player controls when they are hidden.
   */
  _unfocus() {
    this._setState('Hidden')
    clearTimeout(timeout)
  }
  /**
   * Function to set the duration of the video.
   * @param {String} duration video duration to be set.
   */
  set duration(duration) {
    console.log(`duration was set = ${duration}`);
    this.videoDuration = duration
  }

  /**
   * Function to set the current video time.
   * @param {String} currentTime current time to be set.
   */
  set currentTime(currentTime) {
    this.tag('ProgressWrapper').patch({ w: (1740 * currentTime) / this.videoDuration });
  }

  /**
   * Function to convert time in seconds to hh:mm:ss format.
   * @param {String} totalSeconds time in seconds.
   */
  SecondsTohhmmss(totalSeconds) {
    this.hours = Math.floor(totalSeconds / 3600)
    this.minutes = Math.floor((totalSeconds - this.hours * 3600) / 60)
    this.seconds = totalSeconds - this.hours * 3600 - this.minutes * 60
    this.seconds = Math.round(totalSeconds) - this.hours * 3600 - this.minutes * 60
    this.result = this.hours < 10 ? '0' + this.hours : this.hours
    this.result += ':' + (this.minutes < 10 ? '0' + this.minutes : this.minutes)
    this.result += ':' + (this.seconds < 10 ? '0' + this.seconds : this.seconds)
    return this.result
  }

  /**
   * Function to hide player controls.
   */
  hideLightningPlayerControls() {
    this.signal('hide')
  }

  /**
   * Timer function to track the inactivity of the player controls.
   */
  timer() {
    clearTimeout(timeout)
    timeout = setTimeout(this.hideLightningPlayerControls.bind(this), 5000)
  }

  /**
   * Function that defines the different states of the player controls.
   */
  static _states() {
    return [
      class PlayPause extends this {
        $enter() {
          this.focus = this.toggle
            ? Utils.asset('images/Media Player/Icon_Play_Orange_16k.png')
            : Utils.asset('images/Media Player/Icon_Pause_Orange_16k.png')
          this.timer()
          this.tag('Buttons')
            .children[1].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(this.focus, 50, 50)
            })
        }
        $exit() {
          this.unfocus = this.toggle
            ? Utils.asset('images/Media Player/Icon_Play_White_16k.png')
            : Utils.asset('images/Media Player/Icon_Pause_White_16k.png')
          this.tag('Buttons')
            .children[1].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(this.unfocus, 50, 50)
            })
        }
        _handleEnter() {
          if (this.toggle) {
            //this.fireAncestors('$play');
            this.signal('play')
          } else {
            //this.fireAncestors('$pause');
            this.signal('pause')
          }
          this.toggle = !this.toggle
          this.focus = this.toggle
            ? Utils.asset('images/Media Player/Icon_Play_Orange_16k.png')
            : Utils.asset('images/Media Player/Icon_Pause_Orange_16k.png')
          this.timer()
          this.tag('Buttons')
            .children[1].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(this.focus, 50, 50)
            })
        }
        _handleRight() {
          this._setState('Forward')
        }
        _handleLeft() {
          this._setState('Rewind')
        }
        _getFocused() {
          this.timer()
        }
      },

      class Forward extends this {
        $enter() {
          this.timer()
          this.tag('Buttons')
            .children[2].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(
                Utils.asset('images/Media Player/Icon_Next_Orange_16k.png'),
                50,
                50
              ),
            })
        }
        $exit() {
          this.tag('Buttons')
            .children[2].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(
                Utils.asset('images/Media Player/Icon_Next_White_16k.png'),
                50,
                50
              ),
            })
        }
        _handleRight() {
          // this._setState('Extras')
        }
        _handleLeft() {
          this._setState('PlayPause')
        }
        _handleEnter() {
          this.toggle = false
          this.signal('nextTrack')
        }
        _getFocused() {
          this.timer()
        }
      },

      class Rewind extends this {
        $enter() {
          this.timer()
          this.tag('Buttons')
            .children[0].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(
                Utils.asset('images/Media Player/Icon_Back_Orange_16k.png'),
                50,
                50
              ),
            })
        }
        $exit() {
          this.tag('Buttons')
            .children[0].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(
                Utils.asset('images/Media Player/Icon_Back_White_16k.png'),
                50,
                50
              ),
            })
        }
        _handleLeft() {
          // this._setState('AudioOptions')
        }
        _handleRight() {
          this._setState('PlayPause')
        }
        _handleEnter() {
          this.toggle = false
          this.signal('prevTrack')
        }
        _getFocused() {
          this.timer()
        }
      },
      class Hidden extends this {
        _getFocused() { }
      },
    ]
  }
}
