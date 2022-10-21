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
 import SettingsMainItem from '../../items/SettingsMainItem'
 import { COLORS } from '../../colors/Colors'
 import { CONFIG } from '../../Config/Config'
 import AppApi from '../../api/AppApi';
 /**
   * Class for Other Settings Screen.
   */
 
 var appApi = new AppApi();
 var defaultInterface = "";
 var currentInterface = [];
 export default class NetworkInfo extends Lightning.Component { 
     static _template() {
         return {
             NetworkInfoScreenContents: {
                 x: 200,
                 y: 275,
                 Status: {
                     y: 0,
                     type: SettingsMainItem,
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('Status: '),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                     Value: {
                         x: 500,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: '',
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                 },
                 ConnectionType: {
                     //alpha: 0.3, // disabled
                     y: 90,
                     type: SettingsMainItem,
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('Connection Type: '),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                     Value: {
                         x: 500,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: '',
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                 },
                 IPAddress: {
                     //alpha: 0.3, // disabled
                     y: 180,
                     type: SettingsMainItem,
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('IP Address: '),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                     Value: {
                         x: 500,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: '',
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                 },
                 Gateway: {
                     y: 270,
                     type: SettingsMainItem,
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('Gateway: '),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                     Value: {
                         x: 500,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: '',
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                 },
                 MACAddress: {
                     //alpha: 0.3, // disabled
                     y: 360,
                     type: SettingsMainItem,
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('MAC Address: '),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                     Value: {
                         x: 500,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: '',
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                 },
                 InternetProtocol: {
                     //alpha: 0.3, // disabled
                     y: 450,
                     type: SettingsMainItem,
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('Internet Protocol: '),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                     Value: {
                         x: 500,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: '',
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                 },
                 SSID: {
                     //alpha: 0.3, // disabled
                     y: 540,
                     type: SettingsMainItem,
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('SSID: '),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                     Value: {
                         x: 500,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: '',
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                 },
                 SignalStrength: {
                     //alpha: 0.3, // disabled
                     y: 630,
                     type: SettingsMainItem,
                     Title: {
                         x: 10,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: Language.translate('Signal Strength: '),
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                     Value: {
                         x: 500,
                         y: 45,
                         mountY: 0.5,
                         text: {
                             text: '',
                             textColor: COLORS.titleColor,
                             fontFace: CONFIG.language.font,
                             fontSize: 25,
                         }
                     },
                 },
             },
         }
     }
 
     getIPSetting(interfaceName) {
         appApi.getIPSetting(interfaceName)
             .then((result) => {
                 this.tag('InternetProtocol.Value').text.text = result.ipversion
             })
             .catch((err) => console.log(err))
     }
 
     _focus() {
         //Getting the default interface
         appApi.getDefaultInterface().
             then((result) => {
                 defaultInterface = result.interface;
                 this.getIPSetting(defaultInterface)
                 if (defaultInterface === "WIFI") {
                     this.tag("ConnectionType.Value").text.text = `Wireless`
                     this.tag("SSID").alpha = 1
                     this.tag("SignalStrength").alpha = 1
                 }
                 else if (defaultInterface === "ETHERNET") {
                     this.tag("ConnectionType.Value").text.text = `Ethernet`
                     this.tag("SSID").alpha = 0
                     this.tag("SignalStrength").alpha = 0
                 }
                 else {
                     this.tag("ConnectionType.Value").text.text = `NA`
                     this.tag("Status.Value").text.text = `Disconnected`
                     this.tag("IPAddress.Value").text.text = `NA`
                     this.tag("Gateway.Value").text.text = `NA`
                     this.tag("MACAddress.Value").text.text = `NA`
                 }
 
                 //Filtering the current interface
                 appApi.getInterfaces().
                     then((result) => {
                         currentInterface = result.interfaces.filter((data) => data.interface === defaultInterface)
                         //console.log(currentInterface);
                         if (currentInterface[0].connected) {
                             this.tag("Status.Value").text.text = `Connected`
                             appApi.getConnectedSSID().
                                 then((result) => {
                                     if (parseInt(result.signalStrength) >= -50) {
                                         this.tag("SignalStrength.Value").text.text = `Excellent`
                                     }
                                     else if (parseInt(result.signalStrength) >= -60) {
                                         this.tag("SignalStrength.Value").text.text = `Good`
                                     }
                                     else if (parseInt(result.signalStrength) >= -67) {
                                         this.tag("SignalStrength.Value").text.text = `Fair`
                                     }
                                     else {
                                         this.tag("SignalStrength.Value").text.text = `Poor`
                                     }
                                     this.tag("SSID.Value").text.text = `${result.ssid}`
                                 }).
                                 catch((error) => console.log(error));
 
                             appApi.getIPSetting(defaultInterface).
                                 then((result) => {
                                     this.tag('IPAddress.Value').text.text = `${result.ipaddr}`
                                     this.tag("Gateway.Value").text.text = `${result.gateway}`
                                 })
                                 .catch((error) => console.log(error));
                         }
                         else {
                             this.tag('Status.Value').text.text = `Disconnected`
                         }
                         this.tag('MACAddress.Value').text.text = `${currentInterface[0].macAddress}`
                     }).
                     catch((error) => console.log(error));
             }).
             catch((error) => console.log(error));
     }
     _unfocus() {
         this.tag('SSID.Value').text.text = 'NA'
         this.tag('SignalStrength.Value').text.text = 'NA'
         this.tag('MACAddress.Value').text.text = 'NA'
         this.tag('Gateway.Value').text.text = 'NA'
         this.tag('IPAddress.Value').text.text = 'NA'
         this.tag('ConnectionType.Value').text.text = 'NA'
         this.tag('InternetProtocol.Value').text.text = 'NA'
     }
 }