/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
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
 */

import { Lightning, Utils, Router, Storage, Log, Settings } from '@lightningjs/sdk'
import Keymap from "./Config/Keymap"
import routes from './routes/routes';
import thunder from './api/ThunderInstance';
import AppApi from './api/AppApi';
import {CONFIG} from './Config/Config'
import { keyIntercept } from './keyIntercept/keyIntercept';

var powerState = 'ON';

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
  }

  static _template() {
    return {
      Pages: {
        // this hosts all the pages
        forceZIndexContext: true
      },
    }
  }

  static language() {
    return {
      file: Utils.asset('language/language-file.json'),
      language: CONFIG.language.id
    }
  }
  _init(){
    keyIntercept()
    thunder.on('Controller.1', 'all', noti => {
      if (noti.data.url && noti.data.url.slice(-5) === "#boot") { // to exit metro apps by pressing back key
      this.appApi.suspendOrDestroyApp(Storage.get('applicationType'),'destroy')
      }
    })
  }

  powerStandby(value) {
    Log.info(`standby`);
    if (value == 'Back') {
    } else {
      if (powerState == 'ON') {
        Log.info(`Power state was on trying to set it to standby`);
        this.appApi.standby(value).then(res => {

          if (res.success) {
            Log.info(`successfully set to standby`);
            powerState = 'STANDBY'
            if (Storage.get('applicationType')!== '' && Storage.get('ipAddress')) {
             let callSign = Storage.get('applicationType')
              // this.appApi.deactivateWeb();
              Settings.get("platform","disableSuspendedApps") ? this.appApi.suspendOrDestroyApp(callSign,'suspend') : this.appApi.suspendOrDestroyApp(callSign,'destroy')
              Storage.set('applicationType', '');
            } else {
              if ((!Router.isNavigating()) && Router.getActiveHash() === 'player') {
                Router.navigate('menu')
              }
            }

            thunder.call('org.rdk.RDKShell', 'moveToFront', {
              client: 'ResidentApp'
            }).then(result => {
              Log.info('ResidentApp moveToFront Success' + JSON.stringify(result));
            }).catch(err => {
              Log.error(`error while moving the resident app to front = ${err}`)
            });
            thunder.call('org.rdk.RDKShell', 'setFocus', {
              client: 'ResidentApp'
            }).then(result => {
              Log.info('ResidentApp setFocus Success' + JSON.stringify(result));
            }).catch(err => {
              Log.error('Error', err);
            });
          }

        })
        return true
      }
    }
  }
  _captureKey(key) {
    Log.info(`capture key`, key,key.keyCode)
    if (key.keyCode == Keymap.Home || key.keyCode === Keymap.m || key.keyCode === Keymap.Escape) {
      if (Storage.get('applicationType') != '') {
        Log.info(`home key resident focus`);
        Settings.get("platform","disableSuspendedApps") ? (this.appApi.suspendOrDestroyApp(Storage.get('applicationType'),'suspend')).then(res =>{if(res){ if (Router.getActiveHash().startsWith("tv-overlay")) {
              Router.navigate('menu');
            }}}):this.appApi.suspendOrDestroyApp(Storage.get('applicationType'),'destroy').then(res =>{if(res){ if (Router.getActiveHash().startsWith("tv-overlay")) {
              Router.navigate('menu');
            }}})
        Storage.set('applicationType', '');
      } else {
        Log.info(`home key regular`);
        if (!Router.isNavigating()) {
          Router.navigate('menu');
        }
      }
      return true
    }
    if (key.keyCode == Keymap.Amazon) {
      Storage.set('applicationType', 'Amazon');

      this.launchApp('Amazon')
      return true
    }
    if (key.keyCode == Keymap.Youtube) {
      Storage.set('applicationType', 'Cobalt');

      this.appApi.launchApp('Cobalt')
      return true
    }
    if (key.keyCode == Keymap.Netflix) {
      Storage.set('applicationType', 'Netflix');

      this.launchApp('Netflix')
      return true
    }

    if (key.keyCode == Keymap.Power) {
      // Remote power key and keyboard F1 key used for STANDBY and POWER_ON
      if (powerState == 'ON') {
        this.powerStandby('STANDBY');
        return true
      } else if (powerState == 'STANDBY') {
        this.appApi.standby("ON").then(res => {
          powerState = 'ON';
        })
        return true
      }
    } else if (key.keyCode == 228) {
      Log.info("___________DEEP_SLEEP_______________________F12")
      this.appApi.standby("DEEP_SLEEP").then(res => {
        powerState = 'DEEP_SLEEP'
      })
      return true
    }
    return false
  }

  addKeyIntercepts() {
    var rdkshellCallsign = "org.rdk.RDKShell"
    thunder
      .call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: Keymap.Home,
        modifiers: [],
      })
      .catch(err => {
        Log.error('Error', err)

      });
  }

  $setEventListeners() {
    var self = this;
    setTimeout(function () {
      Log.info(`creating app api instance for appjs`)
      self.appApi = new AppApi()
    }, 0)

    setTimeout(function () {
      Log.info(`registering for the event statechange`);
      thunder.on('Controller', 'statechange', notification => {
        Log.info("state change", JSON.stringify(notification))

        if (notification && (notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'Lightning' || notification.callsign === 'Netflix') && notification.state == 'Deactivation') {
          Storage.set('applicationType', '');
          self.appApi.setVisibilityandFocus('ResidentApp', true);
          thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
            Log.info('ResidentApp moveToFront Success' + JSON.stringify(result))
          })
            .catch(err => {
              Log.error('Error', err)
            });
        }

        if (notification && (notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'Lightning' || notification.callsign === 'Netflix') && notification.state == 'Activated') {
          Storage.set('applicationType', notification.callsign)
            self.appApi.setFocus(notification.callsign)
          
        }
      });
    }, 0)

      Log.info(`registering for event controller.all`)
      thunder.on('Controller.1', 'all', noti => {
        if (noti.data.url && noti.data.url.slice(-5) === "#boot") { // to exit metro apps by pressing back key
          Settings.get("platform","disableSuspendedApps")? this.appApi.suspendOrDestroyApp(Storage.get('applicationType'),'suspend'):this.appApi.suspendOrDestroyApp(Storage.get('applicationType'),'destroy')
        }
      })
  

      Log.info(`adding key intercepts`);
      self.addKeyIntercepts()
  }

}
