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
import {Log} from '@lightningjs/sdk'
import thunder from "./ThunderInstance"
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

  getPluginStatus(plugin) {
    return new Promise((resolve, reject) => {
      Log.info(`g plugin status`);
      thunder.call('Controller', `status@${plugin}`)
        .then(result => {
          Log.info(`result = `,result)
          resolve(result)
        })
        .catch(err => {
          Log.error(err)
          reject(err)
        })
    })
  }
  /**
   * Function to launch Netflix/Amazon Prime app.
   */
  launchApp(childCallsign,url) {
    let params = {}
    if(url !== undefined && childCallsign !== "Cobalt"){ //for cobalt url is passed through deep link method instead of launch
      params = {
        "callsign": childCallsign,
        "type": childCallsign,
        "uri": url
      }
    } else {
      params = {
        "callsign": childCallsign,
        "type": childCallsign
      }
    }
    return new Promise((resolve, reject) => {
      thunder.call('org.rdk.RDKShell', 'launch', params).then(res => {
        Log.info(res)
        //redundant calls for moveToFront and setFocus, as some apps needs it when launched from suspended state
        if(res.success){
          thunder.call("org.rdk.RDKShell", "setFocus", {
            "client": childCallsign,
            "callsign": childCallsign
          }).then(res => {
            if(res.success) {
              thunder.call('org.rdk.RDKShell', 'setVisibility', {
                client: 'ResidentApp',
                visible: false,
              })
              thunder.call("org.rdk.RDKShell", "moveToFront", {
                "client": childCallsign,
                "callsign": childCallsign
              }).catch(err => {
                console.error("failed to move moveToFront to: ", childCallsign, " ERROR: ",JSON.stringify(err))
              })
            }
          }).catch(err => {
            console.error("failed to move setFocus to: ", childCallsign," ERROR: ",JSON.stringify(err))
          })
          if(childCallsign === "Cobalt" && url){ //passing url to cobalt once launched
            thunder.call(childCallsign, 'deeplink', url)
          }
          resolve(true); //launch success no need to worry about setFocus and moveToFront
        } else {
          console.error("failed to launch app: ", childCallsign,"(success false) ERROR: ",JSON.stringify(res))
          reject(false)
        }
      }).catch(err => {
        console.error("failed to launch app: ", childCallsign," ERROR: ",JSON.stringify(err))
        reject(err)
      })
    })
  }

  suspendOrDestroyApp(childCallsign , mode) {
    return new Promise((resolve, reject) => {
      thunder.call('org.rdk.RDKShell', mode,  {"callsign": childCallsign}).then(res => {
        Log.info(res)
        //redundant calls for moveToFront and setFocus, as some apps needs it when launched from suspended state
        if(res.success){
          thunder.call("org.rdk.RDKShell", "setFocus", {
            "client": 'ResidentApp',
            "callsign": 'ResidentApp'
          }).then(res => {
            if(res.success) {
              thunder.call('org.rdk.RDKShell', 'setVisibility', {
                client: 'ResidentApp',
                visible: true,
              })
              thunder.call("org.rdk.RDKShell", "moveToFront", {
                "client": 'ResidentApp',
                "callsign": 'ResidentApp'
              }).catch(err => {
                console.error("failed to move moveToFront to: ", 'ResidentApp', " ERROR: ",JSON.stringify(err))
              })
            }
          }).catch(err => {
            console.error("failed to move setFocus to: ", 'ResidentApp'," ERROR: ",JSON.stringify(err))
          })
          resolve(true); //launch success no need to worry about setFocus and moveToFront
        } else {
          console.error("failed to exit app: ", childCallsign,"(success false) ERROR: ",JSON.stringify(res))
          reject(false)
        }
      }).catch(err => {
        console.error("failed to exit app: ", childCallsign," ERROR: ",JSON.stringify(err))
        reject(err)
      })
    })
  }

  

  /**
   * Function to set visibility to client apps.
   * @param {client} clients client app.
   * @param {visible} visible value of visibility.
   */
  setVisibilityandFocus(client, visible) {
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
          Log.error('Set focus error', JSON.stringify(err))
          reject(false)
        })
    })
  }

  changeVisibility(client, visible) {
    return new Promise((resolve, reject) => {
      thunder.call('org.rdk.RDKShell', 'setVisibility', {
        client: client,
        visible: visible,
      })
    })
  }

  


  moveToFront(cli) {
    thunder.call('org.rdk.RDKShell', 'moveToFront', { client: cli, callsign: cli })
  }

  setFocus(cli) {
    thunder.call('org.rdk.RDKShell', 'setFocus', { client: cli })
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


}
