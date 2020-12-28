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
import { Lightning, Utils, Router, Storage } from '@lightningjs/sdk'
import BluetoothScreen from './BluetoothScreen'
import WiFiScreen from './WifiScreen'

/**
 * Class for settings screen.
 */

export default class SettingsScreen extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset('images/tvShows/background.jpg'),
      },
      Sidebar: {
        x: 1920 - 1920 / 3,
        y: 0,
        w: 1920 / 3,
        h: 1080,
        rect: true,
        color: 0xff364651,
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

  //   /**
  //  * Function to be excuted when the Bluetooth screen is enabled.
  //  */
  _enable() {
    this._appAnimation = this.animation({
      duration: 0.3,
      repeat: 0,
      stopMethod: 'immediate',
      actions: [
        { p: 'alpha', v: { 0: 0.5, 1: 1 } },
        { p: 'y', v: { 0: 1080, 1: 0 } },
      ],
    })
    this._appAnimation.start()
  }

  // /**
  //  * Function to be executed when the Bluetooth screen is disabled from the screen.
  //  */
  _disable() {
    this._appAnimation = this.animation({
      duration: 0.3,
      repeat: 0,
      stopMethod: 'immediate',
      actions: [
        { p: 'alpha', v: { 0: 0.5, 1: 1 } },
        { p: 'y', v: { 0: 0, 1: 1080 } },
      ],
    })
    this._appAnimation.start()
  }

  set screen(screen) {
    this._setState(screen)
  }

  set params(args) {
    if (args.animation != undefined) {
      args.animation.start()
    }
  }

  static _states() {
    return [
      class BluetoothScreen extends this {
        $enter() {
          this.tag('BluetoothScreen').visible = true
        }
        _getFocused() {
          return this.tag('BluetoothScreen')
        }
        $exit() {
          this.tag('BluetoothScreen').visible = false
        }
        _handleKey(key) {
          const config = {
            host: '127.0.0.1',
            port: 9998,
            default: 1,
          }
          if (
            (Storage.get('applicationType')=='') &&
            (key.keyCode == 77 ||
            key.keyCode == 49 ||
            key.keyCode == 36 ||
            key.keyCode == 158 ||
            key.keyCode == 27 ||
            (key.keyCode == 73 && key.ctrlKey == true))
          ) {
            this._appAnimation = this.animation({
              duration: 0.5,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [
                { p: 'alpha', v: { 0: 0.5, 1: 1 } },
                { p: 'y', v: { 0: 0, 1: 1080 } },
              ],
            })
            this._appAnimation.start()
            this._appAnimation.on('finish', p => {
              Router.navigate('home')
            })
          } else return false;
        }
      },
      class WiFiScreen extends this {
        $enter() {
          this.tag('WiFiScreen').visible = true
        }
        _getFocused() {
          return this.tag('WiFiScreen')
        }
        $exit() {
          this.tag('WiFiScreen').visible = false
        }
        _handleKey(key) {
          const config = {
            host: '127.0.0.1',
            port: 9998,
            default: 1,
          }
          if (
            (Storage.get('applicationType')=='') &&
            (key.keyCode == 77 ||
            key.keyCode == 49 ||
            key.keyCode == 36 ||
            key.keyCode == 158 ||
            key.keyCode == 27 ||
            (key.keyCode == 73 && key.ctrlKey == true))
          ) {
            this._appAnimation = this.animation({
              duration: 0.3,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [
                { p: 'alpha', v: { 0: 0.5, 1: 1 } },
                { p: 'y', v: { 0: 0, 1: 1080 } },
              ],
            })
            this._appAnimation.start()
            this._appAnimation.on('finish', p => {
              Router.navigate('home')
            })
          } else return false;
        }
      },
    ]
  }
}
