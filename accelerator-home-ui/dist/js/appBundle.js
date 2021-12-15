/*
 App version: 3.5 25/02/22
 SDK version: 4.8.1
 CLI version: 2.7.2

 gmtDate: Fri, 25 Feb 2022 09:54:42 GMT
*/
var APP_accelerator_home_ui = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step2(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step2(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step2 = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step2((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/deepmerge/dist/cjs.js
  var require_cjs = __commonJS({
    "node_modules/deepmerge/dist/cjs.js"(exports, module) {
      "use strict";
      var isMergeableObject = function isMergeableObject2(value) {
        return isNonNullObject(value) && !isSpecial(value);
      };
      function isNonNullObject(value) {
        return !!value && typeof value === "object";
      }
      function isSpecial(value) {
        var stringValue = Object.prototype.toString.call(value);
        return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
      }
      var canUseSymbol = typeof Symbol === "function" && Symbol.for;
      var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for("react.element") : 60103;
      function isReactElement(value) {
        return value.$$typeof === REACT_ELEMENT_TYPE;
      }
      function emptyTarget(val) {
        return Array.isArray(val) ? [] : {};
      }
      function cloneUnlessOtherwiseSpecified(value, options) {
        return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
      }
      function defaultArrayMerge(target, source, options) {
        return target.concat(source).map(function(element) {
          return cloneUnlessOtherwiseSpecified(element, options);
        });
      }
      function getMergeFunction(key, options) {
        if (!options.customMerge) {
          return deepmerge;
        }
        var customMerge = options.customMerge(key);
        return typeof customMerge === "function" ? customMerge : deepmerge;
      }
      function getEnumerableOwnPropertySymbols(target) {
        return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
          return target.propertyIsEnumerable(symbol);
        }) : [];
      }
      function getKeys(target) {
        return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
      }
      function propertyIsOnObject(object, property) {
        try {
          return property in object;
        } catch (_) {
          return false;
        }
      }
      function propertyIsUnsafe(target, key) {
        return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
      }
      function mergeObject(target, source, options) {
        var destination = {};
        if (options.isMergeableObject(target)) {
          getKeys(target).forEach(function(key) {
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
          });
        }
        getKeys(source).forEach(function(key) {
          if (propertyIsUnsafe(target, key)) {
            return;
          }
          if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
            destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
          } else {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
          }
        });
        return destination;
      }
      function deepmerge(target, source, options) {
        options = options || {};
        options.arrayMerge = options.arrayMerge || defaultArrayMerge;
        options.isMergeableObject = options.isMergeableObject || isMergeableObject;
        options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
        var sourceIsArray = Array.isArray(source);
        var targetIsArray = Array.isArray(target);
        var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
        if (!sourceAndTargetTypesMatch) {
          return cloneUnlessOtherwiseSpecified(source, options);
        } else if (sourceIsArray) {
          return options.arrayMerge(target, source, options);
        } else {
          return mergeObject(target, source, options);
        }
      }
      deepmerge.all = function deepmergeAll(array, options) {
        if (!Array.isArray(array)) {
          throw new Error("first argument should be an array");
        }
        return array.reduce(function(prev, next) {
          return deepmerge(prev, next, options);
        }, {});
      };
      var deepmerge_1 = deepmerge;
      module.exports = deepmerge_1;
    }
  });

  // node_modules/debounce/index.js
  var require_debounce = __commonJS({
    "node_modules/debounce/index.js"(exports, module) {
      function debounce4(func, wait, immediate) {
        var timeout3, args, context, timestamp, result;
        if (wait == null)
          wait = 100;
        function later() {
          var last = Date.now() - timestamp;
          if (last < wait && last >= 0) {
            timeout3 = setTimeout(later, wait - last);
          } else {
            timeout3 = null;
            if (!immediate) {
              result = func.apply(context, args);
              context = args = null;
            }
          }
        }
        ;
        var debounced = function() {
          context = this;
          args = arguments;
          timestamp = Date.now();
          var callNow = immediate && !timeout3;
          if (!timeout3)
            timeout3 = setTimeout(later, wait);
          if (callNow) {
            result = func.apply(context, args);
            context = args = null;
          }
          return result;
        };
        debounced.clear = function() {
          if (timeout3) {
            clearTimeout(timeout3);
            timeout3 = null;
          }
        };
        debounced.flush = function() {
          if (timeout3) {
            result = func.apply(context, args);
            context = args = null;
            clearTimeout(timeout3);
            timeout3 = null;
          }
        };
        return debounced;
      }
      debounce4.debounce = debounce4;
      module.exports = debounce4;
    }
  });

  // src/index.js
  var src_exports = {};
  __export(src_exports, {
    default: () => src_default
  });

  // node_modules/@lightningjs/sdk/src/Settings/index.js
  var settings = {};
  var subscribers = {};
  var initSettings = (appSettings, platformSettings) => {
    settings["app"] = appSettings;
    settings["platform"] = platformSettings;
    settings["user"] = {};
  };
  var publish = (key, value) => {
    subscribers[key] && subscribers[key].forEach((subscriber) => subscriber(value));
  };
  var dotGrab = (obj = {}, key) => {
    if (obj === null)
      return void 0;
    const keys = key.split(".");
    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]] = obj[keys[i]] !== void 0 ? obj[keys[i]] : {};
    }
    return typeof obj === "object" && obj !== null ? Object.keys(obj).length ? obj : void 0 : obj;
  };
  var Settings_default = {
    get(type, key, fallback = void 0) {
      const val = dotGrab(settings[type], key);
      return val !== void 0 ? val : fallback;
    },
    has(type, key) {
      return !!this.get(type, key);
    },
    set(key, value) {
      settings["user"][key] = value;
      publish(key, value);
    },
    subscribe(key, callback) {
      subscribers[key] = subscribers[key] || [];
      subscribers[key].push(callback);
    },
    unsubscribe(key, callback) {
      if (callback) {
        const index = subscribers[key] && subscribers[key].findIndex((cb) => cb === callback);
        index > -1 && subscribers[key].splice(index, 1);
      } else {
        if (key in subscribers) {
          subscribers[key] = [];
        }
      }
    },
    clearSubscribers() {
      for (const key of Object.getOwnPropertyNames(subscribers)) {
        delete subscribers[key];
      }
    }
  };

  // node_modules/@lightningjs/sdk/src/Log/index.js
  var prepLog = (type, args) => {
    const colors2 = {
      Info: "green",
      Debug: "gray",
      Warn: "orange",
      Error: "red"
    };
    args = Array.from(args);
    return ["%c" + (args.length > 1 && typeof args[0] === "string" ? args.shift() : type), "background-color: " + colors2[type] + "; color: white; padding: 2px 4px; border-radius: 2px", args];
  };
  var Log_default = {
    info() {
      Settings_default.get("platform", "log") && console.log.apply(console, prepLog("Info", arguments));
    },
    debug() {
      Settings_default.get("platform", "log") && console.debug.apply(console, prepLog("Debug", arguments));
    },
    error() {
      Settings_default.get("platform", "log") && console.error.apply(console, prepLog("Error", arguments));
    },
    warn() {
      Settings_default.get("platform", "log") && console.warn.apply(console, prepLog("Warn", arguments));
    }
  };

  // node_modules/@michieljs/execute-as-promise/src/execute-as-promise.js
  var execute_as_promise_default = (method, args = null, context = null) => {
    let result;
    if (method && typeof method === "function") {
      try {
        result = method.apply(context, args);
      } catch (e) {
        result = e;
      }
    } else {
      result = method;
    }
    if (result !== null && typeof result === "object" && result.then && typeof result.then === "function") {
      return result;
    } else {
      return new Promise((resolve, reject) => {
        if (result instanceof Error) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    }
  };

  // node_modules/@lightningjs/sdk/src/Metrics/index.js
  var sendMetric = (type, event, params) => {
    Log_default.info("Sending metric", type, event, params);
  };
  var initMetrics = (config7) => {
    sendMetric = config7.sendMetric;
  };
  var metrics = {
    app: ["launch", "loaded", "ready", "close"],
    page: ["view", "leave"],
    user: ["click", "input"],
    media: [
      "abort",
      "canplay",
      "ended",
      "pause",
      "play",
      "volumechange",
      "waiting",
      "seeking",
      "seeked"
    ]
  };
  var errorMetric = (type, message, code, visible, params = {}) => {
    params = __spreadValues({
      params
    }, {
      message,
      code,
      visible
    });
    sendMetric(type, "error", params);
  };
  var Metric = (type, events2, options = {}) => {
    return events2.reduce((obj, event) => {
      obj[event] = (name, params = {}) => {
        params = __spreadValues(__spreadValues(__spreadValues({}, options), name ? {
          name
        } : {}), params);
        sendMetric(type, event, params);
      };
      return obj;
    }, {
      error(message, code, params) {
        errorMetric(type, message, code, params);
      },
      event(name, params) {
        sendMetric(type, name, params);
      }
    });
  };
  var Metrics = (types) => {
    return Object.keys(types).reduce((obj, type) => {
      type === "media" ? obj[type] = (url) => Metric(type, types[type], {
        url
      }) : obj[type] = Metric(type, types[type]);
      return obj;
    }, {
      error: errorMetric,
      event: sendMetric
    });
  };
  var Metrics_default = Metrics(metrics);

  // node_modules/@lightningjs/sdk/src/VideoPlayer/events.js
  var events_default = {
    abort: "Abort",
    canplay: "CanPlay",
    canplaythrough: "CanPlayThrough",
    durationchange: "DurationChange",
    emptied: "Emptied",
    encrypted: "Encrypted",
    ended: "Ended",
    error: "Error",
    interruptbegin: "InterruptBegin",
    interruptend: "InterruptEnd",
    loadeddata: "LoadedData",
    loadedmetadata: "LoadedMetadata",
    loadstart: "LoadStart",
    pause: "Pause",
    play: "Play",
    playing: "Playing",
    progress: "Progress",
    ratechange: "Ratechange",
    seeked: "Seeked",
    seeking: "Seeking",
    stalled: "Stalled",
    timeupdate: "TimeUpdate",
    volumechange: "VolumeChange",
    waiting: "Waiting"
  };

  // node_modules/@lightningjs/sdk/src/helpers/autoSetupMixin.js
  var autoSetupMixin_default = (sourceObject, setup2 = () => {
  }) => {
    let ready = false;
    const doSetup = () => {
      if (ready === false) {
        setup2();
        ready = true;
      }
    };
    return Object.keys(sourceObject).reduce((obj, key) => {
      if (typeof sourceObject[key] === "function") {
        obj[key] = function() {
          doSetup();
          return sourceObject[key].apply(sourceObject, arguments);
        };
      } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).get === "function") {
        obj.__defineGetter__(key, function() {
          doSetup();
          return Object.getOwnPropertyDescriptor(sourceObject, key).get.apply(sourceObject);
        });
      } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).set === "function") {
        obj.__defineSetter__(key, function() {
          doSetup();
          return Object.getOwnPropertyDescriptor(sourceObject, key).set.sourceObject[key].apply(sourceObject, arguments);
        });
      } else {
        obj[key] = sourceObject[key];
      }
      return obj;
    }, {});
  };

  // node_modules/@lightningjs/sdk/src/helpers/easeExecution.js
  var timeout = null;
  var easeExecution_default = (cb, delay) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb();
    }, delay);
  };

  // node_modules/@lightningjs/sdk/src/Utils/index.js
  var basePath;
  var proxyUrl;
  var initUtils = (config7) => {
    basePath = ensureUrlWithProtocol(makeFullStaticPath(window.location.pathname, config7.path || "/"));
    if (config7.proxyUrl) {
      proxyUrl = ensureUrlWithProtocol(config7.proxyUrl);
    }
  };
  var Utils_default = {
    asset(relPath) {
      return basePath + relPath;
    },
    proxyUrl(url, options = {}) {
      return proxyUrl ? proxyUrl + "?" + makeQueryString(url, options) : url;
    },
    makeQueryString() {
      return makeQueryString(...arguments);
    },
    ensureUrlWithProtocol() {
      return ensureUrlWithProtocol(...arguments);
    }
  };
  var ensureUrlWithProtocol = (url) => {
    if (/^\/\//.test(url)) {
      return window.location.protocol + url;
    }
    if (!/^(?:https?:)/i.test(url)) {
      return window.location.origin + url;
    }
    return url;
  };
  var makeFullStaticPath = (pathname = "/", path) => {
    path = path.charAt(path.length - 1) !== "/" ? path + "/" : path;
    if (/^(?:https?:)?(?:\/\/)/.test(path)) {
      return path;
    }
    if (path.charAt(0) === "/") {
      return path;
    } else {
      pathname = cleanUpPathName(pathname);
      path = path.charAt(0) === "." ? path.substr(1) : path;
      path = path.charAt(0) !== "/" ? "/" + path : path;
      return pathname + path;
    }
  };
  var cleanUpPathName = (pathname) => {
    if (pathname.slice(-1) === "/")
      return pathname.slice(0, -1);
    const parts = pathname.split("/");
    if (parts[parts.length - 1].indexOf(".") > -1)
      parts.pop();
    return parts.join("/");
  };
  var makeQueryString = (url, options = {}, type = "url") => {
    options.operator = "metrological";
    options[type] = url;
    return Object.keys(options).map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent("" + options[key]);
    }).join("&");
  };

  // node_modules/@lightningjs/sdk/src/Profile/helpers.js
  var formatLocale = (locale) => {
    if (locale && locale.length === 2) {
      return `${locale.toLowerCase()}-${locale.toUpperCase()}`;
    } else {
      return locale;
    }
  };
  var getLocale = (defaultValue) => {
    if ("language" in navigator) {
      const locale = formatLocale(navigator.language);
      return Promise.resolve(locale);
    } else {
      return Promise.resolve(defaultValue);
    }
  };
  var getLanguage = (defaultValue) => {
    if ("language" in navigator) {
      const language3 = formatLocale(navigator.language).slice(0, 2);
      return Promise.resolve(language3);
    } else {
      return Promise.resolve(defaultValue);
    }
  };
  var getCountryCode = (defaultValue) => {
    if ("language" in navigator) {
      const countryCode = formatLocale(navigator.language).slice(3, 5);
      return Promise.resolve(countryCode);
    } else {
      return Promise.resolve(defaultValue);
    }
  };
  var hasOrAskForGeoLocationPermission = () => {
    return new Promise((resolve) => {
      if (Settings_default.get("platform", "forceBrowserGeolocation") === true)
        resolve(true);
      if ("permissions" in navigator && typeof navigator.permissions.query === "function") {
        navigator.permissions.query({
          name: "geolocation"
        }).then((status) => {
          resolve(status.state === "granted" || status.status === "granted");
        });
      } else {
        resolve(false);
      }
    });
  };
  var getLatLon = (defaultValue) => {
    return new Promise((resolve) => {
      hasOrAskForGeoLocationPermission().then((granted) => {
        if (granted === true) {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((result) => result && result.coords && resolve([result.coords.latitude, result.coords.longitude]), () => resolve(defaultValue), {
              enableHighAccuracy: true,
              timeout: 5e3,
              maximumAge: 0
            });
          } else {
            return queryForLatLon().then((result) => resolve(result || defaultValue));
          }
        } else {
          return queryForLatLon().then((result) => resolve(result || defaultValue));
        }
      });
    });
  };
  var queryForLatLon = () => {
    return new Promise((resolve) => {
      fetch("https://geolocation-db.com/json/").then((response) => response.json()).then(({
        latitude,
        longitude
      }) => latitude && longitude ? resolve([latitude, longitude]) : resolve(false)).catch(() => resolve(false));
    });
  };

  // node_modules/@lightningjs/sdk/src/Profile/defaults.js
  var defaultProfile = {
    ageRating: "adult",
    city: "New York",
    zipCode: "27505",
    countryCode: () => getCountryCode("US"),
    ip: "127.0.0.1",
    household: "b2244e9d4c04826ccd5a7b2c2a50e7d4",
    language: () => getLanguage("en"),
    latlon: () => getLatLon([40.7128, 74.006]),
    locale: () => getLocale("en-US"),
    mac: "00:00:00:00:00:00",
    operator: "metrological",
    platform: "metrological",
    packages: [],
    uid: "ee6723b8-7ab3-462c-8d93-dbf61227998e",
    stbType: "metrological"
  };

  // node_modules/@lightningjs/sdk/src/Profile/index.js
  var getInfo = (key) => {
    const profile = __spreadValues(__spreadValues({}, defaultProfile), Settings_default.get("platform", "profile"));
    return Promise.resolve(typeof profile[key] === "function" ? profile[key]() : profile[key]);
  };
  var setInfo = (key, params) => {
    if (key in defaultProfile)
      defaultProfile[key] = params;
  };
  var initProfile = (config7) => {
    getInfo = config7.getInfo;
    setInfo = config7.setInfo;
  };

  // ../../../../../AppData/Roaming/npm/node_modules/@lightningjs/cli/src/alias/lightningjs-core.js
  var lightningjs_core_default = window.lng;

  // node_modules/@lightningjs/sdk/src/Lightning/index.js
  var Lightning_default = lightningjs_core_default;

  // node_modules/@lightningjs/sdk/src/MediaPlayer/index.js
  var events = ["timeupdate", "error", "ended", "loadeddata", "canplay", "play", "playing", "pause", "loadstart", "seeking", "seeked", "encrypted"];
  var mediaUrl = (url) => url;
  var initMediaPlayer = (config7) => {
    if (config7.mediaUrl) {
      mediaUrl = config7.mediaUrl;
    }
  };
  var Mediaplayer = class extends Lightning_default.Component {
    _construct() {
      this._skipRenderToTexture = false;
      this._metrics = null;
      this._textureMode = Settings_default.get("platform", "textureMode") || false;
      Log_default.info("Texture mode: " + this._textureMode);
      console.warn(["The 'MediaPlayer'-plugin in the Lightning-SDK is deprecated and will be removed in future releases.", "Please consider using the new 'VideoPlayer'-plugin instead.", "https://rdkcentral.github.io/Lightning-SDK/#/plugins/videoplayer"].join("\n\n"));
    }
    static _template() {
      return {
        Video: {
          VideoWrap: {
            VideoTexture: {
              visible: false,
              pivot: 0.5,
              texture: {
                type: Lightning_default.textures.StaticTexture,
                options: {}
              }
            }
          }
        }
      };
    }
    set skipRenderToTexture(v) {
      this._skipRenderToTexture = v;
    }
    get textureMode() {
      return this._textureMode;
    }
    get videoView() {
      return this.tag("Video");
    }
    _init() {
      const videoEls = document.getElementsByTagName("video");
      if (videoEls && videoEls.length > 0)
        this.videoEl = videoEls[0];
      else {
        this.videoEl = document.createElement("video");
        this.videoEl.setAttribute("id", "video-player");
        this.videoEl.style.position = "absolute";
        this.videoEl.style.zIndex = "1";
        this.videoEl.style.display = "none";
        this.videoEl.setAttribute("width", "100%");
        this.videoEl.setAttribute("height", "100%");
        this.videoEl.style.visibility = this.textureMode ? "hidden" : "visible";
        document.body.appendChild(this.videoEl);
      }
      if (this.textureMode && !this._skipRenderToTexture) {
        this._createVideoTexture();
      }
      this.eventHandlers = [];
    }
    _registerListeners() {
      events.forEach((event) => {
        const handler = (e) => {
          if (this._metrics && this._metrics[event] && typeof this._metrics[event] === "function") {
            this._metrics[event]({
              currentTime: this.videoEl.currentTime
            });
          }
          this.fire(event, {
            videoElement: this.videoEl,
            event: e
          });
        };
        this.eventHandlers.push(handler);
        this.videoEl.addEventListener(event, handler);
      });
    }
    _deregisterListeners() {
      Log_default.info("Deregistering event listeners MediaPlayer");
      events.forEach((event, index) => {
        this.videoEl.removeEventListener(event, this.eventHandlers[index]);
      });
      this.eventHandlers = [];
    }
    _attach() {
      this._registerListeners();
    }
    _detach() {
      this._deregisterListeners();
      this.close();
    }
    _createVideoTexture() {
      const stage2 = this.stage;
      const gl = stage2.gl;
      const glTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, glTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.videoTexture.options = {
        source: glTexture,
        w: this.videoEl.width,
        h: this.videoEl.height
      };
    }
    _startUpdatingVideoTexture() {
      if (this.textureMode && !this._skipRenderToTexture) {
        const stage2 = this.stage;
        if (!this._updateVideoTexture) {
          this._updateVideoTexture = () => {
            if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
              const gl = stage2.gl;
              const currentTime = new Date().getTime();
              const frameCount = this.videoEl.webkitDecodedFrameCount;
              const mustUpdate = frameCount ? this._lastFrame !== frameCount : this._lastTime < currentTime - 30;
              if (mustUpdate) {
                this._lastTime = currentTime;
                this._lastFrame = frameCount;
                try {
                  gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
                  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoEl);
                  this._lastFrame = this.videoEl.webkitDecodedFrameCount;
                  this.videoTextureView.visible = true;
                  this.videoTexture.options.w = this.videoEl.videoWidth;
                  this.videoTexture.options.h = this.videoEl.videoHeight;
                  const expectedAspectRatio = this.videoTextureView.w / this.videoTextureView.h;
                  const realAspectRatio = this.videoEl.videoWidth / this.videoEl.videoHeight;
                  if (expectedAspectRatio > realAspectRatio) {
                    this.videoTextureView.scaleX = realAspectRatio / expectedAspectRatio;
                    this.videoTextureView.scaleY = 1;
                  } else {
                    this.videoTextureView.scaleY = expectedAspectRatio / realAspectRatio;
                    this.videoTextureView.scaleX = 1;
                  }
                } catch (e) {
                  Log_default.error("texImage2d video", e);
                  this._stopUpdatingVideoTexture();
                  this.videoTextureView.visible = false;
                }
                this.videoTexture.source.forceRenderUpdate();
              }
            }
          };
        }
        if (!this._updatingVideoTexture) {
          stage2.on("frameStart", this._updateVideoTexture);
          this._updatingVideoTexture = true;
        }
      }
    }
    _stopUpdatingVideoTexture() {
      if (this.textureMode) {
        const stage2 = this.stage;
        stage2.removeListener("frameStart", this._updateVideoTexture);
        this._updatingVideoTexture = false;
        this.videoTextureView.visible = false;
        if (this.videoTexture.options.source) {
          const gl = stage2.gl;
          gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
      }
    }
    updateSettings(settings2 = {}) {
      this._consumer = settings2.consumer;
      if (this._consumer && this._consumer.getMediaplayerSettings) {
        settings2 = Object.assign(settings2, this._consumer.getMediaplayerSettings());
      }
      if (!Lightning_default.Utils.equalValues(this._stream, settings2.stream)) {
        if (settings2.stream && settings2.stream.keySystem) {
          navigator.requestMediaKeySystemAccess(settings2.stream.keySystem.id, settings2.stream.keySystem.config).then((keySystemAccess) => {
            return keySystemAccess.createMediaKeys();
          }).then((createdMediaKeys) => {
            return this.videoEl.setMediaKeys(createdMediaKeys);
          }).then(() => {
            if (settings2.stream && settings2.stream.src)
              this.open(settings2.stream.src);
          }).catch(() => {
            console.error("Failed to set up MediaKeys");
          });
        } else if (settings2.stream && settings2.stream.src) {
          if (Settings_default.get("app", "hls")) {
            if (!window.Hls) {
              window.Hls = class Hls {
                static isSupported() {
                  console.warn("hls-light not included");
                  return false;
                }
              };
            }
            if (window.Hls.isSupported()) {
              if (!this._hls)
                this._hls = new window.Hls({
                  liveDurationInfinity: true
                });
              this._hls.loadSource(settings2.stream.src);
              this._hls.attachMedia(this.videoEl);
              this.videoEl.style.display = "block";
            }
          } else {
            this.open(settings2.stream.src);
          }
        } else {
          this.close();
        }
        this._stream = settings2.stream;
      }
      this._setHide(settings2.hide);
      this._setVideoArea(settings2.videoPos);
    }
    _setHide(hide) {
      if (this.textureMode) {
        this.tag("Video").setSmooth("alpha", hide ? 0 : 1);
      } else {
        this.videoEl.style.visibility = hide ? "hidden" : "visible";
      }
    }
    open(url, settings2 = {
      hide: false,
      videoPosition: null
    }) {
      url = mediaUrl(url);
      this._metrics = Metrics_default.media(url);
      Log_default.info("Playing stream", url);
      if (this.application.noVideo) {
        Log_default.info("noVideo option set, so ignoring: " + url);
        return;
      }
      if (this.videoEl.getAttribute("src") === url) {
        this.close();
      }
      this.videoEl.setAttribute("src", url);
      this.videoEl.style.visibility = "hidden";
      this.videoEl.style.display = "none";
      setTimeout(() => {
        this.videoEl.style.display = "block";
        this.videoEl.style.visibility = "visible";
      });
      this._setHide(settings2.hide);
      this._setVideoArea(settings2.videoPosition || [0, 0, 1920, 1080]);
    }
    close() {
      this.videoEl.pause();
      this.videoEl.removeAttribute("src");
      this.videoEl.load();
      this._clearSrc();
      this.videoEl.style.display = "none";
    }
    playPause() {
      if (this.isPlaying()) {
        this.doPause();
      } else {
        this.doPlay();
      }
    }
    get muted() {
      return this.videoEl.muted;
    }
    set muted(v) {
      this.videoEl.muted = v;
    }
    get loop() {
      return this.videoEl.loop;
    }
    set loop(v) {
      this.videoEl.loop = v;
    }
    isPlaying() {
      return this._getState() === "Playing";
    }
    doPlay() {
      this.videoEl.play();
    }
    doPause() {
      this.videoEl.pause();
    }
    reload() {
      var url = this.videoEl.getAttribute("src");
      this.close();
      this.videoEl.src = url;
    }
    getPosition() {
      return Promise.resolve(this.videoEl.currentTime);
    }
    setPosition(pos) {
      this.videoEl.currentTime = pos;
    }
    getDuration() {
      return Promise.resolve(this.videoEl.duration);
    }
    seek(time, absolute = false) {
      if (absolute) {
        this.videoEl.currentTime = time;
      } else {
        this.videoEl.currentTime += time;
      }
    }
    get videoTextureView() {
      return this.tag("Video").tag("VideoTexture");
    }
    get videoTexture() {
      return this.videoTextureView.texture;
    }
    _setVideoArea(videoPos) {
      if (Lightning_default.Utils.equalValues(this._videoPos, videoPos)) {
        return;
      }
      this._videoPos = videoPos;
      if (this.textureMode) {
        this.videoTextureView.patch({
          smooth: {
            x: videoPos[0],
            y: videoPos[1],
            w: videoPos[2] - videoPos[0],
            h: videoPos[3] - videoPos[1]
          }
        });
      } else {
        const precision2 = this.stage.getRenderPrecision();
        this.videoEl.style.left = Math.round(videoPos[0] * precision2) + "px";
        this.videoEl.style.top = Math.round(videoPos[1] * precision2) + "px";
        this.videoEl.style.width = Math.round((videoPos[2] - videoPos[0]) * precision2) + "px";
        this.videoEl.style.height = Math.round((videoPos[3] - videoPos[1]) * precision2) + "px";
      }
    }
    _fireConsumer(event, args) {
      if (this._consumer) {
        this._consumer.fire(event, args);
      }
    }
    _equalInitData(buf1, buf2) {
      if (!buf1 || !buf2)
        return false;
      if (buf1.byteLength != buf2.byteLength)
        return false;
      const dv1 = new Int8Array(buf1);
      const dv2 = new Int8Array(buf2);
      for (let i = 0; i != buf1.byteLength; i++)
        if (dv1[i] != dv2[i])
          return false;
      return true;
    }
    error(args) {
      this._fireConsumer("$mediaplayerError", args);
      this._setState("");
      return "";
    }
    loadeddata(args) {
      this._fireConsumer("$mediaplayerLoadedData", args);
    }
    play(args) {
      this._fireConsumer("$mediaplayerPlay", args);
    }
    playing(args) {
      this._fireConsumer("$mediaplayerPlaying", args);
      this._setState("Playing");
    }
    canplay(args) {
      this.videoEl.play();
      this._fireConsumer("$mediaplayerStart", args);
    }
    loadstart(args) {
      this._fireConsumer("$mediaplayerLoad", args);
    }
    seeked() {
      this._fireConsumer("$mediaplayerSeeked", {
        currentTime: this.videoEl.currentTime,
        duration: this.videoEl.duration || 1
      });
    }
    seeking() {
      this._fireConsumer("$mediaplayerSeeking", {
        currentTime: this.videoEl.currentTime,
        duration: this.videoEl.duration || 1
      });
    }
    durationchange(args) {
      this._fireConsumer("$mediaplayerDurationChange", args);
    }
    encrypted(args) {
      const video = args.videoElement;
      const event = args.event;
      if (video.mediaKeys && !this._equalInitData(this._previousInitData, event.initData)) {
        this._previousInitData = event.initData;
        this._fireConsumer("$mediaplayerEncrypted", args);
      }
    }
    static _states() {
      return [class Playing extends this {
        $enter() {
          this._startUpdatingVideoTexture();
        }
        $exit() {
          this._stopUpdatingVideoTexture();
        }
        timeupdate() {
          this._fireConsumer("$mediaplayerProgress", {
            currentTime: this.videoEl.currentTime,
            duration: this.videoEl.duration || 1
          });
        }
        ended(args) {
          this._fireConsumer("$mediaplayerEnded", args);
          this._setState("");
        }
        pause(args) {
          this._fireConsumer("$mediaplayerPause", args);
          this._setState("Playing.Paused");
        }
        _clearSrc() {
          this._fireConsumer("$mediaplayerStop", {});
          this._setState("");
        }
        static _states() {
          return [class Paused extends this {
          }];
        }
      }];
    }
  };

  // node_modules/localCookie/module/localCookie.js
  var localCookie = class {
    constructor(e) {
      return e = e || {}, this.forceCookies = e.forceCookies || false, this._checkIfLocalStorageWorks() === true && e.forceCookies !== true ? {
        getItem: this._getItemLocalStorage,
        setItem: this._setItemLocalStorage,
        removeItem: this._removeItemLocalStorage,
        clear: this._clearLocalStorage
      } : {
        getItem: this._getItemCookie,
        setItem: this._setItemCookie,
        removeItem: this._removeItemCookie,
        clear: this._clearCookies
      };
    }
    _checkIfLocalStorageWorks() {
      if (typeof localStorage == "undefined")
        return false;
      try {
        return localStorage.setItem("feature_test", "yes"), localStorage.getItem("feature_test") === "yes" && (localStorage.removeItem("feature_test"), true);
      } catch (e) {
        return false;
      }
    }
    _getItemLocalStorage(e) {
      return window.localStorage.getItem(e);
    }
    _setItemLocalStorage(e, t) {
      return window.localStorage.setItem(e, t);
    }
    _removeItemLocalStorage(e) {
      return window.localStorage.removeItem(e);
    }
    _clearLocalStorage() {
      return window.localStorage.clear();
    }
    _getItemCookie(e) {
      var t = document.cookie.match(RegExp("(?:^|;\\s*)" + function(e2) {
        return e2.replace(/([.*+?\^${}()|\[\]\/\\])/g, "\\$1");
      }(e) + "=([^;]*)"));
      return t && t[1] === "" && (t[1] = null), t ? t[1] : null;
    }
    _setItemCookie(e, t) {
      var o = new Date(), r = new Date(o.getTime() + 15768e7);
      document.cookie = `${e}=${t}; expires=${r.toUTCString()};`;
    }
    _removeItemCookie(e) {
      document.cookie = `${e}=;Max-Age=-99999999;`;
    }
    _clearCookies() {
      document.cookie.split(";").forEach((e) => {
        document.cookie = e.replace(/^ +/, "").replace(/=.*/, "=;expires=Max-Age=-99999999");
      });
    }
  };
  var localCookie_default = localCookie;

  // node_modules/@lightningjs/sdk/src/Storage/index.js
  var namespace;
  var lc;
  var initStorage = () => {
    namespace = Settings_default.get("platform", "id");
    lc = new localCookie_default();
  };
  var namespacedKey = (key) => namespace ? [namespace, key].join(".") : key;
  var Storage_default = {
    get(key) {
      try {
        return JSON.parse(lc.getItem(namespacedKey(key)));
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        lc.setItem(namespacedKey(key), JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    remove(key) {
      lc.removeItem(namespacedKey(key));
    },
    clear() {
      if (namespace) {
        lc.keys().forEach((key) => {
          key.indexOf(namespace + ".") === 0 ? lc.removeItem(key) : null;
        });
      } else {
        lc.clear();
      }
    }
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/regex.js
  var hasRegex = /\{\/(.*?)\/([igm]{0,3})\}/g;
  var isWildcard = /^[!*$]$/;
  var hasLookupId = /\/:\w+?@@([0-9]+?)@@/;
  var isNamedGroup = /^\/:/;
  var stripRegex = (route2, char = "R") => {
    if (hasRegex.test(route2)) {
      route2 = route2.replace(hasRegex, char);
    }
    return route2;
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/register.js
  var createRegister = (flags) => {
    const reg = new Map();
    [...Object.keys(flags), ...Object.getOwnPropertySymbols(flags)].forEach((key) => {
      reg.set(key, flags[key]);
    });
    return reg;
  };

  // node_modules/@lightningjs/sdk/src/Router/model/Request.js
  var Request = class {
    constructor(hash = "", navArgs, storeCaller) {
      this._hash = hash;
      this._storeCaller = storeCaller;
      this._register = new Map();
      this._isCreated = false;
      this._isSharedInstance = false;
      this._cancelled = false;
      this._copiedHistoryState = null;
      if (isObject(navArgs)) {
        this._register = createRegister(navArgs);
      } else if (isBoolean(navArgs)) {
        this._storeCaller = navArgs;
      }
      this._register.set(symbols.store, this._storeCaller);
    }
    cancel() {
      Log_default.debug("[router]:", `cancelled ${this._hash}`);
      this._cancelled = true;
    }
    get url() {
      return this._hash;
    }
    get register() {
      return this._register;
    }
    get hash() {
      return this._hash;
    }
    set hash(args) {
      this._hash = args;
    }
    get route() {
      return this._route;
    }
    set route(args) {
      this._route = args;
    }
    get provider() {
      return this._provider;
    }
    set provider(args) {
      this._provider = args;
    }
    get providerType() {
      return this._providerType;
    }
    set providerType(args) {
      this._providerType = args;
    }
    set page(args) {
      this._page = args;
    }
    get page() {
      return this._page;
    }
    set isCreated(args) {
      this._isCreated = args;
    }
    get isCreated() {
      return this._isCreated;
    }
    get isSharedInstance() {
      return this._isSharedInstance;
    }
    set isSharedInstance(args) {
      this._isSharedInstance = args;
    }
    get isCancelled() {
      return this._cancelled;
    }
    set copiedHistoryState(v) {
      this._copiedHistoryState = v;
    }
    get copiedHistoryState() {
      return this._copiedHistoryState;
    }
  };

  // node_modules/@lightningjs/sdk/src/Router/model/Route.js
  var Route = class {
    constructor(config7 = {}) {
      let type = ["on", "before", "after"].reduce((acc, type2) => {
        return isFunction(config7[type2]) ? type2 : acc;
      }, void 0);
      this._cfg = config7;
      if (type) {
        this._provider = {
          type,
          request: config7[type]
        };
      }
    }
    get path() {
      return this._cfg.path;
    }
    get component() {
      return this._cfg.component;
    }
    get options() {
      return this._cfg.options;
    }
    get widgets() {
      return this._cfg.widgets;
    }
    get cache() {
      return this._cfg.cache;
    }
    get hook() {
      return this._cfg.hook;
    }
    get beforeNavigate() {
      return this._cfg.beforeNavigate;
    }
    get provider() {
      return this._provider;
    }
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/route.js
  var getFloor = (route2) => {
    return stripRegex(route2).split("/").length;
  };
  var getRoutesByFloor = (floor) => {
    const matches = [];
    for (let [route2] of routes.entries()) {
      if (getFloor(route2) === floor) {
        matches.push(route2);
      }
    }
    return matches;
  };
  var getRouteByHash = (hash) => {
    hash = hash.replace(/^#/, "");
    const getUrlParts = /(\/?:?[^/]+)/g;
    const candidates = getRoutesByFloor(getFloor(hash));
    const hashParts = hash.match(getUrlParts) || [];
    let regexStore = [];
    let matches = candidates.filter((route2) => {
      let isMatching = true;
      if (hasRegex.test(route2)) {
        const regMatches = route2.match(hasRegex);
        if (regMatches && regMatches.length) {
          route2 = regMatches.reduce((fullRoute, regex) => {
            const lookupId = regexStore.length;
            fullRoute = fullRoute.replace(regex, `@@${lookupId}@@`);
            regexStore.push(regex.substring(1, regex.length - 1));
            return fullRoute;
          }, route2);
        }
      }
      const routeParts = route2.match(getUrlParts) || [];
      for (let i = 0, j = routeParts.length; i < j; i++) {
        const routePart = routeParts[i];
        const hashPart = hashParts[i];
        if (hasLookupId.test(routePart)) {
          const routeMatches = hasLookupId.exec(routePart);
          const storeId = routeMatches[1];
          const routeRegex = regexStore[storeId];
          const regMatches = /\/([^\/]+)\/([igm]{0,3})/.exec(routeRegex);
          if (regMatches && regMatches.length) {
            const expression = regMatches[1];
            const modifiers = regMatches[2];
            const regex = new RegExp(`^/${expression}$`, modifiers);
            if (!regex.test(hashPart)) {
              isMatching = false;
            }
          }
        } else if (isNamedGroup.test(routePart)) {
          continue;
        } else if (hashPart && routePart.toLowerCase() !== hashPart.toLowerCase()) {
          isMatching = false;
        }
      }
      return isMatching;
    });
    if (matches.length) {
      if (matches.indexOf(hash) !== -1) {
        const match = matches[matches.indexOf(hash)];
        return routes.get(match);
      } else {
        matches = matches.sort((a) => {
          return isNamedGroup.test(a) ? -1 : 1;
        });
        if (routeExists(matches[0])) {
          return routes.get(matches[0]);
        }
      }
    }
    return false;
  };
  var getValuesFromHash = (hash = "", path) => {
    path = stripRegex(path, "");
    const getUrlParts = /(\/?:?[\w%\s:.-]+)/g;
    const hashParts = hash.match(getUrlParts) || [];
    const routeParts = path.match(getUrlParts) || [];
    const getNamedGroup = /^\/:([\w-]+)\/?/;
    return routeParts.reduce((storage, value, index) => {
      const match = getNamedGroup.exec(value);
      if (match && match.length) {
        storage.set(match[1], decodeURIComponent(hashParts[index].replace(/^\//, "")));
      }
      return storage;
    }, new Map());
  };
  var getOption = (stack, prop) => {
    if (stack && stack.hasOwnProperty(prop)) {
      return stack[prop];
    }
  };
  var createRoute = (config7) => {
    if (config7.path === "$") {
      let options = {
        preventStorage: true
      };
      if (isObject(config7.options)) {
        options = __spreadValues(__spreadValues({}, config7.options), options);
      }
      config7.options = options;
      if (bootRequest) {
        config7.after = bootRequest;
      }
    }
    return new Route(config7);
  };
  var createRequest = (url, args, store3) => {
    return new Request(url, args, store3);
  };
  var getHashByName = (obj) => {
    if (!obj.to && !obj.name) {
      return false;
    }
    const route2 = getRouteByName(obj.to || obj.name);
    const hasDynamicGroup = /\/:([\w-]+)\/?/;
    let hash = route2;
    if (hasDynamicGroup.test(route2)) {
      if (obj.params) {
        const keys = Object.keys(obj.params);
        hash = keys.reduce((acc, key) => {
          return acc.replace(`:${key}`, obj.params[key]);
        }, route2);
      }
      if (obj.query) {
        return `${hash}${objectToQueryString(obj.query)}`;
      }
    }
    return hash;
  };
  var getRouteByName = (name) => {
    for (let [path, route2] of routes.entries()) {
      if (route2.name === name) {
        return path;
      }
    }
    return false;
  };
  var keepActivePageAlive = (route2, request) => {
    if (isString(route2)) {
      const routes2 = getRoutes();
      if (routes2.has(route2)) {
        route2 = routes2.get(route2);
      } else {
        return false;
      }
    }
    const register = request.register;
    const routeOptions = route2.options;
    if (register.has("keepAlive")) {
      return register.get("keepAlive");
    } else if (routeOptions && routeOptions.keepAlive) {
      return routeOptions.keepAlive;
    }
    return false;
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/emit.js
  var emit_default = (page, events2 = [], params = {}) => {
    if (!isArray(events2)) {
      events2 = [events2];
    }
    events2.forEach((e) => {
      const event = `_on${ucfirst(e)}`;
      if (isFunction(page[event])) {
        page[event](params);
      }
    });
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/widgets.js
  var activeWidget = null;
  var getReferences = () => {
    if (!widgetsHost) {
      return;
    }
    return widgetsHost.get().reduce((storage, widget) => {
      const key = widget.ref.toLowerCase();
      storage[key] = widget;
      return storage;
    }, {});
  };
  var updateWidgets = (widgets, page) => {
    const configured = (widgets || []).map((ref) => ref.toLowerCase());
    widgetsHost.forEach((widget) => {
      widget.visible = configured.indexOf(widget.ref.toLowerCase()) !== -1;
      if (widget.visible) {
        emit_default(widget, ["activated"], page);
      }
    });
    if (app.state === "Widgets" && activeWidget && !activeWidget.visible) {
      app._setState("");
    }
  };
  var getWidgetByName = (name) => {
    name = ucfirst(name);
    return widgetsHost.getByRef(name) || false;
  };
  var focusWidget = (name) => {
    const widget = getWidgetByName(name);
    if (widget) {
      setActiveWidget(widget);
      if (app.state === "Widgets") {
        app.reload(activeWidget);
      } else {
        app._setState("Widgets", [activeWidget]);
      }
    }
  };
  var restoreFocus = () => {
    activeWidget = null;
    app._setState("");
  };
  var getActiveWidget = () => {
    return activeWidget;
  };
  var setActiveWidget = (instance) => {
    activeWidget = instance;
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/components.js
  var createComponent = (stage2, type) => {
    return stage2.c({
      type,
      visible: false,
      widgets: getReferences()
    });
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/history.js
  var history = [];
  var updateHistory = (request) => {
    const hash = getActiveHash();
    if (!hash) {
      return;
    }
    const register = request.register;
    const forceNavigateStore = register.get(symbols.store);
    const activeRoute2 = getRouteByHash(hash);
    const preventStorage = getOption(activeRoute2.options, "preventStorage");
    let store3 = isBoolean(forceNavigateStore) ? forceNavigateStore : !preventStorage;
    if (store3) {
      const toStore = hash.replace(/^\//, "");
      const location2 = locationInHistory(toStore);
      const stateObject = getStateObject(getActivePage(), request);
      const routerConfig2 = getRouterConfig();
      if (location2 === -1 || routerConfig2.get("storeSameHash")) {
        history.push({
          hash: toStore,
          state: stateObject
        });
      } else {
        const prev = history.splice(location2, 1)[0];
        history.push({
          hash: prev.hash,
          state: stateObject
        });
      }
    }
  };
  var locationInHistory = (hash) => {
    for (let i = 0; i < history.length; i++) {
      if (history[i].hash === hash) {
        return i;
      }
    }
    return -1;
  };
  var getHistoryState = (hash) => {
    let state3 = null;
    if (history.length) {
      if (!hash) {
        const record = history[history.length - 1];
        state3 = record.state;
      } else {
        if (locationInHistory(hash) !== -1) {
          const record = history[locationInHistory(hash)];
          state3 = record.state;
        }
      }
    }
    return state3;
  };
  var replaceHistoryState = (state3 = null, hash) => {
    if (!history.length) {
      return;
    }
    const location2 = hash ? locationInHistory(hash) : history.length - 1;
    if (location2 !== -1 && isObject(state3)) {
      history[location2].state = state3;
    }
  };
  var getStateObject = (page, request) => {
    if (request.isSharedInstance) {
      if (request.copiedHistoryState) {
        return request.copiedHistoryState;
      }
    } else if (page && isFunction(page.historyState)) {
      return page.historyState();
    }
    return null;
  };
  var getHistory = () => {
    return history.slice(0);
  };
  var setHistory = (arr = []) => {
    if (isArray(arr)) {
      history = arr;
    }
  };

  // node_modules/@lightningjs/sdk/src/Application/index.js
  var import_deepmerge = __toModule(require_cjs());

  // node_modules/@lightningjs/sdk/src/Locale/index.js
  var warned = false;
  var deprecated = (force = false) => {
    if (force === true || warned === false) {
      console.warn(["The 'Locale'-plugin in the Lightning-SDK is deprecated and will be removed in future releases.", "Please consider using the new 'Language'-plugin instead.", "https://rdkcentral.github.io/Lightning-SDK/#/plugins/language"].join("\n\n"));
    }
    warned = true;
  };
  var Locale = class {
    constructor() {
      this.__enabled = false;
    }
    load(path) {
      return __async(this, null, function* () {
        if (!this.__enabled) {
          return;
        }
        yield fetch(path).then((resp) => resp.json()).then((resp) => {
          this.loadFromObject(resp);
        });
      });
    }
    setLanguage(lang) {
      deprecated();
      this.__enabled = true;
      this.language = lang;
    }
    get tr() {
      deprecated(true);
      return this.__trObj[this.language];
    }
    loadFromObject(trObj) {
      deprecated();
      const fallbackLanguage = "en";
      if (Object.keys(trObj).indexOf(this.language) === -1) {
        Log_default.warn("No translations found for: " + this.language);
        if (Object.keys(trObj).indexOf(fallbackLanguage) > -1) {
          Log_default.warn("Using fallback language: " + fallbackLanguage);
          this.language = fallbackLanguage;
        } else {
          const error = "No translations found for fallback language: " + fallbackLanguage;
          Log_default.error(error);
          throw Error(error);
        }
      }
      this.__trObj = trObj;
      for (const lang of Object.values(this.__trObj)) {
        for (const str of Object.keys(lang)) {
          lang[str] = new LocalizedString(lang[str]);
        }
      }
    }
  };
  var LocalizedString = class extends String {
    format(...args) {
      const sub = args.reduce((string, arg, index) => string.split(`{${index}}`).join(arg), this);
      return new LocalizedString(sub);
    }
  };
  var Locale_default = new Locale();

  // node_modules/@lightningjs/sdk/src/VersionLabel/index.js
  var VersionLabel = class extends Lightning_default.Component {
    static _template() {
      return {
        rect: true,
        color: 3137370284,
        h: 40,
        w: 100,
        x: (w) => w - 50,
        y: (h) => h - 50,
        mount: 1,
        Text: {
          w: (w) => w,
          h: (h) => h,
          y: 5,
          x: 20,
          text: {
            fontSize: 22,
            lineHeight: 26
          }
        }
      };
    }
    _firstActive() {
      this.tag("Text").text = `APP - v${this.version}
SDK - v${this.sdkVersion}`;
      this.tag("Text").loadTexture();
      this.w = this.tag("Text").renderWidth + 40;
      this.h = this.tag("Text").renderHeight + 5;
    }
  };

  // node_modules/@lightningjs/sdk/src/FpsCounter/index.js
  var FpsIndicator = class extends Lightning_default.Component {
    static _template() {
      return {
        rect: true,
        color: 4294967295,
        texture: Lightning_default.Tools.getRoundRect(80, 80, 40),
        h: 80,
        w: 80,
        x: 100,
        y: 100,
        mount: 1,
        Background: {
          x: 3,
          y: 3,
          texture: Lightning_default.Tools.getRoundRect(72, 72, 36),
          color: 4278222848
        },
        Counter: {
          w: (w) => w,
          h: (h) => h,
          y: 10,
          text: {
            fontSize: 32,
            textAlign: "center"
          }
        },
        Text: {
          w: (w) => w,
          h: (h) => h,
          y: 48,
          text: {
            fontSize: 15,
            textAlign: "center",
            text: "FPS"
          }
        }
      };
    }
    _setup() {
      this.config = __spreadValues(__spreadValues({}, {
        log: false,
        interval: 500,
        threshold: 1
      }), Settings_default.get("platform", "showFps"));
      this.fps = 0;
      this.lastFps = this.fps - this.config.threshold;
      const fpsCalculator = () => {
        this.fps = ~~(1 / this.stage.dt);
      };
      this.stage.on("frameStart", fpsCalculator);
      this.stage.off("framestart", fpsCalculator);
      this.interval = setInterval(this.showFps.bind(this), this.config.interval);
    }
    _firstActive() {
      this.showFps();
    }
    _detach() {
      clearInterval(this.interval);
    }
    showFps() {
      if (Math.abs(this.lastFps - this.fps) <= this.config.threshold)
        return;
      this.lastFps = this.fps;
      let bgColor = 4278222848;
      if (this.fps <= 40 && this.fps > 20)
        bgColor = 4294944e3;
      else if (this.fps <= 20)
        bgColor = 4294901760;
      this.tag("Background").setSmooth("color", bgColor);
      this.tag("Counter").text = `${this.fps}`;
      this.config.log && Log_default.info("FPS", this.fps);
    }
  };

  // node_modules/@lightningjs/sdk/src/Language/index.js
  var meta = {};
  var translations = {};
  var language = null;
  var dictionary = null;
  var initLanguage = (file, language3 = null) => {
    return new Promise((resolve, reject) => {
      fetch(file).then((response) => response.json()).then((json) => {
        setTranslations(json);
        typeof language3 === "object" && "then" in language3 && typeof language3.then === "function" ? language3.then((lang) => setLanguage(lang).then(resolve).catch(reject)).catch((e) => {
          Log_default.error(e);
          reject(e);
        }) : setLanguage(language3).then(resolve).catch(reject);
      }).catch(() => {
        const error = "Language file " + file + " not found";
        Log_default.error(error);
        reject(error);
      });
    });
  };
  var setTranslations = (obj) => {
    if ("meta" in obj) {
      meta = __spreadValues({}, obj.meta);
      delete obj.meta;
    }
    translations = obj;
  };
  var getLanguage2 = () => {
    return language;
  };
  var setLanguage = (lng) => {
    language = null;
    dictionary = null;
    return new Promise((resolve, reject) => {
      if (lng in translations) {
        language = lng;
      } else {
        if ("map" in meta && lng in meta.map && meta.map[lng] in translations) {
          language = meta.map[lng];
        } else if ("default" in meta && meta.default in translations) {
          const error = "Translations for Language " + language + " not found. Using default language " + meta.default;
          Log_default.warn(error);
          language = meta.default;
        } else {
          const error = "Translations for Language " + language + " not found.";
          Log_default.error(error);
          reject(error);
        }
      }
      if (language) {
        Log_default.info("Setting language to", language);
        const translationsObj = translations[language];
        if (typeof translationsObj === "object") {
          dictionary = translationsObj;
          resolve();
        } else if (typeof translationsObj === "string") {
          const url = Utils_default.asset(translationsObj);
          fetch(url).then((response) => response.json()).then((json) => {
            translations[language] = json;
            dictionary = json;
            resolve();
          }).catch((e) => {
            const error = "Error while fetching " + url;
            Log_default.error(error, e);
            reject(error);
          });
        }
      }
    });
  };
  var Language_default = {
    translate(key) {
      let replacements = [...arguments].slice(1);
      if (replacements.length === 0) {
        return dictionary && dictionary[key] || key;
      } else {
        if (replacements.length === 1 && typeof replacements[0] === "object") {
          replacements = replacements.pop();
        }
        return Object.keys(Array.isArray(replacements) ? Object.assign({}, replacements) : replacements).reduce((text, replacementKey) => {
          return text.replace(new RegExp("{\\s?" + replacementKey + "\\s?}", "g"), replacements[replacementKey]);
        }, dictionary && dictionary[key] || key);
      }
    },
    translations(obj) {
      setTranslations(obj);
    },
    set(language3) {
      return setLanguage(language3);
    },
    get() {
      return getLanguage2();
    },
    available() {
      const languageKeys = Object.keys(translations);
      return languageKeys.map((key) => ({
        code: key,
        name: meta.names && meta.names[key] || key
      }));
    }
  };

  // node_modules/@lightningjs/sdk/src/Registry/index.js
  var registry = {
    eventListeners: [],
    timeouts: [],
    intervals: [],
    targets: []
  };
  var Registry_default = {
    setTimeout(cb, timeout3, ...params) {
      const timeoutId = setTimeout(() => {
        registry.timeouts = registry.timeouts.filter((id) => id !== timeoutId);
        cb.apply(null, params);
      }, timeout3, params);
      Log_default.info("Set Timeout", "ID: " + timeoutId);
      registry.timeouts.push(timeoutId);
      return timeoutId;
    },
    clearTimeout(timeoutId) {
      if (registry.timeouts.indexOf(timeoutId) > -1) {
        registry.timeouts = registry.timeouts.filter((id) => id !== timeoutId);
        Log_default.info("Clear Timeout", "ID: " + timeoutId);
        clearTimeout(timeoutId);
      } else {
        Log_default.error("Clear Timeout", "ID " + timeoutId + " not found");
      }
    },
    clearTimeouts() {
      registry.timeouts.forEach((timeoutId) => {
        this.clearTimeout(timeoutId);
      });
    },
    setInterval(cb, interval, ...params) {
      const intervalId = setInterval(() => {
        registry.intervals.filter((id) => id !== intervalId);
        cb.apply(null, params);
      }, interval, params);
      Log_default.info("Set Interval", "ID: " + intervalId);
      registry.intervals.push(intervalId);
      return intervalId;
    },
    clearInterval(intervalId) {
      if (registry.intervals.indexOf(intervalId) > -1) {
        registry.intervals = registry.intervals.filter((id) => id !== intervalId);
        Log_default.info("Clear Interval", "ID: " + intervalId);
        clearInterval(intervalId);
      } else {
        Log_default.error("Clear Interval", "ID " + intervalId + " not found");
      }
    },
    clearIntervals() {
      registry.intervals.forEach((intervalId) => {
        this.clearInterval(intervalId);
      });
    },
    addEventListener(target, event, handler) {
      target.addEventListener(event, handler);
      const targetIndex = registry.targets.indexOf(target) > -1 ? registry.targets.indexOf(target) : registry.targets.push(target) - 1;
      registry.eventListeners[targetIndex] = registry.eventListeners[targetIndex] || {};
      registry.eventListeners[targetIndex][event] = registry.eventListeners[targetIndex][event] || [];
      registry.eventListeners[targetIndex][event].push(handler);
      Log_default.info("Add eventListener", "Target:", target, "Event: " + event, "Handler:", handler.toString());
    },
    removeEventListener(target, event, handler) {
      const targetIndex = registry.targets.indexOf(target);
      if (targetIndex > -1 && registry.eventListeners[targetIndex] && registry.eventListeners[targetIndex][event] && registry.eventListeners[targetIndex][event].indexOf(handler) > -1) {
        registry.eventListeners[targetIndex][event] = registry.eventListeners[targetIndex][event].filter((fn) => fn !== handler);
        Log_default.info("Remove eventListener", "Target:", target, "Event: " + event, "Handler:", handler.toString());
        target.removeEventListener(event, handler);
      } else {
        Log_default.error("Remove eventListener", "Not found", "Target", target, "Event: " + event, "Handler", handler.toString());
      }
    },
    removeEventListeners(target, event) {
      if (target && event) {
        const targetIndex = registry.targets.indexOf(target);
        if (targetIndex > -1) {
          registry.eventListeners[targetIndex][event].forEach((handler) => {
            this.removeEventListener(target, event, handler);
          });
        }
      } else if (target) {
        const targetIndex = registry.targets.indexOf(target);
        if (targetIndex > -1) {
          Object.keys(registry.eventListeners[targetIndex]).forEach((_event) => {
            this.removeEventListeners(target, _event);
          });
        }
      } else {
        Object.keys(registry.eventListeners).forEach((targetIndex) => {
          this.removeEventListeners(registry.targets[targetIndex]);
        });
      }
    },
    clear() {
      this.clearTimeouts();
      this.clearIntervals();
      this.removeEventListeners();
      registry.eventListeners = [];
      registry.timeouts = [];
      registry.intervals = [];
      registry.targets = [];
    }
  };

  // node_modules/@lightningjs/sdk/src/Colors/utils.js
  var isObject2 = (v) => {
    return typeof v === "object" && v !== null;
  };
  var isString2 = (v) => {
    return typeof v === "string";
  };

  // node_modules/@lightningjs/sdk/src/Colors/index.js
  var colors = {
    white: "#ffffff",
    black: "#000000",
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff",
    yellow: "#feff00",
    cyan: "#00feff",
    magenta: "#ff00ff"
  };
  var normalizedColors = {};
  var addColors = (colorsToAdd, value) => {
    if (isObject2(colorsToAdd)) {
      Object.keys(colorsToAdd).forEach((color) => cleanUpNormalizedColors(color));
      colors = Object.assign({}, colors, colorsToAdd);
    } else if (isString2(colorsToAdd) && value) {
      cleanUpNormalizedColors(colorsToAdd);
      colors[colorsToAdd] = value;
    }
  };
  var cleanUpNormalizedColors = (color) => {
    for (let c in normalizedColors) {
      if (c.indexOf(color) > -1) {
        delete normalizedColors[c];
      }
    }
  };
  var initColors = (file) => {
    return new Promise((resolve, reject) => {
      if (typeof file === "object") {
        addColors(file);
        resolve();
      }
      fetch(file).then((response) => response.json()).then((json) => {
        addColors(json);
        resolve();
      }).catch(() => {
        const error = "Colors file " + file + " not found";
        Log_default.error(error);
        reject(error);
      });
    });
  };

  // node_modules/@lightningjs/sdk/src/Application/index.js
  var packageInfo = {
    name: "@lightningjs/sdk",
    version: "4.8.1",
    license: "Apache-2.0",
    scripts: {
      postinstall: "node ./scripts/postinstall.js",
      lint: "eslint '**/*.js'",
      release: "npm publish --access public"
    },
    "lint-staged": {
      "*.js": ["eslint --fix"],
      "src/startApp.js": ["rollup -c ./rollup.config.js"]
    },
    husky: {
      hooks: {
        "pre-commit": "lint-staged"
      }
    },
    dependencies: {
      "@babel/polyfill": "^7.11.5",
      "@lightningjs/core": "*",
      "@michieljs/execute-as-promise": "^1.0.0",
      deepmerge: "^4.2.2",
      localCookie: "github:WebPlatformForEmbedded/localCookie",
      shelljs: "^0.8.4",
      "url-polyfill": "^1.1.10",
      "whatwg-fetch": "^3.0.0"
    },
    devDependencies: {
      "@babel/core": "^7.11.6",
      "@babel/plugin-transform-parameters": "^7.10.5 ",
      "@babel/plugin-transform-spread": "^7.11.0",
      "@babel/preset-env": "^7.11.5",
      "babel-eslint": "^10.1.0",
      eslint: "^7.10.0",
      "eslint-config-prettier": "^6.12.0",
      "eslint-plugin-prettier": "^3.1.4",
      husky: "^4.3.0",
      "lint-staged": "^10.4.0",
      prettier: "^1.19.1",
      rollup: "^1.32.1",
      "rollup-plugin-babel": "^4.4.0"
    },
    repository: {
      type: "git",
      url: "git@github.com:rdkcentral/Lightning-SDK.git"
    },
    bugs: {
      url: "https://github.com/rdkcentral/Lightning-SDK/issues"
    }
  };
  var AppInstance;
  var AppData;
  var defaultOptions = {
    stage: {
      w: 1920,
      h: 1080,
      clearColor: 0,
      canvas2d: false
    },
    debug: false,
    defaultFontFace: "RobotoRegular",
    keys: {
      8: "Back",
      13: "Enter",
      27: "Menu",
      37: "Left",
      38: "Up",
      39: "Right",
      40: "Down",
      174: "ChannelDown",
      175: "ChannelUp",
      178: "Stop",
      250: "PlayPause",
      191: "Search",
      409: "Search"
    }
  };
  var customFontFaces = [];
  var fontLoader = (fonts, store3) => new Promise((resolve, reject) => {
    fonts.map(({
      family,
      url,
      urls,
      descriptors
    }) => () => {
      const src = urls ? urls.map((url2) => {
        return "url(" + url2 + ")";
      }) : "url(" + url + ")";
      const fontFace = new FontFace(family, src, descriptors || {});
      store3.push(fontFace);
      Log_default.info("Loading font", family);
      document.fonts.add(fontFace);
      return fontFace.load();
    }).reduce((promise, method) => {
      return promise.then(() => method());
    }, Promise.resolve(null)).then(resolve).catch(reject);
  });
  function Application_default(App2, appData, platformSettings) {
    const {
      width,
      height
    } = platformSettings;
    if (width && height) {
      defaultOptions.stage["w"] = width;
      defaultOptions.stage["h"] = height;
      defaultOptions.stage["precision"] = width / 1920;
    }
    if (!width && !height && window.innerHeight === 720) {
      defaultOptions.stage["w"] = 1280;
      defaultOptions.stage["h"] = 720;
      defaultOptions.stage["precision"] = 1280 / 1920;
    }
    return class Application extends Lightning_default.Application {
      constructor(options) {
        const config7 = (0, import_deepmerge.default)(defaultOptions, options);
        if (options.stage.canvas) {
          config7.stage.canvas = options.stage.canvas;
        }
        super(config7);
        this.config = config7;
      }
      static _template() {
        return {
          w: 1920,
          h: 1080
        };
      }
      _setup() {
        Promise.all([
          this.loadFonts(App2.config && App2.config.fonts || App2.getFonts && App2.getFonts() || []),
          Locale_default.load(App2.config && App2.config.locale || App2.getLocale && App2.getLocale()),
          App2.language && this.loadLanguage(App2.language()),
          App2.colors && this.loadColors(App2.colors())
        ]).then(() => {
          Metrics_default.app.loaded();
          AppData = appData;
          AppInstance = this.stage.c({
            ref: "App",
            type: App2,
            zIndex: 1,
            forceZIndexContext: !!platformSettings.showVersion || !!platformSettings.showFps
          });
          this.childList.a(AppInstance);
          this._refocus();
          Log_default.info("App version", this.config.version);
          Log_default.info("SDK version", packageInfo.version);
          if (platformSettings.showVersion) {
            this.childList.a({
              ref: "VersionLabel",
              type: VersionLabel,
              version: this.config.version,
              sdkVersion: packageInfo.version,
              zIndex: 1
            });
          }
          if (platformSettings.showFps) {
            this.childList.a({
              ref: "FpsCounter",
              type: FpsIndicator,
              zIndex: 1
            });
          }
          super._setup();
        }).catch(console.error);
      }
      _handleBack() {
        this.closeApp();
      }
      _handleExit() {
        this.closeApp();
      }
      closeApp() {
        Log_default.info("Signaling App Close");
        if (platformSettings.onClose && typeof platformSettings.onClose === "function") {
          platformSettings.onClose(...arguments);
        } else {
          this.close();
        }
      }
      close() {
        Log_default.info("Closing App");
        Settings_default.clearSubscribers();
        Registry_default.clear();
        this.childList.remove(this.tag("App"));
        this.cleanupFonts();
        this.stage.gc();
        this.destroy();
      }
      loadFonts(fonts) {
        return platformSettings.fontLoader && typeof platformSettings.fontLoader === "function" ? platformSettings.fontLoader(fonts, customFontFaces) : fontLoader(fonts, customFontFaces);
      }
      cleanupFonts() {
        if ("delete" in document.fonts) {
          customFontFaces.forEach((fontFace) => {
            Log_default.info("Removing font", fontFace.family);
            document.fonts.delete(fontFace);
          });
        } else {
          Log_default.info("No support for removing manually-added fonts");
        }
      }
      loadLanguage(config7) {
        let file = Utils_default.asset("translations.json");
        let language3 = config7;
        if (typeof language3 === "object") {
          language3 = config7.language || null;
          file = config7.file || file;
        }
        return initLanguage(file, language3);
      }
      loadColors(config7) {
        let file = Utils_default.asset("colors.json");
        if (config7 && (typeof config7 === "string" || typeof config7 === "object")) {
          file = config7;
        }
        return initColors(file);
      }
      set focus(v) {
        this._focussed = v;
        this._refocus();
      }
      _getFocused() {
        return this._focussed || this.tag("App");
      }
    };
  }

  // node_modules/@lightningjs/sdk/src/Router/utils/router.js
  var application;
  var app;
  var pagesHost;
  var stage;
  var routerConfig;
  var widgetsHost;
  var rootHash;
  var bootRequest;
  var updateHash = true;
  var beforeEachRoute = (from, to) => __async(void 0, null, function* () {
    return true;
  });
  var afterEachRoute = () => {
  };
  var routes = new Map();
  var components = new Map();
  var initialised = false;
  var activePage = null;
  var activeHash;
  var activeRoute;
  var lastAcceptedHash;
  var previousState;
  var mixin = (app2) => {
    if (app2.pages) {
      pagesHost = app2.pages.childList;
    }
    if (app2.widgets && app2.widgets.children) {
      widgetsHost = app2.widgets.childList;
      widgetsHost.forEach((w) => w.visible = false);
    }
    app2._handleBack = (e) => {
      step(-1);
      e.preventDefault();
    };
  };
  var bootRouter = (config7, instance) => {
    let {
      appInstance,
      routes: routes2
    } = config7;
    if (instance && isPage(instance)) {
      app = instance;
    }
    if (!app) {
      app = appInstance || AppInstance;
    }
    application = app.application;
    pagesHost = application.childList;
    stage = app.stage;
    routerConfig = getConfigMap();
    mixin(app);
    if (isArray(routes2)) {
      setup(config7);
    } else if (isFunction(routes2)) {
      console.warn("[Router]: Calling Router.route() directly is deprecated.");
      console.warn("Use object config: https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration");
    }
  };
  var setup = (config7) => {
    if (!initialised) {
      init(config7);
    }
    config7.routes.forEach((r) => {
      const path = cleanHash(r.path);
      if (!routeExists(path)) {
        const route2 = createRoute(r);
        routes.set(path, route2);
        if (route2.component) {
          let type = route2.component;
          if (isComponentConstructor(type)) {
            if (!routerConfig.get("lazyCreate")) {
              type = createComponent(stage, type);
              pagesHost.a(type);
            }
          }
          components.set(path, type);
        }
      } else {
        console.error(`${path} already exists in routes configuration`);
      }
    });
  };
  var init = (config7) => {
    rootHash = config7.root;
    if (isFunction(config7.boot)) {
      bootRequest = config7.boot;
    }
    if (isBoolean(config7.updateHash)) {
      updateHash = config7.updateHash;
    }
    if (isFunction(config7.beforeEachRoute)) {
      beforeEachRoute = config7.beforeEachRoute;
    }
    if (isFunction(config7.afterEachRoute)) {
      afterEachRoute = config7.afterEachRoute;
    }
    if (config7.bootComponent) {
      console.warn("[Router]: Boot Component is now available as a special router: https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration?id=special-routes");
      console.warn("[Router]: setting { bootComponent } property will be deprecated in a future release");
      if (isPage(config7.bootComponent)) {
        config7.routes.push({
          path: "$",
          component: config7.bootComponent,
          after: bootRequest || null,
          options: {
            preventStorage: true
          }
        });
      } else {
        console.error(`[Router]: ${config7.bootComponent} is not a valid boot component`);
      }
    }
    initialised = true;
  };
  var storeComponent = (route2, type) => {
    if (components.has(route2)) {
      components.set(route2, type);
    }
  };
  var getComponent = (route2) => {
    if (components.has(route2)) {
      return components.get(route2);
    }
    return null;
  };
  var mustUpdateLocationHash = () => {
    if (!routerConfig || !routerConfig.size) {
      return false;
    }
    const updateConfig = routerConfig.get("updateHash");
    return !(isBoolean(updateConfig) && !updateConfig || isBoolean(updateHash) && !updateHash);
  };
  var onRequestResolved = (request) => {
    const hash = request.hash;
    const route2 = request.route;
    const register = request.register;
    const page = request.page;
    if (getOption(route2.options, "clearHistory")) {
      setHistory([]);
    } else if (hash && !isWildcard.test(route2.path)) {
      updateHistory(request);
    }
    storeComponent(route2.path, page);
    if (request.isSharedInstance || !request.isCreated) {
      emit_default(page, "changed");
    } else if (request.isCreated) {
      emit_default(page, "mounted");
    }
    if (widgetsHost) {
      updateWidgets(route2.widgets, page);
    }
    if (getActivePage() && !request.isSharedInstance) {
      cleanUp(activePage, request);
    }
    if (register.get(symbols.historyState) && isFunction(page.historyState)) {
      page.historyState(register.get(symbols.historyState));
    }
    setActivePage(page);
    activeHash = request.hash;
    activeRoute = route2.path;
    for (let request2 of navigateQueue.values()) {
      if (request2.isCancelled && request2.hash) {
        navigateQueue.delete(request2.hash);
      }
    }
    afterEachRoute(request);
    Log_default.info("[route]:", route2.path);
    Log_default.info("[hash]:", hash);
  };
  var cleanUp = (page, request) => {
    const route2 = activeRoute;
    const register = request.register;
    const lazyDestroy = routerConfig.get("lazyDestroy");
    const destroyOnBack = routerConfig.get("destroyOnHistoryBack");
    const keepAlive = register.get("keepAlive");
    const isFromHistory = register.get(symbols.backtrack);
    let doCleanup = false;
    if (isFromHistory && (destroyOnBack || lazyDestroy)) {
      doCleanup = true;
    }
    if (lazyDestroy && !keepAlive) {
      doCleanup = true;
    }
    if (activeRoute === request.route.path) {
      doCleanup = true;
    }
    if (doCleanup) {
      storeComponent(route2, page._routedType || page.constructor);
      pagesHost.remove(page);
      if (routerConfig.get("gcOnUnload")) {
        stage.gc();
      }
    } else {
      page.patch({
        x: 0,
        y: 0,
        scale: 1,
        alpha: 1,
        visible: false
      });
    }
  };
  var getActiveHash = () => {
    return activeHash;
  };
  var setActivePage = (page) => {
    activePage = page;
  };
  var getActivePage = () => {
    return activePage;
  };
  var getActiveRoute = () => {
    return activeRoute;
  };
  var getLastHash = () => {
    return lastAcceptedHash;
  };
  var setLastHash = (hash) => {
    lastAcceptedHash = hash;
  };
  var getPreviousState = () => {
    return previousState;
  };
  var routeExists = (key) => {
    return routes.has(key);
  };
  var getRootHash = () => {
    return rootHash;
  };
  var getBootRequest = () => {
    return bootRequest;
  };
  var getRouterConfig = () => {
    return routerConfig;
  };
  var getRoutes = () => {
    return routes;
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/helpers.js
  var isFunction = (v) => {
    return typeof v === "function";
  };
  var isObject = (v) => {
    return typeof v === "object" && v !== null;
  };
  var isBoolean = (v) => {
    return typeof v === "boolean";
  };
  var isPage = (v) => {
    if (v instanceof Lightning_default.Element || isComponentConstructor(v)) {
      return true;
    }
    return false;
  };
  var isComponentConstructor = (type) => {
    return type.prototype && "isComponent" in type.prototype;
  };
  var isArray = (v) => {
    return Array.isArray(v);
  };
  var ucfirst = (v) => {
    return `${v.charAt(0).toUpperCase()}${v.slice(1)}`;
  };
  var isString = (v) => {
    return typeof v === "string";
  };
  var isPromise = (method) => {
    let result;
    if (isFunction(method)) {
      try {
        result = method.apply(null);
      } catch (e) {
        result = e;
      }
    } else {
      result = method;
    }
    return isObject(result) && isFunction(result.then);
  };
  var cleanHash = (hash = "") => {
    return hash.replace(/^#/, "").replace(/\/+$/, "");
  };
  var getConfigMap = () => {
    const routerSettings = Settings_default.get("platform", "router");
    const isObj = isObject(routerSettings);
    return ["backtrack", "gcOnUnload", "destroyOnHistoryBack", "lazyCreate", "lazyDestroy", "reuseInstance", "autoRestoreRemote", "numberNavigation", "updateHash", "storeSameHash"].reduce((config7, key) => {
      config7.set(key, isObj ? routerSettings[key] : Settings_default.get("platform", key));
      return config7;
    }, new Map());
  };
  var getQueryStringParams = (hash = getActiveHash()) => {
    const resumeHash2 = getResumeHash();
    if ((hash === "$" || !hash) && resumeHash2) {
      if (isString(resumeHash2)) {
        hash = resumeHash2;
      }
    }
    let parse = "";
    const getQuery = /([?&].*)/;
    const matches = getQuery.exec(hash);
    const params = {};
    if (document.location && document.location.search) {
      parse = document.location.search;
    }
    if (matches && matches.length) {
      let hashParams = matches[1];
      if (parse) {
        hashParams = hashParams.replace(/^\?/, "");
        parse = `${parse}&${hashParams}`;
      } else {
        parse = hashParams;
      }
    }
    if (parse) {
      const urlParams = new URLSearchParams(parse);
      for (const [key, value] of urlParams.entries()) {
        params[key] = value;
      }
      return params;
    } else {
      return false;
    }
  };
  var objectToQueryString = (obj) => {
    if (!isObject(obj)) {
      return "";
    }
    return "?" + Object.keys(obj).map((key) => {
      return `${key}=${obj[key]}`;
    }).join("&");
  };
  var symbols = {
    route: Symbol("route"),
    hash: Symbol("hash"),
    store: Symbol("store"),
    fromHistory: Symbol("fromHistory"),
    expires: Symbol("expires"),
    resume: Symbol("resume"),
    backtrack: Symbol("backtrack"),
    historyState: Symbol("historyState"),
    queryParams: Symbol("queryParams")
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/provider.js
  var previousState2;
  var dataHooks = {
    on: (request) => {
      previousState2 = app.state || "";
      app._setState("Loading");
      return execProvider(request);
    },
    before: (request) => {
      return execProvider(request);
    },
    after: (request) => {
      try {
        execProvider(request, true);
      } catch (e) {
      }
      return Promise.resolve();
    }
  };
  var execProvider = (request, emitProvided) => {
    const route2 = request.route;
    const provider = route2.provider;
    const expires = route2.cache ? route2.cache * 1e3 : 0;
    const params = addPersistData(request);
    return provider.request(request.page, __spreadValues({}, params)).then(() => {
      request.page[symbols.expires] = Date.now() + expires;
      if (emitProvided) {
        emit_default(request.page, "dataProvided");
      }
    });
  };
  var addPersistData = ({
    page,
    route: route2,
    hash,
    register = new Map()
  }) => {
    const urlValues = getValuesFromHash(hash, route2.path);
    const queryParams = getQueryStringParams(hash);
    const pageData = new Map([...urlValues, ...register]);
    const params = {};
    for (let [name, value] of pageData) {
      params[name] = value;
    }
    if (queryParams) {
      params[symbols.queryParams] = queryParams;
    }
    if (register.size) {
      const obj = {};
      for (let [k, v] of register) {
        obj[k] = v;
      }
      page.persist = obj;
    }
    page.params = params;
    emit_default(page, ["urlParams"], params);
    return params;
  };
  var isPageExpired = (page) => {
    if (!page[symbols.expires]) {
      return false;
    }
    const expires = page[symbols.expires];
    const now = Date.now();
    return now >= expires;
  };
  var hasProvider = (path) => {
    if (routeExists(path)) {
      const record = routes.get(path);
      return !!record.provider;
    }
    return false;
  };
  var getProvider = (route2) => {
    if (routeExists(route2.path)) {
      const {
        provider
      } = routes.get(route2.path);
      return {
        type: provider.type,
        provider: provider.request
      };
    }
  };

  // node_modules/@lightningjs/sdk/src/Router/transitions.js
  var fade = (i, o) => {
    return new Promise((resolve) => {
      i.patch({
        alpha: 0,
        visible: true,
        smooth: {
          alpha: [1, {
            duration: 0.5,
            delay: 0.1
          }]
        }
      });
      i.transition("alpha").on("finish", () => {
        if (o) {
          o.visible = false;
        }
        resolve();
      });
    });
  };
  var crossFade = (i, o) => {
    return new Promise((resolve) => {
      i.patch({
        alpha: 0,
        visible: true,
        smooth: {
          alpha: [1, {
            duration: 0.5,
            delay: 0.1
          }]
        }
      });
      if (o) {
        o.patch({
          smooth: {
            alpha: [0, {
              duration: 0.5,
              delay: 0.3
            }]
          }
        });
      }
      i.transition("alpha").on("finish", () => {
        resolve();
      });
    });
  };
  var moveOnAxes = (axis, direction, i, o) => {
    const bounds = axis === "x" ? 1920 : 1080;
    return new Promise((resolve) => {
      i.patch({
        [`${axis}`]: direction ? bounds * -1 : bounds,
        visible: true,
        smooth: {
          [`${axis}`]: [0, {
            duration: 0.4,
            delay: 0.2
          }]
        }
      });
      if (o) {
        o.patch({
          [`${axis}`]: 0,
          smooth: {
            [`${axis}`]: [direction ? bounds : bounds * -1, {
              duration: 0.4,
              delay: 0.2
            }]
          }
        });
      }
      i.transition(axis).on("finish", () => {
        resolve();
      });
    });
  };
  var up = (i, o) => {
    return moveOnAxes("y", 0, i, o);
  };
  var down = (i, o) => {
    return moveOnAxes("y", 1, i, o);
  };
  var left = (i, o) => {
    return moveOnAxes("x", 0, i, o);
  };
  var right = (i, o) => {
    return moveOnAxes("x", 1, i, o);
  };
  var transitions_default = {
    fade,
    crossFade,
    up,
    down,
    left,
    right
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/transition.js
  var executeTransition = (pageIn, pageOut = null) => {
    const transition = pageIn.pageTransition || pageIn.easing;
    const hasCustomTransitions = !!(pageIn.smoothIn || pageIn.smoothInOut || transition);
    const transitionsDisabled = getRouterConfig().get("disableTransitions");
    if (pageIn.easing) {
      console.warn("easing() method is deprecated and will be removed. Use pageTransition()");
    }
    if (!hasCustomTransitions || transitionsDisabled) {
      pageIn.visible = true;
      if (pageOut) {
        pageOut.visible = false;
      }
      return Promise.resolve();
    }
    if (transition) {
      let type;
      try {
        type = transition.call(pageIn, pageIn, pageOut);
      } catch (e) {
        type = "crossFade";
      }
      if (isPromise(type)) {
        return type;
      }
      if (isString(type)) {
        const fn = transitions_default[type];
        if (fn) {
          return fn(pageIn, pageOut);
        }
      }
      if (pageIn.smoothIn) {
        const smooth = (p, v, args = {}) => {
          return new Promise((resolve) => {
            pageIn.visible = true;
            pageIn.setSmooth(p, v, args);
            pageIn.transition(p).on("finish", () => {
              resolve();
            });
          });
        };
        return pageIn.smoothIn({
          pageIn,
          smooth
        });
      }
    }
    return transitions_default.crossFade(pageIn, pageOut);
  };

  // node_modules/@lightningjs/sdk/src/Router/utils/loader.js
  var load = (request) => __async(void 0, null, function* () {
    let expired = false;
    try {
      request = yield loader(request);
      if (request && !request.isCancelled) {
        if (app.state === "Loading") {
          if (getPreviousState() === "Widgets") {
            app._setState("Widgets", [getActiveWidget()]);
          } else {
            app._setState("");
          }
        }
        if (!request.isSharedInstance && !request.isCancelled) {
          yield executeTransition(request.page, getActivePage());
        }
      } else {
        expired = true;
      }
      if (expired || request.isCancelled) {
        Log_default.debug("[router]:", `Rejected ${request.hash} because route to ${getLastHash()} started`);
        if (request.isCreated && !request.isSharedInstance) {
          pagesHost.remove(request.page);
        }
      } else {
        onRequestResolved(request);
        return request.page;
      }
    } catch (request2) {
      if (!request2.route) {
        console.error(request2);
      } else if (!expired) {
        const {
          route: route2
        } = request2;
        if (getOption(route2.options, "clearHistory")) {
          setHistory([]);
        } else if (!isWildcard.test(route2.path)) {
          updateHistory(request2);
        }
        if (request2.isCreated && !request2.isSharedInstance) {
          pagesHost.remove(request2.page);
        }
        handleError(request2);
      }
    }
  });
  var loader = (request) => __async(void 0, null, function* () {
    const route2 = request.route;
    const hash = request.hash;
    const register = request.register;
    let type = getComponent(route2.path);
    let isConstruct = isComponentConstructor(type);
    let provide = false;
    if (!isConstruct && !register.get(symbols.backtrack)) {
      if (!mustReuse(route2)) {
        type = type.constructor;
        isConstruct = true;
      }
    }
    if (!isConstruct) {
      request.page = type;
      if (hasProvider(route2.path)) {
        if (isPageExpired(type) || type[symbols.hash] !== hash) {
          provide = true;
        }
      }
      let currentRoute = getActivePage() && getActivePage()[symbols.route];
      if (route2.path === currentRoute) {
        request.isSharedInstance = true;
        if (isFunction(request.page.historyState)) {
          request.copiedHistoryState = request.page.historyState();
        }
      }
    } else {
      request.page = createComponent(stage, type);
      pagesHost.a(request.page);
      if (hasProvider(route2.path)) {
        provide = true;
      }
      request.isCreated = true;
    }
    request.page[symbols.hash] = hash;
    request.page[symbols.route] = route2.path;
    try {
      if (provide) {
        const {
          type: loadType,
          provider
        } = getProvider(route2);
        request.provider = provider;
        request.providerType = loadType;
        yield dataHooks[loadType](request);
        if (hash !== getLastHash()) {
          return false;
        } else {
          if (request.providerType !== "after") {
            emit_default(request.page, "dataProvided");
          }
          return request;
        }
      } else {
        addPersistData(request);
        return request;
      }
    } catch (e) {
      request.error = e;
      return Promise.reject(request);
    }
  });
  var handleError = (request) => {
    if (request && request.error) {
      console.error(request.error);
    } else if (request) {
      Log_default.error(request);
    }
    if (request.page && routeExists("!")) {
      navigate("!", {
        request
      }, false);
    }
  };
  var mustReuse = (route2) => {
    const opt = getOption(route2.options, "reuseInstance");
    const config7 = routerConfig.get("reuseInstance");
    if (isBoolean(opt)) {
      return opt;
    }
    return !(isBoolean(config7) && config7 === false);
  };

  // node_modules/@lightningjs/sdk/src/Router/base.js
  var RoutedApp = class extends Lightning_default.Component {
    static _template() {
      return {
        Pages: {
          forceZIndexContext: true
        },
        Loading: {
          rect: true,
          w: 1920,
          h: 1080,
          color: 4278190080,
          visible: false,
          zIndex: 99,
          Label: {
            mount: 0.5,
            x: 960,
            y: 540,
            text: {
              text: "Loading.."
            }
          }
        }
      };
    }
    static _states() {
      return [class Loading extends this {
        $enter() {
          this.tag("Loading").visible = true;
        }
        $exit() {
          this.tag("Loading").visible = false;
        }
      }, class Widgets extends this {
        $enter(args, widget) {
          this._widget = widget;
          this._refocus();
        }
        _getFocused() {
          return this._widget;
        }
        reload(widget) {
          this._widget = widget;
          this._refocus();
        }
        _handleKey() {
          const restoreFocus2 = routerConfig.get("autoRestoreRemote");
          if (!isBoolean(restoreFocus2) || restoreFocus2 === true) {
            Router_default.focusPage();
          }
        }
      }];
    }
    get pages() {
      return this.tag("Pages");
    }
    get widgets() {
      return this.tag("Widgets");
    }
    _handleBack() {
    }
    _getFocused() {
      return Router_default.getActivePage();
    }
  };

  // node_modules/@lightningjs/sdk/src/Router/index.js
  var navigateQueue = new Map();
  var forcedHash = "";
  var resumeHash = "";
  var startRouter = (config7, instance) => {
    bootRouter(config7, instance);
    registerListener();
    start();
  };
  var start = () => {
    let hash = (getHash() || "").replace(/^#/, "");
    const bootKey = "$";
    const params = getQueryStringParams(hash);
    const bootRequest2 = getBootRequest();
    const rootHash2 = getRootHash();
    const isDirectLoad = hash.indexOf(bootKey) !== -1;
    if (isWildcard.test(hash) && hash !== bootKey) {
      hash = "";
    }
    resumeHash = isDirectLoad ? rootHash2 : hash || rootHash2;
    const ready = () => {
      if (!hash && rootHash2) {
        if (isString(rootHash2)) {
          navigate(rootHash2);
        } else if (isFunction(rootHash2)) {
          rootHash2().then((res) => {
            if (isObject(res)) {
              navigate(res.path, res.params);
            } else {
              navigate(res);
            }
          });
        }
      } else {
        queue(hash);
        handleHashChange().then(() => {
          app._refocus();
        }).catch((e) => {
          console.error(e);
        });
      }
    };
    if (routeExists(bootKey)) {
      if (hash && !isDirectLoad) {
        if (!getRouteByHash(hash)) {
          navigate("*", {
            failedHash: hash
          });
          return;
        }
      }
      navigate(bootKey, {
        resume: resumeHash,
        reload: bootKey === hash
      }, false);
    } else if (isFunction(bootRequest2)) {
      bootRequest2(params).then(() => {
        ready();
      }).catch((e) => {
        handleBootError(e);
      });
    } else {
      ready();
    }
  };
  var handleBootError = (e) => {
    if (routeExists("!")) {
      navigate("!", {
        request: {
          error: e
        }
      });
    } else {
      console.error(e);
    }
  };
  var navigate = (url, args = {}, store3) => {
    if (isObject(url)) {
      url = getHashByName(url);
      if (!url) {
        return;
      }
    }
    let hash = getHash();
    if (!mustUpdateLocationHash() && forcedHash) {
      hash = forcedHash;
    }
    if (hash.replace(/^#/, "") !== url) {
      queue(url, args, store3);
      setHash(url);
      if (!mustUpdateLocationHash()) {
        forcedHash = url;
        handleHashChange(url).then(() => {
          app._refocus();
        }).catch((e) => {
          console.error(e);
        });
      }
    } else if (args.reload) {
      queue(url, args, store3);
      handleHashChange(url).then(() => {
        app._refocus();
      }).catch((e) => {
        console.error(e);
      });
    }
  };
  var queue = (hash, args = {}, store3) => {
    hash = cleanHash(hash);
    if (!navigateQueue.has(hash)) {
      for (let request2 of navigateQueue.values()) {
        request2.cancel();
      }
      const request = createRequest(hash, args, store3);
      navigateQueue.set(decodeURIComponent(hash), request);
      return request;
    }
    return false;
  };
  var handleHashChange = (override) => __async(void 0, null, function* () {
    const hash = cleanHash(override || getHash());
    const queueId = decodeURIComponent(hash);
    let request = navigateQueue.get(queueId);
    if (!request && !navigateQueue.size) {
      request = queue(hash);
    }
    const route2 = getRouteByHash(hash);
    if (!route2) {
      if (routeExists("*")) {
        navigate("*", {
          failedHash: hash
        });
      } else {
        console.error(`Unable to navigate to: ${hash}`);
      }
      return;
    }
    request.hash = hash;
    request.route = route2;
    let result = yield beforeEachRoute(getActiveHash(), request);
    if (route2.beforeNavigate) {
      result = yield route2.beforeNavigate(getActiveHash(), request);
    }
    if (isBoolean(result)) {
      if (result) {
        return resolveHashChange(request);
      }
    } else {
      request.cancel();
      navigateQueue.delete(queueId);
      if (isString(result)) {
        navigate(result);
      } else if (isObject(result)) {
        let store3 = true;
        if (isBoolean(result.store)) {
          store3 = result.store;
        }
        navigate(result.path, result.params, store3);
      }
    }
  });
  var resolveHashChange = (request) => {
    const hash = request.hash;
    const route2 = request.route;
    const queueId = decodeURIComponent(hash);
    setLastHash(hash);
    if (route2.path) {
      const component = getComponent(route2.path);
      if (isFunction(route2.hook)) {
        const urlParams = getValuesFromHash(hash, route2.path);
        const params = {};
        for (const key of urlParams.keys()) {
          params[key] = urlParams.get(key);
        }
        route2.hook(app, __spreadValues({}, params));
      }
      if (component) {
        const activePage2 = getActivePage();
        if (activePage2) {
          const keepAlive = keepActivePageAlive(getActiveRoute(), request);
          if (activePage2 && route2.path === getActiveRoute() && !keepAlive) {
            activePage2._setState("");
          }
        }
        if (isPage(component, stage)) {
          load(request).then(() => {
            app._refocus();
            navigateQueue.delete(queueId);
          });
        } else {
          component().then((contents) => {
            return contents.default;
          }).then((module) => {
            storeComponent(route2.path, module);
            return load(request);
          }).then(() => {
            app._refocus();
            navigateQueue.delete(queueId);
          });
        }
      } else {
        navigateQueue.delete(queueId);
      }
    }
  };
  var step = (level = 0) => {
    if (!level || isNaN(level)) {
      return false;
    }
    const history2 = getHistory();
    level = Math.abs(level);
    if (level > history2.length) {
      if (isFunction(app._handleAppClose)) {
        return app._handleAppClose();
      }
      return false;
    } else if (history2.length) {
      const route2 = history2.splice(history2.length - level, level)[0];
      setHistory(history2);
      return navigate(route2.hash, {
        [symbols.backtrack]: true,
        [symbols.historyState]: route2.state
      }, false);
    } else if (routerConfig.get("backtrack")) {
      const hashLastPart = /(\/:?[\w%\s-]+)$/;
      let hash = stripRegex(getHash());
      let floor = getFloor(hash);
      if (floor > 1) {
        while (floor--) {
          hash = hash.replace(hashLastPart, "");
          if (getRouteByHash(hash)) {
            return navigate(hash, {
              [symbols.backtrack]: true
            }, false);
          }
        }
      }
    }
    return false;
  };
  var resume = () => {
    if (isString(resumeHash)) {
      navigate(resumeHash, false);
      resumeHash = "";
    } else if (isFunction(resumeHash)) {
      resumeHash().then((res) => {
        resumeHash = "";
        if (isObject(res)) {
          navigate(res.path, res.params);
        } else {
          navigate(res);
        }
      });
    } else {
      console.warn("[Router]: resume() called but no hash found");
    }
  };
  var reload = () => {
    if (!isNavigating()) {
      const hash = getActiveHash();
      navigate(hash, {
        reload: true
      }, false);
    }
  };
  var isNavigating = () => {
    if (navigateQueue.size) {
      let isProcessing = false;
      for (let request of navigateQueue.values()) {
        if (!request.isCancelled) {
          isProcessing = true;
        }
      }
      return isProcessing;
    }
    return false;
  };
  var getResumeHash = () => {
    return resumeHash;
  };
  var getHash = () => {
    return document.location.hash;
  };
  var setHash = (url) => {
    document.location.hash = url;
  };
  var initRouter = (config7) => {
    if (config7.getHash) {
      getHash = config7.getHash;
    }
    if (config7.setHash) {
      setHash = config7.setHash;
    }
  };
  var registerListener = () => {
    Registry_default.addEventListener(window, "hashchange", () => __async(void 0, null, function* () {
      if (mustUpdateLocationHash()) {
        try {
          yield handleHashChange();
        } catch (e) {
          console.error(e);
        }
      }
    }));
  };
  var root = () => {
    const rootHash2 = getRootHash();
    if (isString(rootHash2)) {
      navigate(rootHash2);
    } else if (isFunction(rootHash2)) {
      rootHash2().then((res) => {
        if (isObject(res)) {
          navigate(res.path, res.params);
        } else {
          navigate(res);
        }
      });
    }
  };
  var Router_default = {
    startRouter,
    navigate,
    resume,
    step,
    go: step,
    back: step.bind(null, -1),
    activePage: getActivePage,
    getActivePage() {
      return getActivePage();
    },
    getActiveRoute,
    getActiveHash,
    focusWidget,
    getActiveWidget,
    restoreFocus,
    isNavigating,
    getHistory,
    setHistory,
    getHistoryState,
    replaceHistoryState,
    getQueryStringParams,
    reload,
    symbols,
    App: RoutedApp,
    focusPage: restoreFocus,
    root,
    setupRoutes() {
      console.warn("Router: setupRoutes is deprecated, consolidate your configuration");
      console.warn("https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration");
    },
    on() {
      console.warn("Router.on() is deprecated, consolidate your configuration");
      console.warn("https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration");
    },
    before() {
      console.warn("Router.before() is deprecated, consolidate your configuration");
      console.warn("https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration");
    },
    after() {
      console.warn("Router.after() is deprecated, consolidate your configuration");
      console.warn("https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration");
    }
  };

  // node_modules/@lightningjs/sdk/src/TV/defaults.js
  var defaultChannels = [{
    number: 1,
    name: "Metro News 1",
    description: "New York Cable News Channel",
    entitled: true,
    program: {
      title: "The Morning Show",
      description: "New York's best morning show",
      startTime: new Date(new Date() - 60 * 5 * 1e3).toUTCString(),
      duration: 60 * 30,
      ageRating: 0
    }
  }, {
    number: 2,
    name: "MTV",
    description: "Music Television",
    entitled: true,
    program: {
      title: "Beavis and Butthead",
      description: "American adult animated sitcom created by Mike Judge",
      startTime: new Date(new Date() - 60 * 20 * 1e3).toUTCString(),
      duration: 60 * 45,
      ageRating: 18
    }
  }, {
    number: 3,
    name: "NBC",
    description: "NBC TV Network",
    entitled: false,
    program: {
      title: "The Tonight Show Starring Jimmy Fallon",
      description: "Late-night talk show hosted by Jimmy Fallon on NBC",
      startTime: new Date(new Date() - 60 * 10 * 1e3).toUTCString(),
      duration: 60 * 60,
      ageRating: 10
    }
  }];
  var channels = () => Settings_default.get("platform", "tv", defaultChannels);
  var randomChannel = () => channels()[~~(channels.length * Math.random())];

  // node_modules/@lightningjs/sdk/src/TV/index.js
  var currentChannel;
  var callbacks = {};
  var emit = (event, ...args) => {
    callbacks[event] && callbacks[event].forEach((cb) => {
      cb.apply(null, args);
    });
  };
  var methods = {
    getChannel() {
      if (!currentChannel)
        currentChannel = randomChannel();
      return new Promise((resolve, reject) => {
        if (currentChannel) {
          const channel = __spreadValues({}, currentChannel);
          delete channel.program;
          resolve(channel);
        } else {
          reject("No channel found");
        }
      });
    },
    getProgram() {
      if (!currentChannel)
        currentChannel = randomChannel();
      return new Promise((resolve, reject) => {
        currentChannel.program ? resolve(currentChannel.program) : reject("No program found");
      });
    },
    setChannel(number) {
      return new Promise((resolve, reject) => {
        if (number) {
          const newChannel = channels().find((c) => c.number === number);
          if (newChannel) {
            currentChannel = newChannel;
            const channel = __spreadValues({}, currentChannel);
            delete channel.program;
            emit("channelChange", channel);
            resolve(channel);
          } else {
            reject("Channel not found");
          }
        } else {
          reject("No channel number supplied");
        }
      });
    }
  };
  var initTV = (config7) => {
    methods = {};
    if (config7.getChannel && typeof config7.getChannel === "function") {
      methods.getChannel = config7.getChannel;
    }
    if (config7.getProgram && typeof config7.getProgram === "function") {
      methods.getProgram = config7.getProgram;
    }
    if (config7.setChannel && typeof config7.setChannel === "function") {
      methods.setChannel = config7.setChannel;
    }
    if (config7.emit && typeof config7.emit === "function") {
      config7.emit(emit);
    }
  };

  // node_modules/@lightningjs/sdk/src/Purchase/index.js
  var billingUrl = "https://payment-sdk.metrological.com/";
  var initPurchase = (config7) => {
    if (config7.billingUrl)
      billingUrl = config7.billingUrl;
  };

  // node_modules/@lightningjs/sdk/src/Pin/dialog.js
  var PinInput = class extends Lightning_default.Component {
    static _template() {
      return {
        w: 120,
        h: 150,
        rect: true,
        color: 4287927187,
        alpha: 0.5,
        shader: {
          type: Lightning_default.shaders.RoundedRectangle,
          radius: 10
        },
        Nr: {
          w: (w) => w,
          y: 24,
          text: {
            text: "",
            textColor: 4281545523,
            fontSize: 80,
            textAlign: "center",
            verticalAlign: "middle"
          }
        }
      };
    }
    set index(v) {
      this.x = v * (120 + 24);
    }
    set nr(v) {
      this._timeout && clearTimeout(this._timeout);
      if (v) {
        this.setSmooth("alpha", 1);
      } else {
        this.setSmooth("alpha", 0.5);
      }
      this.tag("Nr").patch({
        text: {
          text: v && v.toString() || "",
          fontSize: v === "*" ? 120 : 80
        }
      });
      if (v && v !== "*") {
        this._timeout = setTimeout(() => {
          this._timeout = null;
          this.nr = "*";
        }, 750);
      }
    }
  };
  var PinDialog = class extends Lightning_default.Component {
    static _template() {
      return {
        zIndex: 1,
        w: (w) => w,
        h: (h) => h,
        rect: true,
        color: 3707764736,
        alpha: 1e-6,
        Dialog: {
          w: 648,
          h: 320,
          y: (h) => (h - 320) / 2,
          x: (w) => (w - 648) / 2,
          rect: true,
          color: 3711120179,
          shader: {
            type: Lightning_default.shaders.RoundedRectangle,
            radius: 10
          },
          Info: {
            y: 24,
            x: 48,
            text: {
              text: "Please enter your PIN",
              fontSize: 32
            }
          },
          Msg: {
            y: 260,
            x: 48,
            text: {
              text: "",
              fontSize: 28,
              textColor: 4294967295
            }
          },
          Code: {
            x: 48,
            y: 96
          }
        }
      };
    }
    _init() {
      const children = [];
      for (let i = 0; i < 4; i++) {
        children.push({
          type: PinInput,
          index: i
        });
      }
      this.tag("Code").children = children;
    }
    get pin() {
      if (!this._pin)
        this._pin = "";
      return this._pin;
    }
    set pin(v) {
      if (v.length <= 4) {
        const maskedPin = new Array(Math.max(v.length - 1, 0)).fill("*", 0, v.length - 1);
        v.length && maskedPin.push(v.length > this._pin.length ? v.slice(-1) : "*");
        for (let i = 0; i < 4; i++) {
          this.tag("Code").children[i].nr = maskedPin[i] || "";
        }
        this._pin = v;
      }
    }
    get msg() {
      if (!this._msg)
        this._msg = "";
      return this._msg;
    }
    set msg(v) {
      this._timeout && clearTimeout(this._timeout);
      this._msg = v;
      if (this._msg) {
        this.tag("Msg").text = this._msg;
        this.tag("Info").setSmooth("alpha", 0.5);
        this.tag("Code").setSmooth("alpha", 0.5);
      } else {
        this.tag("Msg").text = "";
        this.tag("Info").setSmooth("alpha", 1);
        this.tag("Code").setSmooth("alpha", 1);
      }
      this._timeout = setTimeout(() => {
        this.msg = "";
      }, 2e3);
    }
    _firstActive() {
      this.setSmooth("alpha", 1);
    }
    _handleKey(event) {
      if (this.msg) {
        this.msg = false;
      } else {
        const val = parseInt(event.key);
        if (val > -1) {
          this.pin += val;
        }
      }
    }
    _handleBack() {
      if (this.msg) {
        this.msg = false;
      } else {
        if (this.pin.length) {
          this.pin = this.pin.slice(0, this.pin.length - 1);
        } else {
          Pin_default.hide();
          this.resolve(false);
        }
      }
    }
    _handleEnter() {
      if (this.msg) {
        this.msg = false;
      } else {
        Pin_default.submit(this.pin).then((val) => {
          this.msg = "Unlocking ...";
          setTimeout(() => {
            Pin_default.hide();
          }, 1e3);
          this.resolve(val);
        }).catch((e) => {
          this.msg = e;
          this.reject(e);
        });
      }
    }
  };

  // node_modules/@lightningjs/sdk/src/Pin/index.js
  var unlocked = false;
  var contextItems = ["purchase", "parental"];
  var submit = (pin, context) => {
    return new Promise((resolve, reject) => {
      if (pin.toString() === Settings_default.get("platform", "pin", "0000").toString()) {
        unlocked = true;
        resolve(unlocked);
      } else {
        reject("Incorrect pin");
      }
    });
  };
  var check = (context) => {
    return new Promise((resolve) => {
      resolve(unlocked);
    });
  };
  var initPin = (config7) => {
    if (config7.submit && typeof config7.submit === "function") {
      submit = config7.submit;
    }
    if (config7.check && typeof config7.check === "function") {
      check = config7.check;
    }
  };
  var pinDialog = null;
  var contextCheck = (context) => {
    if (context === void 0) {
      Log_default.info("Please provide context explicitly");
      return contextItems[0];
    } else if (!contextItems.includes(context)) {
      Log_default.warn("Incorrect context provided");
      return false;
    }
    return context;
  };
  var Pin_default = {
    show() {
      return new Promise((resolve, reject) => {
        pinDialog = ApplicationInstance.stage.c({
          ref: "PinDialog",
          type: PinDialog,
          resolve,
          reject
        });
        ApplicationInstance.childList.a(pinDialog);
        ApplicationInstance.focus = pinDialog;
      });
    },
    hide() {
      ApplicationInstance.focus = null;
      ApplicationInstance.children = ApplicationInstance.children.map((child) => child !== pinDialog && child);
      pinDialog = null;
    },
    submit(pin, context) {
      return new Promise((resolve, reject) => {
        try {
          context = contextCheck(context);
          if (context) {
            submit(pin, context).then(resolve).catch(reject);
          } else {
            reject("Incorrect Context provided");
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    unlocked(context) {
      return new Promise((resolve, reject) => {
        try {
          context = contextCheck(context);
          if (context) {
            check(context).then(resolve).catch(reject);
          } else {
            reject("Incorrect Context provided");
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    locked(context) {
      return new Promise((resolve, reject) => {
        try {
          context = contextCheck(context);
          if (context) {
            check(context).then((unlocked2) => resolve(!!!unlocked2)).catch(reject);
          } else {
            reject("Incorrect Context provided");
          }
        } catch (e) {
          reject(e);
        }
      });
    }
  };

  // node_modules/@lightningjs/sdk/src/Metadata/index.js
  var metadata = {};
  var initMetadata = (metadataObj) => {
    metadata = metadataObj;
  };

  // node_modules/@lightningjs/sdk/src/Launch/index.js
  var ApplicationInstance;
  var Launch_default = (App2, appSettings, platformSettings, appData) => {
    initSettings(appSettings, platformSettings);
    initMetadata(appSettings);
    initUtils(platformSettings);
    initStorage();
    if (platformSettings.plugins) {
      platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile);
      platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics);
      platformSettings.plugins.mediaPlayer && initMediaPlayer(platformSettings.plugins.mediaPlayer);
      platformSettings.plugins.mediaPlayer && initVideoPlayer(platformSettings.plugins.mediaPlayer);
      platformSettings.plugins.ads && initAds(platformSettings.plugins.ads);
      platformSettings.plugins.router && initRouter(platformSettings.plugins.router);
      platformSettings.plugins.tv && initTV(platformSettings.plugins.tv);
      platformSettings.plugins.purchase && initPurchase(platformSettings.plugins.purchase);
      platformSettings.plugins.pin && initPin(platformSettings.plugins.pin);
    }
    const app2 = Application_default(App2, appData, platformSettings);
    ApplicationInstance = new app2(appSettings);
    return ApplicationInstance;
  };

  // node_modules/@lightningjs/sdk/src/VideoPlayer/VideoTexture.js
  var VideoTexture = class extends Lightning_default.Component {
    static _template() {
      return {
        Video: {
          alpha: 1,
          visible: false,
          pivot: 0.5,
          texture: {
            type: Lightning_default.textures.StaticTexture,
            options: {}
          }
        }
      };
    }
    set videoEl(v) {
      this._videoEl = v;
    }
    get videoEl() {
      return this._videoEl;
    }
    get videoView() {
      return this.tag("Video");
    }
    get videoTexture() {
      return this.videoView.texture;
    }
    get isVisible() {
      return this.videoView.alpha === 1 && this.videoView.visible === true;
    }
    _init() {
      this._createVideoTexture();
    }
    _createVideoTexture() {
      const stage2 = this.stage;
      const gl = stage2.gl;
      const glTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, glTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.videoTexture.options = {
        source: glTexture,
        w: this.videoEl.width,
        h: this.videoEl.height
      };
      this.videoView.w = this.videoEl.width / this.stage.getRenderPrecision();
      this.videoView.h = this.videoEl.height / this.stage.getRenderPrecision();
    }
    start() {
      const stage2 = this.stage;
      this._lastTime = 0;
      if (!this._updateVideoTexture) {
        this._updateVideoTexture = () => {
          if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
            const gl = stage2.gl;
            const currentTime = new Date().getTime();
            const getVideoPlaybackQuality = this.videoEl.getVideoPlaybackQuality();
            const frameCount = getVideoPlaybackQuality ? getVideoPlaybackQuality.totalVideoFrames : this.videoEl.webkitDecodedFrameCount;
            const mustUpdate = frameCount ? this._lastFrame !== frameCount : this._lastTime < currentTime - 30;
            if (mustUpdate) {
              this._lastTime = currentTime;
              this._lastFrame = frameCount;
              try {
                gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoEl);
                this._lastFrame = this.videoEl.webkitDecodedFrameCount;
                this.videoView.visible = true;
                this.videoTexture.options.w = this.videoEl.width;
                this.videoTexture.options.h = this.videoEl.height;
                const expectedAspectRatio = this.videoView.w / this.videoView.h;
                const realAspectRatio = this.videoEl.width / this.videoEl.height;
                if (expectedAspectRatio > realAspectRatio) {
                  this.videoView.scaleX = realAspectRatio / expectedAspectRatio;
                  this.videoView.scaleY = 1;
                } else {
                  this.videoView.scaleY = expectedAspectRatio / realAspectRatio;
                  this.videoView.scaleX = 1;
                }
              } catch (e) {
                Log_default.error("texImage2d video", e);
                this.stop();
              }
              this.videoTexture.source.forceRenderUpdate();
            }
          }
        };
      }
      if (!this._updatingVideoTexture) {
        stage2.on("frameStart", this._updateVideoTexture);
        this._updatingVideoTexture = true;
      }
    }
    stop() {
      const stage2 = this.stage;
      stage2.removeListener("frameStart", this._updateVideoTexture);
      this._updatingVideoTexture = false;
      this.videoView.visible = false;
      if (this.videoTexture.options.source) {
        const gl = stage2.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }
    position(top, left2) {
      this.videoView.patch({
        smooth: {
          x: left2,
          y: top
        }
      });
    }
    size(width, height) {
      this.videoView.patch({
        smooth: {
          w: width,
          h: height
        }
      });
    }
    show() {
      this.videoView.setSmooth("alpha", 1);
    }
    hide() {
      this.videoView.setSmooth("alpha", 0);
    }
  };

  // node_modules/@lightningjs/sdk/src/VideoPlayer/index.js
  var mediaUrl2 = (url) => url;
  var videoEl;
  var videoTexture;
  var metrics2;
  var consumer;
  var precision = 1;
  var textureMode = false;
  var initVideoPlayer = (config7) => {
    if (config7.mediaUrl) {
      mediaUrl2 = config7.mediaUrl;
    }
  };
  var eventHandlers = {};
  var state = {
    adsEnabled: false,
    playing: false,
    _playingAds: false,
    get playingAds() {
      return this._playingAds;
    },
    set playingAds(val) {
      if (this._playingAds !== val) {
        this._playingAds = val;
        fireOnConsumer(val === true ? "AdStart" : "AdEnd");
      }
    },
    skipTime: false,
    playAfterSeek: null
  };
  var hooks = {
    play() {
      state.playing = true;
    },
    pause() {
      state.playing = false;
    },
    seeked() {
      state.playAfterSeek === true && videoPlayerPlugin.play();
      state.playAfterSeek = null;
    },
    abort() {
      deregisterEventListeners();
    }
  };
  var withPrecision = (val) => Math.round(precision * val) + "px";
  var fireOnConsumer = (event, args) => {
    if (consumer) {
      consumer.fire("$videoPlayer" + event, args, videoEl.currentTime);
      consumer.fire("$videoPlayerEvent", event, args, videoEl.currentTime);
    }
  };
  var fireHook = (event, args) => {
    hooks[event] && typeof hooks[event] === "function" && hooks[event].call(null, event, args);
  };
  var customLoader = null;
  var customUnloader = null;
  var loader2 = (url, videoEl2, config7) => {
    return customLoader && typeof customLoader === "function" ? customLoader(url, videoEl2, config7) : new Promise((resolve) => {
      url = mediaUrl2(url);
      videoEl2.setAttribute("src", url);
      videoEl2.load();
      resolve();
    });
  };
  var unloader = (videoEl2) => {
    return customUnloader && typeof customUnloader === "function" ? customUnloader(videoEl2) : new Promise((resolve) => {
      videoEl2.removeAttribute("src");
      videoEl2.load();
      resolve();
    });
  };
  var setupVideoTag = () => {
    const videoEls = document.getElementsByTagName("video");
    if (videoEls && videoEls.length) {
      return videoEls[0];
    } else {
      const videoEl2 = document.createElement("video");
      const platformSettingsWidth = Settings_default.get("platform", "width") ? Settings_default.get("platform", "width") : 1920;
      const platformSettingsHeight = Settings_default.get("platform", "height") ? Settings_default.get("platform", "height") : 1080;
      videoEl2.setAttribute("id", "video-player");
      videoEl2.setAttribute("width", withPrecision(platformSettingsWidth));
      videoEl2.setAttribute("height", withPrecision(platformSettingsHeight));
      videoEl2.style.position = "absolute";
      videoEl2.style.zIndex = "1";
      videoEl2.style.display = "none";
      videoEl2.style.visibility = "hidden";
      videoEl2.style.top = withPrecision(0);
      videoEl2.style.left = withPrecision(0);
      videoEl2.style.width = withPrecision(platformSettingsWidth);
      videoEl2.style.height = withPrecision(platformSettingsHeight);
      document.body.appendChild(videoEl2);
      return videoEl2;
    }
  };
  var setUpVideoTexture = () => {
    if (!ApplicationInstance.tag("VideoTexture")) {
      const el = ApplicationInstance.stage.c({
        type: VideoTexture,
        ref: "VideoTexture",
        zIndex: 0,
        videoEl
      });
      ApplicationInstance.childList.addAt(el, 0);
    }
    return ApplicationInstance.tag("VideoTexture");
  };
  var registerEventListeners = () => {
    Log_default.info("VideoPlayer", "Registering event listeners");
    Object.keys(events_default).forEach((event) => {
      const handler = (e) => {
        if (metrics2 && metrics2[event] && typeof metrics2[event] === "function") {
          metrics2[event]({
            currentTime: videoEl.currentTime
          });
        }
        fireHook(event, {
          videoElement: videoEl,
          event: e
        });
        fireOnConsumer(events_default[event], {
          videoElement: videoEl,
          event: e
        });
      };
      eventHandlers[event] = handler;
      videoEl.addEventListener(event, handler);
    });
  };
  var deregisterEventListeners = () => {
    Log_default.info("VideoPlayer", "Deregistering event listeners");
    Object.keys(eventHandlers).forEach((event) => {
      videoEl.removeEventListener(event, eventHandlers[event]);
    });
    eventHandlers = {};
  };
  var videoPlayerPlugin = {
    consumer(component) {
      consumer = component;
    },
    loader(loaderFn) {
      customLoader = loaderFn;
    },
    unloader(unloaderFn) {
      customUnloader = unloaderFn;
    },
    position(top = 0, left2 = 0) {
      videoEl.style.left = withPrecision(left2);
      videoEl.style.top = withPrecision(top);
      if (textureMode === true) {
        videoTexture.position(top, left2);
      }
    },
    size(width = 1920, height = 1080) {
      videoEl.style.width = withPrecision(width);
      videoEl.style.height = withPrecision(height);
      videoEl.width = parseFloat(videoEl.style.width);
      videoEl.height = parseFloat(videoEl.style.height);
      if (textureMode === true) {
        videoTexture.size(width, height);
      }
    },
    area(top = 0, right2 = 1920, bottom = 1080, left2 = 0) {
      this.position(top, left2);
      this.size(right2 - left2, bottom - top);
    },
    open(url, config7 = {}) {
      if (!this.canInteract)
        return;
      metrics2 = Metrics_default.media(url);
      this.hide();
      deregisterEventListeners();
      if (this.src == url) {
        this.clear().then(this.open(url, config7));
      } else {
        const adConfig = {
          enabled: state.adsEnabled,
          duration: 300
        };
        if (config7.videoId) {
          adConfig.caid = config7.videoId;
        }
        Ads_default.get(adConfig, consumer).then((ads) => {
          state.playingAds = true;
          ads.prerolls().then(() => {
            state.playingAds = false;
            loader2(url, videoEl, config7).then(() => {
              registerEventListeners();
              this.show();
              this.play();
            }).catch((e) => {
              fireOnConsumer("error", {
                videoElement: videoEl,
                event: e
              });
            });
          });
        });
      }
    },
    reload() {
      if (!this.canInteract)
        return;
      const url = videoEl.getAttribute("src");
      this.close();
      this.open(url);
    },
    close() {
      Ads_default.cancel();
      if (state.playingAds) {
        state.playingAds = false;
        Ads_default.stop();
        setTimeout(() => {
          this.close();
        });
      }
      if (!this.canInteract)
        return;
      this.clear();
      this.hide();
      deregisterEventListeners();
    },
    clear() {
      if (!this.canInteract)
        return;
      this.pause();
      if (textureMode === true)
        videoTexture.stop();
      return unloader(videoEl).then(() => {
        fireOnConsumer("Clear", {
          videoElement: videoEl
        });
      });
    },
    play() {
      if (!this.canInteract)
        return;
      if (textureMode === true)
        videoTexture.start();
      execute_as_promise_default(videoEl.play, null, videoEl).catch((e) => {
        fireOnConsumer("error", {
          videoElement: videoEl,
          event: e
        });
      });
    },
    pause() {
      if (!this.canInteract)
        return;
      videoEl.pause();
    },
    playPause() {
      if (!this.canInteract)
        return;
      this.playing === true ? this.pause() : this.play();
    },
    mute(muted = true) {
      if (!this.canInteract)
        return;
      videoEl.muted = muted;
    },
    loop(looped = true) {
      videoEl.loop = looped;
    },
    seek(time) {
      if (!this.canInteract)
        return;
      if (!this.src)
        return;
      if (state.playAfterSeek === null) {
        state.playAfterSeek = !!state.playing;
      }
      this.pause();
      videoEl.currentTime = Math.max(0, Math.min(time, this.duration - 0.1));
    },
    skip(seconds) {
      if (!this.canInteract)
        return;
      if (!this.src)
        return;
      state.skipTime = (state.skipTime || videoEl.currentTime) + seconds;
      easeExecution_default(() => {
        this.seek(state.skipTime);
        state.skipTime = false;
      }, 300);
    },
    show() {
      if (!this.canInteract)
        return;
      if (textureMode === true) {
        videoTexture.show();
      } else {
        videoEl.style.display = "block";
        videoEl.style.visibility = "visible";
      }
    },
    hide() {
      if (!this.canInteract)
        return;
      if (textureMode === true) {
        videoTexture.hide();
      } else {
        videoEl.style.display = "none";
        videoEl.style.visibility = "hidden";
      }
    },
    enableAds(enabled = true) {
      state.adsEnabled = enabled;
    },
    get duration() {
      return videoEl && (isNaN(videoEl.duration) ? Infinity : videoEl.duration);
    },
    get currentTime() {
      return videoEl && videoEl.currentTime;
    },
    get muted() {
      return videoEl && videoEl.muted;
    },
    get looped() {
      return videoEl && videoEl.loop;
    },
    get src() {
      return videoEl && videoEl.getAttribute("src");
    },
    get playing() {
      return state.playing;
    },
    get playingAds() {
      return state.playingAds;
    },
    get canInteract() {
      return state.playingAds === false;
    },
    get top() {
      return videoEl && parseFloat(videoEl.style.top);
    },
    get left() {
      return videoEl && parseFloat(videoEl.style.left);
    },
    get bottom() {
      return videoEl && parseFloat(videoEl.style.top - videoEl.style.height);
    },
    get right() {
      return videoEl && parseFloat(videoEl.style.left - videoEl.style.width);
    },
    get width() {
      return videoEl && parseFloat(videoEl.style.width);
    },
    get height() {
      return videoEl && parseFloat(videoEl.style.height);
    },
    get visible() {
      if (textureMode === true) {
        return videoTexture.isVisible;
      } else {
        return videoEl && videoEl.style.display === "block";
      }
    },
    get adsEnabled() {
      return state.adsEnabled;
    },
    get _videoEl() {
      return videoEl;
    },
    get _consumer() {
      return consumer;
    }
  };
  var VideoPlayer_default = autoSetupMixin_default(videoPlayerPlugin, () => {
    precision = ApplicationInstance && ApplicationInstance.stage && ApplicationInstance.stage.getRenderPrecision() || precision;
    videoEl = setupVideoTag();
    textureMode = Settings_default.get("platform", "textureMode", false);
    if (textureMode === true) {
      videoEl.setAttribute("crossorigin", "anonymous");
      videoTexture = setUpVideoTexture();
    }
  });

  // node_modules/@lightningjs/sdk/src/Ads/index.js
  var consumer2;
  var getAds = () => {
    return Promise.resolve({
      prerolls: [],
      midrolls: [],
      postrolls: []
    });
  };
  var initAds = (config7) => {
    if (config7.getAds) {
      getAds = config7.getAds;
    }
  };
  var state2 = {
    active: false
  };
  var playSlot = (slot = []) => {
    return slot.reduce((promise, ad) => {
      return promise.then(() => {
        return playAd(ad);
      });
    }, Promise.resolve(null));
  };
  var playAd = (ad) => {
    return new Promise((resolve) => {
      if (state2.active === false) {
        Log_default.info("Ad", "Skipping add due to inactive state");
        return resolve();
      }
      const videoEl2 = document.getElementsByTagName("video")[0];
      videoEl2.style.display = "block";
      videoEl2.style.visibility = "visible";
      videoEl2.src = mediaUrl2(ad.url);
      videoEl2.load();
      let timeEvents = null;
      let timeout3;
      const cleanup = () => {
        Object.keys(handlers).forEach((handler) => videoEl2.removeEventListener(handler, handlers[handler]));
        resolve();
      };
      const handlers = {
        play() {
          Log_default.info("Ad", "Play ad", ad.url);
          fireOnConsumer2("Play", ad);
          sendBeacon(ad.callbacks, "defaultImpression");
        },
        ended() {
          fireOnConsumer2("Ended", ad);
          sendBeacon(ad.callbacks, "complete");
          cleanup();
        },
        timeupdate() {
          if (!timeEvents && videoEl2.duration) {
            timeEvents = {
              firstQuartile: videoEl2.duration / 4,
              midPoint: videoEl2.duration / 2,
              thirdQuartile: videoEl2.duration / 4 * 3
            };
            Log_default.info("Ad", "Calculated quartiles times", {
              timeEvents
            });
          }
          if (timeEvents && timeEvents.firstQuartile && videoEl2.currentTime >= timeEvents.firstQuartile) {
            fireOnConsumer2("FirstQuartile", ad);
            delete timeEvents.firstQuartile;
            sendBeacon(ad.callbacks, "firstQuartile");
          }
          if (timeEvents && timeEvents.midPoint && videoEl2.currentTime >= timeEvents.midPoint) {
            fireOnConsumer2("MidPoint", ad);
            delete timeEvents.midPoint;
            sendBeacon(ad.callbacks, "midPoint");
          }
          if (timeEvents && timeEvents.thirdQuartile && videoEl2.currentTime >= timeEvents.thirdQuartile) {
            fireOnConsumer2("ThirdQuartile", ad);
            delete timeEvents.thirdQuartile;
            sendBeacon(ad.callbacks, "thirdQuartile");
          }
        },
        stalled() {
          fireOnConsumer2("Stalled", ad);
          timeout3 = setTimeout(() => {
            cleanup();
          }, 5e3);
        },
        canplay() {
          timeout3 && clearTimeout(timeout3);
        },
        error() {
          fireOnConsumer2("Error", ad);
          cleanup();
        },
        abort() {
          cleanup();
        }
      };
      Object.keys(handlers).forEach((handler) => videoEl2.addEventListener(handler, handlers[handler]));
      videoEl2.play();
    });
  };
  var sendBeacon = (callbacks2, event) => {
    if (callbacks2 && callbacks2[event]) {
      Log_default.info("Ad", "Sending beacon", event, callbacks2[event]);
      return callbacks2[event].reduce((promise, url) => {
        return promise.then(() => fetch(url).then((response) => {
          if (response.status === 200) {
            fireOnConsumer2("Beacon" + event + "Sent");
          } else {
            fireOnConsumer2("Beacon" + event + "Failed" + response.status);
          }
          Promise.resolve(null);
        }).catch(() => {
          Promise.resolve(null);
        }));
      }, Promise.resolve(null));
    } else {
      Log_default.info("Ad", "No callback found for " + event);
    }
  };
  var fireOnConsumer2 = (event, args) => {
    if (consumer2) {
      consumer2.fire("$ad" + event, args);
      consumer2.fire("$adEvent", event, args);
    }
  };
  var Ads_default = {
    get(config7, videoPlayerConsumer) {
      if (config7.enabled === false) {
        return Promise.resolve({
          prerolls() {
            return Promise.resolve();
          }
        });
      }
      consumer2 = videoPlayerConsumer;
      return new Promise((resolve) => {
        Log_default.info("Ad", "Starting session");
        getAds(config7).then((ads) => {
          Log_default.info("Ad", "API result", ads);
          resolve({
            prerolls() {
              if (ads.preroll) {
                state2.active = true;
                fireOnConsumer2("PrerollSlotImpression", ads);
                sendBeacon(ads.preroll.callbacks, "slotImpression");
                return playSlot(ads.preroll.ads).then(() => {
                  fireOnConsumer2("PrerollSlotEnd", ads);
                  sendBeacon(ads.preroll.callbacks, "slotEnd");
                  state2.active = false;
                });
              }
              return Promise.resolve();
            },
            midrolls() {
              return Promise.resolve();
            },
            postrolls() {
              return Promise.resolve();
            }
          });
        });
      });
    },
    cancel() {
      Log_default.info("Ad", "Cancel Ad");
      state2.active = false;
    },
    stop() {
      Log_default.info("Ad", "Stop Ad");
      state2.active = false;
      const videoEl2 = document.getElementsByTagName("video")[0];
      videoEl2.pause();
      videoEl2.removeAttribute("src");
    }
  };

  // node_modules/@lightningjs/sdk/src/Img/ScaledImageTexture.js
  var ScaledImageTexture = class extends Lightning_default.textures.ImageTexture {
    constructor(stage2) {
      super(stage2);
      this._scalingOptions = void 0;
    }
    set options(options) {
      this.resizeMode = this._scalingOptions = options;
    }
    _getLookupId() {
      return `${this._src}-${this._scalingOptions.type}-${this._scalingOptions.w}-${this._scalingOptions.h}`;
    }
    getNonDefaults() {
      const obj = super.getNonDefaults();
      if (this._src) {
        obj.src = this._src;
      }
      return obj;
    }
  };

  // node_modules/ThunderJS/dist/thunderJS.js
  var thunderJS_default = ThunderJS = function() {
    "use strict";
    function h(e2) {
      return (h = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e3) {
        return typeof e3;
      } : function(e3) {
        return e3 && typeof Symbol == "function" && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
      })(e2);
    }
    function n(n2, e2) {
      var t2 = Object.keys(n2);
      if (Object.getOwnPropertySymbols) {
        var r2 = Object.getOwnPropertySymbols(n2);
        e2 && (r2 = r2.filter(function(e3) {
          return Object.getOwnPropertyDescriptor(n2, e3).enumerable;
        })), t2.push.apply(t2, r2);
      }
      return t2;
    }
    function t(o2) {
      for (var e2 = 1; e2 < arguments.length; e2++) {
        var i2 = arguments[e2] != null ? arguments[e2] : {};
        e2 % 2 ? n(Object(i2), true).forEach(function(e3) {
          var n2, t2, r2;
          n2 = o2, r2 = i2[t2 = e3], t2 in n2 ? Object.defineProperty(n2, t2, {
            value: r2,
            enumerable: true,
            configurable: true,
            writable: true
          }) : n2[t2] = r2;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(o2, Object.getOwnPropertyDescriptors(i2)) : n(Object(i2)).forEach(function(e3) {
          Object.defineProperty(o2, e3, Object.getOwnPropertyDescriptor(i2, e3));
        });
      }
      return o2;
    }
    var e = null;
    typeof WebSocket != "undefined" && (e = WebSocket);
    function u(n2) {
      if (typeof n2 == "string") {
        n2 = (n2 = n2.normalize().replace(/\\\\x([0-9A-Fa-f]{2})/g, "")).normalize().replace(/\\x([0-9A-Fa-f]{2})/g, ""), n2 = JSON.parse(n2);
      }
      if (!n2.id && n2.method) {
        var e2 = l[n2.method];
        e2 && Array.isArray(e2) && e2.length && e2.forEach(function(e3) {
          e3(n2.params);
        });
      }
    }
    function v(c2) {
      return new Promise(function(n2, t2) {
        var e2, r2 = [(e2 = c2) && e2.protocol || "ws://", e2 && e2.host || "localhost", ":" + (e2 && e2.port || 80), e2 && e2.endpoint || "/jsonrpc", e2 && e2.token ? "?token=" + e2.token : null].join(""), o2 = a[r2];
        if (o2 && o2.readyState === 1)
          return n2(o2);
        if (o2 && o2.readyState === 0) {
          return o2.addEventListener("open", function e3() {
            o2.removeEventListener("open", e3), n2(o2);
          });
        }
        if (o2 == null) {
          c2.debug && console.log("Opening socket to " + r2), o2 = new s(r2, c2 && c2.subprotocols || "notification"), (a[r2] = o2).addEventListener("message", function(e3) {
            c2.debug && (console.log(" "), console.log("API REPONSE:"), console.log(JSON.stringify(e3.data, null, 2)), console.log(" ")), function(e4) {
              if (typeof e4 == "string") {
                e4 = (e4 = e4.normalize().replace(/\\\\x([0-9A-Fa-f]{2})/g, "")).normalize().replace(/\\x([0-9A-Fa-f]{2})/g, ""), e4 = JSON.parse(e4);
              }
              if (e4.id) {
                var n3 = g[e4.id];
                n3 ? ("result" in e4 ? n3.resolve(e4.result) : n3.reject(e4.error), delete g[e4.id]) : console.log("no pending request found with id " + e4.id);
              }
            }(e3.data);
          }), o2.addEventListener("message", function(e3) {
            u(e3.data);
          }), o2.addEventListener("error", function() {
            u({
              method: "client.ThunderJS.events.error"
            }), a[r2] = null;
          });
          var i2 = function(e3) {
            a[r2] = null, t2(e3);
          };
          o2.addEventListener("close", i2), o2.addEventListener("open", function() {
            u({
              method: "client.ThunderJS.events.connect"
            }), o2.removeEventListener("close", i2), o2.addEventListener("close", function() {
              u({
                method: "client.ThunderJS.events.disconnect"
              }), a[r2] = null;
            }), n2(o2);
          });
        } else
          a[r2] = null, t2("Socket error");
      });
    }
    function r(d) {
      return {
        request: function(a2, f2, p2) {
          return new Promise(function(e2, n2) {
            var t2, r2, o2, i2, c2, u2 = y += 1, s2 = (t2 = d.versions, r2 = a2, (i2 = (o2 = p2) && o2.version) ? i2 : t2 && (t2[r2] || t2.default) || 1), l2 = function(e3, n3, t3, r3, o3) {
              r3 && (delete r3.version, r3.versionAsParameter && (r3.version = r3.versionAsParameter, delete r3.versionAsParameter));
              var i3 = {
                jsonrpc: "2.0",
                id: e3,
                method: [n3, o3, t3].join(".")
              };
              return !r3 && r3 !== false || h(r3) === "object" && Object.keys(r3).length === 0 || (i3.params = r3), i3;
            }(u2, a2, f2, p2, s2);
            d.debug && (console.log(" "), console.log("API REQUEST:"), console.log(JSON.stringify(l2, null, 2)), console.log(" ")), g[u2] = {
              body: l2,
              resolve: e2,
              reject: n2
            }, c2 = l2, v(d).then(function(e3) {
              e3.send(JSON.stringify(c2));
            }).catch(function(e3) {
              n2(e3);
            });
          });
        }
      };
    }
    var s = e, g = {}, l = {}, a = {}, y = 0, o = {
      DeviceInfo: {
        freeRam: function(e2) {
          return this.call("systeminfo", e2).then(function(e3) {
            return e3.freeram;
          });
        },
        version: function(e2) {
          return this.call("systeminfo", e2).then(function(e3) {
            return e3.version;
          });
        }
      }
    };
    function i(n2, t2, e2, r2) {
      var o2 = this, i2 = function(e3, n3, t3, r3) {
        var o3 = f(e3, n3);
        if (!l[o3]) {
          l[o3] = [];
          if (e3 !== "ThunderJS") {
            var i3 = "register";
            var c2 = o3.split(".").slice(0, -1).join(".");
            var u2 = {
              event: n3,
              id: c2
            };
            this.api.request(e3, i3, u2).catch(function(e4) {
              if (typeof r3 === "function")
                r3(e4.message);
            });
          }
        }
        return l[o3].push(t3), l[o3].length - 1;
      }.call(this, n2, t2, e2, r2);
      return {
        dispose: function() {
          var e3 = f(n2, t2);
          l[e3] !== void 0 && (l[e3].splice(i2, 1), l[e3].length === 0 && function(e4, n3, t3) {
            var r3 = f(e4, n3);
            if (delete l[r3], e4 !== "ThunderJS") {
              var o3 = "unregister";
              var i3 = r3.split(".").slice(0, -1).join(".");
              var c2 = {
                event: n3,
                id: i3
              };
              this.api.request(e4, o3, c2).catch(function(e5) {
                if (typeof t3 === "function")
                  t3(e5.message);
              });
            }
          }.call(o2, n2, t2, r2));
        }
      };
    }
    function f(e2, n2) {
      return ["client", e2, "events", n2].join(".");
    }
    var c = function t2(e2) {
      return {
        options: e2,
        api: r(e2),
        plugin: false,
        call: function() {
          var e3 = Array.prototype.slice.call(arguments);
          this.plugin && e3[0] !== this.plugin && e3.unshift(this.plugin);
          var n2 = e3[0], t3 = e3[1];
          return typeof this[n2][t3] == "function" ? this[n2][t3](e3[2]) : this.api.request.apply(this, e3);
        },
        registerPlugin: function(e3, n2) {
          this[e3] = p(Object.assign(Object.create(t2), n2, {
            plugin: e3
          }));
        },
        subscribe: function() {
        },
        on: function() {
          var e3 = Array.prototype.slice.call(arguments);
          return ["connect", "disconnect", "error"].indexOf(e3[0]) !== -1 ? e3.unshift("ThunderJS") : this.plugin && e3[0] !== this.plugin && e3.unshift(this.plugin), i.apply(this, e3);
        },
        once: function() {
          console.log("todo ...");
        }
      };
    }, p = function e2(n2) {
      return new Proxy(n2, {
        get: function(r2, o2) {
          var i2 = r2[o2];
          return o2 === "api" ? r2.api : i2 !== void 0 ? typeof i2 == "function" ? -1 < ["on", "once", "subscribe"].indexOf(o2) ? function() {
            for (var e3 = arguments.length, n3 = new Array(e3), t2 = 0; t2 < e3; t2++)
              n3[t2] = arguments[t2];
            return i2.apply(this, n3);
          } : function() {
            for (var e3 = arguments.length, n3 = new Array(e3), t2 = 0; t2 < e3; t2++)
              n3[t2] = arguments[t2];
            return function(t3, e4) {
              h(t3) === "object" && (h(t3) !== "object" || t3.then && typeof t3.then == "function") || (t3 = new Promise(function(e5, n5) {
                (t3 instanceof Error == false ? e5 : n5)(t3);
              }));
              var n4 = typeof e4[e4.length - 1] == "function" ? e4[e4.length - 1] : null;
              if (!n4)
                return t3;
              t3.then(function(e5) {
                return n4(null, e5);
              }).catch(function(e5) {
                return n4(e5);
              });
            }(i2.apply(this, n3), n3);
          } : h(i2) === "object" ? e2(Object.assign(Object.create(c(r2.options)), i2, {
            plugin: o2
          })) : i2 : r2.plugin === false ? e2(Object.assign(Object.create(c(r2.options)), {}, {
            plugin: o2
          })) : function() {
            for (var e3 = arguments.length, n3 = new Array(e3), t2 = 0; t2 < e3; t2++)
              n3[t2] = arguments[t2];
            return n3.unshift(o2), r2.call.apply(this, n3);
          };
        }
      });
    };
    return function(e2) {
      return e2.token === void 0 && typeof window != "undefined" && window.thunder && typeof window.thunder.token == "function" && (e2.token = window.thunder.token()), p(t({}, c(e2), {}, o));
    };
  }();

  // src/Config/Config.js
  var themeOptions = {
    partnerOne: {
      hex: 4294279731,
      logo: "RDKLogo.png",
      background: "0xff000000"
    },
    partnerTwo: {
      hex: 4287744072,
      logo: "RDKLogo.png",
      background: "0xff000000"
    }
  };
  var language2 = {
    English: {
      id: "en",
      fontSrc: "Play/Play-Regular.ttf",
      font: "Play"
    },
    Spanish: {
      id: "sp",
      fontSrc: "Play/Play-Regular.ttf",
      font: "Play"
    }
  };
  var availableLanguages = ["English", "Spanish"];
  var CONFIG = {
    theme: themeOptions["partnerOne"],
    language: localStorage.getItem("Language") != null && availableLanguages.includes(localStorage.getItem("Language")) ? language2[localStorage.getItem("Language")] : language2["English"]
  };

  // src/screens/Error.js
  var Error2 = class extends Lightning_default.Component {
    static _template() {
      return {
        rect: true,
        w: 1920,
        h: 1080,
        color: 4290184710,
        InvalidText: {
          x: 960,
          y: 540,
          mount: 0.5,
          text: {
            text: "Invalid Route",
            textColor: 4278190080,
            fontFace: CONFIG.language.font,
            fontSize: 70,
            fontStyle: "bold"
          },
          SubText: {
            y: 80,
            text: {
              text: "Press OK to return home",
              textColor: 4294967295,
              fontFace: CONFIG.language.font,
              fontSize: 40,
              fontStyle: "bold",
              textAlign: "center"
            }
          }
        }
      };
    }
    _handleEnter() {
      Router_default.navigate("menu");
    }
    _focus() {
      console.log("focus error page");
    }
    pageTransition() {
      return "up";
    }
  };

  // src/api/NetworkApi.js
  var Network = class {
    constructor() {
      this._events = new Map();
      const config7 = {
        host: "127.0.0.1",
        port: 9998,
        default: 1
      };
      this._thunder = thunderJS_default(config7);
      this.callsign = "org.rdk.Network";
    }
    activate() {
      return new Promise((resolve, reject) => {
        this._thunder.call("Controller", "activate", {
          callsign: this.callsign
        }).then((result) => {
          this._thunder.on(this.callsign, "onIPAddressStatusChanged", (notification) => {
            if (this._events.has("onIPAddressStatusChanged")) {
              this._events.get("onIPAddressStatusChanged")(notification);
            }
          });
          this._thunder.on(this.callsign, "onDefaultInterfaceChanged", (notification) => {
            if (this._events.has("onDefaultInterfaceChanged")) {
              this._events.get("onDefaultInterfaceChanged")(notification);
            }
          });
          this._thunder.on(this.callsign, "onConnectionStatusChanged", (notification) => {
            if (this._events.has("onConnectionStatusChanged")) {
              this._events.get("onConnectionStatusChanged")(notification);
            }
          });
          console.log("Activation success");
          resolve(true);
        });
      });
    }
    registerEvent(eventId, callback) {
      this._events.set(eventId, callback);
    }
    getIP() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "getStbIp").then((result) => {
          if (result.success) {
            resolve(result.ip);
          }
          reject(false);
        }).catch((err) => {
          reject(err);
        });
      });
    }
    getInterfaces() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "getInterfaces").then((result) => {
          if (result.success) {
            resolve(result.interfaces);
          }
        }).catch((err) => {
          console.error(`getInterfaces fail: ${err}`);
          reject(err);
        });
      });
    }
    getDefaultInterface() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "getDefaultInterface").then((result) => {
          if (result.success) {
            resolve(result.interface);
          }
        }).catch((err) => {
          console.error(`getDefaultInterface fail: ${err}`);
          reject(err);
        });
      });
    }
    setDefaultInterface(interfaceName) {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "setDefaultInterface", {
          "interface": interfaceName,
          "persist": true
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error(`setDefaultInterface fail: ${err}`);
          reject(err);
        });
      });
    }
    getSTBIPFamily() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "getSTBIPFamily").then((result) => {
        });
      });
    }
    getIPSettings(currentInterface2) {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "getIPSettings", {
          "interface": currentInterface2
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error(`getIPSettings fail: ${err}`);
          reject(err);
        });
      });
    }
    setIPSettings(IPSettings) {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "setIPSettings", IPSettings).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error(`setIPSettings fail: ${err}`);
          reject(err);
        });
      });
    }
    isConnectedToInternet() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "isConnectedToInternet").then((result) => {
          if (result.success) {
            resolve(result.connectedToInternet);
          }
        }).catch((err) => {
          console.error(`isConnectedToInternet fail: ${err}`);
          reject(err);
        });
      });
    }
  };

  // src/api/AppApi.js
  var activatedWeb = false;
  var activatedLightning = false;
  var activatedCobalt = false;
  var activatedAmazon = false;
  var activatedNetflix = false;
  var webUrl = "";
  var lightningUrl = "";
  var activatedNative = false;
  var nativeUrl = "";
  var cobaltUrl = "";
  var config = {
    host: "127.0.0.1",
    port: 9998,
    default: 1
  };
  var thunder = thunderJS_default(config);
  var AppApi = class {
    constructor() {
      this.activatedForeground = false;
      this._events = new Map();
    }
    registerEvent(eventId, callback) {
      this._events.set(eventId, callback);
    }
    checkForInternet() {
      return new Promise((resolve, reject) => {
        let i = 0;
        var poll = () => {
          i++;
          this.getIP().then((result) => {
            if (result == true) {
              resolve(result);
            } else if (i < 10)
              poll();
            else
              resolve(false);
          });
        };
        poll();
      });
    }
    getIP() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.System";
        thunder.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder.call(systemcCallsign, "getDeviceInfo", {
            params: "estb_ip"
          }).then((result) => {
            resolve(result.success);
          }).catch((err) => {
            resolve(false);
          });
        }).catch((err) => {
        });
      });
    }
    getZone() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.System";
        thunder.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder.call(systemcCallsign, "getTimeZoneDST").then((result) => {
            resolve(result.timeZone);
          }).catch((err) => {
            resolve(false);
          });
        }).catch((err) => {
        });
      });
    }
    getResolution() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getCurrentResolution", {
          "videoDisplay": "HDMI0"
        }).then((result) => {
          resolve(result.resolution);
        }).catch((err) => {
          resolve("NA");
        });
      });
    }
    activateDisplaySettings() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.DisplaySettings";
        thunder.Controller.activate({
          callsign: systemcCallsign
        }).then((res) => {
        }).catch((err) => {
          console.error(`error while activating the displaysettings plugin`);
        });
      });
    }
    getSupportedResolutions() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.DisplaySettings";
        thunder.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder.call(systemcCallsign, "getSupportedResolutions", {
            params: "HDMI0"
          }).then((result) => {
            resolve(result.supportedResolutions);
          }).catch((err) => {
            resolve(false);
          });
        }).catch((err) => {
          console.log("Display Error", JSON.stringify(err));
        });
      });
    }
    setResolution(res) {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.DisplaySettings";
        thunder.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder.call(systemcCallsign, "setCurrentResolution", {
            videoDisplay: "HDMI0",
            resolution: res,
            persist: true
          }).then((result) => {
            resolve(result.success);
          }).catch((err) => {
            resolve(false);
          });
        }).catch((err) => {
          console.log("Display Error", JSON.stringify(err));
        });
      });
    }
    getHDCPStatus() {
      console.log("checking hdcp status");
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.HdcpProfile";
        thunder.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder.call(systemcCallsign, "getHDCPStatus").then((result) => {
            resolve(result.HDCPStatus);
            console.log("HDCP Status from AppApi.js : " + JSON.stringify(result.HDCPStatus));
          }).catch((err) => {
            resolve(false);
          });
        }).catch((err) => {
          console.log("Display Error", JSON.stringify(err));
        });
      });
    }
    getTvHDRSupport() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.DisplaySettings";
        thunder.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder.call(systemcCallsign, "getTvHDRSupport").then((result) => {
            resolve(result);
            console.log("HDR Support Status from AppApi.js : " + JSON.stringify(result));
          }).catch((err) => {
            resolve(false);
          });
        }).catch((err) => {
          console.log("Display Error", JSON.stringify(err));
        });
      });
    }
    getSettopHDRSupport() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.DisplaySettings";
        thunder.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder.call(systemcCallsign, "getSettopHDRSupport").then((result) => {
            resolve(result);
            console.log("HDR Support Status for STB from AppApi.js : " + JSON.stringify(result));
          }).catch((err) => {
            resolve(false);
          });
        }).catch((err) => {
          console.log("Display Error", JSON.stringify(err));
        });
      });
    }
    getHDRSetting() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "DisplayInfo";
        thunder.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder.call(systemcCallsign, "hdrsetting").then((result) => {
            resolve(result);
            console.log("HDR format in use from AppApi.js : " + JSON.stringify(result));
          }).catch((err) => {
            resolve(false);
          });
        }).catch((err) => {
          console.log("Display Error", JSON.stringify(err));
        });
      });
    }
    getDRMS() {
      console.log("calling getDDRMS");
      return new Promise((resolve, reject) => {
        const systemcCallsign = "OCDM";
        thunder.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder.call(systemcCallsign, "drms").then((result) => {
            resolve(result);
            console.log("supported drms from AppApi.js : " + JSON.stringify(result));
          }).catch((err) => {
            resolve(false);
          });
        }).catch((err) => {
          console.log("Display Error", JSON.stringify(err));
        });
      });
    }
    clearCache() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "ResidentApp";
        thunder.call(systemcCallsign, "delete", {
          path: ".cache"
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          resolve(err);
        });
      });
    }
    launchWeb(url) {
      const childCallsign = "HtmlApp";
      if (webUrl != url) {
        thunder.call("org.rdk.RDKShell", "launch", {
          callsign: childCallsign,
          type: childCallsign,
          uri: url
        }).then(() => {
          thunder.call("org.rdk.RDKShell", "moveToFront", {
            client: childCallsign
          });
          thunder.call("org.rdk.RDKShell", "setFocus", {
            client: childCallsign
          });
        }).catch((err) => {
        });
      } else {
        thunder.call("org.rdk.RDKShell", "moveToFront", {
          client: childCallsign
        });
        thunder.call("org.rdk.RDKShell", "setFocus", {
          client: childCallsign
        });
      }
      webUrl = url;
      activatedWeb = true;
    }
    launchLightning(url) {
      const childCallsign = "LightningApp";
      if (lightningUrl != url) {
        thunder.call("org.rdk.RDKShell", "launch", {
          callsign: childCallsign,
          type: childCallsign,
          uri: url
        }).then(() => {
          thunder.call("org.rdk.RDKShell", "moveToFront", {
            client: childCallsign
          });
          thunder.call("org.rdk.RDKShell", "setFocus", {
            client: childCallsign
          });
        }).catch((err) => {
        });
      } else {
        thunder.call("org.rdk.RDKShell", "moveToFront", {
          client: childCallsign
        });
        thunder.call("org.rdk.RDKShell", "setFocus", {
          client: childCallsign
        });
      }
      lightningUrl = url;
      activatedLightning = true;
    }
    launchCobalt(url) {
      const childCallsign = "Cobalt";
      thunder.call("org.rdk.RDKShell", "launch", {
        callsign: childCallsign,
        type: childCallsign
      }).then(() => {
        thunder.call("org.rdk.RDKShell", "moveToFront", {
          client: childCallsign
        });
        thunder.call("Cobalt", "deeplink", url);
        thunder.call("org.rdk.RDKShell", "setFocus", {
          client: childCallsign
        });
      }).catch((err) => {
      });
      activatedCobalt = true;
    }
    launchPremiumApp(childCallsign) {
      thunder.call("org.rdk.RDKShell", "launch", {
        callsign: childCallsign,
        type: childCallsign
      }).then(() => {
        thunder.call("org.rdk.RDKShell", "moveToFront", {
          client: childCallsign
        });
        thunder.call("org.rdk.RDKShell", "setFocus", {
          client: childCallsign
        });
      }).catch((err) => {
      });
      childCallsign === "Amazon" ? activatedAmazon = true : activatedNetflix = true;
    }
    launchResident(url, client) {
      const childCallsign = client;
      thunder.call("org.rdk.RDKShell", "launch", {
        callsign: childCallsign,
        type: "ResidentApp",
        uri: url
      }).then(() => {
        thunder.call("org.rdk.RDKShell", "moveToFront", {
          client: childCallsign
        });
        thunder.call("org.rdk.RDKShell", "setFocus", {
          client: childCallsign
        });
      }).catch((err) => {
        console.log("org.rdk.RDKShell launch " + JSON.stringify(err));
      });
    }
    launchforeground() {
      const childCallsign = "foreground";
      let url = location.href.split(location.hash)[0].split("index.html")[0];
      let notification_url = url + "static/notification/index.html";
      if (location.host.includes("127.0.0.1")) {
        notification_url = url + "lxresui/static/notification/index.html";
      }
      console.log(notification_url, "|", location.host, location);
      thunder.call("org.rdk.RDKShell", "launch", {
        callsign: childCallsign,
        type: "LightningApp",
        uri: notification_url
      }).then(() => {
        this.activatedForeground = true;
        thunder.call("org.rdk.RDKShell", "setFocus", {
          client: "ResidentApp"
        });
        thunder.call("org.rdk.RDKShell", "setVisibility", {
          client: "foreground",
          visible: false
        });
      }).catch((err) => {
      }).catch((err) => {
        console.log("org.rdk.RDKShell launch " + JSON.stringify(err));
      });
    }
    suspendWeb() {
      webUrl = "";
      thunder.call("org.rdk.RDKShell", "suspend", {
        callsign: "HtmlApp"
      });
    }
    suspendLightning() {
      lightningUrl = "";
      thunder.call("org.rdk.RDKShell", "suspend", {
        callsign: "LightningApp"
      });
    }
    suspendCobalt() {
      thunder.call("org.rdk.RDKShell", "suspend", {
        callsign: "Cobalt"
      });
    }
    suspendPremiumApp(appName) {
      thunder.call("org.rdk.RDKShell", "suspend", {
        callsign: appName
      });
    }
    deactivateWeb() {
      thunder.call("org.rdk.RDKShell", "destroy", {
        callsign: "HtmlApp"
      });
      activatedWeb = false;
      webUrl = "";
    }
    deactivateCobalt() {
      thunder.call("org.rdk.RDKShell", "destroy", {
        callsign: "Cobalt"
      });
      activatedCobalt = false;
      cobaltUrl = "";
    }
    cobaltStateChangeEvent() {
      try {
        thunder.on("Controller", "statechange", (notification) => {
          if (this._events.has("statechange")) {
            this._events.get("statechange")(notification);
          }
        });
      } catch (e) {
        console.log("Failed to register statechange event" + e);
      }
    }
    deactivateNativeApp(appName) {
      thunder.call("org.rdk.RDKShell", "destroy", {
        callsign: appName
      });
      appName === "Amazon" ? activatedAmazon = false : activatedNetflix = false;
    }
    deactivateLightning() {
      thunder.call("org.rdk.RDKShell", "destroy", {
        callsign: "LightningApp"
      });
      activatedLightning = false;
      lightningUrl = "";
    }
    deactivateResidentApp(client) {
      thunder.call("org.rdk.RDKShell", "destroy", {
        callsign: client
      });
    }
    setVisibility(client, visible) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.RDKShell", "setVisibility", {
          client,
          visible
        });
        thunder.call("org.rdk.RDKShell", "setFocus", {
          client
        }).then((res) => {
          resolve(true);
        }).catch((err) => {
          console.log("Set focus error", JSON.stringify(err));
          reject(false);
        });
      });
    }
    enabledisableinactivityReporting(bool) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.RDKShell", "enableInactivityReporting", {
          "enable": bool
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting sound mode:", JSON.stringify(err, 3, null));
          reject(err);
        });
      });
    }
    setInactivityInterval(t) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.RDKShell", "setInactivityInterval", {
          "interval": t
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          reject(false);
        });
      });
    }
    zorder(cli) {
      thunder.call("org.rdk.RDKShell", "moveToFront", {
        client: cli,
        callsign: cli
      });
    }
    configureApplication(appName, config_data) {
      let plugin = "Controller";
      let method = "configuration@" + appName;
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
      });
    }
    configureApplication(appName, config_data) {
      let plugin = "Controller";
      let method = "configuration@" + appName;
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
      });
    }
    launchNative(url) {
      const childCallsign = "testApp";
      if (nativeUrl != url) {
        thunder.call("org.rdk.RDKShell", "launchApplication", {
          client: childCallsign,
          uri: url,
          mimeType: "application/native"
        }).then(() => {
          thunder.call("org.rdk.RDKShell", "moveToFront", {
            client: childCallsign
          });
          thunder.call("org.rdk.RDKShell", "setFocus", {
            client: childCallsign
          });
        }).catch((err) => {
          console.log("org.rdk.RDKShell launch " + JSON.stringify(err));
        });
      } else {
        thunder.call("org.rdk.RDKShell", "moveToFront", {
          client: childCallsign
        });
        thunder.call("org.rdk.RDKShell", "setFocus", {
          client: childCallsign
        });
      }
      nativeUrl = url;
      activatedNative = true;
    }
    killNative() {
      thunder.call("org.rdk.RDKShell", "kill", {
        callsign: "testApp"
      });
      activatedNative = false;
      nativeUrl = "";
    }
    static pluginStatus(plugin) {
      switch (plugin) {
        case "WebApp":
          return activatedWeb;
        case "Cobalt":
          return activatedCobalt;
        case "Lightning":
          return activatedLightning;
        case "Amazon":
          return activatedAmazon;
        case "Netflix":
          return activatedNetflix;
      }
    }
    standby(value) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "setPowerState", {
          "powerState": value,
          "standbyReason": "Requested by user"
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          resolve(false);
        });
      });
    }
    audio_mute(value, audio_source) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "setMuted", {
          "audioPort": audio_source,
          "muted": value
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("audio mute error:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    muteStatus(port) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getMuted", {
          audioPort: port
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("audio mute error:", JSON.stringify(err, 3, null));
          reject(false);
        });
      });
    }
    enableDisplaySettings() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.RDKShell", "launch", {
          callsign: "org.rdk.DisplaySettings"
        }).then((result) => {
          console.log("Successfully emabled DisplaySettings Service");
          resolve(result);
        }).catch((err) => {
          console.log("Failed to enable DisplaySettings Service", JSON.stringify(err));
        });
      });
    }
    getVolumeLevel() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getVolumeLevel", {
          "audioPort": "HDMI0"
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("audio mute error:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getSoundMode() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getSoundMode", {
          "audioPort": "HDMI0"
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting sound mode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    setSoundMode(mode) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "setSoundMode", {
          "audioPort": "HDMI0",
          "soundMode": mode,
          "persist": true
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in setting sound mode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getSupportedAudioModes() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getSupportedAudioModes", {
          "audioPort": "HDMI0"
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting support audio sound mode:", JSON.stringify(err, 3, null));
          reject(false);
        });
      });
    }
    getConnectedAudioPorts() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getConnectedAudioPorts", {}).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("audio mute error:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    setEnableAudioPort(port) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "setEnableAudioPort", {
          "audioPort": port,
          "enable": true
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting support audio sound mode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getDRCMode() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getDRCMode", {
          "audioPort": "HDMI0"
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error while getting the DRC", JSON.stringify(err));
          resolve(false);
        });
      });
    }
    setDRCMode(DRCNum) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "setDRCMode", {
          "DRCMode": DRCNum
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error while setting the DRC", JSON.stringify(err));
          resolve(false);
        });
      });
    }
    getZoomSetting() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getZoomSetting").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error while getting Zoom Setting", JSON.stringify(err));
          resolve(false);
        });
      });
    }
    setZoomSetting(zoom) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "setZoomSetting", {
          "zoomSetting": zoom
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error while setting the Zoom", JSON.stringify(err));
          resolve(false);
        });
      });
    }
    getEnableAudioPort(audioPort) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getEnableAudioPort", {
          "audioPort": audioPort
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error while getting Enabled Audio port ", JSON.stringify(err));
          resolve(false);
        });
      });
    }
    getSupportedAudioPorts() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getSupportedAudioPorts").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error while getting S upported audio ports ", JSON.stringify(err));
          resolve(false);
        });
      });
    }
    getVolumeLevel() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "getVolumeLevel").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error current volume level", JSON.stringify(err));
          resolve(false);
        });
      });
    }
    setVolumeLevel(port, volume) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.DisplaySettings", "setVolumeLevel", {
          "audioPort": port,
          "volumeLevel": volume
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error while setting current volume level", JSON.stringify(err));
          resolve(false);
        });
      });
    }
    speak() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.TextToSpeech", "speak", {
          "text": "speech_1"
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in speak:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    resume() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.TextToSpeech", "resume", {
          "speechid": 1
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in resuming:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    pause() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.TextToSpeech", "pause", {
          "speechid": 1
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in pausing:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getlistVoices() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.TextToSpeech", "listvoices", {
          "language": "en-US"
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting voices:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    syncLocation() {
      return new Promise((resolve, reject) => {
        thunder.call("LocationSync", "sync").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in syncing location:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getLocation() {
      return new Promise((resolve, reject) => {
        thunder.call("LocationSync", "location").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting location:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getFirmwareUpdateInfo() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "getFirmwareUpdateInfo").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting firmware update info:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getFirmwareUpdateState() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "getFirmwareUpdateState").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting firmware update state:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getDownloadFirmwareInfo() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "getDownloadedFirmwareInfo").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting downloaded info:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getSerialNumber() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "getSerialNumber").then((result) => {
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        }).catch((err) => {
          resolve("N/A");
        });
      });
    }
    getSystemVersions() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "getSystemVersions").then((result) => {
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        }).catch((err) => {
          console.log("error in getting downloaded percentage:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    updateFirmware() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "updateFirmware").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in firmware update:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getFirmwareDownloadPercent() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "getFirmwareDownloadPercent").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting downloaded percentage:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getDeviceIdentification() {
      return new Promise((resolve, reject) => {
        thunder.call("DeviceIdentification", "deviceidentification").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting device Identification:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    systeminfo() {
      return new Promise((resolve, reject) => {
        thunder.call("DeviceInfo", "systeminfo").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting system info:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    reboot() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "reboot", {
          "rebootReason": "FIRMWARE_FAILURE"
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in reboot:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getPreferredStandbyMode() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "getPreferredStandbyMode").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getPreferredStandbyMode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    setPreferredStandbyMode(standbyMode) {
      console.log("setPreferredStandbyMode called : " + standbyMode);
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.System", "setPreferredStandbyMode", {
          "standbyMode": standbyMode
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in setPreferredStandbyMode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    registerChangeLocation() {
      var callsign2 = "LocationSync";
      thunder.call("Controller", "activate", {
        callsign: callsign2
      }).then((result) => {
        thunder.on(callsign2, "locationchange", (notification) => {
          console.log("location was changed and the notification = ", notification);
        });
      }).catch((err) => {
        console.log(err);
      });
    }
    sendAppState(value) {
      return __async(this, null, function* () {
        const state3 = yield thunder.call("org.rdk.RDKShell", "getState", {}).then((result) => result.state);
        this.state = state3;
        let params = {
          applicationName: value,
          state: "stopped"
        };
        for (var i = 0; i < state3.length; i++) {
          if (state3[i].callsign == value) {
            if (state3[i].state == "resumed") {
              activatedCobalt = true;
              params.state = "running";
            } else if (state3[i].state == "suspended") {
              params.state = "suspended";
            } else {
              params.state = "stopped";
            }
            ;
          }
        }
        if (params.state === "stopped") {
          activatedCobalt = false;
        }
        yield thunder.call("org.rdk.Xcast", "onApplicationStateChanged", params).then((result) => result.success);
      });
    }
    getIPSetting(defaultInterface2) {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.Network", "getIPSettings", {
          "interface": defaultInterface2
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting network info:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getDefaultInterface() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.Network", "getDefaultInterface").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting default interface:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    isInterfaceEnabled() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.Network", "isInterfaceEnabled", {
          "interface": "WIFI"
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in checking the interface:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getInterfaces() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.Network", "getInterfaces").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting interfaces:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
    getConnectedSSID() {
      return new Promise((resolve, reject) => {
        thunder.call("org.rdk.Wifi", "getConnectedSSID").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("error in getting connected SSID:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }
  };

  // static/data/AppListInfo.js
  var appListInfo = [
    {
      displayName: "USB",
      applicationType: "",
      uri: "USB",
      url: "/images/usb/USB_Featured_Item.jpg"
    },
    {
      displayName: "Amazon Prime video",
      applicationType: "Amazon",
      uri: "",
      url: "/images/apps/App_Amazon_Prime_454x255.png"
    },
    {
      displayName: "Youtube",
      applicationType: "Cobalt",
      uri: "https://www.youtube.com/tv",
      url: "/images/apps/App_YouTube_454x255.png"
    },
    {
      displayName: "Xumo",
      applicationType: "WebApp",
      uri: "https://x1box-app.xumo.com/index.html",
      url: "/images/apps/App_Xumo_454x255.png"
    },
    {
      displayName: "Netflix",
      applicationType: "Netflix",
      uri: "",
      url: "/images/apps/App_Netflix_454x255.png"
    }
  ];

  // static/data/AppListInfoOffline.js
  var appListInfoOffline = [
    {
      displayName: "USB",
      applicationType: "",
      uri: "USB",
      url: "/images/usb/USB_Featured_Item.jpg"
    },
    {
      displayName: "Amazon Prime video",
      applicationType: "Amazon",
      uri: "",
      url: "/images/apps/App_Amazon_Prime_454x255.png"
    },
    {
      displayName: "Youtube",
      applicationType: "Cobalt",
      uri: "https://www.youtube.com/tv",
      url: "/images/apps/App_YouTube_454x255.png"
    },
    {
      displayName: "Xumo",
      applicationType: "WebApp",
      uri: "https://x1box-app.xumo.com/index.html",
      url: "/images/apps/App_Xumo_454x255.png"
    },
    {
      displayName: "Netflix",
      applicationType: "Netflix",
      uri: "",
      url: "/images/apps/App_Netflix_454x255.png"
    }
  ];

  // static/data/TvShowsInfo.js
  var tvShowsInfo = [{
    displayName: "Fantasy-Island",
    url: "/images/tvShows/fantasy-island.jpg"
  }, {
    displayName: "Onward",
    url: "/images/tvShows/onward.jpg"
  }, {
    displayName: "Let it Snow",
    url: "/images/tvShows/let-it-snow.jpg"
  }, {
    displayName: "Do Little",
    url: "/images/tvShows/do-little.jpg"
  }, {
    displayName: "Summerland",
    url: "/images/tvShows/summerland.jpg"
  }];

  // static/data/SettingsInfo.js
  var settingsInfo = [{
    displayName: "Bluetooth",
    url: "/images/settings/bluetooth.jpg"
  }, {
    displayName: "Wi-Fi",
    url: "/images/settings/wifi.jpg"
  }];

  // static/data/SidePanelInfo.js
  var sidePanelInfo = [{
    title: "Apps",
    url: "/images/sidePanel/menu.png"
  }, {
    title: "Metro Apps",
    url: "/images/sidePanel/metro.png"
  }, {
    title: "TV Shows",
    url: "/images/sidePanel/video.png"
  }, {
    title: "Settings",
    url: "/images/sidePanel/settings.png"
  }];

  // static/data/RightArrowInfo.js
  var rightArrowInfo = [{
    url: "/images/right-small.png"
  }, {
    url: "/images/right-small.png"
  }, {
    url: "/images/right-small.png"
  }];

  // static/data/LeftArrowInfo.js
  var leftArrowInfo = [{
    url: "/images/left-small.png"
  }, {
    url: "/images/left-small.png"
  }, {
    url: "/images/left-small.png"
  }];

  // static/data/UIInfo.js
  var uiInfo = [{
    title: "DEFAULT",
    url: "/images/splash/DefaultUI.png",
    uri: ""
  }, {
    title: "LIVE",
    url: "/images/splash/LiveTv.png",
    uri: "http://35.155.171.121:8088/index.html"
  }, {
    title: "TATA",
    url: "/images/splash/TataElxsi.png",
    uri: "http://35.155.171.121:8088/index.html"
  }, {
    title: "EPAM",
    url: "/images/splash/Epam.png",
    uri: "https://px-apps.sys.comcast.net/lightning_apps/diagnostics/dist/index.html"
  }, {
    title: "NEW",
    url: "/images/splash/NewUi.png",
    uri: "https://px-apps.sys.comcast.net/lightning_apps/diagnostics/dist/index.html"
  }, {
    title: "COMINGSOON",
    url: "/images/splash/ComingSoon.png",
    uri: "https://px-apps.sys.comcast.net/lightning_apps/diagnostics/dist/index.html"
  }];

  // static/data/MetroAppsInfo.js
  var metroAppsInfo = [{
    displayName: "CNN",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.CNN",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.CNN.png"
  }, {
    displayName: "VimeoRelease",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.VimeoRelease",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.VimeoRelease.png"
  }, {
    displayName: "WeatherNetwork",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WeatherNetwork",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.WeatherNetwork.png"
  }, {
    displayName: "EuroNews",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Euronews",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.Euronews.png"
  }, {
    displayName: "AccuWeather",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.AccuWeather",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.AccuWeather.png"
  }, {
    displayName: "BaebleMusic",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.BaebleMusic",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.BaebleMusic.png"
  }, {
    displayName: "Aljazeera",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Aljazeera",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.Aljazeera.png"
  }, {
    displayName: "GuessThatCity",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.GuessThatCity",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.GuessThatCity.png"
  }, {
    displayName: "Radioline",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Radioline",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.Radioline.png"
  }, {
    displayName: "WallStreetJournal",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WallStreetJournal",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.WallStreetJournal.png"
  }, {
    displayName: "Bluetooth Audio",
    applicationType: "Lightning",
    uri: "https://apps.rdkcentral.com/rdk-apps/BluetoothAudio/index.html",
    url: "/images/metroApps/Bluetooth_app.jpg"
  }];

  // static/data/MetroAppsInfoOffline.js
  var metroAppsInfoOffline = [{
    displayName: "CNN",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.CNN",
    url: "/images/metroApps/Test-01.jpg"
  }, {
    displayName: "VimeoRelease",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.VimeoRelease",
    url: "/images/metroApps/Test-02.jpg"
  }, {
    displayName: "WeatherNetwork",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WeatherNetwork",
    url: "/images/metroApps/Test-03.jpg"
  }, {
    displayName: "EuroNews",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Euronews",
    url: "/images/metroApps/Test-04.jpg"
  }, {
    displayName: "AccuWeather",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.AccuWeather",
    url: "/images/metroApps/Test-05.jpg"
  }, {
    displayName: "BaebleMusic",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.BaebleMusic",
    url: "/images/metroApps/Test-06.jpg"
  }, {
    displayName: "Aljazeera",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Aljazeera",
    url: "/images/metroApps/Test-07.jpg"
  }, {
    displayName: "GuessThatCity",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.GuessThatCity",
    url: "/images/metroApps/Test-08.jpg"
  }, {
    displayName: "Radioline",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Radioline",
    url: "/images/metroApps/Test-09.jpg"
  }, {
    displayName: "WallStreetJournal",
    applicationType: "Lightning",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WallStreetJournal",
    url: "/images/metroApps/Test-10.jpg"
  }, {
    displayName: "Bluetooth Audio",
    applicationType: "Lightning",
    uri: "https://apps.rdkcentral.com/rdk-apps/BluetoothAudio/index.html",
    url: "/images/metroApps/Bluetooth_app.jpg"
  }];

  // src/api/HomeApi.js
  var partnerApps = [];
  var IpAddress1 = "";
  var IpAddress2 = "";
  var networkApi = new Network();
  networkApi.getIP().then((ip) => {
    IpAddress1 = ip;
    Storage_default.set("ipAddress", IpAddress1);
  }).catch(() => {
    Storage_default.set("ipAddress", null);
  });
  var appApi = new AppApi();
  appApi.getIP().then((ip) => {
    IpAddress2 = ip;
  });
  var HomeApi = class {
    getAppListInfo() {
      let appsMetaData;
      if (IpAddress1 || IpAddress2) {
        appsMetaData = appListInfo;
      } else {
        appsMetaData = appListInfoOffline;
      }
      return appsMetaData;
    }
    getTVShowsInfo() {
      return tvShowsInfo;
    }
    getSettingsInfo() {
      return settingsInfo;
    }
    getSidePanelInfo() {
      return sidePanelInfo;
    }
    getUIInfo() {
      return uiInfo;
    }
    getMetroInfo() {
      let metroAppsMetaData;
      if (IpAddress1 || IpAddress2) {
        metroAppsMetaData = metroAppsInfo;
      } else {
        metroAppsMetaData = metroAppsInfoOffline;
      }
      return metroAppsMetaData;
    }
    getOfflineMetroApps() {
      return metroAppsInfoOffline;
    }
    getOnlineMetroApps() {
      return metroAppsInfo;
    }
    setPartnerAppsInfo(data) {
      partnerApps = data;
    }
    getPartnerAppsInfo() {
      return partnerApps;
    }
    getRightArrowInfo() {
      return rightArrowInfo;
    }
    getLeftArrowInfo() {
      return leftArrowInfo;
    }
  };

  // src/colors/Colors.js
  var COLORS = {
    textColor: 4294967295,
    titleColor: 4294967295,
    hightlightColor: 4290822336,
    headingColor: 4294967295
  };

  // src/items/SettingsItem.js
  var SettingsItem = class extends Lightning_default.Component {
    _construct() {
      this.Tick = Utils_default.asset("/images/settings/Tick.png");
    }
    static _template() {
      return {
        zIndex: 1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        },
        Item: {
          w: 1600,
          h: 90
        },
        BottomLine: {
          y: 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        }
      };
    }
    set item(item) {
      this._item = item;
      this.tag("Item").patch({
        Tick: {
          y: 45,
          mountY: 0.5,
          texture: Lightning_default.Tools.getSvgTexture(this.Tick, 32.5, 32.5),
          color: 4294967295,
          visible: false
        },
        Left: {
          x: 40,
          y: 45,
          mountY: 0.5,
          text: {
            text: item,
            fontSize: 25,
            textColor: COLORS.textColor,
            fontFace: CONFIG.language.font
          }
        }
      });
    }
    _focus() {
      this.tag("TopLine").color = CONFIG.theme.hex;
      this.tag("BottomLine").color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag("TopLine").h = 6;
      this.tag("BottomLine").h = 6;
    }
    _unfocus() {
      this.tag("TopLine").color = 4294967295;
      this.tag("BottomLine").color = 4294967295;
      this.patch({
        zIndex: 1
      });
      this.tag("TopLine").h = 3;
      this.tag("BottomLine").h = 3;
    }
  };

  // src/items/SettingsMainItem.js
  var SettingsMainItem = class extends SettingsItem {
    static _template() {
      return {
        zIndex: 1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        },
        Item: {
          w: 1920 - 300,
          h: 90,
          rect: true,
          color: 0
        },
        BottomLine: {
          y: 0 + 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        }
      };
    }
    _init() {
    }
    _focus() {
      this.tag("TopLine").color = CONFIG.theme.hex;
      this.tag("BottomLine").color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag("TopLine").h = 6;
      this.tag("BottomLine").h = 6;
    }
    _unfocus() {
      this.tag("TopLine").color = 4294967295;
      this.tag("BottomLine").color = 4294967295;
      this.patch({
        zIndex: 1
      });
      this.tag("TopLine").h = 3;
      this.tag("BottomLine").h = 3;
    }
  };

  // src/screens/SettingsScreen.js
  var SettingsScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings"));
    }
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        SettingsScreenContents: {
          x: 200,
          y: 275,
          NetworkConfiguration: {
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Network Configuration"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Bluetooth: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Pair Remote Control"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Video: {
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Video"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Audio: {
            y: 270,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Audio"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          OtherSettings: {
            y: 360,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Other Settings"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          }
        }
      };
    }
    _init() {
      this._setState("NetworkConfiguration");
    }
    _focus() {
      this._setState(this.state);
    }
    _handleBack() {
      Router_default.navigate("menu");
    }
    static _states() {
      return [class NetworkConfiguration extends this {
        $enter() {
          this.tag("NetworkConfiguration")._focus();
        }
        $exit() {
          this.tag("NetworkConfiguration")._unfocus();
        }
        _handleDown() {
          this._setState("Bluetooth");
        }
        _handleEnter() {
          Router_default.navigate("settings/network");
        }
      }, class Bluetooth extends this {
        $enter() {
          this.tag("Bluetooth")._focus();
        }
        $exit() {
          this.tag("Bluetooth")._unfocus();
        }
        _handleUp() {
          this._setState("NetworkConfiguration");
        }
        _handleDown() {
          this._setState("Video");
        }
        _handleLeft() {
        }
        _handleEnter() {
          Router_default.navigate("settings/bluetooth");
        }
      }, class Video extends this {
        $enter() {
          this.tag("Video")._focus();
        }
        $exit() {
          this.tag("Video")._unfocus();
        }
        _handleUp() {
          this._setState("Bluetooth");
        }
        _handleDown() {
          this._setState("Audio");
        }
        _handleEnter() {
          Router_default.navigate("settings/video");
        }
      }, class Audio extends this {
        $enter() {
          this.tag("Audio")._focus();
        }
        $exit() {
          this.tag("Audio")._unfocus();
        }
        _handleUp() {
          this._setState("Video");
        }
        _handleEnter() {
          Router_default.navigate("settings/audio");
        }
        _handleDown() {
          this._setState("OtherSettings");
        }
      }, class OtherSettings extends this {
        $enter() {
          this.tag("OtherSettings")._focus();
        }
        $exit() {
          this.tag("OtherSettings")._unfocus();
        }
        _handleUp() {
          this._setState("Audio");
        }
        _handleEnter() {
          Router_default.navigate("settings/other");
        }
      }];
    }
  };

  // src/items/ListItem.js
  var ListItem = class extends Lightning_default.Component {
    static _template() {
      return {
        Item: {
          Shadow: {
            alpha: 0
          },
          y: 20,
          Image: {},
          Info: {}
        }
      };
    }
    _init() {
      this.tag("Shadow").patch({
        color: CONFIG.theme.hex,
        rect: true,
        h: this.h + 24,
        w: this.w,
        x: this.x,
        y: this.y - 12
      });
      if (this.data.url.startsWith("/images")) {
        this.tag("Image").patch({
          rtt: true,
          x: this.x,
          y: this.y,
          w: this.w,
          h: this.h,
          src: Utils_default.asset(this.data.url),
          scale: this.unfocus
        });
      } else {
        this.tag("Image").patch({
          rtt: true,
          x: this.x,
          y: this.y,
          w: this.w,
          h: this.h,
          src: this.data.url
        });
      }
      this.tag("Info").patch({
        x: this.x - 20,
        y: this.y + this.h + 10,
        w: this.w,
        h: 140,
        alpha: 0,
        PlayIcon: {
          Label: {
            x: this.idx === 0 ? this.x + 20 : this.x,
            y: this.y + 10,
            text: {
              fontFace: CONFIG.language.font,
              text: this.data.displayName,
              fontSize: 35,
              maxLines: 2,
              wordWrapWidth: this.w
            }
          }
        }
      });
    }
    _focus() {
      this.tag("Image").patch({
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h,
        zIndex: 1,
        scale: this.focus
      });
      this.tag("Info").alpha = 1;
      this.tag("Item").patch({
        zIndex: 2
      });
      this.tag("Shadow").patch({
        smooth: {
          scale: [this.focus, {
            timingFunction: "ease",
            duration: 0.7
          }],
          alpha: 1
        }
      });
    }
    _unfocus() {
      this.tag("Image").patch({
        w: this.w,
        h: this.h,
        scale: this.unfocus
      });
      this.tag("Item").patch({
        zIndex: 0
      });
      this.tag("Info").alpha = 0;
      this.tag("Shadow").patch({
        smooth: {
          alpha: 0,
          scale: [this.unfocus, {
            timingFunction: "ease",
            duration: 0.7
          }]
        }
      });
    }
  };

  // static/data/ImageListInfo.js
  var imageListInfo = [];

  // static/data/MusicListInfo.js
  var musicListInfo = [];

  // static/data/VideoListInfo.js
  var videoListInfo = [];

  // static/data/UsbInnerFolderListInfo.js
  var UsbInnerFolderListInfo = [];

  // src/api/UsbApi.js
  var config2 = {
    host: "127.0.0.1",
    port: 9998,
    versions: {
      default: 2,
      Controller: 1,
      UsbAccess: 2
    }
  };
  var thunder2 = thunderJS_default(config2);
  var UsbApi = class {
    activate() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.UsbAccess";
        thunder2.Controller.activate({
          callsign: systemcCallsign
        }).then((res) => {
          resolve(res);
        }).catch((err) => {
          console.log("UsbAccess Plugin Activation Failed: " + err);
          reject(err);
        });
      });
    }
    deactivate() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.UsbAccess";
        thunder2.Controller.deactivate({
          callsign: systemcCallsign
        }).then((res) => {
          resolve(res);
        }).catch((err) => {
          console.log("UsbAccess Plugin Deactivation Failed: " + err);
          reject(err);
        });
      });
    }
    clearLink() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.UsbAccess";
        thunder2.call(systemcCallsign, "clearLink").then((result) => {
          resolve(result);
        }).catch((err) => {
          resolve(false);
        });
      });
    }
    createLink() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.UsbAccess";
        thunder2.call(systemcCallsign, "createLink").then((result) => {
          resolve(result);
        }).catch((err) => {
          resolve(false);
        });
      });
    }
    getUsbFileList() {
      if (arguments.length === 0) {
        return new Promise((resolve, reject) => {
          const systemcCallsign = "org.rdk.UsbAccess";
          thunder2.call(systemcCallsign, "getFileList").then((result) => {
            resolve(result.contents);
          }).catch((err) => {
            resolve(false);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          const systemcCallsign = "org.rdk.UsbAccess";
          thunder2.call(systemcCallsign, "getFileList", {
            "path": arguments[0]
          }).then((result) => {
            resolve(result.contents);
          }).catch((err) => {
            resolve(false);
          });
        });
      }
    }
    retrieUsb() {
      this.usbLink = "";
      var self = this;
      return new Promise((resolve, reject) => {
        self.clearLink().then((result) => {
          self.createLink().then((res) => {
            if (res.success) {
              self.usbLink = res.baseURL;
              self.getUsbFileList().then((result1) => {
                self.getUsbContentList(result1);
                resolve(true);
              }).catch((err) => {
                reject(err);
              });
            }
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      });
    }
    destroy() {
      imageListInfo.length = 0;
      videoListInfo.length = 0;
      musicListInfo.length = 0;
      UsbInnerFolderListInfo.length = 0;
    }
    cd(dname) {
      return new Promise((resolve, reject) => {
        this.getUsbFileList(dname).then((result1) => {
          this.getUsbContentList(result1, dname);
          resolve(true);
        }).catch((err) => {
          reject(err);
        });
      });
    }
    getMountedDevices() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.UsbAccess";
        thunder2.call(systemcCallsign, "getMounted").then((result) => {
          resolve(result);
        }).catch((err) => {
          reject(err);
          console.error(`Error while getting the mounted device ${JSON.stringify(err)}`);
        });
      });
    }
    getUsbContentList(result) {
      this.destroy();
      let cwd = this.usbLink;
      if (arguments[1]) {
        cwd = cwd + "/" + arguments[1];
      }
      var extensionForImage = [".png", ".jpg", ".PNG", ".jpeg", ".JPEG", ".jpg", ".JPG"];
      var extensionForVideo = [".mp4", ".MP4", ".mov", ".MOV", ".avi", ".AVI", ".m3u8", ".M3U8", ".mpeg2", ".MPEG2"];
      var extensionForAudio = [".mp3", ".mpeg", ".MP3", ".MPEG"];
      this._discoveredC = result;
      this._discoveredC.filter((device) => {
        for (let i in extensionForImage) {
          if (device.name.indexOf(extensionForImage[i]) !== -1) {
            var obj1 = {
              displayName: device.name,
              uri: cwd + "/" + device.name,
              url: cwd + "/" + device.name
            };
            imageListInfo.push(obj1);
            return device;
          }
        }
      });
      this._discoveredC.filter((device) => {
        for (let i in extensionForVideo) {
          if (device.name.indexOf(extensionForVideo[i]) !== -1) {
            var obj2 = {
              displayName: device.name,
              url: "/images/usb/USB_Video_Placeholder.jpg",
              uri: cwd + "/" + device.name
            };
            videoListInfo.push(obj2);
            return device;
          }
        }
      });
      this._discoveredC.filter((device) => {
        for (let i in extensionForAudio) {
          if (device.name.indexOf(extensionForAudio[i]) !== -1) {
            var obj3 = {
              displayName: device.name,
              url: "/images/usb/USB_Audio_Placeholder.jpg",
              uri: cwd + "/" + device.name
            };
            musicListInfo.push(obj3);
            return device;
          }
        }
      });
      this._discoveredC.filter((device) => {
        if (device.t === "d") {
          if (!(device.name === "." || device.name === "..")) {
            var obj4 = {
              displayName: device.name,
              url: "/images/usb/USB_Folder.jpg",
              uri: cwd + "/" + device.name
            };
            UsbInnerFolderListInfo.push(obj4);
            return device;
          }
        }
      });
    }
  };

  // src/api/XcastApi.js
  var XcastApi = class {
    constructor() {
      const config7 = {
        host: "127.0.0.1",
        port: 9998,
        default: 1
      };
      this._thunder = thunderJS_default(config7);
      console.log("Xcast constructor");
      this._events = new Map();
    }
    activate() {
      return new Promise((resolve, reject) => {
        this.callsign = "org.rdk.Xcast";
        this._thunder.call("Controller", "activate", {
          callsign: this.callsign
        }).then((result) => {
          console.log("Xcast activation success " + result);
          this._thunder.call("org.rdk.Xcast", "setEnabled", {
            enabled: true
          }).then((result2) => {
            if (result2.success) {
              console.log("Xcast enabled");
              this._thunder.on(this.callsign, "onApplicationLaunchRequest", (notification) => {
                console.log("onApplicationLaunchRequest " + JSON.stringify(notification));
                if (this._events.has("onApplicationLaunchRequest")) {
                  this._events.get("onApplicationLaunchRequest")(notification);
                }
              });
              this._thunder.on(this.callsign, "onApplicationHideRequest", (notification) => {
                console.log("onApplicationHideRequest " + JSON.stringify(notification));
                if (this._events.has("onApplicationHideRequest")) {
                  this._events.get("onApplicationHideRequest")(notification);
                }
              });
              this._thunder.on(this.callsign, "onApplicationResumeRequest", (notification) => {
                console.log("onApplicationResumeRequest " + JSON.stringify(notification));
                if (this._events.has("onApplicationResumeRequest")) {
                  this._events.get("onApplicationResumeRequest")(notification);
                }
              });
              this._thunder.on(this.callsign, "onApplicationStopRequest", (notification) => {
                console.log("onApplicationStopRequest " + JSON.stringify(notification));
                if (this._events.has("onApplicationStopRequest")) {
                  this._events.get("onApplicationStopRequest")(notification);
                }
              });
              this._thunder.on(this.callsign, "onApplicationStateRequest", (notification) => {
                if (this._events.has("onApplicationStateRequest")) {
                  this._events.get("onApplicationStateRequest")(notification);
                }
              });
              resolve(true);
            } else {
              console.log("Xcast enabled failed");
            }
          }).catch((err) => {
            console.error("Enabling failure", err);
            reject("Xcast enabling failed", err);
          });
        }).catch((err) => {
          console.error("Activation failure", err);
          reject("Xcast activation failed", err);
        });
      });
    }
    getEnabled() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Xcast", "getEnabled").then((res) => {
          resolve(res);
        }).catch((err) => {
          console.log("Xdial error", err);
          reject(err);
        });
      });
    }
    registerEvent(eventId, callback) {
      this._events.set(eventId, callback);
    }
    deactivate() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Xcast", "setEnabled", {
          enabled: false
        }).then((res) => {
          resolve(res.success);
        }).catch((err) => {
          console.log("Failed to close Xcast", err);
        });
      });
    }
    onApplicationStateChanged(params) {
      return new Promise((resolve, reject) => {
        console.log("Notifying back");
        this._thunder.call("org.rdk.Xcast", "onApplicationStateChanged", params).then((result) => {
          resolve(result);
        });
      });
    }
    static supportedApps() {
      var xcastApps = {
        AmazonInstantVideo: "Amazon",
        YouTube: "Cobalt",
        NetflixApp: "Netflix"
      };
      return xcastApps;
    }
  };

  // src/views/MainView.js
  var MainView = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("home"));
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        MainView: {
          w: 1994,
          h: 1920,
          xIndex: 2,
          y: 270,
          x: 200,
          clipping: true,
          Text1: {
            h: 30,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 25,
              text: Language_default.translate("Featured Content"),
              fontStyle: "normal",
              textColor: 4294967295
            },
            zIndex: 0
          },
          AppList: {
            y: 37,
            x: -20,
            flex: {
              direction: "row",
              paddingLeft: 20,
              wrap: false
            },
            type: Lightning_default.components.ListComponent,
            w: 1745,
            h: 400,
            itemSize: 474,
            roll: true,
            rollMax: 1745,
            horizontal: true,
            itemScrollOffset: -2,
            clipping: false
          },
          Text2: {
            y: 395,
            h: 30,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 25,
              text: Language_default.translate("Lightning Apps"),
              fontStyle: "normal",
              textColor: 4294967295
            }
          },
          MetroApps: {
            x: -20,
            y: 435,
            type: Lightning_default.components.ListComponent,
            flex: {
              direction: "row",
              paddingLeft: 20,
              wrap: false
            },
            w: 1745,
            h: 300,
            itemSize: 288,
            roll: true,
            rollMax: 1745,
            horizontal: true,
            itemScrollOffset: -4,
            clipping: false
          },
          Text3: {
            y: 673,
            h: 30,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 25,
              text: Language_default.translate("Featured Video on Demand"),
              fontStyle: "normal",
              textColor: 4294967295
            }
          },
          TVShows: {
            x: -20,
            y: 710,
            w: 1745,
            h: 400,
            type: Lightning_default.components.ListComponent,
            flex: {
              direction: "row",
              paddingLeft: 20,
              wrap: false
            },
            roll: true,
            itemSize: 277,
            rollMax: 1745,
            horizontal: true,
            itemScrollOffset: -4,
            clipping: false
          },
          Text4: {
            y: 938,
            h: 30,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 25,
              text: Language_default.translate("Partner Apps"),
              fontStyle: "normal",
              textColor: 4294967295
            }
          },
          UsbApps: {
            x: -20,
            y: 978,
            type: Lightning_default.components.ListComponent,
            flex: {
              direction: "row",
              paddingLeft: 20,
              wrap: false
            },
            w: 1745,
            h: 400,
            itemSize: 288,
            roll: true,
            rollMax: 1745,
            horizontal: true,
            itemScrollOffset: -4,
            clipping: false
          }
        }
      };
    }
    pageTransition() {
      return "up";
    }
    _handleBack() {
    }
    _init() {
      this.settingsScreen = false;
      this.indexVal = 0;
      const config7 = {
        host: "127.0.0.1",
        port: 9998,
        default: 1
      };
      this.usbApi = new UsbApi();
      this.homeApi = new HomeApi();
      this.xcastApi = new XcastApi();
      let thunder9 = thunderJS_default(config7);
      var appItems = this.homeApi.getAppListInfo();
      var data = this.homeApi.getPartnerAppsInfo();
      this.metroApps = this.homeApi.getMetroInfo();
      var prop_apps = "applications";
      var prop_displayname = "displayName";
      var prop_uri = "uri";
      var prop_apptype = "applicationType";
      var prop_url = "url";
      var appdetails = [];
      var appdetails_format = [];
      var usbAppsArr = [];
      var usbApps = 0;
      try {
        if (data != null && JSON.parse(data).hasOwnProperty(prop_apps)) {
          appdetails = JSON.parse(data).applications;
          for (var i = 0; i < appdetails.length; i++) {
            if (appdetails[i].hasOwnProperty(prop_displayname) && appdetails[i].hasOwnProperty(prop_uri) && appdetails[i].hasOwnProperty(prop_apptype)) {
              usbAppsArr.push(appdetails[i]);
              usbApps++;
            }
          }
          for (var i = 0; i < appItems.length; i++) {
            appdetails_format.push(appItems[i]);
          }
        } else {
          appdetails_format = appItems;
        }
      } catch (e) {
        appdetails_format = appItems;
        console.log("Query data is not proper: " + e);
      }
      this.firstRowItems = appdetails_format;
      this.tempRow = JSON.parse(JSON.stringify(this.firstRowItems));
      if (this.firstRowItems[0].uri === "USB") {
        this.tempRow.shift();
      }
      this.appItems = this.tempRow;
      this.usbApps = usbAppsArr;
      const registerListener2 = () => {
        let listener;
        listener = thunder9.on("org.rdk.UsbAccess", "onUSBMountChanged", (notification) => {
          console.log("onUsbMountChanged notification: ", JSON.stringify(notification));
          Storage_default.set("UsbMountedStatus", notification.mounted ? "mounted" : "unmounted");
          const currentPage = window.location.href.split("#").slice(-1)[0];
          if (Storage_default.get("UsbMedia") === "ON") {
            if (notification.mounted) {
              this.appItems = this.firstRowItems;
              this._setState("AppList.0");
            } else if (!notification.mounted) {
              this.appItems = this.tempRow;
              this._setState("AppList.0");
            }
            console.log(`app items = ${this.appItems} ; `);
            if (currentPage === "menu") {
              console.log("page refreshed on unplug/plug");
            }
            if (!notification.mounted) {
              if (currentPage === "usb" || currentPage === "usb/image" || currentPage === "usb/player") {
                Router_default.navigate("menu");
              }
            }
          }
          console.log(`usb event successfully registered`);
        });
        return listener;
      };
      thunder9.on("org.rdk.Network.1", "onIPAddressStatusChanged", (notification) => {
        console.log("IP ADDRESS changed", JSON.stringify(notification));
        if (notification.status === "ACQUIRED") {
          Storage_default.set("ipAddress", notification.ip4Address);
          this.metroApps = this.homeApi.getOnlineMetroApps();
        } else {
          Storage_default.set("ipAddress", null);
        }
      });
      this.fireAncestors("$mountEventConstructor", registerListener2.bind(this));
      this.refreshFirstRow();
      this._setState("AppList.0");
    }
    _firstActive() {
      if (!Storage_default.get("UsbMedia")) {
        this.usbApi.activate().then((res) => {
          Storage_default.set("UsbMedia", "ON");
          this.fireAncestors("$registerUsbMount");
        });
      } else if (Storage_default.get("UsbMedia") === "ON") {
        this.usbApi.activate().then((res) => {
          this.fireAncestors("$registerUsbMount");
        });
      } else if (Storage_default.get("UsbMedia") === "OFF") {
        this.usbApi.deactivate().then((res) => {
          console.log(`disabled the Usb Plugin`);
        }).catch((err) => {
          console.error(`error while disabling the usb plugin = ${err}`);
        });
      }
    }
    _focus() {
      this._setState(this.state);
    }
    scroll(val) {
      this.tag("MainView").patch({
        smooth: {
          y: [val, {
            timingFunction: "ease",
            duration: 0.7
          }]
        }
      });
    }
    refreshFirstRow() {
      if (Storage_default.get("UsbMedia") === "ON") {
        this.usbApi.activate().then((res) => {
          this.usbApi.getMountedDevices().then((result) => {
            if (result.mounted.length === 1) {
              this.appItems = this.firstRowItems;
            } else {
              this.appItems = this.tempRow;
            }
          });
        });
      } else if (Storage_default.get("UsbMedia") === "OFF") {
        this.appItems = this.tempRow;
      } else {
        Storage_default.set("UsbMedia", "ON");
        this.usbApi.activate().then((res) => {
          this.usbApi.getMountedDevices().then((result) => {
            if (result.mounted.length === 1) {
              this.appItems = this.firstRowItems;
            } else {
              this.appItems = this.tempRow;
            }
          });
        });
      }
    }
    set appItems(items) {
      this.tag("AppList").items = items.map((info, idx) => {
        return {
          w: 454,
          h: 255,
          type: ListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          idx
        };
      });
    }
    set metroApps(items) {
      this.tag("MetroApps").items = items.map((info, index) => {
        return {
          w: 268,
          h: 151,
          type: ListItem,
          data: info,
          focus: 1.15,
          unfocus: 1,
          idx: index
        };
      });
    }
    set tvShowItems(items) {
      this.tag("TVShows").items = items.map((info, idx) => {
        return {
          w: 257,
          h: 145,
          type: ListItem,
          data: info,
          focus: 1.15,
          unfocus: 1,
          idx
        };
      });
    }
    set usbApps(items) {
      if (!items.length) {
        this.tag("Text4").visible = false;
      }
      this.tag("UsbApps").items = items.map((info, index) => {
        return {
          w: 268,
          h: 151,
          type: ListItem,
          data: info,
          focus: 1.15,
          unfocus: 1,
          idx: index
        };
      });
    }
    index(index) {
      if (index == 0) {
        this._setState("AppList");
      } else if (index == 1) {
        this._setState("MetroApps");
      } else if (index == 2) {
        this._setState("TVShows");
      } else if (index == 3) {
        if (this.tag("UsbApps").length) {
          this._setState("UsbApps");
        } else {
          this._setState("TVShows");
        }
      }
    }
    reset() {
      for (let i = this.tag("AppList").index; i > 0; i--) {
        this.tag("AppList").setPrevious();
      }
      for (let i = this.tag("MetroApps").index; i > 0; i--) {
        this.tag("MetroApps").setPrevious();
      }
      for (let i = this.tag("TVShows").index; i > 0; i--) {
        this.tag("TVShows").setPrevious();
      }
      for (let i = this.tag("UsbApps").index; i > 0; i--) {
        this.tag("UsbApps").setPrevious();
      }
    }
    static _states() {
      return [class AppList extends this {
        $enter() {
          this.indexVal = 0;
        }
        $exit() {
          this.tag("Text1").text.fontStyle = "normal";
        }
        _getFocused() {
          this.tag("Text1").text.fontStyle = "bold";
          if (this.tag("AppList").length) {
            return this.tag("AppList").element;
          }
        }
        _handleDown() {
          this._setState("MetroApps");
        }
        _handleRight() {
          if (this.tag("AppList").length - 1 != this.tag("AppList").index) {
            this.tag("AppList").setNext();
            return this.tag("AppList").element;
          }
        }
        _handleUp() {
          this.widgets.menu.notify("TopPanel");
        }
        _handleLeft() {
          this.tag("Text1").text.fontStyle = "normal";
          if (this.tag("AppList").index != 0) {
            this.tag("AppList").setPrevious();
            return this.tag("AppList").element;
          } else {
            this.reset();
            this.widgets.menu.setIndex(this.indexVal);
            Router_default.focusWidget("Menu");
          }
        }
        _handleEnter() {
          let appApi9 = new AppApi();
          let applicationType = this.tag("AppList").items[this.tag("AppList").index].data.applicationType;
          this.uri = this.tag("AppList").items[this.tag("AppList").index].data.uri;
          applicationType = this.tag("AppList").items[this.tag("AppList").index].data.applicationType;
          Storage_default.set("applicationType", applicationType);
          this.uri = this.tag("AppList").items[this.tag("AppList").index].data.uri;
          if (Storage_default.get("applicationType") == "Cobalt") {
            appApi9.launchCobalt(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          } else if (Storage_default.get("applicationType") == "WebApp" && Storage_default.get("ipAddress")) {
            appApi9.launchWeb(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          } else if (Storage_default.get("applicationType") == "Lightning" && Storage_default.get("ipAddress")) {
            appApi9.launchLightning(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          } else if (Storage_default.get("applicationType") == "Native" && Storage_default.get("ipAddress")) {
            appApi9.launchNative(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          } else if (Storage_default.get("applicationType") == "Amazon") {
            console.log("Launching app");
            fetch("http://127.0.0.1:9998/Service/Controller/").then((res) => res.json()).then((data) => {
              console.log(data);
              data.plugins.forEach((element) => {
                if (element.callsign === "Amazon") {
                  console.log("Opening Amazon");
                  appApi9.launchPremiumApp("Amazon");
                  appApi9.setVisibility("ResidentApp", false);
                }
              });
            }).catch((err) => {
              console.log("Amazon not working");
            });
          } else if (Storage_default.get("applicationType") == "Netflix") {
            console.log("Launching app");
            fetch("http://127.0.0.1:9998/Service/Controller/").then((res) => res.json()).then((data) => {
              console.log(data);
              data.plugins.forEach((element) => {
                if (element.callsign === "Netflix") {
                  console.log("Opening Netflix");
                  appApi9.launchPremiumApp("Netflix");
                  appApi9.setVisibility("ResidentApp", false);
                }
              });
            }).catch((err) => {
              console.log("Netflix not working");
            });
          } else {
            if (this.uri === "USB") {
              this.usbApi.getMountedDevices().then((result) => {
                if (result.mounted.length === 1) {
                  Router_default.navigate("usb");
                }
              });
            }
          }
        }
      }, class MetroApps extends this {
        $enter() {
          this.indexVal = 1;
        }
        $exit() {
          this.tag("Text2").text.fontStyle = "normal";
        }
        _getFocused() {
          this.tag("Text2").text.fontStyle = "bold";
          if (this.tag("MetroApps").length) {
            return this.tag("MetroApps").element;
          }
        }
        _handleUp() {
          this._setState("AppList");
        }
        _handleDown() {
          this._setState("TVShows");
        }
        _handleRight() {
          if (this.tag("MetroApps").length - 1 != this.tag("MetroApps").index) {
            this.tag("MetroApps").setNext();
            return this.tag("MetroApps").element;
          }
        }
        _handleLeft() {
          this.tag("Text2").text.fontStyle = "normal";
          if (this.tag("MetroApps").index != 0) {
            this.tag("MetroApps").setPrevious();
            return this.tag("MetroApps").element;
          } else {
            this.reset();
            this.widgets.menu.setIndex(this.indexVal);
            Router_default.focusWidget("Menu");
          }
        }
        _handleEnter() {
          let appApi9 = new AppApi();
          let applicationType = this.tag("MetroApps").items[this.tag("MetroApps").index].data.applicationType;
          this.uri = this.tag("MetroApps").items[this.tag("MetroApps").index].data.uri;
          applicationType = this.tag("MetroApps").items[this.tag("MetroApps").index].data.applicationType;
          Storage_default.set("applicationType", applicationType);
          this.uri = this.tag("MetroApps").items[this.tag("MetroApps").index].data.uri;
          if (Storage_default.get("applicationType") == "Cobalt") {
            appApi9.launchCobalt(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          } else if (Storage_default.get("applicationType") == "WebApp" && Storage_default.get("ipAddress")) {
            appApi9.launchWeb(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          } else if (Storage_default.get("applicationType") == "Lightning" && Storage_default.get("ipAddress")) {
            appApi9.launchLightning(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          } else if (Storage_default.get("applicationType") == "Native" && Storage_default.get("ipAddress")) {
            appApi9.launchNative(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          }
        }
      }, class TVShows extends this {
        $enter() {
          this.indexVal = 2;
          this.scroll(-130);
        }
        _handleUp() {
          this.scroll(270);
          this._setState("MetroApps");
        }
        _getFocused() {
          this.tag("Text3").text.fontStyle = "bold";
          if (this.tag("TVShows").length) {
            return this.tag("TVShows").element;
          }
        }
        _handleRight() {
          if (this.tag("TVShows").length - 1 != this.tag("TVShows").index) {
            this.tag("TVShows").setNext();
            return this.tag("TVShows").element;
          }
        }
        _handleLeft() {
          this.tag("Text3").text.fontStyle = "normal";
          if (this.tag("TVShows").index != 0) {
            this.tag("TVShows").setPrevious();
            return this.tag("TVShows").element;
          } else {
            this.reset();
            this.widgets.menu.setIndex(this.indexVal);
            Router_default.focusWidget("Menu");
          }
        }
        _handleDown() {
          if (this.tag("UsbApps").length) {
            this._setState("UsbApps");
          }
        }
        _handleEnter() {
          if (Storage_default.get("ipAddress")) {
            Router_default.navigate("player");
          }
        }
        $exit() {
          this.tag("Text3").text.fontStyle = "normal";
        }
      }, class UsbApps extends this {
        $enter() {
          this.indexVal = 3;
        }
        $exit() {
          this.tag("Text4").text.fontStyle = "normal";
        }
        _getFocused() {
          this.tag("Text4").text.fontStyle = "bold";
          if (this.tag("UsbApps").length) {
            return this.tag("UsbApps").element;
          }
        }
        _handleUp() {
          this._setState("TVShows");
        }
        _handleRight() {
          if (this.tag("UsbApps").length - 1 != this.tag("MetroApps").index) {
            this.tag("UsbApps").setNext();
            return this.tag("UsbApps").element;
          }
        }
        _handleLeft() {
          this.tag("Text4").text.fontStyle = "normal";
          if (this.tag("UsbApps").index != 0) {
            this.tag("UsbApps").setPrevious();
            return this.tag("UsbApps").element;
          } else {
            this.reset();
            this.widgets.menu.setIndex(this.indexVal);
            Router_default.focusWidget("Menu");
          }
        }
        _handleEnter() {
          let appApi9 = new AppApi();
          let applicationType = this.tag("UsbApps").items[this.tag("UsbApps").index].data.applicationType;
          this.uri = this.tag("UsbApps").items[this.tag("UsbApps").index].data.uri;
          applicationType = this.tag("UsbApps").items[this.tag("UsbApps").index].data.applicationType;
          Storage_default.set("applicationType", applicationType);
          this.uri = this.tag("UsbApps").items[this.tag("UsbApps").index].data.uri;
          if (Storage_default.get("applicationType") == "Cobalt") {
            appApi9.launchCobalt(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          } else if (Storage_default.get("applicationType") == "WebApp" && Storage_default.get("ipAddress")) {
            appApi9.launchWeb(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          } else if (Storage_default.get("applicationType") == "Lightning" && Storage_default.get("ipAddress")) {
            appApi9.launchLightning(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          } else if (Storage_default.get("applicationType") == "Native" && Storage_default.get("ipAddress")) {
            appApi9.launchNative(this.uri);
            appApi9.setVisibility("ResidentApp", false);
          }
        }
      }, class RightArrow extends this {
      }, class LeftArrow extends this {
      }];
    }
  };

  // src/screens/BluetoothPairingScreen.js
  var _item;
  var BluetoothPairingScreen = class extends Lightning_default.Component {
    set params(args) {
      if (args.bluetoothItem) {
        this.item(args.bluetoothItem);
      } else {
        Router_default.navigate("settings/bluetooth");
      }
    }
    static _template() {
      return {
        w: 1920,
        h: 2e3,
        rect: true,
        color: 4278190080,
        BluetoothPair: {
          x: 960,
          y: 300,
          Title: {
            mountX: 0.5,
            text: {
              text: "",
              fontFace: CONFIG.language.font,
              fontSize: 40,
              textColor: CONFIG.theme.hex
            }
          },
          BorderTop: {
            x: 0,
            y: 75,
            w: 1558,
            h: 3,
            rect: true,
            mountX: 0.5
          },
          Pairing: {
            x: 0,
            y: 125,
            mountX: 0.5,
            text: {
              text: "",
              fontFace: CONFIG.language.font,
              fontSize: 25
            }
          },
          Buttons: {
            x: 0,
            y: 200,
            w: 440,
            mountX: 0.5,
            h: 50,
            ConnectDisconnect: {
              x: 0,
              w: 200,
              mountX: 0.5,
              h: 50,
              rect: true,
              color: 4294967295,
              Title: {
                x: 100,
                y: 25,
                mount: 0.5,
                text: {
                  text: "",
                  fontFace: CONFIG.language.font,
                  fontSize: 22,
                  textColor: 4278190080
                }
              }
            },
            Unpair: {
              x: 0 + 220,
              w: 200,
              mountX: 0.5,
              h: 50,
              rect: true,
              color: 4294967295,
              Title: {
                x: 100,
                y: 25,
                mount: 0.5,
                text: {
                  text: "Unpair",
                  fontFace: CONFIG.language.font,
                  fontSize: 22,
                  textColor: 4278190080
                }
              }
            },
            Cancel: {
              x: 0 + 220 + 220,
              w: 200,
              mountX: 0.5,
              h: 50,
              rect: true,
              color: 4286414205,
              Title: {
                x: 100,
                y: 25,
                mount: 0.5,
                text: {
                  text: "Cancel",
                  fontFace: CONFIG.language.font,
                  fontSize: 22,
                  textColor: 4278190080
                }
              }
            }
          },
          BorderBottom: {
            x: 0,
            y: 300,
            w: 1558,
            h: 3,
            rect: true,
            mountX: 0.5
          }
        }
      };
    }
    item(item) {
      _item = item;
      this._setState("ConnectDisconnect");
      this.tag("Title").text = item.name;
      if (item.connected) {
        this.tag("BluetoothPair.Buttons.ConnectDisconnect.Title").text = "Disconnect";
      } else {
        this.tag("BluetoothPair.Buttons.ConnectDisconnect.Title").text = "Connect";
      }
    }
    _init() {
      this._setState("ConnectDisconnect");
    }
    static _states() {
      return [class ConnectDisconnect extends this {
        $enter() {
          this._focus();
        }
        _handleEnter() {
          if (_item.connected) {
            Router_default.navigate("settings/bluetooth", {
              action: "Disconnect"
            });
          } else {
            Router_default.navigate("settings/bluetooth", {
              action: "Connect"
            });
          }
        }
        _handleRight() {
          this._setState("Unpair");
        }
        _focus() {
          this.tag("BluetoothPair.Buttons.ConnectDisconnect").patch({
            color: CONFIG.theme.hex
          });
          this.tag("BluetoothPair.Buttons.ConnectDisconnect.Title").patch({
            text: {
              textColor: 4294967295
            }
          });
        }
        _unfocus() {
          this.tag("BluetoothPair.Buttons.ConnectDisconnect").patch({
            color: 4294967295
          });
          this.tag("BluetoothPair.Buttons.ConnectDisconnect.Title").patch({
            text: {
              textColor: 4278190080
            }
          });
        }
        $exit() {
          this._unfocus();
        }
      }, class Unpair extends this {
        $enter() {
          this._focus();
        }
        _handleEnter() {
          Router_default.navigate("settings/bluetooth", {
            action: "Unpair"
          });
        }
        _handleRight() {
          this._setState("Cancel");
        }
        _handleLeft() {
          this._setState("ConnectDisconnect");
        }
        _focus() {
          this.tag("Unpair").patch({
            color: CONFIG.theme.hex
          });
          this.tag("Unpair.Title").patch({
            text: {
              textColor: 4294967295
            }
          });
        }
        _unfocus() {
          this.tag("Unpair").patch({
            color: 4294967295
          });
          this.tag("Unpair.Title").patch({
            text: {
              textColor: 4278190080
            }
          });
        }
        $exit() {
          this._unfocus();
        }
      }, class Cancel extends this {
        $enter() {
          this._focus();
        }
        _handleEnter() {
          Router_default.navigate("settings/bluetooth", {
            action: "Cancel"
          });
        }
        _handleLeft() {
          this._setState("Unpair");
        }
        _focus() {
          this.tag("Cancel").patch({
            color: CONFIG.theme.hex
          });
          this.tag("Cancel.Title").patch({
            text: {
              textColor: 4294967295
            }
          });
        }
        _unfocus() {
          this.tag("Cancel").patch({
            color: 4286414205
          });
          this.tag("Cancel.Title").patch({
            text: {
              textColor: 4278190080
            }
          });
        }
        $exit() {
          this._unfocus();
        }
      }];
    }
  };

  // src/items/BluetoothItem.js
  var BluetoothItem = class extends SettingsItem {
    static _template() {
      return {
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        },
        Item: {
          w: 1920 - 300,
          h: 90
        },
        BottomLine: {
          y: 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        }
      };
    }
    set item(item) {
      this._item = item;
      this.connected = item.connected ? "Connected" : "Not Connected";
      this.status = item.paired ? this.connected : "Not Paired";
      this.tag("Item").patch({
        Left: {
          x: 10,
          y: 45,
          mountY: 0.5,
          text: {
            text: item.name,
            fontSize: 25,
            textColor: COLORS.textColor,
            fontFace: CONFIG.language.font
          }
        },
        Right: {
          x: 1600 - 200,
          y: 30,
          mountY: 0.5,
          mountX: 1,
          Text: {
            text: {
              text: this.status,
              fontSize: 25,
              fontFace: CONFIG.language.font,
              verticalAlign: "middle"
            }
          }
        }
      });
    }
    _focus() {
      this.tag("TopLine").color = CONFIG.theme.hex;
      this.tag("BottomLine").color = CONFIG.theme.hex;
      this.patch({
        zIndex: 10
      });
      this.tag("TopLine").h = 6;
      this.tag("BottomLine").h = 6;
    }
    _unfocus() {
      this.tag("TopLine").color = 4294967295;
      this.tag("BottomLine").color = 4294967295;
      this.patch({
        zIndex: 1
      });
      this.tag("TopLine").h = 3;
      this.tag("BottomLine").h = 3;
    }
  };

  // src/api/BluetoothApi.js
  var BluetoothApi = class {
    constructor() {
      this._events = new Map();
      this._devices = [];
      this._pairedDevices = [];
      this._connectedDevices = [];
      const config7 = {
        host: "127.0.0.1",
        port: 9998,
        default: 1
      };
      this._thunder = thunderJS_default(config7);
    }
    activate() {
      return new Promise((resolve, reject) => {
        this.callsign = "org.rdk.Bluetooth";
        this._thunder.call("Controller", "activate", {
          callsign: this.callsign
        }).then((result) => {
          this._thunder.on(this.callsign, "onDiscoveredDevice", (notification) => {
            this.getDiscoveredDevices().then(() => {
              this._events.get("onDiscoveredDevice")(notification);
            });
          });
          this._thunder.on(this.callsign, "onStatusChanged", (notification) => {
            if (notification.newStatus === "PAIRING_CHANGE") {
              this.getPairedDevices();
            } else if (notification.newStatus === "CONNECTION_CHANGE") {
              this.getConnectedDevices().then(() => {
                this._events.get("onConnectionChange")(notification);
              });
            } else if (notification.newStatus === "DISCOVERY_STARTED") {
              this.getConnectedDevices().then(() => {
                this._events.get("onDiscoveryStarted")();
              });
            } else if (notification.newStatus === "DISCOVERY_COMPLETED") {
              this.getConnectedDevices().then(() => {
                this._events.get("onDiscoveryCompleted")();
              });
            }
          });
          this._thunder.on(this.callsign, "onPairingRequest", (notification) => {
            this._events.get("onPairingRequest")(notification);
          });
          this._thunder.on(this.callsign, "onRequestFailed", (notification) => {
            this._events.get("onRequestFailed")(notification);
          });
          this._thunder.on(this.callsign, "onConnectionRequest", (notification) => {
            this._events.get("onConnectionRequest")(notification);
          });
          resolve("Blutooth activated");
        }).catch((err) => {
          console.error("Activation failure", err);
          reject("Bluetooth activation failed", err);
        });
      });
    }
    registerEvent(eventId, callback) {
      this._events.set(eventId, callback);
    }
    deactivate() {
      this._events = new Map();
    }
    disable() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "disable").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error(`Can't disable : ${JSON.stringify(err)}`);
          reject();
        });
      });
    }
    enable() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "enable").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error(`Can't enable : ${JSON.stringify(err)}`);
          reject();
        });
      });
    }
    startScan() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "startScan", {
          timeout: "10",
          profile: `KEYBOARD,
                    MOUSE,
                    JOYSTICK,
                    HUMAN INTERFACE DEVICE`
        }).then((result) => {
          if (result.success)
            resolve();
          else
            reject();
        }).catch((err) => {
          console.error("Error", err);
          reject();
        });
      });
    }
    stopScan() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "stopScan", {}).then((result) => {
          if (result.success)
            resolve();
          else
            reject();
        }).catch((err) => {
          console.error("Error", err);
          reject();
        });
      });
    }
    getDiscoveredDevices() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "getDiscoveredDevices").then((result) => {
          this._devices = result.discoveredDevices;
          resolve(result.discoveredDevices);
        }).catch((err) => {
          console.error(`Can't get discovered devices : ${JSON.stringify(err)}`);
          reject();
        });
      });
    }
    get discoveredDevices() {
      return this._devices;
    }
    getPairedDevices() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "getPairedDevices").then((result) => {
          this._pairedDevices = result.pairedDevices;
          resolve(result.pairedDevices);
        }).catch((err) => {
          console.error(`Can't get paired devices : ${err}`);
          reject();
        });
      });
    }
    get pairedDevices() {
      return this._pairedDevices;
    }
    getConnectedDevices() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "getConnectedDevices").then((result) => {
          this._connectedDevices = result.connectedDevices;
          resolve(result.connectedDevices);
        }).catch((err) => {
          console.error(`Can't get connected devices : ${err}`);
          reject();
        });
      });
    }
    get connectedDevices() {
      return this._connectedDevices;
    }
    connect(deviceID, deviceType) {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "connect", {
          deviceID,
          deviceType,
          connectedProfile: deviceType
        }).then((result) => {
          resolve(result.success);
        }).catch((err) => {
          console.error("Connection failed", err);
          reject();
        });
      });
    }
    disconnect(deviceID, deviceType) {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "disconnect", {
          deviceID,
          deviceType
        }).then((result) => {
          if (result.success)
            resolve(true);
          else
            reject();
        }).catch((err) => {
          console.error("disconnect failed", err);
          reject();
        });
      });
    }
    unpair(deviceId) {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "unpair", {
          deviceID: deviceId
        }).then((result) => {
          if (result.success)
            resolve(result);
          else
            reject(result);
        }).catch((err) => {
          console.error("unpair failed", err);
          reject();
        });
      });
    }
    pair(deviceId) {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "pair", {
          deviceID: deviceId
        }).then((result) => {
          if (result.success)
            resolve(result);
          else
            reject(result);
        }).catch((err) => {
          console.error("Error on pairing", err);
          reject();
        });
      });
    }
    respondToEvent(deviceID, eventType, responseValue) {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "respondToEvent", {
          deviceID,
          eventType,
          responseValue
        }).then((result) => {
          if (result.success)
            resolve();
          else
            reject();
        }).catch((err) => {
          console.error("Error on respondToEvent", err);
          reject();
        });
      });
    }
    getName() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "getName").then((result) => {
          resolve(result.name);
        });
      });
    }
    setAudioStream(deviceID) {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Bluetooth", "setAudioStream", {
          "deviceID": deviceID,
          "audioStreamName": "AUXILIARY"
        }).then((result) => {
          this._connectedDevices = result.connectedDevices;
          resolve(result.connectedDevices);
        }).catch((err) => {
          console.error(`Can't get connected devices : ${err}`);
          reject();
        });
      });
    }
  };

  // src/screens/BluetoothConfirmation.js
  var BluetoothConfirmation = class extends Lightning_default.Component {
    static _template() {
      return {
        w: 1920,
        h: 1080,
        rect: true,
        color: 4278190080,
        Title: {
          mountX: 0.5,
          text: {
            text: "",
            fontFace: CONFIG.language.font,
            fontSize: 40,
            textColor: CONFIG.theme.hex
          }
        },
        BorderTop: {
          x: 0,
          y: 75,
          w: 1558,
          h: 3,
          rect: true,
          mountX: 0.5
        },
        Pairing: {
          x: 0,
          y: 125,
          mountX: 0.5,
          text: {
            text: "",
            fontFace: CONFIG.language.font,
            fontSize: 25
          }
        },
        RectangleDefault: {
          x: 0,
          y: 200,
          w: 200,
          mountX: 0.5,
          h: 50,
          rect: true,
          color: CONFIG.theme.hex,
          Ok: {
            x: 100,
            y: 25,
            mount: 0.5,
            text: {
              text: "OK",
              fontFace: CONFIG.language.font,
              fontSize: 22
            }
          }
        },
        BorderBottom: {
          x: 0,
          y: 300,
          w: 1558,
          h: 3,
          rect: true,
          mountX: 0.5
        }
      };
    }
    set item(item) {
      this.tag("Title").text = item.name;
    }
    _handleEnter() {
      this.fireAncestors("$pressOK");
    }
    _handleBack() {
      this.fireAncestors("$pressOK");
    }
  };

  // src/screens/BluetoothScreen.js
  var BluetoothScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Bluetooth On/Off"));
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        Bluetooth: {
          y: 275,
          x: 200,
          Confirmation: {
            x: 780,
            y: 100,
            type: BluetoothConfirmation,
            visible: false
          },
          PairingScreen: {
            x: 780,
            y: 100,
            type: BluetoothPairingScreen,
            zIndex: 100,
            visible: false
          },
          Switch: {
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Bluetooth On/Off",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 67,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/ToggleOffWhite.png")
            }
          },
          Searching: {
            visible: false,
            h: 90,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Searching for Devices",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Loader: {
              h: 45,
              w: 45,
              x: 320,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Loading.gif")
            }
          },
          Networks: {
            PairedNetworks: {
              y: 180,
              List: {
                type: Lightning_default.components.ListComponent,
                w: 1920 - 300,
                itemSize: 90,
                horizontal: false,
                invertDirection: true,
                roll: true,
                rollMax: 900,
                itemScrollOffset: -6
              }
            },
            AvailableNetworks: {
              y: 90,
              visible: false,
              List: {
                w: 1920 - 300,
                type: Lightning_default.components.ListComponent,
                itemSize: 90,
                horizontal: false,
                invertDirection: true,
                roll: true,
                rollMax: 900,
                itemScrollOffset: -6
              }
            },
            visible: false
          },
          AddADevice: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Add A Device",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            visible: false
          }
        }
      };
    }
    set params(args) {
      if (args.action) {
        this.pressEnter(args.action);
      }
    }
    _unfocus() {
      this._disable();
    }
    pageTransition() {
      return "left";
    }
    _init() {
      this._bt = new BluetoothApi();
      this._bluetooth = false;
      this._activateBluetooth();
      this._setState("Switch");
      this.switch();
      this._pairedNetworks = this.tag("Networks.PairedNetworks");
      this._availableNetworks = this.tag("Networks.AvailableNetworks");
      this.renderDeviceList();
      this.loadingAnimation = this.tag("Searching.Loader").animation({
        duration: 3,
        repeat: -1,
        stopMethod: "immediate",
        stopDelay: 0.2,
        actions: [{
          p: "rotation",
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
    }
    _focus() {
      this._setState("Switch");
      this._enable();
      if (this._bluetooth) {
        this.tag("Networks").visible = true;
        this.tag("AddADevice").visible = true;
        this.tag("Switch.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
        this.renderDeviceList();
        this._bt.startScan();
      }
    }
    _handleBack() {
      Router_default.navigate("settings");
    }
    _enable() {
      if (this._bluetooth) {
        this._bt.startScan();
      }
      this.scanTimer = setInterval(() => {
        if (this._bluetooth) {
          this._bt.startScan();
        }
      }, 15e3);
    }
    _disable() {
      clearInterval(this.scanTimer);
    }
    showAvailableDevices() {
      this.tag("Switch").patch({
        alpha: 0
      });
      this.tag("PairedNetworks").patch({
        alpha: 0
      });
      this.tag("AddADevice").patch({
        alpha: 0
      });
      this.tag("Searching").patch({
        visible: true
      });
      this.tag("AvailableNetworks").patch({
        visible: true
      });
    }
    hideAvailableDevices() {
      this.tag("Switch").patch({
        alpha: 1
      });
      this.tag("PairedNetworks").patch({
        alpha: 1
      });
      this.tag("AddADevice").patch({
        alpha: 1
      });
      this.tag("Searching").patch({
        visible: false
      });
      this.tag("AvailableNetworks").patch({
        visible: false
      });
      this.tag("Confirmation").patch({
        visible: false
      });
    }
    showPairingScreen() {
      this.tag("Switch").patch({
        alpha: 0
      });
      this.tag("PairedNetworks").patch({
        alpha: 0
      });
      this.tag("AddADevice").patch({
        alpha: 0
      });
      this.tag("Searching").patch({
        visible: false
      });
      this.tag("AvailableNetworks").patch({
        visible: false
      });
      this.tag("Confirmation").patch({
        visible: false
      });
      this.tag("PairingScreen").patch({
        visible: true
      });
      this.fireAncestors("$hideTopPanel");
    }
    hidePairingScreen() {
      this.tag("Switch").patch({
        alpha: 1
      });
      this.tag("PairedNetworks").patch({
        alpha: 1
      });
      this.tag("AddADevice").patch({
        alpha: 1
      });
      this.tag("Searching").patch({
        visible: false
      });
      this.tag("AvailableNetworks").patch({
        visible: false
      });
      this.tag("Confirmation").patch({
        visible: false
      });
      this.tag("PairingScreen").patch({
        visible: false
      });
      this.fireAncestors("$showTopPanel");
    }
    showConfirmation() {
      this.tag("Switch").patch({
        alpha: 0
      });
      this.tag("PairedNetworks").patch({
        alpha: 0
      });
      this.tag("AddADevice").patch({
        alpha: 0
      });
      this.tag("Searching").patch({
        visible: false
      });
      this.tag("AvailableNetworks").patch({
        visible: false
      });
      this.tag("PairingScreen").patch({
        visible: false
      });
      this.tag("Confirmation").patch({
        visible: true
      });
      this.fireAncestors("$hideTopPanel");
    }
    hideConfirmation() {
      this.tag("Switch").patch({
        alpha: 1
      });
      this.tag("PairedNetworks").patch({
        alpha: 1
      });
      this.tag("AddADevice").patch({
        alpha: 1
      });
      this.tag("Searching").patch({
        visible: false
      });
      this.tag("AvailableNetworks").patch({
        visible: false
      });
      this.tag("PairingScreen").patch({
        visible: false
      });
      this.tag("Confirmation").patch({
        visible: false
      });
      this.fireAncestors("$showTopPanel");
    }
    renderDeviceList() {
      this._bt.getPairedDevices().then((result) => {
        this._pairedList = result;
        this._pairedNetworks.h = this._pairedList.length * 90;
        this._pairedNetworks.tag("List").h = this._pairedList.length * 90;
        this._pairedNetworks.tag("List").items = this._pairedList.map((item, index) => {
          item.paired = true;
          return {
            ref: "Paired" + index,
            w: 1920 - 300,
            h: 90,
            type: BluetoothItem,
            item
          };
        });
      });
      this._bt.getDiscoveredDevices().then((result) => {
        this._discoveredList = result;
        this._otherList = this._discoveredList.filter((device) => {
          if (!device.paired) {
            result = this._pairedList.map((a) => a.deviceID);
            if (result.includes(device.deviceID)) {
              return false;
            } else
              return device;
          }
        });
        this._availableNetworks.h = this._otherList.length * 90;
        this._availableNetworks.tag("List").h = this._otherList.length * 90;
        this._availableNetworks.tag("List").items = this._otherList.map((item, index) => {
          return {
            ref: "Other" + index,
            w: 1920 - 300,
            h: 90,
            type: BluetoothItem,
            item
          };
        });
      });
    }
    pressEnter(option) {
      if (option === "Cancel") {
        this._setState("Switch");
      } else if (option === "Pair") {
        this._bt.pair(this._availableNetworks.tag("List").element._item.deviceID).then((result) => {
          let btName = this._availableNetworks.tag("List").element._item.name;
          if (result.success) {
            this.widgets.fail.notify({
              title: btName,
              msg: "Pairing Succesful"
            });
            Router_default.focusWidget("Fail");
          } else {
            this.widgets.fail.notify({
              title: btName,
              msg: "Pairing Failed"
            });
            Router_default.focusWidget("Fail");
          }
        });
      } else if (option === "Connect") {
        this._bt.connect(this._pairedNetworks.tag("List").element._item.deviceID, this._pairedNetworks.tag("List").element._item.deviceType).then((result) => {
          let btName = this._pairedNetworks.tag("List").element._item.name;
          if (!result) {
            this.widgets.fail.notify({
              title: btName,
              msg: "Connection Failed"
            });
            Router_default.focusWidget("Fail");
          } else {
            this._bt.setAudioStream(this._pairedNetworks.tag("List").element._item.deviceID);
            this.widgets.fail.notify({
              title: btName,
              msg: "Connection Successful"
            });
            Router_default.focusWidget("Fail");
          }
        });
      } else if (option === "Disconnect") {
        this._bt.disconnect(this._pairedNetworks.tag("List").element._item.deviceID, this._pairedNetworks.tag("List").element._item.deviceType).then((result) => {
          let btName = this._pairedNetworks.tag("List").element._item.name;
          if (!result) {
            this.widgets.fail.notify({
              title: btName,
              msg: "Failed to Disconnect"
            });
            Router_default.focusWidget("Fail");
          } else {
            this.widgets.fail.notify({
              title: btName,
              msg: "Disconnected"
            });
            Router_default.focusWidget("Fail");
          }
        });
      } else if (option === "Unpair") {
        this._bt.unpair(this._pairedNetworks.tag("List").element._item.deviceID).then((result) => {
          let btName = this._pairedNetworks.tag("List").element._item.name;
          if (result.success) {
            this.widgets.fail.notify({
              title: btName,
              msg: "Unpaired"
            });
            Router_default.focusWidget("Fail");
          } else {
            this.widgets.fail.notify({
              title: btName,
              msg: "Unpairing Failed"
            });
            Router_default.focusWidget("Fail");
          }
        });
      }
    }
    static _states() {
      return [class Switch extends this {
        $enter() {
          this.hideAvailableDevices();
          this.hidePairingScreen();
          this.tag("Switch")._focus();
        }
        $exit() {
          this.tag("Switch")._unfocus();
        }
        _handleDown() {
          this._setState("AddADevice");
        }
        _handleEnter() {
          this.switch();
        }
      }, class Confirmation extends this {
        $enter() {
          this.showConfirmation();
        }
        _getFocused() {
          return this.tag("Confirmation");
        }
        $pressOK() {
          this._setState("Switch");
          this.hideConfirmation();
        }
      }, class PairedDevices extends this {
        $enter() {
          this.hideAvailableDevices();
        }
        _getFocused() {
          return this._pairedNetworks.tag("List").element;
        }
        _handleDown() {
          this._navigate("MyDevices", "down");
        }
        _handleUp() {
          this._navigate("MyDevices", "up");
        }
        _handleEnter() {
          Router_default.navigate("settings/bluetooth/pairing", {
            bluetoothItem: this._pairedNetworks.tag("List").element._item
          });
        }
      }, class AvailableDevices extends this {
        _getFocused() {
          return this._availableNetworks.tag("List").element;
        }
        _handleDown() {
          this._navigate("AvailableDevices", "down");
        }
        _handleUp() {
          this._navigate("AvailableDevices", "up");
        }
        _handleEnter() {
          this.pressEnter("Pair");
        }
        _handleBack() {
          this.hideAvailableDevices();
          this._setState("Switch");
        }
      }, class AddADevice extends this {
        $enter() {
          this.tag("AddADevice")._focus();
          this.hideAvailableDevices();
        }
        _handleUp() {
          this._setState("Switch");
        }
        _handleDown() {
          if (this._bluetooth) {
            if (this._pairedNetworks.tag("List").length > 0) {
              this._setState("PairedDevices");
            } else if (this._availableNetworks.tag("List").length > 0) {
              this._setState("AvailableDevices");
            }
          }
        }
        $exit() {
          this.tag("AddADevice")._unfocus();
        }
        _handleEnter() {
          if (this._bluetooth) {
            this.showAvailableDevices();
            this._setState("AvailableDevices");
          }
        }
      }, class PairingScreen extends this {
        $enter() {
          this._disable();
          this._bt.stopScan();
          return this.tag("PairingScreen");
        }
        _getFocused() {
          return this.tag("PairingScreen");
        }
        $exit() {
          this.tag("PairingScreen").visible = false;
          this._enable();
        }
      }];
    }
    _navigate(listname, dir) {
      let list;
      if (listname === "MyDevices")
        list = this._pairedNetworks.tag("List");
      else if (listname === "AvailableDevices")
        list = this._availableNetworks.tag("List");
      if (dir === "down") {
        if (list.index < list.length - 1)
          list.setNext();
        else if (list.index == list.length - 1) {
          if (listname === "MyDevices" && this._availableNetworks.tag("List").length > 0) {
          }
        }
      } else if (dir === "up") {
        if (list.index > 0)
          list.setPrevious();
        else if (list.index == 0) {
          if (listname === "AvailableDevices" && this._pairedNetworks.tag("List").length > 0) {
          } else if (listname === "MyDevices") {
            this._setState("AddADevice");
          }
        }
      }
    }
    switch() {
      if (this._bluetooth) {
        this._bt.disable().then((result) => {
          if (result.success) {
            this._bluetooth = false;
            this.tag("Networks").visible = false;
            this.tag("AddADevice").visible = false;
            this.tag("Switch.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
          }
        });
      } else {
        this._bt.enable().then((result) => {
          if (result.success) {
            this._bluetooth = true;
            this.tag("Networks").visible = true;
            this.tag("AddADevice").visible = true;
            this.tag("Switch.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
            this.renderDeviceList();
            this._bt.startScan();
          }
        });
      }
    }
    _activateBluetooth() {
      this._bt.activate().then(() => {
        this._bluetooth = true;
        this._bt.registerEvent("onDiscoveredDevice", () => {
          this.renderDeviceList();
        });
        this._bt.registerEvent("onPairingRequest", (notification) => {
          this.respondToPairingRequest(notification.deviceID, "ACCEPTED");
        });
        this._bt.registerEvent("onConnectionChange", (notification) => {
          this._bt.startScan();
          this.renderDeviceList();
          let btName = notification.name;
          if (notification.connected) {
            if (this.widgets.fail) {
              this.widgets.fail.notify({
                title: btName,
                msg: "CONNECTION SUCCESS"
              });
              Router_default.focusWidget("Fail");
            }
          } else {
            if (this.widgets.fail) {
              this.widgets.fail.notify({
                title: btName,
                msg: "CONNECTION FAILED"
              });
              Router_default.focusWidget("Fail");
            }
          }
        });
        this._bt.registerEvent("onDiscoveryCompleted", () => {
          this.tag("Searching.Loader").visible = false;
          this.loadingAnimation.stop();
          this.renderDeviceList();
        });
        this._bt.registerEvent("onDiscoveryStarted", () => {
          this.loadingAnimation.start();
          this.tag("Searching.Loader").visible = true;
        });
        this._bt.registerEvent("onRequestFailed", (notification) => {
          this._bt.startScan();
          this.renderDeviceList();
          if (this.widgets.fail) {
            this.widgets.fail.notify({
              title: notification.name,
              msg: notification.newStatus
            });
            Router_default.focusWidget("Fail");
          }
        });
      });
    }
    respondToPairingRequest(deviceID, responseValue) {
      this._bt.respondToEvent(deviceID, "onPairingRequest", responseValue);
    }
  };

  // src/ui-components/components/Styles/Layout.js
  var SCREEN = {
    w: 1920,
    h: 1080
  };

  // src/ui-components/components/Styles/Colors.js
  function getHexColor(hex, alpha = 100) {
    if (!hex) {
      return 0;
    }
    let hexAlpha = Math.round(alpha / 100 * 255).toString(16);
    let str = `0x${hexAlpha}${hex}`;
    return parseInt(Number(str), 10);
  }
  var COLORS_NEUTRAL = {
    dark1: "000000",
    dark2: "080808",
    dark3: "101010",
    light1: "FFFFFF",
    light2: "F5F5F5",
    light3: "E8E8E8"
  };

  // src/ui-components/components/Styles/createStyles.js
  var createStyles_default = (styles2, theme) => {
    return typeof styles2 === "function" ? styles2(theme) : styles2;
  };

  // src/ui-components/utils/index.js
  var RoundRect = {
    getWidth(w, options = {}) {
      const {
        padding,
        paddingLeft,
        paddingRight,
        strokeWidth
      } = __spreadValues({
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0,
        strokeWidth: 0
      }, options);
      if (!w)
        return 0;
      return w - (paddingLeft || padding) - (paddingRight || padding) - strokeWidth;
    },
    getHeight(h, options = {}) {
      const {
        padding,
        paddingBottom,
        paddingTop,
        strokeWidth
      } = __spreadValues({
        padding: 0,
        paddingBottom: 0,
        paddingTop: 0,
        strokeWidth: 0
      }, options);
      if (!h)
        return 0;
      return h - (paddingBottom || padding) - (paddingTop || padding) - strokeWidth;
    }
  };
  function clone(target, object) {
    const _clone = __spreadValues({}, target);
    if (!object || target === object)
      return _clone;
    for (let key in object) {
      const value = object[key];
      if (target.hasOwnProperty(key)) {
        _clone[key] = getMergeValue(key, target, object);
      } else {
        _clone[key] = value;
      }
    }
    return _clone;
  }
  function getMergeValue(key, target, object) {
    const targetVal = target[key];
    const objectVal = object[key];
    const targetValType = typeof targetVal;
    const objectValType = typeof objectVal;
    if (targetValType !== objectValType || objectValType === "function" || Array.isArray(objectVal)) {
      return objectVal;
    }
    if (objectVal && objectValType === "object") {
      return clone(targetVal, objectVal);
    }
    return objectVal;
  }
  function measureTextWidth(text = {}) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const {
      fontStyle,
      fontWeight,
      fontSize,
      fontFamily = text.fontFace || "sans-serif"
    } = text;
    const fontCss = [fontStyle, fontWeight, fontSize ? `${fontSize}px` : "0", `'${fontFamily}'`].filter(Boolean).join(" ");
    ctx.font = fontCss;
    const textMetrics = ctx.measureText(text.text || "");
    return Math.round(textMetrics.width);
  }
  function getFirstNumber(...numbers) {
    return numbers.find(Number.isFinite);
  }
  function getDimension(prop, component) {
    if (!component)
      return 0;
    const transition = component.transition(prop);
    if (transition.isRunning())
      return transition.targetValue;
    return component[prop];
  }
  var getX = getDimension.bind(null, "x");
  var getY = getDimension.bind(null, "y");
  var getW = (component) => getDimension("w", component) || component.renderWidth;
  var getH = (component) => getDimension("h", component) || component.renderHeight;

  // src/ui-components/components/Styles/createTheme.js
  var gradientColor = COLORS_NEUTRAL.light2;
  var gradientAnimation = {
    duration: 0.6,
    actions: [{
      p: "colorUl",
      v: {
        0: getHexColor(gradientColor, 72),
        1: getHexColor(gradientColor, 56)
      }
    }, {
      p: "colorUr",
      v: {
        0: getHexColor(gradientColor, 24),
        1: getHexColor(gradientColor, 16)
      }
    }, {
      p: "colorBr",
      v: {
        0: 0,
        1: getHexColor(gradientColor, 0)
      }
    }, {
      p: "colorBl",
      v: {
        0: getHexColor(gradientColor, 24),
        1: getHexColor(gradientColor, 16)
      }
    }]
  };

  // src/ui-components/components/Styles/Styles.js
  var FOCUS_SCALE = {
    tile: 48,
    launchpad: 360,
    background: 284
  };
  var BACKGROUND_DIMENSIONS = {
    h: SCREEN.h * ((SCREEN.w + FOCUS_SCALE.background) / SCREEN.w),
    w: SCREEN.w * ((SCREEN.w + FOCUS_SCALE.background) / SCREEN.w)
  };

  // src/ui-components/components/Announcer/index.js
  var import_debounce = __toModule(require_debounce());
  var fiveMinutes = 300 * 1e3;

  // src/ui-components/mixins/withStyles.js
  function withStyles(Base, styles2, theme) {
    const _theme = theme || Base.theme;
    const _styles = Base.styles ? clone(Base.styles, createStyles_default(styles2, _theme)) : createStyles_default(styles2, _theme);
    return class extends Base {
      static get name() {
        return Base.name;
      }
      static get styles() {
        return _styles;
      }
      get styles() {
        return _styles;
      }
    };
  }

  // src/ui-components/components/Icon/index.js
  var Icon = class extends lightningjs_core_default.Component {
    static _template() {
      return {
        color: 4294967295,
        w: 0,
        h: 0
      };
    }
    get icon() {
      return this._icon;
    }
    set icon(icon) {
      this._icon = icon;
      this._update();
    }
    _init() {
      this._update();
    }
    _update() {
      const {
        icon,
        w,
        h
      } = this;
      const template = getIconTemplate(icon, w, h);
      this.patch(template);
    }
  };
  var [isSvgTag, isSvgURI, isImageURI] = [/^<svg.*<\/svg\>$/, /\.svg$/, /\.(a?png|bmp|gif|ico|cur|jpe?g|pjp(eg)?|jfif|tiff?|webp)$/].map((regex) => RegExp.prototype.test.bind(regex));
  function getIconTemplate(icon, w, h) {
    const template = {
      w,
      h
    };
    switch (true) {
      case isSvgTag(icon):
        template.texture = lightningjs_core_default.Tools.getSvgTexture(`data:image/svg+xml,${encodeURIComponent(icon)}`, w, h);
        break;
      case isSvgURI(icon):
        template.texture = lightningjs_core_default.Tools.getSvgTexture(icon, w, h);
        break;
      case isImageURI(icon):
        template.src = icon;
        break;
      default:
        break;
    }
    return template;
  }

  // src/ui-components/components/Button/index.js
  var styles = {
    w: 113,
    h: 90,
    radius: 0,
    background: {
      color: 4294967295
    },
    icon: {
      color: 4294967295
    },
    text: {
      fontSize: 30,
      fontFace: CONFIG.language.font,
      color: 4278190080
    },
    padding: 50,
    stroke: {
      color: 0,
      weight: 2
    },
    focused: {
      background: {
        color: CONFIG.theme.hex
      },
      text: {
        color: 4280229663
      },
      icon: {
        color: 4280229663
      }
    }
  };
  var Button = class extends lightningjs_core_default.Component {
    static _template() {
      return {
        w: this.styles.w,
        h: this.styles.h,
        radius: this.styles.radius,
        strokeColor: this.styles.stroke.color,
        strokeWeight: this.styles.stroke.weight,
        Content: {
          mount: 0.5,
          x: (w) => w / 2,
          y: (h) => h / 2,
          flex: {
            direction: "row",
            alignContent: "center",
            alignItems: "center"
          },
          Icon: {
            type: Icon
          },
          Title: {
            y: 2
          }
        },
        Stroke: {
          zIndex: -1,
          mount: 0.5,
          x: (w) => w / 2,
          y: (h) => h / 2
        }
      };
    }
    _construct() {
      this._focused = false;
      this._whenEnabled = new Promise((resolve) => this._enable = resolve, console.error);
      this._strokeWeight = 2;
      this._strokeColor = 0;
    }
    _init() {
      this._update();
    }
    _focus() {
      if (this._smooth === void 0)
        this._smooth = true;
      this._focused = true;
      this._update();
    }
    _unfocus() {
      this._focused = false;
      this._update();
    }
    _updateColor() {
      const color = this._focused ? getFirstNumber(this.focusedBackground, this.styles.focused.background.color) : getFirstNumber(this.background, this.styles.background.color);
      if (this._smooth) {
        this.smooth = {
          color
        };
      } else {
        this.color = color;
      }
    }
    _updateTitle() {
      if (this.title) {
        this._Title.text = __spreadProps(__spreadValues({}, this.styles.text), {
          fontColor: this.styles.text.color,
          fontSize: this.fontSize || this.styles.text.fontSize,
          fontFamily: this.styles.text.fontFace || this.styles.text.fontFamily || this.stage._options.defaultFontFace,
          text: this.title
        });
        const color = this._focused ? getFirstNumber(this.focusedTextColor, this.styles.focused.text.color) : getFirstNumber(this.textColor, this.styles.text.color);
        if (this._smooth) {
          this._Title.smooth = {
            color
          };
        } else {
          this._Title.color = color;
        }
      } else {
        this._Title.texture = false;
      }
    }
    _updateIcon() {
      if (this.icon) {
        const {
          color,
          size,
          spacing,
          src
        } = this.icon;
        this._Icon.patch({
          w: size,
          h: size,
          icon: src,
          flexItem: {
            marginRight: this.title ? spacing : 0
          }
        });
        const iconColor = this._focused ? getFirstNumber(this.focusedIconColor, this.styles.focused.icon.color) : getFirstNumber(color, this.styles.icon.color);
        if (this._smooth) {
          this._Icon.smooth = {
            color: iconColor
          };
        } else {
          this._Icon.color = iconColor;
        }
      } else {
        this._Icon.patch({
          w: 0,
          h: 0,
          texture: false,
          flexItem: false
        });
      }
    }
    _updateStroke() {
      if (this.stroke && !this._focused) {
        const radius = this.radius || this.styles.radius;
        this.texture = lightningjs_core_default.Tools.getRoundRect(RoundRect.getWidth(this.w), RoundRect.getHeight(this.h), radius, 0, true, 4294967295);
        this._Stroke.color = this.strokeColor;
        this._Stroke.texture = lightningjs_core_default.Tools.getRoundRect(RoundRect.getWidth(this.w), RoundRect.getHeight(this.h), radius, this.strokeWeight, 4294967295, true, this.background);
      } else {
        const radius = this.radius || this.styles.radius;
        this.texture = lightningjs_core_default.Tools.getRoundRect(RoundRect.getWidth(this.w), RoundRect.getHeight(this.h), radius);
        this._Stroke.texture = false;
      }
    }
    _updateWidth() {
      if (!this.fixed) {
        const iconSize = this._icon ? this._icon.size + this._icon.spacing : 0;
        const padding = getFirstNumber(this.padding, this.styles.padding, 10);
        const w = measureTextWidth(this._Title.text || {}) + padding * 2 + iconSize;
        if (w && w !== this.w) {
          this.w = w > this.styles.w ? w : this.styles.w;
          this.fireAncestors("$itemChanged");
          this.signal("buttonWidthChanged", {
            w: this.w
          });
        }
      }
    }
    _update() {
      this._whenEnabled.then(() => {
        this._updateColor();
        this._updateTitle();
        this._updateIcon();
        this._updateStroke();
        this._updateWidth();
      });
    }
    _handleEnter() {
      if (typeof this.onEnter === "function") {
        this.onEnter(this);
      }
    }
    get radius() {
      return this._radius;
    }
    set radius(radius) {
      if (this._radius !== radius) {
        this._radius = radius;
        this._update();
      }
    }
    get title() {
      return this._title;
    }
    set title(title) {
      if (this._title !== title) {
        this._title = title;
        this._update();
      }
    }
    get icon() {
      return this._icon;
    }
    set icon({
      src,
      size = 20,
      spacing = 5,
      color = 4294967295
    }) {
      if (src) {
        this._icon = {
          src,
          size,
          spacing,
          color
        };
      } else {
        this._icon = null;
      }
      this._update();
    }
    get strokeWeight() {
      return this._strokeWeight;
    }
    set strokeWeight(strokeWeight) {
      if (this._strokeWeight !== strokeWeight) {
        this._strokeWeight = strokeWeight;
        this._update();
      }
    }
    get strokeColor() {
      return this._strokeColor;
    }
    set strokeColor(strokeColor) {
      if (this._strokeColor !== strokeColor) {
        this._strokeColor = strokeColor;
        this._update();
      }
    }
    get stroke() {
      return this._stroke;
    }
    set stroke(stroke) {
      if (this._stroke !== stroke) {
        this._stroke = stroke;
        this._update();
      }
    }
    get w() {
      return this._w;
    }
    set w(w) {
      if (this._w !== w) {
        this._w = w;
        this._update();
      }
    }
    set label(label) {
      this._label = label;
    }
    get label() {
      return this._label || this._title;
    }
    get announce() {
      return this.label + ", Button";
    }
    get _Content() {
      return this.tag("Content");
    }
    get _Title() {
      return this.tag("Content.Title");
    }
    get _Icon() {
      return this.tag("Content.Icon");
    }
    get _Stroke() {
      return this.tag("Stroke");
    }
  };
  var Button_default = withStyles(Button, styles);

  // src/ui-components/components/FocusManager/index.js
  var FocusManager = class extends lightningjs_core_default.Component {
    constructor(stage2) {
      super(stage2);
      this.patch({
        Items: {}
      });
      this._direction = this.direction || "row";
    }
    _construct() {
      this._selectedIndex = 0;
    }
    get direction() {
      return this._direction;
    }
    set direction(direction) {
      this._direction = direction;
      let state3 = {
        none: "None",
        column: "Column",
        row: "Row"
      }[direction];
      if (state3) {
        this._setState(state3);
      }
    }
    get Items() {
      return this.tag("Items");
    }
    get items() {
      return this.Items.children;
    }
    set items(items) {
      this.Items.childList.clear();
      this._selectedIndex = 0;
      this.appendItems(items);
    }
    appendItems(items = []) {
      this.Items.childList.a(items);
      this._refocus();
    }
    get selected() {
      return this.Items.children[this.selectedIndex];
    }
    get selectedIndex() {
      return this._selectedIndex;
    }
    set selectedIndex(index) {
      const prevSelected = this.selected;
      if (index !== this._selectedIndex) {
        this._selectedIndex = index;
      }
      this._refocus();
      if (this.selected) {
        this.render(this.selected, prevSelected);
        this.signal("selectedChange", this.selected, prevSelected);
      }
    }
    render() {
    }
    selectPrevious() {
      if (this.selectedIndex > 0) {
        let prevIndex = this.selectedIndex - 1;
        let previous = this.items[prevIndex];
        while (prevIndex && previous.skipFocus) {
          this._selectedIndex = prevIndex;
          this.render(previous, this.items[prevIndex + 1]);
          prevIndex -= 1;
          previous = this.items[prevIndex];
        }
        this.selectedIndex = prevIndex;
        return true;
      } else if (this.wrapSelected) {
        this.selectedIndex = this.Items.children.length - 1;
        return true;
      }
      return false;
    }
    selectNext() {
      if (this.selectedIndex < this.Items.children.length - 1) {
        let nextIndex = this.selectedIndex + 1;
        let next = this.items[nextIndex];
        while (nextIndex < this.items.length - 1 && next.skipFocus) {
          this._selectedIndex = nextIndex;
          this.render(next, this.items[nextIndex - 1]);
          nextIndex += 1;
          next = this.items[nextIndex];
        }
        this.selectedIndex = nextIndex;
        return true;
      } else if (this.wrapSelected) {
        this.selectedIndex = 0;
        return true;
      }
      return false;
    }
    _getFocused() {
      let {
        selected
      } = this;
      if (selected) {
        if (selected.focusRef) {
          return selected.tag(selected.focusRef);
        } else if (selected.cparent) {
          return selected;
        }
      }
      return this;
    }
    static _states() {
      return [class None extends this {
      }, class Row extends this {
        _handleLeft() {
          return this.selectPrevious();
        }
        _handleRight() {
          return this.selectNext();
        }
      }, class Column extends this {
        _handleUp() {
          return this.selectPrevious();
        }
        _handleDown() {
          return this.selectNext();
        }
      }];
    }
  };

  // src/ui-components/components/Column/index.js
  var import_debounce2 = __toModule(require_debounce());
  var Column = class extends FocusManager {
    static _template() {
      return {
        direction: "column"
      };
    }
    _construct() {
      super._construct();
      this._smooth = false;
      this._itemSpacing = 0;
      this._scrollIndex = 0;
      this._whenEnabled = new Promise((resolve) => this._firstEnable = resolve);
      this._h = this.stage.h;
      this.debounceDelay = Number.isInteger(this.debounceDelay) ? this.debounceDelay : 30;
      this._update = (0, import_debounce2.debounce)(this._updateLayout, this.debounceDelay);
      this._updateImmediate = (0, import_debounce2.debounce)(this._updateLayout, this.debounceDelay, true);
    }
    get _itemTransition() {
      return this.itemTransition || {
        duration: 0.4,
        timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)"
      };
    }
    _focus() {
      this.items.forEach((item) => item.parentFocus = true);
    }
    _unfocus() {
      this.items.forEach((item) => item.parentFocus = false);
    }
    selectNext() {
      this._smooth = true;
      return super.selectNext();
    }
    selectPrevious() {
      this._smooth = true;
      return super.selectPrevious();
    }
    shouldScrollUp() {
      let shouldScroll = false;
      if (this._lastScrollIndex) {
        shouldScroll = this.selectedIndex < this._lastScrollIndex;
        if (this._prevLastScrollIndex !== void 0 && this._prevLastScrollIndex !== this._lastScrollIndex) {
          shouldScroll = true;
        }
      } else {
        shouldScroll = this.selectedIndex >= this._scrollIndex;
      }
      return this._itemsY < 0 && shouldScroll;
    }
    shouldScrollDown() {
      const lastChild = this.Items.childList.last;
      return this.selectedIndex > this._scrollIndex && Math.abs(this._itemsY - this.h) < lastChild.y + this.Items.childList.last.h;
    }
    render(next, prev) {
      this._prevLastScrollIndex = this._lastScrollIndex;
      if (this.plinko && prev && (prev.currentItem || prev.selected)) {
        next.selectedIndex = this._getIndexOfItemNear(next, prev);
      }
      if (this.itemsChangeable) {
        return;
      }
      this._performRender();
    }
    _performRender() {
      this._whenEnabled.then(() => {
        const scrollOffset = (this.Items.children[this._scrollIndex] || {
          y: 0
        }).y;
        const firstChild = this.Items.childList.first;
        const lastChild = this.Items.childList.last;
        const shouldScroll = this.alwaysScroll || lastChild && (this.shouldScrollUp() || this.shouldScrollDown());
        if (shouldScroll) {
          const scrollItem = this.selectedIndex > this._lastScrollIndex ? this.Items.children[this._lastScrollIndex - this._scrollIndex] : this.selected;
          if (this._smooth) {
            this.Items.smooth = {
              y: [-(scrollItem || firstChild).transition("y").targetValue + (scrollItem === this.selected ? scrollOffset : 0), this._itemTransition]
            };
          } else {
            this.Items.patch({
              y: -scrollItem.y + (scrollItem === this.selected ? scrollOffset : 0)
            });
          }
        }
        this.onScreenEffect(this.onScreenItems);
      });
    }
    get onScreenItems() {
      return this.Items.children.filter((child) => this._isOnScreen(child));
    }
    _isOnScreen(child) {
      const y = getY(child);
      const {
        h
      } = child;
      const withinLowerBounds = y + h + this._itemsY > 0;
      const withinUpperBounds = y + this._itemsY < this.h;
      return withinLowerBounds && withinUpperBounds;
    }
    _updateLayout() {
      this._whenEnabled.then(() => {
        let nextY = 0;
        let nextW = 0;
        for (let i = 0; i < this.Items.children.length; i++) {
          const child = this.Items.children[i];
          nextW = Math.max(nextW, getW(child));
          if (this._smooth) {
            child.smooth = {
              y: [nextY, this._itemTransition]
            };
          } else {
            child.patch({
              y: nextY
            });
          }
          nextY += child.h;
          if (i < this.Items.children.length - 1) {
            nextY += this.itemSpacing;
          }
          if (child.centerInParent) {
            const childWidth = child.Items && child.Items.w || child.w;
            if (childWidth < this.w) {
              child.x = (this.w - childWidth) / 2;
            }
          }
        }
        this.Items.patch({
          w: nextW,
          h: nextY
        });
        const lastChild = this.Items.childList.last;
        const endOfLastChild = lastChild ? getY(lastChild) + lastChild.h : 0;
        const scrollOffset = (this.Items.children[this._scrollIndex] || {
          y: 0
        }).y;
        if (this.alwaysScroll) {
          this._lastScrollIndex = this.Items.children.length - 1;
        } else if (endOfLastChild > this.h) {
          for (let i = this.Items.children.length - 1; i >= 0; i--) {
            const child = this.Items.children[i];
            const childY = getY(child);
            if (childY + this.h - scrollOffset > endOfLastChild) {
              this._lastScrollIndex = i;
            } else {
              break;
            }
          }
        } else if (this._lastScrollIndex > this.items.length) {
          this._lastScrollIndex = this.items.length - 1;
        }
        this._performRender();
      });
    }
    _getIndexOfItemNear(selected, prev) {
      if (selected.items.length < 2)
        return 0;
      let prevItem = prev.selected || prev.currentItem;
      let prevOffset = prev.transition("x").targetValue || 0;
      let [itemX] = prevItem.core.getAbsoluteCoords(-prevOffset, 0);
      let prevMiddle = itemX + prevItem.w / 2;
      let closest = selected.items[0];
      let closestMiddle = closest.core.getAbsoluteCoords(0, 0)[0] + closest.w / 2;
      for (let i = 1; i < selected.items.length; i++) {
        if (selected.items[i].skipFocus === true) {
          continue;
        }
        const item = selected.items[i];
        const middle = item.core.getAbsoluteCoords(0, 0)[0] + item.w / 2;
        if (Math.abs(middle - prevMiddle) < Math.abs(closestMiddle - prevMiddle)) {
          closest = item;
          closestMiddle = middle;
        } else {
          if (!closest.skipFocus) {
            return selected.items.indexOf(closest);
          } else if (!selected.items[i - 1].skipFocus) {
            return i - 1;
          } else {
            const prevIndex = prev.items.indexOf(prevItem);
            return this._getIndexofClosestFocusable(prevIndex, selected, prevMiddle);
          }
        }
      }
      return selected.items.length - 1;
    }
    _getIndexofClosestFocusable(selectedIndex, selected, prevMiddle) {
      const prevIndex = [...selected.items].slice(0, selectedIndex).map((item) => !!item.skipFocus).lastIndexOf(false);
      const nextIndex = [...selected.items].slice(selectedIndex + 1).map((item) => !!item.skipFocus).indexOf(false) + selectedIndex + 1;
      const prevItem = selected.items[prevIndex];
      const nextItem = selected.items[nextIndex];
      if (prevIndex === -1 || !prevItem) {
        return nextIndex;
      }
      if (nextIndex === -1 || !nextItem) {
        return prevIndex;
      }
      const next = nextItem.core.getAbsoluteCoords(0, 0)[0] + nextItem.w / 2;
      const prev = prevItem.core.getAbsoluteCoords(0, 0)[0] + prevItem.w / 2;
      return Math.abs(prev - prevMiddle) < Math.abs(next - prevMiddle) ? prevIndex : nextIndex;
    }
    get itemSpacing() {
      return this._itemSpacing;
    }
    set itemSpacing(itemSpacing) {
      if (itemSpacing !== this._itemSpacing) {
        this._itemSpacing = itemSpacing;
        this._update();
      }
    }
    get scrollIndex() {
      return this._scrollIndex;
    }
    set scrollIndex(scrollIndex) {
      if (scrollIndex !== this._scrollIndex) {
        this._scrollIndex = scrollIndex;
        this._update();
      }
    }
    get _itemsY() {
      return getY(this.Items);
    }
    appendItems(items = []) {
      let itemWidth = this.renderWidth;
      items.forEach((item) => {
        item.parentFocus = this.hasFocus();
        item = this.Items.childList.a(item);
        item.w = getW(item) || itemWidth;
      });
      this.stage.update();
      this._updateLayout();
      this._update.clear();
      this._refocus();
    }
    scrollTo(index, duration = this._itemTransition.duration * 100) {
      if (duration === 0)
        this.selectedIndex = index;
      for (let i = 0; i !== Math.abs(this.selectedIndex - index); i++) {
        setTimeout(() => {
          this.selectedIndex > index ? this.selectPrevious() : this.selectNext();
        }, duration * i);
      }
      this.Items.transition("y").on("finish", () => this._smooth = false);
    }
    $itemChanged() {
      this.itemsChangeable = true;
      this._updateImmediate();
    }
    $removeItem(item) {
      if (item) {
        let wasSelected = item === this.selected;
        this.Items.childList.remove(item);
        this._updateImmediate();
        if (wasSelected || this.selectedIndex >= this.items.length) {
          this.selectedIndex = this._selectedIndex;
        }
        if (!this.items.length) {
          this.fireAncestors("$columnEmpty");
        }
      }
    }
    $columnChanged() {
      this._updateImmediate();
    }
    onScreenEffect() {
    }
  };

  // src/ui-components/components/MarqueeText/FadeShader.js
  var FadeShader = class extends lightningjs_core_default.shaders.WebGLDefaultShader {
    constructor(context) {
      super(context);
      this._margin = {
        left: 0,
        right: 0
      };
    }
    set positionLeft(v) {
      this._positionLeft = v;
    }
    set positionRight(v) {
      this._positionRight = v;
    }
    setupUniforms(operation) {
      super.setupUniforms(operation);
      const owner = operation.shaderOwner;
      if (this._positionLeft === 0) {
        this._positionLeft = 1e-3;
      }
      if (this._positionRight === 0) {
        this._positionRight = 1e-3;
      }
      const renderPrecision = this.ctx.stage.getRenderPrecision();
      this._setUniform("margin", [this._positionLeft * renderPrecision, this._positionRight * renderPrecision], this.gl.uniform1fv);
      this._setUniform("resolution", new Float32Array([owner._w * renderPrecision, owner._h * renderPrecision]), this.gl.uniform2fv);
    }
  };
  FadeShader.fragmentShaderSource = `
  #ifdef GL_ES
  precision lowp float;
  #endif

  #define PI 3.14159265359

  varying vec2 vTextureCoord;
  varying vec4 vColor;

  uniform sampler2D uSampler;
  uniform vec2 resolution;
  uniform float margin[2];

  void main() {
      vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
      vec2 halfRes = 0.5 * resolution.xy;
      vec2 point = vTextureCoord.xy * resolution;


      vec2 pos1 = vec2(point.x, point.y);
      vec2 pos2 = pos1;
      pos2.x += margin[0];

      vec2 d = pos2 - pos1;
      float t = dot(pos1, d) / dot(d, d);
      t = smoothstep(0.0, 1.0, clamp(t, 0.0, 1.0));

      vec2 pos3 = vec2(vTextureCoord.x * resolution.x, vTextureCoord.y);
      pos3.x -= resolution.x - margin[1];
      vec2 pos4 = vec2(vTextureCoord.x + margin[1], vTextureCoord.y);

      vec2 d2 = pos4 - pos3;
      float t2 = dot(pos3, d2) / dot(d2, d2);
      t2 = smoothstep(0.0, 1.0, clamp(t2, 0.0, 1.0));

      color = mix(vec4(0.0), color, t);
      color = mix(color, vec4(0.0), t2);

      gl_FragColor = color;
  }
`;

  // src/ui-components/components/MarqueeText/index.js
  var MarqueeText = class extends lightningjs_core_default.Component {
    static _template() {
      return {
        TextClipper: {
          boundsMargin: [],
          TextBox: {
            Text: {},
            TextLoopTexture: {}
          }
        }
      };
    }
    get title() {
      return (this._Text && this._Text.text || {}).text;
    }
    set title(text) {
      this.patch({
        TextClipper: {
          w: this.finalW + 14,
          h: text.lineHeight + 10,
          TextBox: {
            Text: {
              rtt: true,
              text: __spreadValues({}, text)
            },
            TextLoopTexture: {}
          }
        }
      });
      this._Text.on("txLoaded", () => {
        if (this.autoStart) {
          this.startScrolling();
        }
      });
      this._Text.loadTexture();
      this._updateShader(this.finalW);
      this._scrolling && this.startScrolling();
    }
    set color(color) {
      this.tag("TextBox.Text").smooth = {
        color
      };
    }
    startScrolling(finalW = this.finalW) {
      if (this._textRenderedW === 0) {
        this._Text.on("txLoaded", () => {
          this.startScrolling();
        });
      }
      if (this._textRenderedW > finalW - this._fadeW) {
        this._scrolling = true;
        this._TextLoopTexture.x = this._textRenderedW + this._offset;
        this._TextLoopTexture.texture = this._Text.getTexture();
        this._updateShader(finalW);
        this._updateAnimation();
        this._scrollAnimation.start();
      } else {
        this._TextClipper.shader = null;
        if (this._Text.text && this._Text.text.textAlign === "center") {
          this._centerText(finalW);
        }
        this._scrolling = false;
      }
    }
    stopScrolling(finalW = this.finalW) {
      this._scrolling = false;
      if (this._scrollAnimation) {
        this._scrollAnimation.stopNow();
        this._TextLoopTexture.texture = null;
      }
      this._updateShader(finalW);
    }
    _updateShader(finalW) {
      this.stage.update();
      this._Text.loadTexture();
      this._TextClipper.patch({
        w: finalW > 0 ? finalW + this._fadeW / 2 : 0,
        shader: {
          type: FadeShader,
          positionLeft: 0,
          positionRight: this._fadeW
        },
        rtt: true
      });
    }
    _updateAnimation() {
      this._scrollAnimation && this._scrollAnimation.stopNow();
      this._scrollAnimation = this.animation({
        duration: this._textRenderedW / 50,
        delay: isNaN(this.delay) ? 1.5 : this.delay,
        repeat: isNaN(this.repeat) ? -1 : this.repeat,
        actions: [{
          t: "TextBox",
          p: "x",
          v: {
            sm: 0,
            0: {
              v: 0
            },
            0.5: {
              v: -(this._textRenderedW + this._offset)
            }
          }
        }, {
          t: "TextClipper",
          p: "shader.positionLeft",
          v: {
            sm: 0,
            0: {
              v: 0
            },
            0.1: {
              v: this._fadeW
            },
            0.4: {
              v: this._fadeW
            },
            0.5: {
              v: 0
            }
          }
        }]
      });
    }
    _centerText(finalW) {
      this._TextBox.x = ((finalW || this.finalW) - this._textRenderedW) / 2;
    }
    get _TextClipper() {
      return this.tag("TextClipper");
    }
    get _TextBox() {
      return this.tag("TextBox");
    }
    get _Text() {
      return this.tag("Text");
    }
    get _TextLoopTexture() {
      return this.tag("TextLoopTexture");
    }
    get _offset() {
      return 32;
    }
    get _fadeW() {
      return 30;
    }
    get _textRenderedW() {
      return this._Text.renderWidth;
    }
  };

  // src/ui-components/components/Row/index.js
  var import_debounce3 = __toModule(require_debounce());
  var Row = class extends FocusManager {
    static _template() {
      return {
        direction: "row"
      };
    }
    _construct() {
      super._construct();
      this._smooth = false;
      this._itemSpacing = 0;
      this._scrollIndex = 0;
      this._whenEnabled = new Promise((resolve) => this._firstEnable = resolve);
      this._w = this.stage.w;
      this.debounceDelay = Number.isInteger(this.debounceDelay) ? this.debounceDelay : 1;
      this._update = (0, import_debounce3.debounce)(this._updateLayout, this.debounceDelay);
    }
    get _itemTransition() {
      return this.itemTransition || {
        duration: 0.4,
        timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)"
      };
    }
    _focus() {
      this.items.forEach((item) => item.parentFocus = true);
    }
    _unfocus() {
      this.items.forEach((item) => item.parentFocus = false);
    }
    selectNext() {
      this._smooth = true;
      return super.selectNext();
    }
    selectPrevious() {
      this._smooth = true;
      return super.selectPrevious();
    }
    shouldScrollLeft() {
      let shouldScroll = false;
      if (this._lastScrollIndex) {
        shouldScroll = this.selectedIndex < this._lastScrollIndex;
        if (this._prevLastScrollIndex !== void 0 && this._prevLastScrollIndex !== this._lastScrollIndex) {
          shouldScroll = true;
        }
      } else {
        shouldScroll = this.selectedIndex >= this._scrollIndex;
      }
      return this._itemsX < 0 && shouldScroll;
    }
    shouldScrollRight() {
      const lastChild = this.Items.childList.last;
      return this.selectedIndex > this._scrollIndex && Math.abs(this._itemsX - this.w) < lastChild.x + this.Items.childList.last.w;
    }
    get onScreenItems() {
      return this.Items.children.filter((child) => this._isOnScreen(child));
    }
    _isOnScreen(child) {
      const x = getX(child);
      const {
        w
      } = child;
      const withinLowerBounds = x + w + this._itemsX > 0;
      const withinUpperBounds = x + this._itemsX < this.w;
      return withinLowerBounds && withinUpperBounds;
    }
    _isOnScreenCompletely(child) {
      let itemX = child.core.renderContext.px;
      let rowX = this.core.renderContext.px;
      return itemX >= rowX && itemX + child.w <= rowX + this.w;
    }
    _shouldScroll() {
      const lastChild = this.Items.childList.last;
      let shouldScroll = this.alwaysScroll;
      if (!shouldScroll) {
        if (this.lazyScroll) {
          shouldScroll = !this._isOnScreenCompletely(this.selected);
        } else {
          shouldScroll = lastChild && (this.shouldScrollLeft() || this.shouldScrollRight() || !this._isOnScreenCompletely(this.selected));
        }
      }
      return shouldScroll;
    }
    _getLazyScrollX(prev) {
      let itemsContainerX;
      const prevIndex = this.Items.childList.getIndex(prev);
      if (prevIndex > this.selectedIndex) {
        itemsContainerX = -this.selected.x;
      } else if (prevIndex < this.selectedIndex) {
        itemsContainerX = this.w - this.selected.x - this.selected.w;
      }
      return itemsContainerX;
    }
    _getScrollX() {
      let itemsContainerX;
      let itemIndex = this.selectedIndex - this.scrollIndex;
      itemIndex = itemIndex < 0 ? 0 : itemIndex;
      if (this.Items.children[itemIndex]) {
        itemsContainerX = this.Items.children[itemIndex].transition("x") ? -this.Items.children[itemIndex].transition("x").targetValue : -this.Items.children[itemIndex].x;
      }
      return itemsContainerX;
    }
    render(next, prev) {
      this._whenEnabled.then(() => {
        this._prevLastScrollIndex = this._lastScrollIndex;
        if (this._shouldScroll()) {
          const itemsContainerX = this.lazyScroll && prev ? this._getLazyScrollX(prev) : this._getScrollX();
          if (itemsContainerX !== void 0) {
            if (this._smooth) {
              this.Items.smooth = {
                x: [itemsContainerX, this._itemTransition]
              };
            } else {
              this.Items.x = itemsContainerX;
            }
          }
        }
        this.onScreenEffect(this.onScreenItems);
      });
    }
    _updateLayout() {
      let nextX = 0;
      let nextH = 0;
      for (let i = 0; i < this.Items.children.length; i++) {
        const child = this.Items.children[i];
        nextH = Math.max(nextH, getH(child));
        if (this._smooth) {
          child.smooth = {
            x: [nextX, this._itemTransition]
          };
        } else {
          child.patch({
            x: nextX
          });
        }
        nextX += child.w;
        if (i < this.Items.children.length - 1) {
          nextX += this.itemSpacing;
        }
        if (child.centerInParent) {
          const childHeight = child.Items && child.Items.h || child.h;
          if (childHeight < this.h) {
            child.y = (this.h - childHeight) / 2;
          }
        }
      }
      this.Items.patch({
        h: nextH,
        w: nextX
      });
      const lastChild = this.Items.childList.last;
      const endOfLastChild = lastChild ? getX(lastChild) + lastChild.w : 0;
      const scrollOffset = (this.Items.children[this._scrollIndex] || {
        x: 0
      }).x;
      if (this.alwaysScroll) {
        this._lastScrollIndex = this.Items.children.length - 1;
      } else if (endOfLastChild > this.w) {
        for (let i = this.Items.children.length - 1; i >= 0; i--) {
          const child = this.Items.children[i];
          const childX = getX(child);
          if (childX + this.w - scrollOffset > endOfLastChild) {
            this._lastScrollIndex = i;
          } else {
            break;
          }
        }
      }
      this.fireAncestors("$itemChanged");
      this.render(this.selected, null);
    }
    get itemSpacing() {
      return this._itemSpacing;
    }
    set itemSpacing(itemSpacing) {
      if (itemSpacing !== this._itemSpacing) {
        this._itemSpacing = itemSpacing;
        this._update();
      }
    }
    get scrollIndex() {
      return this._scrollIndex;
    }
    set scrollIndex(scrollIndex) {
      if (scrollIndex !== this._scrollIndex) {
        this._scrollIndex = scrollIndex;
        this._update();
      }
    }
    get _itemsX() {
      return getX(this.Items);
    }
    appendItems(items = []) {
      let itemHeight = this.renderHeight;
      items.forEach((item) => {
        item.parentFocus = this.hasFocus();
        item = this.Items.childList.a(item);
        item.h = item.h || itemHeight;
      });
      this.stage.update();
      this._updateLayout();
      this._update.clear();
      this._refocus();
    }
    $itemChanged() {
      this._update();
    }
    onScreenEffect() {
    }
  };

  // src/ui-components/components/Keyboard/Key.js
  var KEY_DIMENSIONS = {
    h: 90,
    w: 109,
    padding: 0,
    fixed: true
  };
  var isUpperCase = (string) => /^[A-Z]$/.test(string);
  var Key = class extends Button_default {
    static _template() {
      return __spreadValues(__spreadValues({}, super._template()), KEY_DIMENSIONS);
    }
    set config(config7) {
      if (config7) {
        this.sizes = config7.sizes;
      }
    }
    set icon(src) {
      if (src) {
        this._Icon.patch({
          color: 4294967295,
          size: 32,
          spacing: 16,
          src
        });
      }
    }
    set size(size) {
      this.w = this._sizes[size] || this.h;
    }
    set char(char) {
      this.title = char;
    }
    set announce(value) {
      this._announce = value;
    }
    get announce() {
      if (this._announce) {
        return this._announce;
      }
      if (isUpperCase(this.title)) {
        return `Capital ${this.title}, button`;
      }
      return this.title + ", button";
    }
    set label(label) {
      this.title = label;
    }
    get _sizes() {
      return this.styles.sizes ? __spreadValues(__spreadValues({}, this.styles.sizes), this.sizes) : __spreadValues({
        small: 50,
        medium: 110,
        large: 273,
        xlarge: 718
      }, this.sizes);
    }
    _handleEnter() {
      if (this.toggle) {
        this.fireAncestors("$toggleKeyboard", this.toggle);
      }
      this.fireAncestors("$onSoftKey", {
        key: this.title
      });
    }
  };

  // src/ui-components/components/Keyboard/index.js
  var Keyboard = class extends lightningjs_core_default.Component {
    _construct() {
      this._whenEnabled = new Promise((resolve) => this._firstEnable = resolve);
    }
    get announce() {
      return "Keyboard" + (this.title ? `, ${this.title}` : "");
    }
    get announceContext() {
      return ["PAUSE-2", "Use arrow keys to choose characters, press center to select"];
    }
    set formats(formats = {}) {
      this._formats = formats;
      this._currentFormat = this._defaultFormat;
      this._whenEnabled.then(() => {
        Object.entries(formats).forEach(([key, value]) => {
          let keyboardData = this._formatKeyboardData(value);
          this._createKeyboard(key, this._createRows(keyboardData));
        });
        this.tag(this._currentFormat).alpha = 1;
        this._refocus();
      });
    }
    _createKeyboard(key, rows = []) {
      key = key.charAt(0).toUpperCase() + key.slice(1);
      if (rows.length === 1) {
        this.patch({
          [key]: __spreadProps(__spreadValues({}, rows[0]), {
            alpha: 0
          })
        });
      } else {
        this.patch({
          [key]: {
            type: Column,
            alpha: 0,
            plinko: true,
            itemSpacing: this._spacing,
            items: rows
          }
        });
      }
    }
    _createRows(rows = []) {
      return rows.map((keys) => {
        let h = this.keysConfig && this.keysConfig.h || KEY_DIMENSIONS.h;
        return {
          type: Row,
          h,
          wrapSelected: this.rowWrap === void 0 ? true : this.rowWrap,
          itemSpacing: this._spacing,
          items: this._createKeys(keys)
        };
      });
    }
    _createKeys(keys = []) {
      return keys.map((keyProps) => {
        const key = {
          type: this.keyComponent || Key,
          config: this.keysConfig
        };
        if (!keyProps) {
          return __spreadProps(__spreadValues({}, KEY_DIMENSIONS), {
            skipFocus: true
          });
        } else if (typeof keyProps === "object") {
          return __spreadValues(__spreadValues({}, key), keyProps);
        }
        return __spreadProps(__spreadValues({}, key), {
          label: keyProps
        });
      });
    }
    _formatKeyboardData(data = []) {
      if (Array.isArray(data) && data.length) {
        if (!Array.isArray(data[0]) && !this.inline) {
          let keyRows = [], idx, counter2;
          for (idx = 0, counter2 = -1; idx < data.length; idx++) {
            if (idx % this.columnCount === 0) {
              counter2++;
              keyRows[counter2] = [];
            }
            keyRows[counter2].push(data[idx]);
          }
          return keyRows;
        } else if (this.inline) {
          return [data];
        }
        return data;
      }
    }
    $toggleKeyboard(keyboardFormat) {
      keyboardFormat = keyboardFormat.charAt(0).toUpperCase() + keyboardFormat.slice(1);
      if (keyboardFormat !== this._currentFormat) {
        this.selectKeyOn(this.tag(keyboardFormat));
        this.tag(this._currentFormat).alpha = 0;
        this.tag(keyboardFormat).alpha = 1;
        this._currentFormat = keyboardFormat;
      }
    }
    selectKeyOn(keyboard, {
      row,
      column
    } = this.getSelectedKey()) {
      let type = keyboard.constructor.name;
      if (type === "Row") {
        keyboard.selectedIndex = column;
      } else {
        keyboard.selectedIndex = row;
        keyboard.Items.children[row].selectedIndex = column;
      }
    }
    getSelectedKey() {
      let row, column;
      let keyboard = this.tag(this._currentFormat);
      let type = keyboard.constructor.name;
      if (type === "Row") {
        row = 0;
        column = keyboard.selectedIndex;
      } else {
        row = keyboard.selectedIndex;
        column = keyboard.Items.children[row].selectedIndex;
      }
      return {
        row,
        column
      };
    }
    _getFocused() {
      return this.tag(this._currentFormat) || this;
    }
    _focus() {
      this.fireAncestors("$keyboardFocused", true);
    }
    _unfocus() {
      this.tag(this._currentFormat).alpha = 0;
      this._currentFormat = this._defaultFormat;
      this.tag(this._currentFormat).alpha = 1;
      this._refocus();
      this.fireAncestors("$keyboardFocused", false);
    }
    set columnCount(columnCount) {
      this._columnCount = columnCount;
    }
    set rowCount(rowCount) {
      this._rowCount = rowCount;
    }
    get columnCount() {
      if (this._columnCount)
        return this._columnCount;
      if (this._rowCount)
        return this._formats[this._defaultFormat.toLowerCase()].length / this._rowCount;
      if (this.inline)
        return this._formats[this._defaultFormat.toLowerCase()].length;
      else
        return 11;
    }
    get _spacing() {
      return this.spacing || 8;
    }
    get _defaultFormat() {
      let defaultFormat = this.defaultFormat || Object.keys(this._formats)[0];
      return defaultFormat.charAt(0).toUpperCase() + defaultFormat.slice(1);
    }
  };
  var KEYBOARD_FORMATS = {
    fullscreen: {
      letters: [["", "", "", "", "", "", "", "", "", {
        label: "#@!",
        size: "large",
        toggle: "symbols",
        announce: "symbol mode, button"
      }, {
        label: "Space",
        size: "large"
      }, {
        label: "Delete",
        size: "large"
      }, "", "", "", "", "", "", "", "", ""], ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]],
      symbols: [["", "", "", "", "", "", "", "", "", {
        label: "ABC",
        size: "large",
        toggle: "letters",
        announce: "caps on, button"
      }, {
        label: "Space",
        size: "large"
      }, {
        label: "Delete",
        size: "large"
      }, "", "", "", "", "", "", "", "", ""], ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
        label: "!",
        announce: "exclamation, button"
      }, "@", "#", "$", "%", {
        label: "^",
        announce: "caret circumflex, button"
      }, "&", "*", {
        label: "(",
        announce: "open parenthesis, button"
      }, {
        label: ")",
        announce: "close parenthesis, button"
      }, {
        label: "`",
        announce: "grave accent, button"
      }, "~", "_", ".", "-", "+"]]
    },
    qwerty: {
      uppercase: [["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
        label: "Clear",
        size: "medium"
      }], ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", {
        label: "#@!",
        size: "medium",
        toggle: "symbols",
        announce: "symbol mode, button"
      }], ["A", "S", "D", "F", "G", "H", "J", "K", "L", "@", {
        label: "\xE1\xF6\xFB",
        size: "medium",
        toggle: "accents",
        announce: "accents, button"
      }], ["Z", "X", "C", "V", "B", "N", "M", {
        label: "_",
        announce: "underscore, button"
      }, {
        label: ".",
        announce: "period, button"
      }, {
        label: "-",
        announce: "dash, button"
      }, {
        label: "shift",
        size: "medium",
        toggle: "lowercase",
        announce: "shift off, button"
      }], [{
        label: "Delete",
        size: "large"
      }, {
        label: "Space",
        size: "xlarge"
      }, {
        label: "Done",
        size: "large"
      }]],
      lowercase: [["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
        label: "Clear",
        size: "medium"
      }], ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", {
        label: "#@!",
        size: "medium",
        toggle: "symbols",
        announce: "symbol mode, button"
      }], ["a", "s", "d", "f", "g", "h", "j", "k", "l", "@", {
        label: "\xE1\xF6\xFB",
        size: "medium",
        toggle: "accents",
        announce: "accents, button"
      }], ["z", "x", "c", "v", "b", "n", "m", {
        label: "_",
        announce: "underscore, button"
      }, {
        label: ".",
        announce: "period, button"
      }, {
        label: "-",
        announce: "dash, button"
      }, {
        label: "shift",
        size: "medium",
        toggle: "uppercase",
        announce: "shift on, button"
      }], [{
        label: "Delete",
        size: "large"
      }, {
        label: "Space",
        size: "xlarge"
      }, {
        label: "Done",
        size: "large"
      }]],
      accents: [["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
        label: "Clear",
        size: "medium"
      }], ["\xE4", "\xEB", "\xEF", "\xF6", "\xFC", "\xFF", "\xE0", "\xE8", "\xEC", "\xF2", {
        label: "#@!",
        size: "medium",
        toggle: "symbols",
        announce: "symbol mode, button"
      }], ["\xF9", "\xE1", "\xE9", "\xED", "\xF3", "\xFA", "\xFD", "\xE2", "\xEA", "\xEE", {
        label: "abc",
        size: "medium",
        toggle: "lowercase",
        announce: "alpha mode, button"
      }], ["", "", "", "\xF4", "\xFB", "\xE3", "\xF1", "", "", "", {
        label: "shift",
        size: "medium",
        toggle: "accentsUpper",
        announce: "shift off, button"
      }], [{
        label: "Delete",
        size: "large"
      }, {
        label: "Space",
        size: "xlarge"
      }, {
        label: "Done",
        size: "large"
      }]],
      accentsUpper: [["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
        label: "Clear",
        size: "medium"
      }], ["\xC4", "\xCB", "\xCF", "\xD6", "\xDC", "\u0178", "\xC0", "\xC8", "\xCC", "\xD2", {
        label: "#@!",
        size: "medium",
        toggle: "symbols",
        announce: "symbol mode, button"
      }], ["\xD9", "\xC1", "\xC9", "\xCD", "\xD3", "\xDA", "\xDD", "\xC2", "\xCA", "\xCE", {
        label: "abc",
        size: "medium",
        toggle: "lowercase",
        announce: "alpha mode, button"
      }], ["", "", "", "\xD4", "\xDB", "\xC3", "\xD1", "", "", "", {
        label: "shift",
        size: "medium",
        toggle: "accents",
        announce: "shift off, button"
      }], [{
        label: "Delete",
        size: "large"
      }, {
        label: "Space",
        size: "xlarge"
      }, {
        label: "Done",
        size: "large"
      }]],
      symbols: [["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", {
        label: "Clear",
        size: "medium"
      }], [{
        label: "!",
        announce: "exclamation, button"
      }, "@", "#", "$", "%", {
        label: "^",
        announce: "caret circumflex, button"
      }, "&", "*", {
        label: "(",
        announce: "open parenthesis, button"
      }, {
        label: ")",
        announce: "close parenthesis, button"
      }, {
        label: "abc",
        size: "medium",
        toggle: "lowercase",
        announce: "alpha mode, button"
      }], [{
        label: "{",
        announce: "open brace, button"
      }, {
        label: "}",
        announce: "close brace, button"
      }, {
        label: "[",
        announce: "open bracket, button"
      }, {
        label: "]",
        announce: "close bracket, button"
      }, {
        label: ";",
        announce: "semicolon, button"
      }, {
        label: '"',
        announce: "doublequote, button"
      }, {
        label: "'",
        announce: "singlequote, button"
      }, {
        label: "|",
        announce: "vertical bar, button"
      }, {
        label: "\\",
        announce: "backslash, button"
      }, {
        label: "/",
        announce: "forwardslash, button"
      }, {
        label: "\xE1\xF6\xFB",
        size: "medium",
        toggle: "accents",
        announce: "accents, button"
      }], [{
        label: "<",
        announce: "less than, button"
      }, {
        label: ">",
        announce: "greater than, button"
      }, {
        label: "?",
        announce: "question mark, button"
      }, {
        label: "=",
        announce: "equals, button"
      }, {
        label: "`",
        announce: "grave accent, button"
      }, {
        label: "~",
        announce: "tilde, button"
      }, {
        label: "_",
        announce: "underscore, button"
      }, {
        label: ".",
        announce: "period, button"
      }, {
        label: "-",
        announce: "dash, button"
      }, {
        label: "+",
        announce: "plus sign, button"
      }], [{
        label: "Delete",
        size: "large"
      }, {
        label: "Space",
        size: "xlarge"
      }, {
        label: "Done",
        size: "large"
      }]]
    },
    numbers: {
      numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      dialpad: [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["", "0", ""]],
      dialpadExtended: [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["", "0", ""], [{
        label: "Delete",
        size: "large"
      }]]
    }
  };

  // src/api/WifiApi.js
  var WiFiState = {
    UNINSTALLED: 0,
    DISABLED: 1,
    DISCONNECTED: 2,
    PAIRING: 3,
    CONNECTING: 4,
    CONNECTED: 5,
    FAILED: 6
  };
  var Wifi = class {
    constructor() {
      this._events = new Map();
      const config7 = {
        host: "127.0.0.1",
        port: 9998
      };
      this._thunder = thunderJS_default(config7);
      this.callsign = "org.rdk.Wifi";
    }
    activate() {
      return new Promise((resolve, reject) => {
        this._thunder.call("Controller", "activate", {
          callsign: this.callsign
        }).then((result) => {
          this.getCurrentState().then((state3) => {
            if (state3 === WiFiState.DISABLED) {
              this.setEnabled(true);
            }
            if (state3 === WiFiState.CONNECTED) {
              this.setInterface("WIFI", true).then((res) => {
                if (res.success) {
                  this.setDefaultInterface("WIFI", true);
                }
              });
            }
          });
          this._thunder.on(this.callsign, "onWIFIStateChanged", (notification) => {
            if (this._events.has("onWIFIStateChanged")) {
              this._events.get("onWIFIStateChanged")(notification);
            }
          });
          this._thunder.on(this.callsign, "onError", (notification) => {
            if (this._events.has("onError")) {
              this._events.get("onError")(notification);
            }
          });
          this._thunder.on(this.callsign, "onAvailableSSIDs", (notification) => {
            if (notification.moreData === false) {
              this.stopScan();
              notification.ssids = notification.ssids.filter((item, pos) => notification.ssids.findIndex((e) => e.ssid === item.ssid) === pos);
              if (this._events.has("onAvailableSSIDs")) {
                this._events.get("onAvailableSSIDs")(notification);
              }
            }
          });
          resolve(result);
        }).catch((err) => {
          console.error(`Wifi activation failed: ${err}`);
          reject(err);
        });
      });
    }
    registerEvent(eventId, callback) {
      this._events.set(eventId, callback);
    }
    deactivate() {
      this._events = new Map();
    }
    getConnectedSSID() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "getConnectedSSID").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error(`getConnectedSSID fail: ${err}`);
          reject(err);
        });
      });
    }
    discoverSSIDs() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "startScan", {
          incremental: true,
          ssid: "",
          frequency: ""
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error(`startScan fail: ${err}`);
          reject(err);
        });
      });
    }
    stopScan() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "stopScan").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error(`stopScan fail: ${err}`);
          reject(err);
        });
      });
    }
    connect(device, passphrase) {
      return new Promise((resolve, reject) => {
        this.disconnect().then(() => {
          console.log(`connect SSID ${device.ssid}`);
          this._thunder.call(this.callsign, "connect", {
            ssid: device.ssid,
            passphrase,
            securityMode: device.security
          }).then((result) => {
            console.log(`connected SSID ${device.ssid}`);
            this.setInterface("WIFI", true).then((res) => {
              if (res.success) {
                this.setDefaultInterface("WIFI", true);
              }
            });
            resolve(result);
          }).catch((err) => {
            console.error(`Connection failed: ${err}`);
            reject(err);
          });
        });
      });
    }
    disconnect() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "disconnect").then((result) => {
          console.log("WiFi disconnected: " + JSON.stringify(result));
          this.setInterface("ETHERNET", true).then((res) => {
            if (res.success) {
              this.setDefaultInterface("ETHERNET", true);
            }
          });
          resolve(result);
        }).catch((err) => {
          console.error(`Can't disconnect WiFi: ${err}`);
          reject(false);
        });
      });
    }
    getCurrentState() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "getCurrentState").then((result) => {
          console.log(`WiFi state: ${result.state}`);
          resolve(result.state);
        }).catch((err) => {
          console.error(`Can't get WiFi state: ${err}`);
          reject(err);
        });
      });
    }
    setEnabled(bool) {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "setEnabled", {
          enable: bool
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          reject(err);
        });
      });
    }
    getPaired() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, "getPairedSSID", {}).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error(`Can't get paired: ${err}`);
          reject(err);
        });
      });
    }
    getDefaultInterface() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Network", "getDefaultInterface", {}).then((result) => {
          resolve(result);
        }).catch((err) => {
          reject(err);
        });
      });
    }
    getInterfaces() {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Network", "getInterfaces").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.log("Failed to get Interfaces");
        });
      });
    }
    setInterface(inter, bool) {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Network", "setInterfaceEnabled", {
          interface: inter,
          persist: true,
          enabled: bool
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error("SetInterface Error", JSON.stringify(err));
        });
      });
    }
    setDefaultInterface(interfaceName, bool) {
      return new Promise((resolve, reject) => {
        this._thunder.call("org.rdk.Network", "setDefaultInterface", {
          interface: interfaceName,
          persist: bool
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error("SetDefaultInterface Error", JSON.stringify(err));
        });
      });
    }
  };

  // src/screens/JoinAnotherNetworkComponent.js
  var wifi = new Wifi();
  var JoinAnotherNetworkComponent = class extends Lightning_default.Component {
    pageTransition() {
      return "left";
    }
    handleDone() {
      var securityCode = this.securityCodes[this.securityCodeIndex].value;
      if (!this.textCollection["EnterSSID"]) {
        this._setState("EnterSSID");
      } else if (securityCode < 0 || securityCode > 14) {
        this._setState("EnterSecurity");
      } else if (securityCode !== 0 && !this.textCollection["EnterPassword"]) {
        this._setState("EnterPassword");
      } else {
        if (this.textCollection["EnterSecurity"] === "0") {
          this.textCollection["EnterPassword"] = "";
          this.tag("Pwd").text.text = "";
        }
        var self = this;
        this.startConnectForAnotherNetwork({
          ssid: self.textCollection["EnterSSID"],
          security: securityCode
        }, self.textCollection["EnterPassword"]);
      }
    }
    startConnectForAnotherNetwork(device, passphrase) {
      wifi.connect({
        ssid: device.ssid,
        security: device.security
      }, passphrase);
      Router_default.back();
    }
    static _template() {
      return {
        Background: {
          w: 1920,
          h: 1080,
          rect: true,
          color: 4278190080
        },
        Text: {
          x: 758,
          y: 70,
          text: {
            text: "Find and join a WiFi network",
            fontFace: CONFIG.language.font,
            fontSize: 35,
            textColor: CONFIG.theme.hex
          }
        },
        BorderTop: {
          x: 190,
          y: 130,
          w: 1488,
          h: 2,
          rect: true
        },
        Network: {
          x: 190,
          y: 176,
          text: {
            text: "Network Name: ",
            fontFace: CONFIG.language.font,
            fontSize: 25
          }
        },
        NetworkBox: {
          x: 400,
          y: 160,
          texture: Lightning_default.Tools.getRoundRect(1273, 58, 0, 3, 4294967295, false)
        },
        NetworkText: {
          x: 420,
          y: 170,
          zIndex: 2,
          text: {
            text: "",
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 4294967295,
            wordWrapWidth: 1300,
            wordWrap: false,
            textOverflow: "ellipsis"
          }
        },
        NetworkType: {
          x: 190,
          y: 246,
          text: {
            text: "Security: ",
            fontFace: CONFIG.language.font,
            fontSize: 25
          }
        },
        TypeBox: {
          x: 400,
          y: 230,
          texture: Lightning_default.Tools.getRoundRect(1273, 58, 0, 3, 4294967295, false),
          ArrowForward: {
            h: 30,
            w: 45,
            y: 15,
            x: 1220,
            src: Utils_default.asset("images/settings/Arrow.png")
          },
          ArrowBackward: {
            h: 30,
            w: 45,
            x: 10,
            scaleX: -1,
            y: 15,
            src: Utils_default.asset("images/settings/Arrow.png")
          }
        },
        TypeText: {
          x: 470,
          y: 263,
          mountY: 0.5,
          zIndex: 2,
          text: {
            text: "",
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 4294967295,
            wordWrapWidth: 1300,
            wordWrap: false,
            textOverflow: "ellipsis"
          }
        },
        Password: {
          x: 190,
          y: 316,
          text: {
            text: "Password:",
            fontFace: CONFIG.language.font,
            fontSize: 25
          }
        },
        PasswordBox: {
          x: 400,
          y: 300,
          texture: Lightning_default.Tools.getRoundRect(1273, 58, 0, 3, 4294967295, false)
        },
        Pwd: {
          x: 420,
          y: 310,
          zIndex: 2,
          text: {
            text: "",
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 4294967295,
            wordWrapWidth: 1300,
            wordWrap: false,
            textOverflow: "ellipsis"
          }
        },
        BorderBottom: {
          x: 190,
          y: 396,
          w: 1488,
          h: 2,
          rect: true
        },
        Keyboard: {
          y: 437,
          x: 400,
          type: Keyboard,
          visible: true,
          zIndex: 2,
          formats: KEYBOARD_FORMATS.qwerty
        }
      };
    }
    _focus() {
      this._setState("EnterSSID");
      this.textCollection = {
        "EnterSSID": "",
        "EnterPassword": "",
        "EnterSecurity": ""
      };
      this.tag("Pwd").text.text = "";
      this.tag("NetworkText").text.text = "";
      this.tag("TypeText").text.text = this.securityCodes[this.securityCodeIndex].name;
      if (this.securityCodes[this.securityCodeIndex].value === 0) {
        this.pwdUnReachable = true;
        this.tag("PasswordBox").alpha = 0.5;
        this.tag("Password").alpha = 0.5;
      } else {
        this.pwdUnReachable = false;
        this.tag("PasswordBox").alpha = 1;
        this.tag("Password").alpha = 1;
      }
    }
    _handleBack() {
      Router_default.back();
    }
    static _states() {
      return [class EnterSSID extends this {
        $enter() {
          this.tag("NetworkBox").texture = Lightning_default.Tools.getRoundRect(1273, 58, 0, 3, CONFIG.theme.hex, false);
        }
        _handleDown() {
          this._setState("EnterSecurity");
        }
        _handleEnter() {
          this._setState("Keyboard");
        }
        $exit() {
          this.tag("NetworkBox").texture = Lightning_default.Tools.getRoundRect(1273, 58, 0, 3, 4294967295, false);
        }
      }, class EnterSecurity extends this {
        $enter() {
          this.tag("TypeBox").texture = Lightning_default.Tools.getRoundRect(1273, 58, 0, 3, CONFIG.theme.hex, false);
        }
        _handleUp() {
          this._setState("EnterSSID");
        }
        isPasswordUnReachable(secCode) {
          if (secCode === 0) {
            this.tag("PasswordBox").alpha = 0.5;
            this.tag("Password").alpha = 0.5;
            return true;
          } else {
            this.tag("PasswordBox").alpha = 1;
            this.tag("Password").alpha = 1;
            return false;
          }
        }
        _handleLeft() {
          this.securityCodeIndex = (15 + --this.securityCodeIndex) % 15;
          this.pwdUnReachable = this.isPasswordUnReachable(this.securityCodeIndex);
          this.tag("TypeText").text.text = this.securityCodes[this.securityCodeIndex].name;
        }
        _handleEnter() {
          this.handleDone();
        }
        _handleRight() {
          this.securityCodeIndex = (15 + ++this.securityCodeIndex) % 15;
          this.pwdUnReachable = this.isPasswordUnReachable(this.securityCodeIndex);
          this.tag("TypeText").text.text = this.securityCodes[this.securityCodeIndex].name;
        }
        _handleDown() {
          if (!this.pwdUnReachable) {
            this._setState("EnterPassword");
          }
        }
        $exit() {
          this.tag("TypeBox").texture = Lightning_default.Tools.getRoundRect(1273, 58, 0, 3, 4294967295, false);
        }
      }, class EnterPassword extends this {
        $enter() {
          if (this.pwdUnReachable) {
            this._setState("EnterSecurity");
          }
          this.tag("PasswordBox").texture = Lightning_default.Tools.getRoundRect(1273, 58, 0, 3, CONFIG.theme.hex, false);
        }
        _handleUp() {
          this._setState("EnterSecurity");
        }
        _handleDown() {
          this._setState("EnterSSID");
        }
        _handleEnter() {
          this._setState("Keyboard");
        }
        $exit() {
          this.tag("PasswordBox").texture = Lightning_default.Tools.getRoundRect(1273, 58, 0, 3, 4294967295, false);
        }
      }, class Keyboard extends this {
        $enter(state3) {
          this.prevState = state3.prevState;
          if (this.prevState === "EnterSSID") {
            this.element = "NetworkText";
          }
          if (this.prevState === "EnterPassword") {
            this.element = "Pwd";
          }
          if (this.prevState === "EnterSecurity") {
            this.element = "TypeText";
          }
        }
        _getFocused() {
          return this.tag("Keyboard");
        }
        $onSoftKey({
          key
        }) {
          if (key === "Done") {
            this.handleDone();
          } else if (key === "Clear") {
            this.textCollection[this.prevState] = this.textCollection[this.prevState].substring(0, this.textCollection[this.prevState].length - 1);
            this.tag(this.element).text.text = this.textCollection[this.prevState];
          } else if (key === "#@!" || key === "abc" || key === "\xE1\xF6\xFB" || key === "shift") {
            console.log("no saving");
          } else if (key === "Space") {
            this.textCollection[this.prevState] += " ";
            this.tag(this.element).text.text = this.textCollection[this.prevState];
          } else if (key === "Delete") {
            this.textCollection[this.prevState] = "";
            this.tag(this.element).text.text = this.textCollection[this.prevState];
          } else {
            this.textCollection[this.prevState] += key;
            this.tag(this.element).text.text = this.textCollection[this.prevState];
          }
        }
        _handleBack() {
          this._setState(this.prevState);
        }
      }];
    }
    _init() {
      this.securityCodeIndex = 0;
      this.pwdUnReachable = true;
      this.textCollection = {
        "EnterSSID": "",
        "EnterPassword": "",
        "EnterSecurity": "0"
      };
      this.securityCodes = [{
        name: "Open/None (Unsecure)",
        value: 0
      }, {
        name: "WEP - Deprecated, not needed",
        value: 1
      }, {
        name: "WEP",
        value: 2
      }, {
        name: "WPA Personal TKIP",
        value: 3
      }, {
        name: "WPA Personal AES",
        value: 4
      }, {
        name: "WPA2 Personal TKIP",
        value: 5
      }, {
        name: "WPA2 Personal AES",
        value: 6
      }, {
        name: "WPA Enterprise TKIP",
        value: 7
      }, {
        name: "WPA Enterprise AES",
        value: 8
      }, {
        name: "WPA2 Enterprise TKIP",
        value: 9
      }, {
        name: "WPA2 Enterprise AES",
        value: 10
      }, {
        name: "Mixed Personal",
        value: 11
      }, {
        name: "Mixed Enterprise",
        value: 12
      }, {
        name: "WPA3 Personal AES",
        value: 13
      }, {
        name: "WPA3 Personal SAE",
        value: 14
      }];
      this.tag("Pwd").text.text = this.textCollection["EnterPassword"];
      this.tag("NetworkText").text.text = this.textCollection["EnterSSID"];
    }
  };

  // src/screens/OtherSettingsScreens/NetworkConfigurationScreen.js
  var NetworkConfigurationScreen = class extends Lightning_default.Component {
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        NetworkConfigurationScreenContents: {
          x: 200,
          y: 275,
          NetworkInfo: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Network Info"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          NetworkInterface: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Network Interface: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          TestInternetAccess: {
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Test Internet Access: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Loader: {
              h: 45,
              w: 45,
              x: 420,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Loading.gif"),
              visible: false
            }
          },
          StaticMode: {
            alpha: 0,
            y: 270,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Static Mode"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          }
        }
      };
    }
    _init() {
      this._setState("NetworkInfo");
      let _currentInterface = "";
      let _currentIPSettings = {};
      let _newIPSettings = {};
      this._network = new Network();
      this._network.getDefaultInterface().then((interfaceName) => {
        _currentInterface = interfaceName;
      });
      _newIPSettings = _currentIPSettings;
      _newIPSettings.ipversion = "IPV6";
      this.loadingAnimation = this.tag("TestInternetAccess.Loader").animation({
        duration: 3,
        repeat: -1,
        stopMethod: "immediate",
        stopDelay: 0.2,
        actions: [{
          p: "rotation",
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
    }
    _focus() {
      this._setState(this.state);
      this._network.getDefaultInterface().then((interfaceName) => {
        this.$NetworkInterfaceText(interfaceName);
      });
    }
    _unfocus() {
      this.tag("TestInternetAccess.Title").text.text = Language_default.translate("Test Internet Access: ");
    }
    $NetworkInterfaceText(text) {
      this.tag("NetworkInterface.Title").text.text = Language_default.translate("Network Interface: ") + text;
    }
    _handleBack() {
      Router_default.navigate("settings");
    }
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Network Configuration"));
    }
    static _states() {
      return [class NetworkInfo extends this {
        $enter() {
          this.tag("NetworkInfo")._focus();
        }
        $exit() {
          this.tag("NetworkInfo")._unfocus();
        }
        _handleDown() {
          this._setState("NetworkInterface");
        }
        _handleEnter() {
          Router_default.navigate("settings/network/info");
        }
      }, class NetworkInterface extends this {
        $enter() {
          this.tag("NetworkInterface")._focus();
        }
        $exit() {
          this.tag("NetworkInterface")._unfocus();
        }
        _handleUp() {
          this._setState("NetworkInfo");
        }
        _handleDown() {
          this._setState("TestInternetAccess");
        }
        _handleEnter() {
          if (!Router_default.isNavigating()) {
            Router_default.navigate("settings/network/interface");
          }
        }
      }, class TestInternetAccess extends this {
        $enter() {
          this.tag("TestInternetAccess")._focus();
        }
        $exit() {
          this.tag("TestInternetAccess")._unfocus();
        }
        _handleUp() {
          this._setState("NetworkInterface");
        }
        _handleDown() {
          this._setState("NetworkInfo");
        }
        _handleEnter() {
          this.loadingAnimation.start();
          this.tag("TestInternetAccess.Loader").visible = true;
          this._network.isConnectedToInternet().then((result) => {
            var connectionStatus = Language_default.translate("Internet Access: ");
            if (result) {
              connectionStatus += "Connected";
            } else {
              connectionStatus += "Not Connected";
            }
            setTimeout(() => {
              this.tag("TestInternetAccess.Loader").visible = false;
              this.tag("TestInternetAccess.Title").text.text = connectionStatus;
              this.loadingAnimation.stop();
            }, 2e3);
          });
        }
      }, class StaticMode extends this {
        $enter() {
          this.tag("StaticMode")._focus();
        }
        $exit() {
          this.tag("StaticMode")._unfocus();
        }
        _handleUp() {
          this._setState("TestInternetAccess");
        }
        _handleDown() {
          this._setState("NetworkInfo");
        }
        _handleEnter() {
        }
      }];
    }
  };

  // src/screens/OtherSettingsScreens/NetworkInfoScreen.js
  var appApi2 = new AppApi();
  var defaultInterface = "";
  var currentInterface = [];
  var NetworkInfo = class extends Lightning_default.Component {
    pageTransition() {
      return "left";
    }
    _handleBack() {
      Router_default.navigate("settings/network");
    }
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Network Configuration  Network Info"));
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        NetworkInfoScreenContents: {
          x: 200,
          y: 275,
          Status: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Status: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 500,
              y: 45,
              mountY: 0.5,
              text: {
                text: "",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          ConnectionType: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Connection Type: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 500,
              y: 45,
              mountY: 0.5,
              text: {
                text: "",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          IPAddress: {
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("IP Address: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 500,
              y: 45,
              mountY: 0.5,
              text: {
                text: "",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          Gateway: {
            y: 270,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Gateway: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 500,
              y: 45,
              mountY: 0.5,
              text: {
                text: "",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          MACAddress: {
            y: 360,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("MAC Address: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 500,
              y: 45,
              mountY: 0.5,
              text: {
                text: "",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          InternetProtocol: {
            y: 450,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Internet Protocol: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 500,
              y: 45,
              mountY: 0.5,
              text: {
                text: "",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          SSID: {
            y: 540,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("SSID: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 500,
              y: 45,
              mountY: 0.5,
              text: {
                text: "",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          SignalStrength: {
            y: 630,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Signal Strength: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 500,
              y: 45,
              mountY: 0.5,
              text: {
                text: "",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          }
        }
      };
    }
    getIPSetting(interfaceName) {
      appApi2.getIPSetting(interfaceName).then((result) => {
        this.tag("InternetProtocol.Value").text.text = result.ipversion;
      }).catch((err) => console.log(err));
    }
    _focus() {
      appApi2.getDefaultInterface().then((result) => {
        defaultInterface = result.interface;
        this.getIPSetting(defaultInterface);
        if (defaultInterface === "WIFI") {
          this.tag("ConnectionType.Value").text.text = `Wireless`;
          this.tag("SSID").alpha = 1;
          this.tag("SignalStrength").alpha = 1;
        } else if (defaultInterface === "ETHERNET") {
          this.tag("ConnectionType.Value").text.text = `Ethernet`;
          this.tag("SSID").alpha = 0;
          this.tag("SignalStrength").alpha = 0;
        } else {
          this.tag("ConnectionType.Value").text.text = `NA`;
          this.tag("Status.Value").text.text = `Disconnected`;
          this.tag("IPAddress.Value").text.text = `NA`;
          this.tag("Gateway.Value").text.text = `NA`;
          this.tag("MACAddress.Value").text.text = `NA`;
        }
        appApi2.getInterfaces().then((result2) => {
          currentInterface = result2.interfaces.filter((data) => data.interface === defaultInterface);
          if (currentInterface[0].connected) {
            this.tag("Status.Value").text.text = `Connected`;
            appApi2.getConnectedSSID().then((result3) => {
              if (parseInt(result3.signalStrength) >= -50) {
                this.tag("SignalStrength.Value").text.text = `Excellent`;
              } else if (parseInt(result3.signalStrength) >= -60) {
                this.tag("SignalStrength.Value").text.text = `Good`;
              } else if (parseInt(result3.signalStrength) >= -67) {
                this.tag("SignalStrength.Value").text.text = `Fair`;
              } else {
                this.tag("SignalStrength.Value").text.text = `Poor`;
              }
              this.tag("SSID.Value").text.text = `${result3.ssid}`;
            }).catch((error) => console.log(error));
            appApi2.getIPSetting(defaultInterface).then((result3) => {
              this.tag("IPAddress.Value").text.text = `${result3.ipaddr}`;
              this.tag("Gateway.Value").text.text = `${result3.gateway}`;
            }).catch((error) => console.log(error));
          } else {
            this.tag("Status.Value").text.text = `Disconnected`;
          }
          this.tag("MACAddress.Value").text.text = `${currentInterface[0].macAddress}`;
        }).catch((error) => console.log(error));
      }).catch((error) => console.log(error));
    }
    _unfocus() {
      this.tag("SSID.Value").text.text = "NA";
      this.tag("SignalStrength.Value").text.text = "NA";
      this.tag("MACAddress.Value").text.text = "NA";
      this.tag("Gateway.Value").text.text = "NA";
      this.tag("IPAddress.Value").text.text = "NA";
      this.tag("ConnectionType.Value").text.text = "NA";
      this.tag("InternetProtocol.Value").text.text = "NA";
    }
  };

  // src/screens/OtherSettingsScreens/NetworkInterfaceScreen.js
  var wifi2 = new Wifi();
  var NetworkInterfaceScreen = class extends Lightning_default.Component {
    _construct() {
      this.LoadingIcon = Utils_default.asset("images/settings/Loading.gif");
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        NetworkInterfaceScreenContents: {
          x: 200,
          y: 275,
          WiFi: {
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "WiFi",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Ethernet: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Ethernet",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Loader: {
              h: 45,
              w: 45,
              x: 175,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Loading.gif"),
              visible: false
            }
          }
        }
      };
    }
    _focus() {
      this._setState("WiFi");
    }
    _init() {
      const config7 = {
        host: "127.0.0.1",
        port: 9998,
        default: 1
      };
      this._thunder = thunderJS_default(config7);
      const systemcCallsign = "org.rdk.Network";
      const eventName = "onDefaultInterfaceChanged";
      const listener = this._thunder.on(systemcCallsign, eventName, (notification) => {
        console.log("onDefaultInterfaceChanged notification from networkInterfaceScreen: ", notification);
        if (notification.newInterfaceName === "ETHERNET") {
          this.loadingAnimation.stop();
          this.tag("Ethernet.Loader").visible = false;
          this.tag("Ethernet.Title").text.text = "Ethernet: Connected";
        } else if (notification.newInterfaceName === "" && notification.oldInterfaceName === "WIFI") {
          this.loadingAnimation.stop();
          this.tag("Ethernet.Loader").visible = false;
          this.tag("Ethernet.Title").text.text = "Ethernet: Error, Retry!";
        } else if (notification.newInterfaceName === "WIFI") {
          this.loadingAnimation.stop();
          this.tag("Ethernet.Loader").visible = false;
          this.tag("Ethernet.Title").text.text = "Ethernet";
        }
      });
      this.loadingAnimation = this.tag("Ethernet.Loader").animation({
        duration: 3,
        repeat: -1,
        stopMethod: "immediate",
        stopDelay: 0.2,
        actions: [{
          p: "rotation",
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
      this.tag("Ethernet.Loader").src = this.LoadingIcon;
    }
    _firstActive() {
      this.tag("Ethernet.Loader").on("txError", () => {
        const url = "http://127.0.0.1:50050/lxresui/static/images/settings/Loading.gif";
        this.tag("Ethernet.Loader").src = url;
      });
    }
    hide() {
      this.tag("NetworkInterfaceScreenContents").visible = false;
    }
    show() {
      this.tag("NetworkInterfaceScreenContents").visible = true;
    }
    setEthernetInterface() {
      wifi2.getInterfaces().then((res) => {
        res.interfaces.forEach((element) => {
          if (element.interface === "ETHERNET" && element.connected) {
            wifi2.setInterface("ETHERNET", true).then((result) => {
              if (result.success) {
                wifi2.setDefaultInterface("ETHERNET", true);
                this.tag("Ethernet.Title").text.text = "Ethernet";
                this.tag("Ethernet.Loader").visible = true;
                this.loadingAnimation.start();
              }
            });
          }
        });
      });
    }
    _handleBack() {
      Router_default.navigate("settings/network");
    }
    pageTransition() {
      return "left";
    }
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Network Configuration  Network Interface"));
    }
    static _states() {
      return [class WiFi extends this {
        $enter() {
          this.tag("WiFi")._focus();
        }
        $exit() {
          this.tag("WiFi")._unfocus();
        }
        _handleDown() {
          this._setState("Ethernet");
        }
        _handleEnter() {
          if (!Router_default.isNavigating()) {
            Router_default.navigate("settings/network/interface/wifi");
          }
        }
      }, class Ethernet extends this {
        $enter() {
          this.tag("Ethernet")._focus();
        }
        $exit() {
          this.tag("Ethernet")._unfocus();
        }
        _handleEnter() {
          wifi2.getDefaultInterface().then((res) => {
            if (res.success) {
              if (res.interface !== "ETHERNET") {
                this.setEthernetInterface();
              }
            }
          });
        }
        _handleDown() {
          this._setState("WiFi");
        }
        _handleUp() {
          this._setState("WiFi");
        }
      }];
    }
  };

  // src/items/ConfirmAndCancel.js
  var ConfirmAndCancel = class extends Lightning_default.Component {
    static _template() {
      return {
        Item: {
          w: 325,
          h: 85,
          rect: true,
          color: 4294967295,
          shader: {
            type: Lightning_default.shaders.RoundedRectangle,
            radius: 0
          }
        }
      };
    }
    set item(item) {
      this._item = item;
      this.tag("Item").patch({
        Left: {
          x: this.tag("Item").w / 2,
          y: this.tag("Item").h / 2,
          mountX: 0.5,
          mountY: 0.5,
          text: {
            text: item,
            fontSize: 25,
            textColor: 4278190080,
            fontFace: CONFIG.language.font
          }
        }
      });
    }
    set width(width) {
      this.tag("Item").w = width;
    }
    set height(height) {
      this.tag("Item").h = height;
    }
    _focus() {
      this.tag("Item").color = CONFIG.theme.hex;
    }
    _unfocus() {
      this.tag("Item").color = 4294967295;
    }
  };

  // src/screens/PasswordSwitch.js
  var PasswordSwitch = class extends Lightning_default.Component {
    static _template() {
      return {
        src: Utils_default.asset("images/settings/ToggleOffWhite.png")
      };
    }
    _handleEnter() {
      if (this.isOn) {
        this.patch({
          src: Utils_default.asset("images/settings/ToggleOffWhite.png")
        });
      } else {
        this.patch({
          src: Utils_default.asset("images/settings/ToggleOnOrange.png")
        });
      }
      this.isOn = !this.isOn;
      this.fireAncestors("$handleEnter", this.isOn);
    }
    _init() {
      this.isOn = false;
    }
    _disable() {
      if (this.isOn) {
        this.isOn = false;
        this.patch({
          src: Utils_default.asset("images/settings/ToggleOffWhite.png")
        });
        this.fireAncestors("$handleEnter", this.isOn);
      }
    }
  };

  // src/screens/WiFiPairingScreen.js
  var WifiPairingScreen = class extends Lightning_default.Component {
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        w: 1920,
        h: 1080,
        rect: true,
        color: 4278190080,
        PairingScreen: {
          Title: {
            x: 960,
            y: 95,
            mountX: 0.5,
            zIndex: 2,
            text: {
              text: "",
              fontSize: 40,
              textColor: CONFIG.theme.hex
            }
          },
          RectangleWithColor: {
            x: 180,
            y: 164,
            w: 1515,
            h: 2,
            rect: true,
            color: 4294967295,
            zIndex: 2
          },
          PasswordLabel: {
            x: 180,
            y: 240,
            w: 300,
            h: 75,
            zIndex: 2,
            text: {
              text: "Password: ",
              fontSize: 25,
              fontFace: CONFIG.language.font,
              textColor: 4294967295,
              textAlign: "left"
            }
          },
          Pwd: {
            x: 437,
            y: 240,
            zIndex: 2,
            text: {
              text: "",
              fontSize: 25,
              fontFace: CONFIG.language.font,
              textColor: 4294967295,
              wordWrapWidth: 1e3,
              wordWrap: false,
              textOverflow: "ellipsis"
            }
          },
          PasswordBox: {
            x: 417,
            y: 208,
            zIndex: 2,
            texture: Lightning_default.Tools.getRoundRect(1279, 88, 0, 3, 4294967295, false)
          },
          PasswrdSwitch: {
            h: 45,
            w: 66.9,
            x: 1656,
            y: 255,
            zIndex: 2,
            type: PasswordSwitch,
            mount: 0.5
          },
          ShowPassword: {
            x: 1398,
            y: 240,
            w: 300,
            h: 75,
            zIndex: 2,
            text: {
              text: "Show Password",
              fontSize: 25,
              fontFace: CONFIG.language.font,
              textColor: 4294967295,
              textAlign: "left"
            }
          },
          List: {
            x: 417,
            y: 331,
            type: Lightning_default.components.ListComponent,
            w: 1080,
            h: 400,
            itemSize: 28,
            horizontal: true,
            invertDirection: false,
            roll: true,
            zIndex: 2
          },
          RectangleWithColor2: {
            x: 180,
            y: 451,
            w: 1515,
            h: 2,
            rect: true,
            color: 4294967295,
            zIndex: 2
          },
          KeyBoard: {
            y: 501,
            x: 420,
            type: Keyboard,
            visible: true,
            zIndex: 2,
            formats: KEYBOARD_FORMATS.qwerty
          }
        }
      };
    }
    _updateText(txt) {
      this.tag("Pwd").text.text = txt;
    }
    _handleBack() {
      Router_default.back();
    }
    set params(args) {
      if (args.wifiItem) {
        this.item(args.wifiItem);
      } else {
        Router_default.navigate("settings/network/interface/wifi");
      }
    }
    item(item) {
      this.star = "";
      this.passwd = "";
      this.tag("Pwd").text.text = "";
      this.tag("Title").text = item.ssid;
      var options = [];
      this._item = item;
      if (item.connected) {
        options = ["Disconnect", "Cancel"];
      } else {
        options = ["Connect", "Cancel"];
      }
      this.tag("List").items = options.map((item2, index) => {
        return {
          ref: item2,
          x: index === 0 ? 0 : 325 * index,
          w: 325,
          h: 85,
          type: ConfirmAndCancel,
          item: item2
        };
      });
      this._setState("Pair");
    }
    _focus() {
      this.hidePasswd = true;
      this._setState("Pair");
    }
    _unfocus() {
    }
    _init() {
      this.star = "";
      this.passwd = "";
      this.isOn = false;
      this._wifi = new Wifi();
    }
    pressEnter(option) {
      if (option === "Cancel") {
        Router_default.back();
      } else if (option === "Connect") {
        if (this._item) {
          console.log("trying to connect wifi");
          this._wifi.connect(this._item, "").then(() => {
          }).catch((err) => {
            console.log("Not able to connect to wifi", JSON.stringify(err));
          });
        }
        Router_default.back();
      } else if (option === "Disconnect") {
        this._wifi.disconnect().then(() => {
          Router_default.back();
        });
      }
    }
    startConnect(password) {
      this._wifi.connect(this._item, password).then(() => {
        Router_default.back();
      });
    }
    static _states() {
      return [class Password extends this {
        $enter() {
          this.shifter = false;
          this.capsLock = false;
        }
        _getFocused() {
          return this.tag("KeyBoard");
        }
        $onSoftKey({
          key
        }) {
          if (key === "Done") {
            this.startConnect(this.passwd);
          } else if (key === "Clear") {
            this.passwd = this.passwd.substring(0, this.passwd.length - 1);
            this.star = this.star.substring(0, this.star.length - 1);
            this._updateText(this.hidePasswd ? this.star : this.passwd);
          } else if (key === "#@!" || key === "abc" || key === "\xE1\xF6\xFB" || key === "shift") {
            console.log("no saving");
          } else if (key === "Space") {
            this.star += "\u25CF";
            this.passwd += " ";
            this._updateText(this.hidePasswd ? this.star : this.passwd);
          } else if (key === "Delete") {
            this.star = "";
            this.passwd = "";
            this._updateText(this.hidePasswd ? this.star : this.passwd);
          } else {
            this.star += "\u25CF";
            this.passwd += key;
            this._updateText(this.hidePasswd ? this.star : this.passwd);
          }
        }
        _handleUp() {
          this._setState("Pair");
        }
      }, class Pair extends this {
        $enter() {
        }
        _getFocused() {
          return this.tag("List").element;
        }
        _handleRight() {
          this.tag("List").setNext();
        }
        _handleLeft() {
          this.tag("List").setPrevious();
        }
        _handleUp() {
          this._setState("PasswordSwitchState");
        }
        _handleDown() {
          this._setState("Password");
        }
        _handleEnter() {
          if (this.tag("List").element.ref == "Connect" && this._item.security != 0) {
            if (this.star === "") {
              this._setState("Password");
            } else {
              this.startConnect(this.passwd);
            }
          } else {
            this.pressEnter(this.tag("List").element.ref);
          }
        }
      }, class PasswordSwitchState extends this {
        $enter() {
          this.tag("PasswordBox").texture = Lightning_default.Tools.getRoundRect(1279, 88, 0, 3, CONFIG.theme.hex, false);
        }
        _handleDown() {
          this._setState("Pair");
        }
        _getFocused() {
          return this.tag("PasswrdSwitch");
        }
        $handleEnter(bool) {
          if (bool) {
            this._updateText(this.passwd);
            this.hidePasswd = false;
          } else {
            this._updateText(this.star);
            this.hidePasswd = true;
          }
          this.isOn = bool;
        }
        $exit() {
          this.tag("PasswordBox").texture = Lightning_default.Tools.getRoundRect(1279, 88, 0, 3, 4294967295, false);
        }
      }];
    }
  };

  // src/items/WiFiItem.js
  var WiFiItem = class extends Lightning_default.Component {
    _construct() {
      this.Lock = Utils_default.asset("/images/settings/Lock.png");
      this.WiFi1 = Utils_default.asset("/images/settings/WiFi1.png");
      this.WiFi2 = Utils_default.asset("/images/settings/WiFi2.png");
      this.WiFi3 = Utils_default.asset("/images/settings/WiFi3.png");
      this.WiFi4 = Utils_default.asset("/images/settings/WiFi4.png");
      this.Tick = Utils_default.asset("/images/settings/Tick.png");
    }
    _init() {
      this.tag("Item.Tick").on("txError", () => {
        const url = "http://127.0.0.1:50050/lxresui/static/images/settings/Tick.png";
        this.tag("Item.Tick").src = url;
      });
    }
    static _template() {
      return {
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        },
        Item: {
          w: 1600,
          h: 90
        },
        BottomLine: {
          y: 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        }
      };
    }
    set item(item) {
      this._item = item;
      this.status = item.connected ? "Connected" : "Not Connected";
      var wifiicon = "";
      if (item.signalStrength >= -50) {
        wifiicon = this.WiFi4;
      } else if (item.signalStrength >= -60) {
        wifiicon = this.WiFi3;
      } else if (item.signalStrength >= -67) {
        wifiicon = this.WiFi2;
      } else {
        wifiicon = this.WiFi1;
      }
      this.tag("Item").patch({
        Tick: {
          x: 10,
          y: 45,
          mountY: 0.5,
          h: 32.5,
          w: 32.5,
          src: this.Tick,
          color: 4294967295,
          visible: item.connected ? true : false
        },
        Left: {
          x: 40,
          y: 45,
          mountY: 0.5,
          text: {
            text: item.ssid,
            fontSize: 25,
            textColor: COLORS.textColor,
            fontFace: CONFIG.language.font
          }
        },
        Right: {
          x: 1560,
          mountX: 1,
          y: 45,
          mountY: 0.5,
          flex: {
            direction: "row"
          },
          Lock: {
            color: 4294967295,
            texture: Lightning_default.Tools.getSvgTexture(this.Lock, 32.5, 32.5),
            alpha: 1
          },
          Icon: {
            color: 4294967295,
            flexItem: {
              marginLeft: 15
            },
            texture: Lightning_default.Tools.getSvgTexture(wifiicon, 32.5, 32.5)
          }
        }
      });
      if (item.security == "0" || item.security == "15") {
        this.tag("Item.Right.Lock").visible = false;
      } else {
        this.tag("Item.Right.Lock").visible = true;
      }
    }
    _focus() {
      this.tag("Item").color = COLORS.hightlightColor;
      this.tag("TopLine").color = CONFIG.theme.hex;
      this.tag("BottomLine").color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag("TopLine").h = 6;
      this.tag("BottomLine").h = 6;
    }
    _unfocus() {
      this.tag("TopLine").color = 4294967295;
      this.tag("BottomLine").color = 4294967295;
      this.patch({
        zIndex: 1
      });
      this.tag("TopLine").h = 3;
      this.tag("BottomLine").h = 3;
    }
  };

  // src/screens/WifiScreen.js
  var WiFiScreen = class extends Lightning_default.Component {
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        WifiContents: {
          x: 200,
          y: 275,
          Switch: {
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "WiFi On/Off",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Loader: {
              visible: false,
              h: 45,
              w: 45,
              x: 1500,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Loading.gif")
            },
            Button: {
              h: 45,
              w: 67,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/ToggleOffWhite.png")
            }
          },
          Networks: {
            y: 180,
            flex: {
              direction: "column"
            },
            PairedNetworks: {
              flexItem: {
                margin: 0
              },
              List: {
                type: Lightning_default.components.ListComponent,
                w: 1920 - 300,
                itemSize: 90,
                horizontal: false,
                invertDirection: true,
                roll: true,
                rollMax: 900,
                itemScrollOffset: -4
              }
            },
            AvailableNetworks: {
              flexItem: {
                margin: 0
              },
              List: {
                w: 1920 - 300,
                type: Lightning_default.components.ListComponent,
                itemSize: 90,
                horizontal: false,
                invertDirection: true,
                roll: true,
                rollMax: 900,
                itemScrollOffset: -4
              }
            },
            visible: false
          },
          JoinAnotherNetwork: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Join Another Network",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            visible: false
          }
        }
      };
    }
    _active() {
      this._setState("Switch");
    }
    _focus() {
      this._setState("Switch");
      this._enable();
    }
    _init() {
      this.wifiLoading = this.tag("Switch.Loader").animation({
        duration: 3,
        repeat: -1,
        stopMethod: "immediate",
        stopDelay: 0.2,
        actions: [{
          p: "rotation",
          v: {
            sm: 0,
            0: 0,
            1: Math.PI * 2
          }
        }]
      });
      this.onError = {
        0: "SSID_CHANGED - The SSID of the network changed",
        1: "CONNECTION_LOST - The connection to the network was lost",
        2: "CONNECTION_FAILED - The connection failed for an unknown reason",
        3: "CONNECTION_INTERRUPTED - The connection was interrupted",
        4: "INVALID_CREDENTIALS - The connection failed due to invalid credentials",
        5: "NO_SSID - The SSID does not exist",
        6: "UNKNOWN - Any other error."
      };
      this._wifi = new Wifi();
      this._network = new Network();
      this.wifiStatus = false;
      this._wifiIcon = true;
      this._activateWiFi();
      this._setState("Switch");
      if (this.wiFiStatus) {
        this.tag("Networks").visible = true;
        this.tag("JoinAnotherNetwork").visible = true;
      }
      this._pairedNetworks = this.tag("Networks.PairedNetworks");
      this._availableNetworks = this.tag("Networks.AvailableNetworks");
      this._network.activate().then((result) => {
        if (result) {
          this.wifiStatus = true;
          this._network.registerEvent("onIPAddressStatusChanged", (notification) => {
            console.log(JSON.stringify(notification));
            if (notification.status == "LOST") {
              if (notification.interface === "WIFI") {
                this._wifi.setInterface("ETHERNET", true).then((res) => {
                  if (res.success) {
                    this._wifi.setDefaultInterface("ETHERNET", true);
                  }
                });
              }
            }
          });
          this._network.registerEvent("onDefaultInterfaceChanged", (notification) => {
            if (notification.newInterfaceName === "ETHERNET") {
              this._wifi.setInterface("ETHERNET", true).then((result2) => {
                if (result2.success) {
                  this._wifi.setDefaultInterface("ETHERNET", true);
                }
              });
            }
            if (notification.newInterfaceName == "ETHERNET" || notification.oldInterfaceName == "WIFI") {
              this._wifi.disconnect();
              this.wifiStatus = false;
              this.tag("Networks").visible = false;
              this.tag("JoinAnotherNetwork").visible = false;
              this.tag("Switch.Loader").visible = false;
              this.wifiLoading.stop();
              this.tag("Switch.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
              this._setState("Switch");
              this._wifi.setInterface("ETHERNET", true).then((result2) => {
                if (result2.success) {
                  this._wifi.setDefaultInterface("ETHERNET", true).then((result1) => {
                    if (result1.success) {
                      console.log("set default success", result1);
                    }
                  });
                }
              });
            }
            if (notification.newInterfaceName == "" && notification.oldInterfaceName == "WIFI") {
              this._wifi.setInterface("ETHERNET", true).then((result2) => {
                if (result2.success) {
                  this._wifi.setDefaultInterface("ETHERNET", true).then((result1) => {
                    if (result1.success) {
                      console.log("set default success", result1);
                    }
                  });
                }
              });
            }
          });
          this._network.registerEvent("onConnectionStatusChanged", (notification) => {
            if (notification.interface === "ETHERNET" && notification.status === "CONNECTED") {
              this._wifi.setInterface("ETHERNET", true).then((res) => {
                if (res.success) {
                  this._wifi.setDefaultInterface("ETHERNET", true);
                }
              });
            }
          });

          this._network.registerEvent('onConnectionStatusChanged', notification => {
            if (notification.interface === 'ETHERNET' && notification.status === 'CONNECTED') {
              this._wifi.setInterface('ETHERNET', true).then(res => {
                if (res.success) {
                  this._wifi.setDefaultInterface('ETHERNET', true);
                }
              });
            }
          });
        }
      });
    }
    _enable() {
      if (this.wifiStatus) {
        this._wifi.discoverSSIDs();
      }
      this.scanTimer = setInterval(() => {
        if (this.wifiStatus) {
          this._wifi.discoverSSIDs();
        }
      }, 5e3);
    }
    _disable() {
      console.log("going out");
      clearInterval(this.scanTimer);
    }
    renderDeviceList(ssids) {
      this._wifi.getConnectedSSID().then((result) => {
        if (result.ssid != "") {
          this._pairedList = [result];
        } else {
          this._pairedList = [];
        }
        this._pairedNetworks.h = this._pairedList.length * 90;
        this._pairedNetworks.tag("List").h = this._pairedList.length * 90;
        this._pairedNetworks.tag("List").items = this._pairedList.map((item, index) => {
          item.connected = true;
          return {
            ref: "Paired" + index,
            w: 1920 - 300,
            h: 90,
            type: WiFiItem,
            item
          };
        });
        this._otherList = ssids.filter((device) => {
          result = this._pairedList.map((a) => a.ssid);
          if (result.includes(device.ssid)) {
            return false;
          } else
            return device;
        });
        this._availableNetworks.h = this._otherList.length * 90;
        this._availableNetworks.tag("List").h = this._otherList.length * 90;
        this._availableNetworks.tag("List").items = this._otherList.map((item, index) => {
          item.connected = false;
          return {
            ref: "Other" + index,
            w: 1620,
            h: 90,
            type: WiFiItem,
            item
          };
        });
      });
    }
    _handleBack() {
      Router_default.navigate("settings/network/interface");
    }
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Network Configuration  Network Interface  WiFi"));
    }
    static _states() {
      return [class Switch extends this {
        $enter() {
          if (this.wifiStatus === true) {
            this.tag("Switch.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
            this.tag("Switch.Button").scaleX = 1;
          }
          this.tag("Switch")._focus();
        }
        $exit() {
          this.tag("Switch")._unfocus();
        }
        _handleDown() {
          if (this.wifiStatus === true) {
            this._setState("JoinAnotherNetwork");
          }
        }
        _handleEnter() {
          this.switch();
        }
      }, class PairedDevices extends this {
        $enter() {
          if (this.wifiStatus === true) {
            this.tag("Switch.Loader").visible = false;
            this.wifiLoading.stop();
            this.tag("Switch.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
            this.tag("Switch.Button").scaleX = -1;
          }
        }
        _getFocused() {
          return this._pairedNetworks.tag("List").element;
        }
        _handleDown() {
          this._navigate("MyDevices", "down");
        }
        _handleUp() {
          this._navigate("MyDevices", "up");
        }
        _handleEnter() {
          Router_default.navigate("settings/network/interface/wifi/connect", {
            wifiItem: this._pairedNetworks.tag("List").element._item
          });
        }
      }, class AvailableDevices extends this {
        $enter() {
          if (this.wifiStatus === true) {
            this.tag("Switch.Loader").visible = false;
            this.wifiLoading.stop();
            this.tag("Switch.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
            this.tag("Switch.Button").scaleX = -1;
          }
        }
        _getFocused() {
          return this._availableNetworks.tag("List").element;
        }
        _handleDown() {
          this._navigate("AvailableDevices", "down");
        }
        _handleUp() {
          this._navigate("AvailableDevices", "up");
        }
        _handleEnter() {
          Router_default.navigate("settings/network/interface/wifi/connect", {
            wifiItem: this._availableNetworks.tag("List").element._item
          });
        }
      }, class JoinAnotherNetwork extends this {
        $enter() {
          this.tag("JoinAnotherNetwork")._focus();
        }
        _handleUp() {
          this._setState("Switch");
        }
        _handleEnter() {
          if (this.wifiStatus) {
            Router_default.navigate("settings/network/interface/wifi/another");
          }
        }
        _handleDown() {
          if (this.wifiStatus) {
            if (this._pairedNetworks.tag("List").length > 0) {
              this._setState("PairedDevices");
            } else if (this._availableNetworks.tag("List").length > 0) {
              this._setState("AvailableDevices");
            }
          }
        }
        $exit() {
          this.tag("JoinAnotherNetwork")._unfocus();
        }
      }];
    }
    _navigate(listname, dir) {
      let list;
      if (listname === "MyDevices")
        list = this._pairedNetworks.tag("List");
      else if (listname === "AvailableDevices")
        list = this._availableNetworks.tag("List");
      if (dir === "down") {
        if (list.index < list.length - 1)
          list.setNext();
        else if (list.index == list.length - 1) {
          if (listname === "MyDevices" && this._availableNetworks.tag("List").length > 0) {
            this._setState("AvailableDevices");
          }
        }
      } else if (dir === "up") {
        if (list.index > 0)
          list.setPrevious();
        else if (list.index == 0) {
          if (listname === "AvailableDevices" && this._pairedNetworks.tag("List").length > 0) {
            this._setState("PairedDevices");
          } else {
            this._setState("JoinAnotherNetwork");
          }
        }
      }
    }
    switch() {
      if (this.wifiStatus) {
        this._wifi.disconnect();
        console.log("turning off wifi");
        this._wifi.setInterface("ETHERNET", true).then((result) => {
          if (result.success) {
            this._wifi.setDefaultInterface("ETHERNET", true).then((result2) => {
              if (result2.success) {
                this._wifi.disconnect();
                this.wifiStatus = false;
                this.tag("Networks").visible = false;
                this.tag("JoinAnotherNetwork").visible = false;
                this.tag("Switch.Loader").visible = false;
                this.wifiLoading.stop();
                this.tag("Switch.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
              }
            });
          }
        });
      } else {
        console.log("turning on wifi");
        this.wifiStatus = true;
        this.tag("Networks").visible = true;
        this.tag("JoinAnotherNetwork").visible = true;
        this.wifiLoading.play();
        this.tag("Switch.Loader").visible = true;
        this.tag("Switch.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
        this._wifi.discoverSSIDs();
      }
    }
    _activateWiFi() {
      this._wifi.activate().then(() => {
        this.switch();
      });
      this._wifi.registerEvent("onWIFIStateChanged", (notification) => {
        console.log(JSON.stringify(notification));
        if (notification.state === 2 || notification.state === 5) {
          this._wifi.discoverSSIDs();
        }
      });
      this._wifi.registerEvent("onError", (notification) => {
        console.log("on errro");
        this._wifi.discoverSSIDs();
        this._wifi.setInterface("ETHERNET", true).then((res) => {
          if (res.success) {
            this._wifi.setDefaultInterface("ETHERNET", true);
          }
        });
        if (this.widgets) {
          this.widgets.fail.notify({
            title: "WiFi Error",
            msg: this.onError[notification.code]
          });
          Router_default.focusWidget("Fail");
        }
      });
      this._wifi.registerEvent("onAvailableSSIDs", (notification) => {
        this.renderDeviceList(notification.ssids);
        if (!notification.moreData) {
          setTimeout(() => {
            this.tag("Switch.Loader").visible = false;
            this.wifiLoading.stop();
          }, 1e3);
        }
      });
    }
  };

  // src/routes/networkRoutes.js
  var networkRoutes = [{
    path: "settings/network",
    component: NetworkConfigurationScreen,
    widgets: ["Menu"]
  }, {
    path: "settings/network/info",
    component: NetworkInfo,
    widgets: ["Menu"]
  }, {
    path: "settings/network/interface",
    component: NetworkInterfaceScreen,
    widgets: ["Menu"]
  }, {
    path: "settings/network/interface/wifi",
    component: WiFiScreen,
    widgets: ["Menu", "Fail"]
  }, {
    path: "settings/network/interface/wifi/connect",
    component: WifiPairingScreen
  }, {
    path: "settings/network/interface/wifi/another",
    component: JoinAnotherNetworkComponent
  }, {
    path: "settings/bluetooth",
    component: BluetoothScreen,
    widgets: ["Menu", "Fail"]
  }, {
    path: "settings/bluetooth/pairing",
    component: BluetoothPairingScreen
  }];
  var route = {
    network: networkRoutes
  };

  // src/MediaPlayer/LightningPlayerControl.js
  var timeout2;
  var LightningPlayerControls = class extends Lightning_default.Component {
    static _template() {
      return {
        TimeBar: {
          x: 90,
          y: 93.5,
          texture: Lightning_default.Tools.getRoundRect(1740, 30, 15, 0, 0, true, 4294967295)
        },
        ProgressWrapper: {
          x: 90,
          y: 93.5,
          w: 0,
          h: 35,
          clipping: true,
          ProgressBar: {
            texture: Lightning_default.Tools.getRoundRect(1740, 30, 15, 0, 0, true, CONFIG.theme.hex)
          }
        },
        CurrentTime: {
          x: 90,
          y: 184.5
        },
        Buttons: {
          x: 820,
          y: 200,
          children: [{
            src: Utils_default.asset("images/Media Player/Icon_Back_White_16k.png"),
            x: 17,
            y: 17
          }, {
            src: Utils_default.asset("images/Media Player/Icon_Pause_White_16k.png"),
            x: 17,
            y: 17
          }, {
            src: Utils_default.asset("images/Media Player/Icon_Next_White_16k.png"),
            x: 17,
            y: 17
          }].map((item, idx) => ({
            x: idx * 100,
            ControlIcon: {
              x: item.x,
              y: item.y,
              texture: Lightning_default.Tools.getSvgTexture(item.src, 70, 70)
            }
          }))
        }
      };
    }
    _init() {
      this.videoDuration = 0;
      this.tag("Buttons").children[0].patch({
        alpha: 1
      });
      this.tag("Buttons").children[2].patch({
        alpha: 1
      });
      this.toggle = false;
    }
    _focus() {
      this._index = 1;
      this._setState("PlayPause");
    }
    _unfocus() {
      this._setState("Hidden");
      clearTimeout(timeout2);
    }
    set duration(duration) {
      console.log(`duration was set = ${duration}`);
      this.videoDuration = duration;
    }
    set currentTime(currentTime) {
      this.tag("ProgressWrapper").patch({
        w: 1740 * currentTime / this.videoDuration
      });
    }
    SecondsTohhmmss(totalSeconds) {
      this.hours = Math.floor(totalSeconds / 3600);
      this.minutes = Math.floor((totalSeconds - this.hours * 3600) / 60);
      this.seconds = totalSeconds - this.hours * 3600 - this.minutes * 60;
      this.seconds = Math.round(totalSeconds) - this.hours * 3600 - this.minutes * 60;
      this.result = this.hours < 10 ? "0" + this.hours : this.hours;
      this.result += ":" + (this.minutes < 10 ? "0" + this.minutes : this.minutes);
      this.result += ":" + (this.seconds < 10 ? "0" + this.seconds : this.seconds);
      return this.result;
    }
    hideLightningPlayerControls() {
      this.signal("hide");
    }
    timer() {
      clearTimeout(timeout2);
      timeout2 = setTimeout(this.hideLightningPlayerControls.bind(this), 5e3);
    }
    static _states() {
      return [class PlayPause extends this {
        $enter() {
          this.focus = this.toggle ? Utils_default.asset("images/Media Player/Icon_Play_Orange_16k.png") : Utils_default.asset("images/Media Player/Icon_Pause_Orange_16k.png");
          this.timer();
          this.tag("Buttons").children[1].tag("ControlIcon").patch({
            texture: Lightning_default.Tools.getSvgTexture(this.focus, 70, 70)
          });
        }
        $exit() {
          this.unfocus = this.toggle ? Utils_default.asset("images/Media Player/Icon_Play_White_16k.png") : Utils_default.asset("images/Media Player/Icon_Pause_White_16k.png");
          this.tag("Buttons").children[1].tag("ControlIcon").patch({
            texture: Lightning_default.Tools.getSvgTexture(this.unfocus, 70, 70)
          });
        }
        _handleEnter() {
          if (this.toggle) {
            this.signal("play");
          } else {
            this.signal("pause");
          }
          this.toggle = !this.toggle;
          this.focus = this.toggle ? Utils_default.asset("images/Media Player/Icon_Play_Orange_16k.png") : Utils_default.asset("images/Media Player/Icon_Pause_Orange_16k.png");
          this.timer();
          this.tag("Buttons").children[1].tag("ControlIcon").patch({
            texture: Lightning_default.Tools.getSvgTexture(this.focus, 70, 70)
          });
        }
        _handleRight() {
          this._setState("Forward");
        }
        _handleLeft() {
          this._setState("Rewind");
        }
        _getFocused() {
          this.timer();
        }
      }, class Forward extends this {
        $enter() {
          this.timer();
          this.tag("Buttons").children[2].tag("ControlIcon").patch({
            texture: Lightning_default.Tools.getSvgTexture(Utils_default.asset("images/Media Player/Icon_Next_Orange_16k.png"), 70, 70)
          });
        }
        $exit() {
          this.tag("Buttons").children[2].tag("ControlIcon").patch({
            texture: Lightning_default.Tools.getSvgTexture(Utils_default.asset("images/Media Player/Icon_Next_White_16k.png"), 70, 70)
          });
        }
        _handleRight() {
        }
        _handleLeft() {
          this._setState("PlayPause");
        }
        _handleEnter() {
          this.toggle = false;
          this.signal("nextTrack");
        }
        _getFocused() {
          this.timer();
        }
      }, class Rewind extends this {
        $enter() {
          this.timer();
          this.tag("Buttons").children[0].tag("ControlIcon").patch({
            texture: Lightning_default.Tools.getSvgTexture(Utils_default.asset("images/Media Player/Icon_Back_Orange_16k.png"), 70, 70)
          });
        }
        $exit() {
          this.tag("Buttons").children[0].tag("ControlIcon").patch({
            texture: Lightning_default.Tools.getSvgTexture(Utils_default.asset("images/Media Player/Icon_Back_White_16k.png"), 70, 70)
          });
        }
        _handleLeft() {
        }
        _handleRight() {
          this._setState("PlayPause");
        }
        _handleEnter() {
          this.toggle = false;
          this.signal("prevTrack");
        }
        _getFocused() {
          this.timer();
        }
      }, class Hidden extends this {
        _getFocused() {
        }
      }];
    }
  };

  // src/MediaPlayer/AAMPVideoPlayer.js
  var AAMPVideoPlayer = class extends Lightning_default.Component {
    set params(args) {
      this.currentIndex = args.currentIndex;
      this.data = args.list;
      let url = args.url ? args.url : "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";
      if (args.isAudio) {
        this.tag("Image").alpha = 1;
      }
      try {
        this.load({
          title: "Parkour event",
          url,
          drmConfig: null
        });
        this.setVideoRect(0, 0, 1920, 1080);
      } catch (error) {
        console.error("Playback Failed " + error);
      }
    }
    static _template() {
      return {
        Image: {
          alpha: 0,
          x: 960,
          y: 560,
          mount: 0.5,
          texture: {
            type: Lightning_default.textures.ImageTexture,
            src: "static/images/Media Player/Audio_Background_16k.jpg",
            resizeMode: {
              type: "contain",
              w: 1920,
              h: 1080
            }
          }
        },
        PlayerControls: {
          type: LightningPlayerControls,
          x: 0,
          y: 810,
          alpha: 0,
          signals: {
            pause: "pause",
            play: "play",
            hide: "hidePlayerControls",
            fastfwd: "fastfwd",
            fastrwd: "fastrwd",
            nextTrack: "nextTrack",
            prevTrack: "prevTrack"
          }
        }
      };
    }
    _init() {
      this.x = 0;
      this.y = 0;
      this.w = 0;
      this.h = 0;
      this.videoEl = document.createElement("video");
      this.videoEl.setAttribute("id", "video-player");
      this.videoEl.style.position = "absolute";
      this.videoEl.style.zIndex = "1";
      this.videoEl.setAttribute("width", "100%");
      this.videoEl.setAttribute("height", "100%");
      this.videoEl.setAttribute("type", "video/ave");
      document.body.appendChild(this.videoEl);
      this.playbackSpeeds = [-16, -8, -4, -2, 1, 2, 4, 8, 16];
      this.playerStatesEnum = {
        idle: 0,
        initializing: 1,
        playing: 8,
        paused: 6,
        seeking: 7
      };
      this.player = null;
      this.playbackRateIndex = this.playbackSpeeds.indexOf(1);
      this.defaultInitConfig = {
        initialBitrate: 25e5,
        offset: 0,
        networkTimeout: 10,
        preferredAudioLanguage: "en",
        liveOffset: 15,
        drmConfig: null
      };
    }
    setVideoRect(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
    _playbackStateChanged(event) {
      switch (event.state) {
        case this.player.playerStatesEnum.idle:
          this.playerState = this.player.playerStatesEnum.idle;
          break;
        case this.player.playerStatesEnum.initializing:
          this.playerState = this.player.playerStatesEnum.initializing;
          break;
        case this.player.playerStatesEnum.playing:
          this.playerState = this.player.playerStatesEnum.playing;
          break;
        case this.player.playerStatesEnum.paused:
          this.playerState = this.player.playerStatesEnum.paused;
          break;
        case this.player.playerStatesEnum.seeking:
          this.playerState = this.player.playerStatesEnum.seeking;
          break;
        default:
          break;
      }
    }
    _mediaEndReached() {
      this.load(this.videoInfo);
      this.setVideoRect(this.x, this.y, this.w, this.h);
    }
    _mediaSpeedChanged() {
    }
    _bitrateChanged() {
    }
    _mediaPlaybackFailed() {
      this.load(this.videoInfo);
    }
    _mediaProgressUpdate(event) {
      this.position = event.positionMiliseconds / 1e3;
      this.tag("PlayerControls").currentTime = this.position;
    }
    _mediaPlaybackStarted() {
      this.tag("PlayerControls").reset();
      this.tag("PlayerControls").setSmooth("alpha", 1);
      this.tag("PlayerControls").setSmooth("y", 675, {
        duration: 1
      });
      this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5e3);
    }
    _mediaDurationChanged() {
    }
    createPlayer() {
      if (this.player !== null) {
        this.destroy();
        this.player = null;
      }
      try {
        this.player = new AAMPMediaPlayer();
        this.player.addEventListener("playbackStateChanged", this._playbackStateChanged);
        this.player.addEventListener("playbackCompleted", this._mediaEndReached.bind(this));
        this.player.addEventListener("playbackSpeedChanged", this._mediaSpeedChanged);
        this.player.addEventListener("bitrateChanged", this._bitrateChanged);
        this.player.addEventListener("playbackFailed", this._mediaPlaybackFailed.bind(this));
        this.player.addEventListener("playbackProgressUpdate", this._mediaProgressUpdate.bind(this));
        this.player.addEventListener("playbackStarted", this._mediaPlaybackStarted.bind(this));
        this.player.addEventListener("durationChanged", this._mediaDurationChanged);
        this.playerState = this.playerStatesEnum.idle;
      } catch (error) {
        console.error("AAMPMediaPlayer is not defined");
      }
    }
    load(videoInfo) {
      this.createPlayer();
      this.videoInfo = videoInfo;
      this.configObj = this.defaultInitConfig;
      this.configObj.drmConfig = this.videoInfo.drmConfig;
      this.player.initConfig(this.configObj);
      this.player.load(videoInfo.url);
      this.tag("PlayerControls").title = videoInfo.title;
      this.tag("PlayerControls").duration = this.player.getDurationSec();
      console.log("Dureation of video", this.player.getDurationSec());
      this.tag("PlayerControls").currentTime = 0;
      this.play();
    }
    play() {
      this.player.play();
      this.playbackRateIndex = this.playbackSpeeds.indexOf(1);
    }
    pause() {
      this.player.pause();
    }
    stop() {
      this.player.stop();
      this.hidePlayerControls();
    }
    nextTrack() {
      if (this.data[this.currentIndex + 1]) {
        this.currentIndex += 1;
        this.stop();
        this.destroy();
        try {
          this.load({
            title: "Parkour event",
            url: this.data[this.currentIndex].data.uri,
            drmConfig: null
          });
          this.setVideoRect(0, 0, 1920, 1080);
        } catch (error) {
          console.error("Playback Failed " + error);
        }
      }
    }
    prevTrack() {
      if (this.data[this.currentIndex - 1]) {
        this.currentIndex -= 1;
        this.stop();
        this.destroy();
        try {
          this.load({
            title: "Parkour event",
            url: this.data[this.currentIndex].data.uri,
            drmConfig: null
          });
          this.setVideoRect(0, 0, 1920, 1080);
        } catch (error) {
          console.error("Playback Failed " + error);
        }
      }
    }
    fastfwd() {
      if (this.playbackRateIndex < this.playbackSpeeds.length - 1) {
        this.playbackRateIndex++;
      }
      this.rate = this.playbackSpeeds[this.playbackRateIndex];
      this.player.setPlaybackRate(this.rate);
    }
    fastrwd() {
      if (this.playbackRateIndex > 0) {
        this.playbackRateIndex--;
      }
      this.rate = this.playbackSpeeds[this.playbackRateIndex];
      this.player.setPlaybackRate(this.rate);
    }
    getPlayer() {
      return this.player;
    }
    destroy() {
      if (this.player.getCurrentState() !== this.playerStatesEnum.idle) {
        this.player.stop();
      }
      this.player.removeEventListener("playbackStateChanged", this._playbackStateChanged);
      this.player.removeEventListener("playbackCompleted", this._mediaEndReached);
      this.player.removeEventListener("playbackSpeedChanged", this._mediaSpeedChanged);
      this.player.removeEventListener("bitrateChanged", this._bitrateChanged);
      this.player.removeEventListener("playbackFailed", this._mediaPlaybackFailed.bind(this));
      this.player.removeEventListener("playbackProgressUpdate", this._mediaProgressUpdate.bind(this));
      this.player.removeEventListener("playbackStarted", this._mediaPlaybackStarted.bind(this));
      this.player.removeEventListener("durationChanged", this._mediaDurationChanged);
      this.player.release();
      this.player = null;
      this.hidePlayerControls();
    }
    hidePlayerControls() {
      this.tag("PlayerControls").setSmooth("y", 1080, {
        duration: 0.7
      });
      this.tag("PlayerControls").setSmooth("alpha", 0, {
        duration: 0.7
      });
      this._setState("HideControls");
    }
    showPlayerControls() {
      this.tag("PlayerControls").reset();
      this.tag("PlayerControls").setSmooth("alpha", 1);
      this.tag("PlayerControls").setSmooth("y", 675, {
        duration: 0.7
      });
      this._setState("ShowControls");
      this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5e3);
    }
    _handleUp() {
      this.tag("PlayerControls").setSmooth("alpha", 1, {
        duration: 1
      });
      this.tag("PlayerControls").setSmooth("y", 675, {
        duration: 1
      });
      this._setState("ShowControls");
      clearTimeout(this.timeout);
    }
    _handleDown() {
      this.hidePlayerControls();
      this._setState("HideControls");
    }
    _handleBack() {
      Router_default.back();
    }
    _unfocus() {
      this.stop();
      this.destroy();
      this.tag("Image").alpha = 0;
    }
    _focus() {
      this._setState("ShowControls");
    }
    static _states() {
      return [class ShowControls extends this {
        _getFocused() {
          return this.tag("PlayerControls");
        }
      }, class HideControls extends this {
      }];
    }
  };

  // src/screens/OtherSettingsScreens/OtherSettingsScreen.js
  var OtherSettingsScreen = class extends Lightning_default.Component {
    pageTransition() {
      return "left";
    }
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Other Settings"));
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        OtherSettingsScreenContents: {
          x: 200,
          y: 275,
          SleepTimer: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Sleep Timer: Off"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          RemoteControl: {
            alpha: 0.3,
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Remote Control",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          ScreenSaver: {
            alpha: 0.3,
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Screen-Saver: ",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          EnergySaver: {
            y: 270,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Energy Saver: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Language: {
            y: 450 - 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Language"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Privacy: {
            y: 540 - 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Privacy"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          AdvancedSettings: {
            y: 630 - 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Advanced Settings"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          }
        }
      };
    }
    _init() {
      this._appApi = new AppApi();
      this._setState("SleepTimer");
    }
    $updateStandbyMode(standbyMode) {
      this.tag("EnergySaver.Title").text.text = Language_default.translate("Energy Saver: ") + standbyMode;
    }
    $sleepTimerText(text) {
      this.tag("SleepTimer.Title").text.text = Language_default.translate("Sleep Timer: ") + text;
    }
    _focus() {
      this._setState(this.state);
      if (Storage_default.get("TimeoutInterval")) {
        this.tag("SleepTimer.Title").text.text = Language_default.translate("Sleep Timer: ") + Storage_default.get("TimeoutInterval");
      } else {
        this.tag("SleepTimer.Title").text.text = Language_default.translate("Sleep Timer: ") + "Off";
      }
      this._appApi.getPreferredStandbyMode().then((result) => {
        var currentStandbyMode = "";
        if (result.preferredStandbyMode == "LIGHT_SLEEP") {
          currentStandbyMode = "Light Sleep";
        } else if (result.preferredStandbyMode == "DEEP_SLEEP") {
          currentStandbyMode = "Deep Sleep";
        }
        this.tag("EnergySaver.Title").text.text = Language_default.translate("Energy Saver: ") + currentStandbyMode;
      });
    }
    _handleBack() {
      Router_default.navigate("settings");
    }
    static _states() {
      return [class SleepTimer extends this {
        $enter() {
          this.tag("SleepTimer")._focus();
        }
        $exit() {
          this.tag("SleepTimer")._unfocus();
        }
        _handleUp() {
          this._setState("AdvancedSettings");
        }
        _handleDown() {
          this._setState("EnergySaver");
        }
        _handleEnter() {
          Router_default.navigate("settings/other/timer");
        }
      }, class RemoteControl extends this {
        $enter() {
          this.tag("RemoteControl")._focus();
        }
        $exit() {
          this.tag("RemoteControl")._unfocus();
        }
        _handleUp() {
          this._setState("SleepTimer");
        }
        _handleDown() {
          this._setState("ScreenSaver");
        }
        _handleEnter() {
        }
      }, class ScreenSaver extends this {
        $enter() {
          this.tag("ScreenSaver")._focus();
        }
        $exit() {
          this.tag("ScreenSaver")._unfocus();
        }
        _handleUp() {
          this._setState("RemoteControl");
        }
        _handleDown() {
          this._setState("EnergySaver");
        }
        _handleEnter() {
        }
      }, class EnergySaver extends this {
        $enter() {
          this.tag("EnergySaver")._focus();
        }
        $exit() {
          this.tag("EnergySaver")._unfocus();
        }
        _handleUp() {
          this._setState("SleepTimer");
        }
        _handleDown() {
          this._setState("Language");
        }
        _handleEnter() {
          Router_default.navigate("settings/other/energy");
        }
      }, class Language extends this {
        $enter() {
          this.tag("Language")._focus();
        }
        $exit() {
          this.tag("Language")._unfocus();
        }
        _handleUp() {
          this._setState("EnergySaver");
        }
        _handleDown() {
          this._setState("Privacy");
        }
        _handleEnter() {
          Router_default.navigate("settings/other/language");
        }
      }, class Privacy extends this {
        $enter() {
          this.tag("Privacy")._focus();
        }
        $exit() {
          this.tag("Privacy")._unfocus();
        }
        _handleUp() {
          this._setState("Language");
        }
        _handleDown() {
          this._setState("AdvancedSettings");
        }
        _handleEnter() {
          Router_default.navigate("settings/other/privacy");
        }
      }, class AdvancedSettings extends this {
        $enter() {
          this.tag("AdvancedSettings")._focus();
        }
        $exit() {
          this.tag("AdvancedSettings")._unfocus();
        }
        _handleUp() {
          this._setState("Privacy");
        }
        _handleDown() {
          this._setState("SleepTimer");
        }
        _handleEnter() {
          Router_default.navigate("settings/advanced");
        }
      }];
    }
  };

  // src/screens/SleepTimerScreen.js
  var SleepTimerScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Other Settings  Sleep Timer"));
    }
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        SleepTimer: {
          y: 275,
          x: 200,
          List: {
            w: 1920 - 300,
            type: Lightning_default.components.ListComponent,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true,
            rollMax: 900,
            itemScrollOffset: -5
          }
        }
      };
    }
    _init() {
      this.lastElement = false;
      this.options = [{
        value: "Off",
        tick: true
      }, {
        value: "15 Minutes",
        tick: false
      }, {
        value: "1 Hour",
        tick: false
      }, {
        value: "1.5 Hours",
        tick: false
      }, {
        value: "2 Hours",
        tick: false
      }, {
        value: "3 Hours",
        tick: false
      }];
      this.tag("List").h = this.options.length * 90;
      let timeoutInterval = Storage_default.get("TimeoutInterval");
      if (!timeoutInterval) {
        timeoutInterval = "Off";
      }
      let index = 0;
      this.tag("List").items = this.options.map((item, id) => {
        if (timeoutInterval === item.value) {
          index = id;
        }
        return {
          w: 1920 - 300,
          h: 90,
          type: SettingsItem,
          item: item.value
        };
      });
      this.tag("List").getElement(index).tag("Tick").visible = true;
      this.fireAncestors("$registerInactivityMonitoringEvents").then((res) => {
        this.fireAncestors("$resetSleepTimer", timeoutInterval);
      }).catch((err) => {
        console.error(`error while registering the inactivity monitoring event`);
      });
      this._setState("Options");
    }
    _handleBack() {
      Router_default.navigate("settings/other");
    }
    static _states() {
      return [class Options extends this {
        _getFocused() {
          return this.tag("List").element;
        }
        _handleDown() {
          this.tag("List").setNext();
        }
        _handleUp() {
          this.tag("List").setPrevious();
        }
        _handleEnter() {
          this.options.forEach((element, idx) => {
            this.tag("List").getElement(idx).tag("Tick").visible = false;
          });
          this.tag("List").element.tag("Tick").visible = true;
          this.fireAncestors("$sleepTimerText", this.options[this.tag("List").index].value);
          this.fireAncestors("$resetSleepTimer", this.options[this.tag("List").index].value);
        }
      }];
    }
  };

  // src/items/EnergySavingsItem.js
  var EnergySavingsItem = class extends Lightning_default.Component {
    _construct() {
      this.Tick = Utils_default.asset("/images/settings/Tick.png");
    }
    static _template() {
      return {
        zIndex: 1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        },
        Item: {
          w: 1920 - 300,
          h: 90,
          rect: true,
          color: 0
        },
        BottomLine: {
          y: 0 + 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        }
      };
    }
    _init() {
      if (this.isTicked) {
        this.fireAncestors("$resetPrevTickObject", this);
      }
      this.appApi = new AppApi();
    }
    _handleEnter() {
      var self = this;
      var standbyMode = "";
      if (this._item === "Deep Sleep") {
        standbyMode = "DEEP_SLEEP";
      } else if (this._item === "Light Sleep") {
        standbyMode = "LIGHT_SLEEP";
      }
      this.appApi.setPreferredStandbyMode(standbyMode).then((result) => {
        console.log("setPreferredStandbyMode " + JSON.stringify(result));
        self.fireAncestors("$resetPrevTickObject", self);
        this.fireAncestors("$updateStandbyMode", this._item);
        self.tag("Item.Tick").visible = true;
      });
    }
    set item(item) {
      this._item = item;
      var self = this;
      this.tag("Item").patch({
        Tick: {
          x: 10,
          y: 45,
          mountY: 0.5,
          texture: Lightning_default.Tools.getSvgTexture(this.Tick, 32.5, 32.5),
          color: 4294967295,
          visible: self.isTicked ? true : false
        },
        Left: {
          x: 50,
          y: 45,
          mountY: 0.5,
          text: {
            text: item,
            fontSize: 25,
            textColor: 4294967295,
            fontFace: CONFIG.language.font
          }
        }
      });
    }
    _focus() {
      this.tag("TopLine").color = CONFIG.theme.hex;
      this.tag("BottomLine").color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag("TopLine").h = 6;
      this.tag("BottomLine").h = 6;
    }
    _unfocus() {
      this.tag("TopLine").color = 4294967295;
      this.tag("BottomLine").color = 4294967295;
      this.patch({
        zIndex: 1
      });
      this.tag("TopLine").h = 3;
      this.tag("BottomLine").h = 3;
    }
  };

  // src/screens/OtherSettingsScreens/EnergySavingsScreen.js
  var EnergySavingsScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Other Settings  Energy Saver"));
    }
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        EnerygySavingContents: {
          x: 200,
          y: 275,
          List: {
            type: Lightning_default.components.ListComponent,
            w: 1920 - 300,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true,
            rollMax: 900,
            itemScrollOffset: -6
          },
          Loader: {
            x: 740,
            y: 340,
            w: 90,
            h: 90,
            mount: 0.5,
            zIndex: 4,
            src: Utils_default.asset("images/settings/Loading.gif"),
            visible: true
          }
        }
      };
    }
    $resetPrevTickObject(prevTicObject) {
      if (!this.prevTicOb) {
        this.prevTicOb = prevTicObject;
      } else {
        this.prevTicOb.tag("Item.Tick").visible = false;
        this.prevTicOb = prevTicObject;
      }
    }
    _handleBack() {
      Router_default.navigate("settings/other");
    }
    static _states() {
      return [class Options extends this {
        _getFocused() {
          return this.tag("List").element;
        }
        _handleDown() {
          this.tag("List").setNext();
        }
        _handleUp() {
          this.tag("List").setPrevious();
        }
        _handleEnter() {
          this.tag("List").element.tag("Tick").visible = true;
        }
      }];
    }
    _init() {
      this._appApi = new AppApi();
      this.options = ["Deep Sleep", "Light Sleep"];
      this.tag("EnerygySavingContents").h = this.options.length * 90;
      this.tag("EnerygySavingContents.List").h = this.options.length * 90;
      this.loadingAnimation = this.tag("Loader").animation({
        duration: 3,
        repeat: -1,
        stopMethod: "immediate",
        stopDelay: 0.2,
        actions: [{
          p: "rotation",
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
    }
    _unfocus() {
      if (this.loadingAnimation.isPlaying()) {
        this.loadingAnimation.stop();
      }
    }
    _focus() {
      this.loadingAnimation.start();
      var standbyMode = "";
      this._appApi.getPreferredStandbyMode().then((result) => {
        if (result.preferredStandbyMode == "LIGHT_SLEEP") {
          standbyMode = "Light Sleep";
        } else if (result.preferredStandbyMode == "DEEP_SLEEP") {
          standbyMode = "Deep Sleep";
        }
        this.tag("List").items = this.options.map((item, index) => {
          return {
            ref: "Option" + index,
            w: 1920 - 300,
            h: 90,
            type: EnergySavingsItem,
            isTicked: standbyMode === item ? true : false,
            item,
            energyItem: true
          };
        });
        this.loadingAnimation.stop();
        this.tag("Loader").visible = false;
        this._setState("Options");
      });
    }
  };

  // src/items/LanguageItem.js
  var LanguageItem = class extends SettingsItem {
    static _template() {
      return {
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        },
        Item: {
          w: 1600,
          h: 90
        },
        BottomLine: {
          y: 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        }
      };
    }
    _init() {
    }
    set item(item) {
      this.tag("Item").patch({
        Tick: {
          x: 10,
          y: 45,
          mountY: 0.5,
          w: 32.5,
          h: 32.5,
          src: Utils_default.asset("images/settings/Tick.png"),
          color: 4294967295,
          visible: localStorage.getItem("Language") === item ? true : item === "English" && localStorage.getItem("Language") === null ? true : false
        },
        Left: {
          x: 60,
          y: 45,
          mountY: 0.5,
          text: {
            text: item,
            fontSize: 25,
            textColor: COLORS.textColor,
            fontFace: CONFIG.language.font
          }
        }
      });
    }
    _focus() {
      this.tag("Item").color = COLORS.hightlightColor;
      this.tag("TopLine").color = CONFIG.theme.hex;
      this.tag("BottomLine").color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag("TopLine").h = 6;
      this.tag("BottomLine").h = 6;
    }
    _unfocus() {
      this.tag("TopLine").color = 4294967295;
      this.tag("BottomLine").color = 4294967295;
      this.patch({
        zIndex: 1
      });
      this.tag("TopLine").h = 3;
      this.tag("BottomLine").h = 3;
    }
  };

  // src/screens/OtherSettingsScreens/LanguageScreen.js
  var appApi3 = new AppApi();
  var thunder3 = thunderJS_default({
    host: "127.0.0.1",
    port: 9998,
    default: 1
  });
  var loader3 = "Loader";
  var LanguageScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Other Settings  Language"));
    }
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        LanguageScreenContents: {
          x: 200,
          y: 275,
          Languages: {
            flexItem: {
              margin: 0
            },
            List: {
              type: Lightning_default.components.ListComponent,
              w: 1920 - 300,
              itemSize: 90,
              horizontal: false,
              invertDirection: true,
              roll: true,
              rollMax: 900,
              itemScrollOffset: -4
            }
          }
        }
      };
    }
    _init() {
      this._Languages = this.tag("LanguageScreenContents.Languages");
      this._Languages.h = availableLanguages.length * 90;
      this._Languages.tag("List").h = availableLanguages.length * 90;
      this._Languages.tag("List").items = availableLanguages.map((item, index) => {
        return {
          ref: "Lng" + index,
          w: 1620,
          h: 90,
          type: LanguageItem,
          item
        };
      });
      appApi3.deactivateResidentApp(loader3);
      appApi3.setVisibility("ResidentApp", true);
      thunder3.call("org.rdk.RDKShell", "moveToFront", {
        client: "ResidentApp"
      }).then((result) => {
        console.log("ResidentApp moveToFront Success");
      });
      thunder3.call("org.rdk.RDKShell", "setFocus", {
        client: "ResidentApp"
      }).then((result) => {
        console.log("ResidentApp moveToFront Success");
      }).catch((err) => {
        console.log("Error", err);
      });
    }
    _focus() {
      this._setState("Languages");
    }
    _handleBack() {
      Router_default.navigate("settings/other");
    }
    static _states() {
      return [class Languages extends this {
        $enter() {
        }
        _getFocused() {
          return this._Languages.tag("List").element;
        }
        _handleDown() {
          this._navigate("down");
        }
        _handleUp() {
          this._navigate("up");
        }
        _handleEnter() {
          localStorage.setItem("Language", availableLanguages[this._Languages.tag("List").index]);
          let path = location.pathname.split("index.html")[0];
          let url = path.slice(-1) === "/" ? "static/loaderApp/index.html" : "/static/loaderApp/index.html";
          let notification_url = location.origin + path + url;
          console.log(notification_url);
          appApi3.launchResident(notification_url, loader3);
          appApi3.setVisibility("ResidentApp", false);
          location.reload();
        }
      }];
    }
    _navigate(dir) {
      let list = this._Languages.tag("List");
      if (dir === "down") {
        if (list.index < list.length - 1)
          list.setNext();
      } else if (dir === "up") {
        if (list.index > 0)
          list.setPrevious();
      }
    }
  };

  // src/screens/OtherSettingsScreens/PrivacyScreen.js
  var xcastApi = new XcastApi();
  var PrivacyScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Other Settings  Privacy"));
    }
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        PrivacyScreenContents: {
          x: 200,
          y: 275,
          LocalDeviceDiscovery: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Local Device Discovery"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 67,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/ToggleOffWhite.png")
            }
          },
          UsbMediaDevices: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("USB Media Devices"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 67,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/ToggleOffWhite.png")
            }
          },
          AudioInput: {
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Audio Input"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 67,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/ToggleOffWhite.png")
            }
          },
          ClearCookies: {
            y: 270,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Clear Cookies and App Data"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          PrivacyPolicy: {
            y: 360,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Privacy Policy and License"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          }
        }
      };
    }
    _init() {
      this._setState("LocalDeviceDiscovery");
      this.checkLocalDeviceStatus();
      this.USBApi = new UsbApi();
      this.AppApi = new AppApi();
    }
    _focus() {
      this._setState(this.state);
      this.checkLocalDeviceStatus();
      this.checkUSBDeviceStatus();
    }
    _handleBack() {
      Router_default.navigate("settings/other");
    }
    checkUSBDeviceStatus() {
      if (!Storage_default.get("UsbMedia")) {
        this.tag("UsbMediaDevices.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
        Storage_default.set("UsbMedia", "ON");
      } else if (Storage_default.get("UsbMedia") === "ON") {
        this.tag("UsbMediaDevices.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
      } else if (Storage_default.get("UsbMedia") === "OFF") {
        this.tag("UsbMediaDevices.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
      }
    }
    checkLocalDeviceStatus() {
      xcastApi.getEnabled().then((res) => {
        if (res.enabled) {
          this.tag("LocalDeviceDiscovery.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
        } else {
          this.tag("LocalDeviceDiscovery.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
        }
      }).catch((err) => {
        this.tag("LocalDeviceDiscovery.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
      });
    }
    toggleLocalDeviceDiscovery() {
      xcastApi.getEnabled().then((res) => {
        if (!res.enabled) {
          xcastApi.activate().then((res2) => {
            if (res2) {
              this.tag("LocalDeviceDiscovery.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
            }
          });
        } else {
          xcastApi.deactivate().then((res2) => {
            if (res2) {
              this.tag("LocalDeviceDiscovery.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
            }
          });
        }
      }).catch((err) => {
        console.log("Service not active");
        this.tag("LocalDeviceDiscovery.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
      });
    }
    static _states() {
      return [class LocalDeviceDiscovery extends this {
        $enter() {
          this.tag("LocalDeviceDiscovery")._focus();
        }
        $exit() {
          this.tag("LocalDeviceDiscovery")._unfocus();
        }
        _handleUp() {
          this._setState("PrivacyPolicy");
        }
        _handleDown() {
          this._setState("UsbMediaDevices");
        }
        _handleEnter() {
          this.toggleLocalDeviceDiscovery();
        }
      }, class UsbMediaDevices extends this {
        $enter() {
          this.tag("UsbMediaDevices")._focus();
        }
        $exit() {
          this.tag("UsbMediaDevices")._unfocus();
        }
        _handleUp() {
          this._setState("LocalDeviceDiscovery");
        }
        _handleDown() {
          this._setState("AudioInput");
        }
        _handleEnter() {
          let _UsbMedia = Storage_default.get("UsbMedia");
          if (_UsbMedia === "ON") {
            this.fireAncestors("$deRegisterUsbMount");
            this.USBApi.deactivate().then((res) => {
              Storage_default.set("UsbMedia", "OFF");
              this.tag("UsbMediaDevices.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
              this.widgets.menu.refreshMainView();
            }).catch((err) => {
              console.error(`error while disabling the usb plugin = ${err}`);
              this.fireAncestors("$registerUsbMount");
            });
          } else if (_UsbMedia === "OFF") {
            this.USBApi.activate().then((res) => {
              Storage_default.set("UsbMedia", "ON");
              this.tag("UsbMediaDevices.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
              this.fireAncestors("$registerUsbMount");
              this.widgets.menu.refreshMainView();
            });
          }
        }
      }, class AudioInput extends this {
        $enter() {
          this.tag("AudioInput")._focus();
        }
        $exit() {
          this.tag("AudioInput")._unfocus();
        }
        _handleUp() {
          this._setState("UsbMediaDevices");
        }
        _handleDown() {
          this._setState("ClearCookies");
        }
        _handleEnter() {
        }
      }, class ClearCookies extends this {
        $enter() {
          this.tag("ClearCookies")._focus();
        }
        $exit() {
          this.tag("ClearCookies")._unfocus();
        }
        _handleUp() {
          this._setState("AudioInput");
        }
        _handleDown() {
          this._setState("PrivacyPolicy");
        }
        _handleEnter() {
          this.AppApi.clearCache().then(() => {
          });
        }
      }, class PrivacyPolicy extends this {
        $enter() {
          this.tag("PrivacyPolicy")._focus();
        }
        $exit() {
          this.tag("PrivacyPolicy")._unfocus();
        }
        _handleUp() {
          this._setState("ClearCookies");
        }
        _handleDown() {
          this._setState("LocalDeviceDiscovery");
        }
        _handleEnter() {
          Router_default.navigate("settings/other/privacyPolicy");
        }
      }];
    }
  };

  // src/screens/OtherSettingsScreens/PrivacyPolicyScreen.js
  var _privacyPolicy = `Privacy
 Welcome to RDKCentral.com, a website owned and operated by RDK Management, LLC (\u201CRDK Management,\u201D \u201Cwe,\u201D or \u201Cus\u201D). This privacy policy discloses the privacy practices for this website only, including an explanation of:
 
 the categories of personally identifiable information about you that may be collected and how that information is used;
 how we collect and use non-personally identifiable information about your use of the website;
 the categories of persons or entities with whom the information may be shared;
 the choices that are available to you regarding collection, use, and distribution of the information;
 how you can opt out of RDK-related promotional e-mail;
 the kind of security procedures that are in place to protect the loss, misuse or alteration of information;
 how you can review and request changes to the information; and
 how we notify users of this website of changes to this privacy policy.
 Questions regarding this policy should be directed to \u201CRDK Management \u2013 Privacy Feedback\u201D and can be submitted via e-mail to info@rdkcentral.com.
 
 
 What categories of information do we collect?
 The information collected by RDK Management falls into two categories: (1) information voluntarily supplied by users of the website and (2) tracking information recorded as users navigate through the website. Some of this information is personally identifiable information (i.e., information that identifies a particular person, such as e-mail address), but much of it is not.
 
 To make use of some features on our website, like the RDK Wiki, users need to register and provide certain information as part of the registration process. We may ask, for example, for your name, e-mail address, street address, and zip code. We might also request information about your employer and the type of work that you do, in order to determine whether your employer is a member of the RDK program, to help us ensure that you are given access to the correct portions of the website, and to tailor our website content and e-mail (if you\u2019ve registered to receive e-mail) to your interests to make it more useful to you. If you are a registered user, our systems will remember some of this information the next time you log in and use our website, but you can always review and change your information by logging in and editing your profile here.
 
 The more you tell us about yourself, the more value we can offer you. Supplying this information is entirely voluntary. But if you choose not to supply the information, we may be unable to provide you with access to all of the features of this website. There are certain features of this website, including the Wiki and requesting to receive RDK-related promotional e-mail, that you will not be able to use unless you provide certain personally identifiable information about yourself. When you submit any personally identifiable information over this website, RDK Management (i) will use the information for the purposes described at the time you submit it and (ii) may use the information to contact you, subject to the contact preferences in your profile. If you want to remain completely anonymous, you\u2019re still free to take advantage of the publicly available content on our website without registration.
 
 Does RDK Management analyze my interaction with this website?
 Some of the third-party service providers that RDK Management uses to deliver services, like analytics providers, may collect information on this website as disclosed in this privacy policy. This information may include personally identifiable information or may be used to contact you online.
 
 We and our service providers may use cookies to provide these services. The World Wide Web Consortium (W3C) has started a process to develop a \u201CDo Not Track\u201D Standard. Since the definitions and rules for such a standard have not yet been defined, RDK Management does not yet respond to \u201CDo Not Track\u201D signals sent from browsers.
 
 You may opt out of receiving cookies from the companies that provide services on this website by going to www.networkadvertising.org/consumer/opt_out.asp or http://www.aboutads.info/choices.
 
 What categories of persons or entities do we share personally identifiable information with?
 We consider the personally identifiable information contained in our business records to be confidential. We may sometimes disclose personally identifiable information about you to our affiliates or to others who work for us. We may also disclose personally identifiable information about you to service providers and vendors, and to others who provide products and services to us. For example, when you use certain functions on this website you may notice that the website actually collecting or processing the information may be other than an RDK Management website. We may be required by law or legal process to disclose certain personally identifiable information about you to lawyers and parties in connection with litigation and to law enforcement personnel. For example, we may be required by law to disclose personally identifiable information about you without your consent and without notice in order to comply with a valid legal process such as a subpoena, court order, or search warrant.
 
 What do we do to personalize your use of this website?
 We, or our service providers, may customize this website based on non-personal information including: (i) the IP address associated with your computer for purposes of determining your approximate geographic location; (ii) the type of web page that is being displayed; or (iii) the content on the page that is shown. Because this activity automatically applies to all users and it is purely contextual, this type of content delivery cannot be customized or controlled by individual users. We may also personalize this website based on the information that you provided us during registration. You may modify this information as further described in this Privacy Policy.
 
 To help make our website more responsive to the needs of our users, we use a standard feature of browser software called a \u201Ccookie.\u201D We use cookies to help us tailor our website to your needs, to deliver a better, more personalized service, and to remember certain choices you\u2019ve made so you don\u2019t have to re-enter them.
 
 RDK Management uses cookies, among other things, to remember your username and password, if you choose to store them, as well as to remember some of your personalization preferences and website features. RDK Management does not store your name or other personal information in cookies. You may read about enabling, disabling, and deleting cookies here. Of course, if you set your browser not to accept cookies or you delete them, you may not be able to take advantage of the personalized features enjoyed by other users of our website.
 
 The cookies we use don\u2019t directly identify users of our website as particular persons. Rather, they contain information sufficient to simplify and improve a user\u2019s experience on our website. For example, we may use session-based cookies to track the pages on our website visited by our users. We can build a better website if we know which pages our users are visiting and how often. Or, we may use persistent cookies to simplify access to a user\u2019s account information over our website, for example.
 
 In connection with the standard operation of RDK Management\u2019s systems, certain non-personally identifiable information about users of this website is recorded. This information is used primarily to tailor and enhance users\u2019 experience using the website. We may use this information in an aggregate, non-personally identifiable form to, among other things, measure the use of our website and determine which pages are the most popular with website users.
 
 We may also use one or more audience segmenting technology providers to help present content on this website. These providers uses cookies, web beacons, or similar technologies on your computer or mobile or other device to serve you advertisements or content tailored to interests you have shown by browsing on this and other websites you have visited. It also helps determine whether you have seen a particular piece of content before and in order to avoid sending you duplicates. In doing so, these providers collect non-personally identifiable information such as your browser type, your operating system, web pages visited, time of visits, content viewed, ads viewed, and other click stream data. When you visit this website, these providers may use cookies or web beacons to note which product and service descriptions your browser visited. The use of cookies, web beacons, or similar technologies by these providers is subject to their own privacy policies, not RDK Management\u2019s privacy policy for this website. If you do not want the benefits of the cookies used by these providers, you may opt-out of them by visiting http://www.networkadvertising.org/consumer/opt_out.asp or by visiting their opt-out pages.
 
 Your Access to and Control over your information?
 You may opt out of any future contacts from us at any time. You can do the following at any time via email to support@rdkcentral.com or info@rdkcentral.com or unsubscribe to emails.
 
 Request to see all the information stored in the system
 Accuracy of your data can be checked or corrected.
 Personal data will be archived, in case user does not access our system for 90 days. However, user can request for deletion by writing to us at support@rdkcentral.com
 Express any concern you have about our use of your data
 Opt out from receiving emails by clicking unsubscribe.
 How do users opt out of RDK-related promotional e-mail?
 You can opt out of receiving RDK-related promotional e-mail from RDK Management using the opt-out link found in the footer of any of these e-mails. You can also e-mail the request to the attention of \u201CRDK Management \u2013 E-mail Opt Out\u201D via e-mail to info@rdkcentral.com.
 
 Other Websites
 
 To make our website more valuable to our users, we may offer some features in conjunction with other providers. Our website may also include links to other websites whose privacy policies and practices we don\u2019t control. Once you leave our website by linking to another one (you can tell where you are by checking the address \u2013 known as a URL \u2013 in the location bar on your browser), use of any information you provide is governed by the privacy policy of the operator of the website you\u2019re visiting. That policy may differ from ours. If you can\u2019t find the privacy policy of any of these websites via a link from the site\u2019s homepage, you should contact the website directly for more information.
 
 Security
 
 All information gathered on our website is stored within a database accessible only to RDK Management, its affiliates, and their specifically-authorized contractors and vendors. However, as effective as any security measure implemented by RDK Management may be, no security system is impenetrable. We cannot guarantee the complete security of our database, nor can we guarantee that information you supply won\u2019t be intercepted while being transmitted to us over the Internet. If you don\u2019t want us to know any particular information about you, don\u2019t include it in anything that you submit or post to this website or send to us in e-mail. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
 
 Changes to this Privacy Policy
 
 We may change this privacy policy from time to time. If we change this privacy policy at some point in the future, we\u2019ll post the changes on our website and by continuing to use the website after we post any changes, you accept and agree to this privacy statement, as modified.
 
 A Special Note About Children
 
 This website is not directed to children under the age of 13, and RDK Management does not knowingly collect personally identifiable information from anyone under the age of 18 on this website.
 
 Contacting us:
 
 If you have any questions about RDK Management, LLC privacy policy, the data we hold on you, or you would like to exercise one of your data protection rights, please do not hesitate to contact us.
 
 Data Protection Officer:  Herman-Jan Smith
 
 Email us at: hj.smith@rdkcentral.com
 
 Contacting the appropriate authority:
 
 Should you wish to report a complaint or if you feel that Our Company has not addressed your concern in a satisfactory manner, you may contact the Information Commissioner\u2019s Office.
 
 Email: compliance_team@rdkcentral.com
 
 Address:  1701 JFK Boulevard, Philadelphia, PA 19103 U.S.A`;
  var PrivacyPolicyScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Other Settings  Privacy  Policy"));
    }
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        clipping: true,
        PrivacyPolicy: {
          x: 200,
          y: 270,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: `Privacy Policy`,
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontStyle: "bold",
              fontSize: 40
            }
          },
          Content: {
            x: 10,
            y: 100,
            text: {
              text: _privacyPolicy,
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 20,
              wordWrapWidth: 1500,
              wordWrap: true
            }
          }
        }
      };
    }
    _handleDown() {
      if (this.tag("PrivacyPolicy").y > -2400) {
        this.tag("PrivacyPolicy").y -= 35;
      }
    }
    _handleBack() {
      Router_default.navigate("settings/other/privacy");
    }
    _handleUp() {
      if (this.tag("PrivacyPolicy").y <= 235) {
        this.tag("PrivacyPolicy").y += 35;
      }
    }
  };

  // src/api/CECApi.js
  var config3 = {
    host: "127.0.0.1",
    port: 9998,
    default: 1
  };
  var thunder4 = thunderJS_default(config3);
  var CECApi = class {
    activate() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.HdmiCec_2";
        thunder4.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          resolve(true);
        }).catch((err) => {
          console.log("CEC Error Activation", err);
        });
      });
    }
    deactivate() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.HdmiCec_2";
        thunder4.Controller.deactivate({
          callsign: systemcCallsign
        }).then(() => {
          resolve(true);
        }).catch((err) => {
          console.log("CEC Error Deactivation", err);
        });
      });
    }
    getEnabled() {
      return new Promise((resolve, reject) => {
        thunder4.call("org.rdk.HdmiCec_2", "getEnabled").then((result) => {
          resolve(result);
        }).catch((err) => {
          resolve({
            enabled: false
          });
        });
      });
    }
    setEnabled() {
      return new Promise((resolve, reject) => {
        thunder4.call("org.rdk.HdmiCec_2", "setEnabled", {
          enabled: true
        }).then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error("CEC Set Enabled", err);
          resolve({
            success: false
          });
        });
      });
    }
    performOTP() {
      return new Promise((resolve, reject) => {
        thunder4.call("org.rdk.HdmiCec_2", "performOTPAction").then((result) => {
          resolve(result);
        }).catch((err) => {
          console.error("CEC Otp Error", err);
          resolve({
            success: false
          });
        });
      });
    }
  };

  // src/screens/OtherSettingsScreens/AdvancedSettingsScreen.js
  var config4 = {
    host: "127.0.0.1",
    port: 9998,
    default: 1
  };
  var thunder5 = thunderJS_default(config4);
  var AdvanceSettingsScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Other Settings  Advanced Settings"));
    }
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        AdvanceScreenContents: {
          x: 200,
          y: 275,
          UIVoice: {
            alpha: 0.3,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "UI Voice",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          TTSOptions: {
            y: 90,
            alpha: 0.3,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "TTS Options",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          CECControl: {
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("CEC Control"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 67,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/ToggleOffWhite.png")
            }
          },
          Bug: {
            y: 270,
            alpha: 0.3,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Bug Report",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Contact: {
            alpha: 0.3,
            y: 360,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Contact Support",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Device: {
            y: 450,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Device"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          }
        }
      };
    }
    _init() {
      this.cecApi = new CECApi();
      this.cecApi.activate().then(() => {
        this.tag("CECControl.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
        this.performOTPAction();
      });
      this._setState("CECControl");
    }
    _focus() {
      this._setState(this.state);
    }
    _handleBack() {
      Router_default.navigate("settings/other");
    }
    performOTPAction() {
      this.cecApi.setEnabled().then((res) => {
        if (res.success) {
          this.cecApi.performOTP().then((otpRes) => {
            if (otpRes.success) {
              console.log("Otp Action success full");
            }
          });
        }
      });
    }
    toggleCEC() {
      this.cecApi.getEnabled().then((res) => {
        console.log(res);
        if (res.enabled) {
          this.cecApi.deactivate().then(() => {
            this.tag("CECControl.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
          });
        } else {
          this.cecApi.activate().then(() => {
            this.tag("CECControl.Button").src = Utils_default.asset("images/settings/ToggleOnOrange.png");
          });
        }
      });
    }
    static _states() {
      return [class UIVoice extends this {
        $enter() {
          this.tag("UIVoice")._focus();
        }
        $exit() {
          this.tag("UIVoice")._unfocus();
        }
        _handleUp() {
        }
        _handleDown() {
        }
        _handleEnter() {
        }
      }, class TTSOptions extends this {
        $enter() {
          this.tag("TTSOptions")._focus();
        }
        $exit() {
          this.tag("TTSOptions")._unfocus();
        }
        _handleUp() {
        }
        _handleDown() {
        }
        _handleEnter() {
        }
      }, class CECControl extends this {
        $enter() {
          this.tag("CECControl")._focus();
        }
        $exit() {
          this.tag("CECControl")._unfocus();
        }
        _handleUp() {
        }
        _handleDown() {
          this._setState("Device");
        }
        _handleEnter() {
          this.toggleCEC();
        }
      }, class Bug extends this {
        $enter() {
          this.tag("Bug")._focus();
        }
        $exit() {
          this.tag("Bug")._unfocus();
        }
        _handleUp() {
        }
        _handleDown() {
        }
        _handleEnter() {
        }
      }, class Contact extends this {
        $enter() {
          this.tag("Contact")._focus();
        }
        $exit() {
          this.tag("Contact")._unfocus();
        }
        _handleUp() {
        }
        _handleDown() {
        }
        _handleEnter() {
        }
      }, class Device extends this {
        $enter() {
          this.tag("Device")._focus();
        }
        $exit() {
          this.tag("Device")._unfocus();
        }
        _handleUp() {
          this._setState("CECControl");
        }
        _handleDown() {
        }
        _handleEnter() {
          Router_default.navigate("settings/advanced/device");
        }
      }];
    }
  };

  // src/screens/OtherSettingsScreens/DeviceScreen.js
  var DeviceScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Other Settings  Advanced Settings  Device"));
    }
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        DeviceScreenContents: {
          x: 200,
          y: 275,
          Info: {
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Info"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Firmware: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Check for Firmware Update"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Reboot: {
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Reboot"),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          Reset: {
            y: 270,
            alpha: 0.3,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Factory Reset",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          }
        }
      };
    }
    _init() {
      this._appApi = new AppApi();
      this._setState("Info");
    }
    _focus() {
      this._setState(this.state);
    }
    _handleBack() {
      Router_default.navigate("settings/advanced");
    }
    static _states() {
      return [class Info extends this {
        $enter() {
          this.tag("Info")._focus();
        }
        $exit() {
          this.tag("Info")._unfocus();
        }
        _handleUp() {
          this._setState("Reboot");
        }
        _handleDown() {
          this._setState("Firmware");
        }
        _handleEnter() {
          Router_default.navigate("settings/advanced/device/info");
        }
      }, class Firmware extends this {
        $enter() {
          this.tag("Firmware")._focus();
        }
        $exit() {
          this.tag("Firmware")._unfocus();
        }
        _handleUp() {
          this._setState("Info");
        }
        _handleDown() {
          this._setState("Reboot");
        }
        _handleEnter() {
          Router_default.navigate("settings/advanced/device/firmware");
        }
      }, class Reboot extends this {
        $enter() {
          this.tag("Reboot")._focus();
        }
        $exit() {
          this.tag("Reboot")._unfocus();
        }
        _handleUp() {
          this._setState("Firmware");
        }
        _handleDown() {
          this._setState("Info");
        }
        _handleEnter() {
          Router_default.navigate("settings/advanced/device/reboot");
        }
      }, class Reset extends this {
        $enter() {
          this.tag("Reset")._focus();
        }
        $exit() {
          this.tag("Reset")._unfocus();
        }
        _handleUp() {
        }
        _handleDown() {
        }
        _handleEnter() {
        }
      }];
    }
  };

  // src/screens/OtherSettingsScreens/DeviceInformationScreen.js
  var DeviceInformationScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Other Settings  Advanced Settings  Device  Info"));
    }
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        h: 1080,
        w: 1920,
        color: 4278190080,
        DeviceInfoContents: {
          x: 200,
          y: 275,
          Line1: {
            y: 0,
            mountY: 0.5,
            w: 1600,
            h: 3,
            rect: true,
            color: 4294967295
          },
          ChipSet: {
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate(`Chipset`),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 400,
              y: 45,
              mountY: 0.5,
              text: {
                text: `N/A`,
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          Line2: {
            y: 90,
            mountY: 0.5,
            w: 1600,
            h: 3,
            rect: true,
            color: 4294967295
          },
          SerialNumber: {
            Title: {
              x: 10,
              y: 135,
              mountY: 0.5,
              text: {
                text: Language_default.translate(`Serial Number`),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 400,
              y: 135,
              mountY: 0.5,
              text: {
                text: `N/A`,
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          Line3: {
            y: 180,
            mountY: 0.5,
            w: 1600,
            h: 3,
            rect: true,
            color: 4294967295
          },
          Location: {
            Title: {
              x: 10,
              y: 225,
              mountY: 0.5,
              text: {
                text: Language_default.translate(`Location`),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 400,
              y: 225,
              mountY: 0.5,
              text: {
                text: `City: N/A , Country: N/A `,
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          Line4: {
            y: 270,
            mountY: 0.5,
            w: 1600,
            h: 3,
            rect: true,
            color: 4294967295
          },
          SupportedDRM: {
            Title: {
              x: 10,
              y: 360,
              mountY: 0.5,
              text: {
                text: Language_default.translate(`Supported DRM & Key-System`),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                wordWrapWidth: 1600,
                wordWrap: true,
                fontSize: 25
              }
            },
            Value: {
              x: 400,
              y: 360,
              mountY: 0.5,
              text: {
                text: `N/A`,
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                wordWrapWidth: 1200,
                wordWrap: true,
                fontSize: 25
              }
            }
          },
          Line5: {
            y: 450,
            mountY: 0.5,
            w: 1600,
            h: 3,
            rect: true,
            color: 4294967295
          },
          FirmwareVersions: {
            Title: {
              x: 10,
              y: 540,
              mountY: 0.5,
              text: {
                text: Language_default.translate(`Firmware version`),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 400,
              y: 540,
              mountY: 0.5,
              text: {
                text: `UI Version: 3.5, Build Version: , Timestamp: `,
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          Line6: {
            y: 630,
            mountY: 0.5,
            w: 1600,
            h: 3,
            rect: true,
            color: 4294967295
          },
          AppVersions: {
            Title: {
              x: 10,
              y: 720,
              mountY: 0.5,
              text: {
                text: Language_default.translate(`App Versions`),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Value: {
              x: 400,
              y: 720,
              mountY: 0.5,
              text: {
                text: "Youtube:\nAmazon Prime:\nNetflix:",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          Line7: {
            y: 810,
            mountY: 0.5,
            w: 1600,
            h: 3,
            rect: true,
            color: 4294967295
          }
        }
      };
    }
    _focus() {
      this._setState("DeviceInformationScreen");
      this.appApi = new AppApi();
      this.appApi.getSerialNumber().then((result) => {
        this.tag("SerialNumber.Value").text.text = `${result.serialNumber}`;
      });
      this.appApi.getSystemVersions().then((res) => {
        this.tag("FirmwareVersions.Value").text.text = `UI Version - 3.5 
Build Version - ${res.stbVersion} 
Time Stamp - ${res.stbTimestamp} `;
      }).catch((err) => {
        console.error(`error while getting the system versions`);
      });
      this.appApi.getDRMS().then((result) => {
        console.log("from device info supported drms " + JSON.stringify(result));
        var drms = "";
        result.forEach((element) => {
          drms += `${element.name} :`;
          if (element.keysystems) {
            drms += "	";
            element.keysystems.forEach((keySystem) => {
              drms += `${keySystem}, `;
            });
            drms += "\n";
          } else {
            drms += "\n";
          }
        });
        this.tag("SupportedDRM.Value").text.text = `${drms.substring(0, drms.length - 1)}`;
      });
      this.appApi.getLocation().then((result) => {
        console.log("getLocation from device info " + JSON.stringify(result));
        var locationInfo = "";
        if (result.city.length !== 0) {
          locationInfo = "City: " + result.city;
        } else {
          locationInfo = "City: N/A ";
        }
        if (result.country.length !== 0) {
          locationInfo += ", Country: " + result.country;
        } else {
          locationInfo += ", Country: N/A ";
        }
        this.tag("Location.Value").text.text = `${locationInfo}`;
      });
      this.appApi.getDeviceIdentification().then((result) => {
        console.log("from device Information screen getDeviceIdentification: " + JSON.stringify(result));
        this.tag("ChipSet.Value").text.text = `${result.chipset}`;
      });
      this.appApi.registerChangeLocation();
    }
    _handleBack() {
      Router_default.navigate("settings/advanced/device");
    }
    _handleDown() {
      if (this.tag("DeviceInfoContents").y > 215) {
        this.tag("DeviceInfoContents").y -= 20;
      }
    }
    _handleUp() {
      if (this.tag("DeviceInfoContents").y < 275) {
        this.tag("DeviceInfoContents").y += 20;
      }
    }
  };

  // src/screens/OtherSettingsScreens/FirmwareScreen.js
  var FirmwareScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Other Settings  Advanced Settings  Device  Firmware Update"));
    }
    pageTransition() {
      return "left";
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        FirmwareContents: {
          x: 200,
          y: 270,
          State: {
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Firmware State: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 22
              }
            }
          },
          Version: {
            Title: {
              x: 10,
              y: 90,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Firmware Versions: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 22
              }
            }
          },
          DownloadedVersion: {
            Title: {
              x: 10,
              y: 135,
              mountY: 0.5,
              text: {
                text: Language_default.translate(`Downloaded Firmware Version: `),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 22
              }
            }
          },
          DownloadedPercent: {
            Title: {
              x: 10,
              y: 180,
              mountY: 0.5,
              text: {
                text: "",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 22
              }
            }
          },
          FirmwareUpdate: {
            RectangleDefault: {
              x: 110,
              y: 200,
              w: 200,
              mountX: 0.5,
              h: 50,
              rect: true,
              color: CONFIG.theme.hex,
              Update: {
                x: 100,
                y: 25,
                mount: 0.5,
                text: {
                  text: "Check for Update",
                  fontFace: CONFIG.language.font,
                  fontSize: 24
                }
              }
            }
          }
        }
      };
    }
    _init() {
      let state3 = ["Uninitialized", "Requesting", "Downloading", "Failed", "DownLoad Complete", "Validation Complete", "Preparing to Reboot"];
      const config7 = {
        host: "127.0.0.1",
        port: 9998,
        default: 1
      };
      const thunder9 = thunderJS_default(config7);
      const systemcCallsign = "org.rdk.System.1";
      thunder9.Controller.activate({
        callsign: systemcCallsign
      }).then((res) => {
        thunder9.on(callsign, "onFirmwareUpdateStateChange", (notification) => {
          console.log(`Tanjirou's notification : on Firmware update state changed notifcation = ${JSON.stringify(notification)}`);
          if (state3[notification.firmwareUpdateStateChange] == "Downloading") {
            this.downloadInterval = setInterval(() => {
              console.log(`Downloading...`);
              this.getDownloadPercent();
            }, 1e3);
          } else if (state3[notification.firmwareUpdateStateChange] != "Downloading" && this.downloadInterval) {
            clearInterval(this.downloadInterval);
            this.downloadInterval = null;
          }
        }, (err) => {
          console.error(`error while fetching notification ie. ${err}`);
        });
      }).catch((err) => {
        console.error(`error while activating the system plugin`);
      });
    }
    _unfocus() {
      if (this.downloadInterval) {
        clearInterval(this.downloadInterval);
        this.downloadInterval = null;
      }
    }
    _focus() {
      this.downloadInterval = null;
      this._appApi = new AppApi();
      const downloadState = ["Uninitialized", "Requesting", "Downloading", "Failed", "DownLoad Complete", "Validation Complete", "Preparing to Reboot"];
      this._appApi.getFirmwareUpdateState().then((res) => {
        console.log("getFirmwareUpdateState from firmware screen " + JSON.stringify(res));
        this.tag("State.Title").text.text = Language_default.translate("Firmware State: ") + downloadState[res.firmwareUpdateState];
      });
      this._appApi.getDownloadFirmwareInfo().then((res) => {
        console.log("getDownloadFirmwareInfo from firmware screen " + JSON.stringify(res));
        this.tag("Version.Title").text.text = Language_default.translate("Firmware Versions: ") + res.currentFWVersion;
      });
      this._setState("FirmwareUpdate");
    }
    getDownloadPercent() {
      this._appApi.getFirmwareDownloadPercent().then((res) => {
        console.log(`getFirmwareDownloadPercent : ${JSON.stringify(res)}`);
        if (res.downloadPercent < 0) {
          this.tag("DownloadedPercent.Title").text.text = "";
        } else {
          this.tag("DownloadedPercent.Title").text.text = Language_default.translate("Download Progress: ") + res.downloadPercent + "%";
        }
      }).catch((err) => {
        console.error(err);
      });
    }
    getDownloadFirmwareInfo() {
      this._appApi.updateFirmware().then((res) => {
        this._appApi.getDownloadFirmwareInfo().then((result) => {
          console.log(`getDownloadFirmwareInfo : ${JSON.stringify(result.downloadFWVersion)}`);
          this.tag("DownloadedVersion.Title").text.text = Language_default.translate("Downloaded Firmware Version: ") + `${result.downloadFWVersion ? result.downloadFWVersion : "NA"}`;
        }).catch((err) => {
          console.error(err);
        });
      }).catch((err) => {
        console.error(err);
      });
    }
    _handleBack() {
      Router_default.navigate("settings/advanced/device");
    }
    static _states() {
      return [class FirmwareUpdate extends this {
        _handleEnter() {
          this.getDownloadFirmwareInfo();
          this.getDownloadPercent();
        }
      }];
    }
  };

  // src/screens/OtherSettingsScreens/RebootConfirmationScreen.js
  var appApi4 = new AppApi();
  var RebootConfirmationScreen = class extends Lightning_default.Component {
    static _template() {
      return {
        w: 1920,
        h: 2e3,
        rect: true,
        color: 4278190080,
        RebootScreen: {
          x: 950,
          y: 270,
          Title: {
            x: 0,
            y: 0,
            mountX: 0.5,
            text: {
              text: "Reboot",
              fontFace: CONFIG.language.font,
              fontSize: 40,
              textColor: CONFIG.theme.hex
            }
          },
          BorderTop: {
            x: 0,
            y: 75,
            w: 1558,
            h: 3,
            rect: true,
            mountX: 0.5
          },
          Info: {
            x: 0,
            y: 125,
            mountX: 0.5,
            text: {
              text: "Click Confirm to reboot!",
              fontFace: CONFIG.language.font,
              fontSize: 25
            }
          },
          Buttons: {
            x: 100,
            y: 200,
            w: 440,
            mountX: 0.5,
            h: 50,
            Confirm: {
              x: 0,
              w: 200,
              mountX: 0.5,
              h: 50,
              rect: true,
              color: 4294967295,
              Title: {
                x: 100,
                y: 25,
                mount: 0.5,
                text: {
                  text: "Confirm",
                  fontFace: CONFIG.language.font,
                  fontSize: 22,
                  textColor: 4278190080
                }
              }
            },
            Cancel: {
              x: 220,
              w: 200,
              mountX: 0.5,
              h: 50,
              rect: true,
              color: 4286414205,
              Title: {
                x: 100,
                y: 25,
                mount: 0.5,
                text: {
                  text: "Cancel",
                  fontFace: CONFIG.language.font,
                  fontSize: 22,
                  textColor: 4278190080
                }
              }
            }
          },
          BorderBottom: {
            x: 0,
            y: 300,
            w: 1558,
            h: 3,
            rect: true,
            mountX: 0.5
          },
          Loader: {
            x: 0,
            y: 150,
            mountX: 0.5,
            w: 90,
            h: 90,
            zIndex: 2,
            src: Utils_default.asset("images/settings/Loading.gif"),
            visible: false
          }
        }
      };
    }
    _focus() {
      this._setState("Confirm");
      this.loadingAnimation = this.tag("Loader").animation({
        duration: 3,
        repeat: -1,
        stopMethod: "immediate",
        stopDelay: 0.2,
        actions: [{
          p: "rotation",
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
    }
    _handleBack() {
      Router_default.navigate("settings/advanced/device");
    }
    static _states() {
      return [class Confirm extends this {
        $enter() {
          this._focus();
        }
        _handleEnter() {
          appApi4.reboot().then((result) => {
            console.log("device rebooting" + JSON.stringify(result));
            this._setState("Rebooting");
          });
        }
        _handleRight() {
          this._setState("Cancel");
        }
        _focus() {
          this.tag("Confirm").patch({
            color: CONFIG.theme.hex
          });
          this.tag("Confirm.Title").patch({
            text: {
              textColor: 4294967295
            }
          });
        }
        _unfocus() {
          this.tag("Confirm").patch({
            color: 4294967295
          });
          this.tag("Confirm.Title").patch({
            text: {
              textColor: 4278190080
            }
          });
        }
        $exit() {
          this._unfocus();
        }
      }, class Cancel extends this {
        $enter() {
          this._focus();
        }
        _handleEnter() {
          Router_default.back();
        }
        _handleLeft() {
          this._setState("Confirm");
        }
        _focus() {
          this.tag("Cancel").patch({
            color: CONFIG.theme.hex
          });
          this.tag("Cancel.Title").patch({
            text: {
              textColor: 4294967295
            }
          });
        }
        _unfocus() {
          this.tag("Cancel").patch({
            color: 4286414205
          });
          this.tag("Cancel.Title").patch({
            text: {
              textColor: 4278190080
            }
          });
        }
        $exit() {
          this._unfocus();
        }
      }, class Rebooting extends this {
        $enter() {
          this.loadingAnimation.start();
          this.tag("Loader").visible = true;
          this.tag("Title").text.text = "Rebooting...";
          this.tag("Buttons").visible = false;
          this.tag("Info").visible = false;
        }
        _handleEnter() {
        }
        _handleLeft() {
        }
        _handleRight() {
        }
        _handleBack() {
        }
        _handleUp() {
        }
        _handleDown() {
        }
        _handleKey(key) {
          console.log("key press after reboot ", key);
        }
        _captureKey(key) {
          if (key) {
            console.log("capture key press after reboot ", key);
          }
        }
      }];
    }
  };

  // src/routes/otherSettingsRoutes.js
  var otherSettingsRoutes_default = {
    otherSettingsRoutes: [{
      path: "settings/other",
      component: OtherSettingsScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/other/timer",
      component: SleepTimerScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/other/energy",
      component: EnergySavingsScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/other/language",
      component: LanguageScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/other/privacy",
      component: PrivacyScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/other/privacyPolicy",
      component: PrivacyPolicyScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/advanced",
      component: AdvanceSettingsScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/advanced/device",
      component: DeviceScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/advanced/device/info",
      component: DeviceInformationScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/advanced/device/firmware",
      component: FirmwareScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/advanced/device/reboot",
      component: RebootConfirmationScreen
    }]
  };

  // src/screens/VideoAndAudioScreens/AudioScreen.js
  var AudioScreen = class extends Lightning_default.Component {
    pageTransition() {
      return "left";
    }
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Audio"));
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        Wrapper: {
          x: 200,
          y: 275,
          AudioOutput: {
            alpha: 0.3,
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Audio Output: HDMI",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          OutputMode: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Output Mode: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          DynamicRange: {
            alpha: 0.3,
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Full Dynamic Range",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          AudioLanguage: {
            y: 270,
            alpha: 0.3,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Audio Language: Auto",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          NavigationFeedback: {
            y: 360,
            alpha: 0.3,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Navigation Feedback",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 66,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/ToggleOnWhite.png")
            }
          },
          Bluetooth: {
            alpha: 0.3,
            y: 450,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Bluetooth: None",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          }
        }
      };
    }
    _init() {
      this.appApi = new AppApi();
      this._setState("OutputMode");
    }
    _focus() {
      this._setState(this.state);
      this.appApi.getSoundMode().then((result) => {
        this.tag("OutputMode.Title").text.text = Language_default.translate("Output Mode: ") + result.soundMode;
      });
    }
    hide() {
      this.tag("Wrapper").visible = false;
    }
    show() {
      this.tag("Wrapper").visible = true;
    }
    _handleBack() {
      Router_default.navigate("settings");
    }
    static _states() {
      return [class AudioOutput extends this {
        $enter() {
          this.tag("AudioOutput")._focus();
        }
        $exit() {
          this.tag("AudioOutput")._unfocus();
        }
        _handleDown() {
          this._setState("OutputMode");
        }
        _handleEnter() {
          Router_default.navigate("settings/audio/output");
        }
      }, class OutputMode extends this {
        $enter() {
          this.tag("OutputMode")._focus();
        }
        $exit() {
          this.tag("OutputMode")._unfocus();
        }
        _handleUp() {
        }
        _handleDown() {
        }
        _handleEnter() {
          Router_default.navigate("settings/audio/output");
        }
      }, class DynamicRange extends this {
        $enter() {
          this.tag("DynamicRange")._focus();
        }
        $exit() {
          this.tag("DynamicRange")._unfocus();
        }
        _handleUp() {
          this._setState("OutputMode");
        }
        _handleDown() {
          this._setState("Bluetooth");
        }
        _handleEnter() {
          this.appApi.getDRCMode().then((res) => {
          }).catch((err) => {
            console.log(err);
          });
          this.appApi.setVolumeLevel("HDMI0", 100).then((res) => {
            this.appApi.getVolumeLevel().catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
          this.appApi.getConnectedAudioPorts().then((res) => {
          }).catch((err) => {
            console.log(err);
          });
          this.appApi.getEnableAudioPort("HDMI0").then((res) => {
          }).catch((err) => {
            console.log(err);
          });
          this.appApi.getSupportedAudioPorts().catch((err) => {
            console.log(`Error while getting the supported Audio ports ie. ${err}`);
          });
          this.appApi.setEnableAudioPort("HDMI0").then((res) => {
            this.appApi.getEnableAudioPort("HDMI0").then((res2) => {
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
          this.appApi.setZoomSetting("FULL").then((res) => {
            this.appApi.getZoomSetting().then((res2) => {
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        }
      }, class NavigationFeedback extends this {
        $enter() {
          this.tag("NavigationFeedback")._focus();
        }
        $exit() {
          this.tag("NavigationFeedback")._unfocus();
        }
        _handleUp() {
          this._setState("DynamicRange");
        }
        _handleDown() {
          this._setState("Bluetooth");
        }
        _handleEnter() {
        }
      }, class Bluetooth extends this {
        $enter() {
          this.tag("Bluetooth")._focus();
        }
        $exit() {
          this.tag("Bluetooth")._unfocus();
        }
        _handleUp() {
          this._setState("DynamicRange");
        }
      }];
    }
  };

  // src/items/VideoAndAudioItem.js
  var VideoAndAudioItem = class extends Lightning_default.Component {
    _construct() {
      this.Tick = Utils_default.asset("/images/settings/Tick.png");
    }
    static _template() {
      return {
        zIndex: 1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        },
        Item: {
          w: 1920 - 300,
          h: 90,
          rect: true,
          color: 0
        },
        BottomLine: {
          y: 0 + 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 4294967295
        }
      };
    }
    _init() {
      if (this.isTicked) {
        this.fireAncestors("$resetPrevTickObject", this);
      }
      this.appApi = new AppApi();
    }
    _handleEnter() {
      if (this.videoElement === true) {
        this.appApi.setResolution(this._item).catch((err) => {
          console.log(`there was an error while setting the resolution.`);
        });
      } else {
        this.appApi.setSoundMode(this._item).then((result) => {
          if (result.success === true) {
            this.fireAncestors("$resetPrevTickObject", this);
            this.tag("Item.Tick").visible = true;
          }
          this.fireAncestors("$updateSoundMode", this._item);
        }).catch((err) => {
          console.log("Some error while setting the sound mode ", err);
        });
      }
    }
    set item(item) {
      this._item = item;
      this.tag("Item").patch({
        Tick: {
          x: 10,
          y: 45,
          mountY: 0.5,
          texture: Lightning_default.Tools.getSvgTexture(this.Tick, 32.5, 32.5),
          color: 4294967295,
          visible: this.isTicked ? true : false
        },
        Left: {
          x: 50,
          y: 45,
          mountY: 0.5,
          text: {
            text: item,
            fontSize: 25,
            textColor: 4294967295,
            fontFace: CONFIG.language.font
          }
        }
      });
    }
    _focus() {
      this.tag("TopLine").color = CONFIG.theme.hex;
      this.tag("BottomLine").color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag("TopLine").h = 6;
      this.tag("BottomLine").h = 6;
    }
    _unfocus() {
      this.tag("TopLine").color = 4294967295;
      this.tag("BottomLine").color = 4294967295;
      this.patch({
        zIndex: 1
      });
      this.tag("TopLine").h = 3;
      this.tag("BottomLine").h = 3;
    }
  };

  // src/screens/VideoAndAudioScreens/HdmiOutputScreen.js
  var appApi5 = new AppApi();
  var HdmiOutputScreen = class extends Lightning_default.Component {
    pageTransition() {
      return "left";
    }
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Audio  Output Mode"));
    }
    static _template() {
      return {
        w: 1920,
        h: 1080,
        rect: true,
        color: 4278190080,
        HdmiOutputScreenContents: {
          x: 200,
          y: 275,
          List: {
            type: Lightning_default.components.ListComponent,
            w: 1920 - 300,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true
          },
          Loader: {
            x: 740,
            y: 340,
            w: 90,
            h: 90,
            mount: 0.5,
            zIndex: 4,
            src: Utils_default.asset("images/settings/Loading.gif"),
            visible: true
          }
        }
      };
    }
    $resetPrevTickObject(prevTicObject) {
      if (!this.prevTicOb) {
        this.prevTicOb = prevTicObject;
      } else {
        this.prevTicOb.tag("Item.Tick").visible = false;
        this.prevTicOb = prevTicObject;
      }
    }
    _unfocus() {
      if (this.loadingAnimation.isPlaying()) {
        this.loadingAnimation.stop();
      }
    }
    _init() {
      this.loadingAnimation = this.tag("Loader").animation({
        duration: 3,
        repeat: -1,
        stopMethod: "immediate",
        stopDelay: 0.2,
        actions: [{
          p: "rotation",
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
    }
    _focus() {
      this.loadingAnimation.start();
      var options = [];
      appApi5.getSoundMode().then((result) => {
        appApi5.getSupportedAudioModes().then((res) => {
          options = [...res.supportedAudioModes];
          this.tag("HdmiOutputScreenContents").h = options.length * 90;
          this.tag("HdmiOutputScreenContents.List").h = options.length * 90;
          this.tag("HdmiOutputScreenContents.List").items = options.map((item, index) => {
            return {
              ref: "Option" + index,
              w: 1920 - 300,
              h: 90,
              type: VideoAndAudioItem,
              isTicked: result.soundMode === item ? true : false,
              item,
              videoElement: false
            };
          });
          this.loadingAnimation.stop();
          this.tag("Loader").visible = false;
          this._setState("Options");
        }).catch((err) => {
          console.log("error", err);
        });
      }).catch((err) => {
        console.log("error", JSON.stringify(err));
      });
    }
    _handleBack() {
      Router_default.navigate("settings/audio");
    }
    static _states() {
      return [class Options extends this {
        _getFocused() {
          return this.tag("HdmiOutputScreenContents.List").element;
        }
        _handleDown() {
          this.tag("HdmiOutputScreenContents.List").setNext();
        }
        _handleUp() {
          this.tag("HdmiOutputScreenContents.List").setPrevious();
        }
      }];
    }
  };

  // src/screens/VideoAndAudioScreens/ResolutionScreen.js
  var thunder6 = thunderJS_default({
    host: "127.0.0.1",
    port: 9998,
    default: 1
  });
  var ResolutionScreen = class extends Lightning_default.Component {
    pageTransition() {
      return "left";
    }
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Video  Resolution"));
    }
    static _template() {
      return {
        w: 1920,
        h: 1080,
        rect: true,
        color: 4278190080,
        ResolutionScreenContents: {
          x: 200,
          y: 275,
          List: {
            type: Lightning_default.components.ListComponent,
            w: 1920 - 300,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true,
            rollMax: 900,
            itemScrollOffset: -6
          },
          Loader: {
            x: 740,
            y: 340,
            w: 90,
            h: 90,
            mount: 0.5,
            zIndex: 4,
            src: Utils_default.asset("images/settings/Loading.gif")
          }
        }
      };
    }
    _init() {
      this.appApi = new AppApi();
      this.appApi.activateDisplaySettings();
      this.loadingAnimation = this.tag("Loader").animation({
        duration: 3,
        repeat: -1,
        stopMethod: "immediate",
        stopDelay: 0.2,
        actions: [{
          p: "rotation",
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
      thunder6.on("org.rdk.DisplaySettings", "resolutionChanged", (notification) => {
        const items = this.tag("List").items;
        items.forEach((element) => {
          element.tag("Item.Tick").visible = false;
          if (element._item === notification.resolution) {
            element.tag("Item.Tick").visible = true;
          }
        });
      });
    }
    _unfocus() {
      if (this.loadingAnimation.isPlaying()) {
        this.loadingAnimation.stop();
      }
    }
    _handleBack() {
      Router_default.navigate("settings/video");
    }
    _focus() {
      this.loadingAnimation.start();
      var options = [];
      var sIndex = 0;
      this.appApi.getResolution().then((resolution) => {
        this.appApi.getSupportedResolutions().then((res) => {
          options = [...res];
          this.tag("ResolutionScreenContents").h = options.length * 90;
          this.tag("ResolutionScreenContents.List").h = options.length * 90;
          this.tag("List").items = options.map((item, index) => {
            var bool = false;
            if (resolution === item) {
              bool = true;
              sIndex = index;
            }
            return {
              ref: "Option" + index,
              w: 1920 - 300,
              h: 90,
              type: VideoAndAudioItem,
              isTicked: bool,
              item,
              videoElement: true
            };
          });
          this.loadingAnimation.stop();
          this.tag("Loader").visible = false;
          this.tag("List").setIndex(sIndex);
          this._setState("Options");
        }).catch((err) => {
          console.log(`error while fetching the supported resolution ${err}`);
        });
      });
    }
    static _states() {
      return [class Options extends this {
        _getFocused() {
          return this.tag("List").element;
        }
        _handleDown() {
          this.tag("List").setNext();
        }
        _handleUp() {
          this.tag("List").setPrevious();
        }
        _handleEnter() {
        }
      }];
    }
  };

  // src/screens/VideoAndAudioScreens/VideoScreen.js
  var VideoScreen = class extends Lightning_default.Component {
    pageTransition() {
      return "left";
    }
    _onChanged() {
      this.widgets.menu.updateTopPanelText(Language_default.translate("Settings  Video"));
    }
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 1080,
        VideoScreenContents: {
          x: 200,
          y: 275,
          Resolution: {
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("Resolution: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          HDR: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("High Dynamic Range: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          MatchContent: {
            alpha: 0.3,
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Match Content: Match Dynamic Range",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          OutputFormat: {
            alpha: 0.3,
            y: 270,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Output Format: YCbCr",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          Chroma: {
            alpha: 0.3,
            y: 360,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Chroma: 4:4:4",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1600,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils_default.asset("images/settings/Arrow.png")
            }
          },
          HDCP: {
            y: 450,
            h: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language_default.translate("HDCP Status: "),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          }
        }
      };
    }
    _init() {
      this._appApi = new AppApi();
      this._setState("Resolution");
    }
    _focus() {
      this._appApi.getResolution().then((resolution) => {
        this.tag("Resolution.Title").text.text = Language_default.translate("Resolution: ") + resolution;
      }).catch((err) => {
        console.log("Error fetching the Resolution");
      });
      this._appApi.getHDCPStatus().then((result) => {
        if (result.isHDCPCompliant && result.isHDCPEnabled) {
          this.tag("HDCP.Title").text.text = `${Language_default.translate("HDCP Status: ")}Enabled, Version: ${result.currentHDCPVersion}`;
        } else {
          this.tag("HDCP.Title").text.text = `${Language_default.translate("HDCP Status: ")}Not Supported `;
        }
      });
      this._appApi.getHDRSetting().then((result) => {
        const availableHDROptions = {
          "HdrOff": "Off",
          "Hdr10": "HDR 10",
          "Hdr10Plus": "HDR 10+",
          "HdrHlg": "HLG",
          "HdrDolbyvision": "Dolby Vision",
          "HdrTechnicolor": "Technicolor HDR"
        };
        this.tag("HDR.Title").text.text = Language_default.translate("High Dynamic Range: ") + availableHDROptions[result];
      });
      this._setState(this.state);
    }
    _handleBack() {
      Router_default.navigate("settings");
    }
    static _states() {
      return [class Resolution extends this {
        $enter() {
          this.tag("Resolution")._focus();
        }
        $exit() {
          this.tag("Resolution")._unfocus();
        }
        _handleDown() {
          this._setState("HDR");
        }
        _handleEnter() {
          Router_default.navigate("settings/video/resolution");
        }
      }, class HDR extends this {
        $enter() {
          this.tag("HDR")._focus();
        }
        $exit() {
          this.tag("HDR")._unfocus();
        }
        _handleUp() {
          this._setState("Resolution");
        }
        _handleDown() {
          this._setState("HDCP");
        }
      }, class MatchContent extends this {
        $enter() {
          this.tag("MatchContent")._focus();
        }
        $exit() {
          this.tag("MatchContent")._unfocus();
        }
        _handleUp() {
          this._setState("HDR");
        }
        _handleDown() {
          this._setState("OutputFormat");
        }
        _handleEnter() {
        }
      }, class OutputFormat extends this {
        $enter() {
          this.tag("OutputFormat")._focus();
        }
        $exit() {
          this.tag("OutputFormat")._unfocus();
        }
        _handleUp() {
          this._setState("MatchContent");
        }
        _handleDown() {
          this._setState("Chroma");
        }
        _handleEnter() {
        }
      }, class Chroma extends this {
        $enter() {
          this.tag("Chroma")._focus();
        }
        $exit() {
          this.tag("Chroma")._unfocus();
        }
        _handleUp() {
          this._setState("OutputFormat");
        }
        _handleDown() {
        }
        _handleEnter() {
        }
      }, class HDCP extends this {
        $enter() {
          this.tag("HDCP")._focus();
        }
        $exit() {
          this.tag("HDCP")._unfocus();
        }
        _handleUp() {
          this._setState("HDR");
        }
        _handleEnter() {
        }
      }];
    }
  };

  // src/routes/audioScreenRoutes.js
  var audioScreenRoutes_default = {
    audioScreenRoutes: [{
      path: "settings/audio",
      component: AudioScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/audio/output",
      component: HdmiOutputScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/video",
      component: VideoScreen,
      widgets: ["Menu"]
    }, {
      path: "settings/video/resolution",
      component: ResolutionScreen,
      widgets: ["Menu"]
    }]
  };

  // src/screens/FailScreen.js
  var errorTitle = "Error Title";
  var errorMsg = "Error Message";
  var Failscreen = class extends Lightning_default.Component {
    notify(args) {
      console.log(args);
      if (args.title && args.msg) {
        this.tag("FailScreen.Title").text.text = args.title;
        this.tag("FailScreen.Message").text.text = args.msg;
      }
    }
    _focus() {
      this.alpha = 1;
    }
    _unfocus() {
      this.alpha = 0;
      this.tag("FailScreen.Title").text.text = errorTitle;
      this.tag("FailScreen.Message").text.text = errorMsg;
    }
    static _template() {
      return {
        alpha: 0,
        w: 1920,
        h: 2e3,
        rect: true,
        color: 4278190080,
        FailScreen: {
          x: 960,
          y: 300,
          Title: {
            mountX: 0.5,
            text: {
              text: errorTitle,
              fontFace: CONFIG.language.font,
              fontSize: 40,
              textColor: CONFIG.theme.hex
            }
          },
          BorderTop: {
            x: 0,
            y: 75,
            w: 1558,
            h: 3,
            rect: true,
            mountX: 0.5
          },
          Message: {
            x: 0,
            y: 125,
            mountX: 0.5,
            text: {
              text: errorMsg,
              fontFace: CONFIG.language.font,
              fontSize: 25
            }
          },
          RectangleDefault: {
            x: 0,
            y: 200,
            w: 200,
            mountX: 0.5,
            h: 50,
            rect: true,
            color: CONFIG.theme.hex,
            Ok: {
              x: 100,
              y: 25,
              mount: 0.5,
              text: {
                text: "OK",
                fontFace: CONFIG.language.font,
                fontSize: 22
              }
            }
          },
          BorderBottom: {
            x: 0,
            y: 300,
            w: 1558,
            h: 3,
            rect: true,
            mountX: 0.5
          }
        }
      };
    }
    set item(error) {
      this.tag("Pairing").text = error;
    }
    _handleEnter() {
      Router_default.focusPage();
    }
    _handleBack() {
      Router_default.focusPage();
    }
  };

  // src/items/UsbListItem.js
  var UsbListItem = class extends Lightning_default.Component {
    static _template() {
      return {
        Item: {
          Shadow: {
            alpha: 0
          },
          y: 20,
          Image: {},
          Info: {}
        }
      };
    }
    _init() {
      this.tag("Shadow").patch({
        color: CONFIG.theme.hex,
        rect: true,
        h: this.h + 24,
        w: this.w,
        x: this.x,
        y: this.y - 12
      });
      if (this.data.url.startsWith("/images")) {
        this.tag("Image").patch({
          rtt: true,
          x: this.x,
          y: this.y,
          w: this.w,
          h: this.h,
          src: Utils_default.asset(this.data.url),
          scale: this.unfocus
        });
      } else {
        this.tag("Image").patch({
          rtt: true,
          x: this.x,
          y: this.y,
          w: this.w,
          h: this.h,
          src: this.data.url
        });
      }
      this.tag("Info").patch({
        x: this.x - 20,
        y: this.y + this.h + 10,
        w: this.w,
        h: 140,
        alpha: 0,
        PlayIcon: {
          Label: {
            x: this.idx === 0 ? this.x + 20 : this.x + 10,
            y: this.y + 10,
            text: {
              fontFace: CONFIG.language.font,
              text: this.data.displayName,
              fontSize: 20,
              maxLines: 2,
              wordWrapWidth: this.w
            }
          }
        }
      });
    }
    _focus() {
      this.tag("Image").patch({
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h,
        zIndex: 1,
        scale: this.focus
      });
      this.tag("Info").alpha = 1;
      this.tag("Item").patch({
        zIndex: 2
      });
      this.tag("Shadow").patch({
        scale: this.focus,
        alpha: 1
      });
    }
    _unfocus() {
      this.tag("Image").patch({
        w: this.w,
        h: this.h,
        scale: this.unfocus
      });
      this.tag("Item").patch({
        zIndex: 0
      });
      this.tag("Info").alpha = 0;
      this.tag("Shadow").patch({
        alpha: 0
      });
    }
  };

  // src/screens/UsbAppsScreen.js
  var usbApi = new UsbApi();
  var UsbAppsScreen = class extends Lightning_default.Component {
    _onChanged() {
      this.widgets.menu.updateTopPanelText("USB");
    }
    static _template() {
      return {
        UsbAppsScreenContents: {
          rect: true,
          color: 4278190080,
          x: 200,
          y: 270,
          w: 1765,
          h: 1250,
          clipping: true,
          Wrapper: {
            x: 0,
            w: 1765,
            h: 1250,
            clipping: true,
            Text1: {
              y: 0,
              h: 30,
              text: {
                fontFace: CONFIG.language.font,
                fontSize: 25,
                text: "Videos",
                fontStyle: "normal",
                textColor: 4294967295
              },
              zIndex: 0
            },
            Row1: {
              y: 30,
              x: -20,
              flex: {
                direction: "row",
                paddingLeft: 20,
                wrap: false
              },
              type: Lightning_default.components.ListComponent,
              w: 1745,
              h: 300,
              itemSize: 277,
              roll: true,
              rollMax: 1745,
              horizontal: true,
              itemScrollOffset: -4,
              clipping: false
            },
            Text2: {
              y: 243,
              h: 30,
              text: {
                fontFace: CONFIG.language.font,
                fontSize: 25,
                text: "Audio",
                fontStyle: "normal",
                textColor: 4294967295
              },
              zIndex: 0
            },
            Row2: {
              y: 273,
              x: -20,
              flex: {
                direction: "row",
                paddingLeft: 20,
                wrap: false
              },
              type: Lightning_default.components.ListComponent,
              w: 1745,
              h: 300,
              itemSize: 171,
              roll: true,
              rollMax: 1745,
              horizontal: true,
              itemScrollOffset: -4,
              clipping: false
            },
            Text3: {
              y: 486,
              h: 30,
              text: {
                fontFace: CONFIG.language.font,
                fontSize: 25,
                text: "Photos",
                fontStyle: "normal",
                textColor: 4294967295
              },
              zIndex: 0
            },
            Row3: {
              y: 516,
              x: -20,
              flex: {
                direction: "row",
                paddingLeft: 20,
                wrap: false
              },
              type: Lightning_default.components.ListComponent,
              w: 1745,
              h: 400,
              itemSize: 165,
              roll: true,
              rollMax: 1745,
              horizontal: true,
              itemScrollOffset: -4,
              clipping: false
            },
            Text4: {
              y: 729,
              h: 30,
              text: {
                fontFace: CONFIG.language.font,
                fontSize: 25,
                text: "Folders",
                fontStyle: "normal",
                textColor: 4294967295
              },
              zIndex: 0
            },
            Row4: {
              y: 759,
              x: -20,
              flex: {
                direction: "row",
                paddingLeft: 20,
                wrap: false
              },
              type: Lightning_default.components.ListComponent,
              w: 1745,
              h: 400,
              itemSize: 165,
              roll: true,
              rollMax: 1745,
              horizontal: true,
              itemScrollOffset: -4,
              clipping: false
            }
          },
          NoUSB: {
            x: 0,
            w: 1765,
            h: 800,
            clipping: true,
            visible: false,
            Image: {
              x: 800,
              y: 400,
              mount: 0.5,
              texture: {
                type: Lightning_default.textures.ImageTexture,
                src: "static/images/usb/Unsupported_file_640x360.jpg",
                resizeMode: {
                  type: "contain",
                  w: 640,
                  h: 360
                }
              }
            }
          }
        },
        AudioInfo: {
          zIndex: 2,
          visible: false,
          h: 1080,
          w: 1920,
          Image: {
            scale: 0.5,
            x: 960,
            y: 560,
            mount: 0.5,
            texture: {
              type: Lightning_default.textures.ImageTexture,
              src: "static/images/Media Player/Audio_Background_16k.jpg"
            }
          },
          Title: {
            x: 960,
            y: 900,
            mount: 0.5,
            text: {
              fontFace: CONFIG.language.font,
              text: "file_name.mp3",
              fontSize: 35
            }
          }
        },
        PlayerControls: {
          type: LightningPlayerControls,
          y: 810,
          alpha: 0,
          signals: {
            pause: "pause",
            play: "play",
            hide: "hidePlayerControls",
            fastfwd: "fastfwd",
            fastrwd: "fastrwd"
          },
          zIndex: 4
        }
      };
    }
    _handleBack() {
      if (!(this.cwd.length === 0)) {
        let clone2 = [...this.cwd];
        clone2.pop();
        let cwdname = clone2.join("/");
        usbApi.cd(cwdname).then((res) => {
          this.cwd.pop();
          this.loadData();
        }).catch((err) => {
          console.error(`error while getting the usb contents; error = ${JSON.stringify(err)}`);
        });
      } else {
        Router_default.navigate("menu");
      }
    }
    reset() {
      for (let i = this.tag("Row1").index; i > 0; i--) {
        this.tag("Row1").setPrevious();
      }
      for (let i = this.tag("Row2").index; i > 0; i--) {
        this.tag("Row2").setPrevious();
      }
      for (let i = this.tag("Row3").index; i > 0; i--) {
        this.tag("Row3").setPrevious();
      }
      for (let i = this.tag("Row3").index; i > 0; i--) {
        this.tag("Row4").setPrevious();
      }
    }
    hide() {
      this.tag("UsbAppsScreenContents").visible = false;
      this.fireAncestors("$hideAllforVideo");
    }
    show() {
      this.tag("UsbAppsScreenContents").visible = true;
      this.fireAncestors("$showAllforVideo");
    }
    traverseMinus() {
      this.index = (this.traversableRows.length + --this.index) % this.traversableRows.length;
      this._setState(this.traversableRows[this.index]);
    }
    traversePlus() {
      this.index = ++this.index % this.traversableRows.length;
      this._setState(this.traversableRows[this.index]);
    }
    static _states() {
      return [class Video extends this {
        $enter() {
          this.scroll(0);
        }
        _getFocused() {
          this.tag("Text1").text.fontStyle = "bold";
          if (this.tag("Row1").length) {
            return this.tag("Row1").element;
          }
        }
        _handleDown() {
          this.traversePlus();
        }
        _handleUp() {
          this.traverseMinus();
        }
        _handleRight() {
          if (this.tag("Row1").length - 1 != this.tag("Row1").index) {
            this.tag("Row1").setNext();
            return this.tag("Row1").element;
          }
        }
        _handleEnter() {
          Router_default.navigate("usb/player", {
            url: this.tag("Row1").element.data.uri,
            currentIndex: this.tag("Row1").element.idx,
            list: this.tag("Row1").items
          });
        }
        _handleLeft() {
          this.tag("Text1").text.fontStyle = "normal";
          if (this.tag("Row1").index != 0) {
            this.tag("Row1").setPrevious();
            return this.tag("Row1").element;
          } else {
            this.reset();
          }
        }
      }, class Audio extends this {
        $enter() {
          this.scroll(0);
        }
        _getFocused() {
          this.tag("Text2").text.fontStyle = "bold";
          if (this.tag("Row2").length) {
            return this.tag("Row2").element;
          }
        }
        _handleDown() {
          this.traversePlus();
        }
        _handleUp() {
          this.traverseMinus();
        }
        _handleEnter() {
          Router_default.navigate("usb/player", {
            url: this.tag("Row2").element.data.uri,
            isAudio: true,
            list: this.tag("Row2").items,
            currentIndex: this.tag("Row2").element.idx
          });
        }
        _handleRight() {
          if (this.tag("Row2").length - 1 != this.tag("Row2").index) {
            this.tag("Row2").setNext();
            return this.tag("Row2").element;
          }
        }
        _handleLeft() {
          this.tag("Text2").text.fontStyle = "normal";
          if (this.tag("Row2").index != 0) {
            this.tag("Row2").setPrevious();
            return this.tag("Row2").element;
          } else {
            this.reset();
          }
        }
      }, class Picture extends this {
        $enter() {
          this.scroll(0);
        }
        _getFocused() {
          this.tag("Text3").text.fontStyle = "bold";
          if (this.tag("Row3").length) {
            return this.tag("Row3").element;
          }
        }
        _handleDown() {
          this.traversePlus();
        }
        _handleUp() {
          this.traverseMinus();
        }
        _handleEnter() {
          console.log(this.tag("Row3").items);
          Router_default.navigate("usb/image", {
            src: this.tag("Row3").element.data.uri,
            currentIndex: this.tag("Row3").element.idx,
            list: this.tag("Row3").items,
            cwd: this.cwd
          });
        }
        _handleRight() {
          if (this.tag("Row3").length - 1 != this.tag("Row3").index) {
            this.tag("Row3").setNext();
            return this.tag("Row3").element;
          }
        }
        _handleLeft() {
          this.tag("Text3").text.fontStyle = "normal";
          if (this.tag("Row3").index != 0) {
            this.tag("Row3").setPrevious();
            return this.tag("Row3").element;
          } else {
            this.reset();
          }
        }
      }, class Folder extends this {
        $enter() {
          if (this.traversableRows.length > 3) {
            this.scroll(-243);
          }
        }
        _getFocused() {
          this.tag("Text4").text.fontStyle = "bold";
          if (this.tag("Row4").length) {
            return this.tag("Row4").element;
          }
        }
        _handleDown() {
          this.traversePlus();
        }
        _handleUp() {
          this.traverseMinus();
        }
        _handleEnter() {
          let dname = this.cwd.join("/") + "/" + this.tag("Row4").element.data.displayName;
          usbApi.cd(dname).then((res) => {
            this.cwd.push(this.tag("Row4").element.data.displayName);
            console.log(`loading the data from the directory ${this.cwd}

            and its data = music:${JSON.stringify(musicListInfo)}

            Pictures : ${JSON.stringify(imageListInfo)}

            videos : ${JSON.stringify(videoListInfo)}

            folders : ${JSON.stringify(UsbInnerFolderListInfo)}

            `);
            this.loadData();
          }).catch((err) => {
            console.error(`error while getting the usb contents; error = ${JSON.stringify(err)}`);
          });
        }
        _handleRight() {
          if (this.tag("Row4").length - 1 != this.tag("Row4").index) {
            this.tag("Row4").setNext();
            return this.tag("Row4").element;
          }
        }
        _handleLeft() {
          this.tag("Text4").text.fontStyle = "normal";
          if (this.tag("Row4").index != 0) {
            this.tag("Row4").setPrevious();
            return this.tag("Row4").element;
          } else {
            this.reset();
          }
        }
      }];
    }
    set params(args) {
      this.currentIndex = args.currentIndex;
      this.thisDir = args.cwd;
    }
    set Row1Items(items) {
      this.tag("Row1").items = items.map((info, idx) => {
        return {
          w: 257,
          h: 145,
          type: UsbListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          idx
        };
      });
      this.tag("Row1").start();
    }
    set Row2Items(items) {
      this.tag("Row2").items = items.map((info, idx) => {
        return {
          w: 151,
          h: 151,
          type: UsbListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          idx
        };
      });
      this.tag("Row2").start();
    }
    set Row3Items(items) {
      this.tag("Row3").items = items.map((info, idx) => {
        return {
          w: 145,
          h: 145,
          type: UsbListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          idx
        };
      });
      this.tag("Row3").start();
    }
    set Row4Items(items) {
      this.tag("Row4").items = items.map((info, idx) => {
        return {
          w: 145,
          h: 145,
          type: UsbListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          idx
        };
      });
      this.tag("Row4").start();
    }
    scroll(y) {
      this.tag("Wrapper").setSmooth("y", y, {
        duration: 0.5
      });
    }
    loadData() {
      console.log(`loading data from the directory ${this.cwd}`);
      let sumY = 0;
      this.index = 0;
      this.traversableRows = [];
      this.Row1Items = videoListInfo;
      this.Row2Items = musicListInfo;
      this.Row3Items = imageListInfo;
      this.Row4Items = UsbInnerFolderListInfo;
      let text1 = this.tag("Text1");
      let row1 = this.tag("Row1");
      let text2 = this.tag("Text2");
      let row2 = this.tag("Row2");
      let text3 = this.tag("Text3");
      let row3 = this.tag("Row3");
      let text4 = this.tag("Text4");
      let row4 = this.tag("Row4");
      if (videoListInfo.length === 0 && musicListInfo.length === 0 && imageListInfo.length === 0 && UsbInnerFolderListInfo.length === 0) {
        this.tag("NoUSB").visible = true;
        text1.visible = false;
        row1.visible = false;
        text2.visible = false;
        row2.visible = false;
        text3.visible = false;
        row3.visible = false;
        text4.visible = false;
        row4.visible = false;
      } else {
        this.tag("NoUSB").visible = false;
        if (videoListInfo.length === 0) {
          text1.visible = false;
          row1.visible = false;
        } else {
          this.traversableRows.push("Video");
          text1.visible = true;
          row1.visible = true;
          text1.y = sumY;
          row1.y = sumY + 30;
          sumY += 243;
        }
        if (musicListInfo.length === 0) {
          text2.visible = false;
          row2.visible = false;
        } else {
          this.traversableRows.push("Audio");
          text2.visible = true;
          row2.visible = true;
          text2.y = sumY;
          row2.y = sumY + 30;
          sumY += 243;
        }
        if (imageListInfo.length === 0) {
          text3.visible = false;
          row3.visible = false;
        } else {
          this.traversableRows.push("Picture");
          text3.visible = true;
          row3.visible = true;
          text3.y = sumY;
          row3.y = sumY + 30;
          sumY += 243;
        }
        if (UsbInnerFolderListInfo.length === 0) {
          text4.visible = false;
          row4.visible = false;
        } else {
          this.traversableRows.push("Folder");
          text4.visible = true;
          row4.visible = true;
          text4.y = sumY;
          row4.y = sumY + 30;
          sumY += 243;
        }
        this._setState(this.traversableRows[0]);
      }
    }
    _focus() {
      if (this.thisDir) {
        if (this.thisDir.length > 0) {
          this.cwd = [...this.thisDir];
          let dname = this.cwd.join("/");
          usbApi.cd(dname).then((res) => {
            this.loadData();
            this._setState(this.traversableRows[this.index] + `.${this.currentIndex}`);
          }).catch((err) => {
            console.error(`error while getting the usb contents; error = ${JSON.stringify(err)}`);
          });
        }
      } else {
        this.index = 0;
        this.traversableRows = [];
        this.cwd = [];
        usbApi.retrieUsb().then((res) => {
          this.loadData();
          this._setState(this.traversableRows[this.index]);
        }).catch((err) => {
          console.error(`error while getting the usb contents; error = ${JSON.stringify(err)}`);
        });
      }
    }
    _unfocus() {
    }
  };

  // src/MediaPlayer/ImageViewer.js
  var defaultImage = "static/images/usb/USB_Photo_Placeholder.jpg";
  var ImageViewer = class extends Lightning_default.Component {
    set params(args) {
      this.currentIndex = args.currentIndex;
      this.data = args.list;
      this.cwd = args.cwd;
      if (args.src) {
        this.tag("Image").texture.src = args.src;
      }
    }
    _handleRight() {
      if (this.data[this.currentIndex + 1]) {
        this.currentIndex += 1;
        this.tag("Image").texture.src = this.data[this.currentIndex].data.uri;
      }
    }
    _handleLeft() {
      if (this.data[this.currentIndex - 1]) {
        this.currentIndex -= 1;
        this.tag("Image").texture.src = this.data[this.currentIndex].data.uri;
      }
    }
    _handleBack() {
      if (this.cwd) {
        Router_default.navigate("usb", {
          currentIndex: this.currentIndex,
          cwd: this.cwd
        });
      } else {
        Router_default.back();
      }
    }
    _unfocus() {
      this.tag("Image").texture.src = defaultImage;
    }
    static _template() {
      return {
        h: 1080,
        w: 1920,
        rect: true,
        color: 4278190080,
        zIndex: 2,
        visible: false,
        Image: {
          x: 960,
          y: 540,
          mount: 0.5,
          texture: {
            type: Lightning_default.textures.ImageTexture,
            src: defaultImage,
            resizeMode: {
              type: "contain",
              w: 1920,
              h: 1080
            }
          }
        },
        Next: {
          x: 1060,
          y: 1080 - 150,
          w: 100,
          h: 100,
          mount: 0.5,
          texture: {
            type: Lightning_default.textures.ImageTexture,
            src: "static/images/Media Player/Icon_Next_White_16k.png"
          }
        },
        Previous: {
          x: 860,
          y: 1080 - 150,
          w: 100,
          h: 100,
          mount: 0.5,
          texture: {
            type: Lightning_default.textures.ImageTexture,
            src: "static/images/Media Player/Icon_Back_White_16k.png"
          }
        }
      };
    }
  };

  // src/screens/SplashScreens/LogoScreen.js
  var LogoScreen = class extends Lightning_default.Component {
    static _template() {
      return {
        rect: true,
        color: 4278190080,
        w: 1920,
        h: 2e3,
        Logo: {
          mount: 0.5,
          x: 1920 / 2,
          y: 1080 / 2,
          src: Utils_default.asset("/images/splash/RDKLogo.png")
        }
      };
    }
    pageTransition() {
      return "right";
    }
    _init() {
      this.btApi = new BluetoothApi();
    }
    _focus() {
      let path = "splash/bluetooth";
      this.btApi.getPairedDevices().then((devices) => {
        console.log(devices);
        if (devices.length > 0 || Storage_default.get("setup")) {
          path = "menu";
        }
      }).catch(() => {
        console.log("Paired Device Error");
        path = "menu";
      });
      setTimeout(() => {
        Router_default.navigate(path);
      }, 5e3);
    }
  };

  // src/screens/SplashScreens/BluetoothScreen.js
  var BluetoothScreen2 = class extends Lightning_default.Component {
    static _template() {
      return {
        w: 1920,
        h: 2e3,
        rect: true,
        color: 4278190080,
        Bluetooth: {
          x: 960,
          y: 270,
          Title: {
            x: 0,
            y: 0,
            mountX: 0.5,
            text: {
              text: "Pairing Your Remote",
              fontFace: CONFIG.language.font,
              fontSize: 40,
              textColor: CONFIG.theme.hex,
              fontStyle: "bold"
            }
          },
          BorderTop: {
            x: 0,
            y: 75,
            w: 1558,
            h: 3,
            rect: true,
            mountX: 0.5
          },
          Info: {
            x: 0,
            y: 135,
            mountX: 0.5,
            text: {
              text: "Please put the remote in pairing mode, scanning will start in a minute.",
              fontFace: CONFIG.language.font,
              fontSize: 25
            },
            visible: true
          },
          Timer: {
            x: 0,
            y: 200,
            mountX: 0.5,
            text: {
              text: "0:10",
              fontFace: CONFIG.language.font,
              fontSize: 80
            },
            visible: true
          },
          Loader: {
            x: 0,
            y: 200,
            mountX: 0.5,
            w: 110,
            h: 110,
            zIndex: 2,
            src: Utils_default.asset("images/settings/Loading.gif"),
            visible: false
          },
          Buttons: {
            Continue: {
              x: 0,
              y: 210,
              w: 300,
              mountX: 0.5,
              h: 60,
              rect: true,
              color: 4294967295,
              Title: {
                x: 150,
                y: 30,
                mount: 0.5,
                text: {
                  text: "Continue Setup",
                  fontFace: CONFIG.language.font,
                  fontSize: 22,
                  textColor: 4278190080,
                  fontStyle: "bold"
                }
              },
              visible: false
            }
          },
          BorderBottom: {
            x: 0,
            y: 350,
            w: 1558,
            h: 3,
            rect: true,
            mountX: 0.5
          }
        }
      };
    }
    _init() {
    }
    _focus() {
      this.initTimer();
    }
    pageTransition() {
      return "left";
    }
    _unfocus() {
      if (this.timeInterval) {
        Registry_default.clearInterval(this.timeInterval);
      }
      this.tag("Timer").text.text = "0:10";
    }
    getTimeRemaining(endtime) {
      const total = Date.parse(endtime) - Date.parse(new Date());
      const seconds = Math.floor(total / 1e3 % 60);
      return {
        total,
        seconds
      };
    }
    initTimer() {
      const endTime = new Date(Date.parse(new Date()) + 1e4);
      const timerText = this.tag("Timer");
      this.timeInterval = Registry_default.setInterval(() => {
        const time = this.getTimeRemaining(endTime);
        timerText.text.text = `0:0${time.seconds}`;
        if (time.total <= 0) {
          Registry_default.clearInterval(this.timeInterval);
          Router_default.navigate("splash/language");
        }
      }, 1e3);
    }
    static _states() {
      return [class RemotePair extends this {
        $enter() {
          this.tag("Timer").visible = true;
          this.tag("Info").text.text = "Please put the remote in pairing mode, scanning will start in a minute.";
        }
        _handleRight() {
          this._setState("Scanning");
        }
        $exit() {
          this.tag("Timer").visible = false;
          this.tag("Info").text.text = "";
        }
      }, class Scanning extends this {
        $enter() {
          this.tag("Loader").visible = true;
          this.tag("Info").text.text = "Scanning";
        }
        _handleRight() {
          this._setState("PairComplete");
        }
        _handleLeft() {
          this._setState("RemotePair");
        }
        $exit() {
          this.tag("Loader").visible = false;
          this.tag("Info").text.text = "";
        }
      }, class PairComplete extends this {
        $enter() {
          this.tag("Buttons.Continue").visible = true;
          this.tag("Info").text.text = "Pairing complete";
        }
        _handleLeft() {
          this._setState("Scanning");
        }
        _handleRight() {
          Router_default.navigate("splash/language");
        }
        $exit() {
          this.tag("Buttons.Continue").visible = false;
          this.tag("Info").text.text = "";
        }
      }];
    }
  };

  // src/screens/SplashScreens/LanguageScreen.js
  var appApi6 = new AppApi();
  var loader4 = "Loader";
  var LanguageScreen2 = class extends Lightning_default.Component {
    static _template() {
      return {
        Language: {
          x: 960,
          y: 270,
          Background: {
            x: 0,
            y: 0,
            w: 1920,
            h: 2e3,
            mount: 0.5,
            rect: true,
            color: 4278190080
          },
          Title: {
            x: 0,
            y: 0,
            mountX: 0.5,
            text: {
              text: "Language",
              fontFace: CONFIG.language.font,
              fontSize: 40,
              textColor: CONFIG.theme.hex
            }
          },
          BorderTop: {
            x: 0,
            y: 75,
            w: 1600,
            h: 3,
            rect: true,
            mountX: 0.5
          },
          Info: {
            x: 0,
            y: 125,
            mountX: 0.5,
            text: {
              text: "Select a language",
              fontFace: CONFIG.language.font,
              fontSize: 25
            }
          },
          LanguageScreenContents: {
            x: 200 - 1e3,
            y: 270,
            Languages: {
              flexItem: {
                margin: 0
              },
              List: {
                type: Lightning_default.components.ListComponent,
                w: 1920 - 300,
                itemSize: 90,
                horizontal: false,
                invertDirection: true,
                roll: true,
                rollMax: 900,
                itemScrollOffset: -4
              }
            },
            Continue: {
              x: 820,
              y: 250,
              w: 300,
              mountX: 0.5,
              h: 60,
              rect: true,
              color: 4294967295,
              Title: {
                x: 150,
                y: 30,
                mount: 0.5,
                text: {
                  text: "Continue Setup",
                  fontFace: CONFIG.language.font,
                  fontSize: 22,
                  textColor: 4278190080,
                  fontStyle: "bold"
                }
              },
              visible: true
            }
          }
        }
      };
    }
    _init() {
      this._Languages = this.tag("LanguageScreenContents.Languages");
      this._Languages.h = availableLanguages.length * 90;
      this._Languages.tag("List").h = availableLanguages.length * 90;
      this._Languages.tag("List").items = availableLanguages.map((item, index) => {
        return {
          ref: "Lng" + index,
          w: 1620,
          h: 90,
          type: LanguageItem,
          item
        };
      });
    }
    pageTransition() {
      return "left";
    }
    _focus() {
      this._setState("Languages");
    }
    _handleBack() {
    }
    static _states() {
      return [class Languages extends this {
        $enter() {
        }
        _getFocused() {
          return this._Languages.tag("List").element;
        }
        _handleUp() {
          this._navigate("up");
        }
        _handleDown() {
          if (this._Languages.tag("List").index < availableLanguages.length - 1) {
            this._navigate("down");
          } else {
            this._setState("Continue");
          }
        }
        _handleEnter() {
          localStorage.setItem("Language", availableLanguages[this._Languages.tag("List").index]);
          let path = location.pathname.split("index.html")[0];
          let url = path.slice(-1) === "/" ? "static/loaderApp/index.html" : "/static/loaderApp/index.html";
          let notification_url = location.origin + path + url;
          console.log(notification_url);
          appApi6.launchResident(notification_url, loader4);
          appApi6.setVisibility("ResidentApp", false);
          location.reload();
        }
      }, class Continue extends this {
        $enter() {
          this._focus();
        }
        _focus() {
          this.tag("Continue").patch({
            color: CONFIG.theme.hex
          });
          this.tag("Continue.Title").patch({
            text: {
              textColor: 4294967295
            }
          });
        }
        _unfocus() {
          this.tag("Continue").patch({
            color: 4294967295
          });
          this.tag("Continue.Title").patch({
            text: {
              textColor: 4278190080
            }
          });
        }
        _handleUp() {
          this._setState("Languages");
        }
        _handleEnter() {
          Router_default.navigate("splash/network");
        }
        $exit() {
          this._unfocus();
        }
      }];
    }
    _navigate(dir) {
      let list = this._Languages.tag("List");
      if (dir === "down") {
        if (list.index < list.length - 1)
          list.setNext();
      } else if (dir === "up") {
        if (list.index > 0)
          list.setPrevious();
      }
    }
  };

  // src/screens/SplashScreens/NetworkScreen.js
  var wifi3 = new Wifi();
  var NetworkScreen = class extends Lightning_default.Component {
    static _template() {
      return {
        Network: {
          x: 960,
          y: 270,
          Background: {
            x: 0,
            y: 0,
            w: 1920,
            h: 2e3,
            mount: 0.5,
            rect: true,
            color: 4278190080
          },
          Title: {
            x: 0,
            y: 0,
            mountX: 0.5,
            text: {
              text: "Network Configuration",
              fontFace: CONFIG.language.font,
              fontSize: 40,
              textColor: CONFIG.theme.hex
            }
          },
          BorderTop: {
            x: 0,
            y: 75,
            w: 1600,
            h: 3,
            rect: true,
            mountX: 0.5
          },
          Info: {
            x: 0,
            y: 125,
            mountX: 0.5,
            text: {
              text: "Select a network interface",
              fontFace: CONFIG.language.font,
              fontSize: 25
            }
          },
          NetworkInterfaceList: {
            x: 200 - 1e3,
            y: 270,
            WiFi: {
              y: 0,
              type: SettingsMainItem,
              Title: {
                x: 10,
                y: 45,
                mountY: 0.5,
                text: {
                  text: "WiFi",
                  textColor: COLORS.titleColor,
                  fontFace: CONFIG.language.font,
                  fontSize: 25
                }
              }
            },
            Ethernet: {
              y: 90,
              type: SettingsMainItem,
              Title: {
                x: 10,
                y: 45,
                mountY: 0.5,
                text: {
                  text: "Ethernet",
                  textColor: COLORS.titleColor,
                  fontFace: CONFIG.language.font,
                  fontSize: 25
                }
              }
            }
          }
        }
      };
    }
    _init() {
    }
    pageTransition() {
      return "left";
    }
    _focus() {
      Storage_default.set("setup", true);
      this._setState("WiFi");
    }
    static _states() {
      return [class WiFi extends this {
        $enter() {
          this.tag("WiFi")._focus();
        }
        $exit() {
          this.tag("WiFi")._unfocus();
        }
        _handleDown() {
          this._setState("Ethernet");
        }
        _handleEnter() {
          wifi3.setInterface("WIFI", true).then((res) => {
            if (res.success) {
              wifi3.setDefaultInterface("WIFI", true).then(() => {
                Router_default.navigate("splash/networkList");
              });
            }
          });
          console.log("Wifi");
        }
      }, class Ethernet extends this {
        $enter() {
          this.tag("Ethernet")._focus();
        }
        $exit() {
          this.tag("Ethernet")._unfocus();
        }
        _handleEnter() {
          wifi3.setInterface("ETHERNET", true).then((res) => {
            if (res.success) {
              wifi3.setDefaultInterface("ETHERNET", true).then(() => {
                Router_default.navigate("menu");
              });
            }
          });
        }
        _handleDown() {
          this._setState("WiFi");
        }
        _handleUp() {
          this._setState("WiFi");
        }
      }];
    }
  };

  // src/screens/SplashScreens/NetworkList.js
  var wifi4 = new Wifi();
  var NetworkList = class extends Lightning_default.Component {
    static _template() {
      return {
        NetworkList: {
          x: 950,
          y: 270,
          Background: {
            x: 0,
            y: 0,
            w: 1920,
            h: 2e3,
            mount: 0.5,
            rect: true,
            color: 4278190080
          },
          Title: {
            x: 0,
            y: 0,
            mountX: 0.5,
            text: {
              text: "Network Configuration",
              fontFace: CONFIG.language.font,
              fontSize: 40,
              textColor: CONFIG.theme.hex
            }
          },
          BorderTop: {
            x: 0,
            y: 75,
            w: 1600,
            h: 3,
            rect: true,
            mountX: 0.5
          },
          Info: {
            x: 0,
            y: 125,
            mountX: 0.5,
            text: {
              text: "Select a wifi network",
              fontFace: CONFIG.language.font,
              fontSize: 25
            }
          },
          Loader: {
            visible: false,
            h: 45,
            w: 45,
            x: 0,
            mountX: 1,
            y: 200,
            mountY: 0.5,
            src: Utils_default.asset("images/settings/Loading.gif")
          },
          Networks: {
            x: -800,
            y: 340,
            flex: {
              direction: "column"
            },
            PairedNetworks: {
              flexItem: {
                margin: 0
              },
              List: {
                type: Lightning_default.components.ListComponent,
                w: 1920 - 300,
                itemSize: 90,
                horizontal: false,
                invertDirection: true,
                roll: true,
                rollMax: 900,
                itemScrollOffset: -4
              }
            },
            AvailableNetworks: {
              flexItem: {
                margin: 0
              },
              List: {
                w: 1920 - 300,
                type: Lightning_default.components.ListComponent,
                itemSize: 90,
                horizontal: false,
                invertDirection: true,
                roll: true,
                rollMax: 900,
                itemScrollOffset: -4
              }
            },
            visible: false
          },
          JoinAnotherNetwork: {
            x: -800,
            y: 250,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: "Join Another Network",
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            visible: false
          }
        }
      };
    }
    pageTransition() {
      return "left";
    }
    _init() {
      this.wifiLoading = this.tag("Loader").animation({
        duration: 3,
        repeat: -1,
        stopMethod: "immediate",
        stopDelay: 0.2,
        actions: [{
          p: "rotation",
          v: {
            sm: 0,
            0: 0,
            1: Math.PI * 2
          }
        }]
      });
      this.onError = {
        0: "SSID_CHANGED - The SSID of the network changed",
        1: "CONNECTION_LOST - The connection to the network was lost",
        2: "CONNECTION_FAILED - The connection failed for an unknown reason",
        3: "CONNECTION_INTERRUPTED - The connection was interrupted",
        4: "INVALID_CREDENTIALS - The connection failed due to invalid credentials",
        5: "NO_SSID - The SSID does not exist",
        6: "UNKNOWN - Any other error."
      };
      this._pairedNetworks = this.tag("Networks.PairedNetworks");
      this._availableNetworks = this.tag("Networks.AvailableNetworks");
      this._wifi = new Wifi();
      this._network = new Network();
      this.wifiStatus = true;
      this._wifiIcon = true;
      this._activateWiFi();
      if (this.wiFiStatus) {
        this.tag("Networks").visible = true;
        this.tag("JoinAnotherNetwork").visible = true;
      }
      this._setState("JoinAnotherNetwork");
      this._network.activate().then((result) => {
        if (result) {
          this._network.registerEvent("onIPAddressStatusChanged", (notification) => {
            console.log(JSON.stringify(notification));
            if (notification.status == "ACQUIRED") {
            } else if (notification.status == "LOST") {
              if (notification.interface === "WIFI") {
                this._wifi.setInterface("ETHERNET", true).then((res) => {
                  if (res.success) {
                    this._wifi.setDefaultInterface("ETHERNET", true);
                  }
                });
              }
            }
          });
          this._network.registerEvent("onDefaultInterfaceChanged", (notification) => {
            console.log(JSON.stringify(notification));
            if (notification.newInterfaceName === "ETHERNET") {
              this._wifi.setInterface("ETHERNET", true).then((result2) => {
                if (result2.success) {
                  this._wifi.setDefaultInterface("ETHERNET", true);
                }
              });
            } else if (notification.newInterfaceName == "ETHERNET" || notification.oldInterfaceName == "WIFI") {
              this._wifi.disconnect();
              this.wifiStatus = false;
              this.tag("Networks").visible = false;
              this.tag("JoinAnotherNetwork").visible = false;
              this.tag("Switch.Loader").visible = false;
              this.wifiLoading.stop();
              this.tag("Switch.Button").src = Utils_default.asset("images/settings/ToggleOffWhite.png");
              this._setState("Switch");
              this._wifi.setInterface("ETHERNET", true).then((result2) => {
                if (result2.success) {
                  this._wifi.setDefaultInterface("ETHERNET", true).then((result1) => {
                    if (result1.success) {
                      console.log("set default success", result1);
                    }
                  });
                }
              });
            } else if (notification.newInterfaceName === "" && notification.oldInterfaceName === "WIFI") {
              console.log("emplty new old wifi");
              this._wifi.setDefaultInterface("ETHERNET", true);
            }
          });
          this._network.registerEvent("onConnectionStatusChanged", (notification) => {
            if (notification.interface === "ETHERNET" && notification.status === "CONNECTED") {
              this._wifi.setInterface("ETHERNET", true).then((res) => {
                if (res.success) {
                  this._wifi.setDefaultInterface("ETHERNET", true);
                }
              });
            }
          });
        }
      });
    }
    _focus() {
      if (this.wifiStatus) {
        this._wifi.discoverSSIDs();
      }
      this.scanTimer = setInterval(() => {
        if (this.wifiStatus) {
          this._wifi.discoverSSIDs();
        }
      }, 5e3);
    }
    _unfocus() {
      clearInterval(this.scanTimer);
    }
    renderDeviceList(ssids) {
      this._wifi.getConnectedSSID().then((result) => {
        if (result.ssid != "") {
          this._pairedList = [result];
        } else {
          this._pairedList = [];
        }
        this._pairedNetworks.h = this._pairedList.length * 90;
        this._pairedNetworks.tag("List").h = this._pairedList.length * 90;
        this._pairedNetworks.tag("List").items = this._pairedList.map((item, index) => {
          item.connected = true;
          return {
            ref: "Paired" + index,
            w: 1920 - 300,
            h: 90,
            type: WiFiItem,
            item
          };
        });
        this._otherList = ssids.filter((device) => {
          result = this._pairedList.map((a) => a.ssid);
          if (result.includes(device.ssid)) {
            return false;
          } else
            return device;
        });
        this._availableNetworks.h = this._otherList.length * 90;
        this._availableNetworks.tag("List").h = this._otherList.length * 90;
        this._availableNetworks.tag("List").items = this._otherList.map((item, index) => {
          item.connected = false;
          return {
            ref: "Other" + index,
            w: 1620,
            h: 90,
            type: WiFiItem,
            item
          };
        });
      });
    }
    static _states() {
      return [class AvailableDevices extends this {
        $enter() {
          if (this.wifiStatus === true) {
            this.tag("Loader").visible = false;
            this.wifiLoading.stop();
          }
        }
        _getFocused() {
          return this._availableNetworks.tag("List").element;
        }
        _handleDown() {
          this._navigate("AvailableDevices", "down");
        }
        _handleUp() {
          this._navigate("AvailableDevices", "up");
        }
        _handleEnter() {
          console.log(this._availableNetworks.tag("List").element._item);
          Router_default.navigate("settings/network/interface/wifi/connect", {
            wifiItem: this._availableNetworks.tag("List").element._item
          });
        }
      }, class JoinAnotherNetwork extends this {
        $enter() {
          this.tag("JoinAnotherNetwork")._focus();
        }
        _handleUp() {
        }
        _handleEnter() {
          if (this.wifiStatus) {
            Router_default.navigate("settings/network/interface/wifi/another");
          }
        }
        _handleDown() {
          this._setState("AvailableDevices");
        }
        $exit() {
          this.tag("JoinAnotherNetwork")._unfocus();
        }
      }];
    }
    _navigate(listname, dir) {
      let list;
      if (listname === "MyDevices")
        list = this._pairedNetworks.tag("List");
      else if (listname === "AvailableDevices")
        list = this._availableNetworks.tag("List");
      if (dir === "down") {
        if (list.index < list.length - 1)
          list.setNext();
        else if (list.index == list.length - 1) {
          if (listname === "MyDevices" && this._availableNetworks.tag("List").length > 0) {
            this._setState("AvailableDevices");
          }
        }
      } else if (dir === "up") {
        if (list.index > 0)
          list.setPrevious();
        else if (list.index == 0) {
          if (listname === "AvailableDevices" && this._pairedNetworks.tag("List").length > 0) {
            this._setState("PairedDevices");
          } else {
            this._setState("JoinAnotherNetwork");
          }
        }
      }
    }
    switch() {
      if (!this.wifiStatus) {
        this._wifi.disconnect();
        console.log("turning off wifi");
        this._wifi.setInterface("ETHERNET", true).then((result) => {
          if (result.success) {
            this._wifi.setDefaultInterface("ETHERNET", true).then((result2) => {
              if (result2.success) {
                this._wifi.disconnect();
                this.wifiStatus = false;
                this.tag("Networks").visible = false;
                this.tag("JoinAnotherNetwork").visible = false;
                this.tag("Loader").visible = false;
                this.wifiLoading.stop();
              }
            });
          }
        });
      } else {
        console.log("turning on wifi");
        this.tag("Networks").visible = true;
        this.tag("JoinAnotherNetwork").visible = true;
        this.wifiLoading.play();
        this.tag("Loader").visible = true;
        this._wifi.discoverSSIDs();
      }
    }
    _activateWiFi() {
      this._wifi.activate().then(() => {
        this.switch();
      });
      this._wifi.registerEvent("onWIFIStateChanged", (notification) => {
        console.log(JSON.stringify(notification));
        if (notification.state === 5 && Router_default.getActiveRoute().includes("splash")) {
          Registry_default.setTimeout(() => {
            Router_default.navigate("menu");
          }, 2e3);
        }
      });
      this._wifi.registerEvent("onError", (notification) => {
        this._wifi.discoverSSIDs();
        this._wifi.setInterface("ETHERNET", true).then((res) => {
          if (res.success) {
            this._wifi.setDefaultInterface("ETHERNET", true);
          }
        });
      });
      this._wifi.registerEvent("onAvailableSSIDs", (notification) => {
        this.renderDeviceList(notification.ssids);
        if (!notification.moreData) {
          setTimeout(() => {
            this.tag("Loader").visible = false;
            this.wifiLoading.stop();
          }, 1e3);
        }
      });
    }
  };

  // src/routes/splashScreenRoutes.js
  var splashScreenRoutes_default = {
    splashScreenRoutes: [{
      path: "splash",
      component: LogoScreen
    }, {
      path: "splash/bluetooth",
      component: BluetoothScreen2
    }, {
      path: "splash/language",
      component: LanguageScreen2
    }, {
      path: "splash/network",
      component: NetworkScreen
    }, {
      path: "splash/networkList",
      component: NetworkList
    }]
  };

  // src/routes/routes.js
  var routes_default = {
    boot: (queryParam) => {
      let homeApi = new HomeApi();
      homeApi.setPartnerAppsInfo(queryParam.data);
      return Promise.resolve();
    },
    root: "splash",
    routes: [{
      path: "settings",
      component: SettingsScreen,
      widgets: ["Menu"]
    }, {
      path: "failscreen",
      component: Failscreen
    }, {
      path: "videoplayer",
      component: LightningPlayerControls
    }, {
      path: "usb",
      component: UsbAppsScreen,
      widgets: ["Menu"]
    }, {
      path: "usb/player",
      component: AAMPVideoPlayer
    }, {
      path: "usb/image",
      component: ImageViewer
    }, {
      path: "image",
      component: ImageViewer
    }, {
      path: "menu",
      component: MainView,
      before: (page) => {
        const homeApi = new HomeApi();
        page.tvShowItems = homeApi.getTVShowsInfo();
        return Promise.resolve();
      },
      widgets: ["Menu"]
    }, {
      path: "player",
      component: AAMPVideoPlayer
    }, ...route.network, ...otherSettingsRoutes_default.otherSettingsRoutes, ...audioScreenRoutes_default.audioScreenRoutes, ...splashScreenRoutes_default.splashScreenRoutes, {
      path: "!",
      component: Error2
    }, {
      path: "*",
      component: LogoScreen
    }]
  };
  const thunder$1 = thunderJS(config$1);
  const appApi$1 = new AppApi();
  function keyIntercept() {
    const rdkshellCallsign = 'org.rdk.RDKShell';
    thunder$1.Controller.activate({
      callsign: rdkshellCallsign
    }).then(result => {
      console.log('Successfully activated RDK Shell');
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call('org.rdk.RDKShell', 'setFocus', {
        client: 'ResidentApp'
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.AudioVolumeMute,
        modifiers: []
      }).then(result => {
        console.log('addKeyIntercept success');
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.on(rdkshellCallsign, 'onSuspended', notification => {
        if (notification) {
          console.log('onSuspended notification: ' + notification.client);

          if (Storage.get('applicationType') == notification.client) {
            Storage.set('applicationType', '');
            appApi$1.setVisibility('ResidentApp', true);
            thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
              client: 'ResidentApp'
            }).then(result => {
              console.log('ResidentApp moveToFront Success');
            });
            thunder$1.call('org.rdk.RDKShell', 'setFocus', {
              client: 'ResidentApp'
            }).then(result => {
              console.log('ResidentApp setFocus Success');
            });
          }
        }
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Escape,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.F1,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Power,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.F7,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.AudioVolumeUp,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.AudioVolumeDown,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'foreground',
        keyCode: keyMap.AudioVolumeDown,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'foreground',
        keyCode: keyMap.AudioVolumeUp,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'foreground',
        keyCode: keyMap.AudioVolumeMute,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.MediaFastForward,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: 142,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Home,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.MediaRewind,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Pause,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Cobalt',
        keyCode: keyMap.Escape,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Amazon',
        keyCode: keyMap.Escape,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Cobalt',
        keyCode: keyMap.Home,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Amazon',
        keyCode: keyMap.Home,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Cobalt',
        keyCode: keyMap.Backspace,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    }).then(result => {
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Amazon',
        keyCode: keyMap.Backspace,
        modifiers: []
      }).catch(err => {
        console.log('Error', err);
      });
    }).catch(err => {
      console.log('Error', err);
    });
  }

  // src/Config/Keymap.js
  var keyMap = {
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "F1": 112,
    "F2": 113,
    "F3": 114,
    "F4": 115,
    "F5": 116,
    "F6": 117,
    "F7": 118,
    "F8": 119,
    "F9": 120,
    "F10": 121,
    "F11": 122,
    "F12": 123,
    "q": 81,
    "w": 87,
    "e": 69,
    "r": 82,
    "t": 84,
    "y": 89,
    "u": 85,
    "i": 73,
    "o": 79,
    "p": 80,
    "a": 65,
    "s": 83,
    "d": 68,
    "f": 70,
    "g": 71,
    "h": 72,
    "j": 74,
    "k": 75,
    "l": 76,
    "z": 90,
    "x": 88,
    "c": 67,
    "v": 86,
    "b": 66,
    "n": 78,
    "m": 77,
    "Q": 81,
    "W": 87,
    "E": 69,
    "R": 82,
    "T": 84,
    "Y": 89,
    "U": 85,
    "I": 73,
    "O": 79,
    "P": 80,
    "A": 65,
    "S": 83,
    "D": 68,
    "F": 70,
    "G": 71,
    "H": 72,
    "J": 74,
    "K": 75,
    "L": 76,
    "Z": 90,
    "X": 88,
    "C": 67,
    "V": 86,
    "B": 66,
    "N": 78,
    "M": 77,
    "Enter": 13,
    "Space": 32,
    "ArrowUp": 38,
    "ArrowLeft": 37,
    "ArrowRight": 39,
    "ArrowDown": 40,
    "AudioVolumeDown": 174,
    "AudioVolumeUp": 175,
    "AudioVolumeMute": 173,
    "MediaStop": 178,
    "MediaTrackPrevious": 177,
    "MediaPlay": 179,
    "MediaTrackNext": 176,
    "Escape": 27,
    "Pause": 179,
    "Backspace": 8,
    "MediaRewind": 227,
    "MediaFastForward": 228,
    "Power": 116,
    "PageUp": 33,
    "PageDown": 34,
    "Home": 36
  };
  var Keymap_default = keyMap;

  // src/items/SidePanelItem.js
  var SidePanelItem = class extends Lightning_default.Component {
    static _template() {
      return {
        Item: {
          rect: true,
          Image: {
            w: 70,
            H: 70
          },
          Title: {
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 40,
              textColor: 4294967295
            }
          }
        }
      };
    }
    _init() {
      this.tag("Image").patch({
        src: Utils_default.asset(this.data.url),
        w: this.w,
        h: this.h,
        scale: this.unfocus
      });
    }
    _focus() {
      this.tag("Image").patch({
        w: this.w,
        h: this.h,
        scale: this.focus,
        color: CONFIG.theme.hex
      });
    }
    _unfocus() {
      this.tag("Image").patch({
        w: this.w,
        h: this.h,
        scale: this.unfocus,
        color: 4294967295
      });
    }
    setColor() {
      this.tag("Image").patch({
        w: this.w,
        h: this.h,
        scale: this.focus,
        color: CONFIG.theme.hex
      });
    }
    clearColor() {
      this.tag("Image").patch({
        w: this.w,
        h: this.h,
        scale: this.unfocus,
        color: 4294967295
      });
    }
  };

  // src/views/SidePanel.js
  var SidePanel = class extends Lightning_default.Component {
    static _template() {
      return {
        color: 4278190080,
        rect: true,
        y: 270,
        w: 200,
        h: 1080,
        SidePanel: {
          x: 0,
          y: 127,
          w: 240,
          h: 750,
          type: Lightning_default.components.ListComponent,
          roll: true,
          horizontal: false,
          invertDirection: true
        }
      };
    }
    _init() {
      this.homeApi = new HomeApi();
      this.tag("SidePanel").sidePanelItems = this.homeApi.getSidePanelInfo();
      this.sidePanelData = this.homeApi.getSidePanelInfo();
      this._setState("SidePanel");
      this.indexVal = 0;
      this.prevIndex = 0;
    }
    set sidePanelItems(items) {
      this.tag("SidePanel").patch({
        x: 105
      });
      this.tag("SidePanel").items = items.map((info, index) => {
        this.data = info;
        return {
          w: 50,
          h: 50,
          y: index == 0 ? 20 : (index + 1) * 20,
          type: SidePanelItem,
          data: info,
          focus: 1.1,
          unfocus: 1,
          x_text: 100,
          y_text: 160,
          text_focus: 1.1,
          text_unfocus: 0.9
        };
      });
      this.tag("SidePanel").start();
    }
    set resetSidePanelItems(items) {
      this.tag("SidePanel").patch({
        x: 0
      });
      this.tag("SidePanel").items = items.map((info, index) => {
        return {
          w: 204,
          h: 184,
          y: index == 0 ? 25 : index == 1 ? 105 : index == 2 ? 260 : 470,
          type: SidePanelItem,
          data: info,
          focus: 0.7,
          unfocus: 0.4,
          x_text: 100,
          y_text: 160,
          text_focus: 1.1,
          text_unfocus: 0.9
        };
      });
      this.tag("SidePanel").start();
    }
    set scale(scale) {
      this.tag("SidePanel").patch({
        scale
      });
    }
    set x(x) {
      this.tag("SidePanel").patch({
        x
      });
    }
    set index(index) {
      this.tag("SidePanel").items[this.prevIndex].clearColor();
      this.indexVal = index;
    }
    set deFocus(val) {
      if (val) {
        this.tag("SidePanel").items[this.prevIndex].clearColor();
      } else {
        this.tag("SidePanel").items[this.prevIndex].setColor();
      }
    }
    set scrollableLastRow(bool) {
      this.isLastRowScrollable = bool;
    }
    static _states() {
      return [class SidePanel extends this {
        _getFocused() {
          if (this.tag("SidePanel").length) {
            return this.tag("SidePanel").items[this.indexVal];
          }
        }
        _handleKey(key) {
          if (key.keyCode == Keymap_default.ArrowRight || key.keyCode == Keymap_default.Enter) {
            if (this.prevIndex != this.indexVal) {
              this.tag("SidePanel").items[this.prevIndex].clearColor();
            }
            this.prevIndex = this.indexVal;
            this.fireAncestors("$goToMainView", this.tag("SidePanel").items[this.indexVal], this.indexVal);
          } else if (key.keyCode == Keymap_default.ArrowDown) {
            if (this.tag("SidePanel").length - 1 != this.indexVal) {
              this.indexVal = this.indexVal + 1;
            }
            if (this.indexVal === 2) {
              this.fireAncestors("$scroll", -130);
            }
            if (this.indexVal === 1) {
              this.fireAncestors("$scroll", 270);
            }
            return this.tag("SidePanel").items[this.indexVal];
          } else if (key.keyCode == Keymap_default.ArrowUp) {
            if (this.indexVal === 0) {
              this.fireAncestors("$goToTopPanel", 0);
            } else {
              this.indexVal = this.indexVal - 1;
              if (this.indexVal === 2) {
                this.fireAncestors("$scroll", -130);
              }
              if (this.indexVal === 1) {
                this.fireAncestors("$scroll", 270);
              }
              return this.tag("SidePanel").items[this.indexVal];
            }
          }
        }
      }];
    }
  };

  // node_modules/redux/es/redux.js
  var $$observable = function() {
    return typeof Symbol === "function" && Symbol.observable || "@@observable";
  }();
  var randomString = function randomString2() {
    return Math.random().toString(36).substring(7).split("").join(".");
  };
  var ActionTypes = {
    INIT: "@@redux/INIT" + randomString(),
    REPLACE: "@@redux/REPLACE" + randomString(),
    PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
      return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
    }
  };
  function isPlainObject(obj) {
    if (typeof obj !== "object" || obj === null)
      return false;
    var proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
  }
  function miniKindOf(val) {
    if (val === void 0)
      return "undefined";
    if (val === null)
      return "null";
    var type = typeof val;
    switch (type) {
      case "boolean":
      case "string":
      case "number":
      case "symbol":
      case "function": {
        return type;
      }
    }
    if (Array.isArray(val))
      return "array";
    if (isDate(val))
      return "date";
    if (isError(val))
      return "error";
    var constructorName = ctorName(val);
    switch (constructorName) {
      case "Symbol":
      case "Promise":
      case "WeakMap":
      case "WeakSet":
      case "Map":
      case "Set":
        return constructorName;
    }
    return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
  }
  function ctorName(val) {
    return typeof val.constructor === "function" ? val.constructor.name : null;
  }
  function isError(val) {
    return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
  }
  function isDate(val) {
    if (val instanceof Date)
      return true;
    return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
  }
  function kindOf(val) {
    var typeOfVal = typeof val;
    if (true) {
      typeOfVal = miniKindOf(val);
    }
    return typeOfVal;
  }
  function createStore(reducer, preloadedState, enhancer) {
    var _ref2;
    if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
      throw new Error(false ? formatProdErrorMessage(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
    }
    if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
      enhancer = preloadedState;
      preloadedState = void 0;
    }
    if (typeof enhancer !== "undefined") {
      if (typeof enhancer !== "function") {
        throw new Error(false ? formatProdErrorMessage(1) : "Expected the enhancer to be a function. Instead, received: '" + kindOf(enhancer) + "'");
      }
      return enhancer(createStore)(reducer, preloadedState);
    }
    if (typeof reducer !== "function") {
      throw new Error(false ? formatProdErrorMessage(2) : "Expected the root reducer to be a function. Instead, received: '" + kindOf(reducer) + "'");
    }
    var currentReducer = reducer;
    var currentState = preloadedState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;
    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }
    function getState() {
      if (isDispatching) {
        throw new Error(false ? formatProdErrorMessage(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
      }
      return currentState;
    }
    function subscribe(listener) {
      if (typeof listener !== "function") {
        throw new Error(false ? formatProdErrorMessage(4) : "Expected the listener to be a function. Instead, received: '" + kindOf(listener) + "'");
      }
      if (isDispatching) {
        throw new Error(false ? formatProdErrorMessage(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
      }
      var isSubscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }
        if (isDispatching) {
          throw new Error(false ? formatProdErrorMessage(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
        }
        isSubscribed = false;
        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
        currentListeners = null;
      };
    }
    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error(false ? formatProdErrorMessage(7) : "Actions must be plain objects. Instead, the actual type was: '" + kindOf(action) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
      }
      if (typeof action.type === "undefined") {
        throw new Error(false ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
      }
      if (isDispatching) {
        throw new Error(false ? formatProdErrorMessage(9) : "Reducers may not dispatch actions.");
      }
      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }
      var listeners = currentListeners = nextListeners;
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener();
      }
      return action;
    }
    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== "function") {
        throw new Error(false ? formatProdErrorMessage(10) : "Expected the nextReducer to be a function. Instead, received: '" + kindOf(nextReducer));
      }
      currentReducer = nextReducer;
      dispatch({
        type: ActionTypes.REPLACE
      });
    }
    function observable() {
      var _ref;
      var outerSubscribe = subscribe;
      return _ref = {
        subscribe: function subscribe2(observer) {
          if (typeof observer !== "object" || observer === null) {
            throw new Error(false ? formatProdErrorMessage(11) : "Expected the observer to be an object. Instead, received: '" + kindOf(observer) + "'");
          }
          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }
          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe
          };
        }
      }, _ref[$$observable] = function() {
        return this;
      }, _ref;
    }
    dispatch({
      type: ActionTypes.INIT
    });
    return _ref2 = {
      dispatch,
      subscribe,
      getState,
      replaceReducer
    }, _ref2[$$observable] = observable, _ref2;
  }
  function warning(message) {
    if (typeof console !== "undefined" && typeof console.error === "function") {
      console.error(message);
    }
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
  function isCrushed() {
  }
  if (typeof isCrushed.name === "string" && isCrushed.name !== "isCrushed") {
    warning('You are currently using minified code outside of NODE_ENV === "production". This means that you are running a slower development build of Redux. You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) to ensure you have the correct code for your production build.');
  }

  // src/redux.js
  function counter(state3, action) {
    if (typeof state3 === "undefined") {
      return 0;
    }
    switch (action.type) {
      case "ACTION_LISTEN_START":
        return "ACTION_LISTEN_START";
      case "ACTION_LISTEN_STOP":
        return "ACTION_LISTEN_STOP";
      default:
        return state3;
    }
  }
  var store2 = createStore(counter);
  var redux_default = store2;

  // src/views/TopPanel.js
  var TopPanel = class extends Lightning_default.Component {
    static _template() {
      return {
        TopPanel: {
          color: 4278190080,
          rect: true,
          w: 1920,
          h: 270,
          Mic: {
            x: 105,
            y: 87,
            src: Utils_default.asset("/images/topPanel/microphone.png"),
            w: 50,
            h: 50
          },
          Logo: {
            x: 200,
            y: 90,
            src: Utils_default.asset("/images/" + CONFIG.theme.logo),
            w: 227,
            h: 43
          },
          Page: {
            x: 200,
            y: 184,
            text: {
              fontSize: 40,
              text: Language_default.translate("home"),
              textColor: CONFIG.theme.hex,
              fontStyle: "bolder",
              fontFace: CONFIG.language.font,
              wordWrapWidth: 1720,
              maxLines: 1
            }
          },
          Settings: {
            x: 1825 - 105 - 160 - 37 + 30,
            y: 111,
            mountY: 0.5,
            src: Utils_default.asset("/images/topPanel/setting.png"),
            w: 37,
            h: 37
          },
          Time: {
            x: 1920 - 105 - 160,
            y: 111,
            mountY: 0.5,
            text: {
              text: "",
              fontSize: 35,
              fontFace: CONFIG.language.font
            },
            w: 160,
            h: 60
          }
        }
      };
    }
    _init() {
      this.indexVal = 1;
      this.timeZone = null;
      this.audiointerval = null;
      new AppApi().getZone().then(function(res) {
        this.timeZone = res;
      }.bind(this)).catch((err) => {
        console.log("Timezone api request error", err);
      });
      function render() {
        if (redux_default.getState() == "ACTION_LISTEN_STOP") {
          this.tag("AudioListenSymbol").visible = false;
          clearInterval(this.audiointerval);
          this.audiointerval = null;
        } else if (redux_default.getState() == "ACTION_LISTEN_START") {
          if (!this.audiointerval) {
            this.tag("AudioListenSymbol").visible = true;
            let mode = 1;
            this.audiointerval = setInterval(function() {
              if (mode % 2 == 0) {
                this.tag("AudioListenSymbol").w = 80;
                this.tag("AudioListenSymbol").h = 80;
              } else {
                this.tag("AudioListenSymbol").w = 70;
                this.tag("AudioListenSymbol").h = 70;
              }
              mode++;
              if (mode > 20) {
                mode = 0;
              }
              ;
            }.bind(this), 250);
          }
        }
      }
      redux_default.subscribe(render.bind(this));
      this.zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this._setState("Setting");
    }
    set index(index) {
      this.indexVal = index;
    }
    _focus() {
      this._setState(this.state);
      this.tag("Settings").color = CONFIG.theme.hex;
    }
    set changeText(text) {
      this.tag("Page").text.text = text;
      if (text === "Home") {
        this.tag("Settings").color = 4294967295;
      }
    }
    set changeMic(toggle) {
      if (toggle) {
        this.tag("Mic").src = Utils_default.asset("/images/topPanel/microphone_mute.png");
      } else {
        this.tag("Mic").src = Utils_default.asset("/images/topPanel/microphone.png");
      }
    }
    _build() {
      setInterval(() => {
        let _date = this.updateTime();
        if (this.zone) {
          this.tag("Time").patch({
            text: {
              text: _date.strTime
            }
          });
        }
      }, 1e3);
    }
    updateIcon(tagname, url) {
      this.tag(tagname).patch({
        src: Utils_default.asset(url)
      });
    }
    updateTime() {
      if (this.zone) {
        let date = new Date();
        date = new Date(date.toLocaleString("en-US", {
          timeZone: this.zone
        }));
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let strDay = days[date.getDay()];
        let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let strMonth = month[date.getMonth()];
        let strDate = date.toLocaleDateString("en-US", {
          day: "2-digit"
        }) + " " + strMonth + " " + date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        let strTime = hours + ":" + minutes + " " + ampm;
        return {
          strTime,
          strDay,
          strDate
        };
      } else {
        return "";
      }
    }
    static _states() {
      return [class Mic extends this {
        $enter() {
          this.tag("Mic").color = CONFIG.theme.hex;
        }
        _getFocused() {
          this.tag("Mic").color = CONFIG.theme.hex;
        }
        $exit() {
          this.tag("Mic").color = 4294967295;
        }
        _handleKey(key) {
          if (key.keyCode == Keymap_default.ArrowRight) {
            this._setState("Setting");
          } else if (key.keyCode == Keymap_default.ArrowDown) {
            this.tag("Mic").color = 4294967295;
            this.fireAncestors("$goToSidePanel", 0);
          }
        }
      }, class Setting extends this {
        $enter() {
          this.tag("Settings").color = CONFIG.theme.hex;
        }
        _handleKey(key) {
          if (key.keyCode === Keymap_default.ArrowDown) {
            Router_default.focusPage();
            this.tag("Settings").color = 4294967295;
          } else if (key.keyCode === Keymap_default.ArrowLeft) {
          } else if (key.keyCode === Keymap_default.Enter) {
            Router_default.navigate("settings");
            Router_default.focusPage();
            this.tag("Settings").color = 4294967295;
          }
        }
        $exit() {
          this.tag("Settings").color = 4294967295;
        }
      }];
    }
  };

  // src/views/Menu.js
  var Menu = class extends Lightning_default.Component {
    static _template() {
      return {
        TopPanel: {
          type: TopPanel
        },
        SidePanel: {
          type: SidePanel
        }
      };
    }
    pageTransition() {
      return "down";
    }
    _init() {
      this.homeApi = new HomeApi();
      this.tag("SidePanel").sidePanelItems = this.homeApi.getSidePanelInfo();
    }
    _focus() {
      if (!this.mainView) {
        this.mainView = Router_default.activePage();
      }
      this._setState("SidePanel");
    }
    _handleRight() {
      Router_default.focusPage();
    }
    $goToTopPanel() {
      this._setState("TopPanel");
      Router_default.focusWidget("Menu");
    }
    $goToSidePanel() {
      this._setState("SidePanel");
    }
    $goToMainView(sidePanelInstance, index) {
      this.mainView.index(index);
      Router_default.focusPage();
      sidePanelInstance.setColor();
    }
    refreshMainView() {
      if (this.mainView) {
        this.mainView.refreshFirstRow();
      }
    }
    setIndex(index) {
      this.tag("SidePanel").index = index;
    }
    notify(val) {
      if (val === "TopPanel") {
        Router_default.focusWidget("Menu");
        this._setState("TopPanel");
      }
    }
    $scroll(val) {
      if (this.mainView) {
        this.mainView.scroll(val);
      }
    }
    updateTopPanelText(text) {
      this.tag("TopPanel").changeText = text;
    }
    static _states() {
      return [class SidePanel extends this {
        _getFocused() {
          return this.tag("SidePanel");
        }
      }, class TopPanel extends this {
        _getFocused() {
          return this.tag("TopPanel");
        }
      }];
    }
  };

  // src/keyIntercept/keyIntercept.js
  var config5 = {
    host: "127.0.0.1",
    port: 9998,
    default: 1
  };
  var thunder7 = thunderJS_default(config5);
  var appApi7 = new AppApi();
  function keyIntercept() {
    const rdkshellCallsign = "org.rdk.RDKShell";
    thunder7.Controller.activate({
      callsign: rdkshellCallsign
    }).then((result) => {
      console.log("Successfully activated RDK Shell");
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call("org.rdk.RDKShell", "setFocus", {
        client: "ResidentApp"
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.AudioVolumeMute,
        modifiers: []
      }).then((result2) => {
        console.log("addKeyIntercept success");
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.on(rdkshellCallsign, "onSuspended", (notification) => {
        if (notification) {
          console.log("onSuspended notification: " + notification.client);
          if (Storage.get("applicationType") == notification.client) {
            Storage.set("applicationType", "");
            appApi7.setVisibility("ResidentApp", true);
            thunder7.call("org.rdk.RDKShell", "moveToFront", {
              client: "ResidentApp"
            }).then((result2) => {
              console.log("ResidentApp moveToFront Success");
            });
            thunder7.call("org.rdk.RDKShell", "setFocus", {
              client: "ResidentApp"
            }).then((result2) => {
              console.log("ResidentApp setFocus Success");
            });
          }
        }
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.Escape,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.F1,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.Power,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.F7,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.AudioVolumeUp,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.AudioVolumeDown,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "foreground",
        keyCode: Keymap_default.AudioVolumeDown,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "foreground",
        keyCode: Keymap_default.AudioVolumeUp,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "foreground",
        keyCode: Keymap_default.AudioVolumeMute,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.MediaFastForward,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: 142,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.Home,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.MediaRewind,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "ResidentApp",
        keyCode: Keymap_default.Pause,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "Cobalt",
        keyCode: Keymap_default.Escape,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "Amazon",
        keyCode: Keymap_default.Escape,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "Cobalt",
        keyCode: Keymap_default.Home,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "Amazon",
        keyCode: Keymap_default.Home,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "Cobalt",
        keyCode: Keymap_default.Backspace,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    }).then((result) => {
      thunder7.call(rdkshellCallsign, "addKeyIntercept", {
        client: "Amazon",
        keyCode: Keymap_default.Backspace,
        modifiers: []
      }).catch((err) => {
        console.log("Error", err);
      });
    }).catch((err) => {
      console.log("Error", err);
    });
  }

  // src/App.js
  var config6 = {
    host: "127.0.0.1",
    port: 9998,
    default: 1
  };
  var powerState = "ON";
  var thunder8 = thunderJS_default(config6);
  var appApi8 = new AppApi();
  var App = class extends Router_default.App {
    static getFonts() {
      return [{
        family: CONFIG.language.font,
        url: Utils_default.asset("fonts/" + CONFIG.language.fontSrc)
      }];
    }
    _setup() {
      Router_default.startRouter(routes_default, this);
      document.onkeydown = (e) => {
        if (e.keyCode == Keymap_default.Backspace) {
          e.preventDefault();
        }
      };
    }
    static _template() {
      return {
        Pages: {
          forceZIndexContext: true
        },
        Widgets: {
          Menu: {
            type: Menu
          },
          Fail: {
            type: Failscreen
          }
        }
      };
    }
    static language() {
      return {
        file: Utils_default.asset("language/language-file.json"),
        language: CONFIG.language.id
      };
    }
    _captureKey(key) {
      if (key.keyCode == Keymap_default.Escape || key.keyCode == Keymap_default.Home || key.keyCode === Keymap_default.m) {
        if (Storage_default.get("applicationType") != "") {
          this.deactivateChildApp(Storage_default.get("applicationType"));
          Storage_default.set("applicationType", "");
          appApi8.setVisibility("ResidentApp", true);
          thunder8.call("org.rdk.RDKShell", "moveToFront", {
            client: "ResidentApp"
          }).then((result) => {
            console.log("ResidentApp moveToFront Success");
          });
          thunder8.call("org.rdk.RDKShell", "setFocus", {
            client: "ResidentApp"
          }).then((result) => {
            console.log("ResidentApp moveToFront Success");
          }).catch((err) => {
            console.log("Error", err);
          });
        } else {
          if (!Router_default.isNavigating()) {
            Router_default.navigate("menu");
          }
        }
      }
      if (key.keyCode == Keymap_default.F9) {
        store.dispatch({
          type: "ACTION_LISTEN_START"
        });
        return true;
      }
      if (key.keyCode == Keymap_default.Power) {
        if (powerState == "ON") {
          this.standby("STANDBY");
          return true;
        } else if (powerState == "STANDBY") {
          appApi8.standby("ON").then((res) => {
            powerState = "ON";
          });
          return true;
        }
      } else if (key.keyCode == 228) {
        console.log("___________DEEP_SLEEP_______________________F12");
        appApi8.standby("DEEP_SLEEP").then((res) => {
          powerState = "DEEP_SLEEP";
        });
        return true;
      } else if (key.keyCode == Keymap_default.AudioVolumeMute) {
        if (appApi8.activatedForeground) {
          appApi8.setVisibility("foreground", true);
          appApi8.zorder("foreground");
        }
        return true;
      } else if (key.keyCode == Keymap_default.AudioVolumeUp) {
        if (appApi8.activatedForeground) {
          appApi8.setVisibility("foreground", true);
          appApi8.zorder("foreground");
        }
        return true;
      } else if (key.keyCode == Keymap_default.AudioVolumeDown) {
        if (appApi8.activatedForeground) {
          appApi8.setVisibility("foreground", true);
          appApi8.zorder("foreground");
        }
        return true;
      }
      return false;
    }
    _init() {
      appApi8.enableDisplaySettings();
      appApi8.cobaltStateChangeEvent();
      this.xcastApi = new XcastApi();
      this.xcastApi.activate().then((result) => {
        if (result) {
          this.registerXcastListeners();
        }
      });
      keyIntercept();
      if (!availableLanguages.includes(localStorage.getItem("Language"))) {
        localStorage.setItem("Language", "English");
      }
      thunder8.on("Controller.1", "all", (noti) => {
        if (noti.data.url && noti.data.url.slice(-5) === "#boot") {
          this.deactivateChildApp(Storage_default.get("applicationType"));
          Storage_default.set("applicationType", "");
          appApi8.setVisibility("ResidentApp", true);
          thunder8.call("org.rdk.RDKShell", "moveToFront", {
            client: "ResidentApp"
          }).then((result) => {
            console.log("ResidentApp moveToFront Success");
          });
          thunder8.call("org.rdk.RDKShell", "setFocus", {
            client: "ResidentApp"
          }).then((result) => {
            console.log("ResidentApp moveToFront Success");
          }).catch((err) => {
            console.log("Error", err);
          });
        }
      });
      thunder8.on("Controller", "statechange", (notification) => {
        console.log(JSON.stringify(notification));
        if (notification && (notification.callsign === "Cobalt" || notification.callsign === "Amazon" || notification.callsign === "LightningApp") && notification.state == "Deactivation") {
          Storage_default.set("applicationType", "");
          appApi8.setVisibility("ResidentApp", true);
          thunder8.call("org.rdk.RDKShell", "moveToFront", {
            client: "ResidentApp"
          }).then((result) => {
            console.log("ResidentApp moveToFront Success" + JSON.stringify(result));
          });
          thunder8.call("org.rdk.RDKShell", "setFocus", {
            client: "ResidentApp"
          }).then((result) => {
            console.log("ResidentApp setFocus Success" + JSON.stringify(result));
          }).catch((err) => {
            console.log("Error", err);
          });
        }
        if (notification && notification.callsign === "org.rdk.HdmiCec_2" && notification.state === "Activated") {
          this.advanceScreen = Router_default.activePage();
          if (typeof this.advanceScreen.performOTPAction === "function") {
            console.log("otp action");
            this.advanceScreen.performOTPAction();
          }
        }
      });
    }
    deactivateChildApp(plugin) {
      var appApi9 = new AppApi();
      switch (plugin) {
        case "WebApp":
          appApi9.deactivateWeb();
          break;
        case "Cobalt":
          appApi9.deactivateCobalt();
          break;
        case "Lightning":
          appApi9.deactivateLightning();
          break;
        case "Native":
          appApi9.killNative();
          break;
        case "Amazon":
          appApi9.deactivateNativeApp("Amazon");
        case "Netflix":
          appApi9.deactivateNativeApp("Netflix");
        default:
          break;
      }
    }
    registerXcastListeners() {
      this.xcastApi.registerEvent("onApplicationLaunchRequest", (notification) => {
        console.log("Received a launch request " + JSON.stringify(notification));
        if (this.xcastApps(notification.applicationName)) {
          let applicationName = this.xcastApps(notification.applicationName);
          if (applicationName == "Amazon" && Storage_default.get("applicationType") != "Amazon") {
            this.deactivateChildApp(Storage_default.get("applicationType"));
            appApi8.launchPremiumApp("Amazon");
            Storage_default.set("applicationType", "Amazon");
            appApi8.setVisibility("ResidentApp", false);
            let params = {
              applicationName: notification.applicationName,
              state: "running"
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName == "Netflix" && Storage_default.get("applicationType") != "Netflix") {
            appApi8.configureApplication("Netflix", notification.parameters).then((res) => {
              this.deactivateChildApp(Storage_default.get("applicationType"));
              appApi8.launchPremiumApp("Netflix");
              Storage_default.set("applicationType", "Netflix");
              appApi8.setVisibility("ResidentApp", false);
              if (AppApi.pluginStatus("Netflix")) {
                let params = {
                  applicationName: notification.applicationName,
                  state: "running"
                };
                this.xcastApi.onApplicationStateChanged(params);
              }
            }).catch((err) => {
              console.log("Error while launching " + applicationName + ", Err: " + JSON.stringify(err));
            });
          } else if (applicationName == "Cobalt" && Storage_default.get("applicationType") != "Cobalt") {
            this.deactivateChildApp(Storage_default.get("applicationType"));
            appApi8.launchCobalt(notification.parameters.url);
            Storage_default.set("applicationType", "Cobalt");
            appApi8.setVisibility("ResidentApp", false);
            let params = {
              applicationName: notification.applicationName,
              state: "running"
            };
            this.xcastApi.onApplicationStateChanged(params);
          }
        }
      });
      this.xcastApi.registerEvent("onApplicationHideRequest", (notification) => {
        console.log("Received a hide request " + JSON.stringify(notification));
        if (this.xcastApps(notification.applicationName)) {
          let applicationName = this.xcastApps(notification.applicationName);
          console.log("Hide " + this.xcastApps(notification.applicationName));
          if (applicationName === "Amazon" && Storage_default.get("applicationType") === "Amazon") {
            appApi8.suspendPremiumApp("Amazon");
            let params = {
              applicationName: notification.applicationName,
              state: "stopped"
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === "Netflix" && Storage_default.get("applicationType") === "Netflix") {
            appApi8.suspendPremiumApp("Netflix");
            let params = {
              applicationName: notification.applicationName,
              state: "stopped"
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === "Cobalt" && Storage_default.get("applicationType") === "Cobalt") {
            appApi8.suspendCobalt();
            let params = {
              applicationName: notification.applicationName,
              state: "stopped"
            };
            this.xcastApi.onApplicationStateChanged(params);
          }
          Storage_default.set("applicationType", "");
          appApi8.setVisibility("ResidentApp", true);
          thunder8.call("org.rdk.RDKShell", "moveToFront", {
            client: "ResidentApp"
          }).then((result) => {
            console.log("ResidentApp moveToFront Success");
          });
        }
      });
      this.xcastApi.registerEvent("onApplicationResumeRequest", (notification) => {
        console.log("Received a resume request " + JSON.stringify(notification));
        if (this.xcastApps(notification.applicationName)) {
          let applicationName = this.xcastApps(notification.applicationName);
          console.log("Resume " + this.xcastApps(notification.applicationName));
          if (applicationName == "Amazon" && Storage_default.get("applicationType") != "Amazon") {
            this.deactivateChildApp(Storage_default.get("applicationType"));
            appApi8.launchPremiumApp("Amazon");
            Storage_default.set("applicationType", "Amazon");
            appApi8.setVisibility("ResidentApp", false);
            let params = {
              applicationName: notification.applicationName,
              state: "running"
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName == "Netflix" && Storage_default.get("applicationType") != "Netflix") {
            this.deactivateChildApp(Storage_default.get("applicationType"));
            appApi8.launchPremiumApp("Netflix");
            Storage_default.set("applicationType", "Amazon");
            appApi8.setVisibility("ResidentApp", false);
            let params = {
              applicationName: notification.applicationName,
              state: "running"
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName == "Cobalt" && Storage_default.get("applicationType") != "Cobalt") {
            this.deactivateChildApp(Storage_default.get("applicationType"));
            appApi8.launchCobalt();
            Storage_default.set("applicationType", "Cobalt");
            appApi8.setVisibility("ResidentApp", false);
            let params = {
              applicationName: notification.applicationName,
              state: "running"
            };
            this.xcastApi.onApplicationStateChanged(params);
          }
        }
      });
      this.xcastApi.registerEvent("onApplicationStopRequest", (notification) => {
        console.log("Received a stop request " + JSON.stringify(notification));
        if (this.xcastApps(notification.applicationName)) {
          console.log("Stop " + this.xcastApps(notification.applicationName));
          let applicationName = this.xcastApps(notification.applicationName);
          if (applicationName === "Amazon" && Storage_default.get("applicationType") === "Amazon") {
            appApi8.deactivateNativeApp("Amazon");
            Storage_default.set("applicationType", "");
            appApi8.setVisibility("ResidentApp", true);
            thunder8.call("org.rdk.RDKShell", "moveToFront", {
              client: "ResidentApp"
            }).then((result) => {
              console.log("ResidentApp moveToFront Success");
            });
            let params = {
              applicationName: notification.applicationName,
              state: "stopped"
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === "Netflix" && Storage_default.get("applicationType") === "Netflix") {
            appApi8.deactivateNativeApp("Netflix");
            Storage_default.set("applicationType", "");
            appApi8.setVisibility("ResidentApp", true);
            thunder8.call("org.rdk.RDKShell", "moveToFront", {
              client: "ResidentApp"
            }).then((result) => {
              console.log("ResidentApp moveToFront Success");
            });
            let params = {
              applicationName: notification.applicationName,
              state: "stopped"
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === "Cobalt" && Storage_default.get("applicationType") === "Cobalt") {
            appApi8.deactivateCobalt();
            Storage_default.set("applicationType", "");
            appApi8.setVisibility("ResidentApp", true);
            thunder8.call("org.rdk.RDKShell", "moveToFront", {
              client: "ResidentApp"
            }).then((result) => {
              console.log("ResidentApp moveToFront Success");
            });
            let params = {
              applicationName: notification.applicationName,
              state: "stopped"
            };
            this.xcastApi.onApplicationStateChanged(params);
          }
        }
      });
      this.xcastApi.registerEvent("onApplicationStateRequest", (notification) => {
        if (this.xcastApps(notification.applicationName)) {
          let applicationName = this.xcastApps(notification.applicationName);
          let params = {
            applicationName: notification.applicationName,
            state: "stopped"
          };
          appApi8.registerEvent("statechange", (results) => {
            if (results.callsign === applicationName && results.state === "Activated") {
              params.state = "running";
            }
            this.xcastApi.onApplicationStateChanged(params);
            console.log("State of " + this.xcastApps(notification.applicationName));
          });
        }
      });
    }
    xcastApps(app2) {
      if (Object.keys(XcastApi.supportedApps()).includes(app2)) {
        return XcastApi.supportedApps()[app2];
      } else
        return false;
    }
    $mountEventConstructor(fun) {
      this.ListenerConstructor = fun;
      console.log(`MountEventConstructor was initialized`);
    }
    $registerUsbMount() {
      this.disposableListener = this.ListenerConstructor();
      console.log(`Successfully registered the usb Mount`);
    }
    $deRegisterUsbMount() {
      console.log(`the current usbListener = ${this.disposableListener}`);
      this.disposableListener.dispose();
      console.log(`successfully deregistered usb listener`);
    }
    standby(value) {
      console.log(`standby call`);
      if (value == "Back") {
      } else {
        if (powerState == "ON") {
          console.log(`Power state was on trying to set it to standby`);
          appApi8.standby(value).then((res) => {
            if (res.success) {
              console.log(`successfully set to standby`);
              powerState = "STANDBY";
              if (Storage_default.get("applicationType") == "WebApp" && Storage_default.get("ipAddress")) {
                Storage_default.set("applicationType", "");
                appApi8.suspendWeb();
                appApi8.setVisibility("ResidentApp", true);
              } else if (Storage_default.get("applicationType") == "Lightning" && Storage_default.get("ipAddress")) {
                Storage_default.set("applicationType", "");
                appApi8.suspendLightning();
                appApi8.setVisibility("ResidentApp", true);
              } else if (Storage_default.get("applicationType") == "Native" && Storage_default.get("ipAddress")) {
                Storage_default.set("applicationType", "");
                appApi8.killNative();
                appApi8.setVisibility("ResidentApp", true);
              } else if (Storage_default.get("applicationType") == "Amazon") {
                Storage_default.set("applicationType", "");
                appApi8.suspendPremiumApp("Amazon");
                appApi8.setVisibility("ResidentApp", true);
              } else if (Storage_default.get("applicationType") == "Netflix") {
                Storage_default.set("applicationType", "");
                appApi8.suspendPremiumApp("Netflix");
                appApi8.setVisibility("ResidentApp", true);
              } else if (Storage_default.get("applicationType") == "Cobalt") {
                Storage_default.set("applicationType", "");
                appApi8.suspendCobalt();
                appApi8.setVisibility("ResidentApp", true);
              } else {
                if (!Router_default.isNavigating() && Router_default.getActiveHash() === "player") {
                  Router_default.navigate("menu");
                }
              }
              thunder8.call("org.rdk.RDKShell", "moveToFront", {
                client: "ResidentApp"
              }).then((result) => {
                console.log("ResidentApp moveToFront Success" + JSON.stringify(result));
              }).catch((err) => {
                console.log(`error while moving the resident app to front = ${err}`);
              });
              thunder8.call("org.rdk.RDKShell", "setFocus", {
                client: "ResidentApp"
              }).then((result) => {
                console.log("ResidentApp setFocus Success" + JSON.stringify(result));
              }).catch((err) => {
                console.log("Error", err);
              });
            }
          });
          return true;
        }
      }
    }
    $registerInactivityMonitoringEvents() {
      return new Promise((resolve, reject) => {
        console.log(`registered inactivity listener`);
        appApi8.standby("ON").then((res) => {
          if (res.success) {
            powerState = "ON";
          }
        });
        const systemcCallsign = "org.rdk.RDKShell.1";
        thunder8.Controller.activate({
          callsign: systemcCallsign
        }).then((res) => {
          console.log(`activated the rdk shell plugin trying to set the inactivity listener; res = ${JSON.stringify(res)}`);
          thunder8.on("org.rdk.RDKShell.1", "onUserInactivity", (notification) => {
            console.log(`user was inactive`);
            if (powerState === "ON" && Storage_default.get("applicationType") == "") {
              this.standby("STANDBY");
            }
          }, (err) => {
            console.error(`error while inactivity monitoring , ${err}`);
          });
          resolve(res);
        }).catch((err) => {
          reject(err);
          console.error(`error while activating the displaysettings plugin; err = ${err}`);
        });
      });
    }
    $resetSleepTimer(t) {
      console.log(`reset sleep timer call ${t}`);
      var arr = t.split(" ");
      function setTimer() {
        console.log("Timer ", arr);
        var temp = arr[1].substring(0, 1);
        if (temp === "H") {
          let temp1 = parseFloat(arr[0]) * 60;
          appApi8.setInactivityInterval(temp1).then((res) => {
            Storage_default.set("TimeoutInterval", t);
            console.log(`successfully set the timer to ${t} hours`);
          }).catch((err) => {
            console.error(`error while setting the timer`);
          });
        } else if (temp === "M") {
          console.log(`minutes`);
          let temp1 = parseFloat(arr[0]);
          appApi8.setInactivityInterval(temp1).then((res) => {
            Storage_default.set("TimeoutInterval", t);
            console.log(`successfully set the timer to ${t} minutes`);
          }).catch((err) => {
            console.error(`error while setting the timer`);
          });
        }
      }
      if (arr.length < 2) {
        appApi8.enabledisableinactivityReporting(false).then((res) => {
          if (res.success === true) {
            Storage_default.set("TimeoutInterval", false);
            console.log(`Disabled inactivity reporting`);
          }
        }).catch((err) => {
          console.error(`error : unable to set the reset; error = ${err}`);
        });
      } else {
        appApi8.enabledisableinactivityReporting(true).then((res) => {
          if (res.success === true) {
            console.log(`Enabled inactivity reporting; trying to set the timer to ${t}`);
            setTimer();
          }
        }).catch((err) => {
          console.error(`error while enabling inactivity reporting`);
        });
      }
    }
  };

  // src/index.js
  function src_default() {
    return Launch_default(App, ...arguments);
  }
  return src_exports;
})();
//# sourceMappingURL=appBundle.js.map
