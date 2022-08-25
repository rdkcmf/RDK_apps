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
import ThunderJS from 'ThunderJS'

export const WiFiState = {
  UNINSTALLED: 0,
  DISABLED: 1,
  DISCONNECTED: 2,
  PAIRING: 3,
  CONNECTING: 4,
  CONNECTED: 5,
  FAILED: 6,
}

export default class Wifi {
  constructor() {
    this._events = new Map()
    const config = {
      host: '127.0.0.1',
      port: 9998,
    }
    this._thunder = ThunderJS(config)
    this.callsign = 'org.rdk.Wifi'
  }

  /**
   * Function to activate the wifi plugin.
   */
  activate() {
    return new Promise((resolve, reject) => {

      this._thunder
        .call('Controller', 'activate', { callsign: this.callsign })
        .then(result => {

          this.getCurrentState().then(state => {
            if (state === WiFiState.DISABLED) {
              this.setEnabled(true)
            }
            if (state === WiFiState.CONNECTED) {
              this.setInterface('WIFI', true).then(res => {
                if (res.success) {
                  this.setDefaultInterface('WIFI', true)
                }
              })
            }
          })

          this._thunder.on(this.callsign, 'onWIFIStateChanged', notification => {
            if (this._events.has('onWIFIStateChanged')) {
              this._events.get('onWIFIStateChanged')(notification)
            }
          })
          this._thunder.on(this.callsign, 'onError', notification => {
            if (this._events.has('onError')) {
              this._events.get('onError')(notification)
            }
          })

          this._thunder.on(this.callsign, 'onAvailableSSIDs', notification => {
            if (notification.moreData === false) {
              this.stopScan()
              notification.ssids = notification.ssids.filter(
                (item, pos) => notification.ssids.findIndex(e => e.ssid === item.ssid) === pos
              )
              if (this._events.has('onAvailableSSIDs')) {
                this._events.get('onAvailableSSIDs')(notification)
              }
            }
          })

          resolve(result)
        })
        .catch(err => {
          console.error(`Wifi activation failed: ${err}`)
          reject(err)
        })
    })
  }

  /**
   *Register events and event listeners.
   * @param {string} eventId
   * @param {function} callback
   *
   */
  registerEvent(eventId, callback) {
    this._events.set(eventId, callback)
  }

  /**
   * Deactivates wifi plugin.
   */
  deactivate() {
    this._events = new Map()
  }

  /**
   * Returns connected SSIDs
   */
  getConnectedSSID() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call(this.callsign, 'getConnectedSSID')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.error(`getConnectedSSID fail: ${err}`)
          reject(err)
        })
    })
  }

  /**
   * Start scanning for available wifi.
   */
  discoverSSIDs() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call(this.callsign, 'startScan', { incremental: false, ssid: '', frequency: '' })
        .then(result => {
          //console.log('startScan success')
          resolve(result)
        })
        .catch(err => {
          console.error(`startScan fail: ${err}`)
          reject(err)
        })
    })
  }

  /**
   * Stops scanning for networks.
   */
  stopScan() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call(this.callsign, 'stopScan')
        .then(result => {
          //console.log('stopScan success')
          resolve(result)
        })
        .catch(err => {
          console.error(`stopScan fail: ${err}`)
          reject(err)
        })
    })
  }

  /**
   * Function to connect to an SSID
   * @param {object} device
   * @param {string} passphrase
   */
  connect(device, passphrase) {
    return new Promise((resolve, reject) => {
      this.disconnect().then(() => {
        console.log(`connect SSID ${device.ssid}`)
        this._thunder
          .call(this.callsign, 'connect', {
            ssid: device.ssid,
            passphrase: passphrase,
            securityMode: device.security,
          })
          .then(result => {
            console.log(`connected SSID ${device.ssid}`)
            this.setInterface('WIFI', true).then(res => {
              if (res.success) {
                this.setDefaultInterface('WIFI', true)
              }
            })
            resolve(result)
          })
          .catch(err => {
            console.error(`Connection failed: ${err}`)
            reject(err)
          })
      })
    })
  }

  /**
   * Function to disconnect from the SSID.
   */
  disconnect() {
    return new Promise((resolve, reject) => {
      this._thunder.call(this.callsign, 'disconnect')
        .then(result => {
          console.log('WiFi disconnected: ' + JSON.stringify(result))
          this.setInterface('ETHERNET', true).then(res => {
            if (res.success) {
              this.setDefaultInterface('ETHERNET', true)
            }
          })
          resolve(result)
        })
        .catch(err => {
          console.error(`Can't disconnect WiFi: ${err}`)
          reject(false)
        })
    })
  }

  /**
   * Returns current state of the Wi-Fi plugin.
   */
  getCurrentState() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call(this.callsign, 'getCurrentState')
        .then(result => {
          console.log(`WiFi state: ${result.state}`)
          resolve(result.state)
        })
        .catch(err => {
          console.error(`Can't get WiFi state: ${err}`)
          reject(err)
        })
    })
  }

  /**
   * Enables/Disables the Wi-Fi.
   * @param {bool} bool
   */
  setEnabled(bool) {
    return new Promise((resolve, reject) => {
      this._thunder
        .call(this.callsign, 'setEnabled', { enable: bool })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  /**
   * Function to get paired SSID.
   */
  getPaired() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call(this.callsign, 'getPairedSSID', {})
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.error(`Can't get paired: ${err}`)
          reject(err)
        })
    })
  }
  getDefaultInterface() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Network', 'getDefaultInterface', {})
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  getInterfaces() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Network', 'getInterfaces')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log('Failed to get Interfaces')
        })
    })
  }
  setInterface(inter, bool) {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Network', 'setInterfaceEnabled', {
          interface: inter,
          persist: true,
          enabled: bool,
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.error('SetInterface Error', JSON.stringify(err))
        })
    })
  }
  setDefaultInterface(interfaceName, bool) {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Network', 'setDefaultInterface', {
          interface: interfaceName,
          persist: bool,
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.error('SetDefaultInterface Error', JSON.stringify(err))
        })
    })
  }

  saveSSID(ssid, password, securityMode) {
    console.log("SAVESSID")
    return new Promise((resolve, reject) => {
      this._thunder
      .call(this.callsign, 'saveSSID', { 
        ssid: ssid,
        passphrase: password,
        securityMode: securityMode
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        console.error('SaveSSID Error', JSON.stringify(err))
      })
    })
  }

  clearSSID(){
    console.log("CLEARSSID")
    return new Promise((resolve, reject) => {
      this._thunder
      .call(this.callsign, 'clearSSID')
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        console.log('Error in clear ssid')
      })
    })
  }
}
