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
import { Lightning, Router } from '@lightningjs/sdk'
import { CONFIG } from '../Config/Config'
import ConfirmAndCancel from '../items/ConfirmAndCancel'
import PasswordSwitch from './PasswordSwitch'
import { Keyboard } from '../ui-components/index'
import { KEYBOARD_FORMATS } from '../ui-components/components/Keyboard'
import WifiApi from '../api/WifiApi'

export default class WifiPairingScreen extends Lightning.Component {

  pageTransition() {
    return 'left'
  }


  static _template() {
    return {
      w: 1920,
      h: 1080,
      rect: true,
      color: 0xCC000000,
      PairingScreen: {
        Title: {
          x: 960,
          y: 95,
          mountX: 0.5,
          zIndex: 2,
          text: { text: '', fontSize: 40, textColor: CONFIG.theme.hex },
        },
        RectangleWithColor: {
          x: 180, y: 164, w: 1515, h: 2, rect: true, color: 0xFFFFFFFF, zIndex: 2
        },
        PasswordLabel: {
          x: 180,
          y: 240,
          w: 300,
          h: 75,
          zIndex: 2,
          text: { text: 'Password: ', fontSize: 25, fontFace: CONFIG.language.font, textColor: 0xffffffff, textAlign: 'left' },
        },
        Pwd: {
          x: 437,
          y: 240,
          zIndex: 2,
          text: {
            text: '',
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 0xffffffff,
            wordWrapWidth: 1000,
            wordWrap: false,
            textOverflow: 'ellipsis',
          },
        },
        PasswordBox: {
          x: 417,
          y: 208,
          zIndex: 2,
          texture: Lightning.Tools.getRoundRect(1279, 88, 0, 3, 0xffffffff, false)
        },

        PasswrdSwitch: {
          h: 45,
          w: 66.9,
          x: 1656,
          y: 255,
          zIndex: 2,
          type: PasswordSwitch,
          mount: 0.5,
        },
        ShowPassword: {
          x: 1398,
          y: 240,
          w: 300,
          h: 75,
          zIndex: 2,
          text: { text: 'Show Password', fontSize: 25, fontFace: CONFIG.language.font, textColor: 0xffffffff, textAlign: 'left' },
        },
        List: {
          x: 417,
          y: 331,
          type: Lightning.components.ListComponent,
          w: 1080,
          h: 400,
          itemSize: 28,
          horizontal: true,
          invertDirection: false,
          roll: true,
          zIndex: 2
        },
        RectangleWithColor2: {
          x: 180, y: 451, w: 1515, h: 2, rect: true, color: 0xFFFFFFFF, zIndex: 2
        },
        KeyBoard: {
          y: 501,
          x: 420,
          type: Keyboard,
          visible: true,
          zIndex: 2,
          formats: KEYBOARD_FORMATS.qwerty
        }
      },


    }
  }

  _updateText(txt) {
    this.tag("Pwd").text.text = txt;
  }
  _handleBack() {
    Router.back()
  }

  /**
   * @param {{ item: Wifi Response Object; }} args
   */
  set params(args) {
    if (args.wifiItem) {
      this.item(args.wifiItem)
    } else {
      Router.navigate('settings/network/interface/wifi')
    }

  }

  item(item) {
    this.star = "";
    this.passwd = "";
    this.tag("Pwd").text.text = ""
    this.tag('Title').text = item.ssid
    var options = []
    this._item = item
    if (item.connected) {
      options = ['Disconnect', 'Cancel']
    } else {
      options = ['Connect', 'Cancel']
    }

    this.tag('List').items = options.map((item, index) => {
      return {
        ref: item,
        x: index === 0 ? 0 : 325 * index,
        w: 325,
        h: 85,
        type: ConfirmAndCancel,
        item: item,
      }
    })
    this._setState('Pair')
  }

  _focus() {
    this.hidePasswd = true;
    this._setState('Pair')
  }
  _unfocus() {

  }

