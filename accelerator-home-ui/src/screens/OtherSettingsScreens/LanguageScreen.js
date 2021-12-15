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
 import { COLORS } from '../../colors/Colors'
 import { CONFIG } from '../../Config/Config'
 import SettingsMainItem from '../../items/SettingsMainItem'
 import Tick from '../../../static/images/settings/Tick.png'
 
 /**
  * Class for Video and Audio screen.
  */
 
 export default class LanguageScreen extends Lightning.Component {
     static _template() {
         return {
             x: 0, y: 0,
             h: 1080,
             w: 1920,
             clipping: true,
             LanguageScreenContents: {
                EnglishTick: {
                  y: 45,
                  mountY: 0.5,
                  texture: Lightning.Tools.getSvgTexture(Tick, 32.5, 32.5),
                  color: 0xffffffff,
                  visible: localStorage.getItem('Language')==='english' || localStorage.getItem('Language')===null ? true : false
                },
                 English: {
                    y: 0,
                    type: SettingsMainItem,
                    Title: {
                      x: 60,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'English',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                      }
                    },
                 },
                 SpanishTick: {
                  y: 130,
                  mountY: 0.5,
                  texture: Lightning.Tools.getSvgTexture(Tick, 32.5, 32.5),
                  color: 0xffffffff,
                  visible: localStorage.getItem('Language')==='spanish' ? true : false
                },
                 Spanish: {
                    y: 90,
                    type: SettingsMainItem,
                    Title: {
                      x: 60,
                      y: 45,
                      mountY: 0.5,
                      text: {
                        text: 'Spanish',
                        textColor: COLORS.titleColor,
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                      }
                    },
                 }
             }
         }
     }

     _focus() {
        if(localStorage.getItem('Language')==='english' || localStorage.getItem('Language')===null){
          this._setState('English')
        }
        else if(localStorage.getItem('Language')==='spanish'){
          this._setState('Spanish')
        }

     }

    static _states() {
        return[
            class English extends this{
                $enter() {
                  this.tag('English')._focus()
                }
                $exit() {
                  this.tag('English')._unfocus()
                }
                _handleUp() {
                  this._setState('Spanish')
                }
                _handleDown() {
                  this._setState('Spanish')
                }
                _handleEnter() {
                  localStorage.setItem('Language', 'english')
                  location.reload();
                }
            },
            class Spanish extends this{
                $enter() {
                  this.tag('Spanish')._focus()
                }
                $exit() {
                  this.tag('Spanish')._unfocus()
                }
                _handleUp() {
                  this._setState('English')
                }
                _handleDown() {
                  this._setState('English')
                }
                _handleEnter() {
                  localStorage.setItem('Language', 'spanish')
                  location.reload();
                }
            },
        ]
    }
 
 }