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
import ThunderJS from "ThunderJS";
const config = {
  host: "127.0.0.1",
  port: 9998,
  default: 1,
};
const thunder = ThunderJS(config);
const systemcCallsign = "DTV";
let playerID = -1; //set to -1 to indicate nothing is currently playing

//plugin is activated by default, no need to call explicitly
export default class DTVApi {
  activate() {
    return new Promise((resolve, reject) => {
      // resolve(true); //#forTesting
      thunder.Controller.activate({ callsign: systemcCallsign })
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.log("DTV Error Activation", err);
          reject(err);
        });
    });
  }
  deactivate() {
    return new Promise((resolve, reject) => {
      thunder.Controller.deactivate({ callsign: systemcCallsign })
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.log("DTV Error Deactivation", err);
          reject(err);
        });
    });
  }
  //gets the number of available countries
  noOfCountries() {
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, "numberOfCountries")
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log("Error: noOfCountries: ", JSON.stringify(err));
          reject(err);
        });
    });
  }
  //returns the list of the available countries
  countryList() {
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, "countryList")
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log("Error: countryList: ", JSON.stringify(err));
          reject(err);
        });
    });
  }

  //returns the list of services(channels with name, uri and other details)
  serviceList() {
    let arr = [
    { shortname: 'Amazon Prime', dvburi: 'OTT', lcn: 0 },
    { shortname: 'Netflix', dvburi: 'OTT', lcn: 0 },
    { shortname: 'Youtube', dvburi: 'OTT', lcn: 0 }
    ];
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, "serviceList@dvbs")
        .then((result) => {
          console.log("serviceListResult: ", JSON.stringify(result));
          arr.concat(result)
          resolve(arr);
        })
        .catch((err) => {
          console.log("Error: serviceList: ", JSON.stringify(err));
          resolve(arr);
        });
    });
  }

  //returns the schedule for the given channel with provided dvburi
  scheduleEvents(dvburi) {
    let method = 'scheduleEvents@' + dvburi
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, method)
        .then((result) => {
          console.log("scheduleEventsResult: ", JSON.stringify(result));
          for (let show of result) {
            show.starttime *= 1000;
            show.duration *= 1000;
          }
          resolve(result);
        })
        .catch((err) => {
          console.log("Error: scheduleEvents: ", JSON.stringify(err));
          reject(err);
        });
    });
  }

  //lists the satellites available
  satelliteList() {
    return new Promise((resolve, reject) => {
      // resolve([{name: "Satellite 1",longitude: 282,lnb: "Universal" },{name: "Satellite 2",longitude: 282,lnb: "Universal" }]) //#forTesting
      thunder
        .call(systemcCallsign, "satelliteList")
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log("Error: satelliteList: ", JSON.stringify(err));
          reject(err);
        });
    });
  }
  //returns the available polarity options for dvb-s scan, returns a list of static values
  polarityList() {
    return new Promise((resolve, reject) => {
      resolve(["horizontal", "vertical", "left", "right"]);
    });
  }

  //returns the available symbolRate options for dvb-s scan, returns a list of static values
  symbolRateList() {
    return new Promise((resolve, reject) => {
      resolve(["22000", "23000", "27500", "29500"]); //values can be edited/entered custom from UI, no need to mention custom here
    });
  }
  //returns the available FEC options for dvb-s scan, returns a list of static values
  fecList() {
    return new Promise((resolve, reject) => {
      resolve([
        "fecauto",
        "fec1_2",
        "fec2_3",
        "fec3_4",
        "fec5_6",
        "fec7_8",
        "fec1_4",
        "fec1_3",
        "fec2_5",
        "fec8_9",
        "fec9_10",
        "fec3_5",
        "fec4_5",
      ]);
    });
  }
  //returns the available modulation options for dvb-s scan, returns a list of static values
  modulationList() {
    return new Promise((resolve, reject) => {
      resolve(["auto", "qpsk", "8psk", "16qam"]);
    });
  }
  //returns the available searchtype(searchmode) options for dvb-s scan, returns a list of static values
  searchtypeList() {
    return new Promise((resolve, reject) => {
      resolve(["frequency", "network"]);
    });
  }
  //initiates a service search for the provided params
  startServiceSearch(params) {
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, "startServiceSearch", params)
        .then((result) => {
          //console.log("serviceSearchResult: ", JSON.stringify(result));
          resolve(result);
        })
        .catch((err) => {
          console.log("serviceSearchError: ", JSON.stringify(err));
          reject(err);
        });
    });
  }
  //returns the number of available services(channels)
  noOfServices() {
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, "numberOfServices")
        .then((result) => {
          //console.log("numberOfServicesResult: ", JSON.stringify(result));
          resolve(result);
        })
        .catch((err) => {
          console.log("Error: numberOfServices: ", JSON.stringify(err));
          reject(err);
        });
    });
  }

  //returns the current and next event details for the given channel with provided dvburi
  nowNextEvents(dvburi) {
    let method = "nowNextEvents@" + dvburi;
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, method)
        .then((result) => {
          //console.log("nowNextEventsResult: ", JSON.stringify(result));
          resolve(result);
        })
        .catch((err) => {
          console.log("Error: nowNextEvents: ", JSON.stringify(err));
          reject(err);
        });
    });
  }

  
  startPlaying(params) {
    //params contains dvburi and lcn
    console.log("PARAMS: startPlaying: ", JSON.stringify(params));
    if (playerID !== -1) {
      this.stopPlaying();
      return Promise.reject("something is still playing Please retry");
    }
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, "startPlaying", params)
        .then((result) => {
          console.log("RESULT: startPlaying: ", JSON.stringify(result));
          if (result === -1) {
            reject("Can't be played");
          } else {
            playerID = result; //to be used in stopPlaying method
            resolve(result);
          }
        })
        .catch((err) => {
          console.log("ERROR: startPlaying: ", JSON.stringify(err));
          reject(err);
        });
    });
  }

  stopPlaying() {
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, "stopPlaying", playerID)
        .then((result) => {
          //playerID is retuned from startPlaying method
          console.log("RESULT: stopPlaying: ", JSON.stringify(result)); //result is always null
          playerID = -1; //to set that nothing is being played currently
          resolve(true);
        })
        .catch((err) => {
          console.log("ERROR: stopPlaying: ", JSON.stringify(err));
          reject(err);
        });
    });
  }

  launchChannel(dvburi) {
    console.log("PARAMS: launchChannel: ", JSON.stringify(dvburi));
    if(playerID!== -1){
      this.exitChannel()
      console.log("launchChannel: FAIL: something is still playing, trying to call exitChannel")
      return Promise.reject("Fail: something is still playing")
    }
    return new Promise((resolve, reject) => {
      let port = "8080"; //try to fetch it later
      let cmd = "open"; //add other methods also
      let url = "http://127.0.0.1:" + port + "/vldms/sessionmgr/" + cmd;
      let data = {
        "openRequest": {
          "type": "main",
          "locator": "dtv://"+dvburi,
          "playerParams": {
            "subContentType": "live",
            "window": "0,0,1920,1080",
            "videoBlank": false,
          },
        },
      };
      let params = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
      console.log("launchChannel: url & params: ", JSON.stringify(url), JSON.stringify(params))
      fetch(url,params).then(response => response.json()).then(result => {
        console.log("launchChannel: SUCCESS: ",JSON.stringify(result))
        playerID = result.openStatus.sessionId
        console.log("launchChannel: SESSIONID: ",playerID)
        resolve(result)
      }).catch(err => {
        console.log("launchChannel: FAILED: ",JSON.stringify(err))
        reject(err)
      })
    });
  }

  exitChannel() {
    return new Promise((resolve, reject) => {
      let port = "8080"; //try to fetch it later
      let cmd = "close"; //add other methods also
      let url = "http://127.0.0.1:" + port + "/vldms/sessionmgr/" + cmd;
      let data = { "closeRequest": { "sessionId": playerID } };
      let params = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
      console.log("exitChannel: url & params: ", JSON.stringify(url), JSON.stringify(params))
      fetch(url,params).then(response => response.json()).then(result => {
        console.log("exitChannel: SUCCESS: ",JSON.stringify(result))
        playerID = -1
        resolve(result)
      }).catch(err => {
        console.log("exitChannel: FAILED: ",JSON.stringify(err))
        reject(err)
      })
    });
  }
}
