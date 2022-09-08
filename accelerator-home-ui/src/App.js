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
import { Utils, Router, Storage } from '@lightningjs/sdk';
import ThunderJS from 'ThunderJS';
import routes from './routes/routes';
import AppApi from '../src/api/AppApi.js';
import XcastApi from '../src/api/XcastApi';
import { CONFIG, availableLanguages } from './Config/Config';
import Keymap from './Config/Keymap';
import Menu from './views/Menu'
import Failscreen from './screens/FailScreen';
import { keyIntercept } from './keyIntercept/keyIntercept';
import HDMIApi from './api/HDMIApi';
import Volume from './tvOverlay/components/Volume';
import DTVApi from './api/DTVApi';
import TvOverlayScreen from './tvOverlay/TvOverlayScreen';
import ChannelOverlay from './MediaPlayer/ChannelOverlay';

const config = {
  host: '127.0.0.1',
  port: 9998,
  default: 1,
};
var powerState = 'ON';
var thunder = ThunderJS(config);
var appApi = new AppApi();
var dtvApi = new DTVApi();


export default class App extends Router.App {
  static getFonts() {
    return [{ family: CONFIG.language.font, url: Utils.asset('fonts/' + CONFIG.language.fontSrc) }];
  }
  _setup() {
    Router.startRouter(routes, this);
    document.onkeydown = e => {
      if (e.keyCode == Keymap.Backspace) {
        e.preventDefault();
      }
    };

    function updateAddress() {
      if (window.navigator.onLine) {
        console.log(`is online`);
      }
      else {
        Storage.set("ipAddress", null);
        console.log(`is offline`)
      }
    }
    window.addEventListener("offline", updateAddress)
  }

  static _template() {
    return {
      Pages: {
        // this hosts all the pages
        forceZIndexContext: true
      },
      Widgets: {
        Menu: {
          type: Menu
        },
        Fail: {
          type: Failscreen,
        },
        Volume: {
          type: Volume
        },
        TvOverlays: {
          type: TvOverlayScreen
        },
        ChannelOverlay: {
          type: ChannelOverlay
        }
      }
    }
  }

  static language() {
    return {
      file: Utils.asset('language/language-file.json'),
      language: CONFIG.language.id
    }
  }

