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
import Error from './../screens/Error'
import HomeApi from '../api/HomeApi.js'
import SettingsScreen from '../screens/SettingsScreen'
import MainView from '../views/MainView'
import { route } from './networkRoutes'
import AAMPVideoPlayer from '../MediaPlayer/AAMPVideoPlayer'
import otherSettingsRoutes from './otherSettingsRoutes'
import audioScreenRoutes from './audioScreenRoutes'
import FailScreen from '../screens/FailScreen'
import UsbAppsScreen from '../screens/UsbAppsScreen'
import LightningPlayerControls from '../MediaPlayer/LightningPlayerControl'
import ImageViewer from '../MediaPlayer/ImageViewer'
import splashScreenRoutes from './splashScreenRoutes'
import LogoScreen from '../screens/SplashScreens/LogoScreen'
import UIList from '../views/UIList'
import AppStore from '../views/AppStore'
import detailsScreenRoutes from './detailsScreenRoutes'
import liveTvRoutes from './liveTvRoutes'
import TvOverlayScreen from '../tvOverlay/TvOverlayScreen'
import Volume from '../tvOverlay/components/Volume'
import EPGScreen from "../screens/EpgScreens/Epg"
import DTVPlayer from '../MediaPlayer/DTVPlayer'

let api = null

export default {
  boot: (queryParam) => {
    let homeApi = new HomeApi()
    homeApi.setPartnerAppsInfo(queryParam.data)
    homeApi.getAPIKey()
      .then((data) => {
        if (data.data.length > 1) {
          api = data
        }
      })
    return Promise.resolve()
  },
  // root: 'splash',
  routes: [
    ...splashScreenRoutes.splashScreenRoutes,
    ...route.network,
    ...otherSettingsRoutes.otherSettingsRoutes,
    ...audioScreenRoutes.audioScreenRoutes,
    ...detailsScreenRoutes.detailsScreenRoutes,
    ...liveTvRoutes,
    {
      path: 'settings',
      component: SettingsScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'failscreen',
      component: FailScreen,
    },
    {
      path: 'videoplayer',
      component: LightningPlayerControls,
      widgets: ['Volume']
    },
    {
      path: 'usb',
      component: UsbAppsScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'epg',
      component: EPGScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'apps',
      component: AppStore,
      widgets: ['Menu', 'Volume']
    },
    {
      path: 'usb/player',
      component: AAMPVideoPlayer,
      widgets: ['Volume']
    },
    {
      path: 'usb/image',
      component: ImageViewer,
      widgets: ['Volume']
    },
    {
      path: 'image',
      component: ImageViewer,
      widgets: ['Volume']
    },
    {
      path: 'ui',
      component: UIList,
      widgets: ['Volume']
    },
    {
      path: 'menu',
      component: MainView,
      before: (page) => {
        const homeApi = new HomeApi()
        page.tvShowItems = homeApi.getTVShowsInfo()
        // page.usbApps = homeApi.getTVShowsInfo()
        if (api) {
          page.setGracenoteData(api)
        }
        return Promise.resolve()
      },
      widgets: ['Menu', 'Fail', 'Volume'],
    },
    {
      path: 'tv-overlay/:type',
      component: TvOverlayScreen,
      options: {
        preventStorage: true,
      }
    },
    {
      path: 'overlay/volume',
      component: Volume
    },
    {
      path: 'player',
      component: AAMPVideoPlayer,
      widgets: ['Volume']
    },
    {
      path:'dtvplayer',
      component: DTVPlayer,
      widgets: ['Volume', 'TvOverlays', 'ChannelOverlay']
    },
    {
      path: '!',
      component: Error,
    },
    {
      path: '*',
      component: LogoScreen,
    },
  ],
}
