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
import {
  Lightning,
  Utils,
  Storage
} from '@lightningjs/sdk'
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
import {
  CONFIG
} from '../Config/Config.js'
import UsbAppsScreen from './UsbAppsScreen.js';
import Keymap from '../Config/Keymap.js';
import UsbApi from '../api/UsbApi.js';

var powerState = 'ON';
var audio_mute = false;
var audio_volume = 50;
var appApi = new AppApi();
var ls = {
  last_state: 'SidePanel',
  ref: {}
}
var last_val = false

const config = {
  host: '127.0.0.1',
  port: 9998,
  default: 1,
};
const thunder = ThunderJS(config);

/** Class for home screen UI */
export default class HomeScreen extends Lightning.Component {
  /** * Function to render various elements in home screen. * @param {{ path: string; }} args */
  set params(args) {
    if (args.path === 'settings') {
      this.tag('Settings').setState = args.path 
      this._setState('Settings')
    }
  }
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
      UsbAppsScreen: {
        x: 200,
        y: 275,
        type: UsbAppsScreen,
        visible: false
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
      Player: {
        type: AAMPVideoPlayer
      },
    }
  }

  _init() {
    ls.ref = this;
    this.homeApi = new HomeApi()
    this.timerIsOff = true;

    var appItems = this.homeApi.getAppListInfo()
    var data = this.homeApi.getPartnerAppsInfo()
    var prop_apps = 'applications'
    var prop_displayname = 'displayName'
    var prop_uri = 'uri'
    var prop_apptype = 'applicationType'
    var prop_url = 'url'
    var appdetails = []
    var appdetails_format = []
    var usbAppsArr = [];
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
            usbAppsArr.push(appdetails[i])
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
    //to dynamically hide or show usb tile
    this.firstRowItems = appdetails_format
    this.tempRow = JSON.parse(JSON.stringify(this.firstRowItems));
    if (this.firstRowItems[0].uri === 'USB') {
      this.tempRow.shift()
    }
    this.USBApi = new UsbApi()
    this.tag('MainView').appItems = this.tempRow
    this.$initializeUSB()
    //--------------------
    this.tag('MainView').metroApps = this.homeApi.getMetroInfo()
    this.tag('MainView').usbApps = usbAppsArr;
    this.tag('MainView').tvShowItems = this.homeApi.getTVShowsInfo()
    this.tag('MainView').settingsItems = this.homeApi.getSettingsInfo()
    this.tag('MainView').rightArrowIcons = this.homeApi.getRightArrowInfo()
    this.tag('MainView').leftArrowIcons = this.homeApi.getLeftArrowInfo()
    this.tag('SidePanel').sidePanelItems = this.homeApi.getSidePanelInfo()
    if (usbAppsArr.length <= 0) {
      this.tag("View.SidePanel").scrollableLastRow = false
    } else {
      this.tag("View.SidePanel").scrollableLastRow = true
    }

    this._setState('SidePanel')
    this.initialLoad = true
    this.networkApi = new NetworkApi()
    this.networkApi.activate().then(result => {
      if (result) {
        this.networkApi.registerEvent('onIPAddressStatusChanged', notification => {
          if (notification.status == 'ACQUIRED') {
            this.tag('IpAddress').text.text = 'IP:' + notification.ip4Address
            //location.reload(true)
            Storage.set('ipAddress', notification.ip4Address)
          } else if (notification.status == 'LOST') {
            this.tag('IpAddress').text.text = 'IP:NA'
            Storage.set('ipAddress', null)
          }
        })
        this.networkApi.getIP().then(ip => {
          this.tag('IpAddress').text.text = 'IP:' + ip
        })
      }
    })
  }


  $initializeUSB() {
    if (Storage.get('UsbMedia') === 'ON') {
      this.USBApi.getMountedDevices().then(result => {
        if (result.mounted.length === 1) {
          this.tag('MainView').appItems = this.firstRowItems
        } else {
          this.tag('MainView').appItems = this.tempRow
        }
      })

    } else if (Storage.get('UsbMedia') === 'OFF') {
      this.tag('MainView').appItems = this.tempRow
    }
  }

  $registerUsbEvent() {
    console.log('$registerUsbEvent got called')
    const listener = thunder.on('org.rdk.UsbAccess', 'onUSBMountChanged', (notification) => {
      console.log('onUsbMountChanged notification: ', notification)
      if (Storage.get('UsbMedia') === 'ON') {
        if (!notification.mounted) { //if mounted is false
          this.tag('MainView').appItems = this.tempRow
          if (this.state === 'UsbAppsScreen') {
            this.$changeHomeText('Home')
            this.tag('UsbAppsScreen').visible = false
            this.show()
            this.tag('UsbAppsScreen').exitFunctionality()
            this.tag('MainView').patch({
              alpha: 1
            });
            this._setState('MainView')
          }
        } else if (notification.mounted) { //if mounted is true
          this.tag('MainView').appItems = this.firstRowItems
        }
      }
    })
  }

  $resetSleepTimer(t) {
    var arr = t.split(" ");

    function setTimer() {
      var temp = arr[1].substring(0, 1);
      if (temp === 'H') {
        appApi.setInactivityInterval(parseInt(arr[0]) * 60).then(res => {}).catch(err => {
          console.error(`error while setting the timer`)
        });
      } else if (temp === 'M') {
        appApi.setInactivityInterval(parseInt(arr[0])).then(res => {}).catch(err => {
          console.error(`error while setting the timer`)
        });
      }
    }

    if (arr.length < 2) {
      if (!this.timerIsOff) {
        appApi.enabledisableinactivityReporting(false).then(res => {
          if (res.success === true) {
            this.timerIsOff = true;
          }
        }).catch(err => {
          console.error(`error : unable to set the reset; error = ${err}`)
        });
      }
    } else {
      if (this.timerIsOff) {
        appApi.enabledisableinactivityReporting(true).then(res => {
          if (res.success === true) {

            this.timerIsOff = false;
            setTimer();
          }
        })
      } else {
        setTimer();
      }
    }
  }

  _captureKeyRelease(key) {
    if (key.keyCode == Keymap.F9) {
      store.dispatch({
        type: 'ACTION_LISTEN_STOP'
      })
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

    if (key.keyCode == Keymap.Escape || key.keyCode == Keymap.Home || key.keyCode === Keymap.m) {
      if (Storage.get('applicationType') != '') {
        this.deactivateChildApp(Storage.get('applicationType'));
        Storage.set('applicationType', '');
        appApi.setVisibility('ResidentApp', true);
        thunder.call('org.rdk.RDKShell', 'moveToFront', {
          client: 'ResidentApp'
        }).then(result => {
          console.log('ResidentApp moveToFront Success');
        });
        thunder
          .call('org.rdk.RDKShell', 'setFocus', {
            client: 'ResidentApp'
          })
          .then(result => {
            console.log('ResidentApp moveToFront Success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      } else {
        if (this.state === 'Playing') {
          this.$stopPlayer()
        } else if (this.state === 'UsbAppsScreen') {
          this.tag('UsbAppsScreen').visible = false
          this.tag('MainView').patch({
            alpha: 1
          });
          this._setState('MainView')
          this.$changeHomeText('Home')
        } else {
          this.$goToSidePanel(0)
          this.$changeHomeText('Home')
        }
      }

    }




    if (key.keyCode == Keymap.F9) {
      store.dispatch({
        type: 'ACTION_LISTEN_START'
      })
      return true
    }

    if (key.keyCode == Keymap.Power) {
      // Remote power key and keyboard F1 key used for STANDBY and POWER_ON
      if (powerState == 'ON') {
        ls.last_state = this.state
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

    } else if (key.keyCode == Keymap.AudioVolumeMute) {
      appApi.setVisibility("foreground", true)
      appApi.zorder('foreground')
      return true

    } else if (key.keyCode == Keymap.AudioVolumeUp) {
      appApi.setVisibility("foreground", true)
      appApi.zorder('foreground')
      return true

    } else if (key.keyCode == Keymap.AudioVolumeDown) {
      appApi.setVisibility("foreground", true)
      appApi.zorder('foreground')
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
        actions: [{
            p: 'scale',
            v: {
              0: 5,
              1: 1
            }
          },
          {
            p: 'x',
            v: {
              0: -1920,
              1: 0
            }
          },
          {
            p: 'y',
            v: {
              0: -1080,
              1: 0
            }
          },
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
        url: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
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
    this._setState('TopPanel', [index])
    this.tag('TopPanel').index = index
  }
  $changeBackgroundImageOnFocus(image) {

    if (image.startsWith('/images')) {
      this.tag('BackgroundImage').patch({
        src: Utils.asset(image),
      });
    } else {
      this.tag('BackgroundImage').patch({
        src: image
      });
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
    this.tag('MainView').setSmooth('y', y, {
      duration: 0.5
    })
  }

  $standby(value) {
    if (value == 'Back') {
      this._setState(ls.last_state)
    } else {
      if (powerState == 'ON') {
        appApi.standby(value).then(res => {
          if (res.success) {
            ls.last_state = this._getState();
            powerState = 'STANDBY'

            var appApi = new AppApi();
            if (Storage.get('applicationType') == 'WebApp' && Storage.get('ipAddress')) {
              Storage.set('applicationType', '');
              // appApi.deactivateWeb();
              appApi.suspendWeb()
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Lightning' && Storage.get('ipAddress')) {
              Storage.set('applicationType', '');
              // appApi.deactivateLightning();
              appApi.suspendLightning()
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
              Storage.set('applicationType', '');
              appApi.killNative();
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Amazon') {
              Storage.set('applicationType', '');
              appApi.suspendPremiumApp('Amazon');
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Netflix') {
              Storage.set('applicationType', '');
              appApi.suspendPremiumApp('Netflix');
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Cobalt') {
              Storage.set('applicationType', '');
              appApi.suspendCobalt();
              appApi.setVisibility('ResidentApp', true);
            } else {
              if (ls.last_state === "Playing") {
                ls.last_state = "MainView"
                this.$stopPlayer();
              } else if (ls.last_state === "UsbAppsScreen") {
                this.$goToSidePanel(0)
                this.show()
              }

            }

            thunder.call('org.rdk.RDKShell', 'moveToFront', {
              client: 'ResidentApp'
            }).then(result => {
              console.log('ResidentApp moveToFront Success' + JSON.stringify(result));
            }).catch(err => {
              console.log(`error while moving the resident app to front = ${err}`)
            });
            thunder.call('org.rdk.RDKShell', 'setFocus', {
              client: 'ResidentApp'
            }).then(result => {
              console.log('ResidentApp setFocus Success' + JSON.stringify(result));
            }).catch(err => {
              console.log('Error', err);
            });
            this._setState(ls.last_state);
          }

        })
        return true
      }
    }
  }

  $registerInactivityMonitoringEvents() {
    var self = this;
    appApi.standby('ON').then(res => {
      if (res.success) {
        powerState = 'ON'
      }
    })

    appApi.enabledisableinactivityReporting(false);

    const systemcCallsign = "org.rdk.RDKShell.1";
    thunder.Controller.activate({
        callsign: systemcCallsign
      })
      .then(res => {
        thunder.on("org.rdk.RDKShell.1", "onUserInactivity", notification => {



          if (powerState === "ON") {
            this.$standby("STANDBY");
          }





        }, err => {
          console.error(`error while inactivity monitoring , ${err}`)
        })
      }).catch((err) => {
        console.error(`error while activating the displaysettings plugin; err = ${err}`)
      })
  }




  $goToUsb() {
    this._setState('UsbAppsScreen')
  }

  $setStateMainView() {
    this._setState('MainView')
  }

  /**
   * Function to hide the home UI.
   */
  hide() {
    this.tag('BackgroundImage').patch({
      alpha: 0
    });
    this.tag('BackgroundColor').patch({
      alpha: 0
    });
    this.tag('MainView').patch({
      alpha: 0
    });
    this.tag('TopPanel').patch({
      alpha: 0
    });
    this.tag('SidePanel').patch({
      alpha: 0
    });
    this.tag('IpAddress').patch({
      alpha: 0
    });
  }


  /**
   * Function to show home UI.
   */
  show() {
    this.tag('BackgroundImage').patch({
      alpha: 1
    });
    this.tag('BackgroundColor').patch({
      alpha: 1
    });
    this.tag('MainView').patch({
      alpha: 1
    });
    this.tag('TopPanel').patch({
      alpha: 1
    });
    this.tag('SidePanel').patch({
      alpha: 1
    });
    this.tag('IpAddress').patch({
      alpha: 1
    });
  }

  $hideAllforVideo() {
    this.hide()
  }
  $showAllforVideo() {
    this.tag('BackgroundImage').patch({
      alpha: 1
    });
    this.tag('BackgroundColor').patch({
      alpha: 1
    });
    this.tag('TopPanel').patch({
      alpha: 1
    });
    this.tag('SidePanel').patch({
      alpha: 1
    });
    this.tag('IpAddress').patch({
      alpha: 1
    });
  }

  /** this function is used to hide only the side and top panels  */
  $hideSideAndTopPanels() {
    this.tag('TopPanel').patch({
      alpha: 0
    });
    this.tag('SidePanel').patch({
      alpha: 0
    });
  }

  /** this function will show side and top panels only */
  $showSideAndTopPanels() {
    this.tag('TopPanel').patch({
      alpha: 1
    });
    this.tag('SidePanel').patch({
      alpha: 1
    });
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
        $enter(e) {
          if (e.prevState === 'MainView') {
            this.tag('SidePanel').deFocus = true
          }
        }
        _getFocused() {
          return this.tag('TopPanel')
        }
      },
      class SidePanel extends this {
        _getFocused() {
          return this.tag('SidePanel')
        }
      },

      class MainView extends this {
        $enter(e) {
          if (e.prevState === 'TopPanel')
            this.tag('SidePanel').deFocus = false
        }
        _getFocused() {
          return this.tag('MainView')
        }
      },
      class UsbAppsScreen extends this {
        $enter() {
          this.$changeHomeText('USB')
          this.tag('MainView').patch({
            alpha: 0
          });
          this.tag('UsbAppsScreen').visible = true
        }
        $exit() {
          this.$changeHomeText('Home')
          this.tag('UsbAppsScreen').visible = false
          this.show()
          this.tag('UsbAppsScreen').exitFunctionality()
        }
        _getFocused() {
          return this.tag('UsbAppsScreen')
        }
        _handleBack() {
          this._setState('MainView')
        }

      },
      class Settings extends this {
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
      },
    ]
  }
}