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
import { Lightning, Storage, Language, Router, Settings, Registry } from '@lightningjs/sdk'
import ListItem from '../items/ListItem.js'
import ThunderJS from 'ThunderJS'
import AppApi from '../api/AppApi.js'
import UsbApi from '../api/UsbApi.js'
import { CONFIG } from '../Config/Config.js'
import XcastApi from '../api/XcastApi'
import HomeApi from '../api/HomeApi.js'

const down = 300

/** Class for main view component in home UI */
export default class MainView extends Lightning.Component {
  /**
   * Function to render various elements in main view.
   */
  _onChanged() {
    this.widgets.menu.updateTopPanelText(Language.translate('home'))
  }
  static _template() {
    return {
      rect: true,
      color: 0xff000000,
      w: 1920,
      h: 1080,
      MainView: {
        w: 1994,
        h: 1920,
        xIndex: 2,
        y: 270,
        x: 200,
        clipping: true,
        Text0: {
          alpha: 0,
          h: 30,
          text: {
            fontFace: CONFIG.language.font,
            fontSize: 25,
            text: Language.translate('Popular Movies'),
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
          zIndex: 0
        },
        Gracenote: {
          y: 50,
          x: -20,
          flex: { direction: 'row', paddingLeft: 20, wrap: false },
          type: Lightning.components.ListComponent,
          w: 1745,
          h: 400,
          itemSize: 474,
          roll: true,
          rollMax: 1745,
          horizontal: true,
          itemScrollOffset: -2,
          clipping: false,
        },
        Text1: {
          // x: 10 + 25,
          // y:  30,
          // y: down + 130,
          h: 30,
          text: {
            fontFace: CONFIG.language.font,
            fontSize: 25,
            text: Language.translate('Featured Content'),
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
          zIndex: 0
        },
        AppList: {
          y: 37,
          x: -20,
          flex: { direction: 'row', paddingLeft: 20, wrap: false },
          type: Lightning.components.ListComponent,
          w: 1745,
          h: 400,
          itemSize: 474,
          roll: true,
          rollMax: 1745,
          horizontal: true,
          itemScrollOffset: -2,
          clipping: false,
        },
        Text2: {
          // x: 10 + 25,
          y: 395,
          h: 30,
          text: {
            fontFace: CONFIG.language.font,
            fontSize: 25,
            text: Language.translate('Lightning Apps'),
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
        },
        MetroApps: {
          x: -20,
          y: 435,
          type: Lightning.components.ListComponent,
          flex: { direction: 'row', paddingLeft: 20, wrap: false },
          w: 1745,
          h: 300,
          itemSize: 288,
          roll: true,
          rollMax: 1745,
          horizontal: true,
          itemScrollOffset: -4,
          clipping: false,
        },
        Text3: {
          // x: 10 + 25,
          y: 673,
          h: 30,
          text: {
            fontFace: CONFIG.language.font,
            fontSize: 25,
            text: Language.translate('Featured Video on Demand'),
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
        },
        TVShows: {
          x: -20,
          y: 710,
          w: 1745,
          h: 400,
          type: Lightning.components.ListComponent,
          flex: { direction: 'row', paddingLeft: 20, wrap: false },
          roll: true,
          itemSize: 277,
          rollMax: 1745,
          horizontal: true,
          itemScrollOffset: -4,
          clipping: false,
        },
        Text4: {
          alpha: 0,
          // x: 10 + 25,
          y: 938,
          h: 30,
          text: {
            fontFace: CONFIG.language.font,
            fontSize: 25,
            text: Language.translate('Partner Apps'),
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
        },
        UsbApps: {
          x: -20,
          y: 978,
          type: Lightning.components.ListComponent,
          flex: { direction: 'row', paddingLeft: 20, wrap: false },
          w: 1745,
          h: 400,
          itemSize: 277,
          roll: true,
          rollMax: 1745,
          horizontal: true,
          itemScrollOffset: -4,
          clipping: false,
        },

      },
    }
  }

  pageTransition() {
    return 'up'
  }

  moveDownContent() {
    this.tag('Text0').alpha = 1
    this.tag('Text1').y = down + 100
    this.tag('AppList').y = 37 + down + 100
    this.tag("Text2").y = 395 + down
    this.tag("MetroApps").y = 435 + down
    this.tag("Text3").y = 673 + down
    this.tag("TVShows").y = 710 + down
    this.tag("Text4").y = 938 + down
    this.tag("UsbApps").y = 978 + down
  }

  _handleBack() { }

  _init() {
    this.settingsScreen = false
    this.indexVal = 0
    const config = {
      host: '127.0.0.1',
      port: 9998,
      default: 1,
    };
    this.usbApi = new UsbApi();
    this.homeApi = new HomeApi();
    this.xcastApi = new XcastApi();
    let thunder = ThunderJS(config);

    // for initially showing/hiding usb icon

    var appItems = this.homeApi.getAppListInfo()
    var data = this.homeApi.getPartnerAppsInfo()
    this.metroApps = this.homeApi.getMetroInfo()
    var prop_apps = 'applications'
    var prop_displayname = 'displayName'
    var prop_uri = 'uri'
    var prop_apptype = 'applicationType'
    var prop_url = 'url'
    var appdetails = []
    var appdetails_format = []
    var usbAppsArr = [];
    var usbApps = 0
    try {
      if (data != null && JSON.parse(data).hasOwnProperty(prop_apps)) {
        appdetails = JSON.parse(data).applications
        for (var i = 0; i < appdetails.length; i++) {
          if (
            appdetails[i].hasOwnProperty(prop_displayname) &&
            appdetails[i].hasOwnProperty(prop_uri) &&
            appdetails[i].hasOwnProperty(prop_apptype)
          ) {
            usbAppsArr.push(appdetails[i])
            usbApps++
          }
        }

        for (var i = 0; i < appItems.length; i++) {
          appdetails_format.push(appItems[i])
        }

      } else {
        appdetails_format = appItems
      }
    } catch (e) {
      appdetails_format = appItems
      console.log('Query data is not proper: ' + e)
    }
    this.firstRowItems = appdetails_format
    this.tempRow = JSON.parse(JSON.stringify(this.firstRowItems));
    if (this.firstRowItems[0].uri === 'USB') {
      this.tempRow.shift()
    }
    this.appItems = this.tempRow
    this.usbApps = usbAppsArr

    // for USB event
    const registerListener = () => {

      let listener;

      listener = thunder.on('org.rdk.UsbAccess', 'onUSBMountChanged', (notification) => {
        console.log('onUsbMountChanged notification: ', JSON.stringify(notification))
        Storage.set('UsbMountedStatus', notification.mounted ? 'mounted' : 'unmounted')
        const currentPage = window.location.href.split('#').slice(-1)[0]
        if (Storage.get('UsbMedia') === 'ON') {

          if (notification.mounted) {
            this.appItems = this.firstRowItems
            this._setState('AppList.0')
          } else if (!notification.mounted) {
            this.appItems = this.tempRow
            this._setState('AppList.0')
          }
          console.log(`app items = ${this.appItems} ; `);

          if (currentPage === 'menu') { //refresh page to hide or show usb icon
            console.log('page refreshed on unplug/plug')
            // Router.navigate('menu');
            // document.location.reload()
          }

          if (!notification.mounted) { //if mounted is false
            if (currentPage === 'usb' || currentPage === 'usb/image' || currentPage === 'usb/player') { // hot exit if we are on usb screen or sub screens
              // this.$changeHomeText('Home')
              Router.navigate('menu');
            }
          }
        }
        console.log(`usb event successfully registered`);
      })

      return listener;
    }

    thunder.on('org.rdk.Network.1', 'onIPAddressStatusChanged', notification => {
      console.log('IP ADDRESS changed', JSON.stringify(notification))
      if (notification.status === 'ACQUIRED') {
        Storage.set('ipAddress', notification.ip4Address)
        this.metroApps = this.homeApi.getOnlineMetroApps()
      } else {
        Storage.set('ipAddress', null)
        //this.metroApps = this.homeApi.getMetroInfo()
      }

    })


    this.fireAncestors("$mountEventConstructor", registerListener.bind(this))

    this.refreshFirstRow()
    this._setState('AppList.0')
  }

  _firstActive() {
    if (!Storage.get('UsbMedia')) {
      this.usbApi.activate().then(res => {
        Storage.set('UsbMedia', 'ON')
        this.fireAncestors('$registerUsbMount')

      })
    } else if (Storage.get('UsbMedia') === 'ON') {
      this.usbApi.activate().then(res => {
        this.fireAncestors('$registerUsbMount')
      })
    } else if (Storage.get('UsbMedia') === 'OFF') {
      // deactivate usb Plugin here 
      this.usbApi.deactivate().then((res) => {
        console.log(`disabled the Usb Plugin`);
      }).catch(err => {
        console.error(`error while disabling the usb plugin = ${err}`)
      })
    }
  }


  _focus() {
    this._setState(this.state)
  }

  scroll(val) {
    this.tag('MainView').patch({
      smooth: {
        y: [val, { timingFunction: 'ease', duration: 0.7 }]
      }
    })
  }

  refreshFirstRow() {
    if (Storage.get('UsbMedia') === 'ON') {
      this.usbApi.activate().then(res => {
        this.usbApi.getMountedDevices().then(result => {
          if (result.mounted.length === 1) {
            this.appItems = this.firstRowItems
          } else {
            this.appItems = this.tempRow
          }
        })
      })
    } else if (Storage.get('UsbMedia') === 'OFF') {
      this.appItems = this.tempRow
    } else {
      Storage.set('UsbMedia', 'ON')
      this.usbApi.activate().then(res => {
        this.usbApi.getMountedDevices().then(result => {
          if (result.mounted.length === 1) {
            this.appItems = this.firstRowItems
          } else {
            this.appItems = this.tempRow
          }
        })
      })
    }
  }

  /**
   * Function to set details of items in gracenote list.
   */
  set graceNoteItems(items) {
    this._setState('Gracenote')
    this.moveDownContent()
    this.tag('Gracenote').items = items.map((info, idx) => {
      return {
        w: 454,
        h: 255,
        type: ListItem,
        data: info,
        focus: 1.11,
        unfocus: 1,
        idx: idx,
        bar: 10
      }
    })
  }


  /**
   * Function to set details of items in app list.
   */
  set appItems(items) {
    if (Settings.get('platform', 'gracenote')) {
      this.tag("AppList").itemSize = 288
    }
    this.tag('AppList').items = items.map((info, idx) => {
      return {
        w: Settings.get('platform', 'gracenote') ? 268 : 454,
        h: Settings.get('platform', 'gracenote') ? 151 : 255,
        type: ListItem,
        data: info,
        focus: 1.11,
        unfocus: 1,
        idx: idx,
        bar: 12
      }
    })
  }

  set metroApps(items) {
    this.tag('MetroApps').items = items.map((info, index) => {
      return {
        w: 268,
        h: 151,
        type: ListItem,
        data: info,
        focus: 1.15,
        unfocus: 1,
        idx: index,
        bar: 12
      }
    })
  }

  /**
   * Function to set details of items in tv shows list.
   */
  set tvShowItems(items) {
    this.tag('TVShows').items = items.map((info, idx) => {
      return {
        w: 257,
        h: 145,
        type: ListItem,
        data: info,
        focus: 1.15,
        unfocus: 1,
        idx: idx,
        bar: 12
      }
    })
  }

  set usbApps(items) {
    if (items.length > 0) {
      this.tag('Text4').alpha = 1;
    }
    this.tag('UsbApps').items = items.map((info, index) => {
      return {
        w: 257,
        h: 145,
        type: ListItem,
        data: info,
        focus: 1.15,
        unfocus: 1,
        idx: index,
        bar: 12
      }
    })
  }
  /**
   * Function to set the state in main view.
   */
  index(index) {
    if (index == 0) {
      this._setState('AppList')
    } else if (index == 1) {
      this._setState('MetroApps')
    } else if (index == 2) {
      this._setState('TVShows')
    } else if (index == 3) {
      if (this.tag('UsbApps').length) {
        this._setState('UsbApps')
      } else {
        this._setState('TVShows')
      }
    }
  }

  /**
   * Function to reset the main view rows to initial state.
   */
  reset() {
    for (let i = this.tag('AppList').index; i > 0; i--) {
      this.tag('AppList').setPrevious()
    }
    for (let i = this.tag('MetroApps').index; i > 0; i--) {
      this.tag('MetroApps').setPrevious()
    }
    for (let i = this.tag('TVShows').index; i > 0; i--) {
      this.tag('TVShows').setPrevious()
    }
    for (let i = this.tag("UsbApps").index; i > 0; i--) {
      this.tag('UsbApps').setPrevious()
    }
  }

  /**
   * Function to define various states needed for main view.
   */
  static _states() {
    return [
      class Gracenote extends this {
        $enter() {
          this.indexVal = 0
        }
        $exit() {
          this.tag('Text0').text.fontStyle = 'normal'
        }
        _getFocused() {
          this.tag('Text0').text.fontStyle = 'bold'
          if (this.tag('Gracenote').length) {
            return this.tag('Gracenote').element
          }
        }
        _handleDown() {
          this._setState('AppList')
        }
        _handleRight() {
          if (this.tag('Gracenote').length - 1 != this.tag('Gracenote').index) {
            this.tag('Gracenote').setNext()
            return this.tag('Gracenote').element
          }
        }
        _handleUp() {
          this.widgets.menu.notify('TopPanel')
        }
        _handleLeft() {
          this.tag('Text0').text.fontStyle = 'normal'
          if (0 != this.tag('Gracenote').index) {
            this.tag('Gracenote').setPrevious()
            return this.tag('Gracenote').element
          } else {
            this.reset()
            this.widgets.menu.setIndex(this.indexVal)
            Router.focusWidget('Menu')
            //this.fireAncestors('$goToSidePanel', 0)
          }
        }
        _handleEnter() {
          let appApi = new AppApi();
          let applicationType = this.tag('Gracenote').items[this.tag('Gracenote').index].data.applicationType;
          this.uri = this.tag('Gracenote').items[this.tag('Gracenote').index].data.uri;
          applicationType = this.tag('Gracenote').items[this.tag('Gracenote').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('Gracenote').items[this.tag('Gracenote').index].data.uri;
          console.log(this.uri, applicationType)
          if (Storage.get('applicationType') == 'Cobalt') {
            appApi.launchCobalt(this.uri);
            appApi.setVisibility('ResidentApp', false);
          }
        }
      },
      class AppList extends this {
        $enter() {
          this.indexVal = 0
          this.scroll(270)
        }
        $exit() {
          this.tag('Text1').text.fontStyle = 'normal'
        }
        _getFocused() {
          this.tag('Text1').text.fontStyle = 'bold'
          if (this.tag('AppList').length) {
            return this.tag('AppList').element
          }
        }
        _handleDown() {
          this._setState('MetroApps')
        }
        _handleRight() {
          if (this.tag('AppList').length - 1 != this.tag('AppList').index) {
            this.tag('AppList').setNext()
            return this.tag('AppList').element
          }
        }
        _handleUp() {
          //this.widgets.menu.notify('TopPanel')
          if (Settings.get('platform', 'gracenote')) {
            this._setState('Gracenote')
          } else {
            this.widgets.menu.notify('TopPanel')
          }

        }
        _handleLeft() {
          this.tag('Text1').text.fontStyle = 'normal'
          if (0 != this.tag('AppList').index) {
            this.tag('AppList').setPrevious()
            return this.tag('AppList').element
          } else {
            this.reset()
            this.widgets.menu.setIndex(this.indexVal)
            Router.focusWidget('Menu')
            //this.fireAncestors('$goToSidePanel', 0)
          }
        }
        _handleEnter() {
          let appApi = new AppApi();
          let applicationType = this.tag('AppList').items[this.tag('AppList').index].data.applicationType;
          this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri;
          applicationType = this.tag('AppList').items[this.tag('AppList').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri;
          if (Storage.get('applicationType') == 'Cobalt') {
            appApi.launchCobalt(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'WebApp' && Storage.get('ipAddress')) {
            appApi.launchWeb(this.uri)
              .then(() => {
                appApi.setVisibility('ResidentApp', false);
                let path = location.pathname.split('index.html')[0]
                let url = path.slice(-1) === '/' ? "static/overlayText/index.html" : "/static/overlayText/index.html"
                let notification_url = location.origin + path + url
                appApi.launchOverlay(notification_url, 'TextOverlay')
                Registry.setTimeout(() => {
                  appApi.deactivateResidentApp('TextOverlay')
                  appApi.zorder('HtmlApp')
                  appApi.setVisibility('HtmlApp', true)
                }, 9000)
              })
          } else if (Storage.get('applicationType') == 'Lightning' && Storage.get('ipAddress')) {
            appApi.launchLightning(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
            appApi.launchNative(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Amazon') {
            console.log('Launching app')
            fetch('http://127.0.0.1:9998/Service/Controller/')
              .then(res => res.json())
              .then(data => {
                console.log(data)
                data.plugins.forEach(element => {
                  if (element.callsign === 'Amazon') {
                    console.log('Opening Amazon')
                    appApi.launchPremiumApp('Amazon');
                    appApi.setVisibility('ResidentApp', false);
                  }
                });
              })
              .catch(err => {
                console.log('Amazon not working')
              })

          } else if (Storage.get('applicationType') == 'Netflix') {
            console.log('Launching app')
            fetch('http://127.0.0.1:9998/Service/Controller/')
              .then(res => res.json())
              .then(data => {
                console.log(data)
                data.plugins.forEach(element => {
                  if (element.callsign === 'Netflix') {
                    console.log('Opening Netflix')
                    appApi.launchPremiumApp('Netflix');
                    appApi.setVisibility('ResidentApp', false);
                  }
                });
              })
              .catch(err => {
                console.log('Netflix not working')
              })

          } else {
            if (this.uri === 'USB') {
              this.usbApi.getMountedDevices().then(result => {
                if (result.mounted.length === 1) {
                  // this.fireAncestors('$goToUsb')
                  Router.navigate('usb');
                }
              })

            }
          }
        }
      },
      class MetroApps extends this {
        $enter() {
          this.scroll(-100)
          this.indexVal = 1
        }
        $exit() {
          this.tag('Text2').text.fontStyle = 'normal'
        }
        _getFocused() {
          this.tag('Text2').text.fontStyle = 'bold'
          if (this.tag('MetroApps').length) {
            return this.tag('MetroApps').element
          }
        }
        _handleUp() {
          this._setState('AppList')
        }
        _handleDown() {
          this._setState('TVShows')
        }
        _handleRight() {
          if (this.tag('MetroApps').length - 1 != this.tag('MetroApps').index) {
            this.tag('MetroApps').setNext()
            return this.tag('MetroApps').element
          }
        }
        _handleLeft() {
          this.tag('Text2').text.fontStyle = 'normal'
          if (0 != this.tag('MetroApps').index) {
            this.tag('MetroApps').setPrevious()
            return this.tag('MetroApps').element
          } else {
            this.reset()
            this.widgets.menu.setIndex(this.indexVal)
            Router.focusWidget('Menu')
            //this.fireAncestors('$goToSidePanel', 1)
          }
        }
        _handleEnter() {
          let appApi = new AppApi();
          let applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
          this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;

          applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;
          if (Storage.get('applicationType') == 'Cobalt') {
            appApi.launchCobalt(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'WebApp' && Storage.get('ipAddress')) {
            appApi.launchWeb(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Lightning' && Storage.get('ipAddress')) {
            appApi.launchLightning(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
            appApi.launchNative(this.uri);
            appApi.setVisibility('ResidentApp', false);
          }
        }
      },
      class TVShows extends this {
        $enter() {
          this.indexVal = 2
          this.scroll(-400)
        }
        _handleUp() {
          this.scroll(270)
          this._setState('MetroApps')
        }
        _getFocused() {
          this.tag('Text3').text.fontStyle = 'bold'
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
          this.tag('Text3').text.fontStyle = 'normal'
          if (0 != this.tag('TVShows').index) {
            this.tag('TVShows').setPrevious()
            return this.tag('TVShows').element
          } else {
            this.reset()
            //this.fireAncestors('$goToSidePanel', 2)
            this.widgets.menu.setIndex(this.indexVal)
            Router.focusWidget('Menu')
          }
        }
        _handleDown() {
          if (this.tag('UsbApps').length) {
            this._setState("UsbApps");
          }
        }
        _handleEnter() {
          if (Storage.get('ipAddress')) {
            //this.fireAncestors('$goToPlayer')
            Router.navigate('player')
          }
        }
        $exit() {
          this.tag('Text3').text.fontStyle = 'normal'
        }
      },



      class UsbApps extends this {
        $enter() {
          this.scroll(-550)
          this.indexVal = 3
        }
        $exit() {
          this.tag('Text4').text.fontStyle = 'normal'
        }
        _getFocused() {
          this.tag('Text4').text.fontStyle = 'bold'
          if (this.tag('UsbApps').length) {
            return this.tag('UsbApps').element
          }
        }
        _handleUp() {
          this._setState('TVShows')
        }

        _handleRight() {
          if (this.tag('UsbApps').length - 1 != this.tag('MetroApps').index) {
            this.tag('UsbApps').setNext()
            return this.tag('UsbApps').element
          }
        }
        _handleLeft() {
          this.tag('Text4').text.fontStyle = 'normal'
          if (0 != this.tag('UsbApps').index) {
            this.tag('UsbApps').setPrevious()
            return this.tag('UsbApps').element
          } else {
            this.reset()
            //this.fireAncestors('$goToSidePanel', 1)
            this.widgets.menu.setIndex(this.indexVal)
            Router.focusWidget('Menu')
          }
        }
        _handleEnter() {
          let appApi = new AppApi();
          let applicationType = this.tag('UsbApps').items[this.tag('UsbApps').index].data.applicationType;
          this.uri = this.tag('UsbApps').items[this.tag('UsbApps').index].data.uri;

          applicationType = this.tag('UsbApps').items[this.tag('UsbApps').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('UsbApps').items[this.tag('UsbApps').index].data.uri;
          if (Storage.get('applicationType') == 'Cobalt') {
            appApi.launchCobalt(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'WebApp' && Storage.get('ipAddress')) {
            appApi.launchWeb(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Lightning' && Storage.get('ipAddress')) {
            appApi.launchLightning(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
            appApi.launchNative(this.uri);
            appApi.setVisibility('ResidentApp', false);
          }
        }
      },
      class RightArrow extends this {
        //TODO
      },
      class LeftArrow extends this {
        //TODO
      },
    ]
  }
}
