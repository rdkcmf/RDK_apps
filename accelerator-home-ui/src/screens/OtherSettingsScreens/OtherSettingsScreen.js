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
import NetworkConfigurationScreen from './NetworkConfigurationScreen'
import RemoteControlScreen from './RemoteControlScreen'
import AdvancedSettingsScreen from './AdvancedSettingsScreen'
import PrivacyScreen from './PrivacyScreen'
 /**
  * Class for Other Settings Screen.
  */

 export default class OtherSettingsScreen extends Lightning.Component {
    static _template(){
        return {
            x:0,
            y:0,
            OtherSettingsScreenContents: {
                NetworkConfiguration: {
                    y: 0,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Network Configuration',
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
                RemoteControl: {
                    y: 90,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Remote Control',
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
                ScreenSaver: {
                    y: 180,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Screen-Saver: ',
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
                EnergySaver: {
                    y: 270,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Energy Saver: ',
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
                Theme: {
                    y: 360,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'UI Theme: ',
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
                Language: {
                    y: 450,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Language: ',
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
                Privacy: {
                    y: 540,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Privacy',
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
                AdvancedSettings: {
                    y: 630,
                    type: SettingsMainItem,
                    Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Advanced Settings',
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
            NetworkConfigurationScreen:{
                type: NetworkConfigurationScreen,
                visible:false,
            },
            RemoteControlScreen:{
                type: RemoteControlScreen,
                visible:false,
            },

            // 

            PrivacyScreen:{
                type: PrivacyScreen,
                visible:false,
            },
            AdvancedSettingsScreen: {
                type: AdvancedSettingsScreen,
                visible: false,
            },
        }
    }

    _focus(){
        this._setState('NetworkConfiguration') //can be used on init as well
    }

    hide(){
        this.tag('OtherSettingsScreenContents').visible = false
    }

    show(){
        this.tag('OtherSettingsScreenContents').visible = true
    }

    static _states() {
        return [
            class NetworkConfiguration extends this {
                $enter(){
                    this.tag('NetworkConfiguration')._focus()
                }
                $exit(){
                    this.tag('NetworkConfiguration')._unfocus()
                }
                _handleUp(){
                    this._setState('AdvancedSettings')
                }
                _handleDown(){
                    this._setState('RemoteControl')
                }
                _handleEnter(){
                    this._setState('NetworkConfigurationScreen')
                }
            },
            class RemoteControl extends this {
                $enter(){
                    this.tag('RemoteControl')._focus()
                }
                $exit(){
                    this.tag('RemoteControl')._unfocus()
                }
                _handleUp(){
                    this._setState('NetworkConfiguration')
                }
                _handleDown(){
                    this._setState('ScreenSaver')
                }
                _handleEnter(){
                    this._setState('RemoteControlScreen')
                }
            },
            class ScreenSaver extends this {
                $enter(){
                    this.tag('ScreenSaver')._focus()
                }
                $exit(){
                    this.tag('ScreenSaver')._unfocus()
                }
                _handleUp(){
                    this._setState('RemoteControl')
                }
                _handleDown(){
                    this._setState('EnergySaver')
                }
                _handleEnter(){
                    // 
                }
            },
            class EnergySaver extends this {
                $enter(){
                    this.tag('EnergySaver')._focus()
                }
                $exit(){
                    this.tag('EnergySaver')._unfocus()
                }
                _handleUp(){
                    this._setState('ScreenSaver')
                }
                _handleDown(){
                    this._setState('Theme')
                }
                _handleEnter(){
                    // 
                }
            },
            class Theme extends this {
                $enter(){
                    this.tag('Theme')._focus()
                }
                $exit(){
                    this.tag('Theme')._unfocus()
                }
                _handleUp(){
                    this._setState('EnergySaver')
                }
                _handleDown(){
                    this._setState('Language')
                }
                _handleEnter(){
                    // 
                }
            },
            class Language extends this {
                $enter(){
                    this.tag('Language')._focus()
                }
                $exit(){
                    this.tag('Language')._unfocus()
                }
                _handleUp(){
                    this._setState('Theme')
                }
                _handleDown(){
                    this._setState('Privacy')
                }
                _handleEnter(){
                    // 
                }
            },
            class Privacy extends this {
                $enter(){
                    this.tag('Privacy')._focus()
                }
                $exit(){
                    this.tag('Privacy')._unfocus()
                }
                _handleUp(){
                    this._setState('Language')
                }
                _handleDown(){
                    this._setState('AdvancedSettings')
                }
                _handleEnter(){
                    this._setState('PrivacyScreen') 
                }
            },
            class AdvancedSettings extends this {
                $enter(){
                    this.tag('AdvancedSettings')._focus()
                }
                $exit(){
                    this.tag('AdvancedSettings')._unfocus()
                }
                _handleUp(){
                    this._setState('Privacy')
                }
                _handleDown(){
                    this._setState('NetworkConfiguration')
                }
                _handleEnter(){
                    this._setState('AdvancedSettingsScreen') 
                }
            },
            class NetworkConfigurationScreen extends this {
                $enter(){
                    this.hide()
                    this.tag('NetworkConfigurationScreen').visible = true
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Network Configuration')
                }
                $exit(){
                    this.show()
                    this.tag('NetworkConfigurationScreen').visible = false
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings')
                }
                _getFocused() {
                    return this.tag('NetworkConfigurationScreen')
                  }
                _handleBack() {
                    this._setState('NetworkConfiguration')
                }
            },
            class RemoteControlScreen extends this {
                $enter(){
                    this.hide()
                    this.tag('RemoteControlScreen').visible = true
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Remote Control')
                }
                $exit(){
                    this.show()
                    this.tag('RemoteControlScreen').visible = false
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings')
                }
                _getFocused() {
                    return this.tag('RemoteControlScreen')
                  }
                _handleBack() {
                    this._setState('RemoteControl')
                }
            },


            // 
            

            class PrivacyScreen extends this {
                $enter(){
                    this.hide()
                    this.tag('PrivacyScreen').visible = true
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Privacy')
                }
                $exit(){
                    this.show()
                    this.tag('PrivacyScreen').visible = false
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings')
                }
                _getFocused() {
                    return this.tag('PrivacyScreen')
                  }
                _handleBack() {
                    this._setState('Privacy')
                }
            },

            class AdvancedSettingsScreen extends this {
                $enter(){
                    this.hide()
                    this.tag('AdvancedSettingsScreen').visible = true
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings')
                }
                $exit(){
                    this.show()
                    this.tag('AdvancedSettingsScreen').visible = false
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings')
                }
                _getFocused() {
                    return this.tag('AdvancedSettingsScreen')
                  }
                _handleBack() {
                    this._setState('AdvancedSettings')
                }
            },
        ]
    }
}