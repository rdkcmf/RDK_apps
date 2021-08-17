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
import Keypad from './Keypad'
import Key from './Key'
import Api from './KeyDetails'
import SelectionKey from './SelectionKey'

/**
 * Class to render the wifi password screen.
 */
export default class WiFiPasswordScreen extends Lightning.Component {
  _construct() {
    this._width = 428
    this._height = 56
    this._radius = 28
    this._strokeWidth = 2
    this.keySpace = 5
  }
  static _template() {
    return {}
  }
  _init() {
    this._api = new Api()

    this.patch({
      src: Utils.asset('images/tvShows/background.jpg'),
      w: 440,
      h: 560,
      Entry: {
        x: 4,
        y: 10,
        texture: Lightning.Tools.getRoundRect(
          this._width,
          this._height,
          this._radius,
          this._strokeWidth,
          0xff1b1b1b,
          true,
          0x00a5a5a5
        ),
        Text: {
          x: 20,
          y: this._height / 2 + 5,
          mountY: 0.5,
          text: { text: 'Password', fontSize: 18, fontFace: 'MS-Light', textColor: 0xffa5a5a5 },
        },
        Pwd: {
          x: 130,
          y: this._height / 2 + 5,
          mountY: 0.5,
          text: {
            text: '',
            fontSize: 24,
            fontFace: 'MS-Light',
            textColor: 0xffc0c0c0,
            wordWrapWidth: this._width - 130,
            wordWrap: false,
            textOverflow: 'ellipsis',
          },
        },
      },
      Selection: {
        x: 4,
        y: this._height + 21,
        texture: Lightning.Tools.getRoundRect(
          this._width,
          this._height,
          this._radius,
          this._strokeWidth,
          0x001b1b1b,
          true,
          0x00a5a5a5
        ),
        Types: {
          type: Lightning.components.ListComponent,
          itemSize: 143,
          w: this._width,
          h: this._height,
          clipping: true,
          roll: true,
          zIndex: 10,
        },
      },
      Keypad: {
        x: 9,
        y: (this._height + 21) * 2,
        w: this._width,
        wrap: true,
        type: Keypad,
      },
      FunctionalKeys: {
        x: 9,
        y: (this._height + 21) * 5 + 15,
        w: this._width,
        wrap: true,
        type: Keypad,
      },
      Submit: {
        x: 4,
        y: (this._height + 21) * 5 + 15 + 61,
        texture: Lightning.Tools.getRoundRect(
          this._width,
          this._height,
          this._radius,
          this._strokeWidth,
          0xff1b1b1b,
          true,
          0x00a5a5a5
        ),
        Text: {
          x: this._width / 2,
          y: this._height / 2,
          mount: 0.5,
          text: { text: 'Submit', fontSize: 24, fontFace: 'MS-Light', textColor: 0xffffffff },
        },
      },
    })
    this.setKeypad('abc')
    let clear = {
      ref: 'Keyclear',
      w: 117,
      h: 56,
      type: Key,
      fontSize: 24,
      item: 'CLEAR',
      keyType: 'clear',
      flexItem: { marginRight: 5, marginBottom: 5 },
    }
    let space = {
      ref: 'Keyspace',
      w: 178,
      h: 56,
      type: Key,
      fontSize: 24,
      item: 'Space',
      keyType: 'space',
      flexItem: { marginRight: 5, marginBottom: 5 },
    }
    let del = {
      ref: 'Keydel',
      w: 117,
      h: 56,
      keyType: 'delete',
      type: Key,
      fontSize: 24,
      item: '',
      flexItem: { marginRight: 5, marginBottom: 5 },
    }
    this.tag('FunctionalKeys').items = [clear, space, del]
    this.tag('Selection.Types').items = ['abc', 'ABC', '#+-'].map((item, index) => {
      return {
        ref: 'Item',
        w: this._width / 3,
        h: this._height,
        fontSize: 24,
        keyType: index,
        item: item,
        type: SelectionKey,
        clipping: true,
        //keyType: 'selection' + index,
      }
    })
  }
  _active() {
    this.tag('Selection.Types').start()
    this._setState('Selection')
  }
  _inactive() {
    this.tag('Entry.Pwd').text.text = ''
  }
  $pressedKey(key, keyType) {
    console.log(key)
    let pwd = this.tag('Entry.Pwd')
    if (keyType === 'alphanum') {
      pwd.text.text = pwd.text.text + key
    } else if (keyType === 'clear') {
      pwd.text.text = ''
    } else if (keyType === 'space') {
      pwd.text.text = pwd.text.text + ' '
    } else if (keyType === 'delete') {
      pwd.text.text = pwd.text.text.substring(0, pwd.text.text.length - 1)
    }
  }
  setKeypad(type) {
    let data = []
    if (type === 'abc') data = this._api.getAlphabet()
    else if (type === '#+-') data = this._api.getSymbols()
    else if (type === 'ABC') {
      data = this._api.getAlphabet().map(i => {
        return i.toUpperCase()
      })
    }
    this.tag('Keypad').items = []
    this.tag('Keypad').items = data.map(index => {
      return {
        ref: 'Key' + index,
        w: 56,
        h: 56,
        type: Key,
        item: index,
        flexItem: { marginRight: 5, marginBottom: 5 },
      }
    })
  }
  static _states() {
    return [
      class Selection extends this {
        $enter() {
          this.setKeypad(this.tag('Selection.Types').element._key)
        }
        _getFocused() {
          return this.tag('Selection.Types').element
        }
        _handleRight() {
          if (this.tag('Selection.Types').index < this.tag('Selection.Types').length - 1) {
            this.tag('Selection.Types').setNext()
            this.setKeypad(this.tag('Selection.Types').element._key)
          }
        }
        _handleLeft() {
          if (this.tag('Selection.Types').index != 0) {
            this.tag('Selection.Types').setPrevious()
            this.setKeypad(this.tag('Selection.Types').element._key)
          }
        }
        _handleDown() {
          this._setState('Keypad')
        }
      },
      class Keypad extends this {
        _getFocused() {
          return this.tag('Keypad')
        }
        $listEnd() {
          this._setState('Function')
        }
        $listStart() {
          this._setState('Selection')
        }
      },
      class Function extends this {
        _getFocused() {
          return this.tag('FunctionalKeys')
        }
        _handleUp() {
          this._setState('Keypad')
        }
        $listEnd() {
          console.log('down')
          this._setState('Submit')
        }
        $listStart() {
          this._setState('Keypad')
        }
      },
      class Submit extends this {
        $enter() {
          this.patch({
            Submit: {
              x: 0,
              y: (this._height + 21) * 5 + 15 + 61,
              texture: Lightning.Tools.getRoundRect(
                this._width,
                this._height,
                this._radius,
                this._strokeWidth,
                0x00c0c0c0,
                true,
                0xffc0c0c0
              ),
            },
          })
          this.tag('Submit.Text').text.textColor = 0xff000000
        }
        $exit() {
          this.patch({
            Submit: {
              x: 0,
              y: (this._height + 21) * 5 + 15 + 61,
              texture: Lightning.Tools.getRoundRect(
                this._width,
                this._height,
                this._radius,
                this._strokeWidth,
                0xff1b1b1b,
                true,
                0x00c0c0c0
              ),
            },
          })
          this.tag('Submit.Text').text.textColor = 0xffffffff
        }
        _handleEnter() {
          this.fireAncestors('$password', this.tag('Entry.Pwd').text.text)
        }
        _handleUp() {
          console.log('Up')
          this._setState('Function')
        }
        _handleLeft() {
          this._setState('Function')
        }
      },
    ]
  }
}
