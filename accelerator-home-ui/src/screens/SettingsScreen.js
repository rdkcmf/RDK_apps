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
import { Lightning, Utils, Language } from '@lightningjs/sdk'
import BluetoothScreen from './BluetoothScreen'
import WiFiScreen from './WifiScreen'
import { COLORS } from '../colors/Colors'
import SettingsMainItem from '../items/SettingsMainItem'
import { CONFIG } from '../Config/Config'
import SleepTimerScreen from './SleepTimerScreen'
import VideoScreen from './VideoAndAudioScreens/VideoScreen'
import AudioScreen from './VideoAndAudioScreens/AudioScreen'
import OtherSettingsScreen from './OtherSettingsScreens/OtherSettingsScreen'

/**
 * Class for settings screen.
 */

export default class SettingsScreen extends Lightning.Component {
  static _template() {
    return {
      x: 280,
      y: 286,
      SleepTimer: {
        y: 0,
        type: SettingsMainItem,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'Sleep Timer: Off',
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          }
        },
        Button: {
          h: 45,
          w: 45,
          x: 1535,
          mountX: 1,
          y: 45,
          mountY: 0.5,
          src: Utils.asset('images/settings/Arrow.png'),
        },
      },
      WiFi: {
        y: 90,
        type: SettingsMainItem,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'WiFi',
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          }
        },
        Button: {
          h: 45,
          w: 45,
          x: 1535,
          mountX: 1,
          y: 45,
          mountY: 0.5,
          src: Utils.asset('images/settings/Arrow.png'),
        },
      },
      Bluetooth: {
        y: 180,
        type: SettingsMainItem,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'Pair Remote Control',
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          }
        },
        Button: {
          h: 45,
          w: 45,
          x: 1535,
          mountX: 1,
          y: 45,
          mountY: 0.5,
          src: Utils.asset('images/settings/Arrow.png'),
        },
      },
      Video: {
        y: 270,
        type: SettingsMainItem,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'Video',
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          }
        },
        Button: {
          h: 45,
          w: 45,
          x: 1535,
          mountX: 1,
          y: 45,
          mountY: 0.5,
          src: Utils.asset('images/settings/Arrow.png'),
        },
      },
      Audio: {
        y: 360,
        type: SettingsMainItem,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'Audio',
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          }
        },
        Button: {
          h: 45,
          w: 45,
          x: 1535,
          mountX: 1,
          y: 45,
          mountY: 0.5,
          src: Utils.asset('images/settings/Arrow.png'),
        },
      },
      // OtherSettings: {
      //   y: 450,
      //   type: SettingsMainItem,
      //   Title: {
      //     x: 10,
      //     y: 45,
      //     mountY: 0.5,
      //     text: {
      //       text: 'Other Settings',
      //       textColor: COLORS.titleColor,
      //       fontFace: CONFIG.language.font,
      //       fontSize: 25,
      //     }
      //   },
      //   Button: {
      //     h: 45,
      //     w: 45,
      //     x: 1535,
      //     mountX: 1,
      //     y: 45,
      //     mountY: 0.5,
      //     src: Utils.asset('images/settings/Arrow.png'),
      //   },
      // },
      WiFiScreen: {
        type: WiFiScreen,
        visible: false,
      },
      BluetoothScreen: {
        type: BluetoothScreen,
        visible: false,
      },
      VideoScreen: {
        type: VideoScreen,
        visible: false,
      },
      AudioScreen: {
        type: AudioScreen,
        visible: false,
      },
      SleepTimerScreen: {
        type: SleepTimerScreen,
        visible: false
      },
      OtherSettingsScreen: {
        type: OtherSettingsScreen,
        visible: false,
      }

    }
  }

  _init() {
    this._setState('SleepTimer')
  }

  hide() {
    this.tag('WiFi').patch({ alpha: 0 });
    this.tag('Bluetooth').patch({ alpha: 0 });
    this.tag('Video').patch({ alpha: 0 });
    this.tag('Audio').patch({ alpha: 0 });
    this.tag('SleepTimer').patch({ alpha: 0 });
    this.tag('OtherSettings').patch({ alpha: 0 });
  }

  show() {
    this.tag('WiFi').patch({ alpha: 1 });
    this.tag('Bluetooth').patch({ alpha: 1 });
    this.tag('Audio').patch({ alpha: 1 });
    this.tag('Video').patch({ alpha: 1 });
    this.tag('SleepTimer').patch({ alpha: 1 });
    this.tag('OtherSettings').patch({ alpha: 1 });
  }

  home() {
    this.fireAncestors('$changeHomeText', Language.translate('home'))
    this.fireAncestors('$goToSidePanel', 0)
  }

  $sleepTimerText(text) {
    this.tag('SleepTimer.Title').text.text = 'Sleep Timer: ' + text
  }

  static _states() {
    return [
      class SleepTimer extends this{
        $enter() {
          this.tag('SleepTimer')._focus()
        }
        $exit() {
          this.tag('SleepTimer')._unfocus()
        }
        _handleDown() {
          this._setState('WiFi')
        }
        _handleEnter() {
          this._setState('SleepTimerScreen')
          this.hide()
        }
        _handleBack() {
          this.home()
        }
      },
      class WiFi extends this {
        $enter() {
          this.tag('WiFi')._focus()
        }
        $exit() {
          console.log('Botton exit')
          this.tag('WiFi')._unfocus()
        }
        _handleUp() {
          this._setState('SleepTimer')
        }
        _handleDown() {
          this._setState('Bluetooth')
        }
        _handleEnter() {
          this._setState('WiFiScreen')
          this.hide()
        }
        _handleBack() {
          this.home()
        }
      },
      class Bluetooth extends this {
        $enter() {
          console.log('Button enter')
          this.tag('Bluetooth')._focus()
        }
        $exit() {
          console.log('Botton exit')
          this.tag('Bluetooth')._unfocus()
        }
        _handleUp() {
          this._setState('WiFi')
        }
        _handleDown() {
          this._setState('Video')
        }
        _handleLeft() {
        }
        _handleEnter() {
          this._setState('BluetoothScreen')
          this.hide()
        }
        _handleBack() {
          this.home()
        }
      },

      class Video extends this{
        $enter() {
          this.tag('Video')._focus()
        }
        $exit() {
          this.tag('Video')._unfocus()
        }
        _handleUp() {
          this._setState('Bluetooth')
        }
        _handleDown() {
          this._setState('Audio')
        }
        _handleEnter() {
          this._setState('VideoScreen')
          this.hide()
        }
        _handleBack() {
          this.home()
        }

      },

      class Audio extends this{
        $enter() {
          this.tag('Audio')._focus()
        }
        $exit() {
          this.tag('Audio')._unfocus()
        }
        _handleUp() {
          this._setState('Video')
        }
        _handleEnter() {
          this._setState('AudioScreen')
          this.hide()
        }
        _handleDown() {
          //this._setState('OtherSettings')
        }
        _handleBack() {
          this.home()
        }

      },

      class OtherSettings extends this{
        $enter() {
          this.tag('OtherSettings')._focus()
        }
        $exit() {
          this.tag('OtherSettings')._unfocus()
        }
        _handleUp() {
          this._setState('Audio')
        }
        _handleEnter() {
          this._setState('OtherSettingsScreen')
          this.hide()
        }
        _handleBack() {
          this.home()
        }

      },

      class SleepTimerScreen extends this{
        $enter() {
          this.tag('SleepTimerScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Sleep Timer')
        }
        _getFocused() {
          return this.tag('SleepTimerScreen')
        }
        $exit() {
          this.tag('SleepTimerScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('SleepTimer')
          this.show()
        }
      },
      class BluetoothScreen extends this {
        $enter() {
          this.tag('BluetoothScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Pair Remote Control')
        }
        _getFocused() {
          return this.tag('BluetoothScreen')
        }
        $exit() {
          this.tag('BluetoothScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('Bluetooth')
          this.show()
        }
      },
      class WiFiScreen extends this {
        $enter() {
          this.tag('WiFiScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / WiFi')
        }
        _getFocused() {
          return this.tag('WiFiScreen')
        }
        $exit() {
          this.tag('WiFiScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('WiFi')
          this.show()
        }
      },

      class VideoScreen extends this {
        $enter() {
          this.tag('VideoScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Video')
        }
        _getFocused() {
          return this.tag('VideoScreen')
        }
        $exit() {
          this.tag('VideoScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('Video')
          this.show()
        }
      },

      class AudioScreen extends this {
        $enter() {
          this.tag('AudioScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Audio')
        }
        _getFocused() {
          return this.tag('AudioScreen')
        }
        $exit() {
          this.tag('AudioScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('Audio')
          this.show()
        }
      },
      class OtherSettingsScreen extends this {
        $enter() {
          this.tag('OtherSettingsScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings')
        }
        _getFocused() {
          return this.tag('OtherSettingsScreen')
        }
        $exit() {
          this.tag('OtherSettingsScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('OtherSettings')
          this.show()
        }
      },
    ]
  }
}
