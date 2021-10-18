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
 import { COLORS } from '../colors/Colors'
 import { CONFIG } from '../Config/Config.js'
 /**
  * Class for rendering items in Settings screen.
  */
 export default class SettingsItem extends Lightning.Component {
   static _template() {
     return {
       Item: {
         w: 1920 / 3 - 70,
         h: 90,
       },
     }
   }
 
   /**
    * Function to set contents for an item in settings screen.
    */
   set item(item) {
     this._item = item
     this.tag('Item').patch({
       Left: {
        //  x: 10,
         y: this.tag('Item').h / 2,
         mountY: 0.5,
         text: { text: item, fontSize: 25, textColor: COLORS.textColor, fontFace: CONFIG.language.font, },
       },
     })
   }
 
   /**
    * Set width of the item.
    */
   set width(width) {
     this.tag('Item').w = width
   }
 
   /**
    * Set height of the item.
    */
   set height(height) {
     this.tag('Item').h = height
   }
 
   _focus() {
     this.tag('Item').color = COLORS.hightlightColor
   }
 
   _unfocus() {
     this.tag('Item').color = 0x00000000
   }
 }
 