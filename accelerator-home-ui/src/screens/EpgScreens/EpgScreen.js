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
import Channel from './Channel'
import info from '../../../static/data/EpgInfo.json'
import Shows from './Shows'
import { CONFIG } from '../../Config/Config'
import ChannelsList from './ChannelsList'
import ShowsList from './ShowsList'
let customChannels
let url = location.href.split(location.hash)[0].split('index.html')[0]
let notification_url = url + "static/moreChannels/ChannelData.json";
if (location.host.includes('127.0.0.1')) {
  notification_url = url + "lxresui/static/moreChannels/ChannelData.json";
}
let customChannelUrl = notification_url
fetch(customChannelUrl)
  .then(res => res.json())
  .then((out) => {
    customChannels = out.data
  })
  .catch(err => { throw err });

export default class EpgScreen extends Lightning.Component {

  _onChanged() {
    this.widgets.menu.updateTopPanelText(Language.translate('Guide'));
  }
  static _template() {
    return {
      EPG: {
        x: 100,
        y: 0,
        w: 1920,
        h: 1080,
        Background: {
          rect: true,
          color: 0xff000000,
          w: 1920,
          h: 1080,
        },
        ShowName: {
          x: 100,
          y: 280,
          text: { text: `SHOW`, fontSize: 25, fontFace: CONFIG.language.font, textColor: 0xffFFFFFF, fontStyle: "Bold" },
        },
        ShowDescription: {
          x: 100,
          y: 310,
          text: {
            text: `Lorem Ipsum is sss dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`, fontSize: 25, textColor: 0xffFFFFFF,
            fontFace: CONFIG.language.font, wordWrap: true, wordWrapWidth: 1124, maxLines: 2, textOverflow: '...'
          },
        },
        StartAndEndTimes: {
          x: 1224 + 120,
          y: 280,
          text: { text: `start:end`, fontFace: CONFIG.language.font, fontSize: 25, textColor: 0xffFFFFFF }
        },
        ChannelName: {
          x: 1224 + 120,
          y: 310,
          text: { text: `Channel`, fontSize: 25, fontFace: CONFIG.language.font, textColor: 0xffFFFFFF, wordWrap: true, wordWrapWidth: 400, maxLines: 2, textOverflow: '...' }
        },
        GPEContents: {
          x: 100,
          y: 340,
          h: 1080,
          w: (235 * 7) - (1.5 * 2),
          clipping: true,
          DayLabel: {
            y: 40,
            mountY: 0,
            text: { text: `Today`, fontFace: CONFIG.language.font, fontSize: 25, textColor: 0xffFFFFFF },
          },
          VerticalWrapper: {
            y: 90,
            x: -1.5,
            w: 235,
            h: 648,
            clipping: true,
            List: {
              type: ChannelsList,
              itemSize: 81,
              // w: (235*48*3),
              // h: (235*48*3)
            },
          },

          Right: {
            x: 235,
            w: ((235) * 6) - 5,
            h: 750,//approximation
            clipping: true,
            Scroller: {
              x: -3,
              w: (48 * 3 * 235) + 235,
              TimeLabels: {

              },
              TimeBar: {
                y: 81, // this should be the ShowLists "y" value - 9
                rect: true,
                h: 9,
                w: 235,
                color: 0xff404040,
              },
              DownTriangle: {
                y: 81,// this should be the same as TimeBar's "y" Value
                x: 235,
                mountX: 0.5,
                mountY: 0.5,
                text: { text: `${String.fromCodePoint(9662)}`, fontSize: 25, textColor: 0xffFFFFFF },
              },
              VerticalWrapper: {
                y: 90, // this should be the same as List's "y" value
                h: 81 * 8,
                w: (235 * 48 * 3),// this no depends on the number of shows
                clipping: true,
                ShowList: {
                  type: ShowsList,
                  itemSize: 81,
                  // w: (235*48*3),
                  // h: (235*48*3)
                }
              },

            }
          }
        },
      }
    }
  }

  pageTransition() {
    return 'up'
  }

