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

import { Lightning, Registry, Router, Utils } from '@lightningjs/sdk'
import { CONFIG } from '../../Config/Config'
import AppApi  from '../../api/AppApi';
import BluetoothApi  from '../../api/BluetoothApi';
import ThunderJS from 'ThunderJS'

var appApi = new AppApi();
var bluetoothApi = new BluetoothApi();
const config = {
        host: '127.0.0.1',
        port: 9998,
        default: 1,
    }
const _thunder = ThunderJS(config)

export default class BluetoothScreen extends Lightning.Component {
    static _template() {
        return {
            w: 1920,
            h: 1080,
            rect: true,
            color: 0xff000000,
            Bluetooth: {
                x: 960,
                y: 270,
                Title: {
                    x: 0,
                    y: 0,
                    mountX: 0.5,
                    text: {
                        text: "Pairing Your Remote",
                        fontFace: CONFIG.language.font,
                        fontSize: 40,
                        textColor: CONFIG.theme.hex,
                        fontStyle: 'bold'
                    },
                },
                BorderTop: {
                    x: 0, y: 75, w: 1558, h: 3, rect: true, mountX: 0.5,
                },
                Info: {
                    x: 0,
                    y: 135,
                    mountX: 0.5,
                    text: {
                        text: "Please put the remote in pairing mode, scanning will start in a minute.",
                        fontFace: CONFIG.language.font,
                        fontSize: 25,
                    },
                    visible: true
                },
                Timer: {
                    x: 0,
                    y: 200,
                    mountX: 0.5,
                    text: {
                        text: "0:10",
                        fontFace: CONFIG.language.font,
                        fontSize: 80,
                    },
                    visible: true
                },
                Loader: {
                    x: 0,
                    y: 200,
                    mountX: 0.5,
                    w: 110,
                    h: 110,
                    zIndex: 2,
                    src: Utils.asset("images/settings/Loading.png"),
                    visible: false
                },
                Buttons: {
                    Continue: {
                        x: 0, y: 210, w: 300, mountX: 0.5, h: 60, rect: true, color: 0xFFFFFFFF,
                        Title: {
                            x: 150,
                            y: 30,
                            mount: 0.5,
                            text: {
                                text: "Continue Setup",
                                fontFace: CONFIG.language.font,
                                fontSize: 22,
                                textColor: 0xFF000000,
                                fontStyle: 'bold'
                            },
                        },
                        visible: false
                    },
                },
                BorderBottom: {
                    x: 0, y: 350, w: 1558, h: 3, rect: true, mountX: 0.5,
                },
            }
        }
    }

    _PairingApis(){
        //bluetoothApi.btactivate().then(enableResult =>{
          //  console.log('1')
            bluetoothApi.enable().then(res => {
                console.log("1.5 enable result: ",res)
                bluetoothApi.startScanBluetooth().then( startScanresult =>{
                    console.log('2: ',startScanresult)
                    var SubscribeEvent=  _thunder.on('org.rdk.Bluetooth', 'onDiscoveredDevice', notification => {
                        bluetoothApi.getDiscoveredDevices().then((getdocoveredInfo) => {
                          console.log('onDiscoveredDevice',getdocoveredInfo[0].name )
                          this.tag('Info').text.text = `pairing this device ${getdocoveredInfo[0].name}` 
                          //bluetoothApi.connect(getdocoveredInfo[0].deviceID, getdocoveredInfo[0].deviceType).then(connectresult=>{
                               //  console.log("connectresult",connectresult)
                                 bluetoothApi.pair(getdocoveredInfo[0].deviceID).then(Pairresult=>{
                                    console.log("Pairresult",Pairresult)
                                    bluetoothApi.getConnectedDevices().then(getCdresult =>{
                                        console.log("getConnectedDevices",getCdresult)
                                        bluetoothApi.getPairedDevices().then(getpairedDevices =>{
                                            
                                                console.log("getpairedDevices",getpairedDevices)
                                            bluetoothApi.stopScan().then(stopScan =>{
                                               console.log("stopscan",stopScan)
                                               SubscribeEvent.dispose();
                                               //bluetoothApi.disable().then(disable =>{
                                                //console.log("disable")
                                                bluetoothApi.deactivateBluetooth().then(deactivateBluetooth =>{
                                                    console.log("DeactivatedBluetooth",deactivateBluetooth)
                                                    Router.navigate('splash/language')
                                                })
                                               
                                            })
                                            .catch(err => {
                                                console.error(`cant stopscan device : ${JSON.stringify(err)}`)
                                                
                                              })
                                            
                                           
                                            
                                        })
                                        .catch(err => {
                                            console.error(`cant getpaired device : ${JSON.stringify(err)}`)
                                          })
                                    })
                                    .catch(err => {
                                        console.error(`Can't getconnected device : ${JSON.stringify(err)}`)
                                        
                                      })
                                 })
                                 .catch(err => {
                                    console.error(`Can't pair device : ${JSON.stringify(err)}`)
                                    
                                  })
                          //})
                          //.catch(err => {
                            //console.error(`Can't connect : ${JSON.stringify(err)}`)
                            
                          //})
                        })
                        // })
                      })
            })
            .catch(err => {
                console.error(`Can't scan enable : ${JSON.stringify(err)}`)
                
              })
        })
    }

