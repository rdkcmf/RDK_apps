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
import DynamicItem from './DynamicItem.js'


export default class Shows extends Lightning.Component {
    static _template() {
        return {}
    }

    set item(item) {
        var options = [];
        let sum = 0;
        item.shows.map((show, i) => {
            let tmp = ((show.duration)/(1000*60*60)) * 2 * 235;
            options.push({ type: DynamicItem,index:i, x: sum, width:tmp  , show: show, channelName: item.channelName, startTime: show.startTime, endTime: show.endTime }) // width should be set before show.
            sum += tmp;
        })
        this.children = options;
        // console.log(`shows were set and the length = ${this.children.length} and with final sum being ${sum}`);
    }


    set index(index) {
        this._rowIndex = index;
        this._columnIndex = 0;
    }

    $getChannelIndex(){
        return this._rowIndex
    }

    _focus() {
        
        // console.log(`show on focus`);
        this.children.map((el,index)=>{
            el.textBold()
        })
        this.children[this._columnIndex]._focus();
    }

    _handleEnter(){
        this.children[this._columnIndex].goToChannel()
    }

    _handleLeft() {
        if (this._columnIndex > 0) { 
            this.children[this._columnIndex]._unfocus();
            this._columnIndex--;
            if(this.fireAncestors( '$isFocusable' , this.children[this._columnIndex].getX()+this.children[this._columnIndex].getW() )){
                // console.log(`element is focusable`);
                this.children[this._columnIndex]._focus();
                this.updateCurrentCellX();

                let w = this.children[this._columnIndex].getW();
                let x = this.children[this._columnIndex].getX();
                let leftPointer = this.fireAncestors("$getLeftPointer");
                if (x < leftPointer) {
                    this.fireAncestors("$scrollToLeft", leftPointer - x)
                    this.fireAncestors("$updateTheLeftElements");
                }
            }
            else{
                this._columnIndex++;
                this.children[this._columnIndex]._focus();
                // console.log(`this element is not focusable`);
                this.fireAncestors('$focusSidePanel')
            }

            
            
        }else {
            this.fireAncestors('$focusSidePanel') //when focus is on first item, left arrow press should focus on side panel
        }
    }
    _handleRight() {
        if (this._columnIndex < (this.children.length - 1)) {
            this.children[this._columnIndex]._unfocus();
            this._columnIndex++;
            this.children[this._columnIndex]._focus();
            this.updateCurrentCellX();

            let w = this.children[this._columnIndex].getW();
            let x = this.children[this._columnIndex].getX();

            let rightPointer = this.fireAncestors("$getRightPointer");
            if ((x + w) > rightPointer) {
                if (w > (235 * 6)) {
                    this.fireAncestors("$scrollToRight", (x + (235 * 6)) - rightPointer);
                }
                else {
                    // console.log(`the right pointer was at = ${rightPointer}`);
                    // console.log(`width of the cell = ${w}, its x coords are ${x} and scroll is ${(x + w) - rightPointer}`);

                    this.fireAncestors("$scrollToRight", (x + w) - rightPointer);
                }
                this.fireAncestors("$updateTheLeftElements");
            }
            
            
        }
    }

    binarySearch(x) {
        let left = 0, right = this.children.length - 1;
        this.children[this._columnIndex]._unfocus();
        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            if (this.children[mid].getX() === x) {
                this._columnIndex = mid;
                // console.log(`current mid = ${this._columnIndex }`);
                this.children[this._columnIndex]._focus();
                return this._columnIndex;
            }
            else if (this.children[mid].getX() > x) {
                right = mid - 1;
            }
            else {
                left = mid + 1;
            }
        }
        // console.log(`the current left -1  ${left-1}`)
        this._columnIndex = Math.max(0, left - 1)
        this.children[this._columnIndex]._focus();


        return this._columnIndex;
    }

    updateCurrentCellX() {
        this.fireAncestors("$updateCurrentCellX", this.children[this._columnIndex].getX());
    }

    passCurrentCellX() {
        return this.currentCellX;
    }

    _unfocus() {
        this.children.map((el,index)=>{
            el.textNormal();//0(n)
        })
        this.children[this._columnIndex]._unfocus();
    }
    _init() {
        this.currentCellX = 0;
    }

    _getFocused() {
        return this.children.element
    }

}
