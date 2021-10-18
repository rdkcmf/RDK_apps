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

/**
 * Class for settings screen.
 */

export default class SettingsScreen extends Lightning.Component {
  static _template() {
    return {
      x: 280,
      y: 286,
      WiFi: {
        y: 0,
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
        y: 90,
        type: SettingsMainItem,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'Bluetooth',
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
      WiFiScreen: {
        type: WiFiScreen,
        visible: false,
      },
      BluetoothScreen: {
        type: BluetoothScreen,
        visible: false,
      },
    }
  }

  _init() {
    this._setState('WiFi')
  }

  hide() {
    this.tag('WiFi').patch({ alpha: 0 });
    this.tag('Bluetooth').patch({ alpha: 0 });
  }

  show() {
    this.tag('WiFi').patch({ alpha: 1 });
    this.tag('Bluetooth').patch({ alpha: 1 });
  }

  home() {
    this.fireAncestors('$changeHomeText', Language.translate('home'))
    this.fireAncestors('$goToSidePanel', 0)
  }

  static _states() {
    return [
      class WiFi extends this {
        $enter() {
          this.tag('WiFi')._focus()
        }
        $exit() {
          console.log('Botton exit')
          this.tag('WiFi')._unfocus()
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
        _handleEnter() {
          this._setState('BluetoothScreen')
          this.hide()
        }
        _handleBack() {
          this.home()
        }
      },


      class BluetoothScreen extends this {
        $enter() {
          this.tag('BluetoothScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Bluetooth')
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
    ]
  }
}
