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
import { Lightning, Utils, Language, Router, Storage } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS';
import { COLORS } from '../colors/Colors'
import SettingsMainItem from '../items/SettingsMainItem'
import { CONFIG } from '../Config/Config'
import DTVApi from '../api/DTVApi';
import AppApi from '../api/AppApi';

const config = {
  host: '127.0.0.1',
  port: 9998,
  default: 1,
};
var thunder = ThunderJS(config);


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
      color: 0xCC000000,
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


        NFRStatus: {
          y: 450,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: Language.translate('Native Frame Rate'),
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


        DTVSettings: {
          alpha: 0.3,
          y: 540,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: Language.translate('Live TV'),
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





      },
    }
  }

  _init() {

    let self = this;
    this.appApi = new AppApi();
    this._setState('NetworkConfiguration')
    this.fireAncestors("$registerHide", function () {
      self.widgets.menu.setPanelsVisibility()
    })
  }
  _focus() {


    this.widgets.menu.setPanelsVisibility()
    this._setState(this.state)
  }
  _firstActive() {

    if (Storage.get("NFRStatus")) {
      console.log(`Netflix : NFRStatus is found to be enabled`)
      this.tag("NFRStatus.Button").src = "static/images/settings/ToggleOnOrange.png"
    }
    else {
      console.log(`Netflix : NFRStatus is found to be disabled`)
      this.tag("NFRStatus.Button").src = "static/images/settings/ToggleOffWhite.png"
    }


    this.dtvApi = new DTVApi();
    this.dtvPlugin = false; //plugin availability
    this.dtvApi.activate().then((res) => {
      // if (res){
      this.dtvPlugin = true;
      this.tag("DTVSettings").alpha = 1;
      // }
    })
  }

  _handleBack() {

    console.log("application Type = ", Storage.get("applicationType"))
    if (Storage.get("applicationType") == "") {
      Router.navigate('menu')
    }
    else {
      this.appApi.visibile("ResidentApp", false)
      let appType = Storage.get("applicationType");
      if (appType === "WebApp") {
        appType = "HtmlApp"
      }
      this.appApi.setFocus(appType)
      this.appApi.zorder(appType)
      this.widgets.menu.setPanelsVisibility()
    }
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
        _handleEnter() {
          Router.navigate('settings/other')
        }
        _handleDown() {
          this._setState("NFRStatus")
        }
      },

      class NFRStatus extends this{
        $enter() {
          this.tag('NFRStatus')._focus()
        }
        $exit() {
          this.tag('NFRStatus')._unfocus()
        }
        _handleUp() {
          this._setState('OtherSettings')
        }
        _handleDown() {
          if (this.dtvPlugin) {
            this._setState('DTVSettings')
          }
        }
        _handleEnter() {
          //handle Switch
          if (Storage.get("NFRStatus")) {
            Storage.set("NFRStatus", false)
            this.tag("NFRStatus.Button").src = "static/images/settings/ToggleOffWhite.png"

            thunder.call("Netflix.1", "nfrstatus", { "params": "disable" }).then(nr => {
              console.log(`Netflix : nfr disable updation results in ${nr}`)
            }).catch(nerr => {
              console.error(`Netflix : error while updating nfrstatus ${nerr}`)
            })

          }
          else {
            Storage.set("NFRStatus", true)
            this.tag("NFRStatus.Button").src = "static/images/settings/ToggleOnOrange.png"

            thunder.call("Netflix.1", "nfrstatus", { "params": "enable" }).then(nr => {
              console.log(`Netflix : nfr enable results in ${nr}`)
            }).catch(nerr => {
              console.error(`Netflix : error while updating nfrstatus ${nerr}`)
            })

          }
          console.log(`Netflix : updated NFRStatus to ${Storage.get("NFRStatus")}`)

        }
      },

      class DTVSettings extends this{
        $enter() {
          this.tag('DTVSettings')._focus()
        }
        $exit() {
          this.tag('DTVSettings')._unfocus()
        }
        _handleUp() {
          this._setState('NFRStatus')
        }
        _handleEnter() {
          if (this.dtvPlugin) {
            Router.navigate('settings/livetv')
          }
          // dtvApi.activate().then(res =>{
          //   this.tag('DTVSettings.Title').text.text = 'DTV Settings: Activtion'+ res
          // })
        }
      },
    ]
  }
}
