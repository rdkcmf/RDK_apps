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
import { Utils, Router, Storage, Settings } from '@lightningjs/sdk';
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
import SettingsOverlay from './overlays/SettingsOverlay';
import { AlexaLauncherKeyMap } from './Config/AlexaConfig';

const config = {
  host: '127.0.0.1',
  port: 9998,
  default: 1,
};
var powerState = 'ON';
var thunder = ThunderJS(config);
var appApi = new AppApi();
var dtvApi = new DTVApi();
var hdmiApi = new HDMIApi()



export default class App extends Router.App {
  static getFonts() {
    return [{ family: CONFIG.language.font, url: Utils.asset('fonts/' + CONFIG.language.fontSrc) }];
  }
  _setup() {
    console.log("accelerator-home-ui version: " + Settings.get("platform", "version"))
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
        },
        SettingsOverlay: {
          type: SettingsOverlay
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

  $updateTimeZone(timezone) {
    this.tag('Menu').updateTimeZone(timezone)
  }

  _captureKey(key) {
    console.log(key, key.keyCode)
    if (key.keyCode == Keymap.Escape || key.keyCode == Keymap.Home || key.keyCode === Keymap.m) {
      if (Storage.get('applicationType') != '') {
        appApi.exitApp(Storage.get('applicationType')).catch(err => {
          console.log(err)
        });
        if (Router.getActiveHash().startsWith("tv-overlay") || Router.getActiveHash().startsWith("overlay") || Router.getActiveHash().startsWith("applauncher")) {
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
      console.log(`settings shortcut`)

      if (Storage.get("applicationType") === "") { //launch settings overlay/page depending on the current route.
        if(Router.getActiveHash() === "player" || Router.getActiveHash() === "dtvplayer" || Router.getActiveHash() === "usb/player"){ //player supports settings overlay, so launch it as overlay
          if (Router.getActiveWidget() && Router.getActiveWidget().__ref === "SettingsOverlay") { //currently focused on settings overlay, so hide it
            Router.focusPage();
          }
          else { //launch the settings overlay
            Router.focusWidget('SettingsOverlay');
          }
        } else { //navigate to settings page for all other routes
          Router.navigate("settings")
        }
      } else { //currently on some application
        if(Router.getActiveHash() === "applauncher"){ //if route is applauncher just focus the overlay widget
          if (Router.getActiveWidget() && Router.getActiveWidget().__ref === "SettingsOverlay") { //currently focused on settings overlay, so hide it
            Router.focusPage();
            let currentApp = Storage.get("applicationType")
            appApi.zorder(currentApp)
            appApi.setFocus(currentApp)
            appApi.setVisibility(currentApp, true)
          }
          else { //launch the settings overlay
            appApi.zorder("ResidentApp")
            appApi.setFocus("ResidentApp")
            appApi.setVisibility("ResidentApp", true)
            Router.focusWidget('SettingsOverlay');
          }
        } else { //if on some other route while on an application, route to applauncher before launching the settings overlay
          appApi.zorder("ResidentApp")
          appApi.setFocus("ResidentApp")
          appApi.setVisibility("ResidentApp", true)
          Router.navigate("applauncher");
          Router.focusWidget('SettingsOverlay');
        }

      }
      return true;
    }
    if (key.keyCode == Keymap.Guide_Shortcut) {
      Router.navigate('epg')
      return true
    }
    if (key.keyCode == Keymap.Amazon) {
      appApi.launchApp("Amazon").catch(err => {
        console.error("Error in launching Amazon via dedicated key: " + JSON.stringify(err))
      });
      return true
    }
    if (key.keyCode == Keymap.Youtube) {
      let params = {
        launchLocation: "dedicatedButton"
      }
      appApi.launchApp("Cobalt", params).catch(err => {
        console.error("Error in launching Youtube via dedicated key: " + JSON.stringify(err))
      });
      return true
    }
    if (key.keyCode == Keymap.Netflix) { //launchLocation mapping is in launchApp method in AppApi.js
      let params = {
        launchLocation: "dedicatedButton"
      }
      appApi.launchApp("Netflix", params).catch(err => {
        console.error("Error in launching Netflix via dedicated key: " + JSON.stringify(err))
      });
      return true
    }

    if (key.keyCode == Keymap.Power) {
      // Remote power key and keyboard F1 key used for STANDBY and POWER_ON
      appApi.getPowerState().then(res => {
        console.log("getPowerState: ",res)
        if(res.success){
          if(res.powerState === "ON") {
            console.log("current powerState is ON so setting power state to LIGHT_SLEEP/DEEP_SLEEP depending of preferred option");
            appApi.getPreferredStandbyMode().then(res => {
              console.log("getPreferredStandbyMode: ",res.preferredStandbyMode);
              appApi.setPowerState(res.preferredStandbyMode).then(result => {
                if(result.success){
                  console.log("successfully set powerstate to: " + res.preferredStandbyMode)
                }
              })
            })
          } else {
            console.log("current powerState is "+ res.powerState + " so setting power state to ON");
            appApi.setPowerState("ON").then(res => {
              if(res.success){
                console.log("successfully set powerstate to: ON")
              }
            })
          }
        }
      })
    } else if (key.keyCode == 228) {

      console.log("___________DEEP_SLEEP_______________________F12")
      appApi.setPowerState("DEEP_SLEEP").then(res => {
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


  _init() {
    if (Storage.get("applicationType") !== "HDMI") { //to default to hdmi, if previous input was hdmi
      Storage.set('applicationType', '');//to set the application type to none
    }
    Storage.set("lastVisitedRoute", "menu"); //setting to menu so that it will be always defaulted to #menu
    appApi.enableDisplaySettings().then(res => { console.log(`results : ${JSON.stringify(res)}`) }).catch(err => { console.error("error while enabling displaysettings") })
    appApi.cobaltStateChangeEvent()
    this.xcastApi = new XcastApi()
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
      console.log("controller notification", noti)
      if ((noti.data.url && noti.data.url.slice(-5) === "#boot") || (noti.data.httpstatus && noti.data.httpstatus != 200 && noti.data.httpstatus != -1 )) { // to exit metro apps by pressing back key & to auto exit webapp if httpstatus is not 200
        appApi.exitApp(Storage.get('applicationType'));
      }
    })


    thunder.on('org.rdk.RDKShell', 'onApplicationDisconnected', notification => {
      console.log("onApplicationDisconnectedNotification: ", JSON.stringify(notification))
    })

    thunder.on('Controller', 'statechange', notification => {
      // get plugin status
      console.log("Controller statechange Notification : " + JSON.stringify(notification))
      if (notification && (notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'LightningApp' || notification.callsign === 'HtmlApp' || notification.callsign === 'Netflix') && (notification.state == 'Deactivation' || notification.state == 'Deactivated')) {
        console.log(`${notification.callsign} status = ${notification.state}`)
        console.log(">>notification.callsign: ", notification.callsign, " applicationType: ", Storage.get("applicationType"));
        if (Router.getActiveHash().startsWith("tv-overlay") || Router.getActiveHash().startsWith("overlay") || Router.getActiveHash().startsWith("applauncher")) { //navigate to last visited route when exiting from any app
          console.log("navigating to lastVisitedRoute")
          Router.navigate(Storage.get("lastVisitedRoute"));
        }
        if (notification.callsign === Storage.get("applicationType")) { //only launch residentApp iff notification is from currentApp
          console.log(notification.callsign + " is in: " + notification.state + " state, and application type in Storage is still: " + Storage.get("applicationType") + " calling launchResidentApp")
          appApi.launchResidentApp();
        }
      }
      if (notification && (notification.callsign === 'org.rdk.HdmiCec_2' && notification.state === 'Activated')) {
        this.advanceScreen = Router.activePage()
        if (typeof this.advanceScreen.performOTPAction === 'function') {
          console.log('otp action')
          this.advanceScreen.performOTPAction()
        }
      }

      if (notification && (notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'LightningApp' || notification.callsign === 'HtmlApp' || notification.callsign === 'Netflix') && notification.state == 'Activated') {
        Storage.set('applicationType', notification.callsign) //required in case app launch happens using curl command.
        if (notification.callsign === 'Netflix') {
          appApi.getNetflixESN()
            .then(res => {
              Storage.set('Netflix_ESN', res)
            })
          thunder.on('Netflix', 'notifyeventchange', notification => {
            console.log(`NETFLIX : notifyEventChange notification = `, JSON.stringify(notification));
            if (notification.EventName === "rendered") {
              Router.navigate('menu')
              if (Storage.get("NFRStatus")) {
                thunder.call("Netflix.1", "nfrstatus", { "params": "enable" }).then(nr => {
                  console.log(`Netflix : nfr enable results in ${nr}`)
                }).catch(nerr => {
                  console.error(`Netflix : error while updating nfrstatus ${nerr}`)
                })
              } else {
                thunder.call("Netflix.1", "nfrstatus", { "params": "disable" }).then(nr => {
                  console.log(`Netflix : nfr disable results in ${nr}`)
                }).catch(nerr => {
                  console.error(`Netflix : error while updating nfrstatus ${nerr}`)
                })
              }


              appApi.visibile('ResidentApp', false);
            }
            if (notification.EventName === "requestsuspend") {
              this.deactivateChildApp('Netflix')
            }
            if (notification.EventName === "updated") {
              console.log(`Netflix : xxxxxxxxxxxxxxxxxx Updated Event Trigger xxxxxxxxxxxxxxxxxxxx`)
              appApi.getNetflixESN()
                .then(res => {
                  Storage.set('Netflix_ESN', res)
                })
            }
          })
        } else {
          appApi.setFocus(notification.callsign) //required in case app launch happens using curl command.
        }
      }
    });


  }

  _firstEnable() {
    thunder.on("org.rdk.System", "onSystemPowerStateChanged", notification => {
        console.log("onSystemPowerStateChanged Notification: ",notification); 
        if(notification.powerState !== "ON" && notification.currentPowerState === "ON"){
          console.log("onSystemPowerStateChanged Notification: power state was changed from ON to " + notification.powerState)
          let currentApp = Storage.get('applicationType')
          if (currentApp !== "") {
            appApi.exitApp(currentApp); //will suspend/destroy the app depending on the setting.
          }
          Router.navigate('menu');
        }
    })

    console.log("Calling listenToVoiceControl method to activate VoiceControl Plugin")
    this.listenToVoiceControl();
  }

  listenToVoiceControl() {
    console.log("listenToVoiceControl method got called, Activating and listening to VoiceControl Plugin")
    const systemcCallsign = "org.rdk.VoiceControl"

    thunder.Controller.activate({callsign: systemcCallsign}).then(res => {
      console.log("VoiceControl Plugin Activation result: ",res)

      thunder.on(systemcCallsign, 'onServerMessage', notification => { 
        console.log("VoiceControl.onServerMessage Notification: ",notification)
  
        const header = notification.xr_speech_avs.directive.header
        const payload = notification.xr_speech_avs.directive.payload
        
        /////////Alexa.Launcher START
        if(header.namespace === "Alexa.Launcher"){
          //Alexa.launcher will handle launching a particular app(exiting might also be there)
          if(header.name === "LaunchTarget"){
            //Alexa payload will be to "launch" an app
            if(AlexaLauncherKeyMap[payload.identifier]){
              let appCallsign = AlexaLauncherKeyMap[payload.identifier].callsign
              let appUrl = AlexaLauncherKeyMap[payload.identifier].url //keymap url will be default, if alexa can give a url, it can be used istead
              let params = {
                url: appUrl,
                launchLocation: "alexa"
              }
              console.log("Alexa is trying to launch "+ appCallsign + " using params: "+ JSON.stringify(params))
              appApi.launchApp(appCallsign,params).catch(err => {
                console.error("Error in launching "+ appCallsign + " via Alexa: " + JSON.stringify(err))
              });
            } else {
              console.log("Alexa is trying to launch a non-supported app : "+JSON.stringify(payload))
            }
          }
        }
        /////////Alexa.Launcher END
      })

      thunder.on(systemcCallsign, 'onKeywordVerification', notification => { 
        console.log("VoiceControl.onKeywordVerification Notification: " + JSON.stringify(notification))
      })

      thunder.on(systemcCallsign, 'onSessionBegin', notification => { 
        console.log("VoiceControl.onSessionBegin Notification: " + JSON.stringify(notification))
      })

      thunder.on(systemcCallsign, 'onSessionEnd', notification => { 
        console.log("VoiceControl.onSessionEnd Notification: " + JSON.stringify(notification))
      })

      thunder.on(systemcCallsign, 'onStreamBegin', notification => { 
        console.log("VoiceControl.onStreamBegin Notification: " + JSON.stringify(notification))
      })

      thunder.on(systemcCallsign, 'onStreamEnd', notification => { 
        console.log("VoiceControl.onStreamEnd Notification: " + JSON.stringify(notification))
      })

      thunder.on(systemcCallsign, 'onSuspend', notification => { 
        console.log("VoiceControl.onSuspend Notification: " + JSON.stringify(notification))
      })

    }).catch(err => {
      console.log("VoiceControl Plugin Activation ERROR!: ",err)
    })
  }

  activateChildApp(plugin) { //#currentlyNotUsed #needToBeRemoved
    if(plugin == "YouTubeKids" || plugin == "YouTubeTV"){
      plugin = "Cobalt"
    }

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

  deactivateChildApp(plugin) { //#needToBeRemoved
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
        case "Netflix":
          appApi.suspendPremiumApp("Netflix").then((res) => {
            Router.navigate(Storage.get("lastVisitedRoute"));
            thunder.call("org.rdk.RDKShell", "setFocus", {
              client: "ResidentApp",
            });
            thunder.call("org.rdk.RDKShell", "setVisibility", {
              client: "ResidentApp",
              visible: true,
            });
            thunder.call("org.rdk.RDKShell", "moveToFront", {
              client: "ResidentApp",
              callsign: "ResidentApp",
            });
            if (res) {
              let params = { applicationName: "NetflixApp", state: "suspended" };
              this.xcastApi.onApplicationStateChanged(params);
            }
          });
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
                appApi.launchPremiumApp("Netflix").then(res => {
                  appApi.setVisibility('ResidentApp', false);
                  resolve(true)
                }).catch(err => { reject(false) });// ie. org.rdk.RDKShell.launch
              }).catch(err => {
                console.error("Netflix : error while fetching configuration data : ", JSON.stringify(err))
                reject(err)

              })// gets configuration object and sets configuration

            }
            else {
              appApi.launchPremiumApp("Netflix").then(res => {
                appApi.setVisibility('ResidentApp', false);
                resolve(true)
              }).catch(err => { reject(false) });// ie. org.rdk.RDKShell.launch
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
                appApi.setVisibility('ResidentApp', false);
                resolve(true)
              }).catch(err => { reject(false) });// ie. org.rdk.RDKShell.launch
            }
            else {
              appApi.launchPremiumApp("Netflix").then(res => {
                console.log(`Netflix : launch premium app resulted in `, JSON.stringify(res));
                appApi.setVisibility('ResidentApp', false);
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

        let url = applicationName === "Cobalt" ? notification.parameters.url + '&inApp=true' : notification.parameters.url;

        if (applicationName === "YouTubeKids") {
          hdmiApi.checkStatus("Cobalt").then(res=>{
            if(res[0].state === "running"){

              thunder.call('org.rdk.RDKShell', 'destroy', { callsign: 'Cobalt' }).then(r => {
                console.log(`Cobalt : Cobalt instance deactivated`, r)
                let params = {
                  url: url,
                  launchLocation: "dial"
                }
                appApi.launchApp("Cobalt", params).then(res => {// we launch cobalt
                  
                    Storage.set("applicationType", "Cobalt")  
                  
                  console.log("App launched on xcast event: ", res);
                  let params = { applicationName: notification.applicationName, state: 'running' }; // we update applicationStateChanged for YouTubeKids
                  this.xcastApi.onApplicationStateChanged(params);
                }).catch(err => {
                  console.error("Applaunch error on xcast notification: ", err)
                })
    
              }).catch(err => {
                console.error("Cobalt : error while deactivating cobalt instance", err)
              })


            }
            else{
              let params = {
                url: url,
                launchLocation: "dial"
              }
              let aName = "Cobalt"
              appApi.launchApp(aName, params).then(res => {
                Storage.set("applicationType", "Cobalt")
                console.log("App launched on xcast event: ", res);
                let params = { applicationName: notification.applicationName, state: 'running' };
                this.xcastApi.onApplicationStateChanged(params);
              }).catch(err => {
                console.log("Applaunch error on xcast notification: ", err)
              })
            }
          })
          
        }
        else if(applicationName === "YouTubeTV"){
          hdmiApi.checkStatus("Cobalt").then(res=>{
            if(res[0].state === "running"){

              thunder.call('org.rdk.RDKShell', 'destroy', { callsign: 'Cobalt' }).then(r => {


                let params = {
                  url: url,
                  launchLocation: "dial"
                }

                appApi.launchApp("Cobalt", params).then(res => {// we launch cobalt
                  Storage.set("applicationType", "Cobalt")
                  console.log("App launched on xcast event: ", res);
                  let params = { applicationName: notification.applicationName, state: 'running' }; // we update applicationStateChanged for YouTubeKids
                  this.xcastApi.onApplicationStateChanged(params);
                }).catch(err => {
                  console.error("Applaunch error on xcast notification: ", err)
                })

              }).catch(err=>{
                console.error(err)
              })
            }
            else{
              let params = {
                url: url,
                launchLocation: "dial"
              }
              let aName = "Cobalt"
              appApi.launchApp(aName, params).then(res => {
                Storage.set("applicationType", "Cobalt")
                console.log("App launched on xcast event: ", res);
                let params = { applicationName: notification.applicationName, state: 'running' };
                this.xcastApi.onApplicationStateChanged(params);
              }).catch(err => {
                console.log("Applaunch error on xcast notification: ", err)
              })
            }
            
          }).catch(err=>{
            console.error(err)
          })
          
        }
        else {
          let params = {
            url: url,
            launchLocation: "dial"
          }
          appApi.launchApp(applicationName, params).then(res => {
            console.log("App launched on xcast event: ", res);
            Storage.set("applicationType", applicationName)
            let params = { applicationName: notification.applicationName, state: 'running' };
            this.xcastApi.onApplicationStateChanged(params);
          }).catch(err => {
            console.log("Applaunch error on xcast notification: ", err)
          })
        }

      }
    });

    this.xcastApi.registerEvent('onApplicationHideRequest', notification => {
      console.log('Received a hide request ' + JSON.stringify(notification));
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName);
        console.log('Hide ' + this.xcastApps(notification.applicationName));
        let params = { applicationName: notification.applicationName, state: 'suspended' };
        if (applicationName === "YouTubeKids") {
          appApi.suspendPremiumApp("Cobalt")
          this.xcastApi.onApplicationStateChanged(params);
        } 
        else if(applicationName === "YouTubeTV"){
          appApi.suspendPremiumApp("Cobalt")
          this.xcastApi.onApplicationStateChanged(params);
        }else {
          //second argument true means resident app won't be launched the required app will be exited in the background.
          //only bring up the resident app when the notification is from the current app(ie app in focus)
          console.log("exitApp is getting called depending upon " + applicationName + "!==" + Storage.get("applicationType"));
          appApi.exitApp(applicationName, applicationName !== Storage.get("applicationType"));

          console.log(`Event : On hide request, updating application Status to `, params);
          this.xcastApi.onApplicationStateChanged(params);
        }

      }
    });
    this.xcastApi.registerEvent('onApplicationResumeRequest', notification => {
      console.log('Received a resume request ' + JSON.stringify(notification));
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName);
        let params = {
          url: notification.parameters.url,
          launchLocation: "dial"
        }
        let aName = applicationName
        if(aName == "YouTubeKids" || aName == "YouTubeTV"){
          aName = "Cobalt"
        }
        console.log('Resume ', applicationName, " with params: ", params);
        appApi.launchApp(aName, params).then(res => {
          Storage.set("applicationType", aName)
          
          console.log("launched ", applicationName, " on casting resume request: ", res);
          let params = { applicationName: notification.applicationName, state: 'running' };
          this.xcastApi.onApplicationStateChanged(params);
        }).catch(err => {
          console.log("Error in launching ", applicationName, " on casting resume request: ", err);
        })
      }
    });
    this.xcastApi.registerEvent('onApplicationStopRequest', notification => {
      console.log('Received an xcast stop request ' + JSON.stringify(notification));
      console.log('Received a stop request ' + JSON.stringify(notification));
      if (this.xcastApps(notification.applicationName)) {
        console.log('Stop ' + this.xcastApps(notification.applicationName));
        let applicationName = this.xcastApps(notification.applicationName);
        if (applicationName === "YouTubeKids") {
          appApi.deactivateCobalt()
          let params = { applicationName: notification.applicationName, state: 'stopped' };
          this.xcastApi.onApplicationStateChanged(params);
        }
        else if(applicationName === "YouTubeTV"){
          appApi.deactivateCobalt()
          let params = { applicationName: notification.applicationName, state: 'stopped' };
          this.xcastApi.onApplicationStateChanged(params);
        }
        else {
          //second argument true means resident app won't be launched the required app will be exited in the background.
          //only bring up the resident app when the notification is from the current app(ie app in focus)
          console.log("exitApp is getting called depending upon " + applicationName + "!==" + Storage.get("applicationType"));
          appApi.exitApp(applicationName, applicationName !== Storage.get("applicationType"));

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
            if(results.callsign == "YouTubeKids" || results.callsign == "YouTubeTV"){
              Storage.set("applicationType", "Cobalt")  //required in case app launch happens using curl command.
            }else{
              Storage.set("applicationType", results.callsign) //required in case app launch happens using curl command.
            }
          }
          else if (results.state == 'Deactivation') {
            params.state = "stopped"
          }
          else if (results.state == "Activation") {
            // params.state = "running"
          }
          else if (results.state == "Resumed") {
            params.state = "running"
          }
          else if (results.state == 'suspended') {
            params.state = 'suspended';
          }
          else{
            console.warn(" THIS SHOULDN'T HAPPEN : unexpected app state"+results.state)
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
        appApi.setPowerState(value).then(res => {

          if (res.success) {
            console.log(`successfully set to standby`);
            powerState = 'STANDBY'
            if (Storage.get('applicationType') !== "") {
              appApi.exitApp(Storage.get('applicationType'));
            } else {
              if (!Router.isNavigating()) {
                Router.navigate('menu')
              }
            }
          }

        })
        return true
      }
    }
  }

  $registerInactivityMonitoringEvents() {
    return new Promise((resolve, reject) => {
      console.log(`registered inactivity listener`);
      appApi.setPowerState('ON').then(res => {
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
