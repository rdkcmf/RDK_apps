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
import ThunderJS from 'ThunderJS'
import AppApi from '../api/AppApi'
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
        Search: {
          x: 200,
          y: 105,
          mountY: 0.5,
          text: { text: 'Search TV shows, movies and more...', fontSize: 42 },
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
          text: { text: '', fontSize: 48 },
          w: 160,
          h: 60,
        },
        Day: {
          x: 1740,
          y: 95,
          mountY: 0.5,
          text: { text: '', fontSize: 32 },
          w: 95,
          h: 32,
        },
        Date: {
          x: 1741,
          y: 115,
          mountY: 0.5,
          text: { text: '', fontSize: 22 },
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
  _init() {
    this.timeZone = null;
    new AppApi().getZone().then(function (res) {
      this.timeZone = res;
    }.bind(this)).catch(err => { console.log('Timezone api request error', err) });
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
      console.log('Current day == ' + strDay)

      // get month
      let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let strMonth = month[date.getMonth()]

      let strDate = date.toLocaleDateString('en-US', { day: '2-digit' }) + ' ' + strMonth + ' ' + date.getFullYear()
      console.log('Current day == ' + strDate)
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
}
