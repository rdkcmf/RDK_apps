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
import routes from './api/routes';
import AppApi from '../src/api/AppApi.js';
import XcastApi from '../src/api/XcastApi';

const config = {
  host: '127.0.0.1',
  port: 9998,
  default: 1,
};
var thunder = ThunderJS(config);
var appApi = new AppApi();

export default class App extends Router.App {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }];
  }
  _setup() {
    Router.startRouter(routes, this);
    document.onkeydown = e => {
      if (e.keyCode == 8) {
        e.preventDefault();
      }
    };
  }

  _init() {
    this.xcastApi = new XcastApi();
    this.xcastApi.activate().then(result => {
      if (result) {
        this.registerXcastListeners()
      }
    })
    var thunder = ThunderJS(config);
    const rdkshellCallsign = 'org.rdk.RDKShell';
    thunder.Controller.activate({ callsign: rdkshellCallsign })
      .then(result => {
        console.log('Successfully activated RDK Shell');
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 27,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 112,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 116,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 118,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 175,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 174,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 113,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 228,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 142,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 77,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 36,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 49,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 158,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 227,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 179,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success');
          })
          .catch(err => {
            console.log('Error', err);
          });
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  deactivateChildApp(plugin) {
    var appApi = new AppApi();
    switch (plugin) {
      case 'WebApp':
        appApi.deactivateWeb();
        break;
      case 'Cobalt':
        appApi.suspendCobalt();
        break;
      case 'Lightning':
        appApi.deactivateLightning();
        break;
      case 'Native':
        appApi.killNative();
        break;
      case 'Amazon':
        appApi.suspendPremiumApp('Amazon');
      case 'Netflix':
        appApi.suspendPremiumApp('Netflix')
      default:
        break;
    }
  }

  /**
   * Function to register event listeners for Xcast plugin.
   */
  registerXcastListeners() {
    this.xcastApi.registerEvent('onApplicationLaunchRequest', notification => {
      console.log('Received a launch request ' + JSON.stringify(notification));
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName);
        console.log('Launch ' + this.xcastApps(notification.applicationName));
        if (applicationName == 'Amazon' && Storage.get('applicationType') != 'Amazon') {
          this.deactivateChildApp(Storage.get('applicationType'));
          appApi.launchPremiumApp('Amazon');
          Storage.set('applicationType', 'Amazon');
          appApi.setVisibility('ResidentApp', false);
          let params = { applicationName: notification.applicationName, state: 'running' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName == 'Netflix' && Storage.get('applicationType') != 'Netflix') {
          this.deactivateChildApp(Storage.get('applicationType'));
          appApi.launchPremiumApp('Netflix');
          Storage.set('applicationType', 'Netflix');
          appApi.setVisibility('ResidentApp', false);
          let params = { applicationName: notification.applicationName, state: 'running' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName == 'Cobalt' && Storage.get('applicationType') != 'Cobalt') {
          this.deactivateChildApp(Storage.get('applicationType'));
          appApi.launchCobalt();
          Storage.set('applicationType', 'Cobalt');
          appApi.setVisibility('ResidentApp', false);
          let params = {
            applicationName: notification.applicationName,
            state: 'running',
          };
          this.xcastApi.onApplicationStateChanged(params);
        }
      }
    });
    this.xcastApi.registerEvent('onApplicationHideRequest', notification => {
      console.log('Received a hide request ' + JSON.stringify(notification));
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName);
        console.log('Hide ' + this.xcastApps(notification.applicationName));
        if (applicationName === 'Amazon' && Storage.get('applicationType') === 'Amazon') {
          appApi.suspendPremiumApp('Amazon');
          let params = { applicationName: notification.applicationName, state: 'stopped' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName === 'Netflix' && Storage.get('applicationType') === 'Netflix') {
          appApi.suspendPremiumApp('Netflix');
          let params = { applicationName: notification.applicationName, state: 'stopped' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName === 'Cobalt' && Storage.get('applicationType') === 'Cobalt') {
          appApi.suspendCobalt();
          let params = { applicationName: notification.applicationName, state: 'stopped' };
          this.xcastApi.onApplicationStateChanged(params);
        }
        Storage.set('applicationType', '');
        appApi.setVisibility('ResidentApp', true);
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
        if (applicationName == 'Amazon' && Storage.get('applicationType') != 'Amazon') {
          this.deactivateChildApp(Storage.get('applicationType'));
          appApi.launchPremiumApp('Amazon');
          Storage.set('applicationType', 'Amazon');
          appApi.setVisibility('ResidentApp', false);
          let params = { applicationName: notification.applicationName, state: 'running' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName == 'Netflix' && Storage.get('applicationType') != 'Netflix') {
          this.deactivateChildApp(Storage.get('applicationType'));
          appApi.launchPremiumApp('Netflix');
          Storage.set('applicationType', 'Amazon');
          appApi.setVisibility('ResidentApp', false);
          let params = { applicationName: notification.applicationName, state: 'running' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName == 'Cobalt' && Storage.get('applicationType') != 'Cobalt') {
          this.deactivateChildApp(Storage.get('applicationType'));
          appApi.launchCobalt();
          Storage.set('applicationType', 'Cobalt');
          appApi.setVisibility('ResidentApp', false);
          let params = { applicationName: notification.applicationName, state: 'running' };
          this.xcastApi.onApplicationStateChanged(params);
        }
      }
    });
    this.xcastApi.registerEvent('onApplicationStopRequest', notification => {
      console.log('Received a stop request ' + JSON.stringify(notification));
      if (this.xcastApps(notification.applicationName)) {
        console.log('Stop ' + this.xcastApps(notification.applicationName));
        let applicationName = this.xcastApps(notification.applicationName);
        if (applicationName === 'Amazon' && Storage.get('applicationType') === 'Amazon') {
          appApi.deactivateNativeApp('Amazon');
          Storage.set('applicationType', '');
          appApi.setVisibility('ResidentApp', true);
          thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
            console.log('ResidentApp moveToFront Success');
          });
          let params = { applicationName: notification.applicationName, state: 'stopped' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName === 'Netflix' && Storage.get('applicationType') === 'Netflix') {
          appApi.deactivateNativeApp('Netflix');
          Storage.set('applicationType', '');
          appApi.setVisibility('ResidentApp', true);
          thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
            console.log('ResidentApp moveToFront Success');
          });
          let params = { applicationName: notification.applicationName, state: 'stopped' };
          this.xcastApi.onApplicationStateChanged(params);
        } else if (applicationName === 'Cobalt' && Storage.get('applicationType') === 'Cobalt') {
          appApi.deactivateCobalt();
          Storage.set('applicationType', '');
          appApi.setVisibility('ResidentApp', true);
          thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
            console.log('ResidentApp moveToFront Success');
          });
          let params = { applicationName: notification.applicationName, state: 'stopped' };
          this.xcastApi.onApplicationStateChanged(params);
        }
      }
    });
    this.xcastApi.registerEvent('onApplicationStateRequest', notification => {
      console.log('Received a state request ' + JSON.stringify(notification));
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName);
        let status = AppApi.pluginStatus(applicationName);
        let params = { applicationName: notification.applicationName, state: 'stopped' };
        if (status) {
          params.status = 'running';
        }
        this.xcastApi.onApplicationStateChanged(params);
        console.log('State of ' + this.xcastApps(notification.applicationName));
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

  _handleKey(key) {
    if (key.keyCode == 227) {
      var showMax = 'https://ott-app.dstv.com/';
      this.deactivateChildApp(Storage.get('applicationType'));
      appApi.launchWeb(showMax);
      Storage.set('applicationType', 'WebApp');
      appApi.setVisibility('ResidentApp', false);
    } else if (key.keyCode == 179 && Storage.get('applicationType') != 'Cobalt') {
      this.deactivateChildApp(Storage.get('applicationType'));
      appApi.launchCobalt();
      Storage.set('applicationType', 'Cobalt');
      appApi.setVisibility('ResidentApp', false);
    } else if (key.keyCode == 27 || key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36 || key.keyCode == 158) {
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
    }
  }
}
