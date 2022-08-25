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
 import { appListInfo } from "./../../static/data/AppListInfo.js";
 import { metroAppsInfo } from "./../../static/data/MetroAppsInfo.js";
 import { metroAppsInfoOffline } from "./../../static/data/MetroAppsInfoOffline.js";
 import { tvShowsInfo } from "./../../static/data/TvShowsInfo.js";
 import { sidePanelInfo } from "./../../static/data/SidePanelInfo.js";
 import { showCaseApps } from "../../static/data/LightningShowcase";
 import { appListInfoOffline } from "../../static/data/AppListInfoOffline";

/**
 * Class that returns the data required for home screen.
 */

 let IpAddress1 = "";
 let IpAddress2 = "";
 
export default class HomeApi{ 

  getOfflineMetroApps() {
    return metroAppsInfoOffline;
  }
  getTVShowsInfo() {
    return tvShowsInfo;
  }
   getSidePanelInfo() {
    return sidePanelInfo;
  }
  getAppListInfo() {
    let appsMetaData;

    if (IpAddress1 || IpAddress2) {
      appsMetaData = appListInfo;
    } else {
      appsMetaData = appListInfoOffline;
    }

    return appsMetaData;
  }

  getMetroInfo() {
    let metroAppsMetaData;

    if (IpAddress1 || IpAddress2) {
      metroAppsMetaData = metroAppsInfo;
    } else {
      metroAppsMetaData = metroAppsInfoOffline;
    }

    return metroAppsMetaData;
  }

  getShowCaseApps() {
    return showCaseApps;
  }
  getAllApps() {
    return [
      ...this.getAppListInfo(),
      ...this.getMetroInfo(),
      ...this.getShowCaseApps(),
    ];
  }
}
