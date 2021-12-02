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
import { Lightning } from '@lightningjs/sdk'
import { CONFIG } from '../Config/Config'
import ConfirmAndCancel from '../items/ConfirmAndCancel'
import PasswordSwitch from './PasswordSwitch'
import { Keyboard } from '../ui-components/index'
import { KEYBOARD_FORMATS } from '../ui-components/components/Keyboard'
export default class BluetoothPairingScreen extends Lightning.Component {
  static _template() {
    return {

      PairingScreen: {
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        zIndex: 1,
        rect: true,
        color: 0xff000000,
      },
      Title: {
        x: w => w / 2,
        y: 95,
        mountX: 0.5,
        zIndex: 2,
        text: { text: '', fontSize: 40, textColor: CONFIG.theme.hex },
      },
      RectangleWithColor: {
        x: w => w / 2, mountX: 0.5, y: 164, w: 1550, h: 2, rect: true, color: 0xFFFFFFFF, zIndex: 2
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
        LeftBorder: {
          rect: true,
          x: 0, y: 0,
          w: 3,
          h: 88,
          mountX: 0,
          color: 0xffffffff,
        },
        RightBorder: {
          rect: true,
          x: 0 + 1321, y: 0,
          w: 3,
          h: 88,
          mountX: 1,
          color: 0xffffffff,
        },
        TopBorder: {
          rect: true,
          x: 0, y: 0,
          w: 1321,
          h: 3,
          mountY: 0.5,
          color: 0xffffffff,
        },
        BottomBorder: {
          rect: true,
          x: 0, y: 0 + 88,
          w: 1321,
          h: 3,
          mountY: 0.5,
          color: 0xffffffff,
        }
      },

      PasswrdSwitch: {
        h: 45,
        w: 66.9,
        x: 1920 - 222,
        y: 255,
        zIndex: 2,
        type: PasswordSwitch,
        mount: 0.5,
      },
      ShowPassword: {
        x: 1920 - 480,
        y: 240,
        w: 300,
        h: 75,
        zIndex: 2,
        text: { text: 'Show Password', fontSize: 25, fontFace: CONFIG.language.font, textColor: 0xffffffff, textAlign: 'left' },
      },
      List: {
        x: 417,
        y: 316,
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
        x: w => 1920 / 2, mountX: 0.5, y: 451, w: 1550, h: 2, rect: true, color: 0xFFFFFFFF, zIndex: 2
      },
      KeyBoard: {
        y: 501,
        x: 420,
        // mountX:0.5,
        // w:1080,
        type: Keyboard,
        visible: true,
        zIndex: 2,
        // formats: {
        //   qwerty: [
        //     ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', { label: 'backspace', size: 'large' }],
        //     [{ label: 'tab', size: 'large' }, 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        //     [{ label: 'caps', size: 'medium', w: 170 }, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', { label: '< enter', size: 'medium', w: 170 }],
        //     [{ label: 'shift', size: 'large' }, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', { label: 'shift', size: 'large', w: 195 }],
        //     [{ label: '.com', size: 'medium', w: 170 }, '@', { label: ' ', size: 'xlarge', w: 850 }]
        //   ]
        // }, 
        formats: KEYBOARD_FORMATS.qwerty
      }

    }
  }

  _updateText(txt) {

    this.tag("Pwd").text.text = txt;


  }
  _handleBack() {
    this.patch({ visible: false })
    this.fireAncestors("$goToWifiSwitch");
  }

