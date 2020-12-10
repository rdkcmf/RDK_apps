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
import { appListInfo } from './../../static/data/AppListInfo.js'
import { tvShowsInfo } from './../../static/data/TvShowsInfo.js'
import { settingsInfo } from './../../static/data/SettingsInfo.js'
import { sidePanelInfo } from './../../static/data/SidePanelInfo.js'
import { uiInfo } from './../../static/data/UIInfo'

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
  getUIInfo() {
    return uiInfo
  }
}
