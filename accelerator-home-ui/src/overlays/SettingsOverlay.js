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
 import { Lightning, Utils, Language, Router, Storage } from "@lightningjs/sdk";
 import { COLORS } from "../colors/Colors";
 import SettingsMainItem from "../items/SettingsMainItem";
 import { CONFIG } from "../Config/Config";
 import DTVApi from "../api/DTVApi";
 import AppApi from "../api/AppApi";
 
 /**
  * Class for settings screen.
  */
 export default class SettingsOverlay extends Lightning.Component {
 
   static _template() {
     return {
       Wrapper:{
         rect: true,
         color: 0xcc000000,
         w: 1920,
         h: 1080,
         visible:false,
         BreadCrumbs: {
           x: 200,
           y: 184,
           text: {
             fontSize: 40,
             text: Language.translate("settings"),
             textColor: CONFIG.theme.hex,
             fontStyle: "bolder",
             fontFace: CONFIG.language.font,
             wordWrapWidth: 1720,
             maxLines: 1,
           },
         },
         SettingsScreenContents: {
           x: 200,
           y: 275,
           NetworkConfiguration: {
             type: SettingsMainItem,
             Title: {
               x: 10,
               y: 45,
               mountY: 0.5,
               text: {
                 text: Language.translate("Network Configuration"),
                 textColor: COLORS.titleColor,
                 fontFace: CONFIG.language.font,
                 fontSize: 25,
               },
             },
             Button: {
               h: 45,
               w: 45,
               x: 1600,
               mountX: 1,
               y: 45,
               mountY: 0.5,
               src: Utils.asset("images/settings/Arrow.png"),
             },
           },
           Bluetooth: {
             y: 90,
             type: SettingsMainItem,
             Title: {
               x: 10,
               y: 45,
               mountY: 0.5,
               text: {
                 text: Language.translate("Pair Remote Control"),
                 textColor: COLORS.titleColor,
                 fontFace: CONFIG.language.font,
                 fontSize: 25,
               },
             },
             Button: {
               h: 45,
               w: 45,
               x: 1600,
               mountX: 1,
               y: 45,
               mountY: 0.5,
               src: Utils.asset("images/settings/Arrow.png"),
             },
           },
           Video: {
             y: 180,
             type: SettingsMainItem,
             Title: {
               x: 10,
               y: 45,
               mountY: 0.5,
               text: {
                 text: Language.translate("Video"),
                 textColor: COLORS.titleColor,
                 fontFace: CONFIG.language.font,
                 fontSize: 25,
               },
             },
             Button: {
               h: 45,
               w: 45,
               x: 1600,
               mountX: 1,
               y: 45,
               mountY: 0.5,
               src: Utils.asset("images/settings/Arrow.png"),
             },
           },
           Audio: {
             y: 270,
             type: SettingsMainItem,
             Title: {
               x: 10,
               y: 45,
               mountY: 0.5,
               text: {
                 text: Language.translate("Audio"),
                 textColor: COLORS.titleColor,
                 fontFace: CONFIG.language.font,
                 fontSize: 25,
               },
             },
             Button: {
               h: 45,
               w: 45,
               x: 1600,
               mountX: 1,
               y: 45,
               mountY: 0.5,
               src: Utils.asset("images/settings/Arrow.png"),
             },
           },
           OtherSettings: {
             y: 360,
             type: SettingsMainItem,
             Title: {
               x: 10,
               y: 45,
               mountY: 0.5,
               text: {
                 text: Language.translate("Other Settings"),
                 textColor: COLORS.titleColor,
                 fontFace: CONFIG.language.font,
                 fontSize: 25,
               },
             },
             Button: {
               h: 45,
               w: 45,
               x: 1600,
               mountX: 1,
               y: 45,
               mountY: 0.5,
               src: Utils.asset("images/settings/Arrow.png"),
             },
           },
           DTVSettings: {
             alpha: 0.3,
             y: 450,
             type: SettingsMainItem,
             Title: {
               x: 10,
               y: 45,
               mountY: 0.5,
               text: {
                 text: Language.translate("Live TV"),
                 textColor: COLORS.titleColor,
                 fontFace: CONFIG.language.font,
                 fontSize: 25,
               },
             },
             Button: {
               h: 45,
               w: 45,
               x: 1600,
               mountX: 1,
               y: 45,
               mountY: 0.5,
               src: Utils.asset("images/settings/Arrow.png"),
             },
           },
         },
       }
     };
   }
 
   _focus() {
     this.tag("Wrapper").visible = true;
     this._setState("NetworkConfiguration");
     this.$updatePageTitle("settings"); //use this method as fireancestor from child components to change the page title
   }
   _unfocus() {
     this.tag("Wrapper").visible = false;
   }
   _firstActive() {
     this.appApi = new AppApi();
     this.dtvApi = new DTVApi();
     this.dtvPlugin = false; //plugin availability
     this.dtvApi.activate().then((res) => {
       // if (res){
       this.dtvPlugin = true;
       this.tag("DTVSettings").alpha = 1;
       // }
     });
   }
 
   _handleBack() {
     console.log("application Type = ", Storage.get("applicationType"));
     if (Storage.get("applicationType") == "") {
       if (Router.getActiveHash() === "player") {
         Router.focusPage();
       } else {
         Router.focusPage();
         Router.navigate("menu");
       }
     } else {
       Router.focusPage();
       this.appApi.visibile("ResidentApp", false);
       this.appApi.setFocus(Storage.get("applicationType"));
     }
   }

   _handleLeft() {
    //do nothing
   }
   _handleRight() {
    //do nothing
   }
   _handleUp() {
    //do nothing
   }
   _handleDown() {
    //do nothing
   }

   $updatePageTitle(title){
    this.tag("BreadCrumbs").text.text = Language.translate(title);
   }

 
   static _states() {
     return [
       class NetworkConfiguration extends this {
         $enter() {
           this.tag("NetworkConfiguration")._focus();
         }
         $exit() {
           this.tag("NetworkConfiguration")._unfocus();
         }
         _handleDown() {
           this._setState("Bluetooth");
         }
         _handleEnter() {
           //Router.navigate("settings/network"); //change to state based implementation
         }
       },
       class Bluetooth extends this {
         $enter() {
           this.tag("Bluetooth")._focus();
         }
         $exit() {
           this.tag("Bluetooth")._unfocus();
         }
         _handleUp() {
           this._setState("NetworkConfiguration");
         }
         _handleDown() {
           this._setState("Video");
         }
         _handleLeft() {}
         _handleEnter() {
        //    Router.navigate("settings/bluetooth"); ////change to state based implementation
         }
       },
 
       class Video extends this {
         $enter() {
           this.tag("Video")._focus();
         }
         $exit() {
           this.tag("Video")._unfocus();
         }
         _handleUp() {
           this._setState("Bluetooth");
         }
         _handleDown() {
           this._setState("Audio");
         }
         _handleEnter() {
        //    Router.navigate("settings/video"); //change to state based implementation
         }
       },
 
       class Audio extends this {
         $enter() {
           this.tag("Audio")._focus();
         }
         $exit() {
           this.tag("Audio")._unfocus();
         }
         _handleUp() {
           this._setState("Video");
         }
         _handleEnter() {
        //    Router.navigate("settings/audio"); //change to state based implementation
         }
         _handleDown() {
           this._setState("OtherSettings");
         }
       },
 
       class OtherSettings extends this {
         $enter() {
           this.tag("OtherSettings")._focus();
         }
         $exit() {
           this.tag("OtherSettings")._unfocus();
         }
         _handleUp() {
           this._setState("Audio");
         }
         _handleEnter() {
        //    Router.navigate("settings/other"); //change to state based implementation
         }
         _handleDown() {
           if (this.dtvPlugin) {
             this._setState("DTVSettings");
           }
         }
       },
       class DTVSettings extends this {
         $enter() {
           this.tag("DTVSettings")._focus();
         }
         $exit() {
           this.tag("DTVSettings")._unfocus();
         }
         _handleUp() {
           this._setState("OtherSettings");
         }
         _handleEnter() {
            //change to state based implementation
        //    if (this.dtvPlugin) {
        //      Router.navigate("settings/livetv");
        //    }
           // dtvApi.activate().then(res =>{
           //   this.tag('DTVSettings.Title').text.text = 'DTV Settings: Activtion'+ res
           // })
         }
       },
     ];
   }
 }
 