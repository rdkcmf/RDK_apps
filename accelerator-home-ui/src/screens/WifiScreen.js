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
import WiFiItem from '../items/WiFiItem'
import WiFiApi from './../api/WifiApi'
import WiFiPairingScreen from './WiFiPairingScreen'
import ThunderJS from 'ThunderJS'
import { COLORS } from './../colors/Colors'

/**
 * Class for WiFi screen.
 */
export default class WiFiScreen extends Lightning.Component {
  static _template() {
    return {
      Title: {
        x: 1920 - 1920 / 3 + 1920 / 6,
        y: 50,
        text: { text: 'Wi-Fi', textColor: COLORS.headingColor },
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
          text: { text: 'Wi-Fi', textColor: COLORS.titleColor },
        },
        Button: {
          x: 1920 / 3 - 80,
          y: 10,
          mountX: 1,
          src: Utils.asset('images/switch-off.png'),
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
              text: 'My Network',
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
              text: 'Other Networks',
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
        type: WiFiPairingScreen,
      },
      IpAddress: {
        x: 1820,
        y: 920,
        mountX: 1,
        mountY: 0,
        text: {
          text: 'IP:NA',
          textColor: COLORS.titleColor,
          fontSize: 30,
        },
      },
    }
  }
  _active() {
    this._setState('Switch')
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
    this._wifi = new WiFiApi()
    this.wifiStatus = false
    this._activateWiFi()
    this._setState('Switch')
    //this.wifiStatus = true
    if (this.wiFiStatus) {
      this.tag('Networks').visible = true
    }
    this._pairedNetworks = this.tag('Networks.PairedNetworks')
    this._availableNetworks = this.tag('Networks.AvailableNetworks')
    const config = {
      host: '127.0.0.1',
      port: 9998,
      default: 1,
    }
    var thunder = ThunderJS(config)
    const systemCallsign = 'org.rdk.System'
    thunder.Controller.activate({ callsign: systemCallsign })
      .then(() => {
        this.displayIp()
      })
      .catch(err => {
        console.log('System Error', err)
      })
    this._wifi.registerEvent('onIPAddressStatusChanged', notification => {
      if (notification.status == 'ACQUIRED') {
        this.tag('IpAddress').text.text = 'IP:' + notification.ip4Address
      } else if (notification.status == 'LOST') {
        this.tag('IpAddress').text.text = 'IP:NA'
      }
    })
    this._wifi.registerEvent('onDefaultInterfaceChanged', notification => {
      console.log(notification)
      if (notification.newInterfaceName == 'WIFI') {
        this._wifi.setEnabled(true).then(result => {
          if (result.success) {
            this.wifiStatus = true
            this.tag('Networks').visible = true
            this.tag('Switch.Button').src = Utils.asset('images/switch-on.png')
            this._wifi.discoverSSIDs()
            this.tag('Networks.AvailableNetworks.Loader').visible = true
          }
        })
      } else if (
        notification.newInterfaceName == 'ETHERNET' ||
        notification.oldInterfaceName == 'WIFI'
      ) {
        this._wifi.disconnect()
        this.wifiStatus = false
        this.tag('Networks').visible = false
        this.tag('Switch.Button').src = Utils.asset('images/switch-off.png')
        this._setState('Switch')
      }
    })
  }
  displayIp() {
    const config = {
      host: '127.0.0.1',
      port: 9998,
      default: 1,
    }
    var thunder = ThunderJS(config)
    const systemCallsign = 'org.rdk.System'
    thunder
      .call(systemCallsign, 'getDeviceInfo', { params: 'estb_ip' })
      .then(result => {
        this.tag('IpAddress').text.text = 'IP:' + result.estb_ip
      })
      .catch(err => {
        console.log('IpAddress Error', err)
      })
  }

