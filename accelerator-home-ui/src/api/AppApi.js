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

var activatedWeb = false
var activatedLightning = false
var activatedCobalt = false
var activatedAmazon = false
var activatedNetflix = false
var webUrl = ''
var lightningUrl = ''
var activatedNative = false
var nativeUrl = ''
var cobaltUrl = ''
const config = {
  host: '127.0.0.1',
  port: 9998,
  default: 1,
  versions: {
    'org.rdk.System': 2
  }
}
const thunder = ThunderJS(config)
/**
 * Class that contains functions which commuicates with thunder API's
 */
export default class AppApi {

  constructor() {
    this.activatedForeground = false
    this._events = new Map()
  }

  /**
   *
   * @param {string} eventId
   * @param {function} callback
   * Function to register the events for the Bluetooth plugin.
   */
  registerEvent(eventId, callback) {
    this._events.set(eventId, callback)
  }

  fetchTimeZone() {
    return new Promise((resolve) => {
      thunder.call('org.rdk.System', 'getTimeZones')
        .then(result => {
          resolve(result.zoneinfo)
        })
        .catch(err => {
          console.log('Cannot fetch time zone', err)
          resolve({})
        })
    })
  }

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

  fetchApiKey() {
    return new Promise((resolve) => {
      thunder
        .call('org.rdk.PersistentStore', 'getValue', { namespace: 'gracenote', key: 'apiKey' })
        .then(result => {
          resolve(result.value)
        })
        .catch(err => {
          resolve('')
        })
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
        .catch(err => { })
    })
  }
  /**
  *  Function to get timeZone
  */
  getZone() {
    return new Promise((resolve, reject) => {
      const systemcCallsign = 'org.rdk.System'
      thunder.call(systemcCallsign, 'getTimeZoneDST')
        .then(result => {
          resolve(result.timeZone)
        })
        .catch(err => {
          console.log('Failed to fetch Time Zone')
          resolve(null)
        })
    })
  }

