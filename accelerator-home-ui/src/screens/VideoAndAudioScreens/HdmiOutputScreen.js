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
import VideoAndAudioItem from '../../items/VideoAndAudioItem'
import SettingsItem from '../../items/SettingsItem'
import { COLORS } from '../../colors/Colors'
import { CONFIG } from '../../Config/Config'
import AppApi from '../../api/AppApi.js';

/**
 * Class for Resolution Screen.
 */
var appApi = new AppApi();
export default class HdmiOutputScreen extends Lightning.Component {
    static _template() {
        return {
            x: 0,
            y: 0,
            HdmiOutputScreenContents: {
                List: {
                    type: Lightning.components.ListComponent,
                    w: 1920 - 300,
                    itemSize: 90,
                    horizontal: false,
                    invertDirection: true,
                    roll: true,
                },
            }
        }
    }

    $resetPrevTickObject(prevTicObject) {
        if (!this.prevTicOb) {
            this.prevTicOb = prevTicObject;
            console.log(`prevTicOb = ${this.prevTicOb}`);
        }
        else {
            this.prevTicOb.tag("Item.Tick").visible = false;
            console.log(`tried to reset the prev tickect object ie.${this.prevTicOb}`);
            this.prevTicOb = prevTicObject;
            console.log(`prevTicOb was reset to ${this.prevTicOb}`);
        }
    }


    _init() {
        var self = this;
        var tappApi = appApi;
        var options = []

        appApi.getSoundMode()
            .then(result => {
                // updating on the audio screen
                self.fireAncestors("$updateTheDefaultAudio", result.soundMode);

                // ###############  setting the audio items  ###############
                tappApi.getSupportedAudioModes()
                    .then(res => {
                        console.log(res);
                        options = [...res.supportedAudioModes]
                        this.tag('HdmiOutputScreenContents').h = options.length * 90
                        this.tag('HdmiOutputScreenContents.List').h = options.length * 90
                        this.tag('List').items = options.map((item, index) => {
                            return {
                                ref: 'Option' + index,
                                w: 1920 - 300,
                                h: 90,
                                type: VideoAndAudioItem,
                                isTicked: (result.soundMode===item)?true:false,
                                item: item,
                                videoElement: false
                            }
                        })

                    })
                    .catch(err => {
                        console.log('Some error')
                    })
                     this._setState("Options")
                    //--------------------------------------------------------

            })
            .catch(err => {
                console.log('Some error')
            })


        //options = ['Stereo', 'Auto Detect (Dolby Digital Plus)', 'Expert Mode'],
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
                    // enable the tick mark in VideoAudioItem.js
                    // this.fireAncestors('$updateResolution', "current resolution") //to update the resolution value on Video Screen
                }
            }
        ]
    }
}
