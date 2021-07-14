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
import SideSettingScreen from './SideSettingScreen'
import UsbFolders from './UsbScreens/UsbFolders'
import NetworkApi from '../api/NetworkApi'

/**
 * Class for settings screen.
 */

export default class SettingsScreen extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset('images/tvShows/background_new.jpg'),
      },
      SettingsTopPanel: {
        x: 0,
        y: 0,
        w: 1920,
        h: 171,
        Back: {
          x: 81,
          y: 100,
          mountY: 0.5,
          src: Utils.asset('/images/settings/Back_icon.png'),
          w: 70,
          h: 70,
        },
        IconTitle: {
          x: 200,
          y: 78,
          text: { text: 'Settings', fontSize: 40 },
        },
        IpAddress: {
          x: 1835,
          y: 125,
          mount: 1,
          text: {
            text: 'IP:N/A',
            textColor: 0xffffffff,
            fontSize: 32,
            w: 360,
            h: 40,
          },
        },
        Border: {
          x: 81,
          y: 171,
          mountY: 0.5,
          RoundRectangle: {
            zIndex: 2,
            texture: lng.Tools.getRoundRect(1761, 0, 0, 3, 0xffffffff, true, 0xffffffff),
          },
          alpha: 0.4
        }
      },

      SideMenubar: {
        type: SideSettingScreen,
        rect: true,
        color: 0xff364651,
        visible: true
      },
      WiFiScreen: {
        type: WiFiScreen,
        visible: true,
      },
      BluetoothScreen: {
        type: BluetoothScreen,
        visible: true,
      },
      UsbFolders: {
        type: UsbFolders,
        visible: true,
      },
      HBorder: {
        x: 760,
        y: 220,
        mountY: 0.5,
        RoundRectangle: {
          zIndex: 2,
          texture: lng.Tools.getRoundRect(0, 809, 0, 3, 0xffffffff, true, 0xffffffff),
        },
        alpha: 0.4
      }
    }
  }

  _init() {
    var networkApi = new NetworkApi()
    networkApi.getIP().then(ip => {
      this.tag('IpAddress').text.text = 'IP:' + ip
    })
  }
  _active() {
    this._setState('SideMenubar')
    this.tag('SideMenubar').index = this.sideMenubarIndex
  }

  set screen(screen) {
    this._setState(screen)
  }

  set id(id) {
    this.sideMenubarIndex = parseInt(id)
  }

  set params(args) {
    if (args.animation != undefined) {
      args.animation.start()
    }
  }

  /**
   * Fireancestor to set the state to side panel.
   * @param {index} index index value of side panel item.
   */
  $goToSettingsTopPanel() {
    this._setState('Back')
  }

  $goToBluetoothScreen(index) {
    this._setState('BluetoothScreen')
  }
  $goToWiFiScreen(index) {
    this._setState('WiFiScreen')
  }
  $goToUsbFolders(index) {
    this._setState('UsbFolders')
  }

  $goToSideMenubar(index) {
    this.tag('SideMenubar').index = index
    this._setState('SideMenubar')
  }

  $setVisibleSetting(index) {
    if (index == 0) {
      this.tag('BluetoothScreen').alpha = 1
      this.tag('WiFiScreen').alpha = 0
      this.tag('UsbFolders').alpha = 0
    }
    else if (index == 1) {
      this.tag('BluetoothScreen').alpha = 0
      this.tag('WiFiScreen').alpha = 1
      this.tag('UsbFolders').alpha = 0

    } else if (index == 2) {
      this.tag('BluetoothScreen').alpha = 0
      this.tag('WiFiScreen').alpha = 0
      this.tag('UsbFolders').alpha = 1
    }
  }

  static _states() {
    return [
      class SideMenubar extends this{
        _getFocused() {
          return this.tag('SideMenubar')
        }
      },
      class Back extends this{
        $enter() {
          this.tag('Back').patch({
            src: Utils.asset('/images/settings/back-arrow-small.png'),
          })
        }
        _handleDown() {
          this.tag('Back').patch({
            src: Utils.asset('/images/settings/Back_icon.png'),
          })
          this._setState('SideMenubar')
        }
        _handleKey(key) {
          if (key.keyCode == 13) {
            this.tag('Back').patch({
              src: Utils.asset('/images/settings/Back_icon.png'),
            })
            Router.navigate('/home', false)
          }
        }
      },
      class BluetoothScreen extends this {
        $enter() {
          this.tag('BluetoothScreen').visible = true
        }
        _getFocused() {
          return this.tag('BluetoothScreen')
        }
        $exit() {
          // this.tag('BluetoothScreen').visible = false
        }
        _handleKey(key) {
          const config = {
            host: '127.0.0.1',
            port: 9998,
            default: 1,
          }
          if (
            (Storage.get('applicationType') == '') &&
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
      class UsbFolders extends this {
        $enter() {
          this.tag('UsbFolders').visible = true
        }
        _getFocused() {
          return this.tag('UsbFolders')
        }
        $exit() {
          // this.tag('UsbFolders').visible = false
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
          // this.tag('WiFiScreen').visible = false
        }
        _handleKey(key) {
          const config = {
            host: '127.0.0.1',
            port: 9998,
            default: 1,
          }
          if (
            (Storage.get('applicationType') == '') &&
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
