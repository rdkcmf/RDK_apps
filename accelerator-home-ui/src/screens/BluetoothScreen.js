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
import BluetoothItem from '../items/BluetoothItem'
import BluetoothApi from './../api/BluetoothApi'
import BluetoothPairingScreen from './BluetoothPairingScreen'
import { COLORS } from './../colors/Colors'

/**
 * Class for Bluetooth screen.
 */
export default class BluetoothScreen extends Lightning.Component {
  static _template() {
    return {
      Title: {
        x: 1920 - 1920 / 3 + 1920 / 6,
        y: 50,
        text: { text: 'Bluetooth', textColor: COLORS.headingColor },
        mountX: 0.5,
      },
      Switch: {
        x: 1920 - 1920 / 3 + 20,
        y: 150,
        rect: true,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 9 },
        color: 0x00c0c0c0,
        w: 1920 / 3 - 70,
        h: 50,
        Text: {
          x: 0,
          text: { text: 'Bluetooth', textColor: COLORS.titleColor },
        },
        Button: {
          x: 1920 / 3 - 80,
          y: 10,
          mountX: 1,
          src: Utils.asset('images/switch-on.png'),
        },
      },
      Name: {
        x: 1920 - 1920 / 3 + 20,
        y: 200,
        text: {
          text: 'Now discoverable as',
          textColor: COLORS.textColor,
          fontSize: 20,
        },
      },
      Networks: {
        x: 1920 - 1920 / 3,
        y: 250,
        flex: { direction: 'column' },
        PairedNetworks: {
          flexItem: { margin: 20 },
          w: 1920 / 3,
          h: 30,
          Title: {
            text: {
              text: 'My Devices',
              textColor: COLORS.titleColor,
              fontSize: 30,
            },
          },
          List: {
            x: 0,
            y: 65,
            type: Lightning.components.ListComponent,
            w: 1920 / 3,
            itemSize: 65,
            horizontal: false,
            invertDirection: true,
            roll: true,
          },
        },
        AvailableNetworks: {
          flexItem: { margin: 20, marginTop: 30 },
          w: 1920 / 3,
          h: 30,
          Title: {
            text: {
              text: 'Other Devices',
              textColor: COLORS.titleColor,
              fontSize: 30,
            },
          },
          Loader: {
            x: 250,
            y: -10,
            w: 50,
            h: 50,
            color: 0xff000000,
            src: Utils.asset('images/loader.png'),
            visible: false,
          },

          List: {
            x: 0,
            y: 65,
            w: 1920 / 3,
            h: 100,
            type: Lightning.components.ListComponent,
            itemSize: 65,
            horizontal: false,
            invertDirection: true,
            roll: true,
          },
        },
        visible: false,
      },
      PairingScreen: {
        x: 1920 - 1920 / 3,
        y: 0,
        w: 1920 / 3,
        h: 1080,
        visible: false,
        type: BluetoothPairingScreen,
      },
      Message: {
        x: 1920 - 1920 / 3 + 40,
        y: 950,
        text: { text: '' },
      },
    }
  }

  _init() {
    this.loadingAnimation = this.tag('Networks.AvailableNetworks.Loader').animation({
      duration: 1,
      repeat: -1,
      stopMethod: 'immediate',
      stopDelay: 0.2,
      actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: Math.PI * 2 } }],
    })
    this.loadingAnimation.play()
    this._bt = new BluetoothApi()
    this._bluetooth = true
    this._activateBluetooth()
    this._setState('Switch')
    this._bluetooth = true
    if (this._bluetooth) {
      this.tag('Networks').visible = true
    }
    this._pairedNetworks = this.tag('Networks.PairedNetworks')
    this._availableNetworks = this.tag('Networks.AvailableNetworks')
    this.renderDeviceList()
  }
  _active() {
    this._setState('Switch')
  }
  /**
   * Function to be excuted when the Bluetooth screen is enabled.
   */
  _enable() {
    if (this._bluetooth) {
      this._bt.startScan()
    }
    this.scanTimer = setInterval(() => {
      if (this._bluetooth) {
        this._bt.startScan()
      }
    }, 15000)
  }

  /**
   * Function to be executed when the Bluetooth screen is disabled from the screen.
   */
  _disable() {
    clearInterval(this.scanTimer)
  }

  /**
   * Function to render list of Bluetooth devices
   */
  renderDeviceList() {
    this._bt.getPairedDevices().then(result => {
      this._pairedList = result
      this._pairedNetworks.h = this._pairedList.length * 65 + 30
      this._pairedNetworks.tag('List').h = this._pairedList.length * 65
      this._pairedNetworks.tag('List').items = this._pairedList.map((item, index) => {
        item.paired = true
        return {
          ref: 'Paired' + index,
          w: 1920 / 3,
          h: 65,
          type: BluetoothItem,
          item: item,
        }
      })
    })
    this._bt.getDiscoveredDevices().then(result => {
      this._discoveredList = result
      this._otherList = this._discoveredList.filter(device => {
        if (!device.paired) {
          result = this._pairedList.map(a => a.deviceID)
          if (result.includes(device.deviceID)) {
            return false
          } else return device
        }
      })
      this._availableNetworks.h = this._otherList.length * 65 + 30
      this._availableNetworks.tag('List').h = this._otherList.length * 65
      this._availableNetworks.tag('List').items = this._otherList.map((item, index) => {
        return {
          ref: 'Other' + index,
          w: 1920 / 3,
          h: 65,
          type: BluetoothItem,
          item: item,
        }
      })
    })
  }

  static _states() {
    return [
      class Switch extends this {
        $enter() {
          this.tag('Switch').color = COLORS.hightlightColor
        }
        $exit() {
          this.tag('Switch').color = 0x00c0c0c0
        }
        _handleDown() {
          if (this._bluetooth) {
            if (this._pairedNetworks.tag('List').length > 0) {
              this._setState('PairedDevices')
            } else if (this._availableNetworks.tag('List').length > 0) {
              this._setState('AvailableDevices')
            }
          }
        }
        _handleEnter() {
          this.switch()
        }
      },
      class PairedDevices extends this {
        $enter() {}
        _getFocused() {
          return this._pairedNetworks.tag('List').element
        }
        _handleDown() {
          this._navigate('MyDevices', 'down')
        }
        _handleUp() {
          this._navigate('MyDevices', 'up')
        }
        _handleEnter() {
          this.tag('PairingScreen').visible = true
          this.tag('PairingScreen').item = this._pairedNetworks.tag('List').element._item
          this._setState('PairingScreen')
        }
      },
      class AvailableDevices extends this {
        $enter() {}
        _getFocused() {
          return this._availableNetworks.tag('List').element
        }
        _handleDown() {
          this._navigate('AvailableDevices', 'down')
        }
        _handleUp() {
          this._navigate('AvailableDevices', 'up')
        }
        _handleEnter() {
          this.tag('PairingScreen').visible = true
          this.tag('PairingScreen').item = this._availableNetworks.tag('List').element._item
          this._setState('PairingScreen')
        }
      },
      class PairingScreen extends this {
        _getFocused() {
          return this.tag('PairingScreen')
        }
        $pressEnter(option) {
          if (option === 'Cancel') {
            this._setState('Switch')
          } else if (option === 'Pair') {
            this._bt.pair(this._availableNetworks.tag('List').element._item.deviceID).then(() => {})
          } else if (option === 'Connect') {
            this._bt
              .connect(
                this._pairedNetworks.tag('List').element._item.deviceID,
                this._pairedNetworks.tag('List').element._item.deviceType
              )
              .then(result => {
                if (!result) {
                  this.tag('Message').text = 'CONNECTION FAILED'
                  this._setState('Switch')
                }
                setTimeout(() => {
                  this.tag('Message').text = ''
                }, 2000)
              })
          } else if (option === 'Disconnect') {
            this._bt
              .disconnect(
                this._pairedNetworks.tag('List').element._item.deviceID,
                this._pairedNetworks.tag('List').element._item.deviceType
              )
              .then(() => {})
            this._setState('Switch')
          } else if (option === 'Unpair') {
            this._bt.unpair(this._pairedNetworks.tag('List').element._item.deviceID).then(() => {})
            this._setState('Switch')
          }
        }
        $exit() {
          this.tag('PairingScreen').visible = false
        }
      },
    ]
  }

  /**
   * Function to navigate through the lists in the screen.
   * @param {string} listname
   * @param {string} dir
   */
  _navigate(listname, dir) {
    let list
    if (listname === 'MyDevices') list = this._pairedNetworks.tag('List')
    else if (listname === 'AvailableDevices') list = this._availableNetworks.tag('List')
    if (dir === 'down') {
      if (list.index < list.length - 1) list.setNext()
      else if (list.index == list.length - 1) {
        if (listname === 'MyDevices' && this._availableNetworks.tag('List').length > 0) {
          this._setState('AvailableDevices')
        }
      }
    } else if (dir === 'up') {
      if (list.index > 0) list.setPrevious()
      else if (list.index == 0) {
        if (listname === 'AvailableDevices' && this._pairedNetworks.tag('List').length > 0) {
          this._setState('PairedDevices')
        } else {
          this._setState('Switch')
        }
      }
    }
  }

  /**
   * Function to turn on and off Bluetooth.
   */
  switch() {
    if (this._bluetooth) {
      this._bt.disable().then(result => {
        if (result.success) {
          this._bluetooth = false
          this.tag('Networks').visible = false
          this.tag('Switch.Button').src = Utils.asset('images/switch-off.png')
        }
      })
    } else {
      this._bt.enable().then(result => {
        if (result.success) {
          this._bluetooth = true
          this.tag('Networks').visible = true
          this.tag('Switch.Button').src = Utils.asset('images/switch-on.png')
          this.renderDeviceList()
          this._bt.startScan()
        }
      })
    }
  }

  /**
   * Function to activate Bluetooth plugin.
   */
  _activateBluetooth() {
    this._bt.activate().then(() => {
      this._bt.registerEvent('onDiscoveredDevice', () => {
        this.renderDeviceList()
      })
      this._bt.registerEvent('onPairingChange', status => {
        this._bt.startScan()
        this.renderDeviceList()
        this._setState('Switch')
      })
      this._bt.registerEvent('onPairingRequest', notification => {
        if (notification.pinRequired === 'true' && notification.pinValue) {
          //this.fireAncestors('$rerenderDeviceOptions', notification.pinValue)
          this.tag('PairingScreen').code = notification.pinValue
        } else {
          this.respondToPairingRequest(notification.deviceID, 'ACCEPTED')
        }
      })
      this._bt.registerEvent('onConnectionChange', notification => {
        this._bt.startScan()
        console.log('CONNECTION CHANGED' + JSON.stringify(notification))
        this.renderDeviceList()
        this._setState('Switch')
        if (notification.connected) {
          this.tag('Message').text = 'CONNECTION SUCCESS'
        } else {
          this.tag('Message').text = 'CONNECTION FAILED'
        }
        setTimeout(() => {
          this.tag('Message').text = ''
        }, 2000)
      })
      this._bt.registerEvent('onDiscoveryCompleted', () => {
        this.tag('Networks.AvailableNetworks.Loader').visible = false
        this.renderDeviceList()
      })
      this._bt.registerEvent('onDiscoveryStarted', () => {
        this.tag('Networks.AvailableNetworks.Loader').visible = true
      })
      this._bt.registerEvent('onRequestFailed', notification => {
        this._bt.startScan()
        this.renderDeviceList()
        this._setState('Switch')
        this.tag('Message').text = notification.newStatus
        setTimeout(() => {
          this.tag('Message').text = ''
        }, 2000)
      })
      //this._bt.startScan()
      this._bt.getName().then(name => {
        this.tag('Name').text.text = `Now discoverable as "${name}"`
      })
      // this._bluetooth = true
      // this.tag('Networks').visible = true
      // this.tag('Switch.Button').src = Utils.asset('images/switch-on.png')
      // this.renderDeviceList()
    })
  }

  /**
   * Function to respond to Bluetooth client.
   * @param {number} deviceID
   * @param {string} responseValue
   */
  respondToPairingRequest(deviceID, responseValue) {
    this._bt.respondToEvent(deviceID, 'onPairingRequest', responseValue)
  }
}
