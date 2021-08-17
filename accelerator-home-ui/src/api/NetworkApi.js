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
import ThunderJS from 'ThunderJS';
export default class Network {
  constructor() {
    this._events = new Map();
    const config = {
      host: '127.0.0.1',
      port: 9998,
      default: 1,
    };
    this._thunder = ThunderJS(config);
    this.callsign = 'org.rdk.Network';
  }

  /**
   * Function to activate network plugin
   */
  activate() {
    return new Promise((resolve, reject) => {
      this._thunder.call('Controller', 'activate', { callsign: this.callsign }).then(result => {
        this._thunder.on(this.callsign, 'onIPAddressStatusChanged', notification => {
          if (this._events.has('onIPAddressStatusChanged')) {
            this._events.get('onIPAddressStatusChanged')(notification);
          }
        });
        this._thunder.on(this.callsign, 'onDefaultInterfaceChanged', notification => {
          if (this._events.has('onDefaultInterfaceChanged')) {
            this._events.get('onDefaultInterfaceChanged')(notification);
          }
        });
        console.log('Activation success')
        resolve(true)
      });
    });
  }

  /**
   *Register events and event listeners.
   * @param {string} eventId
   * @param {function} callback
   *
   */
  registerEvent(eventId, callback) {
    this._events.set(eventId, callback);
  }

  /**
   * Function to return the IP of the default interface.
   */
  getIP() {
    return new Promise((resolve, reject) => {
      this._thunder.call(this.callsign, 'getStbIp').then(result => {
        if (result.success) {
          resolve(result.ip)
        }
        reject(false)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
