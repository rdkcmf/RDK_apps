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
 import { COLORS } from '../colors/Colors'
 import SettingsItem from './../items/SettingsItem'
 import { CONFIG } from "../Config/Config"
 let _item
 /**
  * Class for pairing screen for the Bluetooth.
  */
 export default class BluetoothPairingScreen extends Lightning.Component {
   static _template() {
     return {
        Background: {
            x: 0,
            y: 0,
            w: 1920,
            h: 2000,
            mount:0.5,
            rect: true,
            color: 0xff000000,
          },
        Title: {
            x: 0,
            y: 0,
            mountX:0.5,
            text: {
              text: "",
              fontFace: CONFIG.language.font,
              fontSize: 40,
              textColor: CONFIG.theme.hex,
            },
          },
          BorderTop: {
            x: 0, y: 75, w: 1558, h: 3, rect: true,mountX:0.5,
          },
          Pairing: {
            x: 0,
            y: 125,
            mountX:0.5,
            text: {
              text: "",
              fontFace: CONFIG.language.font,
              fontSize: 25,
            },
          },
          Buttons:{
            x: 0, y: 200, w: 440, mountX:0.5, h: 50,
            ConnectDisconnect: {
                x: 0, w: 200, mountX:0.5, h: 50, rect: true, color: 0xFFFFFFFF,
                Title: {
                x: 100,
                y: 25,
                mount:0.5,
                text: {
                    text: "",
                    fontFace: CONFIG.language.font,
                    fontSize: 22,
                    textColor:0xFF000000
                },
                }
            },
            Unpair: {
                x: 0+220, w: 200, mountX:0.5, h: 50, rect: true, color: 0xFFFFFFFF,
                Title: {
                x: 100,
                y: 25,
                mount:0.5,
                text: {
                    text: "Unpair",
                    fontFace: CONFIG.language.font,
                    fontSize: 22,
                    textColor:0xFF000000
                },
                }
            },
            Cancel: {
                x: 0+220+220, w: 200, mountX:0.5, h: 50, rect: true, color: 0xFF7D7D7D,
                Title: {
                x: 100,
                y: 25,
                mount:0.5,
                text: {
                    text: "Cancel",
                    fontFace: CONFIG.language.font,
                    fontSize: 22,
                    textColor:0xFF000000
                },
                }
            },
          },
          BorderBottom: {
            x: 0, y: 300, w: 1558, h: 3, rect: true,mountX:0.5,
          },
        
     }
   }

   set item(item) {
       _item = item
       this._setState('ConnectDisconnect')
    this.tag('Title').text = item.name
    if (item.connected){
        this.tag('ConnectDisconnect.Title').text = 'Disconnect'
    } else {
        this.tag('ConnectDisconnect.Title').text = 'Connect'
    }
    }

    _init(){
        this._setState('ConnectDisconnect')
    }

    static _states() {
        return [
          class ConnectDisconnect extends this {
                $enter(){
                  this._focus()
              }
            _handleEnter(){
                // this.tag('Pairing').text = "Someting is wrong " + _item.name
                if (_item.connected){
                    // this.tag('Pairing').text = "Connecting to " + _item.name
                    this.fireAncestors('$pressEnter', 'Disconnect')
                } else {
                    // this.tag('Pairing').text = "Disconnecting from " + _item.name
                    this.fireAncestors('$pressEnter', 'Connect')
                }
            }
            _handleRight(){
                this._setState('Unpair')
            }
            _handleBack(){
                this.fireAncestors('$goBack')
            }
            _focus(){
                this.tag('ConnectDisconnect').patch({
                    color: CONFIG.theme.hex
                })
                this.tag('ConnectDisconnect.Title').patch({
                    text:{
                        textColor:0xFFFFFFFF
                    }
                })
            }
            _unfocus(){
                this.tag('ConnectDisconnect').patch({
                    color: 0xFFFFFFFF
                })
                this.tag('ConnectDisconnect.Title').patch({
                    text:{
                        textColor:0xFF000000
                    }
                })
            }
            $exit(){
                this._unfocus()
            }
          },
          class Unpair extends this {
                $enter(){
                  this._focus()
              }
            _handleEnter(){
                this.fireAncestors('$pressEnter', 'Unpair')
            }
            _handleRight(){
                this._setState('Cancel')
            }
            _handleLeft(){
                this._setState('ConnectDisconnect')
            }
            _handleBack(){
                this.fireAncestors('$goBack')
            }
            _focus(){
                this.tag('Unpair').patch({
                    color: CONFIG.theme.hex
                })
                this.tag('Unpair.Title').patch({
                    text:{
                        textColor:0xFFFFFFFF
                    }
                })
            }
            _unfocus(){
                this.tag('Unpair').patch({
                    color: 0xFFFFFFFF
                })
                this.tag('Unpair.Title').patch({
                    text:{
                        textColor:0xFF000000
                    }
                })
            }
            $exit(){
                this._unfocus()
            }
          },
          class Cancel extends this {
              $enter(){
                  this._focus()
              }
            _handleEnter(){
                this.fireAncestors('$pressEnter', 'Cancel')
            }
            _handleLeft(){
                this._setState('Unpair')
            }
            _handleBack(){
                this.fireAncestors('$goBack')
            }
            _focus(){
                this.tag('Cancel').patch({
                    color: CONFIG.theme.hex
                })
                this.tag('Cancel.Title').patch({
                    text:{
                        textColor:0xFFFFFFFF
                    }
                })
            }
            _unfocus(){
                this.tag('Cancel').patch({
                    color: 0xFF7D7D7D
                })
                this.tag('Cancel.Title').patch({
                    text:{
                        textColor:0xFF000000
                    }
                })
            }
            $exit(){
                this._unfocus()
            }
          },
        ]
    }
   
 }
 