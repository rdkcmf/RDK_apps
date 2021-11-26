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
import { Lightning, Utils, Storage } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS';
import MainView from '../views/MainView.js'
import SidePanel from '../views/SidePanel.js'
import TopPanel from '../views/TopPanel.js'
import SettingsScreen from './SettingsScreen.js'
import AAMPVideoPlayer from '../player/AAMPVideoPlayer.js'
import HomeApi from '../api/HomeApi.js'
import NetworkApi from '../api/NetworkApi'
import AppApi from './../api/AppApi';
import store from '../redux.js'
import { CONFIG } from '../Config/Config.js'

var powerState = 'ON';
var audio_mute = false;
var audio_volume = 50;
var appApi = new AppApi();
var last_state = ''
const config = {
  host: '127.0.0.1',
  port: 9998,
  default: 1,
};
const thunder = ThunderJS(config);

/** Class for home screen UI */
export default class HomeScreen extends Lightning.Component {
  /**
   * Function to render various elements in home screen.
   */
  static _template() {
    return {
      BackgroundImage: {
        w: 1920,
        h: 1080,
        alpha: 0,
      },
      BackgroundColor: {
        w: 1920,
        h: 1080,
        alpha: 1,
        rect: true,
        color: CONFIG.theme.background
      },

      TopPanel: {
        type: TopPanel,
      },
      View: {
        x: 0,
        y: 275,
        w: 1994,
        h: 919,
        clipping: true,
        SidePanel: {
          w: 500,
          h: 1000,
          x: 105,
          type: SidePanel,
        },
        MainView: {
          w: 1994,
          h: 919,
          type: MainView,
        },
      },
      Settings: {
        alpha: 0,
        w: 1920,
        h: 1080,
        type: SettingsScreen,
      },
      IpAddress: {
        x: 185,
        y: 1058,
        mount: 1,
        text: {
          fontFace: CONFIG.language.font,
          text: 'IP:NA',
          textColor: 0xffffffff,
          fontSize: 20,
        },
      },
      Player: { type: AAMPVideoPlayer },
    }
  }

