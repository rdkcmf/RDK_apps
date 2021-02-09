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
/**
 * Class for Bluetooth thunder plugin apis.
 */

export default class BluetoothApi {
  constructor() {
    console.log('Bluetooth constructor')
    this._events = new Map()
    this._devices = []
    this._pairedDevices = []
    this._connectedDevices = []
  }

  /**
   * Function to activate the Bluetooth plugin
   */
  activate() {
    return new Promise((resolve, reject) => {
      const config = {
        host: '127.0.0.1',
        port: 9998,
        default: 1,
      }
      this._thunder = ThunderJS(config)
      this.callsign = 'org.rdk.Bluetooth'
      this._thunder
        .call('Controller', 'activate', { callsign: this.callsign })
        .then(result => {
          console.log('Bluetooth activated', result)
          this._thunder.on(this.callsign, 'onDiscoveredDevice', notification => {
            console.log('onDiscoveredDevice ' + JSON.stringify(notification))
            this.getDiscoveredDevices().then(() => {
              this._events.get('onDiscoveredDevice')(notification)
            })
          })
          this._thunder.on(this.callsign, 'onStatusChanged', notification => {
            console.log('onStatusChanged ' + notification.newStatus)
            if (notification.newStatus === 'PAIRING_CHANGE') {
              this.getPairedDevices().then(() => {
                this._events.get('onPairingChange')(notification)
              })
            } else if (notification.newStatus === 'CONNECTION_CHANGE') {
              this.getConnectedDevices().then(() => {
                this._events.get('onConnectionChange')(notification)
              })
            } else if (notification.newStatus === 'DISCOVERY_STARTED') {
              this.getConnectedDevices().then(() => {
                this._events.get('onDiscoveryStarted')()
              })
            } else if (notification.newStatus === 'DISCOVERY_COMPLETED') {
              this.getConnectedDevices().then(() => {
                this._events.get('onDiscoveryCompleted')()
              })
            }
          })
          this._thunder.on(this.callsign, 'onPairingRequest', notification => {
            console.log('onPairingRequest ' + JSON.stringify(notification))
            this._events.get('onPairingRequest')(notification)
          })
          this._thunder.on(this.callsign, 'onRequestFailed', notification => {
            console.log('onRequestFailed ' + JSON.stringify(notification))
            this._events.get('onRequestFailed')(notification)
          })
          this._thunder.on(this.callsign, 'onConnectionRequest', notification => {
            console.log('onConnectionRequest ' + JSON.stringify(notification))
            this._events.get('onConnectionRequest')(notification)
          })
          resolve('Blutooth activated')
        })
        .catch(err => {
          console.error('Activation failure', err)
          reject('Bluetooth activation failed', err)
        })
    })
  }

  /**
   *
   * @param {string} eventId
   * @param {function} callback
   * Function to register the events for the Bluetooth plugin.
   */
  registerEvent(eventId, callback) {
    this._events.set(eventId, callback)
  }

  /**
   * Function to deactivate the Bluetooth plugin.
   */
  deactivate() {
    this._events = new Map()
    this._thunder = null
  }

