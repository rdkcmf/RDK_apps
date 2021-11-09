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
import SettingsMainItem from '../../items/SettingsMainItem'
import { COLORS } from '../../colors/Colors'
import { CONFIG } from '../../Config/Config'
import HdmiOutputScreen from './HdmiOutputScreen'
import AppApi from '../../api/AppApi.js';
import AudioOutputScreen from './AudioOutputScreen'
import BluetoothApi from '../../api/BluetoothApi'
/**
 * Class for Audio screen.
 */

export default class AudioScreen extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      Wrapper: {
        AudioOutput: {
          alpha:0.3,
          y: 0,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Audio Output: HDMI',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        OutputMode: {
          y: 90,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Output Mode: Auto',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            },
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        DynamicRange: {
          alpha:0.3,
          y: 180,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Full Dynamic Range',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },

        AudioLanguage: {
          y: 270,
          alpha:0.3,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Audio Language: Auto',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },

        NavigationFeedback: {
          y: 360,
          alpha:0.3,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Navigation Feedback',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 66,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/ToggleOnWhite.png'),
          },
        },

        Bluetooth: {
          alpha:0.3,
          y: 450,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Bluetooth: None',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
      },
      OutputModeScreen: {
        type: HdmiOutputScreen,
        visible: false,
      },
      AudioOutputS:{
        type:AudioOutputScreen,
        visible:false
      }
    }
  }

  _activateBluetooth(){
    this._bt.activate().then(() => {
      //console.log(`\n\n\nTanjirou's Logs : bluetooth was activated \n\n\n`);
      this._bt.registerEvent('onDiscoveredDevice', (res) => {
        //console.log(`\n\n\nTanjirou's Bluetooth Logs: Dicovered a device and the result = ${res}\n\n\n`);
       // this.renderDeviceList()
      })
      this._bt.registerEvent('onPairingChange', status => {
        // console.log(`\n\n\nTanjirou's Bluetooth Logs: on pairing change request , status = ${status}`);
        this._bt.startScan()
        //this.renderDeviceList()
       // this._setState('Confirmation')
        //this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item

      })
      this._bt.registerEvent('onPairingRequest', notification => {
        if (notification.pinRequired === 'true' && notification.pinValue) {
          //console.log(`\n\n\nTanjirou's Bluetooth Logs: pairing request gave a notification as ${notification}`);
         // this.tag('PairingScreen').code = notification.pinValue
        } else {
          //console.log(`\n\n\nTanjirou's Bluetooth Logs: pairing request gave a notification as ${notification}`);
          //this.respondToPairingRequest(notification.deviceID, 'ACCEPTED')
        }
      })
      this._bt.registerEvent('onConnectionChange', notification => {
        //console.log(`\n\n\nTanjirou's Bluetooth Logs: Connection was changed with the notification ${notification}`);
        this._bt.startScan()
        //this.renderDeviceList()
        //  this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
        if (notification.connected) {
          // this.tag('Message').text = 'CONNECTION SUCCESS'
          //this.tag('Confirmation.Pairing').text = 'CONNECTION SUCCESS'
        } else {
          // this.tag('Message').text = 'CONNECTION FAILED'
          ////this.tag('Confirmation.Pairing').text = 'CONNECTION FAILED'
        }
        // setTimeout(() => {
        //   // this.tag('Message').text = ''
        //   //this._setState('Switch')
        //   //this.tag('Confirmation.Pairing').text = ''
        // }, 5000)
       // this._setState('Confirmation')
      })
      this._bt.registerEvent('onDiscoveryCompleted', (res) => {
        //console.log(`\n\n\nTanjirou's Bluetooth Logs: Dicovery was completed , result = ${res}`);
       // this.tag('Searching.Loader').visible = false
        //this.renderDeviceList()
      })
      this._bt.registerEvent('onDiscoveryStarted', (res) => {
        //console.log(`\n\n\nTanjirou's Bluetooth Logs: Discovery has started , result = ${res}`);
       // this.tag('Searching.Loader').visible = true
      })
      this._bt.registerEvent('onRequestFailed', notification => {
        //console.log(`\n\n\nTanjirou's Bluetooth Logs: the previous Request was failed with the notification ${notification}`);
        this._bt.startScan()
        //this.renderDeviceList()
        //this._setState('Confirmation')
        //  this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
        // this.tag('Confirmation').item.name = notification.params.name
        //this.tag('Confirmation.Pairing').text = notification.newStatus
        // setTimeout(() => {
        //   // this.tag('Message').text = ''
        //   //this._setState('Switch')
        //   //this.tag('Confirmation.Pairing').text = ''
        // }, 5000)
      })
      this._bt.getName().then(name => {
        //console.log(`Tanjirou's Bluetooth Logs: the device is discoverable as ${name}`);
        //this.tag('Name').text.text = `Now discoverable as "${name}"`
      })
    }).catch(err=>{
      console.log(`\n\n\nTanjirou's Logs: Error while enabling the bluetooth\n\n\n`);
    })
  }
  _init() {
    //this._bt = new BluetoothApi();
    this.appApi = new AppApi();
    //this._activateBluetooth();
    //fetch the current HdmiAudioOutputStereo set it
    // this.tag('HdmiAudioOutputStereo.Title').text.text = 'HdmiAudioOutputStereo: ' + currentHdmiAudioOutputStereo

  }

  $updateTheDefaultAudio(audio) {
    //console.log(audio)
    this.tag('OutputMode.Title').text.text = 'Output Mode: ' + audio
  }

  $updateSoundMode(soundMode) {
    this.tag('OutputMode.Title').text.text = 'Output Mode: ' + soundMode
  }

  _focus() {
    // this._setState('AudioOutput') 
    this._setState('OutputMode')
  }

  hide() {
    this.tag('Wrapper').visible = false
  }
  show() {
    this.tag('Wrapper').visible = true
  }

  static _states() {
    return [
      class AudioOutput extends this{
        $enter() {
          this.tag('AudioOutput')._focus()
        }
        $exit() {
          this.tag('AudioOutput')._unfocus()
        }
        _handleDown() {
          this._setState('OutputMode')
        }
        _handleEnter(){
          this._setState('AudioOutputScreenState');
        }

      },

      // BookMark 1
      class AudioOutputScreenState extends this{
        $enter() {
           this.hide()
           this.tag('AudioOutputS').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Audio / Output Mode')
        }
        $exit() {
          this.tag("AudioOutputS").visible = false;
           this.show()
          this.fireAncestors('$changeHomeText', 'Settings / Audio')
        }
        _getFocused() {
          return this.tag('AudioOutputS');
        }
        _handleBack() {
          this._setState('AudioOutput')
          
        }
        $updateAudioOutputText(value) {
          // this.tag('OutputMode.Title').text.text = 'Output Mode: ' + value
        }
      }

      ,
      class OutputMode extends this{
        $enter() {
          this.tag('OutputMode')._focus()
        }
        $exit() {
          this.tag('OutputMode')._unfocus()
        }
        _handleUp() {
          // this._setState('AudioOutput')
        }
        _handleDown() {
          // this._setState('DynamicRange');
        }
        _handleEnter() {
          this._setState('HdmiAudioOutputStereoScreen')
        }
      },
      class DynamicRange extends this{
        $enter() {
          this.tag('DynamicRange')._focus()
        }
        $exit() {
          this.tag('DynamicRange')._unfocus()
        }
        _handleUp() {
          this._setState('OutputMode')
        }
        _handleDown() {
          this._setState('Bluetooth');
        }
        _handleEnter() {
          /**
           * This handle Enter has api calls -
           * 1 - get DRC Mode which doesnot return a drc mode and the success value is mostly false
           * 2- set Volume - able to set the value to 100
           * 3- get Volume - able to get the volume successfully as well
           * 4- 
           * 
           */
          //console.log(`Enter input was given to dynamic range ... `);
          // gets the drc mode
          this.appApi.getDRCMode().then(res=>{
            // console.log(`Tanjirou's Logs:
            
            
            // got the drc mode ie.${JSON.stringify(res)}
            
            
            // `);
          }).catch(err=>{
            console.log(`Tanjirou's Logs: 
            
            
            error while getting the drc mode ie.${err}
            
            
            `);
          })

          this.appApi.setVolumeLevel("HDMI0",100).then(res=>{
            // console.log(`Tanjirou's Logs: 
            
            // the volume of the port was set to the inputed value
            
            // `); 
            
            this.appApi.getVolumeLevel().then(res=>{
              // console.log(`Tanjirou's Logs: 
              
              // current volume level = ${JSON.stringify(res)}
              
              // `);
            }).catch(err=>{
              console.log(`Tanjirou's Logs: 
              
              an error occured while getting the current volume level
              
              
              `);
            })


          }).catch(err=>{
            console.log(`Tanjirou's Logs:

              Error while setting the volume level

            `);
          });

          this.appApi.getConnectedAudioPorts().then(res=>{
          }).catch(err=>{


            console.log(`Tanjirou's Logs:
            
              Error while getting Connected AudioPorts :${err}
              
            `);


          })
          // gets the enabled Audio Port
          this.appApi.getEnableAudioPort("HDMI0").then(res=>{
          }).catch(err=>{
            console.log(`Tanjirou's Logs:
            
            Got an error while getting the Enabled Audio port ie. ${err}
            
            `);
          })

          this.appApi.getSupportedAudioPorts().then(res=>{
            console.log(`Tanjirou's Logs:
            
              The Supported Audio ports are : ${JSON.stringify(res)}
              
              
              `);
          }).catch(err=>{
            console.log(`Error while getting the supported Audio ports ie. ${err}`);
          });
          
          // set enable Audio POrt
          this.appApi.setEnableAudioPort("HDMI0").then(res=>{

            this.appApi.getEnableAudioPort("HDMI0").then(res=>{
              
            }).catch(err=>{
              console.log(`Tanjirou's Logs:
              
              Got an error while getting the Enabled Audio port ie. ${err}
              
              `);
            })

            

          }).catch(err=>{

            console.log(`Tanjirou's Logs:
            

              An error occured while enabling the port


            `);

          });
         
          // set zoom setting ,possible values : FULL, NONE, Letterbox 16x9, Letterbox 14x9, CCO, PanScan, Letterbox 2.21 on 4x3, Letterbox 2.21 on 16x9, Platform, Zoom 16x9, Pillarbox 4x3, Widescreen 4x3
          this.appApi.setZoomSetting("FULL").then(res=>{
            


            this.appApi.getZoomSetting().then(res=>{
              
            }).catch(err=>{
  
              console.log(`Tanjirou's Logs:
              
                error while getting the current Zoom Setting ie.${err}
  
  
              `);
  
            })



          }).catch(err=>{

            console.log(`Tanjirou's Logs:
            
              Error while setting the Zoom setting ie.${err}

              
            `);

          })

          //
        }
      },
      class NavigationFeedback extends this{
        $enter() {
          this.tag('NavigationFeedback')._focus()
        }
        $exit() {
          this.tag('NavigationFeedback')._unfocus()
        }
        _handleUp() {
          this._setState('DynamicRange')
        }
        _handleDown() {
          this._setState('Bluetooth');
        }
        _handleEnter() {
          //
        }
      },
      class Bluetooth extends this{
        $enter() {
          this.tag('Bluetooth')._focus()
        }
        $exit() {
          this.tag('Bluetooth')._unfocus()
        }
        _handleUp() {
          this._setState('DynamicRange')
        }
        _handleEnter() {
            
            // this._bt.startScan().then(res=>{console.log(`
            
            // Tanjirou's Logs: scan Completed the results = ${res}
            
            // `);}).catch(err=>{
            //   console.log(`
              
            //   Tanjirou's Logs: An error occured while scanning
              
            //   `);
            // });
          //
        }
      },
      class HdmiAudioOutputStereoScreen extends this {
        $enter() {
          this.hide()
          this.tag('OutputModeScreen').visible = true
          this.fireAncestors('$changeHomeText', 'Settings / Audio / Output Mode')
        }
        $exit() {
          this.tag('OutputModeScreen').visible = false
          this.show()
          this.fireAncestors('$changeHomeText', 'Settings / Audio')
        }
        _getFocused() {
          return this.tag('OutputModeScreen')
        }
        _handleBack() {
          this._setState('OutputMode')
        }
        $updateHdmiAudioOutputStereo(value) {
          this.tag('OutputMode.Title').text.text = 'Output Mode: ' + value
        }
      }
    ]

  }
}
