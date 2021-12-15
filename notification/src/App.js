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
import AppApi from './appApi'
import keyMap from './key'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Play/Play-Regular.ttf') }]
  }

  static _template() {
    return {
      Overlay: {
        zIndex: 1,
        x: 0,
        y: 0,
        Back: {
          h: 290,
          w: 1920,
          rect: true,
          color: 0xff000000,
          alpha: 0.6,
        },
        Line: {
          alpha: 1,
          y: 288,
          h: 3,
          w: 1920,
          rect: true,
          color: 0xffffffff,
        },
      },
      VolumeInfo: {
        zIndex: 2,
        y: 145,
        x: 960,
        mountX: 0.5,
        mountY: 0.5,
        h: 100,
        w: 100,
        src: Utils.asset('/images/Volume.png'),
        Text: {
          x: 100,
          y: 0,
          text: {
            text: '',
            fontSize: 80,
            fontFace: 'Regular',
          },
        },
      },
    }
  }

  updateVolume(vol) {
    this.tag('Text').text.text = vol
  }

  updateIcon(flag) {
    if (flag) {
      this.tag('VolumeInfo').src = Utils.asset('images/Volume_Mute.png')
    } else {
      this.tag('VolumeInfo').src = Utils.asset('images/Volume.png')
    }
  }

  _init() {
    this.mute = false
    this.volume = 0
    this.appApi = new AppApi()
  }

  _focus() {
    this.appApi.getConnectedAudioPorts().then(res => {
      this.appApi.getVolumeLevel(res.connectedAudioPorts[0]).then(res1 => {
        this.appApi.muteStatus(res.connectedAudioPorts[0]).then(result => {
          this.mute = result.muted
        })
        if (res1) {
          this.volume = parseInt(res1.volumeLevel)
          this.updateVolume(this.volume)
        }
      })
    })
  }

  _getFocused() {
    this._setState('Control')
  }

  static _states() {
    return [
      class Control extends this {
        _handleKey(key) {
          if (key.keyCode === keyMap.AudioVolumeUp) {
            if (this.timeout) {
              clearTimeout(this.timeout)
            }

            if (this.volume < 100) {
              this.volume += 10
              this.appApi.setVolumeLevel('HDMI0', this.volume)
              this.updateVolume(this.volume)
              this.timeout = setTimeout(() => {
                this.appApi.setVisibility('foreground', false)
              }, 1000)
            }
          }
          if (key.keyCode === keyMap.AudioVolumeDown) {
            if (this.timeout) {
              clearTimeout(this.timeout)
            }
            if (this.volume > 0) {
              this.volume -= 10
              this.appApi.setVolumeLevel('HDMI0', this.volume)
              this.updateVolume(this.volume)
              this.timeout = setTimeout(() => {
                this.appApi.setVisibility('foreground', false)
              }, 1000)
            }
          }
          if (key.keyCode === keyMap.AudioVolumeMute) {
            if (this.timeout) {
              clearTimeout(this.timeout)
            }
            this.appApi.audio_mute('HDMI0', !this.mute).then(res => {
              if (res.success) {
                this.mute = !this.mute
                this.updateIcon(this.mute)
              }
            })
            this.timeout = setTimeout(() => {
              this.appApi.setVisibility('foreground', false)
            }, 1000)
          }
        }
      },
    ]
  }
}
