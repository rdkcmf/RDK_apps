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
 import { Lightning, Language, Router } from '@lightningjs/sdk'
 import { COLORS } from '../../colors/Colors'
 import { CONFIG } from '../../Config/Config'
 import AppApi from '../../api/AppApi';
 import ThunderJS from 'ThunderJS';
 /**
  * Class for Firmware screen.
  */
 
 export default class FirmwareScreen extends Lightning.Component {
     static _template() {
         return {
             FirmwareContents: {
                 x: 200,
                 y: 270,
                 State: {
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('Firmware State: '),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 22,
                         }
                     },
                 },
                 Version: {
                     Title: {
                         x: 10,
                         y: 90,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('Firmware Versions: '),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 22,
                         }
                     },
                 },
                 DownloadedVersion: {
                     Title: {
                         x: 10,
                         y: 135,
                         mountY: 0.5,
                         text: {
                             text: Language.translate(`Downloaded Firmware Version: `),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 22,
                         }
                     },
                 },
                 DownloadedPercent: {
                     Title: {
                         x: 10,
                         y: 180,
                         mountY: 0.5,
                         text: {
                             text: "",
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 22,
                         }
                     },
                 },
                 FirmwareUpdate: {
                     RectangleDefault: {
                         x: 110, y: 200, w: 300, mountX: 0.5, h: 50, rect: true, color: CONFIG.theme.hex,
                         Update: {
                             x: 170,
                             y: 25,
                             mount: 0.5,
                             text: {
                                 text: Language.translate("Check for Update"),
                                 fontFace: CONFIG.language.font,
                                 fontSize: 24,
                             },
                         }
                     },
                 },
             },
         }
     }
 
     _firstEnable() {
 
 
         let state = ['Uninitialized', 'Requesting', 'Downloading', 'Failed', 'DownLoad Complete', 'Validation Complete', 'Preparing to Reboot']
 
         const config = {
             host: '127.0.0.1',
             port: 9998,
             default: 1,
         }
 
         const thunder = ThunderJS(config)
         const systemcCallsign = "org.rdk.System.1"
         thunder.Controller.activate({ callsign: systemcCallsign })
             .then(res => {
 
                 thunder.on(callsign, "onFirmwareUpdateStateChange", notification => {
                     console.log(`Tanjirou's notification : on Firmware update state changed notifcation = ${JSON.stringify(notification)}`);
 
                     if (state[notification.firmwareUpdateStateChange] == "Downloading") {
                         this.downloadInterval = setInterval(() => {
                             console.log(`Downloading...`);
                             this.getDownloadPercent();
                         }, 1000)
                     } else if (state[notification.firmwareUpdateStateChange] != "Downloading" && this.downloadInterval) {
                         clearInterval(this.downloadInterval);
                         this.downloadInterval = null
                     }
 
                 }, err => {
                     console.error(`error while fetching notification ie. ${err}`)
                 })
 
 
             })
             .catch(err => { console.error(`error while activating the system plugin`) })
 
     }
 
     _unfocus() {
         if (this.downloadInterval) {
             clearInterval(this.downloadInterval);
             this.downloadInterval = null
         }
     }
 
     _focus() {
         this.downloadInterval = null;
         this._appApi = new AppApi();
         const downloadState = ['Uninitialized', 'Requesting', 'Downloading', 'Failed', 'DownLoad Complete', 'Validation Complete', 'Preparing to Reboot']
         this._appApi.getFirmwareUpdateState().then(res => {
             console.log("getFirmwareUpdateState from firmware screen " + JSON.stringify(res))
             this.tag('State.Title').text.text = Language.translate("Firmware State: ") + downloadState[res.firmwareUpdateState]
         })
 
         this._appApi.getDownloadFirmwareInfo().then(res => {
             console.log("getDownloadFirmwareInfo from firmware screen " + JSON.stringify(res))
             this.tag('Version.Title').text.text = Language.translate("Firmware Versions: ") + res.currentFWVersion
         })
         this._setState('FirmwareUpdate')
     }
 
     getDownloadPercent() {
         this._appApi.getFirmwareDownloadPercent().then(res => {
             console.log(`getFirmwareDownloadPercent : ${JSON.stringify(res)}`);
             if (res.downloadPercent < 0) {
                 this.tag('DownloadedPercent.Title').text.text = "";
             }
             else {
                 this.tag('DownloadedPercent.Title').text.text = Language.translate("Download Progress: ") + res.downloadPercent + "%";
             }
 
         }).catch(err => {
             console.error(err);
         })
     }
 
     getDownloadFirmwareInfo() {
         this._appApi.updateFirmware().then(res => {
             this._appApi.getDownloadFirmwareInfo().then(result => {
                 console.log(`getDownloadFirmwareInfo : ${JSON.stringify(result.downloadFWVersion)}`);
                 this.tag('DownloadedVersion.Title').text.text = Language.translate('Downloaded Firmware Version: ') + `${result.downloadFWVersion ? result.downloadFWVersion : 'NA'}`
             }).catch(err => {
                 console.error(err);
             })
         }).catch(err => {
             console.error(err);
         })
     }
 
     static _states() {
         return [
             class FirmwareUpdate extends this{
                 _handleEnter() {
                     this.getDownloadFirmwareInfo()
                     this.getDownloadPercent()
                 }
             }
         ]
     }
 }