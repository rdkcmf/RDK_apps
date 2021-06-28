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
import { Lightning, Utils, Router, Storage } from '@lightningjs/sdk'
import UsbAudioScreen from './UsbAudioScreen'
import UsbContent from './UsbContent'
import UsbImageScreen from './UsbImageScreen'
import UsbSideMenuScreen from './UsbSideMenuScreen'
import UsbVideoScreen from './UsbVideoScreen'
import NetworkApi from '../../api/NetworkApi'

/**
 * Class for Usb Home screen.
 */

export default class UsbHomeScreen extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset('images/tvShows/background_new.jpg'),
      },
      UsbHomeTopPanel: {
        x: 0,
        y: 0,
        w: 1920,
        h: 171,
        Back: {
          x: 81,
          y: 100,
          mountY: 0.5,
          src: Utils.asset('/images/settings/Back_icon.png'),
          w: 70,
          h: 70,
        },
        IconTitle: {
          x: 200,
          y: 78,
          text: { text: 'USB' }
        },
        IpAddress: {
          x: 1840,
          y: 115,
          mount: 1,
          text: {
            text: 'IP:NA',
            textColor: 0xffffffff,
            fontSize: 40,
            w: 360,
            h: 40,
          },
        },
        Border: {
          x: 81,
          y: 171,
          mountY: 0.5,
          RoundRectangle: {
            zIndex: 2,
            texture: lng.Tools.getRoundRect(1761, 0, 0, 3, 0xffffffff, true, 0xffffffff),
          },
          alpha: 0.4
        }
      },
      ItemList: {
        x: 815,
        y: 320,
        flex: { direction: 'row', paddingLeft: 20, wrap: false },
        type: Lightning.components.ListComponent,
        w: 1000,
        h: 300,
        itemSize: 257,
        roll: true,
        rollMax: 815,
        horizontal: true,
        itemScrollOffset: -3,
        clipping: true,

      },
      set itemList(items) {
        this.tag('ItemList').items = items.map(info => {
          return {
            w: 175,
            h: 175,
            type: AppListItem,
            data: info,
            focus: 1.2,
            unfocus: 1,
            x_text: 106,
            y_text: 140,
          }
        })
        this.tag('ItemList').start()
      }

    }
  }

  $setVisibleScreen(index) {
    if (index == 0) {
      this.tag('UsbVideoScreen').alpha = 1
      this.tag('UsbAudioScreen').alpha = 0
      this.tag('UsbImageScreen').alpha = 0
    }
    else if (index == 1) {
      this.tag('UsbVideoScreen').alpha = 0
      this.tag('UsbAudioScreen').alpha = 1
      this.tag('UsbImageScreen').alpha = 0

    } else if (index == 2) {
      this.tag('UsbVideoScreen').alpha = 0
      this.tag('UsbAudioScreen').alpha = 0
      this.tag('UsbImageScreen').alpha = 1

    }
  }

  _init() {
    console.log('init of setting')
    var networkApi = new NetworkApi()
    networkApi.getIP().then(ip => {
      this.tag('IpAddress').text.text = 'IP:' + ip
    })
  }
  _active() {
    console.log('actie setting screen')
  }

  set screen(screen) {
    this._setState(screen)
  }

  set params(args) {
    if (args.animation != undefined) {
      args.animation.start()
    }
  }


  $goToUsbHomeTopPanel() {
    this._setState('Back')
  }
  /**
    * Fireancestor to set the state to side panel.
    * @param {index} index index value of side panel item.
    */
  $goToSUsbSideMenuScreen() {
    this._setState('Back')
  }
  $goToUsbVideoScreen(index) {
    this._setState('UsbVideoScreen')
  }
  $goToUsbAudioScreen(index) {
    this._setState('UsbAudioScreen')
  }
  $goToUsbImageScreen(index) {
    this._setState('UsbImageScreen')
  }

  $goToUsbSideMenuScreen(index) {
    this.tag('UsbSideMenuScreen').index = index
    this._setState('UsbSideMenuScreen')
  }






  static _states() {
    return [
      class ItemList extends this {
        _getFocused() {
          if (this.tag('ItemList').length) {
            return this.tag('ItemList').element
          }
        }
        _handleRight() {
          if (this.tag('ItemList').length - 1 != this.tag('ItemList').index) {
            this.tag('ItemList').setNext()
            return this.tag('ItemList').element
          }
        }
        _handleLeft() {
          if (0 != this.tag('ItemList').index) {
            this.tag('ItemList').setPrevious()
            return this.tag('ItemList').element
          } else if (0 == this.tag('ItemList').index) {
            console.log('handle left ItemList')
            this.fireAncestors('$goToSideMenubar', 2)
          }
        }
        // _handleDown() {
        //     console.log('handle down')
        // }
        // _handleUp() {
        //     console.log('handle up')
        // }

      },

      class Back extends this{
        $enter() {

          console.log('enter back');
          this.tag('Back').patch({
            src: Utils.asset('/images/settings/back-arrow-small.png'),
          })
        }
        _handleDown() {
          console.log('handle down')
          this.tag('Back').patch({
            src: Utils.asset('/images/settings/Back_icon.png'),

          })
          this._setState('UsbSideMenuScreen')
        }

        _handleKey(key) {
          console.log(key.keyCode)
          if (key.keyCode == 13) {
            this.tag('Back').patch({
              src: Utils.asset('/images/settings/Back_icon.png'),

            })
            Router.navigate('settings/SettingsScreen', false)
          }
        }
      },
      class UsbVideoScreen extends this {
        $enter() {
          this.tag('UsbVideoScreen').visible = true
        }
        _getFocused() {
          return this.tag('UsbVideoScreen')
        }
        $exit() {
          // this.tag('UsbVideoScreen').visible = false
        }
        _handleKey(key) {
        }
      },
      class UsbAudioScreen extends this {
        $enter() {
          this.tag('UsbAudioScreen').visible = true
        }
        _getFocused() {
          return this.tag('UsbAudioScreen')
        }
        $exit() {
          // this.tag('UsbAudioScreen').visible = false
        }
        _handleKey(key) {

        }
      },
      class UsbImageScreen extends this {
        $enter() {
          this.tag('UsbImageScreen').visible = true
        }
        _getFocused() {
          return this.tag('UsbImageScreen')
        }
        $exit() {
          // this.tag('UsbImageScreen').visible = false
        }
        _handleKey(key) {

        }
      },
    ]
  }
}