  _init() {
    this.star = "";
    this.passwd = "";
    this.isOn = false;
    this._wifi = new WifiApi()
  }

  pressEnter(option) {
    if (option === 'Cancel') {
      Router.back()
    } else if (option === 'Connect') {
      if (this._item) {
        console.log('trying to connect wifi')
        this._wifi
          .connect(this._item, '')
          .then(() => { })
          .catch(err => {
            console.log('Not able to connect to wifi', JSON.stringify(err))
          })
      }
      Router.back()
    } else if (option === 'Disconnect') {
      this._wifi.disconnect().then(() => {
        Router.back()
      })
    }
  }

  // startConnect(password) {
  //   this._wifi.connect(this._item, password).then(() => {
  //     Router.back()
  //   })

  // }
  startConnect(password) {
    this._wifi.connect(this._item, password).then(() => {
      this._wifi.saveSSID(this._item.ssid, password, this._item.security).then((response) => {
        if (response.result === 0 && response.success === true) {
          this._wifi.SaveSSIDKey(this._item.ssid).then((persistenceResponse)=>{console.log(persistenceResponse)})
          // console.log(response);
        }
        else if (response.result !== 0) {
          this._wifi.clearSSID().then((response) => {
            // console.log(response)
          })
        }
      })
      Router.back()
    })

  }

  static _states() {
    return [
      class Password extends this {
        $enter() {
          this.shifter = false;
          this.capsLock = false;
        }

        _getFocused() {
          return this.tag("KeyBoard")
        }

        $onSoftKey({ key }) {
          if (key === 'Done') {
            this.startConnect(this.passwd)
          } else if (key === 'Clear') {
            this.passwd = this.passwd.substring(0, this.passwd.length - 1);
            this.star = this.star.substring(0, this.star.length - 1);
            this._updateText(this.hidePasswd ? this.star : this.passwd)
          } else if (key === '#@!' || key === 'abc' || key === 'áöû' || key === 'shift') {
            console.log('no saving')
          } else if (key === 'Space') {
            this.star += '\u25CF'
            this.passwd += ' '
            this._updateText(this.hidePasswd ? this.star : this.passwd)
          } else if (key === 'Delete') {
            this.star = ''
            this.passwd = ''
            this._updateText(this.hidePasswd ? this.star : this.passwd)
          } else {
            this.star += '\u25CF';
            this.passwd += key
            this._updateText(this.hidePasswd ? this.star : this.passwd)
          }

        }
        _handleUp() {
          this._setState("Pair")
        }
      },
      class Pair extends this {
        $enter() { }
        _getFocused() {
          return this.tag('List').element
        }
        _handleRight() {
          this.tag('List').setNext()
        }
        _handleLeft() {
          this.tag('List').setPrevious()
        }
        _handleUp() {
          this._setState("PasswordSwitchState");
        }
        _handleDown() {
          this._setState("Password");
        }
        _handleEnter() {
          if (this.tag('List').element.ref == 'Connect' && this._item.security != 0) {
            if (this.star === '') {
              this._setState('Password')
            } else {
              this.startConnect(this.passwd)
            }
          } else {
            this.pressEnter(this.tag('List').element.ref)
          }
        }

      },
      class PasswordSwitchState extends this{
        $enter() {
          this.tag("PasswordBox").texture = Lightning.Tools.getRoundRect(1279, 88, 0, 3, CONFIG.theme.hex, false)
        }
        _handleDown() {
          this._setState("Pair");
        }
        _getFocused() {
          return this.tag('PasswrdSwitch');
        }

        $handleEnter(bool) {
          if (bool) {
            this._updateText(this.passwd)
            this.hidePasswd = false;
          }
          else {
            this._updateText(this.star);
            this.hidePasswd = true;
          }
          this.isOn = bool;
        }

        $exit() {
          this.tag("PasswordBox").texture = Lightning.Tools.getRoundRect(1279, 88, 0, 3, 0xffffffff, false)
        }
      }
    ]
  }
}
