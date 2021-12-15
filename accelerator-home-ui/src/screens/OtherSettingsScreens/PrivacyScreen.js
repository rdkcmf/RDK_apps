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
import AppApi from '../../api/AppApi'
import { Lightning, Utils, Storage, Language } from '@lightningjs/sdk'
import SettingsMainItem from '../../items/SettingsMainItem'
import { COLORS } from '../../colors/Colors'
import { CONFIG } from '../../Config/Config'
import PrivacyPolicyScreen from './PrivacyPolicyScreen'
import XcastApi from '../../api/XcastApi'
import UsbApi from '../../api/UsbApi'

/**
 * Class for Privacy Screen.
 */

const xcastApi = new XcastApi()

export default class PrivacyScreen extends Lightning.Component {
    static _template() {
        return {
            x: 0,
            y: 0,
            PrivacyScreenContents: {
                LocalDeviceDiscovery: {
                    y: 0,
                    type: SettingsMainItem,
                    Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                            text: Language.translate('Local Device Discovery'),
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                    Button: {
                        h: 45,
                        w: 67,
                        x: 1600,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/ToggleOffWhite.png'),
                    },
                },
                UsbMediaDevices: {
                    y: 90,
                    type: SettingsMainItem,
                    Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                            text: Language.translate('USB Media Devices'),
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                    Button: {
                        h: 45,
                        w: 67,
                        x: 1600,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/ToggleOffWhite.png'),
                    },
                },
                AudioInput: {
                    y: 180,
                    type: SettingsMainItem,
                    Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                            text: Language.translate('Audio Input'),
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                    Button: {
                        h: 45,
                        w: 67,
                        x: 1600,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/ToggleOffWhite.png'),
                    },
                },
                ClearCookies: {
                    y: 270,
                    type: SettingsMainItem,
                    Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                            text: Language.translate('Clear Cookies and App Data'),
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                },
                PrivacyPolicy: {
                    y: 360,
                    type: SettingsMainItem,
                    Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                            text: Language.translate('Privacy Policy and License'),
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
            PrivacyPolicyScreen: {
                type: PrivacyPolicyScreen,
                visible: false,
            }

        }
    }

    _init() {
        xcastApi.getEnabled().then(res => {
            if (res.enabled) {
                this.tag('LocalDeviceDiscovery.Button').src = Utils.asset('images/settings/ToggleOnOrange.png')
            } else {
                this.tag('LocalDeviceDiscovery.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
            }
        })
        this.USBApi = new UsbApi()
        this.AppApi = new AppApi()
        if(!Storage.get('UsbMedia')){
            this.USBApi.activate().then(res => {
                // activate the api and set UsbMedia for the first time in storage
                this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOnOrange.png')
                this.fireAncestors('$registerUsbEvent')
                Storage.set('UsbMedia','ON')
            })
        }else if(Storage.get('UsbMedia') === 'ON'){
            this.USBApi.activate().then(res => {
                this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOnOrange.png')
                this.fireAncestors('$registerUsbEvent')
            })
        }else if (Storage.get('UsbMedia') === 'OFF'){
            this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
            // this.USBApi.deactivate().then(res => {
            //     this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
            // })
        }
    }


    _focus() {
        this._setState('LocalDeviceDiscovery') //can be used on init as well
    }

    hide() {
        this.tag('PrivacyScreenContents').visible = false
    }

    show() {
        this.tag('PrivacyScreenContents').visible = true
    }

    toggleLocalDeviceDiscovery() {
        xcastApi.getEnabled().then(res => {
            if (!res.enabled) {
                xcastApi.activate().then(res => {
                    if (res) {
                        this.tag('LocalDeviceDiscovery.Button').src = Utils.asset('images/settings/ToggleOnOrange.png')
                    }
                })
            }
            else {
                xcastApi.deactivate().then(res => {
                    if (res) {
                        this.tag('LocalDeviceDiscovery.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
                    }
                })
            }
        })
    }

    static _states() {
        return [
            class LocalDeviceDiscovery extends this {
                $enter() {
                    this.tag('LocalDeviceDiscovery')._focus()
                }
                $exit() {
                    this.tag('LocalDeviceDiscovery')._unfocus()
                }
                _handleUp() {
                    this._setState('PrivacyPolicy')
                }
                _handleDown() {
                    this._setState('UsbMediaDevices')
                }
                _handleEnter() {
                    this.toggleLocalDeviceDiscovery()
                }
            },
            class UsbMediaDevices extends this {
                $enter() {
                    this.tag('UsbMediaDevices')._focus()
                }
                $exit() {
                    this.tag('UsbMediaDevices')._unfocus()
                }
                _handleUp() {
                    this._setState('LocalDeviceDiscovery')
                }
                _handleDown() {
                    this._setState('AudioInput')
                }
                _handleEnter() {
                    let _UsbMedia = Storage.get('UsbMedia')
                    if(_UsbMedia ==='ON'){
                        Storage.set('UsbMedia','OFF')
                        this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
                        this.fireAncestors('$initializeUSB')
                        // this.USBApi.deactivate().then(res => {
                        //     Storage.set('UsbMedia','OFF')
                        //     this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
                        // })
                    }else if(_UsbMedia === 'OFF'){
                        this.USBApi.activate().then(res => {
                            Storage.set('UsbMedia','ON')
                            this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOnOrange.png')
                            this.fireAncestors('$registerUsbEvent')
                            this.fireAncestors('$initializeUSB')
                        }) 
                    }
                }
            },
            class AudioInput extends this {
                $enter() {
                    this.tag('AudioInput')._focus()
                }
                $exit() {
                    this.tag('AudioInput')._unfocus()
                }
                _handleUp() {
                    this._setState('UsbMediaDevices')
                }
                _handleDown() {
                    this._setState('ClearCookies')
                }
                _handleEnter() {
                    // 
                }
            },
            class ClearCookies extends this {
                $enter() {
                    this.tag('ClearCookies')._focus()
                }
                $exit() {
                    this.tag('ClearCookies')._unfocus()
                }
                _handleUp() {
                    this._setState('AudioInput')
                }
                _handleDown() {
                    this._setState('PrivacyPolicy')
                }
                _handleEnter() {
                    this.AppApi.clearCache()
                    .then(() => {
                        //location.reload(true)
                    })
                }
            },
            class PrivacyPolicy extends this {
                $enter() {
                    this.tag('PrivacyPolicy')._focus()
                }
                $exit() {
                    this.tag('PrivacyPolicy')._unfocus()
                }
                _handleUp() {
                    this._setState('ClearCookies')
                }
                _handleDown() {
                    this._setState('LocalDeviceDiscovery')
                }
                _handleEnter() {
                    this._setState('PrivacyPolicyScreen')
                    this.hide()
                }
            },


            class PrivacyPolicyScreen extends this {
                $enter() {
                    this.tag('PrivacyPolicyScreen').visible = true
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Privacy / Privacy Policy')
                }
                _getFocused() {
                    return this.tag('PrivacyPolicyScreen')
                }
                $exit() {
                    this.tag('PrivacyPolicyScreen').visible = false
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Privacy')
                }
                _handleBack() {
                    this._setState('PrivacyPolicy')
                    this.show()
                }
            }
        ]
    }
}