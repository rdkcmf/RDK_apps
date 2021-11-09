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
import VideoAndAudioItem from '../../items/VideoAndAudioItem'
import AppApi from '../../api/AppApi'

/**
 * Class for Resolution Screen.
 */

export default class ResolutionScreen extends Lightning.Component {
    static _template() {
        return {
            x: 0,
            y: 0,
            ResolutionScreenContents: {
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
            }
        }
    }


    _init() {
        
        var options = []
        this.appApi = new AppApi();
        var self = this;

        this.appApi.getResolution().then(resolution => {
            //#############  settings the resolution items  ################
            //------------------------------------------------------------------------------

            this.appApi.getSupportedResolutions().then(res => {
                this._setState("Options")
                options = [...res]
                this.tag('ResolutionScreenContents').h = options.length * 90
                this.tag('ResolutionScreenContents.List').h = options.length * 90
                this.tag('List').items = options.map((item, index) => {
                    
                    return {
                        ref: 'Option' + index,
                        w: 1920 - 300,
                        h: 90,
                        type: VideoAndAudioItem,
                        isTicked: (resolution === item) ? true : false,
                        item: item,
                        videoElement: true,


                    }
                })
            }).catch(err => {
                console.log(`
                    
                    Tanjirou's log - error while fetching the supported resolution ${err}
                    
                    `);
            });

            //------------------------------------------------------------------------------
        }).catch(ex => { })




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
}
