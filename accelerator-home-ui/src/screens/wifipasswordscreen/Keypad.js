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
import { Lightning } from '@lightningjs/sdk'

/**
 * Class to render the keypad for the wifi screen.
 */
export default class Keypad extends Lightning.Component {
  static _template() {
    return {
      Wrapper: {
        flex: { direction: 'row' },
      },
    }
  }

  /**
   * Function to add items to the list.
   */
  set items(items) {
    this._scroll = true
    this.tag('Wrapper').children = items
    this._index = 0
    if (items.length > 0) {
      this._setState('Filled')
    } else {
      this._setState('Empty')
    }
  }

  set wrap(bool) {
    if (bool) {
      let wrapper = this.tag('Wrapper')
      wrapper.w = 428
      wrapper.h = 56
      this.tag('Wrapper').patch({
        flex: { direction: 'row', wrap: true },
      })
    }
    this._wrap = true
  }
  get items() {
    return this.tag('Wrapper').children
  }

  get currentItem() {
    return this.items[this._index]
  }

  get length() {
    return this.items.length
  }

  set orientation(v) {
    this._orientation = v
    if (v === 'horizontal') {
      this.tag('Wrapper').patch({ flex: { direction: 'row' } })
    } else {
      this.tag('Wrapper').patch({ flex: { direction: 'column' } })
    }
  }

  get orientation() {
    return this._orientation || 'horizontal'
  }

  set jump(bool) {
    this._jump = bool
  }

  get jump() {
    return this._jump || false
  }

  set jumpToStart(bool) {
    this._jumpToStart = bool
  }

  get jumpToStart() {
    return this._jumpToStart !== undefined ? this._jumpToStart : this.jump
  }

  set jumpToEnd(bool) {
    this._jumpToEnd = bool
  }

  get jumpToEnd() {
    return this._jumpToEnd !== undefined ? this._jumpToEnd : this.jump
  }

  _navigate(dir) {
    this._prevY = this.currentItem.finalY
    const ori = this.orientation
    if (dir === 'right' || dir === 'left' || dir === 'up' || dir === 'down') {
      const length = this.items.length
      const currentIndex = this._index
      let targetIndex = currentIndex + 1
      if (dir === 'left' || (dir === 'up' && this._wrap === false)) {
        targetIndex = currentIndex - 1
      }
      if (dir === 'up' && this._wrap === true) {
        let n = Math.floor(this.tag('Wrapper').w / this.currentItem.finalW)
        let pos = currentIndex - n
        targetIndex = currentIndex - n >= 0 ? pos : -1
      }
      if (dir === 'down' && this._wrap === true) {
        let n = Math.floor(this.tag('Wrapper').w / this.currentItem.finalW)
        let pos = currentIndex + n
        targetIndex = pos < length ? pos : -1
        if (targetIndex == -1) return this.fireAncestors('$listEnd')
      }
      if (targetIndex < 0) {
        return this.fireAncestors('$listStart')
      }
      if (targetIndex > -1 && targetIndex < length) {
        this._index = targetIndex
      } else if (this.jump || this.jumpToStart || this.jumpToEnd) {
        if (targetIndex < 0 && this.jumpToEnd) {
          this._index = targetIndex + length
        } else if (targetIndex === length && this.jumpToStart) {
          this._index = 0
        }
      } else {
        return false
      }

      if (currentIndex !== this._index) {
        this.indexChanged({ index: this._index, previousIndex: currentIndex })
      }
    }
    //return false
  }

  setIndex(targetIndex) {
    if (targetIndex > -1 && targetIndex < this.items.length) {
      const currentIndex = this._index
      this._index = targetIndex
      this.indexChanged({ index: this._index, previousIndex: currentIndex })
    }
  }

  indexChanged(event) {
    this.signal('indexChanged', event)
  }

  _getFocused() {
    return this
  }

  _construct() {
    this._index = 0
  }

  _init() {
    this._setState('Empty')
  }

  static _states() {
    return [
      class Empty extends this { },
      class Filled extends this {
        _getFocused() {
          return this.currentItem
        }
        _handleRight() {
          return this._navigate('right')
        }

        _handleLeft() {
          return this._navigate('left')
        }

        _handleUp() {
          return this._navigate('up')
        }

        _handleDown() {
          return this._navigate('down')
        }
      },
    ]
  }
}
