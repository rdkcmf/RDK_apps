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
import { COLORS } from '../../colors/Colors'
import { CONFIG } from '../../Config/Config'
import NetworkApi from '../../api/NetworkApi'
import NetworkInterfaceScreen from './NetworkInterfaceScreen'
import WiFiScreen from '../WifiScreen'
/**
  * Class for Other Settings Screen.
  */

export default class NetworkConfigurationScreen extends Lightning.Component {
    static _template() {
        return {
            x: 0,
            y: 0,
            NetworkConfigurationScreenContents: {
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
                        x: 1600,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                NetworkInterface: {
                    alpha: 0.3, // disabled
                    y: 90,
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
                        x: 1600,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                InternetProtocol: {
                    alpha: 0.3, // disabled
                    y: 180,
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
                        x: 1600,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                TestInternetAccess: {
                    y: 270,
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
                    Loader: {
                        h: 45,
                        w: 45,
                        // x: 1600,
                        x: 420,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Loading.gif'),
                        visible: false,
                    },
                },
                StaticMode: {
                    alpha: 0.3, // disabled
                    y: 360,
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
                        x: 1600,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
            },
            NetworkInterfaceScreen: {
                type: NetworkInterfaceScreen,
                visible: false,
            },
            WiFiScreen: {
                type: WiFiScreen,
                visible: false,
            }
        }
    }

    _init() {
        let _currentInterface = "" //getDefaultInterface
        let _currentIPSettings = {}
        let _newIPSettings = {}
        this._network = new NetworkApi()

        this._network.getDefaultInterface().then(interfaceName => {
            _currentInterface = interfaceName
        })
        this._network.getIPSettings(_currentInterface).then(result => {
            _currentIPSettings = result
        }) // we get IP settings of default interface if we pass _currentInterface as ""


        _newIPSettings = _currentIPSettings
        _newIPSettings.ipversion = "IPV6" // this fails, need to verify how to set proper ip settings

        // loader animation for testing internet
        this.loadingAnimation = this.tag('TestInternetAccess.Loader').animation({
            duration: 3, repeat: -1, stopMethod: 'immediate', stopDelay: 0.2,
            actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: 2 * Math.PI } }]
        });


        this._network.getDefaultInterface().then(interfaceName => {
            this.$NetworkInterfaceText(interfaceName)
        })
    }


    _focus() {
        this._setState('WiFi') //can be used on init as well
    }
    _unfocus() {
        this.tag('TestInternetAccess.Title').text.text = 'Test Internet Access'
    }

    hide() {
        this.tag('NetworkConfigurationScreenContents').visible = false
    }

    show() {
        this.tag('NetworkConfigurationScreenContents').visible = true
    }

    $NetworkInterfaceText(text) {
        this.tag('NetworkInterface.Title').text.text = `Network Interface: ${text}`
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
                    this._setState('TestInternetAccess')
                }
                _handleEnter() {
                    this._setState('WiFiScreen')
                }
            },
            class NetworkInterface extends this {
                $enter() {
                    this.tag('NetworkInterface')._focus()
                }
                $exit() {
                    this.tag('NetworkInterface')._unfocus()
                }
                _handleUp() {
                    this._setState('WiFi')
                }
                _handleDown() {
                    // this._setState('InternetProtocol')
                    this._setState('TestInternetAccess')
                }
                _handleEnter() {
                    this._network.getInterfaces().then(interfaces => {
                        if (interfaces.length > 0) {
                            this._setState('NetworkInterfaceScreen')
                        }
                    })
                }
            },
            class InternetProtocol extends this {
                $enter() {
                    this.tag('InternetProtocol')._focus()
                }
                $exit() {
                    this.tag('InternetProtocol')._unfocus()
                }
                _handleUp() {
                    this._setState('NetworkInterface')
                }
                _handleDown() {
                    this._setState('TestInternetAccess')
                }
                _handleEnter() {
                    // 
                }
            },
            class TestInternetAccess extends this {
                $enter() {
                    this.tag('TestInternetAccess')._focus()
                }
                $exit() {
                    this.tag('TestInternetAccess')._unfocus()
                }
                _handleUp() {
                    // this._setState('InternetProtocol')
                    this._setState('WiFi')
                }
                _handleDown() {
                    // this._setState('StaticMode')
                }
                _handleEnter() {
                    this.loadingAnimation.start()
                    this.tag('TestInternetAccess.Loader').visible = true
                    this._network.isConnectedToInternet().then(result => {
                        var connectionStatus = "Internet Access: "
                        if (result) {
                            connectionStatus += "Connected"
                        } else {
                            connectionStatus += "Not Connected"
                        }

                        setTimeout(() => {
                            this.tag('TestInternetAccess.Loader').visible = false
                            this.loadingAnimation.stop()
                            this.tag('TestInternetAccess.Title').text.text = connectionStatus
                        }, 2000)
                    })
                }
            },
            class StaticMode extends this {
                $enter() {
                    this.tag('StaticMode')._focus()
                }
                $exit() {
                    this.tag('StaticMode')._unfocus()
                }
                _handleUp() {
                    this._setState('TestInternetAccess')
                }
                _handleEnter() {
                    // 
                }
            },
            class NetworkInterfaceScreen extends this {
                $enter() {
                    this.hide()
                    this.tag('NetworkInterfaceScreen').visible = true
                    this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / Network Interface')
                }
                $exit() {
                    this.show()
                    this.tag('NetworkInterfaceScreen').visible = false
                    this.fireAncestors('$changeHomeText', 'Settings / Network Configuration')
                }
                _getFocused() {
                    return this.tag('NetworkInterfaceScreen')
                }
                _handleBack() {
                    this._setState('NetworkInterface')
                }
            },
            class WiFiScreen extends this {
                $enter() {
                    this.hide()
                    this.tag('WiFiScreen').visible = true
                    this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / WiFi')
                }
                $exit() {
                    this.show()
                    this.tag('WiFiScreen').visible = false
                    this.fireAncestors('$changeHomeText', 'Settings / Network Configuration')
                }
                _getFocused() {
                    return this.tag('WiFiScreen')
                }
                _handleBack() {
                    this._setState('WiFi')
                }
            },
        ]
    }
}