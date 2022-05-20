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

import { Lightning } from "@lightningjs/sdk";

export default class ShowsList extends Lightning.Component{
    static _template(){
        return {}
    }

    set items(v){
        
        // console.log(`
        
        // set items was called with the list = ${v.length}
        
        // `);
        let itemSize = this.itemSize;
        let temp = v.map((el,index)=>{
             return {y:index*itemSize,...el}
         })
         this.children = temp;
         this.elements = temp;
         this.element = this.children[0]

         this.fireAncestors('$setLeftEdgeElements' , [0,0,0,0,0,0,0,0] );
     }

     setNext(){
        //  console.log(`set next was called with index = ${this.index} and the length of the current list = ${this.children.length}`);
        if(this.index === this.children.length-1 ){
            return;
        }
        // console.log(`trying to access the item at ${this.index}; ${this.children[this.index]} and the element before that is ${this.children[this.index-1]} and the element after that is ${this.children[this.index+1]}`);
        // this.children[this.index]._unfocus();
        this.index++;
        this.children[this.index]._focus();
        this.element = this.children[this.index];
    }

    setPrevious(){
        if(this.index === 0 ){
            return;
        }
        // this.children[this.index]._unfocus();
        this.index--;
        this.children[this.index]._focus();
        this.element = this.children[this.index];
    }


    _init(){
        this.elements = [];
        this.index = 0;
        this.element = this.children[0];
        // this.children[0]._focus();
        // console.log(`initialized shows list`);
    }
    _firstActive(){

    }
    _focus(){
        // console.log(`row on focus = ${this.index}`);
    }

    unfocusIndexedElement(){
        // console.log(`unfocus`) ;
        this.children[this.index]._unfocus();
        // console.log(`focus`);
    }
    focusIndexedElement(){
        this.children[this.index]._focus();
    }
    _unfocus(){
        
    }

    append(items){
        let itemSize = this.itemSize;
        let sum = this.children.length * itemSize; 
        let temp = items.map((el,index)=>{
            let t =  itemSize ;
            return {y:sum+(index*t),...el}
        })
        
        this.children = [...this.children,...temp];
        }
}

