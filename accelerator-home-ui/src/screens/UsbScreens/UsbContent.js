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
import AppListItem from '../../items/AppListItem'
import NetworkApi from '../../api/NetworkApi'

export default class UsbContent extends Lightning.Component {
    static _template() {
        return {
            Background: {
                w: 1920,
                h: 1080,
                src: Utils.asset('images/tvShows/background_new.jpg'),
            },
            UsbHomeTopPanel: {
                x: 0,
                y: 0,
                w: 1920,
                h: 171,
                Back: {
                    x: 81,
                    y: 100,
                    mountY: 0.5,
                    src: Utils.asset('/images/settings/Back_icon.png'),
                    w: 70,
                    h: 70,
                },
                IconTitle: {
                    x: 200,
                    y: 78,
                    text: { text: 'USB', fontSize: 40 },
                },
                IpAddress: {
                    x: 1840,
                    y: 115,
                    mount: 1,
                    text: {
                        text: 'IP:N/A',
                        textColor: 0xffffffff,
                        fontSize: 40,
                        w: 360,
                        h: 40,
                    },
                },
                Border: {
                    x: 81,
                    y: 171,
                    mountY: 0.5,
                    RoundRectangle: {
                        zIndex: 2,
                        texture: lng.Tools.getRoundRect(1761, 0, 0, 3, 0xffffffff, true, 0xffffffff),
                    },
                    alpha: 0.4
                }
            },
            ContentTitle:
            {
                x: 80,
                y: 220,
                text: {
                    textColor: 0xffffffff,
                    fontSize: 40,
                    w: 360,
                    h: 60,
                },
            },
            ItemList: {
                x: 80,
                y: 320,
                flex: { direction: 'row', paddingLeft: 20, wrap: false },
                type: Lightning.components.ListComponent,
                w: 1761,
                h: 300,
                itemSize: 200,
                roll: true,
                rollMax: 815,
                horizontal: true,
                itemScrollOffset: -5,
                clipping: true,
            },
        }
    }
    set contentTitle(title) {
        this.tag('ContentTitle').patch({
            text: { text: title }
        })
    }

    set itemList(items) {
        this.tag('ItemList').items = items.map(info => {
            return {
                w: 175,
                h: 175,
                type: AppListItem,
                data: info,
                focus: 1.2,
                unfocus: 1,
                x_text: 106,
                y_text: 140,
            }
        })
        this.tag('ItemList').start()
    }

    _init() {
        var networkApi = new NetworkApi()
        networkApi.getIP().then(ip => {
            this.tag('IpAddress').text.text = 'IP:' + ip
        })
    }

    static _states() {
        return [
            class ItemList extends this {
                _getFocused() {
                    if (this.tag('ItemList').length) {
                        return this.tag('ItemList').element
                    }
                }
                _handleRight() {
                    if (this.tag('ItemList').length - 1 != this.tag('ItemList').index) {
                        this.tag('ItemList').setNext()
                        return this.tag('ItemList').element
                    }
                }
                _handleLeft() {
                    if (0 != this.tag('ItemList').index) {
                        this.tag('ItemList').setPrevious()
                        return this.tag('ItemList').element
                    }
                }
                _handleDown() {
                    // console.log('handle down')
                }
                _handleUp() {
                    this._setState('Back')
                }
            },

            class Back extends this{
                $enter() {

                    console.log('enter back');
                    this.tag('Back').patch({
                        src: Utils.asset('/images/settings/back-arrow-small.png'),
                    })
                }
                _handleDown() {
                    console.log('handle down')
                    this.tag('Back').patch({
                        src: Utils.asset('/images/settings/Back_icon.png'),

                    })
                    this._setState('ItemList')
                }

                _handleKey(key) {
                    console.log(key.keyCode)
                    if (key.keyCode == 13) {
                        this.tag('Back').patch({
                            src: Utils.asset('/images/settings/Back_icon.png'),
                        })
                        this.fireAncestors('$goToSideMenubar', 2)
                        Router.navigate('settings/SettingsScreen/2', false)
                    }
                }
            },
        ]
    }
}
