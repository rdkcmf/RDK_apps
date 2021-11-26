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
import AppApi from '../../api/AppApi';
import EnergySavingsItem from '../../items/EnergySavingsItem'



export default class EnergySavingsScreen extends Lightning.Component {
    static _template() {
        return {
            EnerygySavingContents: {
                List: {
                    type: Lightning.components.ListComponent,
                    w: 1920 - 300,
                    itemSize: 90,
                    horizontal: false,
                    invertDirection: true,
                    roll: true,
                    rollMax: 900,
                    itemScrollOffset: -6,
                },
            },
        }
    }

    $resetPrevTickObject(prevTicObject) {
        if (!this.prevTicOb) {
            this.prevTicOb = prevTicObject;

        }
        else {
            this.prevTicOb.tag("Item.Tick").visible = false;

            this.prevTicOb = prevTicObject;

        }
    }

    static _states() {
        return [
            class Options extends this{
                _getFocused() {
                    return this.tag('List').element
                }
                _handleDown() {
                    this.tag('List').setNext()
                }
                _handleUp() {
                    this.tag('List').setPrevious()
                }
                _handleEnter() {
                    // this.tag("List").element.patch({ "Item.Tick.visible": true });
                    this.tag("List").element.tag("Tick").visible = true;
                    // enable the tick mark in VideoAudioItem.js
                    //to update the resolution value on Video Screen
                }
            }
        ]
    }
    _focus() {
        this._appApi = new AppApi();
        this._setState("Options")
        const options = ["Deep Sleep", "Light Sleep"]
        this.tag('EnerygySavingContents').h = options.length * 90
        this.tag('EnerygySavingContents.List').h = options.length * 90
        var standbyMode = ""
        this._appApi.getPreferredStandbyMode().then(result => {
            if (result.preferredStandbyMode == "LIGHT_SLEEP") {
                standbyMode = "Light Sleep"
            } else if (result.preferredStandbyMode == "DEEP_SLEEP") {
                standbyMode = "Deep Sleep"
            }

            this.tag('List').items = options.map((item, index) => {

                return {
                    ref: 'Option' + index,
                    w: 1920 - 300,
                    h: 90,
                    type: EnergySavingsItem,
                    isTicked: (standbyMode === item) ? true : false,
                    item: item,
                    energyItem: true,

                }
            })
        })
    }
}