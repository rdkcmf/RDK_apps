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
import ListItem from '../items/ListItem.js'
import Item from '../items/item'

var appApi = new AppApi();

/** Class for top panel in home UI */
export default class ShutdownPanel extends Lightning.Component {
  static _template() {
    return {
      Bg: {
        rect: true,
        x: 660 * -1,
        y: 385 * -1,
        w: 1920,
        h: 1080,
        color: 0x33000000,
      },
      Border: {
        rect: true,
        w: 610,
        h: 310,
        color: 0xFF000000,
        alpha: 0.5,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 19 }
      },
      Box: {
        rect: true,
        w: 600,
        h: 300,
        color: 0xFF000055,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 19 }
      },
      LightSleepbtn: {
        rect: true,
        x: 150,
        y: 60,
        w: 300,
        h: 80,
        color: 0xFF0000000,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 19 },
        Txt: {
          x: 60,
          y: 15,
          text: { text: 'Light Sleep', fontSize: 33, fontFace: 'MS-Regular' }
        }
      },
      DeepSleepbtn: {
        rect: true,
        x: 150,
        y: 170,
        w: 300,
        h: 80,
        color: 0xFF0000000,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 19 },
        Txt: {
          x: 60,
          y: 15,
          text: { text: 'Deep Sleep', fontSize: 33, fontFace: 'MS-Regular' }
        }
      },
    }
  }



  _init() {
    console.log("Shutdown panel init..");
    this.tag('LightSleepbtn').color = '0Xff0000AA'
    this.power_state = 'LightSleepbtn'

  }

  _handleEnter() {
    console.log(" current focus :" + this.power_state);
    if (this.power_state == 'LightSleepbtn') {
      this.fireAncestors('$standby', 'STANDBY')
    } else if (this.power_state == 'DeepSleepbtn') {
      this.fireAncestors('$standby', 'DEEP_SLEEP')

    }

  }

  _handleDown() {
    this.tag('DeepSleepbtn').color = '0Xff0000AA'
    this.tag('LightSleepbtn').color = '0xFF0000000'
    this.power_state = 'DeepSleepbtn'

  }

  _handleUp() {
    this.tag('LightSleepbtn').color = '0Xff0000AA'
    this.tag('DeepSleepbtn').color = '0xFF0000000'
    this.power_state = 'LightSleepbtn'
  }

  _handleBack() {
    this.fireAncestors('$standby', 'Back')
  }

}
