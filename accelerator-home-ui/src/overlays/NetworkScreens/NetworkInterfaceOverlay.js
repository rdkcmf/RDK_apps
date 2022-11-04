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
 import { Lightning, Router, Utils } from '@lightningjs/sdk'
 import SettingsMainItem from '../../items/SettingsMainItem'
 import { COLORS } from '../../colors/Colors'
 import { CONFIG } from '../../Config/Config'
 import Wifi from '../../api/WifiApi'
 import { Language } from '@lightningjs/sdk';
 import ThunderJS from 'ThunderJS'
 import WifiScreen from './NetworkWifiOverlay'
 
 const wifi = new Wifi()
 export default class NetworkInterfaceScreen extends Lightning.Component {
 
     _construct() {
         this.LoadingIcon = Utils.asset('images/settings/Loading.png')
     }
     static _template() {
         return {
             NetworkInterfaceScreenContents: {
                 x: 200,
                 y: 275,
                 WiFi: {
                     type: SettingsMainItem,
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('WiFi'),
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
                 Ethernet: {
                     y: 90,
                     type: SettingsMainItem,
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('Ethernet'),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                     Loader: {
                         h: 45,
                         w: 45,
                         x: 175,
                         mountX: 1,
                         y: 45,
                         mountY: 0.5,
                         src: Utils.asset('images/settings/Loading.png'),
                         visible: false,
                     },
                 },
             },
             WifiScreen:{
                type: WifiScreen,
                visible: false
             }
         }
     }
 
     _focus() {
         this._setState('WiFi');
     }
 
     _init() {
         const config = {
             host: '127.0.0.1',
             port: 9998,
             default: 1,
         };
         this._thunder = ThunderJS(config)
         const systemcCallsign = 'org.rdk.Network'
         const eventName = 'onDefaultInterfaceChanged'
         const listener = this._thunder.on(systemcCallsign, eventName, (notification) => {
             console.log('onDefaultInterfaceChanged notification from networkInterfaceScreen: ', notification)
             if (notification.newInterfaceName === "ETHERNET") {
                 this.loadingAnimation.stop()
                 this.tag('Ethernet.Loader').visible = false
                 this.tag('Ethernet.Title').text.text = 'Ethernet: Connected'
             } else if (notification.newInterfaceName === "" && notification.oldInterfaceName === "WIFI") {
                 this.loadingAnimation.stop()
                 this.tag('Ethernet.Loader').visible = false
                 this.tag('Ethernet.Title').text.text = 'Ethernet: Error, Retry!'
             } else if (notification.newInterfaceName === "WIFI") {
                 this.loadingAnimation.stop()
                 this.tag('Ethernet.Loader').visible = false
                 this.tag('Ethernet.Title').text.text = 'Ethernet'
             }
         })
 
         this.loadingAnimation = this.tag('Ethernet.Loader').animation({
             duration: 3, repeat: -1, stopMethod: 'immediate', stopDelay: 0.2,
             actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: 2 * Math.PI } }]
         });
 
         this.tag('Ethernet.Loader').src = this.LoadingIcon
     }
 
     _firstActive() {
         this.tag('Ethernet.Loader').on('txError', () => {
             const url = 'http://127.0.0.1:50050/lxresui/static/images/settings/Loading.png'
             this.tag('Ethernet.Loader').src = url
         })
     }
 
     hide() {
         this.tag('NetworkInterfaceScreenContents').visible = false
     }
 
     show() {
         this.tag('NetworkInterfaceScreenContents').visible = true
     }
 
     setEthernetInterface() {
         wifi.getInterfaces().then(res => {
             res.interfaces.forEach(element => {
                 if (element.interface === "ETHERNET" && element.connected) {
                     wifi.setInterface('ETHERNET', true).then(result => {
                         if (result.success) {
                             wifi.setDefaultInterface('ETHERNET', true)
                             this.tag('Ethernet.Title').text.text = 'Ethernet'
                             this.tag('Ethernet.Loader').visible = true
                             this.loadingAnimation.start()
                         }
                     })
                 }
             });
         })
     }
 
     
   
     static _states() {
         return [
             class WiFi extends this {
                 $enter() {
                     this.tag('WiFi')._focus()
                 }
                 $exit() {
                     this.tag('WiFi')._unfocus()
                 }
                 _handleDown() {
                     this._setState('Ethernet')
                 }
                 _getFocused() {
                    return this.tag('WiFi')
                }
                 _handleEnter() {
                    this._setState("WifiScreen")
 
                 }
             },
             class Ethernet extends this {
                 $enter() {
                     this.tag('Ethernet')._focus()
                 }
                 $exit() {
                     this.tag('Ethernet')._unfocus()
                 }
                 _handleEnter() {
                     wifi.getDefaultInterface().then(res => {
                         if (res.success) {
                             if (res.interface !== "ETHERNET") {
                                 this.setEthernetInterface()
                             }
                         }
                     })
                 }
                 _handleDown() {
                    //  this._setState('WiFi')
                 }
                 _handleUp() {
                     this._setState('WiFi')
                 }
             },
             class WifiScreen extends this {
                $enter() {
                    console.log("wifiscreen")
                    this.hide()
                    this.tag('WifiScreen').visible = true
                    this.fireAncestors('$updatePageTitle', 'Settings  Network Configuration  Network Interface  WiFi')
                }
                $exit() {
                    this.show()
                    this.tag('WifiScreen').visible = false
                    this.fireAncestors('$updatePageTitle', 'Settings  Network Configuration  Network Interface')
                }
                _getFocused() {
                    return this.tag('WifiScreen')
                }
                _handleBack() {
                    this._setState('WiFi')
                }
            },
         ]
     }
 }