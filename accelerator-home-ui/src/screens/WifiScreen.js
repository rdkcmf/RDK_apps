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
import { Language, Lightning, Router, Utils } from '@lightningjs/sdk'
import NetworkApi from './../api/NetworkApi'
import WiFiItem from '../items/WiFiItem'
import SettingsMainItem from '../items/SettingsMainItem'
import WiFiApi from './../api/WifiApi'
import { COLORS } from './../colors/Colors'
import { CONFIG } from '../Config/Config'

/**
* Class for WiFi screen.
*/
export default class WiFiScreen extends Lightning.Component {


  pageTransition() {
    return 'left'
  }

  static _template() {
    return {
      rect: true,
      color: 0xCC000000,
      w: 1920,
      h: 1080,
      WifiContents: {
        x: 200,
        y: 275,
        Switch: {
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: Language.translate('WiFi On/Off'),
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
            src: Utils.asset('images/settings/Loading.png'),
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
              text: Language.translate('Join Another Network'),
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          visible: false,
        },
      },
    }

  }

  _active() {
    this._setState('Switch')
  }

  _focus() {
    this._setState('Switch')
    this._enable()
  }


  _firstEnable() {

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
    this.wifiStatus = false
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
        this.wifiStatus = true
        this._network.registerEvent('onIPAddressStatusChanged', notification => {
          console.log(JSON.stringify(notification))
          if (notification.status == 'LOST') {
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
          if (notification.newInterfaceName === 'ETHERNET') {
            this._wifi.setInterface('ETHERNET', true).then(result => {
              if (result.success) {
                this._wifi.setDefaultInterface('ETHERNET', true)
              }
            })
          } if (
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
            this._wifi.setInterface('ETHERNET', true).then(result => {
              if (result.success) {
                this._wifi.setDefaultInterface('ETHERNET', true).then(result1 => {
                  if (result1.success) {
                    console.log('set default success', result1)
                  }
                })
              }
            })
          }
          if (
            notification.newInterfaceName == '' &&
            notification.oldInterfaceName == 'WIFI'
          ) {
            this._wifi.setInterface('ETHERNET', true).then(result => {
              if (result.success) {
                this._wifi.setDefaultInterface('ETHERNET', true).then(result1 => {
                  if (result1.success) {
                    console.log('set default success', result1)
                  }
                })
              }
            })
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
  }

  /**
   * Function to be executed when the Wi-Fi screen is disabled.
   */
  _disable() {
    this._wifi.stopScan()
  }

  pairedDevices(){
    this._pairedNetworks.tag('List').items = []
    this._availableNetworks.tag('List').items =[]
  }

  /**
   * Function to render list of Wi-Fi networks.
   */
  renderDeviceList(ssids) {
    this._pairedList  =[];
     this._pairedNetworks.h = 0;
     this._pairedNetworks.tag('List').items = []
     this._pairedNetworks.tag('List').h  = 0
    this._wifi.getConnectedSSID().then(result => {
      console.log("getconnectedSSID response", result)
      if (result.ssid != '') {
        this._pairedList = [result]
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

      }

      this._otherList = ssids.filter(device => {
        console.log("SSID filter", device)
        result = this._pairedList.map(a => a.ssid)
        if (result.includes(device.ssid)) {
          return false
        } else return device
      })
      this._availableNetworks.h = this._otherList.length * 90
      this._availableNetworks.tag('List').h = this._otherList.length * 90
      //this._availableNetworks.tag('List').y = this._pairedNetworks.tag('List').h
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
  _handleBack() {
    if(!Router.isNavigating()){
    Router.navigate('settings/network/interface')
    }
  }

  _onChanged() {
    this.widgets.menu.updateTopPanelText(Language.translate('Settings  Network Configuration  Network Interface  WiFi'))
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
          Router.navigate('settings/network/interface/wifi/connect', { wifiItem: this._pairedNetworks.tag('List').element._item })
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
          console.log("SSID check", this._availableNetworks.tag('List').element._item)
          let item = this._availableNetworks.tag('List').element._item
          console.log("enter connect method")
          this._wifi.getSSIDKey().then((response)=>{
            console.log("ssid check")
            if(response === item.ssid ){
              this._wifi.connect().then((response)=>{console.log(response)})
              .catch(err =>{ 
                Router.navigate('settings/network/interface/wifi/connect', { wifiItem: this._availableNetworks.tag('List').element._item })
                this._wifi.SaveSSIDKey("").then(()=>{})})
               
            }
            else { Router.navigate('settings/network/interface/wifi/connect', { wifiItem: this._availableNetworks.tag('List').element._item })}
          })
          //Router.navigate('settings/network/interface/wifi/connect', { wifiItem: this._availableNetworks.tag('List').element._item })
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
            Router.navigate('settings/network/interface/wifi/another')
          }
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
        $exit() {
          this.tag('JoinAnotherNetwork')._unfocus()
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
      if(list.length === 0) {
        this._setState('JoinAnotherNetwork')
        return;
      }
      if (list.index < list.length - 1) list.setNext()
      else if (list.index == list.length - 1) {
        this._wifi.discoverSSIDs()
        if (listname === 'MyDevices' && this._availableNetworks.tag('List').length > 0) {
          this._setState('AvailableDevices')
        }
      }
    } else if (dir === 'up') {
      if(list.length === 0) {
        this._setState('JoinAnotherNetwork')
        return;
      }
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
      this.pairedDevices()
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
      if(notification.state === 5){
        this._wifi.getConnectedSSID().then(result => {
        this._wifi.SaveSSIDKey(result.ssid).then((response)=>{console.log(response)})
        })
      }
    })
    this._wifi.registerEvent('onError', notification => {
      if(notification.code === 4){
        this._wifi.clearSSID()
      }
      console.log('on errro')
      this._wifi.discoverSSIDs()
      this._wifi.setInterface('ETHERNET', true).then(res => {
        if (res.success) {
          this._wifi.setDefaultInterface('ETHERNET', true)
        }
      })
      if (this.widgets) {
        this.widgets.fail.notify({ title: 'WiFi Error', msg: this.onError[notification.code] })
        Router.focusWidget('Fail')
      }
    })
    this._wifi.registerEvent('onAvailableSSIDs', notification => {
      console.log("Notification[onAvailableSSIDs]:", notification.ssids)
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
