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
import SideSettinglItem from '../items/SideSettinglItem.js'
import { sideSettingInfo } from '../../static/data/SideSettingInfo'

/** Class for side setting screen in setting UI */
export default class SideSettingScreen extends Lightning.Component {
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

    _init() {
        this.sidePanelItems = this.getSideSettingInfo()
        this.indexVal = 0
    }
    _getFocused() {
        return this.tag('SideSettingScreen')
    }

    getSideSettingInfo() {
        return sideSettingInfo
    }

    _active() {
        this._setState('SideSettingScreen')
    }

    /**
     * Function to set items in side panel.
     */
    set sidePanelItems(items) {
        console.log('sidePanelItems')
        this.tag('SideSettingScreen').patch({ x: 80 })
        this.tag('SideSettingScreen').items = items.map((info, index) => {
            this.data = info
            return {
                y: index == 0 ? 282 : (index == 1 ? 331 : (index == 2 ? 382 : 0)),
                type: SideSettinglItem,
                data: info,
                focus: 1,
                unfocus: 1,
                x_text: 130,
                y_text: 35,
                text_focus: 1,
                text_unfocus: 1,
            }
        })
        this.tag('SideSettingScreen').start()
    }

    /**
     * Function to reset items in side panel.
     */
    set resetSidePanelItems(items) {
        this.tag('SideSettingScreen').patch({ x: 80 })
        this.tag('SideSettingScreen').items = items.map((info, index) => {
            return {
                y: index == 0 ? 282 : (index == 1 ? 331 : (index == 2 ? 382 : 0)),
                type: SideSettinglItem,
                data: info,
                focus: 1,
                unfocus: 1,
                x_text: 130,
                y_text: 35,
                text_focus: 1,
                text_unfocus: 1,
            }
        })
        this.tag('SideSettingScreen').start()
    }
    /**
     * Function to set scaling to side panel.
     */
    set scale(scale) {
        this.tag('SideSettingScreen').patch({ scale: scale })
    }

    /**
     * Function to set x coordinate of side panel.
     */
    set x(x) {
        this.tag('SideSettingScreen').patch({ x: x })
    }

    /**
     * Function to set index value of side panel.
     */
    set index(index) {
        this.indexVal = index
    }

    $goToSideMenubar(index) {
        this.tag('SideSettingScreen').index = index
        this._setState('SideSettingScreen')
    }

    changeItemBg(index) {
        return this.tag('SideSettingScreen').items[index].patch({
            Item: {
                texture: lng.Tools.getRoundRect(612, 121, 24, 2, 0xff121C2C, true, 0xff121C2C),
            }
        })
    }

    static _states() {
        return [
            class SideSettingScreen extends this {

                _getFocused() {
                    if (this.tag('SideSettingScreen').length) {
                        this.fireAncestors('$setVisibleSetting', this.indexVal)
                        return this.tag('SideSettingScreen').items[this.indexVal]
                    }
                }

                _handleKey(key) {
                    if (key.keyCode == 39 || key.keyCode == 13) {
                        if (0 == this.indexVal) {
                            this.fireAncestors('$goToBluetoothScreen', this.indexVal)

                            return this.changeItemBg(this.indexVal)
                        } else if (1 == this.indexVal) {
                            this.fireAncestors('$goToWiFiScreen', this.indexVal)

                            return this.changeItemBg(this.indexVal)

                        } else if (2 == this.indexVal) {
                            console.log('lauch UsbHomeScreen')

                            this.fireAncestors('$goToUsbFolders', this.indexVal)

                            return this.changeItemBg(this.indexVal)


                            // Router.navigate('UsbHomeScreen', false)
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
                            this.fireAncestors('$goToSettingsTopPanel', this.indexVal)
                        }

                        return this.tag('SideSettingScreen').items[this.indexVal]
                    } else return false;
                }
            },
        ]
    }
}