  /**
   * Function to disable the Bluetooth stack.
   */
  disable() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'disable')
        .then(result => {
          console.log(JSON.stringify(result))
          resolve(result)
        })
        .catch(err => {
          console.error(`Can't disable : ${err}`)
          reject()
        })
    })
  }

  /**
   * Function to enable the Bluetooth stack.
   */
  enable() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'enable')
        .then(result => {
          console.log(JSON.stringify(result))
          resolve(result)
        })
        .catch(err => {
          console.error(`Can't enable : ${err}`)
          reject()
        })
    })
  }

  /**
   * Function to start scanning for the Bluetooth devices.
   */
  startScan() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'startScan', {
          timeout: '10',
          profile: 'KEYBOARD,MOUSE,JOYSTICK',
        })
        .then(result => {
          console.log('scanning : ' + result.success)
          if (result.success) resolve()
          else reject()
        })
        .catch(err => {
          console.error('Error', err)
          reject()
        })
    })
  }

  /**
   * Function to stop scanning for the Bluetooth devices.
   */
  stopScan() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'startScan', {})
        .then(result => {
          console.log('stopped scanning : ' + result.success)
          if (result.success) resolve()
          else reject()
        })
        .catch(err => {
          console.error('Error', err)
          reject()
        })
    })
  }

  /**
   * Function returns the discovered Bluetooth devices.
   */
  getDiscoveredDevices() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'getDiscoveredDevices')
        .then(result => {
          console.log(JSON.stringify(result))
          this._devices = result.discoveredDevices
          resolve(result.discoveredDevices)
        })
        .catch(err => {
          console.error(`Can't get discovered devices : ${err}`)
          reject()
        })
    })
  }
  get discoveredDevices() {
    return this._devices
  }

  /**
   * Function returns the paired Bluetooth devices.
   */
  getPairedDevices() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'getPairedDevices')
        .then(result => {
          console.log(JSON.stringify(result))
          this._pairedDevices = result.pairedDevices
          resolve(result.pairedDevices)
        })
        .catch(err => {
          console.error(`Can't get paired devices : ${err}`)
          reject()
        })
    })
  }
  get pairedDevices() {
    return this._pairedDevices
  }

  /**
   * Function returns the connected Bluetooth devices.
   */
  getConnectedDevices() {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'getConnectedDevices')
        .then(result => {
          console.log(JSON.stringify(result))
          this._connectedDevices = result.connectedDevices
          resolve(result.connectedDevices)
        })
        .catch(err => {
          console.error(`Can't get connected devices : ${err}`)
          reject()
        })
    })
  }

  get connectedDevices() {
    return this._connectedDevices
  }

  /**
   *
   * Function to connect a Bluetooth device.
   * @param {number} deviceID Device ID of the Bluetoth client.
   * @param {string} deviceType Device type of the Bluetooth client.
   */
  connect(deviceID, deviceType) {
    return new Promise((resolve, reject) => {
      console.log(deviceID)
      this._thunder
        .call('org.rdk.Bluetooth', 'connect', {
          deviceID: deviceID,
          deviceType: deviceType,
          profile: deviceType,
        })
        .then(result => {
          console.log('connected : ' + result.success)
          resolve(result.success)
        })
        .catch(err => {
          console.error('Connection failed', err)
          reject()
        })
    })
  }

  /**
   * Function to disconnect a Bluetooth device.
   *@param {number} deviceID Device ID of the Bluetoth client.
   *@param {string} deviceType Device type of the Bluetooth client.
   */
  disconnect(deviceID, deviceType) {
    console.log(deviceID)
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'disconnect', {
          deviceID: deviceID,
          deviceType: deviceType,
        })
        .then(result => {
          console.log('disconnected : ' + result.success)
          if (result.success) resolve(true)
          else reject()
        })
        .catch(err => {
          console.error('disconnect failed', err)
          reject()
        })
    })
  }

  /**
   * Function to unpair a Bluetooth device.
   * @param {number} deviceId
   */
  unpair(deviceId) {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'unpair', { deviceID: deviceId })
        .then(result => {
          console.log('unpaired : ' + result.success)
          if (result.success) resolve()
          else reject()
        })
        .catch(err => {
          console.error('unpair failed', err)
          reject()
        })
    })
  }

  /**
   * Function to pair a Bluetooth device.
   * @param {number} deviceId
   */
  pair(deviceId) {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'pair', { deviceID: deviceId })
        .then(result => {
          console.log('paired : ' + result.success)
          if (result.success) resolve()
          else reject()
        })
        .catch(err => {
          console.error('Error on pairing', err)
          reject()
        })
    })
  }

  /**
   * Function to respond to client the Bluetooth event.
   * @param {number} deviceID Device ID of the Bluetooth client.
   * @param {string} eventType Name of the event.
   * @param {string} responseValue Response sent to the Bluetooth client.
   */
  respondToEvent(deviceID, eventType, responseValue) {
    return new Promise((resolve, reject) => {
      this._thunder
        .call('org.rdk.Bluetooth', 'respondToEvent', {
          deviceID: deviceID,
          eventType: eventType,
          responseValue: responseValue,
        })
        .then(result => {
          console.log('responded to event : ' + result.success)
          if (result.success) resolve()
          else reject()
        })
        .catch(err => {
          console.error('Error on respondToEvent', err)
          reject()
        })
    })
  }

  /**
   * Function to get the discoverable name of the Bluetooth plugin.
   */
  getName() {
    return new Promise((resolve, reject) => {
      this._thunder.call('org.rdk.Bluetooth', 'getName').then(result => {
        resolve(result.name)
      })
    })
  }
}
