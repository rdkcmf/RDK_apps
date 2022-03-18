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
import { Lightning, Utils, Language, Router } from '@lightningjs/sdk'
import { COLORS } from '../colors/Colors'
import SettingsMainItem from '../items/SettingsMainItem'
import { CONFIG } from '../Config/Config'

/**
 * Class for settings screen.
 */
export default class SettingsScreen extends Lightning.Component {

  _onChanged() {
    this.widgets.menu.updateTopPanelText(Language.translate('Settings'));
  }

  pageTransition() {
    return 'left'
  }

  static _template() {
    return {
      rect: true,
      color: 0xff000000,
      w: 1920,
      h: 1080,
      SettingsScreenContents: {
        x: 200,
        y: 275,
        NetworkConfiguration: {
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: Language.translate('Network Configuration'),
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        Bluetooth: {
          y: 90,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: Language.translate('Pair Remote Control'),
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        Video: {
          y: 180,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: Language.translate('Video'),
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        Audio: {
          y: 270,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: Language.translate('Audio'),
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        OtherSettings: {
          y: 360,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: Language.translate('Other Settings'),
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        UIVoice: {
          y: 450,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: Language.translate('UI Voice'),
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 67,
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/ToggleOffWhite.png'),
          },
        },
      },
    }
  }

  _init() {
    this._setState('NetworkConfiguration')
  }
  _focus() {
    this._setState(this.state)
  }

  _handleBack() {
    Router.navigate('menu')
  }

  static _states() {
    return [
      class NetworkConfiguration extends this{
        $enter() {
          this.tag('NetworkConfiguration')._focus()
        }
        $exit() {
          this.tag('NetworkConfiguration')._unfocus()
        }
        _handleDown() {
          this._setState('Bluetooth')
        }
        _handleEnter() {
          Router.navigate('settings/network')
        }
      },
      class Bluetooth extends this {
        $enter() {
          this.tag('Bluetooth')._focus()
        }
        $exit() {
          this.tag('Bluetooth')._unfocus()
        }
        _handleUp() {
          this._setState('NetworkConfiguration')
        }
        _handleDown() {
          this._setState('Video')
        }
        _handleLeft() {
        }
        _handleEnter() {
          Router.navigate('settings/bluetooth')
        }
      },

      class Video extends this{
        $enter() {
          this.tag('Video')._focus()
        }
        $exit() {
          this.tag('Video')._unfocus()
        }
        _handleUp() {
          this._setState('Bluetooth')
        }
        _handleDown() {
          this._setState('Audio')
        }
        _handleEnter() {
          Router.navigate('settings/video')
        }

      },

      class Audio extends this{
        $enter() {
          this.tag('Audio')._focus()
        }
        $exit() {
          this.tag('Audio')._unfocus()
        }
        _handleUp() {
          this._setState('Video')
        }
        _handleEnter() {
          Router.navigate('settings/audio')
        }
        _handleDown() {
          this._setState('OtherSettings')
        }
      },

      class OtherSettings extends this{
        $enter() {
          this.tag('OtherSettings')._focus()
        }
        $exit() {
          this.tag('OtherSettings')._unfocus()
        }
        _handleUp() {
          this._setState('Audio')
        }
        _handleDown() {
          this._setState('UIVoice')
        }
        _handleEnter() {
          Router.navigate('settings/other')
        }
      },
      class UIVoice extends this{
        $enter() {
          this.tag('UIVoice')._focus()
        }
        $exit() {
          this.tag('UIVoice')._unfocus()
        }
        _handleUp() {
          this._setState('OtherSettings')
        }
        _handleEnter() {
          //implementation pending
        }
      },
    ]
  }
}