  setZone(zone) {
    console.log(zone)
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'setTimeZoneDST', { timeZone: zone })
        .then(result => {
          resolve(result.success)
        }).catch(err => { resolve(false) })
    }).catch(err => { })
  }
  /**
   * Function to get resolution of the display screen.
   */
  getResolution() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getCurrentResolution', {
          "videoDisplay": "HDMI0"
        })
        .then(result => {
          resolve(result.resolution)
        })
        .catch(err => {
          resolve('NA')
        });
    })

  }

  activateDisplaySettings() {

    return new Promise((resolve, reject) => {
      const systemcCallsign = "org.rdk.DisplaySettings"
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(res => {
        })
        .catch(err => { console.error(`error while activating the displaysettings plugin`) })
    });

  }



  getSupportedResolutions() {
    return new Promise((resolve, reject) => {

      const systemcCallsign = 'org.rdk.DisplaySettings'
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          thunder
            .call(systemcCallsign, 'getSupportedResolutions', { params: 'HDMI0' })
            .then(result => {
              resolve(result.supportedResolutions)
            })
            .catch(err => {
              resolve(false)
            })
        })
        .catch(err => {
          console.log('Display Error', JSON.stringify(err))
        })
    })
  }

  /**
   * Function to set the display resolution.
   */
  setResolution(res) {
    return new Promise((resolve, reject) => {
      const systemcCallsign = 'org.rdk.DisplaySettings'
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          thunder
            .call(systemcCallsign, 'setCurrentResolution', {
              videoDisplay: 'HDMI0',
              resolution: res,
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
          console.log('Display Error', JSON.stringify(err))
        })
    })
  }

  /**
   * Function to get HDCP Status.
   */
  getHDCPStatus() {
    console.log("checking hdcp status")
    return new Promise((resolve, reject) => {

      const systemcCallsign = 'org.rdk.HdcpProfile'
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          thunder
            .call(systemcCallsign, 'getHDCPStatus')
            .then(result => {
              resolve(result.HDCPStatus)
              console.log("HDCP Status from AppApi.js : " + JSON.stringify(result.HDCPStatus))
            })
            .catch(err => {
              resolve(false)
            })
        })
        .catch(err => {
          console.log('Display Error', JSON.stringify(err))
        })
    })
  }

  /**
   * Function to get TV HDR Support.
   */
  getTvHDRSupport() {
    return new Promise((resolve, reject) => {

      const systemcCallsign = 'org.rdk.DisplaySettings'
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          thunder
            .call(systemcCallsign, 'getTvHDRSupport')
            .then(result => {
              resolve(result)
              console.log("HDR Support Status from AppApi.js : " + JSON.stringify(result))
            })
            .catch(err => {
              resolve(false)
            })
        })
        .catch(err => {
          console.log('Display Error', JSON.stringify(err))
        })
    })
  }

  /**
   * Function to get settop box HDR Support.
   */
  getSettopHDRSupport() {
    return new Promise((resolve, reject) => {

      const systemcCallsign = 'org.rdk.DisplaySettings'
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          thunder
            .call(systemcCallsign, 'getSettopHDRSupport')
            .then(result => {
              resolve(result)
              console.log("HDR Support Status for STB from AppApi.js : " + JSON.stringify(result))
            })
            .catch(err => {
              resolve(false)
            })
        })
        .catch(err => {
          console.log('Display Error', JSON.stringify(err))
        })
    })
  }

  /**
   * Function to get HDR Format in use.
   */
  getHDRSetting() {
    return new Promise((resolve, reject) => {

      const systemcCallsign = 'DisplayInfo'
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          thunder
            .call(systemcCallsign, 'hdrsetting')
            .then(result => {
              resolve(result)
              console.log("HDR format in use from AppApi.js : " + JSON.stringify(result))
            })
            .catch(err => {
              resolve(false)
            })
        })
        .catch(err => {
          console.log('Display Error', JSON.stringify(err))
        })
    })
  }

  /**
   * Function to get DRMs.
   */
  getDRMS() {
    console.log("calling getDDRMS")
    return new Promise((resolve, reject) => {

      const systemcCallsign = 'OCDM'
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          thunder
            .call(systemcCallsign, 'drms')
            .then(result => {
              resolve(result)
              console.log("supported drms from AppApi.js : " + JSON.stringify(result))
            })
            .catch(err => {
              resolve(false)
            })
        })
        .catch(err => {
          console.log('Display Error', JSON.stringify(err))
        })
    })
  }

  /**
   * Function to clear cache.
   */
  clearCache() {
    return new Promise((resolve, reject) => {
      const systemcCallsign = 'ResidentApp'
      thunder
        .call(systemcCallsign, 'delete', { path: ".cache" })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          resolve(err)
        })
    })
  }

  /**
   * Function to launch Html app.
   * @param {String} url url of app.
   */
  launchWeb(url) {
    return new Promise(resolve => {
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
              .then(() => {
                resolve(true)
              })
          })
          .catch(err => { })
      } else {
        thunder.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign,
        })
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign })
      }
      webUrl = url
      activatedWeb = true
    })

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
        .catch(err => { })
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
        type: childCallsign
      })
      .then(() => {
        thunder.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign,
        })
        thunder.call('Cobalt', 'deeplink', url)
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign })
      })
      .catch(err => { })
    activatedCobalt = true
  }

  /**
   * Function to launch Netflix/Amazon Prime app.
   */
  launchPremiumApp(childCallsign) {

    thunder
      .call("org.rdk.RDKShell", "launch", {
        callsign: childCallsign,
        type: childCallsign
      })
      .then(() => {
        thunder.call("org.rdk.RDKShell", "moveToFront", {
          client: childCallsign
        })
        thunder.call("org.rdk.RDKShell", "setFocus", { client: childCallsign });
      })
      .catch(err => { });
    childCallsign === 'Amazon' ? activatedAmazon = true : activatedNetflix = true;
  }

  /**
   * Function to launch Resident app.
   * @param {String} url url of app.
   */
  launchResident(url, client) {
    const childCallsign = client
    thunder
      .call('org.rdk.RDKShell', 'launch', {
        callsign: childCallsign,
        type: 'ResidentApp',
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

  launchOverlay(url, client) {
    return new Promise(resolve => {
      const childCallsign = client
      thunder
        .call('org.rdk.RDKShell', 'launch', {
          callsign: childCallsign,
          type: 'ResidentApp',
          uri: url,
        })
        .then(res => {
          thunder.call('org.rdk.RDKShell', 'moveToFront', {
            client: childCallsign,
          })
        })
    })
  }

  launchforeground() {
    const childCallsign = 'foreground'
    let url = location.href.split(location.hash)[0].split('index.html')[0]
    let notification_url = url + "static/notification/index.html";
    if (location.host.includes('127.0.0.1')) {
      notification_url = url + "lxresui/static/notification/index.html";
    }

    console.log(notification_url, '|', location.host, location)
    thunder.call('org.rdk.RDKShell', 'launch', {
      callsign: childCallsign,
      type: 'LightningApp',
      uri: notification_url,
    }).then(() => {
      this.activatedForeground = true
      thunder.call('org.rdk.RDKShell', 'setFocus', {
        client: 'ResidentApp',
      })
      thunder.call('org.rdk.RDKShell', 'setVisibility', {
        client: 'foreground',
        visible: false,
      })
    }).catch(err => { })
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
   * Function to suspend Netflix/Amazon Prime app.
   */
  suspendPremiumApp(appName) {
    thunder.call('org.rdk.RDKShell', 'suspend', { callsign: appName })
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

  cobaltStateChangeEvent() {
    try {
      thunder.on('Controller', 'statechange', notification => {
        if (this._events.has('statechange')) {
          this._events.get('statechange')(notification)
        }

      })
    } catch (e) {
      console.log('Failed to register statechange event' + e)
    }

  }
  /**
   * Function to deactivate Netflix/Amazon Prime app.
   */
  deactivateNativeApp(appName) {
    thunder.call('org.rdk.RDKShell', 'destroy', { callsign: appName })
    appName === 'Amazon' ? activatedAmazon = false : activatedNetflix = false;
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
   * Function to deactivate resident app.
   */
  deactivateResidentApp(client) {
    thunder.call('org.rdk.RDKShell', 'destroy', { callsign: client })
  }

  /**
   * Function to set visibility to client apps.
   * @param {client} client client app.
   * @param {visible} visible value of visibility.
   */
  setVisibility(client, visible) {
    return new Promise((resolve, reject) => {
      thunder.call('org.rdk.RDKShell', 'setVisibility', {
        client: client,
        visible: visible,
      })
      thunder.call('org.rdk.RDKShell', 'setFocus', { client: client })
        .then(res => {
          resolve(true)
        })
        .catch(err => {
          console.log('Set focus error', JSON.stringify(err))
          reject(false)
        })
    })
  }

  visibile(client, visible) {
    return new Promise((resolve, reject) => {
      thunder.call('org.rdk.RDKShell', 'setVisibility', {
        client: client,
        visible: visible,
      })
    })
  }

  enabledisableinactivityReporting(bool) {

    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.RDKShell', 'enableInactivityReporting', {
          "enable": bool
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting sound mode:", JSON.stringify(err, 3, null))
          reject(err)
        });
    })
  }

  setInactivityInterval(t) {

    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.RDKShell', 'setInactivityInterval', {
          "interval": t
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(false)
        });
    })
  }



  zorder(cli) {
    thunder.call('org.rdk.RDKShell', 'moveToFront', { client: cli, callsign: cli })
  }

  /**
 * Function to set the configuration of premium apps.
 * @param {appName} Name of the application
 * @param {config_data} config_data configuration data
 */

  configureApplication(appName, config_data) {
    let plugin = 'Controller';
    let method = 'configuration@' + appName;
    return new Promise((resolve, reject) => {
      thunder.call(plugin, method).then((res) => {
        res.querystring = config_data;
        thunder.call(plugin, method, res).then((resp) => {
          resolve(true);
        }).catch((err) => {
          resolve(true);
        });
      }).catch((err) => {
        reject(err);
      });
    })
  }
  /**
   * Function to set the configuration of premium apps.
   * @param {appName} Name of the application
   * @param {config_data} config_data configuration data
   */

  configureApplication(appName, config_data) {
    let plugin = 'Controller';
    let method = 'configuration@' + appName;
    return new Promise((resolve, reject) => {
      thunder.call(plugin, method).then((res) => {
        res.querystring = config_data;
        thunder.call(plugin, method, res).then((resp) => {
          resolve(true);
        }).catch((err) => {
          resolve(true);
        })
      }).catch((err) => {
        reject(err);
      })
    })
  }
  /**
   * Function to launch Native app.
   * @param {String} url url of app.
   */
  launchNative(url) {
    const childCallsign = 'testApp'
    if (nativeUrl != url) {
      thunder
        .call('org.rdk.RDKShell', 'launchApplication', {
          client: childCallsign,
          uri: url,
          mimeType: 'application/native'
        })
        .then(() => {
          thunder.call('org.rdk.RDKShell', 'moveToFront', {
            client: childCallsign,
          })
          thunder.call('org.rdk.RDKShell', 'setFocus', {
            client: childCallsign,
          })
        })
        .catch(err => {
          console.log('org.rdk.RDKShell launch ' + JSON.stringify(err))
        })
    } else {
      thunder.call('org.rdk.RDKShell', 'moveToFront', {
        client: childCallsign,
      })
      thunder.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign })
    }
    nativeUrl = url
    activatedNative = true
  }



  /**
     * Function to kill native app.
     */
  killNative() {
    thunder.call('org.rdk.RDKShell', 'kill', { callsign: 'testApp' })
    activatedNative = false
    nativeUrl = ''
  }

  static pluginStatus(plugin) {
    switch (plugin) {
      case 'WebApp':
        return activatedWeb
      case 'Cobalt':
        return activatedCobalt
      case 'Lightning':
        return activatedLightning
      case 'Amazon':
        return activatedAmazon
      case 'Netflix':
        return activatedNetflix
    }
  }

  standby(value) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'setPowerState', { "powerState": value, "standbyReason": "Requested by user" })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          resolve(false)
        })
    })
  }

  audio_mute(value, audio_source) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'setMuted', { "audioPort": audio_source, "muted": value })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("audio mute error:", JSON.stringify(err, 3, null))
          resolve(false)
        })

    })
  }

  muteStatus(port) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getMuted', { audioPort: port })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log('audio mute error:', JSON.stringify(err, 3, null))
          reject(false)
        })
    })
  }

  enableDisplaySettings() {
    return new Promise((resolve, reject) => {
      thunder.call('org.rdk.RDKShell', 'launch', { callsign: 'org.rdk.DisplaySettings' })
        .then(result => {
          console.log('Successfully emabled DisplaySettings Service')
          resolve(result)
        })
        .catch(err => {
          console.log('Failed to enable DisplaySettings Service', JSON.stringify(err))
        })
    })
  }


  getVolumeLevel() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getVolumeLevel', { "audioPort": "HDMI0" })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("audio mute error:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  getSoundMode() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getSoundMode', {
          "audioPort": "HDMI0"
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting sound mode:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  setSoundMode(mode) {

    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'setSoundMode', {
          "audioPort": "HDMI0",
          "soundMode": mode,
          "persist": true

        })

        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in setting sound mode:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  getSupportedAudioModes() {

    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getSupportedAudioModes', {
          "audioPort": "HDMI0"
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting support audio sound mode:", JSON.stringify(err, 3, null))
          reject(false)
        })
    })
  }

  //Returns connected audio output ports (a subset of the ports supported on the device)
  getConnectedAudioPorts() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getConnectedAudioPorts', {})
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("audio mute error:", JSON.stringify(err, 3, null))
          resolve(false)
        })

    })
  }


  //Enable or disable the specified audio port based on the input audio port ID. 
  setEnableAudioPort(port) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'setEnableAudioPort', {
          "audioPort": port, "enable": true
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting support audio sound mode:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }


  getDRCMode() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getDRCMode', { "audioPort": "HDMI0" })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error while getting the DRC", JSON.stringify(err))
          resolve(false)
        })
    })
  }

  setDRCMode(DRCNum) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'setDRCMode', {
          "DRCMode": DRCNum
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error while setting the DRC", JSON.stringify(err))
          resolve(false)
        })
    })
  }


  getZoomSetting() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getZoomSetting')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error while getting Zoom Setting", JSON.stringify(err))
          resolve(false)
        })
    })
  }

  setZoomSetting(zoom) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'setZoomSetting', { "zoomSetting": zoom })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error while setting the Zoom", JSON.stringify(err))
          resolve(false)
        })
    })
  }


  getEnableAudioPort(audioPort) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getEnableAudioPort', { "audioPort": audioPort })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error while getting Enabled Audio port ", JSON.stringify(err))
          resolve(false)
        })
    })
  }


  getSupportedAudioPorts() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getSupportedAudioPorts')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error while getting S upported audio ports ", JSON.stringify(err))
          resolve(false)
        })
    })
  }


  getVolumeLevel() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getVolumeLevel')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error current volume level", JSON.stringify(err))
          resolve(false)
        })
    })
  }


  setVolumeLevel(port, volume) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'setVolumeLevel', { "audioPort": port, "volumeLevel": volume })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error while setting current volume level", JSON.stringify(err))
          resolve(false)
        })
    })
  }

  //________________________________________________________________________________________________________________________



  //OTHER SETTINGS PAGE API

  //1. UI VOICE

  //Start a speech
  speak() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.TextToSpeech', 'speak', {
          "text": "speech_1"
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in speak:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  //Resume a speech
  resume() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.TextToSpeech', 'resume', {
          "speechid": 1
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in resuming:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  //Pause a speech
  pause() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.TextToSpeech', 'pause', {
          "speechid": 1
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in pausing:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  // 2. TTS Options
  getlistVoices() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.TextToSpeech', 'listvoices', {
          "language": "en-US"
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting voices:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  // 3. Sync Location
  syncLocation() {
    return new Promise((resolve, reject) => {
      thunder
        .call('LocationSync', 'sync')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in syncing location:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }



  getLocation() {
    return new Promise((resolve, reject) => {
      thunder
        .call('LocationSync', 'location')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting location:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }
  // 4. Check for Firmware Update

  //Get Firmware Update Info
  getFirmwareUpdateInfo() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'getFirmwareUpdateInfo')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting firmware update info:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  // Get Firmware Update State
  getFirmwareUpdateState() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'getFirmwareUpdateState')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting firmware update state:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }
  // Get Firmware download info
  getDownloadFirmwareInfo() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'getDownloadedFirmwareInfo')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting downloaded info:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  //Get serial number
  getSerialNumber() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'getSerialNumber')
        .then(result => {
          console.log(JSON.stringify(result, 3, null))
          resolve(result)
        })
        .catch(err => {
          resolve('N/A')
        })
    })
  }

  //Get system versions
  getSystemVersions() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'getSystemVersions')
        .then(result => {
          console.log(JSON.stringify(result, 3, null))
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting downloaded percentage:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  //Update firmware
  updateFirmware() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'updateFirmware')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in firmware update:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  //Get download percentage
  getFirmwareDownloadPercent() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'getFirmwareDownloadPercent')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting downloaded percentage:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  // device Identification
  getDeviceIdentification() {
    return new Promise((resolve, reject) => {
      thunder
        .call('DeviceIdentification', 'deviceidentification')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting device Identification:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }



  // 5. Device Info
  systeminfo() {
    return new Promise((resolve, reject) => {
      thunder
        .call('DeviceInfo', 'systeminfo')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting system info:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  // 6. Reboot
  reboot() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'reboot', {
          "rebootReason": "FIRMWARE_FAILURE"
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in reboot:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  // get prefered standby mode

  getPreferredStandbyMode() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'getPreferredStandbyMode').then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getPreferredStandbyMode:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  setPreferredStandbyMode(standbyMode) {
    console.log("setPreferredStandbyMode called : " + standbyMode)
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.System', 'setPreferredStandbyMode', {
          "standbyMode": standbyMode
        }).then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in setPreferredStandbyMode:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  registerChangeLocation() {
    var callsign = "LocationSync"
    thunder
      .call('Controller', 'activate', { callsign: callsign })
      .then(result => {
        thunder.on(callsign, "locationchange", notification => {
          console.log("location was changed and the notification = ", notification);
        })
      }).catch(err => {
        console.log(err)
      })
  }

  async sendAppState(value) {
    const state = await thunder
      .call('org.rdk.RDKShell', 'getState', {})
      .then(result => result.state);
    this.state = state;
    let params = { applicationName: value, state: 'stopped' };
    for (var i = 0; i < state.length; i++) {
      if (state[i].callsign == value) {

        if (state[i].state == 'resumed') {
          activatedCobalt = true
          params.state = 'running';
        } else if (state[i].state == 'suspended') {
          params.state = 'suspended';
        } else {
          params.state = 'stopped'
        };

      }
    }
    if (params.state === 'stopped') {
      activatedCobalt = false
    }
    await thunder
      .call('org.rdk.Xcast', 'onApplicationStateChanged', params)
      .then(result => result.success);

  }
  //NETWORK INFO APIS

  //1. Get IP Setting
  getIPSetting(defaultInterface) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.Network', 'getIPSettings', {
          "interface": defaultInterface,
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting network info:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  //2. Get default interface
  getDefaultInterface() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.Network', 'getDefaultInterface')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting default interface:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  //3. Is interface enabled
  isInterfaceEnabled() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.Network', 'isInterfaceEnabled', {
          "interface": "WIFI"
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in checking the interface:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  //4. Get interfaces
  getInterfaces() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.Network', 'getInterfaces')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting interfaces:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

  //5. getConnectedSSID
  getConnectedSSID() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.Wifi', 'getConnectedSSID')
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log("error in getting connected SSID:", JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

}
