/**
 * App version: 3.4 30/12/21
 * SDK version: 4.8.1
 * CLI version: 2.7.1
 * 
 * Generated: Fri, 07 Jan 2022 07:37:51 GMT
 */

var APP_accelerator_home_ui = (function () {
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

  const dotGrab = (obj = {}, key) => {
    if (obj === null) return undefined;
    const keys = key.split('.');

    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]] = obj[keys[i]] !== undefined ? obj[keys[i]] : {};
    }

    return typeof obj === 'object' && obj !== null ? Object.keys(obj).length ? obj : undefined : obj;
  };

  var Settings = {
    get(type, key, fallback = undefined) {
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

  var executeAsPromise = ((method, args = null, context = null) => {
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

  const errorMetric = (type, message, code, visible, params = {}) => {
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

  const Metric = (type, events, options = {}) => {
    return events.reduce((obj, event) => {
      obj[event] = (name, params = {}) => {
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
  var autoSetupMixin = ((sourceObject, setup = () => {}) => {
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
  let timeout$2 = null;
  var easeExecution = ((cb, delay) => {
    clearTimeout(timeout$2);
    timeout$2 = setTimeout(() => {
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

    proxyUrl(url, options = {}) {
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
  const makeFullStaticPath = (pathname = '/', path) => {
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

  const makeQueryString = (url, options = {}, type = 'url') => {
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
  var lng$1 = window.lng;

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
  class Mediaplayer extends lng$1.Component {
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
                type: lng$1.textures.StaticTexture,
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

    updateSettings(settings = {}) {
      // The Component that 'consumes' the media player.
      this._consumer = settings.consumer;

      if (this._consumer && this._consumer.getMediaplayerSettings) {
        // Allow consumer to add settings.
        settings = Object.assign(settings, this._consumer.getMediaplayerSettings());
      }

      if (!lng$1.Utils.equalValues(this._stream, settings.stream)) {
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

    open(url, settings = {
      hide: false,
      videoPosition: null
    }) {
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

    seek(time, absolute = false) {
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
      if (lng$1.Utils.equalValues(this._videoPos, videoPos)) {
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
        clear: this._clearLocalStorage
      } : {
        getItem: this._getItemCookie,
        setItem: this._setItemCookie,
        removeItem: this._removeItemCookie,
        clear: this._clearCookies
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

    _getItemCookie(e) {
      var t = document.cookie.match(RegExp("(?:^|;\\s*)" + function (e) {
        return e.replace(/([.*+?\^${}()|\[\]\/\\])/g, "\\$1");
      }(e) + "=([^;]*)"));
      return t && "" === t[1] && (t[1] = null), t ? t[1] : null;
    }

    _setItemCookie(e, t) {
      var o = new Date(),
          r = new Date(o.getTime() + 15768e7);
      document.cookie = `${e}=${t}; expires=${r.toUTCString()};`;
    }

    _removeItemCookie(e) {
      document.cookie = `${e}=;Max-Age=-99999999;`;
    }

    _clearCookies() {
      document.cookie.split(";").forEach(e => {
        document.cookie = e.replace(/^ +/, "").replace(/=.*/, "=;expires=Max-Age=-99999999");
      });
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

  const stripRegex = (route, char = 'R') => {
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
    constructor(hash = '', navArgs, storeCaller) {
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
      Log.debug('[router]:', `cancelled ${this._hash}`);
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
    constructor(config = {}) {
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
            fullRoute = fullRoute.replace(regex, `@@${lookupId}@@`);
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
            const regex = new RegExp(`^/${expression}$`, modifiers);

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
  const getValuesFromHash = (hash = '', path) => {
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
          return acc.replace(`:${key}`, obj.params[key]);
        }, route);
      }

      if (obj.query) {
        return `${hash}${objectToQueryString(obj.query)}`;
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
  var emit$1 = ((page, events = [], params = {}) => {
    if (!isArray(events)) {
      events = [events];
    }

    events.forEach(e => {
      const event = `_on${ucfirst(e)}`;

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
  const replaceHistoryState = (state = null, hash) => {
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
  const setHistory = (arr = []) => {
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

  const deprecated = (force = false) => {
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
    format(...args) {
      const sub = args.reduce((string, arg, index) => string.split(`{${index}}`).join(arg), this);
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
  class VersionLabel extends lng$1.Component {
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
      this.tag('Text').text = `APP - v${this.version}\nSDK - v${this.sdkVersion}`;
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
  class FpsIndicator extends lng$1.Component {
    static _template() {
      return {
        rect: true,
        color: 0xffffffff,
        texture: lng$1.Tools.getRoundRect(80, 80, 40),
        h: 80,
        w: 80,
        x: 100,
        y: 100,
        mount: 1,
        Background: {
          x: 3,
          y: 3,
          texture: lng$1.Tools.getRoundRect(72, 72, 36),
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
      this.tag('Counter').text = `${this.fps}`;
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
  let dictionary = null;
  const initLanguage = (file, language = null) => {
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

  const getLanguage = () => {
    return language$1;
  };

  const setLanguage = lng => {
    language$1 = null;
    dictionary = null;
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
          dictionary = translationsObj;
          resolve();
        } else if (typeof translationsObj === 'string') {
          const url = Utils.asset(translationsObj);
          fetch(url).then(response => response.json()).then(json => {
            // save the translations for this language (to prevent loading twice)
            translations[language$1] = json;
            dictionary = json;
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

  var Language = {
    translate(key) {
      let replacements = [...arguments].slice(1); // no replacements so just translated string

      if (replacements.length === 0) {
        return dictionary && dictionary[key] || key;
      } else {
        if (replacements.length === 1 && typeof replacements[0] === 'object') {
          replacements = replacements.pop();
        }

        return Object.keys( // maps array input to an object {0: 'item1', 1: 'item2'}
        Array.isArray(replacements) ? Object.assign({}, replacements) : replacements).reduce((text, replacementKey) => {
          return text.replace(new RegExp('{\\s?' + replacementKey + '\\s?}', 'g'), replacements[replacementKey]);
        }, dictionary && dictionary[key] || key);
      }
    },

    translations(obj) {
      setTranslations(obj);
    },

    set(language) {
      return setLanguage(language);
    },

    get() {
      return getLanguage();
    },

    available() {
      const languageKeys = Object.keys(translations);
      return languageKeys.map(key => ({
        code: key,
        name: meta.names && meta.names[key] || key
      }));
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
  const registry = {
    eventListeners: [],
    timeouts: [],
    intervals: [],
    targets: []
  };
  var Registry = {
    // Timeouts
    setTimeout(cb, timeout, ...params) {
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
    setInterval(cb, interval, ...params) {
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
        resolve();
      }

      fetch(file).then(response => response.json()).then(json => {
        addColors(json);
        resolve();
      }).catch(() => {
        const error = 'Colors file ' + file + ' not found';
        Log.error(error);
        reject(error);
      });
    });
  };

  var _args = [
  	[
  		"@lightningjs/sdk@4.8.1",
  		"C:\\Users\\Arun Raj\\Project\\3.4 P 26\\RDK_apps\\accelerator-home-ui"
  	]
  ];
  var _from = "@lightningjs/sdk@4.8.1";
  var _id = "@lightningjs/sdk@4.8.1";
  var _inBundle = false;
  var _integrity = "sha512-gO8yzy43gLpBco6UDjmQehlu3HSwPKBLgDrSOf/WchRfMpU/T8ijr6Pe41Ife7yKEQLn67XrRtm3wX5AvLrhwg==";
  var _location = "/@lightningjs/sdk";
  var _phantomChildren = {
  };
  var _requested = {
  	type: "version",
  	registry: true,
  	raw: "@lightningjs/sdk@4.8.1",
  	name: "@lightningjs/sdk",
  	escapedName: "@lightningjs%2fsdk",
  	scope: "@lightningjs",
  	rawSpec: "4.8.1",
  	saveSpec: null,
  	fetchSpec: "4.8.1"
  };
  var _requiredBy = [
  	"/"
  ];
  var _resolved = "https://registry.npmjs.org/@lightningjs/sdk/-/sdk-4.8.1.tgz";
  var _spec = "4.8.1";
  var _where = "C:\\Users\\Arun Raj\\Project\\3.4 P 26\\RDK_apps\\accelerator-home-ui";
  var bugs = {
  	url: "https://github.com/rdkcentral/Lightning-SDK/issues"
  };
  var dependencies = {
  	"@babel/polyfill": "^7.11.5",
  	"@lightningjs/core": "*",
  	"@michieljs/execute-as-promise": "^1.0.0",
  	deepmerge: "^4.2.2",
  	localCookie: "github:WebPlatformForEmbedded/localCookie",
  	shelljs: "^0.8.4",
  	"url-polyfill": "^1.1.10",
  	"whatwg-fetch": "^3.0.0"
  };
  var description = "The Lightning-SDK helps you build great Lightning-based TV apps!";
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
  var homepage = "https://github.com/rdkcentral/Lightning-SDK#readme";
  var husky = {
  	hooks: {
  		"pre-commit": "lint-staged"
  	}
  };
  var license = "Apache-2.0";
  var name = "@lightningjs/sdk";
  var repository = {
  	type: "git",
  	url: "git+ssh://git@github.com/rdkcentral/Lightning-SDK.git"
  };
  var scripts = {
  	lint: "eslint '**/*.js'",
  	postinstall: "node ./scripts/postinstall.js",
  	release: "npm publish --access public"
  };
  var version = "4.8.1";
  var packageInfo = {
  	_args: _args,
  	_from: _from,
  	_id: _id,
  	_inBundle: _inBundle,
  	_integrity: _integrity,
  	_location: _location,
  	_phantomChildren: _phantomChildren,
  	_requested: _requested,
  	_requiredBy: _requiredBy,
  	_resolved: _resolved,
  	_spec: _spec,
  	_where: _where,
  	bugs: bugs,
  	dependencies: dependencies,
  	description: description,
  	devDependencies: devDependencies,
  	homepage: homepage,
  	husky: husky,
  	license: license,
  	"lint-staged": {
  	"*.js": [
  		"eslint --fix"
  	],
  	"src/startApp.js": [
  		"rollup -c ./rollup.config.js"
  	]
  },
  	name: name,
  	repository: repository,
  	scripts: scripts,
  	version: version
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
    fonts.map(({
      family,
      url,
      urls,
      descriptors
    }) => () => {
      const src = urls ? urls.map(url => {
        return 'url(' + url + ')';
      }) : 'url(' + url + ')';
      const fontFace = new FontFace(family, src, descriptors || {});
      store.push(fontFace);
      Log.info('Loading font', family);
      document.fonts.add(fontFace);
      return fontFace.load();
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

    return class Application extends lng$1.Application {
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
        console.error(`${path} already exists in routes configuration`);
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
        console.error(`[Router]: ${config.bootComponent} is not a valid boot component`);
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
    if (v instanceof lng$1.Element || isComponentConstructor(v)) {
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
    return `${v.charAt(0).toUpperCase()}${v.slice(1)}`;
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
  const cleanHash = (hash = '') => {
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
  const getQueryStringParams = (hash = getActiveHash()) => {
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
  const objectToQueryString = obj => {
    if (!isObject(obj)) {
      return '';
    }

    return '?' + Object.keys(obj).map(key => {
      return `${key}=${obj[key]}`;
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
    });
  };

  const addPersistData = ({
    page,
    route,
    hash,
    register = new Map()
  }) => {
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
        [`${axis}`]: direction ? bounds * -1 : bounds,
        visible: true,
        smooth: {
          [`${axis}`]: [0, {
            duration: 0.4,
            delay: 0.2
          }]
        }
      }); // out is optional

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

  const executeTransition = (pageIn, pageOut = null) => {
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
        const smooth = (p, v, args = {}) => {
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
        Log.debug('[router]:', `Rejected ${request.hash} because route to ${getLastHash()} started`);

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
  class RoutedApp extends lng$1.Component {
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


  const navigate = (url, args = {}, store) => {
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

  const queue = (hash, args = {}, store) => {
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
        console.error(`Unable to navigate to: ${hash}`);
      }

      return;
    } // update current processed request


    request.hash = hash;
    request.route = route;
    let result = await beforeEachRoute(getActiveHash(), request); // test if a local hook is configured for the route

    if (route.beforeNavigate) {
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
   * @param direction
   */


  const step = (level = 0) => {
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

      return false;
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

  const emit = (event, ...args) => {
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
    if (config.billingUrl) ;
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

  class PinInput extends lng$1.Component {
    static _template() {
      return {
        w: 120,
        h: 150,
        rect: true,
        color: 0xff949393,
        alpha: 0.5,
        shader: {
          type: lng$1.shaders.RoundedRectangle,
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

  class PinDialog extends lng$1.Component {
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
            type: lng$1.shaders.RoundedRectangle,
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
  class VideoTexture extends lng$1.Component {
    static _template() {
      return {
        Video: {
          alpha: 1,
          visible: false,
          pivot: 0.5,
          texture: {
            type: lng$1.textures.StaticTexture,
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

    position(top = 0, left = 0) {
      videoEl.style.left = withPrecision(left);
      videoEl.style.top = withPrecision(top);

      if (textureMode === true) {
        videoTexture.position(top, left);
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

    area(top = 0, right = 1920, bottom = 1080, left = 0) {
      this.position(top, left);
      this.size(right - left, bottom - top);
    },

    open(url, config = {}) {
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

    mute(muted = true) {
      if (!this.canInteract) return;
      videoEl.muted = muted;
    },

    loop(looped = true) {
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

    enableAds(enabled = true) {
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
  var VideoPlayer = autoSetupMixin(videoPlayerPlugin, () => {
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

  const playSlot = (slot = []) => {
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
  class ScaledImageTexture extends lng$1.textures.ImageTexture {
    constructor(stage) {
      super(stage);
      this._scalingOptions = undefined;
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

    return wrapper({ ...thunder$5(options),
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

  const thunder$5 = options => ({
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
      this[name] = wrapper(Object.assign(Object.create(thunder$5), plugin, {
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
              return function (...args) {
                return prop.apply(this, args);
              };
            }

            return function (...args) {
              return resolve(prop.apply(this, args), args);
            };
          }

          if (typeof prop === 'object') {
            return wrapper(Object.assign(Object.create(thunder$5(target.options)), prop, {
              plugin: propKey
            }));
          }

          return prop;
        } else {
          if (target.plugin === false) {
            return wrapper(Object.assign(Object.create(thunder$5(target.options)), {}, {
              plugin: propKey
            }));
          }

          return function (...args) {
            args.unshift(propKey);
            return target.call.apply(this, args);
          };
        }
      }

    });
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
    english: {
      id: 'en',
      fontSrc: 'Play/Play-Regular.ttf',
      font: 'Play'
    },
    spanish: {
      id: 'sp',
      fontSrc: 'Play/Play-Regular.ttf',
      font: 'Play'
    }
  };
  var CONFIG = {
    theme: themeOptions['partnerOne'],
    language: localStorage.getItem('Language') != null ? language[localStorage.getItem('Language')] : language['english']
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
   * Class to render items in main view.
   */

  class ListItem extends lng$1.Component {
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
        h: this.h + 24,
        w: this.w,
        x: this.x,
        y: this.y - 12
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
              maxLines: 2,
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
        scale: this.focus,
        alpha: 1
      });
    }
    /**
     * Function to change properties of item during unfocus.
     */


    _unfocus() {
      this.tag('Image').patch({
        w: this.w,
        h: this.h,
        scale: this.unfocus
      });
      this.tag('Item').patch({
        zIndex: 0
      });
      this.tag('Info').alpha = 0;
      this.tag('Shadow').patch({
        alpha: 0
      });
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
  var activatedWeb = false;
  var activatedLightning = false;
  var activatedCobalt = false;
  var activatedAmazon = false;
  var activatedNetflix = false;
  var webUrl = '';
  var lightningUrl = '';
  var nativeUrl = '';
  const config$4 = {
    host: '127.0.0.1',
    port: 9998,
    default: 1
  };
  const thunder$4 = thunderJS(config$4);
  /**
   * Class that contains functions which commuicates with thunder API's
   */

  class AppApi {
    constructor() {
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

    checkForInternet() {
      return new Promise((resolve, reject) => {
        let i = 0;

        var poll = () => {
          i++;
          this.getIP().then(result => {
            if (result == true) {
              resolve(result);
            } else if (i < 10) poll();else resolve(false);
          });
        };

        poll();
      });
    }
    /**
     * Function to launch Html app.
     * @param {String} url url of app.
     */


    getIP() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.System';
        thunder$4.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder$4.call(systemcCallsign, 'getDeviceInfo', {
            params: 'estb_ip'
          }).then(result => {
            resolve(result.success);
          }).catch(err => {
            resolve(false);
          });
        }).catch(err => {});
      });
    }
    /**
    *  Function to get timeZone
    */


    getZone() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.System';
        thunder$4.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder$4.call(systemcCallsign, 'getTimeZoneDST').then(result => {
            resolve(result.timeZone);
          }).catch(err => {
            resolve(false);
          });
        }).catch(err => {});
      });
    }
    /**
     * Function to get resolution of the display screen.
     */


    getResolution() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getCurrentResolution', {
          "videoDisplay": "HDMI0"
        }).then(result => {
          resolve(result.resolution);
        }).catch(err => {
          resolve(false);
        });
      });
    }

    activateDisplaySettings() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.DisplaySettings.1";
        thunder$4.Controller.activate({
          callsign: systemcCallsign
        }).then(res => {}).catch(err => {
          console.error(`error while activating the displaysettings plugin`);
        });
      });
    }

    getSupportedResolutions() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.DisplaySettings.1';
        thunder$4.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder$4.call(systemcCallsign, 'getSupportedResolutions', {
            params: 'HDMI0'
          }).then(result => {
            resolve(result.supportedResolutions);
          }).catch(err => {
            resolve(false);
          });
        }).catch(err => {
          console.log('Display Error', JSON.stringify(err));
        });
      });
    }
    /**
     * Function to set the display resolution.
     */


    setResolution(res) {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.DisplaySettings';
        thunder$4.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder$4.call(systemcCallsign, 'setCurrentResolution', {
            videoDisplay: 'HDMI0',
            resolution: res,
            persist: true
          }).then(result => {
            resolve(result.success);
          }).catch(err => {
            resolve(false);
          });
        }).catch(err => {
          console.log('Display Error', JSON.stringify(err));
        });
      });
    }
    /**
     * Function to get HDCP Status.
     */


    getHDCPStatus() {
      console.log("checking hdcp status");
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.HdcpProfile.1';
        thunder$4.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder$4.call(systemcCallsign, 'getHDCPStatus').then(result => {
            resolve(result.HDCPStatus);
            console.log("HDCP Status from AppApi.js : " + JSON.stringify(result.HDCPStatus));
          }).catch(err => {
            resolve(false);
          });
        }).catch(err => {
          console.log('Display Error', JSON.stringify(err));
        });
      });
    }
    /**
     * Function to get TV HDR Support.
     */


    getTvHDRSupport() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.DisplaySettings.1';
        thunder$4.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder$4.call(systemcCallsign, 'getTvHDRSupport').then(result => {
            resolve(result);
            console.log("HDR Support Status from AppApi.js : " + JSON.stringify(result));
          }).catch(err => {
            resolve(false);
          });
        }).catch(err => {
          console.log('Display Error', JSON.stringify(err));
        });
      });
    }
    /**
     * Function to get settop box HDR Support.
     */


    getSettopHDRSupport() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.DisplaySettings.1';
        thunder$4.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder$4.call(systemcCallsign, 'getSettopHDRSupport').then(result => {
            resolve(result);
            console.log("HDR Support Status for STB from AppApi.js : " + JSON.stringify(result));
          }).catch(err => {
            resolve(false);
          });
        }).catch(err => {
          console.log('Display Error', JSON.stringify(err));
        });
      });
    }
    /**
     * Function to get HDR Format in use.
     */


    getHDRSetting() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'DisplayInfo.1';
        thunder$4.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder$4.call(systemcCallsign, 'hdrsetting').then(result => {
            resolve(result);
            console.log("HDR format in use from AppApi.js : " + JSON.stringify(result));
          }).catch(err => {
            resolve(false);
          });
        }).catch(err => {
          console.log('Display Error', JSON.stringify(err));
        });
      });
    }
    /**
     * Function to get DRMs.
     */


    getDRMS() {
      console.log("calling getDDRMS");
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'OCDM.1';
        thunder$4.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          thunder$4.call(systemcCallsign, 'drms').then(result => {
            resolve(result);
            console.log("supported drms from AppApi.js : " + JSON.stringify(result));
          }).catch(err => {
            resolve(false);
          });
        }).catch(err => {
          console.log('Display Error', JSON.stringify(err));
        });
      });
    }
    /**
     * Function to clear cache.
     */


    clearCache() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'ResidentApp.1';
        thunder$4.call(systemcCallsign, 'delete', {
          path: ".cache"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          resolve(err);
        });
      });
    }
    /**
     * Function to launch Html app.
     * @param {String} url url of app.
     */


    launchWeb(url) {
      const childCallsign = 'HtmlApp';

      if (webUrl != url) {
        thunder$4.call('org.rdk.RDKShell', 'launch', {
          callsign: childCallsign,
          type: childCallsign,
          uri: url
        }).then(() => {
          thunder$4.call('org.rdk.RDKShell', 'moveToFront', {
            client: childCallsign
          });
          thunder$4.call('org.rdk.RDKShell', 'setFocus', {
            client: childCallsign
          });
        }).catch(err => {});
      } else {
        thunder$4.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign
        });
        thunder$4.call('org.rdk.RDKShell', 'setFocus', {
          client: childCallsign
        });
      }

      webUrl = url;
      activatedWeb = true;
    }
    /**
     * Function to launch Lightning app.
     * @param {String} url url of app.
     */


    launchLightning(url) {
      const childCallsign = 'LightningApp';

      if (lightningUrl != url) {
        thunder$4.call('org.rdk.RDKShell', 'launch', {
          callsign: childCallsign,
          type: childCallsign,
          uri: url
        }).then(() => {
          thunder$4.call('org.rdk.RDKShell', 'moveToFront', {
            client: childCallsign
          });
          thunder$4.call('org.rdk.RDKShell', 'setFocus', {
            client: childCallsign
          });
        }).catch(err => {});
      } else {
        thunder$4.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign
        });
        thunder$4.call('org.rdk.RDKShell', 'setFocus', {
          client: childCallsign
        });
      }

      lightningUrl = url;
      activatedLightning = true;
    }
    /**
     * Function to launch Cobalt app.
     * @param {String} url url of app.
     */


    launchCobalt(url) {
      const childCallsign = 'Cobalt';
      thunder$4.call('org.rdk.RDKShell', 'launch', {
        callsign: childCallsign,
        type: childCallsign
      }).then(() => {
        thunder$4.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign
        });
        thunder$4.call('Cobalt.1', 'deeplink', url);
        thunder$4.call('org.rdk.RDKShell', 'setFocus', {
          client: childCallsign
        });
      }).catch(err => {});
      activatedCobalt = true;
    }
    /**
     * Function to launch Netflix/Amazon Prime app.
     */


    launchPremiumApp(childCallsign) {
      thunder$4.call("org.rdk.RDKShell", "launch", {
        callsign: childCallsign,
        type: childCallsign
      }).then(() => {
        thunder$4.call("org.rdk.RDKShell", "moveToFront", {
          client: childCallsign
        });
        thunder$4.call("org.rdk.RDKShell", "setFocus", {
          client: childCallsign
        });
      }).catch(err => {});
      childCallsign === 'Amazon' ? activatedAmazon = true : activatedNetflix = true;
    }
    /**
     * Function to launch Resident app.
     * @param {String} url url of app.
     */


    launchResident(url) {
      const childCallsign = 'ResidentApp';
      thunder$4.call('org.rdk.RDKShell', 'launch', {
        callsign: childCallsign,
        type: childCallsign,
        uri: url
      }).then(() => {
        thunder$4.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign
        });
        thunder$4.call('org.rdk.RDKShell', 'setFocus', {
          client: childCallsign
        });
      }).catch(err => {
        console.log('org.rdk.RDKShell launch ' + JSON.stringify(err));
      });
    }

    launchforeground() {
      const childCallsign = 'foreground';
      let notification_url = location.protocol + '//' + location.host + "/static/notification/index.html";

      if (location.host.includes('127.0.0.1')) {
        notification_url = location.protocol + '//' + location.host + "/lxresui/static/notification/index.html";
      }

      console.log(notification_url, '|', location.host, JSON.stringify(location));
      thunder$4.call('org.rdk.RDKShell', 'launch', {
        callsign: childCallsign,
        type: 'LightningApp',
        uri: notification_url
      }).then(() => {
        // thunder.call('org.rdk.RDKShell', 'moveToFront', {
        //   client: childCallsign,
        // })
        thunder$4.call('org.rdk.RDKShell', 'setFocus', {
          client: 'ResidentApp'
        });
        thunder$4.call('org.rdk.RDKShell', 'setVisibility', {
          client: 'foreground',
          visible: false
        });
      }).catch(err => {}).catch(err => {
        console.log('org.rdk.RDKShell launch ' + JSON.stringify(err));
      });
    }
    /**
     * Function to suspend html app.
     */


    suspendWeb() {
      webUrl = '';
      thunder$4.call('org.rdk.RDKShell', 'suspend', {
        callsign: 'HtmlApp'
      });
    }
    /**
     * Function to suspend lightning app.
     */


    suspendLightning() {
      lightningUrl = '';
      thunder$4.call('org.rdk.RDKShell', 'suspend', {
        callsign: 'LightningApp'
      });
    }
    /**
     * Function to suspend cobalt app.
     */


    suspendCobalt() {
      thunder$4.call('org.rdk.RDKShell', 'suspend', {
        callsign: 'Cobalt'
      });
    }
    /**
     * Function to suspend Netflix/Amazon Prime app.
     */


    suspendPremiumApp(appName) {
      thunder$4.call('org.rdk.RDKShell', 'suspend', {
        callsign: appName
      });
    }
    /**
     * Function to deactivate html app.
     */


    deactivateWeb() {
      thunder$4.call('org.rdk.RDKShell', 'destroy', {
        callsign: 'HtmlApp'
      });
      activatedWeb = false;
      webUrl = '';
    }
    /**
     * Function to deactivate cobalt app.
     */


    deactivateCobalt() {
      thunder$4.call('org.rdk.RDKShell', 'destroy', {
        callsign: 'Cobalt'
      });
      activatedCobalt = false;
    }

    cobaltStateChangeEvent() {
      try {
        thunder$4.on('Controller', 'statechange', notification => {
          if (this._events.has('statechange')) {
            this._events.get('statechange')(notification);
          }
        });
      } catch (e) {
        console.log('Failed to register statechange event' + e);
      }
    }
    /**
     * Function to deactivate Netflix/Amazon Prime app.
     */


    deactivateNativeApp(appName) {
      thunder$4.call('org.rdk.RDKShell', 'destroy', {
        callsign: appName
      });
      appName === 'Amazon' ? activatedAmazon = false : activatedNetflix = false;
    }
    /**
     * Function to deactivate lightning app.
     */


    deactivateLightning() {
      thunder$4.call('org.rdk.RDKShell', 'destroy', {
        callsign: 'LightningApp'
      });
      activatedLightning = false;
      lightningUrl = '';
    }
    /**
     * Function to set visibility to client apps.
     * @param {client} client client app.
     * @param {visible} visible value of visibility.
     */


    setVisibility(client, visible) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.RDKShell', 'setVisibility', {
          client: client,
          visible: visible
        });
        thunder$4.call('org.rdk.RDKShell.1', 'setFocus', {
          client: client
        }).then(res => {
          resolve(true);
        }).catch(err => {
          console.log('Set focus error', JSON.stringify(err));
          reject(false);
        });
      });
    }

    enabledisableinactivityReporting(bool) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.RDKShell.1', 'enableInactivityReporting', {
          "enable": bool
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting sound mode:", JSON.stringify(err, 3, null));
          reject(err);
        });
      });
    }

    setInactivityInterval(t) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.RDKShell.1', 'setInactivityInterval', {
          "interval": t
        }).then(result => {
          resolve(result);
        }).catch(err => {
          reject(false);
        });
      });
    }

    zorder(cli) {
      thunder$4.call('org.rdk.RDKShell.1', 'moveToFront', {
        client: cli,
        callsign: cli
      });
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
        thunder$4.call(plugin, method).then(res => {
          res.querystring = config_data;
          thunder$4.call(plugin, method, res).then(resp => {
            resolve(true);
          }).catch(err => {
            resolve(true);
          });
        }).catch(err => {
          reject(err);
        });
      });
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
        thunder$4.call(plugin, method).then(res => {
          res.querystring = config_data;
          thunder$4.call(plugin, method, res).then(resp => {
            resolve(true);
          }).catch(err => {
            resolve(true);
          });
        }).catch(err => {
          reject(err);
        });
      });
    }
    /**
     * Function to launch Native app.
     * @param {String} url url of app.
     */


    launchNative(url) {
      const childCallsign = 'testApp';

      if (nativeUrl != url) {
        thunder$4.call('org.rdk.RDKShell', 'launchApplication', {
          client: childCallsign,
          uri: url,
          mimeType: 'application/native'
        }).then(() => {
          thunder$4.call('org.rdk.RDKShell', 'moveToFront', {
            client: childCallsign
          });
          thunder$4.call('org.rdk.RDKShell', 'setFocus', {
            client: childCallsign
          });
        }).catch(err => {
          console.log('org.rdk.RDKShell launch ' + JSON.stringify(err));
        });
      } else {
        thunder$4.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign
        });
        thunder$4.call('org.rdk.RDKShell', 'setFocus', {
          client: childCallsign
        });
      }

      nativeUrl = url;
    }
    /**
       * Function to kill native app.
       */


    killNative() {
      thunder$4.call('org.rdk.RDKShell', 'kill', {
        callsign: 'testApp'
      });
      nativeUrl = '';
    }

    static pluginStatus(plugin) {
      switch (plugin) {
        case 'WebApp':
          return activatedWeb;

        case 'Cobalt':
          return activatedCobalt;

        case 'Lightning':
          return activatedLightning;

        case 'Amazon':
          return activatedAmazon;

        case 'Netflix':
          return activatedNetflix;
      }
    }

    standby(value) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'setPowerState', {
          "powerState": value,
          "standbyReason": "Requested by user"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          resolve(false);
        });
      });
    }

    audio_mute(value, audio_source) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'setMuted', {
          "audioPort": audio_source,
          "muted": value
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("audio mute error:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }

    muteStatus(port) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getMuted', {
          audioPort: port
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log('audio mute error:', JSON.stringify(err, 3, null));
          reject(false);
        });
      });
    }

    enableDisplaySettings() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.RDKShell.1', 'launch', {
          callsign: 'org.rdk.DisplaySettings.1'
        }).then(result => {
          console.log('Successfully emabled DisplaySettings Service');
          resolve(result);
        }).catch(err => {
          console.log('Failed to enable DisplaySettings Service', JSON.stringify(err));
        });
      });
    }

    getVolumeLevel() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getVolumeLevel', {
          "audioPort": "HDMI0"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("audio mute error:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }

    getConnectedAudioPorts() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getConnectedAudioPorts', {}).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("audio mute error:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }

    getSoundMode() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getSoundMode', {
          "audioPort": "HDMI0"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting sound mode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }

    setSoundMode(mode) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'setSoundMode', {
          "audioPort": "HDMI0",
          "soundMode": mode,
          "persist": true
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in setting sound mode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }

    getSupportedAudioModes() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getSupportedAudioModes', {
          "audioPort": "HDMI0"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting support audio sound mode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //Returns connected audio output ports (a subset of the ports supported on the device)


    getConnectedAudioPorts() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getConnectedAudioPorts', {}).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("audio mute error:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //Enable or disable the specified audio port based on the input audio port ID. 


    setEnableAudioPort(port) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'setEnableAudioPort', {
          "audioPort": port,
          "enable": true
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting support audio sound mode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }

    getDRCMode() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings', 'getDRCMode', {
          "audioPort": "HDMI0"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error while getting the DRC", JSON.stringify(err));
          resolve(false);
        });
      });
    }

    setDRCMode(DRCNum) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'setDRCMode', {
          "DRCMode": DRCNum
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error while setting the DRC", JSON.stringify(err));
          resolve(false);
        });
      });
    }

    getZoomSetting() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getZoomSetting').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error while getting Zoom Setting", JSON.stringify(err));
          resolve(false);
        });
      });
    }

    setZoomSetting(zoom) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'setZoomSetting', {
          "zoomSetting": zoom
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error while setting the Zoom", JSON.stringify(err));
          resolve(false);
        });
      });
    }

    getEnableAudioPort(audioPort) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getEnableAudioPort', {
          "audioPort": audioPort
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error while getting Enabled Audio port ", JSON.stringify(err));
          resolve(false);
        });
      });
    }

    getSupportedAudioPorts() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getSupportedAudioPorts').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error while getting S upported audio ports ", JSON.stringify(err));
          resolve(false);
        });
      });
    }

    getVolumeLevel() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'getVolumeLevel').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error current volume level", JSON.stringify(err));
          resolve(false);
        });
      });
    }

    setVolumeLevel(port, volume) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.DisplaySettings.1', 'setVolumeLevel', {
          "audioPort": port,
          "volumeLevel": volume
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error while setting current volume level", JSON.stringify(err));
          resolve(false);
        });
      });
    } //________________________________________________________________________________________________________________________
    //OTHER SETTINGS PAGE API
    //1. UI VOICE
    //Start a speech


    speak() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.TextToSpeech.1', 'speak', {
          "text": "speech_1"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in speak:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //Resume a speech


    resume() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.TextToSpeech.1', 'resume', {
          "speechid": 1
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in resuming:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //Pause a speech


    pause() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.TextToSpeech.1', 'pause', {
          "speechid": 1
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in pausing:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } // 2. TTS Options


    getlistVoices() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.TextToSpeech.1', 'listvoices', {
          "language": "en-US"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting voices:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } // 3. Sync Location


    syncLocation() {
      return new Promise((resolve, reject) => {
        thunder$4.call('LocationSync.1', 'sync').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in syncing location:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }

    getLocation() {
      return new Promise((resolve, reject) => {
        thunder$4.call('LocationSync.1', 'location').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting location:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } // 4. Check for Firmware Update
    //Get Firmware Update Info


    getFirmwareUpdateInfo() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'getFirmwareUpdateInfo').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting firmware update info:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } // Get Firmware Update State


    getFirmwareUpdateState() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'getFirmwareUpdateState').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting firmware update state:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } // Get Firmware download info


    getDownloadFirmwareInfo() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'getDownloadedFirmwareInfo').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting downloaded info:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //Get serial number


    getSerialNumber() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'getSerialNumber').then(result => {
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        }).catch(err => {
          resolve(false);
        });
      });
    } //Get system versions


    getSystemVersions() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'getSystemVersions').then(result => {
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        }).catch(err => {
          console.log("error in getting downloaded percentage:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //Update firmware


    updateFirmware() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'updateFirmware').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in firmware update:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //Get download percentage


    getFirmwareDownloadPercent() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'getFirmwareDownloadPercent').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting downloaded percentage:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } // device Identification


    getDeviceIdentification() {
      return new Promise((resolve, reject) => {
        thunder$4.call('DeviceIdentification.1', 'deviceidentification').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting device Identification:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } // 5. Device Info


    systeminfo() {
      return new Promise((resolve, reject) => {
        thunder$4.call('DeviceInfo.1', 'systeminfo').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting system info:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } // 6. Reboot


    reboot() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'reboot', {
          "rebootReason": "FIRMWARE_FAILURE"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in reboot:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } // get prefered standby mode


    getPreferredStandbyMode() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'getPreferredStandbyMode').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getPreferredStandbyMode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }

    setPreferredStandbyMode(standbyMode) {
      console.log("setPreferredStandbyMode called : " + standbyMode);
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.System.1', 'setPreferredStandbyMode', {
          "standbyMode": standbyMode
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in setPreferredStandbyMode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    }

    registerChangeLocation() {
      var callsign = "LocationSync.1";
      thunder$4.call('Controller', 'activate', {
        callsign: callsign
      }).then(result => {
        thunder$4.on(callsign, "locationchange", notification => {
          console.log("location was changed and the notification = ", notification);
        });
      }).catch(err => {
        console.log(err);
      });
    }

    async sendAppState(value) {
      const state = await thunder$4.call('org.rdk.RDKShell.1', 'getState', {}).then(result => result.state);
      this.state = state;
      let params = {
        applicationName: value,
        state: 'stopped'
      };

      for (var i = 0; i < state.length; i++) {
        if (state[i].callsign == value) {
          if (state[i].state == 'resumed') {
            activatedCobalt = true;
            params.state = 'running';
          } else if (state[i].state == 'suspended') {
            params.state = 'suspended';
          } else {
            params.state = 'stopped';
          }
        }
      }

      if (params.state === 'stopped') {
        activatedCobalt = false;
      }

      await thunder$4.call('org.rdk.Xcast', 'onApplicationStateChanged', params).then(result => result.success);
    } //NETWORK INFO APIS
    //1. Get IP Setting


    getIPSetting(defaultInterface) {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.Network.1', 'getIPSettings', {
          "interface": defaultInterface
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting network info:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //2. Get default interface


    getDefaultInterface() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.Network.1', 'getDefaultInterface').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting default interface:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //3. Is interface enabled


    isInterfaceEnabled() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.Network.1', 'isInterfaceEnabled', {
          "interface": "WIFI"
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in checking the interface:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //4. Get interfaces


    getInterfaces() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.Network.1', 'getInterfaces').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting interfaces:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
    } //5. getConnectedSSID


    getConnectedSSID() {
      return new Promise((resolve, reject) => {
        thunder$4.call('org.rdk.Wifi.1', 'getConnectedSSID').then(result => {
          resolve(result);
        }).catch(err => {
          console.log("error in getting connected SSID:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      });
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
   * Class which contains data for app listings.
   */
  var imageListInfo = [];

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
  var musicListInfo = [];

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
  var videoListInfo = [];

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
  var UsbInnerFolderListInfo = [];

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
  const config$3 = {
    host: '127.0.0.1',
    port: 9998,
    versions: {
      default: 2,
      Controller: 1,
      UsbAccess: 2
    }
  };
  var thunder$3 = thunderJS(config$3);
  /**
   * Class that contains functions which commuicates with thunder API's
   */

  class UsbApi {
    /**
    *  Function to activate USB Access Plugin
    */
    activate() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.UsbAccess';
        thunder$3.Controller.activate({
          callsign: systemcCallsign
        }).then(res => {
          resolve(res);
        }).catch(err => {
          console.log('UsbAccess Plugin Activation Failed: ' + err);
          reject(err);
        });
      });
    }
    /**
    *  Function to deactivate USB Access Plugin
    */


    deactivate() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.UsbAccess';
        thunder$3.Controller.deactivate({
          callsign: systemcCallsign
        }).then(res => {
          resolve(res);
        }).catch(err => {
          console.log('UsbAccess Plugin Deactivation Failed: ' + err);
          reject(err);
        });
      });
    }
    /**
    *  Function to create link for USB content
    */


    clearLink() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.UsbAccess';
        thunder$3.call(systemcCallsign, 'clearLink').then(result => {
          resolve(result);
        }).catch(err => {
          resolve(false);
        });
      });
    }
    /**
    *  Function to create link for USB content
    */


    createLink() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.UsbAccess';
        thunder$3.call(systemcCallsign, 'createLink').then(result => {
          resolve(result);
        }).catch(err => {
          resolve(false);
        });
      });
    }
    /**
    *  Function to get getUsbList
    */


    getUsbFileList() {
      if (arguments.length === 0) {
        return new Promise((resolve, reject) => {
          const systemcCallsign = 'org.rdk.UsbAccess';
          thunder$3.call(systemcCallsign, 'getFileList').then(result => {
            resolve(result.contents);
          }).catch(err => {
            resolve(false);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          const systemcCallsign = 'org.rdk.UsbAccess';
          thunder$3.call(systemcCallsign, 'getFileList', {
            "path": arguments[0]
          }).then(result => {
            resolve(result.contents);
          }).catch(err => {
            resolve(false);
          });
        });
      }
    }

    retrieUsb() {
      this.usbLink = "";
      var self = this;
      return new Promise((resolve, reject) => {
        self.clearLink().then(result => {
          self.createLink().then(res => {
            if (res.success) {
              self.usbLink = res.baseURL;
              self.getUsbFileList().then(result1 => {
                self.getUsbContentList(result1);
                resolve(true);
              }).catch(err => {
                reject(err);
              });
            }
          }).catch(err => {
            reject(err);
          });
        }).catch(err => {
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
        this.getUsbFileList(dname).then(result1 => {
          this.getUsbContentList(result1, dname);
          resolve(true);
        }).catch(err => {
          reject(err);
        });
      });
    }

    getMountedDevices() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = "org.rdk.UsbAccess";
        thunder$3.call(systemcCallsign, 'getMounted').then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
          console.error(`Error while getting the mounted device ${JSON.stringify(err)}`);
        });
      });
    }

    getUsbContentList(result) {
      this.destroy();
      let cwd = this.usbLink;

      if (arguments[1]) {
        cwd = cwd + '/' + arguments[1];
      } // to add support for more formats, extension can be added same as below 


      var extensionForImage = ['.png', '.jpg', '.PNG', '.jpeg', '.JPEG', '.jpg', '.JPG'];
      var extensionForVideo = ['.mp4', '.MP4', '.mov', '.MOV', '.avi', '.AVI', '.m3u8', '.M3U8', '.mpeg2', '.MPEG2'];
      var extensionForAudio = ['.mp3', '.mpeg', '.MP3', '.MPEG'];
      this._discoveredC = result; //   console.log("Discovered result :: " + JSON.stringify(result));

      this._discoveredC.filter(device => {
        for (let i in extensionForImage) {
          if (device.name.indexOf(extensionForImage[i]) !== -1) {
            var obj1 = {
              displayName: device.name,
              uri: cwd + '/' + device.name,
              url: cwd + '/' + device.name // url: '/images/usb/picture-default-tile.jpg',
              // url: '/images/usb/USB_Photo_Placeholder.jpg',
              // uri: this.usbLink + '/' + device.name,

            };
            imageListInfo.push(obj1);
            return device;
          }
        }
      });

      this._discoveredC.filter(device => {
        for (let i in extensionForVideo) {
          if (device.name.indexOf(extensionForVideo[i]) !== -1) {
            var obj2 = {
              displayName: device.name,
              //  url: '/images/usb/video-default-tile.jpg',
              url: '/images/usb/USB_Video_Placeholder.jpg',
              uri: cwd + '/' + device.name
            };
            videoListInfo.push(obj2);
            return device;
          }
        }
      });

      this._discoveredC.filter(device => {
        for (let i in extensionForAudio) {
          if (device.name.indexOf(extensionForAudio[i]) !== -1) {
            var obj3 = {
              displayName: device.name,
              //  url: '/images/usb/music-default-tile.jpg',
              url: '/images/usb/USB_Audio_Placeholder.jpg',
              uri: cwd + '/' + device.name
            };
            musicListInfo.push(obj3);
            return device;
          }
        }
      });

      this._discoveredC.filter(device => {
        if (device.t === 'd') {
          if (!(device.name === '.' || device.name === "..")) {
            var obj4 = {
              displayName: device.name,
              url: "/images/usb/picture-folder.png",
              uri: cwd + "/" + device.name
            };
            UsbInnerFolderListInfo.push(obj4);
            return device;
          }
        }
      });
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
   * Class for Xcast thunder plugin apis.
   */

  class XcastApi {
    constructor() {
      const config = {
        host: '127.0.0.1',
        port: 9998,
        default: 1
      };
      this._thunder = thunderJS(config);
      console.log('Xcast constructor');
      this._events = new Map();
    }
    /**
     * Function to activate the Xcast plugin
     */


    activate() {
      return new Promise((resolve, reject) => {
        this.callsign = 'org.rdk.Xcast.1';

        this._thunder.call('Controller', 'activate', {
          callsign: this.callsign
        }).then(result => {
          console.log('Xcast activation success ' + result);

          this._thunder.call('org.rdk.Xcast', 'setEnabled', {
            enabled: true
          }).then(result => {
            if (result.success) {
              console.log('Xcast enabled');

              this._thunder.on(this.callsign, 'onApplicationLaunchRequest', notification => {
                console.log('onApplicationLaunchRequest ' + JSON.stringify(notification));

                if (this._events.has('onApplicationLaunchRequest')) {
                  this._events.get('onApplicationLaunchRequest')(notification);
                }
              });

              this._thunder.on(this.callsign, 'onApplicationHideRequest', notification => {
                console.log('onApplicationHideRequest ' + JSON.stringify(notification));

                if (this._events.has('onApplicationHideRequest')) {
                  this._events.get('onApplicationHideRequest')(notification);
                }
              });

              this._thunder.on(this.callsign, 'onApplicationResumeRequest', notification => {
                console.log('onApplicationResumeRequest ' + JSON.stringify(notification));

                if (this._events.has('onApplicationResumeRequest')) {
                  this._events.get('onApplicationResumeRequest')(notification);
                }
              });

              this._thunder.on(this.callsign, 'onApplicationStopRequest', notification => {
                console.log('onApplicationStopRequest ' + JSON.stringify(notification));

                if (this._events.has('onApplicationStopRequest')) {
                  this._events.get('onApplicationStopRequest')(notification);
                }
              });

              this._thunder.on(this.callsign, 'onApplicationStateRequest', notification => {
                // console.log('onApplicationStateRequest ' + JSON.stringify(notification));
                if (this._events.has('onApplicationStateRequest')) {
                  this._events.get('onApplicationStateRequest')(notification);
                }
              });

              resolve(true);
            } else {
              console.log('Xcast enabled failed');
            }
          }).catch(err => {
            console.error('Enabling failure', err);
            reject('Xcast enabling failed', err);
          });
        }).catch(err => {
          console.error('Activation failure', err);
          reject('Xcast activation failed', err);
        });
      });
    }

    getEnabled() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Xcast.1', 'getEnabled').then(res => {
          resolve(res);
        }).catch(err => {
          console.log('Xdial error', err);
        });
      });
    }
    /**
     *
     * @param {string} eventId
     * @param {function} callback
     * Function to register the events for the Xcast plugin.
     */


    registerEvent(eventId, callback) {
      this._events.set(eventId, callback);
    }
    /**
     * Function to deactivate the Xcast plugin.
     */


    deactivate() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Xcast.1', 'setEnabled', {
          enabled: false
        }).then(res => {
          resolve(res.success);
        }).catch(err => {
          console.log('Failed to close Xcast', err);
        });
      });
    }
    /**
     * Function to notify the state of the app.
     */


    onApplicationStateChanged(params) {
      return new Promise((resolve, reject) => {
        console.log('Notifying back');

        this._thunder.call('org.rdk.Xcast.1', 'onApplicationStateChanged', params).then(result => {
          resolve(result);
        });
      });
    }

    static supportedApps() {
      var xcastApps = {
        AmazonInstantVideo: 'Amazon',
        YouTube: 'Cobalt',
        NetflixApp: 'Netflix'
      };
      return xcastApps;
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
    // F5
    "PageUp": 33,
    "PageDown": 34,
    "Home": 36
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
  /** Class for main view component in home UI */

  class MainView extends lng$1.Component {
    /**
     * Function to render various elements in main view.
     */
    static _template() {
      return {
        MainView: {
          x: 200,
          w: 1765,
          h: 1250,
          clipping: true,
          Text1: {
            // x: 10 + 25,
            // y:  30,
            h: 30,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 25,
              text: Language.translate('Featured Content'),
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF
            },
            zIndex: 0
          },
          AppList: {
            y: 37,
            x: -20,
            flex: {
              direction: 'row',
              paddingLeft: 20,
              wrap: false
            },
            type: lng$1.components.ListComponent,
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
            // x: 10 + 25,
            y: 395,
            h: 30,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 25,
              text: Language.translate('Lightning Apps'),
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF
            }
          },
          MetroApps: {
            x: -20,
            y: 435,
            type: lng$1.components.ListComponent,
            flex: {
              direction: 'row',
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
            // x: 10 + 25,
            y: 673,
            h: 30,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 25,
              text: Language.translate('Featured Video on Demand'),
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF
            }
          },
          TVShows: {
            x: -20,
            y: 710,
            w: 1745,
            h: 400,
            type: lng$1.components.ListComponent,
            flex: {
              direction: 'row',
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
            // x: 10 + 25,
            y: 948,
            h: 30,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 25,
              text: Language.translate('Partner Apps'),
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF
            }
          },
          UsbApps: {
            x: -20,
            y: 988,
            type: lng$1.components.ListComponent,
            flex: {
              direction: 'row',
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

    _init() {
      this.settingsScreen = false;

      this._setState('AppList');

      this.indexVal = 0;
      const config = {
        host: '127.0.0.1',
        port: 9998,
        default: 1
      };
      let appApi = new AppApi();
      this.usbApi = new UsbApi();
      this.xcastApi = new XcastApi();
      let thunder = thunderJS(config);
      thunder.on('Controller', 'statechange', notification => {
        console.log(JSON.stringify(notification));

        if (notification && (notification.callsign === 'Cobalt' || notification.callsign === 'Amazon' || notification.callsign === 'LightningApp') && notification.state == 'Deactivation') {
          Storage.set('applicationType', '');
          appApi.setVisibility('ResidentApp', true);
          thunder.call('org.rdk.RDKShell', 'moveToFront', {
            client: 'ResidentApp'
          }).then(result => {
            console.log('ResidentApp moveToFront Success' + JSON.stringify(result));
          });
          thunder.call('org.rdk.RDKShell', 'setFocus', {
            client: 'ResidentApp'
          }).then(result => {
            console.log('ResidentApp setFocus Success' + JSON.stringify(result));
          }).catch(err => {
            console.log('Error', err);
          });
        }
      });
    }
    /**
     * Function to set details of items in app list.
     */


    set appItems(items) {
      this.tag('AppList').items = items.map((info, idx) => {
        return {
          w: 454,
          h: 255,
          type: ListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          idx: idx
        };
      });
      this.tag('AppList').start();
    }

    set metroApps(items) {
      this.tag('MetroApps').items = items.map((info, index) => {
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
      this.tag('MetroApps').start();
    }
    /**
     * Function to set details of items in tv shows list.
     */


    set tvShowItems(items) {
      this.tag('TVShows').items = items.map((info, idx) => {
        return {
          w: 257,
          h: 145,
          type: ListItem,
          data: info,
          focus: 1.15,
          unfocus: 1,
          idx: idx
        };
      });
      this.tag('TVShows').start();
    }

    set usbApps(items) {
      console.log(`usb apps set function was called using the arguments ${items}`);

      if (!items.length) {
        this.tag('Text4').visible = false;
      }

      this.tag('UsbApps').items = items.map((info, index) => {
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
      this.tag('UsbApps').start();
    }
    /**
     * Function to set the state in main view.
     */


    set index(index) {
      this.indexVal = index;

      if (this.indexVal == 0) {
        this._setState('AppList');
      } else if (this.indexVal == 1) {
        this._setState('MetroApps');
      } else if (this.indexVal == 2) {
        this._setState('TVShows');
      } else if (this.indexVal == 3) {
        this._setState('RightArrow');
      }
    }
    /**
     * Function to reset the main view rows to initial state.
     */


    reset() {
      for (let i = this.tag('AppList').index; i > 0; i--) {
        this.tag('AppList').setPrevious();
      }

      for (let i = this.tag('MetroApps').index; i > 0; i--) {
        this.tag('MetroApps').setPrevious();
      }

      for (let i = this.tag('TVShows').index; i > 0; i--) {
        this.tag('TVShows').setPrevious();
      }

      for (let i = this.tag("UsbApps").index; i > 0; i--) {
        this.tag('UsbApps').setPrevious();
      }
    }
    /**
     * Function to define various states needed for main view.
     */


    static _states() {
      return [class AppList extends this {
        _getFocused() {
          this.tag('Text1').text.fontStyle = 'bold';

          if (this.tag('AppList').length) {
            this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('AppList').element.data.url);
            return this.tag('AppList').element;
          }
        }

        _handleDown() {
          this._setState('MetroApps');
        }

        _handleRight() {
          if (this.tag('AppList').length - 1 != this.tag('AppList').index) {
            this.tag('AppList').setNext();
            return this.tag('AppList').element;
          }
        }

        _handleUp() {
          this.fireAncestors('$goToTopPanel', 2);
        }

        _handleLeft() {
          this.tag('Text1').text.fontStyle = 'normal';

          if (0 != this.tag('AppList').index) {
            this.tag('AppList').setPrevious();
            return this.tag('AppList').element;
          } else {
            this.reset();
            this.fireAncestors('$goToSidePanel', 0);
          }
        }

        _handleEnter() {
          let appApi = new AppApi();
          let applicationType = this.tag('AppList').items[this.tag('AppList').index].data.applicationType;
          this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri;
          applicationType = this.tag('AppList').items[this.tag('AppList').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri;

          if (Storage.get('applicationType') == 'Cobalt') {
            appApi.launchCobalt(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'WebApp' && Storage.get('ipAddress')) {
            appApi.launchWeb(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Lightning' && Storage.get('ipAddress')) {
            appApi.launchLightning(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
            appApi.launchNative(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Amazon') {
            console.log('Launching app');
            fetch('http://127.0.0.1:9998/Service/Controller/').then(res => res.json()).then(data => {
              console.log(data);
              data.plugins.forEach(element => {
                if (element.callsign === 'Amazon') {
                  console.log('Opening Amazon');
                  appApi.launchPremiumApp('Amazon');
                  appApi.setVisibility('ResidentApp', false);
                }
              });
            }).catch(err => {
              console.log('Amazon not working');
            });
          } else if (Storage.get('applicationType') == 'Netflix') {
            console.log('Launching app');
            fetch('http://127.0.0.1:9998/Service/Controller/').then(res => res.json()).then(data => {
              console.log(data);
              data.plugins.forEach(element => {
                if (element.callsign === 'Netflix') {
                  console.log('Opening Netflix');
                  appApi.launchPremiumApp('Netflix');
                  appApi.setVisibility('ResidentApp', false);
                }
              });
            }).catch(err => {
              console.log('Netflix not working');
            });
          } else {
            if (this.uri === 'USB') {
              this.usbApi.getMountedDevices().then(result => {
                if (result.mounted.length === 1) {
                  this.fireAncestors('$goToUsb');
                }
              });
            }
          }
        }

      }, class MetroApps extends this {
        _getFocused() {
          this.tag('Text2').text.fontStyle = 'bold';

          if (this.tag('MetroApps').length) {
            this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('MetroApps').element.data.url);
            return this.tag('MetroApps').element;
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
          } else {
            this.reset();
            this.fireAncestors('$goToSidePanel', 1);
          }
        }

        _handleEnter() {
          let appApi = new AppApi();
          let applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
          this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;
          applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;

          if (Storage.get('applicationType') == 'Cobalt') {
            appApi.launchCobalt(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'WebApp' && Storage.get('ipAddress')) {
            appApi.launchWeb(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Lightning' && Storage.get('ipAddress')) {
            appApi.launchLightning(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
            appApi.launchNative(this.uri);
            appApi.setVisibility('ResidentApp', false);
          }
        }

      }, class TVShows extends this {
        $enter() {
          this.fireAncestors('$scroll', -350);
        }

        _handleUp() {
          this._setState('MetroApps');
        }

        _getFocused() {
          this.tag('Text3').text.fontStyle = 'bold';

          if (this.tag('TVShows').length) {
            return this.tag('TVShows').element;
          }
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
          } else {
            this.reset();
            this.fireAncestors('$goToSidePanel', 2);
          }
        }

        _handleDown() {
          if (this.tag('UsbApps').length) {
            this._setState("UsbApps");
          }
        }

        _handleEnter() {
          if (Storage.get('ipAddress')) {
            this.fireAncestors('$goToPlayer');
          }
        }

        $exit() {
          this.fireAncestors('$scroll', 0);
        }

      }, class UsbApps extends this {
        $enter() {
          this.fireAncestors('$scroll', -550);
        }

        $exit() {
          this.fireAncestors('$scroll', -350);
        }

        _getFocused() {
          this.tag('Text4').text.fontStyle = 'bold';

          if (this.tag('UsbApps').length) {
            this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('UsbApps').element.data.url);
            return this.tag('UsbApps').element;
          }
        }

        _handleUp() {
          this._setState('TVShows');
        }

        _handleRight() {
          if (this.tag('UsbApps').length - 1 != this.tag('MetroApps').index) {
            this.tag('UsbApps').setNext();
            return this.tag('UsbApps').element;
          }
        }

        _handleLeft() {
          this.tag('Text4').text.fontStyle = 'normal';

          if (0 != this.tag('UsbApps').index) {
            this.tag('UsbApps').setPrevious();
            return this.tag('UsbApps').element;
          } else {
            this.reset();
            this.fireAncestors('$goToSidePanel', 1);
          }
        }

        _handleEnter() {
          let appApi = new AppApi();
          let applicationType = this.tag('UsbApps').items[this.tag('UsbApps').index].data.applicationType;
          this.uri = this.tag('UsbApps').items[this.tag('UsbApps').index].data.uri;
          applicationType = this.tag('UsbApps').items[this.tag('UsbApps').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('UsbApps').items[this.tag('UsbApps').index].data.uri;

          if (Storage.get('applicationType') == 'Cobalt') {
            appApi.launchCobalt(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'WebApp' && Storage.get('ipAddress')) {
            appApi.launchWeb(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Lightning' && Storage.get('ipAddress')) {
            appApi.launchLightning(this.uri);
            appApi.setVisibility('ResidentApp', false);
          } else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
            appApi.launchNative(this.uri);
            appApi.setVisibility('ResidentApp', false);
          }
        }

      }, class RightArrow extends this {//TODO
      }, class LeftArrow extends this {//TODO
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
   * Class to render items in side panel.
   */

  class SidePanelItem extends lng$1.Component {
    /**
     * Function to render various elements in the side panel item.
     */
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
              textColor: 0xffffffff
            }
          }
        }
      };
    }

    _init() {
      this.tag('Image').patch({
        src: Utils.asset(this.data.url),
        w: this.w,
        h: this.h,
        scale: this.unfocus
      });
    }
    /**
     * Function to change properties of item during focus.
     */


    _focus() {
      this.tag('Image').patch({
        w: this.w,
        h: this.h,
        scale: this.focus,
        color: CONFIG.theme.hex
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
        color: 0xffffffff
      });
    }

    setColor() {
      this.tag('Image').patch({
        w: this.w,
        h: this.h,
        scale: this.focus,
        color: CONFIG.theme.hex
      });
    }

    clearColor() {
      this.tag('Image').patch({
        w: this.w,
        h: this.h,
        scale: this.unfocus,
        color: 0xffffffff
      });
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
  class Network {
    constructor() {
      this._events = new Map();
      const config = {
        host: '127.0.0.1',
        port: 9998,
        default: 1
      };
      this._thunder = thunderJS(config);
      this.callsign = 'org.rdk.Network.1';
    }
    /**
     * Function to activate network plugin
     */


    activate() {
      return new Promise((resolve, reject) => {
        this._thunder.call('Controller', 'activate', {
          callsign: this.callsign
        }).then(result => {
          this._thunder.on(this.callsign, 'onIPAddressStatusChanged', notification => {
            if (this._events.has('onIPAddressStatusChanged')) {
              this._events.get('onIPAddressStatusChanged')(notification);
            }
          });

          this._thunder.on(this.callsign, 'onDefaultInterfaceChanged', notification => {
            if (this._events.has('onDefaultInterfaceChanged')) {
              this._events.get('onDefaultInterfaceChanged')(notification);
            }
          });

          this._thunder.on(this.callsign, 'onConnectionStatusChanged', notification => {
            if (this._events.has('onConnectionStatusChanged')) {
              this._events.get('onConnectionStatusChanged')(notification);
            }
          });

          console.log('Activation success');
          resolve(true);
        });
      });
    }
    /**
     *Register events and event listeners.
     * @param {string} eventId
     * @param {function} callback
     *
     */


    registerEvent(eventId, callback) {
      this._events.set(eventId, callback);
    }
    /**
     * Function to return the IP of the default interface.
     */


    getIP() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'getStbIp').then(result => {
          if (result.success) {
            resolve(result.ip);
          }

          reject(false);
        }).catch(err => {
          reject(err);
        });
      });
    }
    /**
     * Function to return available interfaces.
     */


    getInterfaces() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'getInterfaces').then(result => {
          if (result.success) {
            resolve(result.interfaces);
          }
        }).catch(err => {
          console.error(`getInterfaces fail: ${err}`);
          reject(err);
        });
      });
    }
    /**
     * Function to return default interfaces.
     */


    getDefaultInterface() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'getDefaultInterface').then(result => {
          if (result.success) {
            resolve(result.interface);
          }
        }).catch(err => {
          console.error(`getDefaultInterface fail: ${err}`);
          reject(err);
        });
      });
    }

    setDefaultInterface(interfaceName) {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'setDefaultInterface', {
          "interface": interfaceName,
          "persist": true
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.error(`setDefaultInterface fail: ${err}`);
          reject(err);
        });
      });
    }

    getSTBIPFamily() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'getSTBIPFamily').then(result => {//need to check
        });
      });
    }
    /**
     * Function to return IP Settings.
     */


    getIPSettings(currentInterface) {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'getIPSettings', {
          "interface": currentInterface
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.error(`getIPSettings fail: ${err}`);
          reject(err);
        });
      });
    }
    /**
     * Function to set IP Settings.
     */


    setIPSettings(IPSettings) {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'setIPSettings', IPSettings).then(result => {
          resolve(result);
        }).catch(err => {
          console.error(`setIPSettings fail: ${err}`);
          reject(err);
        });
      });
    }

    isConnectedToInternet() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'isConnectedToInternet').then(result => {
          if (result.success) {
            resolve(result.connectedToInternet);
          }
        }).catch(err => {
          console.error(`isConnectedToInternet fail: ${err}`);
          reject(err);
        });
      });
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
    url: '/images/apps/amazon_prime.jpg'
  }, {
    displayName: 'Youtube',
    applicationType: 'Cobalt',
    uri: 'https://www.youtube.com/tv',
    url: '/images/apps/youtube.jpg'
  }, {
    displayName: 'Xumo',
    applicationType: 'WebApp',
    uri: 'https://x1box-app.xumo.com/3.0.70/index.html',
    url: '/images/apps/xumo.png'
  }, {
    displayName: 'Netflix',
    applicationType: 'Netflix',
    uri: '',
    url: '/images/apps/content1.png'
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
   * Class which contains data for settings listings.
   */
  var settingsInfo = [{
    displayName: 'Bluetooth',
    url: '/images/settings/bluetooth.jpg'
  }, {
    displayName: 'Wi-Fi',
    url: '/images/settings/wifi.jpg'
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
   * Class which contains data for listings in side panel.
   */
  var sidePanelInfo = [{
    title: 'Apps',
    url: '/images/sidePanel/menu.png'
  }, {
    title: 'Metro Apps',
    url: '/images/sidePanel/metro.png'
  }, {
    title: 'TV Shows',
    url: '/images/sidePanel/video.png'
  }, {
    title: 'Settings',
    url: '/images/sidePanel/settings.png'
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
   * Class which contains data for app listings.
   */
  var rightArrowInfo = [{
    url: '/images/right-small.png'
  }, {
    url: '/images/right-small.png'
  }, {
    url: '/images/right-small.png'
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
   * Class which contains data for app listings.
   */
  var leftArrowInfo = [{
    url: '/images/left-small.png'
  }, {
    url: '/images/left-small.png'
  }, {
    url: '/images/left-small.png'
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
   * Class which contains data for UI selection.
   */
  var uiInfo = [{
    title: 'DEFAULT',
    url: '/images/splash/DefaultUI.png',
    uri: ''
  }, {
    title: 'LIVE',
    url: '/images/splash/LiveTv.png',
    uri: 'http://35.155.171.121:8088/index.html'
  }, {
    title: 'TATA',
    url: '/images/splash/TataElxsi.png',
    uri: 'http://35.155.171.121:8088/index.html'
  }, {
    title: 'EPAM',
    url: '/images/splash/Epam.png',
    uri: 'https://px-apps.sys.comcast.net/lightning_apps/diagnostics/dist/index.html'
  }, {
    title: 'NEW',
    url: '/images/splash/NewUi.png',
    uri: 'https://px-apps.sys.comcast.net/lightning_apps/diagnostics/dist/index.html'
  }, {
    title: 'COMINGSOON',
    url: '/images/splash/ComingSoon.png',
    uri: 'https://px-apps.sys.comcast.net/lightning_apps/diagnostics/dist/index.html'
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
    displayName: 'Bluetooth Audio',
    applicationType: 'Lightning',
    uri: 'https://apps.rdkcentral.com/rdk-apps/BluetoothAudio/index.html',
    url: '/images/apps/content2.png'
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
    displayName: 'Bluetooth Audio',
    applicationType: 'Lightning',
    uri: 'https://apps.rdkcentral.com/rdk-apps/BluetoothAudio/index.html',
    url: '/images/apps/content2.png'
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
  var partnerApps = [];
  /**
   * Get the ip address.
   */

  var IpAddress1 = '';
  var IpAddress2 = '';
  var networkApi = new Network();
  networkApi.getIP().then(ip => {
    IpAddress1 = ip;
    Storage.set('ipAddress', IpAddress1);
  }).catch(() => {
    Storage.set('ipAddress', null);
  });
  var appApi$4 = new AppApi();
  appApi$4.getIP().then(ip => {
    IpAddress2 = ip;
  });
  /**
   * Class that returns the data required for home screen.
   */

  class HomeApi {
    /**
     * Function to get details for app listing.
     */
    getAppListInfo() {
      return appListInfo;
    }
    /**
     * Function to get details for tv shows listings.
     */


    getTVShowsInfo() {
      return tvShowsInfo;
    }
    /**
     * Function to get details for settings listings.
     */


    getSettingsInfo() {
      return settingsInfo;
    }
    /**
     * Function to get details for side panel.
     */


    getSidePanelInfo() {
      return sidePanelInfo;
    }
    /**
     * Function to get details of different UI
     */


    getUIInfo() {
      return uiInfo;
    }
    /**
     * Function to details of metro apps
     */


    getMetroInfo() {
      let metroAppsMetaData;

      if (IpAddress1 || IpAddress2) {
        metroAppsMetaData = metroAppsInfo;
      } else {
        metroAppsMetaData = metroAppsInfoOffline;
      }

      return metroAppsMetaData;
    }
    /**
     * Function to store partner app details.
     * @param {obj} data Partner app details.
     */


    setPartnerAppsInfo(data) {
      partnerApps = data;
    }
    /**
     *Function to return partner app details.
     */


    getPartnerAppsInfo() {
      return partnerApps;
    }
    /**
    * Function to details of right arrow
    */


    getRightArrowInfo() {
      return rightArrowInfo;
    }
    /**
      * Function to details of left arrow
      */


    getLeftArrowInfo() {
      return leftArrowInfo;
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
  /** Class for side panel in home UI */

  class SidePanel extends lng$1.Component {
    static _template() {
      return {
        SidePanel: {
          x: 0,
          y: 127,
          w: 240,
          h: 750,
          type: lng$1.components.ListComponent,
          roll: true,
          horizontal: false,
          invertDirection: true
        }
      };
    }

    _init() {
      console.log('Side Panel init');
      this.homeApi = new HomeApi();
      this.tag('SidePanel').sidePanelItems = this.homeApi.getSidePanelInfo();
      this.sidePanelData = this.homeApi.getSidePanelInfo();

      this._setState('SidePanel');

      this.indexVal = 0;
      this.prevIndex = 0;
    }
    /**
     * Function to set items in side panel.
     */


    set sidePanelItems(items) {
      this.tag('SidePanel').patch({
        x: 105
      });
      this.tag('SidePanel').items = items.map((info, index) => {
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
      this.tag('SidePanel').start();
    }
    /**
     * Function to reset items in side panel.
     */


    set resetSidePanelItems(items) {
      this.tag('SidePanel').patch({
        x: 0
      });
      this.tag('SidePanel').items = items.map((info, index) => {
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
      this.tag('SidePanel').start();
    }
    /**
     * Function to set scaling to side panel.
     */


    set scale(scale) {
      this.tag('SidePanel').patch({
        scale: scale
      });
    }
    /**
     * Function to set x coordinate of side panel.
     */


    set x(x) {
      this.tag('SidePanel').patch({
        x: x
      });
    }
    /**
     * Function to set index value of side panel.
     */


    set index(index) {
      this.tag('SidePanel').items[this.prevIndex].clearColor();
      this.indexVal = index;
    }

    set deFocus(val) {
      if (val) {
        this.tag('SidePanel').items[this.prevIndex].clearColor();
      } else {
        this.tag('SidePanel').items[this.prevIndex].setColor();
      }
    }

    set scrollableLastRow(bool) {
      this.isLastRowScrollable = bool;
    }

    static _states() {
      return [class SidePanel extends this {
        _getFocused() {
          if (this.tag('SidePanel').length) {
            if (this.indexVal >= 3 && this.isLastRowScrollable) {
              this.fireAncestors('$scroll', -550);
            } else if (this.indexVal >= 2) {
              this.fireAncestors('$scroll', -350);
            } else {
              this.fireAncestors('$scroll', 0);
            }

            return this.tag('SidePanel').items[this.indexVal];
          }
        }

        _handleKey(key) {
          if (key.keyCode == keyMap.ArrowRight || key.keyCode == keyMap.Enter) {
            if (this.prevIndex != this.indexVal) {
              this.tag('SidePanel').items[this.prevIndex].clearColor();
            }

            this.fireAncestors('$goToMainView', this.indexVal == 3 ? 2 : this.indexVal);
            this.tag('SidePanel').items[this.indexVal].setColor();
            this.prevIndex = this.indexVal;
          } else if (key.keyCode == keyMap.ArrowDown) {
            if (this.tag('SidePanel').length - 1 != this.indexVal) {
              this.indexVal = this.indexVal + 1;
            }

            return this.tag('SidePanel').items[this.indexVal];
          } else if (key.keyCode == keyMap.ArrowUp) {
            if (0 === this.indexVal) {
              this.fireAncestors('$goToTopPanel', 0);
            } else {
              this.indexVal = this.indexVal - 1;
              return this.tag('SidePanel').items[this.indexVal];
            }
          } else return false;
        }

      }];
    }

  }

  var $$observable = function () {
    return typeof Symbol === 'function' && Symbol.observable || '@@observable';
  }();
  /**
   * These are private action types reserved by Redux.
   * For any unknown actions, you must return the current state.
   * If the current state is undefined, you must return the initial state.
   * Do not reference these action types directly in your code.
   */


  var randomString = function randomString() {
    return Math.random().toString(36).substring(7).split('').join('.');
  };

  var ActionTypes = {
    INIT: "@@redux/INIT" + randomString(),
    REPLACE: "@@redux/REPLACE" + randomString(),
    PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
      return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
    }
  };
  /**
   * @param {any} obj The object to inspect.
   * @returns {boolean} True if the argument appears to be a plain object.
   */

  function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = obj;

    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
  } // Inlined / shortened version of `kindOf` from https://github.com/jonschlinkert/kind-of


  function miniKindOf(val) {
    if (val === void 0) return 'undefined';
    if (val === null) return 'null';
    var type = typeof val;

    switch (type) {
      case 'boolean':
      case 'string':
      case 'number':
      case 'symbol':
      case 'function':
        {
          return type;
        }
    }

    if (Array.isArray(val)) return 'array';
    if (isDate(val)) return 'date';
    if (isError(val)) return 'error';
    var constructorName = ctorName(val);

    switch (constructorName) {
      case 'Symbol':
      case 'Promise':
      case 'WeakMap':
      case 'WeakSet':
      case 'Map':
      case 'Set':
        return constructorName;
    } // other


    return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
  }

  function ctorName(val) {
    return typeof val.constructor === 'function' ? val.constructor.name : null;
  }

  function isError(val) {
    return val instanceof Error || typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number';
  }

  function isDate(val) {
    if (val instanceof Date) return true;
    return typeof val.toDateString === 'function' && typeof val.getDate === 'function' && typeof val.setDate === 'function';
  }

  function kindOf(val) {
    var typeOfVal = typeof val;

    {
      typeOfVal = miniKindOf(val);
    }

    return typeOfVal;
  }
  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */


  function createStore(reducer, preloadedState, enhancer) {
    var _ref2;

    if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
      throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.');
    }

    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
      enhancer = preloadedState;
      preloadedState = undefined;
    }

    if (typeof enhancer !== 'undefined') {
      if (typeof enhancer !== 'function') {
        throw new Error("Expected the enhancer to be a function. Instead, received: '" + kindOf(enhancer) + "'");
      }

      return enhancer(createStore)(reducer, preloadedState);
    }

    if (typeof reducer !== 'function') {
      throw new Error("Expected the root reducer to be a function. Instead, received: '" + kindOf(reducer) + "'");
    }

    var currentReducer = reducer;
    var currentState = preloadedState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;
    /**
     * This makes a shallow copy of currentListeners so we can use
     * nextListeners as a temporary list while dispatching.
     *
     * This prevents any bugs around consumers calling
     * subscribe/unsubscribe in the middle of a dispatch.
     */

    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }
    /**
     * Reads the state tree managed by the store.
     *
     * @returns {any} The current state tree of your application.
     */


    function getState() {
      if (isDispatching) {
        throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
      }

      return currentState;
    }
    /**
     * Adds a change listener. It will be called any time an action is dispatched,
     * and some part of the state tree may potentially have changed. You may then
     * call `getState()` to read the current state tree inside the callback.
     *
     * You may call `dispatch()` from a change listener, with the following
     * caveats:
     *
     * 1. The subscriptions are snapshotted just before every `dispatch()` call.
     * If you subscribe or unsubscribe while the listeners are being invoked, this
     * will not have any effect on the `dispatch()` that is currently in progress.
     * However, the next `dispatch()` call, whether nested or not, will use a more
     * recent snapshot of the subscription list.
     *
     * 2. The listener should not expect to see all state changes, as the state
     * might have been updated multiple times during a nested `dispatch()` before
     * the listener is called. It is, however, guaranteed that all subscribers
     * registered before the `dispatch()` started will be called with the latest
     * state by the time it exits.
     *
     * @param {Function} listener A callback to be invoked on every dispatch.
     * @returns {Function} A function to remove this change listener.
     */


    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error("Expected the listener to be a function. Instead, received: '" + kindOf(listener) + "'");
      }

      if (isDispatching) {
        throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
      }

      var isSubscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }

        if (isDispatching) {
          throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
        }

        isSubscribed = false;
        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
        currentListeners = null;
      };
    }
    /**
     * Dispatches an action. It is the only way to trigger a state change.
     *
     * The `reducer` function, used to create the store, will be called with the
     * current state tree and the given `action`. Its return value will
     * be considered the **next** state of the tree, and the change listeners
     * will be notified.
     *
     * The base implementation only supports plain object actions. If you want to
     * dispatch a Promise, an Observable, a thunk, or something else, you need to
     * wrap your store creating function into the corresponding middleware. For
     * example, see the documentation for the `redux-thunk` package. Even the
     * middleware will eventually dispatch plain object actions using this method.
     *
     * @param {Object} action A plain object representing “what changed”. It is
     * a good idea to keep actions serializable so you can record and replay user
     * sessions, or use the time travelling `redux-devtools`. An action must have
     * a `type` property which may not be `undefined`. It is a good idea to use
     * string constants for action types.
     *
     * @returns {Object} For convenience, the same action object you dispatched.
     *
     * Note that, if you use a custom middleware, it may wrap `dispatch()` to
     * return something else (for example, a Promise you can await).
     */


    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error("Actions must be plain objects. Instead, the actual type was: '" + kindOf(action) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
      }

      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
      }

      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.');
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
    /**
     * Replaces the reducer currently used by the store to calculate the state.
     *
     * You might need this if your app implements code splitting and you want to
     * load some of the reducers dynamically. You might also need this if you
     * implement a hot reloading mechanism for Redux.
     *
     * @param {Function} nextReducer The reducer for the store to use instead.
     * @returns {void}
     */


    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') {
        throw new Error("Expected the nextReducer to be a function. Instead, received: '" + kindOf(nextReducer));
      }

      currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
      // Any reducers that existed in both the new and old rootReducer
      // will receive the previous state. This effectively populates
      // the new state tree with any relevant data from the old one.

      dispatch({
        type: ActionTypes.REPLACE
      });
    }
    /**
     * Interoperability point for observable/reactive libraries.
     * @returns {observable} A minimal observable of state changes.
     * For more information, see the observable proposal:
     * https://github.com/tc39/proposal-observable
     */


    function observable() {
      var _ref;

      var outerSubscribe = subscribe;
      return _ref = {
        /**
         * The minimal observable subscription method.
         * @param {Object} observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns {subscription} An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */
        subscribe: function subscribe(observer) {
          if (typeof observer !== 'object' || observer === null) {
            throw new Error("Expected the observer to be an object. Instead, received: '" + kindOf(observer) + "'");
          }

          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }

          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe: unsubscribe
          };
        }
      }, _ref[$$observable] = function () {
        return this;
      }, _ref;
    } // When a store is created, an "INIT" action is dispatched so that every
    // reducer returns their initial state. This effectively populates
    // the initial state tree.


    dispatch({
      type: ActionTypes.INIT
    });
    return _ref2 = {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    }, _ref2[$$observable] = observable, _ref2;
  }
  /**
   * Prints a warning in the console if it exists.
   *
   * @param {String} message The warning message.
   * @returns {void}
   */


  function warning(message) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(message);
    }
    /* eslint-enable no-console */


    try {
      // This error was thrown as a convenience so that if you enable
      // "break on all exceptions" in your console,
      // it would pause the execution at this line.
      throw new Error(message);
    } catch (e) {} // eslint-disable-line no-empty

  }
  /*
   * This is a dummy function to check if the function name has been altered by minification.
   * If the function has been minified and NODE_ENV !== 'production', warn the user.
   */


  function isCrushed() {}

  if (typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
    warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
  }

  function counter(state, action) {
    if (typeof state === 'undefined') {
      return 0;
    }

    switch (action.type) {
      case 'ACTION_LISTEN_START':
        return "ACTION_LISTEN_START";

      case 'ACTION_LISTEN_STOP':
        return "ACTION_LISTEN_STOP";

      default:
        return state;
    }
  }

  let store = createStore(counter);

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
  /** Class for top panel in home UI */

  class TopPanel extends lng$1.Component {
    static _template() {
      return {
        TopPanel: {
          x: 0,
          y: 0,
          w: 1920,
          h: 171,
          Mic: {
            x: 105,
            // zIndex: 2,
            y: 87,
            src: Utils.asset('/images/topPanel/microphone.png'),
            w: 50,
            h: 50
          },
          Logo: {
            x: 200,
            y: 90,
            src: Utils.asset('/images/' + CONFIG.theme.logo),
            w: 227,
            h: 43
          },
          Page: {
            x: 200,
            y: 184,
            // mountY: 0.5,
            text: {
              fontSize: 40,
              text: Language.translate('home'),
              textColor: CONFIG.theme.hex,
              fontStyle: 'bolder',
              fontFace: CONFIG.language.font
            }
          },
          Settings: {
            x: 1825 - 105 - 160 - 37 + 30,
            y: 111,
            mountY: 0.5,
            src: Utils.asset('/images/topPanel/setting.png'),
            w: 37,
            h: 37
          },
          Time: {
            x: 1920 - 105 - 160,
            y: 111,
            mountY: 0.5,
            text: {
              text: '',
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
      this.indexVal = 0, this.timeZone = null;
      this.audiointerval = null;
      new AppApi().getZone().then(function (res) {
        this.timeZone = res;
      }.bind(this)).catch(err => {
        console.log('Timezone api request error', err);
      });

      function render() {
        if (store.getState() == 'ACTION_LISTEN_STOP') {
          this.tag('AudioListenSymbol').visible = false;
          clearInterval(this.audiointerval);
          this.audiointerval = null;
        } else if (store.getState() == 'ACTION_LISTEN_START') {
          if (!this.audiointerval) {
            this.tag('AudioListenSymbol').visible = true;
            let mode = 1;
            this.audiointerval = setInterval(function () {
              if (mode % 2 == 0) {
                this.tag('AudioListenSymbol').w = 80;
                this.tag('AudioListenSymbol').h = 80;
              } else {
                this.tag('AudioListenSymbol').w = 70;
                this.tag('AudioListenSymbol').h = 70;
              }

              mode++;

              if (mode > 20) {
                mode = 0;
              }
            }.bind(this), 250);
          }
        }
      }

      store.subscribe(render.bind(this));
      this.zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    set index(index) {
      this.indexVal = index;

      if (this.indexVal == 0) {
        this._setState('Mic');
      } else if (this.indexVal == 1) {
        this._setState('Search');
      } else if (this.indexVal == 2) {
        this.tag('Settings').color = CONFIG.theme.hex;

        this._setState('Setting');
      }
    }

    set changeText(text) {
      this.tag('Page').text.text = text;

      if (text === 'Home') {
        this.tag('Settings').color = 0xffffffff;
      }
    }
    /**
    *
    * @param {boolean} toggle
    * Function to change the mic icon.
    */


    set changeMic(toggle) {
      if (toggle) {
        this.tag('Mic').src = Utils.asset('/images/topPanel/microphone_mute.png');
      } else {
        this.tag('Mic').src = Utils.asset('/images/topPanel/microphone.png');
      }
    }

    _build() {
      setInterval(() => {
        let _date = this.updateTime();

        if (this.zone) {
          this.tag('Time').patch({
            text: {
              text: _date.strTime
            }
          });
        }
      }, 1000);
    }

    updateIcon(tagname, url) {
      this.tag(tagname).patch({
        src: Utils.asset(url)
      });
    }
    /**
     * Function to update time in home UI.
     */


    updateTime() {
      if (this.zone) {
        let date = new Date();
        date = new Date(date.toLocaleString('en-US', {
          timeZone: this.zone
        })); // get day

        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let strDay = days[date.getDay()]; // get month

        let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let strMonth = month[date.getMonth()];
        let strDate = date.toLocaleDateString('en-US', {
          day: '2-digit'
        }) + ' ' + strMonth + ' ' + date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
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
          this.tag('Mic').color = CONFIG.theme.hex;
        }

        _handleEnter() {}

        _getFocused() {
          this.tag('Mic').color = CONFIG.theme.hex;
        }

        $exit() {
          this.tag('Mic').color = 0xffffffff;
        }

        _handleKey(key) {
          if (key.keyCode == keyMap.ArrowRight || key.keyCode == keyMap.Enter) {
            this._setState('Setting');
          } else if (key.keyCode == keyMap.ArrowDown) {
            this.tag('Mic').color = 0xffffffff;
            this.fireAncestors('$goToSidePanel', 0);
          }
        }

      }, class Setting extends this {
        $enter() {
          this.tag('Settings').color = CONFIG.theme.hex;
        }

        _handleDown() {
          this.fireAncestors('$goToMainView', 0);
          this.tag('Settings').color = 0xffffffff;
        }

        _handleLeft() {
          this._setState('Mic');
        }

        _handleEnter() {
          this.tag('Page').text.text = Language.translate('settings');
          this.fireAncestors('$goToSettings');
        }

        $exit() {
          this.tag('Settings').color = 0xffffffff;
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

  /**Color constants */
  var COLORS = {
    textColor: 0xffffffff,
    titleColor: 0xffffffff,
    hightlightColor: 0xffc0c0c0,
    headingColor: 0xffffffff
  };

  var img$5 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAACxLAAAsSwGlPZapAAAGx2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTAyVDE2OjE4OjUyLTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0yMVQxMDoxNTo1Ny0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0yMVQxMDoxNTo1Ny0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1MWJjNzY4MC0zY2ViLTRmZWItYmY2Zi1kMGIzN2UyYWYyNDkiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmZDE3NTAzYy1jMWIxLWQ5NGMtODBlYi0zZmVlZWNmNWU4ZTciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1ZDhkZThiYi0xNjJkLTQwODktYjg2OS0wMjYzZGY3ZmNkMTMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjVkOGRlOGJiLTE2MmQtNDA4OS1iODY5LTAyNjNkZjdmY2QxMyIgc3RFdnQ6d2hlbj0iMjAyMS0wOC0wMlQxNjoxODo1Mi0wNjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY3YmJmOWQ2LTc5NjktNDgzYS1hN2ViLWI0Mzg0YzM0MmMzYSIgc3RFdnQ6d2hlbj0iMjAyMS0wOS0yMVQwOToyNDo0OC0wNjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjUgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUxYmM3NjgwLTNjZWItNGZlYi1iZjZmLWQwYjM3ZTJhZjI0OSIgc3RFdnQ6d2hlbj0iMjAyMS0wOS0yMVQxMDoxNTo1Ny0wNjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjUgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+9I+Q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";

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
   * Class for rendering items in Settings screen.
   */

  class SettingsItem extends lng$1.Component {
    static _template() {
      return {
        zIndex: 1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
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
          color: 0xFFFFFFFF
        }
      };
    }
    /**
     * Function to set contents for an item in settings screen.
     */


    set item(item) {
      this._item = item;
      this.tag('Item').patch({
        Tick: {
          y: 45,
          mountY: 0.5,
          texture: lng$1.Tools.getSvgTexture(img$5, 32.5, 32.5),
          color: 0xffffffff,
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
      this.tag('TopLine').color = CONFIG.theme.hex;
      this.tag('BottomLine').color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag('TopLine').h = 6;
      this.tag('BottomLine').h = 6;
    }

    _unfocus() {
      this.tag('TopLine').color = 0xFFFFFFFF;
      this.tag('BottomLine').color = 0xFFFFFFFF;
      this.patch({
        zIndex: 1
      });
      this.tag('TopLine').h = 3;
      this.tag('BottomLine').h = 3;
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
   * Class for the item in the Bluetooth screen.
   */

  class BluetoothItem extends SettingsItem {
    static _template() {
      return {
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
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
          color: 0xFFFFFFFF
        }
      };
    }
    /**
     * Function to set contents of an item in the Bluetooth screen.
     */


    set item(item) {
      this._item = item;
      this.connected = item.connected ? 'Connected' : 'Not Connected';
      this.status = item.paired ? this.connected : 'Not Paired';
      this.tag('Item').patch({
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
        } //  Debug:{
        //    x: 300,
        //    y:5,
        //    mountY: 0.5,
        //    mountX:1,
        //    Text: { text: { text: `item: ${JSON.stringify(item)}`, fontSize: 15,fontFace:CONFIG.language.font,verticalAlign:"middle" } },
        //  }

      });
    }

    _focus() {
      this.tag('TopLine').color = CONFIG.theme.hex;
      this.tag('BottomLine').color = CONFIG.theme.hex;
      this.patch({
        zIndex: 10
      });
      this.tag('TopLine').h = 6;
      this.tag('BottomLine').h = 6;
    }

    _unfocus() {
      this.tag('TopLine').color = 0xFFFFFFFF;
      this.tag('BottomLine').color = 0xFFFFFFFF;
      this.patch({
        zIndex: 1
      });
      this.tag('TopLine').h = 3;
      this.tag('BottomLine').h = 3;
    } // _handleEnter() {
    //   // this.tag("Item").patch(
    //   //   {
    //   //     text: {
    //   //       text: "this works",
    //   //     }
    //   //   }
    //   // )
    //   this.fireAncestors('$connectBluetooth', this.tag('List').element.ref)
    // }


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
  class SettingsMainItem extends SettingsItem {
    static _template() {
      return {
        zIndex: 1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        },
        Item: {
          w: 1920 - 300,
          h: 90,
          rect: true,
          color: 0x00000000
        },
        BottomLine: {
          y: 0 + 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        }
      };
    }

    _init() {}

    _focus() {
      this.tag('TopLine').color = CONFIG.theme.hex;
      this.tag('BottomLine').color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag('TopLine').h = 6;
      this.tag('BottomLine').h = 6;
    }

    _unfocus() {
      this.tag('TopLine').color = 0xFFFFFFFF;
      this.tag('BottomLine').color = 0xFFFFFFFF;
      this.patch({
        zIndex: 1
      });
      this.tag('TopLine').h = 3;
      this.tag('BottomLine').h = 3;
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
   * Class for Bluetooth thunder plugin apis.
   */

  class BluetoothApi {
    constructor() {
      this._events = new Map();
      this._devices = [];
      this._pairedDevices = [];
      this._connectedDevices = [];
    }
    /**
     * Function to activate the Bluetooth plugin
     */


    activate() {
      return new Promise((resolve, reject) => {
        const config = {
          host: '127.0.0.1',
          port: 9998,
          default: 1
        };
        this._thunder = thunderJS(config);
        this.callsign = 'org.rdk.Bluetooth.1';

        this._thunder.call('Controller', 'activate', {
          callsign: this.callsign
        }).then(result => {
          this._thunder.on(this.callsign, 'onDiscoveredDevice', notification => {
            this.getDiscoveredDevices().then(() => {
              this._events.get('onDiscoveredDevice')(notification);
            });
          });

          this._thunder.on(this.callsign, 'onStatusChanged', notification => {
            if (notification.newStatus === 'PAIRING_CHANGE') {
              this.getPairedDevices().then(() => {
                this._events.get('onPairingChange')(notification);
              });
            } else if (notification.newStatus === 'CONNECTION_CHANGE') {
              this.getConnectedDevices().then(() => {
                this._events.get('onConnectionChange')(notification);
              });
            } else if (notification.newStatus === 'DISCOVERY_STARTED') {
              this.getConnectedDevices().then(() => {
                this._events.get('onDiscoveryStarted')();
              });
            } else if (notification.newStatus === 'DISCOVERY_COMPLETED') {
              this.getConnectedDevices().then(() => {
                this._events.get('onDiscoveryCompleted')();
              });
            }
          });

          this._thunder.on(this.callsign, 'onPairingRequest', notification => {
            this._events.get('onPairingRequest')(notification);
          });

          this._thunder.on(this.callsign, 'onRequestFailed', notification => {
            this._events.get('onRequestFailed')(notification);
          });

          this._thunder.on(this.callsign, 'onConnectionRequest', notification => {
            this._events.get('onConnectionRequest')(notification);
          });

          resolve('Blutooth activated');
        }).catch(err => {
          console.error('Activation failure', err);
          reject('Bluetooth activation failed', err);
        });
      });
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
    /**
     * Function to deactivate the Bluetooth plugin.
     */


    deactivate() {
      this._events = new Map();
      this._thunder = null;
    }
    /**
     * Function to disable the Bluetooth stack.
     */


    disable() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'disable').then(result => {
          resolve(result);
        }).catch(err => {
          console.error(`Can't disable : ${JSON.stringify(err)}`);
          reject();
        });
      });
    }
    /**
     * Function to enable the Bluetooth stack.
     */


    enable() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'enable').then(result => {
          resolve(result);
        }).catch(err => {
          console.error(`Can't enable : ${JSON.stringify(err)}`);
          reject();
        });
      });
    }
    /**
     * Function to start scanning for the Bluetooth devices.
     */


    startScan() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'startScan', {
          timeout: '10',
          profile: `KEYBOARD,
                    MOUSE,
                    JOYSTICK,
                    HUMAN INTERFACE DEVICE`
        }).then(result => {
          if (result.success) resolve();else reject();
        }).catch(err => {
          console.error('Error', err);
          reject();
        });
      });
    }
    /**
     * Function to stop scanning for the Bluetooth devices.
     */


    stopScan() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'stopScan', {}).then(result => {
          if (result.success) resolve();else reject();
        }).catch(err => {
          console.error('Error', err);
          reject();
        });
      });
    }
    /**
     * Function returns the discovered Bluetooth devices.
     */


    getDiscoveredDevices() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'getDiscoveredDevices').then(result => {
          this._devices = result.discoveredDevices;
          resolve(result.discoveredDevices);
        }).catch(err => {
          console.error(`Can't get discovered devices : ${JSON.stringify(err)}`);
          reject();
        });
      });
    }

    get discoveredDevices() {
      return this._devices;
    }
    /**
     * Function returns the paired Bluetooth devices.
     */


    getPairedDevices() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'getPairedDevices').then(result => {
          this._pairedDevices = result.pairedDevices;
          resolve(result.pairedDevices);
        }).catch(err => {
          console.error(`Can't get paired devices : ${err}`);
          reject();
        });
      });
    }

    get pairedDevices() {
      return this._pairedDevices;
    }
    /**
     * Function returns the connected Bluetooth devices.
     */


    getConnectedDevices() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'getConnectedDevices').then(result => {
          this._connectedDevices = result.connectedDevices;
          resolve(result.connectedDevices);
        }).catch(err => {
          console.error(`Can't get connected devices : ${err}`);
          reject();
        });
      });
    }

    get connectedDevices() {
      return this._connectedDevices;
    }
    /**
     *
     * Function to connect a Bluetooth device.
     * @param {number} deviceID Device ID of the Bluetoth client.
     * @param {string} deviceType Device type of the Bluetooth client.
     */


    connect(deviceID, deviceType) {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'connect', {
          deviceID: deviceID,
          deviceType: deviceType,
          connectedProfile: deviceType
        }).then(result => {
          resolve(result.success);
        }).catch(err => {
          console.error('Connection failed', err);
          reject();
        });
      });
    }
    /**
     * Function to disconnect a Bluetooth device.
     *@param {number} deviceID Device ID of the Bluetoth client.
     *@param {string} deviceType Device type of the Bluetooth client.
     */


    disconnect(deviceID, deviceType) {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'disconnect', {
          deviceID: deviceID,
          deviceType: deviceType
        }).then(result => {
          if (result.success) resolve(true);else reject();
        }).catch(err => {
          console.error('disconnect failed', err);
          reject();
        });
      });
    }
    /**
     * Function to unpair a Bluetooth device.
     * @param {number} deviceId
     */


    unpair(deviceId) {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'unpair', {
          deviceID: deviceId
        }).then(result => {
          if (result.success) resolve();else reject();
        }).catch(err => {
          console.error('unpair failed', err);
          reject();
        });
      });
    }
    /**
     * Function to pair a Bluetooth device.
     * @param {number} deviceId
     */


    pair(deviceId) {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'pair', {
          deviceID: deviceId
        }).then(result => {
          if (result.success) resolve();else reject();
        }).catch(err => {
          console.error('Error on pairing', err);
          reject();
        });
      });
    }
    /**
     * Function to respond to client the Bluetooth event.
     * @param {number} deviceID Device ID of the Bluetooth client.
     * @param {string} eventType Name of the event.
     * @param {string} responseValue Response sent to the Bluetooth client.
     */


    respondToEvent(deviceID, eventType, responseValue) {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'respondToEvent', {
          deviceID: deviceID,
          eventType: eventType,
          responseValue: responseValue
        }).then(result => {
          if (result.success) resolve();else reject();
        }).catch(err => {
          console.error('Error on respondToEvent', err);
          reject();
        });
      });
    }
    /**
     * Function to get the discoverable name of the Bluetooth plugin.
     */


    getName() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'getName').then(result => {
          resolve(result.name);
        });
      });
    }

    setAudioStream(deviceID) {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth.1', 'setAudioStream', {
          "deviceID": deviceID,
          "audioStreamName": "AUXILIARY"
        }).then(result => {
          // console.log(JSON.stringify(result))
          this._connectedDevices = result.connectedDevices;
          resolve(result.connectedDevices);
        }).catch(err => {
          console.error(`Can't get connected devices : ${err}`);
          reject();
        });
      });
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
   * Class for pairing screen for the Bluetooth.
   */


  class BluetoothConfirmation extends lng$1.Component {
    static _template() {
      return {
        Background: {
          x: 0,
          y: 0,
          w: 1920,
          h: 2000,
          mount: 0.5,
          rect: true,
          color: 0xff000000
        },
        Title: {
          x: 0,
          y: 0,
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
      this.tag('Title').text = item.name;
    }

    _handleEnter() {
      this.fireAncestors('$pressOK');
    }

    _handleBack() {
      this.fireAncestors('$pressOK');
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

  let _item;
  /**
   * Class for pairing screen for the Bluetooth.
   */


  class BluetoothPairingScreen$1 extends lng$1.Component {
    static _template() {
      return {
        Background: {
          x: 0,
          y: 0,
          w: 1920,
          h: 2000,
          mount: 0.5,
          rect: true,
          color: 0xff000000
        },
        Title: {
          x: 0,
          y: 0,
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
            color: 0xFFFFFFFF,
            Title: {
              x: 100,
              y: 25,
              mount: 0.5,
              text: {
                text: "",
                fontFace: CONFIG.language.font,
                fontSize: 22,
                textColor: 0xFF000000
              }
            }
          },
          Unpair: {
            x: 0 + 220,
            w: 200,
            mountX: 0.5,
            h: 50,
            rect: true,
            color: 0xFFFFFFFF,
            Title: {
              x: 100,
              y: 25,
              mount: 0.5,
              text: {
                text: "Unpair",
                fontFace: CONFIG.language.font,
                fontSize: 22,
                textColor: 0xFF000000
              }
            }
          },
          Cancel: {
            x: 0 + 220 + 220,
            w: 200,
            mountX: 0.5,
            h: 50,
            rect: true,
            color: 0xFF7D7D7D,
            Title: {
              x: 100,
              y: 25,
              mount: 0.5,
              text: {
                text: "Cancel",
                fontFace: CONFIG.language.font,
                fontSize: 22,
                textColor: 0xFF000000
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
      };
    }

    set item(item) {
      _item = item;

      this._setState('ConnectDisconnect');

      this.tag('Title').text = item.name;

      if (item.connected) {
        this.tag('ConnectDisconnect.Title').text = 'Disconnect';
      } else {
        this.tag('ConnectDisconnect.Title').text = 'Connect';
      }
    }

    _init() {
      this._setState('ConnectDisconnect');
    }

    static _states() {
      return [class ConnectDisconnect extends this {
        $enter() {
          this._focus();
        }

        _handleEnter() {
          // this.tag('Pairing').text = "Someting is wrong " + _item.name
          if (_item.connected) {
            // this.tag('Pairing').text = "Connecting to " + _item.name
            this.fireAncestors('$pressEnter', 'Disconnect');
          } else {
            // this.tag('Pairing').text = "Disconnecting from " + _item.name
            this.fireAncestors('$pressEnter', 'Connect');
          }
        }

        _handleRight() {
          this._setState('Unpair');
        }

        _handleBack() {
          this.fireAncestors('$goBack');
        }

        _focus() {
          this.tag('ConnectDisconnect').patch({
            color: CONFIG.theme.hex
          });
          this.tag('ConnectDisconnect.Title').patch({
            text: {
              textColor: 0xFFFFFFFF
            }
          });
        }

        _unfocus() {
          this.tag('ConnectDisconnect').patch({
            color: 0xFFFFFFFF
          });
          this.tag('ConnectDisconnect.Title').patch({
            text: {
              textColor: 0xFF000000
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
          this.fireAncestors('$pressEnter', 'Unpair');
        }

        _handleRight() {
          this._setState('Cancel');
        }

        _handleLeft() {
          this._setState('ConnectDisconnect');
        }

        _handleBack() {
          this.fireAncestors('$goBack');
        }

        _focus() {
          this.tag('Unpair').patch({
            color: CONFIG.theme.hex
          });
          this.tag('Unpair.Title').patch({
            text: {
              textColor: 0xFFFFFFFF
            }
          });
        }

        _unfocus() {
          this.tag('Unpair').patch({
            color: 0xFFFFFFFF
          });
          this.tag('Unpair.Title').patch({
            text: {
              textColor: 0xFF000000
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
          this.fireAncestors('$pressEnter', 'Cancel');
        }

        _handleLeft() {
          this._setState('Unpair');
        }

        _handleBack() {
          this.fireAncestors('$goBack');
        }

        _focus() {
          this.tag('Cancel').patch({
            color: CONFIG.theme.hex
          });
          this.tag('Cancel.Title').patch({
            text: {
              textColor: 0xFFFFFFFF
            }
          });
        }

        _unfocus() {
          this.tag('Cancel').patch({
            color: 0xFF7D7D7D
          });
          this.tag('Cancel.Title').patch({
            text: {
              textColor: 0xFF000000
            }
          });
        }

        $exit() {
          this._unfocus();
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
   * Class for Bluetooth screen.
   */

  class BluetoothScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        Confirmation: {
          x: 780,
          y: 100,
          type: BluetoothConfirmation,
          visible: false
        },
        PairingScreen: {
          x: 780,
          y: 100,
          type: BluetoothPairingScreen$1,
          zIndex: 100,
          visible: false
        },
        Switch: {
          // y: 0 + 200,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Bluetooth On/Off',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25
            }
          },
          Button: {
            h: 30 * 1.5,
            w: 44.6 * 1.5,
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/ToggleOffWhite.png')
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
              text: 'Searching for Devices',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25
            }
          },
          Loader: {
            h: 30 * 1.5,
            w: 30 * 1.5,
            // x: 1600,
            x: 320,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Loading.gif')
          }
        },
        Networks: {
          PairedNetworks: {
            y: 180,
            List: {
              type: lng$1.components.ListComponent,
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
              type: lng$1.components.ListComponent,
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
              text: 'Add A Device',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25
            }
          },
          visible: false
        }
      };
    }

    _init() {
      this._bt = new BluetoothApi();
      this._bluetooth = false;

      this._activateBluetooth();

      this._setState('Switch');

      this.switch(); //this._bluetooth = false

      if (this._bluetooth) {
        this.tag('Networks').visible = true;
        this.tag('AddADevice').visible = true;
      }

      this._pairedNetworks = this.tag('Networks.PairedNetworks');
      this._availableNetworks = this.tag('Networks.AvailableNetworks');
      this.renderDeviceList();
      this.loadingAnimation = this.tag('Searching.Loader').animation({
        duration: 3,
        repeat: -1,
        stopMethod: 'immediate',
        stopDelay: 0.2,
        actions: [{
          p: 'rotation',
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
    }

    _active() {
      this._setState('Switch');
    }
    /**
     * Function to be excuted when the Bluetooth screen is enabled.
     */


    _enable() {
      if (this._bluetooth) {
        this._bt.startScan();
      }

      this.scanTimer = setInterval(() => {
        if (this._bluetooth) {
          this._bt.startScan();
        }
      }, 15000);
    }
    /**
     * Function to be executed when the Bluetooth screen is disabled from the screen.
     */


    _disable() {
      clearInterval(this.scanTimer);
    }
    /**
     * Function to be executed when add a device is pressed
     */


    showAvailableDevices() {
      this.tag('Switch').patch({
        alpha: 0
      });
      this.tag('PairedNetworks').patch({
        alpha: 0
      });
      this.tag('AddADevice').patch({
        alpha: 0
      });
      this.tag('Searching').patch({
        visible: true
      });
      this.tag('AvailableNetworks').patch({
        visible: true
      }); //  this.loadingAnimation.stop()
      // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }

    hideAvailableDevices() {
      this.tag('Switch').patch({
        alpha: 1
      });
      this.tag('PairedNetworks').patch({
        alpha: 1
      });
      this.tag('AddADevice').patch({
        alpha: 1
      });
      this.tag('Searching').patch({
        visible: false
      });
      this.tag('AvailableNetworks').patch({
        visible: false
      });
      this.tag('Confirmation').patch({
        visible: false
      }); //  this.loadingAnimation.start()
      // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }

    showPairingScreen() {
      this.tag('Switch').patch({
        alpha: 0
      });
      this.tag('PairedNetworks').patch({
        alpha: 0
      });
      this.tag('AddADevice').patch({
        alpha: 0
      });
      this.tag('Searching').patch({
        visible: false
      });
      this.tag('AvailableNetworks').patch({
        visible: false
      });
      this.tag('Confirmation').patch({
        visible: false
      });
      this.tag('PairingScreen').patch({
        visible: true
      });
      this.fireAncestors('$hideTopPanel'); // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }

    hidePairingScreen() {
      this.tag('Switch').patch({
        alpha: 1
      });
      this.tag('PairedNetworks').patch({
        alpha: 1
      });
      this.tag('AddADevice').patch({
        alpha: 1
      });
      this.tag('Searching').patch({
        visible: false
      });
      this.tag('AvailableNetworks').patch({
        visible: false
      });
      this.tag('Confirmation').patch({
        visible: false
      });
      this.tag('PairingScreen').patch({
        visible: false
      });
      this.fireAncestors('$showTopPanel'); // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }

    showConfirmation() {
      this.tag('Switch').patch({
        alpha: 0
      });
      this.tag('PairedNetworks').patch({
        alpha: 0
      });
      this.tag('AddADevice').patch({
        alpha: 0
      });
      this.tag('Searching').patch({
        visible: false
      });
      this.tag('AvailableNetworks').patch({
        visible: false
      });
      this.tag('PairingScreen').patch({
        visible: false
      });
      this.tag('Confirmation').patch({
        visible: true
      });
      this.fireAncestors('$hideTopPanel'); // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }

    hideConfirmation() {
      this.tag('Switch').patch({
        alpha: 1
      });
      this.tag('PairedNetworks').patch({
        alpha: 1
      });
      this.tag('AddADevice').patch({
        alpha: 1
      });
      this.tag('Searching').patch({
        visible: false
      });
      this.tag('AvailableNetworks').patch({
        visible: false
      });
      this.tag('PairingScreen').patch({
        visible: false
      });
      this.tag('Confirmation').patch({
        visible: false
      });
      this.fireAncestors('$showTopPanel'); // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }
    /**
     * Function to render list of Bluetooth devices
     */


    renderDeviceList() {
      this._bt.getPairedDevices().then(result => {
        this._pairedList = result;
        this._pairedNetworks.h = this._pairedList.length * 90;
        this._pairedNetworks.tag('List').h = this._pairedList.length * 90;
        this._pairedNetworks.tag('List').items = this._pairedList.map((item, index) => {
          item.paired = true;
          return {
            ref: 'Paired' + index,
            w: 1920 - 300,
            h: 90,
            type: BluetoothItem,
            item: item
          };
        });
      });

      this._bt.getDiscoveredDevices().then(result => {
        this._discoveredList = result;
        this._otherList = this._discoveredList.filter(device => {
          if (!device.paired) {
            result = this._pairedList.map(a => a.deviceID);

            if (result.includes(device.deviceID)) {
              return false;
            } else return device;
          }
        });
        this._availableNetworks.h = this._otherList.length * 90;
        this._availableNetworks.tag('List').h = this._otherList.length * 90;
        this._availableNetworks.tag('List').items = this._otherList.map((item, index) => {
          return {
            ref: 'Other' + index,
            w: 1920 - 300,
            h: 90,
            type: BluetoothItem,
            item: item
          };
        });
      });
    }

    $pressEnter(option) {
      if (option === 'Cancel') {
        this._setState('Switch');
      } else if (option === 'Pair') {
        this._bt.pair(this._availableNetworks.tag('List').element._item.deviceID).then(result => {
          this.tag('Confirmation').item = this._availableNetworks.tag('List').element._item;

          if (result.success) {
            this.tag('Confirmation.Pairing').text = 'Pairing Succesful';

            this._setState('Confirmation');
          } else {
            this.tag('Confirmation.Pairing').text = 'Pairing Failed';

            this._setState('Confirmation');
          }

          setTimeout(() => {
            // this.tag('Message').text = ''
            this._setState('Switch');

            this.tag('Confirmation.Pairing').text = '';
          }, 5000);
        });

        this._setState('Switch');
      } else if (option === 'Connect') {
        this._bt.connect(this._pairedNetworks.tag('List').element._item.deviceID, this._pairedNetworks.tag('List').element._item.deviceType).then(result => {
          this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item;

          if (!result) {
            // this.tag('Message').text = 'CONNECTION FAILED'
            this.tag('Confirmation.Pairing').text = 'Connection Failed';

            this._setState('Confirmation');
          } else {
            this._bt.setAudioStream(this._pairedNetworks.tag('List').element._item.deviceID).then(res => {// console.log(`
              // Tanjirou's log:
              //   the Audio stream was successfully set${res}
              // `);
            }).catch(err => {
              console.log(`
              Tanjirou's log:
              
              Unable to set the audio stream , error = ${err}
              
              `);
            });

            this.tag('Confirmation.Pairing').text = 'Connection Successful';

            this._setState('Confirmation');
          }

          setTimeout(() => {
            // this.tag('Message').text = ''
            this._setState('Switch');

            this.tag('Confirmation.Pairing').text = '';
          }, 5000);
        });

        this._setState('Switch');
      } else if (option === 'Disconnect') {
        this._bt.disconnect(this._pairedNetworks.tag('List').element._item.deviceID, this._pairedNetworks.tag('List').element._item.deviceType).then(result => {
          this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item;

          if (!result) {
            this.tag('Confirmation.Pairing').text = 'Failed to Disconnect';

            this._setState('Confirmation');
          } else {
            this.tag('Confirmation.Pairing').text = 'Disconnected';

            this._setState('Confirmation');
          }

          setTimeout(() => {
            // this.tag('Message').text = ''
            this._setState('Switch');

            this.tag('Confirmation.Pairing').text = '';
          }, 5000);
        });

        this._setState('Switch');
      } else if (option === 'Unpair') {
        this._bt.unpair(this._pairedNetworks.tag('List').element._item.deviceID).then(result => {
          this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item;

          if (result.success) {
            this.tag('Confirmation.Pairing').text = 'Unpaired';

            this._setState('Confirmation');
          } else {
            this.tag('Confirmation.Pairing').text = 'Unpairing Failed';

            this._setState('Confirmation');
          }

          setTimeout(() => {
            // this.tag('Message').text = ''
            this._setState('Switch');

            this.tag('Confirmation.Pairing').text = '';
          }, 5000);
        });

        this._setState('Switch');
      }
    }

    static _states() {
      return [class Switch extends this {
        $enter() {
          this.hideAvailableDevices();
          this.hidePairingScreen();

          this.tag('Switch')._focus();
        }

        $exit() {
          this.tag('Switch')._unfocus();
        }

        _handleDown() {
          this._setState('AddADevice');
        }

        _handleEnter() {
          this.switch();
        }

      }, class Confirmation extends this {
        $enter() {
          this.showConfirmation();
        }

        _getFocused() {
          return this.tag('Confirmation');
        }

        $pressOK() {
          this._setState('Switch');

          this.hideConfirmation();
        }

      }, class PairedDevices extends this {
        $enter() {
          this.hideAvailableDevices();
        }

        _getFocused() {
          return this._pairedNetworks.tag('List').element;
        }

        _handleDown() {
          this._navigate('MyDevices', 'down');
        }

        _handleUp() {
          this._navigate('MyDevices', 'up');
        }

        _handleEnter() {
          this.showPairingScreen();
          this.tag('PairingScreen').item = this._pairedNetworks.tag('List').element._item;

          this._setState('PairingScreen');
        }

      }, class AvailableDevices extends this {
        _getFocused() {
          return this._availableNetworks.tag('List').element;
        }

        _handleDown() {
          this._navigate('AvailableDevices', 'down');
        }

        _handleUp() {
          this._navigate('AvailableDevices', 'up');
        }

        _handleEnter() {
          this.$pressEnter('Pair');
          this.tag('Confirmation').item = this._availableNetworks.tag('List').element._item;
        }

        _handleBack() {
          this.hideAvailableDevices();

          this._setState('Switch');
        }

      }, class AddADevice extends this {
        $enter() {
          this.tag('AddADevice')._focus();

          this.hideAvailableDevices();
        }

        _handleUp() {
          this._setState('Switch');
        }

        _handleDown() {
          if (this._bluetooth) {
            if (this._pairedNetworks.tag('List').length > 0) {
              this._setState('PairedDevices');
            } else if (this._availableNetworks.tag('List').length > 0) {
              this._setState('AvailableDevices');
            }
          }
        }

        $exit() {
          this.tag('AddADevice')._unfocus();
        }

        _handleEnter() {
          if (this._bluetooth) {
            this.showAvailableDevices();

            this._setState('AvailableDevices');
          }
        }

      }, class Searching extends this {
        $enter() {
          this.showAvailableDevices();
        }

        _handleBack() {
          this.hideAvailableDevices();

          this._setState('Switch');
        }

        _handleDown() {
          this._setState('AvailableDevices');
        }

      }, class PairingScreen extends this {
        $enter() {
          this._disable();

          this._bt.stopScan();

          return this.tag('PairingScreen');
        }

        _handleBack() {
          this.hidePairingScreen();

          this._setState('Switch');
        }

        $goBack() {
          this.hidePairingScreen();

          this._setState('Switch');
        }

        _getFocused() {
          return this.tag('PairingScreen');
        }

        $exit() {
          this.tag('PairingScreen').visible = false;

          this._enable();
        }

      }];
    }
    /**
     * Function to navigate through the lists in the screen.
     * @param {string} listname
     * @param {string} dir
     */


    _navigate(listname, dir) {
      let list;
      if (listname === 'MyDevices') list = this._pairedNetworks.tag('List');else if (listname === 'AvailableDevices') list = this._availableNetworks.tag('List');

      if (dir === 'down') {
        if (list.index < list.length - 1) list.setNext();else if (list.index == list.length - 1) {
          if (listname === 'MyDevices' && this._availableNetworks.tag('List').length > 0) ;
        }
      } else if (dir === 'up') {
        if (list.index > 0) list.setPrevious();else if (list.index == 0) {
          if (listname === 'AvailableDevices' && this._pairedNetworks.tag('List').length > 0) ; else if (listname === 'MyDevices') {
            this._setState('AddADevice');
          }
        }
      }
    }
    /**
     * Function to turn on and off Bluetooth.
     */


    switch() {
      if (this._bluetooth) {
        this._bt.disable().then(result => {
          if (result.success) {
            this._bluetooth = false;
            this.tag('Networks').visible = false;
            this.tag('AddADevice').visible = false;
            this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
          }
        });
      } else {
        this._bt.enable().then(result => {
          if (result.success) {
            this._bluetooth = true;
            this.tag('Networks').visible = true;
            this.tag('AddADevice').visible = true;
            this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
            this.renderDeviceList();

            this._bt.startScan();
          }
        });
      }
    }
    /**
     * Function to activate Bluetooth plugin.
     */


    _activateBluetooth() {
      this._bt.activate().then(() => {
        this._bluetooth = true;

        this._bt.registerEvent('onDiscoveredDevice', () => {
          this.renderDeviceList();
        });

        this._bt.registerEvent('onPairingChange', status => {
          this._bt.startScan();

          this.renderDeviceList();

          this._setState('Confirmation');

          this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item;
        });

        this._bt.registerEvent('onPairingRequest', notification => {
          if (notification.pinRequired === 'true' && notification.pinValue) {
            this.tag('PairingScreen').code = notification.pinValue;
          } else {
            this.respondToPairingRequest(notification.deviceID, 'ACCEPTED');
          }
        });

        this._bt.registerEvent('onConnectionChange', notification => {
          this._bt.startScan();

          this.renderDeviceList(); //  this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item

          if (notification.connected) {
            // this.tag('Message').text = 'CONNECTION SUCCESS'
            this.tag('Confirmation.Pairing').text = 'CONNECTION SUCCESS';
          } else {
            // this.tag('Message').text = 'CONNECTION FAILED'
            this.tag('Confirmation.Pairing').text = 'CONNECTION FAILED';
          }

          setTimeout(() => {
            // this.tag('Message').text = ''
            this._setState('Switch');

            this.tag('Confirmation.Pairing').text = '';
          }, 5000);

          this._setState('Confirmation');
        });

        this._bt.registerEvent('onDiscoveryCompleted', () => {
          this.tag('Searching.Loader').visible = false;
          this.loadingAnimation.stop();
          this.renderDeviceList();
        });

        this._bt.registerEvent('onDiscoveryStarted', () => {
          this.loadingAnimation.start();
          this.tag('Searching.Loader').visible = true;
        });

        this._bt.registerEvent('onRequestFailed', notification => {
          this._bt.startScan();

          this.renderDeviceList();

          this._setState('Confirmation');

          this.tag('Confirmation.Pairing').text = notification.newStatus;
          setTimeout(() => {
            this._setState('Switch');

            this.tag('Confirmation.Pairing').text = '';
          }, 5000);
        });
      });
    }
    /**
     * Function to respond to Bluetooth client.
     * @param {number} deviceID
     * @param {string} responseValue
     */


    respondToPairingRequest(deviceID, responseValue) {
      this._bt.respondToEvent(deviceID, 'onPairingRequest', responseValue);
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
  class VideoAndAudioItem$1 extends lng$1.Component {
    static _template() {
      return {
        zIndex: 1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        },
        Item: {
          w: 1920 - 300,
          h: 90,
          rect: true,
          color: 0x00000000
        },
        BottomLine: {
          y: 0 + 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
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
        this.appApi.setResolution(this._item).then(res => {
          this.fireAncestors('$updateResolution', this._item);

          if (res === true) {
            this.fireAncestors("$resetPrevTickObject", this);
            this.tag("Item.Tick").visible = true;
          }
        }).catch(err => {
          console.log(`there was an error while setting the resolution.`);
        });
      } else {
        this.appApi.setSoundMode(this._item).then(result => {
          if (result.success === true) {
            this.fireAncestors("$resetPrevTickObject", this);
            this.tag("Item.Tick").visible = true; // this.tag('HdmiAudioOutputStereo.Title').text.text = 'HdmiAudioOutputStereo: ' + soundMode
          } //this.tag('HdmiAudioOutputStereo.Title').text.text = 'HdmiAudioOutputStereo: ' + result.soundMode


          this.fireAncestors("$updateSoundMode", this._item);
        }).catch(err => {
          console.log('Some error while setting the sound mode ', err);
        });
      }
    }

    set item(item) {
      this._item = item;
      this.tag('Item').patch({
        Tick: {
          x: 10,
          y: 45,
          mountY: 0.5,
          texture: lng$1.Tools.getSvgTexture(img$5, 32.5, 32.5),
          color: 0xffffffff,
          visible: this.isTicked ? true : false //implement the logic to show the tick

        },
        Left: {
          x: 50,
          y: 45,
          mountY: 0.5,
          text: {
            text: item,
            fontSize: 25,
            textColor: 0xffFFFFFF,
            fontFace: CONFIG.language.font
          } // update the text

        }
      });
    }

    _focus() {
      this.tag('TopLine').color = CONFIG.theme.hex;
      this.tag('BottomLine').color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag('TopLine').h = 6;
      this.tag('BottomLine').h = 6;
    }

    _unfocus() {
      this.tag('TopLine').color = 0xFFFFFFFF;
      this.tag('BottomLine').color = 0xFFFFFFFF;
      this.patch({
        zIndex: 1
      });
      this.tag('TopLine').h = 3;
      this.tag('BottomLine').h = 3;
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
   * Class for Resolution Screen.
   */

  class ResolutionScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        Background: {
          x: 0,
          y: -10,
          w: 1920,
          h: 1080,
          rect: true,
          color: 0xff000000,
          zIndex: 4
        },
        Loader: {
          x: 1920 / 2 - 400 + 180,
          y: 1080 / 2 - 300 + 100,
          w: 90,
          h: 90,
          mount: 0.5,
          zIndex: 4,
          src: Utils.asset("images/settings/Loading.gif")
        },
        ResolutionScreenContents: {
          List: {
            type: lng$1.components.ListComponent,
            w: 1920 - 300,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true,
            rollMax: 900,
            itemScrollOffset: -6
          }
        }
      };
    }

    _init() {
      this.appApi = new AppApi();
      this.appApi.activateDisplaySettings();
    }

    _focus() {
      this.loadingAnimation = this.tag('Loader').animation({
        duration: 3,
        repeat: -1,
        stopMethod: 'immediate',
        stopDelay: 0.2,
        actions: [{
          p: 'rotation',
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
      var options = [];
      this.appApi = new AppApi();

      this._setState("LoadingState");

      var sIndex = 0;
      this.appApi.getResolution().then(resolution => {
        this.appApi.getSupportedResolutions().then(res => {
          this._setState("Options");

          options = [...res];
          this.tag('ResolutionScreenContents').h = options.length * 90;
          this.tag('ResolutionScreenContents.List').h = options.length * 90;
          this.tag('List').items = options.map((item, index) => {
            var bool = false;

            if (resolution === item) {
              bool = true;
              sIndex = index;
            }

            return {
              ref: 'Option' + index,
              w: 1920 - 300,
              h: 90,
              type: VideoAndAudioItem$1,
              isTicked: bool,
              item: item,
              videoElement: true
            };
          });
        }).catch(err => {
          console.log(`error while fetching the supported resolution ${err}`);
        }).then(() => {
          this.tag('List').setIndex(sIndex);
          console.log(`focus on index's value = ${sIndex}`);
        });
      });
    }

    $resetPrevTickObject(prevTicObject) {
      if (!this.prevTicOb) {
        this.prevTicOb = prevTicObject;
      } else {
        this.prevTicOb.tag("Item.Tick").visible = false;
        this.prevTicOb = prevTicObject;
      }
    }

    static _states() {
      return [class Options extends this {
        _getFocused() {
          return this.tag('List').element;
        }

        _handleDown() {
          this.tag('List').setNext();
        }

        _handleUp() {
          this.tag('List').setPrevious();
        }

        _handleEnter() {
          this.tag("List").element.tag("Tick").visible = true;
        }

      }, class LoadingState extends this {
        $enter() {
          this.tag("Loader").visible = true;
          this.tag("Background").visible = true;
          this.loadingAnimation.start();
        }

        _getFocused() {}

        $exit() {
          this.tag("Loader").visible = false;
          this.tag("Background").visible = false;
          this.loadingAnimation.stop();
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
  class HDRScreen extends lng$1.Component {
    static _template() {
      return {
        List: {
          w: 1920 - 300,
          type: lng$1.components.ListComponent,
          itemSize: 90,
          horizontal: false,
          invertDirection: true,
          roll: true,
          rollMax: 900,
          itemScrollOffset: -5
        }
      };
    }

    _init() {
      this.lastElement = false;
      this.options = [{
        value: 'Auto',
        tick: true
      }, {
        value: 'Follow TV',
        tick: false
      }, {
        value: 'SDR',
        tick: false
      }, {
        value: 'HDR',
        tick: false
      }, {
        value: 'Dolby Vision',
        tick: false
      }];
      this.tag('List').h = this.options.length * 90;
      this.tag('List').items = this.options.map(item => {
        return {
          w: 1920 - 300,
          h: 90,
          type: SettingsItem,
          item: item.value
        };
      });
      this.tag('List').getElement(0).tag('Tick').visible = true;

      this._setState('Options');
    }

    static _states() {
      return [class Options extends this {
        _getFocused() {
          return this.tag('List').element;
        }

        _handleDown() {
          this.tag('List').setNext();
        }

        _handleUp() {
          this.tag('List').setPrevious();
        }

        _handleEnter() {
          this.options.forEach((element, idx) => {
            if (element.tick) {
              this.tag('List').getElement(idx).tag('Tick').visible = false;
              this.options[idx].tick = false;
            }
          });
          this.tag('List').element.tag('Tick').visible = true;
          this.options[this.tag('List').index].tick = true;
          this.fireAncestors('$updateHDR', this.options[this.tag('List').index].value);
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
   * Class for Video screen.
   */

  class VideoScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        VideoScreenContents: {
          Resolution: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Resolution: '),
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('High Dynamic Range: '),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          MatchContent: {
            alpha: 0.3,
            // disabled
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Match Content: Match Dynamic Range',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          OutputFormat: {
            alpha: 0.3,
            // disabled
            y: 270,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Output Format: YCbCr',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          Chroma: {
            alpha: 0.3,
            // disabled
            y: 360,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Chroma: 4:4:4',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          HDCP: {
            y: 450,
            h: 90,
            // type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('HDCP Status: '),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          }
        },
        ResolutionScreen: {
          type: ResolutionScreen,
          visible: false
        },
        HDRScreen: {
          type: HDRScreen,
          visible: false
        }
      };
    }

    _init() {
      this._appApi = new AppApi();
    }

    _focus() {
      this._appApi.getResolution().then(resolution => {
        this.tag("Resolution.Title").text.text = Language.translate('Resolution: ') + resolution;
      }).catch(err => {
        console.log("Error fetching the Resolution"); // this.tag("Resolution.Title").text.text = "Error fetching Resolution";
      });

      this._appApi.getHDCPStatus().then(result => {
        if (result.isHDCPCompliant && result.isHDCPEnabled) {
          this.tag("HDCP.Title").text.text = `${Language.translate('HDCP Status: ')}Enabled, Version: ${result.currentHDCPVersion}`;
        } else {
          this.tag("HDCP.Title").text.text = `${Language.translate('HDCP Status: ')}Not Supported `;
        }
      });

      this._appApi.getHDRSetting().then(result => {
        const availableHDROptions = {
          "HdrOff": "Off",
          "Hdr10": "HDR 10",
          "Hdr10Plus": "HDR 10+",
          "HdrHlg": "HLG",
          "HdrDolbyvision": "Dolby Vision",
          "HdrTechnicolor": "Technicolor HDR"
        };
        this.tag("HDR.Title").text.text = Language.translate('High Dynamic Range: ') + availableHDROptions[result];
      });

      this._setState('Resolution');
    }

    hide() {
      this.tag('VideoScreenContents').visible = false;
    }

    show() {
      this.tag('VideoScreenContents').visible = true;
    }

    static _states() {
      return [class Resolution extends this {
        $enter() {
          this.tag('Resolution')._focus();
        }

        $exit() {
          this.tag('Resolution')._unfocus();
        }

        _handleDown() {
          this._setState('HDR');
        }

        _handleEnter() {
          this._appApi.getSupportedResolutions().then(result => {
            if (result.length > 0) {
              this._setState('ResolutionScreen');
            }
          });
        }

      }, class HDR extends this {
        $enter() {
          this.tag('HDR')._focus();
        }

        $exit() {
          this.tag('HDR')._unfocus();
        }

        _handleUp() {
          this._setState('Resolution');
        }

        _handleDown() {// this._setState('MatchContent') //disabled
        }

      }, class MatchContent extends this {
        $enter() {
          this.tag('MatchContent')._focus();
        }

        $exit() {
          this.tag('MatchContent')._unfocus();
        }

        _handleUp() {
          this._setState('HDR');
        }

        _handleDown() {
          this._setState('OutputFormat');
        }

        _handleEnter() {//
        }

      }, class OutputFormat extends this {
        $enter() {
          this.tag('OutputFormat')._focus();
        }

        $exit() {
          this.tag('OutputFormat')._unfocus();
        }

        _handleUp() {
          this._setState('MatchContent');
        }

        _handleDown() {
          this._setState('Chroma');
        }

        _handleEnter() {//
        }

      }, class Chroma extends this {
        $enter() {
          this.tag('Chroma')._focus();
        }

        $exit() {
          this.tag('Chroma')._unfocus();
        }

        _handleUp() {
          this._setState('OutputFormat');
        }

        _handleDown() {// this._setState('HDCP') 
        }

        _handleEnter() {//
        }

      }, class HDCP extends this {
        // class not required
        $enter() {
          this.tag('HDCP')._focus();
        }

        $exit() {
          this.tag('HDCP')._unfocus();
        }

        _handleUp() {
          this._setState('Chroma');
        }

        _handleEnter() {//
        }

      }, class ResolutionScreen extends this {
        $enter() {
          this.hide();
          this.tag('ResolutionScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Video / Resolution');
        }

        $exit() {
          this.tag('ResolutionScreen').visible = false;
          this.show();
          this.fireAncestors('$changeHomeText', 'Settings / Video');
        }

        _getFocused() {
          return this.tag('ResolutionScreen');
        }

        _handleBack() {
          this._setState('Resolution');
        }

        $updateResolution(value) {
          this.tag('Resolution.Title').text.text = 'Resolution: ' + value;
        }

      }, class HDRScreen extends this {
        $enter() {
          this.hide();
          this.tag('HDRScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Video / High Dynamic Range');
        }

        $exit() {
          this.tag('HDRScreen').visible = false;
          this.show();
          this.fireAncestors('$changeHomeText', 'Settings / Video');
        }

        _getFocused() {
          return this.tag('HDRScreen');
        }

        _handleBack() {
          this._setState('HDR');
        }

        $updateHDR(value) {
          this.tag('HDR.Title').text.text = 'High Dynamic Range: ' + value;
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
   * Class for HDMI Output Screen.
   */

  var appApi$3 = new AppApi();
  class HdmiOutputScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        Background: {
          x: 0,
          y: -10,
          w: 1920,
          h: 1080,
          rect: true,
          color: 0xff000000,
          zIndex: 4,
          visible: false
        },
        Loader: {
          x: 1920 / 2 - 400 + 180,
          y: 1080 / 2 - 300 + 100,
          w: 90,
          h: 90,
          mount: 0.5,
          zIndex: 4,
          src: Utils.asset("images/settings/Loading.gif"),
          visible: false
        },
        HdmiOutputScreenContents: {
          List: {
            type: lng$1.components.ListComponent,
            w: 1920 - 300,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true
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

    _focus() {
      this.loadingAnimation = this.tag('Loader').animation({
        duration: 3,
        repeat: -1,
        stopMethod: 'immediate',
        stopDelay: 0.2,
        actions: [{
          p: 'rotation',
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });

      this._setState("LoadingState");

      var options = [];
      appApi$3.getSoundMode().then(result => {
        this.fireAncestors("$updateTheDefaultAudio", result.soundMode);
        appApi$3.getSupportedAudioModes().then(res => {
          options = [...res.supportedAudioModes];
          this.tag('HdmiOutputScreenContents').h = options.length * 90;
          this.tag('HdmiOutputScreenContents.List').h = options.length * 90;
          this.tag('HdmiOutputScreenContents.List').items = options.map((item, index) => {
            return {
              ref: 'Option' + index,
              w: 1920 - 300,
              h: 90,
              type: VideoAndAudioItem$1,
              isTicked: result.soundMode === item ? true : false,
              item: item,
              videoElement: false
            };
          });

          this._setState("Options");
        }).catch(err => {
          console.log('error', JSON.stringify(err));
        });
      }).catch(err => {
        console.log('error', JSON.stringify(err));
      });
    }

    static _states() {
      return [class Options extends this {
        _getFocused() {
          return this.tag('HdmiOutputScreenContents.List').element;
        }

        _handleDown() {
          this.tag('HdmiOutputScreenContents.List').setNext();
        }

        _handleUp() {
          this.tag('HdmiOutputScreenContents.List').setPrevious();
        }

      }, class LoadingState extends this {
        $enter() {
          this.tag("Loader").visible = true;
          this.tag("Background").visible = true;
          this.loadingAnimation.start();
        }

        _getFocused() {}

        $exit() {
          this.tag("Loader").visible = false;
          this.tag("Background").visible = false;
          this.loadingAnimation.stop();
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
  class VideoAndAudioItem extends lng$1.Component {
    static _template() {
      return {
        zIndex: 1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        },
        Item: {
          w: 1920 - 300,
          h: 90,
          rect: true,
          color: 0x00000000
        },
        BottomLine: {
          y: 0 + 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        }
      };
    }

    _init() {
      if (this.isTicked) {
        this.fireAncestors("$resetPrevTickObject", this);
      }

      this.appApi = new AppApi();
    }

    set item(item) {
      this._item = item;
      var self = this;
      this.tag('Item').patch({
        Tick: {
          x: 10,
          y: 45,
          mountY: 0.5,
          texture: lng$1.Tools.getSvgTexture(img$5, 32.5, 32.5),
          color: 0xffffffff,
          visible: self.isTicked ? true : false //implement the logic to show the tick

        },
        Left: {
          x: 50,
          y: 45,
          mountY: 0.5,
          text: {
            text: item,
            fontSize: 25,
            textColor: 0xffFFFFFF,
            fontFace: CONFIG.language.font
          } // update the text

        }
      });
    }

    _focus() {
      this.tag('TopLine').color = CONFIG.theme.hex;
      this.tag('BottomLine').color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag('TopLine').h = 6;
      this.tag('BottomLine').h = 6;
    }

    _unfocus() {
      this.tag('TopLine').color = 0xFFFFFFFF;
      this.tag('BottomLine').color = 0xFFFFFFFF;
      this.patch({
        zIndex: 1
      });
      this.tag('TopLine').h = 3;
      this.tag('BottomLine').h = 3;
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
   * Class for Resolution Screen.
   */

  class AudioOutputScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        AudioOutputScreenContents: {
          List: {
            type: lng$1.components.ListComponent,
            w: 1920 - 300,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true
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

    _focus() {
      //change to init if needed
      this.appApi = new AppApi();
      this.appApi.getConnectedAudioPorts().then(res => {
        var options = [...res.connectedAudioPorts];
        this.tag('AudioOutputScreenContents').h = options.length * 90;
        this.tag('AudioOutputScreenContents.List').h = options.length * 90;
        this.tag('AudioOutputScreenContents.List').items = options.map((item, index) => {
          return {
            ref: 'Option' + index,
            w: 1920 - 300,
            h: 90,
            type: VideoAndAudioItem,
            item: item
          };
        });

        this._setState("Options");
      }).catch(err => {
        console.log(`Error while getting Connected AudioPorts :${err}`);
      });
    }

    static _states() {
      return [class Options extends this {
        _getFocused() {
          return this.tag('List').element;
        }

        _handleDown() {
          this.tag('List').setNext();
        }

        _handleUp() {
          this.tag('List').setPrevious();
        }

        _handleEnter() {// enable the tick mark in VideoAudioItem.js
          // this.fireAncestors('$updateResolution', "current resolution") //to update the resolution value on Video Screen
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
   * Class for Audio screen.
   */

  class AudioScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        Wrapper: {
          AudioOutput: {
            alpha: 0.3,
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Audio Output: HDMI',
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Output Mode: Auto'),
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: 'Full Dynamic Range',
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: 'Audio Language: Auto',
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: 'Navigation Feedback',
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
              src: Utils.asset('images/settings/ToggleOnWhite.png')
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
                text: 'Bluetooth: None',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          }
        },
        OutputModeScreen: {
          type: HdmiOutputScreen,
          visible: false
        },
        AudioOutputS: {
          type: AudioOutputScreen,
          visible: false
        }
      };
    }

    _init() {
      this.appApi = new AppApi();
    }

    $updateTheDefaultAudio(audio) {
      //console.log(audio)
      this.tag('OutputMode.Title').text.text = Language.translate('Output Mode: ') + audio;
    }

    $updateSoundMode(soundMode) {
      this.tag('OutputMode.Title').text.text = Language.translate('Output Mode: ') + soundMode;
    }

    _focus() {
      // this._setState('AudioOutput') 
      this._setState('OutputMode');
    }

    hide() {
      this.tag('Wrapper').visible = false;
    }

    show() {
      this.tag('Wrapper').visible = true;
    }

    static _states() {
      return [class AudioOutput extends this {
        $enter() {
          this.tag('AudioOutput')._focus();
        }

        $exit() {
          this.tag('AudioOutput')._unfocus();
        }

        _handleDown() {
          this._setState('OutputMode');
        }

        _handleEnter() {
          this._setState('AudioOutputScreenState');
        }

      }, // BookMark 1
      class AudioOutputScreenState extends this {
        $enter() {
          this.hide();
          this.tag('AudioOutputS').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Audio / Output Mode');
        }

        $exit() {
          this.tag("AudioOutputS").visible = false;
          this.show();
          this.fireAncestors('$changeHomeText', 'Settings / Audio');
        }

        _getFocused() {
          return this.tag('AudioOutputS');
        }

        _handleBack() {
          this._setState('AudioOutput');
        }

        $updateAudioOutputText(value) {// this.tag('OutputMode.Title').text.text = 'Output Mode: ' + value
        }

      }, class OutputMode extends this {
        $enter() {
          this.tag('OutputMode')._focus();
        }

        $exit() {
          this.tag('OutputMode')._unfocus();
        }

        _handleUp() {// this._setState('AudioOutput')
        }

        _handleDown() {// this._setState('DynamicRange');
        }

        _handleEnter() {
          this._setState('HdmiAudioOutputStereoScreen');
        }

      }, class DynamicRange extends this {
        $enter() {
          this.tag('DynamicRange')._focus();
        }

        $exit() {
          this.tag('DynamicRange')._unfocus();
        }

        _handleUp() {
          this._setState('OutputMode');
        }

        _handleDown() {
          this._setState('Bluetooth');
        }

        _handleEnter() {
          /**
           * This handle Enter has api calls -
           * 1 - get DRC Mode which doesnot return a drc mode and the success value is mostly false
           * 2- set Volume - able to set the value to 100
           * 3- get Volume - able to get the volume successfully as well
           * 4- 
           * 
           */
          //console.log(`Enter input was given to dynamic range ... `);
          // gets the drc mode
          this.appApi.getDRCMode().then(res => {}).catch(err => {
            console.log(err);
          });
          this.appApi.setVolumeLevel("HDMI0", 100).then(res => {
            this.appApi.getVolumeLevel().catch(err => {
              console.log(err);
            });
          }).catch(err => {
            console.log(err);
          });
          this.appApi.getConnectedAudioPorts().then(res => {}).catch(err => {
            console.log(err);
          }); // gets the enabled Audio Port

          this.appApi.getEnableAudioPort("HDMI0").then(res => {}).catch(err => {
            console.log(err);
          });
          this.appApi.getSupportedAudioPorts().catch(err => {
            console.log(`Error while getting the supported Audio ports ie. ${err}`);
          }); // set enable Audio POrt

          this.appApi.setEnableAudioPort("HDMI0").then(res => {
            this.appApi.getEnableAudioPort("HDMI0").then(res => {}).catch(err => {
              console.log(err);
            });
          }).catch(err => {
            console.log(err);
          }); // set zoom setting ,possible values : FULL, NONE, Letterbox 16x9, Letterbox 14x9, CCO, PanScan, Letterbox 2.21 on 4x3, Letterbox 2.21 on 16x9, Platform, Zoom 16x9, Pillarbox 4x3, Widescreen 4x3

          this.appApi.setZoomSetting("FULL").then(res => {
            this.appApi.getZoomSetting().then(res => {}).catch(err => {
              console.log(err);
            });
          }).catch(err => {
            console.log(err);
          });
        }

      }, class NavigationFeedback extends this {
        $enter() {
          this.tag('NavigationFeedback')._focus();
        }

        $exit() {
          this.tag('NavigationFeedback')._unfocus();
        }

        _handleUp() {
          this._setState('DynamicRange');
        }

        _handleDown() {
          this._setState('Bluetooth');
        }

        _handleEnter() {//
        }

      }, class Bluetooth extends this {
        $enter() {
          this.tag('Bluetooth')._focus();
        }

        $exit() {
          this.tag('Bluetooth')._unfocus();
        }

        _handleUp() {
          this._setState('DynamicRange');
        }

      }, class HdmiAudioOutputStereoScreen extends this {
        $enter() {
          this.hide();
          this.tag('OutputModeScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Audio / Output Mode');
        }

        $exit() {
          this.tag('OutputModeScreen').visible = false;
          this.show();
          this.fireAncestors('$changeHomeText', 'Settings / Audio');
        }

        _getFocused() {
          return this.tag('OutputModeScreen');
        }

        _handleBack() {
          this._setState('OutputMode');
        }

        $updateHdmiAudioOutputStereo(value) {
          this.tag('OutputMode.Title').text.text = 'Output Mode: ' + value;
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
   * Class for Remote Control Screen.
   */

  class RemoteControlScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        RemoteControlScreenContents: {
          PairingStatus: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Pairing Status: ',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          FirmwareVersion: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Firmware Version: ',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          TestMicrophone: {
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Test Microphone',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          Info: {
            y: 270,
            BatteryHealth: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Battery Health: ',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            SignalStrength: {
              x: 10,
              y: 45 + 35,
              mountY: 0.5,
              text: {
                text: 'Signal Strength: ',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            },
            VoiceCapable: {
              x: 10,
              y: 45 + 35 + 35,
              mountY: 0.5,
              text: {
                text: 'Voice Capable: ',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          }
        },
        PairingStatusScreen: {// 
        }
      };
    }

    _focus() {
      this._setState('PairingStatus'); //can be used on init as well

    }

    hide() {
      this.tag('RemoteControlScreenContents').visible = false;
    }

    show() {
      this.tag('RemoteControlScreenContents').visible = true;
    }

    static _states() {
      return [class PairingStatus extends this {
        $enter() {
          this.tag('PairingStatus')._focus();
        }

        $exit() {
          this.tag('PairingStatus')._unfocus();
        }

        _handleDown() {
          this._setState('FirmwareVersion');
        }

        _handleEnter() {// 
        }

      }, class FirmwareVersion extends this {
        $enter() {
          this.tag('FirmwareVersion')._focus();
        }

        $exit() {
          this.tag('FirmwareVersion')._unfocus();
        }

        _handleUp() {
          this._setState('PairingStatus');
        }

        _handleDown() {
          this._setState('TestMicrophone');
        }

        _handleEnter() {// 
        }

      }, class TestMicrophone extends this {
        $enter() {
          this.tag('TestMicrophone')._focus();
        }

        $exit() {
          this.tag('TestMicrophone')._unfocus();
        }

        _handleUp() {
          this._setState('FirmwareVersion');
        }

        _handleEnter() {// 
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
   * Class for Video and Audio screen.
   */

  class DeviceInformationScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        h: 1080,
        w: 1920,
        clipping: true,
        DeviceInfoContents: {
          y: 2,
          Line1: {
            y: 0,
            mountY: 0.5,
            w: 1600,
            h: 3,
            rect: true,
            color: 0xFFFFFFFF
          },
          ChipSet: {
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate(`Chipset`),
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
                text: `unavailable`,
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
            color: 0xFFFFFFFF
          },
          SerialNumber: {
            Title: {
              x: 10,
              y: 135,
              mountY: 0.5,
              text: {
                text: Language.translate(`Serial Number`),
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
                text: `unavailable`,
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
            color: 0xFFFFFFFF
          },
          Location: {
            Title: {
              x: 10,
              y: 225,
              mountY: 0.5,
              text: {
                text: Language.translate(`Location`),
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
                text: `City: unavailable , Country: unavailable `,
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
            color: 0xFFFFFFFF
          },
          SupportedDRM: {
            Title: {
              x: 10,
              y: 360,
              mountY: 0.5,
              text: {
                text: Language.translate(`Supported DRM & Key-System`),
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
                text: `unavailable`,
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
            color: 0xFFFFFFFF
          },
          FirmwareVersions: {
            Title: {
              x: 10,
              y: 540,
              mountY: 0.5,
              text: {
                text: Language.translate(`Firmware version`),
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
                text: `UI Version: 3.4, Build Version: , Timestamp: `,
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
            color: 0xFFFFFFFF
          },
          AppVersions: {
            Title: {
              x: 10,
              y: 720,
              mountY: 0.5,
              text: {
                text: Language.translate(`App Versions`),
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
            color: 0xFFFFFFFF
          }
        }
      };
    }

    _focus() {
      this._setState('DeviceInformationScreen');

      this.appApi = new AppApi();
      this.appApi.getSerialNumber().then(result => {
        this.tag("SerialNumber.Value").text.text = `${result.serialNumber}`;
      });
      this.appApi.getSystemVersions().then(res => {
        this.tag('FirmwareVersions.Value').text.text = `UI Version - 3.4 \nBuild Version - ${res.stbVersion} \nTime Stamp - ${res.stbTimestamp} `;
      }).catch(err => {
        console.error(`error while getting the system versions`);
      });
      this.appApi.getDRMS().then(result => {
        console.log('from device info supported drms ' + JSON.stringify(result));
        var drms = "";
        result.forEach(element => {
          drms += `${element.name} :`;

          if (element.keysystems) {
            drms += "\t";
            element.keysystems.forEach(keySystem => {
              drms += `${keySystem}, `;
            });
            drms += "\n";
          } else {
            drms += "\n";
          }
        });
        this.tag('SupportedDRM.Value').text.text = `${drms.substring(0, drms.length - 1)}`;
      });
      this.appApi.getLocation().then(result => {
        console.log("getLocation from device info " + JSON.stringify(result));
        var locationInfo = "";

        if (result.city.length !== 0) {
          locationInfo = "City: " + result.city;
        } else {
          locationInfo = "City: unavailable ";
        }

        if (result.country.length !== 0) {
          locationInfo += ", Country: " + result.country;
        } else {
          locationInfo += ", Country: unavailable ";
        }

        this.tag('Location.Value').text.text = `${locationInfo}`;
      });
      this.appApi.getDeviceIdentification().then(result => {
        console.log('from device Information screen getDeviceIdentification: ' + JSON.stringify(result));
        this.tag('ChipSet.Value').text.text = `${result.chipset}`; // this.tag('FirmwareVersions.Value').text.text = `${result.firmwareversion}`
      });
      this.appApi.registerChangeLocation();
    }

    _handleDown() {
      if (this.tag("DeviceInfoContents").y > -200) {
        this.tag("DeviceInfoContents").y -= 35;
      }
    }

    _handleUp() {
      if (this.tag("DeviceInfoContents").y < 35) {
        this.tag("DeviceInfoContents").y += 35;
      }
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
   * Class for Firmware screen.
   */

  class FirmwareScreen extends lng$1.Component {
    static _template() {
      return {
        DeviceInfoContents: {
          State: {
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Firmware State: '),
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
                text: Language.translate('Firmware Versions: '),
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
                text: Language.translate(`Downloaded Firmware Version: `),
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
                text: Language.translate(`Download Progress: `),
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

    _focus() {
      this._appApi = new AppApi();
      const downloadState = ['Uninitialized', 'Requesting', 'Downloading', 'Failed', 'DownLoad Complete', 'Validation Complete', 'Preparing to Reboot'];

      this._appApi.getFirmwareUpdateState().then(res => {
        console.log("getFirmwareUpdateState from firmware screen " + JSON.stringify(res));
        this.tag('State.Title').text.text = Language.translate("Firmware State: ") + downloadState[res.firmwareUpdateState];
      });

      this._appApi.getDownloadFirmwareInfo().then(res => {
        console.log("getDownloadFirmwareInfo from firmware screen " + JSON.stringify(res));
        this.tag('Version.Title').text.text = Language.translate("Firmware Versions: ") + res.currentFWVersion;
      });

      this._setState('FirmwareUpdate');
    }

    getDownloadPercent() {
      this._appApi.getFirmwareDownloadPercent().then(res => {
        this.tag('DownloadedPercent.Title').text.text = Language.translate("Download Progress: ") + res.downloadPercent + "%";
      });
    }

    getDownloadFirmwareInfo() {
      this._appApi.updateFirmware().then(res => {
        this._appApi.getDownloadFirmwareInfo().then(result => {
          this.tag('DownloadedVersion.Title').text.text = Language.translate('Downloaded Firmware Version: ')`${result.downloadFWVersion ? result.downloadFWVersion : 'NA'}`;
        });
      });
    }

    static _states() {
      return [class FirmwareUpdate extends this {
        _handleEnter() {
          this.getDownloadFirmwareInfo();
          this.getDownloadPercent();
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
   * Class for Reboot Confirmation Screen.
   */

  class RebootConfirmationScreen extends lng$1.Component {
    static _template() {
      return {
        Background: {
          x: 0,
          y: 0,
          w: 1920,
          h: 2000,
          mount: 0.5,
          rect: true,
          color: 0xff000000
        },
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
            color: 0xFFFFFFFF,
            Title: {
              x: 100,
              y: 25,
              mount: 0.5,
              text: {
                text: "Confirm",
                fontFace: CONFIG.language.font,
                fontSize: 22,
                textColor: 0xFF000000
              }
            }
          },
          Cancel: {
            x: 220,
            w: 200,
            mountX: 0.5,
            h: 50,
            rect: true,
            color: 0xFF7D7D7D,
            Title: {
              x: 100,
              y: 25,
              mount: 0.5,
              text: {
                text: "Cancel",
                fontFace: CONFIG.language.font,
                fontSize: 22,
                textColor: 0xFF000000
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
          src: Utils.asset("images/settings/Loading.gif"),
          visible: false
        }
      };
    }

    _focus() {
      this._setState('Confirm');

      this.loadingAnimation = this.tag('Loader').animation({
        duration: 3,
        repeat: -1,
        stopMethod: 'immediate',
        stopDelay: 0.2,
        actions: [{
          p: 'rotation',
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
    }

    static _states() {
      return [class Confirm extends this {
        $enter() {
          this._focus();
        }

        _handleEnter() {
          this.fireAncestors('$confirmReboot');

          this._setState('Rebooting');
        }

        _handleRight() {
          this._setState('Cancel');
        }

        _focus() {
          this.tag('Confirm').patch({
            color: CONFIG.theme.hex
          });
          this.tag('Confirm.Title').patch({
            text: {
              textColor: 0xFFFFFFFF
            }
          });
        }

        _unfocus() {
          this.tag('Confirm').patch({
            color: 0xFFFFFFFF
          });
          this.tag('Confirm.Title').patch({
            text: {
              textColor: 0xFF000000
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
          this.fireAncestors('$cancelReboot');
        }

        _handleLeft() {
          this._setState('Confirm');
        }

        _focus() {
          this.tag('Cancel').patch({
            color: CONFIG.theme.hex
          });
          this.tag('Cancel.Title').patch({
            text: {
              textColor: 0xFFFFFFFF
            }
          });
        }

        _unfocus() {
          this.tag('Cancel').patch({
            color: 0xFF7D7D7D
          });
          this.tag('Cancel.Title').patch({
            text: {
              textColor: 0xFF000000
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
          this.tag('Buttons').visible = false;
          this.tag('Info').visible = false;
        }

        _handleEnter() {// do nothing
        }

        _handleLeft() {// do nothing
        }

        _handleRight() {// do nothing
        }

        _handleBack() {// do nothing
        }

        _handleUp() {// do nothing
        }

        _handleDown() {// do nothing
        }

        _handleKey(key) {
          console.log("key press after reboot ", key);
        }

        _handleHome() {
          console.log("homekey pressed");
        }

        _captureKey(key) {
          if (key) {
            console.log("capture key press after reboot ", key);
          }
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
   * Class for Video and Audio screen.
   */

  class DeviceScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        DeviceScreenContents: {
          Info: {
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Info'),
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Check for Firmware Update'),
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Reboot'),
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          Reset: {
            y: 270,
            alpha: 0.3,
            // disabled
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Factory Reset',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          }
        },
        DeviceInformationScreen: {
          type: DeviceInformationScreen,
          visible: false
        },
        FirmwareScreen: {
          type: FirmwareScreen,
          visible: false
        },
        RebootConfirmationScreen: {
          x: 780,
          y: 100,
          type: RebootConfirmationScreen,
          visible: false
        }
      };
    }

    _init() {
      this._appApi = new AppApi();
    }

    _focus() {
      this._setState('Info');
    }

    hide() {
      this.tag('DeviceScreenContents').visible = false;
    }

    show() {
      this.tag('DeviceScreenContents').visible = true;
    }

    static _states() {
      return [class Info extends this {
        $enter() {
          this.tag('Info')._focus();
        }

        $exit() {
          this.tag('Info')._unfocus();
        }

        _handleUp() {
          this._setState('Reboot');
        }

        _handleDown() {
          this._setState('Firmware');
        }

        _handleEnter() {
          this._setState('DeviceInformationScreen');
        }

      }, class Firmware extends this {
        $enter() {
          this.tag('Firmware')._focus();
        }

        $exit() {
          this.tag('Firmware')._unfocus();
        }

        _handleUp() {
          this._setState('Info');
        }

        _handleDown() {
          this._setState('Reboot');
        }

        _handleEnter() {
          this._setState('FirmwareScreen');
        }

      }, class Reboot extends this {
        $enter() {
          this.tag('Reboot')._focus();
        }

        $exit() {
          this.tag('Reboot')._unfocus();
        }

        _handleUp() {
          this._setState('Firmware');
        }

        _handleDown() {
          this._setState('Info');
        }

        _handleEnter() {
          this._setState('RebootConfirmationScreen');
        }

      }, class Reset extends this {
        $enter() {
          this.tag('Reset')._focus();
        }

        $exit() {
          this.tag('Reset')._unfocus();
        }

        _handleUp() {//this._setState('Reboot');
        }

        _handleDown() {//this._setState('Info')
        }

        _handleEnter() {}

      }, //Inner Screens Classes
      class DeviceInformationScreen extends this {
        $enter() {
          this.hide();
          this.tag('DeviceInformationScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings / Device / Info');
        }

        _getFocused() {
          return this.tag('DeviceInformationScreen');
        }

        $exit() {
          this.show();
          this.tag('DeviceInformationScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings / Device');
        }

        _handleBack() {
          this._setState('Info');
        }

      }, //Inner Firmware Screen
      class FirmwareScreen extends this {
        $enter() {
          this.hide();
          this.tag('FirmwareScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings / Device / Firmware');
        }

        _getFocused() {
          return this.tag('FirmwareScreen');
        }

        $exit() {
          this.show();
          this.tag('FirmwareScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings / Device');
        }

        _handleBack() {
          this._setState('Firmware');
        }

      }, class RebootConfirmationScreen extends this {
        $enter() {
          this.hide();
          this.tag('RebootConfirmationScreen').visible = true;
        }

        _getFocused() {
          return this.tag('RebootConfirmationScreen');
        }

        $exit() {
          this.show();
          this.tag('RebootConfirmationScreen').visible = false;
        }

        $confirmReboot() {
          this._appApi.reboot().then(result => {
            console.log('device rebooting from device screen ' + JSON.stringify(result));
          });
        }

        $cancelReboot() {
          this._handleBack();
        }

        _handleBack() {
          this._setState('Reboot');
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
  const config$2 = {
    host: '127.0.0.1',
    port: 9998,
    default: 1
  };
  const thunder$2 = thunderJS(config$2);
  class CECApi {
    activate() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.HdmiCec_2.1';
        thunder$2.Controller.activate({
          callsign: systemcCallsign
        }).then(() => {
          resolve(true);
        }).catch(err => {
          console.log('CEC Error', err);
        });
      });
    }

    deactivate() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.HdmiCec_2.1';
        thunder$2.Controller.deactivate({
          callsign: systemcCallsign
        }).then(() => {
          resolve(true);
        }).catch(err => {
          console.log('CEC Error', err);
        });
      });
    }

    getEnabled() {
      return new Promise((resolve, reject) => {
        thunder$2.call('org.rdk.HdmiCec_2.1', 'getEnabled').then(result => {
          resolve(result);
        }).catch(err => {
          console.log('CEC error ', err);
          resolve({
            enabled: false
          });
        });
      });
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
   * Class for AdvancedSettings screen.
   */

  class AdvanceSettingsScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        AdvanceScreenContents: {
          UIVoice: {
            alpha: 0.3,
            // disabled
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'UI Voice',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          TTSOptions: {
            y: 90,
            alpha: 0.3,
            // disabled
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'TTS Options',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          CECControl: {
            y: 180,
            // alpha: 0.3, // disabled
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('CEC Control'),
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
              src: Utils.asset('images/settings/ToggleOffWhite.png')
            }
          },
          Bug: {
            y: 270,
            alpha: 0.3,
            // disabled
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Bug Report',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          Contact: {
            alpha: 0.3,
            // disabled
            y: 360,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Contact Support',
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Device'),
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          }
        },
        DeviceScreen: {
          type: DeviceScreen,
          visible: false
        }
      };
    }

    _init() {
      this.cecApi = new CECApi();
      this.cecApi.activate().then(() => {
        this.tag('CECControl.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
      });
    }

    _focus() {
      this._setState('CECControl');
    }

    hide() {
      this.tag('AdvanceScreenContents').visible = false;
    }

    show() {
      this.tag('AdvanceScreenContents').visible = true;
    }

    toggleCEC() {
      this.cecApi.getEnabled().then(res => {
        console.log(res);

        if (res.enabled) {
          this.cecApi.deactivate().then(() => {
            this.tag('CECControl.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
          });
        } else {
          this.cecApi.activate().then(() => {
            this.tag('CECControl.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
          });
        }
      });
    }

    static _states() {
      return [class UIVoice extends this {
        $enter() {
          this.tag('UIVoice')._focus();
        }

        $exit() {
          this.tag('UIVoice')._unfocus();
        }

        _handleUp() {//this._setState('Reset');
        }

        _handleDown() {//this._setState('TTSOptions')
        }

        _handleEnter() {}

      }, class TTSOptions extends this {
        $enter() {
          this.tag('TTSOptions')._focus();
        }

        $exit() {
          this.tag('TTSOptions')._unfocus();
        }

        _handleUp() {//this._setState('UIVoice');
        }

        _handleDown() {//this._setState('CECControl')
        }

        _handleEnter() {}

      }, class CECControl extends this {
        $enter() {
          this.tag('CECControl')._focus();
        }

        $exit() {
          this.tag('CECControl')._unfocus();
        }

        _handleUp() {//this._setState('TTSOptions');
        }

        _handleDown() {
          this._setState('Device');
        }

        _handleEnter() {
          this.toggleCEC();
        }

      }, class Bug extends this {
        $enter() {
          this.tag('Bug')._focus();
        }

        $exit() {
          this.tag('Bug')._unfocus();
        }

        _handleUp() {//this._setState('CECControl');
        }

        _handleDown() {//this._setState('Contact')
        }

        _handleEnter() {}

      }, class Contact extends this {
        $enter() {
          this.tag('Contact')._focus();
        }

        $exit() {
          this.tag('Contact')._unfocus();
        }

        _handleUp() {//this._setState('Bug');
        }

        _handleDown() {//this._setState('Device')
        }

        _handleEnter() {}

      }, class Device extends this {
        $enter() {
          this.tag('Device')._focus();
        }

        $exit() {
          this.tag('Device')._unfocus();
        }

        _handleUp() {
          this._setState('CECControl');
        }

        _handleDown() {//this._setState('UI Voice')
        }

        _handleEnter() {
          this._setState('DeviceScreen');
        }

      }, //Inner Screens Classes
      class DeviceScreen extends this {
        $enter() {
          this.hide();
          this.tag('DeviceScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings / Device');
        }

        _getFocused() {
          return this.tag('DeviceScreen');
        }

        $exit() {
          this.show();
          this.tag('DeviceScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings');
        }

        _handleBack() {
          this._setState('Device');
        }

      } // class CECScreen extends this {
      //     $enter() {
      //         this.hide()
      //         this.tag('CECScreen').visible = true
      //         this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings / CEC Control')
      //     }
      //     $exit() {
      //         this.show()
      //         this.tag('CECScreen').visible = false
      //         this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings')
      //     }
      // }
      ];
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
  const _privacyPolicy = `Privacy
 Welcome to RDKCentral.com, a website owned and operated by RDK Management, LLC (“RDK Management,” “we,” or “us”). This privacy policy discloses the privacy practices for this website only, including an explanation of:
 
 the categories of personally identifiable information about you that may be collected and how that information is used;
 how we collect and use non-personally identifiable information about your use of the website;
 the categories of persons or entities with whom the information may be shared;
 the choices that are available to you regarding collection, use, and distribution of the information;
 how you can opt out of RDK-related promotional e-mail;
 the kind of security procedures that are in place to protect the loss, misuse or alteration of information;
 how you can review and request changes to the information; and
 how we notify users of this website of changes to this privacy policy.
 Questions regarding this policy should be directed to “RDK Management – Privacy Feedback” and can be submitted via e-mail to info@rdkcentral.com.
 
 
 What categories of information do we collect?
 The information collected by RDK Management falls into two categories: (1) information voluntarily supplied by users of the website and (2) tracking information recorded as users navigate through the website. Some of this information is personally identifiable information (i.e., information that identifies a particular person, such as e-mail address), but much of it is not.
 
 To make use of some features on our website, like the RDK Wiki, users need to register and provide certain information as part of the registration process. We may ask, for example, for your name, e-mail address, street address, and zip code. We might also request information about your employer and the type of work that you do, in order to determine whether your employer is a member of the RDK program, to help us ensure that you are given access to the correct portions of the website, and to tailor our website content and e-mail (if you’ve registered to receive e-mail) to your interests to make it more useful to you. If you are a registered user, our systems will remember some of this information the next time you log in and use our website, but you can always review and change your information by logging in and editing your profile here.
 
 The more you tell us about yourself, the more value we can offer you. Supplying this information is entirely voluntary. But if you choose not to supply the information, we may be unable to provide you with access to all of the features of this website. There are certain features of this website, including the Wiki and requesting to receive RDK-related promotional e-mail, that you will not be able to use unless you provide certain personally identifiable information about yourself. When you submit any personally identifiable information over this website, RDK Management (i) will use the information for the purposes described at the time you submit it and (ii) may use the information to contact you, subject to the contact preferences in your profile. If you want to remain completely anonymous, you’re still free to take advantage of the publicly available content on our website without registration.
 
 Does RDK Management analyze my interaction with this website?
 Some of the third-party service providers that RDK Management uses to deliver services, like analytics providers, may collect information on this website as disclosed in this privacy policy. This information may include personally identifiable information or may be used to contact you online.
 
 We and our service providers may use cookies to provide these services. The World Wide Web Consortium (W3C) has started a process to develop a “Do Not Track” Standard. Since the definitions and rules for such a standard have not yet been defined, RDK Management does not yet respond to “Do Not Track” signals sent from browsers.
 
 You may opt out of receiving cookies from the companies that provide services on this website by going to www.networkadvertising.org/consumer/opt_out.asp or http://www.aboutads.info/choices.
 
 What categories of persons or entities do we share personally identifiable information with?
 We consider the personally identifiable information contained in our business records to be confidential. We may sometimes disclose personally identifiable information about you to our affiliates or to others who work for us. We may also disclose personally identifiable information about you to service providers and vendors, and to others who provide products and services to us. For example, when you use certain functions on this website you may notice that the website actually collecting or processing the information may be other than an RDK Management website. We may be required by law or legal process to disclose certain personally identifiable information about you to lawyers and parties in connection with litigation and to law enforcement personnel. For example, we may be required by law to disclose personally identifiable information about you without your consent and without notice in order to comply with a valid legal process such as a subpoena, court order, or search warrant.
 
 What do we do to personalize your use of this website?
 We, or our service providers, may customize this website based on non-personal information including: (i) the IP address associated with your computer for purposes of determining your approximate geographic location; (ii) the type of web page that is being displayed; or (iii) the content on the page that is shown. Because this activity automatically applies to all users and it is purely contextual, this type of content delivery cannot be customized or controlled by individual users. We may also personalize this website based on the information that you provided us during registration. You may modify this information as further described in this Privacy Policy.
 
 To help make our website more responsive to the needs of our users, we use a standard feature of browser software called a “cookie.” We use cookies to help us tailor our website to your needs, to deliver a better, more personalized service, and to remember certain choices you’ve made so you don’t have to re-enter them.
 
 RDK Management uses cookies, among other things, to remember your username and password, if you choose to store them, as well as to remember some of your personalization preferences and website features. RDK Management does not store your name or other personal information in cookies. You may read about enabling, disabling, and deleting cookies here. Of course, if you set your browser not to accept cookies or you delete them, you may not be able to take advantage of the personalized features enjoyed by other users of our website.
 
 The cookies we use don’t directly identify users of our website as particular persons. Rather, they contain information sufficient to simplify and improve a user’s experience on our website. For example, we may use session-based cookies to track the pages on our website visited by our users. We can build a better website if we know which pages our users are visiting and how often. Or, we may use persistent cookies to simplify access to a user’s account information over our website, for example.
 
 In connection with the standard operation of RDK Management’s systems, certain non-personally identifiable information about users of this website is recorded. This information is used primarily to tailor and enhance users’ experience using the website. We may use this information in an aggregate, non-personally identifiable form to, among other things, measure the use of our website and determine which pages are the most popular with website users.
 
 We may also use one or more audience segmenting technology providers to help present content on this website. These providers uses cookies, web beacons, or similar technologies on your computer or mobile or other device to serve you advertisements or content tailored to interests you have shown by browsing on this and other websites you have visited. It also helps determine whether you have seen a particular piece of content before and in order to avoid sending you duplicates. In doing so, these providers collect non-personally identifiable information such as your browser type, your operating system, web pages visited, time of visits, content viewed, ads viewed, and other click stream data. When you visit this website, these providers may use cookies or web beacons to note which product and service descriptions your browser visited. The use of cookies, web beacons, or similar technologies by these providers is subject to their own privacy policies, not RDK Management’s privacy policy for this website. If you do not want the benefits of the cookies used by these providers, you may opt-out of them by visiting http://www.networkadvertising.org/consumer/opt_out.asp or by visiting their opt-out pages.
 
 Your Access to and Control over your information?
 You may opt out of any future contacts from us at any time. You can do the following at any time via email to support@rdkcentral.com or info@rdkcentral.com or unsubscribe to emails.
 
 Request to see all the information stored in the system
 Accuracy of your data can be checked or corrected.
 Personal data will be archived, in case user does not access our system for 90 days. However, user can request for deletion by writing to us at support@rdkcentral.com
 Express any concern you have about our use of your data
 Opt out from receiving emails by clicking unsubscribe.
 How do users opt out of RDK-related promotional e-mail?
 You can opt out of receiving RDK-related promotional e-mail from RDK Management using the opt-out link found in the footer of any of these e-mails. You can also e-mail the request to the attention of “RDK Management – E-mail Opt Out” via e-mail to info@rdkcentral.com.
 
 Other Websites
 
 To make our website more valuable to our users, we may offer some features in conjunction with other providers. Our website may also include links to other websites whose privacy policies and practices we don’t control. Once you leave our website by linking to another one (you can tell where you are by checking the address – known as a URL – in the location bar on your browser), use of any information you provide is governed by the privacy policy of the operator of the website you’re visiting. That policy may differ from ours. If you can’t find the privacy policy of any of these websites via a link from the site’s homepage, you should contact the website directly for more information.
 
 Security
 
 All information gathered on our website is stored within a database accessible only to RDK Management, its affiliates, and their specifically-authorized contractors and vendors. However, as effective as any security measure implemented by RDK Management may be, no security system is impenetrable. We cannot guarantee the complete security of our database, nor can we guarantee that information you supply won’t be intercepted while being transmitted to us over the Internet. If you don’t want us to know any particular information about you, don’t include it in anything that you submit or post to this website or send to us in e-mail. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
 
 Changes to this Privacy Policy
 
 We may change this privacy policy from time to time. If we change this privacy policy at some point in the future, we’ll post the changes on our website and by continuing to use the website after we post any changes, you accept and agree to this privacy statement, as modified.
 
 A Special Note About Children
 
 This website is not directed to children under the age of 13, and RDK Management does not knowingly collect personally identifiable information from anyone under the age of 18 on this website.
 
 Contacting us:
 
 If you have any questions about RDK Management, LLC privacy policy, the data we hold on you, or you would like to exercise one of your data protection rights, please do not hesitate to contact us.
 
 Data Protection Officer:  Herman-Jan Smith
 
 Email us at: hj.smith@rdkcentral.com
 
 Contacting the appropriate authority:
 
 Should you wish to report a complaint or if you feel that Our Company has not addressed your concern in a satisfactory manner, you may contact the Information Commissioner’s Office.
 
 Email: compliance_team@rdkcentral.com
 
 Address:  1701 JFK Boulevard, Philadelphia, PA 19103 U.S.A`;
  class PrivacyPolicyScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        h: 1080,
        w: 1920,
        clipping: true,
        PrivacyPolicy: {
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

    _handleUp() {
      if (this.tag("PrivacyPolicy").y < 35) {
        this.tag("PrivacyPolicy").y += 35;
      }
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
   * Class for Privacy Screen.
   */

  const xcastApi = new XcastApi();
  class PrivacyScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        PrivacyScreenContents: {
          LocalDeviceDiscovery: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Local Device Discovery'),
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
              src: Utils.asset('images/settings/ToggleOffWhite.png')
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
                text: Language.translate('USB Media Devices'),
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
              src: Utils.asset('images/settings/ToggleOffWhite.png')
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
                text: Language.translate('Audio Input'),
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
              src: Utils.asset('images/settings/ToggleOffWhite.png')
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
                text: Language.translate('Clear Cookies and App Data'),
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
                text: Language.translate('Privacy Policy and License'),
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          }
        },
        PrivacyPolicyScreen: {
          type: PrivacyPolicyScreen,
          visible: false
        }
      };
    }

    _init() {
      xcastApi.getEnabled().then(res => {
        if (res.enabled) {
          this.tag('LocalDeviceDiscovery.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
        } else {
          this.tag('LocalDeviceDiscovery.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
        }
      });
      this.USBApi = new UsbApi();
      this.AppApi = new AppApi();

      if (!Storage.get('UsbMedia')) {
        this.USBApi.activate().then(res => {
          // activate the api and set UsbMedia for the first time in storage
          this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
          this.fireAncestors('$registerUsbEvent');
          Storage.set('UsbMedia', 'ON');
        });
      } else if (Storage.get('UsbMedia') === 'ON') {
        this.USBApi.activate().then(res => {
          this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
          this.fireAncestors('$registerUsbEvent');
        });
      } else if (Storage.get('UsbMedia') === 'OFF') {
        this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOffWhite.png'); // this.USBApi.deactivate().then(res => {
        //     this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
        // })
      }
    }

    _focus() {
      this._setState('LocalDeviceDiscovery'); //can be used on init as well

    }

    hide() {
      this.tag('PrivacyScreenContents').visible = false;
    }

    show() {
      this.tag('PrivacyScreenContents').visible = true;
    }

    toggleLocalDeviceDiscovery() {
      xcastApi.getEnabled().then(res => {
        if (!res.enabled) {
          xcastApi.activate().then(res => {
            if (res) {
              this.tag('LocalDeviceDiscovery.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
            }
          });
        } else {
          xcastApi.deactivate().then(res => {
            if (res) {
              this.tag('LocalDeviceDiscovery.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
            }
          });
        }
      });
    }

    static _states() {
      return [class LocalDeviceDiscovery extends this {
        $enter() {
          this.tag('LocalDeviceDiscovery')._focus();
        }

        $exit() {
          this.tag('LocalDeviceDiscovery')._unfocus();
        }

        _handleUp() {
          this._setState('PrivacyPolicy');
        }

        _handleDown() {
          this._setState('UsbMediaDevices');
        }

        _handleEnter() {
          this.toggleLocalDeviceDiscovery();
        }

      }, class UsbMediaDevices extends this {
        $enter() {
          this.tag('UsbMediaDevices')._focus();
        }

        $exit() {
          this.tag('UsbMediaDevices')._unfocus();
        }

        _handleUp() {
          this._setState('LocalDeviceDiscovery');
        }

        _handleDown() {
          this._setState('AudioInput');
        }

        _handleEnter() {
          let _UsbMedia = Storage.get('UsbMedia');

          if (_UsbMedia === 'ON') {
            Storage.set('UsbMedia', 'OFF');
            this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
            this.fireAncestors('$initializeUSB'); // this.USBApi.deactivate().then(res => {
            //     Storage.set('UsbMedia','OFF')
            //     this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOffWhite.png')
            // })
          } else if (_UsbMedia === 'OFF') {
            this.USBApi.activate().then(res => {
              Storage.set('UsbMedia', 'ON');
              this.tag('UsbMediaDevices.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
              this.fireAncestors('$registerUsbEvent');
              this.fireAncestors('$initializeUSB');
            });
          }
        }

      }, class AudioInput extends this {
        $enter() {
          this.tag('AudioInput')._focus();
        }

        $exit() {
          this.tag('AudioInput')._unfocus();
        }

        _handleUp() {
          this._setState('UsbMediaDevices');
        }

        _handleDown() {
          this._setState('ClearCookies');
        }

        _handleEnter() {// 
        }

      }, class ClearCookies extends this {
        $enter() {
          this.tag('ClearCookies')._focus();
        }

        $exit() {
          this.tag('ClearCookies')._unfocus();
        }

        _handleUp() {
          this._setState('AudioInput');
        }

        _handleDown() {
          this._setState('PrivacyPolicy');
        }

        _handleEnter() {
          this.AppApi.clearCache().then(() => {//location.reload(true)
          });
        }

      }, class PrivacyPolicy extends this {
        $enter() {
          this.tag('PrivacyPolicy')._focus();
        }

        $exit() {
          this.tag('PrivacyPolicy')._unfocus();
        }

        _handleUp() {
          this._setState('ClearCookies');
        }

        _handleDown() {
          this._setState('LocalDeviceDiscovery');
        }

        _handleEnter() {
          this._setState('PrivacyPolicyScreen');

          this.hide();
        }

      }, class PrivacyPolicyScreen extends this {
        $enter() {
          this.tag('PrivacyPolicyScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Privacy / Privacy Policy');
        }

        _getFocused() {
          return this.tag('PrivacyPolicyScreen');
        }

        $exit() {
          this.tag('PrivacyPolicyScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Privacy');
        }

        _handleBack() {
          this._setState('PrivacyPolicy');

          this.show();
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
  class EnergySavingsItem extends lng$1.Component {
    static _template() {
      return {
        zIndex: 1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        },
        Item: {
          w: 1920 - 300,
          h: 90,
          rect: true,
          color: 0x00000000
        },
        BottomLine: {
          y: 0 + 90,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
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

      this.appApi.setPreferredStandbyMode(standbyMode).then(result => {
        console.log("setPreferredStandbyMode " + JSON.stringify(result));
        self.fireAncestors("$resetPrevTickObject", self);
        this.fireAncestors("$updateStandbyMode", this._item);
        self.tag("Item.Tick").visible = true;
      });
    }

    set item(item) {
      this._item = item;
      var self = this;
      this.tag('Item').patch({
        Tick: {
          x: 10,
          y: 45,
          mountY: 0.5,
          texture: lng$1.Tools.getSvgTexture(img$5, 32.5, 32.5),
          color: 0xffffffff,
          visible: self.isTicked ? true : false //implement the logic to show the tick

        },
        Left: {
          x: 50,
          y: 45,
          mountY: 0.5,
          text: {
            text: item,
            fontSize: 25,
            textColor: 0xffFFFFFF,
            fontFace: CONFIG.language.font
          } // update the text

        }
      });
    }

    _focus() {
      this.tag('TopLine').color = CONFIG.theme.hex;
      this.tag('BottomLine').color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag('TopLine').h = 6;
      this.tag('BottomLine').h = 6;
    }

    _unfocus() {
      this.tag('TopLine').color = 0xFFFFFFFF;
      this.tag('BottomLine').color = 0xFFFFFFFF;
      this.patch({
        zIndex: 1
      });
      this.tag('TopLine').h = 3;
      this.tag('BottomLine').h = 3;
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
  class EnergySavingsScreen extends lng$1.Component {
    static _template() {
      return {
        EnerygySavingContents: {
          List: {
            type: lng$1.components.ListComponent,
            w: 1920 - 300,
            itemSize: 90,
            horizontal: false,
            invertDirection: true,
            roll: true,
            rollMax: 900,
            itemScrollOffset: -6
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

    static _states() {
      return [class Options extends this {
        _getFocused() {
          return this.tag('List').element;
        }

        _handleDown() {
          this.tag('List').setNext();
        }

        _handleUp() {
          this.tag('List').setPrevious();
        }

        _handleEnter() {
          // this.tag("List").element.patch({ "Item.Tick.visible": true });
          this.tag("List").element.tag("Tick").visible = true; // enable the tick mark in VideoAudioItem.js
          //to update the resolution value on Video Screen
        }

      }];
    }

    _focus() {
      this._appApi = new AppApi();

      this._setState("Options");

      const options = ["Deep Sleep", "Light Sleep"];
      this.tag('EnerygySavingContents').h = options.length * 90;
      this.tag('EnerygySavingContents.List').h = options.length * 90;
      var standbyMode = "";

      this._appApi.getPreferredStandbyMode().then(result => {
        if (result.preferredStandbyMode == "LIGHT_SLEEP") {
          standbyMode = "Light Sleep";
        } else if (result.preferredStandbyMode == "DEEP_SLEEP") {
          standbyMode = "Deep Sleep";
        }

        this.tag('List').items = options.map((item, index) => {
          return {
            ref: 'Option' + index,
            w: 1920 - 300,
            h: 90,
            type: EnergySavingsItem,
            isTicked: standbyMode === item ? true : false,
            item: item,
            energyItem: true
          };
        });
      });
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
  class SleepTimerScreen extends lng$1.Component {
    static _template() {
      return {
        List: {
          w: 1920 - 300,
          type: lng$1.components.ListComponent,
          itemSize: 90,
          horizontal: false,
          invertDirection: true,
          roll: true,
          rollMax: 900,
          itemScrollOffset: -5
        }
      };
    }

    _init() {
      new AppApi();
      this.fireAncestors('$registerInactivityMonitoringEvents');
      this.lastElement = false;
      this.options = [{
        value: 'Off',
        tick: true
      }, {
        value: '30 Minutes',
        tick: false
      }, {
        value: '1 Hour',
        tick: false
      }, {
        value: '1.5 Hours',
        tick: false
      }, {
        value: '2 Hours',
        tick: false
      }, {
        value: '3 Hours',
        tick: false
      }];
      this.tag('List').h = this.options.length * 90;
      this.tag('List').items = this.options.map(item => {
        return {
          w: 1920 - 300,
          h: 90,
          type: SettingsItem,
          item: item.value
        };
      });
      this.tag('List').getElement(0).tag('Tick').visible = true;

      this._setState('Options');
    }

    static _states() {
      return [class Options extends this {
        _getFocused() {
          return this.tag('List').element;
        }

        _handleDown() {
          this.tag('List').setNext();
        }

        _handleUp() {
          this.tag('List').setPrevious();
        }

        _handleEnter() {
          this.options.forEach((element, idx) => {
            if (element.tick) {
              this.tag('List').getElement(idx).tag('Tick').visible = false;
              this.options[idx].tick = false;
            }
          });
          this.tag('List').element.tag('Tick').visible = true;
          this.options[this.tag('List').index].tick = true;
          this.fireAncestors('$sleepTimerText', this.options[this.tag('List').index].value);
          this.fireAncestors('$resetSleepTimer', this.options[this.tag('List').index].value);
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
   * Class for Video and Audio screen.
   */

  class LanguageScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        h: 1080,
        w: 1920,
        clipping: true,
        LanguageScreenContents: {
          EnglishTick: {
            y: 45,
            mountY: 0.5,
            texture: lng$1.Tools.getSvgTexture(img$5, 32.5, 32.5),
            color: 0xffffffff,
            visible: localStorage.getItem('Language') === 'english' || localStorage.getItem('Language') === null ? true : false
          },
          English: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 60,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'English',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          SpanishTick: {
            y: 130,
            mountY: 0.5,
            texture: lng$1.Tools.getSvgTexture(img$5, 32.5, 32.5),
            color: 0xffffffff,
            visible: localStorage.getItem('Language') === 'spanish' ? true : false
          },
          Spanish: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 60,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Spanish',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          }
        }
      };
    }

    _focus() {
      if (localStorage.getItem('Language') === 'english' || localStorage.getItem('Language') === null) {
        this._setState('English');
      } else if (localStorage.getItem('Language') === 'spanish') {
        this._setState('Spanish');
      }
    }

    static _states() {
      return [class English extends this {
        $enter() {
          this.tag('English')._focus();
        }

        $exit() {
          this.tag('English')._unfocus();
        }

        _handleUp() {
          this._setState('Spanish');
        }

        _handleDown() {
          this._setState('Spanish');
        }

        _handleEnter() {
          localStorage.setItem('Language', 'english');
          location.reload();
        }

      }, class Spanish extends this {
        $enter() {
          this.tag('Spanish')._focus();
        }

        $exit() {
          this.tag('Spanish')._unfocus();
        }

        _handleUp() {
          this._setState('English');
        }

        _handleDown() {
          this._setState('English');
        }

        _handleEnter() {
          localStorage.setItem('Language', 'spanish');
          location.reload();
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
   * Class for Other Settings Screen.
   */

  class OtherSettingsScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        OtherSettingsScreenContents: {
          SleepTimer: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Sleep Timer: Off'),
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          RemoteControl: {
            alpha: 0.3,
            // disabled
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Remote Control',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          ScreenSaver: {
            alpha: 0.3,
            // disabled
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Screen-Saver: ',
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Energy Saver: '),
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          Language: {
            //alpha: 0.3, // disabled
            y: 450 - 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Language'),
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          Privacy: {
            //alpha: 0.3, // disabled
            y: 540 - 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Privacy'),
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Advanced Settings'),
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          }
        },
        SleepTimerScreen: {
          type: SleepTimerScreen,
          visible: false
        },
        RemoteControlScreen: {
          type: RemoteControlScreen,
          visible: false
        },
        EnergySavingsScreen: {
          type: EnergySavingsScreen,
          visible: false
        },
        LanguageScreen: {
          type: LanguageScreen,
          visible: false
        },
        PrivacyScreen: {
          type: PrivacyScreen,
          visible: false
        },
        AdvancedSettingsScreen: {
          type: AdvanceSettingsScreen,
          visible: false
        }
      };
    }

    _init() {
      this._appApi = new AppApi();
    }

    $updateStandbyMode(standbyMode) {
      this.tag("EnergySaver.Title").text.text = Language.translate("Energy Saver: ") + standbyMode;
    }

    $sleepTimerText(text) {
      this.tag('SleepTimer.Title').text.text = Language.translate('Sleep Timer: ') + text;
    }

    _focus() {
      this._setState('SleepTimer'); //can be used on init as well


      this._appApi.getPreferredStandbyMode().then(result => {
        var currentStandbyMode = "";

        if (result.preferredStandbyMode == "LIGHT_SLEEP") {
          currentStandbyMode = "Light Sleep";
        } else if (result.preferredStandbyMode == "DEEP_SLEEP") {
          currentStandbyMode = "Deep Sleep";
        }

        this.tag("EnergySaver.Title").text.text = Language.translate("Energy Saver: ") + currentStandbyMode;
      });
    }

    hide() {
      this.tag('OtherSettingsScreenContents').visible = false;
    }

    show() {
      this.tag('OtherSettingsScreenContents').visible = true;
    }

    static _states() {
      return [class SleepTimer extends this {
        $enter() {
          this.tag('SleepTimer')._focus();
        }

        $exit() {
          this.tag('SleepTimer')._unfocus();
        }

        _handleUp() {
          this._setState('AdvancedSettings');
        }

        _handleDown() {
          // this._setState('RemoteControl')
          this._setState('EnergySaver');
        }

        _handleEnter() {
          this._setState('SleepTimerScreen');
        }

      }, class RemoteControl extends this {
        $enter() {
          this.tag('RemoteControl')._focus();
        }

        $exit() {
          this.tag('RemoteControl')._unfocus();
        }

        _handleUp() {
          this._setState('SleepTimer');
        }

        _handleDown() {
          this._setState('ScreenSaver');
        }

        _handleEnter() {
          this._setState('RemoteControlScreen');
        }

      }, class ScreenSaver extends this {
        $enter() {
          this.tag('ScreenSaver')._focus();
        }

        $exit() {
          this.tag('ScreenSaver')._unfocus();
        }

        _handleUp() {
          this._setState('RemoteControl');
        }

        _handleDown() {
          this._setState('EnergySaver');
        }

        _handleEnter() {// 
        }

      }, class EnergySaver extends this {
        $enter() {
          this.tag('EnergySaver')._focus();
        }

        $exit() {
          this.tag('EnergySaver')._unfocus();
        }

        _handleUp() {
          this._setState('SleepTimer');
        }

        _handleDown() {
          // this._setState('Theme')
          this._setState('Language');
        }

        _handleEnter() {
          this._setState('EnergySavingsScreen');
        }

      }, class Language extends this {
        $enter() {
          this.tag('Language')._focus();
        }

        $exit() {
          this.tag('Language')._unfocus();
        }

        _handleUp() {
          this._setState('EnergySaver');
        }

        _handleDown() {
          this._setState('Privacy');
        }

        _handleEnter() {
          this._setState('LanguageScreen');
        }

      }, class Privacy extends this {
        $enter() {
          this.tag('Privacy')._focus();
        }

        $exit() {
          this.tag('Privacy')._unfocus();
        }

        _handleUp() {
          this._setState('Language');
        }

        _handleDown() {
          this._setState('AdvancedSettings');
        }

        _handleEnter() {
          this._setState('PrivacyScreen');
        }

      }, class AdvancedSettings extends this {
        $enter() {
          this.tag('AdvancedSettings')._focus();
        }

        $exit() {
          this.tag('AdvancedSettings')._unfocus();
        }

        _handleUp() {
          this._setState('Privacy');
        }

        _handleDown() {
          this._setState('SleepTimer');
        }

        _handleEnter() {
          this._setState('AdvancedSettingsScreen');
        }

      }, class SleepTimerScreen extends this {
        $enter() {
          this.hide();
          this.tag('SleepTimerScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Sleep Timer');
        }

        $exit() {
          this.show();
          this.tag('SleepTimerScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
        }

        _getFocused() {
          return this.tag('SleepTimerScreen');
        }

        _handleBack() {
          this._setState('SleepTimer');
        }

      }, class RemoteControlScreen extends this {
        $enter() {
          this.hide();
          this.tag('RemoteControlScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Remote Control');
        }

        $exit() {
          this.show();
          this.tag('RemoteControlScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
        }

        _getFocused() {
          return this.tag('RemoteControlScreen');
        }

        _handleBack() {
          this._setState('RemoteControl');
        }

      }, // 
      class PrivacyScreen extends this {
        $enter() {
          this.hide();
          this.tag('PrivacyScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Privacy');
        }

        $exit() {
          this.show();
          this.tag('PrivacyScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
        }

        _getFocused() {
          return this.tag('PrivacyScreen');
        }

        _handleBack() {
          this._setState('Privacy');
        }

      }, class AdvancedSettingsScreen extends this {
        $enter() {
          this.hide();
          this.tag('AdvancedSettingsScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings');
        }

        $exit() {
          this.show();
          this.tag('AdvancedSettingsScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
        }

        _getFocused() {
          return this.tag('AdvancedSettingsScreen');
        }

        _handleBack() {
          this._setState('AdvancedSettings');
        }

      }, class EnergySavingsScreen extends this {
        $enter() {
          this.hide();
          this.tag('EnergySavingsScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Energy Saver');
        }

        $exit() {
          this.show();
          this.tag('EnergySavingsScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
        }

        _getFocused() {
          return this.tag('EnergySavingsScreen');
        }

        _handleBack() {
          this._setState('EnergySaver');
        }

      }, class LanguageScreen extends this {
        $enter() {
          this.hide();
          this.tag('LanguageScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Language');
        }

        _getFocused() {
          return this.tag('LanguageScreen');
        }

        $exit() {
          this.show();
          this.tag('LanguageScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings');
        }

        _handleBack() {
          this._setState('Language');
        }

      }];
    }

  }

  var img$4 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAACxLAAAsSwGlPZapAAAGuWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTAyVDE2OjE4OjUyLTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0yMVQwOTozOTo0NS0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0yMVQwOTozOTo0NS0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMDEzODUxYy0xNWRiLTQ5ZjgtYTA5ZC0wMTVhMTJiMTViYmQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDhkZThiYi0xNjJkLTQwODktYjg2OS0wMjYzZGY3ZmNkMTMiIHN0RXZ0OndoZW49IjIwMjEtMDgtMDJUMTY6MTg6NTItMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmN2JiZjlkNi03OTY5LTQ4M2EtYTdlYi1iNDM4NGMzNDJjM2EiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6MjQ6NDgtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMDEzODUxYy0xNWRiLTQ5ZjgtYTA5ZC0wMTVhMTJiMTViYmQiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6Mzk6NDUtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjZqHi4AAA+hSURBVHic7d17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";

  var img$3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAACxLAAAsSwGlPZapAAAGuWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTAyVDE2OjE4OjUyLTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0yMVQwOToyOToyNi0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0yMVQwOToyOToyNi0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYmIzZDcwOC02MGMxLTQ4MTAtOGRkMi05MDY1MzQ3NDA0MTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDhkZThiYi0xNjJkLTQwODktYjg2OS0wMjYzZGY3ZmNkMTMiIHN0RXZ0OndoZW49IjIwMjEtMDgtMDJUMTY6MTg6NTItMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmN2JiZjlkNi03OTY5LTQ4M2EtYTdlYi1iNDM4NGMzNDJjM2EiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6MjQ6NDgtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmYmIzZDcwOC02MGMxLTQ4MTAtOGRkMi05MDY1MzQ3NDA0MTQiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6Mjk6MjYtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk7s+1gAACNQSURBVHic7d15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";

  var img$2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAACxLAAAsSwGlPZapAAAGuWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTAyVDE2OjE4OjUyLTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0yMVQwOToyNjozOC0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0yMVQwOToyNjozOC0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyN2RmOTM5Yi0xZmU5LTRjNjgtYmE2OS1lNTEyM2VmYWMyNDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDhkZThiYi0xNjJkLTQwODktYjg2OS0wMjYzZGY3ZmNkMTMiIHN0RXZ0OndoZW49IjIwMjEtMDgtMDJUMTY6MTg6NTItMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmN2JiZjlkNi03OTY5LTQ4M2EtYTdlYi1iNDM4NGMzNDJjM2EiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6MjQ6NDgtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyN2RmOTM5Yi0xZmU5LTRjNjgtYmE2OS1lNTEyM2VmYWMyNDEiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6MjY6MzgtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlaRZPgAACKlSURBVHic7d13mF1Vvcbx76SHVEhIRcINPZRQJBQpEhAhNAFRmigITEQQEAH1ohQrCCpYOAgIelGaghA6Sq9iaAk9EEoCIUBCegJJ5v7x7nECmXrO2mWd836e5zykzKy9ycy8Z++1f+u36hoaGjAzi0GnvE/AzKy9HFhmFg0HlplFw4FlZtFwYJlZNBxYZhYNB5aZRcOBZWbRcGCZWTQcWGYWDQeWmUXDgWVm0XBgmVk0HFhmFg0HlplFw4FlZtFwYJlZNBxYZhYNB5aZRcOBZWbRcGCZWTQcWGYWDQeWmUXDgWVm0XBgmVk0HFhmFg0HlplFw4FlZtFwYJlZNBxYZhYNB5aZRcOBZWbRcGCZWTQcWGYWDQeWmUXDgWVm0XBgmVk0HFhmFg0HlplFw4FlZtFwYJlZNBxYZhYNB5aZRaOuvr4+73OwfHQDugM9gF7Jr1cF+gBDgdWTX/cF+gNdgdWA3sBAoDPwUfJnvdpxvMXAe8k484F5wDJgzides4FZwALgLWAusBBYBHyY/PmS8v+3rUhKpVKHPr5LSudhxdAN6IfCZzAKl2HAp4A1kz8flPy6b8rn0i85h3IsROE1C3gTeD359SvATBRys4EPkpdVKQdW9RiKgmgNYG1gePLfIcBa6KooVqsA6yS/HtPM3y9CgfYWMCV5vQO8DEwH3kBXgxY5B1acPgWsD2wJbICulNZCIdU/t7PKT08UzmsDO6zw54tRiE1DofUq8BLwFPBstqdoITiwiq8b8BlgC+DTKJgGJa/e+Z1WFHoAI5PXihpDbDowCZgIPIauyqzAHFjF0hNNfG+IQmo7YD10O9cnx/OqNsOSF8B+6JZyNroKewSF12PoIcH8PE7QmufAylcX9IMzAt3KfBbYCoVT5/xOq+b0TF7DgG2ABvRE8hngQeBu4AV0ZbYwp3M0HFh56A9sgm7vtkJBtUaeJ2QrqUNlHlslr5NQycVDyesJYDK6rbQMObCyMZimq6dt0a2exaUfMC55gSbtGwPsQTShbylzYKVnJAqnz6GrqY3yPR0LbKPkdQyqB3sReBS4BV2BWQocWGGNBHYF9kW3fcPx8qda0FhSMQ44Ht0uPgRch55CNuR3atXFgVW5geiJ3heBsahQ0yFVu1YHdk5ex6G6r+uAa1EZxbL8Ti1+DqzyDEKlB/smr0/W+ZiBHrCMSV4/Ba4AJqArsKm5nVXEHFgd82n0zXc0sFm+p5KapahCfAFaeLw4ec1Gj/SXJn9H8uezaF8JxjK0XrGx2LUHWnLTC30f9k7+vkfy6/4V/58US1f0fXM0Ko/4MyqXuCvPk4qNA6t9DgW2Bw4h/UXCWZiKfmhmo8XE76LgmYtuWxaigsnZqKiy8fdpqUNP4fqjeqh+6FZ7leS/Q9CtVn+0ZnJk8vseKZ5TmoYB301eE4BbgRuBt/M8qRg4sFo2GDgNlSJsn/O5lOND9LRqOloM/BJNwTQDeB+F0NK8TnAFDbS/00IfFGCNXSgGoTq2ddCDjv9BXSlisXfyOgG4F8133Z3nCRWZA+vjOgM7AseioBqR7+m0y2JUwPgi8BrwMKoRWoSWllRb/6h5yeuT6oABKND6oyVNawOjgU3R17IbxV1BsEHyOgR4ErgcuAZ9fS3hwJIhKKC+gQo8e+Z6Ni2bi27TpqKOA5OA+9CV0xJ0VVWrj9AbUEC/l/z+yeS/XdHXsz+wMZqD3BqFQx90NVaX5Ym2oS+wE7qqPw24ALgZXSnXvFoPrOHAnsD3UBeEopmDKqinAQ+gBbkTaZr0trZ9lLzmosXNtyZ/3g0YhdYObofa9YykOH3DOqMn0SV0C38FKo14spXPqXq1Glgjgb2A8eiboiiWokfek4CngcfRLV4R5pmqzYfoKvUpFAqgq+yt0W3khsnvu+Vwbp80BE3Qn4KuuK5G3xs1p9YCay20kHVPNL9RBHPQo+1H0ST5JJpuayxbj9MUBD1ReG0IbI6q2IfndF6NOgPfBr4OXA/8lhpbBlQrgTUUvUPtRTGKPKejb7h7UBvf54DluZ6RfdIi9NTu3uT366LvnZ2BPdBEfl76AUegEL0D+Blqf1P1qj2wRqC1XQeR77vjYrRZwg2o3uZFVAdl8Xg5ed0BnIe+tw4GdkdX7u3ZOSi0wcDhyTlMAH5Flbd+rtbAGgp8Cfgh+dXkLKJpsvyv6JbPk+XVofFp5ETgB+iJ40Fo4fv6ZB9eg9Bt4iHAZcDFaC606lRbYA1Ft32noEv4PDyHJnKvRU+kvFtLdVuEntw1Pr3bE92qNTb/y1JPtOD6m8C5wB9RwXDVqKbAOhrd/m2Sw7E/QH2QHkFPcN7P4RysGG5JXp2BLwCfB3Yh27nTOlTDdTjwG+D36OFO9KohsMYB30GToVl7HBX13UyNPa2xNi0D/p68RqJW2F8l2+/ToahLxP6oav4CIr/ijzmw1gVOR32oVsnwuHNRQF2FCjnfzfDYFqdXk9cNaI7r4OQ1JKPjfzp5jQNOBf6T0XGDizGwBqElNPXoHSQLDaja+K/AH9DSmKjfqSwXc2mq9ToXBcjpKLiyWA62M6r5uxq4EHg+g2MGFVNnzDr0Bb4TOJNswmoZmkw9Di2m/Q6axHRYWaVmoEnxzdEt241kswdif7TC407gRLK9O6lYLIG1AXpcewtaNpG2RWju4atoO/jf4w01LR1zgNvRBP2BaKohi5UOa6C6rWvQgv8oxBBYX0f9gY7I4FjLgStRacQXgb9Qu90PLHu3o1qq3YGfk83WYXuhFRfnkt2cWtmKHFhbA/8ELiWb27/LUC+sr+AGapaviaiDyOfQJHkWqyJOAf6FSiEKq4iB1RU9ir0F1a+kqfGKagxwFNqayawoXgV+gXZl+jbp1/eNoqlx4PopH6ssRQus7dDl6fdQ98i0zEWtaHdAt5o12arDovEamm/aBDiDdHu/d0LL2u4EDkMXEIVRlMDqi9Zk3Y3eTdLSGFTj0BfFvaYsJm8DZ6Mdm36GgiwtawL/h55kZlU+1KYiBNamqNXK2UD3FI8zAdgPBZVv/SxmM4Hvo7qqq1M+1mFoTew+KR+nXfIOrKPQxHqac1X/Br6M/sE9mW7V5DVUMb8PmndKy2aoTuyX5NyBNa/AGgn8DbgEbdWUhmkoEPdEnRPMqtUE1N7mS2gBflpOAh4kn3W7QD6BtRv6Bz4gpfE/BH6NJvAvw+2GrXZch+qqjia9XXa2Av6BquQzl2Vg9QB+BNyEHp+GthwV3u2I3gneTOEYZkU3C9Uufh7dxSxM4Rh90VPLi9HkfGayCqw10cLh00lnYv154BjUa/uxFMY3i82zaKnPQaRXtnMMcBuwbUrjrySLwNoZTazvl9L4f0BXVZelNL5ZzCagwugT0Ca8oY1CbcC/ncLYK0k7sE5F7SzSaFf8KHo6Uo/nqczaciFa6jMhhbE7A+ejuq20HqIB6QXWasCfgXPQ/0xI82jasiuNf3yzajUR3SYeRTrrEw9DE/+p7fmZRmBthibWv5LC2Hehmq1zcN90s3IsQdMnY1Erm9D7Ye4E3AccGnhcIHxg7Y7CKvTymvlo6c44vO7PLIQXUaiMJ3wJxHAUiscSOGNCDnYqemLwqYBjgjp8Hgj8GK/7MwupARVv74juXkLqDvwOBVddqEFDBdY5ySu0i9Gl6+0pjG1m8ipaEfI9wj/A+hqa1wrSHLDSwBqEFi6fGuBcVvQasDfpXK6a2co+Ql1OdwOeCTz2Aag54PaVDlRJYI1Cq7hD11fdgnpM3xx4XDNr25OoSv78wOOOQldaFa1DLDewtkCbNGxZycE/YQlqMfMl4PWA45pZx8xAO0Qdkvw6lCFouVDZFQTlBNa+qP5pg3IP2ozXUJuMM0hn7ZOZddxV6HbugYBjNtZonlXOJ3c0sI5BrVqGlXOwFtyBajduCDimmYXxMKqQvzjwuD9Eezd0SF19fX17P/ZY9JgypAtRZ4XQxWsW3gCgF9AHbb7ZHz0W7wr0QysaWtoSrRPa63F28vGz0RTAYlQAPD/5tRXbEWjtbsgd488plUrfbe8HtzewTiVs2cJ84DS0Qanlqw41VByCumqsBqwFDARWReHUE7UU6Zn8vjvQGwVUF9q/UcFCFGzz0VOpJajP/qLk7+ah4HoTtQF+D3gDPSmelnys5WtXdKGxYcAx/1AqldoVRO0JrO9RxqVbK54FjkStiy0bXdBV0EYojIah9V6boCumvjRdPYV89wxhHgq4+cAC9EDmxRVeb6NQc1FxdoaidlGfDTjmBOCoUqk0s7UPai2wugEXoFqoUG4DvglMDTimNemEQqcPsB7a4GMjYHMUVD3R1VHoBel5WIauxj5CV19PAK+g3mgTUdDNQR1oLbz+6ELmGwHHvAP4WqlUavHJZEuB1QV1LfxqwJP5PeqZsyTgmLWuDl0tjUAbX24NbIyunPrmeF5F8BLwH7T29Gl0FTYNf/+FdhLanCKUx4EDS6VSs6VNzQVWZ+AK1CoilB+gtYBWuUHoqmk0asw2mnRaTleb6SjAnkJXY8+Q7r5+teRwVCUfav/CJ4AvlEqlldqcfzKwuqAaiYMDHXguuqW8KtB4tWo0muzcNPn1pgRcUFqjpgCT0O3j42gLOM+DlW8jtBVYqF5Yk4H9SqXSlBX/cMXA6gJcTrgrq5nJWKFXgdeKvdC6rk3Q7V5hdt+tQguB59Ak/rVo3duCXM8oTuuj/RFHBxpvMnBAqVR6qfEPGgOrM2ozcUSgA01B5fePBhqvFqyCtlA6FNgBlRiskusZ1aaFaDnKU+hJ2H2oVqylGjP7uBGo7CHUTtFPoDmtV6EpsH6G2g6HcA8qMn0h0HjVbBC6hD4AfYHXJJ1dhaw8S9G0xk3oyutp0mktXG16oYn4YwKNdyewT6lUWtIFtTQ+LdDAd6ArBLcvbt0WqDvroXjCvMi6oELaryWvqWjR/wNoJyive23eAjR3vRj4VoDxdkM/K3+sq6+vL6GdZyp1K+q04Hv/5q2FOjuOQy15uuV6NlapO1ErpHsJ3z+qmvyeMLVak4FxXVDvm0rdhFpROKxWtiMKqL2AdXI+Fwtnt+Q1E81zXZe87OOOBT5AK2YqsTGwXScq30fsElQG4bBq0hP4MlpucCNwIg6rajUI7TlwFdp1/DtonaU1+T5wZoBxPtUFrdHqVeYAFwHH4W4LjQagIrpjgP8hvgn0pWgpy0fJr2cC76L1enOT19uoWrxxofIc9A7a2hrEZeh7bGAy9urJ7xsXVw9DP+TDk1eX5NWNeP4NO6NC3jHoafvdqLPBpDxPqkDOQt8rP6f8r+kHXdBi5MFlfPLFwPE4rEAT53uj8F4j53NpjzkofGahsJmMFhVPQ0tYZqJH+0tQ2Cwn3cf6dcmrc/JaDYXaCLQmchjqKDESrZPsRco7DFdoVPI6Bv2cXIGC66Mcz6kIfo3e8P5Ex0NrIfBcF3TfPbaDn3wZmkir9dqUMWi95TcobuX5e6hdyzsokB5HBZJTUTgVQUPyWo5+qN9KXk8387FDUIBtDayLrmQHoyuzNbM42Q7oht7UjweuRnck9+d6Rvm7Br0JXkXHOoPcDLxQV19f3wdVo2/dzk+8gnAFprHaHj3m/grFe9rX2HZlKnpXfyb5fTX3kuqMwmsTNDm7YfLaOM+TasE16ArjtrxPJGdfBK6kfVdai4AtS6XS842Fo2uigs+RbXzipegyt1avrMag2779KM7E6vtovuRR1FrlWYpz5ZSnoSjEGtvr7IiWjhTBchRYv6O2g2s8uupszSLg4FKpdCN8fC3hmqhX1YmsfNXwNprp/zO1OWc1HLXGORxNHOfpQ+AhVLx4N7p1eg3Pj7Sl8ZZxa2BbVGaS99KnBWgXmZ+idji1aHeULTs083d3AT8ulUr/vY1urr3Mxmjx4oboXvMhtK6q1U6AVWogKk84iXCr0DtqOfq3n4zu4yckv5+f0/lUg24ovLZFhbxbo3mxvJ5IzkK3ihdSY0vaSqUS48eP74NW3IxBD1PeR7Vtz5ZKpY+VS3VkE4pa0g3dY/8EVajnYQoKqduA2/FtXpq6oyuuPdAPzSjy6co6Hz3+v5Kw+wEWVqlU6tDHF61/dxHshNY/7Z/DsWehd5aH0cTsuzmcQy1agtYI/h1tqHEA6j82Fj2FzEpv4BfoYc75aArGVuDAarIGmr87OYdj34WupB7Cm3Pk7SNUgnA1Wp2wO7rqOpjsfl42RW9Ye6GJ+fsyOm7hObCkHgXVuhkecxH6ZvwXWkDrffmKZwrw2+TXv0NXXYcSdour1hyIblMvBs6muktT2qWcreqrycZofqhENmHVgCZVv4ImGU9Jju+wKr7H0JzmWLSq4QayaancG72Z3o+u9opaoJyJWg2svmir7PsI062iLXOAf6CyiG3QpGqtPsaO3Qz0tPYgYBfgL2QzQT4aheSfiGP5Vypq8ZZwG7SL9Y4ZHGs2avR2AZqfsurxIbrquR+VSIxHD2rSLE7tga7Od0GlNtemeKxCqqUrrO7oquoB0g+rd9BK/b1RU0OHVXV7g6bix58DL6d8vGGobusysn2KmbtaCaxNUPvms0j3qnIecC66zazHQVVr3kWN6nZD32tp184diTqf5lGCk4taCKwjUFjtlOIxPkRPcT6D+uM312XAasdrqGHdWDRhnmY93Tro1vAstH18VavmwBqIJrcvIb09/Raj9jw7AGfgZm32ca+g3WO2RFdeaW3O0hlNd1yfHKtqVWtgfQbVNh1KOksslqJvjt1QQaGLPa01b6K5rc1QTVVa7cR3RncTh1OlP9vV+D91AupisFFK409EvbAOQBP4y1I6jlWfaehp4oGoNCINA1DpwyUUpwVSMNUUWIPQF+nXpNNUbxbabPYzqPbGrFy3oSfIB6FOKGk4EtX+bZbS+LmolsDaCD0tOSql8S9GyzLOQQtlzUK4Bj1R/iHpVM3vgm4R90ph7FxUQ2AdjBYPj05h7OeBL6DL+CdTGN9sJvAjtMD6jhTGH4QeDJ2dwtiZizmwOqFHxlcQ/ingAuA8VGB6Y+CxzZrzJJoXPZrwZRA9gB8Av0HL0qIVa2D1Rltgn0f4+aoH0Qr5U9COM2ZZWYD2TdiWdOZJj0NXcdFWx8cYWANQH+zQrVKX0lTs90Dgsc064hXgMDRx/lbgsbdBPz+bBx43E7EF1mjgVsJ3WHga2AdVC3szByuKy1FLmdAlEFuged/DAo+bupgCayzqHTUm8LgXoW+KWt5uyYprEtpW7lTCPkkcAPwf2rYvGrEEVmPDtCEBx3wHVQQfS400/LdoLUW93ndGO3eHdDFqDR6FGALrEDQBGfLpxoPAnugdxiwWD6LODJcGHvdXqCg6j52COqTogXU48EegT8AxL0JzYBMDjmmWlWmo9OFk1CAylJ+hHm49Ao4ZXJED6xQUVqE2t5yHCkCPBRYGGtMsL79ED4peCTjmkcBfKXCtVlED68eoEV6oS9Tnadp9xKxaPIg6htwQcMz9UNlDv4BjBlPEwDoD+N+A492EbgHd/dOq0auoQv6SgGN+Du3L2D/gmEEULbDOTF6hXIhWxL8ZcEyzomlAhdT1hFudsTtqU7NqoPGCKFJgnYmurkJYBhyPemMtCjSmWZE1oEnzwwm34eo+aKOLwsxpFSWwjiVcWC1BT1F+29YHmlWh29A8VKide/ZDPeYKoQiBtSZweqCx3kT385cHGs8sRnejTiP3BRrvq2hyP3dFCKxDCNMe5j/oH/WWAGOZxW4GMA6tva1UJwpSDV+EwNo1wBiPoEZ7LwQYy6xaLEQb+f4jwFibo/WHuSpCYFXaKP8h9CRweoBzMas2C9BdTKU1iJ2BwZWfTmWKEFiVtHO5F72DpL3DrlnMFqFVHj+tYIw6CrBCpAiBNaXMz/snWggausGZWbX6X7TkrRwz0I7WuSpCYJVTfvAvtLdbyMWfZrXgPOC0Mj4vrX0UO6RL3ieAuiZcgmqn2uMuFFZzUjsjW0mpVOoKrI4mXnuhDhr9ga5ohX8/dNvQ8IlP7QR8iLZpXwZ8gBaiz0F7PS4ZP378rNT/B2xF56Kv1c/b+fETKUgtVhECC+BbqJr2y2183PVo1+V5aZ9QLSqVSn2B9YD1geHJawSabO2VvFZBG390Q0HVifZdqS9HYbYYBdhiNLeytFQqzUZLSt5AIfYs8Drw+vjx4/0wJR3noK/HOW183CT0c/lO6mfUDkUJrMUoiKYm/x2A3rlBk/JzUDuNXyUfa2UqlUrdUOj0Qo+qt0HFuxuggGr8u64tjVGmxlBrDL7W/DfQSqXSXOAltA3Wk6h05R1g/vjx472pbWXOBV5Eq0zWR1/7RnPRDjsnU6C1uHX19aE3n6nYAFQAugF6B3gReAytSrcylEql4cAaaPOB7YFNgHWAnnmeV5mWoR+gx1C74Enowc10B1jZugGfRduLdUFzw/ejYuxUlUqlDn18XUPDJ6ccrAoMRLd2m6IrqO2AdXM9o3TNRPV4jwDPoDe51/I8IUuHA6t69EF96rcHtgY2ozi3/Fl7GV0hPJS8Xsr3dCwUB1bceqCQ2gtdTW2R7+kU0uvo9vE+1MxxWr6nY5VwYMWnO9ru6TDg02jb8W65nlE83kDzMjehJ85+2hwZB1YcOgFrod5E+6OnezFOmBfFUlS5fQnqZjAZP32OggOr2Lqjvkb7o2LZ3FfLV6nrgWvQfJfrvgrMgVVMw1Bpx/5o12vLxgto6cqTwBM5n4s1w4FVLP2Bb6J2ORvneyo1bTZwI9p09985n4utwIFVDL2Ak1CrnE1yPhdr8h6q9v4p8FzO52I4sPI2EO22eyRaGhGTZWh9YOMawWWtfGzjesO65L+x1YfNRJs7/AIFl39ocuLAysfqaEHpyejpXxHNQ0/O5ievqah6fDZa2/le8uez0dq/D1B41TUzVl+0Tq0ruu0dih4gNC6qXhtYDXWfbVxrWMRQWwBcCZxPuF1prAMcWNn7HJrY3TTvE1nBDLSg+B3gefTDOCX5/cvoBzULI9FC7BForeMoFOhDULh1zug82vIWutq6Bng753OpKQ6s7OyA9l88KO8TQYuHJyevp1E7lyyDqSO6ooXw66IAWw9V9G+U50klnkFb1E3I+0RqhQMrfX3Rrtbjya/YcwlwD/AACqmXiHuHoeHAhuhJ6hhgF2BQjudzLXAWnphPnQMrXfsCZ5PP7d9s1Nb2buApFFK5byKQgjp01bUeuor9PPn8e09H81s/wUt+UuPASsfa6B33ALRAOQsNaDL8n8Cl6DZvBlqGUksGoPDaA623HE62ay0fQZs93JPhMWuGAyu8I9At4JoZHW8Gunq6Ds2lvIme1pneLMahrdZHo8n8LMxFm6uci/ceCMqBFc4Q4EfAURkd7wn0bn4Rupqy1g0FDgX2QQ0Ns3jieA9wAuqKagE4sML4PGrmPzqDY90D/A24guqck8rCPqgO7pAMjvUu8H10m24VcmBV7luokDDtQsdLUB+nf6HdZqxyu6K5rmNQ0Wqa/gKcijf+rYgDq3yD0e3YfikeowH4M/AbtDecpWNDVNB7OlqFkJYngHoy2NyhWjmwyjMWbTuW1i3gItQt4NcoqGrtSV9eBqOt3L+OlhCl4QO0rdaFKY1f1RxYHXcYuuLpn9L496P5sFtTGt/aNhr4IZqbbGsPxXIsRx0gzsU1Wx3iwOqY89CC5TQ8geY5fpnS+NZxu6P+ZHulNP5daPJ/dkrjVx0HVvv0AEqonie0eegJ0lm4ZqeovgEcjXrph/bvZHx3OG0HB1bb1kXzDbunMPbN6NbjyRTGtrAGo7mnown/RHgmmje7OfC4VceB1brtUL1T6F2TZ6Bv/itxLVVsdkTrBbcPPO484GtoQwxrgQOrZWOAq9G+fyH9Hfg22iPP4rQKKoE4Du24HcoS4EQ0/WDNcGA1bztU/7R2wDHfRZP25wYc0/K1M1ozOCrwuD8Afhx4zKrgwFrZWLT0ZdWAY96BvgkfDzimFcNw9LWtDzzuL1BlvK3AgfVxu6Kw6hdwzHPQWjJ3UKhuadTnnQN8N+B40XNgNdkD9egONSfxHtq668pA41nxbQxcgK7SQ3ForcCBJTugpzMDA433KKqteSrQeBaPvsAfUfPGUM5CPdZqngNLIXUn4YoC/4KurN4NNJ7FpzN6gngeYWq2FqJGhPcFGCtqnfI+gQLYh3Bh9RM0l+Gwqm3L0K3hEYRZvbBKMlZzez7WlFoPrM7AToHGOhnV5pg1uhK9IYbYoWg7YFiAcaJW64HVG23YWYlZaMLei5atOfejXluV9jNr3Cm7ptV6YC1F27GXawqaW7g9zOlYlZqGvk8eq2CMTviWsOYDayHa8bgcU1BP8Eq+Ca12zES7ft9V5ue/jfY+rGm1HlgNaKPRjnoT7cDiynXriNfQQ5k7y/jch9Ci+ZpW64EFesd7uAMf/zbwBdTHyKyjZqIr845stLoIVdHXPAeWuj0eQ/u6Pr6N+mK52ZpV4n20eclD7fjY5agI+ZlUzygSDix5Fj3JaW1+4Rq05MLfOBbCHDQRfwFqK9Ocd9DV2J+yOqmic6X7x/UBdkM1L+ugd7eX0FPAB/DuNZaOLVHf+I3R9+As4AZUCvFqjudVOA6slvVAk/ItvfuZhdYNFTMvBT7K+VwKyYFlZtHwHJaZRcOBZWbRcGCZWTQcWGYWDQeWmUXDgWVm0XBgmVk0HFhmFg0HlplFw4FlZtFwYJlZNBxYZhYNB5aZRcOBZWbRcGCZWTQcWGYWDQeWmUXDgWVm0eiS9wlYVRgIbA6sB/RDvckB3gNeByYDU/M5NasmDiyrxN7AAWjXl3WB7s18TAMKq5eAW4DfZnZ2VnW8CYWVYwfgDLQdWs8Ofu7jwEXA5aFPyqqfA8s6ojtwCnAa0LuCcZYBVwA/wbeK1gEOLGuv3mgH4v0DjjkR2BeYHnBMq2IOLGuPPsDf0K7YoT2Ndj2elsLYVmVc1mDtcQbphBXAaOAmFIpmrXJgWVv2Bk5I+Ribo3kxs1b5ltBa0wv4NzAqg2MtQ8E1KYNjWaR8hWWt+SLZhBVAZ+D4jI5lkXJgWWsOy/h4BwGDMj6mRcSBZS1ZC1WwZ6k3sHvGx7SIOLCsJWOBvhkfsw4HlrXCgWUtWQ/NK+VxXLNmObCsJcNyOu6qeFG+tcCBZS0ZntNxu+IiUmuBA8tasijHYy/N8dhWYA4sa8k7OR13MTA/p2NbwTmwrCVv5nTcKajpn9lKHFjWkqeAj3I47jM5HNMi4cCyltxBPreFd+VwTIuEA8tasgi4NeNjTgIezviYFhEHlrXmV2T7tPCSjI9nkXFgWWteAC7L6FhPAVdldCyLlPthWVuGA/cC66R8nD2A21M+hkXOV1jWlumk3w30fBxW1g4OLGuP69H2Xmm4IMWxrco4sKy9zgO+g7afDznmibhQ1NrJc1jWUVsBF6P+6+WaDpwJXBrihKx2OLCsHAOAA4GjgS068HnvAn8F/gA8l8J5WZVzYFklBqMrrs8COwEjgdVW+PulwGTgCeAx4AHg+WxP0aqJG6VZJWahQBoArA4sAUas8PcfoCupyaiK3bs7W0V8hWVm0fBTQjOLhgPLzKLhwDKzaDiwzCwaDiwzi4YDy8yi4cAys2g4sMwsGg4sM4uGA8vMouHAMrNoOLDMLBoOLDOLhgPLzKLhwDKzaDiwzCwaDiwzi4YDy8yi4cAys2g4sMwsGg4sM4uGA8vMouHAMrNoOLDMLBoOLDOLhgPLzKLhwDKzaDiwzCwaDiwzi4YDy8yi4cAys2g4sMwsGg4sM4uGA8vMouHAMrNoOLDMLBoOLDOLhgPLzKLhwDKzaDiwzCwaDiwzi4YDy8yi4cAys2j8P+FSG3B1nC+DAAAAAElFTkSuQmCC";

  var img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAACxLAAAsSwGlPZapAAAF6mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTAyVDE2OjE4OjUyLTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0yMVQwOToyNDo0OC0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0yMVQwOToyNDo0OC0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmN2JiZjlkNi03OTY5LTQ4M2EtYTdlYi1iNDM4NGMzNDJjM2EiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDhkZThiYi0xNjJkLTQwODktYjg2OS0wMjYzZGY3ZmNkMTMiIHN0RXZ0OndoZW49IjIwMjEtMDgtMDJUMTY6MTg6NTItMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmN2JiZjlkNi03OTY5LTQ4M2EtYTdlYi1iNDM4NGMzNDJjM2EiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6MjQ6NDgtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg8xNqcAACJtSURBVHic7d13uF1Vncbx700PKQQSUjFg6KEEkCIMRRARQgBpShPNUO6BwaFIUQcFHEFBlKIjm44MKkVhIPSOdJFQEqoRQgklQEIKKSQh88e7rwkkt561yzrn/TzPeUi5d+1FcvKetdf+rbUaFi9ejJlZDDoV3QEzs7ZyYJlZNBxYZhYNB5aZRcOBZWbRcGCZWTQcWGYWDQeWmUXDgWVm0XBgmVk0HFhmFg0HlplFw4FlZtFwYJlZNBxYZhYNB5aZRcOBZWbRcGCZWTQcWGYWDQeWmUXDgWVm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";

  var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAACxLAAAsSwGlPZapAAAFG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTAyVDE2OjE4OjUyLTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOC0wNVQxNjoyOTozMS0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOC0wNVQxNjoyOTozMS0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDhkZThiYi0xNjJk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";

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
  class WiFiItem extends SettingsItem {
    static _template() {
      return {
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1600,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
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
          color: 0xFFFFFFFF
        }
      };
    }
    /**
     * Function to set contents of an item in the Bluetooth screen.
     */


    set item(item) {
      this._item = item;
      this.status = item.connected ? 'Connected' : 'Not Connected';
      var wifiicon = "";

      if (item.signalStrength >= -50) {
        wifiicon = img;
      } else if (item.signalStrength >= -60) {
        wifiicon = img$1;
      } else if (item.signalStrength >= -67) {
        wifiicon = img$2;
      } else {
        wifiicon = img$3;
      }

      this.tag('Item').patch({
        Tick: {
          x: 10,
          y: 45,
          mountY: 0.5,
          texture: lng$1.Tools.getSvgTexture(img$5, 32.5, 32.5),
          color: 0xffffffff,
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
            direction: 'row'
          },
          Lock: {
            color: 0xffffffff,
            texture: lng$1.Tools.getSvgTexture(img$4, 32.5, 32.5),
            alpha: 1
          },
          Icon: {
            color: 0xffffffff,
            flexItem: {
              marginLeft: 15
            },
            texture: lng$1.Tools.getSvgTexture(wifiicon, 32.5, 32.5)
          }
        }
      });

      if (item.security == '0' || item.security == '15') {
        this.tag('Item.Right.Lock').visible = false;
      } else {
        this.tag('Item.Right.Lock').visible = true;
      }
    }

    _focus() {
      this.tag("Item").color = COLORS.hightlightColor;
      this.tag('TopLine').color = CONFIG.theme.hex;
      this.tag('BottomLine').color = CONFIG.theme.hex;
      this.patch({
        zIndex: 2
      });
      this.tag('TopLine').h = 6;
      this.tag('BottomLine').h = 6;
    }

    _unfocus() {
      this.tag('TopLine').color = 0xFFFFFFFF;
      this.tag('BottomLine').color = 0xFFFFFFFF;
      this.patch({
        zIndex: 1
      });
      this.tag('TopLine').h = 3;
      this.tag('BottomLine').h = 3;
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
  const WiFiState = {
    UNINSTALLED: 0,
    DISABLED: 1,
    DISCONNECTED: 2,
    PAIRING: 3,
    CONNECTING: 4,
    CONNECTED: 5,
    FAILED: 6
  };
  class Wifi {
    constructor() {
      this._events = new Map();
    }
    /**
     * Function to activate the wifi plugin.
     */


    activate() {
      return new Promise((resolve, reject) => {
        const config = {
          host: '127.0.0.1',
          port: 9998,
          default: 1
        };
        this._thunder = thunderJS(config);
        this.callsign = 'org.rdk.Wifi.1';

        this._thunder.call('Controller', 'activate', {
          callsign: this.callsign
        }).then(result => {
          this.getCurrentState().then(state => {
            if (state === WiFiState.DISABLED) {
              this.setEnabled(true);
            }

            if (state === WiFiState.CONNECTED) {
              this.setInterface('WIFI', true).then(res => {
                if (res.success) {
                  this.setDefaultInterface('WIFI', true);
                }
              });
            }
          });

          this._thunder.on(this.callsign, 'onWIFIStateChanged', notification => {
            if (this._events.has('onWIFIStateChanged')) {
              this._events.get('onWIFIStateChanged')(notification);
            }
          });

          this._thunder.on(this.callsign, 'onError', notification => {
            if (this._events.has('onError')) {
              this._events.get('onError')(notification);
            }
          });

          this._thunder.on(this.callsign, 'onAvailableSSIDs', notification => {
            if (notification.moreData === false) {
              this.stopScan();
              notification.ssids = notification.ssids.filter((item, pos) => notification.ssids.findIndex(e => e.ssid === item.ssid) === pos);

              if (this._events.has('onAvailableSSIDs')) {
                this._events.get('onAvailableSSIDs')(notification);
              }
            }
          });

          resolve(result);
        }).catch(err => {
          console.error(`Wifi activation failed: ${err}`);
          reject(err);
        });
      });
    }
    /**
     *Register events and event listeners.
     * @param {string} eventId
     * @param {function} callback
     *
     */


    registerEvent(eventId, callback) {
      this._events.set(eventId, callback);
    }
    /**
     * Deactivates wifi plugin.
     */


    deactivate() {
      this._events = new Map();
      this._thunder = null;
    }
    /**
     * Returns connected SSIDs
     */


    getConnectedSSID() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'getConnectedSSID').then(result => {
          resolve(result);
        }).catch(err => {
          console.error(`getConnectedSSID fail: ${err}`);
          reject(err);
        });
      });
    }
    /**
     * Start scanning for available wifi.
     */


    discoverSSIDs() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'startScan', {
          incremental: true,
          ssid: '',
          frequency: ''
        }).then(result => {
          //console.log('startScan success')
          resolve(result);
        }).catch(err => {
          console.error(`startScan fail: ${err}`);
          reject(err);
        });
      });
    }
    /**
     * Stops scanning for networks.
     */


    stopScan() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'stopScan').then(result => {
          //console.log('stopScan success')
          resolve(result);
        }).catch(err => {
          console.error(`stopScan fail: ${err}`);
          reject(err);
        });
      });
    }
    /**
     * Function to connect to an SSID
     * @param {object} device
     * @param {string} passphrase
     */


    connect(device, passphrase) {
      return new Promise((resolve, reject) => {
        this.disconnect().then(() => {
          console.log(`connect SSID ${device.ssid}`);

          this._thunder.call(this.callsign, 'connect', {
            ssid: device.ssid,
            passphrase: passphrase,
            securityMode: device.security
          }).then(result => {
            console.log(`connected SSID ${device.ssid}`);
            this.setInterface('WIFI', true).then(res => {
              if (res.success) {
                this.setDefaultInterface('WIFI', true);
              }
            });
            resolve(result);
          }).catch(err => {
            console.error(`Connection failed: ${err}`);
            reject(err);
          });
        }, reject);
      });
    }
    /**
     * Function to disconnect from the SSID.
     */


    disconnect() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'disconnect', {}).then(result => {
          console.log('WiFi disconnected: ' + JSON.stringify(result));
          this.setInterface('ETHERNET', true).then(res => {
            if (res.success) {
              this.setDefaultInterface('ETHERNET', true);
            }
          });
          resolve(result);
        });
      }).catch(err => {
        console.error(`Can't disconnect WiFi: ${err}`);
        reject(err);
      });
    }
    /**
     * Returns current state of the Wi-Fi plugin.
     */


    getCurrentState() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'getCurrentState').then(result => {
          console.log(`WiFi state: ${result.state}`);
          resolve(result.state);
        }).catch(err => {
          console.error(`Can't get WiFi state: ${err}`);
          reject(err);
        });
      });
    }
    /**
     * Enables/Disables the Wi-Fi.
     * @param {bool} bool
     */


    setEnabled(bool) {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'setEnabled', {
          enable: bool
        }).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    }
    /**
     * Function to get paired SSID.
     */


    getPaired() {
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign, 'getPairedSSID', {}).then(result => {
          resolve(result);
        }).catch(err => {
          console.error(`Can't get paired: ${err}`);
          reject(err);
        });
      });
    }

    getDefaultInterface() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Network.1', 'getDefaultInterface', {}).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    }

    setInterface(inter, bool) {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Network.1', 'setInterfaceEnabled', {
          interface: inter,
          persist: true,
          enabled: bool
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.error('SetInterface Error', JSON.stringify(err));
        });
      });
    }

    setDefaultInterface(interfaceName, bool) {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Network.1', 'setDefaultInterface', {
          interface: interfaceName,
          persist: bool
        }).then(result => {
          resolve(result);
        }).catch(err => {
          console.error('SetDefaultInterface Error', JSON.stringify(err));
        });
      });
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
   * Class for rendering items in Settings screen.
   */

  class ConfirmAndCancel extends lng$1.Component {
    static _template() {
      return {
        Item: {
          w: 325,
          // previous value : ((1920 / 2) - 350) / 2
          h: 85,
          // previous value: 65
          rect: true,
          color: 0xffffffff,
          shader: {
            type: lng$1.shaders.RoundedRectangle,
            radius: 0
          }
        }
      };
    }
    /**
     * Function to set contents for an item in settings screen.
     */


    set item(item) {
      this._item = item;
      this.tag('Item').patch({
        Left: {
          x: this.tag("Item").w / 2,
          // orginal = 10
          y: this.tag('Item').h / 2,
          mountX: 0.5,
          mountY: 0.5,
          text: {
            text: item,
            fontSize: 25,
            textColor: 0xff000000,
            fontFace: CONFIG.language.font
          }
        }
      });
    }
    /**
     * Set width of the item.
     */


    set width(width) {
      this.tag('Item').w = width;
    }
    /**
     * Set height of the item.
     */


    set height(height) {
      this.tag('Item').h = height;
    }

    _focus() {
      this.tag('Item').color = CONFIG.theme.hex;
    }

    _unfocus() {
      this.tag('Item').color = 0xffffffff;
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
  class PasswordSwitch extends lng$1.Component {
    static _template() {
      return {
        src: Utils.asset('images/settings/ToggleOffWhite.png')
      };
    }

    _handleEnter() {
      if (this.isOn) {
        this.patch({
          src: Utils.asset("images/settings/ToggleOffWhite.png")
        });
      } else {
        this.patch({
          src: Utils.asset("images/settings/ToggleOnOrange.png")
        });
      }

      this.isOn = !this.isOn;
      this.fireAncestors('$handleEnter', this.isOn);
    }

    _init() {
      this.isOn = false;
    }

    _disable() {
      if (this.isOn) {
        this.isOn = false;
        this.patch({
          src: Utils.asset("images/settings/ToggleOffWhite.png")
        });
        this.fireAncestors('$handleEnter', this.isOn);
      }
    }

  }

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */

  /**
   * Colors
   *
   * Contains global color style information to easily maintain consistency throughout components.
   */

  /**
   * Combines rgb hex string and alpha into argb hexadecimal number
   * @param {string} hex - 6 alphanumeric characters between 0-f
   * @param {number} [alpha] - number between 0-100 (0 is invisible, 100 is opaque)
   */
  function getHexColor(hex, alpha = 100) {
    if (!hex) {
      return 0x00;
    }

    let hexAlpha = Math.round(alpha / 100 * 255).toString(16);
    let str = `0x${hexAlpha}${hex}`;
    return parseInt(Number(str), 10);
  }
  /**
   * Pair color values with color names in the "Neutral" palette
   */

  const COLORS_NEUTRAL = {
    dark1: '000000',
    dark2: '080808',
    dark3: '101010',
    light1: 'FFFFFF',
    light2: 'F5F5F5',
    light3: 'E8E8E8'
  };

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */

  /**
   * Returns a styles object for use by components
   * @param {Object|function} styles - Object or callback that takes theme as an argument, ultimately the returned value
   * @param {Object} theme - theme to be provided to styles
   */
  var createStyles = ((styles, theme) => {
    return typeof styles === 'function' ? styles(theme) : styles;
  });

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  /**
   * Helpers for lng.Tools.getRoundRect
   */

  const RoundRect = {
    /**
     * Returns a value that will render as the given width (w)
     * when passed to lng.Tools.getRoundRect
     * @param {number} w - px value for expected width
     * @param {*} options
     * @param {number} options.padding - px value for both left and right padding
     * @param {number} options.paddingLeft - px value for left padding, overrides options.padding
     * @param {number} options.paddingRight - px value for right padding, overrides options.padding
     * @param {number} options.strokeWidth - px value for stroke width
     */
    getWidth(w, options = {}) {
      const {
        padding,
        paddingLeft,
        paddingRight,
        strokeWidth
      } = {
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0,
        strokeWidth: 0,
        ...options
      };
      if (!w) return 0;
      return w - (paddingLeft || padding) - (paddingRight || padding) - strokeWidth;
    },

    /**
     * Returns a value that will render as the given height (h)
     * when passed to lng.Tools.getRoundRect
     * @param {number} h - px value for expected width
     * @param {*} options
     * @param {number} options.padding - px value for both bottom and top padding
     * @param {number} options.paddingBottom - px value for bottom padding, overrides options.padding
     * @param {number} options.paddingTop - px value for top padding, overrides options.padding
     * @param {number} options.strokeWidth - px value for stroke width
     */
    getHeight(h, options = {}) {
      const {
        padding,
        paddingBottom,
        paddingTop,
        strokeWidth
      } = {
        padding: 0,
        paddingBottom: 0,
        paddingTop: 0,
        strokeWidth: 0,
        ...options
      };
      if (!h) return 0;
      return h - (paddingBottom || padding) - (paddingTop || padding) - strokeWidth;
    }

  };
  /**
   * Merges two objects together and returns the duplicate.
   *
   * @param {Object} target - object to be cloned
   * @param {Object} [object] - secondary object to merge into clone
   */

  function clone(target, object) {
    const _clone = { ...target
    };
    if (!object || target === object) return _clone;

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

    if (targetValType !== objectValType || objectValType === 'function' || Array.isArray(objectVal)) {
      return objectVal;
    }

    if (objectVal && objectValType === 'object') {
      return clone(targetVal, objectVal);
    }

    return objectVal;
  }
  /**
   * Returns the rendered width of a given text texture
   * @param {Object} text - text texture properties
   * @param {string} text.text - text value
   * @param {string} text.fontStyle - css font-style property
   * @param {(string|number)} text.fontWeight - css font-weight property
   * @param {string} [fontSize=0] - css font-size property (in px)
   * @param {string} [text.fontFamily=sans-serif] - css font-weight property
   * @param {string} text.fontFace - alias for fontFamily
   *
   * @returns {number} text width
   * */


  function measureTextWidth(text = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const {
      fontStyle,
      fontWeight,
      fontSize,
      fontFamily = text.fontFace || 'sans-serif'
    } = text;
    const fontCss = [fontStyle, fontWeight, fontSize ? `${fontSize}px` : '0', `'${fontFamily}'`].filter(Boolean).join(' ');
    ctx.font = fontCss;
    const textMetrics = ctx.measureText(text.text || '');
    return Math.round(textMetrics.width);
  }
  /**
   * Returns first argument that is a number. Useful for finding ARGB numbers. Does not convert strings to numbers
   * @param {...*} number - maybe a number
   **/

  function getFirstNumber(...numbers) {
    return numbers.find(Number.isFinite);
  }
  /**
   * Naively looks for dimensional prop (i.e. w, h, x, y, etc.), first searching for
   * a transition target value then defaulting to the current set value
   * @param {string} prop - property key
   * @param {lng.Component} component - Lightning component to operate against
   */

  function getDimension(prop, component) {
    if (!component) return 0;
    const transition = component.transition(prop);
    if (transition.isRunning()) return transition.targetValue;
    return component[prop];
  }
  const getX = getDimension.bind(null, 'x');
  const getY = getDimension.bind(null, 'y');
  const getW = component => getDimension('w', component) || component.renderWidth;
  const getH = component => getDimension('h', component) || component.renderHeight;

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */

  const gradientColor = COLORS_NEUTRAL.light2;
  ({
    duration: 0.6,
    actions: [{
      p: 'colorUl',
      v: {
        0: getHexColor(gradientColor, 72),
        1: getHexColor(gradientColor, 56)
      }
    }, {
      p: 'colorUr',
      v: {
        0: getHexColor(gradientColor, 24),
        1: getHexColor(gradientColor, 16)
      }
    }, {
      p: 'colorBr',
      v: {
        0: 0x00,
        1: getHexColor(gradientColor, 0)
      }
    }, {
      p: 'colorBl',
      v: {
        0: getHexColor(gradientColor, 24),
        1: getHexColor(gradientColor, 16)
      }
    }]
  });

  /**
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. If `immediate` is passed, trigger the function on the
   * leading edge, instead of the trailing. The function also has a property 'clear' 
   * that is a function which will clear the timer to prevent previously scheduled executions. 
   *
   * @source underscore.js
   * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
   * @param {Function} function to wrap
   * @param {Number} timeout in ms (`100`)
   * @param {Boolean} whether to execute at the beginning (`false`)
   * @api public
   */

  function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    if (null == wait) wait = 100;

    function later() {
      var last = Date.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;

        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    }

    var debounced = function () {
      context = this;
      args = arguments;
      timestamp = Date.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);

      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };

    debounced.clear = function () {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };

    debounced.flush = function () {
      if (timeout) {
        result = func.apply(context, args);
        context = args = null;
        clearTimeout(timeout);
        timeout = null;
      }
    };

    return debounced;
  }

  debounce.debounce = debounce;
  var debounce_1 = debounce;

  /**
  * Copyright 2020 Comcast Cable Communications Management, LLC
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
  *
  * SPDX-License-Identifier: Apache-2.0
  */
  function withStyles(Base, styles, theme) {
    const _theme = theme || Base.theme;

    const _styles = Base.styles ? clone(Base.styles, createStyles(styles, _theme)) : createStyles(styles, _theme);

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

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  class Icon extends lng$1.Component {
    static _template() {
      return {
        color: 0xffffffff,
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

  }
  const [isSvgTag, isSvgURI, isImageURI] = [/^<svg.*<\/svg\>$/, /\.svg$/, /\.(a?png|bmp|gif|ico|cur|jpe?g|pjp(eg)?|jfif|tiff?|webp)$/].map(regex => RegExp.prototype.test.bind(regex));

  function getIconTemplate(icon, w, h) {
    const template = {
      w,
      h
    };

    switch (true) {
      case isSvgTag(icon):
        template.texture = lng$1.Tools.getSvgTexture(`data:image/svg+xml,${encodeURIComponent(icon)}`, w, h);
        break;

      case isSvgURI(icon):
        template.texture = lng$1.Tools.getSvgTexture(icon, w, h);
        break;

      case isImageURI(icon):
        template.src = icon;
        break;
    }

    return template;
  }

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  const styles = {
    w: 113,
    //150
    h: 90,
    //40
    radius: 0,
    background: {
      color: 0xffffffff
    },
    // 0xff1f1f1f
    icon: {
      color: 0xffffffff
    },
    text: {
      fontSize: 30,
      fontFace: CONFIG.language.font,
      color: 0xff000000
    },
    padding: 50,
    stroke: {
      color: 0x00,
      weight: 2
    },
    focused: {
      background: {
        color: CONFIG.theme.hex
      },
      text: {
        color: 0xff1f1f1f
      },
      icon: {
        color: 0xff1f1f1f
      }
    }
  };

  class Button extends lng$1.Component {
    static _template() {
      return {
        w: this.styles.w,
        h: this.styles.h,
        radius: this.styles.radius,
        strokeColor: this.styles.stroke.color,
        strokeWeight: this.styles.stroke.weight,
        Content: {
          mount: 0.5,
          x: w => w / 2,
          y: h => h / 2,
          flex: {
            direction: 'row',
            alignContent: 'center',
            alignItems: 'center'
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
          x: w => w / 2,
          y: h => h / 2
        }
      };
    }

    _construct() {
      this._focused = false;
      this._whenEnabled = new Promise(resolve => this._enable = resolve, console.error);
      this._strokeWeight = 2;
      this._strokeColor = 0x00;
    }

    _init() {
      this._update();
    }

    _focus() {
      if (this._smooth === undefined) this._smooth = true;
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
        this._Title.text = { ...this.styles.text,
          fontColor: this.styles.text.color,
          fontSize: this.fontSize || this.styles.text.fontSize,
          fontFamily: this.styles.text.fontFace || this.styles.text.fontFamily || this.stage._options.defaultFontFace,
          text: this.title
        };
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
        this.texture = lng$1.Tools.getRoundRect(RoundRect.getWidth(this.w), RoundRect.getHeight(this.h), radius, 0x00, true, 0xffffffff);
        this._Stroke.color = this.strokeColor;
        this._Stroke.texture = lng$1.Tools.getRoundRect(RoundRect.getWidth(this.w), RoundRect.getHeight(this.h), radius, this.strokeWeight, 0xffffffff, true, this.background);
      } else {
        const radius = this.radius || this.styles.radius;
        this.texture = lng$1.Tools.getRoundRect(RoundRect.getWidth(this.w), RoundRect.getHeight(this.h), radius);
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
          this.fireAncestors('$itemChanged');
          this.signal('buttonWidthChanged', {
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
      if (typeof this.onEnter === 'function') {
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
      color = 0xffffffff
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
      // TODO - Localization?
      // Do we need a locale file with
      // component translations?
      return this.label + ', Button';
    }

    get _Content() {
      return this.tag('Content');
    }

    get _Title() {
      return this.tag('Content.Title');
    }

    get _Icon() {
      return this.tag('Content.Icon');
    }

    get _Stroke() {
      return this.tag('Stroke');
    }

  }

  var Button$1 = withStyles(Button, styles);

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  class FocusManager extends lng$1.Component {
    constructor(stage) {
      super(stage);
      this.patch({
        Items: {}
      });
      this._direction = this.direction || 'row';
    }

    _construct() {
      this._selectedIndex = 0;
    }

    get direction() {
      return this._direction;
    }

    set direction(direction) {
      this._direction = direction;
      let state = {
        none: 'None',
        column: 'Column',
        row: 'Row'
      }[direction];

      if (state) {
        this._setState(state);
      }
    }

    get Items() {
      return this.tag('Items');
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
      } // Have items update (change height or width) before we render


      this._refocus();

      if (this.selected) {
        this.render(this.selected, prevSelected);
        this.signal('selectedChange', this.selected, prevSelected);
      }
    } // Override


    render() {}

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
      } = this; // Make sure we're focused on a component

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
      return [class None extends this {}, class Row extends this {
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

  }

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  class Column extends FocusManager {
    static _template() {
      return {
        direction: 'column'
      };
    }

    _construct() {
      super._construct();

      this._smooth = false;
      this._itemSpacing = 0;
      this._scrollIndex = 0;
      this._whenEnabled = new Promise(resolve => this._firstEnable = resolve);
      this._h = this.stage.h;
      this.debounceDelay = Number.isInteger(this.debounceDelay) ? this.debounceDelay : 30;
      this._update = debounce_1.debounce(this._updateLayout, this.debounceDelay);
      this._updateImmediate = debounce_1.debounce(this._updateLayout, this.debounceDelay, true);
    }

    get _itemTransition() {
      return this.itemTransition || {
        duration: 0.4,
        timingFunction: 'cubic-bezier(0.20, 1.00, 0.30, 1.00)'
      };
    }

    _focus() {
      this.items.forEach(item => item.parentFocus = true);
    }

    _unfocus() {
      this.items.forEach(item => item.parentFocus = false);
    }

    selectNext() {
      this._smooth = true;
      return super.selectNext();
    }

    selectPrevious() {
      this._smooth = true;
      return super.selectPrevious();
    } // TODO: can be documented in API when lastScrollIndex is made public


    shouldScrollUp() {
      let shouldScroll = false;

      if (this._lastScrollIndex) {
        shouldScroll = this.selectedIndex < this._lastScrollIndex;

        if (this._prevLastScrollIndex !== undefined && this._prevLastScrollIndex !== this._lastScrollIndex) {
          shouldScroll = true;
        }
      } else {
        shouldScroll = this.selectedIndex >= this._scrollIndex;
      }

      return this._itemsY < 0 && shouldScroll;
    } // TODO: can be documented in API when lastScrollIndex is made public


    shouldScrollDown() {
      const lastChild = this.Items.childList.last;
      return this.selectedIndex > this._scrollIndex && // end of Items container < end of last item
      Math.abs(this._itemsY - this.h) < lastChild.y + this.Items.childList.last.h;
    }

    render(next, prev) {
      this._prevLastScrollIndex = this._lastScrollIndex;

      if (this.plinko && prev && (prev.currentItem || prev.selected)) {
        next.selectedIndex = this._getIndexOfItemNear(next, prev);
      } // Rows are changing height, so we'll render via updateLayout


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
              y: [-(scrollItem || firstChild).transition('y').targetValue + (scrollItem === this.selected ? scrollOffset : 0), this._itemTransition]
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
      return this.Items.children.filter(child => this._isOnScreen(child));
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
        let nextW = 0; // layout items in row

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
            // if the child is another focus manager, check the width of the item container
            const childWidth = child.Items && child.Items.w || child.w; // only center the child if it is within the bounds of this focus manager

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
        }).y; // determine when to stop scrolling down

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
    } // finds the index of the item with the closest middle to the previously selected item


    _getIndexOfItemNear(selected, prev) {
      // edge case
      if (selected.items.length < 2) return 0;
      let prevItem = prev.selected || prev.currentItem;
      let prevOffset = prev.transition('x').targetValue || 0;
      let [itemX] = prevItem.core.getAbsoluteCoords(-prevOffset, 0);
      let prevMiddle = itemX + prevItem.w / 2; // set the first item to be closest

      let closest = selected.items[0];
      let closestMiddle = closest.core.getAbsoluteCoords(0, 0)[0] + closest.w / 2; // start at the 2nd item

      for (let i = 1; i < selected.items.length; i++) {
        // for some reason here !!/!.. evals returning number
        if (selected.items[i].skipFocus === true) {
          continue;
        }

        const item = selected.items[i];
        const middle = item.core.getAbsoluteCoords(0, 0)[0] + item.w / 2;

        if (Math.abs(middle - prevMiddle) < Math.abs(closestMiddle - prevMiddle)) {
          // current item is the closest
          closest = item;
          closestMiddle = middle;
        } else {
          if (!closest.skipFocus) {
            // weve already found closest return its index
            return selected.items.indexOf(closest);
          } else if (!selected.items[i - 1].skipFocus) {
            // previous item is focusable return it
            return i - 1;
          } else {
            // return closest left or right of index
            const prevIndex = prev.items.indexOf(prevItem);
            return this._getIndexofClosestFocusable(prevIndex, selected, prevMiddle);
          }
        }
      } // if last index is focusable return


      return selected.items.length - 1;
    }

    _getIndexofClosestFocusable(selectedIndex, selected, prevMiddle) {
      // dont want to mutate the original selected.items using spread for copy
      // get first focusable item before and after the current focused item's index
      const prevIndex = [...selected.items].slice(0, selectedIndex).map(item => !!item.skipFocus).lastIndexOf(false);
      const nextIndex = [...selected.items].slice(selectedIndex + 1).map(item => !!item.skipFocus).indexOf(false) + selectedIndex + 1;
      const prevItem = selected.items[prevIndex];
      const nextItem = selected.items[nextIndex]; // Check if the items exist if not return the other
      // covers case where at 0 idx, previous would not exist
      // and opposite for last index next would not exist

      if (prevIndex === -1 || !prevItem) {
        return nextIndex;
      }

      if (nextIndex === -1 || !nextItem) {
        return prevIndex;
      } // If both items compare coordinates to determine which direction of plinko


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
      items.forEach(item => {
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
      if (duration === 0) this.selectedIndex = index;

      for (let i = 0; i !== Math.abs(this.selectedIndex - index); i++) {
        setTimeout(() => {
          this.selectedIndex > index ? this.selectPrevious() : this.selectNext();
        }, duration * i);
      }

      this.Items.transition('y').on('finish', () => this._smooth = false);
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
          // eslint-disable-next-line no-self-assign
          this.selectedIndex = this._selectedIndex;
        }

        if (!this.items.length) {
          this.fireAncestors('$columnEmpty');
        }
      }
    }

    $columnChanged() {
      this._updateImmediate();
    } // can be overridden


    onScreenEffect() {}

  }

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  class FadeShader extends lng$1.shaders.WebGLDefaultShader {
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
        this._positionLeft = 0.001;
      }

      if (this._positionRight === 0) {
        this._positionRight = 0.001;
      }

      const renderPrecision = this.ctx.stage.getRenderPrecision();

      this._setUniform('margin', [this._positionLeft * renderPrecision, this._positionRight * renderPrecision], this.gl.uniform1fv);

      this._setUniform('resolution', new Float32Array([owner._w * renderPrecision, owner._h * renderPrecision]), this.gl.uniform2fv);
    }

  }
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

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  class MarqueeText extends lng$1.Component {
    static _template() {
      return {
        TextClipper: {
          boundsMargin: [],
          // overwrite boundsMargin so text won't de-render if moved offscreen
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
              text: { ...text
              }
            },
            TextLoopTexture: {}
          }
        }
      });

      this._Text.on('txLoaded', () => {
        if (this.autoStart) {
          this.startScrolling();
        }
      });

      this._Text.loadTexture();

      this._updateShader(this.finalW);

      this._scrolling && this.startScrolling();
    }

    set color(color) {
      this.tag('TextBox.Text').smooth = {
        color
      };
    }

    startScrolling(finalW = this.finalW) {
      if (this._textRenderedW === 0) {
        this._Text.on('txLoaded', () => {
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
        // in case the metadata width gets larger on focus and the text goes from being clipped to not
        this._TextClipper.shader = null;

        if (this._Text.text && this._Text.text.textAlign === 'center') {
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
          t: 'TextBox',
          p: 'x',
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
          t: 'TextClipper',
          p: 'shader.positionLeft',
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
      return this.tag('TextClipper');
    }

    get _TextBox() {
      return this.tag('TextBox');
    }

    get _Text() {
      return this.tag('Text');
    }

    get _TextLoopTexture() {
      return this.tag('TextLoopTexture');
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

  }

  /**
   * Copyright 2020 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  class Row extends FocusManager {
    static _template() {
      return {
        direction: 'row'
      };
    }

    _construct() {
      super._construct();

      this._smooth = false;
      this._itemSpacing = 0;
      this._scrollIndex = 0;
      this._whenEnabled = new Promise(resolve => this._firstEnable = resolve);
      this._w = this.stage.w;
      this.debounceDelay = Number.isInteger(this.debounceDelay) ? this.debounceDelay : 1;
      this._update = debounce_1.debounce(this._updateLayout, this.debounceDelay);
    }

    get _itemTransition() {
      return this.itemTransition || {
        duration: 0.4,
        timingFunction: 'cubic-bezier(0.20, 1.00, 0.30, 1.00)'
      };
    }

    _focus() {
      this.items.forEach(item => item.parentFocus = true);
    }

    _unfocus() {
      this.items.forEach(item => item.parentFocus = false);
    }

    selectNext() {
      this._smooth = true;
      return super.selectNext();
    }

    selectPrevious() {
      this._smooth = true;
      return super.selectPrevious();
    } // TODO: can be documented in API when lastScrollIndex is made public


    shouldScrollLeft() {
      let shouldScroll = false;

      if (this._lastScrollIndex) {
        shouldScroll = this.selectedIndex < this._lastScrollIndex;

        if (this._prevLastScrollIndex !== undefined && this._prevLastScrollIndex !== this._lastScrollIndex) {
          shouldScroll = true;
        }
      } else {
        shouldScroll = this.selectedIndex >= this._scrollIndex;
      }

      return this._itemsX < 0 && shouldScroll;
    } // TODO: can be documented in API when lastScrollIndex is made public


    shouldScrollRight() {
      const lastChild = this.Items.childList.last;
      return this.selectedIndex > this._scrollIndex && // end of Items container < end of last item
      Math.abs(this._itemsX - this.w) < lastChild.x + this.Items.childList.last.w;
    }

    get onScreenItems() {
      return this.Items.children.filter(child => this._isOnScreen(child));
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
        itemsContainerX = this.Items.children[itemIndex].transition('x') ? -this.Items.children[itemIndex].transition('x').targetValue : -this.Items.children[itemIndex].x;
      }

      return itemsContainerX;
    }

    render(next, prev) {
      this._whenEnabled.then(() => {
        this._prevLastScrollIndex = this._lastScrollIndex;

        if (this._shouldScroll()) {
          const itemsContainerX = this.lazyScroll && prev ? this._getLazyScrollX(prev) : this._getScrollX();

          if (itemsContainerX !== undefined) {
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
      let nextH = 0; // layout items in row

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
          // if the child is another focus manager, check the height of the item container
          const childHeight = child.Items && child.Items.h || child.h; // only center the child if it is within the bounds of this focus manager

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
      }).x; // determine when to stop scrolling right

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

      this.fireAncestors('$itemChanged');
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
      items.forEach(item => {
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
    } // can be overridden


    onScreenEffect() {}

  }

  /**
   * Copyright 2021 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  const KEY_DIMENSIONS = {
    h: 90,
    w: 109,
    padding: 0,
    fixed: true
  }; // actualize key values : 60 ,60  ; 90,100

  const isUpperCase = string => /^[A-Z]$/.test(string);

  class Key extends Button$1 {
    static _template() {
      return { ...super._template(),
        ...KEY_DIMENSIONS
      };
    }

    set config(config) {
      if (config) {
        this.sizes = config.sizes;
      }
    }

    set icon(src) {
      if (src) {
        this._Icon.patch({
          color: 0xffffffff,
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

      return this.title + ', button';
    }

    set label(label) {
      this.title = label;
    }

    get _sizes() {
      return this.styles.sizes ? { ...this.styles.sizes,
        ...this.sizes
      } : {
        small: 50,
        medium: 110,
        large: 273,
        xlarge: 718,
        ...this.sizes
      }; // actualize values 50,110,212,350 ; 50,110,212,750
    }

    _handleEnter() {
      if (this.toggle) {
        this.fireAncestors('$toggleKeyboard', this.toggle);
      }

      this.fireAncestors('$onSoftKey', {
        key: this.title
      });
    }

  }

  /**
   * Copyright 2021 Comcast Cable Communications Management, LLC
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
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  class Keyboard extends lng$1.Component {
    _construct() {
      this._whenEnabled = new Promise(resolve => this._firstEnable = resolve);
    }

    get announce() {
      return 'Keyboard' + (this.title ? `, ${this.title}` : '');
    }

    get announceContext() {
      return ['PAUSE-2', 'Use arrow keys to choose characters, press center to select'];
    }

    set formats(formats = {}) {
      this._formats = formats;
      this._currentFormat = this._defaultFormat; // Ensure formats prop is set last

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
          [key]: { ...rows[0],
            alpha: 0
          }
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
      return rows.map(keys => {
        let h = this.keysConfig && this.keysConfig.h || KEY_DIMENSIONS.h;
        return {
          type: Row,
          h,
          wrapSelected: this.rowWrap === undefined ? true : this.rowWrap,
          itemSpacing: this._spacing,
          items: this._createKeys(keys)
        };
      });
    }

    _createKeys(keys = []) {
      return keys.map(keyProps => {
        const key = {
          type: this.keyComponent || Key,
          config: this.keysConfig
        };

        if (!keyProps) {
          return { ...KEY_DIMENSIONS,
            skipFocus: true
          };
        } else if (typeof keyProps === 'object') {
          return { ...key,
            ...keyProps
          };
        }

        return { ...key,
          label: keyProps
        };
      });
    }

    _formatKeyboardData(data = []) {
      if (Array.isArray(data) && data.length) {
        if (!Array.isArray(data[0]) && !this.inline) {
          let keyRows = [],
              idx,
              counter;

          for (idx = 0, counter = -1; idx < data.length; idx++) {
            if (idx % this.columnCount === 0) {
              counter++;
              keyRows[counter] = [];
            }

            keyRows[counter].push(data[idx]);
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

      if (type === 'Row') {
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

      if (type === 'Row') {
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
      this.fireAncestors('$keyboardFocused', true);
    }

    _unfocus() {
      this.tag(this._currentFormat).alpha = 0;
      this._currentFormat = this._defaultFormat;
      this.tag(this._currentFormat).alpha = 1;

      this._refocus();

      this.fireAncestors('$keyboardFocused', false);
    }

    set columnCount(columnCount) {
      this._columnCount = columnCount;
    }

    set rowCount(rowCount) {
      this._rowCount = rowCount;
    }

    get columnCount() {
      if (this._columnCount) return this._columnCount;
      if (this._rowCount) return this._formats[this._defaultFormat.toLowerCase()].length / this._rowCount;
      if (this.inline) return this._formats[this._defaultFormat.toLowerCase()].length;else return 11;
    }

    get _spacing() {
      return this.spacing || 8;
    }

    get _defaultFormat() {
      let defaultFormat = this.defaultFormat || Object.keys(this._formats)[0];
      return defaultFormat.charAt(0).toUpperCase() + defaultFormat.slice(1);
    }

  }
  const KEYBOARD_FORMATS = {
    fullscreen: {
      letters: [['', '', '', '', '', '', '', '', '', {
        label: '#@!',
        size: 'large',
        toggle: 'symbols',
        announce: 'symbol mode, button'
      }, {
        label: 'Space',
        size: 'large'
      }, {
        label: 'Delete',
        size: 'large'
      }, '', '', '', '', '', '', '', '', ''], ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']],
      symbols: [['', '', '', '', '', '', '', '', '', {
        label: 'ABC',
        size: 'large',
        toggle: 'letters',
        announce: 'caps on, button'
      }, {
        label: 'Space',
        size: 'large'
      }, {
        label: 'Delete',
        size: 'large'
      }, '', '', '', '', '', '', '', '', ''], ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', {
        label: '!',
        announce: 'exclamation, button'
      }, '@', '#', '$', '%', {
        label: '^',
        announce: 'caret circumflex, button'
      }, '&', '*', {
        label: '(',
        announce: 'open parenthesis, button'
      }, {
        label: ')',
        announce: 'close parenthesis, button'
      }, {
        label: '`',
        announce: 'grave accent, button'
      }, '~', '_', '.', '-', '+']]
    },
    qwerty: {
      uppercase: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', {
        label: 'Clear',
        size: 'medium'
      }], ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', {
        label: '#@!',
        size: 'medium',
        toggle: 'symbols',
        announce: 'symbol mode, button'
      }], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '@', {
        label: 'áöû',
        size: 'medium',
        toggle: 'accents',
        announce: 'accents, button'
      }], ['Z', 'X', 'C', 'V', 'B', 'N', 'M', {
        label: '_',
        announce: 'underscore, button'
      }, {
        label: '.',
        announce: 'period, button'
      }, {
        label: '-',
        announce: 'dash, button'
      }, {
        label: 'shift',
        size: 'medium',
        toggle: 'lowercase',
        announce: 'shift off, button'
      }], [{
        label: 'Delete',
        size: 'large'
      }, {
        label: 'Space',
        size: 'xlarge'
      }, {
        label: 'Done',
        size: 'large'
      }]],
      lowercase: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', {
        label: 'Clear',
        size: 'medium'
      }], ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', {
        label: '#@!',
        size: 'medium',
        toggle: 'symbols',
        announce: 'symbol mode, button'
      }], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@', {
        label: 'áöû',
        size: 'medium',
        toggle: 'accents',
        announce: 'accents, button'
      }], ['z', 'x', 'c', 'v', 'b', 'n', 'm', {
        label: '_',
        announce: 'underscore, button'
      }, {
        label: '.',
        announce: 'period, button'
      }, {
        label: '-',
        announce: 'dash, button'
      }, {
        label: 'shift',
        size: 'medium',
        toggle: 'uppercase',
        announce: 'shift on, button'
      }], [{
        label: 'Delete',
        size: 'large'
      }, {
        label: 'Space',
        size: 'xlarge'
      }, {
        label: 'Done',
        size: 'large'
      }]],
      accents: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', {
        label: 'Clear',
        size: 'medium'
      }], ['ä', 'ë', 'ï', 'ö', 'ü', 'ÿ', 'à', 'è', 'ì', 'ò', {
        label: '#@!',
        size: 'medium',
        toggle: 'symbols',
        announce: 'symbol mode, button'
      }], ['ù', 'á', 'é', 'í', 'ó', 'ú', 'ý', 'â', 'ê', 'î', {
        label: 'abc',
        size: 'medium',
        toggle: 'lowercase',
        announce: 'alpha mode, button'
      }], ['', '', '', 'ô', 'û', 'ã', 'ñ', '', '', '', {
        label: 'shift',
        size: 'medium',
        toggle: 'accentsUpper',
        announce: 'shift off, button'
      }], [{
        label: 'Delete',
        size: 'large'
      }, {
        label: 'Space',
        size: 'xlarge'
      }, {
        label: 'Done',
        size: 'large'
      }]],
      accentsUpper: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', {
        label: 'Clear',
        size: 'medium'
      }], ['Ä', 'Ë', 'Ï', 'Ö', 'Ü', 'Ÿ', 'À', 'È', 'Ì', 'Ò', {
        label: '#@!',
        size: 'medium',
        toggle: 'symbols',
        announce: 'symbol mode, button'
      }], ['Ù', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ý', 'Â', 'Ê', 'Î', {
        label: 'abc',
        size: 'medium',
        toggle: 'lowercase',
        announce: 'alpha mode, button'
      }], ['', '', '', 'Ô', 'Û', 'Ã', 'Ñ', '', '', '', {
        label: 'shift',
        size: 'medium',
        toggle: 'accents',
        announce: 'shift off, button'
      }], [{
        label: 'Delete',
        size: 'large'
      }, {
        label: 'Space',
        size: 'xlarge'
      }, {
        label: 'Done',
        size: 'large'
      }]],
      symbols: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', {
        label: 'Clear',
        size: 'medium'
      }], [{
        label: '!',
        announce: 'exclamation, button'
      }, '@', '#', '$', '%', {
        label: '^',
        announce: 'caret circumflex, button'
      }, '&', '*', {
        label: '(',
        announce: 'open parenthesis, button'
      }, {
        label: ')',
        announce: 'close parenthesis, button'
      }, {
        label: 'abc',
        size: 'medium',
        toggle: 'lowercase',
        announce: 'alpha mode, button'
      }], [{
        label: '{',
        announce: 'open brace, button'
      }, {
        label: '}',
        announce: 'close brace, button'
      }, {
        label: '[',
        announce: 'open bracket, button'
      }, {
        label: ']',
        announce: 'close bracket, button'
      }, {
        label: ';',
        announce: 'semicolon, button'
      }, {
        label: '"',
        announce: 'doublequote, button'
      }, {
        label: "'",
        announce: 'singlequote, button'
      }, {
        label: '|',
        announce: 'vertical bar, button'
      }, {
        label: '\\',
        announce: 'backslash, button'
      }, {
        label: '/',
        announce: 'forwardslash, button'
      }, {
        label: 'áöû',
        size: 'medium',
        toggle: 'accents',
        announce: 'accents, button'
      }], [{
        label: '<',
        announce: 'less than, button'
      }, {
        label: '>',
        announce: 'greater than, button'
      }, {
        label: '?',
        announce: 'question mark, button'
      }, {
        label: '=',
        announce: 'equals, button'
      }, {
        label: '`',
        announce: 'grave accent, button'
      }, {
        label: '~',
        announce: 'tilde, button'
      }, {
        label: '_',
        announce: 'underscore, button'
      }, {
        label: '.',
        announce: 'period, button'
      }, {
        label: '-',
        announce: 'dash, button'
      }, {
        label: '+',
        announce: 'plus sign, button'
      }], [{
        label: 'Delete',
        size: 'large'
      }, {
        label: 'Space',
        size: 'xlarge'
      }, {
        label: 'Done',
        size: 'large'
      }]]
    },
    numbers: {
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      dialpad: [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', '']],
      dialpadExtended: [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', ''], [{
        label: 'Delete',
        size: 'large'
      }]]
    }
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
  class BluetoothPairingScreen extends lng$1.Component {
    static _template() {
      return {
        PairingScreen: {
          x: 0,
          y: 0,
          w: 1920,
          h: 1080,
          zIndex: 1,
          rect: true,
          color: 0xff000000
        },
        Title: {
          x: w => w / 2,
          y: 95,
          mountX: 0.5,
          zIndex: 2,
          text: {
            text: '',
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
          color: 0xFFFFFFFF,
          zIndex: 2
        },
        PasswordLabel: {
          x: 180,
          y: 240,
          w: 300,
          h: 75,
          zIndex: 2,
          text: {
            text: 'Password: ',
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 0xffffffff,
            textAlign: 'left'
          }
        },
        Pwd: {
          x: 437,
          y: 240,
          zIndex: 2,
          text: {
            text: '',
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 0xffffffff,
            wordWrapWidth: 1000,
            wordWrap: false,
            textOverflow: 'ellipsis'
          }
        },
        PasswordBox: {
          x: 417,
          y: 208,
          zIndex: 2,
          LeftBorder: {
            rect: true,
            x: 0,
            y: 0,
            w: 3,
            h: 88,
            mountX: 0,
            color: 0xffffffff
          },
          RightBorder: {
            rect: true,
            x: 1279,
            y: 0,
            w: 3,
            h: 88,
            mountX: 1,
            color: 0xffffffff
          },
          TopBorder: {
            rect: true,
            x: 0,
            y: 0,
            w: 1279,
            h: 3,
            mountY: 0.5,
            color: 0xffffffff
          },
          BottomBorder: {
            rect: true,
            x: 0,
            y: 88,
            w: 1279,
            h: 3,
            mountY: 0.5,
            color: 0xffffffff
          }
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
            text: 'Show Password',
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 0xffffffff,
            textAlign: 'left'
          }
        },
        List: {
          x: 417,
          y: 316,
          type: lng$1.components.ListComponent,
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
          color: 0xFFFFFFFF,
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
      };
    }

    _updateText(txt) {
      this.tag("Pwd").text.text = txt;
    }

    _handleBack() {
      this.patch({
        visible: false
      });
      this.fireAncestors("$goToWifiSwitch");
    }

    set item(item) {
      this.star = "";
      this.passwd = "";
      this.tag("Pwd").text.text = "";
      this.tag('Title').text = item.ssid;
      var options = [];
      this._item = item;

      if (item.connected) {
        options = ['Disconnect', 'Cancel'];
      } else {
        options = ['Connect', 'Cancel'];
      }

      this.tag('List').items = options.map((item, index) => {
        return {
          ref: item,
          x: index === 0 ? 0 : 325 * index,
          w: 325,
          h: 85,
          type: ConfirmAndCancel,
          item: item
        };
      });

      this._setState('Pair');
    }

    _focus() {
      this.hidePasswd = true;
      this.fireAncestors("$hideSideAndTopPanels");
    }

    _unfocus() {
      this.fireAncestors("$showSideAndTopPanels");
    }

    _init() {
      this.star = "";
      this.passwd = "";
      this.isOn = false; // this.tag('KeyBoard').patch({scale:1558/1080})
    }

    static _states() {
      return [class Password extends this {
        $enter() {
          this.shifter = false;
          this.capsLock = false; //  this.tag('Password').alpha = 1
        }

        _getFocused() {
          return this.tag("KeyBoard"); //  return this.tag('Password')
        }

        $onSoftKey({
          key
        }) {
          if (key === 'Done') {
            this.fireAncestors('$startConnect', this.passwd);
          } else if (key === 'Clear') {
            this.passwd = this.passwd.substring(0, this.passwd.length - 1);
            this.star = this.star.substring(0, this.passwd.length - 1);

            this._updateText(this.hidePasswd ? this.star : this.passwd);
          } else if (key === '#@!' || key === 'abc' || key === 'áöû' || key === 'shift') {
            console.log('no saving');
          } else if (key === 'Space') {
            this.star += '\u25CF';
            this.passwd += ' ';

            this._updateText(this.hidePasswd ? this.star : this.passwd);
          } else if (key === 'Delete') {
            this.star = '';
            this.passwd = '';

            this._updateText(this.hidePasswd ? this.star : this.passwd);
          } else {
            this.star += '\u25CF';
            this.passwd += key;

            this._updateText(this.hidePasswd ? this.star : this.passwd);
          }
        }

        _handleUp() {
          this._setState("Pair");
        }

      }, class Pair extends this {
        $enter() {}

        _getFocused() {
          return this.tag('List').element;
        }

        _handleRight() {
          this.tag('List').setNext();
        }

        _handleLeft() {
          this.tag('List').setPrevious();
        }

        _handleUp() {
          this._setState("PasswordSwitchState");
        }

        _handleDown() {
          this._setState("Password");
        }

        _handleEnter() {
          if (this.tag('List').element.ref == 'Connect' && this._item.security != '0') {
            if (this.star === '') {
              this._setState('Password');
            } else {
              this.fireAncestors('$startConnect', this.passwd);
            }
          } else {
            this.fireAncestors('$pressEnter', this.tag('List').element.ref);
          }
        }

      }, class PasswordSwitchState extends this {
        $enter() {
          this.tag("PasswordBox.TopBorder").color = CONFIG.theme.hex;
          this.tag("PasswordBox.RightBorder").color = CONFIG.theme.hex;
          this.tag("PasswordBox.BottomBorder").color = CONFIG.theme.hex;
          this.tag("PasswordBox.LeftBorder").color = CONFIG.theme.hex;
        }

        _handleDown() {
          this._setState("Pair");
        }

        _getFocused() {
          return this.tag('PasswrdSwitch');
        }

        $handleEnter(bool) {
          if (bool) {
            this._updateText(this.passwd);

            this.hidePasswd = false; // this.tag('Pwd').text.text = this.passwd;
          } else {
            this._updateText(this.star);

            this.hidePasswd = true; // this.tag('Pwd').text.text = this.getStars();
          }

          this.isOn = bool;
        }

        $exit() {
          this.tag("PasswordBox.TopBorder").color = 0xFFFFFFFF;
          this.tag("PasswordBox.RightBorder").color = 0xFFFFFFFF;
          this.tag("PasswordBox.BottomBorder").color = 0xFFFFFFFF;
          this.tag("PasswordBox.LeftBorder").color = 0xFFFFFFFF;
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
  class JoinAnotherNetworkComponent extends lng$1.Component {
    handleDone() {
      var securityCode = this.securityCodes[this.securityCodeIndex].value;

      if (!this.textCollection['EnterSSID']) {
        this._setState("EnterSSID");
      } else if (securityCode < 0 || securityCode > 14) {
        this._setState("EnterSecurity");
      } else if (securityCode !== 0 && !this.textCollection['EnterPassword']) {
        this._setState("EnterPassword");
      } else {
        if (this.textCollection['EnterSecurity'] === "0") {
          this.textCollection['EnterPassword'] = "";
          this.tag("Pwd").text.text = "";
        }

        var self = this;
        this.fireAncestors("$startConnectForAnotherNetwork", {
          ssid: self.textCollection['EnterSSID'],
          security: securityCode
        }, self.textCollection['EnterPassword']);
      }
    }

    static _template() {
      return {
        Background: {
          w: 1920,
          h: 1080,
          rect: true,
          color: 0xff000000
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
          BorderLeft: {
            x: 400,
            y: 160,
            w: 3,
            h: 58,
            rect: true
          },
          BorderTop: {
            x: 400,
            y: 160,
            w: 1273,
            h: 3,
            rect: true
          },
          BorderRight: {
            x: 1673,
            y: 160,
            w: 3,
            h: 59,
            rect: true
          },
          BorderBottom: {
            x: 400,
            y: 188 + 28,
            w: 1273,
            h: 3,
            rect: true
          }
        },
        NetworkText: {
          x: 420,
          y: 170,
          zIndex: 2,
          text: {
            text: '',
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 0xffffffff,
            wordWrapWidth: 1300,
            wordWrap: false,
            textOverflow: 'ellipsis'
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
          BorderLeft: {
            x: 400,
            y: 230,
            w: 3,
            h: 58,
            rect: true
          },
          BorderTop: {
            x: 400,
            y: 230,
            w: 1273,
            h: 3,
            rect: true
          },
          BorderRight: {
            x: 1673,
            y: 230,
            w: 3,
            h: 59,
            rect: true
          },
          BorderBottom: {
            x: 400,
            y: 286,
            w: 1273,
            h: 3,
            rect: true
          },
          ArrowForward: {
            h: 30,
            w: 45,
            x: 1613,
            y: 245,
            src: Utils.asset('images/settings/Arrow.png')
          },
          ArrowBackward: {
            h: 30,
            w: 45,
            x: 415,
            scaleX: -1,
            y: 245,
            src: Utils.asset('images/settings/Arrow.png')
          }
        },
        TypeText: {
          x: 470,
          y: 260,
          mountY: 0.5,
          zIndex: 2,
          text: {
            text: '',
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 0xffffffff,
            wordWrapWidth: 1300,
            wordWrap: false,
            textOverflow: 'ellipsis'
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
          BorderLeft: {
            x: 400,
            y: 300,
            w: 3,
            h: 58,
            rect: true
          },
          BorderTop: {
            x: 403,
            y: 300,
            w: 1273,
            h: 3,
            rect: true
          },
          BorderRight: {
            x: 1673,
            y: 300,
            w: 3,
            h: 59,
            rect: true
          },
          BorderBottom: {
            x: 403,
            y: 356,
            w: 1273,
            h: 3,
            rect: true
          }
        },
        Pwd: {
          x: 420,
          y: 310,
          zIndex: 2,
          text: {
            text: '',
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 0xffffffff,
            wordWrapWidth: 1300,
            wordWrap: false,
            textOverflow: 'ellipsis'
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
      this._setState('EnterSSID');

      this.textCollection = {
        'EnterSSID': '',
        'EnterPassword': '',
        'EnterSecurity': ''
      };
      this.tag('Pwd').text.text = "";
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

    static _states() {
      return [class EnterSSID extends this {
        $enter() {
          this.tag('NetworkBox.BorderLeft').color = CONFIG.theme.hex;
          this.tag("NetworkBox.BorderBottom").color = CONFIG.theme.hex;
          this.tag("NetworkBox.BorderRight").color = CONFIG.theme.hex;
          this.tag("NetworkBox.BorderTop").color = CONFIG.theme.hex;
        }

        _handleDown() {
          this._setState("EnterSecurity");
        }

        _handleEnter() {
          this._setState('Keyboard');
        }

        $exit() {
          this.tag('NetworkBox.BorderLeft').color = 0xffffffff;
          this.tag("NetworkBox.BorderBottom").color = 0xffffffff;
          this.tag("NetworkBox.BorderRight").color = 0xffffffff;
          this.tag("NetworkBox.BorderTop").color = 0xffffffff;
        }

      }, class EnterSecurity extends this {
        $enter() {
          this.tag("TypeBox.BorderBottom").color = CONFIG.theme.hex;
          this.tag("TypeBox.BorderLeft").color = CONFIG.theme.hex;
          this.tag("TypeBox.BorderRight").color = CONFIG.theme.hex;
          this.tag("TypeBox.BorderTop").color = CONFIG.theme.hex;
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
          this.tag("TypeBox.BorderBottom").color = 0xffffffff;
          this.tag("TypeBox.BorderLeft").color = 0xffffffff;
          this.tag("TypeBox.BorderRight").color = 0xffffffff;
          this.tag("TypeBox.BorderTop").color = 0xffffffff;
        }

      }, class EnterPassword extends this {
        $enter() {
          if (this.pwdUnReachable) {
            this._setState("EnterSecurity");
          }

          this.tag('PasswordBox.BorderBottom').color = CONFIG.theme.hex;
          this.tag('PasswordBox.BorderLeft').color = CONFIG.theme.hex;
          this.tag('PasswordBox.BorderRight').color = CONFIG.theme.hex;
          this.tag('PasswordBox.BorderTop').color = CONFIG.theme.hex;
        }

        _handleUp() {
          this._setState("EnterSecurity");
        }

        _handleDown() {
          this._setState("EnterSSID");
        }

        _handleEnter() {
          this._setState('Keyboard');
        }

        $exit() {
          this.tag('PasswordBox.BorderBottom').color = 0xffffffff;
          this.tag('PasswordBox.BorderLeft').color = 0xffffffff;
          this.tag('PasswordBox.BorderRight').color = 0xffffffff;
          this.tag('PasswordBox.BorderTop').color = 0xffffffff;
        }

      }, class Keyboard extends this {
        $enter(state) {
          this.prevState = state.prevState;

          if (this.prevState === 'EnterSSID') {
            this.element = 'NetworkText';
          }

          if (this.prevState === 'EnterPassword') {
            this.element = 'Pwd';
          }

          if (this.prevState === 'EnterSecurity') {
            this.element = 'TypeText';
          }
        }

        _getFocused() {
          return this.tag('Keyboard');
        }

        $onSoftKey({
          key
        }) {
          if (key === 'Done') {
            this.handleDone();
          } else if (key === 'Clear') {
            this.textCollection[this.prevState] = this.textCollection[this.prevState].substring(0, this.textCollection[this.prevState].length - 1);
            this.tag(this.element).text.text = this.textCollection[this.prevState];
          } else if (key === '#@!' || key === 'abc' || key === 'áöû' || key === 'shift') {
            console.log('no saving');
          } else if (key === 'Space') {
            this.textCollection[this.prevState] += ' ';
            this.tag(this.element).text.text = this.textCollection[this.prevState];
          } else if (key === 'Delete') {
            this.textCollection[this.prevState] = '';
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
        'EnterSSID': '',
        'EnterPassword': '',
        'EnterSecurity': '0'
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
      this.tag("Pwd").text.text = this.textCollection['EnterPassword'];
      this.tag("NetworkText").text.text = this.textCollection['EnterSSID'];
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
  class WifiFailScreen extends lng$1.Component {
    static _template() {
      return {
        Background: {
          x: 0,
          y: 0,
          w: 1920,
          h: 2000,
          mount: 0.5,
          rect: true,
          color: 0xff000000
        },
        Title: {
          x: 0,
          y: 0,
          mountX: 0.5,
          text: {
            text: "Wifi Error",
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

    set item(error) {
      this.tag('Pairing').text = error;
    }

    _handleEnter() {
      this.fireAncestors("$removeFailScreen");
    }

    _handleBack() {
      this.fireAncestors("$removeFailScreen");
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
  * Class for WiFi screen.
  */

  class WiFiScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        FailScreen: {
          x: 780,
          y: 100,
          type: WifiFailScreen,
          zIndex: 5,
          visible: false
        },
        Switch: {
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'WiFi On/Off',
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
            // x: 320,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Loading.gif')
          },
          Button: {
            h: 45,
            w: 67,
            x: 1600,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/ToggleOffWhite.png')
          }
        },
        Networks: {
          y: 180,
          flex: {
            direction: 'column'
          },
          PairedNetworks: {
            flexItem: {
              margin: 0
            },
            List: {
              type: lng$1.components.ListComponent,
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
              type: lng$1.components.ListComponent,
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
              text: 'Join Another Network',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25
            }
          },
          visible: false
        },
        PairingScreen: {
          x: -220,
          y: -265,
          w: 1920,
          h: 1080,
          zIndex: 4,
          visible: false,
          type: BluetoothPairingScreen
        },
        JoinAnotherNetworkScreen: {
          x: -220,
          y: -265,
          w: 1920,
          h: 1080,
          zIndex: 4,
          visible: false,
          type: JoinAnotherNetworkComponent
        }
      };
    }

    _active() {
      this._setState('Switch');
    }

    _focus() {
      this._setState('Switch');

      new Network().getIP().then(ip => {
        this.fireAncestors('$changeIp', 'IP:' + ip);
      });
    }

    $goToWifiSwitch() {
      this._setState('Switch');
    }

    $removeFailScreen() {
      this._setState('Switch');

      this.childList.remove(this.tag('FailScreen'));
    }

    _setfailState(msg) {
      this.tag('FailScreen').item = msg;

      this._setState('FailScreen');
    }

    _init() {
      this.wifiLoading = this.tag('Switch.Loader').animation({
        duration: 3,
        repeat: -1,
        stopMethod: 'immediate',
        stopDelay: 0.2,
        actions: [{
          p: 'rotation',
          v: {
            sm: 0,
            0: 0,
            1: Math.PI * 2
          }
        }]
      });
      this.onError = {
        0: 'SSID_CHANGED - The SSID of the network changed',
        1: 'CONNECTION_LOST - The connection to the network was lost',
        2: 'CONNECTION_FAILED - The connection failed for an unknown reason',
        3: 'CONNECTION_INTERRUPTED - The connection was interrupted',
        4: 'INVALID_CREDENTIALS - The connection failed due to invalid credentials',
        5: 'NO_SSID - The SSID does not exist',
        6: 'UNKNOWN - Any other error.'
      };
      this._wifi = new Wifi();
      this._network = new Network();
      this.wifiStatus = true;
      this._wifiIcon = true;

      this._activateWiFi();

      this._setState('Switch');

      if (this.wiFiStatus) {
        this.tag('Networks').visible = true;
        this.tag('JoinAnotherNetwork').visible = true;
      }

      this._pairedNetworks = this.tag('Networks.PairedNetworks');
      this._availableNetworks = this.tag('Networks.AvailableNetworks');

      this._network.activate().then(result => {
        if (result) {
          this._network.registerEvent('onIPAddressStatusChanged', notification => {
            console.log(JSON.stringify(notification));

            if (notification.status == 'ACQUIRED') {
              //location.reload(true)
              this.fireAncestors('$changeIp', 'IP:' + notification.ip4Address);
            } else if (notification.status == 'LOST') {
              this.fireAncestors('$changeIp', 'IP:' + 'NA');

              if (notification.interface === 'WIFI') {
                this._wifi.setInterface('ETHERNET', true).then(res => {
                  if (res.success) {
                    this._wifi.setDefaultInterface('ETHERNET', true);
                  }
                });
              }
            }
          });

          this._network.registerEvent('onDefaultInterfaceChanged', notification => {
            console.log(JSON.stringify(notification));
            this.fireAncestors('$NetworkInterfaceText', notification.newInterfaceName);

            if (notification.newInterfaceName === 'ETHERNET') {
              this._wifi.setInterface('ETHERNET', true).then(result => {
                if (result.success) {
                  this._wifi.setDefaultInterface('ETHERNET', true).then(result => {
                    if (result.success) {
                      this._wifi.disconnect();

                      this.wifiStatus = false;
                      this.tag('Networks').visible = false;
                      this.tag('JoinAnotherNetwork').visible = false;
                      this.tag('Switch.Loader').visible = false;
                      this.wifiLoading.stop();
                      this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
                    }
                  });
                }
              });
            } else if (notification.newInterfaceName == 'ETHERNET' || notification.oldInterfaceName == 'WIFI') {
              this._wifi.disconnect();

              this.wifiStatus = false;
              this.tag('Networks').visible = false;
              this.tag('JoinAnotherNetwork').visible = false;
              this.tag('Switch.Loader').visible = false;
              this.wifiLoading.stop();
              this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');

              this._setState('Switch');
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
    /**
     * Function to be executed when the Wi-Fi screen is enabled.
     */


    _enable() {
      if (this.wifiStatus) {
        this._wifi.discoverSSIDs();
      }

      this.scanTimer = setInterval(() => {
        if (this.wifiStatus) {
          this._wifi.discoverSSIDs();
        }
      }, 5000);
    }
    /**
     * Function to be executed when the Wi-Fi screen is disabled.
     */


    _disable() {
      clearInterval(this.scanTimer);
    }
    /**
     * Function to render list of Wi-Fi networks.
     */


    renderDeviceList(ssids) {
      this._wifi.getConnectedSSID().then(result => {
        if (result.ssid != '') {
          this._pairedList = [result];
        } else {
          this._pairedList = [];
        }

        this._pairedNetworks.h = this._pairedList.length * 90;
        this._pairedNetworks.tag('List').h = this._pairedList.length * 90;
        this._pairedNetworks.tag('List').items = this._pairedList.map((item, index) => {
          item.connected = true;
          return {
            ref: 'Paired' + index,
            w: 1920 - 300,
            h: 90,
            type: WiFiItem,
            item: item
          };
        });
        this._otherList = ssids.filter(device => {
          result = this._pairedList.map(a => a.ssid);

          if (result.includes(device.ssid)) {
            return false;
          } else return device;
        });
        this._availableNetworks.h = this._otherList.length * 90;
        this._availableNetworks.tag('List').h = this._otherList.length * 90;
        this._availableNetworks.tag('List').items = this._otherList.map((item, index) => {
          item.connected = false;
          return {
            ref: 'Other' + index,
            w: 1620,
            h: 90,
            type: WiFiItem,
            item: item
          };
        });
      });
    }

    $startConnectForAnotherNetwork(device, passphrase) {
      this._wifi.connect({
        ssid: device.ssid,
        security: device.security
      }, passphrase);

      this._setState("Switch");
    }

    static _states() {
      return [class Switch extends this {
        $enter() {
          if (this.wifiStatus === true) {
            this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
            this.tag('Switch.Button').scaleX = 1;
          }

          this.tag('Switch')._focus();
        }

        $exit() {
          this.tag('Switch')._unfocus();
        }

        _handleDown() {
          if (this.wifiStatus === true) {
            this._setState('JoinAnotherNetwork');
          }
        }

        _handleEnter() {
          this.switch();
        }

      }, class PairedDevices extends this {
        $enter() {
          if (this.wifiStatus === true) {
            this.tag('Switch.Loader').visible = false;
            this.wifiLoading.stop();
            this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
            this.tag('Switch.Button').scaleX = -1;
          }
        }

        _getFocused() {
          return this._pairedNetworks.tag('List').element;
        }

        _handleDown() {
          this._navigate('MyDevices', 'down');
        }

        _handleUp() {
          this._navigate('MyDevices', 'up');
        }

        _handleEnter() {
          this.tag('PairingScreen').visible = true;
          this.tag('PairingScreen').item = this._pairedNetworks.tag('List').element._item;

          this._setState('PairingScreen');
        }

      }, class AvailableDevices extends this {
        $enter() {
          if (this.wifiStatus === true) {
            this.tag('Switch.Loader').visible = false;
            this.wifiLoading.stop();
            this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
            this.tag('Switch.Button').scaleX = -1;
          }
        }

        _getFocused() {
          return this._availableNetworks.tag('List').element;
        }

        _handleDown() {
          this._navigate('AvailableDevices', 'down');
        }

        _handleUp() {
          this._navigate('AvailableDevices', 'up');
        }

        _handleEnter() {
          this.tag('PairingScreen').visible = true;
          this.tag('PairingScreen').item = this._availableNetworks.tag('List').element._item;

          this._setState('PairingScreen');
        }

      }, class JoinAnotherNetwork extends this {
        $enter() {
          this.tag('JoinAnotherNetwork')._focus();
        }

        _handleUp() {
          this._setState('Switch');
        }

        _handleEnter() {
          if (this.wifiStatus) {
            this._setState("JoinAnotherNetworkScreenState");
          }
        }

        _handleDown() {
          console.log(`The Current Wifi Status = ${this.wifiStatus}`);

          if (this.wifiStatus) {
            if (this._pairedNetworks.tag('List').length > 0) {
              this._setState('PairedDevices');
            } else if (this._availableNetworks.tag('List').length > 0) {
              this._setState('AvailableDevices');
            }
          }
        }

        $exit() {
          this.tag('JoinAnotherNetwork')._unfocus();
        }

      }, class JoinAnotherNetworkScreenState extends this {
        $enter() {
          this.tag('JoinAnotherNetworkScreen').visible = true;
        }

        _getFocused() {
          return this.tag("JoinAnotherNetworkScreen");
        }

        _handleBack() {
          this._setState("JoinAnotherNetwork");
        }

        $goToJoinAnotherNetwork() {
          this._setState("JoinAnotherNetwork");
        }

        $exit() {
          this.tag('JoinAnotherNetworkScreen').visible = false;
        }

      }, class PairingScreen extends this {
        $enter() {
          this._wifi.stopScan();

          this._disable();

          this.tag("PairingScreen").visible = true;
        }

        _getFocused() {
          return this.tag('PairingScreen');
        }

        $pressEnter(option) {
          if (option === 'Cancel') {
            this._setState('Switch');
          } else if (option === 'Connect') {
            if (this._availableNetworks.tag('List').element) {
              this._wifi.connect(this._availableNetworks.tag('List').element._item, '').then(() => {});
            }

            this._setState('Switch');
          } else if (option === 'Disconnect') {
            this._wifi.disconnect().then(() => {
              this._setState('Switch');
            });
          }
        }

        $startConnect(password) {
          if (this._availableNetworks.tag('List').element && password != null) {
            this._wifi.connect(this._availableNetworks.tag('List').element._item, password);
          }

          this._setState('Switch');
        }

        $exit() {
          this.tag('PairingScreen').visible = false;

          this._enable();
        }

      }, class FailScreen extends this {
        $enter() {
          this.tag('FailScreen').visible = true;
        }

        _getFocused() {
          return this.tag('FailScreen');
        }

        $exit() {
          this.tag('FailScreen').visible = true;
        }

      }];
    }
    /**
     * Function to navigate through the lists in the screen.
     * @param {string} listname
     * @param {string} dir
     */


    _navigate(listname, dir) {
      let list;
      if (listname === 'MyDevices') list = this._pairedNetworks.tag('List');else if (listname === 'AvailableDevices') list = this._availableNetworks.tag('List');

      if (dir === 'down') {
        if (list.index < list.length - 1) list.setNext();else if (list.index == list.length - 1) {
          if (listname === 'MyDevices' && this._availableNetworks.tag('List').length > 0) {
            this._setState('AvailableDevices');
          }
        }
      } else if (dir === 'up') {
        if (list.index > 0) list.setPrevious();else if (list.index == 0) {
          if (listname === 'AvailableDevices' && this._pairedNetworks.tag('List').length > 0) {
            this._setState('PairedDevices');
          } else {
            this._setState('JoinAnotherNetwork');
          }
        }
      }
    }
    /**
     * Function to turn on and off Wi-Fi.
     */


    switch() {
      if (this.wifiStatus) {
        this._wifi.disconnect();

        console.log('turning off wifi');

        this._wifi.setInterface('ETHERNET', true).then(result => {
          if (result.success) {
            this._wifi.setDefaultInterface('ETHERNET', true).then(result => {
              if (result.success) {
                this._wifi.disconnect();

                this.wifiStatus = false;
                this.tag('Networks').visible = false;
                this.tag('JoinAnotherNetwork').visible = false;
                this.tag('Switch.Loader').visible = false;
                this.wifiLoading.stop();
                this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
              }
            });
          }
        });
      } else {
        console.log('turning on wifi');
        this.wifiStatus = true;
        this.tag('Networks').visible = true;
        this.tag('JoinAnotherNetwork').visible = true;
        this.wifiLoading.play();
        this.tag('Switch.Loader').visible = true;
        this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');

        this._wifi.discoverSSIDs();
      }
    }
    /**
     * Function to activate Wi-Fi plugin.
     */


    _activateWiFi() {
      this._wifi.activate().then(() => {
        this.switch();
      });

      this._wifi.registerEvent('onWIFIStateChanged', notification => {
        console.log(JSON.stringify(notification));

        if (notification.state === 2 || notification.state === 5) {
          this._wifi.discoverSSIDs();
        }

        this._setState('Switch');
      });

      this._wifi.registerEvent('onError', notification => {
        this._wifi.discoverSSIDs();

        this._wifi.setInterface('ETHERNET', true).then(res => {
          if (res.success) {
            this._wifi.setDefaultInterface('ETHERNET', true);
          }
        });

        this._setfailState(this.onError[notification.code]);
      });

      this._wifi.registerEvent('onAvailableSSIDs', notification => {
        this.renderDeviceList(notification.ssids);

        if (!notification.moreData) {
          setTimeout(() => {
            this.tag('Switch.Loader').visible = false;
            this.wifiLoading.stop();
          }, 1000);
        }
      });
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
  const wifi = new Wifi();
  class NetworkInterfaceScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        NetworkInterfaceScreenContents: {
          WiFi: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'WiFi',
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: 'Ethernet',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          }
        },
        WiFiScreen: {
          type: WiFiScreen,
          visible: false
        }
      };
    }

    _focus() {
      this._setState('WiFi');
    }

    hide() {
      this.tag('NetworkInterfaceScreenContents').visible = false;
    }

    show() {
      this.tag('NetworkInterfaceScreenContents').visible = true;
    }

    setEthernetInterface() {
      wifi.setInterface('ETHERNET', true).then(res => {
        if (res.success) {
          wifi.setDefaultInterface('ETHERNET', true);
        }
      });
    }

    static _states() {
      return [class WiFi extends this {
        $enter() {
          this.tag('WiFi')._focus();
        }

        $exit() {
          this.tag('WiFi')._unfocus();
        }

        _handleDown() {
          this._setState('Ethernet');
        }

        _handleEnter() {
          this._setState('WiFiScreen');
        }

      }, class Ethernet extends this {
        $enter() {
          this.tag('Ethernet')._focus();
        }

        $exit() {
          this.tag('Ethernet')._unfocus();
        }

        _handleEnter() {
          this.setEthernetInterface();
        }

        _handleDown() {
          this._setState('WiFi');
        }

        _handleUp() {
          this._setState('WiFi');
        }

      }, class WiFiScreen extends this {
        $enter() {
          this.hide();
          this.tag('WiFiScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / Network Interface / WiFi');
        }

        $exit() {
          this.show();
          this.tag('WiFiScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / Network Interface');
        }

        _getFocused() {
          return this.tag('WiFiScreen');
        }

        _handleBack() {
          this._setState('WiFi');
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
    * Class for Other Settings Screen.
    */

  var appApi$2 = new AppApi();
  var defaultInterface = "";
  var currentInterface = [];
  class NetworkInfo extends lng$1.Component {
    static _template() {
      return {
        NetworkInfoScreenContents: {
          Status: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Status: '),
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
                text: '',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          ConnectionType: {
            //alpha: 0.3, // disabled
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Connection Type: '),
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
                text: '',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          IPAddress: {
            //alpha: 0.3, // disabled
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('IP Address: '),
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
                text: '',
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
                text: Language.translate('Gateway: '),
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
                text: '',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          MACAddress: {
            //alpha: 0.3, // disabled
            y: 360,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('MAC Address: '),
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
                text: '',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          InternetProtocol: {
            //alpha: 0.3, // disabled
            y: 450,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Internet Protocol: '),
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
                text: '',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          SSID: {
            //alpha: 0.3, // disabled
            y: 540,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('SSID: '),
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
                text: '',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25
              }
            }
          },
          SignalStrength: {
            //alpha: 0.3, // disabled
            y: 630,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Signal Strength: '),
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
                text: '',
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
      appApi$2.getIPSetting(interfaceName).then(result => {
        this.tag('InternetProtocol.Value').text.text = result.ipversion;
      }).catch(err => console.log(err));
    }

    _focus() {
      //Getting the default interface
      appApi$2.getDefaultInterface().then(result => {
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
        } //Filtering the current interface


        appApi$2.getInterfaces().then(result => {
          currentInterface = result.interfaces.filter(data => data.interface === defaultInterface); //console.log(currentInterface);

          if (currentInterface[0].connected) {
            this.tag("Status.Value").text.text = `Connected`;
            appApi$2.getConnectedSSID().then(result => {
              if (parseInt(result.signalStrength) >= -50) {
                this.tag("SignalStrength.Value").text.text = `Excellent`;
              } else if (parseInt(result.signalStrength) >= -60) {
                this.tag("SignalStrength.Value").text.text = `Good`;
              } else if (parseInt(result.signalStrength) >= -67) {
                this.tag("SignalStrength.Value").text.text = `Fair`;
              } else {
                this.tag("SignalStrength.Value").text.text = `Poor`;
              }

              this.tag("SSID.Value").text.text = `${result.ssid}`;
            }).catch(error => console.log(error));
            appApi$2.getIPSetting(defaultInterface).then(result => {
              this.tag('IPAddress.Value').text.text = `${result.ipaddr}`;
              this.tag("Gateway.Value").text.text = `${result.gateway}`;
            }).catch(error => console.log(error));
          } else {
            this.tag('Status.Value').text.text = `Disconnected`;
          }

          this.tag('MACAddress.Value').text.text = `${currentInterface[0].macAddress}`;
        }).catch(error => console.log(error));
      }).catch(error => console.log(error));
    }

    _unfocus() {
      this.tag('SSID.Value').text.text = 'NA';
      this.tag('SignalStrength.Value').text.text = 'NA';
      this.tag('MACAddress.Value').text.text = 'NA';
      this.tag('Gateway.Value').text.text = 'NA';
      this.tag('IPAddress.Value').text.text = 'NA';
      this.tag('ConnectionType.Value').text.text = 'NA';
      this.tag('InternetProtocol.Value').text.text = 'NA';
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
  class ConfigureManuallyScreen extends lng$1.Component {
    static _template() {
      return {
        Text: {
          x: 700,
          y: -140,
          text: {
            text: "Configure Manually",
            fontFace: CONFIG.language.font,
            fontSize: 35,
            textColor: CONFIG.theme.hex
          }
        },
        BorderTop: {
          x: 122,
          y: -60,
          w: 1530,
          h: 2,
          rect: true
        },
        IPv4: {
          x: 120,
          y: -10,
          text: {
            text: "IPv4 Address: ",
            fontFace: CONFIG.language.font,
            fontSize: 25
          }
        },
        IPv4Box: {
          BorderLeft: {
            x: 330,
            y: -20,
            w: 3,
            h: 58,
            rect: true
          },
          BorderTop: {
            x: 330,
            y: -20,
            w: 1320,
            h: 3,
            rect: true
          },
          BorderRight: {
            x: 1650,
            y: -20,
            w: 3,
            h: 59,
            rect: true
          },
          BorderBottom: {
            x: 330,
            y: 10 + 28,
            w: 1320,
            h: 3,
            rect: true
          }
        },
        IPv4Text: {
          x: 380,
          y: -10,
          zIndex: 2,
          text: {
            text: '',
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 0xffffffff,
            wordWrapWidth: 1300,
            wordWrap: false,
            textOverflow: 'ellipsis'
          }
        },
        Subnet: {
          x: 120,
          y: 80,
          text: {
            text: "Subnet Mask: ",
            fontFace: CONFIG.language.font,
            fontSize: 25
          }
        },
        SubnetBox: {
          BorderLeft: {
            x: 330,
            y: 60,
            w: 3,
            h: 58,
            rect: true
          },
          BorderTop: {
            x: 330,
            y: 60,
            w: 1320,
            h: 3,
            rect: true
          },
          BorderRight: {
            x: 1650,
            y: 60,
            w: 3,
            h: 59,
            rect: true
          },
          BorderBottom: {
            x: 330,
            y: 88 + 28,
            w: 1320,
            h: 3,
            rect: true
          }
        },
        SubnetText: {
          x: 380,
          y: 70,
          zIndex: 2,
          text: {
            text: '',
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 0xffffffff,
            wordWrapWidth: 1300,
            wordWrap: false,
            textOverflow: 'ellipsis'
          }
        },
        Gateway: {
          x: 120,
          y: 160,
          text: {
            text: "Gateway: ",
            fontFace: CONFIG.language.font,
            fontSize: 25
          }
        },
        GatewayBox: {
          BorderLeft: {
            x: 330,
            y: 140,
            w: 3,
            h: 58,
            rect: true
          },
          BorderTop: {
            x: 330,
            y: 140,
            w: 1320,
            h: 3,
            rect: true
          },
          BorderRight: {
            x: 1650,
            y: 140,
            w: 3,
            h: 59,
            rect: true
          },
          BorderBottom: {
            x: 330,
            y: 168 + 28,
            w: 1320,
            h: 3,
            rect: true
          }
        },
        GatewayText: {
          x: 380,
          y: 150,
          zIndex: 2,
          text: {
            text: '',
            fontSize: 25,
            fontFace: CONFIG.language.font,
            textColor: 0xffffffff,
            wordWrapWidth: 1300,
            wordWrap: false,
            textOverflow: 'ellipsis'
          }
        },
        BorderBottom: {
          x: 122,
          y: 240,
          w: 1530,
          h: 2,
          rect: true
        },
        Keyboard: {
          y: 270,
          x: 335,
          type: Keyboard,
          visible: true,
          zIndex: 2,
          formats: KEYBOARD_FORMATS.qwerty
        }
      };
    }

    _focus() {
      this._setState('EnterIPv4');

      this.textCollection = {
        'EnterIPv4': '',
        'EnterSubnet': '',
        'EnterGateway': ''
      };
      this.tag('IPv4Text').text.text = "";
      this.tag("SubnetText").text.text = "";
      this.tag("GatewayText").text.text = "";
      this.fireAncestors("$hideSideAndTopPanels");
    }

    _unfocus() {
      this.fireAncestors("$showSideAndTopPanels");
    }

    static _states() {
      return [class EnterIPv4 extends this {
        $enter() {
          this.tag('IPv4Box.BorderLeft').color = CONFIG.theme.hex;
          this.tag("IPv4Box.BorderBottom").color = CONFIG.theme.hex;
          this.tag("IPv4Box.BorderRight").color = CONFIG.theme.hex;
          this.tag("IPv4Box.BorderTop").color = CONFIG.theme.hex;
        }

        _handleDown() {
          this._setState("EnterSubnet");
        }

        _handleEnter() {
          this._setState('Keyboard');
        }

        $exit() {
          this.tag('IPv4Box.BorderLeft').color = 0xffffffff;
          this.tag("IPv4Box.BorderBottom").color = 0xffffffff;
          this.tag("IPv4Box.BorderRight").color = 0xffffffff;
          this.tag("IPv4Box.BorderTop").color = 0xffffffff;
        }

      }, class EnterSubnet extends this {
        $enter() {
          this.tag("SubnetBox.BorderBottom").color = CONFIG.theme.hex;
          this.tag("SubnetBox.BorderLeft").color = CONFIG.theme.hex;
          this.tag("SubnetBox.BorderRight").color = CONFIG.theme.hex;
          this.tag("SubnetBox.BorderTop").color = CONFIG.theme.hex;
        }

        _handleUp() {
          this._setState("EnterIPv4");
        }

        _handleEnter() {
          this._setState('Keyboard');
        }

        _handleDown() {
          this._setState("EnterGateway");
        }

        $exit() {
          this.tag("SubnetBox.BorderBottom").color = 0xffffffff;
          this.tag("SubnetBox.BorderLeft").color = 0xffffffff;
          this.tag("SubnetBox.BorderRight").color = 0xffffffff;
          this.tag("SubnetBox.BorderTop").color = 0xffffffff;
        }

      }, class EnterGateway extends this {
        $enter() {
          this.tag('GatewayBox.BorderBottom').color = CONFIG.theme.hex;
          this.tag('GatewayBox.BorderLeft').color = CONFIG.theme.hex;
          this.tag('GatewayBox.BorderRight').color = CONFIG.theme.hex;
          this.tag('GatewayBox.BorderTop').color = CONFIG.theme.hex;
        }

        _handleUp() {
          this._setState("EnterSubnet");
        }

        _handleDown() {
          this._setState("EnterIPv4");
        }

        _handleEnter() {
          this._setState('Keyboard');
        }

        $exit() {
          this.tag('GatewayBox.BorderBottom').color = 0xffffffff;
          this.tag('GatewayBox.BorderLeft').color = 0xffffffff;
          this.tag('GatewayBox.BorderRight').color = 0xffffffff;
          this.tag('GatewayBox.BorderTop').color = 0xffffffff;
        }

      }, class Keyboard extends this {
        $enter(state) {
          this.prevState = state.prevState;

          if (this.prevState === 'EnterIPv4') {
            this.element = 'IPv4Text';
          }

          if (this.prevState === 'EnterSubnet') {
            this.element = 'SubnetText';
          }

          if (this.prevState === 'EnterGateway') {
            this.element = 'GatewayText';
          }
        }

        _getFocused() {
          return this.tag('Keyboard');
        }

        $onSoftKey({
          key
        }) {
          if (key === 'Done') {
            this.handleDone();
          } else if (key === 'Clear') {
            this.textCollection[this.prevState] = this.textCollection[this.prevState].substring(0, this.textCollection[this.prevState].length - 1);
            this.tag(this.element).text.text = this.textCollection[this.prevState];
          } else if (key === '#@!' || key === 'abc' || key === 'áöû' || key === 'shift') {
            console.log('no saving');
          } else if (key === 'Space') {
            this.textCollection[this.prevState] += ' ';
            this.tag(this.element).text.text = this.textCollection[this.prevState];
          } else if (key === 'Delete') {
            this.textCollection[this.prevState] = '';
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
    * Class for Other Settings Screen.
    */

  class ConfigureScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        ConfigureScreenContents: {
          DHCP: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'DHCP',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          DHCPManual: {
            //alpha: 0.3, // disabled
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'DHCP with Manual Address ',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          BootP: {
            //alpha: 0.3, // disabled
            y: 180,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'BootP ',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          Manually: {
            y: 270,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Manually',
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          }
        },
        ConfigureManuallyScreen: {
          x: -100,
          y: -100,
          type: ConfigureManuallyScreen,
          visible: false
        }
      };
    }

    _init() {}

    _focus() {
      this._setState('DHCP');
    }

    hide() {
      this.tag('ConfigureScreenContents').visible = false;
    }

    show() {
      this.tag('ConfigureScreenContents').visible = true;
    }

    static _states() {
      return [class DHCP extends this {
        $enter() {
          this.tag('DHCP')._focus();
        }

        $exit() {
          this.tag('DHCP')._unfocus();
        }

        _handleDown() {
          this._setState('DHCPManual');
        }

        _handleEnter() {}

      }, class DHCPManual extends this {
        $enter() {
          this.tag('DHCPManual')._focus();
        }

        $exit() {
          this.tag('DHCPManual')._unfocus();
        }

        _handleUp() {
          this._setState('DHCP');
        }

        _handleDown() {
          this._setState('BootP');
        }

        _handleEnter() {}

      }, class BootP extends this {
        $enter() {
          this.tag('BootP')._focus();
        }

        $exit() {
          this.tag('BootP')._unfocus();
        }

        _handleUp() {
          this._setState('DHCPManual');
        }

        _handleDown() {
          this._setState('Manually');
        }

        _handleEnter() {}

      }, class Manually extends this {
        $enter() {
          this.tag('Manually')._focus();
        }

        $exit() {
          this.tag('Manually')._unfocus();
        }

        _handleUp() {
          this._setState('BootP');
        }

        _handleDown() {
          this._setState('DHCP');
        }

        _handleEnter() {
          this._setState('ConfigureManuallyScreen');
        }

      }, class ConfigureManuallyScreen extends this {
        $enter() {
          this.hide();
          this.tag('ConfigureManuallyScreen').visible = true;
          this.fireAncestors('$changeHomeText', '');
        }

        $exit() {
          this.show();
          this.tag('ConfigureManuallyScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / Configure');
        }

        _getFocused() {
          return this.tag('ConfigureManuallyScreen');
        }

        _handleBack() {
          this._setState('Manually');
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
    * Class for Other Network Config Screen.
    */

  new AppApi();
  class NetworkConfigurationScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        NetworkConfigurationScreenContents: {
          NetworkInfo: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Network Info'),
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          },
          NetworkInterface: {
            //alpha: 0.3, // disabled
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Network Interface: '),
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Test Internet Access: '),
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
              src: Utils.asset('images/settings/Loading.gif'),
              visible: false
            }
          },
          StaticMode: {
            alpha: 0,
            // disabled
            y: 270,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Static Mode'),
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          }
        },
        NetworkInfoScreen: {
          type: NetworkInfo,
          visible: false
        },
        NetworkInterfaceScreen: {
          type: NetworkInterfaceScreen,
          visible: false
        },
        WiFiScreen: {
          type: WiFiScreen,
          visible: false
        },
        ConfigureScreen: {
          type: ConfigureScreen,
          visible: false
        }
      };
    }

    _init() {

      let _currentIPSettings = {};
      let _newIPSettings = {};
      this._network = new Network();

      this._network.getDefaultInterface().then(interfaceName => {
      });

      _newIPSettings = _currentIPSettings;
      _newIPSettings.ipversion = "IPV6"; // this fails, need to verify how to set proper ip settings
      // loader animation for testing internet

      this.loadingAnimation = this.tag('TestInternetAccess.Loader').animation({
        duration: 3,
        repeat: -1,
        stopMethod: 'immediate',
        stopDelay: 0.2,
        actions: [{
          p: 'rotation',
          v: {
            sm: 0,
            0: 0,
            1: 2 * Math.PI
          }
        }]
      });
      this.loadingAnimation.start();
    }

    _focus() {
      this._setState('NetworkInfo'); //can be used on init as well

    }

    _focus() {
      this._setState('NetworkInfo'); //can be used on init as well


      this._network.getDefaultInterface().then(interfaceName => {
        this.$NetworkInterfaceText(interfaceName);
      });
    }

    _unfocus() {
      this.tag('TestInternetAccess.Title').text.text = Language.translate('Test Internet Access: ');
    }

    hide() {
      this.tag('NetworkConfigurationScreenContents').visible = false;
    }

    show() {
      this.tag('NetworkConfigurationScreenContents').visible = true;
    }

    $NetworkInterfaceText(text) {
      this.tag('NetworkInterface.Title').text.text = Language.translate('Network Interface: ') + text;
    }

    static _states() {
      return [class NetworkInfo extends this {
        $enter() {
          this.tag('NetworkInfo')._focus();
        }

        $exit() {
          this.tag('NetworkInfo')._unfocus();
        }

        _handleDown() {
          this._setState('NetworkInterface');
        }

        _handleEnter() {
          this._setState('NetworkInfoScreen');
        }

      }, class NetworkInterface extends this {
        $enter() {
          this.tag('NetworkInterface')._focus();
        }

        $exit() {
          this.tag('NetworkInterface')._unfocus();
        }

        _handleUp() {
          this._setState('NetworkInfo');
        }

        _handleDown() {
          this._setState('TestInternetAccess');
        }

        _handleEnter() {
          this._setState('NetworkInterfaceScreen');
        }

      }, class TestInternetAccess extends this {
        $enter() {
          this.tag('TestInternetAccess')._focus();
        }

        $exit() {
          this.tag('TestInternetAccess')._unfocus();
        }

        _handleUp() {
          this._setState('NetworkInterface');
        }

        _handleDown() {
          this._setState('NetworkInfo');
        }

        _handleEnter() {
          this.tag('TestInternetAccess.Loader').visible = true;

          this._network.isConnectedToInternet().then(result => {
            var connectionStatus = Language.translate("Internet Access: ");

            if (result) {
              connectionStatus += "Connected";
            } else {
              connectionStatus += "Not Connected";
            }

            setTimeout(() => {
              this.tag('TestInternetAccess.Loader').visible = false;
              this.tag('TestInternetAccess.Title').text.text = connectionStatus;
              this.loadingAnimation.stop();
            }, 2000);
          });
        }

      }, class StaticMode extends this {
        $enter() {
          this.tag('StaticMode')._focus();
        }

        $exit() {
          this.tag('StaticMode')._unfocus();
        }

        _handleUp() {
          this._setState('TestInternetAccess');
        }

        _handleDown() {
          this._setState('NetworkInfo');
        }

        _handleEnter() {
          this._setState('ConfigureScreen');
        }

      }, class NetworkInterfaceScreen extends this {
        $enter() {
          this.hide();
          this.tag('NetworkInterfaceScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / Network Interface');
        }

        $exit() {
          this.show();
          this.tag('NetworkInterfaceScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration');
        }

        _getFocused() {
          return this.tag('NetworkInterfaceScreen');
        }

        _handleBack() {
          this._setState('NetworkInterface');
        }

      }, class NetworkInfoScreen extends this {
        $enter() {
          this.hide();
          this.tag('NetworkInfoScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / Network Info');
        }

        $exit() {
          this.show();
          this.tag('NetworkInfoScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration');
        }

        _getFocused() {
          return this.tag('NetworkInfoScreen');
        }

        _handleBack() {
          this._setState('NetworkInfo');
        }

      }, class WiFiScreen extends this {
        $enter() {
          this.hide();
          this.tag('WiFiScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / WiFi');
        }

        $exit() {
          this.show();
          this.tag('WiFiScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration');
        }

        _getFocused() {
          return this.tag('WiFiScreen');
        }

        _handleBack() {
          this._setState('WiFi');
        }

      }, class ConfigureScreen extends this {
        $enter() {
          this.hide();
          this.tag('ConfigureScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration / Configure');
        }

        $exit() {
          this.show();
          this.tag('ConfigureScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration');
        }

        _getFocused() {
          return this.tag('ConfigureScreen');
        }

        _handleBack() {
          this._setState('StaticMode');
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
   * Class for settings screen.
   */

  let stateTracker = 'NetworkConfiguration';
  class SettingsScreen extends lng$1.Component {
    static _template() {
      return {
        x: 200,
        y: 286,
        SettingsScreenContents: {
          NetworkConfiguration: {
            y: 0,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: Language.translate('Network Configuration'),
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Pair Remote Control'),
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Video'),
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Audio'),
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
              src: Utils.asset('images/settings/Arrow.png')
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
                text: Language.translate('Other Settings'),
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
              src: Utils.asset('images/settings/Arrow.png')
            }
          }
        },
        NetworkConfigurationScreen: {
          type: NetworkConfigurationScreen,
          visible: false
        },
        BluetoothScreen: {
          type: BluetoothScreen,
          visible: false
        },
        VideoScreen: {
          type: VideoScreen,
          visible: false
        },
        AudioScreen: {
          type: AudioScreen,
          visible: false
        },
        OtherSettingsScreen: {
          type: OtherSettingsScreen,
          visible: false
        }
      };
    }
    /**
    * @param {any} e
    */


    set setState(e) {
      stateTracker = 'BluetoothScreen';
    }

    _focus() {
      this._setState(stateTracker);
    }

    _unfocus() {
      stateTracker = 'NetworkConfiguration';
    }

    hide() {
      this.tag('SettingsScreenContents').visible = false;
    }

    show() {
      this.tag('SettingsScreenContents').visible = true;
    }

    home() {
      this.fireAncestors('$changeHomeText', Language.translate('home'));
      this.fireAncestors('$goToSidePanel', 0);
    }

    static _states() {
      return [class NetworkConfiguration extends this {
        $enter() {
          this.tag('NetworkConfiguration')._focus();
        }

        $exit() {
          this.tag('NetworkConfiguration')._unfocus();
        }

        _handleDown() {
          this._setState('Bluetooth');
        }

        _handleEnter() {
          this._setState('NetworkConfigurationScreen');
        }

        _handleBack() {
          this.home();
        }

      }, class Bluetooth extends this {
        $enter() {
          this.tag('Bluetooth')._focus();
        }

        $exit() {
          this.tag('Bluetooth')._unfocus();
        }

        _handleUp() {
          this._setState('NetworkConfiguration');
        }

        _handleDown() {
          this._setState('Video');
        }

        _handleLeft() {}

        _handleEnter() {
          this._setState('BluetoothScreen');
        }

        _handleBack() {
          this.home();
        }

      }, class Video extends this {
        $enter() {
          this.tag('Video')._focus();
        }

        $exit() {
          this.tag('Video')._unfocus();
        }

        _handleUp() {
          this._setState('Bluetooth');
        }

        _handleDown() {
          this._setState('Audio');
        }

        _handleEnter() {
          this._setState('VideoScreen');
        }

        _handleBack() {
          this.home();
        }

      }, class Audio extends this {
        $enter() {
          this.tag('Audio')._focus();
        }

        $exit() {
          this.tag('Audio')._unfocus();
        }

        _handleUp() {
          this._setState('Video');
        }

        _handleEnter() {
          this._setState('AudioScreen');
        }

        _handleDown() {
          this._setState('OtherSettings');
        }

        _handleBack() {
          this.home();
        }

      }, class OtherSettings extends this {
        $enter() {
          this.tag('OtherSettings')._focus();
        }

        $exit() {
          this.tag('OtherSettings')._unfocus();
        }

        _handleUp() {
          this._setState('Audio');
        }

        _handleEnter() {
          this._setState('OtherSettingsScreen');
        }

        _handleBack() {
          this.home();
        }

      }, class NetworkConfigurationScreen extends this {
        $enter() {
          this.hide();
          this.tag('NetworkConfigurationScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Network Configuration');
        }

        _getFocused() {
          return this.tag('NetworkConfigurationScreen');
        }

        $exit() {
          this.show();
          this.tag('NetworkConfigurationScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings');
        }

        _handleBack() {
          this._setState('NetworkConfiguration');
        }

      }, class BluetoothScreen extends this {
        $enter() {
          this.hide();
          this.tag('BluetoothScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Pair Remote Control');
        }

        _getFocused() {
          return this.tag('BluetoothScreen');
        }

        $exit() {
          this.show();
          this.tag('BluetoothScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings');
        }

        _handleBack() {
          this._setState('Bluetooth');
        }

      }, class VideoScreen extends this {
        $enter() {
          this.hide();
          this.tag('VideoScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Video');
        }

        _getFocused() {
          return this.tag('VideoScreen');
        }

        $exit() {
          this.show();
          this.tag('VideoScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings');
        }

        _handleBack() {
          this._setState('Video');
        }

      }, class AudioScreen extends this {
        $enter() {
          this.hide();
          this.tag('AudioScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Audio');
        }

        _getFocused() {
          return this.tag('AudioScreen');
        }

        $exit() {
          this.show();
          this.tag('AudioScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings');
        }

        _handleBack() {
          this._setState('Audio');
        }

      }, class OtherSettingsScreen extends this {
        $enter() {
          this.hide();
          this.tag('OtherSettingsScreen').visible = true;
          this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
        }

        _getFocused() {
          return this.tag('OtherSettingsScreen');
        }

        $exit() {
          this.show();
          this.tag('OtherSettingsScreen').visible = false;
          this.fireAncestors('$changeHomeText', 'Settings');
        }

        _handleBack() {
          this._setState('OtherSettings');
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

  var timeout$1;
  /**
   * Class to render the UI controls for the video player.
   */

  class PlayerControls extends lng$1.Component {
    /**
     * Function to create components for the player controls.
     */
    static _template() {
      return {
        rect: true,
        w: 1920,
        h: 410,
        color: 0x4025262a,
        Title: {
          x: 90,
          y: 15
        },
        Subtitle: {
          x: 90,
          y: 88.5
        },
        NetworkLogo: {
          x: 1740,
          y: 82.5
        },
        TimeBar: {
          x: 90,
          y: 163.5,
          texture: lng$1.Tools.getRoundRect(1740, 6, 6, 0, 0, true, 0x80eef1f3)
        },
        ProgressBar: {
          x: 90,
          y: 163.5
        },
        CurrentTime: {
          x: 90,
          y: 184.5
        },
        TotalTime: {
          x: 1680,
          y: 184.5
        },
        Buttons: {
          x: 820,
          y: 240,
          children: [{
            src: Utils.asset('images/player/rewind.png'),
            x: 17,
            y: 17
          }, {
            src: Utils.asset('images/player/pause-focus.png'),
            x: 17,
            y: 17
          }, {
            src: Utils.asset('images/player/fast-forward.png'),
            x: 17,
            y: 17
          }].map((item, idx) => ({
            x: idx * 100,
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            ControlIcon: {
              x: item.x,
              y: item.y,
              texture: lng$1.Tools.getSvgTexture(item.src, 50, 50)
            }
          }))
        },
        Audio: {
          x: 90,
          y: 240,
          texture: lng$1.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xff8e8e8e),
          AudioOptions: {
            x: 0,
            y: 25,
            w: 240,
            h: 90,
            text: {
              fontSize: 30,
              text: 'Audio Options',
              textColor: 0xffffffff,
              textAlign: 'center'
            }
          }
        },
        Extras: {
          x: 1700,
          y: 240,
          texture: lng$1.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xff8e8e8e),
          ExtrasOptions: {
            x: 0,
            y: 25,
            w: 130,
            h: 90,
            text: {
              fontSize: 30,
              text: 'Extras',
              textColor: 0xffffffff,
              textAlign: 'center'
            }
          }
        }
      };
    }

    _init() {
      /**
       * Variable to store the duration of the video content.
       */
      this.videoDuration = 0;
      this.tag('Buttons').children[0].patch({
        alpha: 0.4
      });
      this.tag('Buttons').children[2].patch({
        alpha: 0.4
      });
      this.tag('Audio').patch({
        alpha: 0.4
      });
      this.tag('Extras').patch({
        alpha: 0.4
      });
    }
    /**
     * Function to set focus to player controls when the player controls are shown.
     */


    _focus() {
      this._index = 1;
      this.toggle = false;

      this._setState('PlayPause');
    }
    /**
     * Function to handle the player controls when they are hidden.
     */


    _unfocus() {
      this._setState('Hidden');

      clearTimeout(timeout$1);
    }
    /**
     * Function to set the title in the video controls.
     * @param {String} title title to be displayed in video controls.
     */


    set title(title) {
      this.tag('Title').patch({
        text: {
          fontSize: 52.5,
          textAlign: 'center',
          text: title
        }
      });
    }
    /**
     * Function to set the subtitle in the video control menu.
     * @param {String} subtitle sub title to be displayed.
     */


    set subtitle(subtitle) {
      this.tag('Subtitle').patch({
        text: {
          fontSize: 36,
          textAlign: 'center',
          text: subtitle
        }
      });
    }
    /**
     * Function to set the network logo in the video control menu.
     * @param {String} logoPath path to the logo.
     */


    set logoPath(logoPath) {
      this.tag('NetworkLogo').patch({
        src: logoPath
      });
    }
    /**
     * Function to set the duration of the video.
     * @param {String} duration video duration to be set.
     */


    set duration(duration) {
      this.videoDuration = duration;
      this.tag('TotalTime').patch({
        text: {
          fontSize: 33,
          textAlign: 'center',
          text: this.SecondsTohhmmss(duration)
        }
      });
    }
    /**
     * Function to set the current video time.
     * @param {String} currentTime current time to be set.
     */


    set currentTime(currentTime) {
      this.tag('CurrentTime').patch({
        text: {
          fontSize: 33,
          textAlign: 'center',
          text: this.SecondsTohhmmss(currentTime)
        }
      });
      this.tag('ProgressBar').patch({
        texture: lng$1.Tools.getRoundRect(1740 * currentTime / this.videoDuration, 6, 6, 0, 0, true, 0xffffffff),
        SeekBar: {
          x: 1740 * currentTime / this.videoDuration,
          y: -12,
          texture: lng$1.Tools.getRoundRect(30, 30, 15, 0, 0, true, 0xffffffff)
        }
      });
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


    hidePlayerControls() {
      this.signal('hide');
    }
    /**
     * Function to reset the player controls.
     */


    reset(state = 'play') {
      this._setState('PlayPause');

      if (state === 'pause' || state === 'stop') {
        this.tag('Buttons').children[1].tag('ControlIcon').patch({
          texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/play-focus.png'), 50, 50),
          x: 17
        });
        this.toggle = 1;
        return;
      }

      this.tag('Buttons').children[1].tag('ControlIcon').patch({
        texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/pause-focus.png'), 50, 50),
        x: 17
      });
      this.toggle = 0;
    }
    /**
     * Timer function to track the inactivity of the player controls.
     */


    timer() {
      clearTimeout(timeout$1);
      timeout$1 = setTimeout(this.hidePlayerControls.bind(this), 5000);
    }
    /**
     * Function that defines the different states of the player controls.
     */


    static _states() {
      return [class AudioOptions extends this {
        $enter() {
          this.timer();
          this.tag('Audio').patch({
            texture: lng$1.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xffffffff),
            scale: 1.1
          });
          this.tag('Audio').tag('AudioOptions').color = 0xff000000;
        }

        $exit() {
          this.tag('Audio').patch({
            texture: lng$1.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xff8e8e8e),
            scale: 1
          });
          this.tag('Audio').tag('AudioOptions').color = 0xffffffff;
        }

        _handleRight() {
          this._setState('Rewind');
        }

        _getFocused() {
          this.timer();
        }

      }, class PlayPause extends this {
        $enter() {
          this.focus = this.toggle ? Utils.asset('images/player/play-focus.png') : Utils.asset('images/player/pause-focus.png');
          this.timer();
          this.tag('Buttons').children[1].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            scale: 1.1
          });
          this.tag('Buttons').children[1].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(this.focus, 50, 50)
          });
        }

        $exit() {
          this.unfocus = this.toggle ? Utils.asset('images/player/play.png') : Utils.asset('images/player/pause.png');
          this.tag('Buttons').children[1].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            scale: 1
          });
          this.tag('Buttons').children[1].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(this.unfocus, 50, 50)
          });
        }

        _handleEnter() {
          if (this.toggle) {
            this.signal('play');
          } else {
            this.signal('pause');
          }

          this.toggle = !this.toggle;
          this.focus = this.toggle ? Utils.asset('images/player/play-focus.png') : Utils.asset('images/player/pause-focus.png');
          this.timer();
          this.tag('Buttons').children[1].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff)
          });
          this.tag('Buttons').children[1].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(this.focus, 50, 50)
          });
        }

        _handleRight() {// this._setState('Forward')
        }

        _handleLeft() {// this._setState('Rewind')
        }

        _getFocused() {
          this.timer();
        }

      }, class Forward extends this {
        $enter() {
          this.timer();
          this.tag('Buttons').children[2].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            scale: 1.1
          });
          this.tag('Buttons').children[2].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/fast-forward-focus.png'), 50, 50)
          });
        }

        $exit() {
          this.tag('Buttons').children[2].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            scale: 1
          });
          this.tag('Buttons').children[2].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/fast-forward.png'), 50, 50)
          });
        }

        _handleRight() {
          this._setState('Extras');
        }

        _handleLeft() {
          this._setState('PlayPause');
        }

        _handleEnter() {
          this.signal('fastfwd');
        }

        _getFocused() {
          this.timer();
        }

      }, class Rewind extends this {
        $enter() {
          this.timer();
          this.tag('Buttons').children[0].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            scale: 1.1
          });
          this.tag('Buttons').children[0].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/rewind-focus.png'), 50, 50)
          });
        }

        $exit() {
          this.tag('Buttons').children[0].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            scale: 1
          });
          this.tag('Buttons').children[0].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/rewind.png'), 50, 50)
          });
        }

        _handleLeft() {
          this._setState('AudioOptions');
        }

        _handleRight() {
          this._setState('PlayPause');
        }

        _handleEnter() {
          this.signal('fastrwd');
        }

        _getFocused() {
          this.timer();
        }

      }, class Extras extends this {
        $enter() {
          this.tag('Extras').patch({
            texture: lng$1.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xffffffff),
            scale: 1.1
          });
          this.tag('Extras').tag('ExtrasOptions').color = 0xff000000;
          this.timer();
        }

        _handleLeft() {
          this._setState('Forward');
        }

        _getFocused() {
          this.timer();
        }

        $exit() {
          this.tag('Extras').patch({
            texture: lng$1.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xff8e8e8e),
            scale: 1
          });
          this.tag('Extras').tag('ExtrasOptions').color = 0xffffffff;
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

  class AAMPVideoPlayer extends lng$1.Component {
    /**
     * Function to render player controls.
     */
    static _template() {
      return {
        PlayerControls: {
          type: PlayerControls,
          x: 0,
          y: 810,
          alpha: 0,
          signals: {
            pause: 'pause',
            play: 'play',
            hide: 'hidePlayerControls',
            fastfwd: 'fastfwd',
            fastrwd: 'fastrwd'
          }
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
      this.tag('PlayerControls').setSmooth('alpha', 1);
      this.tag('PlayerControls').setSmooth('y', 675, {
        duration: 1
      });
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
        console.error('AAMPMediaPlayer is not defined');
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
      this.tag('PlayerControls').subtitle = videoInfo.subtitle;
      this.tag('PlayerControls').logoPath = videoInfo.logoPath;
      this.tag('PlayerControls').duration = this.player.getDurationSec();
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
      this.tag('PlayerControls').setSmooth('y', 1080, {
        duration: 0.7
      });
      this.tag('PlayerControls').setSmooth('alpha', 0, {
        duration: 0.7
      });

      this._setState('HideControls');
    }
    /**
     * Function to show the player controls.
     */


    showPlayerControls() {
      this.tag('PlayerControls').reset();
      this.tag('PlayerControls').setSmooth('alpha', 1);
      this.tag('PlayerControls').setSmooth('y', 675, {
        duration: 0.7
      });

      this._setState('ShowControls');

      this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5000);
    }
    /**
     * Function to display player controls on down key press.
     */


    _handleDown() {
      this.tag('PlayerControls').setSmooth('alpha', 1, {
        duration: 1
      });
      this.tag('PlayerControls').setSmooth('y', 675, {
        duration: 1
      });

      this._setState('ShowControls');

      clearTimeout(this.timeout);
    }
    /**
     *Function to hide player control on up key press.
     */


    _handleUp() {
      this.hidePlayerControls();

      this._setState('HideControls');
    }

    _handleBack() {
      this.fireAncestors('$stopPlayer');
    }
    /**
     * Function to define the different states of the video player.
     */


    static _states() {
      return [class ShowControls extends this {
        _getFocused() {
          return this.tag('PlayerControls');
        }

      }, class HideControls extends this {// _handleBack(){
        //   console.log('go back from hidecontrol')
        // }
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
   * Class to render items in main view.
   */

  class UsbListItem extends lng$1.Component {
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
        h: this.h + 24,
        w: this.w,
        x: this.x,
        y: this.y - 12
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
        scale: this.focus,
        alpha: 1
      });
    }
    /**
     * Function to change properties of item during unfocus.
     */


    _unfocus() {
      this.tag('Image').patch({
        w: this.w,
        h: this.h,
        scale: this.unfocus
      });
      this.tag('Item').patch({
        zIndex: 0
      });
      this.tag('Info').alpha = 0;
      this.tag('Shadow').patch({
        alpha: 0
      });
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

  class LightningPlayerControls extends lng$1.Component {
    /**
     * Function to create components for the player controls.
     */
    static _template() {
      return {
        rect: true,
        w: 1920,
        h: 410,
        color: 0x4025262a,
        Title: {
          x: 90,
          y: 15
        },
        Subtitle: {
          x: 90,
          y: 88.5
        },
        NetworkLogo: {
          x: 1740,
          y: 82.5
        },
        TimeBar: {
          x: 90,
          y: 163.5,
          texture: lng$1.Tools.getRoundRect(1740, 6, 6, 0, 0, true, 0x80eef1f3)
        },
        ProgressBar: {
          x: 90,
          y: 163.5
        },
        CurrentTime: {
          x: 90,
          y: 184.5
        },
        TotalTime: {
          x: 1680,
          y: 184.5
        },
        Buttons: {
          x: 820,
          y: 240,
          children: [{
            src: Utils.asset('images/player/rewind.png'),
            x: 17,
            y: 17
          }, {
            src: Utils.asset('images/player/pause-focus.png'),
            x: 17,
            y: 17
          }, {
            src: Utils.asset('images/player/fast-forward.png'),
            x: 17,
            y: 17
          }].map((item, idx) => ({
            x: idx * 100,
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            ControlIcon: {
              x: item.x,
              y: item.y,
              texture: lng$1.Tools.getSvgTexture(item.src, 50, 50)
            }
          }))
        },
        Audio: {
          x: 90,
          y: 240,
          texture: lng$1.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xff8e8e8e),
          AudioOptions: {
            x: 0,
            y: 25,
            w: 240,
            h: 90,
            text: {
              fontSize: 30,
              text: 'Audio Options',
              textColor: 0xffffffff,
              textAlign: 'center'
            }
          }
        },
        Extras: {
          x: 1700,
          y: 240,
          texture: lng$1.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xff8e8e8e),
          ExtrasOptions: {
            x: 0,
            y: 25,
            w: 130,
            h: 90,
            text: {
              fontSize: 30,
              text: 'Extras',
              textColor: 0xffffffff,
              textAlign: 'center'
            }
          }
        }
      };
    }

    _init() {
      /**
       * Variable to store the duration of the video content.
       */
      this.videoDuration = 0;
      this.tag('Buttons').children[0].patch({
        alpha: 0.4
      });
      this.tag('Buttons').children[2].patch({
        alpha: 0.4
      });
      this.tag('Audio').patch({
        alpha: 0.4
      });
      this.tag('Extras').patch({
        alpha: 0.4
      });
    }
    /**
     * Function to set focus to player controls when the player controls are shown.
     */


    _focus() {
      this._index = 1;
      this.toggle = false;

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
     * Function to set the title in the video controls.
     * @param {String} title title to be displayed in video controls.
     */


    set title(title) {
      this.tag('Title').patch({
        text: {
          fontSize: 52.5,
          textAlign: 'center',
          text: title
        }
      });
    }
    /**
     * Function to set the subtitle in the video control menu.
     * @param {String} subtitle sub title to be displayed.
     */


    set subtitle(subtitle) {
      this.tag('Subtitle').patch({
        text: {
          fontSize: 36,
          textAlign: 'center',
          text: subtitle
        }
      });
    }
    /**
     * Function to set the network logo in the video control menu.
     * @param {String} logoPath path to the logo.
     */


    set logoPath(logoPath) {
      this.tag('NetworkLogo').patch({
        src: logoPath
      });
    }
    /**
     * Function to set the duration of the video.
     * @param {String} duration video duration to be set.
     */


    set duration(duration) {
      console.log(`duration was set = ${duration}`);
      this.videoDuration = duration;
      this.tag('TotalTime').patch({
        text: {
          fontSize: 33,
          textAlign: 'center',
          text: this.SecondsTohhmmss(duration)
        }
      });
    }
    /**
     * Function to set the current video time.
     * @param {String} currentTime current time to be set.
     */


    set currentTime(currentTime) {
      // console.log(`current time was set to ${currentTime}`);
      this.tag('CurrentTime').patch({
        text: {
          fontSize: 33,
          textAlign: 'center',
          text: this.SecondsTohhmmss(currentTime)
        }
      });
      this.tag('ProgressBar').patch({
        texture: lng$1.Tools.getRoundRect(1740 * currentTime / this.videoDuration, 6, 6, 0, 0, true, 0xffffffff),
        SeekBar: {
          x: 1740 * currentTime / this.videoDuration,
          y: -12,
          texture: lng$1.Tools.getRoundRect(30, 30, 15, 0, 0, true, 0xffffffff)
        }
      });
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
    /**
     * Function to reset the player controls.
     */


    reset(state = 'play') {
      this._setState('PlayPause');

      if (state === 'pause' || state === 'stop') {
        this.tag('Buttons').children[1].tag('ControlIcon').patch({
          texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/play-focus.png'), 50, 50),
          x: 17
        });
        this.toggle = 1;
        return;
      }

      this.tag('Buttons').children[1].tag('ControlIcon').patch({
        texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/pause-focus.png'), 50, 50),
        x: 17
      });
      this.toggle = 0;
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
      return [class AudioOptions extends this {
        $enter() {
          this.timer();
          this.tag('Audio').patch({
            texture: lng$1.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xffffffff),
            scale: 1.1
          });
          this.tag('Audio').tag('AudioOptions').color = 0xff000000;
        }

        $exit() {
          this.tag('Audio').patch({
            texture: lng$1.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xff8e8e8e),
            scale: 1
          });
          this.tag('Audio').tag('AudioOptions').color = 0xffffffff;
        }

        _handleRight() {
          this._setState('Rewind');
        }

        _getFocused() {
          this.timer();
        }

      }, class PlayPause extends this {
        $enter() {
          this.focus = this.toggle ? Utils.asset('images/player/play-focus.png') : Utils.asset('images/player/pause-focus.png');
          this.timer();
          this.tag('Buttons').children[1].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            scale: 1.1
          });
          this.tag('Buttons').children[1].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(this.focus, 50, 50)
          });
        }

        $exit() {
          this.unfocus = this.toggle ? Utils.asset('images/player/play.png') : Utils.asset('images/player/pause.png');
          this.tag('Buttons').children[1].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            scale: 1
          });
          this.tag('Buttons').children[1].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(this.unfocus, 50, 50)
          });
        }

        _handleEnter() {
          if (this.toggle) {
            this.fireAncestors('$play');
          } else {
            this.fireAncestors('$pause');
          }

          this.toggle = !this.toggle;
          this.focus = this.toggle ? Utils.asset('images/player/play-focus.png') : Utils.asset('images/player/pause-focus.png');
          this.timer();
          this.tag('Buttons').children[1].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff)
          });
          this.tag('Buttons').children[1].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(this.focus, 50, 50)
          });
        }

        _handleRight() {
          this._setState('Forward');
        }

        _handleLeft() {
          this._setState('Rewind');
        }

        _getFocused() {
          this.timer();
        }

      }, class Forward extends this {
        $enter() {
          this.timer();
          this.tag('Buttons').children[2].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            scale: 1.1
          });
          this.tag('Buttons').children[2].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/fast-forward-focus.png'), 50, 50)
          });
        }

        $exit() {
          this.tag('Buttons').children[2].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            scale: 1
          });
          this.tag('Buttons').children[2].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/fast-forward.png'), 50, 50)
          });
        }

        _handleRight() {
          this._setState('Extras');
        }

        _handleLeft() {
          this._setState('PlayPause');
        }

        _handleEnter() {
          this.fireAncestors('$next'); // this.signal('$fastfwd')
        }

        _getFocused() {
          this.timer();
        }

      }, class Rewind extends this {
        $enter() {
          this.timer();
          this.tag('Buttons').children[0].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            scale: 1.1
          });
          this.tag('Buttons').children[0].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/rewind-focus.png'), 50, 50)
          });
        }

        $exit() {
          this.tag('Buttons').children[0].patch({
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            scale: 1
          });
          this.tag('Buttons').children[0].tag('ControlIcon').patch({
            texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/rewind.png'), 50, 50)
          });
        }

        _handleLeft() {
          this._setState('AudioOptions');
        }

        _handleRight() {
          this._setState('PlayPause');
        }

        _handleEnter() {
          this.fireAncestors('$previous'); //this.signal('fastrwd')
        }

        _getFocused() {
          this.timer();
        }

      }, class Extras extends this {
        $enter() {
          this.tag('Extras').patch({
            texture: lng$1.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xffffffff),
            scale: 1.1
          });
          this.tag('Extras').tag('ExtrasOptions').color = 0xff000000;
          this.timer();
        }

        _handleLeft() {
          this._setState('Forward');
        }

        _getFocused() {
          this.timer();
        }

        $exit() {
          this.tag('Extras').patch({
            texture: lng$1.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xff8e8e8e),
            scale: 1
          });
          this.tag('Extras').tag('ExtrasOptions').color = 0xffffffff;
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
  let videoAudioUrl = "";
  let videoAudioTitle = "";
  let isAudio = false;
  var usbApi = new UsbApi();
  class UsbAppsScreen extends lng$1.Component {
    static _template() {
      return {
        UsbAppsScreenContents: {
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
                fontStyle: 'normal',
                textColor: 0xFFFFFFFF
              },
              zIndex: 0
            },
            Row1: {
              y: 30,
              x: -20,
              flex: {
                direction: 'row',
                paddingLeft: 20,
                wrap: false
              },
              type: lng$1.components.ListComponent,
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
              // x: 10 + 25,
              y: 243,
              h: 30,
              text: {
                fontFace: CONFIG.language.font,
                fontSize: 25,
                text: "Audio",
                fontStyle: 'normal',
                textColor: 0xFFFFFFFF
              },
              zIndex: 0
            },
            Row2: {
              y: 273,
              x: -20,
              flex: {
                direction: 'row',
                paddingLeft: 20,
                wrap: false
              },
              type: lng$1.components.ListComponent,
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
              // x: 10 + 25,
              y: 486,
              h: 30,
              text: {
                fontFace: CONFIG.language.font,
                fontSize: 25,
                text: "Photos",
                fontStyle: 'normal',
                textColor: 0xFFFFFFFF
              },
              zIndex: 0
            },
            Row3: {
              y: 516,
              x: -20,
              flex: {
                direction: 'row',
                paddingLeft: 20,
                wrap: false
              },
              type: lng$1.components.ListComponent,
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
              // x: 10 + 25,
              y: 729,
              h: 30,
              text: {
                fontFace: CONFIG.language.font,
                fontSize: 25,
                text: "Folders",
                fontStyle: 'normal',
                textColor: 0xFFFFFFFF
              },
              zIndex: 0
            },
            Row4: {
              y: 759,
              x: -20,
              flex: {
                direction: 'row',
                paddingLeft: 20,
                wrap: false
              },
              type: lng$1.components.ListComponent,
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
                type: lng$1.textures.ImageTexture,
                src: 'static/images/usb/USB_Featured_Item.jpg',
                resizeMode: {
                  type: 'contain',
                  w: 640,
                  h: 360
                }
              }
            },
            NoUSBTitle: {
              x: 800,
              y: 500,
              mount: 0.5,
              text: {
                fontFace: CONFIG.language.font,
                text: 'USB Not Mounted / No Data available',
                fontSize: 35
              }
            }
          }
        },
        ImageViewer: {
          h: 1080,
          w: 1920,
          x: -200,
          y: -275,
          // mount:0.5,
          rect: true,
          color: 0xff000000,
          zIndex: 2,
          visible: false,
          Image: {
            x: 960,
            y: 540,
            mount: 0.5,
            texture: {
              type: lng$1.textures.ImageTexture,
              src: 'static/images/usb/USB_Photo_Placeholder.jpg',
              resizeMode: {
                type: 'contain',
                w: 1920,
                h: 1080
              }
            }
          }
        },
        AudioInfo: {
          zIndex: 2,
          visible: false,
          h: 1080,
          w: 1920,
          x: -200,
          y: -286,
          Image: {
            scale: 0.5,
            x: 960,
            y: 560,
            mount: 0.5,
            src: 'static/images/usb/USB_Audio_Placeholder.jpg'
          },
          Title: {
            x: 960,
            y: 900,
            mount: 0.5,
            text: {
              fontFace: CONFIG.language.font,
              text: 'file_name.mp3',
              fontSize: 35
            }
          }
        },
        PlayerControls: {
          type: LightningPlayerControls,
          x: -200,
          y: -286,
          y: 810,
          alpha: 0,
          signals: {
            pause: 'pause',
            play: 'play',
            hide: 'hidePlayerControls',
            fastfwd: 'fastfwd',
            fastrwd: 'fastrwd'
          },
          zIndex: 4
        }
      };
    }

    _handleBack() {
      console.log(`handle back is called`);

      if (!(this.cwd.length === 0)) {
        let clone = [...this.cwd];
        clone.pop();
        let cwdname = clone.join("/");
        usbApi.cd(cwdname).then(res => {
          this.cwd.pop();
          this.loadData();
        }).catch(err => {
          console.error(`error while getting the usb contents; error = ${JSON.stringify(err)}`);
        });
      } else {
        this.fireAncestors('$setStateMainView');
      }
    }

    reset() {
      for (let i = this.tag('Row1').index; i > 0; i--) {
        this.tag('Row1').setPrevious();
      }

      for (let i = this.tag('Row2').index; i > 0; i--) {
        this.tag('Row2').setPrevious();
      }

      for (let i = this.tag("Row3").index; i > 0; i--) {
        this.tag('Row3').setPrevious();
      }

      for (let i = this.tag("Row3").index; i > 0; i--) {
        this.tag('Row4').setPrevious();
      }
    }

    _firstActive() {
      VideoPlayer.consumer(this);
    }

    hide() {
      this.tag('UsbAppsScreenContents').visible = false;
      this.fireAncestors('$hideAllforVideo');
    }

    show() {
      this.tag('UsbAppsScreenContents').visible = true;
      this.fireAncestors('$showAllforVideo');
    }

    exitFunctionality() {
      VideoPlayer.close();
      this.tag('ImageViewer').visible = false;
      this.tag('ImageViewer.Image').texture.src = 'static/images/usb/USB_Photo_Placeholder.jpg';
      this.hidePlayerControls();
      VideoPlayer.close();
      this.show();
      videoAudioUrl = "";
      videoAudioTitle = "";
      this.tag('AudioInfo').visible = false;
      this.tag('AudioInfo.Title').text.text = 'file_name.mp3';
      this.tag('UsbAppsScreenContents').visible = true;
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
          this.tag('Text1').text.fontStyle = 'bold';

          if (this.tag('Row1').length) {
            return this.tag('Row1').element;
          }
        }

        _handleDown() {
          // this._setState('Audio')
          this.traversePlus();
        }

        _handleUp() {
          this.traverseMinus();
        }

        _handleRight() {
          if (this.tag('Row1').length - 1 != this.tag('Row1').index) {
            this.tag('Row1').setNext();
            return this.tag('Row1').element;
          }
        }

        _handleEnter() {
          isAudio = false;
          videoAudioUrl = this.tag('Row1').element.data.uri;
          videoAudioTitle = this.tag('Row1').element.data.displayName;

          this._setState('Playing');
        }

        _handleLeft() {
          this.tag('Text1').text.fontStyle = 'normal';

          if (0 != this.tag('Row1').index) {
            this.tag('Row1').setPrevious();
            return this.tag('Row1').element;
          } else {
            this.reset();
          }
        }

      }, class Audio extends this {
        $enter() {
          this.scroll(0);
        }

        _getFocused() {
          this.tag('Text2').text.fontStyle = 'bold';

          if (this.tag('Row2').length) {
            return this.tag('Row2').element;
          }
        }

        _handleDown() {
          this.traversePlus();
        }

        _handleUp() {
          this.traverseMinus();
        }

        _handleEnter() {
          isAudio = true;
          this.tag('AudioInfo.Title').text.text = this.tag('Row2').element.data.displayName;
          videoAudioUrl = this.tag('Row2').element.data.uri;
          videoAudioTitle = this.tag('Row2').element.data.displayName;

          this._setState('Playing');
        }

        _handleRight() {
          if (this.tag('Row2').length - 1 != this.tag('Row2').index) {
            this.tag('Row2').setNext();
            return this.tag('Row2').element;
          }
        }

        _handleLeft() {
          this.tag('Text2').text.fontStyle = 'normal';

          if (0 != this.tag('Row2').index) {
            this.tag('Row2').setPrevious();
            return this.tag('Row2').element;
          } else {
            this.reset();
          }
        }

      }, class Picture extends this {
        $enter() {
          this.scroll(0);
        }

        _getFocused() {
          this.tag('Text3').text.fontStyle = 'bold';

          if (this.tag('Row3').length) {
            return this.tag('Row3').element;
          }
        }

        _handleDown() {
          this.traversePlus();
        }

        _handleUp() {
          this.traverseMinus();
        }

        _handleEnter() {
          this.tag('ImageViewer.Image').texture.src = this.tag('Row3').element.data.uri;

          this._setState('ImageViewer');
        }

        _handleRight() {
          if (this.tag('Row3').length - 1 != this.tag('Row3').index) {
            this.tag('Row3').setNext();
            return this.tag('Row3').element;
          }
        }

        _handleLeft() {
          this.tag('Text3').text.fontStyle = 'normal';

          if (0 != this.tag('Row3').index) {
            this.tag('Row3').setPrevious();
            return this.tag('Row3').element;
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
          this.tag('Text4').text.fontStyle = 'bold';

          if (this.tag('Row4').length) {
            return this.tag('Row4').element;
          }
        }

        _handleDown() {
          this.traversePlus();
        }

        _handleUp() {
          this.traverseMinus();
        }

        _handleEnter() {
          //do something after folder click.
          let dname = this.cwd.join("/") + "/" + this.tag('Row4').element.data.displayName;
          usbApi.cd(dname).then(res => {
            this.cwd.push(this.tag('Row4').element.data.displayName);
            console.log(`loading the data from the directory ${this.cwd}

            and its data = music:${JSON.stringify(musicListInfo)}

            Pictures : ${JSON.stringify(imageListInfo)}

            videos : ${JSON.stringify(videoListInfo)}

            folders : ${JSON.stringify(UsbInnerFolderListInfo)}

            `);
            this.loadData();
          }).catch(err => {
            console.error(`error while getting the usb contents; error = ${JSON.stringify(err)}`);
          });
        }

        _handleRight() {
          if (this.tag('Row4').length - 1 != this.tag('Row4').index) {
            this.tag('Row4').setNext();
            return this.tag('Row4').element;
          }
        }

        _handleLeft() {
          this.tag('Text4').text.fontStyle = 'normal';

          if (0 != this.tag('Row4').index) {
            this.tag('Row4').setPrevious();
            return this.tag('Row4').element;
          } else {
            this.reset();
          }
        }

      }, class ImageViewer extends this {
        $enter() {
          this.tag('ImageViewer').visible = true;
        }

        $exit() {
          this.tag('ImageViewer').visible = false;
          this.tag('ImageViewer.Image').texture.src = 'static/images/usb/USB_Photo_Placeholder.jpg';
        }

        _handleBack() {
          this._setState(this.traversableRows[this.index]);
        }

        _handleRight() {
          if (this.tag('Row3').length - 1 != this.tag('Row3').index) {
            this.tag('Row3').setNext();
            this.tag('ImageViewer.Image').texture.src = this.tag('Row3').element.data.uri;
            return this.tag('Row3').element;
          }
        }

        _handleLeft() {
          this.tag('Text3').text.fontStyle = 'normal';

          if (0 != this.tag('Row3').index) {
            this.tag('Row3').setPrevious();
            this.tag('ImageViewer.Image').texture.src = this.tag('Row3').element.data.uri;
            return this.tag('Row3').element;
          } else {
            this.reset();
          }
        }

      }, class Playing extends this {
        $videoPlayerLoadedData(LoadedData) {
          this.player = this.tag('PlayerControls');
          this.player.duration = VideoPlayer.duration;
          this.player.currentTime = VideoPlayer.currentTime;
        }

        $videoPlayerProgress(progress) {
          this.player.currentTime = VideoPlayer.currentTime;
        }

        start() {
          VideoPlayer.size(1920, 1080);
          VideoPlayer.loop(true);
          VideoPlayer.open(videoAudioUrl);

          this._mediaPlaybackStarted();

          this.initializePlayer();
        }

        $enter() {
          this.player = null;
          this.hide();

          if (isAudio) {
            this.tag('AudioInfo').visible = true;
            this.tag('AudioInfo.Title').text.text = videoAudioTitle;
          }

          this.start();
        }

        initializePlayer() {
          this.player = this.tag('PlayerControls');
          this.player.title = videoAudioTitle;
          this.player.subtitle = "None"; //player.logoPath = ""
          //this.tag('PlayerControls').duration = VideoPlayer.getDurationSec()
          // player.currentTime = 1
        }

        $pause() {
          VideoPlayer.pause();
        }

        $play() {
          VideoPlayer.play();
        }

        $next() {
          if (isAudio) {
            if (this.tag('Row2').length - 1 != this.tag('Row2').index) {
              this.tag('Row2').setNext();
              videoAudioUrl = this.tag('Row2').element.data.uri;
              videoAudioTitle = this.tag('Row2').element.data.displayName;
              this.tag('AudioInfo.Title').text.text = videoAudioTitle;
              VideoPlayer.close();
              this.start();
              return this.tag('Row2').element;
            }
          } else {
            if (this.tag('Row1').length - 1 != this.tag('Row1').index) {
              this.tag('Row1').setNext();
              videoAudioUrl = this.tag('Row1').element.data.uri;
              videoAudioTitle = this.tag('Row1').element.data.displayName;
              this.tag('AudioInfo.Title').text.text = videoAudioTitle;
              VideoPlayer.close();
              this.start();
              return this.tag('Row1').element;
            }
          }
        }

        $previous() {
          if (isAudio) {
            if (0 != this.tag('Row2').index) {
              this.tag('Row2').setPrevious();
              videoAudioUrl = this.tag('Row2').element.data.uri;
              videoAudioTitle = this.tag('Row2').element.data.displayName;
              this.tag('AudioInfo.Title').text.text = videoAudioTitle;
              VideoPlayer.close();
              this.start();
              return this.tag('Row2').element;
            } else {
              this.reset();
            }
          } else {
            if (0 != this.tag('Row1').index) {
              this.tag('Row1').setPrevious();
              videoAudioUrl = this.tag('Row1').element.data.uri;
              videoAudioTitle = this.tag('Row1').element.data.displayName;
              this.tag('AudioInfo.Title').text.text = videoAudioTitle;
              VideoPlayer.close();
              this.start();
              return this.tag('Row1').element;
            } else {
              this.reset();
            }
          }
        }

        $exit() {
          this.hidePlayerControls();
          VideoPlayer.close();
          this.show();
          videoAudioUrl = "";
          this.tag('AudioInfo').visible = false;
          this.tag('AudioInfo.Title').text.text = 'file_name.mp3';
        }

        _handleBack() {
          this._setState(this.traversableRows[this.index]);
        }

        hidePlayerControls() {
          this.tag('PlayerControls').setSmooth('y', 1080, {
            duration: 0.7
          });
          this.tag('PlayerControls').setSmooth('alpha', 0, {
            duration: 0.7
          });
        }

        showPlayerControls() {
          this.tag('PlayerControls').reset();
          this.tag('PlayerControls').setSmooth('alpha', 1);
          this.tag('PlayerControls').setSmooth('y', 389, {
            duration: 0.7
          });

          this._setState('Playing.ShowControls');

          this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5000);
        }

        _handleDown() {
          this.tag('PlayerControls').setSmooth('alpha', 1, {
            duration: 1
          });
          this.tag('PlayerControls').setSmooth('y', 389, {
            duration: 1
          });

          this._setState('Playing.ShowControls');

          clearTimeout(this.timeout);
        }

        _handleUp() {
          this.hidePlayerControls();
        }

        _mediaPlaybackStarted() {
          this.tag('PlayerControls').reset();
          this.tag('PlayerControls').setSmooth('alpha', 1);
          this.tag('PlayerControls').setSmooth('y', 389, {
            duration: 1
          });
          this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5000);
        }

        static _states() {
          return [class ShowControls extends this {
            _getFocused() {
              return this.tag('PlayerControls');
            }

          }, class HideControls extends this {}];
        }

      }];
    }

    set Row1Items(items) {
      this.tag('Row1').items = items.map((info, idx) => {
        return {
          w: 257,
          h: 145,
          type: UsbListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          idx: idx
        };
      });
      this.tag('Row1').start();
    }

    set Row2Items(items) {
      this.tag('Row2').items = items.map((info, idx) => {
        return {
          w: 151,
          h: 151,
          type: UsbListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          idx: idx
        };
      });
      this.tag('Row2').start();
    }

    set Row3Items(items) {
      this.tag('Row3').items = items.map((info, idx) => {
        return {
          w: 145,
          h: 145,
          type: UsbListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          idx: idx
        };
      });
      this.tag('Row3').start();
    }

    set Row4Items(items) {
      this.tag('Row4').items = items.map((info, idx) => {
        return {
          w: 145,
          h: 145,
          type: UsbListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          idx: idx
        };
      });
      this.tag('Row4').start();
    }

    scroll(y) {
      this.tag('Wrapper').setSmooth('y', y, {
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
      let row1 = this.tag('Row1');
      let text2 = this.tag("Text2");
      let row2 = this.tag('Row2');
      let text3 = this.tag("Text3");
      let row3 = this.tag('Row3');
      let text4 = this.tag('Text4');
      let row4 = this.tag('Row4');

      if (videoListInfo.length === 0 && musicListInfo.length === 0 && imageListInfo.length === 0 && UsbInnerFolderListInfo.length === 0) {
        this.tag('NoUSB').visible = true;
        text1.visible = false;
        row1.visible = false;
        text2.visible = false;
        row2.visible = false;
        text3.visible = false;
        row3.visible = false;
        text4.visible = false;
        row4.visible = false; //either the usb is not mounted or there aren't any videos , images or audio files. 
      } else {
        this.tag('NoUSB').visible = false;

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
      this.index = 0;
      this.traversableRows = [];
      this.cwd = [];
      usbApi.retrieUsb().then(res => {
        this.loadData();
      }).catch(err => {
        console.error(`error while getting the usb contents; error = ${JSON.stringify(err)}`);
      });

      this._setState(this.traversableRows[this.index]);
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
  var powerState = 'ON';
  var appApi$1 = new AppApi();
  var ls = {
    last_state: 'SidePanel',
    ref: {}
  };
  const config$1 = {
    host: '127.0.0.1',
    port: 9998,
    default: 1
  };
  const thunder$1 = thunderJS(config$1);
  /** Class for home screen UI */

  class HomeScreen extends lng$1.Component {
    /** * Function to render various elements in home screen. * @param {{ path: string; }} args */
    set params(args) {
      if (args.path === 'settings') {
        this.tag('Settings').setState = args.path;

        this._setState('Settings');
      }
    }
    /**
     * Function to render various elements in home screen.
     */


    static _template() {
      return {
        BackgroundImage: {
          w: 1920,
          h: 1080,
          alpha: 0
        },
        BackgroundColor: {
          w: 1920,
          h: 1080,
          alpha: 1,
          rect: true,
          color: CONFIG.theme.background
        },
        TopPanel: {
          type: TopPanel
        },
        View: {
          x: 0,
          y: 275,
          w: 1994,
          h: 919,
          clipping: true,
          SidePanel: {
            w: 500,
            h: 1000,
            x: 105,
            type: SidePanel
          },
          MainView: {
            w: 1994,
            h: 919,
            type: MainView
          }
        },
        Settings: {
          alpha: 0,
          w: 1920,
          h: 1080,
          type: SettingsScreen
        },
        UsbAppsScreen: {
          x: 200,
          y: 275,
          type: UsbAppsScreen,
          visible: false
        },
        IpAddress: {
          x: 185,
          y: 1058,
          mount: 1,
          text: {
            fontFace: CONFIG.language.font,
            text: 'IP:NA',
            textColor: 0xffffffff,
            fontSize: 20
          }
        },
        Player: {
          type: AAMPVideoPlayer
        }
      };
    }

    _init() {
      ls.ref = this;
      this.homeApi = new HomeApi();
      this.timerIsOff = true;
      var appItems = this.homeApi.getAppListInfo();
      var data = this.homeApi.getPartnerAppsInfo();
      var prop_apps = 'applications';
      var prop_displayname = 'displayName';
      var prop_uri = 'uri';
      var prop_apptype = 'applicationType';
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
        console.log('Query data is not proper: ' + e);
      } //to dynamically hide or show usb tile


      this.firstRowItems = appdetails_format;
      this.tempRow = JSON.parse(JSON.stringify(this.firstRowItems));

      if (this.firstRowItems[0].uri === 'USB') {
        this.tempRow.shift();
      }

      this.USBApi = new UsbApi();
      this.tag('MainView').appItems = this.tempRow;
      this.$initializeUSB(); //--------------------

      this.tag('MainView').metroApps = this.homeApi.getMetroInfo();
      this.tag('MainView').usbApps = usbAppsArr;
      this.tag('MainView').tvShowItems = this.homeApi.getTVShowsInfo();
      this.tag('MainView').settingsItems = this.homeApi.getSettingsInfo();
      this.tag('MainView').rightArrowIcons = this.homeApi.getRightArrowInfo();
      this.tag('MainView').leftArrowIcons = this.homeApi.getLeftArrowInfo();
      this.tag('SidePanel').sidePanelItems = this.homeApi.getSidePanelInfo();

      if (usbAppsArr.length <= 0) {
        this.tag("View.SidePanel").scrollableLastRow = false;
      } else {
        this.tag("View.SidePanel").scrollableLastRow = true;
      }

      this._setState('SidePanel');

      this.initialLoad = true;
      this.networkApi = new Network();
      this.networkApi.activate().then(result => {
        if (result) {
          this.networkApi.registerEvent('onIPAddressStatusChanged', notification => {
            if (notification.status == 'ACQUIRED') {
              this.tag('IpAddress').text.text = 'IP:' + notification.ip4Address; //location.reload(true)

              Storage.set('ipAddress', notification.ip4Address);
            } else if (notification.status == 'LOST') {
              this.tag('IpAddress').text.text = 'IP:NA';
              Storage.set('ipAddress', null);
            }
          });
          this.networkApi.getIP().then(ip => {
            this.tag('IpAddress').text.text = 'IP:' + ip;
          });
        }
      });
    }

    $initializeUSB() {
      if (Storage.get('UsbMedia') === 'ON') {
        this.USBApi.getMountedDevices().then(result => {
          if (result.mounted.length === 1) {
            this.tag('MainView').appItems = this.firstRowItems;
          } else {
            this.tag('MainView').appItems = this.tempRow;
          }
        });
      } else if (Storage.get('UsbMedia') === 'OFF') {
        this.tag('MainView').appItems = this.tempRow;
      }
    }

    $registerUsbEvent() {
      console.log('$registerUsbEvent got called');
      thunder$1.on('org.rdk.UsbAccess', 'onUSBMountChanged', notification => {
        console.log('onUsbMountChanged notification: ', notification);

        if (Storage.get('UsbMedia') === 'ON') {
          if (!notification.mounted) {
            //if mounted is false
            this.tag('MainView').appItems = this.tempRow;

            if (this.state === 'UsbAppsScreen') {
              this.$changeHomeText('Home');
              this.tag('UsbAppsScreen').visible = false;
              this.show();
              this.tag('UsbAppsScreen').exitFunctionality();
              this.tag('MainView').patch({
                alpha: 1
              });

              this._setState('MainView');
            }
          } else if (notification.mounted) {
            //if mounted is true
            this.tag('MainView').appItems = this.firstRowItems;
          }
        }
      });
    }

    $resetSleepTimer(t) {
      var arr = t.split(" ");

      function setTimer() {
        var temp = arr[1].substring(0, 1);

        if (temp === 'H') {
          appApi$1.setInactivityInterval(parseInt(arr[0]) * 60).then(res => {}).catch(err => {
            console.error(`error while setting the timer`);
          });
        } else if (temp === 'M') {
          appApi$1.setInactivityInterval(parseInt(arr[0])).then(res => {}).catch(err => {
            console.error(`error while setting the timer`);
          });
        }
      }

      if (arr.length < 2) {
        if (!this.timerIsOff) {
          appApi$1.enabledisableinactivityReporting(false).then(res => {
            if (res.success === true) {
              this.timerIsOff = true;
            }
          }).catch(err => {
            console.error(`error : unable to set the reset; error = ${err}`);
          });
        }
      } else {
        if (this.timerIsOff) {
          appApi$1.enabledisableinactivityReporting(true).then(res => {
            if (res.success === true) {
              this.timerIsOff = false;
              setTimer();
            }
          });
        } else {
          setTimer();
        }
      }
    }

    _captureKeyRelease(key) {
      if (key.keyCode == keyMap.F9) {
        store.dispatch({
          type: 'ACTION_LISTEN_STOP'
        }); //app launch code need add here.

        return true;
      }
    }

    deactivateChildApp(plugin) {
      var appApi = new AppApi();

      switch (plugin) {
        case 'WebApp':
          appApi.deactivateWeb();
          break;

        case 'Cobalt':
          appApi.deactivateCobalt();
          break;

        case 'Lightning':
          appApi.deactivateLightning();
          break;

        case 'Native':
          appApi.killNative();
          break;

        case 'Amazon':
          appApi.deactivateNativeApp('Amazon');

        case 'Netflix':
          appApi.deactivateNativeApp('Netflix');
      }
    }

    _captureKey(key) {
      if (key.keyCode == keyMap.Escape || key.keyCode == keyMap.Home || key.keyCode === keyMap.m) {
        if (Storage.get('applicationType') != '') {
          this.deactivateChildApp(Storage.get('applicationType'));
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
            console.log('ResidentApp moveToFront Success');
          }).catch(err => {
            console.log('Error', err);
          });
        } else {
          if (this.state === 'Playing') {
            this.$stopPlayer();
          } else if (this.state === 'UsbAppsScreen') {
            this.tag('UsbAppsScreen').visible = false;
            this.tag('MainView').patch({
              alpha: 1
            });

            this._setState('MainView');

            this.$changeHomeText('Home');
          } else {
            this.$goToSidePanel(0);
            this.$changeHomeText('Home');
          }
        }
      }

      if (key.keyCode == keyMap.F9) {
        store.dispatch({
          type: 'ACTION_LISTEN_START'
        });
        return true;
      }

      if (key.keyCode == keyMap.Power) {
        // Remote power key and keyboard F1 key used for STANDBY and POWER_ON
        if (powerState == 'ON') {
          ls.last_state = this.state;
          this.$standby('STANDBY');
          return true;
        } else if (powerState == 'STANDBY') {
          appApi$1.standby("ON").then(res => {
            powerState = 'ON';
          });
          return true;
        }
      } else if (key.keyCode == 228) {
        console.log("___________DEEP_SLEEP_______________________F12");
        appApi$1.standby("DEEP_SLEEP").then(res => {
          powerState = 'DEEP_SLEEP';
        });
        return true;
      } else if (key.keyCode == keyMap.AudioVolumeMute) {
        appApi$1.setVisibility("foreground", true);
        appApi$1.zorder('foreground');
        return true;
      } else if (key.keyCode == keyMap.AudioVolumeUp) {
        appApi$1.setVisibility("foreground", true);
        appApi$1.zorder('foreground');
        return true;
      } else if (key.keyCode == keyMap.AudioVolumeDown) {
        appApi$1.setVisibility("foreground", true);
        appApi$1.zorder('foreground');
        return true;
      }

      return false;
    }

    _active() {
      if (this.initialLoad) {
        let home = this;
        this._homeAnimation = home.animation({
          duration: 0.5,
          repeat: 0,
          stopMethod: 'immediate',
          actions: [{
            p: 'scale',
            v: {
              0: 5,
              1: 1
            }
          }, {
            p: 'x',
            v: {
              0: -1920,
              1: 0
            }
          }, {
            p: 'y',
            v: {
              0: -1080,
              1: 0
            }
          }]
        });

        this._homeAnimation.start();

        this.initialLoad = false;
      }
    }
    /**
     * Function to start video playback.
     */


    play() {
      this.player = this.tag('Player');

      try {
        this.player.load({
          title: 'Parkour event',
          subtitle: 'm3u8',
          url: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
          drmConfig: null
        });
        this.hide();

        this._setState('Playing');

        this.player.setVideoRect(0, 0, 1920, 1080);
      } catch (error) {
        this._setState('MainView');

        console.error('Playback Failed ' + error);
      }
    }
    /**
     * Fireancestor to set the state to main view.
     * @param {index} index index value of main view row.
     */


    $goToMainView(index) {
      this.tag('MainView').index = index;

      this._setState('MainView');
    }
    /**
     * Fireancestor to set the state to main view.
     * @param {index} index index value of side view row.
     */


    $goToSidePanel(index) {
      this.tag('SidePanel').index = index;

      this._setState('SidePanel');
    }
    /**
     * Fireancestor to set the state to side panel.
     * @param {index} index index value of Top panel item.
     */


    $goToTopPanel(index) {
      this._setState('TopPanel', [index]);

      this.tag('TopPanel').index = index;
    }

    $changeBackgroundImageOnFocus(image) {
      if (image.startsWith('/images')) {
        this.tag('BackgroundImage').patch({
          src: Utils.asset(image)
        });
      } else {
        this.tag('BackgroundImage').patch({
          src: image
        });
      }
    }

    $changeBackgroundImageOnNonFocus(image) {
      this.tag('BackgroundImage').patch({});
    }
    /**
     * Fireancestor to change the text on top panel.
     */


    $changeHomeText(text) {
      this.tag('TopPanel').changeText = text;
    }
    /**
     * Fireancestor to set the state to player.
     */


    $goToPlayer() {
      this._setState('Player');

      this.play();
    }
    /**
     * Fireancestor to change the IP.
     */


    $changeIp(ip) {
      this.tag('IpAddress').text.text = ip;
    }
    /**
     * Function to scroll
     */


    $scroll(y) {
      this.tag('MainView').setSmooth('y', y, {
        duration: 0.5
      });
    }

    $standby(value) {
      if (value == 'Back') {
        this._setState(ls.last_state);
      } else {
        if (powerState == 'ON') {
          appApi$1.standby(value).then(res => {
            if (res.success) {
              ls.last_state = this._getState();
              powerState = 'STANDBY';
              var appApi = new AppApi();

              if (Storage.get('applicationType') == 'WebApp' && Storage.get('ipAddress')) {
                Storage.set('applicationType', ''); // appApi.deactivateWeb();

                appApi.suspendWeb();
                appApi.setVisibility('ResidentApp', true);
              } else if (Storage.get('applicationType') == 'Lightning' && Storage.get('ipAddress')) {
                Storage.set('applicationType', ''); // appApi.deactivateLightning();

                appApi.suspendLightning();
                appApi.setVisibility('ResidentApp', true);
              } else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
                Storage.set('applicationType', '');
                appApi.killNative();
                appApi.setVisibility('ResidentApp', true);
              } else if (Storage.get('applicationType') == 'Amazon') {
                Storage.set('applicationType', '');
                appApi.suspendPremiumApp('Amazon');
                appApi.setVisibility('ResidentApp', true);
              } else if (Storage.get('applicationType') == 'Netflix') {
                Storage.set('applicationType', '');
                appApi.suspendPremiumApp('Netflix');
                appApi.setVisibility('ResidentApp', true);
              } else if (Storage.get('applicationType') == 'Cobalt') {
                Storage.set('applicationType', '');
                appApi.suspendCobalt();
                appApi.setVisibility('ResidentApp', true);
              } else {
                if (ls.last_state === "Playing") {
                  ls.last_state = "MainView";
                  this.$stopPlayer();
                } else if (ls.last_state === "UsbAppsScreen") {
                  this.$goToSidePanel(0);
                  this.show();
                }
              }

              thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
                client: 'ResidentApp'
              }).then(result => {
                console.log('ResidentApp moveToFront Success' + JSON.stringify(result));
              }).catch(err => {
                console.log(`error while moving the resident app to front = ${err}`);
              });
              thunder$1.call('org.rdk.RDKShell', 'setFocus', {
                client: 'ResidentApp'
              }).then(result => {
                console.log('ResidentApp setFocus Success' + JSON.stringify(result));
              }).catch(err => {
                console.log('Error', err);
              });

              this._setState(ls.last_state);
            }
          });
          return true;
        }
      }
    }

    $registerInactivityMonitoringEvents() {
      appApi$1.standby('ON').then(res => {
        if (res.success) {
          powerState = 'ON';
        }
      });
      appApi$1.enabledisableinactivityReporting(false);
      const systemcCallsign = "org.rdk.RDKShell.1";
      thunder$1.Controller.activate({
        callsign: systemcCallsign
      }).then(res => {
        thunder$1.on("org.rdk.RDKShell.1", "onUserInactivity", notification => {
          if (powerState === "ON") {
            this.$standby("STANDBY");
          }
        }, err => {
          console.error(`error while inactivity monitoring , ${err}`);
        });
      }).catch(err => {
        console.error(`error while activating the displaysettings plugin; err = ${err}`);
      });
    }

    $goToUsb() {
      this._setState('UsbAppsScreen');
    }

    $setStateMainView() {
      this._setState('MainView');
    }
    /**
     * Function to hide the home UI.
     */


    hide() {
      this.tag('BackgroundImage').patch({
        alpha: 0
      });
      this.tag('BackgroundColor').patch({
        alpha: 0
      });
      this.tag('MainView').patch({
        alpha: 0
      });
      this.tag('TopPanel').patch({
        alpha: 0
      });
      this.tag('SidePanel').patch({
        alpha: 0
      });
      this.tag('IpAddress').patch({
        alpha: 0
      });
    }
    /**
     * Function to show home UI.
     */


    show() {
      this.tag('BackgroundImage').patch({
        alpha: 1
      });
      this.tag('BackgroundColor').patch({
        alpha: 1
      });
      this.tag('MainView').patch({
        alpha: 1
      });
      this.tag('TopPanel').patch({
        alpha: 1
      });
      this.tag('SidePanel').patch({
        alpha: 1
      });
      this.tag('IpAddress').patch({
        alpha: 1
      });
    }

    $hideAllforVideo() {
      this.hide();
    }

    $showAllforVideo() {
      this.tag('BackgroundImage').patch({
        alpha: 1
      });
      this.tag('BackgroundColor').patch({
        alpha: 1
      });
      this.tag('TopPanel').patch({
        alpha: 1
      });
      this.tag('SidePanel').patch({
        alpha: 1
      });
      this.tag('IpAddress').patch({
        alpha: 1
      });
    }
    /** this function is used to hide only the side and top panels  */


    $hideSideAndTopPanels() {
      this.tag('TopPanel').patch({
        alpha: 0
      });
      this.tag('SidePanel').patch({
        alpha: 0
      });
    }
    /** this function will show side and top panels only */


    $showSideAndTopPanels() {
      this.tag('TopPanel').patch({
        alpha: 1
      });
      this.tag('SidePanel').patch({
        alpha: 1
      });
    }
    /**
     * Fireancestor to set the state to Settings.
     */


    $goToSettings() {
      this._setState('Settings');
    }

    $stopPlayer() {
      this._setState('MainView');

      this.player.stop();
      this.show();
    }
    /**
     * Function to define various states needed for home screen.
     */


    static _states() {
      return [class TopPanel extends this {
        $enter(e) {
          if (e.prevState === 'MainView') {
            this.tag('SidePanel').deFocus = true;
          }
        }

        _getFocused() {
          return this.tag('TopPanel');
        }

      }, class SidePanel extends this {
        _getFocused() {
          return this.tag('SidePanel');
        }

      }, class MainView extends this {
        $enter(e) {
          if (e.prevState === 'TopPanel') this.tag('SidePanel').deFocus = false;
        }

        _getFocused() {
          return this.tag('MainView');
        }

      }, class UsbAppsScreen extends this {
        $enter() {
          this.$changeHomeText('USB');
          this.tag('MainView').patch({
            alpha: 0
          });
          this.tag('UsbAppsScreen').visible = true;
        }

        $exit() {
          this.$changeHomeText('Home');
          this.tag('UsbAppsScreen').visible = false;
          this.show();
          this.tag('UsbAppsScreen').exitFunctionality();
        }

        _getFocused() {
          return this.tag('UsbAppsScreen');
        }

        _handleBack() {
          this._setState('MainView');
        }

      }, class Settings extends this {
        $enter() {
          this.tag('MainView').alpha = 0;
          this.tag('Settings').alpha = 1;
        }

        _getFocused() {
          return this.tag('Settings');
        }

        $exit(e) {
          this.tag('MainView').alpha = 1;
          this.tag('Settings').alpha = 0;
        }

      }, class Playing extends this {
        _getFocused() {
          return this.tag('Player');
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
   * Class for rendering items in UI list.
   */

  class Item extends lng$1.Component {
    static _template() {
      return {
        Item: {
          w: 300,
          h: 150,
          rect: true,
          color: 0xFFDBEBFF,
          shader: {
            type: lng$1.shaders.RoundedRectangle,
            radius: 10
          }
        },
        OperatorLogo: {},
        Shadow: {
          alpha: 0,
          zIndex: 2,
          x: -25,
          y: -25,
          color: 0x66000000,
          texture: lng.Tools.getShadowRect(350, 180, 10, 10, 20)
        }
      };
    }
    /**
     * Function to set contents for an item in UI list.
     */


    set item(item) {
      this._item = item;
      this.tag('OperatorLogo').patch({
        Logo: {
          w: 300,
          h: 150,
          zIndex: 3,
          src: Utils.asset(this._item.url)
        }
      });
    }

    _focus() {
      this.tag('Item').zIndex = 3;
      this.tag('Item').scale = 1.2;
      this.tag('Item').color = 0xFFFFFFFF;
      this.tag('Shadow').patch({
        smooth: {
          alpha: 1
        }
      });
    }

    _unfocus() {
      this.tag('Item').zIndex = 1;
      this.tag('Item').scale = 1;
      this.tag('Item').color = 0xFFDBEBFF;
      this.tag('Shadow').patch({
        smooth: {
          alpha: 0
        }
      });
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
   * Class for splash screen.
   */

  class SplashScreen extends lng$1.Component {
    static _template() {
      return {
        Splashscreen: {
          w: 1920,
          h: 1080,
          alpha: 1,
          src: Utils.asset('/images/splash/Splash-Background.jpg'),
          Img: {
            mount: 0.5,
            x: 1920 / 2,
            y: 1080 / 2,
            src: Utils.asset('/images/splash/RDKLogo.png')
          }
        },
        AutoRemotePair: {
          w: 1920,
          h: 1080,
          src: Utils.asset('/images/splash/Splash-Background.jpg'),
          alpha: 0,
          Title: {
            w: 1600,
            y: 474,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 55,
              textAlign: 'center',
              text: 'Pair Your Remote',
              textColor: 0xffffffff
            }
          },
          Description: {
            w: 1300,
            y: 550,
            x: 150,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 35,
              textAlign: 'center',
              maxLines: 2,
              text: 'Please put the remote in pairing mode, scanning will start in a minute',
              textColor: 0xffe5e5e5
            }
          },
          LoadingIcon: {
            x: 750,
            y: 600,
            alpha: 0,
            src: Utils.asset('images/loading.png')
          },
          RemoteImg: {
            x: 1300,
            y: 300,
            src: Utils.asset('images/remote.png')
          }
        },
        ConnectivityScreen: {
          w: 1920,
          h: 1080,
          src: Utils.asset('/images/splash/Splash-Background.jpg'),
          alpha: 0,
          Title: {
            w: 1920,
            y: 325,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 55,
              textAlign: 'center',
              text: "You're not connected to the internet",
              textColor: 0xffffffff
            }
          },
          Description: {
            w: 1920,
            y: 400,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 35,
              textAlign: 'center',
              maxLines: 2,
              text: 'Please connect to either a wired connection or a WiFi Network, For WiFi network press home and then go to settings',
              wordWrapWidth: 1400,
              textColor: 0xffe5e5e5
            }
          }
        },
        UISwitch: {
          rect: true,
          w: 1920,
          h: 1080,
          color: 0xff20344D,
          alpha: 0,
          Title: {
            x: 1920 / 2,
            y: 350,
            mountX: 0.5,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 55,
              textAlign: 'center',
              text: 'Choose a Service',
              textColor: 0xffffffff
            }
          },
          UIList: {
            x: 1920 / 2 - 20,
            y: 500,
            type: lng$1.components.ListComponent,
            w: 300 * 5,
            h: 150,
            itemSize: 300 + 20,
            roll: true,
            mountX: 0.5
          }
        }
      };
    }
    /**
     * Function to be excuted when the Bluetooth screen is enabled.
     */


    _enable() {
      this.remotePaired = null;
      this.hasInternet = true;
      this._bt = new BluetoothApi();

      this._bt.activate();

      this._bt.getPairedDevices().then(() => this._bt.getConnectedDevices()).then(() => {
        let paired = this._bt.pairedDevices;
        this._bt.connectedDevices;

        if (paired.length > 0) {
          this.remotePaired = true;
        } else {
          this.remotePaired = false;
        }
      });

      this._setState('Splashscreen');
    }
    /**
     * Function to be executed when the Bluetooth screen is disabled from the screen.
     */


    _disable() {
      if (this._bt) this._bt.deactivate();
      if (this.player) this.player.stop();
    }

    _init() {
      this.appApi = new AppApi();
      var homeApi = new HomeApi();
      this.tag('UISwitch.UIList').items = homeApi.getUIInfo().map((item, index) => {
        return {
          ref: 'UI' + index,
          w: 300,
          h: 150,
          type: Item,
          item: item
        };
      });
    }
    /**
     * Function to handle the different states of the app.
     */


    static _states() {
      return [class Splashscreen extends this {
        $enter() {
          const myAnimation = this.tag('Splashscreen').animation({
            duration: 0.5,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [{
              p: 'alpha',
              v: {
                0: 0,
                1: 1
              }
            }]
          });
          myAnimation.start();
          const myAnimationLogo = this.tag('Img').animation({
            duration: 4,
            repeat: 0,
            timingFunction: 'ease-in',
            actions: [{
              p: 'x',
              v: {
                0: {
                  v: 0,
                  sm: 0.5
                },
                1: 950
              }
            }, {
              p: 'y',
              v: {
                0: {
                  v: 0,
                  sm: 0.5
                },
                1: 550
              }
            }]
          });
          myAnimationLogo.start();
          this.screenTimeout = setTimeout(() => {
            if (this.remotePaired == false) this._setState('AutoRemotePair');else if (this.hasInternet == false) this._setState('ConnectivityScreen');else Router.navigate('home', {
              path: 'settings'
            });
          }, 5000);
        }

        _handleKey(event) {
          if (event.keyCode == keyMap.s) this._setState('UISwitch');
        }

        $exit() {
          const myAnimation = this.tag('Splashscreen').animation({
            duration: 0.5,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [{
              p: 'alpha',
              v: {
                0: 1,
                1: 0
              }
            }]
          });
          myAnimation.start();
          window.clearTimeout(this.screenTimeout);
        }

      }, class SplashVideo extends this {
        $enter() {
          const myAnimation = this.tag('SplashVideo').animation({
            duration: 0.5,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [{
              p: 'alpha',
              v: {
                0: 0,
                1: 1
              }
            }]
          });
          myAnimation.start(); //this.startVideo()

          this.timeout = setTimeout(() => {}, 5000);
        }

        $exit() {
          const myAnimation = this.tag('SplashVideo').animation({
            duration: 0.5,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [{
              p: 'alpha',
              v: {
                0: 1,
                1: 0
              }
            }]
          });
          myAnimation.on('finish', p => {
            if (this.player) this.player.stop();
          });
          myAnimation.start();
          window.clearTimeout(this.timeout);
        }

        _handleKey(event) {
          if (event.keyCode == keyMap.s) this._setState('UISwitch');
        }

      }, class ConnectivityScreen extends this {
        $enter() {
          const myAnimation = this.tag('ConnectivityScreen').animation({
            duration: 0.5,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [{
              p: 'alpha',
              v: {
                0: 0,
                1: 1
              }
            }, {
              p: 'x',
              v: {
                0: 1000,
                1: 0
              }
            }]
          });
          myAnimation.start();
          setTimeout(() => {
            Router.navigate('home', {
              path: 'settings'
            });
          }, 5000);
        }

        $exit() {
          const myAnimation = this.tag('ConnectivityScreen').animation({
            duration: 0.5,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [{
              p: 'alpha',
              v: {
                0: 1,
                1: 0
              }
            }]
          });
          myAnimation.start();
        }

        _handleKey() {
          Router.navigate('home', {
            path: 'settings'
          });
        }

      }, class AutoRemotePair extends this {
        $enter() {
          const myAnimation = this.tag('AutoRemotePair').animation({
            duration: 1,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [{
              p: 'alpha',
              v: {
                0: 0,
                1: 1
              }
            }, {
              p: 'x',
              v: {
                0: 1000,
                1: 0
              }
            }]
          });
          var connected = false;
          var timer = setTimeout(() => {
            if (!connected) this.tag('AutoRemotePair.Description').text = 'Please put the remote in pairing mode, No Bluetooth device found';
            setTimeout(() => {
              if (this.hasInternet == false) this._setState('ConnectivityScreen');else Router.navigate('home', {
                path: 'settings'
              });
            }, 1000);
          }, 10000);

          var error = () => {
            this.tag('AutoRemotePair.Description').text = 'Please put the remote in pairing mode, , No Bluetooth device found';
            setTimeout(() => {
              if (this.hasInternet == false) this._setState('ConnectivityScreen');else Router.navigate('home', {
                path: 'settings'
              });
            }, 1000);
          };

          myAnimation.start();
          setTimeout(() => {
            this.tag('AutoRemotePair.Description').text = 'Please put the remote in pairing mode, Scanning...';
            const rotateAnimation = this.tag('AutoRemotePair.LoadingIcon').animation({
              duration: 1,
              repeat: -1,
              stopMethod: 'immediate',
              stopDelay: 0.2,
              actions: [{
                p: 'rotation',
                v: {
                  sm: 0,
                  0: 0,
                  1: Math.PI * 2
                }
              }]
            });
            rotateAnimation.play();
            this.tag('AutoRemotePair.LoadingIcon').alpha = 1;

            this._bt.startScan();

            this._bt.registerEvent('onDiscoveredDevice', () => {
              let discovered = this._bt.discoveredDevices;

              if (discovered.length > 0) {
                this._bt.pair(discovered[0].deviceID);
              } else {
                error();
              }
            });
          }, 5000);

          this._bt.registerEvent('onPairingChange', () => {
            let pairedDevices = this._bt.pairedDevices;

            if (pairedDevices.length > 0) {
              this._bt.connect(pairedDevices[0].deviceID, pairedDevices[0].deviceType);

              this.tag('AutoRemotePair.Description').text = pairedDevices[0].deviceType + 'remote is paired';
            } else {
              setTimeout(() => {
                this._bt.getPairedDevices().then(() => {
                  let pairedDevices = this._bt.pairedDevices;

                  if (pairedDevices.length > 0) {
                    this._bt.connect(pairedDevices[0].deviceID, pairedDevices[0].deviceType);
                  } else {
                    error();
                  }
                });
              }, 2000);
            }
          });

          this._bt.registerEvent('onConnectionChange', () => {
            let connectedDevices = this._bt.connectedDevices;

            if (connectedDevices.length > 0) {
              this.tag('AutoRemotePair.Description').text = 'Remote is Connected to ' + connectedDevices[0].name;
              connected = true;
              clearTimeout(timer);
              setTimeout(() => {
                if (this.hasInternet == false) this._setState('ConnectivityScreen');else Router.navigate('home', {
                  path: 'settings'
                });
              }, 2000);
            } else {
              setTimeout(() => {
                this._bt.getConnectedDevices().then(() => {
                  let connectedDevices = this._bt.connectedDevices;

                  if (connectedDevices.length > 0) {
                    this.tag('AutoRemotePair.Description').text = 'Please put the remote in pairing mode, Connected to ' + connectedDevices[0].name;
                    connected = true;
                    clearTimeout(timer);
                    setTimeout(() => {
                      if (this.hasInternet == false) this._setState('ConnectivityScreen');else Router.navigate('home', {
                        path: 'settings'
                      });
                    }, 2000);
                  } else {
                    error();
                  }
                });
              }, 2000);
            }
          });
        }

        $exit() {
          const myAnimation = this.tag('AutoRemotePair').animation({
            duration: 1,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [{
              p: 'alpha',
              v: {
                0: 1,
                1: 0
              }
            }]
          });
          myAnimation.start();
        }

      }, class UISwitch extends this {
        $enter() {
          const myAnimation = this.tag('UISwitch').animation({
            duration: 0.5,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [{
              p: 'alpha',
              v: {
                0: 0,
                1: 1
              }
            }, {
              p: 'x',
              v: {
                0: 1000,
                1: 0
              }
            }]
          });
          myAnimation.start();
        }

        _getFocused() {
          console.log('get focused called');
          let _tagEle = this.tag('UISwitch.UIList').element;
          let bgColor = '';

          if (_tagEle._item.title == 'LIVE') {
            bgColor = 0xFF445263;
          } else if (_tagEle._item.title == 'TATA') {
            bgColor = 0xFF3097A7;
          } else if (_tagEle._item.title == 'EPAM') {
            bgColor = 0xFF39C2D7;
          } else if (_tagEle._item.title == 'NEW') {
            bgColor = 0xFF141E30;
          } else if (_tagEle._item.title == 'COMINGSOON') {
            bgColor = 0xFF485E76;
          } else if (_tagEle._item.title == 'DEFAULT') {
            bgColor = 0xff20344D;
          }

          this.tag('UISwitch').patch({
            smooth: {
              color: bgColor
            }
          });
          return this.tag('UISwitch.UIList').element;
        }

        _handleRight() {
          if (this.tag('UISwitch.UIList').length - 1 != this.tag('UISwitch.UIList').index) {
            this.tag('UISwitch.UIList').setNext();
            return this.tag('UISwitch.UIList').element;
          }
        }

        _handleLeft() {
          if (this.tag('UISwitch.UIList').index > 0) {
            this.tag('UISwitch.UIList').setPrevious();
            return this.tag('UISwitch.UIList').element;
          }
        }

        _handleEnter() {
          if (this.tag('UISwitch.UIList').element._item.title != 'DEFAULT') {
            this.appApi.launchResident(this.tag('UISwitch.UIList').element._item.uri);
          } else {
            if (this.remotePaired == false) this._setState('AutoRemotePair');else if (this.hasInternet == false) this._setState('ConnectivityScreen');else Router.navigate('home', {
              path: 'settings'
            });
          }
        }

        $exit() {
          const myAnimation = this.tag('UISwitch').animation({
            duration: 1,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [{
              p: 'alpha',
              v: {
                0: 1,
                1: 0
              }
            }]
          });
          myAnimation.start();
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
  class Error$1 extends lng$1.Component {
    static _template() {
      return {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xffb70606,
        Label: {
          x: 100,
          y: 100,
          text: {
            fontFace: CONFIG.language.font,
            text: 'Error',
            fontSize: 22
          }
        }
      };
    }

    _handleEnter() {
      Router.navigate('home');
    }

    _focus() {
      console.log('focus error page');
    }

    set error(obj) {
      const {
        page,
        error
      } = obj;
      console.log(page, error);
      const errorMessage = `
error while loading page: ${page.constructor.name}
press enter to navigate to home
--
loaded via hash: ${page[Symbol.for('hash')]}
resulted in route: ${page[Symbol.for('route')]}
--
${error.toString()}`;
      this.tag('Label').text = errorMessage;
    }

    pageTransition() {
      return 'up';
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
  var routes = {
    boot: queryParam => {
      let homeApi = new HomeApi();
      homeApi.setPartnerAppsInfo(queryParam.data);
      return Promise.resolve();
    },
    root: 'home',
    routes: [{
      path: 'home',
      component: HomeScreen,

      before() {
        return Promise.resolve();
      },

      cache: 10
    }, {
      path: 'splash',
      component: SplashScreen,
      options: {
        preventStorage: true,
        clearHistory: true,
        reuseInstance: false
      },
      cache: 10
    }, {
      path: '!',
      component: Error$1
    }, {
      path: '*',
      component: HomeScreen
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
  var thunder = thunderJS(config);
  var appApi = new AppApi();
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

    static language() {
      let lang = navigator.language;
      console.log(lang);
      return {
        file: Utils.asset('language/language-file.json'),
        language: CONFIG.language.id
      };
    }

    _init() {
      var thunder = thunderJS(config);
      appApi.enableDisplaySettings();
      appApi.cobaltStateChangeEvent();
      appApi.launchforeground();
      this.xcastApi = new XcastApi();
      this.xcastApi.activate().then(result => {
        if (result) {
          this.registerXcastListeners();
        }
      });
      const rdkshellCallsign = 'org.rdk.RDKShell';
      thunder.Controller.activate({
        callsign: rdkshellCallsign
      }).then(result => {
        console.log('Successfully activated RDK Shell');
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call('org.rdk.RDKShell', 'setFocus', {
          client: 'ResidentApp'
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
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
        thunder.on(rdkshellCallsign, 'onSuspended', notification => {
          if (notification) {
            console.log('onSuspended notification: ' + notification.client);

            if (Storage.get('applicationType') == notification.client) {
              Storage.set('applicationType', '');
              appApi.setVisibility('ResidentApp', true);
              thunder.call('org.rdk.RDKShell', 'moveToFront', {
                client: 'ResidentApp'
              }).then(result => {
                console.log('ResidentApp moveToFront Success');
              });
              thunder.call('org.rdk.RDKShell', 'setFocus', {
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
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: keyMap.Escape,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: keyMap.F1,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: keyMap.Power,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: keyMap.F7,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: keyMap.AudioVolumeUp,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: keyMap.AudioVolumeDown,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'foreground',
          keyCode: keyMap.AudioVolumeDown,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'foreground',
          keyCode: keyMap.AudioVolumeUp,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'foreground',
          keyCode: keyMap.AudioVolumeMute,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: keyMap.MediaFastForward,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: 142,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: keyMap.Home,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: keyMap.MediaRewind,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: keyMap.Pause,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'Cobalt',
          keyCode: keyMap.Escape,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'Amazon',
          keyCode: keyMap.Escape,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'Cobalt',
          keyCode: keyMap.Home,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'Amazon',
          keyCode: keyMap.Home,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
          client: 'Cobalt',
          keyCode: keyMap.Backspace,
          modifiers: []
        }).catch(err => {
          console.log('Error', err);
        });
      }).catch(err => {
        console.log('Error', err);
      }).then(result => {
        thunder.call(rdkshellCallsign, 'addKeyIntercept', {
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

    deactivateChildApp(plugin) {
      var appApi = new AppApi();

      switch (plugin) {
        case 'WebApp':
          appApi.deactivateWeb();
          break;

        case 'Cobalt':
          appApi.deactivateCobalt();
          break;

        case 'Lightning':
          appApi.deactivateLightning();
          break;

        case 'Native':
          appApi.killNative();
          break;

        case 'Amazon':
          appApi.deactivateNativeApp('Amazon');

        case 'Netflix':
          appApi.deactivateNativeApp('Netflix');
      }
    }
    /**
     * Function to register event listeners for Xcast plugin.
     */


    registerXcastListeners() {
      this.xcastApi.registerEvent('onApplicationLaunchRequest', notification => {
        console.log('Received a launch request ' + JSON.stringify(notification));

        if (this.xcastApps(notification.applicationName)) {
          let applicationName = this.xcastApps(notification.applicationName);

          if (applicationName == 'Amazon' && Storage.get('applicationType') != 'Amazon') {
            this.deactivateChildApp(Storage.get('applicationType'));
            appApi.launchPremiumApp('Amazon');
            Storage.set('applicationType', 'Amazon');
            appApi.setVisibility('ResidentApp', false);
            let params = {
              applicationName: notification.applicationName,
              state: 'running'
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName == 'Netflix' && Storage.get('applicationType') != 'Netflix') {
            appApi.configureApplication('Netflix', notification.parameters).then(res => {
              this.deactivateChildApp(Storage.get('applicationType'));
              appApi.launchPremiumApp('Netflix');
              Storage.set('applicationType', 'Netflix');
              appApi.setVisibility('ResidentApp', false);

              if (AppApi.pluginStatus('Netflix')) {
                let params = {
                  applicationName: notification.applicationName,
                  state: 'running'
                };
                this.xcastApi.onApplicationStateChanged(params);
              }
            }).catch(err => {
              console.log('Error while launching ' + applicationName + ', Err: ' + JSON.stringify(err));
            });
          } else if (applicationName == 'Cobalt' && Storage.get('applicationType') != 'Cobalt') {
            this.deactivateChildApp(Storage.get('applicationType'));
            appApi.launchCobalt(notification.parameters.url);
            Storage.set('applicationType', 'Cobalt');
            appApi.setVisibility('ResidentApp', false);
            let params = {
              applicationName: notification.applicationName,
              state: 'running'
            };
            this.xcastApi.onApplicationStateChanged(params);
          }
        }
      });
      this.xcastApi.registerEvent('onApplicationHideRequest', notification => {
        console.log('Received a hide request ' + JSON.stringify(notification));

        if (this.xcastApps(notification.applicationName)) {
          let applicationName = this.xcastApps(notification.applicationName);
          console.log('Hide ' + this.xcastApps(notification.applicationName));

          if (applicationName === 'Amazon' && Storage.get('applicationType') === 'Amazon') {
            appApi.suspendPremiumApp('Amazon');
            let params = {
              applicationName: notification.applicationName,
              state: 'stopped'
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === 'Netflix' && Storage.get('applicationType') === 'Netflix') {
            appApi.suspendPremiumApp('Netflix');
            let params = {
              applicationName: notification.applicationName,
              state: 'stopped'
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === 'Cobalt' && Storage.get('applicationType') === 'Cobalt') {
            appApi.suspendCobalt();
            let params = {
              applicationName: notification.applicationName,
              state: 'stopped'
            };
            this.xcastApi.onApplicationStateChanged(params);
          }

          Storage.set('applicationType', '');
          appApi.setVisibility('ResidentApp', true);
          thunder.call('org.rdk.RDKShell', 'moveToFront', {
            client: 'ResidentApp'
          }).then(result => {
            console.log('ResidentApp moveToFront Success');
          });
        }
      });
      this.xcastApi.registerEvent('onApplicationResumeRequest', notification => {
        console.log('Received a resume request ' + JSON.stringify(notification));

        if (this.xcastApps(notification.applicationName)) {
          let applicationName = this.xcastApps(notification.applicationName);
          console.log('Resume ' + this.xcastApps(notification.applicationName));

          if (applicationName == 'Amazon' && Storage.get('applicationType') != 'Amazon') {
            this.deactivateChildApp(Storage.get('applicationType'));
            appApi.launchPremiumApp('Amazon');
            Storage.set('applicationType', 'Amazon');
            appApi.setVisibility('ResidentApp', false);
            let params = {
              applicationName: notification.applicationName,
              state: 'running'
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName == 'Netflix' && Storage.get('applicationType') != 'Netflix') {
            this.deactivateChildApp(Storage.get('applicationType'));
            appApi.launchPremiumApp('Netflix');
            Storage.set('applicationType', 'Amazon');
            appApi.setVisibility('ResidentApp', false);
            let params = {
              applicationName: notification.applicationName,
              state: 'running'
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName == 'Cobalt' && Storage.get('applicationType') != 'Cobalt') {
            this.deactivateChildApp(Storage.get('applicationType'));
            appApi.launchCobalt();
            Storage.set('applicationType', 'Cobalt');
            appApi.setVisibility('ResidentApp', false);
            let params = {
              applicationName: notification.applicationName,
              state: 'running'
            };
            this.xcastApi.onApplicationStateChanged(params);
          }
        }
      });
      this.xcastApi.registerEvent('onApplicationStopRequest', notification => {
        console.log('Received a stop request ' + JSON.stringify(notification));

        if (this.xcastApps(notification.applicationName)) {
          console.log('Stop ' + this.xcastApps(notification.applicationName));
          let applicationName = this.xcastApps(notification.applicationName);

          if (applicationName === 'Amazon' && Storage.get('applicationType') === 'Amazon') {
            appApi.deactivateNativeApp('Amazon');
            Storage.set('applicationType', '');
            appApi.setVisibility('ResidentApp', true);
            thunder.call('org.rdk.RDKShell', 'moveToFront', {
              client: 'ResidentApp'
            }).then(result => {
              console.log('ResidentApp moveToFront Success');
            });
            let params = {
              applicationName: notification.applicationName,
              state: 'stopped'
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === 'Netflix' && Storage.get('applicationType') === 'Netflix') {
            appApi.deactivateNativeApp('Netflix');
            Storage.set('applicationType', '');
            appApi.setVisibility('ResidentApp', true);
            thunder.call('org.rdk.RDKShell', 'moveToFront', {
              client: 'ResidentApp'
            }).then(result => {
              console.log('ResidentApp moveToFront Success');
            });
            let params = {
              applicationName: notification.applicationName,
              state: 'stopped'
            };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === 'Cobalt' && Storage.get('applicationType') === 'Cobalt') {
            appApi.deactivateCobalt();
            Storage.set('applicationType', '');
            appApi.setVisibility('ResidentApp', true);
            thunder.call('org.rdk.RDKShell', 'moveToFront', {
              client: 'ResidentApp'
            }).then(result => {
              console.log('ResidentApp moveToFront Success');
            });
            let params = {
              applicationName: notification.applicationName,
              state: 'stopped'
            };
            this.xcastApi.onApplicationStateChanged(params);
          }
        }
      });
      this.xcastApi.registerEvent('onApplicationStateRequest', notification => {
        //console.log('Received a state request ' + JSON.stringify(notification));
        if (this.xcastApps(notification.applicationName)) {
          let applicationName = this.xcastApps(notification.applicationName);
          let params = {
            applicationName: notification.applicationName,
            state: 'stopped'
          };
          appApi.registerEvent('statechange', results => {
            if (results.callsign === applicationName && results.state === 'Activated') {
              params.state = 'running';
            }

            this.xcastApi.onApplicationStateChanged(params);
            console.log('State of ' + this.xcastApps(notification.applicationName));
          });
        }
      });
    }
    /**
     * Function to get the plugin name for the application name.
     * @param {string} app App instance.
     */


    xcastApps(app) {
      if (Object.keys(XcastApi.supportedApps()).includes(app)) {
        return XcastApi.supportedApps()[app];
      } else return false;
    }

    _handleKey(key) {
      if (key.keyCode == keyMap.MediaRewind) {
        var showMax = 'https://ott-app.dstv.com/';
        this.deactivateChildApp(Storage.get('applicationType'));
        appApi.launchWeb(showMax);
        Storage.set('applicationType', 'WebApp');
        appApi.setVisibility('ResidentApp', false);
      } else if (key.keyCode == keyMap.Pause && Storage.get('applicationType') != 'Cobalt') {
        this.deactivateChildApp(Storage.get('applicationType'));
        appApi.launchCobalt();
        Storage.set('applicationType', 'Cobalt');
        appApi.setVisibility('ResidentApp', false);
      } else if (key.keyCode == keyMap.Escape || key.keyCode == keyMap.Home) {
        console.log(Storage.get('applicationType'));

        if (Storage.get('applicationType') != '') {
          this.deactivateChildApp(Storage.get('applicationType'));
          Storage.set('applicationType', '');
          appApi.setVisibility('ResidentApp', true);
          thunder.call('org.rdk.RDKShell', 'moveToFront', {
            client: 'ResidentApp'
          }).then(result => {
            console.log('ResidentApp moveToFront Success');
          });
          thunder.call('org.rdk.RDKShell', 'setFocus', {
            client: 'ResidentApp'
          }).then(result => {
            console.log('ResidentApp moveToFront Success');
          }).catch(err => {
            console.log('Error', err);
          });
        } else {
          console.log('Go to home screen');
        }
      }
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
  function index () {
    return Launch(App, ...arguments);
  }

  return index;

})();
