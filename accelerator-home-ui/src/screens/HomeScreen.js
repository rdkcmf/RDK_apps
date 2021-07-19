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
import { Lightning, Utils } from '@lightningjs/sdk'
import MainView from '../views/MainView.js'
import SidePanel from '../views/SidePanel.js'
import TopPanel from '../views/TopPanel.js'
import ShutdownPanel from '../views/ShutdownPanel.js'
import AAMPVideoPlayer from '../player/AAMPVideoPlayer.js'
import HomeApi from '../api/HomeApi.js'
import NetworkApi from '../api/NetworkApi'
import AppApi from './../api/AppApi';
import store from '../redux.js'

var powerState = 'ON';
var audio_mute = false;
var audio_volume = 50;
var appApi = new AppApi();
var last_state = ''

/** Class for home screen UI */
export default class HomeScreen extends Lightning.Component {
  /**
   * Function to render various elements in home screen.
   */
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset('images/tvShows/background.jpg'),
        alpha: 1,
      },
      View: {
        x: 0,
        y: 200,
        w: 1920,
        h: 1080,
        clipping: true,
        SidePanel: {
          type: SidePanel,
        },
        MainView: {
          w: 1920,
          h: 1080,
          type: MainView,
        },
      },
      IpAddress: {
        x: 1850,
        y: 1060,
        mount: 1,
        text: {
          text: 'IP:NA',
          textColor: 0xffffffff,
          fontSize: 30,
        },
      },
      Player: { type: AAMPVideoPlayer },

      ShutdownPanel: {
        type: ShutdownPanel,
        x: 660,
        y: 385,
        signals: { select: true },
        alpha: 0
      },
      TopPanel: {
        type: TopPanel,
      },
    }
  }

  _init() {
    this.homeApi = new HomeApi()
    var appItems = this.homeApi.getAppListInfo()
    var data = this.homeApi.getPartnerAppsInfo()
    console.log(data)
    var prop_apps = 'applications'
    var prop_displayname = 'displayName'
    var prop_uri = 'uri'
    var prop_apptype = 'applicationType'
    var prop_url = 'url'
    var appdetails = []
    var appdetails_format = []
    var usbApps = 0
    try {
      if (data != null && JSON.parse(data).hasOwnProperty(prop_apps)) {
        appdetails = JSON.parse(data).applications
        for (var i = 0; i < appdetails.length; i++) {
          if (
            appdetails[i].hasOwnProperty(prop_displayname) &&
            appdetails[i].hasOwnProperty(prop_uri) &&
            appdetails[i].hasOwnProperty(prop_apptype)
          ) {
            appdetails_format.push(appdetails[i])
            usbApps++
          }
        }
        for (var i = 0; i < appItems.length; i++) {
          appdetails_format.push(appItems[i])
        }
      } else {
        appdetails_format = appItems
      }
    } catch (e) {
      appdetails_format = appItems
      console.log('Query data is not proper: ' + e)
    }
    this.tag('MainView').appItems = appdetails_format
    this.tag('MainView').metroApps = this.homeApi.getMetroInfo()
    this.tag('MainView').tvShowItems = this.homeApi.getTVShowsInfo()
    this.tag('MainView').settingsItems = this.homeApi.getSettingsInfo()
    this.tag('SidePanel').sidePanelItems = this.homeApi.getSidePanelInfo()
    this.sidePanelData = this.homeApi.getSidePanelInfo()
    this._setState('SidePanel')
    this.initialLoad = true
    this.networkApi = new NetworkApi()
    this.networkApi.activate().then(result => {
      if (result) {
        this.networkApi.registerEvent('onIPAddressStatusChanged', notification => {
          if (notification.status == 'ACQUIRED') {
            this.tag('IpAddress').text.text = 'IP:' + notification.ip4Address
            location.reload(true);
          } else if (notification.status == 'LOST') {
            this.tag('IpAddress').text.text = 'IP:NA'
          }
        })
        this.networkApi.getIP().then(ip => {
          this.tag('IpAddress').text.text = 'IP:' + ip
        })
      }
    })
  }

  _captureKeyRelease(key) {
    if (key.keyCode == 120 || key.keyCode == 217) {
      store.dispatch({ type: 'ACTION_LISTEN_STOP' })
      //app launch code need add here.
      return true
    }
  }


  _captureKey(key) {
    console.log(" _captureKey home screen : " + key.keyCode)

    if (key.keyCode == 120 || key.keyCode == 217) {
      store.dispatch({ type: 'ACTION_LISTEN_START' })
      return true
    }

    if (key.keyCode == 112 || key.keyCode == 142 || key.keyCode == 116) {
      //Remote power key and keyboard F1 key used for STANDBY and POWER_ON
      if (powerState == 'ON') {
        last_state = this._getState();
        this._setState('ShutdownPanel')

        return true
      } else if (powerState == 'STANDBY') {
        appApi.standby("ON").then(res => {
          powerState = 'ON';
        })
        return true
      }

    } else if (key.keyCode == 228) {

      console.log("___________DEEP_SLEEP_______________________F12")
      appApi.standby("DEEP_SLEEP").then(res => {
        powerState = 'DEEP_SLEEP'
      })
      return true

    } else if (key.keyCode == 118 || key.keyCode == 113 || key.keyCode == 173) {

      appApi.getConnectedAudioPorts().then(res => {
        let audio_source = res.connectedAudioPorts[0]
        let value = !audio_mute;
        new AppApi().audio_mute(value, audio_source).then(res => {
          console.log("__________AUDIO_MUTE_______________________F7")
          console.log(JSON.stringify(res, 3, null));

          if (res.success == true) {
            audio_mute = value;
            new AppApi().zorder("moveToFront","foreground");
            new AppApi().setVisibility("foreground",audio_mute)
          }
          console.log("audio_mute:" + audio_mute);
        })

      });


      return true

    } else if (key.keyCode == 175) {

      audio_volume += 10;
      if (audio_volume > 100) { audio_volume = 100 }

      let value = "" + audio_volume;
      appApi.setVolumeLevel(value).then(res => {
        console.log("__________AUDIO_VOLUME_________Numberpad key plus")
        console.log(JSON.stringify(res, 3, null));
        console.log("setVolumeLevel:" + audio_volume);
      })
      return true

    } else if (key.keyCode == 174) {

      audio_volume -= 10;
      if (audio_volume < 0) { audio_volume = 0 }
      let value = "" + audio_volume;

      appApi.setVolumeLevel(value).then(res => {
        console.log("__________AUDIO_VOLUME____________Numberpad key minus")
        console.log(JSON.stringify(res, 3, null));
        console.log("setVolumeLevel:" + audio_volume);
      })
      return true
    }

    return false
  }

  _active() {
    if (this.initialLoad) {
      let home = this
      this._homeAnimation = home.animation({
        duration: 0.5,
        repeat: 0,
        stopMethod: 'immediate',
        actions: [
          { p: 'scale', v: { 0: 5, 1: 1 } },
          { p: 'x', v: { 0: -1920, 1: 0 } },
          { p: 'y', v: { 0: -1080, 1: 0 } },
        ],
      })
      this._homeAnimation.start()
      this.initialLoad = false
    }
  }

  /**
   * Function to start video playback.
   */
  play() {
    this.player = this.tag('Player')
    try {
      this.player.load({
        title: 'Parkour event',
        subtitle: 'm3u8',
        url:
          'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
        drmConfig: null,
      })
      this.zoomOut(0.1)
      this.hide()
      this._setState('Playing')
      this.player.setVideoRect(0, 0, 1920, 1080)
    } catch (error) {
      this._setState('MainView')
      console.error('Playback Failed ' + error)
    }
  }

  /**
   * Function to zoom in main view of home UI.
   */
  zoomIn(duration) {
    this._sidePanelAnimation = this.tag('SidePanel').animation({
      duration: duration,
      repeat: 0,
      stopMethod: 'immediate',
      actions: [{ p: 'x', v: { 0: 130, 1: 280 } }],
    })
    this._sidePanelAnimation.start()
    this.tag('SidePanel').resetSidePanelItems = this.sidePanelData
    let app = this
    this._appAnimation = app.animation({
      duration: duration,
      repeat: 0,
      stopMethod: 'immediate',
      actions: [
        { p: 'x', v: { 0: 0, 1: -320 } },
        { p: 'y', v: { 0: 0, 1: -180 } },
        { p: 'scale', v: { 0: 1, 1: 1.17 } },
      ],
    })
    this._appAnimation.start()
  }

  /**
   * Function to zoom out main view of home UI.
   */
  zoomOut(duration) {
    this._sidePanelAnimation = this.tag('SidePanel').animation({
      duration: duration,
      repeat: 0,
      stopMethod: 'immediate',
      actions: [{ p: 'x', v: { 0: 280, 1: 130 } }],
    })
    this._sidePanelAnimation.start()
    this.tag('SidePanel').sidePanelItems = this.sidePanelData
    let app = this
    this._appAnimation = app.animation({
      duration: duration,
      repeat: 0,
      stopMethod: 'immediate',
      actions: [
        { p: 'x', v: { 0: -320, 1: 0 } },
        { p: 'y', v: { 0: -180, 1: 0 } },
        { p: 'scale', v: { 0: 1.17, 1: 1 } },
      ],
    })
    this._appAnimation.start()
  }

  /**
   * Fireancestor to set the state to side panel.
   * @param {index} index index value of side panel item.
   */
  $goToSidePanel(index) {
    this.zoomOut(0.7)
    this.tag('SidePanel').index = index
    this._setState('SidePanel')
  }

  /**
   * Fireancestor to set the state to main view.
   * @param {index} index index value of main view row.
   */
  $goToMainView(index) {
    this.zoomIn(0.7)
    this.tag('MainView').index = index
    this._setState('MainView')
  }

  /**
   * Fireancestor to set the state to player.
   */
  $goToPlayer() {
    this._setState('Player')
    this.play()
  }

  /**
   * Function to scroll
   */
  $scroll(y) {
    this.tag('SidePanel').setSmooth('y', y, { duration: 0.5 })
    this.tag('MainView').setSmooth('y', y, { duration: 0.5 })
  }



  $standby(value) {
    if (value == 'Back') {
      this._setState(last_state)
    } else {
      if (powerState == 'ON') {
        appApi.standby(value).then(res => {
          if (res.success) {
            powerState = 'STANDBY'
          }
          this._setState(last_state);
        })
        return true
      }
    }
  }







  /**
   * Function to hide the home UI.
   */
  hide() {
    this.tag('Background').patch({ alpha: 0 })
    this.tag('MainView').patch({ alpha: 0 })
    this.tag('TopPanel').patch({ alpha: 0 })
    this.tag('SidePanel').patch({ alpha: 0 })
  }

  /**
   * Function to show home UI.
   */
  show() {
    this.tag('Background').patch({ alpha: 1 })
    this.tag('MainView').patch({ alpha: 1 })
    this.tag('TopPanel').patch({ alpha: 1 })
    this.tag('SidePanel').patch({ alpha: 1 })
  }

  /**
   * Function to define various states needed for home screen.
   */
  static _states() {
    return [
      class TopPanel extends this {
        _getFocused() {
          return this.tag('TopPanel')
        }
      },
      class SidePanel extends this {
        _getFocused() {
          return this.tag('SidePanel')
        }
      },

      class ShutdownPanel extends this {
        $enter() {
          this.tag('ShutdownPanel').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('ShutdownPanel').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('ShutdownPanel')
        }

      },


      class MainView extends this {
        _getFocused() {
          return this.tag('MainView')
        }
      },
      class Playing extends this {
        _getFocused() {
          return this.tag('Player')
        }

        stopPlayer() {
          this.zoomIn(0);
          this._setState('MainView');
          this.player.stop();
          this.show();
        }

        _handleKey(key) {
          if (key.keyCode == 27 || key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36 || key.keyCode == 158) {
            this.stopPlayer()
          } else if (key.keyCode == 227 || key.keyCode == 179) {
            this.stopPlayer()
            return false;
          }
        }
      },
    ]
  }
}
