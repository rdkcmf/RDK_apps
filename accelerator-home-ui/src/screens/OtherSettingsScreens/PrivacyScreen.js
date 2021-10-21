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

 /**
  * Class for Other Settings Screen.
  */

 export default class PrivacyScreen extends Lightning.Component {
    static _template(){
        return {
            x:0,
            y:0,
            PrivacyScreenContents:{
                LocalDeviceDiscovery: {
                        y: 0,
                        type: SettingsMainItem,
                        Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                            text: 'Local Device Discovery',
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                    Button: {
                        h: 30 *1.5,
                        w: 44.6 *1.5,
                        x: 1535,
                        mountX:1,
                        y: 45,
                        mountY:0.5,
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
                        text: 'USB Media Devices',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                        h: 30 *1.5,
                        w: 44.6 *1.5,
                        x: 1535,
                        mountX:1,
                        y: 45,
                        mountY:0.5,
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
                        text: 'Audio Input',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                        h: 30 *1.5,
                        w: 44.6 *1.5,
                        x: 1535,
                        mountX:1,
                        y: 45,
                        mountY:0.5,
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
                        text: 'Clear Cookies and App Data',
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
                PrivacyPolicy: {
                    y: 360,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Privacy Policy and License',
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
            
        }
    }


    _focus(){
        this._setState('LocalDeviceDiscovery') //can be used on init as well
    }

    hide(){
        this.tag('PrivacyScreenContents').visible = false
    }

    show(){
        this.tag('PrivacyScreenContents').visible = true
    }

    static _states() {
        return [
            class LocalDeviceDiscovery extends this {
                $enter(){
                    this.tag('LocalDeviceDiscovery')._focus()
                }
                $exit(){
                    this.tag('LocalDeviceDiscovery')._unfocus()
                }
                _handleDown(){
                    this._setState('UsbMediaDevices')
                }
                _handleEnter(){
                    // 
                }
            },
            class UsbMediaDevices extends this {
                $enter(){
                    this.tag('UsbMediaDevices')._focus()
                }
                $exit(){
                    this.tag('UsbMediaDevices')._unfocus()
                }
                _handleUp(){
                    this._setState('LocalDeviceDiscovery')
                }
                _handleDown(){
                    this._setState('AudioInput')
                }
                _handleEnter(){
                    // 
                }
            },
            class AudioInput extends this {
                $enter(){
                    this.tag('AudioInput')._focus()
                }
                $exit(){
                    this.tag('AudioInput')._unfocus()
                }
                _handleUp(){
                    this._setState('UsbMediaDevices')
                }
                _handleDown(){
                    this._setState('ClearCookies')
                }
                _handleEnter(){
                    // 
                }
            },
            class ClearCookies extends this {
                $enter(){
                    this.tag('ClearCookies')._focus()
                }
                $exit(){
                    this.tag('ClearCookies')._unfocus()
                }
                _handleUp(){
                    this._setState('AudioInput')
                }
                _handleDown(){
                    this._setState('PrivacyPolicy')
                }
                _handleEnter(){
                    // 
                }
            },
            class PrivacyPolicy extends this {
                $enter(){
                    this.tag('PrivacyPolicy')._focus()
                }
                $exit(){
                    this.tag('PrivacyPolicy')._unfocus()
                }
                _handleUp(){
                    this._setState('ClearCookies')
                }
                _handleEnter(){
                    // 
                }
            },
        ]
    }
}