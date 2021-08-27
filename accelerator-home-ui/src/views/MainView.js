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
import { Lightning, Router, Storage, Utils } from '@lightningjs/sdk'
import ListItem from '../items/ListItem.js'
import AppListItem from '../items/AppListItem.js'
import ThunderJS from 'ThunderJS'
import AppApi from '../api/AppApi.js'
import ArrowIconItem from '../items/ArrowIconlItem.js'

/** Class for main view component in home UI */
export default class MainView extends Lightning.Component {
  /**
   * Function to render various elements in main view.
   */
  static _template() {
    return {
      MainView: {
        x: 0,
        y: 0,
        w: 1765,
        h: 1080,
        clipping: true,
        Text1: {
          x: 10,
          y: 50,
          text: {
            fontFace: 'MS-Regular',
            fontSize: 40,
            text: 'Apps',
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
          zIndex: 0
        },
        AppList: {
          x: 0,
          y: 137,
          flex: { direction: 'row', paddingLeft: 15, wrap: false },
          type: Lightning.components.ListComponent,
          w: 1745,
          h: 300,
          itemSize: 250,
          roll: true,
          rollMax: 1745,
          horizontal: true,
          itemScrollOffset: -5,
          clipping: false,
        },
        Text2: {
          x: 10,
          y: 338,
          text: {
            fontFace: 'MS-Regular',
            fontSize: 40,
            text: 'Metro Apps',
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
        },
        MetroApps: {
          x: 0,
          y: 410,
          type: Lightning.components.ListComponent,
          flex: { direction: 'row', paddingLeft: 20, wrap: false },
          w: 1745,
          h: 400,
          itemSize: 328,
          roll: true,
          rollMax: 1745,
          horizontal: true,
          itemScrollOffset: -4,
          clipping: false,
        },
        Text3: {
          x: 10,
          y: 665,
          text: {
            fontFace: 'MS-Regular',
            fontSize: 40,
            text: 'TVShows',
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
        },
        TVShows: {
          x: 0,
          y: 735,
          w: 1745,
          h: 400,
          type: Lightning.components.ListComponent,
          flex: { direction: 'row', paddingLeft: 20, wrap: false },
          roll: true,
          itemSize: 328,
          rollMax: 1745,
          horizontal: true,
          itemScrollOffset: -4,
          clipping: false,
        },
        RightArrow: {
          x: 0,
          y: 0,
          w: 25,
          h: 750,
          type: Lightning.components.ListComponent,
          roll: true,
          horizontal: false,
          invertDirection: true,
          alpha: 0.9,
        },
        LeftArrow: {
          x: 0,
          y: 0,
          w: 25,
          h: 750,
          type: Lightning.components.ListComponent,
          roll: true,
          horizontal: false,
          invertDirection: true,
          alpha: 0.9,
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
    var thunder = ThunderJS(config);
    thunder.on('Controller', 'statechange', notification => {
      if (notification && (notification.callsign == 'Cobalt' || notification.callsign == 'Amazon') && notification.state == 'Deactivation') {
        var appApi = new AppApi();
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

  _active() {
    if (this.settingsScreen) {
      let app = this.parent.parent
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
        w: 235,
        h: 136,
        type: AppListItem,
        data: info,
        focus: 1.2,
        unfocus: 1,
        x_text: 120,
        y_text: 140,
      }
    })
    this.tag('AppList').start()
  }
  /**
  * Function to set details of items in right Icons list.
  * 
  */
  set rightArrowIcons(items) {
    this.tag('RightArrow').items = items.map((info, index) => {
      this.data = info
      return {
        w: index == 0 ? 20 : 25,
        h: index == 0 ? 30 : 35,
        x: 1735,
        y: index == 0 ? 210 : (index == 1 ? 405 : (index == 2 ? 635 : 0)),
        type: ArrowIconItem,
        data: info,
      }
    })
    this.tag('RightArrow').start()
  }
  /**
  * Function to set details of items in left Icons list.
  * 
  */
  set leftArrowIcons(items) {
    this.tag('LeftArrow').patch({ x: 25 })
    this.tag('LeftArrow').items = items.map((info, index) => {
      this.data = info
      return {
        w: index == 0 ? 20 : 25,
        h: index == 0 ? 30 : 35,
        y: index == 0 ? 205 : (index == 1 ? 405 : (index == 2 ? 635 : 0)),
        type: ArrowIconItem,
        data: info,
      }
    })
    this.tag('LeftArrow').start()
  }

  set metroApps(items) {
    this.tag('MetroApps').items = items.map((info, index) => {
      return {
        w: 308,
        h: 200,
        type: ListItem,
        data: info,
        focus: 1.2,
        unfocus: 1,
        x_text: 106,
        y_text: 140,
      }
    })
    this.tag('MetroApps').start()
  }

  /**
   * Function to set details of items in tv shows list.
   */
  set tvShowItems(items) {
    this.tag('TVShows').items = items.map(info => {
      return {
        w: 308,
        h: 200,
        type: ListItem,
        data: info,
        focus: 1.2,
        unfocus: 1,
        x_text: 218,
        y_text: 264,
      }
    })
    this.tag('TVShows').start()
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
    for (var i = this.tag('AppList').index; i > 0; i--) {
      this.tag('AppList').setPrevious()
    }
    for (var i = this.tag('MetroApps').index; i > 0; i--) {
      this.tag('MetroApps').setPrevious()
    }
    for (var i = this.tag('TVShows').index; i > 0; i--) {
      this.tag('TVShows').setPrevious()
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
            this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('AppList').element.data.url)
            return this.tag('AppList').element
          }
        }
        _handleRight() {
          if (this.tag('AppList').length - 1 != this.tag('AppList').index) {
            this.tag('AppList').setNext()
            this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('AppList').element.data.url)
            return this.tag('AppList').element
          }
        }
        _handleLeft() {
          if (0 != this.tag('AppList').index) {
            this.tag('AppList').setPrevious()
            this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('AppList').element.data.url)
            return this.tag('AppList').element
          }
        }
        _handleDown() {
          this._setState('MetroApps')
        }
        _handleUp() {
          console.log('handle up')
          this.fireAncestors('$goToTopPanel', 0)
        }
        _handleEnter() {
          var appApi = new AppApi();
          var applicationType = this.tag('AppList').items[this.tag('AppList').index].data.applicationType;
          this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri;
          var appApi = new AppApi();
          applicationType = this.tag('AppList').items[this.tag('AppList').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri;
          if (Storage.get('applicationType') == 'Cobalt') {
            appApi.launchCobalt(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'WebApp') {
            appApi.launchWeb(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Lightning') {
            appApi.launchLightning(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Native') {
            appApi.launchNative(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Amazon') {
            appApi.launchPremiumApp('Amazon');
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Netflix') {
            appApi.launchPremiumApp('Netflix');
            appApi.setVisibility('ResidentApp', false);
          }
        }
        _handleKey(key) {
          const config = {
            host: '127.0.0.1',
            port: 9998,
            default: 1,
          };
          var thunder = ThunderJS(config);
          console.log('_handleKey', key.keyCode);
            var appApi = new AppApi();

            // Detecting Ctrl
            var _key = key.keyCode;
            var ctrl = key.ctrlKey ? key.ctrlKey : ((_key === 17) ? true : false);
          if (key.keyCode == 27 || (ctrl && key.keyCode == 77) || key.keyCode == 36 || key.keyCode == 158) {
            if (Storage.get('applicationType') == 'WebApp') {
              Storage.set('applicationType', '');
              appApi.deactivateWeb();
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Lightning') {
              Storage.set('applicationType', '');
              appApi.deactivateLightning();
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Native') {
              Storage.set('applicationType', '');
              appApi.killNative();
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Amazon') {
              Storage.set('applicationType', '');
              appApi.suspendPremiumApp('Amazon');
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Netflix') {
              Storage.set('applicationType', '');
              appApi.suspendPremiumApp('Netflix');
              appApi.setVisibility('ResidentApp', true);
            }else if(Storage.get('applicationType') == 'Cobalt'){
              Storage.set('applicationType', '');
              appApi.suspendCobalt();
              appApi.setVisibility('ResidentApp', true);
            } else return false
            
            thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
              console.log('ResidentApp moveToFront Success');
            });
            thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
              console.log('ResidentApp moveToFront Success');
            });
            thunder
              .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
              .then(result => {
                console.log('ResidentApp moveToFront Success')
              })
              .catch(err => {
                console.log('Error', err)
              })
          };
        }
      },
      class MetroApps extends this {
        _getFocused() {
          if (this.tag('MetroApps').length) {
            this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('MetroApps').element.data.url)
            return this.tag('MetroApps').element
          }
        }
        _handleUp() {
          this._setState('AppList')
        }
        _handleRight() {
          if (this.tag('MetroApps').length - 1 != this.tag('MetroApps').index) {
            this.tag('MetroApps').setNext()
            this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('MetroApps').element.data.url)
            return this.tag('MetroApps').element
          }
        }
        _handleLeft() {
          if (0 != this.tag('MetroApps').index) {
            this.tag('MetroApps').setPrevious()
            this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('MetroApps').element.data.url)
            return this.tag('MetroApps').element
          } else {
            this.reset()

          }
        }
        _handleDown() {
          this._setState('TVShows')
        }
        _handleEnter() {
          var appApi = new AppApi();
          var applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
          this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;
          var appApi = new AppApi();
          applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;
          if (Storage.get('applicationType') == 'Cobalt') {
            appApi.launchCobalt(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'WebApp') {
            appApi.launchWeb(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Lightning') {
            appApi.launchLightning(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Native') {
            appApi.launchNative(this.uri);
            appApi.setVisibility('ResidentApp', false);
          }
        }
        _handleKey(key) {
          const config = {
            host: '127.0.0.1',
            port: 9998,
            default: 1,
          };
          var thunder = ThunderJS(config);
          var appApi = new AppApi();
          console.log('_handleKey', key.keyCode);
          // Detecting Ctrl
          var _key = key.keyCode;
          var ctrl = key.ctrlKey ? key.ctrlKey : ((_key === 17) ? true : false);
          if (key.keyCode == 27 || (ctrl && key.keyCode == 77) || key.keyCode == 36 || key.keyCode == 158) {
            if (Storage.get('applicationType') == 'WebApp') {
              Storage.set('applicationType', '');
              appApi.deactivateWeb();
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Lightning') {
              Storage.set('applicationType', '');
              appApi.deactivateLightning();
              appApi.setVisibility('ResidentApp', true);
            } else if (Storage.get('applicationType') == 'Native') {
              Storage.set('applicationType', '');
              appApi.killNative();
              appApi.setVisibility('ResidentApp', true);
            } else if(Storage.get('applicationType') == 'Cobalt'){
              Storage.set('applicationType', '');
              appApi.suspendCobalt();
              appApi.setVisibility('ResidentApp', true);
            }  else {
              appApi.zorder("moveToFront","foreground");
              return false;
            }
            thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
              console.log('ResidentApp moveToFront Success');
            });
            thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
              appApi.zorder("moveToFront","foreground");
              console.log('ResidentApp moveToFront Success');
            });
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
        $enter() {
          this.fireAncestors('$scroll', -320)
        }
        _getFocused() {
          if (this.tag('TVShows').length) {
            this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('TVShows').element.data.url)

            return this.tag('TVShows').element
          }
        }
        _handleRight() {
          if (this.tag('TVShows').length - 1 != this.tag('TVShows').index) {
            this.tag('TVShows').setNext()
            this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('TVShows').element.data.url)
            return this.tag('TVShows').element
          }
        }
        _handleLeft() {
          if (0 != this.tag('TVShows').index) {
            this.tag('TVShows').setPrevious()
            this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('TVShows').element.data.url)
            return this.tag('TVShows').element
          }
        }
        _handleUp() {
          this._setState('MetroApps')
        }
        _handleEnter() {
          this.fireAncestors('$goToPlayer')
        }
        $exit() {
          this.fireAncestors('$scroll', 0)
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