    _firstEnable(){
        console.log("checking")
        appApi.getPluginStatus('org.rdk.RemoteControl')
        .then(result => {
            var bluetoothPluginResult = result;
            appApi.activateAutoPairing()
            .then(result=>{
                console.log("paired devices result", result)
                //this.initTimer();
                Router.navigate('splash/language')
            })
         })
        .catch(err => {
            console.log(' remote autoPair plugin error:', JSON.stringify(err))
            appApi.getPluginStatusParams('org.rdk.Bluetooth').then(pluginresult =>{
                console.log("status",pluginresult[1])
                if(pluginresult[1] === 'deactivated'){
                    bluetoothApi.btactivate().then(result=>{
                        console.log("pairing bluetooth")
                        this._PairingApis()
                    })  
                }
                else{
                    this._PairingApis()
                    
                }
            })
          })
    }

    _focus() {
        this.initTimer()
    }

    pageTransition() {
        return 'left'
    }

    _unfocus() {
        if (this.timeInterval) {
            Registry.clearInterval(this.timeInterval)
        }
        //this.tag('Timer').text.text = '0:10'
    }

    getTimeRemaining(endtime) {
        const total = Date.parse(endtime) - Date.parse(new Date())
        const seconds = Math.floor((total / 1000) % 60)
        return { total, seconds }
    }

    initTimer() {
        const endTime = new Date(Date.parse(new Date()) + 10000)
        const timerText = this.tag('Timer')
        this.timeInterval = Registry.setInterval(() => {
            const time = this.getTimeRemaining(endTime)
            timerText.text.text = `0:0${time.seconds}`
            if (time.total <= 0) {
                Registry.clearInterval(this.timeInterval)
                Router.navigate('splash/language')
            }
        }, 1000)
    }

    static _states() {
        return [
            class RemotePair extends this{
                $enter() {
                    this.tag('Timer').visible = true
                    this.tag('Info').text.text = 'Please put the remote in pairing mode, scanning will start in a minute.'
                }
                _handleRight() {
                    this._setState('Scanning')
                }
                $exit() {
                    this.tag('Timer').visible = false
                    this.tag('Info').text.text = ''
                }
            },
            class Scanning extends this{
                $enter() {
                    this.tag('Loader').visible = true
                    this.tag('Info').text.text = 'Scanning'
                }
                _handleRight() {
                    this._setState('PairComplete')
                }
                _handleLeft() {
                    this._setState('RemotePair')
                }
                $exit() {
                    this.tag('Loader').visible = false
                    this.tag('Info').text.text = ''
                }
            },
            class PairComplete extends this{
                $enter() {
                    this.tag('Buttons.Continue').visible = true
                    this.tag('Info').text.text = 'Pairing complete'
                }
                _handleLeft() {
                    this._setState('Scanning')
                }
                _handleRight() {
                    Router.navigate('splash/language')
                }
                $exit() {
                    this.tag('Buttons.Continue').visible = false
                    this.tag('Info').text.text = ''
                }
            }
        ]
    }

}