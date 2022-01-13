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
import WiFiScreen from '../WifiScreen'
import Wifi from '../../api/WifiApi'

const wifi = new Wifi()
export default class NetworkInterfaceScreen extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            color: 0xff000000,
            w: 1920,
            h: 1080,
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
                Ethernet: {
                    y: 90,
                    type: SettingsMainItem,
                    Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                            text: 'Ethernet',
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                },
            },
            WiFiScreen: {
                type: WiFiScreen,
                visible: false,
            }
        }
    }

    _focus() {
        this._setState('WiFi');
    }

    hide() {
        this.tag('NetworkInterfaceScreenContents').visible = false
    }

    show() {
        this.tag('NetworkInterfaceScreenContents').visible = true
    }

    setEthernetInterface() {
        wifi.setInterface('ETHERNET', true).then(res => {
            if (res.success) {
                wifi.setDefaultInterface('ETHERNET', true)
            }
        })
    }

    _handleBack() {
        Router.navigate('settings/network')
    }
    pageTransition() {
        return 'left'
    }
    _onChanged() {
        this.widgets.menu.updateTopPanelText('Settings / Network Configuration / Network Interface')
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
                _handleEnter() {
                    //this._setState('WiFiScreen')
                    if (!Router.isNavigating()) {
                        Router.navigate('settings/network/interface/wifi')
                    }

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
                    this.setEthernetInterface()
                }
                _handleDown() {
                    this._setState('WiFi')
                }
                _handleUp() {
                    this._setState('WiFi')
                }
            },
            class WiFiScreen extends this {
                $enter() {
                    this.hide()
                    this.tag('WiFiScreen').visible = true
                    this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / Network Interface / WiFi')
                }
                $exit() {
                    this.show()
                    this.tag('WiFiScreen').visible = false
                    this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / Network Interface')
                }
                _getFocused() {
                    return this.tag('WiFiScreen')
                }
            },
        ]
    }
}