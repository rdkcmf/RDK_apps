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
 import SettingsMainItem from '../../items/SettingsMainItem'
 import SettingsItem from '../../items/SettingsItem'
 import { COLORS } from '../../colors/Colors'
import { CONFIG } from '../../Config/Config'
import NetworkApi from '../../api/NetworkApi'
 /**
  * Class for Other Settings Screen.
  */

 export default class NetworkConfigurationScreen extends Lightning.Component {
    static _template(){
        return {
            x:0,
            y:0,
            NetworkConfigurationScreenContents:{
                NetworkInterface: {
                    y: 0,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Network Interface: ',
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
                InternetProtocol: {
                    y: 90,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Internet Protocol: ',
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
                TestInternetAccess: {
                    y: 180,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Test Internet Access',
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
                StaticMode: {
                    y: 270,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Static Mode: ',
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
            },
            NetworkInterfaceScreen:{
                // 
            },
        }
    }

    _init(){
        let _currentInterface = "" //getDefaultInterface
        let _currentIPSettings = {}
        let _newIPSettings = {}
        let _newInterface = "ETHERNET" //new interface to be set
        this._network = new NetworkApi()
        this._network.getInterfaces().then(list => {
        })
        this._network.getDefaultInterface().then(interfaceName => {
            _currentInterface = interfaceName
        })
        this._network.getIPSettings(_currentInterface).then(result => {
            _currentIPSettings = result
        }) // we get IP settings of default interface if we pass _currentInterface as ""
        

        _newIPSettings = _currentIPSettings
        _newIPSettings.ipversion = "IPV6" // this fails, need to verify how to set proper ip settings


        this._network.setIPSettings(_newIPSettings).then(result => {
        })

        this._network.setDefaultInterface(_newInterface).then(result => {
        })

        this._network.isConnectedToInternet().then(result => {
        })
        
    }


    _focus(){
        this._setState('NetworkInterface') //can be used on init as well
    }

    hide(){
        this.tag('NetworkConfigurationScreenContents').visible = false
    }

    show(){
        this.tag('NetworkConfigurationScreenContents').visible = true
    }

    static _states() {
        return [
            class NetworkInterface extends this {
                $enter(){
                    this.tag('NetworkInterface')._focus()
                }
                $exit(){
                    this.tag('NetworkInterface')._unfocus()
                }
                _handleDown(){
                    this._setState('InternetProtocol')
                }
                _handleEnter(){
                    // 
                }
            },
            class InternetProtocol extends this {
                $enter(){
                    this.tag('InternetProtocol')._focus()
                }
                $exit(){
                    this.tag('InternetProtocol')._unfocus()
                }
                _handleUp(){
                    this._setState('NetworkInterface')
                }
                _handleDown(){
                    this._setState('TestInternetAccess')
                }
                _handleEnter(){
                    // 
                }
            },
            class TestInternetAccess extends this {
                $enter(){
                    this.tag('TestInternetAccess')._focus()
                }
                $exit(){
                    this.tag('TestInternetAccess')._unfocus()
                }
                _handleUp(){
                    this._setState('InternetProtocol')
                }
                _handleDown(){
                    this._setState('StaticMode')
                }
                _handleEnter(){
                    // 
                }
            },
            class StaticMode extends this {
                $enter(){
                    this.tag('StaticMode')._focus()
                }
                $exit(){
                    this.tag('StaticMode')._unfocus()
                }
                _handleUp(){
                    this._setState('TestInternetAccess')
                }
                _handleEnter(){
                    // 
                }
            },
        ]
    }
}