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

export default class ChannelsList extends Lightning.Component{
   
    static _template(){
        return {

        }
    }
    
    set items(v){
      
      let itemSize = this.itemSize;
    //   console.log(`itemsize = ${itemSize}`);
       let temp = v.map((el,index)=>{
            let t = itemSize;
            return {y:(index*t),...el}
        })
        this.children = temp;
        this.element = this.children[0]
    }

    append(items){
        let itemSize = this.itemSize;
        let sum = this.children.length * itemSize; 
        let temp = items.map((el,index)=>{
            let t =  itemSize;
            return {y:sum+(index*t),...el}
        })
        this.children = [...this.children,...temp];
        // this.patch({...temp})
        // console.log(`items should be be patched`);
    }

    setNext(){
        if(this.index === this.children.length-1 ){
            return;
        }
        // this.children[this.index]._unfocus();
        this.index++;
        // this.children[this.index]._focus();
        this.element = this.children[this.index];
    }

    setPrevious(){
        if(this.index === 0 ){
            return;
        }
        this.children[this.index]._unfocus();
        this.index--;
        // this.children[this.index]._focus();
        this.element = this.children[this.index];
    }

    _init(){
        this.index = 0;
        this.element = this.children[0];
        // this.children[0]._focus();
        // console.log(`channels List initialized`);
    }

}