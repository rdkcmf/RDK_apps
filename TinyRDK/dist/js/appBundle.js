/**
 * App version: 1.0.0
 * SDK version: 4.8.3
 * CLI version: 2.8.1
 * 
 * Generated: Wed, 24 Aug 2022 09:41:02 GMT
 */

var APP_com_metrological_app_TinyRDK = (function () {
  'use strict';

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const settings = {};
  const subscribers = {};
  const initSettings = (appSettings, platformSettings) => {
    settings['app'] = appSettings;
    settings['platform'] = platformSettings;
    settings['user'] = {};
  };

  const publish = (key, value) => {
    subscribers[key] && subscribers[key].forEach(subscriber => subscriber(value));
  };

  const dotGrab = function () {
    let obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let key = arguments.length > 1 ? arguments[1] : undefined;
    if (obj === null) return undefined;
    const keys = key.split('.');

    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]] = obj[keys[i]] !== undefined ? obj[keys[i]] : {};
    }

    return typeof obj === 'object' && obj !== null ? Object.keys(obj).length ? obj : undefined : obj;
  };

  var Settings = {
    get(type, key) {
      let fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      const val = dotGrab(settings[type], key);
      return val !== undefined ? val : fallback;
    },

    has(type, key) {
      return !!this.get(type, key);
    },

    set(key, value) {
      settings['user'][key] = value;
      publish(key, value);
    },

    subscribe(key, callback) {
      subscribers[key] = subscribers[key] || [];
      subscribers[key].push(callback);
    },

    unsubscribe(key, callback) {
      if (callback) {
        const index = subscribers[key] && subscribers[key].findIndex(cb => cb === callback);
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

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */

  const prepLog = (type, args) => {
    const colors = {
      Info: 'green',
      Debug: 'gray',
      Warn: 'orange',
      Error: 'red'
    };
    args = Array.from(args);
    return ['%c' + (args.length > 1 && typeof args[0] === 'string' ? args.shift() : type), 'background-color: ' + colors[type] + '; color: white; padding: 2px 4px; border-radius: 2px', args];
  };

  var Log = {
    info() {
      Settings.get('platform', 'log') && console.log.apply(console, prepLog('Info', arguments));
    },

    debug() {
      Settings.get('platform', 'log') && console.debug.apply(console, prepLog('Debug', arguments));
    },

    error() {
      Settings.get('platform', 'log') && console.error.apply(console, prepLog('Error', arguments));
    },

    warn() {
      Settings.get('platform', 'log') && console.warn.apply(console, prepLog('Warn', arguments));
    }

  };

  var executeAsPromise = (function (method) {
    let args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    let result;

    if (method && typeof method === 'function') {
      try {
        result = method.apply(context, args);
      } catch (e) {
        result = e;
      }
    } else {
      result = method;
    } // if it looks like a duck .. ehm ... promise and talks like a promise, let's assume it's a promise


    if (result !== null && typeof result === 'object' && result.then && typeof result.then === 'function') {
      return result;
    } // otherwise make it into a promise
    else {
      return new Promise((resolve, reject) => {
        if (result instanceof Error) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    }
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */

  let sendMetric = (type, event, params) => {
    Log.info('Sending metric', type, event, params);
  };

  const initMetrics = config => {
    sendMetric = config.sendMetric;
  }; // available metric per category

  const metrics$1 = {
    app: ['launch', 'loaded', 'ready', 'close'],
    page: ['view', 'leave'],
    user: ['click', 'input'],
    media: ['abort', 'canplay', 'ended', 'pause', 'play', // with some videos there occur almost constant suspend events ... should investigate
    // 'suspend',
    'volumechange', 'waiting', 'seeking', 'seeked']
  }; // error metric function (added to each category)

  const errorMetric = function (type, message, code, visible) {
    let params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    params = {
      params,
      ...{
        message,
        code,
        visible
      }
    };
    sendMetric(type, 'error', params);
  };

  const Metric = function (type, events) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return events.reduce((obj, event) => {
      obj[event] = function (name) {
        let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        params = { ...options,
          ...(name ? {
            name
          } : {}),
          ...params
        };
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

  const Metrics = types => {
    return Object.keys(types).reduce((obj, type) => {
      // media metric works a bit different!
      // it's a function that accepts a url and returns an object with the available metrics
      // url is automatically passed as a param in every metric
      type === 'media' ? obj[type] = url => Metric(type, types[type], {
        url
      }) : obj[type] = Metric(type, types[type]);
      return obj;
    }, {
      error: errorMetric,
      event: sendMetric
    });
  };

  var Metrics$1 = Metrics(metrics$1);

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  var events$1 = {
    abort: 'Abort',
    canplay: 'CanPlay',
    canplaythrough: 'CanPlayThrough',
    durationchange: 'DurationChange',
    emptied: 'Emptied',
    encrypted: 'Encrypted',
    ended: 'Ended',
    error: 'Error',
    interruptbegin: 'InterruptBegin',
    interruptend: 'InterruptEnd',
    loadeddata: 'LoadedData',
    loadedmetadata: 'LoadedMetadata',
    loadstart: 'LoadStart',
    pause: 'Pause',
    play: 'Play',
    playing: 'Playing',
    progress: 'Progress',
    ratechange: 'Ratechange',
    seeked: 'Seeked',
    seeking: 'Seeking',
    stalled: 'Stalled',
    // suspend: 'Suspend', // this one is called a looooot for some videos
    timeupdate: 'TimeUpdate',
    volumechange: 'VolumeChange',
    waiting: 'Waiting'
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  var autoSetupMixin = (function (sourceObject) {
    let setup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => {};
    let ready = false;

    const doSetup = () => {
      if (ready === false) {
        setup();
        ready = true;
      }
    };

    return Object.keys(sourceObject).reduce((obj, key) => {
      if (typeof sourceObject[key] === 'function') {
        obj[key] = function () {
          doSetup();
          return sourceObject[key].apply(sourceObject, arguments);
        };
      } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).get === 'function') {
        obj.__defineGetter__(key, function () {
          doSetup();
          return Object.getOwnPropertyDescriptor(sourceObject, key).get.apply(sourceObject);
        });
      } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).set === 'function') {
        obj.__defineSetter__(key, function () {
          doSetup();
          return Object.getOwnPropertyDescriptor(sourceObject, key).set.sourceObject[key].apply(sourceObject, arguments);
        });
      } else {
        obj[key] = sourceObject[key];
      }

      return obj;
    }, {});
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let timeout$1 = null;
  var easeExecution = ((cb, delay) => {
    clearTimeout(timeout$1);
    timeout$1 = setTimeout(() => {
      cb();
    }, delay);
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let basePath;
  let proxyUrl;
  const initUtils = config => {
    basePath = ensureUrlWithProtocol(makeFullStaticPath(window.location.pathname, config.path || '/'));

    if (config.proxyUrl) {
      proxyUrl = ensureUrlWithProtocol(config.proxyUrl);
    }
  };
  var Utils = {
    asset(relPath) {
      return basePath + relPath;
    },

    proxyUrl(url) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return proxyUrl ? proxyUrl + '?' + makeQueryString(url, options) : url;
    },

    makeQueryString() {
      return makeQueryString(...arguments);
    },

    // since imageworkers don't work without protocol
    ensureUrlWithProtocol() {
      return ensureUrlWithProtocol(...arguments);
    }

  };
  const ensureUrlWithProtocol = url => {
    if (/^\/\//.test(url)) {
      return window.location.protocol + url;
    }

    if (!/^(?:https?:)/i.test(url)) {
      return window.location.origin + url;
    }

    return url;
  };
  const makeFullStaticPath = function () {
    let pathname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
    let path = arguments.length > 1 ? arguments[1] : undefined;
    // ensure path has traling slash
    path = path.charAt(path.length - 1) !== '/' ? path + '/' : path; // if path is URL, we assume it's already the full static path, so we just return it

    if (/^(?:https?:)?(?:\/\/)/.test(path)) {
      return path;
    }

    if (path.charAt(0) === '/') {
      return path;
    } else {
      // cleanup the pathname (i.e. remove possible index.html)
      pathname = cleanUpPathName(pathname); // remove possible leading dot from path

      path = path.charAt(0) === '.' ? path.substr(1) : path; // ensure path has leading slash

      path = path.charAt(0) !== '/' ? '/' + path : path;
      return pathname + path;
    }
  };
  const cleanUpPathName = pathname => {
    if (pathname.slice(-1) === '/') return pathname.slice(0, -1);
    const parts = pathname.split('/');
    if (parts[parts.length - 1].indexOf('.') > -1) parts.pop();
    return parts.join('/');
  };

  const makeQueryString = function (url) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'url';
    // add operator as an option
    options.operator = 'metrological'; // Todo: make this configurable (via url?)
    // add type (= url or qr) as an option, with url as the value

    options[type] = url;
    return Object.keys(options).map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent('' + options[key]);
    }).join('&');
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */

  const initProfile = config => {
    config.getInfo;
    config.setInfo;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  var lng = window.lng;

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const events = ['timeupdate', 'error', 'ended', 'loadeddata', 'canplay', 'play', 'playing', 'pause', 'loadstart', 'seeking', 'seeked', 'encrypted'];

  let mediaUrl$1 = url => url;

  const initMediaPlayer = config => {
    if (config.mediaUrl) {
      mediaUrl$1 = config.mediaUrl;
    }
  };
  class Mediaplayer extends lng.Component {
    _construct() {
      this._skipRenderToTexture = false;
      this._metrics = null;
      this._textureMode = Settings.get('platform', 'textureMode') || false;
      Log.info('Texture mode: ' + this._textureMode);
      console.warn(["The 'MediaPlayer'-plugin in the Lightning-SDK is deprecated and will be removed in future releases.", "Please consider using the new 'VideoPlayer'-plugin instead.", 'https://rdkcentral.github.io/Lightning-SDK/#/plugins/videoplayer'].join('\n\n'));
    }

    static _template() {
      return {
        Video: {
          VideoWrap: {
            VideoTexture: {
              visible: false,
              pivot: 0.5,
              texture: {
                type: lng.textures.StaticTexture,
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
      return this.tag('Video');
    }

    _init() {
      //re-use videotag if already there
      const videoEls = document.getElementsByTagName('video');
      if (videoEls && videoEls.length > 0) this.videoEl = videoEls[0];else {
        this.videoEl = document.createElement('video');
        this.videoEl.setAttribute('id', 'video-player');
        this.videoEl.style.position = 'absolute';
        this.videoEl.style.zIndex = '1';
        this.videoEl.style.display = 'none';
        this.videoEl.setAttribute('width', '100%');
        this.videoEl.setAttribute('height', '100%');
        this.videoEl.style.visibility = this.textureMode ? 'hidden' : 'visible';
        document.body.appendChild(this.videoEl);
      }

      if (this.textureMode && !this._skipRenderToTexture) {
        this._createVideoTexture();
      }

      this.eventHandlers = [];
    }

    _registerListeners() {
      events.forEach(event => {
        const handler = e => {
          if (this._metrics && this._metrics[event] && typeof this._metrics[event] === 'function') {
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
      Log.info('Deregistering event listeners MediaPlayer');
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
      const stage = this.stage;
      const gl = stage.gl;
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
        const stage = this.stage;

        if (!this._updateVideoTexture) {
          this._updateVideoTexture = () => {
            if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
              const gl = stage.gl;
              const currentTime = new Date().getTime(); // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
              // We'll fallback to fixed 30fps in this case.

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
                  Log.error('texImage2d video', e);

                  this._stopUpdatingVideoTexture();

                  this.videoTextureView.visible = false;
                }

                this.videoTexture.source.forceRenderUpdate();
              }
            }
          };
        }

        if (!this._updatingVideoTexture) {
          stage.on('frameStart', this._updateVideoTexture);
          this._updatingVideoTexture = true;
        }
      }
    }

    _stopUpdatingVideoTexture() {
      if (this.textureMode) {
        const stage = this.stage;
        stage.removeListener('frameStart', this._updateVideoTexture);
        this._updatingVideoTexture = false;
        this.videoTextureView.visible = false;

        if (this.videoTexture.options.source) {
          const gl = stage.gl;
          gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
      }
    }

    updateSettings() {
      let settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // The Component that 'consumes' the media player.
      this._consumer = settings.consumer;

      if (this._consumer && this._consumer.getMediaplayerSettings) {
        // Allow consumer to add settings.
        settings = Object.assign(settings, this._consumer.getMediaplayerSettings());
      }

      if (!lng.Utils.equalValues(this._stream, settings.stream)) {
        if (settings.stream && settings.stream.keySystem) {
          navigator.requestMediaKeySystemAccess(settings.stream.keySystem.id, settings.stream.keySystem.config).then(keySystemAccess => {
            return keySystemAccess.createMediaKeys();
          }).then(createdMediaKeys => {
            return this.videoEl.setMediaKeys(createdMediaKeys);
          }).then(() => {
            if (settings.stream && settings.stream.src) this.open(settings.stream.src);
          }).catch(() => {
            console.error('Failed to set up MediaKeys');
          });
        } else if (settings.stream && settings.stream.src) {
          // This is here to be backwards compatible, will be removed
          // in future sdk release
          if (Settings.get('app', 'hls')) {
            if (!window.Hls) {
              window.Hls = class Hls {
                static isSupported() {
                  console.warn('hls-light not included');
                  return false;
                }

              };
            }

            if (window.Hls.isSupported()) {
              if (!this._hls) this._hls = new window.Hls({
                liveDurationInfinity: true
              });

              this._hls.loadSource(settings.stream.src);

              this._hls.attachMedia(this.videoEl);

              this.videoEl.style.display = 'block';
            }
          } else {
            this.open(settings.stream.src);
          }
        } else {
          this.close();
        }

        this._stream = settings.stream;
      }

      this._setHide(settings.hide);

      this._setVideoArea(settings.videoPos);
    }

    _setHide(hide) {
      if (this.textureMode) {
        this.tag('Video').setSmooth('alpha', hide ? 0 : 1);
      } else {
        this.videoEl.style.visibility = hide ? 'hidden' : 'visible';
      }
    }

    open(url) {
      let settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        hide: false,
        videoPosition: null
      };
      // prep the media url to play depending on platform (mediaPlayerplugin)
      url = mediaUrl$1(url);
      this._metrics = Metrics$1.media(url);
      Log.info('Playing stream', url);

      if (this.application.noVideo) {
        Log.info('noVideo option set, so ignoring: ' + url);
        return;
      } // close the video when opening same url as current (effectively reloading)


      if (this.videoEl.getAttribute('src') === url) {
        this.close();
      }

      this.videoEl.setAttribute('src', url); // force hide, then force show (in next tick!)
      // (fixes comcast playback rollover issue)

      this.videoEl.style.visibility = 'hidden';
      this.videoEl.style.display = 'none';
      setTimeout(() => {
        this.videoEl.style.display = 'block';
        this.videoEl.style.visibility = 'visible';
      });

      this._setHide(settings.hide);

      this._setVideoArea(settings.videoPosition || [0, 0, 1920, 1080]);
    }

    close() {
      // We need to pause first in order to stop sound.
      this.videoEl.pause();
      this.videoEl.removeAttribute('src'); // force load to reset everything without errors

      this.videoEl.load();

      this._clearSrc();

      this.videoEl.style.display = 'none';
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
      return this._getState() === 'Playing';
    }

    doPlay() {
      this.videoEl.play();
    }

    doPause() {
      this.videoEl.pause();
    }

    reload() {
      var url = this.videoEl.getAttribute('src');
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

    seek(time) {
      let absolute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (absolute) {
        this.videoEl.currentTime = time;
      } else {
        this.videoEl.currentTime += time;
      }
    }

    get videoTextureView() {
      return this.tag('Video').tag('VideoTexture');
    }

    get videoTexture() {
      return this.videoTextureView.texture;
    }

    _setVideoArea(videoPos) {
      if (lng.Utils.equalValues(this._videoPos, videoPos)) {
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
        const precision = this.stage.getRenderPrecision();
        this.videoEl.style.left = Math.round(videoPos[0] * precision) + 'px';
        this.videoEl.style.top = Math.round(videoPos[1] * precision) + 'px';
        this.videoEl.style.width = Math.round((videoPos[2] - videoPos[0]) * precision) + 'px';
        this.videoEl.style.height = Math.round((videoPos[3] - videoPos[1]) * precision) + 'px';
      }
    }

    _fireConsumer(event, args) {
      if (this._consumer) {
        this._consumer.fire(event, args);
      }
    }

    _equalInitData(buf1, buf2) {
      if (!buf1 || !buf2) return false;
      if (buf1.byteLength != buf2.byteLength) return false;
      const dv1 = new Int8Array(buf1);
      const dv2 = new Int8Array(buf2);

      for (let i = 0; i != buf1.byteLength; i++) if (dv1[i] != dv2[i]) return false;

      return true;
    }

    error(args) {
      this._fireConsumer('$mediaplayerError', args);

      this._setState('');

      return '';
    }

    loadeddata(args) {
      this._fireConsumer('$mediaplayerLoadedData', args);
    }

    play(args) {
      this._fireConsumer('$mediaplayerPlay', args);
    }

    playing(args) {
      this._fireConsumer('$mediaplayerPlaying', args);

      this._setState('Playing');
    }

    canplay(args) {
      this.videoEl.play();

      this._fireConsumer('$mediaplayerStart', args);
    }

    loadstart(args) {
      this._fireConsumer('$mediaplayerLoad', args);
    }

    seeked() {
      this._fireConsumer('$mediaplayerSeeked', {
        currentTime: this.videoEl.currentTime,
        duration: this.videoEl.duration || 1
      });
    }

    seeking() {
      this._fireConsumer('$mediaplayerSeeking', {
        currentTime: this.videoEl.currentTime,
        duration: this.videoEl.duration || 1
      });
    }

    durationchange(args) {
      this._fireConsumer('$mediaplayerDurationChange', args);
    }

    encrypted(args) {
      const video = args.videoElement;
      const event = args.event; // FIXME: Double encrypted events need to be properly filtered by Gstreamer

      if (video.mediaKeys && !this._equalInitData(this._previousInitData, event.initData)) {
        this._previousInitData = event.initData;

        this._fireConsumer('$mediaplayerEncrypted', args);
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
          this._fireConsumer('$mediaplayerProgress', {
            currentTime: this.videoEl.currentTime,
            duration: this.videoEl.duration || 1
          });
        }

        ended(args) {
          this._fireConsumer('$mediaplayerEnded', args);

          this._setState('');
        }

        pause(args) {
          this._fireConsumer('$mediaplayerPause', args);

          this._setState('Playing.Paused');
        }

        _clearSrc() {
          this._fireConsumer('$mediaplayerStop', {});

          this._setState('');
        }

        static _states() {
          return [class Paused extends this {}];
        }

      }];
    }

  }

  class localCookie {
    constructor(e) {
      return e = e || {}, this.forceCookies = e.forceCookies || !1, !0 === this._checkIfLocalStorageWorks() && !0 !== e.forceCookies ? {
        getItem: this._getItemLocalStorage,
        setItem: this._setItemLocalStorage,
        removeItem: this._removeItemLocalStorage,
        clear: this._clearLocalStorage,
        keys: this._getLocalStorageKeys
      } : {
        getItem: this._getItemCookie,
        setItem: this._setItemCookie,
        removeItem: this._removeItemCookie,
        clear: this._clearCookies,
        keys: this._getCookieKeys
      };
    }

    _checkIfLocalStorageWorks() {
      if ("undefined" == typeof localStorage) return !1;

      try {
        return localStorage.setItem("feature_test", "yes"), "yes" === localStorage.getItem("feature_test") && (localStorage.removeItem("feature_test"), !0);
      } catch (e) {
        return !1;
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

    _getLocalStorageKeys() {
      return Object.keys(window.localStorage);
    }

    _getItemCookie(e) {
      var t = document.cookie.match(RegExp("(?:^|;\\s*)" + function (e) {
        return e.replace(/([.*+?\^${}()|\[\]\/\\])/g, "\\$1");
      }(e) + "=([^;]*)"));
      return t && "" === t[1] && (t[1] = null), t ? t[1] : null;
    }

    _setItemCookie(e, t) {
      var o = new Date(),
          r = new Date(o.getTime() + 15768e7);
      document.cookie = "".concat(e, "=").concat(t, "; expires=").concat(r.toUTCString(), ";");
    }

    _removeItemCookie(e) {
      document.cookie = "".concat(e, "=;Max-Age=-99999999;");
    }

    _clearCookies() {
      document.cookie.split(";").forEach(e => {
        document.cookie = e.replace(/^ +/, "").replace(/=.*/, "=;expires=Max-Age=-99999999");
      });
    }

    _getCookieKeys() {
      return document.cookie.split(";").map(e => e.split("=")[0]);
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let namespace;
  let lc;
  const initStorage = () => {
    namespace = Settings.get('platform', 'id'); // todo: pass options (for example to force the use of cookies)

    lc = new localCookie();
  };

  const namespacedKey = key => namespace ? [namespace, key].join('.') : key;

  var Storage = {
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
        lc.keys().forEach(key => {
          // remove the item if in the namespace
          key.indexOf(namespace + '.') === 0 ? lc.removeItem(key) : null;
        });
      } else {
        lc.clear();
      }
    }

  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const hasRegex = /\{\/(.*?)\/([igm]{0,3})\}/g;
  const isWildcard = /^[!*$]$/;
  const hasLookupId = /\/:\w+?@@([0-9]+?)@@/;
  const isNamedGroup = /^\/:/;
  /**
   * Test if a route is part regular expressed
   * and replace it for a simple character
   * @param route
   * @returns {*}
   */

  const stripRegex = function (route) {
    let char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'R';

    // if route is part regular expressed we replace
    // the regular expression for a character to
    // simplify floor calculation and backtracking
    if (hasRegex.test(route)) {
      route = route.replace(hasRegex, char);
    }

    return route;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */

  /**
   * Create a local request register
   * @param flags
   * @returns {Map<any, any>}
   */
  const createRegister = flags => {
    const reg = new Map() // store user defined and router
    // defined flags in register
    ;
    [...Object.keys(flags), ...Object.getOwnPropertySymbols(flags)].forEach(key => {
      reg.set(key, flags[key]);
    });
    return reg;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class Request {
    constructor() {
      let hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      let navArgs = arguments.length > 1 ? arguments[1] : undefined;
      let storeCaller = arguments.length > 2 ? arguments[2] : undefined;

      /**
       * Hash we navigate to
       * @type {string}
       * @private
       */
      this._hash = hash;
      /**
       * Do we store previous hash in history
       * @type {boolean}
       * @private
       */

      this._storeCaller = storeCaller;
      /**
       * Request and navigate data
       * @type {Map}
       * @private
       */

      this._register = new Map();
      /**
       * Flag if the instance is created due to
       * this request
       * @type {boolean}
       * @private
       */

      this._isCreated = false;
      /**
       * Flag if the instance is shared between
       * previous and current request
       * @type {boolean}
       * @private
       */

      this._isSharedInstance = false;
      /**
       * Flag if the request has been cancelled
       * @type {boolean}
       * @private
       */

      this._cancelled = false;
      /**
       * if instance is shared between requests we copy state object
       * from instance before the new request overrides state
       * @type {null}
       * @private
       */

      this._copiedHistoryState = null; // if there are arguments attached to navigate()
      // we store them in new request

      if (isObject(navArgs)) {
        this._register = createRegister(navArgs);
      } else if (isBoolean(navArgs)) {
        // if second navigate() argument is explicitly
        // set to false we prevent the calling page
        // from ending up in history
        this._storeCaller = navArgs;
      } // @todo: remove because we can simply check
      // ._storeCaller property


      this._register.set(symbols.store, this._storeCaller);
    }

    cancel() {
      Log.debug('[router]:', "cancelled ".concat(this._hash));
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

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class Route {
    constructor() {
      let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // keep backwards compatible
      let type = ['on', 'before', 'after'].reduce((acc, type) => {
        return isFunction(config[type]) ? type : acc;
      }, undefined);
      this._cfg = config;

      if (type) {
        this._provider = {
          type,
          request: config[type]
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

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  /**
   * Simple route length calculation
   * @param route {string}
   * @returns {number} - floor
   */

  const getFloor = route => {
    return stripRegex(route).split('/').length;
  };
  /**
   * return all stored routes that live on the same floor
   * @param floor
   * @returns {Array}
   */

  const getRoutesByFloor = floor => {
    const matches = []; // simple filter of level candidates

    for (let [route] of routes$1.entries()) {
      if (getFloor(route) === floor) {
        matches.push(route);
      }
    }

    return matches;
  };
  /**
   * return a matching route by provided hash
   * hash: home/browse/12 will match:
   * route: home/browse/:categoryId
   * @param hash {string}
   * @returns {boolean|{}} - route
   */


  const getRouteByHash = hash => {
    // @todo: clean up on handleHash
    hash = hash.replace(/^#/, '');
    const getUrlParts = /(\/?:?[^/]+)/g; // grab possible candidates from stored routes

    const candidates = getRoutesByFloor(getFloor(hash)); // break hash down in chunks

    const hashParts = hash.match(getUrlParts) || []; // to simplify the route matching and prevent look around
    // in our getUrlParts regex we get the regex part from
    // route candidate and store them so that we can reference
    // them when we perform the actual regex against hash

    let regexStore = [];
    let matches = candidates.filter(route => {
      let isMatching = true; // replace regex in route with lookup id => @@{storeId}@@

      if (hasRegex.test(route)) {
        const regMatches = route.match(hasRegex);

        if (regMatches && regMatches.length) {
          route = regMatches.reduce((fullRoute, regex) => {
            const lookupId = regexStore.length;
            fullRoute = fullRoute.replace(regex, "@@".concat(lookupId, "@@"));
            regexStore.push(regex.substring(1, regex.length - 1));
            return fullRoute;
          }, route);
        }
      }

      const routeParts = route.match(getUrlParts) || [];

      for (let i = 0, j = routeParts.length; i < j; i++) {
        const routePart = routeParts[i];
        const hashPart = hashParts[i]; // Since we support catch-all and regex driven name groups
        // we first test for regex lookup id and see if the regex
        // matches the value from the hash

        if (hasLookupId.test(routePart)) {
          const routeMatches = hasLookupId.exec(routePart);
          const storeId = routeMatches[1];
          const routeRegex = regexStore[storeId]; // split regex and modifiers so we can use both
          // to create a new RegExp
          // eslint-disable-next-line

          const regMatches = /\/([^\/]+)\/([igm]{0,3})/.exec(routeRegex);

          if (regMatches && regMatches.length) {
            const expression = regMatches[1];
            const modifiers = regMatches[2];
            const regex = new RegExp("^/".concat(expression, "$"), modifiers);

            if (!regex.test(hashPart)) {
              isMatching = false;
            }
          }
        } else if (isNamedGroup.test(routePart)) {
          // we kindly skip namedGroups because this is dynamic
          // we only need to the static and regex drive parts
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
        return routes$1.get(match);
      } else {
        // we give prio to static routes over dynamic
        matches = matches.sort(a => {
          return isNamedGroup.test(a) ? -1 : 1;
        }); // would be strange if this fails
        // but still we test

        if (routeExists(matches[0])) {
          return routes$1.get(matches[0]);
        }
      }
    }

    return false;
  };
  const getValuesFromHash = function () {
    let hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let path = arguments.length > 1 ? arguments[1] : undefined;
    // replace the regex definition from the route because
    // we already did the matching part
    path = stripRegex(path, '');
    const getUrlParts = /(\/?:?[\w%\s:.-]+)/g;
    const hashParts = hash.match(getUrlParts) || [];
    const routeParts = path.match(getUrlParts) || [];
    const getNamedGroup = /^\/:([\w-]+)\/?/;
    return routeParts.reduce((storage, value, index) => {
      const match = getNamedGroup.exec(value);

      if (match && match.length) {
        storage.set(match[1], decodeURIComponent(hashParts[index].replace(/^\//, '')));
      }

      return storage;
    }, new Map());
  };
  const getOption = (stack, prop) => {
    // eslint-disable-next-line
    if (stack && stack.hasOwnProperty(prop)) {
      return stack[prop];
    } // we explicitly return undefined since we're testing
    // for explicit test values

  };
  /**
   * create and return new Route instance
   * @param config
   */

  const createRoute = config => {
    // we need to provide a bit of additional logic
    // for the bootComponent
    if (config.path === '$') {
      let options = {
        preventStorage: true
      };

      if (isObject(config.options)) {
        options = { ...config.options,
          ...options
        };
      }

      config.options = options; // if configured add reference to bootRequest
      // as router after provider

      if (bootRequest) {
        config.after = bootRequest;
      }
    }

    return new Route(config);
  };
  /**
   * Create a new Router request object
   * @param url
   * @param args
   * @param store
   * @returns {*}
   */

  const createRequest = (url, args, store) => {
    return new Request(url, args, store);
  };
  const getHashByName = obj => {
    if (!obj.to && !obj.name) {
      return false;
    }

    const route = getRouteByName(obj.to || obj.name);
    const hasDynamicGroup = /\/:([\w-]+)\/?/;
    let hash = route; // if route contains dynamic group
    // we replace them with the provided params

    if (hasDynamicGroup.test(route)) {
      if (obj.params) {
        const keys = Object.keys(obj.params);
        hash = keys.reduce((acc, key) => {
          return acc.replace(":".concat(key), obj.params[key]);
        }, route);
      }

      if (obj.query) {
        return "".concat(hash).concat(objectToQueryString(obj.query));
      }
    }

    return hash;
  };

  const getRouteByName = name => {
    for (let [path, route] of routes$1.entries()) {
      if (route.name === name) {
        return path;
      }
    }

    return false;
  };

  const keepActivePageAlive = (route, request) => {
    if (isString(route)) {
      const routes = getRoutes();

      if (routes.has(route)) {
        route = routes.get(route);
      } else {
        return false;
      }
    }

    const register = request.register;
    const routeOptions = route.options;

    if (register.has('keepAlive')) {
      return register.get('keepAlive');
    } else if (routeOptions && routeOptions.keepAlive) {
      return routeOptions.keepAlive;
    }

    return false;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  var emit$1 = (function (page) {
    let events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    let params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!isArray(events)) {
      events = [events];
    }

    events.forEach(e => {
      const event = "_on".concat(ucfirst(e));

      if (isFunction(page[event])) {
        page[event](params);
      }
    });
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let activeWidget = null;
  const getReferences = () => {
    if (!widgetsHost) {
      return;
    }

    return widgetsHost.get().reduce((storage, widget) => {
      const key = widget.ref.toLowerCase();
      storage[key] = widget;
      return storage;
    }, {});
  };
  /**
   * update the visibility of the available widgets
   * for the current page / route
   * @param page
   */

  const updateWidgets = (widgets, page) => {
    // force lowercase lookup
    const configured = (widgets || []).map(ref => ref.toLowerCase());
    widgetsHost.forEach(widget => {
      widget.visible = configured.indexOf(widget.ref.toLowerCase()) !== -1;

      if (widget.visible) {
        emit$1(widget, ['activated'], page);
      }
    });

    if (app.state === 'Widgets' && activeWidget && !activeWidget.visible) {
      app._setState('');
    }
  };

  const getWidgetByName = name => {
    name = ucfirst(name);
    return widgetsHost.getByRef(name) || false;
  };
  /**
   * delegate app focus to a on-screen widget
   * @param name - {string}
   */


  const focusWidget = name => {
    const widget = getWidgetByName(name);

    if (widget) {
      setActiveWidget(widget); // if app is already in 'Widgets' state we can assume that
      // focus has been delegated from one widget to another so
      // we need to set the new widget reference and trigger a
      // new focus calculation of Lightning's focuspath

      if (app.state === 'Widgets') {
        app.reload(activeWidget);
      } else {
        app._setState('Widgets', [activeWidget]);
      }
    }
  };
  const restoreFocus = () => {
    activeWidget = null;

    app._setState('');
  };
  const getActiveWidget = () => {
    return activeWidget;
  };
  const setActiveWidget = instance => {
    activeWidget = instance;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const createComponent = (stage, type) => {
    return stage.c({
      type,
      visible: false,
      widgets: getReferences()
    });
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  /**
   * Simple flat array that holds the visited hashes + state Object
   * so the router can navigate back to them
   * @type {Array}
   */

  let history = [];
  const updateHistory = request => {
    const hash = getActiveHash();

    if (!hash) {
      return;
    } // navigate storage flag


    const register = request.register;
    const forceNavigateStore = register.get(symbols.store); // test preventStorage on route configuration

    const activeRoute = getRouteByHash(hash);
    const preventStorage = getOption(activeRoute.options, 'preventStorage'); // we give prio to navigate storage flag

    let store = isBoolean(forceNavigateStore) ? forceNavigateStore : !preventStorage;

    if (store) {
      const toStore = hash.replace(/^\//, '');
      const location = locationInHistory(toStore);
      const stateObject = getStateObject(getActivePage(), request);
      const routerConfig = getRouterConfig(); // store hash if it's not a part of history or flag for
      // storage of same hash is true

      if (location === -1 || routerConfig.get('storeSameHash')) {
        history.push({
          hash: toStore,
          state: stateObject
        });
      } else {
        // if we visit the same route we want to sync history
        const prev = history.splice(location, 1)[0];
        history.push({
          hash: prev.hash,
          state: stateObject
        });
      }
    }
  };

  const locationInHistory = hash => {
    for (let i = 0; i < history.length; i++) {
      if (history[i].hash === hash) {
        return i;
      }
    }

    return -1;
  };

  const getHistoryState = hash => {
    let state = null;

    if (history.length) {
      // if no hash is provided we get the last
      // pushed history record
      if (!hash) {
        const record = history[history.length - 1]; // could be null

        state = record.state;
      } else {
        if (locationInHistory(hash) !== -1) {
          const record = history[locationInHistory(hash)];
          state = record.state;
        }
      }
    }

    return state;
  };
  const replaceHistoryState = function () {
    let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let hash = arguments.length > 1 ? arguments[1] : undefined;

    if (!history.length) {
      return;
    }

    const location = hash ? locationInHistory(hash) : history.length - 1;

    if (location !== -1 && isObject(state)) {
      history[location].state = state;
    }
  };

  const getStateObject = (page, request) => {
    // if the new request shared instance with the
    // previous request we used the copied state object
    if (request.isSharedInstance) {
      if (request.copiedHistoryState) {
        return request.copiedHistoryState;
      }
    } else if (page && isFunction(page.historyState)) {
      return page.historyState();
    }

    return null;
  };

  const getHistory = () => {
    return history.slice(0);
  };
  const setHistory = function () {
    let arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    if (isArray(arr)) {
      history = arr;
    }
  };

  var isMergeableObject = function isMergeableObject(value) {
    return isNonNullObject(value) && !isSpecial(value);
  };

  function isNonNullObject(value) {
    return !!value && typeof value === 'object';
  }

  function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === '[object RegExp]' || stringValue === '[object Date]' || isReactElement(value);
  } // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25


  var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
  var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

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
    return target.concat(source).map(function (element) {
      return cloneUnlessOtherwiseSpecified(element, options);
    });
  }

  function getMergeFunction(key, options) {
    if (!options.customMerge) {
      return deepmerge;
    }

    var customMerge = options.customMerge(key);
    return typeof customMerge === 'function' ? customMerge : deepmerge;
  }

  function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
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
  } // Protects from prototype poisoning and unexpected merging up the prototype chain.


  function propertyIsUnsafe(target, key) {
    return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
    && !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
    && Object.propertyIsEnumerable.call(target, key)); // and also unsafe if they're nonenumerable.
  }

  function mergeObject(target, source, options) {
    var destination = {};

    if (options.isMergeableObject(target)) {
      getKeys(target).forEach(function (key) {
        destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
      });
    }

    getKeys(source).forEach(function (key) {
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
    options.isMergeableObject = options.isMergeableObject || isMergeableObject; // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    // implementations can use it. The caller may not replace it.

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
      throw new Error('first argument should be an array');
    }

    return array.reduce(function (prev, next) {
      return deepmerge(prev, next, options);
    }, {});
  };

  var deepmerge_1 = deepmerge;
  var cjs = deepmerge_1;

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let warned = false;

  const deprecated = function () {
    let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (force === true || warned === false) {
      console.warn(["The 'Locale'-plugin in the Lightning-SDK is deprecated and will be removed in future releases.", "Please consider using the new 'Language'-plugin instead.", 'https://rdkcentral.github.io/Lightning-SDK/#/plugins/language'].join('\n\n'));
    }

    warned = true;
  };

  class Locale {
    constructor() {
      this.__enabled = false;
    }
    /**
     * Loads translation object from external json file.
     *
     * @param {String} path Path to resource.
     * @return {Promise}
     */


    async load(path) {
      if (!this.__enabled) {
        return;
      }

      await fetch(path).then(resp => resp.json()).then(resp => {
        this.loadFromObject(resp);
      });
    }
    /**
     * Sets language used by module.
     *
     * @param {String} lang
     */


    setLanguage(lang) {
      deprecated();
      this.__enabled = true;
      this.language = lang;
    }
    /**
     * Returns reference to translation object for current language.
     *
     * @return {Object}
     */


    get tr() {
      deprecated(true);
      return this.__trObj[this.language];
    }
    /**
     * Loads translation object from existing object (binds existing object).
     *
     * @param {Object} trObj
     */


    loadFromObject(trObj) {
      deprecated();
      const fallbackLanguage = 'en';

      if (Object.keys(trObj).indexOf(this.language) === -1) {
        Log.warn('No translations found for: ' + this.language);

        if (Object.keys(trObj).indexOf(fallbackLanguage) > -1) {
          Log.warn('Using fallback language: ' + fallbackLanguage);
          this.language = fallbackLanguage;
        } else {
          const error = 'No translations found for fallback language: ' + fallbackLanguage;
          Log.error(error);
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

  }
  /**
   * Extended string class used for localization.
   */


  class LocalizedString extends String {
    /**
     * Returns formatted LocalizedString.
     * Replaces each placeholder value (e.g. {0}, {1}) with corresponding argument.
     *
     * E.g.:
     * > new LocalizedString('{0} and {1} and {0}').format('A', 'B');
     * A and B and A
     *
     * @param  {...any} args List of arguments for placeholders.
     */
    format() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      const sub = args.reduce((string, arg, index) => string.split("{".concat(index, "}")).join(arg), this);
      return new LocalizedString(sub);
    }

  }

  var Locale$1 = new Locale();

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class VersionLabel extends lng.Component {
    static _template() {
      return {
        rect: true,
        color: 0xbb0078ac,
        h: 40,
        w: 100,
        x: w => w - 50,
        y: h => h - 50,
        mount: 1,
        Text: {
          w: w => w,
          h: h => h,
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
      this.tag('Text').text = "APP - v".concat(this.version, "\nSDK - v").concat(this.sdkVersion);
      this.tag('Text').loadTexture();
      this.w = this.tag('Text').renderWidth + 40;
      this.h = this.tag('Text').renderHeight + 5;
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class FpsIndicator extends lng.Component {
    static _template() {
      return {
        rect: true,
        color: 0xffffffff,
        texture: lng.Tools.getRoundRect(80, 80, 40),
        h: 80,
        w: 80,
        x: 100,
        y: 100,
        mount: 1,
        Background: {
          x: 3,
          y: 3,
          texture: lng.Tools.getRoundRect(72, 72, 36),
          color: 0xff008000
        },
        Counter: {
          w: w => w,
          h: h => h,
          y: 10,
          text: {
            fontSize: 32,
            textAlign: 'center'
          }
        },
        Text: {
          w: w => w,
          h: h => h,
          y: 48,
          text: {
            fontSize: 15,
            textAlign: 'center',
            text: 'FPS'
          }
        }
      };
    }

    _setup() {
      this.config = { ...{
          log: false,
          interval: 500,
          threshold: 1
        },
        ...Settings.get('platform', 'showFps')
      };
      this.fps = 0;
      this.lastFps = this.fps - this.config.threshold;

      const fpsCalculator = () => {
        this.fps = ~~(1 / this.stage.dt);
      };

      this.stage.on('frameStart', fpsCalculator);
      this.stage.off('framestart', fpsCalculator);
      this.interval = setInterval(this.showFps.bind(this), this.config.interval);
    }

    _firstActive() {
      this.showFps();
    }

    _detach() {
      clearInterval(this.interval);
    }

    showFps() {
      if (Math.abs(this.lastFps - this.fps) <= this.config.threshold) return;
      this.lastFps = this.fps; // green

      let bgColor = 0xff008000; // orange

      if (this.fps <= 40 && this.fps > 20) bgColor = 0xffffa500; // red
      else if (this.fps <= 20) bgColor = 0xffff0000;
      this.tag('Background').setSmooth('color', bgColor);
      this.tag('Counter').text = "".concat(this.fps);
      this.config.log && Log.info('FPS', this.fps);
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let meta = {};
  let translations = {};
  let language$1 = null;
  const initLanguage = function (file) {
    let language = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return new Promise((resolve, reject) => {
      fetch(file).then(response => response.json()).then(json => {
        setTranslations(json); // set language (directly or in a promise)

        typeof language === 'object' && 'then' in language && typeof language.then === 'function' ? language.then(lang => setLanguage(lang).then(resolve).catch(reject)).catch(e => {
          Log.error(e);
          reject(e);
        }) : setLanguage(language).then(resolve).catch(reject);
      }).catch(() => {
        const error = 'Language file ' + file + ' not found';
        Log.error(error);
        reject(error);
      });
    });
  };

  const setTranslations = obj => {
    if ('meta' in obj) {
      meta = { ...obj.meta
      };
      delete obj.meta;
    }

    translations = obj;
  };

  const setLanguage = lng => {
    language$1 = null;
    return new Promise((resolve, reject) => {
      if (lng in translations) {
        language$1 = lng;
      } else {
        if ('map' in meta && lng in meta.map && meta.map[lng] in translations) {
          language$1 = meta.map[lng];
        } else if ('default' in meta && meta.default in translations) {
          const error = 'Translations for Language ' + language$1 + ' not found. Using default language ' + meta.default;
          Log.warn(error);
          language$1 = meta.default;
        } else {
          const error = 'Translations for Language ' + language$1 + ' not found.';
          Log.error(error);
          reject(error);
        }
      }

      if (language$1) {
        Log.info('Setting language to', language$1);
        const translationsObj = translations[language$1];

        if (typeof translationsObj === 'object') {
          resolve();
        } else if (typeof translationsObj === 'string') {
          const url = Utils.asset(translationsObj);
          fetch(url).then(response => response.json()).then(json => {
            // save the translations for this language (to prevent loading twice)
            translations[language$1] = json;
            resolve();
          }).catch(e => {
            const error = 'Error while fetching ' + url;
            Log.error(error, e);
            reject(error);
          });
        }
      }
    });
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const registry = {
    eventListeners: [],
    timeouts: [],
    intervals: [],
    targets: []
  };
  var Registry = {
    // Timeouts
    setTimeout(cb, timeout) {
      for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
      }

      const timeoutId = setTimeout(() => {
        registry.timeouts = registry.timeouts.filter(id => id !== timeoutId);
        cb.apply(null, params);
      }, timeout, params);
      Log.info('Set Timeout', 'ID: ' + timeoutId);
      registry.timeouts.push(timeoutId);
      return timeoutId;
    },

    clearTimeout(timeoutId) {
      if (registry.timeouts.indexOf(timeoutId) > -1) {
        registry.timeouts = registry.timeouts.filter(id => id !== timeoutId);
        Log.info('Clear Timeout', 'ID: ' + timeoutId);
        clearTimeout(timeoutId);
      } else {
        Log.error('Clear Timeout', 'ID ' + timeoutId + ' not found');
      }
    },

    clearTimeouts() {
      registry.timeouts.forEach(timeoutId => {
        this.clearTimeout(timeoutId);
      });
    },

    // Intervals
    setInterval(cb, interval) {
      for (var _len2 = arguments.length, params = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        params[_key2 - 2] = arguments[_key2];
      }

      const intervalId = setInterval(() => {
        registry.intervals.filter(id => id !== intervalId);
        cb.apply(null, params);
      }, interval, params);
      Log.info('Set Interval', 'ID: ' + intervalId);
      registry.intervals.push(intervalId);
      return intervalId;
    },

    clearInterval(intervalId) {
      if (registry.intervals.indexOf(intervalId) > -1) {
        registry.intervals = registry.intervals.filter(id => id !== intervalId);
        Log.info('Clear Interval', 'ID: ' + intervalId);
        clearInterval(intervalId);
      } else {
        Log.error('Clear Interval', 'ID ' + intervalId + ' not found');
      }
    },

    clearIntervals() {
      registry.intervals.forEach(intervalId => {
        this.clearInterval(intervalId);
      });
    },

    // Event listeners
    addEventListener(target, event, handler) {
      target.addEventListener(event, handler);
      const targetIndex = registry.targets.indexOf(target) > -1 ? registry.targets.indexOf(target) : registry.targets.push(target) - 1;
      registry.eventListeners[targetIndex] = registry.eventListeners[targetIndex] || {};
      registry.eventListeners[targetIndex][event] = registry.eventListeners[targetIndex][event] || [];
      registry.eventListeners[targetIndex][event].push(handler);
      Log.info('Add eventListener', 'Target:', target, 'Event: ' + event, 'Handler:', handler.toString());
    },

    removeEventListener(target, event, handler) {
      const targetIndex = registry.targets.indexOf(target);

      if (targetIndex > -1 && registry.eventListeners[targetIndex] && registry.eventListeners[targetIndex][event] && registry.eventListeners[targetIndex][event].indexOf(handler) > -1) {
        registry.eventListeners[targetIndex][event] = registry.eventListeners[targetIndex][event].filter(fn => fn !== handler);
        Log.info('Remove eventListener', 'Target:', target, 'Event: ' + event, 'Handler:', handler.toString());
        target.removeEventListener(event, handler);
      } else {
        Log.error('Remove eventListener', 'Not found', 'Target', target, 'Event: ' + event, 'Handler', handler.toString());
      }
    },

    // if `event` is omitted, removes all registered event listeners for target
    // if `target` is also omitted, removes all registered event listeners
    removeEventListeners(target, event) {
      if (target && event) {
        const targetIndex = registry.targets.indexOf(target);

        if (targetIndex > -1) {
          registry.eventListeners[targetIndex][event].forEach(handler => {
            this.removeEventListener(target, event, handler);
          });
        }
      } else if (target) {
        const targetIndex = registry.targets.indexOf(target);

        if (targetIndex > -1) {
          Object.keys(registry.eventListeners[targetIndex]).forEach(_event => {
            this.removeEventListeners(target, _event);
          });
        }
      } else {
        Object.keys(registry.eventListeners).forEach(targetIndex => {
          this.removeEventListeners(registry.targets[targetIndex]);
        });
      }
    },

    // Clear everything (to be called upon app close for proper cleanup)
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

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const isObject$1 = v => {
    return typeof v === 'object' && v !== null;
  };
  const isString$1 = v => {
    return typeof v === 'string';
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let colors = {
    white: '#ffffff',
    black: '#000000',
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#feff00',
    cyan: '#00feff',
    magenta: '#ff00ff'
  };
  const normalizedColors = {//store for normalized colors
  };

  const addColors = (colorsToAdd, value) => {
    if (isObject$1(colorsToAdd)) {
      // clean up normalizedColors if they exist in the to be added colors
      Object.keys(colorsToAdd).forEach(color => cleanUpNormalizedColors(color));
      colors = Object.assign({}, colors, colorsToAdd);
    } else if (isString$1(colorsToAdd) && value) {
      cleanUpNormalizedColors(colorsToAdd);
      colors[colorsToAdd] = value;
    }
  };

  const cleanUpNormalizedColors = color => {
    for (let c in normalizedColors) {
      if (c.indexOf(color) > -1) {
        delete normalizedColors[c];
      }
    }
  };

  const initColors = file => {
    return new Promise((resolve, reject) => {
      if (typeof file === 'object') {
        addColors(file);
        return resolve();
      }

      fetch(file).then(response => response.json()).then(json => {
        addColors(json);
        return resolve();
      }).catch(() => {
        const error = 'Colors file ' + file + ' not found';
        Log.error(error);
        return reject(error);
      });
    });
  };

  var name = "@lightningjs/sdk";
  var version = "4.8.3";
  var license = "Apache-2.0";
  var scripts = {
  	postinstall: "node ./scripts/postinstall.js",
  	lint: "eslint '**/*.js'",
  	release: "npm publish --access public"
  };
  var husky = {
  	hooks: {
  		"pre-commit": "lint-staged"
  	}
  };
  var dependencies = {
  	"@babel/polyfill": "^7.11.5",
  	"@lightningjs/core": "*",
  	"@michieljs/execute-as-promise": "^1.0.0",
  	deepmerge: "^4.2.2",
  	localCookie: "github:WebPlatformForEmbedded/localCookie",
  	shelljs: "^0.8.5",
  	"url-polyfill": "^1.1.10",
  	"whatwg-fetch": "^3.0.0"
  };
  var devDependencies = {
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
  };
  var repository = {
  	type: "git",
  	url: "git@github.com:rdkcentral/Lightning-SDK.git"
  };
  var bugs = {
  	url: "https://github.com/rdkcentral/Lightning-SDK/issues"
  };
  var packageInfo = {
  	name: name,
  	version: version,
  	license: license,
  	scripts: scripts,
  	"lint-staged": {
  	"*.js": [
  		"eslint --fix"
  	],
  	"src/startApp.js": [
  		"rollup -c ./rollup.config.js"
  	]
  },
  	husky: husky,
  	dependencies: dependencies,
  	devDependencies: devDependencies,
  	repository: repository,
  	bugs: bugs
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let AppInstance;
  const defaultOptions = {
    stage: {
      w: 1920,
      h: 1080,
      clearColor: 0x00000000,
      canvas2d: false
    },
    debug: false,
    defaultFontFace: 'RobotoRegular',
    keys: {
      8: 'Back',
      13: 'Enter',
      27: 'Menu',
      37: 'Left',
      38: 'Up',
      39: 'Right',
      40: 'Down',
      174: 'ChannelDown',
      175: 'ChannelUp',
      178: 'Stop',
      250: 'PlayPause',
      191: 'Search',
      // Use "/" for keyboard
      409: 'Search'
    }
  };
  const customFontFaces = [];

  const fontLoader = (fonts, store) => new Promise((resolve, reject) => {
    fonts.map(_ref => {
      let {
        family,
        url,
        urls,
        descriptors
      } = _ref;
      return () => {
        const src = urls ? urls.map(url => {
          return 'url(' + url + ')';
        }) : 'url(' + url + ')';
        const fontFace = new FontFace(family, src, descriptors || {});
        store.push(fontFace);
        Log.info('Loading font', family);
        document.fonts.add(fontFace);
        return fontFace.load();
      };
    }).reduce((promise, method) => {
      return promise.then(() => method());
    }, Promise.resolve(null)).then(resolve).catch(reject);
  });

  function Application (App, appData, platformSettings) {
    const {
      width,
      height
    } = platformSettings;

    if (width && height) {
      defaultOptions.stage['w'] = width;
      defaultOptions.stage['h'] = height;
      defaultOptions.stage['precision'] = width / 1920;
    } // support for 720p browser


    if (!width && !height && window.innerHeight === 720) {
      defaultOptions.stage['w'] = 1280;
      defaultOptions.stage['h'] = 720;
      defaultOptions.stage['precision'] = 1280 / 1920;
    }

    return class Application extends lng.Application {
      constructor(options) {
        const config = cjs(defaultOptions, options); // Deepmerge breaks HTMLCanvasElement, so restore the passed in canvas.

        if (options.stage.canvas) {
          config.stage.canvas = options.stage.canvas;
        }

        super(config);
        this.config = config;
      }

      static _template() {
        return {
          w: 1920,
          h: 1080
        };
      }

      _setup() {
        Promise.all([this.loadFonts(App.config && App.config.fonts || App.getFonts && App.getFonts() || []), // to be deprecated
        Locale$1.load(App.config && App.config.locale || App.getLocale && App.getLocale()), App.language && this.loadLanguage(App.language()), App.colors && this.loadColors(App.colors())]).then(() => {
          Metrics$1.app.loaded();
          AppInstance = this.stage.c({
            ref: 'App',
            type: App,
            zIndex: 1,
            forceZIndexContext: !!platformSettings.showVersion || !!platformSettings.showFps
          });
          this.childList.a(AppInstance);

          this._refocus();

          Log.info('App version', this.config.version);
          Log.info('SDK version', packageInfo.version);

          if (platformSettings.showVersion) {
            this.childList.a({
              ref: 'VersionLabel',
              type: VersionLabel,
              version: this.config.version,
              sdkVersion: packageInfo.version,
              zIndex: 1
            });
          }

          if (platformSettings.showFps) {
            this.childList.a({
              ref: 'FpsCounter',
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
        Log.info('Signaling App Close');

        if (platformSettings.onClose && typeof platformSettings.onClose === 'function') {
          platformSettings.onClose(...arguments);
        } else {
          this.close();
        }
      }

      close() {
        Log.info('Closing App');
        Settings.clearSubscribers();
        Registry.clear();
        this.childList.remove(this.tag('App'));
        this.cleanupFonts(); // force texture garbage collect

        this.stage.gc();
        this.destroy();
      }

      loadFonts(fonts) {
        return platformSettings.fontLoader && typeof platformSettings.fontLoader === 'function' ? platformSettings.fontLoader(fonts, customFontFaces) : fontLoader(fonts, customFontFaces);
      }

      cleanupFonts() {
        if ('delete' in document.fonts) {
          customFontFaces.forEach(fontFace => {
            Log.info('Removing font', fontFace.family);
            document.fonts.delete(fontFace);
          });
        } else {
          Log.info('No support for removing manually-added fonts');
        }
      }

      loadLanguage(config) {
        let file = Utils.asset('translations.json');
        let language = config;

        if (typeof language === 'object') {
          language = config.language || null;
          file = config.file || file;
        }

        return initLanguage(file, language);
      }

      loadColors(config) {
        let file = Utils.asset('colors.json');

        if (config && (typeof config === 'string' || typeof config === 'object')) {
          file = config;
        }

        return initColors(file);
      }

      set focus(v) {
        this._focussed = v;

        this._refocus();
      }

      _getFocused() {
        return this._focussed || this.tag('App');
      }

    };
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  /**
   * @type {Lightning.Application}
   */

  let application;
  /**
   * Actual instance of the app
   * @type {Lightning.Component}
   */

  let app;
  /**
   * Component that hosts all routed pages
   * @type {Lightning.Component}
   */

  let pagesHost;
  /**
   * @type {Lightning.Stage}
   */

  let stage;
  /**
   * Platform driven Router configuration
   * @type {Map<string>}
   */

  let routerConfig;
  /**
   * Component that hosts all attached widgets
   * @type {Lightning.Component}
   */

  let widgetsHost;
  /**
   * Hash we point the browser to when we boot the app
   * and there is no deep-link provided
   * @type {string|Function}
   */

  let rootHash;
  /**
   * Boot request will fire before app start
   * can be used to execute some global logic
   * and can be configured
   */

  let bootRequest;
  /**
   * Flag if we need to update the browser location hash.
   * Router can work without.
   * @type {boolean}
   */

  let updateHash = true;
  /**
   * Will be called before a route starts, can be overridden
   * via routes config
   * @param from - route we came from
   * @param to - route we navigate to
   * @returns {Promise<*>}
   */
  // eslint-disable-next-line

  let beforeEachRoute = async (from, to) => {
    return true;
  };
  /**
   *  * Will be called after a navigate successfully resolved,
   * can be overridden via routes config
   */

  let afterEachRoute = () => {};
  /**
   * All configured routes
   * @type {Map<string, object>}
   */

  let routes$1 = new Map();
  /**
   * Store all page components per route
   * @type {Map<string, object>}
   */

  let components = new Map();
  /**
   * Flag if router has been initialised
   * @type {boolean}
   */

  let initialised = false;
  /**
   * Current page being rendered on screen
   * @type {null}
   */

  let activePage = null;
  let activeHash;
  let activeRoute;
  /**
   *  During the process of a navigation request a new
   *  request can start, to prevent unwanted behaviour
   *  the navigate()-method stores the last accepted hash
   *  so we can invalidate any prior requests
   */

  let lastAcceptedHash;
  /**
   * With on()-data providing behaviour the Router forced the App
   * in a Loading state. When the data-provider resolves we want to
   * change the state back to where we came from
   */

  let previousState;

  const mixin = app => {
    // by default the Router Baseclass provides the component
    // reference in which we store our pages
    if (app.pages) {
      pagesHost = app.pages.childList;
    } // if the app is using widgets we grab refs
    // and hide all the widgets


    if (app.widgets && app.widgets.children) {
      widgetsHost = app.widgets.childList; // hide all widgets on boot

      widgetsHost.forEach(w => w.visible = false);
    }

    app._handleBack = e => {
      step(-1);
      e.preventDefault();
    };
  };

  const bootRouter = (config, instance) => {
    let {
      appInstance,
      routes
    } = config; // if instance is provided and it's and Lightning Component instance

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

    if (isArray(routes)) {
      setup(config);
    } else if (isFunction(routes)) {
      console.warn('[Router]: Calling Router.route() directly is deprecated.');
      console.warn('Use object config: https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    }
  };

  const setup = config => {
    if (!initialised) {
      init(config);
    }

    config.routes.forEach(r => {
      const path = cleanHash(r.path);

      if (!routeExists(path)) {
        const route = createRoute(r);
        routes$1.set(path, route); // if route has a configured component property
        // we store it in a different map to simplify
        // the creating and destroying per route

        if (route.component) {
          let type = route.component;

          if (isComponentConstructor(type)) {
            if (!routerConfig.get('lazyCreate')) {
              type = createComponent(stage, type);
              pagesHost.a(type);
            }
          }

          components.set(path, type);
        }
      } else {
        console.error("".concat(path, " already exists in routes configuration"));
      }
    });
  };

  const init = config => {
    rootHash = config.root;

    if (isFunction(config.boot)) {
      bootRequest = config.boot;
    }

    if (isBoolean(config.updateHash)) {
      updateHash = config.updateHash;
    }

    if (isFunction(config.beforeEachRoute)) {
      beforeEachRoute = config.beforeEachRoute;
    }

    if (isFunction(config.afterEachRoute)) {
      afterEachRoute = config.afterEachRoute;
    }

    if (config.bootComponent) {
      console.warn('[Router]: Boot Component is now available as a special router: https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration?id=special-routes');
      console.warn('[Router]: setting { bootComponent } property will be deprecated in a future release');

      if (isPage(config.bootComponent)) {
        config.routes.push({
          path: '$',
          component: config.bootComponent,
          // we try to assign the bootRequest as after data-provider
          // so it will behave as any other component
          after: bootRequest || null,
          options: {
            preventStorage: true
          }
        });
      } else {
        console.error("[Router]: ".concat(config.bootComponent, " is not a valid boot component"));
      }
    }

    initialised = true;
  };

  const storeComponent = (route, type) => {
    if (components.has(route)) {
      components.set(route, type);
    }
  };
  const getComponent = route => {
    if (components.has(route)) {
      return components.get(route);
    }

    return null;
  };
  /**
   * Test if router needs to update browser location hash
   * @returns {boolean}
   */

  const mustUpdateLocationHash = () => {
    if (!routerConfig || !routerConfig.size) {
      return false;
    } // we need support to either turn change hash off
    // per platform or per app


    const updateConfig = routerConfig.get('updateHash');
    return !(isBoolean(updateConfig) && !updateConfig || isBoolean(updateHash) && !updateHash);
  };
  /**
   * Will be called when a new navigate() request has completed
   * and has not been expired due to it's async nature
   * @param request
   */

  const onRequestResolved = request => {
    const hash = request.hash;
    const route = request.route;
    const register = request.register;
    const page = request.page; // clean up history if modifier is set

    if (getOption(route.options, 'clearHistory')) {
      setHistory([]);
    } else if (hash && !isWildcard.test(route.path)) {
      updateHistory(request);
    } // we only update the stackLocation if a route
    // is not expired before it resolves


    storeComponent(route.path, page);

    if (request.isSharedInstance || !request.isCreated) {
      emit$1(page, 'changed');
    } else if (request.isCreated) {
      emit$1(page, 'mounted');
    } // only update widgets if we have a host


    if (widgetsHost) {
      updateWidgets(route.widgets, page);
    } // we want to clean up if there is an
    // active page that is not being shared
    // between current and previous route


    if (getActivePage() && !request.isSharedInstance) {
      cleanUp(activePage, request);
    } // provide history object to active page


    if (register.get(symbols.historyState) && isFunction(page.historyState)) {
      page.historyState(register.get(symbols.historyState));
    }

    setActivePage(page);
    activeHash = request.hash;
    activeRoute = route.path; // cleanup all cancelled requests

    for (let request of navigateQueue.values()) {
      if (request.isCancelled && request.hash) {
        navigateQueue.delete(request.hash);
      }
    }

    afterEachRoute(request);
    Log.info('[route]:', route.path);
    Log.info('[hash]:', hash);
  };

  const cleanUp = (page, request) => {
    const route = activeRoute;
    const register = request.register;
    const lazyDestroy = routerConfig.get('lazyDestroy');
    const destroyOnBack = routerConfig.get('destroyOnHistoryBack');
    const keepAlive = register.get('keepAlive');
    const isFromHistory = register.get(symbols.backtrack);
    let doCleanup = false; // if this request is executed due to a step back in history
    // and we have configured to destroy active page when we go back
    // in history or lazyDestory is enabled

    if (isFromHistory && (destroyOnBack || lazyDestroy)) {
      doCleanup = true;
    } // clean up if lazyDestroy is enabled and the keepAlive flag
    // in navigation register is false


    if (lazyDestroy && !keepAlive) {
      doCleanup = true;
    } // if the current and new request share the same route blueprint


    if (activeRoute === request.route.path) {
      doCleanup = true;
    }

    if (doCleanup) {
      // grab original class constructor if
      // statemachine routed else store constructor
      storeComponent(route, page._routedType || page.constructor); // actual remove of page from memory

      pagesHost.remove(page); // force texture gc() if configured
      // so we can cleanup textures in the same tick

      if (routerConfig.get('gcOnUnload')) {
        stage.gc();
      }
    } else {
      // If we're not removing the page we need to
      // reset it's properties
      page.patch({
        x: 0,
        y: 0,
        scale: 1,
        alpha: 1,
        visible: false
      });
    }
  };

  const getActiveHash = () => {
    return activeHash;
  };
  const setActivePage = page => {
    activePage = page;
  };
  const getActivePage = () => {
    return activePage;
  };
  const getActiveRoute = () => {
    return activeRoute;
  };
  const getLastHash = () => {
    return lastAcceptedHash;
  };
  const setLastHash = hash => {
    lastAcceptedHash = hash;
  };
  const getPreviousState = () => {
    return previousState;
  };
  const routeExists = key => {
    return routes$1.has(key);
  };
  const getRootHash = () => {
    return rootHash;
  };
  const getBootRequest = () => {
    return bootRequest;
  };
  const getRouterConfig = () => {
    return routerConfig;
  };
  const getRoutes = () => {
    return routes$1;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const isFunction = v => {
    return typeof v === 'function';
  };
  const isObject = v => {
    return typeof v === 'object' && v !== null;
  };
  const isBoolean = v => {
    return typeof v === 'boolean';
  };
  const isPage = v => {
    if (v instanceof lng.Element || isComponentConstructor(v)) {
      return true;
    }

    return false;
  };
  const isComponentConstructor = type => {
    return type.prototype && 'isComponent' in type.prototype;
  };
  const isArray = v => {
    return Array.isArray(v);
  };
  const ucfirst = v => {
    return "".concat(v.charAt(0).toUpperCase()).concat(v.slice(1));
  };
  const isString = v => {
    return typeof v === 'string';
  };
  const isPromise = method => {
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
  const cleanHash = function () {
    let hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return hash.replace(/^#/, '').replace(/\/+$/, '');
  };
  const getConfigMap = () => {
    const routerSettings = Settings.get('platform', 'router');
    const isObj = isObject(routerSettings);
    return ['backtrack', 'gcOnUnload', 'destroyOnHistoryBack', 'lazyCreate', 'lazyDestroy', 'reuseInstance', 'autoRestoreRemote', 'numberNavigation', 'updateHash', 'storeSameHash'].reduce((config, key) => {
      config.set(key, isObj ? routerSettings[key] : Settings.get('platform', key));
      return config;
    }, new Map());
  };
  const getQueryStringParams = function () {
    let hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getActiveHash();
    const resumeHash = getResumeHash();

    if ((hash === '$' || !hash) && resumeHash) {
      if (isString(resumeHash)) {
        hash = resumeHash;
      }
    }

    let parse = '';
    const getQuery = /([?&].*)/;
    const matches = getQuery.exec(hash);
    const params = {};

    if (document.location && document.location.search) {
      parse = document.location.search;
    }

    if (matches && matches.length) {
      let hashParams = matches[1];

      if (parse) {
        // if location.search is not empty we
        // remove the leading ? to create a
        // valid string
        hashParams = hashParams.replace(/^\?/, ''); // we parse hash params last so they we can always
        // override search params with hash params

        parse = "".concat(parse, "&").concat(hashParams);
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
  const objectToQueryString = obj => {
    if (!isObject(obj)) {
      return '';
    }

    return '?' + Object.keys(obj).map(key => {
      return "".concat(key, "=").concat(obj[key]);
    }).join('&');
  };
  const symbols = {
    route: Symbol('route'),
    hash: Symbol('hash'),
    store: Symbol('store'),
    fromHistory: Symbol('fromHistory'),
    expires: Symbol('expires'),
    resume: Symbol('resume'),
    backtrack: Symbol('backtrack'),
    historyState: Symbol('historyState'),
    queryParams: Symbol('queryParams')
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const dataHooks = {
    on: request => {
      app.state || '';

      app._setState('Loading');

      return execProvider(request);
    },
    before: request => {
      return execProvider(request);
    },
    after: request => {
      try {
        execProvider(request, true);
      } catch (e) {// for now we fail silently
      }

      return Promise.resolve();
    }
  };

  const execProvider = (request, emitProvided) => {
    const route = request.route;
    const provider = route.provider;
    const expires = route.cache ? route.cache * 1000 : 0;
    const params = addPersistData(request);
    return provider.request(request.page, { ...params
    }).then(() => {
      request.page[symbols.expires] = Date.now() + expires;

      if (emitProvided) {
        emit$1(request.page, 'dataProvided');
      }
    }).catch(e => {
      request.page[symbols.expires] = Date.now();
      throw e;
    });
  };

  const addPersistData = _ref => {
    let {
      page,
      route,
      hash,
      register = new Map()
    } = _ref;
    const urlValues = getValuesFromHash(hash, route.path);
    const queryParams = getQueryStringParams(hash);
    const pageData = new Map([...urlValues, ...register]);
    const params = {}; // make dynamic url data available to the page
    // as instance properties

    for (let [name, value] of pageData) {
      params[name] = value;
    }

    if (queryParams) {
      params[symbols.queryParams] = queryParams;
    } // check navigation register for persistent data


    if (register.size) {
      const obj = {};

      for (let [k, v] of register) {
        obj[k] = v;
      }

      page.persist = obj;
    } // make url data and persist data available
    // via params property


    page.params = params;
    emit$1(page, ['urlParams'], params);
    return params;
  };
  /**
   * Test if page passed cache-time
   * @param page
   * @returns {boolean}
   */

  const isPageExpired = page => {
    if (!page[symbols.expires]) {
      return false;
    }

    const expires = page[symbols.expires];
    const now = Date.now();
    return now >= expires;
  };
  const hasProvider = path => {
    if (routeExists(path)) {
      const record = routes$1.get(path);
      return !!record.provider;
    }

    return false;
  };
  const getProvider = route => {
    // @todo: fix, route already is passed in
    if (routeExists(route.path)) {
      const {
        provider
      } = routes$1.get(route.path);
      return {
        type: provider.type,
        provider: provider.request
      };
    }
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const fade = (i, o) => {
    return new Promise(resolve => {
      i.patch({
        alpha: 0,
        visible: true,
        smooth: {
          alpha: [1, {
            duration: 0.5,
            delay: 0.1
          }]
        }
      }); // resolve on y finish

      i.transition('alpha').on('finish', () => {
        if (o) {
          o.visible = false;
        }

        resolve();
      });
    });
  };

  const crossFade = (i, o) => {
    return new Promise(resolve => {
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
      } // resolve on y finish


      i.transition('alpha').on('finish', () => {
        resolve();
      });
    });
  };

  const moveOnAxes = (axis, direction, i, o) => {
    const bounds = axis === 'x' ? 1920 : 1080;
    return new Promise(resolve => {
      i.patch({
        ["".concat(axis)]: direction ? bounds * -1 : bounds,
        visible: true,
        smooth: {
          ["".concat(axis)]: [0, {
            duration: 0.4,
            delay: 0.2
          }]
        }
      }); // out is optional

      if (o) {
        o.patch({
          ["".concat(axis)]: 0,
          smooth: {
            ["".concat(axis)]: [direction ? bounds : bounds * -1, {
              duration: 0.4,
              delay: 0.2
            }]
          }
        });
      } // resolve on y finish


      i.transition(axis).on('finish', () => {
        resolve();
      });
    });
  };

  const up = (i, o) => {
    return moveOnAxes('y', 0, i, o);
  };

  const down = (i, o) => {
    return moveOnAxes('y', 1, i, o);
  };

  const left = (i, o) => {
    return moveOnAxes('x', 0, i, o);
  };

  const right = (i, o) => {
    return moveOnAxes('x', 1, i, o);
  };

  var Transitions = {
    fade,
    crossFade,
    up,
    down,
    left,
    right
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  /**
   * execute transition between new / old page and
   * toggle the defined widgets
   * @todo: platform override default transition
   * @param pageIn
   * @param pageOut
   */

  const executeTransition = function (pageIn) {
    let pageOut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const transition = pageIn.pageTransition || pageIn.easing;
    const hasCustomTransitions = !!(pageIn.smoothIn || pageIn.smoothInOut || transition);
    const transitionsDisabled = getRouterConfig().get('disableTransitions');

    if (pageIn.easing) {
      console.warn('easing() method is deprecated and will be removed. Use pageTransition()');
    } // default behaviour is a visibility toggle


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
        type = 'crossFade';
      }

      if (isPromise(type)) {
        return type;
      }

      if (isString(type)) {
        const fn = Transitions[type];

        if (fn) {
          return fn(pageIn, pageOut);
        }
      } // keep backwards compatible for now


      if (pageIn.smoothIn) {
        // provide a smooth function that resolves itself
        // on transition finish
        const smooth = function (p, v) {
          let args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          return new Promise(resolve => {
            pageIn.visible = true;
            pageIn.setSmooth(p, v, args);
            pageIn.transition(p).on('finish', () => {
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

    return Transitions.crossFade(pageIn, pageOut);
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  /**
   * The actual loading of the component
   * */

  const load = async request => {
    let expired = false;

    try {
      request = await loader$1(request);

      if (request && !request.isCancelled) {
        // in case of on() providing we need to reset
        // app state;
        if (app.state === 'Loading') {
          if (getPreviousState() === 'Widgets') ; else {
            app._setState('');
          }
        } // Do page transition if instance
        // is not shared between the routes


        if (!request.isSharedInstance && !request.isCancelled) {
          await executeTransition(request.page, getActivePage());
        }
      } else {
        expired = true;
      } // on expired we only cleanup


      if (expired || request.isCancelled) {
        Log.debug('[router]:', "Rejected ".concat(request.hash, " because route to ").concat(getLastHash(), " started"));

        if (request.isCreated && !request.isSharedInstance) {
          // remove from render-tree
          pagesHost.remove(request.page);
        }
      } else {
        onRequestResolved(request); // resolve promise

        return request.page;
      }
    } catch (request) {
      if (!request.route) {
        console.error(request);
      } else if (!expired) {
        // @todo: revisit
        const {
          route
        } = request; // clean up history if modifier is set

        if (getOption(route.options, 'clearHistory')) {
          setHistory([]);
        } else if (!isWildcard.test(route.path)) {
          updateHistory(request);
        }

        if (request.isCreated && !request.isSharedInstance) {
          // remove from render-tree
          pagesHost.remove(request.page);
        }

        handleError(request);
      }
    }
  };

  const loader$1 = async request => {
    const route = request.route;
    const hash = request.hash;
    const register = request.register; // todo: grab from Route instance

    let type = getComponent(route.path);
    let isConstruct = isComponentConstructor(type);
    let provide = false; // if it's an instance bt we're not coming back from
    // history we test if we can re-use this instance

    if (!isConstruct && !register.get(symbols.backtrack)) {
      if (!mustReuse(route)) {
        type = type.constructor;
        isConstruct = true;
      }
    } // If page is Lightning Component instance


    if (!isConstruct) {
      request.page = type; // if we have have a data route for current page

      if (hasProvider(route.path)) {
        if (isPageExpired(type) || type[symbols.hash] !== hash) {
          provide = true;
        }
      }

      let currentRoute = getActivePage() && getActivePage()[symbols.route]; // if the new route is equal to the current route it means that both
      // route share the Component instance and stack location / since this case
      // is conflicting with the way before() and after() loading works we flag it,
      // and check platform settings in we want to re-use instance

      if (route.path === currentRoute) {
        request.isSharedInstance = true; // since we're re-using the instance we must attach
        // historyState to the request to prevent it from
        // being overridden.

        if (isFunction(request.page.historyState)) {
          request.copiedHistoryState = request.page.historyState();
        }
      }
    } else {
      request.page = createComponent(stage, type);
      pagesHost.a(request.page); // test if need to request data provider

      if (hasProvider(route.path)) {
        provide = true;
      }

      request.isCreated = true;
    } // we store hash and route as properties on the page instance
    // that way we can easily calculate new behaviour on page reload


    request.page[symbols.hash] = hash;
    request.page[symbols.route] = route.path;

    try {
      if (provide) {
        // extract attached data-provider for route
        // we're processing
        const {
          type: loadType,
          provider
        } = getProvider(route); // update running request

        request.provider = provider;
        request.providerType = loadType;
        await dataHooks[loadType](request); // we early exit if the current request is expired

        if (hash !== getLastHash()) {
          return false;
        } else {
          if (request.providerType !== 'after') {
            emit$1(request.page, 'dataProvided');
          } // resolve promise


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
  };

  const handleError = request => {
    if (request && request.error) {
      console.error(request.error);
    } else if (request) {
      Log.error(request);
    }

    if (request.page && routeExists('!')) {
      navigate('!', {
        request
      }, false);
    }
  };

  const mustReuse = route => {
    const opt = getOption(route.options, 'reuseInstance');
    const config = routerConfig.get('reuseInstance'); // route always has final decision

    if (isBoolean(opt)) {
      return opt;
    }

    return !(isBoolean(config) && config === false);
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class RoutedApp extends lng.Component {
    static _template() {
      return {
        Pages: {
          forceZIndexContext: true
        },

        /**
         * This is a default Loading page that will be made visible
         * during data-provider on() you CAN override in child-class
         */
        Loading: {
          rect: true,
          w: 1920,
          h: 1080,
          color: 0xff000000,
          visible: false,
          zIndex: 99,
          Label: {
            mount: 0.5,
            x: 960,
            y: 540,
            text: {
              text: 'Loading..'
            }
          }
        }
      };
    }

    static _states() {
      return [class Loading extends this {
        $enter() {
          this.tag('Loading').visible = true;
        }

        $exit() {
          this.tag('Loading').visible = false;
        }

      }, class Widgets extends this {
        $enter(args, widget) {
          // store widget reference
          this._widget = widget; // since it's possible that this behaviour
          // is non-remote driven we force a recalculation
          // of the focuspath

          this._refocus();
        }

        _getFocused() {
          // we delegate focus to selected widget
          // so it can consume remotecontrol presses
          return this._widget;
        } // if we want to widget to widget focus delegation


        reload(widget) {
          this._widget = widget;

          this._refocus();
        }

        _handleKey() {
          const restoreFocus = routerConfig.get('autoRestoreRemote');
          /**
           * The Router used to delegate focus back to the page instance on
           * every unhandled key. This is barely usefull in any situation
           * so for now we offer the option to explicity turn that behaviour off
           * so we don't don't introduce a breaking change.
           */

          if (!isBoolean(restoreFocus) || restoreFocus === true) {
            Router.focusPage();
          }
        }

      }];
    }
    /**
     * Return location where pages need to be stored
     */


    get pages() {
      return this.tag('Pages');
    }
    /**
     * Tell router where widgets are stored
     */


    get widgets() {
      return this.tag('Widgets');
    }
    /**
     * we MUST register _handleBack method so the Router
     * can override it
     * @private
     */


    _handleBack() {}
    /**
     * We MUST return Router.activePage() so the new Page
     * can listen to the remote-control.
     */


    _getFocused() {
      return Router.getActivePage();
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  /*
  rouThor ==[x]
   */

  let navigateQueue = new Map();
  let forcedHash = '';
  let resumeHash = '';
  /**
   * Start routing the app
   * @param config - route config object
   * @param instance - instance of the app
   */

  const startRouter = (config, instance) => {
    bootRouter(config, instance);
    registerListener();
    start();
  }; // start translating url


  const start = () => {
    let hash = (getHash() || '').replace(/^#/, '');
    const bootKey = '$';
    const params = getQueryStringParams(hash);
    const bootRequest = getBootRequest();
    const rootHash = getRootHash();
    const isDirectLoad = hash.indexOf(bootKey) !== -1; // prevent direct reload of wildcard routes
    // expect bootComponent

    if (isWildcard.test(hash) && hash !== bootKey) {
      hash = '';
    } // store resume point for manual resume


    resumeHash = isDirectLoad ? rootHash : hash || rootHash;

    const ready = () => {
      if (!hash && rootHash) {
        if (isString(rootHash)) {
          navigate(rootHash);
        } else if (isFunction(rootHash)) {
          rootHash().then(res => {
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
        }).catch(e => {
          console.error(e);
        });
      }
    };

    if (routeExists(bootKey)) {
      if (hash && !isDirectLoad) {
        if (!getRouteByHash(hash)) {
          navigate('*', {
            failedHash: hash
          });
          return;
        }
      }

      navigate(bootKey, {
        resume: resumeHash,
        reload: bootKey === hash
      }, false);
    } else if (isFunction(bootRequest)) {
      bootRequest(params).then(() => {
        ready();
      }).catch(e => {
        handleBootError(e);
      });
    } else {
      ready();
    }
  };

  const handleBootError = e => {
    if (routeExists('!')) {
      navigate('!', {
        request: {
          error: e
        }
      });
    } else {
      console.error(e);
    }
  };
  /**
   * start a new request
   * @param url
   * @param args
   * @param store
   */


  const navigate = function (url) {
    let args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let store = arguments.length > 2 ? arguments[2] : undefined;

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

    if (hash.replace(/^#/, '') !== url) {
      // push request in the queue
      queue(url, args, store);
      setHash(url);

      if (!mustUpdateLocationHash()) {
        forcedHash = url;
        handleHashChange(url).then(() => {
          app._refocus();
        }).catch(e => {
          console.error(e);
        });
      }
    } else if (args.reload) {
      // push request in the queue
      queue(url, args, store);
      handleHashChange(url).then(() => {
        app._refocus();
      }).catch(e => {
        console.error(e);
      });
    }
  };

  const queue = function (hash) {
    let args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let store = arguments.length > 2 ? arguments[2] : undefined;
    hash = cleanHash(hash);

    if (!navigateQueue.has(hash)) {
      for (let request of navigateQueue.values()) {
        request.cancel();
      }

      const request = createRequest(hash, args, store);
      navigateQueue.set(decodeURIComponent(hash), request);
      return request;
    }

    return false;
  };
  /**
   * Handle change of hash
   * @param override
   * @returns {Promise<void>}
   */


  const handleHashChange = async override => {
    const hash = cleanHash(override || getHash());
    const queueId = decodeURIComponent(hash);
    let request = navigateQueue.get(queueId); // handle hash updated manually

    if (!request && !navigateQueue.size) {
      request = queue(hash);
    }

    const route = getRouteByHash(hash);

    if (!route) {
      if (routeExists('*')) {
        navigate('*', {
          failedHash: hash
        });
      } else {
        console.error("Unable to navigate to: ".concat(hash));
      }

      return;
    } // update current processed request


    request.hash = hash;
    request.route = route;
    let result = await beforeEachRoute(getActiveHash(), request); // test if a local hook is configured for the route

    if (result && route.beforeNavigate) {
      result = await route.beforeNavigate(getActiveHash(), request);
    }

    if (isBoolean(result)) {
      // only if resolve value is explicitly true
      // we continue the current route request
      if (result) {
        return resolveHashChange(request);
      }
    } else {
      // if navigation guard didn't return true
      // we cancel the current request
      request.cancel();
      navigateQueue.delete(queueId);

      if (isString(result)) {
        navigate(result);
      } else if (isObject(result)) {
        let store = true;

        if (isBoolean(result.store)) {
          store = result.store;
        }

        navigate(result.path, result.params, store);
      }
    }
  };
  /**
   * Continue processing the hash change if not blocked
   * by global or local hook
   * @param request - {}
   */


  const resolveHashChange = request => {
    const hash = request.hash;
    const route = request.route;
    const queueId = decodeURIComponent(hash); // store last requested hash so we can
    // prevent a route that resolved later
    // from displaying itself

    setLastHash(hash);

    if (route.path) {
      const component = getComponent(route.path); // if a hook is provided for the current route

      if (isFunction(route.hook)) {
        const urlParams = getValuesFromHash(hash, route.path);
        const params = {};

        for (const key of urlParams.keys()) {
          params[key] = urlParams.get(key);
        }

        route.hook(app, { ...params
        });
      } // if there is a component attached to the route


      if (component) {
        // force page to root state to prevent shared state issues
        const activePage = getActivePage();

        if (activePage) {
          const keepAlive = keepActivePageAlive(getActiveRoute(), request);

          if (activePage && route.path === getActiveRoute() && !keepAlive) {
            activePage._setState('');
          }
        }

        if (isPage(component)) {
          load(request).then(() => {
            app._refocus();

            navigateQueue.delete(queueId);
          });
        } else {
          // of the component is not a constructor
          // or a Component instance we can assume
          // that it's a dynamic import
          component().then(contents => {
            return contents.default;
          }).then(module => {
            storeComponent(route.path, module);
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
  /**
   * Directional step in history
   * @param level
   */


  const step = function () {
    let level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (!level || isNaN(level)) {
      return false;
    }

    const history = getHistory(); // for now we only support negative numbers

    level = Math.abs(level); // we can't step back past the amount
    // of history entries

    if (level > history.length) {
      if (isFunction(app._handleAppClose)) {
        return app._handleAppClose();
      }

      return app.application.closeApp();
    } else if (history.length) {
      // for now we only support history back
      const route = history.splice(history.length - level, level)[0]; // store changed history

      setHistory(history);
      return navigate(route.hash, {
        [symbols.backtrack]: true,
        [symbols.historyState]: route.state
      }, false);
    } else if (routerConfig.get('backtrack')) {
      const hashLastPart = /(\/:?[\w%\s-]+)$/;
      let hash = stripRegex(getHash());
      let floor = getFloor(hash); // test if we got deep-linked

      if (floor > 1) {
        while (floor--) {
          // strip of last part
          hash = hash.replace(hashLastPart, ''); // if we have a configured route
          // we navigate to it

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
  /**
   * Resume Router's page loading process after
   * the BootComponent became visible;
   */

  const resume = () => {
    if (isString(resumeHash)) {
      navigate(resumeHash, false);
      resumeHash = '';
    } else if (isFunction(resumeHash)) {
      resumeHash().then(res => {
        resumeHash = '';

        if (isObject(res)) {
          navigate(res.path, res.params);
        } else {
          navigate(res);
        }
      });
    } else {
      console.warn('[Router]: resume() called but no hash found');
    }
  };
  /**
   * Force reload active hash
   */


  const reload = () => {
    if (!isNavigating()) {
      const hash = getActiveHash();
      navigate(hash, {
        reload: true
      }, false);
    }
  };
  /**
   * Query if the Router is still processing a Request
   * @returns {boolean}
   */


  const isNavigating = () => {
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

  const getResumeHash = () => {
    return resumeHash;
  };
  /**
   * By default we return the location hash
   * @returns {string}
   */

  let getHash = () => {
    return document.location.hash;
  };
  /**
   * Update location hash
   * @param url
   */


  let setHash = url => {
    document.location.hash = url;
  };
  /**
   * This can be called from the platform / bootstrapper to override
   * the default getting and setting of the hash
   * @param config
   */


  const initRouter = config => {
    if (config.getHash) {
      getHash = config.getHash;
    }

    if (config.setHash) {
      setHash = config.setHash;
    }
  };
  /**
   * On hash change we start processing
   */

  const registerListener = () => {
    Registry.addEventListener(window, 'hashchange', async () => {
      if (mustUpdateLocationHash()) {
        try {
          await handleHashChange();
        } catch (e) {
          console.error(e);
        }
      }
    });
  };
  /**
   * Navigate to root hash
   */


  const root = () => {
    const rootHash = getRootHash();

    if (isString(rootHash)) {
      navigate(rootHash);
    } else if (isFunction(rootHash)) {
      rootHash().then(res => {
        if (isObject(res)) {
          navigate(res.path, res.params);
        } else {
          navigate(res);
        }
      });
    }
  }; // export API


  var Router = {
    startRouter,
    navigate,
    resume,
    step,
    go: step,
    back: step.bind(null, -1),
    activePage: getActivePage,

    getActivePage() {
      // warning
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
    // keep backwards compatible
    focusPage: restoreFocus,
    root: root,

    /**
     * Deprecated api methods
     */
    setupRoutes() {
      console.warn('Router: setupRoutes is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    },

    on() {
      console.warn('Router.on() is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    },

    before() {
      console.warn('Router.before() is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    },

    after() {
      console.warn('Router.after() is deprecated, consolidate your configuration');
      console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration');
    }

  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const defaultChannels = [{
    number: 1,
    name: 'Metro News 1',
    description: 'New York Cable News Channel',
    entitled: true,
    program: {
      title: 'The Morning Show',
      description: "New York's best morning show",
      startTime: new Date(new Date() - 60 * 5 * 1000).toUTCString(),
      // started 5 minutes ago
      duration: 60 * 30,
      // 30 minutes
      ageRating: 0
    }
  }, {
    number: 2,
    name: 'MTV',
    description: 'Music Television',
    entitled: true,
    program: {
      title: 'Beavis and Butthead',
      description: 'American adult animated sitcom created by Mike Judge',
      startTime: new Date(new Date() - 60 * 20 * 1000).toUTCString(),
      // started 20 minutes ago
      duration: 60 * 45,
      // 45 minutes
      ageRating: 18
    }
  }, {
    number: 3,
    name: 'NBC',
    description: 'NBC TV Network',
    entitled: false,
    program: {
      title: 'The Tonight Show Starring Jimmy Fallon',
      description: 'Late-night talk show hosted by Jimmy Fallon on NBC',
      startTime: new Date(new Date() - 60 * 10 * 1000).toUTCString(),
      // started 10 minutes ago
      duration: 60 * 60,
      // 1 hour
      ageRating: 10
    }
  }];
  const channels = () => Settings.get('platform', 'tv', defaultChannels);
  const randomChannel = () => channels()[~~(channels.length * Math.random())];

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let currentChannel;
  const callbacks = {};

  const emit = function (event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    callbacks[event] && callbacks[event].forEach(cb => {
      cb.apply(null, args);
    });
  }; // local mock methods


  let methods = {
    getChannel() {
      if (!currentChannel) currentChannel = randomChannel();
      return new Promise((resolve, reject) => {
        if (currentChannel) {
          const channel = { ...currentChannel
          };
          delete channel.program;
          resolve(channel);
        } else {
          reject('No channel found');
        }
      });
    },

    getProgram() {
      if (!currentChannel) currentChannel = randomChannel();
      return new Promise((resolve, reject) => {
        currentChannel.program ? resolve(currentChannel.program) : reject('No program found');
      });
    },

    setChannel(number) {
      return new Promise((resolve, reject) => {
        if (number) {
          const newChannel = channels().find(c => c.number === number);

          if (newChannel) {
            currentChannel = newChannel;
            const channel = { ...currentChannel
            };
            delete channel.program;
            emit('channelChange', channel);
            resolve(channel);
          } else {
            reject('Channel not found');
          }
        } else {
          reject('No channel number supplied');
        }
      });
    }

  };
  const initTV = config => {
    methods = {};

    if (config.getChannel && typeof config.getChannel === 'function') {
      methods.getChannel = config.getChannel;
    }

    if (config.getProgram && typeof config.getProgram === 'function') {
      methods.getProgram = config.getProgram;
    }

    if (config.setChannel && typeof config.setChannel === 'function') {
      methods.setChannel = config.setChannel;
    }

    if (config.emit && typeof config.emit === 'function') {
      config.emit(emit);
    }
  }; // public API

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const initPurchase = config => {
    if (config.billingUrl) config.billingUrl;
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */

  class PinInput extends lng.Component {
    static _template() {
      return {
        w: 120,
        h: 150,
        rect: true,
        color: 0xff949393,
        alpha: 0.5,
        shader: {
          type: lng.shaders.RoundedRectangle,
          radius: 10
        },
        Nr: {
          w: w => w,
          y: 24,
          text: {
            text: '',
            textColor: 0xff333333,
            fontSize: 80,
            textAlign: 'center',
            verticalAlign: 'middle'
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
        this.setSmooth('alpha', 1);
      } else {
        this.setSmooth('alpha', 0.5);
      }

      this.tag('Nr').patch({
        text: {
          text: v && v.toString() || '',
          fontSize: v === '*' ? 120 : 80
        }
      });

      if (v && v !== '*') {
        this._timeout = setTimeout(() => {
          this._timeout = null;
          this.nr = '*';
        }, 750);
      }
    }

  }

  class PinDialog extends lng.Component {
    static _template() {
      return {
        zIndex: 1,
        w: w => w,
        h: h => h,
        rect: true,
        color: 0xdd000000,
        alpha: 0.000001,
        Dialog: {
          w: 648,
          h: 320,
          y: h => (h - 320) / 2,
          x: w => (w - 648) / 2,
          rect: true,
          color: 0xdd333333,
          shader: {
            type: lng.shaders.RoundedRectangle,
            radius: 10
          },
          Info: {
            y: 24,
            x: 48,
            text: {
              text: 'Please enter your PIN',
              fontSize: 32
            }
          },
          Msg: {
            y: 260,
            x: 48,
            text: {
              text: '',
              fontSize: 28,
              textColor: 0xffffffff
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

      this.tag('Code').children = children;
    }

    get pin() {
      if (!this._pin) this._pin = '';
      return this._pin;
    }

    set pin(v) {
      if (v.length <= 4) {
        const maskedPin = new Array(Math.max(v.length - 1, 0)).fill('*', 0, v.length - 1);
        v.length && maskedPin.push(v.length > this._pin.length ? v.slice(-1) : '*');

        for (let i = 0; i < 4; i++) {
          this.tag('Code').children[i].nr = maskedPin[i] || '';
        }

        this._pin = v;
      }
    }

    get msg() {
      if (!this._msg) this._msg = '';
      return this._msg;
    }

    set msg(v) {
      this._timeout && clearTimeout(this._timeout);
      this._msg = v;

      if (this._msg) {
        this.tag('Msg').text = this._msg;
        this.tag('Info').setSmooth('alpha', 0.5);
        this.tag('Code').setSmooth('alpha', 0.5);
      } else {
        this.tag('Msg').text = '';
        this.tag('Info').setSmooth('alpha', 1);
        this.tag('Code').setSmooth('alpha', 1);
      }

      this._timeout = setTimeout(() => {
        this.msg = '';
      }, 2000);
    }

    _firstActive() {
      this.setSmooth('alpha', 1);
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
          Pin.hide();
          this.resolve(false);
        }
      }
    }

    _handleEnter() {
      if (this.msg) {
        this.msg = false;
      } else {
        Pin.submit(this.pin).then(val => {
          this.msg = 'Unlocking ...';
          setTimeout(() => {
            Pin.hide();
          }, 1000);
          this.resolve(val);
        }).catch(e => {
          this.msg = e;
          this.reject(e);
        });
      }
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */

  let unlocked = false;
  const contextItems = ['purchase', 'parental'];

  let submit = (pin, context) => {
    return new Promise((resolve, reject) => {
      if (pin.toString() === Settings.get('platform', 'pin', '0000').toString()) {
        unlocked = true;
        resolve(unlocked);
      } else {
        reject('Incorrect pin');
      }
    });
  };

  let check = context => {
    return new Promise(resolve => {
      resolve(unlocked);
    });
  };

  const initPin = config => {
    if (config.submit && typeof config.submit === 'function') {
      submit = config.submit;
    }

    if (config.check && typeof config.check === 'function') {
      check = config.check;
    }
  };
  let pinDialog = null;

  const contextCheck = context => {
    if (context === undefined) {
      Log.info('Please provide context explicitly');
      return contextItems[0];
    } else if (!contextItems.includes(context)) {
      Log.warn('Incorrect context provided');
      return false;
    }

    return context;
  }; // Public API


  var Pin = {
    show() {
      return new Promise((resolve, reject) => {
        pinDialog = ApplicationInstance.stage.c({
          ref: 'PinDialog',
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
      ApplicationInstance.children = ApplicationInstance.children.map(child => child !== pinDialog && child);
      pinDialog = null;
    },

    submit(pin, context) {
      return new Promise((resolve, reject) => {
        try {
          context = contextCheck(context);

          if (context) {
            submit(pin, context).then(resolve).catch(reject);
          } else {
            reject('Incorrect Context provided');
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
            reject('Incorrect Context provided');
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
            check(context).then(unlocked => resolve(!!!unlocked)).catch(reject);
          } else {
            reject('Incorrect Context provided');
          }
        } catch (e) {
          reject(e);
        }
      });
    }

  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let ApplicationInstance;
  var Launch = ((App, appSettings, platformSettings, appData) => {
    initSettings(appSettings, platformSettings);
    initUtils(platformSettings);
    initStorage(); // Initialize plugins

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

    const app = Application(App, appData, platformSettings);
    ApplicationInstance = new app(appSettings);
    return ApplicationInstance;
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class VideoTexture extends lng.Component {
    static _template() {
      return {
        Video: {
          alpha: 1,
          visible: false,
          pivot: 0.5,
          texture: {
            type: lng.textures.StaticTexture,
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
      return this.tag('Video');
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
      const stage = this.stage;
      const gl = stage.gl;
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
      const stage = this.stage;
      this._lastTime = 0;

      if (!this._updateVideoTexture) {
        this._updateVideoTexture = () => {
          if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
            const gl = stage.gl;
            const currentTime = new Date().getTime();
            const getVideoPlaybackQuality = this.videoEl.getVideoPlaybackQuality(); // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
            // We'll fallback to fixed 30fps in this case.
            // As 'webkitDecodedFrameCount' is about to deprecate, check for the 'totalVideoFrames'

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
                Log.error('texImage2d video', e);
                this.stop();
              }

              this.videoTexture.source.forceRenderUpdate();
            }
          }
        };
      }

      if (!this._updatingVideoTexture) {
        stage.on('frameStart', this._updateVideoTexture);
        this._updatingVideoTexture = true;
      }
    }

    stop() {
      const stage = this.stage;
      stage.removeListener('frameStart', this._updateVideoTexture);
      this._updatingVideoTexture = false;
      this.videoView.visible = false;

      if (this.videoTexture.options.source) {
        const gl = stage.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }

    position(top, left) {
      this.videoView.patch({
        smooth: {
          x: left,
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
      this.videoView.setSmooth('alpha', 1);
    }

    hide() {
      this.videoView.setSmooth('alpha', 0);
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let mediaUrl = url => url;
  let videoEl;
  let videoTexture;
  let metrics;
  let consumer$1;
  let precision = 1;
  let textureMode = false;
  const initVideoPlayer = config => {
    if (config.mediaUrl) {
      mediaUrl = config.mediaUrl;
    }
  }; // todo: add this in a 'Registry' plugin
  // to be able to always clean this up on app close

  let eventHandlers = {};
  const state$1 = {
    adsEnabled: false,
    playing: false,
    _playingAds: false,

    get playingAds() {
      return this._playingAds;
    },

    set playingAds(val) {
      if (this._playingAds !== val) {
        this._playingAds = val;
        fireOnConsumer$1(val === true ? 'AdStart' : 'AdEnd');
      }
    },

    skipTime: false,
    playAfterSeek: null
  };
  const hooks = {
    play() {
      state$1.playing = true;
    },

    pause() {
      state$1.playing = false;
    },

    seeked() {
      state$1.playAfterSeek === true && videoPlayerPlugin.play();
      state$1.playAfterSeek = null;
    },

    abort() {
      deregisterEventListeners();
    }

  };

  const withPrecision = val => Math.round(precision * val) + 'px';

  const fireOnConsumer$1 = (event, args) => {
    if (consumer$1) {
      consumer$1.fire('$videoPlayer' + event, args, videoEl.currentTime);
      consumer$1.fire('$videoPlayerEvent', event, args, videoEl.currentTime);
    }
  };

  const fireHook = (event, args) => {
    hooks[event] && typeof hooks[event] === 'function' && hooks[event].call(null, event, args);
  };

  let customLoader = null;
  let customUnloader = null;

  const loader = (url, videoEl, config) => {
    return customLoader && typeof customLoader === 'function' ? customLoader(url, videoEl, config) : new Promise(resolve => {
      url = mediaUrl(url);
      videoEl.setAttribute('src', url);
      videoEl.load();
      resolve();
    });
  };

  const unloader = videoEl => {
    return customUnloader && typeof customUnloader === 'function' ? customUnloader(videoEl) : new Promise(resolve => {
      videoEl.removeAttribute('src');
      videoEl.load();
      resolve();
    });
  };

  const setupVideoTag = () => {
    const videoEls = document.getElementsByTagName('video');

    if (videoEls && videoEls.length) {
      return videoEls[0];
    } else {
      const videoEl = document.createElement('video');
      const platformSettingsWidth = Settings.get('platform', 'width') ? Settings.get('platform', 'width') : 1920;
      const platformSettingsHeight = Settings.get('platform', 'height') ? Settings.get('platform', 'height') : 1080;
      videoEl.setAttribute('id', 'video-player');
      videoEl.setAttribute('width', withPrecision(platformSettingsWidth));
      videoEl.setAttribute('height', withPrecision(platformSettingsHeight));
      videoEl.style.position = 'absolute';
      videoEl.style.zIndex = '1';
      videoEl.style.display = 'none';
      videoEl.style.visibility = 'hidden';
      videoEl.style.top = withPrecision(0);
      videoEl.style.left = withPrecision(0);
      videoEl.style.width = withPrecision(platformSettingsWidth);
      videoEl.style.height = withPrecision(platformSettingsHeight);
      document.body.appendChild(videoEl);
      return videoEl;
    }
  };
  const setUpVideoTexture = () => {
    if (!ApplicationInstance.tag('VideoTexture')) {
      const el = ApplicationInstance.stage.c({
        type: VideoTexture,
        ref: 'VideoTexture',
        zIndex: 0,
        videoEl
      });
      ApplicationInstance.childList.addAt(el, 0);
    }

    return ApplicationInstance.tag('VideoTexture');
  };

  const registerEventListeners = () => {
    Log.info('VideoPlayer', 'Registering event listeners');
    Object.keys(events$1).forEach(event => {
      const handler = e => {
        // Fire a metric for each event (if it exists on the metrics object)
        if (metrics && metrics[event] && typeof metrics[event] === 'function') {
          metrics[event]({
            currentTime: videoEl.currentTime
          });
        } // fire an internal hook


        fireHook(event, {
          videoElement: videoEl,
          event: e
        }); // fire the event (with human friendly event name) to the consumer of the VideoPlayer

        fireOnConsumer$1(events$1[event], {
          videoElement: videoEl,
          event: e
        });
      };

      eventHandlers[event] = handler;
      videoEl.addEventListener(event, handler);
    });
  };

  const deregisterEventListeners = () => {
    Log.info('VideoPlayer', 'Deregistering event listeners');
    Object.keys(eventHandlers).forEach(event => {
      videoEl.removeEventListener(event, eventHandlers[event]);
    });
    eventHandlers = {};
  };

  const videoPlayerPlugin = {
    consumer(component) {
      consumer$1 = component;
    },

    loader(loaderFn) {
      customLoader = loaderFn;
    },

    unloader(unloaderFn) {
      customUnloader = unloaderFn;
    },

    position() {
      let top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      let left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      videoEl.style.left = withPrecision(left);
      videoEl.style.top = withPrecision(top);

      if (textureMode === true) {
        videoTexture.position(top, left);
      }
    },

    size() {
      let width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1920;
      let height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1080;
      videoEl.style.width = withPrecision(width);
      videoEl.style.height = withPrecision(height);
      videoEl.width = parseFloat(videoEl.style.width);
      videoEl.height = parseFloat(videoEl.style.height);

      if (textureMode === true) {
        videoTexture.size(width, height);
      }
    },

    area() {
      let top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      let right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1920;
      let bottom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1080;
      let left = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      this.position(top, left);
      this.size(right - left, bottom - top);
    },

    open(url) {
      let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!this.canInteract) return;
      metrics = Metrics$1.media(url);
      this.hide();
      deregisterEventListeners();

      if (this.src == url) {
        this.clear().then(this.open(url, config));
      } else {
        const adConfig = {
          enabled: state$1.adsEnabled,
          duration: 300
        };

        if (config.videoId) {
          adConfig.caid = config.videoId;
        }

        Ads.get(adConfig, consumer$1).then(ads => {
          state$1.playingAds = true;
          ads.prerolls().then(() => {
            state$1.playingAds = false;
            loader(url, videoEl, config).then(() => {
              registerEventListeners();
              this.show();
              this.play();
            }).catch(e => {
              fireOnConsumer$1('error', {
                videoElement: videoEl,
                event: e
              });
            });
          });
        });
      }
    },

    reload() {
      if (!this.canInteract) return;
      const url = videoEl.getAttribute('src');
      this.close();
      this.open(url);
    },

    close() {
      Ads.cancel();

      if (state$1.playingAds) {
        state$1.playingAds = false;
        Ads.stop(); // call self in next tick

        setTimeout(() => {
          this.close();
        });
      }

      if (!this.canInteract) return;
      this.clear();
      this.hide();
      deregisterEventListeners();
    },

    clear() {
      if (!this.canInteract) return; // pause the video first to disable sound

      this.pause();
      if (textureMode === true) videoTexture.stop();
      return unloader(videoEl).then(() => {
        fireOnConsumer$1('Clear', {
          videoElement: videoEl
        });
      });
    },

    play() {
      if (!this.canInteract) return;
      if (textureMode === true) videoTexture.start();
      executeAsPromise(videoEl.play, null, videoEl).catch(e => {
        fireOnConsumer$1('error', {
          videoElement: videoEl,
          event: e
        });
      });
    },

    pause() {
      if (!this.canInteract) return;
      videoEl.pause();
    },

    playPause() {
      if (!this.canInteract) return;
      this.playing === true ? this.pause() : this.play();
    },

    mute() {
      let muted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (!this.canInteract) return;
      videoEl.muted = muted;
    },

    loop() {
      let looped = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      videoEl.loop = looped;
    },

    seek(time) {
      if (!this.canInteract) return;
      if (!this.src) return; // define whether should continue to play after seek is complete (in seeked hook)

      if (state$1.playAfterSeek === null) {
        state$1.playAfterSeek = !!state$1.playing;
      } // pause before actually seeking


      this.pause(); // currentTime always between 0 and the duration of the video (minus 0.1s to not set to the final frame and stall the video)

      videoEl.currentTime = Math.max(0, Math.min(time, this.duration - 0.1));
    },

    skip(seconds) {
      if (!this.canInteract) return;
      if (!this.src) return;
      state$1.skipTime = (state$1.skipTime || videoEl.currentTime) + seconds;
      easeExecution(() => {
        this.seek(state$1.skipTime);
        state$1.skipTime = false;
      }, 300);
    },

    show() {
      if (!this.canInteract) return;

      if (textureMode === true) {
        videoTexture.show();
      } else {
        videoEl.style.display = 'block';
        videoEl.style.visibility = 'visible';
      }
    },

    hide() {
      if (!this.canInteract) return;

      if (textureMode === true) {
        videoTexture.hide();
      } else {
        videoEl.style.display = 'none';
        videoEl.style.visibility = 'hidden';
      }
    },

    enableAds() {
      let enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      state$1.adsEnabled = enabled;
    },

    /* Public getters */
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
      return videoEl && videoEl.getAttribute('src');
    },

    get playing() {
      return state$1.playing;
    },

    get playingAds() {
      return state$1.playingAds;
    },

    get canInteract() {
      // todo: perhaps add an extra flag wether we allow interactions (i.e. pauze, mute, etc.) during ad playback
      return state$1.playingAds === false;
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
        return videoEl && videoEl.style.display === 'block';
      }
    },

    get adsEnabled() {
      return state$1.adsEnabled;
    },

    // prefixed with underscore to indicate 'semi-private'
    // because it's not recommended to interact directly with the video element
    get _videoEl() {
      return videoEl;
    },

    get _consumer() {
      return consumer$1;
    }

  };
  autoSetupMixin(videoPlayerPlugin, () => {
    precision = ApplicationInstance && ApplicationInstance.stage && ApplicationInstance.stage.getRenderPrecision() || precision;
    videoEl = setupVideoTag();
    textureMode = Settings.get('platform', 'textureMode', false);

    if (textureMode === true) {
      videoEl.setAttribute('crossorigin', 'anonymous');
      videoTexture = setUpVideoTexture();
    }
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let consumer;

  let getAds = () => {
    // todo: enable some default ads during development, maybe from the settings.json
    return Promise.resolve({
      prerolls: [],
      midrolls: [],
      postrolls: []
    });
  };

  const initAds = config => {
    if (config.getAds) {
      getAds = config.getAds;
    }
  };
  const state = {
    active: false
  };

  const playSlot = function () {
    let slot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return slot.reduce((promise, ad) => {
      return promise.then(() => {
        return playAd(ad);
      });
    }, Promise.resolve(null));
  };

  const playAd = ad => {
    return new Promise(resolve => {
      if (state.active === false) {
        Log.info('Ad', 'Skipping add due to inactive state');
        return resolve();
      } // is it safe to rely on videoplayer plugin already created the video tag?


      const videoEl = document.getElementsByTagName('video')[0];
      videoEl.style.display = 'block';
      videoEl.style.visibility = 'visible';
      videoEl.src = mediaUrl(ad.url);
      videoEl.load();
      let timeEvents = null;
      let timeout;

      const cleanup = () => {
        // remove all listeners
        Object.keys(handlers).forEach(handler => videoEl.removeEventListener(handler, handlers[handler]));
        resolve();
      };

      const handlers = {
        play() {
          Log.info('Ad', 'Play ad', ad.url);
          fireOnConsumer('Play', ad);
          sendBeacon(ad.callbacks, 'defaultImpression');
        },

        ended() {
          fireOnConsumer('Ended', ad);
          sendBeacon(ad.callbacks, 'complete');
          cleanup();
        },

        timeupdate() {
          if (!timeEvents && videoEl.duration) {
            // calculate when to fire the time based events (now that duration is known)
            timeEvents = {
              firstQuartile: videoEl.duration / 4,
              midPoint: videoEl.duration / 2,
              thirdQuartile: videoEl.duration / 4 * 3
            };
            Log.info('Ad', 'Calculated quartiles times', {
              timeEvents
            });
          }

          if (timeEvents && timeEvents.firstQuartile && videoEl.currentTime >= timeEvents.firstQuartile) {
            fireOnConsumer('FirstQuartile', ad);
            delete timeEvents.firstQuartile;
            sendBeacon(ad.callbacks, 'firstQuartile');
          }

          if (timeEvents && timeEvents.midPoint && videoEl.currentTime >= timeEvents.midPoint) {
            fireOnConsumer('MidPoint', ad);
            delete timeEvents.midPoint;
            sendBeacon(ad.callbacks, 'midPoint');
          }

          if (timeEvents && timeEvents.thirdQuartile && videoEl.currentTime >= timeEvents.thirdQuartile) {
            fireOnConsumer('ThirdQuartile', ad);
            delete timeEvents.thirdQuartile;
            sendBeacon(ad.callbacks, 'thirdQuartile');
          }
        },

        stalled() {
          fireOnConsumer('Stalled', ad);
          timeout = setTimeout(() => {
            cleanup();
          }, 5000); // make timeout configurable
        },

        canplay() {
          timeout && clearTimeout(timeout);
        },

        error() {
          fireOnConsumer('Error', ad);
          cleanup();
        },

        // this doesn't work reliably on sky box, moved logic to timeUpdate event
        // loadedmetadata() {
        //   // calculate when to fire the time based events (now that duration is known)
        //   timeEvents = {
        //     firstQuartile: videoEl.duration / 4,
        //     midPoint: videoEl.duration / 2,
        //     thirdQuartile: (videoEl.duration / 4) * 3,
        //   }
        // },
        abort() {
          cleanup();
        } // todo: pause, resume, mute, unmute beacons


      }; // add all listeners

      Object.keys(handlers).forEach(handler => videoEl.addEventListener(handler, handlers[handler]));
      videoEl.play();
    });
  };

  const sendBeacon = (callbacks, event) => {
    if (callbacks && callbacks[event]) {
      Log.info('Ad', 'Sending beacon', event, callbacks[event]);
      return callbacks[event].reduce((promise, url) => {
        return promise.then(() => fetch(url) // always resolve, also in case of a fetch error (so we don't block firing the rest of the beacons for this event)
        // note: for fetch failed http responses don't throw an Error :)
        .then(response => {
          if (response.status === 200) {
            fireOnConsumer('Beacon' + event + 'Sent');
          } else {
            fireOnConsumer('Beacon' + event + 'Failed' + response.status);
          }

          Promise.resolve(null);
        }).catch(() => {
          Promise.resolve(null);
        }));
      }, Promise.resolve(null));
    } else {
      Log.info('Ad', 'No callback found for ' + event);
    }
  };

  const fireOnConsumer = (event, args) => {
    if (consumer) {
      consumer.fire('$ad' + event, args);
      consumer.fire('$adEvent', event, args);
    }
  };

  var Ads = {
    get(config, videoPlayerConsumer) {
      if (config.enabled === false) {
        return Promise.resolve({
          prerolls() {
            return Promise.resolve();
          }

        });
      }

      consumer = videoPlayerConsumer;
      return new Promise(resolve => {
        Log.info('Ad', 'Starting session');
        getAds(config).then(ads => {
          Log.info('Ad', 'API result', ads);
          resolve({
            prerolls() {
              if (ads.preroll) {
                state.active = true;
                fireOnConsumer('PrerollSlotImpression', ads);
                sendBeacon(ads.preroll.callbacks, 'slotImpression');
                return playSlot(ads.preroll.ads).then(() => {
                  fireOnConsumer('PrerollSlotEnd', ads);
                  sendBeacon(ads.preroll.callbacks, 'slotEnd');
                  state.active = false;
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
      Log.info('Ad', 'Cancel Ad');
      state.active = false;
    },

    stop() {
      Log.info('Ad', 'Stop Ad');
      state.active = false; // fixme: duplication

      const videoEl = document.getElementsByTagName('video')[0];
      videoEl.pause();
      videoEl.removeAttribute('src');
    }

  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class ScaledImageTexture extends lng.textures.ImageTexture {
    constructor(stage) {
      super(stage);
      this._scalingOptions = undefined;
    }

    set options(options) {
      this.resizeMode = this._scalingOptions = options;
    }

    _getLookupId() {
      return "".concat(this._src, "-").concat(this._scalingOptions.type, "-").concat(this._scalingOptions.w, "-").concat(this._scalingOptions.h);
    }

    getNonDefaults() {
      const obj = super.getNonDefaults();

      if (this._src) {
        obj.src = this._src;
      }

      return obj;
    }

  }

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
  const keyMap = {
    "F1": 112,
    "F2": 113,
    "F3": 114,
    "F4": 115,
    "F5": 116,
    "Amazon": 117,
    //F6
    "Netflix": 118,
    //F7
    "Youtube": 119,
    //F8
    "F11": 122,
    "F12": 123,
    "m": 77,
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
    // F5
    "PageUp": 33,
    "PageDown": 34,
    "Home": 36,
    "Settings_Shortcut": 121,
    "Guide_Shortcut": 120,
    "Inputs_Shortcut": 113,
    //F2
    "Picture_Setting_Shortcut": 114 //F3

  };

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

  /**Color constants */
  const themeOptions = {
    partnerOne: {
      hex: 0xfff58233,
      logo: 'RDKLogo.png',
      background: '0xff000000'
    },
    partnerTwo: {
      hex: 0xff91c848,
      logo: 'RDKLogo.png',
      background: '0xff000000'
    }
  };
  const language = {
    English: {
      id: 'en',
      fontSrc: 'Play/Play-Regular.ttf',
      font: 'Play'
    },
    Spanish: {
      id: 'sp',
      fontSrc: 'Play/Play-Regular.ttf',
      font: 'Play'
    }
  };
  const availableLanguages = ['English', 'Spanish'];
  var CONFIG = {
    theme: themeOptions['partnerOne'],
    language: localStorage.getItem('Language') != null && availableLanguages.includes(localStorage.getItem('Language')) ? language[localStorage.getItem('Language')] : language['English']
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class CollectionWrapper extends lng.Component {
    static _template() {
      return {
        Wrapper: {}
      };
    }

    _construct() {
      this._direction = CollectionWrapper.DIRECTION.row;
      this._scrollTransitionSettings = this.stage.transitions.createSettings({});
      this._spacing = 0;
      this._autoResize = false;
      this._requestingItems = false;
      this._requestThreshold = 1;
      this._requestsEnabled = false;
      this._gcThreshold = 5;
      this._gcIncrement = 0;
      this._forceLoad = false;
      this.clear();
    }

    _setup() {
      this._updateScrollTransition();
    }

    _updateScrollTransition() {
      const axis = this._direction === 1 ? 'y' : 'x';
      this.wrapper.transition(axis, this._scrollTransitionSettings);
      this._scrollTransition = this.wrapper.transition(axis);
    }

    _indexChanged(obj) {
      let {
        previousIndex: previous,
        index: target,
        dataLength: max,
        mainIndex,
        previousMainIndex,
        lines
      } = obj;

      if (!isNaN(previousMainIndex) && !isNaN(mainIndex) && !isNaN(lines)) {
        previous = previousMainIndex;
        target = mainIndex;
        max = lines;
      }

      if (this._requestsEnabled && !this._requestingItems) {
        if (previous < target && target + this._requestThreshold >= max) {
          this._requestingItems = true;
          this.signal('onRequestItems', obj).then(response => {
            const type = typeof response;

            if (Array.isArray(response) || type === 'object' || type === 'string' || type === 'number') {
              this.add(response);
            }

            if (response === false) {
              this.enableRequests = false;
            }

            this._requestingItems = false;
          });
        }
      }

      this._refocus();

      this.scrollCollectionWrapper(obj);
      this.signal('onIndexChanged', obj);
    }

    setIndex(index) {
      const targetIndex = limitWithinRange(index, 0, this._items.length - 1);
      const previousIndex = this._index;
      this._index = targetIndex;

      this._indexChanged({
        previousIndex,
        index: targetIndex,
        dataLength: this._items.length
      });

      return previousIndex !== targetIndex;
    }

    clear() {
      this._uids = [];
      this._items = [];
      this._index = 0;

      if (this.wrapper) {
        const hadChildren = this.wrapper.children > 0;
        this.wrapper.patch({
          x: 0,
          y: 0,
          children: []
        });

        if (hadChildren) {
          this._collectGarbage(true);
        }
      }
    }

    add(item) {
      this.addAt(item);
    }

    addAt(item) {
      let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._items.length;

      if (index >= 0 && index <= this._items.length) {
        if (!Array.isArray(item)) {
          item = [item];
        }

        const items = this._normalizeDataItems(item);

        this._items.splice(index, 0, ...items);

        this.plotItems();
        this.setIndex(this._index);
      } else {
        throw new Error('addAt: The index ' + index + ' is out of bounds ' + this._items.length);
      }
    }

    remove(item) {
      if (this.hasItems && item.assignedID) {
        for (let i = 0; i < this.wrapper.children.length; i++) {
          if (this.wrapper.children[i].assignedID === item.assignedID) {
            return this.removeAt(i);
          }
        }
      } else {
        throw new Error('remove: item not found');
      }
    }

    removeAt(index) {
      let amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (index < 0 && index >= this._items.length) {
        throw new Error('removeAt: The index ' + index + ' is out of bounds ' + this._items.length);
      }

      const item = this._items[index];

      this._items.splice(index, amount);

      this.plotItems();
      return item;
    }

    reload(item) {
      this.clear();
      this.add(item);
    }

    plotItems(items, options) {//placeholder
    }

    reposition() {
      let time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 70;

      if (this._repositionDebounce) {
        clearTimeout(this._repositionDebounce);
      }

      this._repositionDebounce = setTimeout(() => {
        this.repositionItems();
      }, time);
    }

    repositionItems() {
      //placeHolder
      this.signal('onItemsRepositioned');
    }

    up() {
      return this._attemptNavigation(-1, 1);
    }

    down() {
      return this._attemptNavigation(1, 1);
    }

    left() {
      return this._attemptNavigation(-1, 0);
    }

    right() {
      return this._attemptNavigation(1, 0);
    }

    first() {
      return this.setIndex(0);
    }

    last() {
      return this.setIndex(this._items.length - 1);
    }

    next() {
      return this.setIndex(this._index + 1);
    }

    previous() {
      return this.setIndex(this._index - 1);
    }

    _attemptNavigation(shift, direction) {
      if (this.hasItems) {
        return this.navigate(shift, direction);
      }

      return false;
    }

    navigate(shift) {
      let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._direction;

      if (direction !== this._direction) {
        return false;
      }

      return this.setIndex(this._index + shift);
    }

    scrollCollectionWrapper(obj) {
      let {
        previousIndex: previous,
        index: target,
        dataLength: max,
        mainIndex,
        previousMainIndex,
        lines
      } = obj;

      if (!isNaN(previousMainIndex) && !isNaN(mainIndex) && !isNaN(lines)) {
        previous = previousMainIndex;
        target = mainIndex;
        max = lines;
      }

      const {
        directionIsRow,
        main,
        mainDim,
        mainMarginFrom,
        mainMarginTo
      } = this._getPlotProperties(this._direction);

      const cw = this.currentItemWrapper;
      let bound = this[mainDim];

      if (bound === 0) {
        bound = directionIsRow ? 1920 : 1080;
      }

      const offset = Math.min(this.wrapper[main], this._scrollTransition && this._scrollTransition.targetValue || 0);

      const sizes = this._getItemSizes(cw);

      const marginFrom = sizes[mainMarginFrom] || sizes.margin || 0;
      const marginTo = sizes[mainMarginTo] || sizes.margin || 0;
      let scroll = this._scroll;

      if (!isNaN(scroll)) {
        if (scroll >= 0 && scroll <= 1) {
          scroll = bound * scroll - (cw[main] + cw[mainDim] * scroll);
        } else {
          scroll = scroll - cw[main];
        }
      } else if (typeof scroll === 'function') {
        scroll = scroll.apply(this, [cw, obj]);
      } else if (typeof scroll === 'object') {
        const {
          jump = false,
          after = false,
          backward = 0.0,
          forward = 1.0
        } = scroll;

        if (jump) {
          let mod = target % jump;

          if (mod === 0) {
            scroll = marginFrom - cw[main];
          }

          if (mod === jump - 1) {
            const actualSize = marginFrom + cw[mainDim] + marginTo;
            scroll = mod * actualSize + marginFrom - cw[main];
          }
        } else if (after) {
          scroll = 0;

          if (target >= after - 1) {
            const actualSize = marginFrom + cw[mainDim] + marginTo;
            scroll = (after - 1) * actualSize + marginFrom - cw[main];
          }
        } else {
          const backwardBound = bound * this._normalizePixelToPercentage(backward, bound);

          const forwardBound = bound * this._normalizePixelToPercentage(forward, bound);

          if (target < max - 1 && previous < target && offset + cw[main] + cw[mainDim] > forwardBound) {
            scroll = forwardBound - (cw[main] + cw[mainDim]);
          } else if (target > 0 && target < previous && offset + cw[main] < backwardBound) {
            scroll = backwardBound - cw[main];
          } else if (target === max - 1) {
            scroll = bound - (cw[main] + cw[mainDim]);
          } else if (target === 0) {
            scroll = marginFrom - cw[main];
          }
        }
      } else if (isNaN(scroll)) {
        if (previous < target && offset + cw[main] + cw[mainDim] > bound) {
          scroll = bound - (cw[main] + cw[mainDim]);
        } else if (target < previous && offset + cw[main] < 0) {
          scroll = marginFrom - cw[main];
        }
      }

      if (this.active && !isNaN(scroll) && this._scrollTransition) {
        if (this._scrollTransition.isRunning()) {
          this._scrollTransition.reset(scroll, 0.05);
        } else {
          this._scrollTransition.start(scroll);
        }
      } else if (!isNaN(scroll)) {
        this.wrapper[main] = scroll;
      }
    }

    $childInactive(_ref) {
      let {
        child
      } = _ref;

      if (typeof child === 'object') {
        const index = child.componentIndex;

        for (let key in this._items[index]) {
          if (child.component[key] !== undefined) {
            this._items[index][key] = child.component[key];
          }
        }
      }

      this._collectGarbage();
    }

    $getChildComponent(_ref2) {
      let {
        index
      } = _ref2;
      return this._items[index];
    }

    _resizeWrapper(crossSize) {
      let obj = crossSize;

      if (!isNaN(crossSize)) {
        const {
          main,
          mainDim,
          crossDim
        } = this._getPlotProperties(this._direction);

        const lastItem = this.wrapper.childList.last;
        obj = {
          [mainDim]: lastItem[main] + lastItem[mainDim],
          [crossDim]: crossSize
        };
      }

      this.wrapper.patch(obj);

      if (this._autoResize) {
        this.patch(obj);
      }
    }

    _generateUniqueID() {
      let id = '';

      while (this._uids[id] || id === '') {
        id = Math.random().toString(36).substr(2, 9);
      }

      this._uids[id] = true;
      return id;
    }

    _getPlotProperties(direction) {
      const directionIsRow = direction === 0;
      return {
        directionIsRow: directionIsRow ? true : false,
        mainDirection: directionIsRow ? 'rows' : 'columns',
        main: directionIsRow ? 'x' : 'y',
        mainDim: directionIsRow ? 'w' : 'h',
        mainMarginTo: directionIsRow ? 'marginRight' : 'marginBottom',
        mainMarginFrom: directionIsRow ? 'marginLeft' : 'marginUp',
        crossDirection: !directionIsRow ? 'columns' : 'rows',
        cross: directionIsRow ? 'y' : 'x',
        crossDim: directionIsRow ? 'h' : 'w',
        crossMarginTo: directionIsRow ? 'marginBottom' : 'marginRight',
        crossMarginFrom: directionIsRow ? 'marginUp' : 'marginLeft'
      };
    }

    _getItemSizes(item) {
      const itemType = item.type;

      if (item.component && item.component.__attached) {
        item = item.component;
      }

      return {
        w: item.w || itemType && itemType['width'],
        h: item.h || itemType && itemType['height'],
        margin: item.margin || itemType && itemType['margin'] || 0,
        marginLeft: item.marginLeft || itemType && itemType['marginLeft'],
        marginRight: item.marginRight || itemType && itemType['marginRight'],
        marginTop: item.marginTop || itemType && itemType['marginTop'],
        marginBottom: item.marginBottom || itemType && itemType['marginBottom']
      };
    }

    _collectGarbage(immediate) {
      this._gcIncrement++;

      if (immediate || this.active && this._gcThreshold !== 0 && this._gcIncrement >= this._gcThreshold) {
        this._gcIncrement = 0;
        this.stage.gc();
      }
    }

    _normalizeDataItems(array) {
      return array.map((item, index) => {
        return this._normalizeDataItem(item) || index;
      }).filter(item => {
        if (!isNaN(item)) {
          console.warn("Item at index: ".concat(item, ", is not a valid item. Removing it from dataset"));
          return false;
        }

        return true;
      });
    }

    _normalizeDataItem(item, index) {
      if (typeof item === 'string' || typeof item === 'number') {
        item = {
          label: item.toString()
        };
      }

      if (typeof item === 'object') {
        let id = this._generateUniqueID();

        return {
          assignedID: id,
          type: this.itemType,
          collectionWrapper: this,
          isAlive: false,
          ...item
        };
      }

      return index;
    }

    _normalizePixelToPercentage(value, max) {
      if (value && value > 1) {
        return value / max;
      }

      return value || 0;
    }

    _getFocused() {
      if (this.hasItems) {
        return this.currentItemWrapper;
      }

      return this;
    }

    _handleRight() {
      return this.right();
    }

    _handleLeft() {
      return this.left();
    }

    _handleUp() {
      return this.up();
    }

    _handleDown() {
      return this.down();
    }

    _inactive() {
      if (this._repositionDebounce) {
        clearTimeout(this._repositionDebounce);
      }

      this._collectGarbage(true);
    }

    static get itemType() {
      return undefined;
    }

    set forceLoad(bool) {
      this._forceLoad = bool;
    }

    get forceLoad() {
      return this._forceLoad;
    }

    get requestingItems() {
      return this._requestingItems;
    }

    set requestThreshold(num) {
      this._requestThreshold = num;
    }

    get requestThreshold() {
      return this._requestThreshold;
    }

    set enableRequests(bool) {
      this._requestsEnabled = bool;
    }

    get enableRequests() {
      return this._requestsEnabled;
    }

    set gcThreshold(num) {
      this._gcThreshold = num;
    }

    get gcThreshold() {
      return this._gcThreshold;
    }

    get wrapper() {
      return this.tag('Wrapper');
    }

    get hasItems() {
      return this.wrapper && this.wrapper.children && this.wrapper.children.length > 0;
    }

    get currentItemWrapper() {
      return this.wrapper.children[this._index];
    }

    get currentItem() {
      return this.currentItemWrapper.component;
    }

    set direction(string) {
      this._direction = CollectionWrapper.DIRECTION[string] || CollectionWrapper.DIRECTION.row;
    }

    get direction() {
      return Object.keys(CollectionWrapper.DIRECTION)[this._direction];
    }

    set items(array) {
      this.clear();
      this.add(array);
    }

    get items() {
      const itemWrappers = this.itemWrappers;
      return this._items.map((item, index) => {
        if (itemWrappers[index] && itemWrappers[index].component.isAlive) {
          return itemWrappers[index].component;
        }

        return item;
      });
    }

    get length() {
      return this._items.length;
    }

    set index(index) {
      this.setIndex(index);
    }

    get itemWrappers() {
      return this.wrapper.children;
    }

    get index() {
      return this._index;
    }

    set scrollTransition(obj) {
      this._scrollTransitionSettings.patch(obj);

      if (this.active) {
        this._updateScrollTransition();
      }
    }

    get scrollTransition() {
      return this._scrollTransition;
    }

    set scroll(value) {
      this._scroll = value;
    }

    get scrollTo() {
      return this._scroll;
    }

    set autoResize(bool) {
      this._autoResize = bool;
    }

    get autoResize() {
      return this._autoResize;
    }

    set spacing(num) {
      this._spacing = num;
    }

    get spacing() {
      return this._spacing;
    }

  }
  CollectionWrapper.DIRECTION = {
    row: 0,
    column: 1
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class Cursor extends lng.Component {
    static _template() {
      return {
        alpha: 0
      };
    }

    _construct() {
      this._blink = true;
    }

    _init() {
      this._blinkAnimation = this.animation({
        duration: 1,
        repeat: -1,
        actions: [{
          p: 'alpha',
          v: {
            0: 0,
            0.5: 1,
            1: 0
          }
        }]
      });
    }

    show() {
      if (this._blink) {
        this._blinkAnimation.start();
      } else {
        this.alpha = 1;
      }
    }

    hide() {
      if (this._blink) {
        this._blinkAnimation.stop();
      } else {
        this.alpha = 0;
      }
    }

    set blink(bool) {
      this._blink = bool;

      if (this.active) {
        if (bool) {
          this.show();
        } else {
          this.hide();
        }
      }
    }

    get blink() {
      return this._blink;
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class ItemWrapper extends lng.Component {
    static _template() {
      return {
        clipbox: true
      };
    }

    create() {
      if (this.children.length > 0) {
        return;
      }

      const component = this.fireAncestors('$getChildComponent', {
        index: this.componentIndex
      });
      component.isAlive = true;
      const {
        w,
        h,
        margin,
        marginUp,
        marginBottom,
        marginRight,
        marginLeft
      } = this;
      this.children = [{ ...component,
        w,
        h,
        margin,
        marginUp,
        marginRight,
        marginLeft,
        marginBottom
      }];

      if (this.hasFocus()) {
        this._refocus();
      }
    }

    get component() {
      return this.children[0] || this.fireAncestors('$getChildComponent', {
        index: this.componentIndex
      });
    }

    _setup() {
      if (this.forceLoad) {
        this.create();
      }
    }

    _active() {
      this.create();
    }

    _inactive() {
      if (!this.forceLoad) {
        this.children[0].isAlive = false;
        this.fireAncestors('$childInactive', {
          child: this
        });
        this.childList.clear();
      }
    }

    _getFocused() {
      return this.children && this.children[0] || this;
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class KeyWrapper extends lng.Component {
    static _template() {
      return {
        clipbox: true
      };
    }

    _update() {
      let currentKey = this.children && this.children[0];

      if (currentKey && currentKey.action === this._key.data.action) {
        currentKey.patch({ ...this._key
        });
      } else {
        this.children = [{
          type: this._key.keyType,
          ...this._key
        }];
      }

      if (this.hasFocus()) {
        this._refocus();
      }
    }

    set key(obj) {
      this._key = obj;

      if (this.active) {
        this._update();
      }
    }

    get key() {
      return this._key;
    }

    _active() {
      this._update();
    }

    _inactive() {
      this.childList.clear();
    }

    _getFocused() {
      return this.children && this.children[0] || this;
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  const limitWithinRange = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class InputField extends lng.Component {
    static _template() {
      return {
        PreLabel: {
          renderOffscreen: true
        },
        PostLabel: {
          renderOffscreen: true
        },
        Cursor: {
          type: Cursor,
          rect: true,
          w: 4,
          h: 54,
          x: 0,
          y: 0
        }
      };
    }

    _construct() {
      this._input = '';
      this._previousInput = '';
      this._description = '';
      this._cursorX = 0;
      this._cursorIndex = 0;
      this._passwordMask = '*';
      this._passwordMode = false;
      this._autoHideCursor = true;
      this._labelPositionStatic = true;
      this._maxLabelWidth = 0;
    }

    _init() {
      this.tag('PreLabel').on('txLoaded', () => {
        this._labelTxLoaded();
      });
      this.tag('PostLabel').on('txLoaded', () => {
        this._labelTxLoaded;
      });
    }

    onInputChanged(_ref) {
      let {
        input = ''
      } = _ref;
      let targetIndex = Math.max(input.length - this._input.length + this._cursorIndex, 0);
      this._input = input;

      this._update(targetIndex);
    }

    toggleCursor() {
      let bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !this._cursorVisible;
      this._cursorVisible = bool;
      this.cursor[bool ? 'show' : 'hide']();
    }

    _labelTxLoaded() {
      const preLabel = this.tag('PreLabel');
      const cursor = this.tag('Cursor');
      const postLabel = this.tag('PostLabel');
      this.h = preLabel.renderHeight || postLabel.renderHeight;
      cursor.x = preLabel.renderWidth + this._cursorX;
      postLabel.x = cursor.x + cursor.w * (1 - cursor.mountX);
      this.setSmooth('x', this._labelOffset);

      if (!this.autoHideCursor) {
        this.toggleCursor(true);
      }
    }

    _update() {
      let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      const hasInput = this._input.length > 0;
      let pre = this._description + '';
      let post = '';

      if (hasInput) {
        pre = this._input.substring(0, index);
        post = this._input.substring(index, this._input.length);

        if (this._passwordMode) {
          pre = this._passwordMask.repeat(pre.length);
          post = this._passwordMask.repeat(post.length);
        }

        this.toggleCursor(true);
      } else if (this._autoHideCursor) {
        this.toggleCursor(false);
      }

      this.patch({
        PreLabel: {
          text: {
            text: pre
          }
        },
        PostLabel: {
          text: {
            text: post
          }
        }
      });

      if (this.h === 0) {
        this.tag('PreLabel').loadTexture();
        this.h = this.tag('PreLabel').renderHeight;
      }

      this._cursorIndex = index;
    }

    _handleRight() {
      this._update(Math.min(this._input.length, this._cursorIndex + 1));
    }

    _handleLeft() {
      this._update(Math.max(0, this._cursorIndex - 1));
    }

    _firstActive() {
      this._labelTxLoaded();

      this._update();
    }

    get input() {
      return this._input;
    }

    get hasInput() {
      return this._input.length > 0;
    }

    get cursorIndex() {
      return this._cursorIndex;
    }

    set inputText(obj) {
      this._inputText = obj;
      this.tag('PreLabel').patch({
        text: obj
      });
      this.tag('PostLabel').patch({
        text: obj
      });
    }

    get inputText() {
      return this._inputText;
    }

    set description(str) {
      this._description = str;
    }

    get description() {
      return this._description;
    }

    set cursor(obj) {
      if (obj.x) {
        this._cursorX = obj.x;
        delete obj.x;
      }

      this.tag('Cursor').patch(obj);
    }

    get cursor() {
      return this.tag('Cursor');
    }

    get cursorVisible() {
      return this._cursorVisible;
    }

    set autoHideCursor(bool) {
      this._autoHideCursor = bool;
    }

    get autoHideCursor() {
      return this._autoHideCursor;
    }

    set passwordMode(val) {
      this._passwordMode = val;
    }

    get passwordMode() {
      return this._passwordMode;
    }

    set passwordMask(str) {
      this._passwordMask = str;
    }

    get passwordmask() {
      return this._passwordMask;
    } // the width at which the text start scrolling


    set maxLabelWidth(val) {
      this._maxLabelWidth = val;
    }

    get maxLabelWidth() {
      return this._maxLabelWidth;
    }

    set labelPositionStatic(val) {
      this._labelPositionStatic = val;
    }

    get labelPositionStatic() {
      return this._labelPositionStatic;
    }

    get _labelOffset() {
      if (this._labelPositionStatic) return 0;
      let offset = this.maxLabelWidth - this.tag('Cursor').x;
      return offset < 0 ? offset : 0;
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class Key extends lng.Component {
    static _template() {
      return {
        Background: {
          w: w => w,
          h: h => h,
          rect: true
        },
        Label: {
          mount: 0.5,
          x: w => w / 2,
          y: h => h / 2
        }
      };
    }

    _construct() {
      this._backgroundColors = {};
      this._labelColors = {};
    }

    set data(obj) {
      this._data = obj;

      this._update();
    }

    get data() {
      return this._data;
    }

    set labelText(obj) {
      this._labelText = obj;
      this.tag('Label').patch({
        text: obj
      });
    }

    get labelText() {
      return this._labelText;
    }

    set label(obj) {
      this.tag('Label').patch(obj);
    }

    get label() {
      return this.tag('Label');
    }

    set labelColors(obj) {
      this._labelColors = obj;

      this._update();
    }

    get labelColors() {
      return this._labelColors;
    }

    set backgroundColors(obj) {
      this._backgroundColors = obj;

      this._update();
    }

    get backgroundColors() {
      return this._backgroundColors;
    }

    set background(obj) {
      this.tag('Background').patch(obj);
    }

    get background() {
      return this.tag('Background');
    }

    _update() {
      if (!this.active) {
        return;
      }

      const {
        label = ''
      } = this._data;
      const hasFocus = this.hasFocus();
      let {
        focused,
        unfocused = 0xff000000
      } = this._backgroundColors;
      let {
        focused: labelFocused,
        unfocused: labelUnfocused = 0xffffffff
      } = this._labelColors;
      this.patch({
        Background: {
          color: hasFocus && focused ? focused : unfocused
        },
        Label: {
          text: {
            text: label
          },
          color: hasFocus && labelFocused ? labelFocused : labelUnfocused
        }
      });
    }

    _firstActive() {
      this._update();
    }

    _focus() {
      let {
        focused,
        unfocused = 0xff000000
      } = this._backgroundColors;
      let {
        focused: labelFocused,
        unfocused: labelUnfocused = 0xffffffff
      } = this._labelColors;
      this.patch({
        Background: {
          smooth: {
            color: focused || unfocused
          }
        },
        Label: {
          smooth: {
            color: labelFocused || labelUnfocused
          }
        }
      });
    }

    _unfocus() {
      let {
        unfocused = 0xff000000
      } = this._backgroundColors;
      let {
        unfocused: labelUnfocused = 0xffffffff
      } = this._labelColors;
      this.patch({
        Background: {
          smooth: {
            color: unfocused
          }
        },
        Label: {
          smooth: {
            color: labelUnfocused
          }
        }
      });
    }

    static get width() {
      return 80;
    }

    static get height() {
      return 80;
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class Keyboard extends lng.Component {
    static _template() {
      return {
        Keys: {
          w: w => w
        }
      };
    }

    _construct() {
      this._input = '';
      this._inputField = undefined;
      this._maxCharacters = 56;
      this.navigationWrapAround = false;
      this.resetFocus();
    }

    resetFocus() {
      this._columnIndex = 0;
      this._rowIndex = 0;
      this._previousKey = null;
    }

    _setup() {
      this._keys = this.tag('Keys');

      this._update();
    }

    _update() {
      const {
        layouts,
        buttonTypes = {},
        styling = {}
      } = this._config;

      if (!this._layout || this._layout && layouts[this._layout] === undefined) {
        console.error("Configured layout \"".concat(this._layout, "\" does not exist. Picking first available: \"").concat(Object.keys(layouts)[0], "\""));
        this._layout = Object.keys(layouts)[0];
      }

      const {
        horizontalSpacing = 0,
        verticalSpacing = 0,
        align = 'left'
      } = styling;
      let rowPosition = 0;
      const isEvent = /^[A-Z][A-Za-z0-9]{1}/;
      const hasLabel = /\:/;

      if (buttonTypes.default === undefined) {
        buttonTypes.default = Key;
      }

      this._keys.children = layouts[this._layout].map((row, rowIndex) => {
        const {
          x = 0,
          margin = 0,
          marginRight,
          marginLeft,
          marginTop,
          marginBottom,
          spacing: rowHorizontalSpacing = horizontalSpacing || 0,
          align: rowAlign = align
        } = styling["Row".concat(rowIndex + 1)] || {};
        let keyPosition = 0;
        let rowHeight = 0;
        const rowKeys = row.map((key, keyIndex) => {
          const origin = key;
          let keyType = buttonTypes.default;
          let action = 'Input';
          let label = key;

          if (isEvent.test(key)) {
            if (hasLabel.test(key)) {
              key = key.split(':');
              label = key[1].toString();
              key = key[0];
            }

            if (buttonTypes[key]) {
              keyType = buttonTypes[key];
              action = key.action || key;
            }
          }

          const keySpacing = keyType.margin || keyType.type.margin;
          const {
            w = keyType.type.width || 0,
            h = keyType.type.height || 0,
            marginLeft = keyType.type.marginLeft || keySpacing || 0,
            marginRight = keyType.type.marginRight || keySpacing || rowHorizontalSpacing
          } = keyType;
          rowHeight = h > rowHeight ? h : rowHeight;
          const currentPosition = keyPosition + marginLeft;
          keyPosition += marginLeft + w + marginRight;
          return {
            ref: "Key-{".concat(keyIndex + 1, "}"),
            type: KeyWrapper,
            keyboard: this,
            x: currentPosition,
            w,
            h,
            key: {
              data: {
                origin,
                key,
                label,
                action
              },
              w,
              h,
              ...keyType
            }
          };
        });
        let rowOffset = x + (marginLeft || margin);
        let rowMount = 0;

        if (this.w && rowAlign === 'center') {
          rowOffset = this.w / 2;
          rowMount = 0.5;
        }

        if (this.w && rowAlign === 'right') {
          rowOffset = this.w - (marginRight || margin);
          rowMount = 1;
        }

        const currentPosition = rowPosition + (marginTop || margin);
        rowPosition = currentPosition + rowHeight + (marginBottom || margin || verticalSpacing);
        return {
          ref: "Row-".concat(rowIndex + 1),
          x: rowOffset,
          mountX: rowMount,
          w: keyPosition,
          y: currentPosition,
          children: rowKeys
        };
      });

      this._refocus();
    }

    _getFocused() {
      return this.currentKeyWrapper || this;
    }

    _handleRight() {
      return this.navigate('row', 1);
    }

    _handleLeft() {
      return this.navigate('row', -1);
    }

    _handleUp() {
      return this.navigate('column', -1);
    }

    _handleDown() {
      return this.navigate('column', 1);
    }

    _handleKey(_ref) {
      let {
        key,
        code = 'CustomKey'
      } = _ref;

      if (code === 'Backspace' && this._input.length === 0) {
        return false;
      }

      if (key === ' ') {
        key = 'Space';
      }

      const targetFound = this._findKey(key);

      if (targetFound) {
        this._handleEnter();
      }

      return targetFound;
    }

    _findKey(str) {
      const rows = this._config.layouts[this._layout];
      let i = 0,
          j = 0;

      for (; i < rows.length; i++) {
        for (j = 0; j < rows[i].length; j++) {
          let key = rows[i][j];

          if (str.length > 1 && key.indexOf(str) > -1 || key.toUpperCase() === str.toUpperCase()) {
            this._rowIndex = i;
            this._columnIndex = j;
            return true;
          }
        }
      }

      return false;
    }

    _handleEnter() {
      const {
        origin,
        action
      } = this.currentKey.data;
      const event = {
        index: this._input.length,
        key: origin
      };

      if (this._inputField && this._inputField.cursorIndex) {
        event.index = this._inputField.cursorIndex;
      }

      if (action !== 'Input') {
        const split = event.key.split(':');
        const call = "on".concat(split[0]);
        const eventFunction = this[call];
        event.key = split[1];

        if (eventFunction && eventFunction.apply && eventFunction.call) {
          eventFunction.call(this, event);
        }

        this.signal(call, {
          input: this._input,
          keyboard: this,
          ...event
        });
      } else {
        this.addAt(event.key, event.index);
      }
    }

    _changeInput(input) {
      if (input.length > this._maxCharacters) {
        return;
      }

      const eventData = {
        previousInput: this._input,
        input: this._input = input
      };

      if (this._inputField && this._inputField.onInputChanged) {
        this._inputField.onInputChanged(eventData);
      }

      this.signal('onInputChanged', eventData);
    }

    focus(str) {
      this._findKey(str);
    }

    add(str) {
      this._changeInput(this._input + str);
    }

    addAt(str, index) {
      if (index > this._input.length - 1) {
        this.add(str);
      } else if (index > -1) {
        this._changeInput(this._input.substring(0, index) + str + this._input.substring(index, this._input.length));
      }
    }

    remove() {
      this._changeInput(this._input.substring(0, this._input.length - 1));
    }

    removeAt(index) {
      if (index > this._input.length - 1) {
        this.remove();
      } else if (index > -1) {
        this._changeInput(this._input.substring(0, index - 1) + this._input.substring(index, this._input.length));
      }
    }

    clear() {
      this._changeInput('');
    }

    layout(key) {
      if (key === this._layout) {
        return;
      }

      this._layout = key;

      if (this.attached) {
        this.resetFocus();

        this._update();
      }
    }

    inputField(component) {
      if (component && component.isComponent) {
        this._rowIndex = 0;
        this._columnIndex = 0;
        this._input = component.input !== undefined ? component.input : '';
        this._inputField = component;
      } else {
        this._rowIndex = 0;
        this._columnIndex = 0;
        this._input = '';
        this._inputField = undefined;
      }
    }

    navigate(direction, shift) {
      const targetIndex = (direction === 'row' ? this._columnIndex : this._rowIndex) + shift;
      const currentRow = this.rows[this._rowIndex];

      if (direction === 'row' && targetIndex > -1 && targetIndex < currentRow.children.length) {
        this._previous = null;
        return this._columnIndex = targetIndex;
      } else if (direction === 'row' && this.navigationWrapAround) {
        this._previous = null;
        let rowLen = currentRow.children.length;
        return this._columnIndex = (targetIndex % rowLen + rowLen) % rowLen;
      }

      if (direction === 'column' && targetIndex > -1 && targetIndex < this.rows.length) {
        const currentRowIndex = this._rowIndex;
        const currentColumnIndex = this._columnIndex;

        if (this._previous && this._previous.row === targetIndex) {
          const tmp = this._previous.column;
          this._previous.column = this._columnIndex;
          this._columnIndex = tmp;
          this._rowIndex = this._previous.row;
        } else {
          const targetRow = this.rows[targetIndex];
          const currentKey = this.currentKeyWrapper;
          const currentRow = this.rows[this._rowIndex];
          const currentX = currentRow.x - currentRow.w * currentRow.mountX + currentKey.x;
          const m = targetRow.children.map(key => {
            const keyX = targetRow.x - targetRow.w * targetRow.mountX + key.x;

            if (keyX <= currentX && currentX < keyX + key.w) {
              return keyX + key.w - currentX;
            }

            if (keyX >= currentX && keyX <= currentX + currentKey.w) {
              return currentX + currentKey.w - keyX;
            }

            return -1;
          });
          let acc = -1;
          let t = -1;

          for (let i = 0; i < m.length; i++) {
            if (m[i] === -1 && acc > -1) {
              break;
            }

            if (m[i] > acc) {
              acc = m[i];
              t = i;
            }
          }

          if (t > -1) {
            this._rowIndex = targetIndex;
            this._columnIndex = t;
          } // if no next row found and wraparound is on, loop back to first row
          else if (this.navigationWrapAround) {
            this._columnIndex = Math.min(this.rows[0].children.length - 1, this._columnIndex);
            return this._rowIndex = 0;
          }
        }

        if (this._rowIndex !== currentRowIndex) {
          this._previous = {
            column: currentColumnIndex,
            row: currentRowIndex
          };
          return this._rowIndex = targetIndex;
        }
      } else if (direction === 'column' && this.navigationWrapAround) {
        this._previous = {
          column: this._columnIndex,
          row: this._rowIndex
        };
        let nrRows = this.rows.length;
        this._rowIndex = (targetIndex % nrRows + nrRows) % nrRows;
        this._columnIndex = Math.min(this.rows[this._rowIndex].children.length - 1, this._columnIndex);
      }

      return false;
    }

    onSpace(_ref2) {
      let {
        index
      } = _ref2;
      this.addAt(' ', index);
    }

    onBackspace(_ref3) {
      let {
        index
      } = _ref3;
      this.removeAt(index);
    }

    onClear() {
      this.clear();
    }

    onLayout(_ref4) {
      let {
        key
      } = _ref4;
      this.layout(key);
    }

    set config(obj) {
      this._config = obj;

      if (this.active) {
        this._update();
      }
    }

    get config() {
      return this._config;
    }

    set currentInputField(component) {
      this.inputField(component);
    }

    get currentInputField() {
      return this._inputField;
    }

    set currentLayout(str) {
      this.layout(str);
    }

    get currentLayout() {
      return this._layout;
    }

    set maxCharacters(num) {
      this._maxCharacters = num;
    }

    get maxCharacters() {
      return this._maxCharacters;
    }

    get rows() {
      return this._keys && this._keys.children;
    }

    get currentKeyWrapper() {
      return this.rows && this.rows[this._rowIndex].children[this._columnIndex];
    }

    get currentKey() {
      return this.currentKeyWrapper && this.currentKeyWrapper.key;
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class List extends CollectionWrapper {
    plotItems() {
      const items = this._items;
      const wrapper = this.wrapper;

      const {
        directionIsRow,
        main,
        mainDim,
        mainMarginTo,
        mainMarginFrom,
        cross,
        crossDim
      } = this._getPlotProperties(this._direction);

      let crossPos = 0,
          crossSize = 0,
          position = 0;
      const animateItems = [];
      const viewboundMain = directionIsRow ? 1920 : 1080;
      const viewboundCross = directionIsRow ? 1080 : 1920;
      const renderContext = this.core.renderContext;
      const newChildren = items.map((item, index) => {
        const sizes = this._getItemSizes(item);

        position += sizes[mainMarginFrom] || sizes.margin || 0;

        if (crossSize < sizes[crossDim]) {
          crossSize = sizes[crossDim];
        }

        const ref = "IW-".concat(item.assignedID);
        let mainPos = position;
        crossPos = item[cross] || crossPos;
        let tmp = mainPos;
        let tcp = crossPos;
        const existingItemWrapper = wrapper.tag(ref);

        if (existingItemWrapper && (existingItemWrapper.active && (crossPos !== existingItemWrapper[cross] || mainPos !== existingItemWrapper[main]) || !existingItemWrapper.active && (renderContext["p".concat(main)] + wrapper[main] + mainPos <= viewboundMain || renderContext["p".concat(cross)] + wrapper[cross] + crossPos <= viewboundCross))) {
          tmp = existingItemWrapper[main];
          tcp = existingItemWrapper[cross];
          animateItems.push(index);
        }

        position += sizes[mainDim] + (sizes[mainMarginTo] || sizes.margin || this._spacing);
        return {
          ref,
          type: ItemWrapper,
          componentIndex: index,
          forceLoad: this._forceLoad,
          ...sizes,
          ["assigned".concat(main.toUpperCase())]: mainPos,
          ["assigned".concat(cross.toUpperCase())]: crossPos,
          [main]: tmp,
          [cross]: tcp
        };
      });
      wrapper.children = newChildren;
      animateItems.forEach(index => {
        const item = wrapper.children[index];
        item.patch({
          smooth: {
            x: item.assignedX,
            y: item.assignedY
          }
        });
      });

      this._resizeWrapper(crossSize);
    }

    repositionItems() {
      const wrapper = this.wrapper;

      if (!wrapper && wrapper.children.length) {
        return true;
      }

      const {
        main,
        mainDim,
        mainMarginTo,
        mainMarginFrom,
        cross,
        crossDim
      } = this._getPlotProperties(this._direction);

      let crossPos = 0,
          crossSize = 0,
          position = 0;
      wrapper.children.forEach(item => {
        const sizes = this._getItemSizes(item.component);

        position += sizes[mainMarginFrom] || sizes.margin || 0;
        crossPos = item[cross] || crossPos;

        if (crossSize < sizes[crossDim]) {
          crossSize = sizes[crossDim];
        }

        const mainPos = position;
        position += sizes[mainDim] + (sizes[mainMarginTo] || sizes.margin || this.spacing);
        item.patch({
          ["assigned".concat(main.toUpperCase())]: mainPos,
          ["assigned".concat(cross.toUpperCase())]: 0,
          [main]: mainPos,
          [cross]: crossPos,
          ...sizes
        });
      });

      this._resizeWrapper(crossSize);

      super.repositionItems();
    }

  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  class ScrollingLabel extends lng.Component {
    static _template() {
      return {
        LabelClipper: {
          w: w => w,
          rtt: true,
          shader: {
            type: lng.shaders.FadeOut
          },
          LabelWrapper: {
            Label: {
              renderOffscreen: true
            },
            LabelCopy: {
              renderOffscreen: true
            }
          }
        }
      };
    }

    _construct() {
      this._autoStart = true;
      this._scrollAnimation = false;
      this._fade = 30;
      this._spacing = 30;
      this._label = {};
      this._align = 'left';
      this._animationSettings = {
        delay: 0.7,
        repeat: -1,
        stopMethod: 'immediate'
      };
    }

    _init() {
      const label = this.tag('Label');
      label.on('txLoaded', () => {
        this._update(label);

        this._updateAnimation(label);

        if (this._autoStart) {
          this.start();
        }
      });
    }

    _update() {
      let label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.tag('Label');
      const renderWidth = label.renderWidth;
      const noScroll = renderWidth <= this.w;
      let labelPos = 0;

      if (noScroll && this._align !== 'left') {
        labelPos = (this.w - renderWidth) * ScrollingLabel.ALIGN[this._align];
      }

      this.tag('LabelClipper').patch({
        h: label.renderHeight,
        shader: {
          right: noScroll ? 0 : this._fade
        },
        LabelWrapper: {
          x: 0,
          Label: {
            x: labelPos
          },
          LabelCopy: {
            x: renderWidth + this._spacing
          }
        }
      });
    }

    _updateAnimation() {
      let label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.tag('Label');

      if (this._scrollAnimation) {
        this._scrollAnimation.stopNow();
      }

      if (label.renderWidth > this.w) {
        if (!this._animationSettings.duration) {
          this._animationSettings.duration = label.renderWidth / 50;
        }

        this._scrollAnimation = this.animation({ ...this._animationSettings,
          actions: [{
            t: 'LabelWrapper',
            p: 'x',
            v: {
              sm: 0,
              0: 0,
              1.0: -(label.renderWidth + this._spacing)
            }
          }, {
            t: 'LabelClipper',
            p: 'shader.left',
            v: {
              0: 0,
              0.2: this._fade,
              0.8: this._fade,
              1.0: 0
            }
          }]
        });
      }
    }

    start() {
      if (this._scrollAnimation) {
        this._scrollAnimation.stopNow();

        this.tag('LabelCopy').patch({
          text: this._label
        });

        this._scrollAnimation.start();
      }
    }

    stop() {
      if (this._scrollAnimation) {
        this._scrollAnimation.stopNow();

        this.tag('LabelCopy').text = '';
      }
    }

    set label(obj) {
      if (typeof obj === 'string') {
        obj = {
          text: obj
        };
      }

      this._label = { ...this._label,
        ...obj
      };
      this.tag('Label').patch({
        text: obj
      });
    }

    get label() {
      return this.tag('Label');
    }

    set align(pos) {
      this._align = pos;
    }

    get align() {
      return this._align;
    }

    set autoStart(bool) {
      this._autoStart = bool;
    }

    get autoStart() {
      return this._autoStart;
    }

    set repeat(num) {
      this.animationSettings = {
        repeat: num
      };
    }

    get repeat() {
      return this._animationSettings.repeat;
    }

    set delay(num) {
      this.animationSettings = {
        delay: num
      };
    }

    get delay() {
      return this._animationSettings.delay;
    }

    set duration(num) {
      this.animationSettings = {
        duration: num
      };
    }

    get duration() {
      return this._animationSettings.duration;
    }

    set animationSettings(obj) {
      this._animationSettings = { ...this._animationSettings,
        ...obj
      };

      if (this._scrollAnimation) {
        this._updateAnimation();
      }
    }

    get animationSettings() {
      return this._animationSettings;
    }

  }
  ScrollingLabel.ALIGN = {
    left: 0,
    center: 0.5,
    right: 1
  };

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

  /**
   * Class which contains data for app listings.
   */
  var appListInfo = [{
    displayName: 'USB',
    applicationType: '',
    uri: 'USB',
    url: '/images/usb/USB_Featured_Item.jpg'
  }, //the first item should be usb
  {
    displayName: 'Amazon Prime video',
    applicationType: 'Amazon',
    uri: '',
    url: '/images/apps/App_Amazon_Prime_454x255.png' //replace with online url

  }, {
    displayName: 'Youtube',
    applicationType: 'Cobalt',
    uri: 'https://www.youtube.com/tv',
    url: '/images/apps/App_YouTube_454x255.png' //replace with online url

  }, {
    displayName: 'Xumo',
    applicationType: 'HtmlApp',
    uri: 'https://x1box-app.xumo.com/index.html',
    url: '/images/apps/App_Xumo_454x255.png' //replace with online url

  }, {
    displayName: 'Netflix',
    applicationType: 'Netflix',
    uri: '',
    url: '/images/apps/App_Netflix_454x255.png' //replace with online url

  }];

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

  /**
   * Class which contains data for metro app listings.
   */
  var metroAppsInfo = [{
    displayName: "CNN",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.CNN",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.CNN.png"
  }, {
    displayName: "VimeoRelease",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.VimeoRelease",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.VimeoRelease.png"
  }, {
    displayName: "WeatherNetwork",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WeatherNetwork",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.WeatherNetwork.png"
  }, {
    displayName: "EuroNews",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Euronews",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.Euronews.png"
  }, {
    displayName: "AccuWeather",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.AccuWeather",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.AccuWeather.png"
  }, {
    displayName: "BaebleMusic",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.BaebleMusic",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.BaebleMusic.png"
  }, {
    displayName: "Aljazeera",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Aljazeera",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.Aljazeera.png"
  }, {
    displayName: "GuessThatCity",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.GuessThatCity",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.GuessThatCity.png"
  }, {
    displayName: "Radioline",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Radioline",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.Radioline.png"
  }, {
    displayName: "WallStreetJournal",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WallStreetJournal",
    url: "https://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.WallStreetJournal.png"
  }, {
    displayName: "FRacer",
    applicationType: "LightningApp",
    uri: "https://lightningjs.io/fracer/#main",
    url: "/images/metroApps/fracer-steerling.png"
  }, {
    displayName: "Aquarium",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Aquarium",
    url: "/images/metroApps/Aquarium.png"
  }, {
    displayName: "Fireplace",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Fireplace",
    url: "/images/metroApps/Fireplace.png"
  }, {
    displayName: "Deutsche Welle",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.DW",
    url: "/images/metroApps/DWelle.png"
  }, {
    displayName: "MyTuner Radio",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.appgeneration.mytuner",
    url: "/images/metroApps/Radio.png"
  }, {
    displayName: "Sudoku",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Sudoku",
    url: "/images/metroApps/Sudoku.png"
  }, {
    displayName: "Tastemade",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Tastemade",
    url: "/images/metroApps/Tastemade.png"
  }, {
    displayName: "Bloomberg",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.bloomberg.metrological.x1",
    url: "/images/metroApps/Bloomberg.png"
  }, {
    displayName: "Playworks",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.playworks.pwkids",
    url: "/images/metroApps/Playworks.png"
  }, {
    displayName: "Sunrise",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Sunrise",
    url: "/images/metroApps/Sunrise.png"
  }];

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

  /**
   * Class which contains data for metro app listings.
   */
  var metroAppsInfoOffline = [{
    displayName: "CNN",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.CNN",
    url: "/images/metroApps/Test-01.jpg"
  }, {
    displayName: "VimeoRelease",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.VimeoRelease",
    url: "/images/metroApps/Test-02.jpg"
  }, {
    displayName: "WeatherNetwork",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WeatherNetwork",
    url: "/images/metroApps/Test-03.jpg"
  }, {
    displayName: "EuroNews",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Euronews",
    url: "/images/metroApps/Test-04.jpg"
  }, {
    displayName: "AccuWeather",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.AccuWeather",
    url: "/images/metroApps/Test-05.jpg"
  }, {
    displayName: "BaebleMusic",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.BaebleMusic",
    url: "/images/metroApps/Test-06.jpg"
  }, {
    displayName: "Aljazeera",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Aljazeera",
    url: "/images/metroApps/Test-07.jpg"
  }, {
    displayName: "GuessThatCity",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.GuessThatCity",
    url: "/images/metroApps/Test-08.jpg"
  }, {
    displayName: "Radioline",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Radioline",
    url: "/images/metroApps/Test-09.jpg"
  }, {
    displayName: "WallStreetJournal",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WallStreetJournal",
    url: "/images/metroApps/Test-10.jpg"
  }, {
    displayName: "FRacer",
    applicationType: "LightningApp",
    uri: "https://lightningjs.io/fracer/#main",
    url: "/images/metroApps/fracer-steerling.png"
  }, {
    displayName: "Aquarium",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Aquarium",
    url: "/images/metroApps/Aquarium.png"
  }, {
    displayName: "Fireplace",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Fireplace",
    url: "/images/metroApps/Fireplace.png"
  }, {
    displayName: "Deutsche Welle",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.DW",
    url: "/images/metroApps/DWelle.png"
  }, {
    displayName: "MyTuner Radio",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.appgeneration.mytuner",
    url: "/images/metroApps/Radio.png"
  }, {
    displayName: "Sudoku",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Sudoku",
    url: "/images/metroApps/Sudoku.png"
  }, {
    displayName: "Tastemade",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Tastemade",
    url: "/images/metroApps/Tastemade.png"
  }, {
    displayName: "Bloomberg",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.bloomberg.metrological.x1",
    url: "/images/metroApps/Bloomberg.png"
  }, {
    displayName: "Playworks",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.playworks.pwkids",
    url: "/images/metroApps/Playworks.png"
  }, {
    displayName: "Sunrise",
    applicationType: "LightningApp",
    uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Sunrise",
    url: "/images/metroApps/Sunrise.png"
  }];

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

  /**
   * Class which contains data for tv shows listings.
   */
  var tvShowsInfo = [{
    displayName: 'Fantasy-Island',
    url: '/images/tvShows/fantasy-island.jpg'
  }, {
    displayName: 'Onward',
    url: '/images/tvShows/onward.jpg'
  }, {
    displayName: 'Let it Snow',
    url: '/images/tvShows/let-it-snow.jpg'
  }, {
    displayName: 'Do Little',
    url: '/images/tvShows/do-little.jpg'
  }, {
    displayName: 'Summerland',
    url: '/images/tvShows/summerland.jpg'
  }];

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
  /**
   * Class that returns the data required for home screen.
   */

  class HomeApi {
    getAppListInfo() {
      let appsMetaData = appListInfo;
      return appsMetaData;
    }

    getMetroInfo() {
      let metroAppsMetaData = metroAppsInfo;
      return metroAppsMetaData;
    }

    getOfflineMetroApps() {
      return metroAppsInfoOffline;
    }

    getTVShowsInfo() {
      return tvShowsInfo;
    }

  }

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
  /**
   * Class to render items in main view.
   */

  class ListItem extends lng.Component {
    /**
     * Function to render various elements in the main view item.
     */
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
      this.tag('Shadow').patch({
        color: CONFIG.theme.hex,
        rect: true,
        h: this.h + this.bar * 2,
        w: this.w,
        x: this.x,
        y: this.y - this.bar
      });

      if (this.data.url.startsWith('/images')) {
        this.tag('Image').patch({
          rtt: true,
          x: this.x,
          y: this.y,
          w: this.w,
          h: this.h,
          src: Utils.asset(this.data.url),
          scale: this.unfocus
        });
      } else {
        this.tag('Image').patch({
          rtt: true,
          x: this.x,
          y: this.y,
          w: this.w,
          h: this.h,
          src: this.data.url
        });
      }
      /* Used static data for develpment purpose ,
      it wil replaced with Dynamic data once implimetation is completed.*/


      this.tag('Info').patch({
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
              maxLines: 1,
              wordWrapWidth: this.w
            }
          }
        }
      });
    }
    /**
     * Function to change properties of item during focus.
     */


    _focus() {
      this.tag('Image').patch({
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h,
        zIndex: 1,
        scale: this.focus
      });
      this.tag('Info').alpha = 1;
      this.tag('Item').patch({
        zIndex: 2
      });
      this.tag('Shadow').patch({
        smooth: {
          scale: [this.focus, {
            timingFunction: 'ease',
            duration: 0.7
          }],
          alpha: 1
        }
      });
    }
    /**
     * Function to change properties of item during unfocus.
     */


    _unfocus() {
      this.tag('Image').patch({
        w: this.w,
        h: this.h,
        scale: this.unfocus,
        zIndex: 0
      });
      this.tag('Item').patch({
        zIndex: 0
      });
      this.tag('Info').alpha = 0;
      this.tag('Shadow').patch({
        smooth: {
          alpha: 0,
          scale: [this.unfocus, {
            timingFunction: 'ease',
            duration: 0.7
          }]
        }
      });
    }

  }

  /**
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2021 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  let ws = null;

  if (typeof WebSocket !== 'undefined') {
    ws = WebSocket;
  }

  var ws_1 = ws;
  const requestsQueue = {};
  const listeners = {};

  var requestQueueResolver = data => {
    if (typeof data === 'string') {
      let regex1 = /\\\\x([0-9A-Fa-f]{2})/g;
      let regex2 = /\\x([0-9A-Fa-f]{2})/g;
      data = data.normalize().replace(regex1, '');
      data = data.normalize().replace(regex2, '');
      data = JSON.parse(data);
    }

    if (data.id) {
      const request = requestsQueue[data.id];

      if (request) {
        if ('result' in data) request.resolve(data.result);else request.reject(data.error);
        delete requestsQueue[data.id];
      } else {
        console.log('no pending request found with id ' + data.id);
      }
    }
  };

  var notificationListener = data => {
    if (typeof data === 'string') {
      let regex1 = /\\\\x([0-9A-Fa-f]{2})/g;
      let regex2 = /\\x([0-9A-Fa-f]{2})/g;
      data = data.normalize().replace(regex1, '');
      data = data.normalize().replace(regex2, '');
      data = JSON.parse(data);
    }

    if (!data.id && data.method) {
      const callbacks = listeners[data.method];

      if (callbacks && Array.isArray(callbacks) && callbacks.length) {
        callbacks.forEach(callback => {
          callback(data.params);
        });
      }
    }
  };

  const protocol = 'ws://';
  const host = 'localhost';
  const endpoint = '/jsonrpc';
  const port = 80;

  var makeWebsocketAddress = options => {
    return [options && options.protocol || protocol, options && options.host || host, ':' + (options && options.port || port), options && options.endpoint || endpoint, options && options.token ? '?token=' + options.token : null].join('');
  };

  const sockets = {};

  var connect = options => {
    return new Promise((resolve, reject) => {
      const socketAddress = makeWebsocketAddress(options);
      let socket = sockets[socketAddress];
      if (socket && socket.readyState === 1) return resolve(socket);

      if (socket && socket.readyState === 0) {
        const waitForOpen = () => {
          socket.removeEventListener('open', waitForOpen);
          resolve(socket);
        };

        return socket.addEventListener('open', waitForOpen);
      }

      if (socket == null) {
        if (options.debug) {
          console.log('Opening socket to ' + socketAddress);
        }

        socket = new ws_1(socketAddress, options && options.subprotocols || 'notification');
        sockets[socketAddress] = socket;
        socket.addEventListener('message', message => {
          if (options.debug) {
            console.log(' ');
            console.log('API REPONSE:');
            console.log(JSON.stringify(message.data, null, 2));
            console.log(' ');
          }

          requestQueueResolver(message.data);
        });
        socket.addEventListener('message', message => {
          notificationListener(message.data);
        });
        socket.addEventListener('error', () => {
          notificationListener({
            method: 'client.ThunderJS.events.error'
          });
          sockets[socketAddress] = null;
        });

        const handleConnectClosure = event => {
          sockets[socketAddress] = null;
          reject(event);
        };

        socket.addEventListener('close', handleConnectClosure);
        socket.addEventListener('open', () => {
          notificationListener({
            method: 'client.ThunderJS.events.connect'
          });
          socket.removeEventListener('close', handleConnectClosure);
          socket.addEventListener('close', () => {
            notificationListener({
              method: 'client.ThunderJS.events.disconnect'
            });
            sockets[socketAddress] = null;
          });
          resolve(socket);
        });
      } else {
        sockets[socketAddress] = null;
        reject('Socket error');
      }
    });
  };

  var makeBody = (requestId, plugin, method, params, version) => {
    if (params) {
      delete params.version;

      if (params.versionAsParameter) {
        params.version = params.versionAsParameter;
        delete params.versionAsParameter;
      }
    }

    const body = {
      jsonrpc: '2.0',
      id: requestId,
      method: [plugin, version, method].join('.')
    };
    params || params === false ? typeof params === 'object' && Object.keys(params).length === 0 ? null : body.params = params : null;
    return body;
  };

  var getVersion = (versionsConfig, plugin, params) => {
    const defaultVersion = 1;
    let version;

    if (version = params && params.version) {
      return version;
    }

    return versionsConfig ? versionsConfig[plugin] || versionsConfig.default || defaultVersion : defaultVersion;
  };

  let id = 0;

  var makeId = () => {
    id = id + 1;
    return id;
  };

  var execRequest = (options, body) => {
    return connect(options).then(connection => {
      connection.send(JSON.stringify(body));
    });
  };

  var API = options => {
    return {
      request(plugin, method, params) {
        return new Promise((resolve, reject) => {
          const requestId = makeId();
          const version = getVersion(options.versions, plugin, params);
          const body = makeBody(requestId, plugin, method, params, version);

          if (options.debug) {
            console.log(' ');
            console.log('API REQUEST:');
            console.log(JSON.stringify(body, null, 2));
            console.log(' ');
          }

          requestsQueue[requestId] = {
            body,
            resolve,
            reject
          };
          execRequest(options, body).catch(e => {
            reject(e);
          });
        });
      }

    };
  };

  var DeviceInfo = {
    freeRam(params) {
      return this.call('systeminfo', params).then(res => {
        return res.freeram;
      });
    },

    version(params) {
      return this.call('systeminfo', params).then(res => {
        return res.version;
      });
    }

  };
  var plugins = {
    DeviceInfo
  };

  function listener(plugin, event, callback, errorCallback) {
    const thunder = this;
    const index = register.call(this, plugin, event, callback, errorCallback);
    return {
      dispose() {
        const listener_id = makeListenerId(plugin, event);
        if (listeners[listener_id] === undefined) return;
        listeners[listener_id].splice(index, 1);

        if (listeners[listener_id].length === 0) {
          unregister.call(thunder, plugin, event, errorCallback);
        }
      }

    };
  }

  const makeListenerId = (plugin, event) => {
    return ['client', plugin, 'events', event].join('.');
  };

  const register = function (plugin, event, callback, errorCallback) {
    const listener_id = makeListenerId(plugin, event);

    if (!listeners[listener_id]) {
      listeners[listener_id] = [];

      if (plugin !== 'ThunderJS') {
        const method = 'register';
        const request_id = listener_id.split('.').slice(0, -1).join('.');
        const params = {
          event,
          id: request_id
        };
        this.api.request(plugin, method, params).catch(e => {
          if (typeof errorCallback === 'function') errorCallback(e.message);
        });
      }
    }

    listeners[listener_id].push(callback);
    return listeners[listener_id].length - 1;
  };

  const unregister = function (plugin, event, errorCallback) {
    const listener_id = makeListenerId(plugin, event);
    delete listeners[listener_id];

    if (plugin !== 'ThunderJS') {
      const method = 'unregister';
      const request_id = listener_id.split('.').slice(0, -1).join('.');
      const params = {
        event,
        id: request_id
      };
      this.api.request(plugin, method, params).catch(e => {
        if (typeof errorCallback === 'function') errorCallback(e.message);
      });
    }
  };

  var thunderJS = options => {
    if (options.token === undefined && typeof window !== 'undefined' && window.thunder && typeof window.thunder.token === 'function') {
      options.token = window.thunder.token();
    }

    return wrapper({ ...thunder$2(options),
      ...plugins
    });
  };

  const resolve = (result, args) => {
    if (typeof result !== 'object' || typeof result === 'object' && (!result.then || typeof result.then !== 'function')) {
      result = new Promise((resolve, reject) => {
        result instanceof Error === false ? resolve(result) : reject(result);
      });
    }

    const cb = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null;

    if (cb) {
      result.then(res => cb(null, res)).catch(err => cb(err));
    } else {
      return result;
    }
  };

  const thunder$2 = options => ({
    options,
    api: API(options),
    plugin: false,

    call() {
      const args = [...arguments];

      if (this.plugin) {
        if (args[0] !== this.plugin) {
          args.unshift(this.plugin);
        }
      }

      const plugin = args[0];
      const method = args[1];

      if (typeof this[plugin][method] == 'function') {
        return this[plugin][method](args[2]);
      }

      return this.api.request.apply(this, args);
    },

    registerPlugin(name, plugin) {
      this[name] = wrapper(Object.assign(Object.create(thunder$2), plugin, {
        plugin: name
      }));
    },

    subscribe() {},

    on() {
      const args = [...arguments];

      if (['connect', 'disconnect', 'error'].indexOf(args[0]) !== -1) {
        args.unshift('ThunderJS');
      } else {
        if (this.plugin) {
          if (args[0] !== this.plugin) {
            args.unshift(this.plugin);
          }
        }
      }

      return listener.apply(this, args);
    },

    once() {
      console.log('todo ...');
    }

  });

  const wrapper = obj => {
    return new Proxy(obj, {
      get(target, propKey) {
        const prop = target[propKey];

        if (propKey === 'api') {
          return target.api;
        }

        if (typeof prop !== 'undefined') {
          if (typeof prop === 'function') {
            if (['on', 'once', 'subscribe'].indexOf(propKey) > -1) {
              return function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                return prop.apply(this, args);
              };
            }

            return function () {
              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              return resolve(prop.apply(this, args), args);
            };
          }

          if (typeof prop === 'object') {
            return wrapper(Object.assign(Object.create(thunder$2(target.options)), prop, {
              plugin: propKey
            }));
          }

          return prop;
        } else {
          if (target.plugin === false) {
            return wrapper(Object.assign(Object.create(thunder$2(target.options)), {}, {
              plugin: propKey
            }));
          }

          return function () {
            for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              args[_key3] = arguments[_key3];
            }

            args.unshift(propKey);
            return target.call.apply(this, args);
          };
        }
      }

    });
  };

  const config$1 = {
    host: '127.0.0.1',
    port: 9998,
    default: 1,
    versions: {
      'org.rdk.System': 2
    }
  };
  const thunder$1 = thunderJS(config$1);

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
  /**
   * Class that contains functions which commuicates with thunder API's
   */

  class AppApi {
    constructor() {
      this.activatedForeground = false;
      this._events = new Map();
    }
    /**
     *
     * @param {string} eventId
     * @param {function} callback
     * Function to register the events for the Bluetooth plugin.
     */


    registerEvent(eventId, callback) {
      this._events.set(eventId, callback);
    }

    getPluginStatus(plugin) {
      return new Promise((resolve, reject) => {
        Log.info("g plugin status");
        thunder$1.call('Controller', "status@".concat(plugin)).then(result => {
          Log.info("result = ", result);
          resolve(result);
        }).catch(err => {
          Log.error(err);
          reject(err);
        });
      });
    }
    /**
     * Function to launch Netflix/Amazon Prime app.
     */


    launchApp(childCallsign, url) {
      let params = {};

      if (url !== undefined && childCallsign !== "Cobalt") {
        //for cobalt url is passed through deep link method instead of launch
        params = {
          "callsign": childCallsign,
          "type": childCallsign,
          "uri": url
        };
      } else {
        params = {
          "callsign": childCallsign,
          "type": childCallsign
        };
      }

      return new Promise((resolve, reject) => {
        thunder$1.call('org.rdk.RDKShell', 'launch', params).then(res => {
          Log.info(res); //redundant calls for moveToFront and setFocus, as some apps needs it when launched from suspended state

          if (res.success) {
            thunder$1.call("org.rdk.RDKShell", "setFocus", {
              "client": childCallsign,
              "callsign": childCallsign
            }).then(res => {
              if (res.success) {
                thunder$1.call('org.rdk.RDKShell', 'setVisibility', {
                  client: 'ResidentApp',
                  visible: false
                });
                thunder$1.call("org.rdk.RDKShell", "moveToFront", {
                  "client": childCallsign,
                  "callsign": childCallsign
                }).catch(err => {
                  console.error("failed to move moveToFront to: ", childCallsign, " ERROR: ", JSON.stringify(err));
                });
              }
            }).catch(err => {
              console.error("failed to move setFocus to: ", childCallsign, " ERROR: ", JSON.stringify(err));
            });

            if (childCallsign === "Cobalt" && url) {
              //passing url to cobalt once launched
              thunder$1.call(childCallsign, 'deeplink', url);
            }

            resolve(true); //launch success no need to worry about setFocus and moveToFront
          } else {
            console.error("failed to launch app: ", childCallsign, "(success false) ERROR: ", JSON.stringify(res));
            reject(false);
          }
        }).catch(err => {
          console.error("failed to launch app: ", childCallsign, " ERROR: ", JSON.stringify(err));
          reject(err);
        });
      });
    }

    suspendOrDestroyApp(childCallsign, mode) {
      return new Promise((resolve, reject) => {
        thunder$1.call('org.rdk.RDKShell', mode, {
          "callsign": childCallsign
        }).then(res => {
          Log.info(res); //redundant calls for moveToFront and setFocus, as some apps needs it when launched from suspended state

          if (res.success) {
            thunder$1.call("org.rdk.RDKShell", "setFocus", {
              "client": 'ResidentApp',
              "callsign": 'ResidentApp'
            }).then(res => {
              if (res.success) {
                thunder$1.call('org.rdk.RDKShell', 'setVisibility', {
                  client: 'ResidentApp',
                  visible: true
                });
                thunder$1.call("org.rdk.RDKShell", "moveToFront", {
                  "client": 'ResidentApp',
                  "callsign": 'ResidentApp'
                }).catch(err => {
                  console.error("failed to move moveToFront to: ", 'ResidentApp', " ERROR: ", JSON.stringify(err));
                });
              }
            }).catch(err => {
              console.error("failed to move setFocus to: ", 'ResidentApp', " ERROR: ", JSON.stringify(err));
            });
            resolve(true); //launch success no need to worry about setFocus and moveToFront
          } else {
            console.error("failed to exit app: ", childCallsign, "(success false) ERROR: ", JSON.stringify(res));
            reject(false);
          }
        }).catch(err => {
          console.error("failed to exit app: ", childCallsign, " ERROR: ", JSON.stringify(err));
          reject(err);
        });
      });
    }
    /**
     * Function to set visibility to client apps.
     * @param {client} clients client app.
     * @param {visible} visible value of visibility.
     */


    setVisibilityandFocus(client, visible) {
      return new Promise((resolve, reject) => {
        thunder$1.call('org.rdk.RDKShell', 'setVisibility', {
          client: client,
          visible: visible
        });
        thunder$1.call('org.rdk.RDKShell', 'setFocus', {
          client: client
        }).then(res => {
          resolve(true);
        }).catch(err => {
          Log.error('Set focus error', JSON.stringify(err));
          reject(false);
        });
      });
    }

    changeVisibility(client, visible) {
      return new Promise((resolve, reject) => {
        thunder$1.call('org.rdk.RDKShell', 'setVisibility', {
          client: client,
          visible: visible
        });
      });
    }

    moveToFront(cli) {
      thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
        client: cli,
        callsign: cli
      });
    }

    setFocus(cli) {
      thunder$1.call('org.rdk.RDKShell', 'setFocus', {
        client: cli
      });
    }

    standby(value) {
      return new Promise((resolve, reject) => {
        thunder$1.call('org.rdk.System', 'setPowerState', {
          "powerState": value,
          "standbyReason": "Requested by user"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          resolve(false);
        });
      });
    }

  }

  class MainView extends lng.Component {
    static _template() {
      return {
        rect: true,
        color: CONFIG.theme.background,
        w: 1920,
        h: 1080,
        clipping: true,
        MainView: {
          w: 1720,
          h: 1200,
          zIndex: 2,
          y: 270,
          x: 200,
          clipping: false,
          Text1: {
            h: 30,
            text: {
              //   fontFace: CONFIG.language.font,
              fontSize: 25,
              text: 'Featured Content',
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF
            },
            zIndex: 0
          },
          AppList: {
            y: 37,
            x: 0,
            type: List,
            h: 400,
            scroll: {
              after: 2
            },
            spacing: 20
          },
          Text2: {
            // x: 10 + 25,
            y: 395,
            h: 30,
            text: {
              //   fontFace: CONFIG.language.font,
              fontSize: 25,
              text: 'Lightning Apps',
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF
            }
          },
          MetroApps: {
            x: -20,
            y: 435,
            type: List,
            // flex: { direction: 'row', paddingLeft: 20, wrap: false },
            // w: 1745,
            h: 300,
            scroll: {
              after: 6
            },
            spacing: 20 // itemSize: 288,
            // roll: true,
            // rollMax: 1745,
            // horizontal: true,
            // itemScrollOffset: -4,
            // clipping: false,

          },
          Text3: {
            // x: 10 + 25,
            y: 695,
            h: 30,
            text: {
              //   fontFace: CONFIG.language.font,
              fontSize: 25,
              text: 'Featured Video on Demand',
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF
            }
          },
          TVShows: {
            x: -20,
            y: 735,
            type: List,
            h: 300,
            scroll: {
              after: 12
            },
            spacing: 20
          }
        }
      };
    }

    _firstActive() {
      this.flag = true;
      let self = this;
      var appItems;

      self.appApi = new AppApi();
      self.homeApi = new HomeApi(); // the above snippet takes about 1-1.5 milliseconds

      appItems = self.homeApi.getAppListInfo();
      self.metroApps = self.homeApi.getOfflineMetroApps(); // this snippet takes about 200-220 milliseconds

      self.tvShowItems = self.homeApi.getTVShowsInfo();
      appItems.shift();
      self.appItems = appItems;

      self._setState("AppList.0"); // the above snippet takes about 1-1.5 milliseconds
      // this snippet takes about 200-220 milliseconds
      // this snippet takes about 20 milli seconds
      // self.tvShowItems = self.homeApi.getTVShowsInfo();
      // });
      // the below timeout should run as the last timeout in this first active function


      setTimeout(function () {
        self.fireAncestors("$setEventListeners");
      }, 0);
    }

    set appItems(items) {
      this.currentItems = items;
      let appList = this.tag('AppList'); // appList.clear();

      let index = 0;
      let lastIndex = items.length;

      function addItem() {
        if (index < lastIndex) {
          appList.add({
            w: 454,
            h: 255,
            type: ListItem,
            data: items[index],
            focus: 1.11,
            unfocus: 1,
            idx: index,
            bar: 12
          });
          index++;
          requestAnimationFrame(addItem);
        } else {
          return;
        }
      }

      requestAnimationFrame(addItem);
    }

    set metroApps(items) {
      let metroApps = this.tag('MetroApps');
      let lastIndex = items.length;
      let index = 0;

      function addItem() {
        if (index < lastIndex) {
          metroApps.add({
            w: 268,
            h: 151,
            type: ListItem,
            data: items[index],
            focus: 1.15,
            unfocus: 1,
            idx: index,
            bar: 12
          });
          index++;
          requestAnimationFrame(addItem);
        } else {
          return;
        }
      }

      requestAnimationFrame(addItem);
    }

    set tvShowItems(items) {
      let tvShowList = this.tag('TVShows');
      let index = 0;
      let lastIndex = items.length;

      function addItem() {
        if (index < lastIndex) {
          tvShowList.add({
            w: 268,
            h: 151,
            type: ListItem,
            data: items[index],
            focus: 1.11,
            unfocus: 1,
            idx: index,
            bar: 12
          });
          index++;
          requestAnimationFrame(addItem);
        } else {
          return;
        }
      }

      requestAnimationFrame(addItem);
    }

    scroll(val) {
      this.tag("MainView").y = val;
    }

    static _states() {
      return [class AppList extends this {
        $enter() {
          this.indexVal = 0;
        }

        $exit() {
          this.tag('Text1').text.fontStyle = 'normal';
        }

        _getFocused() {
          this.tag('Text1').text.fontStyle = 'bold';

          if (this.tag('AppList').length) {
            return this.tag('AppList');
          }
        }

        _handleDown() {
          this._setState('MetroApps');
        }

        _handleEnter() {
          let applicationType = this.tag('AppList').items[this.tag('AppList').index].data.applicationType;
          this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri;
          Storage.set('applicationType', applicationType);
          this.appApi.launchApp(applicationType, this.uri);
        }

      }, class MetroApps extends this {
        $enter() {
          this.indexVal = 1;
        }

        $exit() {
          this.tag('Text2').text.fontStyle = 'normal';
        }

        _getFocused() {
          this.tag('Text2').text.fontStyle = 'bold';

          if (this.tag('MetroApps').length) {
            return this.tag('MetroApps');
          }
        }

        _handleUp() {
          this._setState('AppList');
        }

        _handleDown() {
          this._setState('TVShows');
        }

        _handleRight() {
          if (this.tag('MetroApps').length - 1 != this.tag('MetroApps').index) {
            this.tag('MetroApps').setNext();
            return this.tag('MetroApps').element;
          }
        }

        _handleLeft() {
          this.tag('Text2').text.fontStyle = 'normal';

          if (0 != this.tag('MetroApps').index) {
            this.tag('MetroApps').setPrevious();
            return this.tag('MetroApps').element;
          } // } else {
          //   Router.focusWidget('Menu')
          // }

        }

        _handleEnter() {
          let applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
          this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;
          applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;
          this.appApi.launchApp(applicationType, this.uri);
          /* else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
                   this.appApi.launchNative(this.uri);
                   this.appApi.setVisibility('ResidentApp', false);
                 } */
        }

      }, class TVShows extends this {
        $enter() {
          this.indexVal = 2;
          this.scroll(-70);
        }

        _handleUp() {
          this.scroll(270);

          this._setState('MetroApps');
        }

        _getFocused() {
          this.tag('Text3').text.fontStyle = 'bold';
          return this.tag('TVShows');
        }

        _handleRight() {
          if (this.tag('TVShows').length - 1 != this.tag('TVShows').index) {
            this.tag('TVShows').setNext();
            return this.tag('TVShows').element;
          }
        }

        _handleLeft() {
          this.tag('Text3').text.fontStyle = 'normal';

          if (0 != this.tag('TVShows').index) {
            this.tag('TVShows').setPrevious();
            return this.tag('TVShows').element;
          } //  else {a
          //   Router.focusWidget('Menu')
          // }

        }

        _handleEnter() {
          if (Storage.get('ipAddress')) {
            //this.fireAncestors('$goToPlayer')
            Router.navigate('player');
          }
        }

        $exit() {
          this.tag('Text3').text.fontStyle = 'normal';
        }

      }];
    }

  }

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
  /**
   * Variable to store the timer
   */

  var timeout;
  /**
   * Class to render the UI controls for the video player.
   */

  class LightningPlayerControls extends lng.Component {
    /**
     * Function to create components for the player controls.
     */
    static _template() {
      return {
        TimeBar: {
          x: 90,
          y: 93.5,
          texture: lng.Tools.getRoundRect(1740, 20, 10, 0, 0, true, 0xffffffff)
        },
        ProgressWrapper: {
          x: 90,
          y: 93.5,
          w: 0,
          h: 35,
          clipping: true,
          ProgressBar: {
            texture: lng.Tools.getRoundRect(1740, 20, 10, 0, 0, true, CONFIG.theme.hex) // x: 90,
            // y: 93.5,

          }
        },
        Duration: {
          x: 1690,
          y: 125,
          text: {
            text: "00:00:00",
            fontFace: CONFIG.language.font,
            fontSize: 35,
            textColor: 0xffFFFFFF
          }
        },
        CurrentTime: {
          x: 140,
          // 140 = 90 + 50 | 50 is approzimately 1/2 of length(in px) of the text "00:00:00" and 90 is padding from left
          y: 60,
          mountX: 0.5,
          text: {
            text: "00:00:00",
            fontFace: CONFIG.language.font,
            fontSize: 25,
            textColor: 0xffFFFFFF
          }
        },
        Buttons: {
          x: 820,
          y: 125,
          children: [{
            src: Utils.asset('images/Media Player/Icon_Back_White_16k.png'),
            x: 17,
            y: 17
          }, {
            src: Utils.asset('images/Media Player/Icon_Pause_White_16k.png'),
            x: 17,
            y: 17
          }, {
            src: Utils.asset('images/Media Player/Icon_Next_White_16k.png'),
            x: 17,
            y: 17
          }].map((item, idx) => ({
            x: idx * 75,
            // texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            ControlIcon: {
              x: item.x,
              y: item.y,
              texture: lng.Tools.getSvgTexture(item.src, 50, 50)
            }
          }))
        }
      };
    }

    _init() {
      /**
       * Variable to store the duration of the video content.
       */
      this.videoDuration = 0;
      this.tag('Buttons').children[0].patch({
        alpha: 1
      });
      this.tag('Buttons').children[2].patch({
        alpha: 1
      });
      this.toggle = false;
    }
    /**
     * Function to set focus to player controls when the player controls are shown.
     */


    _focus() {
      this._index = 1;

      this._setState('PlayPause');
    }
    /**
     * Function to handle the player controls when they are hidden.
     */


    _unfocus() {
      this._setState('Hidden');

      clearTimeout(timeout);
    }
    /**
     * Function to set the duration of the video.
     * @param {String} duration video duration to be set.
     */


    set duration(duration) {
      Log.info("duration was set = ".concat(duration));
      this.videoDuration = duration;
      this.tag('Duration').text.text = this.SecondsTohhmmss(duration);
    }
    /**
     * Function to set the current video time.
     * @param {String} currentTime current time to be set.
     */


    set currentTime(currentTime) {
      let value = 1740 * currentTime / this.videoDuration;
      this.tag('ProgressWrapper').patch({
        w: value
      });
      this.tag('CurrentTime').text.text = this.SecondsTohhmmss(currentTime);

      if (value >= 50 && value <= 1690) {
        // 1740 - 50 = 1690
        this.tag('CurrentTime').x = 90 + value; //90 is padding from left
      } else if (currentTime === 0) {
        this.tag('CurrentTime').x = 140; //initial position 140 = 90 + 50
      }
    }
    /**
     * Function to convert time in seconds to hh:mm:ss format.
     * @param {String} totalSeconds time in seconds.
     */


    SecondsTohhmmss(totalSeconds) {
      this.hours = Math.floor(totalSeconds / 3600);
      this.minutes = Math.floor((totalSeconds - this.hours * 3600) / 60);
      this.seconds = totalSeconds - this.hours * 3600 - this.minutes * 60;
      this.seconds = Math.round(totalSeconds) - this.hours * 3600 - this.minutes * 60;
      this.result = this.hours < 10 ? '0' + this.hours : this.hours;
      this.result += ':' + (this.minutes < 10 ? '0' + this.minutes : this.minutes);
      this.result += ':' + (this.seconds < 10 ? '0' + this.seconds : this.seconds);
      return this.result;
    }
    /**
     * Function to hide player controls.
     */


    hideLightningPlayerControls() {
      this.signal('hide');
    }

    hideNextPrevious() {
      this.isChannel = true;
      this.tag('Buttons').children[0].visible = false;
      this.tag('Buttons').children[2].visible = false;
    }

    showNextPrevious() {
      this.isChannel = false;
      this.tag('Buttons').children[0].visible = true;
      this.tag('Buttons').children[2].visible = true;
    }
    /**
     * Timer function to track the inactivity of the player controls.
     */


    timer() {
      clearTimeout(timeout);
      timeout = setTimeout(this.hideLightningPlayerControls.bind(this), 5000);
    }
    /**
     * Function that defines the different states of the player controls.
     */


    static _states() {
      return [class PlayPause extends this {
        $enter() {
          this.focus = this.toggle ? Utils.asset('images/Media Player/Icon_Play_Orange_16k.png') : Utils.asset('images/Media Player/Icon_Pause_Orange_16k.png');
          this.timer();
          this.tag('Buttons').children[1].tag('ControlIcon').patch({
            texture: lng.Tools.getSvgTexture(this.focus, 50, 50)
          });
        }

        $exit() {
          this.unfocus = this.toggle ? Utils.asset('images/Media Player/Icon_Play_White_16k.png') : Utils.asset('images/Media Player/Icon_Pause_White_16k.png');
          this.tag('Buttons').children[1].tag('ControlIcon').patch({
            texture: lng.Tools.getSvgTexture(this.unfocus, 50, 50)
          });
        }

        _handleEnter() {
          if (this.toggle) {
            //this.fireAncestors('$play');
            this.signal('play');
          } else {
            //this.fireAncestors('$pause');
            this.signal('pause');
          }

          this.toggle = !this.toggle;
          this.focus = this.toggle ? Utils.asset('images/Media Player/Icon_Play_Orange_16k.png') : Utils.asset('images/Media Player/Icon_Pause_Orange_16k.png');
          this.timer();
          this.tag('Buttons').children[1].tag('ControlIcon').patch({
            texture: lng.Tools.getSvgTexture(this.focus, 50, 50)
          });
        }

        _handleRight() {
          if (!this.isChannel) {
            this._setState('Forward');
          }
        }

        _handleLeft() {
          if (!this.isChannel) {
            this._setState('Rewind');
          }
        }

        _getFocused() {
          this.timer();
        }

      }, class Forward extends this {
        $enter() {
          this.timer();
          this.tag('Buttons').children[2].tag('ControlIcon').patch({
            texture: lng.Tools.getSvgTexture(Utils.asset('images/Media Player/Icon_Next_Orange_16k.png'), 50, 50)
          });
        }

        $exit() {
          this.tag('Buttons').children[2].tag('ControlIcon').patch({
            texture: lng.Tools.getSvgTexture(Utils.asset('images/Media Player/Icon_Next_White_16k.png'), 50, 50)
          });
        }

        _handleRight() {// this._setState('Extras')
        }

        _handleLeft() {
          this._setState('PlayPause');
        }

        _handleEnter() {
          this.toggle = false;
          this.signal('nextTrack');
        }

        _getFocused() {
          this.timer();
        }

      }, class Rewind extends this {
        $enter() {
          this.timer();
          this.tag('Buttons').children[0].tag('ControlIcon').patch({
            texture: lng.Tools.getSvgTexture(Utils.asset('images/Media Player/Icon_Back_Orange_16k.png'), 50, 50)
          });
        }

        $exit() {
          this.tag('Buttons').children[0].tag('ControlIcon').patch({
            texture: lng.Tools.getSvgTexture(Utils.asset('images/Media Player/Icon_Back_White_16k.png'), 50, 50)
          });
        }

        _handleLeft() {// this._setState('AudioOptions')
        }

        _handleRight() {
          this._setState('PlayPause');
        }

        _handleEnter() {
          this.toggle = false;
          this.signal('prevTrack');
        }

        _getFocused() {
          this.timer();
        }

      }, class Hidden extends this {
        _getFocused() {}

      }];
    }

  }

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

  /**
   * Class to render AAMP video player.
   */

  class AAMPVideoPlayer extends lng.Component {
    /**
     * Function to render player controls.
     */
    set params(args) {
      this.currentIndex = args.currentIndex;
      this.data = args.list;

      if (args.isUSB) {
        this.isUSB = args.isUSB;
      } else if (args.isChannel) {
        this.isChannel = args.isChannel;
        this.channelName = args.channelName;
        this.showName = args.showName;
        this.showDescription = args.description;
        this.channelIndex = args.channelIndex;
      }

      let url = args.url ? args.url : 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';

      if (args.isAudio) {
        this.tag('Image').alpha = 1;
      }

      try {
        this.load({
          title: 'Parkour event',
          url: url,
          drmConfig: null
        });
        this.setVideoRect(0, 0, 1920, 1080);
      } catch (error) {
        Log.error('Playback Failed ' + error);
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
            type: lng.textures.ImageTexture,
            src: 'static/images/Media Player/Audio_Background_16k.jpg',
            resizeMode: {
              type: 'contain',
              w: 1920,
              h: 1080
            }
          }
        },
        InfoOverlay: {
          x: 90,
          y: 820,
          alpha: 0,
          zIndex: 3,
          ShowName: {
            text: {
              text: "Show Name",
              fontFace: CONFIG.language.font,
              fontSize: 48,
              fontStyle: 'bold',
              textColor: 0xffFFFFFF,
              wordWrap: true,
              wordWrapWidth: 1350,
              maxLines: 1
            }
          } //  ChannelName: {
          //    y: 50,
          //    visible: false,
          //    text: {
          //      text: "Channel Name",
          //      fontFace: CONFIG.language.font,
          //      fontSize: 35,
          //      textColor: 0xffFFFFFF,
          //      wordWrap: true, wordWrapWidth: 1350, maxLines: 1,
          //    }
          //  }

        },
        PlayerControlsWrapper: {
          alpha: 0,
          h: 330,
          w: 1920,
          y: 750,
          rect: true,
          colorBottom: 0xFF000000,
          colorTop: 0x00000000,
          PlayerControls: {
            y: 70,
            type: LightningPlayerControls,
            signals: {
              pause: 'pause',
              play: 'play',
              hide: 'hidePlayerControls',
              fastfwd: 'fastfwd',
              fastrwd: 'fastrwd',
              nextTrack: 'nextTrack',
              prevTrack: 'prevTrack'
            }
          }
        },
        ChannelWrapper: {
          h: 1080,
          w: 350,
          x: -360,
          rect: true,
          colorLeft: 0xFF000000,
          colorRight: 0x00000000 //  ChannelOverlay: {
          //    type: ChannelOverlay,
          //    x: 50,
          //    y: 92,
          //  }

        }
      };
    }

    _init() {
      this.x = 0;
      this.y = 0;
      this.w = 0;
      this.h = 0;
      this.videoEl = document.createElement('video');
      this.videoEl.setAttribute('id', 'video-player');
      this.videoEl.style.position = 'absolute';
      this.videoEl.style.zIndex = '1';
      this.videoEl.setAttribute('width', '100%');
      this.videoEl.setAttribute('height', '100%');
      this.videoEl.setAttribute('type', 'video/ave');
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
        initialBitrate: 2500000,
        offset: 0,
        networkTimeout: 10,
        preferredAudioLanguage: 'en',
        liveOffset: 15,
        drmConfig: null
      };
    }
    /**
     * Function to set video coordinates.
     * @param {int} x x position of video
     * @param {int} y y position of video
     * @param {int} w width of video
     * @param {int} h height of video
     */


    setVideoRect(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
    /**
     * Event handler to store the current playback state.
     * @param  event playback state of the video.
     */


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
      }
    }
    /**
     * Event handler to handle the event of completion of a video playback.
     */


    _mediaEndReached() {
      this.load(this.videoInfo);
      this.setVideoRect(this.x, this.y, this.w, this.h);
    }
    /**
     * Event handler to handle the event of changing the playback speed.
     */


    _mediaSpeedChanged() {}
    /**
     * Event handler to handle the event of bit rate change.
     */


    _bitrateChanged() {}
    /**
     * Function to handle the event of playback failure.
     */


    _mediaPlaybackFailed() {
      this.load(this.videoInfo);
    }
    /**
     * Function to handle the event of playback progress.
     * @param event playback event.
     */


    _mediaProgressUpdate(event) {
      this.position = event.positionMiliseconds / 1000;
      this.tag('PlayerControls').currentTime = this.position;
    }
    /**
     * Function to handle the event of starting the playback.
     */


    _mediaPlaybackStarted() {
      this.tag('PlayerControls').reset();
      this.tag('PlayerControlsWrapper').setSmooth('alpha', 1);
      this.tag('PlayerControlsWrapper').setSmooth('y', 750, {
        duration: 1
      });

      if (this.isUSB) {
        this.tag("InfoOverlay").setSmooth('alpha', 1);
      }

      this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5000);
    }
    /**
     * Function to handle the event of change in the duration of the playback content.
     */


    _mediaDurationChanged() {}
    /**
     * Function to create the video player instance for video playback and its initial settings.
     */


    createPlayer() {
      if (this.player !== null) {
        this.destroy();
        this.player = null;
      }

      try {
        this.player = new AAMPMediaPlayer();
        this.player.addEventListener('playbackStateChanged', this._playbackStateChanged);
        this.player.addEventListener('playbackCompleted', this._mediaEndReached.bind(this));
        this.player.addEventListener('playbackSpeedChanged', this._mediaSpeedChanged);
        this.player.addEventListener('bitrateChanged', this._bitrateChanged);
        this.player.addEventListener('playbackFailed', this._mediaPlaybackFailed.bind(this));
        this.player.addEventListener('playbackProgressUpdate', this._mediaProgressUpdate.bind(this));
        this.player.addEventListener('playbackStarted', this._mediaPlaybackStarted.bind(this));
        this.player.addEventListener('durationChanged', this._mediaDurationChanged);
        this.playerState = this.playerStatesEnum.idle;
      } catch (error) {
        Log.error('AAMPMediaPlayer is not defined');
      }
    }
    /**
     * Loads the player with video URL.
     * @param videoInfo the url and the info regarding the video like title.
     */


    load(videoInfo) {
      this.createPlayer();
      this.videoInfo = videoInfo;
      this.configObj = this.defaultInitConfig;
      this.configObj.drmConfig = this.videoInfo.drmConfig;
      this.player.initConfig(this.configObj);
      this.player.load(videoInfo.url);
      this.tag('PlayerControls').title = videoInfo.title;
      this.tag('PlayerControls').duration = this.player.getDurationSec();
      Log.info('Dureation of video', this.player.getDurationSec());
      this.tag('PlayerControls').currentTime = 0;
      this.play();
    }
    /**
     * Starts playback when enough data is buffered at play head.
     */


    play() {
      this.player.play();
      this.playbackRateIndex = this.playbackSpeeds.indexOf(1);
    }
    /**
     * Pauses playback.
     */


    pause() {
      this.player.pause();
    }
    /**
     * Stop playback and free resources.
     */


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
            title: 'Parkour event',
            url: this.data[this.currentIndex].data.uri,
            drmConfig: null
          });
          this.updateInfo();
          this.setVideoRect(0, 0, 1920, 1080);
        } catch (error) {
          Log.error('Playback Failed ' + error);
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
            title: 'Parkour event',
            url: this.data[this.currentIndex].data.uri,
            drmConfig: null
          });
          this.updateInfo();
          this.setVideoRect(0, 0, 1920, 1080);
        } catch (error) {
          Log.error('Playback Failed ' + error);
        }
      }
    }
    /**
     * Function to perform fast forward of the video content.
     */


    fastfwd() {
      if (this.playbackRateIndex < this.playbackSpeeds.length - 1) {
        this.playbackRateIndex++;
      }

      this.rate = this.playbackSpeeds[this.playbackRateIndex];
      this.player.setPlaybackRate(this.rate);
    }
    /**
     * Function to perform fast rewind of the video content.
     */


    fastrwd() {
      if (this.playbackRateIndex > 0) {
        this.playbackRateIndex--;
      }

      this.rate = this.playbackSpeeds[this.playbackRateIndex];
      this.player.setPlaybackRate(this.rate);
    }
    /**
     * Function that returns player instance.
     * @returns player instance.
     */


    getPlayer() {
      return this.player;
    }
    /**
     * Function to release the video player instance when not in use.
     */


    destroy() {
      if (this.player.getCurrentState() !== this.playerStatesEnum.idle) {
        this.player.stop();
      }

      this.player.removeEventListener('playbackStateChanged', this._playbackStateChanged);
      this.player.removeEventListener('playbackCompleted', this._mediaEndReached);
      this.player.removeEventListener('playbackSpeedChanged', this._mediaSpeedChanged);
      this.player.removeEventListener('bitrateChanged', this._bitrateChanged);
      this.player.removeEventListener('playbackFailed', this._mediaPlaybackFailed.bind(this));
      this.player.removeEventListener('playbackProgressUpdate', this._mediaProgressUpdate.bind(this));
      this.player.removeEventListener('playbackStarted', this._mediaPlaybackStarted.bind(this));
      this.player.removeEventListener('durationChanged', this._mediaDurationChanged);
      this.player.release();
      this.player = null;
      this.hidePlayerControls();
    }
    /**
     * Function to hide the player controls.
     */


    hidePlayerControls() {
      this.tag('PlayerControlsWrapper').setSmooth('y', 1080, {
        duration: 0.7
      });
      this.tag('PlayerControlsWrapper').setSmooth('alpha', 0, {
        duration: 0.7
      });

      this._setState('HideControls');

      this.hideInfo();
    }
    /**
     * Function to show the player controls.
     */


    showPlayerControls() {
      // this.tag('PlayerControls').reset()
      this.tag('PlayerControlsWrapper').setSmooth('alpha', 1);
      this.tag('PlayerControlsWrapper').setSmooth('y', 750, {
        duration: 0.7
      });

      this._setState('ShowControls');

      this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5000);
    }

    showInfo() {
      if (this.isUSB || this.isChannel) {
        this.tag("InfoOverlay").setSmooth('alpha', 1, {
          duration: 0.3,
          delay: 0.7
        });
      }
    }

    hideInfo() {
      if (this.isUSB || this.isChannel) {
        this.tag("InfoOverlay").setSmooth('alpha', 0, {
          duration: 0.3
        });
      }
    }

    updateInfo() {
      if (this.isUSB) {
        this.tag('ShowName').text.text = this.data[this.currentIndex].data.displayName;
      } else if (this.isChannel) {
        this.tag('ShowName').text.text = this.showName; // this.tag('ChannelName').text.text = this.channelName
      }
    }
    /**
     * Function to display player controls on down key press.
     */

    /**
     *Function to hide player control on up key press.
     */


    _handleBack() {
      Router.back();
    }

    _inactive() {
      this.tag('Image').alpha = 0;
      this.tag('InfoOverlay').alpha = 0;
      this.isUSB = false;
      this.isChannel = false;
      this.stop();
      this.destroy();
    }

    _focus() {
      this._setState('HideControls');

      this.updateInfo();

      if (this.isChannel) {
        //this.tag('ChannelOverlay').$focusChannel(this.channelIndex)
        this.tag('InfoOverlay').y = 790;
        this.tag('ChannelName').visible = true;
        this.tag('PlayerControls').hideNextPrevious();
      } else {
        this.tag('InfoOverlay').y = 820;
        this.tag('ChannelName').visible = false;
        this.tag('PlayerControls').showNextPrevious();
      }
    }
    /**
     * Function to define the different states of the video player.
     */


    static _states() {
      return [class ShowControls extends this {
        _getFocused() {
          return this.tag('PlayerControls');
        }

        _handleDown() {
          this.hidePlayerControls();

          this._setState('HideControls');
        }

        _handleUp() {
          if (this.isChannel) {
            this.hidePlayerControls(); //this._setState('ChannelOverlay')
          }
        }

      }, class HideControls extends this {
        // _handleBack(){
        //   Log.info('go back from hidecontrol')
        // }
        _handleUp() {
          // this.tag('PlayerControlsWrapper').setSmooth('alpha', 1, { duration: 1 })
          // this.tag('PlayerControlsWrapper').setSmooth('y', 820, { duration: 1 })
          this.showPlayerControls();

          this._setState('ShowControls');

          this.showInfo();
          clearTimeout(this.timeout);
        } //  _handleLeft() {
        //    if (this.isChannel) {
        //      this._setState('ChannelOverlay')
        //    }
        //  }


      } //    class ChannelOverlay extends this {
      //      $enter() {
      //        this.tag('ChannelWrapper').setSmooth('x', 0, { duration: 1 })
      //      }
      //      $exit() {
      //        this.tag('ChannelWrapper').setSmooth('x', -360, { duration: 1 })
      //      }
      //      _handleLeft() {
      //        this.hidePlayerControls()
      //        this._setState('HideControls')
      //      }
      //      _handleRight() {
      //        this.hidePlayerControls()
      //        this._setState('HideControls')
      //      }
      //      _getFocused() {
      //        return this.tag('ChannelOverlay')
      //      }
      //    },
      ];
    }

  }

  var routes = {
    root: "menu",
    routes: [{
      path: 'menu',
      component: MainView
    }, {
      path: 'player',
      component: AAMPVideoPlayer
    }]
  };

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
  const config = {
    host: '127.0.0.1',
    port: 9998,
    default: 1
  };
  const thunder = thunderJS(config);
  const appApi = new AppApi();
  function keyIntercept() {
    const rdkshellCallsign = 'org.rdk.RDKShell';
    thunder.Controller.activate({
      callsign: rdkshellCallsign
    }).then(result => {
      Log.info('Successfully activated RDK Shell');
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call('org.rdk.RDKShell', 'setFocus', {
        client: 'ResidentApp'
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.AudioVolumeMute,
        modifiers: []
      }).then(result => {
        Log.info('addKeyIntercept success');
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.on(rdkshellCallsign, 'onSuspended', notification => {
        if (notification) {
          Log.info('onSuspended notification: ' + notification.client);

          if (Storage.get('applicationType') == notification.client) {
            Storage.set('applicationType', '');
            appApi.setVisibilityandFocus('ResidentApp', true);
            thunder.call('org.rdk.RDKShell', 'moveToFront', {
              client: 'ResidentApp'
            }).then(result => {
              Log.info('ResidentApp moveToFront Success');
            });
            thunder.call('org.rdk.RDKShell', 'setFocus', {
              client: 'ResidentApp'
            }).then(result => {
              Log.info('ResidentApp setFocus Success');
            });
          }
        }
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Escape,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.F1,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Inputs_Shortcut,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Picture_Setting_Shortcut,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Power,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.F7,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.AudioVolumeUp,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.AudioVolumeDown,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'foreground',
        keyCode: keyMap.AudioVolumeDown,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'foreground',
        keyCode: keyMap.AudioVolumeUp,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'foreground',
        keyCode: keyMap.AudioVolumeMute,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.MediaFastForward,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: 142,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Home,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.MediaRewind,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Pause,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Cobalt',
        keyCode: keyMap.Escape,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Amazon',
        keyCode: keyMap.Escape,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Cobalt',
        keyCode: keyMap.Home,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Amazon',
        keyCode: keyMap.Home,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Cobalt',
        keyCode: keyMap.Backspace,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    }).then(result => {
      thunder.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'Amazon',
        keyCode: keyMap.Backspace,
        modifiers: []
      }).catch(err => {
        Log.info('Error', err);
      });
    }).catch(err => {
      Log.info('Error', err);
    });
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 Metrological
   *
   * Licensed under the Apache License, Version 2.0 (the License);
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
   */
  var powerState = 'ON';
  class App extends Router.App {
    static getFonts() {
      return [{
        family: CONFIG.language.font,
        url: Utils.asset('fonts/' + CONFIG.language.fontSrc)
      }];
    }

    _setup() {
      Router.startRouter(routes, this);

      document.onkeydown = e => {
        if (e.keyCode == keyMap.Backspace) {
          e.preventDefault();
        }
      };
    }

    static _template() {
      return {
        Pages: {
          // this hosts all the pages
          forceZIndexContext: true
        }
      };
    }

    static language() {
      return {
        file: Utils.asset('language/language-file.json'),
        language: CONFIG.language.id
      };
    }

    _init() {
      keyIntercept();
      thunder$1.on('Controller.1', 'all', noti => {
        if (noti.data.url && noti.data.url.slice(-5) === "#boot") {
          // to exit metro apps by pressing back key
          this.appApi.suspendOrDestroyApp(Storage.get('applicationType'), 'destroy');
        }
      });
    }

    powerStandby(value) {
      Log.info("standby");

      if (value == 'Back') ; else {
        if (powerState == 'ON') {
          Log.info("Power state was on trying to set it to standby");
          this.appApi.standby(value).then(res => {
            if (res.success) {
              Log.info("successfully set to standby");
              powerState = 'STANDBY';

              if (Storage.get('applicationType') !== '' && Storage.get('ipAddress')) {
                let callSign = Storage.get('applicationType'); // this.appApi.deactivateWeb();

                Settings.get("platform", "disableSuspendedApps") ? this.appApi.suspendOrDestroyApp(callSign, 'suspend') : this.appApi.suspendOrDestroyApp(callSign, 'destroy');
                Storage.set('applicationType', '');
              } else {
                if (!Router.isNavigating() && Router.getActiveHash() === 'player') {
                  Router.navigate('menu');
                }
              }

              thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
                client: 'ResidentApp'
              }).then(result => {
                Log.info('ResidentApp moveToFront Success' + JSON.stringify(result));
              }).catch(err => {
                Log.error("error while moving the resident app to front = ".concat(err));
              });
              thunder$1.call('org.rdk.RDKShell', 'setFocus', {
                client: 'ResidentApp'
              }).then(result => {
                Log.info('ResidentApp setFocus Success' + JSON.stringify(result));
              }).catch(err => {
                Log.error('Error', err);
              });
            }
          });
          return true;
        }
      }
    }

    _captureKey(key) {
      Log.info("capture key", key, key.keyCode);

      if (key.keyCode == keyMap.Home || key.keyCode === keyMap.m || key.keyCode === keyMap.Escape) {
        if (Storage.get('applicationType') != '') {
          Log.info("home key resident focus");
          Settings.get("platform", "disableSuspendedApps") ? this.appApi.suspendOrDestroyApp(Storage.get('applicationType'), 'suspend').then(res => {
            if (res) {
              if (Router.getActiveHash().startsWith("tv-overlay")) {
                Router.navigate('menu');
              }
            }
          }) : this.appApi.suspendOrDestroyApp(Storage.get('applicationType'), 'destroy').then(res => {
            if (res) {
              if (Router.getActiveHash().startsWith("tv-overlay")) {
                Router.navigate('menu');
              }
            }
          });
          Storage.set('applicationType', '');
        } else {
          Log.info("home key regular");

          if (!Router.isNavigating()) {
            Router.navigate('menu');
          }
        }

        return true;
      }

      if (key.keyCode == keyMap.Amazon) {
        Storage.set('applicationType', 'Amazon');
        this.launchApp('Amazon');
        return true;
      }

      if (key.keyCode == keyMap.Youtube) {
        Storage.set('applicationType', 'Cobalt');
        this.appApi.launchApp('Cobalt');
        return true;
      }

      if (key.keyCode == keyMap.Netflix) {
        Storage.set('applicationType', 'Netflix');
        this.launchApp('Netflix');
        return true;
      }

      if (key.keyCode == keyMap.Power) {
        // Remote power key and keyboard F1 key used for STANDBY and POWER_ON
        if (powerState == 'ON') {
          this.powerStandby('STANDBY');
          return true;
        } else if (powerState == 'STANDBY') {
          this.appApi.standby("ON").then(res => {
            powerState = 'ON';
          });
          return true;
        }
      } else if (key.keyCode == 228) {
        Log.info("___________DEEP_SLEEP_______________________F12");
        this.appApi.standby("DEEP_SLEEP").then(res => {
          powerState = 'DEEP_SLEEP';
        });
        return true;
      }

      return false;
    }

    addKeyIntercepts() {
      var rdkshellCallsign = "org.rdk.RDKShell";
      thunder$1.call(rdkshellCallsign, 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: keyMap.Home,
        modifiers: []
      }).catch(err => {
        Log.error('Error', err);
      });
    }

    $setEventListeners() {
      var self = this;
      setTimeout(function () {
        Log.info("creating app api instance for appjs");
        self.appApi = new AppApi();
      }, 0);
      setTimeout(function () {
        Log.info("registering for the event statechange");
        thunder$1.on('Controller', 'statechange', notification => {
          Log.info("state change", JSON.stringify(notification));

          if (notification && (notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'Lightning' || notification.callsign === 'Netflix') && notification.state == 'Deactivation') {
            Storage.set('applicationType', '');
            self.appApi.setVisibilityandFocus('ResidentApp', true);
            thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
              client: 'ResidentApp'
            }).then(result => {
              Log.info('ResidentApp moveToFront Success' + JSON.stringify(result));
            }).catch(err => {
              Log.error('Error', err);
            });
          }

          if (notification && (notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'Lightning' || notification.callsign === 'Netflix') && notification.state == 'Activated') {
            Storage.set('applicationType', notification.callsign);
            self.appApi.setFocus(notification.callsign);
          }
        });
      }, 0);
      Log.info("registering for event controller.all");
      thunder$1.on('Controller.1', 'all', noti => {
        if (noti.data.url && noti.data.url.slice(-5) === "#boot") {
          // to exit metro apps by pressing back key
          Settings.get("platform", "disableSuspendedApps") ? this.appApi.suspendOrDestroyApp(Storage.get('applicationType'), 'suspend') : this.appApi.suspendOrDestroyApp(Storage.get('applicationType'), 'destroy');
        }
      });
      Log.info("adding key intercepts");
      self.addKeyIntercepts();
    }

  }

  function index () {
    return Launch(App, ...arguments);
  }

  return index;

})();