  _captureKey(key) {
    console.log(key, key.keyCode)
    if (key.keyCode == Keymap.Escape || key.keyCode == Keymap.Home || key.keyCode === Keymap.m) {
      if (Storage.get('applicationType') != '') {
        this.deactivateChildApp(Storage.get('applicationType'));
        Storage.set('applicationType', '');
        if (!Router.isNavigating()) {
          Router.navigate("menu")
        }

        appApi.setVisibility('ResidentApp', true);

        if (Router.getActiveHash().startsWith("tv-overlay") || Router.getActiveHash().startsWith("overlay")) {
          Router.navigate('menu');
        }

      } else {
        if (!Router.isNavigating()) {
          if (Router.getActiveHash() === "dtvplayer") { //exit scenario for dtv player
            dtvApi
              .exitChannel()
              .then((res) => {
                console.log("exit channel: ", JSON.stringify(res));
              })
              .catch((err) => {
                console.log("failed to exit channel: ", JSON.stringify(err));
              });
            if (Router.getActiveWidget()) {
              Router.getActiveWidget()._setState("IdleState");
            }
          }
          Router.navigate('menu');
        }
      }
      return true

    }

    if (key.keyCode == Keymap.Inputs_Shortcut) { //for inputs overlay
      if (Storage.get("applicationType") !== "") {
        if (Router.getActiveHash() === "tv-overlay/inputs") {
          Router.reload();
        } else {
          Router.navigate("tv-overlay/inputs", false);
        }
        // appApi.setVisibility('ResidentApp', true);
        thunder.call('org.rdk.RDKShell', 'moveToFront', {
          client: 'ResidentApp'
        }).then(result => {
          appApi.setVisibility('ResidentApp', true); //#requiredChange
          console.log('ResidentApp moveToFront Success');
          thunder
            .call("org.rdk.RDKShell", "setFocus", {
              client: 'ResidentApp'
            })
            .then((result) => {
              console.log("residentApp setFocus Success");
            })
            .catch((err) => {
              console.log("Error", err);
            });
        });
      } else {
        if (Router.getActiveHash() === "dtvplayer") {
          Router.focusWidget('TvOverlays');
          Router.getActiveWidget()._setState("OverlayInputScreen")
        }
      }
      return true
    }
    if (key.keyCode == Keymap.Picture_Setting_Shortcut) { //for video settings overlay
      if (Storage.get("applicationType") !== "") {
        if (Router.getActiveHash() === "tv-overlay/settings") {
          Router.reload();
        } else {
          Router.navigate("tv-overlay/settings", false);
        }
        // appApi.setVisibility('ResidentApp', true);
        thunder.call('org.rdk.RDKShell', 'moveToFront', {
          client: 'ResidentApp'
        }).then(result => {
          appApi.setVisibility('ResidentApp', true); //#requiredChange
          console.log('ResidentApp moveToFront Success');
          thunder
            .call("org.rdk.RDKShell", "setFocus", {
              client: 'ResidentApp'
            })
            .then((result) => {
              console.log("Resident App setFocus Success");
            })
            .catch((err) => {
              console.log("Error", err);
            });
        });
      } else {
        if (Router.getActiveHash() === "dtvplayer") {
          Router.focusWidget('TvOverlays');
          Router.getActiveWidget()._setState("OverlaySettingsScreen")
        }
      }
      return true;
    }

    if (key.keyCode == Keymap.Settings_Shortcut) {
      Router.navigate('settings')
      if (Storage.get("applicationType") !== "") {
        appApi.zorder('ResidentApp')
        appApi.setFocus("ResidentApp")
        if (Router.isNavigating()) {
          setTimeout(function () {
            appApi.setVisibility("ResidentApp", true)
          }, 0)
        }
        else {
          appApi.setVisibility("ResidentApp", true)
          appApi.setFocus("ResidentApp")
          appApi.zorder('residentApp')
        }
      }
      return true
    }
    if (key.keyCode == Keymap.Guide_Shortcut) {
      Router.navigate('epg')
      return true
    }
    if (key.keyCode == Keymap.Amazon) {
      this.activateChildApp('Amazon')
      return true
    }
    if (key.keyCode == Keymap.Youtube) {
      Storage.set('applicationType', 'Cobalt');
      appApi.launchCobalt('').catch(() => { })
      appApi.setVisibility('ResidentApp', false);
      return true
    }
    if (key.keyCode == Keymap.Netflix) {
      this.$initLaunchPad().then(() => { }).catch(() => { })
      return true
    }

    if (key.keyCode == Keymap.Power) {
      // Remote power key and keyboard F1 key used for STANDBY and POWER_ON
      if (powerState == 'ON') {
        this.standby('STANDBY');
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
      if (Storage.get('applicationType') !== '') {
        let activePage = Router.getActiveRoute()
        if (activePage !== 'overlay/volume') {
          Router.navigate('overlay/volume', { flag: true, route: activePage })
          this._moveToFront()
        } else {
          this._moveToFront()
          let page = Router.getActivePage()
          page.onVolumeMute()
        }
      }
      else {
        if (Router.getActiveWidget()) {
          let page = Router.getActiveWidget()
          page.onVolumeMute()
        }
        Router.focusWidget('Volume')
      }
      return true

    } else if (key.keyCode == Keymap.AudioVolumeUp) {
      if (Storage.get('applicationType') !== '') {
        let activePage = Router.getActiveRoute()
        if (activePage !== 'overlay/volume') {
          Router.navigate('overlay/volume', { flag: true, route: activePage })
          this._moveToFront()
        } else {
          this._moveToFront()
          let page = Router.getActivePage()
          page.onVolumeKeyUp()
        }
      }
      else {
        if (Router.getActiveWidget()) {
          let page = Router.getActiveWidget()
          page.onVolumeKeyUp()
        }
        Router.focusWidget('Volume')
      }
      return true

    } else if (key.keyCode == Keymap.AudioVolumeDown) {
      if (Storage.get('applicationType') !== '') {
        let activePage = Router.getActiveRoute()
        if (activePage !== 'overlay/volume') {
          Router.navigate('overlay/volume', { flag: true, route: activePage })
          this._moveToFront()
        } else {
          this._moveToFront()
          let page = Router.getActivePage()
          page.onVolumeKeyDown()
        }
      }
      else {
        if (Router.getActiveWidget()) {
          let page = Router.getActiveWidget()
          page.onVolumeKeyDown()
        }
        Router.focusWidget('Volume')
      }
      return true
    }
    return false
  }

  _moveToFront() {
    appApi.setVisibility('ResidentApp', true)
    appApi.zorder('residentApp')
  }

  $registerHide(h) {
    this.setPanelsVisibility = h;
  }

  _init() {
    if (Storage.get("applicationType") !== "HDMI") { //to default to hdmi, if previous input was hdmi
      Storage.set('applicationType', '');//to set the application type to none
    }
    appApi.enableDisplaySettings().catch(err => { })
    appApi.cobaltStateChangeEvent()
    this.xcastApi = new XcastApi();
    this.xcastApi.activate().then(result => {
      if (result) {
        this.registerXcastListeners()
      }
    })
    keyIntercept()
    if (!availableLanguages.includes(localStorage.getItem('Language'))) {
      localStorage.setItem('Language', 'English')
    }
    thunder.on('Controller.1', 'all', noti => {
      if (noti.data.url && noti.data.url.slice(-5) === "#boot") { // to exit metro apps by pressing back key
        this.deactivateChildApp(Storage.get('applicationType'));
      }
    })


    thunder.on('org.rdk.RDKShell', 'onApplicationDisconnected', notification => {
      console.log("onApplicationDisconnectedNotification: ", JSON.stringify(notification))
      if (notification.client === "lightning" || notification.client === "htmlapp") {
        console.log("lightning/webapp app disconnected | bringing resident app in focus")
        if (Router.getActiveHash().startsWith("tv-overlay") || Router.getActiveHash().startsWith("overlay") || Router.getActiveHash().startsWith("settings")) {
          console.log("navigating to homescreen")
          Router.navigate("menu")
        }
        Storage.set('applicationType', '');
        appApi.setVisibility('ResidentApp', true);
        appApi.setFocus("ResidentApp");

        thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
          console.log('ResidentApp moveToFront Success' + JSON.stringify(result));
        });
      }
    })

