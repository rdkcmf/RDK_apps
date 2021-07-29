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
import { UsbFolderListInfo } from '../../../static/data/UsbFolderListInfo'
import UsbApi from '../../api/UsbApi'
import { COLORS } from '../../colors/Colors'
import FolderListItem from '../../items/FolderListItem'

/**
 * Class for settings screen.
 */

export default class UsbFolders extends Lightning.Component {
  static _template() {
    return {

      Switch: {
        x: 825,
        y: 310,
        Shadow: {
          alpha: 0,
          x: -15,
          y: 0,
          color: 0x66000000,
          texture: lng.Tools.getShadowRect(205, 60, 50, 10, 20),
        },
        Button: {
          h: 60,
          w: 180,
          src: Utils.asset('images/switch-off-new.png'),
        },

      },
      HelperText: {
        x: 1050,
        y: 320,
        text: {
          text: 'Enable only if USB/HDD connected to Box',
          textColor: COLORS.textColor,
          fontSize: 28,
        },
        alpha: 1
      },

      UsbFolderList: {
        x: 800,
        y: 450,
        flex: { direction: 'row', paddingLeft: 20, wrap: false },
        type: Lightning.components.ListComponent,
        w: 1020,
        h: 300,
        itemSize: 250,
        roll: true,
        rollMax: 1020,
        horizontal: true,
        itemScrollOffset: -5,
        clipping: false,
        alpha: 0
      },
      Shadow: {
        alpha: 0,
        zIndex: 3,
        x: -15,
        y: 0,
        color: 0x66000000,
        texture: lng.Tools.getShadowRect(205, 60, 10, 10, 20),
      },
    }
  }

  _init() {
    this.usbFolderList = UsbFolderListInfo
    this._usbEnabled = false

  }
  _active() {
    if (!this._usbEnabled)
      this._setState('Button')
    else
      this._setState('UsbFolderList')
  }


  set usbFolderList(items) {
    this.tag('UsbFolderList').items = items.map(info => {
      return {
        w: 235,
        h: 170,
        type: FolderListItem,
        data: info,
        focus: 1.2,
        unfocus: 1,
        x_text: 115,
        y_text: 180,
      }
    })
    this.tag('UsbFolderList').start()
  }

  toggleBtnAnimationX() {
    const lilLightningAnimation = this.tag('Button').animation({
      duration: 1,
      repeat: 0,
      actions: [
        { p: 'x', v: { 0: 0, 0.5: 0, 1: 0 } }
      ]
    });
    lilLightningAnimation.start();
  }
  toggleBtnAnimationY() {
    const lilLightningAnimation = this.tag('Button').animation({
      duration: 1,
      repeat: 0,
      actions: [
        { p: 'x', v: { 0: 0, 0.5: 0, 1: 0 } }
      ]
    });
    lilLightningAnimation.start();
  }

  switchOnOff() {
    if (this._usbEnabled) {
      // this.tag('Switch.Button').src = Utils.asset('images/switch-off-new.png')
      this.toggleBtnAnimationX()
      this.tag('Button').patch({
        src: Utils.asset('images/switch-off-new.png')
      })

      var usbApi = new UsbApi()
      var abc = usbApi.retrieUsb()


      this.tag('HelperText').patch({
        text: {
          text: 'USB/HDD is connected'
        }
      })
      this.tag('UsbFolderList').patch({
        alpha: 1
      })
      this._setState('UsbFolderList')


    } else if (!this._usbEnabled) {

      var usbApi = new UsbApi()
      var abc = usbApi.destroy()

      this.toggleBtnAnimationY()
      this.tag('Button').patch({
        src: Utils.asset('images/switch-on-new.png')
      })
      this.tag('UsbFolderList').patch({
        alpha: 0
      })
      this.tag('HelperText').patch({
        text: {
          text: 'Enable only if USB/HDD connected to Box',
        }
      })

    }
  }

  launchUsbFolder(index) {
    if (index == 0) {
      Router.navigate('usbContent/UsbVideoScreen', false)
    } else if (index == 1) {
      Router.navigate('usbContent/UsbAudioScreen', false)
    }
    else if (index == 2) {
      Router.navigate('usbContent/UsbImageScreen', false)
    }
  }

  static _states() {
    return [class Button extends this{
      $enter() {
        console.log('Button enter')

      }
      $exit() {
        console.log('Botton exit')
        this.tag('Button').patch({
          h: 60,
          w: 180
        })

      }

      _getFocused() {
        this.tag('Button').patch({
          h: 70,
          w: 200
        })
        this.tag('Shadow').patch({
          smooth: {
            alpha: 1
          }
        });

      }
      _handleUp() {
        this.fireAncestors('$goToTopPanel', 0)
      }
      _handleEnter() {
        this._usbEnabled = !this._usbEnabled
        this.switchOnOff()
      }
      _handleLeft() {
        this.tag('Button').patch({
          h: 60,
          w: 180
        })
        this.tag('Shadow').patch({
          smooth: {
            alpha: 0
          }
        });
        this.fireAncestors('$goToSideMenubar', 2)
      }
    },
    class UsbFolderList extends this {
      _getFocused() {
        if (this.tag('UsbFolderList').length) {
          this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('UsbFolderList').element.data.url)
          return this.tag('UsbFolderList').element
        }
      }
      _handleRight() {

        if (this.tag('UsbFolderList').length - 1 != this.tag('UsbFolderList').index) {
          this.tag('UsbFolderList').setNext()
          this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('UsbFolderList').element.data.url)
          return this.tag('UsbFolderList').element
        }
      }
      _handleLeft() {

        if (0 != this.tag('UsbFolderList').index) {
          this.tag('UsbFolderList').setPrevious()
          this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('UsbFolderList').element.data.url)
          return this.tag('UsbFolderList').element
        }
        if (0 == this.tag('UsbFolderList').index) {
          this.fireAncestors('$goToSideMenubar', 2)
        }

      }
      _handleDown() {
      }

      _handleUp() {
        this._setState('Button')
      }


      _handleEnter() {
        this.launchUsbFolder(this.tag('UsbFolderList').index)
      }
      _handleKey(key) {
      }
    },

    ]
  }
}