  set item(item) {
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
        x: index === 0 ? 0 : 0 + 325 * index,
        w: 325,
        h: 85,
        type: ConfirmAndCancel,
        item: item,
      }
    })
    this._setState('Pair')
  }

  _focus() {
    this.fireAncestors("$hideSideAndTopPanels");
  }
  _unfocus() {
    this.fireAncestors("$showSideAndTopPanels");
  }

  _init() {
    this.hidePasswd = true;
    this.star = "";

    this.passwd = "";
    // this.tag('KeyBoard').patch({scale:1558/1080})
  }


  static _states() {
    return [
      class Password extends this {
        $enter() {
          this.shifter = false;
          this.capsLock = false;
          //  this.tag('Password').alpha = 1
        }
        _getFocused() {
          return this.tag("KeyBoard")
          //  return this.tag('Password')
        }
        $exit() {
          // this.tag('Password').alpha = 0
        }


        // $onSoftKey(key) {
        //   // if(key.key.length > 1){

        //   //   if(key.key === "caps"){
        //   //     if(this.capsLock){
        //   //       this.capsLock = false;
        //   //       this.tag("KeyBoard").patch({
        //   //         formats: {
        //   //           qwerty:  [
        //   //             ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', { label: 'backspace', size: 'large' }],
        //   //             [{ label: 'tab', size: 'large' }, 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
        //   //             [{ label: 'caps', size: 'medium', w: 170 }, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '\"', { label: '< enter', size: 'medium', w: 170 }],
        //   //             [{ label: 'shift', size: 'large' }, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', { label: 'shift', size: 'large', w: 195 }],
        //   //             [{ label: '.com', size: 'medium', w: 170 }, '@', { label: ' ', size: 'xlarge', w: 850 }]
        //   //           ]
        //   //         } 
        //   //       });
        //   //     }
        //   //     else{
        //   //       this.capsLock = true;
        //   //       this.tag("KeyBoard").patch({
        //   //         formats: {
        //   //           qwerty: [
        //   //             ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', { label: 'backspace', size: 'large' }],
        //   //             [{ label: 'tab', size: 'large' }, 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        //   //             [{ label: 'caps', size: 'medium', w: 170 }, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', { label: '< enter', size: 'medium', w: 170 }],
        //   //             [{ label: 'shift', size: 'large' }, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', { label: 'shift', size: 'large', w: 195 }],
        //   //             [{ label: '.com', size: 'medium', w: 170 }, '@', { label: ' ', size: 'xlarge', w: 850 }]
        //   //           ]
        //   //         }
        //   //       });
        //   //     }

        //   //   }
        //   //   else if(key.key === 'shift'){
        //   //     this.shifter  = true;
        //   //   }
        //   //   else if(key.key === 'backspace'){
        //   //     this.passwd = this.passwd.substring(0,this.passwd.length - 1);
        //   //   }
        //   //   else if(key.key === 'tab'){
        //   //     this.passwd += '\t'
        //   //   }
        //   //   else if(key.key === '.com'){
        //   //     this.passwd += '.com'
        //   //   }
        //   //   else if(key.key === '< enter'){
        //   //     this.fireAncestors('$startConnect', this.passwd)
        //   //   }
        //   // }
        //   // else{
        //     if(this.capsLock){
        //       key.key = key.key.toUpperCase();
        //     }
        //     else if(this.shifter){
        //       key.key = key.key.toUpperCase();
        //       this.shifter = false;
        //     }
        //     this.passwd+= key.key;
        //   // }
        //   if(this.hidePasswd){
        //     this.tag("Pwd").text.text =  this.getStars();
        //   } 
        //   else{
        //     this.tag("Pwd").text.text = this.passwd
        //   }
        // }

        $onSoftKey({ key }) {

          if (key === 'Done') {
            this.fireAncestors('$startConnect', this.passwd)
          } else if (key === 'Clear') {
            this.passwd = this.passwd.substring(0, this.passwd.length - 1);
            this.star = this.star.substring(0, this.passwd.length - 1);
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
        // _handleKey(event) {
        //   if
        //   // if (
        //   //   event.keyCode == 27 ||
        //   //   event.keyCode == 77 ||
        //   //   event.keyCode == 49 ||
        //   //   event.keyCode == 158
        //   // ) {
        //   //   this._setState('Pair')
        //   // } else return false
        // }


      },
      class Pair extends this {
        $enter() {}
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
          if (this.tag('List').element.ref == 'Connect' && this._item.security != '0') {
            if (this.star === '') {
              this._setState('Password')
            } else {
              this.fireAncestors('$startConnect', this.passwd)
            }
          } else {
            this.fireAncestors('$pressEnter', this.tag('List').element.ref)
          }
        }

      },



      class PasswordSwitchState extends this{
        $enter() {
          // this.tag("PasswordBox").patch({
          //   //  texture: Lightning.Tools.getRoundRect(  1321 , 88 , 0, 2, CONFIG.theme.hex, false)
          //   shader: { type: Lightning.shaders.RoundedRectangle, radius: 0}
          //   })
          this.tag("PasswordBox.TopBorder").color = CONFIG.theme.hex
          this.tag("PasswordBox.RightBorder").color = CONFIG.theme.hex
          this.tag("PasswordBox.BottomBorder").color = CONFIG.theme.hex
          this.tag("PasswordBox.LeftBorder").color = CONFIG.theme.hex
          this.isOn = false;
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
            // this.tag('Pwd').text.text = this.passwd;
          }
          else {
            this._updateText(this.star);
            this.hidePasswd = true;
            // this.tag('Pwd').text.text = this.getStars();
          }
        }

        $exit() {
          // this.tag("PasswordBox").patch({ 
          //   // texture: Lightning.Tools.getRoundRect(  1321 , 88 , 0, 2, 0xffffffff, false)
          //   shader: { type: Lightning.shaders.RoundedRectangle, radius: 0}
          // });
          this.tag("PasswordBox.TopBorder").color = 0xFFFFFFFF
          this.tag("PasswordBox.RightBorder").color = 0xFFFFFFFF
          this.tag("PasswordBox.BottomBorder").color = 0xFFFFFFFF
          this.tag("PasswordBox.LeftBorder").color = 0xFFFFFFFF
        }
      }
    ]
  }
}
