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

import { Lightning, Utils, Router, Storage } from '@lightningjs/sdk'
import BluetoothApi from '../../api/BluetoothApi'

export default class LogoScreen extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            color: 0xff000000,
            w: 1920,
            h: 2000,
            Logo: {
                mount: 0.5,
                x: 1920 / 2,
                y: 1080 / 2,
                src: Utils.asset('/images/splash/RDKLogo.png'),
            },
        }
    }

    pageTransition() {
        return 'right'
    }

    _init() {
        this.btApi = new BluetoothApi()
    }

    _focus() {
        let path = 'splash/bluetooth'
        this.btApi.getPairedDevices()
            .then(devices => {
                console.log(devices)
                if (devices.length > 0 || Storage.get('setup')) {
                    path = 'menu'
                }
            })
            .catch(() => {
                console.log('Paired Device Error')
                path = 'menu'
            })
        setTimeout(() => {
            Router.navigate(path)
        }, 5000)
    }
}