  /**
   * Function to be executed when the Wi-Fi screen is enabled.
   */
  _enable() {
    if (this.wifiStatus) {
      this._wifi.discoverSSIDs()
      this.tag('Networks.AvailableNetworks.Loader').visible = true
    }
    this.scanTimer = setInterval(() => {
      if (this.wifiStatus) {
        this._wifi.discoverSSIDs()
        this.tag('Networks.AvailableNetworks.Loader').visible = true
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
      this._pairedNetworks.h = this._pairedList.length * 65 + 30
      this._pairedNetworks.tag('List').h = this._pairedList.length * 65
      this._pairedNetworks.tag('List').items = this._pairedList.map((item, index) => {
        item.connected = true
        return {
          ref: 'Paired' + index,
          w: 1920 / 3,
          h: 65,
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
      this._availableNetworks.h = this._otherList.length * 65 + 30
      this._availableNetworks.tag('List').h = this._otherList.length * 65
      this._availableNetworks.tag('List').items = this._otherList.map((item, index) => {
        item.connected = false
        return {
          ref: 'Other' + index,
          w: 1920 / 3,
          h: 65,
          type: WiFiItem,
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
          if (this.wifiStatus) {
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
        $enter() {
          this._wifi.stopScan()
          this._disable()
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
                .then(() => {})
            }
            this._setState('Switch')
          } else if (option === 'Disconnect') {
            this._wifi.disconnect().then(() => {})
            this._setState('Switch')
          }
        }
        $startConnect(password) {
          if (this._availableNetworks.tag('List').element && password != null) {
            this._wifi.connect(this._availableNetworks.tag('List').element._item, password)
          } else {
            this.patch({
              FailureMessage: {
                x: (1920 * 2) / 3 + 40,
                y: 950,
                text: { text: 'FAILED' },
              },
            })
            setTimeout(() => {
              this.childList.remove(this.tag('FailureMessage'))
            }, 2000)
          }
          this._setState('Switch')
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
   * Function to turn on and off Wi-Fi.
   */
  switch() {
    if (this.wifiStatus) {
      this._wifi.setInterface('ETHERNET', true).then(result => {
        if (result.success) {
          this._wifi.setDefaultInterface('ETHERNET', true).then(result => {
            if (result.success) {
              this._wifi.disconnect()
              this.wifiStatus = false
              this.tag('Networks').visible = false
              this.tag('Switch.Button').src = Utils.asset('images/switch-off.png')
            }
          })
        }
      })
    } else {
      this._wifi.setInterface('WIFI', true).then(result => {
        if (result.success) {
          this._wifi.setDefaultInterface('WIFI', false).then(result => {
            if (result.success) {
              this._wifi.setEnabled(true).then(result => {
                if (result.success) {
                  this.wifiStatus = true
                  this.tag('Networks').visible = true
                  this.tag('Switch.Button').src = Utils.asset('images/switch-on.png')
                  this._wifi.discoverSSIDs()
                  this.tag('Networks.AvailableNetworks.Loader').visible = true
                }
              })
            }
          })
        }
      })
    }
  }

  /**
   * Function to activate Wi-Fi plugin.
   */
  _activateWiFi() {
    this._wifi.activate().then(() => {
      this._wifi.getDefaultInterface().then(result => {
        if (result.interface == 'WIFI') {
          this.switch()
        }
      })
    })
    //this._wifi.discoverSSIDs()
    this.tag('Networks.AvailableNetworks.Loader').visible = true
    this._wifi.registerEvent('onWIFIStateChanged', notification => {
      if (notification.state === 2 || notification.state === 5) {
        this._wifi.discoverSSIDs()
        this.tag('Networks.AvailableNetworks.Loader').visible = true
      }
      this._setState('Switch')
    })
    this._wifi.registerEvent('onError', notification => {
      this._wifi.discoverSSIDs()
      this.tag('Networks.AvailableNetworks.Loader').visible = true
      if (notification.code == 4) {
        this.patch({
          FailureMessage: {
            x: (1920 * 2) / 3 + 40,
            y: 950,
            text: { text: 'INCORRECT PASSWORD' },
          },
        })
        setTimeout(() => {
          this.childList.remove(this.tag('FailureMessage'))
        }, 2000)
      }
      this._setState('Switch')
    })
    this._wifi.registerEvent('onAvailableSSIDs', notification => {
      this.tag('Networks.AvailableNetworks.Loader').visible = false
      this.renderDeviceList(notification.ssids)
    })
  }
}