    thunder.on('Controller', 'statechange', notification => {
      // get plugin status
      console.log(`STATECHANGE 2 : `)
      console.log(JSON.stringify(notification))
      if ((notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'Lightning') && notification.state == 'Deactivation') {
        console.log(`${notification.callsign} status = ${notification.state}`)
        if (Router.getActiveHash().startsWith("tv-overlay") || Router.getActiveHash().startsWith("overlay") || Router.getActiveHash().startsWith("settings")) { //navigate to homescreen if route is tv-overlay when exiting from any app
          console.log("navigating to homescreen")
          Router.navigate("menu")
        }
        Storage.set('applicationType', '');
        appApi.setVisibility('ResidentApp', true);
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
        thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
          console.log('ResidentApp moveToFront Success' + JSON.stringify(result));
        });
      }
      if (notification && (notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'Lightning' || notification.callsign === 'Netflix') && notification.state == 'Deactivated') {
        this.setPanelsVisibility()
        console.log(`${notification.callsign} status = ${notification.state}`)
        if (Router.getActiveHash().startsWith("tv-overlay") || Router.getActiveHash().startsWith("overlay") || Router.getActiveHash().startsWith("settings")) { //navigate to homescreen if route is tv-overlay when exiting from any app
          console.log("navigating to homescreen")
          Router.navigate("menu")
        }
        Storage.set('applicationType', '');
        appApi.setVisibility('ResidentApp', true);
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
        thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
          console.log('ResidentApp moveToFront Success' + JSON.stringify(result));
        });

      }
      if (notification && (notification.callsign === 'org.rdk.HdmiCec_2' && notification.state === 'Activated')) {
        this.advanceScreen = Router.activePage()
        if (typeof this.advanceScreen.performOTPAction === 'function') {
          console.log('otp action')
          this.advanceScreen.performOTPAction()
        }
      }

      if (notification && (notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'Lightning' || notification.callsign === 'Netflix') && notification.state == 'Activated') {
        Storage.set('applicationType', notification.callsign)
        if (notification.callsign === 'Netflix') {
          appApi.getNetflixESN()
            .then(res => {
              Storage.set('Netflix_ESN', res)
            })
          thunder.on('Netflix', 'notifyeventchange', notification => {
            console.log(`NETFLIX : notifyEventChange notification = `, JSON.stringify(notification));
            if (notification.EventName === "rendered") {
              Router.navigate('menu')
              appApi.visibile('ResidentApp', false);
            }
            if (notification.EventName === "requestsuspend") {
              this.deactivateChildApp('Netflix')
            }
            if (notification.EventName === "updated") {
              appApi.getNetflixESN()
                .then(res => {
                  Storage.set('Netflix_ESN', res)
                })
            }
          })
        } else {
          appApi.setFocus(notification.callsign)
        }
      }
    });


  }

  activateChildApp(plugin) {
    fetch('http://127.0.0.1:9998/Service/Controller/')
      .then(res => res.json())
      .then(data => {
        data.plugins.forEach(element => {
          if (element.callsign === plugin) {
            Storage.set('applicationType', plugin);
            appApi.launchPremiumApp(plugin).catch(() => { });
            appApi.setVisibility('ResidentApp', false);
          }
        });
        console.log('launching app')
      })
      .catch(err => {
        console.log(`${plugin} not available`, err)
      })
  }

  deactivateChildApp(plugin) {
    switch (plugin) {
      case 'WebApp':
        appApi.deactivateWeb();
        break;
      case 'Cobalt':
        appApi.suspendPremiumApp("Cobalt").then(res => {
          if (res) {
            let params = { applicationName: "YouTube", state: 'suspended' };
            this.xcastApi.onApplicationStateChanged(params).catch(err => { console.error(err) });
          }
          console.log(`Cobalt : suspend cobalt request`);
        }).catch((err) => {
          console.error(err)
        });
        break;
      case 'Lightning':
        appApi.deactivateLightning();
        break;
      case 'Native':
        appApi.killNative();
        break;
      case 'Amazon':
        appApi.suspendPremiumApp('Amazon').then(res => {
          if (res) {
            let params = { applicationName: "AmazonInstantVideo", state: 'suspended' };
            this.xcastApi.onApplicationStateChanged(params);
          }
        });
        break;
      case 'Netflix':
        appApi.suspendPremiumApp('Netflix').then(res => {
          thunder.call('org.rdk.RDKShell', 'setFocus', { client: "ResidentApp" })
          if (res) {
            let params = { applicationName: "NetflixApp", state: 'suspended' };
            this.xcastApi.onApplicationStateChanged(params);
          }
        })
        break;
      case 'HDMI':
        new HDMIApi().stopHDMIInput()
        Storage.set("_currentInputMode", {});
        break;
      default:
        break;
    }
  }

  $initLaunchPad(url) {

    return new Promise((resolve, reject) => {
      appApi.getPluginStatus('Netflix')
        .then(result => {
          console.log(`netflix plugin status is :`, JSON.stringify(result));
          console.log(`netflix plugin status is :`, result);

          if (result[0].state === 'deactivated' || result[0].state === 'deactivation') {

            Router.navigate('image', { src: Utils.asset('images/apps/App_Netflix_Splash.png') })
            if (url) {
              appApi.configureApplication('Netflix', url).then(() => {
                appApi.launchPremiumApp("Netflix").then(res => { resolve(true) }).catch(err => { reject(false) });// ie. org.rdk.RDKShell.launch
              }).catch(err => {
                console.error("Netflix : error while fetching configuration data : ", JSON.stringify(err))
                reject(err)

              })// gets configuration object and sets configuration

            }
            else {
              appApi.launchPremiumApp("Netflix").then(res => { resolve(true) }).catch(err => { reject(false) });// ie. org.rdk.RDKShell.launch
            }

          }
          else {
            /* Not in deactivated; could be suspended */
            if (url) {
              appApi.launchPremiumApp("Netflix").then(res => {
                thunder.call("Netflix", "systemcommand",
                  { "command": url })
                  .then(res => {

                  }).catch(err => {
                    console.error("Netflix : error while sending systemcommand : ", JSON.stringify(err))
                    reject(false);
                  });
                resolve(true)
              }).catch(err => { reject(false) });// ie. org.rdk.RDKShell.launch
            }
            else {
              appApi.launchPremiumApp("Netflix").then(res => {
                console.log(`Netflix : launch premium app resulted in `, JSON.stringify(res));
                resolve(true)
              });
            }

          }
        })
        .catch(err => {
          console.log('Netflix plugin error', err)
          Storage.set('applicationType', '')
          reject(false)
        })
    })

  }

  /**
   * Function to register event listeners for Xcast plugin.
   */
  registerXcastListeners() {
    this.xcastApi.registerEvent('onApplicationLaunchRequest', notification => {
      console.log('Received a launch request ' + JSON.stringify(notification));

      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName);
        if (applicationName == 'Amazon') {
          this.deactivateChildApp(Storage.get('applicationType'));
          appApi.launchPremiumApp('Amazon').catch(() => { });
          Storage.set('applicationType', 'Amazon');
          appApi.setVisibility('ResidentApp', false);
          let params = { applicationName: notification.applicationName, state: 'running' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName == 'Netflix') {

          let url = notification.parameters.url;
          let pApp = Storage.get('applicationType');
          this.$initLaunchPad(url).then(res => {
            console.log(`Netflix : storage has been set for netflix`);
            Storage.set('applicationType', 'Netflix');
            this.deactivateChildApp(pApp);
            let params = { applicationName: notification.applicationName, state: 'running' };
            this.xcastApi.onApplicationStateChanged(params);
          }).catch(() => { })

        } else if (applicationName == 'Cobalt') {
          if (Storage.get('applicationType') != 'Cobalt') {
            this.deactivateChildApp(Storage.get('applicationType'));
          }

          appApi.getPluginStatus('Cobalt')
            .then(() => {
              appApi.launchCobalt(notification.parameters.url + '&inApp=true').catch(() => { });
              Storage.set('applicationType', 'Cobalt');
              appApi.setVisibility('ResidentApp', false);
              let params = {
                applicationName: notification.applicationName,
                state: 'running',
              };
              this.xcastApi.onApplicationStateChanged(params);
            })
            .catch(() => {
              console.log('Failed to launch Cobalt using xcast')
            })
        }
      }
    });

    this.xcastApi.registerEvent('onApplicationHideRequest', notification => {
      console.log('Received a hide request ' + JSON.stringify(notification));
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName);
        console.log('Hide ' + this.xcastApps(notification.applicationName));
        if (applicationName === 'Amazon') {
          appApi.suspendPremiumApp('Amazon');
          let params = { applicationName: notification.applicationName, state: 'suspended' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName === 'Netflix') {
          appApi.suspendPremiumApp('Netflix');
          let params = { applicationName: notification.applicationName, state: 'suspended' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName === 'Cobalt') {
          this.deactivateChildApp("Cobalt")
          let params = { applicationName: notification.applicationName, state: 'suspended' };
          console.log(`Event : On hide request, updating application Status to `, params);
          this.xcastApi.onApplicationStateChanged(params);
        }


        Storage.set('applicationType', '');
        appApi.setVisibility('ResidentApp', true);// this will set visibility and focus for the given client
        thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
          console.log('ResidentApp moveToFront Success');
        });
      }
    });
    this.xcastApi.registerEvent('onApplicationResumeRequest', notification => {
      console.log('Received a resume request ' + JSON.stringify(notification));
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName);
        console.log('Resume ' + this.xcastApps(notification.applicationName));

        if (applicationName == 'Amazon') {
          this.deactivateChildApp(Storage.get('applicationType'));
          appApi.launchPremiumApp('Amazon').catch(() => { });
          Storage.set('applicationType', 'Amazon');
          // appApi.setVisibility('ResidentApp', false);
          let params = { applicationName: notification.applicationName, state: 'running' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName == 'Netflix') {

          let url = notification.parameters.url ? notification.parameters.url : false;
          let papp = Storage.get('applicationType');
          this.$initLaunchPad(url).then(() => {
            this.deactivateChildApp(papp);
            Storage.set('applicationType', 'Netflix');
            // appApi.setVisibility('ResidentApp', false);
            let params = { applicationName: notification.applicationName, state: 'running' };
            this.xcastApi.onApplicationStateChanged(params);
          }).catch(err => { })

        } else if (applicationName == 'Cobalt') {
          this.deactivateChildApp(Storage.get('applicationType'));
          appApi.launchCobalt('').catch(() => { });
          Storage.set('applicationType', 'Cobalt');
          // appApi.setVisibility('ResidentApp', false);
          let params = { applicationName: notification.applicationName, state: 'running' };
          this.xcastApi.onApplicationStateChanged(params);
        }
      }
    });
    this.xcastApi.registerEvent('onApplicationStopRequest', notification => {
      console.log('Received an xcast stop request ' + JSON.stringify(notification));
      console.log('Received a stop request ' + JSON.stringify(notification));
      if (this.xcastApps(notification.applicationName)) {
        console.log('Stop ' + this.xcastApps(notification.applicationName));
        let applicationName = this.xcastApps(notification.applicationName);

        if (applicationName === 'Amazon') {
          appApi.deactivateNativeApp('Amazon');
          Storage.set('applicationType', '');

          let params = { applicationName: notification.applicationName, state: 'stopped' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName === 'Netflix') {


          appApi.getPluginStatus('Netflix')
            .then(result => {
              console.log(`netflix plugin status is :`, JSON.stringify(result));
              if (result[0].state != 'deactivated') {

                appApi.deactivateNativeApp('Netflix');
                Storage.set('applicationType', '');

                let params = { applicationName: notification.applicationName, state: 'stopped' };
                this.xcastApi.onApplicationStateChanged(params);

              }
              else {
                console.log(`Netflix : application is already in deactivated state, hence skipping deactivation`);
              }
            }).catch(err => { console.error("Netflix : error while fetching plugin status", JSON.stringify(err)) })



        } else if (applicationName === 'Cobalt') {
          appApi.deactivateCobalt();
          Storage.set('applicationType', '');

          let params = { applicationName: notification.applicationName, state: 'stopped' };
          this.xcastApi.onApplicationStateChanged(params);
        }
      }
    });
    this.xcastApi.registerEvent('onApplicationStateRequest', notification => {
      // console.log('onApplicationStateRequest : ');
      // console.log(JSON.stringify(notification))
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName);
        let params = { applicationName: notification.applicationName, state: 'stopped' };

        appApi.registerEvent('statechange', results => {
          if (results.callsign === applicationName && results.state === 'Activated') {
            params.state = 'running'
            Storage.set("applicationType", results.callsign)
          }
          else if (results.state === 'Deactivation') {
            params.state = "stopped"
          }
          else if (results.state = "Activation") {
            // params.state = "running"
          }
          else if (results.state = "Resumed") {
            params.state = "running"
          }
          else if (results.state == 'suspended') {
            params.state = 'suspended';
          }
          console.log(`STATE CHANGED : `);
          console.log(results);
          this.xcastApi.onApplicationStateChanged(params);
          console.log('State of ' + this.xcastApps(notification.applicationName))
        })

      }
    });
  }

  /**
   * Function to get the plugin name for the application name.
   * @param {string} app App instance.
   */
  xcastApps(app) {
    if (Object.keys(XcastApi.supportedApps()).includes(app)) {
      return XcastApi.supportedApps()[app];
    } else return false;
  }


  $mountEventConstructor(fun) {
    this.ListenerConstructor = fun;
    console.log(`MountEventConstructor was initialized`)
    // console.log(`listener constructor was set t0 = ${this.ListenerConstructor}`);
  }

  $registerUsbMount() {
    this.disposableListener = this.ListenerConstructor();
    console.log(`Successfully registered the usb Mount`)
  }

  $deRegisterUsbMount() {
    console.log(`the current usbListener = ${this.disposableListener}`)
    this.disposableListener.dispose();
    console.log(`successfully deregistered usb listener`);
  }


  standby(value) {
    console.log(`standby call`);
    if (value == 'Back') {
    } else {
      if (powerState == 'ON') {
        console.log(`Power state was on trying to set it to standby`);
        appApi.standby(value).then(res => {

          if (res.success) {
            console.log(`successfully set to standby`);
            powerState = 'STANDBY'
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
              this.deactivateChildApp('Amazon');
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Netflix') {
              Storage.set('applicationType', '');
              this.deactivateChildApp('Netflix');
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Cobalt') {
              Storage.set('applicationType', '');
              this.deactivateChildApp("Cobalt")
              appApi.setVisibility('ResidentApp', true);
            } else {
              if ((!Router.isNavigating()) && Router.getActiveHash() === 'player') {
                Router.navigate('menu')
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
          }

        })
        return true
      }
    }
  }

  $registerInactivityMonitoringEvents() {
    return new Promise((resolve, reject) => {
      console.log(`registered inactivity listener`);
      appApi.standby('ON').then(res => {
        if (res.success) {
          powerState = 'ON'
        }
      })

      const systemcCallsign = "org.rdk.RDKShell.1";
      thunder.Controller.activate({
        callsign: systemcCallsign
      })
        .then(res => {
          console.log(`activated the rdk shell plugin trying to set the inactivity listener; res = ${JSON.stringify(res)}`);
          thunder.on("org.rdk.RDKShell.1", "onUserInactivity", notification => {
            console.log(`user was inactive`);
            if (powerState === "ON" && Storage.get('applicationType') == '') {
              this.standby("STANDBY");
            }
          }, err => {
            console.error(`error while inactivity monitoring , ${err}`)
          })
          resolve(res)
        }).catch((err) => {
          reject(err)
          console.error(`error while activating the displaysettings plugin; err = ${err}`)
        })

    })

  }

  $resetSleepTimer(t) {
    console.log(`reset sleep timer call ${t}`);
    var arr = t.split(" ");

    function setTimer() {
      console.log('Timer ', arr)
      var temp = arr[1].substring(0, 1);
      if (temp === 'H') {
        let temp1 = parseFloat(arr[0]) * 60;
        appApi.setInactivityInterval(temp1).then(res => {
          Storage.set('TimeoutInterval', t)
          console.log(`successfully set the timer to ${t} hours`)
        }).catch(err => {
          console.error(`error while setting the timer`)
        });
      } else if (temp === 'M') {
        console.log(`minutes`);
        let temp1 = parseFloat(arr[0]);
        appApi.setInactivityInterval(temp1).then(res => {
          Storage.set('TimeoutInterval', t)
          console.log(`successfully set the timer to ${t} minutes`);
        }).catch(err => {
          console.error(`error while setting the timer`)
        });
      }
    }

    if (arr.length < 2) {
      appApi.enabledisableinactivityReporting(false).then(res => {
        if (res.success === true) {
          Storage.set('TimeoutInterval', false)
          console.log(`Disabled inactivity reporting`);
          // this.timerIsOff = true;
        }
      }).catch(err => {
        console.error(`error : unable to set the reset; error = ${err}`)
      });
    } else {
      appApi.enabledisableinactivityReporting(true).then(res => {
        if (res.success === true) {
          console.log(`Enabled inactivity reporting; trying to set the timer to ${t}`);
          // this.timerIsOff = false;
          setTimer();
        }
      }).catch(err => { console.error(`error while enabling inactivity reporting`) });
    }
  }
}
