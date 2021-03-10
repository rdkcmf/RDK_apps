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
        x: 90,
        y: 60,
        w: 1740,
        h: 120,
        Mic: {
          x: 120,
          y: 60,
          mountY: 0.5,
          src: Utils.asset('/images/topPanel/mic.png'),
          w: 60,
          h: 60,
        },
        Search: {
          x: 250,
          y: 60,
          mountY: 0.5,
          text: { text: 'Search TV shows, movies and more', fontSize: 33 },
        },
        Time: {
          x: 1500,
          y: 60,
          mountY: 0.5,
          text: { text: '', fontSize: 38 },
        },
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
      this.tag('Time').patch({ text: { text: this.updateTime() } })
    }, 1000)
  }

  /**
   * Function to update time in home UI.
   */
  updateTime() {
    if (this.timeZone) {
      let date = new Date()
      date = new Date(date.toLocaleString('en-US', { timeZone: this.timeZone }))
      let hours = date.getHours()
      let minutes = date.getMinutes()
      let ampm = hours >= 12 ? 'pm' : 'am'
      hours = hours % 12
      hours = hours ? hours : 12
      minutes = minutes < 10 ? '0' + minutes : minutes
      let strTime = hours + '.' + minutes + ' ' + ampm
      return strTime
    } else {
      return ""
    }
  }
}
