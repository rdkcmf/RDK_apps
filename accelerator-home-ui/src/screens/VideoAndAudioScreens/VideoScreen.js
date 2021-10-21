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
import ResolutionScreen from './ResolutionScreen'
import { COLORS } from '../../colors/Colors'
import { CONFIG } from '../../Config/Config'
import AppApi from '../../api/AppApi'

/**
 * Class for Video screen.
 */

export default class VideoScreen extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      VideoScreenContents: {
        Resolution: {
          y: 0,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Resolution: ',
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
        HDR: {
          y: 90,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'High Dynamic Range: Auto',
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
        MatchContent: {
          y: 180,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Match Content: Match Dynamic Range',
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
        OutputFormat: {
          y: 270,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Output Format: YCbCr',
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
        Chroma: {
          y: 360,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Chroma: 4:4:4',
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
        HDCP: {
          y: 450,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'HDCP Status: Supported',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
        },
      },

      ResolutionScreen: {
        type: ResolutionScreen,
        visible: false,
      }
    }
  }

  _init() {
    new AppApi().getResolution().then(resolution => {
      this.tag("Resolution.Title").text.text = 'Resolution: ' + resolution;
      this.tag("Resolution.Title").patch({ visible: false });
      setTimeout(() => {
        this.tag("Resolution.Title").patch({ visible: true });
      }, 1500);

      console.log(`xxxx the patch is done`);
    }).catch(err => {
      console.log("Error fetching the Resolution");
      this.tag("Resolution.Title").text.text = "Error fetching Resolution";
    })



  }

  _focus() {
    this._setState('Resolution')
  }

  hide() {
    this.tag('VideoScreenContents').visible = false
  }
  show() {
    this.tag('VideoScreenContents').visible = true
  }

  static _states() {
    return [
      class Resolution extends this{
        $enter() {
          this.tag('Resolution')._focus()
        }
        $exit() {
          this.tag('Resolution')._unfocus()
        }
        _handleDown() {
          this._setState('HDR')
        }
        _handleEnter() {
          this._setState('ResolutionScreen')
        }

      },
      class HDR extends this{
        $enter() {
          this.tag('HDR')._focus()
        }
        $exit() {
          this.tag('HDR')._unfocus()
        }
        _handleUp() {
          this._setState('Resolution')
        }
        _handleDown() {
          this._setState('MatchContent')
        }
        _handleEnter() {
          //
        }
      },
      class MatchContent extends this{
        $enter() {
          this.tag('MatchContent')._focus()
        }
        $exit() {
          this.tag('MatchContent')._unfocus()
        }
        _handleUp() {
          this._setState('HDR')
        }
        _handleDown() {
          this._setState('OutputFormat')
        }
        _handleEnter() {
          //
        }
      },
      class OutputFormat extends this{
        $enter() {
          this.tag('OutputFormat')._focus()
        }
        $exit() {
          this.tag('OutputFormat')._unfocus()
        }
        _handleUp() {
          this._setState('MatchContent')
        }
        _handleDown() {
          this._setState('Chroma')
        }
        _handleEnter() {
          //
        }
      },
      class Chroma extends this{
        $enter() {
          this.tag('Chroma')._focus()
        }
        $exit() {
          this.tag('Chroma')._unfocus()
        }
        _handleUp() {
          this._setState('OutputFormat')
        }
        _handleDown() {
          this._setState('HDCP')
        }
        _handleEnter() {
          //
        }
      },
      class HDCP extends this{
        $enter() {
          this.tag('HDCP')._focus()
        }
        $exit() {
          this.tag('HDCP')._unfocus()
        }
        _handleUp() {
          this._setState('Chroma')
        }
        _handleEnter() {
          //
        }
      },
      class ResolutionScreen extends this {
        $enter() {
          this.hide()
          this.tag('ResolutionScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Video / Resolution')
        }
        $exit() {
          this.tag('ResolutionScreen').visible = false
          this.show()
          this.fireAncestors('$changeHomeText', 'Settings / Video')
        }
        _getFocused() {
          return this.tag('ResolutionScreen')
        }
        _handleBack() {
          this._setState('Resolution')
        }
        $updateResolution(value) {
          this.tag('Resolution.Title').text.text = 'Resolution: ' + value;
        }
      }
    ]

  }
}