  $getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = this._getTextWidthCanvas || (this._getTextWidthCanvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  $updateCurrentCellX(p) {
    this.currentCellX = p;
  }

  setTimeLabelsForDays(n) {

    let hrmn = ["12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30"];

    let arr = [];
    let sum = -1;

    for (let i = 0; i < n; i++) {
      sum++;

      hrmn.map((el, index) => {
        arr.push({
          y: 40,
          mountY: 0,
          x: (235 * ((24 * sum) + index)) + 1.5,
          text: { text: `${el}a`, fontFace: CONFIG.language.font, fontSize: 25, textColor: 0xffFFFFFF },
        })

      })

      sum++;

      hrmn.map((el, index) => {
        arr.push({
          x: 12,
          y: 40,
          mountY: 0,
          x: (235 * ((24 * sum) + index)) + 1.5,
          text: { text: `${el}p`, fontFace: CONFIG.language.font, fontSize: 25, textColor: 0xffFFFFFF },
        })
      })


    }
    return arr;

  }

  $setLeftEdgeElements(rows) {
    this.leftMost8 = rows;
  }


  _firstEnable() {
    this.leftFloor = 0;
    this.leftMost8 = [];
    this.verticalScrollCount = 0;
    this.focusedRowTracker = 0;
    this.verticalBuffer = 12;//this decides how many channels to be requested from the api/json.  
    this.currentCellX = 0;
    this.leftPointer = 0;
    this.rightPointer = 235 * 6;
    // console.log(`right pointer was set to ${this.rightPointer}`)
    this._getTextWidthCanvas = null
    //info.data contains js objects with ChannelName and Shows as inner properties.
    //shows is an array of js objects again and its properties include showName,description,duration,startTime.   
    var options = info.data
    if (typeof customChannels == "object") {
      options = [...customChannels, ...options]
    }
    options = options.slice(0, this.verticalBuffer);
    this._setState("Options")
    this.tag('GPEContents.List').h = 8 * 81
    this.tag('List').items = options.map((item, index) => {
      return {
        ref: 'Option' + index,
        w: 235,
        h: 81,
        type: Channel,
        channelName: item.channelName,
        item: item,
        index: index
      }
    })
    this.tag("ChannelName").text = options[0].channelName;
    this.tag('VerticalWrapper.ShowList').h = 8 * 81
    this.tag('ShowList').items = options.map((item, index) => {
      return {
        ref: 'Option' + index,
        w: (235 * 48 * 3),
        h: 81,
        type: Shows,
        item: item,
        index: index,
      }
    })
    this.tag('TimeLabels').children = this.setTimeLabelsForDays(3);

  }


  _handleBack() {
    Router.navigate('menu')
  }
  $focusSidePanel() {
    Router.focusWidget('Menu')
  }
  $updateDayLabel(x) {
    let quotient = Math.floor((x / 235) / 48);
    if (quotient === 0) {
      this.tag('DayLabel').text = 'Today'
    }
    if (quotient === 1) {
      this.tag('DayLabel').text = 'Tomorrow'
    }
    else if (quotient === 2) {
      this.tag('DayLabel').text = 'Day After Tomorrow'
    }
  }

  $updateShowDetails(name, description) {
    this.tag("ShowDescription").text = description;
    this.tag("ShowName").text = name;
  }

  $updateStartAndEndTimes(a1, a2) {
    let arr1 = a1.split(":")
    let arr2 = a2.split(":")
    let temp = 0;

    if (arr1[1].length < 2) { arr1[1] = "0" + arr1[1]; }
    if (arr2[1].length < 2) { arr2[1] = "0" + arr2[1]; }
    arr1[0] = parseInt(arr1[0]);
    arr2[0] = parseInt(arr2[0]);
    if (arr1[0] == 0) { arr1[0] = 12 }
    if (arr2[0] == 0) { arr2[0] = 12 }
    if (arr1[0] > 12) { arr1[0] = arr1[0] - 12; }
    if (arr2[0] > 12) { arr2[0] = (arr2[0] - 12); arr2[1] += "p" }
    else { arr2[1] += "a"; }

    this.tag("StartAndEndTimes").text = `${arr1.join(":")} - ${arr2.join(":")}`;
  }

  $scrollToLeft(v) {
    //move the page to right
    // console.log(`scrolling to left ${v}`);
    let temp = this.tag('Scroller').x;
    if (-1 * (temp + v) >= this.leftFloor) {
      // console.log(`scrollable to left since ${(temp+v)*-1} >= ${this.leftFloor}`);
      this.tag("Scroller").x = temp + v;
      this.leftPointer = this.leftPointer - v;
      this.rightPointer = this.rightPointer - v;
    } else {
      v = this.leftPointer - this.leftFloor;
      this.tag("Scroller").x = temp + v;
      this.leftPointer = this.leftPointer - v;
      this.rightPointer = this.rightPointer - v;
      // console.log(`can't scroll any further`);
      // console.log(`scroller ${(temp+v)*-1} >= ${this.leftFloor} can't scroll left beyond this point`);
    }


    // console.log(`updating rightpointer to ${this.rightPointer}`);
  }

  $isFocusable(rightEdgeofCell) {
    // console.log(`right Edge = ${rightEdgeofCell} , left Floor = ${this.leftFloor}`);
    if (rightEdgeofCell <= this.leftFloor) {
      // console.log(`this element is not focusable as its right edge = ${rightEdgeofCell} and the left border = ${this.leftFloor}`)
      return false;
    }
    // console.log(`element is focusable as its rightedge = ${rightEdgeofCell} and left border = ${this.leftFloor} and left pointer = ${this.leftPointer}`);
    return true;
  }

  $scrollToRight(v) {
    //move the page to left
    // console.log(`scrolling to right ${v}`);
    let temp = this.tag('Scroller').x;
    this.tag("Scroller").x = temp - v;
    this.leftPointer = this.leftPointer + v;
    this.rightPointer = this.rightPointer + v;
    // console.log(`updating rightpointer to ${this.rightPointer}`);
  }

  $getLeftPointer() {
    return this.leftPointer;
  }

  $getRightPointer() {
    return this.rightPointer;
  }

  appendMoreData() {
    // you get the data for both the list and showlist and append the lists over here.
    // the below code is just a dummy one and may need to be replaced with the DTV plugin when required.
    let options = info.data;
    let len = this.tag('List').children.length;
    options = options.slice(len, len + this.verticalBuffer);

    let temp = options.map((item, index) => {
      return {
        ref: 'Option' + len + index,
        w: 1920 - 235,
        h: 81,
        type: Channel,
        channelName: item.channelName,
        item: item,
        index: len + index
      }
    })


    this.tag('List').append(temp);
    this.tag('ShowList').append(
      options.map((item, index) => {
        return {
          ref: 'Option' + len + index,
          w: (235 * 48 * 3),
          h: 81,
          type: Shows,
          item: item,
          index: len + index,
        }
      }));

  }

  findTheNextProbableCell(list, showIndex, arrIndex) {
    list.children[showIndex].setDefaultForTextLabel();
    for (let i = showIndex; i < list.children.length; i++) {
      // console.log(`next probable cell`);
      let cellX = list.children[i].getX();
      let cellW = list.children[i].getW();
      if (this.leftPointer >= cellX && this.leftPointer < (cellW + cellX)) {
        this.leftMost8[arrIndex] = i;
        list.children[i].setXforTextLabel(this.leftPointer - cellX);
        list.children[i].setWordWrapWidth((cellW + cellX) - this.leftPointer);
        return;
      }
    }
  }

  findThePreviousProbableCell(list, showIndex, arrIndex) {
    list.children[showIndex].setDefaultForTextLabel();
    for (let i = showIndex; i >= 0; i--) {
      // console.log(`prev probable cell`);
      let cellX = list.children[i].getX();
      let cellW = list.children[i].getW();
      if (this.leftPointer >= cellX && this.leftPointer < (cellW + cellX)) {
        this.leftMost8[arrIndex] = i;
        list.children[i].setXforTextLabel(this.leftPointer - cellX);
        list.children[i].setWordWrapWidth((cellW + cellX) - this.leftPointer);
        return;
      }
    }
  }


  $updateTheLeftElements() {
    let showsListIndex = this.verticalScrollCount;
    var self = this;
    this.leftPointer;
    this.leftMost8.map((showIndex, arrIndex) => {
      let list = this.tag('ShowList').children[showsListIndex + arrIndex];
      let currentCellX = list.children[showIndex].getX();
      let currentCellW = list.children[showIndex].getW();
      if (this.leftPointer >= (currentCellX + currentCellW)) {
        // search for the cell which satisfies the following else if condition
        this.findTheNextProbableCell(list, showIndex, arrIndex);
      }
      else if (this.leftPointer < currentCellX) {
        // find the previous cell which matches the x coord.
        this.findThePreviousProbableCell(list, showIndex, arrIndex);
      }
      else if (this.leftPointer >= currentCellX && this.leftPointer < (currentCellW + currentCellX)) {
        this.findThePreviousProbableCell(list, showIndex, arrIndex);
      } else {
        console.warn(`Something's wrong : this shouldn't have occured; something is wrong with the cell ${arrIndex};
       the current leftpointer = ${this.leftPointer}
       `);
      }
    })
  }

  $updateLeftMostElementsOnFocus() {
    let showsListIndex = this.verticalScrollCount;
    var self = this;
    this.leftPointer;
    this.leftMost8.map((showIndex, arrIndex) => {
      let list = this.tag('ShowList').children[showsListIndex + arrIndex];
      let currentCellX = list.children[showIndex].getX();
      let currentCellW = list.children[showIndex].getW();
      list.children[showIndex].setDefaultForTextLabel();
      let i = list.binarySearch(this.leftFloor);
      let cellX = list.children[i].getX();
      let cellW = list.children[i].getW();
      this.leftMost8[arrIndex] = i;
      list.children[i]._unfocus();
      list.children[i].setXforTextLabel(this.leftPointer - cellX);
      list.children[i].setWordWrapWidth((cellW + cellX) - this.leftPointer);
    })
  }

  static _states() {
    return [
      class Options extends this{
        resetHighLight() {
          this.elementInHighLight.textNormal();
          this.elementInHighLight = this.tag('List').element;
          this.elementInHighLight.textBold();
        }
        _getFocused() {
          this.elementInHighLight = this.tag('List').element;
          return this.tag('ShowList').element
        }
        _handleDown() {
          let get8thElement = false;
          if (this.tag('List').index === this.tag('List').children.length - 1) {
            this.tag('ShowList').unfocusIndexedElement();
            this.appendMoreData();
            this.tag('ShowList').focusIndexedElement();
          }
          if (this.focusedRowTracker === 7 && (this.tag('List').index < this.tag('List').children.length - 1)) {
            this.verticalScrollCount++;
            this.scroll(-81);
            get8thElement = true;
          }
          else if (this.focusedRowTracker < 7) {
            this.focusedRowTracker++;
          }
          this.tag('List').setNext()
          this.tag('ShowList').setNext()
          let focusedElementIndex = this.tag('ShowList').element.binarySearch(Math.max(this.currentCellX, this.leftFloor));
          this.tag('ChannelName').text = this.tag('List').element.channelName;

          this.resetHighLight();

          if (get8thElement) {
            // console.log(`update the 8th element`);
            this.leftMost8.shift();
            this.leftMost8.push(focusedElementIndex);
            let list = this.tag('ShowList').children[this.verticalScrollCount + 7];
            this.findThePreviousProbableCell(list, focusedElementIndex, 7);
            // console.log(`the current leftMost elements are ${this.leftMost8}`);
          }

        }
        _handleUp() {
          let get1stElement = false;
          // console.log(`focused tracker before update = ${this.focusedRowTracker}`);
          if (this.focusedRowTracker === 0 && (this.tag('List').index > 0)) {
            this.verticalScrollCount--;
            this.scroll(81);
            get1stElement = true;
          }
          else if (this.focusedRowTracker > 0) {
            this.focusedRowTracker--;
          }

          this.tag('List').setPrevious()
          this.tag('ShowList').setPrevious()
          let focusedElementIndex = this.tag('ShowList').element.binarySearch(Math.max(this.currentCellX, this.leftFloor));
          this.tag("ChannelName").text = this.tag("List").element.channelName;

          this.resetHighLight();

          if (get1stElement) {
            this.leftMost8.unshift(focusedElementIndex);
            this.leftMost8.pop();
            let list = this.tag('ShowList').children[this.verticalScrollCount + 0];
            this.findThePreviousProbableCell(list, focusedElementIndex, 0);
            // console.log(`update the first element ; the current left elements are ${this.leftMost8}`);
          }

        }
        scroll(v) {
          let y = this.tag('List')._y;
          this.tag('List').y += v;
          this.tag('ShowList').y += v;
        }


        _focus() {
          this.leftPointer = 0;
          this.rightPointer = 235 * 6;

          this.interval = setInterval(() => {
            const d = new Date();
            var width = 0;
            width = 235 * 2 * d.getHours();
            width += (d.getMinutes() / 30) * 235;
            this.tag("TimeBar").w = width;
            this.tag('DownTriangle').x = width;
          }, 1000);


          let date = new Date();
          let h = date.getHours();
          let m = date.getMinutes();
          let v = h * 2 * 235;
          m = Math.floor(m / 30);
          v += m * 235;
          this.tag('Scroller').x = -3;
          this.$scrollToRight(v);
          this.tag('ShowList').element.binarySearch(v);
          this.leftFloor = v;
          this.$updateLeftMostElementsOnFocus();
          this.$updateCurrentCellX(this.leftFloor);
          // console.log(`Left Floor = ${this.leftFloor} , left Pointer = ${this.leftPointer} `);
        }

        _unfocus() {
          if (this.interval) {
            clearInterval(this.interval);
          }
        }

      }
    ]
  }

}
