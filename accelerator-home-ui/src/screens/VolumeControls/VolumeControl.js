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
import AppApi from '../../api/AppApi'
import { CONFIG } from '../../Config/Config'
import keyMap from '../../Config/Keymap'

export default class VolumeControl extends Lightning.Component {
    static _template() {
        return {
            Overlay: {
                zIndex: 1,
                x: 0,
                y: 0,
                Back: {
                    h: 300,
                    w: 1920,
                    rect: true,
                    color: 0xff000000,
                    alpha: 0.6,
                },
                Line: {
                    alpha: 1,
                    y: 298,
                    h: 3,
                    w: 1920,
                    rect: true,
                    color: 0xffffffff,
                },
            },
            VolumeInfo: {
                zIndex: 2,
                y: 150,
                x: 960,
                mountX: 0.5,
                mountY: 0.5,
                h: 100,
                w: 100,
                src: Utils.asset('/images/volume/Volume.png'),
                Text: {
                    x: 100,
                    y: 0,
                    text: {
                        text: '',
                        fontSize: 80,
                        fontFace: CONFIG.language.font,
                    },
                },
            },
        }
    }

    updateVolume(vol) {
        this.tag('Text').text.text = vol
    }

    set level(control) {
        if (control === keyMap.AudioVolumeUp) {
            if (this.volume < 100) {
                this.volume += 10
                this.appApi.setVolumeLevel('HDMI0', this.volume)
                this.updateVolume(this.volume)
            }
        }
        if (control === keyMap.AudioVolumeDown) {
            if (this.volume > 0) {
                this.volume -= 10
                this.appApi.setVolumeLevel('HDMI0', this.volume)
                this.updateVolume(this.volume)
            }
        }
        if (control === keyMap.AudioVolumeMute) {
            if (this.mute) {
                this.appApi.audio_mute('HDMI0', !this.mute).then(res => {
                    if (res.success) {
                        this.mute = !this.mute
                        this.updateIcon(this.mute)
                    }
                })
            } else {
                this.appApi.audio_mute('HDMI0', !this.mute).then(res => {
                    if (res.success) {
                        this.mute = !this.mute
                        this.updateIcon(this.mute)
                    }
                })
            }
        }
    }

    updateIcon(flag) {
        if (flag) {
            this.tag('VolumeInfo').src = Utils.asset('images/volume/Volume_Mute.png')
        } else {
            this.tag('VolumeInfo').src = Utils.asset('images/volume/Volume.png')
        }
    }

    _init() {
        this.mute = false
        this.volume = 0
        this.appApi = new AppApi()
        this.appApi.getConnectedAudioPorts().then(res => {
            this.appApi.getVolumeLevel(res.connectedAudioPorts[0]).then(res1 => {
                this.appApi.muteStatus(res.connectedAudioPorts[0]).then(result => {
                    this.mute = result.muted
                })
                if (res1) {
                    this.volume = parseInt(res1.volumeLevel)
                    this.updateVolume(this.volume)
                }
            })
        })
    }
}
