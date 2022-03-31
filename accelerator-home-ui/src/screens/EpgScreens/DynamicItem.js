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

import { Lightning, Storage, Router } from "@lightningjs/sdk"
import { CONFIG } from '../../Config/Config'
export default class DynamicItem extends Lightning.Component {

  static getFonts() {
    return [{ family: CONFIG.language.font, url: Utils.asset('fonts/' + CONFIG.language.fontSrc) }];
  }

  static _template() {
    return {
      // zIndex:1,
      TopLine: {
        y: 2,
        mountY: 0,
        h: 3,
        zIndex: 1,
        w: 232,
        rect: true,
        color: 0x00FFFFFF
      },
      BottomLine: {
        y: 79,
        zIndex: 1,
        mountY: 1,
        w: 232,
        h: 3,
        rect: true,
        color: 0x00FFFFFF
      },
      Item: {
        clipping: true,
        w: 235,
        h: 81,
        texture: lng.Tools.getRoundRect(235, 81, 0, 1.5, 0xffffffff, true, 0xff272727),

      },
      AiringOverlay: {
        clipping: true,
        w: 232,
        h: 79,
        x:1.5,y:1.5,
        rect:true,
        zIndex:4,
        alpha:0,
        color:CONFIG.theme.hex,
        Title: {
          x:10,y:45, mountY:0.5,
          text:{
            text:"Airs at", fontFace: CONFIG.language.font,fontStyle:'bold', fontSize: 21, textColor: 0xffFFFFFF
          }
        }

      },
    }
  }

  set show(show) {
    this.showDetails = show;
    this.tag('Item').patch({
      Name: {
        x: 9,
        y: 45,
        mountY: 0.5,
        text: { text: show.showName, fontFace: CONFIG.language.font, fontSize: 21, textColor: 0xffFFFFFF, wordWrap: false, wordWrapWidth: ((this.tag('BottomLine')._w) - 9), maxLines: 1, textOverflow: '...' }, // update the text
      },// since width is used here, width setter must be called first before show.
    })
    this.defaultWordWrapWidth = ((this.tag('BottomLine')._w) - 9);


  }

  textBold() {
    this.tag('Item.Name').text.fontStyle = "Bold"
  }

  textNormal() {
    this.tag('Item.Name').text.fontStyle = "normal"
  }


  set width(width) {
    this.tag('TopLine').patch({
      x: 1.5,
      w: width - 3
    })
    this.tag('BottomLine').patch({
      x: 1.5,
      w: width - 3
    })
    this.tag('Item').patch({
      w: width,
      texture: lng.Tools.getRoundRect(width, 81, 0, 1.5, 0x00ff00ff, true, 0xff272727)
    })
  }

  setWordWrapWidth(w) {
    // console.log(`set word wrap call to ${w}`);
    this.tag("Item.Name").text.wordWrapWidth = w - 9;
  }

  setXforTextLabel(x) {
    // console.log(`set x co-ord call to ${x}`);
    this.tag("Item.Name").x = x + 9;
    this.tag('AiringOverlay.Title').x = x + 9;
  }

  setDefaultForTextLabel() {
    this.tag('Item.Name').text.wordWrapWidth = this.defaultWordWrapWidth;
    this.tag('Item.Name').x = 9;
    this.tag('AiringOverlay.Title').x = 9;
  }

  _init() {
    this.scrollOnFocus = false;
    const textWidth = this.fireAncestors("$getTextWidth", this.showDetails.showName, `21px ${CONFIG.language.font}`);
    // console.log(`the text width of the current element = ${textWidth}`);
    const cellSize = this.tag('BottomLine')._w;
    // console.log(`${this.showDetails.showName} should have width of ${cellSize} and should have textwidth as ${textWidth}`);
    // if(textWidth>(cellSize-9)){// here 9 is the paddingLeft of the text inside the cell. 
    //     console.log(`${this.showDetails.showName} should be scrollable`);
    //     this.diff = textWidth - (cellSize-9);
    //     this.tag("Item").patch({
    //         Scrollable: {
    //         visible:false,
    //         x: 9, 
    //         y: 45,
    //         mountY: 0.5,
    //         text: { text: this.showDetails.showName, fontFace: CONFIG.language.font, fontSize: 21, textColor: 0xffFFFFFF },
    //     },
    //   });
    //   this.scrollOnFocus=true;
    // }
  }

  getW() {
    return this.tag('Item')._w;
  }

  getX() {
    return this.x;
  }

