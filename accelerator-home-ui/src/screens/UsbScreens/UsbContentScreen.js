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
import UsbImageScreen from './UsbImageScreen'
import UsbVideoScreen from './UsbVideoScreen'

/**
 * Class for Usb Home screen.
 */

export default class UsbContentScreen extends Lightning.Component {

  static _template() {
    return {
      UsbVideoScreen: {
        type: UsbVideoScreen,
        visible: false,
      },
      UsbAudioScreen: {
        type: UsbAudioScreen,
        visible: false,
      },
      UsbImageScreen: {
        type: UsbImageScreen,
        visible: false,
      },
    }
  }

  set screen(screen) {
    this._setState(screen)
  }
  static _states() {
    return [

      class UsbVideoScreen extends this {
        $enter() {
          this.tag('UsbVideoScreen').visible = true
        }
        _getFocused() {
          return this.tag('UsbVideoScreen')
        }
        $exit() {
          this.tag('UsbVideoScreen').visible = false
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
          this.tag('UsbAudioScreen').visible = false
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
          this.tag('UsbImageScreen').visible = false
        }
        _handleKey(key) {

        }
      },
    ]
  }
}
