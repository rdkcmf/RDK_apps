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
import { Lightning, Utils, Router, Language } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'
import AppApi from '../api/AppApi'
import { CONFIG } from '../Config/Config'
import store from '../redux.js'
/** Class for top panel in home UI */
export default class TopPanel extends Lightning.Component {
  static _template() {
    return {
      TopPanel: {
        x: 0,
        y: 0,
        w: 1920,
        h: 171,
        Mic: {
          x: 105,
          // zIndex: 2,
          y: 87,
          src: Utils.asset('/images/topPanel/microphone.png'),
          w: 50,
          h: 50,
        },
        Logo: {
          x: 200,
          y: 90,
          src: Utils.asset('/images/' + CONFIG.theme.logo),
          w: 227,
          h: 43
        },
        Page: {
          x: 200,
          y: 184,
          // mountY: 0.5,
          text: {
            fontSize: 40,
            text: Language.translate('home'),
            textColor: CONFIG.theme.hex,
            fontStyle: 'bolder',
            fontFace: CONFIG.language.font
          }
        },
        Settings: {
          x: 1825 - 105 - 160 - 37 + 30,
          y: 111,
          mountY: 0.5,
          src: Utils.asset('/images/topPanel/setting.png'),
          w: 37,
          h: 37,
        },
        Time: {
          x: 1920 - 105 - 160,
          y: 111,
          mountY: 0.5,
          text: { text: '', fontSize: 35, fontFace: CONFIG.language.font, },
          w: 160,
          h: 60,
        },
      },
    }
  }

  _init() {
    this.indexVal = 0,
      this.timeZone = null;
    this.audiointerval = null;
    new AppApi().getZone().then(function (res) {
      this.timeZone = res;
    }.bind(this)).catch(err => { console.log('Timezone api request error', err) });

    function render() {
      if (store.getState() == 'ACTION_LISTEN_STOP') {
        this.tag('AudioListenSymbol').visible = false;
        clearInterval(this.audiointerval);
        this.audiointerval = null;
      } else if (store.getState() == 'ACTION_LISTEN_START') {
        if (!this.audiointerval) {
          this.tag('AudioListenSymbol').visible = true;
          let mode = 1;
          this.audiointerval = setInterval(function () {
            if (mode % 2 == 0) {
              this.tag('AudioListenSymbol').w = 80;
              this.tag('AudioListenSymbol').h = 80;
            } else {
              this.tag('AudioListenSymbol').w = 70;
              this.tag('AudioListenSymbol').h = 70
            }
            mode++;
            if (mode > 20) { mode = 0; };
          }.bind(this), 250);
        }
      }
    }
    store.subscribe(render.bind(this));
    this.zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  set index(index) {
    this.indexVal = index
    if (this.indexVal == 0) {
      this._setState('Mic')
    } else if (this.indexVal == 1) {
      this._setState('Search')
    } else if (this.indexVal == 2) {
      this.tag('Settings').color = CONFIG.theme.hex
      this._setState('Setting')
    }
  }

  set changeText(text) {
    this.tag('Page').text.text = text
    if (text === 'Home') {
      this.tag('Settings').color = 0xffffffff
    }

  }

  _build() {
    setInterval(() => {
      let _date = this.updateTime()
      if (this.zone) {
        this.tag('Time').patch({ text: { text: _date.strTime } })
      }
    }, 1000)
  }

  updateIcon(tagname, url) {
    this.tag(tagname).patch({
      src: Utils.asset(url),
    })
  }

  /**
   * Function to update time in home UI.
   */
  updateTime() {
    if (this.zone) {
      let date = new Date()
      date = new Date(date.toLocaleString('en-US', { timeZone: this.zone }))

      // get day
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let strDay = days[date.getDay()];

      // get month
      let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let strMonth = month[date.getMonth()]
      let strDate = date.toLocaleDateString('en-US', { day: '2-digit' }) + ' ' + strMonth + ' ' + date.getFullYear()
      let hours = date.getHours()
      let minutes = date.getMinutes()
      let ampm = hours >= 12 ? 'pm' : 'am'
      hours = hours % 12
      hours = hours ? hours : 12
      minutes = minutes < 10 ? '0' + minutes : minutes
      let strTime = hours + ':' + minutes + ' ' + ampm
      return { strTime, strDay, strDate }
    } else {
      return ""
    }
  }

  static _states() {
    return [
      class Mic extends this{
        $enter() {
          this.tag('Mic').color = CONFIG.theme.hex
        }
        _handleEnter() {
        }
        _getFocused() {
          this.tag('Mic').color = CONFIG.theme.hex
        }
        $exit() {
          this.tag('Mic').color = 0xffffffff
        }

        _handleKey(key) {
          if (key.keyCode == 39 || key.keyCode == 13) {
            this._setState('Setting')
          } else if (key.keyCode == 40) {
            this.tag('Mic').color = 0xffffffff
            this.fireAncestors('$goToSidePanel', 0)
          }
        }
      },
      class Setting extends this{
        $enter() {
          this.tag('Settings').color = CONFIG.theme.hex
        }
        _handleDown() {
          this.fireAncestors('$goToMainView', 0)
          this.tag('Settings').color = 0xffffffff
        }
        _handleLeft() {

          this._setState('Mic')
        }
        _handleEnter() {
          this.tag('Page').text.text = Language.translate('settings')
          this.fireAncestors('$goToSettings')
        }
        $exit() {
          this.tag('Settings').color = 0xffffffff
        }
      },
    ]
  }
}