  cnv24to12(time){
    let sTime = time.split(":")
    let minutes = ""
    let convertedTime = ""
    if(parseInt(sTime[1]) === 0){
      minutes = "00"
    }else {
      minutes = String(sTime[1])
    }
    if(parseInt(sTime[0]) === 0){
      convertedTime = "12" + ":" + minutes + "a"
    } else if(parseInt(sTime[0]) > 0 && parseInt(sTime[0]) < 12){
      convertedTime = sTime[0] + ":" + minutes + "a"
    } else if(parseInt(sTime[0]) === 12){
      convertedTime = sTime[0] + ":" + minutes + "p"
    } else if(parseInt(sTime[0]) > 12 && parseInt(sTime[0]) < 24){
      convertedTime = String(parseInt(sTime[0])-12) + ":" + minutes + "p"
    }
    return convertedTime
  }

  showAiringTime(time){
    let airingTime = this.cnv24to12(time)
    this.tag('AiringOverlay.Title').text.text = "Airs at " + airingTime
    this.tag('AiringOverlay').w = this.getW() - 3
    this.airingAnimation.start()
  }

  goToChannel() {
    var date = new Date();
    if (Storage.get('ipAddress') && this.index === 0) {
      Router.navigate('player',{
        isChannel: true,
        channelName: this.channelName,
        showName: this.showDetails.showName,
        description: this.showDetails.description,
        channelIndex:this.fireAncestors("$getChannelIndex")
      })
    } else if (this.x < 11280) {
      let hrs = parseInt(date.toLocaleString('en-US', { hour: 'numeric', hour12: false }))
      let mins = parseInt(date.toLocaleString('en-US', { minute: 'numeric', hour12: false }))
      let startHrs = parseInt(this.startTime.split(":")[0])
      let startMins = parseInt(this.startTime.split(":")[1])
      if ((startHrs < hrs) || (startHrs === hrs && startMins <= mins)) {
        if (Storage.get('ipAddress')) {
          Router.navigate('player',{
            isChannel: true,
            channelName: this.channelName,
            showName: this.showDetails.showName,
            description: this.showDetails.description,
            channelIndex:this.fireAncestors("$getChannelIndex")
          })
        } else {
          console.log(`ip address not available to play the video`);
        }
      } else {
        this.showAiringTime(this.startTime)
      }
    }else {
      this.showAiringTime(this.startTime)
    }
  }

  _focus() {
    this.fireAncestors("$updateShowDetails", this.showDetails.showName, this.showDetails.description)
    this.fireAncestors("$updateStartAndEndTimes", this.startTime, this.endTime);
    this.fireAncestors("$updateDayLabel", this.x);
    // this.tag('Item.Name').text.fontStyle="Bold"
    this.tag('TopLine').color = CONFIG.theme.hex
    this.tag('BottomLine').color = CONFIG.theme.hex
    this.tag('Item.Name').text.textColor = CONFIG.theme.hex
    this.airingAnimation = this.tag('AiringOverlay').animation({
      duration:4,
      repeat:0,
      stopMethod: 'immediate',
      actions: [
        {p: 'alpha', v: {0: 0,0.125:1, 0.875: 1, 1:0}}
      ]
    })
    // if(this.scrollOnFocus){
    //   this.tag("Name").visible = false;
    //   this.tag("Scrollable").visible = true;
    //   this._scrollAnimation = this.tag('Scrollable').animation({
    //     delay:2,
    //     repeatDelay:2,
    //     stopDelay:2,
    //     duration: 3,
    //     repeat: -1,
    //     stopMethod: 'fade',
    //     actions:[
    //         {p: 'x', v: {0: 9 , 1: this.diff*-1}},
    //     ]
    // });
    // this._scrollAnimation.start();

    // }


  }

  // static _template(){
  //   return [
  //     class RowFocus{
  //       $enter(){

  //       }
  //       $exit(){

  //       }
  //     }
  //   ]
  // }

  _unfocus() {
    // this.tag('Item.Name').text.fontStyle="normal"
    this.tag('TopLine').color = 0x00FFFFFF
    this.tag('BottomLine').color = 0x00FFFFFF
    this.tag('Item.Name').text.textColor = 0xFFFFFFFF
    try{
      this.airingAnimation.stop()
    } catch{
      console.log('error in stopping animation')
    }
    // if(this.scrollOnFocus){
    //   this.tag("Name").visible = true;
    //   this.tag("Scrollable").visible = false;
    //   this._scrollAnimation.stop();
    // }
  }
}
