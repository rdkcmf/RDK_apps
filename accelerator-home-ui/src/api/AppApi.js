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
import { Registry, Settings, Storage } from '@lightningjs/sdk';
import HDMIApi from './HDMIApi';;
import NetflixIIDs from "../../static/data/NetflixIIDs.json";
import HomeApi from './HomeApi';

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

  isConnectedToInternet() {
    return new Promise((resolve, reject) => {
      let header = new Headers();
      header.append('pragma', 'no-cache');
      header.append('cache-control', 'no-cache');

      fetch("https://apps.rdkcentral.com/rdk-apps/accelerator-home-ui/index.html", { method: 'GET', headers: header, }).then(res => {
        if (res.status >= 200 && res.status <= 300) {
          console.log("Connected to internet");
          resolve(true)
        } else {
          console.log("No Internet Available");
          resolve(false)
        }
      }).catch(err => {
        console.log("Internet Check failed: No Internet Available");
        resolve(false); //fail of fetch method needs to be considered as no internet
      })

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
          resolve(undefined)
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


  getPluginStatus(plugin) {
    return new Promise((resolve, reject) => {
      thunder.call('Controller', `status@${plugin}`)
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(err)
        })
    })
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
   * Function to launch All types of apps.
   * @param {String} callsign callsign of the particular app.
   * @param {string} url optional for youtube, netflix, required for Lightning and WebApps
   * @param {boolean} preventInternetCheck optional | true will prevent bydefault check for internet
   * @param {boolean} preventCurrentExit optional |  true will prevent bydefault launch of previous app
   * @param {string} launchLocation to pass launch location (IIDs) for Netflix currently | can be generalized for all apps.
   */

  async launchApp(callsign, url, preventInternetCheck, preventCurrentExit, launchLocation) {

    console.log("launchApp called with params: ", callsign, url, preventInternetCheck, preventCurrentExit, launchLocation);

    let IIDqueryString = "";
    let netflixIIDs = await this.getNetflixIIDs();
    if(callsign === "Netflix"){
      if(launchLocation){
        IIDqueryString = `source_type=${netflixIIDs[launchLocation].sourceType}&iid=${netflixIIDs[launchLocation].iid}`;
        if(url){
          IIDqueryString = "&"+IIDqueryString; //so that IIDqueryString can be appended with url later.
        }
      }else {
        console.log("launchLocation(IID) not specified while launching netflix");
      }
    }

    const availableCallsigns = ["Amazon", "Cobalt", "HtmlApp", "LightningApp", "Netflix"];

    if (!availableCallsigns.includes(callsign)) {
      return Promise.reject("Can't launch App: " + callsign + " | Error: callsign not found!");
    }

    if (!preventInternetCheck) {
      let internet = await this.isConnectedToInternet();
      if (!internet) {
        return Promise.reject("No Internet Available, can't launchApp.");
      }
    }

    const currentApp = Storage.get("applicationType"); //get it from stack if required. | current app ==="" means residentApp

    let pluginStatus, pluginState;// to check if the plugin is active, resumed, deactivated etc
    try {
      pluginStatus = await this.getPluginStatus(callsign);
      pluginState = pluginStatus[0].state;
    } catch (err) {
      console.log(err);
      return Promise.reject("PluginError: " + callsign + ": App not supported on this device | Error: " + JSON.stringify(err));
    }
    console.log("pluginStatus: " + JSON.stringify(pluginStatus) + " pluginState: ", JSON.stringify(pluginState));

    if (callsign === "Netflix"){
      if (pluginState === "deactivated" || pluginState === "deactivation"){ //netflix cold launch scenario
        Router.navigate('image', { src: Utils.asset('images/apps/App_Netflix_Splash.png')}); //to show the splash screen for netflix
        if (url) {
          try{
            console.log("Netflix ColdLaunch passing netflix url & IIDqueryString using configureApplication method:  ",url,IIDqueryString);
            await this.configureApplication("Netflix",url+IIDqueryString);
          } catch(err) {
            console.log("Netflix configureApplication error: ",err);
          }
        } else {
          try{
            console.log("Netflix ColdLaunch passing netflix IIDqueryString using configureApplication method:  ",IIDqueryString);
            await this.configureApplication("Netflix",IIDqueryString);
          } catch(err) {
            console.log("Netflix configureApplication error: ",err);
          }
        }
      } else { //netflix hot launch scenario
        if(url){
          try{
            console.log("Netflix HotLaunch passing netflix url & IIDqueryString using systemcommand method: ",url,IIDqueryString);
            await thunder.call("Netflix", "systemcommand", { command: url+IIDqueryString });
          } catch(err) {
            console.log("Netflix systemcommand error: ",err);
          }
        }
        else {
          try{
            console.log("Netflix HotLaunch passing netflix IIDqueryString using systemcommand method: ",IIDqueryString);
            await thunder.call("Netflix", "systemcommand", { command: IIDqueryString });
          } catch(err) {
            console.log("Netflix systemcommand error: ",err);
          }
        }
     }
    }

    //activating the plugin might not be necessary as rdkShell.launch will activate the plugin by default
    // if(pluginState==="Deactivated" || pluginState==="Deactivation"){
    //   console.log("activating the plugin that has the state: " + JSON.stringify(pluginState))
    //   thunder.Controller.activate({ callsign: systemcCallsign })
    // } 

    let params = {};
    if (url && (callsign==="LightningApp" || callsign === "HtmlApp")) { //for lightning/htmlapp url is passed via rdkshell.launch method
      params = {
        "callsign": callsign,
        "type": callsign,
        "uri": url
      }
    } else {
      params = {
        "callsign": callsign,
        "type": callsign
      }
    }

    if (!preventCurrentExit && currentApp !== "") { //currentApp==="" means currently on residentApp | make currentApp = "residentApp" in the cache and stack
      try {
        console.log("calling exitApp with params: callsign and exitInBackground", currentApp, "true")
        await this.exitApp(currentApp, true)
      }
      catch (err) {
        console.log("currentApp exit failed!: launching new app...")
      }
    }

    if (currentApp === "" && callsign !== "Netflix") { //currentApp==="" means currently on residentApp | make currentApp = "residentApp" in the cache and stack | for netflix keep the splash screen visible till it launches
      thunder.call('org.rdk.RDKShell', 'setVisibility', {
        "client": "ResidentApp",
        "visible": false,
      })
    }

    return new Promise((resolve, reject) => {
      thunder.call("org.rdk.RDKShell", "launch", params).then(res => {
        if (res.success) {
          thunder.call("org.rdk.RDKShell", "moveToFront", {
            "client": callsign,
            "callsign": callsign
          }).catch(err => {
            console.error("failed to moveToFront : ", callsign, " ERROR: ", JSON.stringify(err), " | fail reason can be since app is already in front")
          })

          thunder.call("org.rdk.RDKShell", "setFocus", {
            "client": callsign,
            "callsign": callsign
          }).catch(err => {
            console.error("failed to setFocus : ", callsign, " ERROR: ", JSON.stringify(err))
          })

          thunder.call("org.rdk.RDKShell", "setVisibility", {
            "client": callsign,
            "visible": true
          }).catch(err => {
            console.error("failed to setVisibility : ", callsign, " ERROR: ", JSON.stringify(err))
          })

          if(callsign === "Netflix") {
            console.log("Netflix launched: hiding residentApp");
            thunder.call('org.rdk.RDKShell', 'setVisibility', {
              "client": "ResidentApp",
              "visible": false,
            }); //if netflix splash screen was launched resident app was kept visible Netflix until app launched.
            
          }

          if (callsign === "Cobalt" && url) { //passing url to cobalt once launched
            thunder.call(callsign, 'deeplink', url)
          }

          Storage.set("applicationType", callsign);

          resolve(res);

        } else {
          console.error("failed to launchApp(success false) : ", callsign, " ERROR: ", JSON.stringify(res))
          reject(res)
        }
      }).catch(err => {
        console.error("failed to launchApp: ", callsign, " ERROR: ", JSON.stringify(err), " | Launching residentApp back")

        //destroying the app incase it's stuck in launching | if taking care of ResidentApp as callsign, make sure to prevent destroying it
        thunder.call('org.rdk.RDKShell', 'destroy', { "callsign": callsign });
        this.launchResidentApp();

        reject(err)
      })
    })

  }


  /**
   * Function to launch Exit types of apps.
   * @param {String} callsign callsign of the particular app.
   * @param {boolean} exitInBackground to make the app not bring up residentApp on exit
   * @param {boolean} forceDestroy to force the app to do rdkshell.destroy instead of suspend
   */

  // exit method does not need to launch the previous app.
  async exitApp(callsign, exitInBackground, forceDestroy) { //test the new exit app method

    if (callsign === "") { //previousApp==="" means it's residentApp | change it to residentApp in cache and here
      return Promise.reject("Can't exit from ResidentApp");
    }

    if (callsign === "HDMI") {
      console.log("exit method called for hdmi")
      new HDMIApi().stopHDMIInput()
      Storage.set("_currentInputMode", {});
      if (!exitInBackground) { //means resident App needs to be launched
        this.launchResidentApp();
      }
      return Promise.resolve(true);
      //check for hdmi scenario
    }

    if (callsign === "LightningApp" || callsign === "HtmlApp") {
      forceDestroy = true //html and lightning apps need not be suspended.
    }

    let pluginStatus, pluginState;// to check if the plugin is active, resumed, deactivated etc
    try {
      pluginStatus = await this.getPluginStatus(callsign);
      if (pluginStatus !== undefined) {
        pluginState = pluginStatus[0].state;
        console.log("pluginStatus: " + JSON.stringify(pluginStatus) + " pluginState: ", JSON.stringify(pluginState));
      }
      else {
        return Promise.reject("PluginError: " + callsign + ": App not supported on this device");
      }
    } catch (err) {
      return Promise.reject("PluginError: " + callsign + ": App not supported on this device | Error: " + JSON.stringify(err));
    }

    if (!exitInBackground) { //means resident App needs to be launched
      this.launchResidentApp();
    }

    //to hide the current app
    console.log("setting visibility of " + callsign + " to false")
    await thunder.call("org.rdk.RDKShell", "setVisibility", {
      "client": callsign,
      "visible": false
    }).catch(err => {
      console.error("failed to setVisibility : " + callsign + " ERROR: ", JSON.stringify(err))
    })


    if (forceDestroy) {
      console.log("Force Destroying the app: ", callsign)
      await thunder.call('org.rdk.RDKShell', 'destroy', { "callsign": callsign });
      return Promise.resolve(true);
    }
    else {
      console.log("Exiting from App: ", callsign, " depending on platform settings enableAppSuspended: ", Settings.get("platform", "enableAppSuspended"));
      //enableAppSuspended = true means apps will be suspended by default
      if (Settings.get("platform", "enableAppSuspended")) {
        await thunder.call('org.rdk.RDKShell', 'suspend', { "callsign": callsign }).catch(err => {
          console.error("Error in suspending app: ", callsign, " | trying to destroy the app");
          thunder.call('org.rdk.RDKShell', 'destroy', { "callsign": callsign });
        })
        return Promise.resolve(true)
      }
      else {
        await thunder.call('org.rdk.RDKShell', 'destroy', { "callsign": callsign });
        return Promise.resolve(true);
      }
    }

  }



  /**
   * Function to launch ResidentApp explicitly(incase of special scenarios)
   * Prefer using launchApp and exitApp for ALL app launch and exit scenarios.
   */

  async launchResidentApp() {
    console.log("launchResidentApp got Called: setting visibility, focus and moving to front the ResidentApp")
    await thunder.call("org.rdk.RDKShell", "moveToFront", {
      "client": "ResidentApp",
      "callsign": "ResidentApp"
    }).catch(err => {
      console.error("failed to moveToFront : ResidentApp ERROR: ", JSON.stringify(err), " | fail reason can be since app is already in front")
    })

    await thunder.call("org.rdk.RDKShell", "setFocus", {
      "client": "ResidentApp",
      "callsign": "ResidentApp"
    }).catch(err => {
      console.error("failed to setFocus : ResidentApp ERROR: ", JSON.stringify(err))
    })

    await thunder.call("org.rdk.RDKShell", "setVisibility", {
      "client": "ResidentApp",
      "visible": true
    }).catch(err => {
      console.error("failed to setVisibility : ResidentApp ERROR: ", JSON.stringify(err))
    })

    Storage.set("applicationType", ""); //since it's residentApp aplication type is "" | change application type to ResidentApp 
  }


  async getNetflixIIDs() {
    let defaultIIDs = NetflixIIDs;
    let data = new HomeApi().getPartnerAppsInfo();
    if(!data) {
      return defaultIIDs;
    }
    console.log("homedata: ",data);
    try {
      data = await JSON.parse(data);
      if (data != null && data.hasOwnProperty("netflix-iid-file-path")) {
        let url = data["netflix-iid-file-path"]
        console.log(`Netflix : requested to fetch iids from `, url)
        const fetchResponse = await fetch(url);
        const fetchData = await fetchResponse.json();
        return fetchData;
      } else {
        console.log("Netflix IID file path not found in conf file, using deffault IIDs");
        return defaultIIDs;
      }
    }catch(err){
      console.log("Error in fetching iid data from specified path, returning defaultIIDs | Error:",err);
      return defaultIIDs;
    }
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
          .then((res) => {

            console.log(`WebApp : webapp launch resulted in : `, JSON.stringify(res));
            this.setVisibility("ResidentApp", false)
            thunder.call('org.rdk.RDKShell', 'moveToFront', {
              client: childCallsign,
            })
            resolve(true)

          })
          .catch(err => {
            console.error("WebApp : error while launching web : ", JSON.stringify(err))
            reject(false)
          })
      } else {
        thunder.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign,
        })
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign })
        resolve(true)
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
    return new Promise((resolve, reject) => {
      const childCallsign = 'LightningApp'
      if (lightningUrl != url) {
        thunder
          .call('org.rdk.RDKShell', 'launch', {
            callsign: 'Lightning',
            type: childCallsign,
            uri: url,
          })
          .then((res) => {
            console.log(`Lightning : launch lightning results in `, JSON.stringify(res));
            resolve(true)
          })
          .catch(err => {
            console.error("Lightning : error while launching lightning : ", JSON.stringify(err))
            reject(false)
          })
      } else {
        thunder.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign,
        })
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign })
        resolve(true)
      }
      lightningUrl = url
      activatedLightning = true
    })

  }

  /**
   * Function to launch Cobalt app.
   * @param {String} url url of app.
   */
  launchCobalt(url) {
    return new Promise((resolve, reject) => {
      const childCallsign = 'Cobalt'
      thunder
        .call('org.rdk.RDKShell', 'launch', {
          callsign: childCallsign,
          type: childCallsign
        })
        .then((res) => {
          if (url) {
            thunder.call('Cobalt', 'deeplink', url)
          }
          this.setVisibility("ResidentApp", false)
          thunder.call('org.rdk.RDKShell', 'moveToFront', {
            client: "Cobalt",
          }).catch(err => { console.error(err) })
          thunder.call("org.rdk.RDKShell", "setFocus", { client: childCallsign }).catch(err => { console.error(err) });
          Storage.set("applicationType", "Cobalt");
          console.log("Cobalt : launch cobalt results in ", JSON.stringify(res))
          resolve(true)
        })
        .catch(err => {
          console.error("Cobalt : error while launching cobalt : ", JSON.stringify(err))
          reject(err)
        })
      activatedCobalt = true
    })

  }


  /*  
   *Function to launch apps in hidden mode
   */
  launchPremiumAppInSuspendMode(childCallsign) {

    return new Promise((resolve, reject) => {

      thunder
        .call("org.rdk.RDKShell", "launch", {
          callsign: childCallsign,
          type: childCallsign,
          suspend: true,
          visible: false,
          focused: false,
        })
        .then((res) => {

          if (childCallsign == "Netflix") {
            console.log(`Netflix : launch netflix results in :`, res);
          }
          else {
            console.log(`Amazon : launch amazon results in :`, res);
          }
          resolve(true)

        })
        .catch(err => {

          if (childCallsign == "Netflix") {
            console.error(`Netflix : error while launching netflix :`, err);
          }
          else {
            console.log(`Amazon : error while launching amazon :`, err);
          }
          reject(false)

        });


    })

  }

  /**
   * Function to launch Netflix/Amazon Prime app.
   */
  launchPremiumApp(childCallsign) {
    return new Promise((resolve, reject) => {
      thunder
        .call("org.rdk.RDKShell", "launch", {
          callsign: childCallsign,
          type: childCallsign,
          visible: true,
          focused: true
        })
        .then((res) => {
          if (childCallsign == "Netflix") {
            console.log(`Netflix : launch netflix results in :`, res);
          }
          else {
            console.log(`Amazon : launch amazon results in :`, res);
          }
          this.setVisibility(childCallsign, true)
          this.zorder(childCallsign)
          Storage.set("applicationType", childCallsign)
          console.log(`the current application Type : `, Storage.get("applicationType"));
          resolve(true)
        })
        .catch(err => {
          if (childCallsign == "Netflix") {
            console.error(`Netflix : error while launching netflix :`, err);
          }
          else {
            console.log(`Amazon : error while launching amazon :`, err);
          }
          reject(false)
        });
      childCallsign === 'Amazon' ? activatedAmazon = true : activatedNetflix = true;
    })

  }

  launchPremiumAppURL(childCallsign, url) {

    thunder
      .call("org.rdk.RDKShell", "launch", {
        callsign: childCallsign,
        type: childCallsign
      })
      .then(() => {
        thunder.call("org.rdk.RDKShell", "moveToFront", {
          client: childCallsign
        })
        thunder.call(childCallsign, 'deeplink', url)
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
    return new Promise((resolve, reject) => {
      const childCallsign = client
      thunder
        .call('org.rdk.RDKShell', 'launch', {
          callsign: childCallsign,
          type: 'ResidentApp',
          uri: url,
        })
        .then((res) => {
          console.log(`ResidentApp :  launching resident app resulted in : `, JSON.stringify(res));
          resolve(true)
        })
        .catch(err => {
          console.error('ResidentApp : error while launching residentApp : ' + JSON.stringify(err))
          reject(false)
        })
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
          console.log(`Overlay : launched overlay : `, res);
          resolve(res)
        })
        .catch(err => {
          console.error("Overlay : error while launching the overlay", err)
          reject(err)
        })
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
    thunder.call('org.rdk.RDKShell', 'suspend', { callsign: 'Lightning' })
  }




  /**
   * Function to suspend Netflix/Amazon Prime app.
   */
  suspendPremiumApp(appName) {
    return new Promise((resolve, reject) => {
      thunder.call('org.rdk.RDKShell', 'suspend', { callsign: appName }).then(res => {
        resolve(true);
      })
        .catch(err => {
          resolve(false)
        })
    })
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
    thunder.call('org.rdk.RDKShell', 'destroy', { callsign: 'Lightning' })
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
      if (visible) {
        thunder.call('org.rdk.RDKShell', 'setFocus', { client: client })
          .then(res => {
            resolve(true)
          })
          .catch(err => {
            console.log('Set focus error', JSON.stringify(err))
            reject(false)
          })
      }
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

  setFocus(cli) {
    thunder.call('org.rdk.RDKShell', 'setFocus', { client: cli })
  }


  moveToBack(cli) {
    thunder.call('org.rdk.RDKShell', 'moveToBack', { client: cli })
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
          reject(err); //resolve(true)
        });
      }).catch((err) => {
        reject(err);
      });
    })
  }
  /**
   * Function to launch Native app.
   * @param {String} url url of app.
   */
  launchNative(url) {
    return new Promise((resolve, reject) => {

      const childCallsign = 'testApp'
      thunder
        .call('org.rdk.RDKShell', 'launchApplication', {
          client: childCallsign,
          uri: url,
          mimeType: 'application/native'
        })
        .then((res) => {
          console.log("Native : launching native app resulted in : ", JSON.stringify(res))

          resolve(true)
        })
        .catch(err => {
          console.error('org.rdk.RDKShell launch ' + JSON.stringify(err))
          reject(err)
        })
      nativeUrl = url
      activatedNative = true

    })
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

  enableDisplaySettings() {
    return new Promise((resolve, reject) => {
      thunder.call('Controller', 'activate', { callsign: 'org.rdk.DisplaySettings' })
        .then(result => {

          console.log('Successfully enabled DisplaySettings Service')
          resolve(result)

        })
        .catch(err => {

          console.error('Failed to enable DisplaySettings Service', JSON.stringify(err))
          reject(err)

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
    mode = mode.startsWith("AUTO") ? "AUTO": mode
    console.log("mode",mode)
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

  getNetflixESN() {
    return new Promise((resolve) => {
      thunder.call('Netflix', 'esn')
        .then(res => {
          resolve(res)
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

  // Volume Apis

  getConnectedAudioPorts() {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getConnectedAudioPorts', {})
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log('audio mute error:', JSON.stringify(err, 3, null))
          reject(false)
        })
    })
  }

  getVolumeLevel(port) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getVolumeLevel', {
          audioPort: port,
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log('audio mute error:', JSON.stringify(err, 3, null))
          reject(false)
        })
    })
  }

  muteStatus(port) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'getMuted', {
          audioPort: port,
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log('audio mute error:', JSON.stringify(err, 3, null))
          reject(false)
        })
    })
  }

  setVolumeLevel(port, volume) {
    return new Promise((resolve, reject) => {
      thunder
        .call('org.rdk.DisplaySettings', 'setVolumeLevel', {
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
        .call('org.rdk.DisplaySettings', 'setMuted', {
          audioPort: audio_source,
          muted: value,
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.log('audio mute error:', JSON.stringify(err, 3, null))
          resolve(false)
        })
    })
  }

}
