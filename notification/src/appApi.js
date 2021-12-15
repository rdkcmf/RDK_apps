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
const config = {
  host: '127.0.0.1',
  port: 9998,
}
const thunder = ThunderJS(config)

export default class AppApi {
  constructor() {
    this.index
  }
  getConnectedAudioPorts() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings.1', 'getConnectedAudioPorts', {})
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log('audio mute error:', JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  getVolumeLevel(port) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings.1', 'getVolumeLevel', { audioPort: port })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log('audio mute error:', JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  setVolumeLevel(port, volume) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings.1', 'setVolumeLevel', {
          audioPort: port,
          volumeLevel: volume,
        })
        .then(result => {
          console.log('############ setVolumeLevel #############')
          console.log(JSON.stringify(result))
          resolve(result)
        })
        .catch(err => {
          console.log('error while setting current volume level', JSON.stringify(err))
          resolve(false)
        })
    })
  }

  audio_mute(audio_source, value) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings.1', 'setMuted', { audioPort: audio_source, muted: value })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log('audio mute error:', JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  muteStatus(port) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings.1', 'getMuted', { audioPort: port })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log('audio mute error:', JSON.stringify(err, 3, null))
          reject(false)
        })
    })
  }

  setVisibility(client, visible) {
    return new Promise((resolve, reject) => {
      thunder.call('org.rdk.RDKShell', 'setVisibility', {
        client: client,
        visible: visible,
      })

      if (visible) {
        thunder
          .call('org.rdk.RDKShell.1', 'setFocus', {
            client: client,
          })
          .then(res => {
            resolve(true)
          })
          .catch(err => {
            console.log('Set focus error', JSON.stringify(err))
            reject(false)
          })
      } else {
        thunder.call('org.rdk.RDKShell.1', 'getZOrder').then(result => {
          this.index = result.clients.indexOf('foreground')
          thunder
            .call('org.rdk.RDKShell.1', 'setFocus', {
              client: result.clients[this.index + 1]
                ? result.clients[this.index + 1]
                : result.clients[this.index - 1],
            })
            .then(() => {
              resolve(true)
            })
            .catch(err => {
              console.log('Set focus error', JSON.stringify(err))
              reject(false)
            })
        })
      }
    })
  }
}