  _init() {
    this.homeApi = new HomeApi()
    this.timer;
    this.time = 0;

    var appItems = this.homeApi.getAppListInfo()
    var data = this.homeApi.getPartnerAppsInfo()
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
    this.tag('MainView').rightArrowIcons = this.homeApi.getRightArrowInfo()
    this.tag('MainView').leftArrowIcons = this.homeApi.getLeftArrowInfo()
    this.tag('SidePanel').sidePanelItems = this.homeApi.getSidePanelInfo()

    this._setState('SidePanel')
    this.initialLoad = true
    this.networkApi = new NetworkApi()
    this.networkApi.activate().then(result => {
      if (result) {
        this.networkApi.registerEvent('onIPAddressStatusChanged', notification => {
          if (notification.status == 'ACQUIRED') {
            this.tag('IpAddress').text.text = 'IP:' + notification.ip4Address
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

  removeAndAssign() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.time) {
      this.timer = setTimeout(() => {
        last_state = this._getState();
        this.$standby('STANDBY');
      }, parseInt(this.time));
    }

  }

  $resetSleepTimer(t) {
    var arr = t.split(" ");
    if (arr.length < 2) {
      this.time = null;
    }
    else {
      var temp = arr[1].substring(0, 1);
      if (temp === 'H') {
        this.time = 1000 * 60 * 60 * parseInt(arr[0]);
      }
      else if (temp === 'M') {
        this.time = 1000 * 60 * parseInt(arr[0]);
      }
      else {
        this.time = 1000 * parseInt(arr[0]);
      }
    }
    this.removeAndAssign();
  }

  _captureKeyRelease(key) {
    if (key.keyCode == 120 || key.keyCode == 217) {
      store.dispatch({ type: 'ACTION_LISTEN_STOP' })
      //app launch code need add here.
      return true
    }
  }

  deactivateChildApp(plugin) {
    var appApi = new AppApi();
    switch (plugin) {
      case 'WebApp':
        appApi.deactivateWeb();
        break;
      case 'Cobalt':
        appApi.deactivateCobalt();
        break;
      case 'Lightning':
        appApi.deactivateLightning();
        break;
      case 'Native':
        appApi.killNative();
        break;
      case 'Amazon':
        appApi.deactivateNativeApp('Amazon');
      case 'Netflix':
        appApi.deactivateNativeApp('Netflix')
      default:
        break;
    }
  }

  _captureKey(key) {
    this.removeAndAssign();
    //console.log(" _captureKey home screen : " + key.keyCode, ` ${key.key}`)

    if (key.keyCode == 27 || key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36 || key.keyCode == 158) {
      if (Storage.get('applicationType') != '') {
        this.deactivateChildApp(Storage.get('applicationType'));
        Storage.set('applicationType', '');
        appApi.setVisibility('ResidentApp', true);
        thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
          console.log('ResidentApp moveToFront Success');
        });
        thunder
          .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
          .then(result => {
            console.log('ResidentApp moveToFront Success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      } else {
        if (this.state === 'Playing') {
          this.$stopPlayer()
        }
        else {
          this.$goToSidePanel(0)
          this.$changeHomeText('Home')
        }
      }

    }




    if (key.keyCode == 120 || key.keyCode == 217) {
      store.dispatch({ type: 'ACTION_LISTEN_START' })
      return true
    }

    if (key.keyCode == 112 || key.keyCode == 142 || key.keyCode == 116) {
      // Remote power key and keyboard F1 key used for STANDBY and POWER_ON
      if (powerState == 'ON') {
        last_state = this.state

        this.$standby('STANDBY');



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

    } else if (key.keyCode == 118 || key.keyCode == 113) {

      appApi.getConnectedAudioPorts().then(res => {
        let audio_source = res.connectedAudioPorts[0]
        let value = !audio_mute;
        new AppApi().audio_mute(value, audio_source).then(res => {
          console.log("__________AUDIO_MUTE_______________________F7")
          console.log(JSON.stringify(res, 3, null));

          if (res.success == true) {
            audio_mute = value;
            // new AppApi().zorder("moveToFront", "foreground");
            // new AppApi().setVisibility("foreground", audio_mute)
          }
          console.log("audio_mute:" + audio_mute, audio_source);
        })

      });


      return true

    } else if (key.keyCode == 175) {

      audio_volume += 10;
      if (audio_volume > 100) { audio_volume = 100 }

      let value = audio_volume;
      appApi.setVolumeLevel("HDMI0", value).then(res => {
        console.log("__________AUDIO_VOLUME_________Numberpad key plus")
        console.log(JSON.stringify(res, 3, null));
        console.log("setVolumeLevel:" + audio_volume);
      })
      return true

    } else if (key.keyCode == 174) {

      audio_volume -= 10;
      if (audio_volume < 0) { audio_volume = 0 }
      let value = "" + audio_volume;

      appApi.setVolumeLevel("HDMI0", value).then(res => {
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
      this.hide()
      this._setState('Playing')
      this.player.setVideoRect(0, 0, 1920, 1080)
    } catch (error) {
      this._setState('MainView')
      console.error('Playback Failed ' + error)
    }
  }

  /**
   * Fireancestor to set the state to main view.
   * @param {index} index index value of main view row.
   */
  $goToMainView(index) {
    this.tag('MainView').index = index
    this._setState('MainView')
  }

  /**
   * Fireancestor to set the state to main view.
   * @param {index} index index value of side view row.
   */
  $goToSidePanel(index) {
    this.tag('SidePanel').index = index
    this._setState('SidePanel')
  }

  /**
* Fireancestor to set the state to side panel.
* @param {index} index index value of Top panel item.
*/
  $goToTopPanel(index) {
    console.log('go to top panel')
    this.tag('TopPanel').index = index
    this._setState('TopPanel')
  }
  $changeBackgroundImageOnFocus(image) {

    if (image.startsWith('/images')) {
      this.tag('BackgroundImage').patch({
        src: Utils.asset(image),
      });
    } else {
      this.tag('BackgroundImage').patch({ src: image });
    }
  }

  $changeBackgroundImageOnNonFocus(image) {
    this.tag('BackgroundImage').patch({

    })
  }
  /**
     * Fireancestor to change the text on top panel.
     */
  $changeHomeText(text) {
    this.tag('TopPanel').changeText = text
  }
  /**
   * Fireancestor to set the state to player.
   */
  $goToPlayer() {
    this._setState('Player')
    this.play()
  }
  /**
     * Fireancestor to change the IP.
     */
  $changeIp(ip) {
    this.tag('IpAddress').text.text = ip
  }

  /**
   * Function to scroll
   */
  $scroll(y) {
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
    this.tag('BackgroundImage').patch({ alpha: 0 });
    this.tag('BackgroundColor').patch({ alpha: 0 });
    this.tag('MainView').patch({ alpha: 0 });
    this.tag('TopPanel').patch({ alpha: 0 });
    this.tag('SidePanel').patch({ alpha: 0 });
    this.tag('IpAddress').patch({ alpha: 0 });
  }


  /**
     * Function to show home UI.
   */
  show() {
    this.tag('BackgroundImage').patch({ alpha: 1 });
    this.tag('BackgroundColor').patch({ alpha: 1 });
    this.tag('MainView').patch({ alpha: 1 });
    this.tag('TopPanel').patch({ alpha: 1 });
    this.tag('SidePanel').patch({ alpha: 1 });
    this.tag('IpAddress').patch({ alpha: 1 });
  }

  /** this function is used to hide only the side and top panels  */
  $hideSideAndTopPanels() {
    this.tag('TopPanel').patch({ alpha: 0 });
    this.tag('SidePanel').patch({ alpha: 0 });
  }

  /** this function will show side and top panels only */
  $showSideAndTopPanels() {
    this.tag('TopPanel').patch({ alpha: 1 });
    this.tag('SidePanel').patch({ alpha: 1 });
  }

  /**
   * Fireancestor to set the state to Settings.
   */
  $goToSettings() {
    this._setState('Settings')
  }

  $stopPlayer() {
    this._setState('MainView');
    this.player.stop();
    this.show();
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
      class SidePanel extends this{
        _getFocused() {
          return this.tag('SidePanel')
        }
      },

      class MainView extends this {
        _getFocused() {
          return this.tag('MainView')
        }
      },
      class Settings extends this{
        $enter() {
          this.tag('MainView').alpha = 0
          this.tag('Settings').alpha = 1
        }
        _getFocused() {
          return this.tag('Settings')
        }
        $exit(e) {
          this.tag('MainView').alpha = 1
          this.tag('Settings').alpha = 0
        }
      },
      class Playing extends this {
        _getFocused() {
          return this.tag('Player')
        }
        // _handleKey(key) {
        //   if (key.keyCode == 27 || key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36 || key.keyCode == 158) {
        //     this.$stopPlayer()
        //   } else if (key.keyCode == 227 || key.keyCode == 179) {
        //     this.$stopPlayer()
        //     return false;
        //   }
        // }
      },
    ]
  }
}
