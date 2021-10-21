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
import SettingsMainItem from '../../items/SettingsMainItem'
import { COLORS } from '../../colors/Colors'
import { CONFIG } from '../../Config/Config'
import HdmiOutputScreen from './HdmiOutputScreen'
import AppApi from '../../api/AppApi.js';

/**
 * Class for Audio screen.
 */
var appApi = new AppApi();
export default class AudioScreen extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      Wrapper: {
        AudioOutput: {
          y: 0,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Audio Output: HDMI',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        OutputMode: {
          y: 90,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Output Mode: Auto',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            },
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        DynamicRange: {
          y: 180,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Full Dynamic Range',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },

        AudioLanguage: {
          y: 270,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Audio Language: Auto',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },

        NavigationFeedback: {
          y: 360,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Navigation Feedback',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 66,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/ToggleOnWhite.png'),
          },
        },

        Bluetooth: {
          y: 450,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Bluetooth: None',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
      },
      OutputModeScreen: {
        type: HdmiOutputScreen,
        visible: false,
      }
    }
  }

  _init() {
    //fetch the current HdmiAudioOutputStereo set it
    // this.tag('HdmiAudioOutputStereo.Title').text.text = 'HdmiAudioOutputStereo: ' + currentHdmiAudioOutputStereo

  }

  $updateTheDefaultAudio(audio) {
    console.log(audio)
    this.tag('OutputMode.Title').text.text = 'Output Mode: ' + audio
  }

  $updateSoundMode(soundMode) {
    this.tag('OutputMode.Title').text.text = 'Output Mode: ' + soundMode
  }

  _focus() {
    this._setState('AudioOutput')
  }

  hide() {
    this.tag('Wrapper').visible = false
  }
  show() {
    this.tag('Wrapper').visible = true
  }

  static _states() {
    return [
      class AudioOutput extends this{
        $enter() {
          this.tag('AudioOutput')._focus()
        }
        $exit() {
          this.tag('AudioOutput')._unfocus()
        }
        _handleDown() {
          this._setState('OutputMode')
        }
        // _handleEnter() {
        //   this._setState('HdmiAudioOutputStereoScreen')
        // }

      },

      class OutputMode extends this{
        $enter() {
          this.tag('OutputMode')._focus()
        }
        $exit() {
          this.tag('OutputMode')._unfocus()
        }
        _handleUp() {
          this._setState('AudioOutput')
        }
        _handleDown() {
          this._setState('DynamicRange');
        }
        _handleEnter() {
          this._setState('HdmiAudioOutputStereoScreen')
        }
      },
      class DynamicRange extends this{
        $enter() {
          this.tag('DynamicRange')._focus()
        }
        $exit() {
          this.tag('DynamicRange')._unfocus()
        }
        _handleUp() {
          this._setState('OutputMode')
        }
        _handleDown() {
          this._setState('NavigationFeedback');
        }
        _handleEnter() {
          //
        }
      },
      class NavigationFeedback extends this{
        $enter() {
          this.tag('NavigationFeedback')._focus()
        }
        $exit() {
          this.tag('NavigationFeedback')._unfocus()
        }
        _handleUp() {
          this._setState('DynamicRange')
        }
        _handleDown() {
          this._setState('Bluetooth');
        }
        _handleEnter() {
          //
        }
      },
      class Bluetooth extends this{
        $enter() {
          this.tag('Bluetooth')._focus()
        }
        $exit() {
          this.tag('Bluetooth')._unfocus()
        }
        _handleUp() {
          this._setState('NavigationFeedback')
        }
        _handleEnter() {
          //
        }
      },
      class HdmiAudioOutputStereoScreen extends this {
        $enter() {
          this.hide()
          this.tag('OutputModeScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Audio / Output Mode')
        }
        $exit() {
          this.tag('OutputModeScreen').visible = false
          this.show()
          this.fireAncestors('$changeHomeText', 'Settings / Audio')
        }
        _getFocused() {
          return this.tag('OutputModeScreen')
        }
        _handleBack() {
          this._setState('OutputMode')
        }
        $updateHdmiAudioOutputStereo(value) {
          this.tag('OutputMode.Title').text.text = 'Output Mode: ' + value
        }
      }
    ]

  }
}
