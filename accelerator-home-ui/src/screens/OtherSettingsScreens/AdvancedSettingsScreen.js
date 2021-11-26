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
import DeviceScreen from './DeviceScreen'

/**
 * Class for AdvancedSettings screen.
 */

export default class AdvanceSettingsScreen extends Lightning.Component {
    static _template() {
        return {
            x: 0,
            y: 0,
            AdvanceScreenContents: {
                UIVoice: {
                    alpha: 0.3, // disabled
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
                        h: 30 * 1.5,
                        w: 30 * 1.5,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                    },
                },
                TTSOptions: {
                    y: 90,
                    alpha: 0.3, // disabled
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
                    y: 180,
                    alpha: 0.3, // disabled
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
                    y: 270,
                    alpha: 0.3, // disabled
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
                    alpha: 0.3, // disabled
                    y: 360,
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
                Device: {
                    y: 450,
                    type: SettingsMainItem,
                    Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                            text: 'Device',
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

            DeviceScreen: {
                type: DeviceScreen,
                visible: false,
            },

        }

    }


    _focus() {
        this._setState('Device')
    }

    hide() {
        this.tag('AdvanceScreenContents').visible = false
    }

    show() {
        this.tag('AdvanceScreenContents').visible = true
    }

    static _states() {
        return [
            class UIVoice extends this{
                $enter() {
                    this.tag('UIVoice')._focus()
                }
                $exit() {
                    this.tag('UIVoice')._unfocus()
                }
                _handleUp() {
                    //this._setState('Reset');
                }
                _handleDown() {
                    //this._setState('TTSOptions')
                }
                _handleEnter() {

                }
            },
            class TTSOptions extends this{
                $enter() {
                    this.tag('TTSOptions')._focus()
                }
                $exit() {
                    this.tag('TTSOptions')._unfocus()
                }
                _handleUp() {
                    //this._setState('UIVoice');
                }
                _handleDown() {
                    //this._setState('CECControl')
                }
                _handleEnter() {

                }
            },
            class CECControl extends this{
                $enter() {
                    this.tag('CECControl')._focus()
                }
                $exit() {
                    this.tag('CECControl')._unfocus()
                }
                _handleUp() {
                    //this._setState('TTSOptions');
                }
                _handleDown() {
                    //this._setState('Bug')
                }
                _handleEnter() {

                }
            },
            class Bug extends this{
                $enter() {
                    this.tag('Bug')._focus()
                }
                $exit() {
                    this.tag('Bug')._unfocus()
                }
                _handleUp() {
                    //this._setState('CECControl');
                }
                _handleDown() {
                    //this._setState('Contact')
                }
                _handleEnter() {

                }
            },
            class Contact extends this{
                $enter() {
                    this.tag('Contact')._focus()
                }
                $exit() {
                    this.tag('Contact')._unfocus()
                }
                _handleUp() {
                    //this._setState('Bug');
                }
                _handleDown() {
                    //this._setState('Device')
                }
                _handleEnter() {

                }
            },
            class Device extends this{
                $enter() {
                    this.tag('Device')._focus()
                }
                $exit() {
                    this.tag('Device')._unfocus()
                }
                _handleUp() {
                    //this._setState('Contact');
                }
                _handleDown() {
                    //this._setState('UI Voice')
                }
                _handleEnter() {
                    this._setState('DeviceScreen')
                }
            },


            //Inner Screens Classes
            class DeviceScreen extends this {
                $enter() {
                    this.hide()
                    this.tag('DeviceScreen').visible = true
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings / Device')
                }
                _getFocused() {
                    return this.tag('DeviceScreen')
                }
                $exit() {
                    this.show()
                    this.tag('DeviceScreen').visible = false
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings')
                }
                _handleBack() {
                    this._setState('Device')
                }
            },
        ]
    }


}