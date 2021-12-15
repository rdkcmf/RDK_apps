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
import NetworkApi from './../api/NetworkApi'
import WiFiItem from '../items/WiFiItem'
import SettingsMainItem from '../items/SettingsMainItem'
import WiFiApi from './../api/WifiApi'
import WiFiPairingScreen from './WiFiPairingScreen'
import { COLORS } from './../colors/Colors'
import { CONFIG } from '../Config/Config'
import JoinAnotherNetworkComponent from './JoinAnotherNetworkComponent'
import WifiFailScreen from './WifiFailScreen'

/**
* Class for WiFi screen.
*/
export default class WiFiScreen extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      FailScreen: {
        x: 780,
        y: 100,
        type: WifiFailScreen,
        zIndex: 5,
        visible: false
      },
      Switch: {
        type: SettingsMainItem,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'WiFi On/Off',
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          }
        },
        Loader: {
          visible: false,
          h: 45,
          w: 45,
          x: 1500,
          // x: 320,
          mountX: 1,
          y: 45,
          mountY: 0.5,
          src: Utils.asset('images/settings/Loading.gif'),
        },
        Button: {
          h: 45,
          w: 67,
          x: 1600,
          mountX: 1,
          y: 45,
          mountY: 0.5,
          src: Utils.asset('images/settings/ToggleOffWhite.png'),
        },
      },
      Networks: {
        y: 180,
        flex: { direction: 'column' },
        PairedNetworks: {
          flexItem: { margin: 0 },
          List: {
            type: Lightning.components.ListComponent,
            w: 1920 - 300,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true,
            rollMax: 900,
            itemScrollOffset: -4,
          },
        },
        AvailableNetworks: {
          flexItem: { margin: 0 },
          List: {
            w: 1920 - 300,
            type: Lightning.components.ListComponent,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true,
            rollMax: 900,
            itemScrollOffset: -4,
          },
        },
        visible: false,
      },
      JoinAnotherNetwork: {
        y: 90,
        type: SettingsMainItem,
        Title: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: 'Join Another Network',
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          }
        },
        visible: false,
      },
      PairingScreen: {
        x: -220,
        y: -265,
        w: 1920,
        h: 1080,
        zIndex: 4,
        visible: false,
        type: WiFiPairingScreen
      },
      JoinAnotherNetworkScreen: {
        x: -220,
        y: -265,
        w: 1920,
        h: 1080,
        zIndex: 4,
        visible: false,
        type: JoinAnotherNetworkComponent
      },


    }

  }

  _active() {
    this._setState('Switch')
  }

  _focus() {
    this._setState('Switch')
    new NetworkApi().getIP().then(ip => {
      this.fireAncestors('$changeIp', 'IP:' + ip)
    })
  }

  $goToWifiSwitch() {
    this._setState('Switch');
  }

  $removeFailScreen() {
    this._setState('Switch');
    this.childList.remove(this.tag('FailScreen'))
  }

  _setfailState(msg) {
    this.tag('FailScreen').item = msg
    this._setState('FailScreen');
  }


  _init() {

    this.wifiLoading = this.tag('Switch.Loader').animation({
      duration: 3,
      repeat: -1,
      stopMethod: 'immediate',
      stopDelay: 0.2,
      actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: Math.PI * 2 } }],
    })

    this.onError = {
      0: 'SSID_CHANGED - The SSID of the network changed',
      1: 'CONNECTION_LOST - The connection to the network was lost',
      2: 'CONNECTION_FAILED - The connection failed for an unknown reason',
      3: 'CONNECTION_INTERRUPTED - The connection was interrupted',
      4: 'INVALID_CREDENTIALS - The connection failed due to invalid credentials',
      5: 'NO_SSID - The SSID does not exist',
      6: 'UNKNOWN - Any other error.'
    }
    this._wifi = new WiFiApi()
    this._network = new NetworkApi()
    this.wifiStatus = true
    this._wifiIcon = true
    this._activateWiFi()
    this._setState('Switch')
    if (this.wiFiStatus) {
      this.tag('Networks').visible = true
      this.tag('JoinAnotherNetwork').visible = true
    }
    this._pairedNetworks = this.tag('Networks.PairedNetworks')
    this._availableNetworks = this.tag('Networks.AvailableNetworks')
    this._network.activate().then(result => {
      if (result) {
        this._network.registerEvent('onIPAddressStatusChanged', notification => {
          console.log(JSON.stringify(notification))
          if (notification.status == 'ACQUIRED') {
            //location.reload(true)
            this.fireAncestors('$changeIp', 'IP:' + notification.ip4Address)
          } else if (notification.status == 'LOST') {
            this.fireAncestors('$changeIp', 'IP:' + 'NA')
            if (notification.interface === 'WIFI') {
              this._wifi.setInterface('ETHERNET', true).then(res => {
                if (res.success) {
                  this._wifi.setDefaultInterface('ETHERNET', true)
                }
              })
            }
          }
        })
        this._network.registerEvent('onDefaultInterfaceChanged', notification => {
          console.log(JSON.stringify(notification))
          this.fireAncestors('$NetworkInterfaceText', notification.newInterfaceName)
          if (notification.newInterfaceName === 'ETHERNET') {
            this._wifi.setInterface('ETHERNET', true).then(result => {
              if (result.success) {
                this._wifi.setDefaultInterface('ETHERNET', true).then(result => {
                  if (result.success) {
                    this._wifi.disconnect()
                    this.wifiStatus = false
                    this.tag('Networks').visible = false
                    this.tag('JoinAnotherNetwork').visible = false
                    this.tag('Switch.Loader').visible = false
                    this.wifiLoading.stop()
                    this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
                  }
                })
              }
            })
          } else if (
            notification.newInterfaceName == 'ETHERNET' ||
            notification.oldInterfaceName == 'WIFI'
          ) {
            this._wifi.disconnect()
            this.wifiStatus = false
            this.tag('Networks').visible = false
            this.tag('JoinAnotherNetwork').visible = false
            this.tag('Switch.Loader').visible = false
            this.wifiLoading.stop()
            this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
            this._setState('Switch')
          }
        })
        this._network.registerEvent('onConnectionStatusChanged', notification => {
          if (notification.interface === 'ETHERNET' && notification.status === 'CONNECTED') {
            this._wifi.setInterface('ETHERNET', true).then(res => {
              if (res.success) {
                this._wifi.setDefaultInterface('ETHERNET', true)
              }
            })
          }
        })
      }
    })
  }

  /**
   * Function to be executed when the Wi-Fi screen is enabled.
   */
  _enable() {
    if (this.wifiStatus) {
      this._wifi.discoverSSIDs()
    }
    this.scanTimer = setInterval(() => {
      if (this.wifiStatus) {
        this._wifi.discoverSSIDs()
      }
    }, 5000)
  }

  /**
   * Function to be executed when the Wi-Fi screen is disabled.
   */
  _disable() {
    clearInterval(this.scanTimer)
  }



  /**
   * Function to render list of Wi-Fi networks.
   */
  renderDeviceList(ssids) {
    this._wifi.getConnectedSSID().then(result => {
      if (result.ssid != '') {
        this._pairedList = [result]
      } else {
        this._pairedList = []
      }
      this._pairedNetworks.h = this._pairedList.length * 90
      this._pairedNetworks.tag('List').h = this._pairedList.length * 90
      this._pairedNetworks.tag('List').items = this._pairedList.map((item, index) => {
        item.connected = true
        return {
          ref: 'Paired' + index,
          w: 1920 - 300,
          h: 90,
          type: WiFiItem,
          item: item,
        }
      })

      this._otherList = ssids.filter(device => {
        result = this._pairedList.map(a => a.ssid)
        if (result.includes(device.ssid)) {
          return false
        } else return device
      })
      this._availableNetworks.h = this._otherList.length * 90
      this._availableNetworks.tag('List').h = this._otherList.length * 90
      this._availableNetworks.tag('List').items = this._otherList.map((item, index) => {
        item.connected = false
        return {
          ref: 'Other' + index,
          w: 1620,
          h: 90,
          type: WiFiItem,
          item: item,
        }
      })
    })
  }

  $startConnectForAnotherNetwork(device, passphrase) {
    this._wifi.connect({ ssid: device.ssid, security: device.security }, passphrase)
    this._setState("Switch");
  }

  static _states() {
    return [
      class Switch extends this {
        $enter() {
          if (this.wifiStatus === true) {
            this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOnOrange.png')
            this.tag('Switch.Button').scaleX = 1;
          }
          this.tag('Switch')._focus()
        }
        $exit() {
          this.tag('Switch')._unfocus()
        }
        _handleDown() {
          if (this.wifiStatus === true) {
            this._setState('JoinAnotherNetwork')
          }
        }
        _handleEnter() {
          this.switch()
        }
      },
      class PairedDevices extends this {
        $enter() {
          if (this.wifiStatus === true) {
            this.tag('Switch.Loader').visible = false
            this.wifiLoading.stop()
            this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
            this.tag('Switch.Button').scaleX = -1;
          }

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
          this.tag('PairingScreen').visible = true
          this.tag('PairingScreen').item = this._pairedNetworks.tag('List').element._item
          this._setState('PairingScreen')
        }
      },
      class AvailableDevices extends this {
        $enter() {
          if (this.wifiStatus === true) {
            this.tag('Switch.Loader').visible = false
            this.wifiLoading.stop()
            this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
            this.tag('Switch.Button').scaleX = -1;
          }

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
          this.tag('PairingScreen').visible = true
          this.tag('PairingScreen').item = this._availableNetworks.tag('List').element._item
          this._setState('PairingScreen')
        }
      },
      class JoinAnotherNetwork extends this {
        $enter() {
          this.tag('JoinAnotherNetwork')._focus()
        }
        _handleUp() {
          this._setState('Switch')
        }
        _handleEnter() {
          if (this.wifiStatus) {
            this._setState("JoinAnotherNetworkScreenState");
          }
        }
        _handleDown() {
          console.log(`The Current Wifi Status = ${this.wifiStatus}`);
          if (this.wifiStatus) {
            if (this._pairedNetworks.tag('List').length > 0) {
              this._setState('PairedDevices')
            } else if (this._availableNetworks.tag('List').length > 0) {
              this._setState('AvailableDevices')
            }
          }
        }
        $exit() {
          this.tag('JoinAnotherNetwork')._unfocus()
        }
      },

      class JoinAnotherNetworkScreenState extends this{
        $enter() {
          this.tag('JoinAnotherNetworkScreen').visible = true;
        }
        _getFocused() {
          return this.tag("JoinAnotherNetworkScreen")
        }
        _handleBack() {
          this._setState("JoinAnotherNetwork");
        }
        $goToJoinAnotherNetwork() {
          this._setState("JoinAnotherNetwork")
        }
        $exit() {
          this.tag('JoinAnotherNetworkScreen').visible = false;
        }
      },

      class PairingScreen extends this {
        $enter() {
          this._wifi.stopScan()
          this._disable()
          this.tag("PairingScreen").visible = true;
        }
        _getFocused() {
          return this.tag('PairingScreen')
        }
        $pressEnter(option) {
          if (option === 'Cancel') {
            this._setState('Switch')
          } else if (option === 'Connect') {
            if (this._availableNetworks.tag('List').element) {
              this._wifi
                .connect(this._availableNetworks.tag('List').element._item, '')
                .then(() => { })
            }
            this._setState('Switch')
          } else if (option === 'Disconnect') {
            this._wifi.disconnect().then(() => {
              this._setState('Switch')
            })

          }
        }
        $startConnect(password) {
          if (this._availableNetworks.tag('List').element && password != null) {
            this._wifi.connect(this._availableNetworks.tag('List').element._item, password)
          }
          this._setState('Switch')
        }
        $exit() {
          this.tag('PairingScreen').visible = false
          this._enable()
        }
      },
      class FailScreen extends this{
        $enter() {
          this.tag('FailScreen').visible = true
        }
        _getFocused() {
          return this.tag('FailScreen')
        }
        $exit() {
          this.tag('FailScreen').visible = true
        }
      }
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
          this._setState('JoinAnotherNetwork')
        }
      }
    }
  }
  /**
   * Function to turn on and off Wi-Fi.
   */
  switch() {
    if (this.wifiStatus) {
      this._wifi.disconnect()
      console.log('turning off wifi')
      this._wifi.setInterface('ETHERNET', true).then(result => {
        if (result.success) {
          this._wifi.setDefaultInterface('ETHERNET', true).then(result => {
            if (result.success) {
              this._wifi.disconnect()
              this.wifiStatus = false
              this.tag('Networks').visible = false
              this.tag('JoinAnotherNetwork').visible = false
              this.tag('Switch.Loader').visible = false
              this.wifiLoading.stop()
              this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
            }
          })
        }
      })
    } else {
      console.log('turning on wifi')
      this.wifiStatus = true
      this.tag('Networks').visible = true
      this.tag('JoinAnotherNetwork').visible = true
      this.wifiLoading.play()
      this.tag('Switch.Loader').visible = true
      this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOnOrange.png')
      this._wifi.discoverSSIDs()
    }
  }


  /**
   * Function to activate Wi-Fi plugin.
   */
  _activateWiFi() {
    this._wifi.activate().then(() => {
      this.switch()
    })
    this._wifi.registerEvent('onWIFIStateChanged', notification => {
      console.log(JSON.stringify(notification))
      if (notification.state === 2 || notification.state === 5) {
        this._wifi.discoverSSIDs()
      }
      this._setState('Switch')
    })
    this._wifi.registerEvent('onError', notification => {
      this._wifi.discoverSSIDs()
      this._wifi.setInterface('ETHERNET', true).then(res => {
        if (res.success) {
          this._wifi.setDefaultInterface('ETHERNET', true)
        }
      })
      this._setfailState(this.onError[notification.code])
    })
    this._wifi.registerEvent('onAvailableSSIDs', notification => {
      this.renderDeviceList(notification.ssids)
      if (!notification.moreData) {
        setTimeout(() => {
          this.tag('Switch.Loader').visible = false
          this.wifiLoading.stop()
        }, 1000)
      }

    })
  }
}
