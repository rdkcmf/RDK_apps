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
import SettingsItem from './SettingsItem'
import { COLORS } from '../colors/Colors'

/**
 * Class for the item in the Bluetooth screen.
 */
export default class BluetoothItem extends SettingsItem {
  static _template() {
    return {
      Item: {
        w: 1920 / 3 - 70,
        h: 65,
        rect: true,
        color: 0x00000000,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 9 },
      },
    }
  }

  /**
   * Function to set contents of an item in the Bluetooth screen.
   */
  set item(item) {
    this._item = item
    this.connected = item.connected ? 'Connected' : 'Not Connected'
    this.status = item.paired ? this.connected : 'Not Paired'
    this.tag('Item').patch({
      Left: {
        x: 10,
        y: 32.5,
        mountY: 0.5,
        text: { text: item.name, fontSize: 25, textColor: COLORS.textColor },
      },

      Right: {
        x: 1920 / 3 - 80,
        mountX: 1,
        y: 32.5,
        mountY: 0.5,
        flex: { direction: 'row' },
        Text: { x: 0, flexItem: {}, text: { text: this.status, fontSize: 25 } },
        Info: {
          color: 0xff0000ff,
          flexItem: { marginLeft: 10 },
          texture: Lightning.Tools.getSvgTexture(Utils.asset('images/info.png'), 32.5, 32.5),
        },
      },
    })
    if (this.status == 'Connected') {
      this.tag('Item.Right.Info').visible = false
    } else {
      this.tag('Item.Right.Info').visible = true
    }
  }

  _focus() {
    this.tag('Item').color = COLORS.hightlightColor
  }

  _unfocus() {
    this.tag('Item').color = 0x00000000
  }
}
