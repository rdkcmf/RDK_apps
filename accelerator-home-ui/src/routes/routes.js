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
import { Storage } from '@lightningjs/sdk'


export default {
  boot: (queryParam) => {
    let homeApi = new HomeApi()
    homeApi.setPartnerAppsInfo(queryParam.data)
    return Promise.resolve()
  },
  root: () => {
    return new Promise(resolve => {
      if (Storage.get('setup')) {
        resolve('menu')
      } else {
        resolve('splash')
      }
    })
  },
  routes: [
    {
      path: 'settings',
      component: SettingsScreen,
      widgets: ['Menu'],
    },
    {
      path: 'failscreen',
      component: FailScreen,
    },
    {
      path: 'videoplayer',
      component: LightningPlayerControls,
    },
    {
      path: 'usb',
      component: UsbAppsScreen,
      widgets: ['Menu'],
    },
    {
      path: 'image',
      component: ImageViewer,
    },

    {
      path: 'menu',
      component: MainView,
      before: (page) => {
        const homeApi = new HomeApi()
        //page.appItems = homeApi.getAppListInfo()
        page.metroApps = homeApi.getMetroInfo()
        page.tvShowItems = homeApi.getTVShowsInfo()
        return Promise.resolve()
      },
      widgets: ['Menu'],
    },
    {
      path: 'player',
      component: AAMPVideoPlayer
    },
    ...route.network,
    ...otherSettingsRoutes.otherSettingsRoutes,
    ...audioScreenRoutes.audioScreenRoutes,
    ...splashScreenRoutes.splashScreenRoutes,
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
