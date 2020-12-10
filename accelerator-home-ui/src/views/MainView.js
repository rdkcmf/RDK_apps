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
import { Lightning, Router } from '@lightningjs/sdk'
import ListItem from '../items/ListItem.js'
import ThunderJS from 'ThunderJS'
import AppApi from '../api/AppApi.js'

/** Class for main view component in home UI */
export default class MainView extends Lightning.Component {
  /**
   * Function to render various elements in main view.
   */
  static _template() {
    return {
      MainView: {
        x: 451,
        y: 225,
        w: 1469,
        h: 820,
        AppList: {
          x: 0,
          y: 0,
          type: Lightning.components.ListComponent,
          w: 1469,
          h: 209,
          itemSize: 204 + 20,
          roll: true,
          rollMax: 1469,
          horizontal: true,
          itemScrollOffset: -5,
          clipping: true,
        },
        TVShows: {
          x: 0,
          y: 184,
          w: 1469,
          h: 335,
          type: Lightning.components.ListComponent,
          roll: true,
          itemSize: 428 + 20,
          horizontal: true,
          rollMax: 1444 + 25,
          clipping: true,
        },
        Settings: {
          x: 0,
          y: 494,
          w: 1469,
          h: 335,
          type: Lightning.components.ListComponent,
          roll: true,
          itemSize: 428 + 20,
          horizontal: true,
          rollMax: 1469,
          clipping: true,
        },
      },
    }
  }

