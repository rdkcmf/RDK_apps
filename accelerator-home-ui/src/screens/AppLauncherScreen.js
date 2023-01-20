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

import { Lightning, Registry, Router, Storage, Utils } from "@lightningjs/sdk";
import ThunderJS from "ThunderJS";
import AppApi from "../api/AppApi";

//applauncher screen "will" be responsible for handling all overlays as widget and splash screens for apps(if required) | currently only handles settings overlay widget
export default class AppLauncherScreen extends Lightning.Component {
  static _template() {
    return {
      Overlay: {
        w: 1920,
        h: 1080,
      },
      SplashImage: {
        w: 1920,
        h: 1080,
        x: 960,
        y: 540,
        mount: 0.5,
        src: "", 
        visible: false
      },
    };
  }

  showSplashImage(callsign){
    if(this.splashImages[callsign]){ //splash image won't be shown if the callsign and image location is mapped in this.splashImages

      //first frame event
      this.firstFrameListener = this._thunder.on("org.rdk.RDKShell", "onApplicationFirstFrame", (notification) => {
        console.log("onApplicationFirstFrame notification from applauncherscreen: ",notification)
        if(notification.client === callsign.toLowerCase()){
          console.log("firstframe event triggered hiding splash image");
          this.tag("SplashImage").src = "" 
          this.tag("SplashImage").visible = false;
          this.moveApptoFront(callsign);
          this.firstFrameListener.dispose(); //dispose listener after event is triggered for first time
        }
      })

      //to show the splash image
      this.splashTimeout && Registry.clearTimeout(this.splashTimeout)
      this.tag("SplashImage").src = Utils.asset(this.splashImages[callsign])
      this.tag("SplashImage").visible = true;

      //to hide the splash image after 30 sec in case firstframe event failed
      this.splashTimeout = Registry.setTimeout(() => {
        console.log("timeout triggered hiding splash image");
        this.tag("SplashImage").src = "" 
        this.tag("SplashImage").visible = false;
        this.moveApptoFront(callsign);
        this.firstFrameListener.dispose(); //dispose the event listener incase event did not trigger till 30s
      }, 30000)
      
    }
  }

  moveApptoFront(callsign) { //moving the launched app to front.
    console.log("moveToFront: ",callsign,"from applauncher")
    this._thunder.call("org.rdk.RDKShell", "moveToFront", {
      "client": callsign,
      "callsign": callsign
    }).catch(err => {
      console.error("failed to moveToFront : ", callsign, " ERROR: ", JSON.stringify(err), " | fail reason can be since app is already in front")
    })
  }

  _firstEnable() {
    console.log("AppLauncherScreen is enabled for firstTime");
    this.splashImages = {
      "Netflix": 'images/apps/App_Netflix_Splash.png'
    }; //mapping between callsigns and splash images
    const config = {
      host: '127.0.0.1',
      port: 9998,
      default: 1,
    };
    this._thunder = ThunderJS(config);
    this.appApi = new AppApi();
  }

  _focus() {
    console.log("AppLauncherScreen is focused");
  }

  _handleKey() {
    console.log("AppLauncherScreen is in focus, returning focus to corresponding app")
    if(Storage.get("applicationType") === "") { //if appLauncher screen is in focus while on residentApp
      this.appApi.zorder("ResidentApp");
      this.appApi.setFocus("ResidentApp");
      this.appApi.visible("ResidentApp", true);
      Router.navigate(Storage.get("lastVisitedRoute"));
    } else { //when appLauncher screen is in focus while on other apps
      let currentApp = Storage.get("applicationType");
      this.appApi.zorder(currentApp);
      this.appApi.setFocus(currentApp);
      this.appApi.visible(currentApp, true);
    }
  }
}
