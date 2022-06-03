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

//plugin is activated by default, no need to call explicitly
export default class DTVApi {
  activate() {
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, "serviceList@dvbs")
        .then((result) => {
          //console.log("serviceListResult: ", JSON.stringify(result));
          resolve(result);
        })
        .catch((err) => {
          console.log("Error: serviceList: ", JSON.stringify(err));
          reject(err);
        });
    });
  }
  //lists the satellites available
  satelliteList() {
    return new Promise((resolve, reject) => {
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
  //returns the schedule for the given channel with provided dvburi
  scheduleEvents(dvburi) {
    let method = "scheduleEvents@" + dvburi;
    return new Promise((resolve, reject) => {
      thunder
        .call(systemcCallsign, method)
        .then((result) => {
          //console.log("scheduleEventsResult: ", JSON.stringify(result));
          resolve(result);
        })
        .catch((err) => {
          console.log("Error: scheduleEvents: ", JSON.stringify(err));
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
}
