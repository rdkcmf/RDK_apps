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
import { COLORS } from '../../colors/Colors'
import { CONFIG } from '../../Config/Config'
import AppApi from '../../api/AppApi'

/**
 * Class for Video and Audio screen.
 */

export default class DeviceInformationScreen extends Lightning.Component {
    static _template() {
        return {
            DeviceInfoContents: {
                ChipSet: {
                    Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                            text: `Chipset: XXXX`,
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                },
                SerialNumber: {
                    Title: {
                        x: 10,
                        y: 45 + 35,
                        mountY: 0.5,
                        text: {
                            text: `Serial Number: XXXX`,
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                },
                Location: {
                    Title: {
                        x: 10,
                        y: 45 + 35 + 35,
                        mountY: 0.5,
                        text: {
                            text: `Location: XXXX`,
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                },
                SupportedDRM: {
                    Title: {
                        x: 10,
                        y: 45 + 35 + 35 + 35,
                        mountY: 0.5,
                        text: {
                            text: `Supported DRM & Key-System: XXXX`,
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                },
                FirmwareVersions: {
                    Title: {
                        x: 10,
                        y: 45 + 35 + 35 + 35 + 35,
                        mountY: 0.5,
                        text: {
                            text: `Firmware version: UI Version, Build Version, Timestamp`,
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                        }
                    },
                },
                AppVersions: {
                    Title: {
                        x: 10,
                        y: 45 + 35 + 35 + 35 + 35 + 45,
                        mountY: 0.5,
                        text: {
                            text: 'App Version: 3.1',
                            textColor: COLORS.titleColor,
                            fontFace: CONFIG.language.font,
                            fontSize: 25,
                            fontStyle: 'bold'
                        }
                    },
                },
            },
        }
    }

    _init(){
        this.appApi = new AppApi();
        this.appApi.systeminfo().then(result => {
            console.log('from advanced settings screen system info: ' + JSON.stringify(result))
            let ram = (result.totalram / 10**9).toFixed(2)
            this.tag('SupportedDRM.Title').text.text = `Supported DRM & Key-System: ${ram} GB`
            this.tag('SerialNumber.Title').text.text = `Serial Number: ${result.serialnumber}`
        })
        this.appApi.getLocation().then(result => {
            console.log('from advanced settings screen get location: ' + JSON.stringify(result))
            this.tag('Location.Title').text.text = `Location: ${result.city.length !== 0 ? result.city +", "+result.country : "NA" }`
        })
    }
}