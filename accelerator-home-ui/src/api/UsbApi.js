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
import ThunderJS from 'ThunderJS'
import { imageListInfo } from '../../static/data/ImageListInfo'
import { musicListInfo } from '../../static/data/MusicListInfo'
import { videoListInfo } from '../../static/data/VideoListInfo'


const config = {
    host: '127.0.0.1',
    port: 9998,
    default: 1,
}
var thunder = ThunderJS(config)
/**
 * Class that contains functions which commuicates with thunder API's
 */



export default class UsbApi {
    /**
    *  Function to create link for USB content
    */
    clearLink() {
        return new Promise((resolve, reject) => {
            const systemcCallsign = 'org.rdk.UsbAccess'
            thunder.Controller.activate({ callsign: systemcCallsign })
                .then(() => {
                    thunder
                        .call(systemcCallsign, 'clearLink')
                        .then(result => {
                            console.log(result)
                            console.log(JSON.stringify(result))
                            resolve(result)
                        }).catch(err => { resolve(false) })
                }).catch(err => {
                    console.log('clear link failed ')
                })
        })
    }

    /**
    *  Function to create link for USB content
    */
    createLink() {
        return new Promise((resolve, reject) => {
            const systemcCallsign = 'org.rdk.UsbAccess'
            thunder.Controller.activate({ callsign: systemcCallsign })
                .then(() => {
                    thunder
                        .call(systemcCallsign, 'createLink')
                        .then(result => {
                            console.log(result)
                            console.log(JSON.stringify(result))
                            resolve(result)
                        }).catch(err => { resolve(false) })
                }).catch(err => { })
        })
    }

    /**
    *  Function to get getUsbList
    */
    getUsbFileList() {
        return new Promise((resolve, reject) => {
            const systemcCallsign = 'org.rdk.UsbAccess'
            thunder.Controller.activate({ callsign: systemcCallsign })
                .then(() => {
                    thunder
                        .call(systemcCallsign, 'getFileList')
                        .then(result => {
                            console.log(result)
                            console.log(result.contents)
                            resolve(result.contents)
                        }).catch(err => { resolve(false) })
                }).catch(err => { })
        })
    }

    retrieUsb() {
        this.clearLink().then(
            result => {
                this.createLink().then(
                    res => {
                        this.usbLink = res.baseURL
                        this.getUsbFileList().then(
                            result1 => {
                                console.log(JSON.stringify(result1))
                                this.getUsbContentList(result1)
                            }
                        )
                    }
                )
            }
        )
    }

    destroy() {
        imageListInfo.length = 0;
        videoListInfo.length = 0;
        musicListInfo.length = 0;
    }

    getUsbContentList(result) {
        // to add support for more formats, extension can be added same as below 
        var extensionForImage = ['.png', '.jpg', '.PNG', '.jpeg', '.JPEG', '.jpg', '.JPG'];
        var extensionForVideo = ['.mp4', '.MP4', '.mov', '.MOV', '.avi', '.AVI', '.m3u8', '.M3U8', '.mpeg2', '.MPEG2'];
        var extensionForAudio = ['.mp3', '.mpeg', '.MP3', '.MPEG'];

        this._discoveredC = result;
        console.log("Discovered result :: " + JSON.stringify(result));

        this._discoveredC.filter(device => {
            for (let i in extensionForImage) {
                if (device.name.indexOf(extensionForImage[i]) !== -1) {
                    var obj1 = {
                        displayName: device.name,
                        uri: this.usbLink + '/' + device.name,
                        url: this.usbLink + '/' + device.name,
                    };
                    imageListInfo.push(obj1);
                    return device
                }
            }

        });

        this._discoveredC.filter(device => {
            for (let i in extensionForVideo) {
                if (device.name.indexOf(extensionForVideo[i]) !== -1) {
                    var obj2 = {
                        displayName: device.name,
                        url: '/images/usb/video-default-tile.jpg',
                        uri: this.usbLink + '/' + device.name,
                    };
                    videoListInfo.push(obj2);
                    return device
                }
            }
        });

        this._discoveredC.filter(device => {
            for (let i in extensionForAudio) {
                if (device.name.indexOf(extensionForAudio[i]) !== -1) {
                    var obj3 = {
                        displayName: device.name,
                        url: '/images/usb/music-default-tile.jpg',
                        uri: this.usbLink + '/' + device.name,
                    };
                    musicListInfo.push(obj3);
                    return device
                }
            }
        });
    }

}

