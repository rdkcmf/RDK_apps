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
import DeviceInformationScreen from './DeviceInformationScreen'
import AppApi from '../../api/AppApi'

 /**
  * Class for Video and Audio screen.
  */

 export default class AdvancedSettingsScreen extends Lightning.Component {
    static _template(){
        return { 
            x:0,
            y:0,
            AdvanceScreenContents:{   
                UIVoice: {
                    type: SettingsMainItem,
                    Title: {
                    x: 10,
                    y: 45,
                    mountY: 0.5,
                    text: {
                    text: 'UI Voice',
                    textColor: COLORS.titleColor,
                    fontFace: CONFIG.language.font,
                    fontSize: 25,
                    }
                    },
                    Button: {
                    h: 30 *1.5,
                    w: 30 *1.5,
                    x: 1535,
                    mountX:1,
                    y: 45,
                    mountY:0.5,
                    src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                TTSOptions: {
                    y: 0+90,
                    type: SettingsMainItem,
                    Title: {
                    x: 10,
                    y: 45,
                    mountY: 0.5,
                    text: {
                        text: 'TTS Options',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                    h: 30 * 1.5,
                    w: 30 * 1.5,
                    x: 1535,
                    mountX: 1,
                    y: 45,
                    mountY: 0.5,
                    src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                CECControl: {
                    y: 0+90+90,
                    type: SettingsMainItem,
                    Title: {
                    x: 10,
                    y: 45,
                    mountY: 0.5,
                    text: {
                        text: 'CEC Control',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                    h: 30 * 1.5,
                    w: 30 * 1.5,
                    x: 1535,
                    mountX: 1,
                    y: 45,
                    mountY: 0.5,
                    src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                Bug: {
                    y: 0+90+90+90 ,
                    type: SettingsMainItem,
                    Title: {
                    x: 10,
                    y: 45,
                    mountY: 0.5,
                    text: {
                        text: 'Bug Report',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                    h: 30 * 1.5,
                    w: 30 * 1.5,
                    x: 1535,
                    mountX: 1,
                    y: 45,
                    mountY: 0.5,
                    src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                Contact: {
                    y: 0+90+90+90+90 ,
                    type: SettingsMainItem,
                    Title: {
                    x: 10,
                    y: 45,
                    mountY: 0.5,
                    text: {
                        text: 'Contact Support',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                    h: 30 * 1.5,
                    w: 30 * 1.5,
                    x: 1535,
                    mountX: 1,
                    y: 45,
                    mountY: 0.5,
                    src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                Sync: {
                    y: 0+90+90+90+90+90 ,
                    type: SettingsMainItem,
                    Title: {
                    x: 10,
                    y: 45,
                    mountY: 0.5,
                    text: {
                        text: 'Synchronize Location',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                    h: 30 * 1.5,
                    w: 30 * 1.5,
                    x: 1535,
                    mountX: 1,
                    y: 45,
                    mountY: 0.5,
                    src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                Firmware: {
                    y: 0+90+90+90+90+90+90 ,
                    type: SettingsMainItem,
                    Title: {
                    x: 10,
                    y: 45,
                    mountY: 0.5,
                    text: {
                        text: 'Check for Firmware Update',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                    h: 30 * 1.5,
                    w: 30 * 1.5,
                    x: 1535,
                    mountX: 1,
                    y: 45,
                    mountY: 0.5,
                    src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                DeviceInfo: {
                    y: 0+90+90+90+90+90+90+90 ,
                    type: SettingsMainItem,
                    Title: {
                    x: 10,
                    y: 45,
                    mountY: 0.5,
                    text: {
                        text: 'Device Info',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                    h: 30 * 1.5,
                    w: 30 * 1.5,
                    x: 1535,
                    mountX: 1,
                    y: 45,
                    mountY: 0.5,
                    src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                Reboot: {
                    y: 0+90+90+90+90+90+90+90+90 ,
                    type: SettingsMainItem,
                    Title: {
                    x: 10,
                    y: 45,
                    mountY: 0.5,
                    text: {
                        text: 'Reboot',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                    h: 30 * 1.5,
                    w: 30 * 1.5,
                    x: 1535,
                    mountX: 1,
                    y: 45,
                    mountY: 0.5,
                    src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                Reset: {
                    y: 0+90+90+90+90+90+90+90+90+90 ,
                    type: SettingsMainItem,
                    Title: {
                    x: 10,
                    y: 45,
                    mountY: 0.5,
                    text: {
                        text: 'Factory Reset',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    }
                    },
                    Button: {
                    h: 30 * 1.5,
                    w: 30 * 1.5,
                    x: 1535,
                    mountX: 1,
                    y: 45,
                    mountY: 0.5,
                    src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
            },

            DeviceInformationScreen: {
                type: DeviceInformationScreen,
                visible: false,
            },

        }

    }

    _init(){
        this.appApi = new AppApi();
        this.appApi.syncLocation().then(result => {
            console.log('from advanced settings screen syncLocation: ' + JSON.stringify(result))
        })
        this.appApi.speak().then(result => {
            console.log('from advanced settings screen speak: ' + JSON.stringify(result))
        })
        this.appApi.getlistVoices().then(result => {
            console.log('from advanced settings screen getlistVoices: ' + JSON.stringify(result))
        })
        this.appApi.getFirmwareUpdateInfo().then(result => {
            console.log('from advanced settings screen getFirmwareUpdateInfo: ' + JSON.stringify(result))
        })
        this.appApi.getFirmwareUpdateState().then(result => {
            console.log('from advanced settings screen getFirmwareUpdateState: ' + JSON.stringify(result))
        })
    }

    _focus(){
        this._setState('UIVoice')
    }

    hide(){
        this.tag('AdvanceScreenContents').visible = false
    }

    show(){
        this.tag('AdvanceScreenContents').visible = true
    }

    static _states(){
        return[
            class UIVoice extends this{
                $enter(){
                    this.tag('UIVoice')._focus()
                }
                $exit(){
                    this.tag('UIVoice')._unfocus()
                }
                _handleUp(){
                    this._setState('Reset');
                }
                _handleDown(){
                    this._setState('TTSOptions')
                }
                _handleEnter(){
                    
                }
            },
            class TTSOptions extends this{
                $enter(){
                    this.tag('TTSOptions')._focus()
                }
                $exit(){
                    this.tag('TTSOptions')._unfocus()
                }
                _handleUp(){
                    this._setState('UIVoice');
                }
                _handleDown(){
                    this._setState('CECControl')
                }
                _handleEnter(){
                    
                }
            },
            class CECControl extends this{
                $enter(){
                    this.tag('CECControl')._focus()
                }
                $exit(){
                    this.tag('CECControl')._unfocus()
                }
                _handleUp(){
                    this._setState('TTSOptions');
                }
                _handleDown(){
                    this._setState('Bug')
                }
                _handleEnter(){
                    
                }
            },
            class Bug extends this{
                $enter(){
                    this.tag('Bug')._focus()
                }
                $exit(){
                    this.tag('Bug')._unfocus()
                }
                _handleUp(){
                    this._setState('CECControl');
                }
                _handleDown(){
                    this._setState('Contact')
                }
                _handleEnter(){
                    
                }
            },
            class Contact extends this{
                $enter(){
                    this.tag('Contact')._focus()
                }
                $exit(){
                    this.tag('Contact')._unfocus()
                }
                _handleUp(){
                    this._setState('Bug');
                }
                _handleDown(){
                    this._setState('Sync')
                }
                _handleEnter(){
                    
                }
            },
            class Sync extends this{
                $enter(){
                    this.tag('Sync')._focus()
                }
                $exit(){
                    this.tag('Sync')._unfocus()
                }
                _handleUp(){
                    this._setState('Contact');
                }
                _handleDown(){
                    this._setState('Firmware')
                }
                _handleEnter(){
                    
                }
            },
            class Firmware extends this{
                $enter(){
                    this.tag('Firmware')._focus()
                }
                $exit(){
                    this.tag('Firmware')._unfocus()
                }
                _handleUp(){
                    this._setState('Sync');
                }
                _handleDown(){
                    this._setState('DeviceInfo')
                }
                _handleEnter(){
                    
                }
            },
            class DeviceInfo extends this{
                $enter(){
                    this.tag('DeviceInfo')._focus()
                }
                $exit(){
                    this.tag('DeviceInfo')._unfocus()
                }
                _handleUp(){
                    this._setState('Firmware');
                }
                _handleDown(){
                    this._setState('Reboot')
                }
                _handleEnter(){
                    this._setState('DeviceInformationScreen')
                    this.hide()
                }
            },
            class Reboot extends this{
                $enter(){
                    this.tag('Reboot')._focus()
                }
                $exit(){
                    this.tag('Reboot')._unfocus()
                }
                _handleUp(){
                    this._setState('DeviceInfo');
                }
                _handleDown(){
                    this._setState('Reset')
                }
                _handleEnter(){
                    this.appApi.reboot().then(result => {
                        console.log('from advanced settings screen reboot: ' + JSON.stringify(result))
                    }) 
                }
            },
            class Reset extends this{
                $enter(){
                    this.tag('Reset')._focus()
                }
                $exit(){
                    this.tag('Reset')._unfocus()
                }
                _handleUp(){
                    this._setState('Reboot');
                }
                _handleDown(){
                    this._setState('UIVoice')
                }
                _handleEnter(){
                    
                }
            },


            //Inner Screens Classes
            class DeviceInformationScreen extends this {
                $enter() {
                  this.tag('DeviceInformationScreen').visible = true
                  this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings / Device Info')
                }
                _getFocused() {
                  return this.tag('DeviceInformationScreen')
                }
                $exit() {
                  this.tag('DeviceInformationScreen').visible = false
                  this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings')
                }
                _handleBack() {
                  this._setState('DeviceInfo')
                  this.show()
                }
              },
        ]
    }


 }