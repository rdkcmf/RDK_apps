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

import ThunderJS from "ThunderJS"

const thunder = ThunderJS({
    host: '127.0.0.1',
    port: 9998,
    default: 1,
})

export default class VoiceApi {

    activate() {
        const callsign = 'AVS'
        return new Promise((resolve, reject) => {
            thunder.call('Controller', 'activate', { callsign: callsign })
                .then(res => {
                    resolve(true)
                })
                .catch(err => {
                    console.log('Error occured activating Voice Api', err)
                    reject(true)
                })
        })
    }

    deactivate() {
        const callsign = 'AVS'
        return new Promise((resolve, reject) => {
            thunder.call('Controller', 'deactivate', { callsign: callsign })
                .then((res) => {
                    resolve(true)
                })
                .catch(err => {
                    console.log('Failed to deactivate AVS')
                    reject(true)
                })
        })
    }
}