  _init() {
    this.settingsScreen = false
    this._setState('AppList')
    this.indexVal = 0
    const config = {
      host: '127.0.0.1',
      port: 9998,
      default: 1,
    }
    var thunder = ThunderJS(config)
    const rdkshellCallsign = 'org.rdk.RDKShell'
    thunder.Controller.activate({ callsign: rdkshellCallsign })
      .then(result => {
        console.log('Successfully activated RDK Shell')
      })
      .catch(err => {
        console.log('Error', err)
      })
      .then(result => {
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
      })
      .catch(err => {
        console.log('Error', err)
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 77,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success')
          })
          .catch(err => {
            console.log('Error', err)
          })
      })
      .catch(err => {
        console.log('Error', err)
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 49,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success')
          })
          .catch(err => {
            console.log('Error', err)
          })
      })
      .catch(err => {
        console.log('Error', err)
      })
      .then(result => {
        thunder
          .call(rdkshellCallsign, 'addKeyIntercept', {
            client: 'ResidentApp',
            keyCode: 36,
            modifiers: [],
          })
          .then(result => {
            console.log('addKeyIntercept success')
          })
          .catch(err => {
            console.log('Error', err)
          })
      })
      .catch(err => {
        console.log('Error', err)
      })
      .then(result => {
        thunder.on('Controller', 'statechange', notification => {
          if (
            notification &&
            notification.callsign == 'Cobalt' &&
            notification.state == 'Deactivation'
          ) {
            var appApi = new AppApi()
            appApi.setVisibility('ResidentApp', true)
            thunder
              .call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' })
              .then(result => {
                console.log('ResidentApp moveToFront Success' + JSON.stringify(result))
              })
            thunder
              .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
              .then(result => {
                console.log('ResidentApp setFocus Success' + JSON.stringify(result))
              })
              .catch(err => {
                console.log('Error', err)
              })
          }
        })
      })
      .catch(err => {
        console.log('Error', err)
      })
  }

  _active() {
    if (this.settingsScreen) {
      let app = this.parent
      this._appAnimation = app.animation({
        duration: 0,
        repeat: 0,
        stopMethod: 'immediate',
        actions: [
          { p: 'x', v: { 0: 0, 1: -320 } },
          { p: 'y', v: { 0: 0, 1: -180 } },
          { p: 'scale', v: { 0: 1, 1: 1.17 } },
        ],
      })
      this._appAnimation.start()
      this.settingsScreen = false
    }
  }

  /**
   * Function to set details of items in app list.
   */
  set appItems(items) {
    this.tag('AppList').items = items.map(info => {
      return {
        w: 204,
        h: 126,
        type: ListItem,
        data: info,
        focus: 1.2,
        unfocus: 1,
        x_text: 106,
        y_text: 140,
      }
    })
    this.tag('AppList').start()
  }

  /**
   * Function to set details of items in tv shows list.
   */
  set tvShowItems(items) {
    this.tag('TVShows').items = items.map(info => {
      return {
        w: 428,
        h: 252,
        type: ListItem,
        data: info,
        focus: 1.08,
        unfocus: 1,
        x_text: 218,
        y_text: 264,
      }
    })
    this.tag('TVShows').start()
  }

  /**
   * Function to set details of items in settings list
   */
  set settingsItems(items) {
    this.tag('Settings').items = items.map(info => {
      return {
        w: 428,
        h: 252,
        type: ListItem,
        data: info,
        focus: 1.08,
        unfocus: 1,
        x_text: 218,
        y_text: 264,
      }
    })
    this.tag('Settings').start()
  }

  /**
   * Function to set the state in main view.
   */
  set index(index) {
    this.indexVal = index
    if (this.indexVal == 0) {
      this._setState('AppList')
    } else if (this.indexVal == 1) {
      this._setState('TVShows')
    } else if (this.indexVal == 2) {
      this._setState('Settings')
    }
  }

  /**
   * Function to reset the main view rows to initial state.
   */
  reset() {
    for (var i = this.tag('AppList').index; i > 0; i--) {
      this.tag('AppList').setPrevious()
    }
    for (var i = this.tag('TVShows').index; i > 0; i--) {
      this.tag('TVShows').setPrevious()
    }
    for (var i = this.tag('Settings').index; i > 0; i--) {
      this.tag('Settings').setPrevious()
    }
  }

  /**
   * Function to define various states needed for main view.
   */
  static _states() {
    return [
      class AppList extends this {
        _getFocused() {
          if (this.tag('AppList').length) {
            return this.tag('AppList').element
          }
        }
        _handleRight() {
          if (this.tag('AppList').length - 1 != this.tag('AppList').index) {
            this.tag('AppList').setNext()
            return this.tag('AppList').element
          }
        }
        _handleLeft() {
          if (0 != this.tag('AppList').index) {
            this.tag('AppList').setPrevious()
            return this.tag('AppList').element
          } else {
            this.reset()
            this.fireAncestors('$goToSidePanel', 0)
          }
        }
        _handleDown() {
          this._setState('TVShows')
        }
        _handleEnter() {
          var appApi = new AppApi()
          this.applicationType = this.tag('AppList').items[
            this.tag('AppList').index
          ].data.applicationType
          this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri
          if (this.applicationType == 'Cobalt') {
            appApi.launchCobalt(this.uri)
            appApi.setVisibility('ResidentApp', false)
          } else if (this.applicationType == 'WebApp') {
            appApi.launchWeb(this.uri)
            appApi.setVisibility('ResidentApp', false)
          } else if (this.applicationType == 'Lightning') {
            appApi.launchLightning(this.uri)
            appApi.setVisibility('ResidentApp', false)
          }
        }
        _handleKey(key) {
          const config = {
            host: '127.0.0.1',
            port: 9998,
            default: 1,
          }
          var thunder = ThunderJS(config)
          console.log('_handleKey', key.keyCode)
          if (key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36) {
            var appApi = new AppApi()
            if (this.applicationType == 'Cobalt') {
              appApi.suspendCobalt()
              appApi.setVisibility('ResidentApp', true)
            } else if (this.applicationType == 'WebApp') {
              appApi.deactivateWeb()
              appApi.setVisibility('ResidentApp', true)
            } else if (this.applicationType == 'Lightning') {
              appApi.deactivateLightning()
              appApi.setVisibility('ResidentApp', true)
            }
            thunder
              .call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' })
              .then(result => {
                console.log('ResidentApp moveToFront Success')
              })
            thunder
              .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
              .then(result => {
                console.log('ResidentApp moveToFront Success')
              })
              .catch(err => {
                console.log('Error', err)
              })
          }
        }
      },
      class TVShows extends this {
        _getFocused() {
          if (this.tag('TVShows').length) {
            return this.tag('TVShows').element
          }
        }
        _handleRight() {
          if (this.tag('TVShows').length - 1 != this.tag('TVShows').index) {
            this.tag('TVShows').setNext()
            return this.tag('TVShows').element
          }
        }
        _handleLeft() {
          if (0 != this.tag('TVShows').index) {
            this.tag('TVShows').setPrevious()
            return this.tag('TVShows').element
          } else {
            this.reset()
            this.fireAncestors('$goToSidePanel', 1)
          }
        }
        _handleUp() {
          this._setState('AppList')
        }
        _handleDown() {
          this._setState('Settings')
        }
        _handleEnter() {
          this.fireAncestors('$goToPlayer')
        }
      },
      class Settings extends this {
        _getFocused() {
          if (this.tag('Settings').length) {
            return this.tag('Settings').element
          }
        }
        _handleRight() {
          if (this.tag('Settings').length - 1 != this.tag('Settings').index) {
            this.tag('Settings').setNext()
          }
          return this.tag('Settings').element
        }
        _handleLeft() {
          if (0 != this.tag('Settings').index) {
            this.tag('Settings').setPrevious()
            return this.tag('Settings').element
          } else {
            this.reset()
            this.fireAncestors('$goToSidePanel', 2)
          }
        }
        _handleUp() {
          this._setState('TVShows')
        }
        _handleEnter() {
          this.settingsType = this.tag('Settings').items[
            this.tag('Settings').index
          ].data.displayName

          if (this.settingsType == 'Bluetooth') {
            this.settingsScreen = true
            Router.navigate('settings/BluetoothScreen',false)
          } else if (this.settingsType == 'Wi-Fi') {
            this.settingsScreen = true
            Router.navigate('settings/WiFiScreen',false)
          }
        }
      },
    ]
  }
}
