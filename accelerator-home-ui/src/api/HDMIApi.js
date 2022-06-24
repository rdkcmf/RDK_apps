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

import ThunderJS from 'ThunderJS';
/**
 * Class for HDMI thunder plugin apis.
 */
export default class HDMIApi {
    constructor() {
        const config = {
            host: '127.0.0.1',
            port: 9998,
            default: 1,
        };
        this._thunder = ThunderJS(config);
        this._events = new Map();
        this.callsign = 'org.rdk.HdmiInput'
    }

    activate() {
        return new Promise((resolve, reject) => {
            this._thunder
                .call('Controller', 'activate', { callsign: this.callsign })
                .then(result => {
                    console.log('Activated HdmiInput plugin')
                    this._thunder.on(this.callsign, 'onInputStatusChanged', notification => {
                        if (this._events.has('onInputStatusChanged')) {
                            this._events.get('onInputStatusChanged')(notification)
                        }
                    })
                    this._thunder.on(this.callsign, 'onDevicesChanged', notification => {
                        if (this._events.has('onDevicesChanged')) {
                            this._events.get('onDevicesChanged')(notification)
                        }
                    })
                    this._thunder.on(this.callsign, 'onSignalChanged', notification => {
                        if (this._events.has('onSignalChanged')) {
                            this._events.get('onSignalChanged')(notification)
                        }
                    })
                    this._thunder.on(this.callsign, 'videoStreamInfoUpdate', notification => {
                        if (this._events.has('videoStreamInfoUpdate')) {
                            this._events.get('videoStreamInfoUpdate')(notification)
                        }
                    })
                    if (result === null)
                        resolve(true)
                    else
                        resolve(false)
                })
                .catch(err => {
                    console.log('Failed to activate HdmiInput plugin', JSON.stringify(err))
                    reject(false)
                })
        })
    }

    getHDMIDevices() {
        return new Promise((resolve, reject) => {
            this._thunder
                .call(this.callsign, 'getHDMIInputDevices')
                .then(result => {
                    resolve(result.devices)
                })
                .catch(err => {
                    // reject(err) // #forTesting //make the api reject, instead of resolving empty array
                    console.log("getHDMIDevices Error: ", JSON.stringify(err), " resolving empty array")
                    resolve([]) 
                })
            // resolve([
            //     {
            //         id: 0,
            //         locator: "hdmiin://localhost/deviceid/0",
            //         connected: true,
            //     },
            //     {
            //         id: 1,
            //         locator: "hdmiin://localhost/deviceid/1",
            //         connected: true,
            //     },
            //     {
            //         id: 2,
            //         locator: "hdmiin://localhost/deviceid/2",
            //         connected: true,
            //     }
            // ])
        })
    }

    checkStatus(plugin) {
        return new Promise((resolve, reject) => {
            this._thunder.call('Controller.1', 'status@' + plugin)
                .then(res => {
                    console.log(JSON.stringify(res))
                })
        })
    }

    getWidth() {
        return new Promise((resolve, reject) => {
            this._thunder
                .call('DisplayInfo', 'width')
                .then(result => {
                    resolve(result)
                })
                .catch(err => {
                    resolve('1920')
                })
        })
    }

    getHeight() {
        return new Promise((resolve, reject) => {
            this._thunder
                .call('DisplayInfo', 'height')
                .then(result => {
                    resolve(result)
                })
                .catch(err => {
                    resolve('1080')
                })
        })
    }

    setHDMIInput(portDetails) {
        return new Promise(async (resolve, reject) => {
            if (portDetails.connected) {
                this._thunder
                    .call(this.callsign, 'startHdmiInput', { portId: portDetails.id })
                    .then(async (result) => {
                        const dimension = await Promise.all([this.getWidth(), this.getHeight()])
                        this._thunder
                            .call(this.callsign, 'setVideoRectangle', { x: 0, y: 0, w: dimension[0], h: dimension[1] })
                        resolve(result)
                    })
                    .catch(err => {
                        reject(err)
                    })
            } else {
                reject(false)
            }
        })
    }

    stopHDMIInput() {
        return new Promise((resolve, reject) => {
            this._thunder
                .call(this.callsign, 'stopHdmiInput')
                .then(result => {
                    resolve(result)
                })
        })
    }

    /**
   *Register events and event listeners.
   * @param {string} eventId
   * @param {function} callback
   *
   */
    registerEvent(eventId, callback) {
        this._events.set(eventId, callback)
    }
}
