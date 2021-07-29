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
import { COLORS } from '../colors/Colors'
import SettingsItem from './../items/SettingsItem'

/**
 * Class for pairing screen for the Bluetooth.
 */
export default class BluetoothPairingScreen extends Lightning.Component {
  static _template() {
    return {
      PairingScreen: {
        x: 0,
        y: 0,
        w: 1920 / 3,
        h: 1080,
        rect: true,
        color: 0xff364651,
      },
      Title: {
        x: 20,
        y: 100,
        text: { text: '', fontSize: 30, textColor: COLORS.titleColor },
      },
      List: {
        x: 20,
        y: 150,
        type: Lightning.components.ListComponent,
        w: 1920 / 3,
        h: 400,
        itemSize: 65,
        horizontal: false,
        invertDirection: true,
        roll: true,
      },
      Status: {
        x: 20,
        y: 500,
        Text: {
          text: {
            text: 'Enter the below code in your Bluetooth device and press enter',
            wordWrapWidth: 1920 / 3 - 70,
            fontSize: 30,
          },
        },
        Code: {
          x: 0,
          y: 60,
          text: { text: '' },
        },
        visible: false,
      },
    }
  }
  set item(item) {
    this.tag('Status').visible = false
    this.tag('Title').text = item.name
    var options = []
    this._item = item
    if (item.paired) {
      if (item.connected) {
        options = ['Disconnect', 'Unpair', 'Cancel']
      } else {
        options = ['Connect', 'Unpair', 'Cancel']
      }
    } else {
      options = ['Pair', 'Cancel']
    }
    this.tag('List').items = options.map((item, index) => {
      return {
        ref: item,
        w: 1920 / 3,
        h: 65,
        type: SettingsItem,
        item: item,
      }
    })
  }

  set code(code) {
    this.tag('Status.Code').text.text = code
    this.tag('Status').visible = true
  }

  _getFocused() {
    return this.tag('List').element
  }

  _handleDown() {
    this.tag('List').setNext()
  }

  _handleUp() {
    this.tag('List').setPrevious()
  }

  _handleEnter() {
    this.fireAncestors('$pressEnter', this.tag('List').element.ref)
  }
}
