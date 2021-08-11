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
import { Lightning, Utils, Router } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'
import AppApi from '../api/AppApi'
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
          x: 80,
          y: 100,
          mountY: 0.5,
          src: Utils.asset('/images/topPanel/mic_new.png'),
          w: 70,
          h: 70,
        },
        WaveRectangle: {
          x: 165, y: 70, w: 200, h: 60, clipping: true, rect: false, colorTop: 0xffffffff, colorBottom: 0xffffffff,
          Wave: {
            x: -200, y: 2, w: 400, h: 60, rect: true,
            src: Utils.asset('/images/topPanel/wave.png'),
            zIndex: 2
          },
          alpha: 0
        },
        Search: {
          x: 200,
          y: 105,
          mountY: 0.5,
          text: { text: 'Search TV shows, movies and more...', fontSize: 42, fontFace: 'MS-Light', },
          w: 600,
          h: 50,
          alpha: 0.5,
        },
        Settings: {
          x: 1445,
          y: 100,
          mountY: 0.5,
          src: Utils.asset('/images/topPanel/settings_new.png'),
          w: 70,
          h: 70,
        },
        Time: {
          x: 1550,
          y: 105,
          mountY: 0.5,
          text: { text: '', fontSize: 48, fontFace: 'MS-Regular', },
          w: 160,
          h: 60,
        },
        Day: {
          x: 1740,
          y: 95,
          mountY: 0.5,
          text: { text: '', fontSize: 32, fontFace: 'MS-Regular', },
          w: 95,
          h: 32,
        },
        Date: {
          x: 1741,
          y: 115,
          mountY: 0.5,
          text: { text: '', fontSize: 22, fontFace: 'MS-Light', },
          w: 95,
          h: 22,
        },
        Border: {
          x: 80,
          y: 170,
          mountY: 0.5,
          RoundRectangle: {
            zIndex: 2,
            texture: lng.Tools.getRoundRect(1761, 0, 0, 3, 0xffffffff, true, 0xffffffff),
          },
          alpha: 0.4
        }
      },
    }
  }

  waveAnimation() {
    const lilLightningAnimation = this.tag('Wave').animation({
      duration: 3,
      repeat: -1,
      actions: [
        { p: 'x', v: { 0: -165, 0.5: 0, 1: 0 } }
      ]
    });
    lilLightningAnimation.start();
  }

  _init() {
    this.indexVal = 0,
      this.timeZone = null;
    this.audiointerval = null;
    this.waveAnimation()
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
  }

  set index(index) {
    this.indexVal = index
    if (this.indexVal == 0) {
      this._setState('Mic')
    } else if (this.indexVal == 1) {
      this._setState('Search')
    } else if (this.indexVal == 2) {
      this._setState('Setting')
    }
  }

  _build() {
    setInterval(() => {
      let _date = this.updateTime()
      if (this.timeZone) {
        this.tag('Time').patch({ text: { text: _date.strTime } })
        this.tag('Day').patch({ text: { text: _date.strDay } })
        this.tag('Date').patch({ text: { text: _date.strDate } })
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
    if (this.timeZone) {
      let date = new Date()
      date = new Date(date.toLocaleString('en-US', { timeZone: this.timeZone }))

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

  setVisibilityWave(value) {
    this.tag('WaveRectangle').patch({
      alpha: value
    })
  }

  setVisibilitySearch(value) {
    this.tag('Search').patch({
      alpha: value
    })
  }

  static _states() {
    return [
      class Mic extends this{
        $enter() {
          this.updateIcon('Mic', '/images/topPanel/mic_focused.png')
          this.setVisibilityWave(1)
          this.setVisibilitySearch(0)
        }
        _handleEnter() {
        }
        _getFocused() {
          this.updateIcon('Mic', '/images/topPanel/mic_focused.png')
          this.setVisibilityWave(1)
          this.setVisibilitySearch(0)
        }
        _exit() {
          this.updateIcon('Mic', '/images/topPanel/mic_new.png')
          this.setVisibilityWave(0)
          this.setVisibilitySearch(1)
        }

        _handleKey(key) {
          if (key.keyCode == 39 || key.keyCode == 13) {
            this.updateIcon('Mic', '/images/topPanel/mic_new.png')
            this.setVisibilityWave(0)
            this.setVisibilitySearch(1)
            this._setState('Search')
          } else if (key.keyCode == 40) {
            this.updateIcon('Mic', '/images/topPanel/mic_new.png')
            this.setVisibilityWave(0)
            this.setVisibilitySearch(1)
            this.fireAncestors('$goToMainView', 0)
          }
        }
      },
      class Search extends this{
        $enter() {
          this.tag('Search').patch({
            alpha: 1
          })
        }
        $exit() {
          this.tag('Search').patch({
            alpha: 0.5
          })
        }
        _handleEnter() {
        }
        _getFocused() {
        }
        _handleKey(key) {
          if (key.keyCode == 39 || key.keyCode == 13) {
            this.updateIcon('Mic', '/images/topPanel/mic_new.png')
            this._setState('Setting')
          } else if (key.keyCode == 40) {
            this.tag('Search').patch({
              alpha: 0.5
            })
            this.fireAncestors('$goToMainView', 0)
          } else if (key.keyCode == 37) {
            console.log(this.indexVal)
            this.updateIcon('Mic', '/images/topPanel/mic_new.png')
            this._setState('Mic')
          }
        }
      },
      class Setting extends this{
        $enter() {
          this.updateIcon('Settings', '/images/topPanel/setting_focused.png')
        }
        _handleDown() {
          this.updateIcon('Settings', '/images/topPanel/settings_new.png')
          this.fireAncestors('$goToMainView', 0)
        }
        _handleLeft() {
          this.updateIcon('Settings', '/images/topPanel/settings_new.png')
          this._setState('Search')
        }
        _handleEnter() {
          Router.navigate('settings/SettingsScreen/0', false)
        }
      },
    ]
  }
}
