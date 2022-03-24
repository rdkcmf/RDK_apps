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
import { CONFIG } from '../../Config/Config'


export default class Channel extends Lightning.Component {
  static _template(){
    return {
      Item: {
        w: 235 ,
        h: 81,
        texture: lng.Tools.getRoundRect(235, 81, 0, 1.5, 0x00ff00ff, true, 0xff1D1C1C),
      },
     
    }
  }

  set item(item) {
    this.shows = item.shows;
    this._item = item
    this.tag('Item').patch({
        Name: {
            x: 50, 
            y: 45,
            mountY: 0.5,
            text: { text: item.channelName, fontFace: CONFIG.language.font, fontSize: 21, textColor: 0xffFFFFFF,wordWrap:false,wordWrapWidth:235-50,maxLines:1,textOverflow:'...' }, // update the text
        },
    })
  }

  set index(index){
    this.tag('Item').patch({
      Index:{
        x: 10,// this sets the x coords for the index of the channel 
        y: 45,
        mountY: 0.5,
        text: { text: index+1, fontSize: 21, fontFace: CONFIG.language.font, textColor: 0xffFFFFFF,wordWrap:false,wordWrapWidth:50,maxLines:1,textOverflow:'...' }, // update the text
      },
    })
  }

 textBold(){
  this.tag('Item.Name').text.fontStyle = "Bold";
 }

 textNormal(){
  this.tag('Item.Name').text.fontStyle = "normal";
 }

 _focus(){

 }

 _unfocus(){
   
 }


 }
