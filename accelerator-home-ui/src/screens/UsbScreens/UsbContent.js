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
import { Lightning, Router, Utils } from '@lightningjs/sdk'
import AppListItem from '../../items/AppListItem'
import NetworkApi from '../../api/NetworkApi'
import AAMPVideoPlayer from '../../player/AAMPVideoPlayer'

export default class UsbContent extends Lightning.Component {
    static _template() {
        return {
            Background: {
                w: 1920,
                h: 1080,
                src: Utils.asset('images/tvShows/background_new.jpg'),
            },
            UsbHomeTopPanel: {
                x: 0,
                y: 0,
                w: 1920,
                h: 171,
                Back: {
                    x: 81,
                    y: 100,
                    mountY: 0.5,
                    src: Utils.asset('/images/settings/Back_icon.png'),
                    w: 70,
                    h: 70,
                },
                IconTitle: {
                    x: 200,
                    y: 78,
                    text: { text: 'USB Content Screen', fontSize: 40, fontFace: 'MS-Regular', },
                },
                IpAddress: {
                    x: 1835,
                    y: 125,
                    mount: 1,
                    text: {
                        fontFace: 'MS-Regular',
                        text: 'IP:N/A',
                        textColor: 0xffffffff,
                        fontSize: 32,
                        w: 360,
                        h: 40,
                    },
                },
                Border: {
                    x: 81,
                    y: 171,
                    mountY: 0.5,
                    RoundRectangle: {
                        zIndex: 2,
                        texture: lng.Tools.getRoundRect(1761, 0, 0, 3, 0xffffffff, true, 0xffffffff),
                    },
                    alpha: 0.4
                }
            },
            ContentTitle:
            {
                x: 80,
                y: 220,
                text: {
                    fontFace: 'MS-Regular',
                    textColor: 0xffffffff,
                    fontSize: 40,
                    w: 360,
                    h: 60,
                },
            },
            
            ItemList: {
                x: 80,
                y: 320,
                flex: { direction: 'row', paddingLeft: 20, wrap: false },
                type: Lightning.components.ListComponent,
                w: 1761,
                h: 300,
                itemSize: 185,
                roll: true,
                rollMax: 815,
                horizontal: true,
                itemScrollOffset: -5,
                clipping: true,
            },
            Preview: {
                x: 500,
                y: 580,
                w: 750,
                h: 450,
            },
            Message:
            {
                x: 500,
                y: 800,
                text: {
                    fontFace: 'MS-Regular',
                    textColor: 0xffffdf00,
                    fontSize: 38,
                    fontStyle: 'italic bold',
                    textColor: 0xffffdf00,
                    shadow: true,
                    shadowColor: 0xffff00ff,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowBlur: 2,
                    w: 900,
                    h: 100,
                },
            },

            Player: {
                type: AAMPVideoPlayer,
            },
        }
    }
    set contentTitle(title) {
        this.tag('ContentTitle').patch({
            text: { text: title }
        })
    }
    set message(message) {
        this.tag('Message').patch({
            text: { text: message }
        })
    }
    

    set itemList(items) {
        this.tag('ItemList').items = items.map(info => {
            return {
                w: 175,
                h: 175,
                type: AppListItem,
                data: info,
                focus: 1.2,
                unfocus: 1,
                x_text: 106,
                y_text: 215,
            }
        })
        this.tag('ItemList').start()
    }

    _init() {
        this.videoPlayback=false;
        var networkApi = new NetworkApi()
        networkApi.getIP().then(ip => {
            this.tag('IpAddress').text.text = 'IP:' + ip
        })
    }

    
    previewImageOnFocus(image) {
        if (image.startsWith('/images')) {
          this.tag('Preview').patch({
            src: Utils.asset(image),
          });
        } else {
          this.tag('Preview').patch({ src: image });
        }
      }

  goToPlayer(item) {
       this._setState('Player')
       this.play(item)
  }


   /**
   * Function to hide the home UI.
   */
    hide() {
        this.tag('Background').patch({ alpha: 0 });
        this.tag('UsbHomeTopPanel').patch({ alpha: 0 });
        this.tag('ContentTitle').patch({ alpha: 0 });
        this.tag('ItemList').patch({ alpha: 0 });
        this.tag('Preview').patch({ alpha: 0 });
      }
    
      /**
         * Function to show home UI.
       */
       show() {
        console.log('show -from content')
        this.tag('Background').patch({ alpha: 1 });
        this.tag('UsbHomeTopPanel').patch({ alpha: 1 });
        this.tag('ContentTitle').patch({ alpha: 1 });
        this.tag('ItemList').patch({ alpha: 1 });
        this.tag('Preview').patch({ alpha: 1 });

      }
       /**
   * Function to start video playback.
   */
  play(item) {
    this.player = this.tag('Player')
    try {
      this.player.load({
        title: item.data.displayName,
        subtitle: 'm3u8',
        url:item.data.uri,
        drmConfig: null,
      })
      this.hide()
      this._setState('Playing')
      this.player.setVideoRect(0, 0, 1920, 1080)
    } catch (error) {
      this._setState('ItemList')
      console.error('Playback Failed ' + error)
    }
  }

    static _states() {
        return [
            class ItemList extends this {
                _getFocused() {
                    if (this.tag('ItemList').length) {
                        this.previewImageOnFocus(this.tag('ItemList').element.data.url)
                        return this.tag('ItemList').element
                    }
                }
                _handleRight() {
                    if (this.tag('ItemList').length - 1 != this.tag('ItemList').index) {
                        this.tag('ItemList').setNext()
                        return this.tag('ItemList').element
                    }
                }
                _handleLeft() {
                    if (0 != this.tag('ItemList').index) {
                        this.tag('ItemList').setPrevious()
                        return this.tag('ItemList').element
                    }
                }
                _handleDown() {
                }
                _handleUp() {
                    this.videoPlayback=false;
                    this._setState('Back')
                }
                _handleEnter() {
                    let item= this.tag('ItemList').element
                    if (this.videoPlayback == true) { this.goToPlayer(item) }
                }
                $exit() {
                    this.videoPlayback = false;
                }
            },

            class Back extends this{
                $enter() {
                    this.tag('Back').patch({
                        src: Utils.asset('/images/settings/back-arrow-small.png'),
                    })
                }
                _handleDown() {
                    this.tag('Back').patch({
                        src: Utils.asset('/images/settings/Back_icon.png'),

                    })
                    this._setState('ItemList')
                }

                _handleKey(key) {
                    console.log(key.keyCode)
                    if (key.keyCode == 13) {
                        this.tag('Back').patch({
                            src: Utils.asset('/images/settings/Back_icon.png'),
                        })
                        this.fireAncestors('$goToSideMenubar', 2)
                        Router.navigate('settings/SettingsScreen/2', false)
                    }
                }
            },
            class Playing extends this {
                _getFocused() {
                  return this.tag('Player')
                }
        
                stopPlayer() {
                  this._setState('ItemList');
                  if(this.player !=null)
                     this.player.stop()
                  this.show();
                }
        
                _handleKey(key) {
                  if (key.keyCode == 27 || key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36 || key.keyCode == 158) {
                    this.stopPlayer()
                  } else if (key.keyCode == 227 || key.keyCode == 179) {
                    this.stopPlayer()
                    return false;
                  }
                }
              },
        ]
    }
}
