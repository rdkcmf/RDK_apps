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
import NetworkConfigurationScreen from './OtherSettingsScreens/NetworkConfigurationScreen'

/**
 * Class for settings screen.
 */

export default class SettingsScreen extends Lightning.Component {
  static _template() {
    return {
      x: 200,
      y: 286,
      SettingsScreenContents:{
        NetworkConfiguration: {
          y: 0,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Network Configuration',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        Bluetooth: {
          y: 90,
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
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        Video: {
          y: 180,
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
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        Audio: {
          y: 270,
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
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        OtherSettings: {
          y: 360,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Other Settings',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
      },
      NetworkConfigurationScreen: {
        type: NetworkConfigurationScreen,
        visible: false
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
      OtherSettingsScreen: {
        type: OtherSettingsScreen,
        visible: false,
      }

    }
  }

  _focus() {
    this._setState('NetworkConfiguration')
  }

  hide() {
    this.tag('SettingsScreenContents').visible = false
}

show() {
    this.tag('SettingsScreenContents').visible = true
}


  home() {
    this.fireAncestors('$changeHomeText', Language.translate('home'))
    this.fireAncestors('$goToSidePanel', 0)
  }

  static _states() {
    return [
      class NetworkConfiguration extends this{
        $enter() {
          this.tag('NetworkConfiguration')._focus()
        }
        $exit() {
          this.tag('NetworkConfiguration')._unfocus()
        }
        _handleDown() {
          this._setState('Bluetooth')
        }
        _handleEnter() {
          this._setState('NetworkConfigurationScreen')
        }
        _handleBack() {
          this.home()
        }
      },
      class Bluetooth extends this {
        $enter() {
          this.tag('Bluetooth')._focus()
        }
        $exit() {
          this.tag('Bluetooth')._unfocus()
        }
        _handleUp() {
          this._setState('NetworkConfiguration')
        }
        _handleDown() {
          this._setState('Video')
        }
        _handleLeft() {
        }
        _handleEnter() {
          this._setState('BluetoothScreen')
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
        }
        _handleDown() {
          this._setState('OtherSettings')
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
        }
        _handleBack() {
          this.home()
        }

      },
      class NetworkConfigurationScreen extends this{
        $enter() {
          this.hide()
          this.tag('NetworkConfigurationScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration')
        }
        _getFocused() {
          return this.tag('NetworkConfigurationScreen')
        }
        $exit() {
          this.show()
          this.tag('NetworkConfigurationScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('NetworkConfiguration')
        }
      },
      class BluetoothScreen extends this {
        $enter() {
          this.hide()
          this.tag('BluetoothScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Pair Remote Control')
        }
        _getFocused() {
          return this.tag('BluetoothScreen')
        }
        $exit() {
          this.show()
          this.tag('BluetoothScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('Bluetooth')
        }
      },

      class VideoScreen extends this {
        $enter() {
          this.hide()
          this.tag('VideoScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Video')
        }
        _getFocused() {
          return this.tag('VideoScreen')
        }
        $exit() {
          this.show()
          this.tag('VideoScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('Video')
        }
      },

      class AudioScreen extends this {
        $enter() {
          this.hide()
          this.tag('AudioScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Audio')
        }
        _getFocused() {
          return this.tag('AudioScreen')
        }
        $exit() {
          this.show()
          this.tag('AudioScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('Audio')
        }
      },
      class OtherSettingsScreen extends this {
        $enter() {
          this.hide()
          this.tag('OtherSettingsScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings')
        }
        _getFocused() {
          return this.tag('OtherSettingsScreen')
        }
        $exit() {
          this.show()
          this.tag('OtherSettingsScreen').visible = false
          this.fireAncestors('$changeHomeText', 'Settings')
        }
        _handleBack() {
          this._setState('OtherSettings')
        }
      },
    ]
  }
}
