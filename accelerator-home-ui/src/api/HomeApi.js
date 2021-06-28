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
import NetworkApi from '../api/NetworkApi'
import AppApi from './AppApi'
import { appListInfo } from './../../static/data/AppListInfo.js'
import { tvShowsInfo } from './../../static/data/TvShowsInfo.js'
import { settingsInfo } from './../../static/data/SettingsInfo.js'
import { sidePanelInfo } from './../../static/data/SidePanelInfo.js'
import { rightArrowInfo } from './../../static/data/RightArrowInfo.js'
import { leftArrowInfo } from './../../static/data/LeftArrowInfo.js'
import { uiInfo } from './../../static/data/UIInfo'
import { metroAppsInfo } from "./../../static/data/MetroAppsInfo.js"
import { metroAppsInfoOffline } from "./../../static/data/MetroAppsInfoOffline.js"

var partnerApps = []

/**
 * Get the ip address.
 */
var IpAddress1 = ''
var IpAddress2 = ''

var networkApi = new NetworkApi()
networkApi.getIP().then(ip => {
  IpAddress1 = ip
})

var appApi = new AppApi()
appApi.getIP().then(ip => {
  IpAddress2 = ip
})

/**
 * Class that returns the data required for home screen.
 */
export default class HomeApi {
  /**
   * Function to get details for app listing.
   */
  getAppListInfo() {
    return appListInfo
  }

  /**
   * Function to get details for tv shows listings.
   */
  getTVShowsInfo() {
    return tvShowsInfo
  }

  /**
   * Function to get details for settings listings.
   */
  getSettingsInfo() {
    return settingsInfo
  }

  /**
   * Function to get details for side panel.
   */
  getSidePanelInfo() {
    return sidePanelInfo
  }

  /**
   * Function to get details of different UI
   */
  getUIInfo() {
    return uiInfo
  }

  /**
   * Function to details of metro apps
   */
  getMetroInfo() {
    let metroAppsMetaData

    if (IpAddress1 || IpAddress2) {
      metroAppsMetaData = metroAppsInfo
    } else {
      metroAppsMetaData = metroAppsInfoOffline
    }

    return metroAppsMetaData
  }

  /**
   * Function to store partner app details.
   * @param {obj} data Partner app details.
   */
  setPartnerAppsInfo(data) {
    partnerApps = data
  }

  /**
   *Function to return partner app details.
   */
  getPartnerAppsInfo() {
    return partnerApps
  }
  /**
  * Function to details of right arrow
  */
  getRightArrowInfo() {
    return rightArrowInfo
  }
  /**
    * Function to details of left arrow
    */
  getLeftArrowInfo() {
    return leftArrowInfo
  }
}
