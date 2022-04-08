import MainView from "../views/MainView"
import AAMPVideoPlayer from '../MediaPlayer/AAMPVideoPlayer'
export default {
    root:"menu",
    routes:[
          {
            path: 'menu',
            component: MainView,
          },
          {
            path: 'player',
            component: AAMPVideoPlayer
          }
    ]
}