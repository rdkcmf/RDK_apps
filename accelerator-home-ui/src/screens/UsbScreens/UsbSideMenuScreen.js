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
import { Lightning } from '@lightningjs/sdk'
import { usbMenuInfo } from '../../../static/data/UsbMenuInfo'
import SideSettingScreen from '../SideSettingScreen.js'

/** Class for side setting screen in setting UI */
export default class UsbSideMenuScreen extends SideSettingScreen {
    static _template() {
        return {
            SideSettingScreen: {
                x: 0,
                y: 0,
                w: 620,
                h: 200,
                type: Lightning.components.ListComponent,
                roll: true,
                horizontal: false,
                invertDirection: true,
            },
        }
    }

    /**
    * Function to get details for side panel.
    */

    getSideSettingInfo() {
        return usbMenuInfo
    }

    static _states() {
        return [
            class SideSettingScreen extends this {

                _getFocused() {
                    if (this.tag('SideSettingScreen').length) {
                        this.fireAncestors('$setVisibleScreen', this.indexVal)
                        return this.tag('SideSettingScreen').items[this.indexVal]
                    }
                }

                _handleKey(key) {

                    if (key.keyCode == 39 || key.keyCode == 13) {
                        if (0 == this.indexVal) {
                            this.fireAncestors('$goToUsbVideoScreen', this.indexVal)
                        } else if (1 == this.indexVal) {
                            this.fireAncestors('$goToUsbAudioScreen', this.indexVal)
                        } else if (2 == this.indexVal) {
                            this.fireAncestors('$goToUsbImageScreen', this.indexVal)
                        }

                    } else if (key.keyCode == 40) {
                        if (this.tag('SideSettingScreen').length - 1 != this.indexVal) {
                            this.indexVal = this.indexVal + 1
                        }
                        return this.tag('SideSettingScreen').items[this.indexVal]
                    } else if (key.keyCode == 38) {
                        if (0 != this.indexVal) {
                            this.indexVal = this.indexVal - 1
                        } else if (0 == this.indexVal) {
                            this.fireAncestors('$goToUsbHomeTopPanel', this.indexVal)
                        }
                        return this.tag('SideSettingScreen').items[this.indexVal]
                    } else return false;
                }
            },
        ]
    }
}