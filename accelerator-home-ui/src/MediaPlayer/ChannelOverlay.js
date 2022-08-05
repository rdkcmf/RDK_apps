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
import { Lightning, Router } from '@lightningjs/sdk'
import DTVApi from '../api/DTVApi'
import ChannelItem from './ChannelItem'

export default class ChannelOverlay extends Lightning.Component {
  /**
   * Function to create components for the player controls.
   */
  static _template() {
    return {
      Wrapper: {
        x:-235,
        y:90,
        clipping: true,
        w: 232,
        h: 900,
        Channels: {
          y: 5,
          w: 232,
          h: 891,
          type: Lightning.components.ListComponent,
          // clipping:true,
          itemSize: 81,
          roll: true,
          horizontal: false,
          invertDirection: true,
          itemScrollOffset: -10,
        }
      }
    }
  }

  _init() {
    this.activeChannelIdx = 0; //this must be initialised in init
  }
  _firstEnable(){
    this.dtvApi = new DTVApi();
    this.options = [];
    this.dtvApi.serviceList().then(channels => {
      const [amazon,netflix,youtube, ...others] = channels;//to remove apps from the channel overlay
      this.options = others;
      this.tag('Channels').items = this.options.map((item, index) => {
        return {
          type: ChannelItem,
          index: index,
          item: item,
          ref: "Channel"+index,
        }
      })
    }).catch(err => {
      console.log("Failed to fetch channels: ",JSON.stringify(err))
    })
    this._overlayAnimation = this.tag("Wrapper").animation({
      delay: 0.3,
      duration: 0.3,
      stopMethod: "reverse", //so that .stop will play the transition towards left
      actions: [{ p: "x", v: { 0: -235, 1: 0 } }],
    });
  }
  _focus() {
    this.$focusChannel(this.activeChannelIdx)
    this._overlayAnimation.start();
  }

  _unfocus() {
    this._overlayAnimation.stop();
  }

  $focusChannel(index) {
    this.activeChannelIdx = index
    this.tag('Channels').setIndex(this.activeChannelIdx)
  }
  _getFocused() {
    return this.tag('Channels').element // add logic to focus on current channel

  }

  _handleDown() {
    this.tag('Channels').setNext()
  }

  _handleUp() {
    this.tag('Channels').setPrevious()
  }

  _handleBack() {
    Router.focusPage();
  }

  _handleEnter() {
    let focusedChannelIdx = this.tag("Channels").index;
    if (focusedChannelIdx !== this.activeChannelIdx) {
      this.dtvApi.exitChannel().then( res => {
        console.log("Current channel exit successful, launching new channel: ", JSON.stringify(res));
        this.dtvApi
        .launchChannel(this.options[focusedChannelIdx].dvburi)
        .then((res) => {
          console.log("Change Channel successfull: ", JSON.stringify(res));
          this.activeChannelIdx = focusedChannelIdx;
        })
        .catch((err) => {
          console.log("Failed to launch new channel",JSON.stringify(err));
        });
      }).catch(err => {
        console.log("Failed to exit current playing channel: ", JSON.stringify(err));
      })
      
    }
  }
}