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
 * Variable to store the timer
 */
var timeout

/**
 * Class to render the UI controls for the video player.
 */
export default class PlayerControls extends Lightning.Component {
  /**
   * Function to create components for the player controls.
   */
  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 410,
      color: 0x4025262a,
      Title: {
        x: 90,
        y: 15,
      },
      Subtitle: {
        x: 90,
        y: 88.5,
      },
      NetworkLogo: {
        x: 1740,
        y: 82.5,
      },
      TimeBar: {
        x: 90,
        y: 163.5,
        texture: Lightning.Tools.getRoundRect(1740, 6, 6, 0, 0, true, 0x80eef1f3),
      },
      ProgressBar: {
        x: 90,
        y: 163.5,
      },
      CurrentTime: {
        x: 90,
        y: 184.5,
      },
      TotalTime: {
        x: 1680,
        y: 184.5,
      },
      Buttons: {
        x: 820,
        y: 240,
        children: [
          { src: Utils.asset('images/player/rewind.png'), x: 17, y: 17 },
          { src: Utils.asset('images/player/pause-focus.png'), x: 17, y: 17 },
          { src: Utils.asset('images/player/fast-forward.png'), x: 17, y: 17 },
        ].map((item, idx) => ({
          x: idx * 100,
          texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
          ControlIcon: {
            x: item.x,
            y: item.y,
            texture: Lightning.Tools.getSvgTexture(item.src, 50, 50),
          },
        })),
      },
      Audio: {
        x: 90,
        y: 240,
        texture: Lightning.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xff8e8e8e),
        AudioOptions: {
          x: 0,
          y: 25,
          w: 240,
          h: 90,
          text: {
            fontSize: 30,
            text: 'Audio Options',
            textColor: 0xffffffff,
            textAlign: 'center',
          },
        },
      },
      Extras: {
        x: 1700,
        y: 240,
        texture: Lightning.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xff8e8e8e),
        ExtrasOptions: {
          x: 0,
          y: 25,
          w: 130,
          h: 90,
          text: {
            fontSize: 30,
            text: 'Extras',
            textColor: 0xffffffff,
            textAlign: 'center',
          },
        },
      },
    }
  }

  _init() {
    /**
     * Variable to store the duration of the video content.
     */
    this.videoDuration = 0
    this.tag('Buttons').children[0].patch({
      alpha: 0.4
    })
    this.tag('Buttons').children[2].patch({
      alpha: 0.4
    })
    this.tag('Audio').patch({
      alpha: 0.4
    })
    this.tag('Extras').patch({
      alpha: 0.4
    })
  }

  /**
   * Function to set focus to player controls when the player controls are shown.
   */
  _focus() {
    this._index = 1
    this.toggle = false
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
   * Function to set the title in the video controls.
   * @param {String} title title to be displayed in video controls.
   */
  set title(title) {
    this.tag('Title').patch({
      text: {
        fontSize: 52.5,
        textAlign: 'center',
        text: title,
      },
    })
  }

  /**
   * Function to set the subtitle in the video control menu.
   * @param {String} subtitle sub title to be displayed.
   */
  set subtitle(subtitle) {
    this.tag('Subtitle').patch({
      text: {
        fontSize: 36,
        textAlign: 'center',
        text: subtitle,
      },
    })
  }

  /**
   * Function to set the network logo in the video control menu.
   * @param {String} logoPath path to the logo.
   */
  set logoPath(logoPath) {
    this.tag('NetworkLogo').patch({ src: logoPath })
  }

  /**
   * Function to set the duration of the video.
   * @param {String} duration video duration to be set.
   */
  set duration(duration) {
    this.videoDuration = duration
    this.tag('TotalTime').patch({
      text: {
        fontSize: 33,
        textAlign: 'center',
        text: this.SecondsTohhmmss(duration),
      },
    })
  }

  /**
   * Function to set the current video time.
   * @param {String} currentTime current time to be set.
   */
  set currentTime(currentTime) {
    this.tag('CurrentTime').patch({
      text: {
        fontSize: 33,
        textAlign: 'center',
        text: this.SecondsTohhmmss(currentTime),
      },
    })
    this.tag('ProgressBar').patch({
      texture: Lightning.Tools.getRoundRect(
        (1740 * currentTime) / this.videoDuration,
        6,
        6,
        0,
        0,
        true,
        0xffffffff
      ),
      SeekBar: {
        x: (1740 * currentTime) / this.videoDuration,
        y: -12,
        texture: Lightning.Tools.getRoundRect(30, 30, 15, 0, 0, true, 0xffffffff),
      },
    })
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
  hidePlayerControls() {
    this.signal('hide')
  }

  /**
   * Function to reset the player controls.
   */
  reset(state = 'play') {
    this._setState('PlayPause')
    if (state === 'pause' || state === 'stop') {
      this.tag('Buttons')
        .children[1].tag('ControlIcon')
        .patch({
          texture: Lightning.Tools.getSvgTexture(
            Utils.asset('images/player/play-focus.png'),
            50,
            50
          ),
          x: 17,
        })
      this.toggle = 1
      return
    }
    this.tag('Buttons')
      .children[1].tag('ControlIcon')
      .patch({
        texture: Lightning.Tools.getSvgTexture(
          Utils.asset('images/player/pause-focus.png'),
          50,
          50
        ),
        x: 17,
      })
    this.toggle = 0
  }

  /**
   * Timer function to track the inactivity of the player controls.
   */
  timer() {
    clearTimeout(timeout)
    timeout = setTimeout(this.hidePlayerControls.bind(this), 5000)
  }

  /**
   * Function that defines the different states of the player controls.
   */
  static _states() {
    return [
      class AudioOptions extends this {
        $enter() {
          this.timer()
          this.tag('Audio').patch({
            texture: Lightning.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xffffffff),
            scale: 1.1,
          })
          this.tag('Audio').tag('AudioOptions').color = 0xff000000
        }
        $exit() {
          this.tag('Audio').patch({
            texture: Lightning.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xff8e8e8e),
            scale: 1,
          })
          this.tag('Audio').tag('AudioOptions').color = 0xffffffff
        }
        _handleRight() {
          this._setState('Rewind')
        }
        _getFocused() {
          this.timer()
        }
      },

      class PlayPause extends this {
        $enter() {
          this.focus = this.toggle
            ? Utils.asset('images/player/play-focus.png')
            : Utils.asset('images/player/pause-focus.png')
          this.timer()
          this.tag('Buttons').children[1].patch({
            texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            scale: 1.1,
          })
          this.tag('Buttons')
            .children[1].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(this.focus, 50, 50)
            })
        }
        $exit() {
          this.unfocus = this.toggle
            ? Utils.asset('images/player/play.png')
            : Utils.asset('images/player/pause.png')
          this.tag('Buttons').children[1].patch({
            texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            scale: 1,
          })
          this.tag('Buttons')
            .children[1].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(this.unfocus, 50, 50)
            })
        }
        _handleEnter() {
          if (this.toggle) {
            this.signal('play')
          } else {
            this.signal('pause')
          }
          this.toggle = !this.toggle
          this.focus = this.toggle
            ? Utils.asset('images/player/play-focus.png')
            : Utils.asset('images/player/pause-focus.png')
          this.timer()
          this.tag('Buttons').children[1].patch({
            texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
          })
          this.tag('Buttons')
            .children[1].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(this.focus, 50, 50)
            })
        }
        _handleRight() {
          // this._setState('Forward')
        }
        _handleLeft() {
          // this._setState('Rewind')
        }
        _getFocused() {
          this.timer()
        }
      },

      class Forward extends this {
        $enter() {
          this.timer()
          this.tag('Buttons').children[2].patch({
            texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            scale: 1.1,
          })
          this.tag('Buttons')
            .children[2].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(
                Utils.asset('images/player/fast-forward-focus.png'),
                50,
                50
              ),
            })
        }
        $exit() {
          this.tag('Buttons').children[2].patch({
            texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            scale: 1,
          })
          this.tag('Buttons')
            .children[2].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(
                Utils.asset('images/player/fast-forward.png'),
                50,
                50
              ),
            })
        }
        _handleRight() {
          this._setState('Extras')
        }
        _handleLeft() {
          this._setState('PlayPause')
        }
        _handleEnter() {
          this.signal('fastfwd')
        }
        _getFocused() {
          this.timer()
        }
      },

      class Rewind extends this {
        $enter() {
          this.timer()
          this.tag('Buttons').children[0].patch({
            texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            scale: 1.1,
          })
          this.tag('Buttons')
            .children[0].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(
                Utils.asset('images/player/rewind-focus.png'),
                50,
                50
              ),
            })
        }
        $exit() {
          this.tag('Buttons').children[0].patch({
            texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            scale: 1,
          })
          this.tag('Buttons')
            .children[0].tag('ControlIcon')
            .patch({
              texture: Lightning.Tools.getSvgTexture(
                Utils.asset('images/player/rewind.png'),
                50,
                50
              ),
            })
        }
        _handleLeft() {
          this._setState('AudioOptions')
        }
        _handleRight() {
          this._setState('PlayPause')
        }
        _handleEnter() {
          this.signal('fastrwd')
        }
        _getFocused() {
          this.timer()
        }
      },

      class Extras extends this {
        $enter() {
          this.tag('Extras').patch({
            texture: Lightning.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xffffffff),
            scale: 1.1,
          })
          this.tag('Extras').tag('ExtrasOptions').color = 0xff000000
          this.timer()
        }
        _handleLeft() {
          this._setState('Forward')
        }
        _getFocused() {
          this.timer()
        }
        $exit() {
          this.tag('Extras').patch({
            texture: Lightning.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xff8e8e8e),
            scale: 1,
          })
          this.tag('Extras').tag('ExtrasOptions').color = 0xffffffff
        }
      },
      class Hidden extends this {
        _getFocused() { }
      },
    ]
  }
}
