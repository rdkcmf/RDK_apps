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
import { Lightning, Storage, Language } from '@lightningjs/sdk'
import ListItem from '../items/ListItem.js'
import ThunderJS from 'ThunderJS'
import AppApi from '../api/AppApi.js'
import UsbApi from '../api/UsbApi.js'
import { CONFIG } from '../Config/Config.js'
import XcastApi from '../api/XcastApi';
import Keymap from '../Config/Keymap.js'

/** Class for main view component in home UI */
export default class MainView extends Lightning.Component {
  /**
   * Function to render various elements in main view.
   */
  static _template() {
    return {
      MainView: {
        x: 200,
        w: 1765,
        h: 1250,
        clipping: true,
        Text1: {
          // x: 10 + 25,
          // y:  30,
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
          // x: 10 + 25,
          y: 948,
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
          y: 988,
          type: Lightning.components.ListComponent,
          flex: { direction: 'row', paddingLeft: 20, wrap: false },
          w: 1745,
          h: 400,
          itemSize: 288,
          roll: true,
          rollMax: 1745,
          horizontal: true,
          itemScrollOffset: -4,
          clipping: false,
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
    };
    let appApi = new AppApi();
    this.usbApi = new UsbApi();
    this.xcastApi = new XcastApi();
    let thunder = ThunderJS(config);
    thunder.on('Controller', 'statechange', notification => {
      console.log(JSON.stringify(notification))
      if (notification && (notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'LightningApp') && notification.state == 'Deactivation') {

        Storage.set('applicationType', '');
        appApi.setVisibility('ResidentApp', true);
        thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
          console.log('ResidentApp moveToFront Success' + JSON.stringify(result));
        });
        thunder
          .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
          .then(result => {
            console.log('ResidentApp setFocus Success' + JSON.stringify(result));
          })
          .catch(err => {
            console.log('Error', err);
          });
      }
    });
  }

  /**
   * Function to set details of items in app list.
   */
  set appItems(items) {
    this.tag('AppList').items = items.map((info, idx) => {
      return {
        w: 454,
        h: 255,
        type: ListItem,
        data: info,
        focus: 1.11,
        unfocus: 1,
        idx: idx
      }
    })
    this.tag('AppList').start()
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
        idx: index
      }
    })
    this.tag('MetroApps').start()
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
        idx: idx
      }
    })
    this.tag('TVShows').start()
  }

  set usbApps(items) {
    console.log(`usb apps set function was called using the arguments ${items}`);
    if (!items.length) {
      this.tag('Text4').visible = false;
    }
    this.tag('UsbApps').items = items.map((info, index) => {
      return {
        w: 268,
        h: 151,
        type: ListItem,
        data: info,
        focus: 1.15,
        unfocus: 1,
        idx: index
      }
    })
    this.tag('UsbApps').start()
  }
  /**
   * Function to set the state in main view.
   */
  set index(index) {
    this.indexVal = index
    if (this.indexVal == 0) {
      this._setState('AppList')
    } else if (this.indexVal == 1) {
      this._setState('MetroApps')
    } else if (this.indexVal == 2) {
      this._setState('TVShows')
    } else if (this.indexVal == 3) {
      this._setState('RightArrow')
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
      class AppList extends this {
        _getFocused() {
          this.tag('Text1').text.fontStyle = 'bold'
          if (this.tag('AppList').length) {
            this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('AppList').element.data.url)
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
          this.fireAncestors('$goToTopPanel', 2)
        }
        _handleLeft() {
          this.tag('Text1').text.fontStyle = 'normal'
          if (0 != this.tag('AppList').index) {
            this.tag('AppList').setPrevious()
            return this.tag('AppList').element
          } else {
            this.reset()
            this.fireAncestors('$goToSidePanel', 0)
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
            appApi.launchWeb(this.uri);
            appApi.setVisibility('ResidentApp', false);
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
                  this.fireAncestors('$goToUsb')
                }
              })

            }
          }
        }
      },
      class MetroApps extends this {
        _getFocused() {
          this.tag('Text2').text.fontStyle = 'bold'
          if (this.tag('MetroApps').length) {
            this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('MetroApps').element.data.url)
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
            this.fireAncestors('$goToSidePanel', 1)
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
          this.fireAncestors('$scroll', -350)
        }
        _handleUp() {
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
            this.fireAncestors('$goToSidePanel', 2)
          }
        }
        _handleDown() {
          if (this.tag('UsbApps').length) {
            this._setState("UsbApps");
          }
        }
        _handleEnter() {
          if (Storage.get('ipAddress')) {
            this.fireAncestors('$goToPlayer')
          }
        }
        $exit() {
          this.fireAncestors('$scroll', 0)
        }
      },



      class UsbApps extends this {
        $enter() {
          this.fireAncestors('$scroll', -550)
        }
        $exit() {
          this.fireAncestors('$scroll', -350)
        }
        _getFocused() {
          this.tag('Text4').text.fontStyle = 'bold'
          if (this.tag('UsbApps').length) {
            this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('UsbApps').element.data.url)
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
            this.fireAncestors('$goToSidePanel', 1)
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
