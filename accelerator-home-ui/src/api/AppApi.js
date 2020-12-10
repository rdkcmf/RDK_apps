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
var activatedWeb = false
var activatedLightning = false
var activatedCobalt = false
var webUrl = ''
var lightningUrl = ''
var cobaltUrl = ''
const config = {
  host: '127.0.0.1',
  port: 9998,
  default: 1,
}
var thunder = ThunderJS(config)
/**
 * Class that contains functions which commuicates with thunder API's
 */
export default class AppApi {
  checkForInternet() {
    return new Promise((resolve, reject) => {
      let i = 0
      var poll = () => {
        i++
        this.getIP().then(result => {
          if (result == true) {
            resolve(result)
          } else if (i < 10) poll()
          else resolve(false)
        })
      }
      poll()
    })
  }

  /**
   * Function to launch Html app.
   * @param {String} url url of app.
   */
  getIP() {
    return new Promise((resolve, reject) => {
      const systemcCallsign = 'org.rdk.System'
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          thunder
            .call(systemcCallsign, 'getDeviceInfo', { params: 'estb_ip' })
            .then(result => {
              resolve(result.success)
            })
            .catch(err => {
              resolve(false)
            })
        })
        .catch(err => {})
    })
  }
  /**
   * Function to get resolution of the display screen.
   */
  getResolution() {
    return new Promise((resolve, reject) => {
      const systemcCallsign = 'org.rdk.DisplaySettings'
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          thunder
            .call(systemcCallsign, 'getCurrentResolution', { params: 'HDMI0' })
            .then(result => {
              resolve(result.resolution)
            })
            .catch(err => {
              resolve(false)
            })
        })
        .catch(err => {
          console.log('Display Error', err)
        })
    })
  }

  /**
   * Function to set the display resolution.
   */
  setResolution() {
    return new Promise((resolve, reject) => {
      const systemcCallsign = 'org.rdk.DisplaySettings'
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          thunder
            .call(systemcCallsign, 'setCurrentResolution', {
              videoDisplay: 'HDMI0',
              resolution: '1080p',
              persist: true,
            })
            .then(result => {
              resolve(result.success)
            })
            .catch(err => {
              resolve(false)
            })
        })
        .catch(err => {
          console.log('Display Error', err)
        })
    })
  }

  /**
   * Function to launch Html app.
   * @param {String} url url of app.
   */
  launchWeb(url) {
    const childCallsign = 'HtmlApp'
    if (webUrl != url) {
      thunder
        .call('org.rdk.RDKShell', 'launch', {
          callsign: childCallsign,
          type: childCallsign,
          uri: url,
        })
        .then(() => {
          thunder.call('org.rdk.RDKShell', 'moveToFront', {
            client: childCallsign,
          })
          thunder.call('org.rdk.RDKShell', 'setFocus', {
            client: childCallsign,
          })
        })
        .catch(err => {})
    } else {
      thunder.call('org.rdk.RDKShell', 'moveToFront', {
        client: childCallsign,
      })
      thunder.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign })
    }
    webUrl = url
    activatedWeb = true
  }

  /**
   * Function to launch Lightning app.
   * @param {String} url url of app.
   */
  launchLightning(url) {
    const childCallsign = 'LightningApp'
    if (lightningUrl != url) {
      thunder
        .call('org.rdk.RDKShell', 'launch', {
          callsign: childCallsign,
          type: childCallsign,
          uri: url,
        })
        .then(() => {
          thunder.call('org.rdk.RDKShell', 'moveToFront', {
            client: childCallsign,
          })
          thunder.call('org.rdk.RDKShell', 'setFocus', {
            client: childCallsign,
          })
        })
        .catch(err => {})
    } else {
      thunder.call('org.rdk.RDKShell', 'moveToFront', {
        client: childCallsign,
      })
      thunder.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign })
    }
    lightningUrl = url
    activatedLightning = true
  }

  /**
   * Function to launch Cobalt app.
   * @param {String} url url of app.
   */
  launchCobalt(url) {
    const childCallsign = 'Cobalt'
    thunder
      .call('org.rdk.RDKShell', 'launch', {
        callsign: childCallsign,
        type: childCallsign,
      })
      .then(() => {
        thunder.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign,
        })
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign })
      })
      .catch(err => {})
    activatedCobalt = true
  }

  /**
   * Function to launch Resident app.
   * @param {String} url url of app.
   */
  launchResident(url) {
    const childCallsign = 'ResidentApp'
    thunder
      .call('org.rdk.RDKShell', 'launch', {
        callsign: childCallsign,
        type: childCallsign,
        uri: url,
      })
      .then(() => {
        thunder.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign,
        })
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign })
      })
      .catch(err => {
        console.log('org.rdk.RDKShell launch ' + JSON.stringify(err))
      })
  }

  /**
   * Function to suspend html app.
   */
  suspendWeb() {
    webUrl = ''
    thunder.call('org.rdk.RDKShell', 'suspend', { callsign: 'HtmlApp' })
  }

  /**
   * Function to suspend lightning app.
   */
  suspendLightning() {
    lightningUrl = ''
    thunder.call('org.rdk.RDKShell', 'suspend', { callsign: 'LightningApp' })
  }

  /**
   * Function to suspend cobalt app.
   */
  suspendCobalt() {
    thunder.call('org.rdk.RDKShell', 'suspend', { callsign: 'Cobalt' })
  }

  /**
   * Function to deactivate html app.
   */
  deactivateWeb() {
    thunder.call('org.rdk.RDKShell', 'destroy', { callsign: 'HtmlApp' })
    activatedWeb = false
    webUrl = ''
  }

  /**
   * Function to deactivate cobalt app.
   */
  deactivateCobalt() {
    thunder.call('org.rdk.RDKShell', 'destroy', { callsign: 'Cobalt' })
    activatedCobalt = false
    cobaltUrl = ''
  }

  /**
   * Function to deactivate lightning app.
   */
  deactivateLightning() {
    thunder.call('org.rdk.RDKShell', 'destroy', { callsign: 'LightningApp' })
    activatedLightning = false
    lightningUrl = ''
  }

  /**
   * Function to set visibility to client apps.
   * @param {client} client client app.
   * @param {visible} visible value of visibility.
   */
  setVisibility(client, visible) {
    thunder.call('org.rdk.RDKShell', 'setVisibility', {
      client: client,
      visible: visible,
    })
  }

  static pluginStatus(plugin) {
    switch (plugin) {
      case 'WebApp':
        return activatedWeb
      case 'Cobalt':
        return activatedCobalt
      case 'Lightning':
        return activatedLightning
    }
  }
}
