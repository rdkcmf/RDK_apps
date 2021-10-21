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
import SettingsMainItem from '../items/SettingsMainItem'
import SettingsItem from '../items/SettingsItem'
import BluetoothApi from './../api/BluetoothApi'
import BluetoothConfirmation from './BluetoothConfirmation'
import BluetoothPairingScreen from './BluetoothPairingScreen'
import { COLORS } from './../colors/Colors'
import { CONFIG } from '../Config/Config'

/**
 * Class for Bluetooth screen.
 */
export default class BluetoothScreen extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      Confirmation: {
        x: 700,
        y: 100,
        type: BluetoothConfirmation,
        visible: false
      },
      PairingScreen: {
        x: 700,
        y: 100,
        type: BluetoothPairingScreen,
        zIndex: 100,
        visible: false
      },
      Switch: {
        // y: 0 + 200,
        type: SettingsMainItem,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'Bluetooth On/Off',
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          }
        },
        Button: {
          h: 30 * 1.5,
          w: 44.6 * 1.5,
          x: 1535,
          mountX: 1,
          y: 45,
          mountY: 0.5,
          src: Utils.asset('images/settings/ToggleOnOrange.png'),
        },
      },
      Searching: {
        visible: false,
        h:90,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'Searching for Devices',
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          }
        },
        Loader: {
          h: 30 * 1.5,
          w: 30 * 1.5,
          // x: 1535,
          x: 320,
          mountX: 1,
          y: 45,
          mountY: 0.5,
          src: Utils.asset('images/settings/Loading.gif'),
        },
      },
      Networks: {
        PairedNetworks: {
          y: 180,
          List: {
            type: Lightning.components.ListComponent,
            w: 1920 - 300,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true,
            rollMax: 900,
            itemScrollOffset: -6,
          },
        },
        AvailableNetworks: {
          y: 90,
          visible: false,
          List: {
            w: 1920 - 300,
            type: Lightning.components.ListComponent,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true,
            rollMax: 900,
            itemScrollOffset: -6,
          },
        },
        visible: false,
      },
      AddADevice: {
        y: 90,
        type: SettingsMainItem,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'Add A Device',
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          }
        },
        visible: false,
      },
      // PairingScreen: {
      //   x: 1920 - 1920 / 3,
      //   y: 0,
      //   w: 1920 / 3,
      //   h: 1080,
      //   visible: false,
      //   type: BluetoothPairingScreen,
      // },
      // Message: {
      //   x: 1920 - 1920 / 3 + 40,
      //   y: 950,
      //   text: { text: '' },
      // },
    }
  }

  _init() {
    // this.loadingAnimation = this.tag('Networks.AvailableNetworks.Loader').animation({
    //   duration: 1,
    //   repeat: -1,
    //   stopMethod: 'immediate',
    //   stopDelay: 0.2,
    //   actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: Math.PI * 2 } }],
    // })
    // this.loadingAnimation.play()
    this._bt = new BluetoothApi()
    this._bluetooth = true
    this._activateBluetooth()
    this._setState('Switch')
    this._bluetooth = true
    if (this._bluetooth) {
      this.tag('Networks').visible = true
      this.tag('AddADevice').visible = true
    }
    this._pairedNetworks = this.tag('Networks.PairedNetworks')
    this._availableNetworks = this.tag('Networks.AvailableNetworks')
    this.renderDeviceList()


    this.loadingAnimation = this.tag('Searching.Loader').animation({
      duration: 3, repeat: -1, stopMethod: 'immediate', stopDelay: 0.2,
      actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: 2 * Math.PI } }]
    });

    this.loadingAnimation.start()

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
   * Function to be executed when add a device is pressed
   */

  showAvailableDevices() {
    this.tag('Switch').patch({ alpha: 0 });
    this.tag('PairedNetworks').patch({ alpha: 0 });
    this.tag('AddADevice').patch({ alpha: 0 });
    this.tag('Searching').patch({ visible: true });
    this.tag('AvailableNetworks').patch({ visible: true });
    //  this.loadingAnimation.stop()
    // this.tag('TopPanel').patch({ alpha: 0 });
    // this.tag('SidePanel').patch({ alpha: 0 });
  }

  hideAvailableDevices() {
    this.tag('Switch').patch({ alpha: 1 });
    this.tag('PairedNetworks').patch({ alpha: 1 });
    this.tag('AddADevice').patch({ alpha: 1 });
    this.tag('Searching').patch({ visible: false });
    this.tag('AvailableNetworks').patch({ visible: false });
    this.tag('Confirmation').patch({ visible: false });
    //  this.loadingAnimation.start()
    // this.tag('TopPanel').patch({ alpha: 0 });
    // this.tag('SidePanel').patch({ alpha: 0 });
  }

  showPairingScreen() {
    this.tag('Switch').patch({ alpha: 0 });
    this.tag('PairedNetworks').patch({ alpha: 0 });
    this.tag('AddADevice').patch({ alpha: 0 });
    this.tag('Searching').patch({ visible: false });
    this.tag('AvailableNetworks').patch({ visible: false });
    this.tag('Confirmation').patch({ visible: false });
    this.tag('PairingScreen').patch({ visible: true });
    this.fireAncestors('$hideTopPanel');
    // this.tag('TopPanel').patch({ alpha: 0 });
    // this.tag('SidePanel').patch({ alpha: 0 });
  }

  hidePairingScreen() {
    this.tag('Switch').patch({ alpha: 1 });
    this.tag('PairedNetworks').patch({ alpha: 1 });
    this.tag('AddADevice').patch({ alpha: 1 });
    this.tag('Searching').patch({ visible: false });
    this.tag('AvailableNetworks').patch({ visible: false });
    this.tag('Confirmation').patch({ visible: false });
    this.tag('PairingScreen').patch({ visible: false });
    this.fireAncestors('$showTopPanel');
    // this.tag('TopPanel').patch({ alpha: 0 });
    // this.tag('SidePanel').patch({ alpha: 0 });
  }

  showConfirmation() {
    this.tag('Switch').patch({ alpha: 0 });
    this.tag('PairedNetworks').patch({ alpha: 0 });
    this.tag('AddADevice').patch({ alpha: 0 });
    this.tag('Searching').patch({ visible: false });
    this.tag('AvailableNetworks').patch({ visible: false });
    this.tag('PairingScreen').patch({ visible: false });
    this.tag('Confirmation').patch({ visible: true });
    this.fireAncestors('$hideTopPanel');
    // this.tag('TopPanel').patch({ alpha: 0 });
    // this.tag('SidePanel').patch({ alpha: 0 });
  }

  hideConfirmation() {
    this.tag('Switch').patch({ alpha: 1 });
    this.tag('PairedNetworks').patch({ alpha: 1 });
    this.tag('AddADevice').patch({ alpha: 1 });
    this.tag('Searching').patch({ visible: false });
    this.tag('AvailableNetworks').patch({ visible: false });
    this.tag('PairingScreen').patch({ visible: false });
    this.tag('Confirmation').patch({ visible: false });
    this.fireAncestors('$showTopPanel');
    // this.tag('TopPanel').patch({ alpha: 0 });
    // this.tag('SidePanel').patch({ alpha: 0 });
  }

  /**
   * Function to render list of Bluetooth devices
   */
  renderDeviceList() {
    this._bt.getPairedDevices().then(result => {
      this._pairedList = result
      this._pairedNetworks.h = this._pairedList.length * 90
      this._pairedNetworks.tag('List').h = this._pairedList.length * 90
      this._pairedNetworks.tag('List').items = this._pairedList.map((item, index) => {
        item.paired = true
        return {
          ref: 'Paired' + index,
          w: 1920 - 300,
          h: 90,
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
      this._availableNetworks.h = this._otherList.length * 90
      this._availableNetworks.tag('List').h = this._otherList.length * 90
      this._availableNetworks.tag('List').items = this._otherList.map((item, index) => {
        return {
          ref: 'Other' + index,
          w: 1920 - 300,
          h: 90,
          type: BluetoothItem,
          item: item,
        }
      })
    })
  }

  // connectBluetooth(option) {
  //   if (this._pairedNetworks.tag('List').element._item.connected){
  //     this._bt
  //       .disconnect(
  //         this._pairedNetworks.tag('List').element._item.deviceID,
  //         this._pairedNetworks.tag('List').element._item.deviceType
  //       )
  //       .then(() => {})
  //     this._setState('Switch')
  //   } else if( !this._pairedNetworks.tag('List').element._item.connected){
  //     this._setState('Confirmation')
  //     this._bt
  //       .connect(
  //         this._pairedNetworks.tag('List').element._item.deviceID,
  //         this._pairedNetworks.tag('List').element._item.deviceType
  //       )
  //       .then(result => {
  //         if (!result) {
  //           this.tag('Message').text = 'CONNECTION FAILED'
  //           this._setState('Switch')
  //         }
  //         setTimeout(() => {
  //           this.tag('Message').text = ''
  //         }, 2000)
  //       })
  //   }   
  // }

  $pressEnter(option) {
    if (option === 'Cancel') {
      this._setState('Switch')
    } else if (option === 'Pair') {
      this._bt.pair(this._availableNetworks.tag('List').element._item.deviceID).then(result => {
        this.tag('Confirmation').item = this._availableNetworks.tag('List').element._item
        if (result.success) {
          this.tag('Confirmation.Pairing').text = 'Pairing Succesful'
          this._setState('Confirmation')
        } else {
          this.tag('Confirmation.Pairing').text = 'Pairing Failed'
          this._setState('Confirmation')
        }
        setTimeout(() => {
          // this.tag('Message').text = ''
          this._setState('Switch')
          this.tag('Confirmation.Pairing').text = ''
        }, 5000)
      })
      this._setState('Switch')
    } else if (option === 'Connect') {
      this._bt
        .connect(
          this._pairedNetworks.tag('List').element._item.deviceID,
          this._pairedNetworks.tag('List').element._item.deviceType
        )
        .then(result => {
          this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
          if (!result) {
            // this.tag('Message').text = 'CONNECTION FAILED'
            this.tag('Confirmation.Pairing').text = 'Connection Failed'
            this._setState('Confirmation')
          } else {
            this.tag('Confirmation.Pairing').text = 'Connection Successful'
            this._setState('Confirmation')
          }
          setTimeout(() => {
            // this.tag('Message').text = ''
            this._setState('Switch')
            this.tag('Confirmation.Pairing').text = ''
          }, 5000)
        })
      this._setState('Switch')
    } else if (option === 'Disconnect') {
      this._bt
        .disconnect(
          this._pairedNetworks.tag('List').element._item.deviceID,
          this._pairedNetworks.tag('List').element._item.deviceType
        )
        .then(result => {
          this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
          if (!result) {
            this.tag('Confirmation.Pairing').text = 'Failed to Disconnect'
            this._setState('Confirmation')
          } else {
            this.tag('Confirmation.Pairing').text = 'Disconnected'
            this._setState('Confirmation')
          }
          setTimeout(() => {
            // this.tag('Message').text = ''
            this._setState('Switch')
            this.tag('Confirmation.Pairing').text = ''
          }, 5000)
        })
      this._setState('Switch')
    } else if (option === 'Unpair') {
      this._bt.unpair(this._pairedNetworks.tag('List').element._item.deviceID).then(result => {
        this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
        if (result.success) {
          this.tag('Confirmation.Pairing').text = 'Unpaired'
          this._setState('Confirmation')
        } else {
          this.tag('Confirmation.Pairing').text = 'Unpairing Failed'
          this._setState('Confirmation')
        }
        setTimeout(() => {
          // this.tag('Message').text = ''
          this._setState('Switch')
          this.tag('Confirmation.Pairing').text = ''
        }, 5000)
      })
      this._setState('Switch')
    }
  }

  static _states() {
    return [
      class Switch extends this {
        $enter() {
          this.hideAvailableDevices()
          this.hidePairingScreen()
          this.tag('Switch')._focus()
        }
        $exit() {
          this.tag('Switch')._unfocus()
        }
        _handleDown() {
          this._setState('AddADevice')
          // if (this._bluetooth) {
          //   if (this._pairedNetworks.tag('List').length > 0) {
          //     this._setState('PairedDevices')
          //   } else if (this._availableNetworks.tag('List').length > 0) {
          //     this._setState('AvailableDevices')
          //   }
          // }
        }
        _handleUp() {
          // this.fireAncestors('$goToTopPanel', 4)
        }
        _handleLeft() {
          // this.fireAncestors('$goToSidePanel', 0)
        }
        _handleEnter() {
          this.switch()
        }
      },
      class Confirmation extends this{
        $enter() {
          this.showConfirmation()
        }
        _getFocused() {
          return this.tag('Confirmation')
        }
        $pressOK() {
          this._setState('Switch')
          this.hideConfirmation()
        }
      },

      class PairedDevices extends this {
        $enter() {
          this.hideAvailableDevices()
        }
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
          // this.connectBluetooth(this._pairedNetworks.tag('List').element.ref)
          // this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
          this.showPairingScreen()
          // this.tag('PairingScreen').visible = true
          this.tag('PairingScreen').item = this._pairedNetworks.tag('List').element._item
          this._setState('PairingScreen')
        }
      },
      class AvailableDevices extends this {
        $enter() {
          // this.showAvailableDevices()
        }
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
          this.$pressEnter('Pair')
          this.tag('Confirmation').item = this._availableNetworks.tag('List').element._item
          // this.tag('PairingScreen').visible = true
          // this.tag('PairingScreen').item = this._availableNetworks.tag('List').element._item
          // this._setState('PairingScreen')
        }
        _handleBack() {
          this.hideAvailableDevices()
          this._setState('Switch')
        }
      },
      class AddADevice extends this {
        $enter() {
          this.tag('AddADevice')._focus()
          this.hideAvailableDevices()
        }
        _handleUp() {
          this._setState('Switch')
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
        $exit() {
          this.tag('AddADevice')._unfocus()
        }
        _handleEnter() {
          if (this._bluetooth) {
            this.showAvailableDevices()
            this._setState('AvailableDevices')
            // if (this._availableNetworks.tag('List').length>0){
            //   this._setState('AvailableDevices')
            // }
            // else{
            //   this._setState('Searching')
            // }
          }
        }
      },
      class Searching extends this {
        $enter() {
          this.showAvailableDevices()
        }

        _handleBack() {
          this.hideAvailableDevices()
          this._setState('Switch')
        }
        _handleDown() {
          this._setState('AvailableDevices')
        }
      },
      class PairingScreen extends this {
        $enter() {
          this._disable()
          this._bt.stopScan()
          return this.tag('PairingScreen')
        }
        _handleBack() {
          this.hidePairingScreen()
          this._setState('Switch')
        }
        $goBack() {
          this.hidePairingScreen()
          this._setState('Switch')
        }
        _getFocused() {
          return this.tag('PairingScreen')
        }

        $exit() {
          this.tag('PairingScreen').visible = false
          this._enable()
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
          // this._setState('AvailableDevices')
        }
      }
    } else if (dir === 'up') {
      if (list.index > 0) list.setPrevious()
      else if (list.index == 0) {
        if (listname === 'AvailableDevices' && this._pairedNetworks.tag('List').length > 0) {
          // this._setState('PairedDevices')
        } else if (listname === 'MyDevices') {
          this._setState('AddADevice')
          // } else if (listname === 'AvailableDevices'){
          //   this._setState('Searching')
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
          this.tag('AddADevice').visible = false
          this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
        }
      })
    } else {
      this._bt.enable().then(result => {
        if (result.success) {
          this._bluetooth = true
          this.tag('Networks').visible = true
          this.tag('AddADevice').visible = true
          this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOnOrange.png')
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
        this._setState('Confirmation')
        this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item

      })
      this._bt.registerEvent('onPairingRequest', notification => {
        if (notification.pinRequired === 'true' && notification.pinValue) {
          this.tag('PairingScreen').code = notification.pinValue
        } else {
          this.respondToPairingRequest(notification.deviceID, 'ACCEPTED')
        }
      })
      this._bt.registerEvent('onConnectionChange', notification => {
        this._bt.startScan()
        this.renderDeviceList()
        //  this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
        if (notification.connected) {
          // this.tag('Message').text = 'CONNECTION SUCCESS'
          this.tag('Confirmation.Pairing').text = 'CONNECTION SUCCESS'
        } else {
          // this.tag('Message').text = 'CONNECTION FAILED'
          this.tag('Confirmation.Pairing').text = 'CONNECTION FAILED'
        }
        setTimeout(() => {
          // this.tag('Message').text = ''
          this._setState('Switch')
          this.tag('Confirmation.Pairing').text = ''
        }, 5000)
        this._setState('Confirmation')
      })
      this._bt.registerEvent('onDiscoveryCompleted', () => {
        this.tag('Searching.Loader').visible = false
        this.renderDeviceList()
      })
      this._bt.registerEvent('onDiscoveryStarted', () => {
        this.tag('Searching.Loader').visible = true
      })
      this._bt.registerEvent('onRequestFailed', notification => {
        this._bt.startScan()
        this.renderDeviceList()
        this._setState('Confirmation')
        //  this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
        // this.tag('Confirmation').item.name = notification.params.name
        this.tag('Confirmation.Pairing').text = notification.newStatus
        setTimeout(() => {
          // this.tag('Message').text = ''
          this._setState('Switch')
          this.tag('Confirmation.Pairing').text = ''
        }, 5000)
      })
      this._bt.getName().then(name => {
        this.tag('Name').text.text = `Now discoverable as "${name}"`
      })
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
