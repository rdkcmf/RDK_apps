import MainView from "../views/MainView"
import AAMPVideoPlayer from '../MediaPlayer/AAMPVideoPlayer'
import AppStore from '../views/AppStore'
import SettingsScreen from '../screens/SettingsScreen'
import { route } from './networkRoutes'
import EPGScreen from "../screens/EpgScreens/Epg"

export default {
    root:"menu",
    routes:[
      ...route.network,
          {
            path: 'menu',
            component: MainView,
            widgets: ['Menu'],
          },
          {
            path: 'player',
            component: AAMPVideoPlayer,
            widgets: ['Menu']
          },
          {
            path: 'apps',
            component: AppStore,
            widgets: ['Menu']
          },
          {
            path: 'settings',
            component: SettingsScreen,
            widgets: ['Menu'],
          },
          {
            path: 'epg',
            component: EPGScreen,
            widgets: ['Menu', 'Volume'],
          },
    ]
}