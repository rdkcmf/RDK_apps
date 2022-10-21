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

 import { Lightning, Router } from "@lightningjs/sdk";

//applauncher screen "will" be responsible for handling all overlays as widget and splash screens for apps(if required) | currently only handles settings overlay widget
 export default class AppLauncherScreen extends Lightning.Component {
    static _template() {
        return {
          Overlay: {
            w: 1920,
            h: 1080,
          },
        };
      }
    
      _firstEnable() {
        console.log("app-overlay is enabled for firstTime")
      }
  
      _focus() {
          console.log("app-overlay is focused");
      }
    
      _handleBack() {
          // this.widgets.settingsoverlay._handleBack();
          Router.navigate("menu");
      }
    
      _handleLeft() {
        console.log("Router History: ",Router.getHistory());
      }
      _handleRight() {
        console.log("getActiveWidget: ",Router.getActiveWidget())
      }
    
    }