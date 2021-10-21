/**
 * App version: 2.0.0 27/08/21
 * SDK version: 3.2.1
 * CLI version: 2.5.1
 * 
 * Generated: Fri, 22 Oct 2021 14:18:07 GMT
 */

var APP_accelerator_home_ui = (function () {
  'use strict';

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
    const keys = key.split('.');
    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]] = obj[keys[i]] !== undefined ? obj[keys[i]] : {};
    }
    return typeof obj === 'object' ? (Object.keys(obj).length ? obj : undefined) : obj
  };

  var Settings = {
    get(type, key, fallback = undefined) {
      const val = dotGrab(settings[type], key);
      return val !== undefined ? val : fallback
    },
    has(type, key) {
      return !!this.get(type, key)
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
    },
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
      Error: 'red',
    };

    args = Array.from(args);
    return [
      '%c' + (args.length > 1 && typeof args[0] === 'string' ? args.shift() : type),
      'background-color: ' + colors[type] + '; color: white; padding: 2px 4px; border-radius: 2px',
      args,
    ]
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
    },
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
  };

  // available metric per category
  const metrics$1 = {
    app: ['launch', 'loaded', 'ready', 'close'],
    page: ['view', 'leave'],
    user: ['click', 'input'],
    media: [
      'abort',
      'canplay',
      'ended',
      'pause',
      'play',
      // with some videos there occur almost constant suspend events ... should investigate
      // 'suspend',
      'volumechange',
      'waiting',
      'seeking',
      'seeked',
    ],
  };

  // error metric function (added to each category)
  const errorMetric = (type, message, code, visible, params = {}) => {
    params = { params, ...{ message, code, visible } };
    sendMetric(type, 'error', params);
  };

  const Metric = (type, events, options = {}) => {
    return events.reduce(
      (obj, event) => {
        obj[event] = (name, params = {}) => {
          params = { ...options, ...(name ? { name } : {}), ...params };
          sendMetric(type, event, params);
        };
        return obj
      },
      {
        error(message, code, params) {
          errorMetric(type, message, code, params);
        },
        event(name, params) {
          sendMetric(type, name, params);
        },
      }
    )
  };

  const Metrics = types => {
    return Object.keys(types).reduce(
      (obj, type) => {
        // media metric works a bit different!
        // it's a function that accepts a url and returns an object with the available metrics
        // url is automatically passed as a param in every metric
        type === 'media'
          ? (obj[type] = url => Metric(type, types[type], { url }))
          : (obj[type] = Metric(type, types[type]));
        return obj
      },
      { error: errorMetric, event: sendMetric }
    )
  };

  var Metrics$1 = Metrics(metrics$1);

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
    waiting: 'Waiting',
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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

  var autoSetupMixin = (sourceObject, setup = () => {}) => {
    let ready = false;

    const doSetup = () => {
      if (ready === false) {
        setup();
        ready = true;
      }
    };

    return Object.keys(sourceObject).reduce((obj, key) => {
      if (typeof sourceObject[key] === 'function') {
        obj[key] = function() {
          doSetup();
          return sourceObject[key].apply(sourceObject, arguments)
        };
      } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).get === 'function') {
        obj.__defineGetter__(key, function() {
          doSetup();
          return Object.getOwnPropertyDescriptor(sourceObject, key).get.apply(sourceObject)
        });
      } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).set === 'function') {
        obj.__defineSetter__(key, function() {
          doSetup();
          return Object.getOwnPropertyDescriptor(sourceObject, key).set.sourceObject[key].apply(
            sourceObject,
            arguments
          )
        });
      } else {
        obj[key] = sourceObject[key];
      }
      return obj
    }, {})
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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

  var easeExecution = (cb, delay) => {
    clearTimeout(timeout$1);
    timeout$1 = setTimeout(() => {
      cb();
    }, delay);
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
      return basePath + relPath
    },
    proxyUrl(url, options = {}) {
      return proxyUrl ? proxyUrl + '?' + makeQueryString(url, options) : url
    },
    makeQueryString() {
      return makeQueryString(...arguments)
    },
    // since imageworkers don't work without protocol
    ensureUrlWithProtocol() {
      return ensureUrlWithProtocol(...arguments)
    },
  };

  const ensureUrlWithProtocol = url => {
    if (/^\/\//.test(url)) {
      return window.location.protocol + url
    }
    if (!/^(?:https?:)/i.test(url)) {
      return window.location.origin + url
    }
    return url
  };

  const makeFullStaticPath = (pathname = '/', path) => {
    // ensure path has traling slash
    path = path.charAt(path.length - 1) !== '/' ? path + '/' : path;

    // if path is URL, we assume it's already the full static path, so we just return it
    if (/^(?:https?:)?(?:\/\/)/.test(path)) {
      return path
    }

    if (path.charAt(0) === '/') {
      return path
    } else {
      // cleanup the pathname (i.e. remove possible index.html)
      pathname = cleanUpPathName(pathname);

      // remove possible leading dot from path
      path = path.charAt(0) === '.' ? path.substr(1) : path;
      // ensure path has leading slash
      path = path.charAt(0) !== '/' ? '/' + path : path;
      return pathname + path
    }
  };

  const cleanUpPathName = pathname => {
    if (pathname.slice(-1) === '/') return pathname.slice(0, -1)
    const parts = pathname.split('/');
    if (parts[parts.length - 1].indexOf('.') > -1) parts.pop();
    return parts.join('/')
  };

  const makeQueryString = (url, options = {}, type = 'url') => {
    // add operator as an option
    options.operator = 'metrological'; // Todo: make this configurable (via url?)
    // add type (= url or qr) as an option, with url as the value
    options[type] = url;

    return Object.keys(options)
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent('' + options[key])
      })
      .join('&')
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
   * Copyright 2020 RDK Management
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
   * Copyright 2020 RDK Management
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

  const events = [
    'timeupdate',
    'error',
    'ended',
    'loadeddata',
    'canplay',
    'play',
    'playing',
    'pause',
    'loadstart',
    'seeking',
    'seeked',
    'encrypted',
  ];

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
      console.warn(
        [
          "The 'MediaPlayer'-plugin in the Lightning-SDK is deprecated and will be removed in future releases.",
          "Please consider using the new 'VideoPlayer'-plugin instead.",
          'https://rdkcentral.github.io/Lightning-SDK/#/plugins/videoplayer',
        ].join('\n\n')
      );
    }

    static _template() {
      return {
        Video: {
          VideoWrap: {
            VideoTexture: {
              visible: false,
              pivot: 0.5,
              texture: { type: lng$1.textures.StaticTexture, options: {} },
            },
          },
        },
      }
    }

    set skipRenderToTexture(v) {
      this._skipRenderToTexture = v;
    }

    get textureMode() {
      return this._textureMode
    }

    get videoView() {
      return this.tag('Video')
    }

    _init() {
      //re-use videotag if already there
      const videoEls = document.getElementsByTagName('video');
      if (videoEls && videoEls.length > 0) this.videoEl = videoEls[0];
      else {
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
            this._metrics[event]({ currentTime: this.videoEl.currentTime });
          }
          this.fire(event, { videoElement: this.videoEl, event: e });
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

      this.videoTexture.options = { source: glTexture, w: this.videoEl.width, h: this.videoEl.height };
    }

    _startUpdatingVideoTexture() {
      if (this.textureMode && !this._skipRenderToTexture) {
        const stage = this.stage;
        if (!this._updateVideoTexture) {
          this._updateVideoTexture = () => {
            if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
              const gl = stage.gl;

              const currentTime = new Date().getTime();

              // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
              // We'll fallback to fixed 30fps in this case.
              const frameCount = this.videoEl.webkitDecodedFrameCount;

              const mustUpdate = frameCount
                ? this._lastFrame !== frameCount
                : this._lastTime < currentTime - 30;

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
          navigator
            .requestMediaKeySystemAccess(
              settings.stream.keySystem.id,
              settings.stream.keySystem.config
            )
            .then(keySystemAccess => {
              return keySystemAccess.createMediaKeys()
            })
            .then(createdMediaKeys => {
              return this.videoEl.setMediaKeys(createdMediaKeys)
            })
            .then(() => {
              if (settings.stream && settings.stream.src) this.open(settings.stream.src);
            })
            .catch(() => {
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
                  return false
                }
              };
            }
            if (window.Hls.isSupported()) {
              if (!this._hls) this._hls = new window.Hls({ liveDurationInfinity: true });
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

    open(url, settings = { hide: false, videoPosition: null }) {
      // prep the media url to play depending on platform (mediaPlayerplugin)
      url = mediaUrl$1(url);
      this._metrics = Metrics$1.media(url);
      Log.info('Playing stream', url);
      if (this.application.noVideo) {
        Log.info('noVideo option set, so ignoring: ' + url);
        return
      }
      // close the video when opening same url as current (effectively reloading)
      if (this.videoEl.getAttribute('src') === url) {
        this.close();
      }
      this.videoEl.setAttribute('src', url);

      // force hide, then force show (in next tick!)
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
      this.videoEl.removeAttribute('src');

      // force load to reset everything without errors
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
      return this.videoEl.muted
    }

    set muted(v) {
      this.videoEl.muted = v;
    }

    get loop() {
      return this.videoEl.loop
    }

    set loop(v) {
      this.videoEl.loop = v;
    }

    isPlaying() {
      return this._getState() === 'Playing'
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
      return Promise.resolve(this.videoEl.currentTime)
    }

    setPosition(pos) {
      this.videoEl.currentTime = pos;
    }

    getDuration() {
      return Promise.resolve(this.videoEl.duration)
    }

    seek(time, absolute = false) {
      if (absolute) {
        this.videoEl.currentTime = time;
      } else {
        this.videoEl.currentTime += time;
      }
    }

    get videoTextureView() {
      return this.tag('Video').tag('VideoTexture')
    }

    get videoTexture() {
      return this.videoTextureView.texture
    }

    _setVideoArea(videoPos) {
      if (lng$1.Utils.equalValues(this._videoPos, videoPos)) {
        return
      }

      this._videoPos = videoPos;

      if (this.textureMode) {
        this.videoTextureView.patch({
          smooth: {
            x: videoPos[0],
            y: videoPos[1],
            w: videoPos[2] - videoPos[0],
            h: videoPos[3] - videoPos[1],
          },
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
      if (!buf1 || !buf2) return false
      if (buf1.byteLength != buf2.byteLength) return false
      const dv1 = new Int8Array(buf1);
      const dv2 = new Int8Array(buf2);
      for (let i = 0; i != buf1.byteLength; i++) if (dv1[i] != dv2[i]) return false
      return true
    }

    error(args) {
      this._fireConsumer('$mediaplayerError', args);
      this._setState('');
      return ''
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
        duration: this.videoEl.duration || 1,
      });
    }

    seeking() {
      this._fireConsumer('$mediaplayerSeeking', {
        currentTime: this.videoEl.currentTime,
        duration: this.videoEl.duration || 1,
      });
    }

    durationchange(args) {
      this._fireConsumer('$mediaplayerDurationChange', args);
    }

    encrypted(args) {
      const video = args.videoElement;
      const event = args.event;
      // FIXME: Double encrypted events need to be properly filtered by Gstreamer
      if (video.mediaKeys && !this._equalInitData(this._previousInitData, event.initData)) {
        this._previousInitData = event.initData;
        this._fireConsumer('$mediaplayerEncrypted', args);
      }
    }

    static _states() {
      return [
        class Playing extends this {
          $enter() {
            this._startUpdatingVideoTexture();
          }
          $exit() {
            this._stopUpdatingVideoTexture();
          }
          timeupdate() {
            this._fireConsumer('$mediaplayerProgress', {
              currentTime: this.videoEl.currentTime,
              duration: this.videoEl.duration || 1,
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
            return [class Paused extends this {}]
          }
        },
      ]
    }
  }

  class localCookie{constructor(e){return e=e||{},this.forceCookies=e.forceCookies||!1,!0===this._checkIfLocalStorageWorks()&&!0!==e.forceCookies?{getItem:this._getItemLocalStorage,setItem:this._setItemLocalStorage,removeItem:this._removeItemLocalStorage,clear:this._clearLocalStorage}:{getItem:this._getItemCookie,setItem:this._setItemCookie,removeItem:this._removeItemCookie,clear:this._clearCookies}}_checkIfLocalStorageWorks(){if("undefined"==typeof localStorage)return !1;try{return localStorage.setItem("feature_test","yes"),"yes"===localStorage.getItem("feature_test")&&(localStorage.removeItem("feature_test"),!0)}catch(e){return !1}}_getItemLocalStorage(e){return window.localStorage.getItem(e)}_setItemLocalStorage(e,t){return window.localStorage.setItem(e,t)}_removeItemLocalStorage(e){return window.localStorage.removeItem(e)}_clearLocalStorage(){return window.localStorage.clear()}_getItemCookie(e){var t=document.cookie.match(RegExp("(?:^|;\\s*)"+function(e){return e.replace(/([.*+?\^${}()|\[\]\/\\])/g,"\\$1")}(e)+"=([^;]*)"));return t&&""===t[1]&&(t[1]=null),t?t[1]:null}_setItemCookie(e,t){var o=new Date,r=new Date(o.getTime()+15768e7);document.cookie=`${e}=${t}; expires=${r.toUTCString()};`;}_removeItemCookie(e){document.cookie=`${e}=;Max-Age=-99999999;`;}_clearCookies(){document.cookie.split(";").forEach(e=>{document.cookie=e.replace(/^ +/,"").replace(/=.*/,"=;expires=Max-Age=-99999999");});}}

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
    namespace = Settings.get('platform', 'id');
    // todo: pass options (for example to force the use of cookies)
    lc = new localCookie();
  };

  const namespacedKey = key => (namespace ? [namespace, key].join('.') : key);

  var Storage = {
    get(key) {
      try {
        return JSON.parse(lc.getItem(namespacedKey(key)))
      } catch (e) {
        return null
      }
    },
    set(key, value) {
      try {
        lc.setItem(namespacedKey(key), JSON.stringify(value));
        return true
      } catch (e) {
        return false
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
    },
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
    return typeof v === 'function'
  };

  const isObject = v => {
    return typeof v === 'object' && v !== null
  };

  const isBoolean = v => {
    return typeof v === 'boolean'
  };

  const isPage = v => {
    if (v instanceof lng$1.Element || isComponentConstructor(v)) {
      return true
    }
    return false
  };

  const isComponentConstructor = type => {
    return type.prototype && 'isComponent' in type.prototype
  };

  const isArray = v => {
    return Array.isArray(v)
  };

  const ucfirst = v => {
    return `${v.charAt(0).toUpperCase()}${v.slice(1)}`
  };

  const isString = v => {
    return typeof v === 'string'
  };

  const isPromise = (method, args) => {
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
    return isObject(result) && isFunction(result.then)
  };

  const getConfigMap = () => {
    const routerSettings = Settings.get('platform', 'router');
    const isObj = isObject(routerSettings);
    return [
      'backtrack',
      'gcOnUnload',
      'destroyOnHistoryBack',
      'lazyCreate',
      'lazyDestroy',
      'reuseInstance',
      'autoRestoreRemote',
      'numberNavigation',
      'updateHash',
    ].reduce((config, key) => {
      config.set(key, isObj ? routerSettings[key] : Settings.get('platform', key));
      return config
    }, new Map())
  };

  const incorrectParams = (cb, route) => {
    const isIncorrect = /^\w*?\s?\(\s?\{.*?\}\s?\)/i;
    if (isIncorrect.test(cb.toString())) {
      console.warn(
        [
          `DEPRECATION: The data-provider for route: ${route} is not correct.`,
          '"page" is no longer a property of the params object but is now the first function parameter: ',
          'https://github.com/rdkcentral/Lightning-SDK/blob/feature/router/docs/plugins/router/dataproviding.md#data-providing',
          "It's supported for now but will be removed in a future release.",
        ].join('\n')
      );
      return true
    }
    return false
  };

  const getQueryStringParams = hash => {
    const getQuery = /([?&].*)/;
    const matches = getQuery.exec(hash);
    const params = {};

    if (matches && matches.length) {
      const urlParams = new URLSearchParams(matches[1]);
      for (const [key, value] of urlParams.entries()) {
        params[key] = value;
      }
      return params
    }
    return false
  };

  const symbols = {
    route: Symbol('route'),
    hash: Symbol('hash'),
    store: Symbol('store'),
    fromHistory: Symbol('fromHistory'),
    expires: Symbol('expires'),
    resume: Symbol('resume'),
    backtrack: Symbol('backtrack'),
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
          alpha: [1, { duration: 0.5, delay: 0.1 }],
        },
      });
      // resolve on y finish
      i.transition('alpha').on('finish', () => {
        if (o) {
          o.visible = false;
        }
        resolve();
      });
    })
  };

  const crossFade = (i, o) => {
    return new Promise(resolve => {
      i.patch({
        alpha: 0,
        visible: true,
        smooth: {
          alpha: [1, { duration: 0.5, delay: 0.1 }],
        },
      });
      if (o) {
        o.patch({
          smooth: {
            alpha: [0, { duration: 0.5, delay: 0.3 }],
          },
        });
      }
      // resolve on y finish
      i.transition('alpha').on('finish', () => {
        resolve();
      });
    })
  };

  const moveOnAxes = (axis, direction, i, o) => {
    const bounds = axis === 'x' ? 1920 : 1080;
    return new Promise(resolve => {
      i.patch({
        [`${axis}`]: direction ? bounds * -1 : bounds,
        visible: true,
        smooth: {
          [`${axis}`]: [0, { duration: 0.4, delay: 0.2 }],
        },
      });
      // out is optional
      if (o) {
        o.patch({
          [`${axis}`]: 0,
          smooth: {
            [`${axis}`]: [direction ? bounds : bounds * -1, { duration: 0.4, delay: 0.2 }],
          },
        });
      }
      // resolve on y finish
      i.transition(axis).on('finish', () => {
        resolve();
      });
    })
  };

  const up = (i, o) => {
    return moveOnAxes('y', 0, i, o)
  };

  const down = (i, o) => {
    return moveOnAxes('y', 1, i, o)
  };

  const left = (i, o) => {
    return moveOnAxes('x', 0, i, o)
  };

  const right = (i, o) => {
    return moveOnAxes('x', 1, i, o)
  };

  var Transitions = {
    fade,
    crossFade,
    up,
    down,
    left,
    right,
  };

  var isMergeableObject = function isMergeableObject(value) {
  	return isNonNullObject(value)
  		&& !isSpecial(value)
  };

  function isNonNullObject(value) {
  	return !!value && typeof value === 'object'
  }

  function isSpecial(value) {
  	var stringValue = Object.prototype.toString.call(value);

  	return stringValue === '[object RegExp]'
  		|| stringValue === '[object Date]'
  		|| isReactElement(value)
  }

  // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
  var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
  var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

  function isReactElement(value) {
  	return value.$$typeof === REACT_ELEMENT_TYPE
  }

  function emptyTarget(val) {
  	return Array.isArray(val) ? [] : {}
  }

  function cloneUnlessOtherwiseSpecified(value, options) {
  	return (options.clone !== false && options.isMergeableObject(value))
  		? deepmerge(emptyTarget(value), value, options)
  		: value
  }

  function defaultArrayMerge(target, source, options) {
  	return target.concat(source).map(function(element) {
  		return cloneUnlessOtherwiseSpecified(element, options)
  	})
  }

  function getMergeFunction(key, options) {
  	if (!options.customMerge) {
  		return deepmerge
  	}
  	var customMerge = options.customMerge(key);
  	return typeof customMerge === 'function' ? customMerge : deepmerge
  }

  function getEnumerableOwnPropertySymbols(target) {
  	return Object.getOwnPropertySymbols
  		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
  			return target.propertyIsEnumerable(symbol)
  		})
  		: []
  }

  function getKeys(target) {
  	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
  }

  function propertyIsOnObject(object, property) {
  	try {
  		return property in object
  	} catch(_) {
  		return false
  	}
  }

  // Protects from prototype poisoning and unexpected merging up the prototype chain.
  function propertyIsUnsafe(target, key) {
  	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
  		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
  			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
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
  			return
  		}

  		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
  			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
  		} else {
  			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
  		}
  	});
  	return destination
  }

  function deepmerge(target, source, options) {
  	options = options || {};
  	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
  	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
  	// implementations can use it. The caller may not replace it.
  	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

  	var sourceIsArray = Array.isArray(source);
  	var targetIsArray = Array.isArray(target);
  	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  	if (!sourceAndTargetTypesMatch) {
  		return cloneUnlessOtherwiseSpecified(source, options)
  	} else if (sourceIsArray) {
  		return options.arrayMerge(target, source, options)
  	} else {
  		return mergeObject(target, source, options)
  	}
  }

  deepmerge.all = function deepmergeAll(array, options) {
  	if (!Array.isArray(array)) {
  		throw new Error('first argument should be an array')
  	}

  	return array.reduce(function(prev, next) {
  		return deepmerge(prev, next, options)
  	}, {})
  };

  var deepmerge_1 = deepmerge;

  var cjs = deepmerge_1;

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
      console.warn(
        [
          "The 'Locale'-plugin in the Lightning-SDK is deprecated and will be removed in future releases.",
          "Please consider using the new 'Language'-plugin instead.",
          'https://rdkcentral.github.io/Lightning-SDK/#/plugins/language',
        ].join('\n\n')
      );
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
        return
      }

      await fetch(path)
        .then(resp => resp.json())
        .then(resp => {
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
      return this.__trObj[this.language]
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
          throw Error(error)
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
      return new LocalizedString(sub)
    }
  }

  var Locale$1 = new Locale();

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
            lineHeight: 26,
          },
        },
      }
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
   * Copyright 2020 RDK Management
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
          color: 0xff008000,
        },
        Counter: {
          w: w => w,
          h: h => h,
          y: 10,
          text: {
            fontSize: 32,
            textAlign: 'center',
          },
        },
        Text: {
          w: w => w,
          h: h => h,
          y: 48,
          text: {
            fontSize: 15,
            textAlign: 'center',
            text: 'FPS',
          },
        },
      }
    }

    _setup() {
      this.config = {
        ...{
          log: false,
          interval: 500,
          threshold: 1,
        },
        ...Settings.get('platform', 'showFps'),
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
      if (Math.abs(this.lastFps - this.fps) <= this.config.threshold) return
      this.lastFps = this.fps;
      // green
      let bgColor = 0xff008000;
      // orange
      if (this.fps <= 40 && this.fps > 20) bgColor = 0xffffa500;
      // red
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
   * Copyright 2020 RDK Management
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
      fetch(file)
        .then(response => response.json())
        .then(json => {
          setTranslations(json);
          // set language (directly or in a promise)
          typeof language === 'object' && 'then' in language && typeof language.then === 'function'
            ? language
                .then(lang =>
                  setLanguage(lang)
                    .then(resolve)
                    .catch(reject)
                )
                .catch(e => {
                  Log.error(e);
                  reject(e);
                })
            : setLanguage(language)
                .then(resolve)
                .catch(reject);
        })
        .catch(() => {
          const error = 'Language file ' + file + ' not found';
          Log.error(error);
          reject(error);
        });
    })
  };

  const setTranslations = obj => {
    if ('meta' in obj) {
      meta = { ...obj.meta };
      delete obj.meta;
    }
    translations = obj;
  };

  const getLanguage = () => {
    return language$1
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
          language$1 = meta.default;
          const error =
            'Translations for Language ' +
            language$1 +
            ' not found. Using default language ' +
            meta.default;
          Log.warn(error);
          reject(error);
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

          fetch(url)
            .then(response => response.json())
            .then(json => {
              // save the translations for this language (to prevent loading twice)
              translations[language$1] = json;
              dictionary = json;
              resolve();
            })
            .catch(e => {
              const error = 'Error while fetching ' + url;
              Log.error(error, e);
              reject(error);
            });
        }
      }
    })
  };

  var Language = {
    translate(key) {
      let replacements = [...arguments].slice(1);

      // no replacements so just translated string
      if (replacements.length === 0) {
        return (dictionary && dictionary[key]) || key
      } else {
        if (replacements.length === 1 && typeof replacements[0] === 'object') {
          replacements = replacements.pop();
        }

        return Object.keys(
          // maps array input to an object {0: 'item1', 1: 'item2'}
          Array.isArray(replacements) ? Object.assign({}, replacements) : replacements
        ).reduce((text, replacementKey) => {
          return text.replace(
            new RegExp('{\\s?' + replacementKey + '\\s?}', 'g'),
            replacements[replacementKey]
          )
        }, (dictionary && dictionary[key]) || key)
      }
    },

    translations(obj) {
      setTranslations(obj);
    },

    set(language) {
      return setLanguage(language)
    },

    get() {
      return getLanguage()
    },

    available() {
      const languageKeys = Object.keys(translations);
      return languageKeys.map(key => ({ code: key, name: (meta.names && meta.names[key]) || key }))
    },
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
    targets: [],
  };

  var Registry = {
    // Timeouts
    setTimeout(cb, timeout, ...params) {
      const timeoutId = setTimeout(
        () => {
          registry.timeouts = registry.timeouts.filter(id => id !== timeoutId);
          cb.apply(null, params);
        },
        timeout,
        params
      );
      Log.info('Set Timeout', 'ID: ' + timeoutId);
      registry.timeouts.push(timeoutId);
      return timeoutId
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
      const intervalId = setInterval(
        () => {
          registry.intervals = registry.intervals.filter(id => id !== intervalId);
          cb.apply(null, params);
        },
        interval,
        params
      );
      Log.info('Set Interval', 'ID: ' + intervalId);
      registry.intervals.push(intervalId);
      return intervalId
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
      let targetIndex =
        registry.targets.indexOf(target) > -1
          ? registry.targets.indexOf(target)
          : registry.targets.push(target) - 1;

      registry.eventListeners[targetIndex] = registry.eventListeners[targetIndex] || {};
      registry.eventListeners[targetIndex][event] = registry.eventListeners[targetIndex][event] || [];
      registry.eventListeners[targetIndex][event].push(handler);
      Log.info('Add eventListener', 'Target:', target, 'Event: ' + event, 'Handler:', handler);
    },

    removeEventListener(target, event, handler) {
      const targetIndex = registry.targets.indexOf(target);
      if (
        targetIndex > -1 &&
        registry.eventListeners[targetIndex] &&
        registry.eventListeners[targetIndex][event] &&
        registry.eventListeners[targetIndex][event].indexOf(handler) > -1
      ) {
        registry.eventListeners[targetIndex][event] = registry.eventListeners[targetIndex][
          event
        ].filter(fn => fn !== handler);
        Log.info('Remove eventListener', 'Target:', target, 'Event: ' + event, 'Handler:', handler);
        target.removeEventListener(event, handler);
      } else {
        Log.error(
          'Remove eventListener',
          'Not found',
          'Target',
          target,
          'Event: ' + event,
          'Handler',
          handler
        );
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
    },
  };

  var version = "3.2.1";

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
    stage: { w: 1920, h: 1080, clearColor: 0x00000000, canvas2d: false },
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
      191: 'Search', // Use "/" for keyboard
      409: 'Search',
    },
  };

  if (window.innerHeight === 720) {
    defaultOptions.stage['w'] = 1280;
    defaultOptions.stage['h'] = 720;
    defaultOptions.stage['precision'] = 0.6666666667;
  }

  function Application(App, appData, platformSettings) {
    return class Application extends lng$1.Application {
      constructor(options) {
        const config = cjs(defaultOptions, options);
        super(config);
        this.config = config;
      }

      static _template() {
        return {
          w: 1920,
          h: 1080,
        }
      }

      _setup() {
        Promise.all([
          this.loadFonts((App.config && App.config.fonts) || (App.getFonts && App.getFonts()) || []),
          // to be deprecated
          Locale$1.load((App.config && App.config.locale) || (App.getLocale && App.getLocale())),
          App.language && this.loadLanguage(App.language()),
        ])
          .then(() => {
            Metrics$1.app.loaded();

            AppInstance = this.stage.c({
              ref: 'App',
              type: App,
              zIndex: 1,
              forceZIndexContext: !!platformSettings.showVersion || !!platformSettings.showFps,
            });

            this.childList.a(AppInstance);

            Log.info('App version', this.config.version);
            Log.info('SDK version', version);

            if (platformSettings.showVersion) {
              this.childList.a({
                ref: 'VersionLabel',
                type: VersionLabel,
                version: this.config.version,
                sdkVersion: version,
                zIndex: 1,
              });
            }

            if (platformSettings.showFps) {
              this.childList.a({
                ref: 'FpsCounter',
                type: FpsIndicator,
                zIndex: 1,
              });
            }

            super._setup();
          })
          .catch(console.error);
      }

      _handleBack() {
        this.closeApp();
      }

      _handleExit() {
        this.closeApp();
      }

      closeApp() {
        Log.info('Closing App');

        Settings.clearSubscribers();
        Registry.clear();

        if (platformSettings.onClose && typeof platformSettings.onClose === 'function') {
          platformSettings.onClose(...arguments);
        } else {
          this.close();
        }
      }

      close() {
        Log.info('Closing App');
        this.childList.remove(this.tag('App'));

        // force texture garbage collect
        this.stage.gc();
        this.destroy();
      }

      loadFonts(fonts) {
        return new Promise((resolve, reject) => {
          fonts
            .map(({ family, url, descriptors }) => () => {
              const fontFace = new FontFace(family, 'url(' + url + ')', descriptors || {});
              document.fonts.add(fontFace);
              return fontFace.load()
            })
            .reduce((promise, method) => {
              return promise.then(() => method())
            }, Promise.resolve(null))
            .then(resolve)
            .catch(reject);
        })
      }

      loadLanguage(config) {
        let file = Utils.asset('translations.json');
        let language = config;

        if (typeof language === 'object') {
          language = config.language || null;
          file = config.file || file;
        }

        return initLanguage(file, language)
      }

      set focus(v) {
        this._focussed = v;
        this._refocus();
      }

      _getFocused() {
        return this._focussed || this.tag('App')
      }
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
          forceZIndexContext: true,
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
              text: 'Loading..',
            },
          },
        },
      }
    }

    static _states() {
      return [
        class Loading extends this {
          $enter() {
            this.tag('Loading').visible = true;
          }

          $exit() {
            this.tag('Loading').visible = false;
          }
        },
        class Widgets extends this {
          $enter(args, widget) {
            // store widget reference
            this._widget = widget;

            // since it's possible that this behaviour
            // is non-remote driven we force a recalculation
            // of the focuspath
            this._refocus();
          }

          _getFocused() {
            // we delegate focus to selected widget
            // so it can consume remotecontrol presses
            return this._widget
          }

          // if we want to widget to widget focus delegation
          reload(widget) {
            this._widget = widget;
            this._refocus();
          }

          _handleKey() {
            restore();
          }
        },
      ]
    }

    /**
     * Return location where pages need to be stored
     */
    get pages() {
      return this.tag('Pages')
    }

    /**
     * Tell router where widgets are stored
     */
    get widgets() {
      return this.tag('Widgets')
    }

    /**
     * we MUST register _handleBack method so the Router
     * can override it
     * @private
     */
    _handleBack() {}

    /**
     * we MUST register _captureKey for dev quick-navigation
     * (via keyboard 1-9)
     */
    _captureKey() {}

    /**
     * We MUST return Router.activePage() so the new Page
     * can listen to the remote-control.
     */
    _getFocused() {
      return getActivePage()
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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

  const running = new Map();
  const resolved = new Map();
  const expired = new Map();
  const rejected = new Map();
  const active = new Map();

  const send$1 = (hash, key, value) => {
    if (!Settings.get('platform', 'stats')) {
      return
    }
    if (!key && !value) {
      if (!running.has(hash)) {
        running.set(hash, {
          start: Date.now(),
        });
      }
    } else {
      if (running.has(hash)) {
        if (key && value) {
          const payload = running.get(hash);
          payload[key] = value;
        }
      }
    }
    if (key && commands[key]) {
      const command = commands[key];
      if (command) {
        command.call(null, hash);
      }
    }
  };

  const move = (hash, bucket, args) => {
    if (active.has(hash)) {
      const payload = active.get(hash);
      const route = payload.route;

      // we group by route so store
      // the hash in the payload
      payload.hash = hash;

      if (isObject(args)) {
        Object.keys(args).forEach(prop => {
          payload[prop] = args[prop];
        });
      }
      if (bucket.has(route)) {
        const records = bucket.get(route);
        records.push(payload);
        bucket.set(route, records);
      } else {
        // we add by route and group all
        // resolved hashes against that route
        bucket.set(route, [payload]);
      }
      active.delete(hash);
    }
  };

  const commands = {
    ready: hash => {
      if (running.has(hash)) {
        const payload = running.get(hash);
        payload.ready = Date.now();
        active.set(hash, payload);

        running.delete(hash);
      }
    },
    stop: hash => {
      move(hash, resolved, {
        stop: Date.now(),
      });
    },
    error: hash => {
      move(hash, rejected, {
        error: Date.now(),
      });
    },
    expired: hash => {
      move(hash, expired, {
        expired: Date.now,
      });
    },
  };

  const output = (label, bucket) => {
    Log.info(`Output: ${label}`, bucket);
    for (let [route, records] of bucket.entries()) {
      Log.debug(`route: ${route}`, records);
    }
  };

  let getStats = () => {
    output('Resolved', resolved);
    output('Expired', expired);
    output('Rejected', rejected);
    output('Expired', expired);
    output('Still active', active);
    output('Still running', running);
  };

  var stats = {
    send: send$1,
    getStats,
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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

  let getHash = () => {
    return document.location.hash
  };

  let setHash = url => {
    document.location.hash = url;
  };

  const initRouter = config => {
    if (config.getHash) {
      getHash = config.getHash;
    }
    if (config.setHash) {
      setHash = config.setHash;
    }
  };

  /*
  rouThor ==[x]
   */

  // instance of Lightning.Application
  let application;

  //instance of Lightning.Component
  let app;

  let stage;
  let widgetsHost;
  let pagesHost;

  const pages = new Map();
  const providers = new Map();
  const modifiers = new Map();
  const widgetsPerRoute = new Map();
  const routeHooks = new Map();

  let register$1 = new Map();
  let routerConfig;

  // widget that has focus
  let activeWidget;
  let rootHash;
  let bootRequest;
  let history = [];
  let initialised = false;
  let activeRoute;
  let activeHash;
  let updateHash = true;
  let forcedHash;
  let lastHash = true;
  let previousState;

  // page that has focus
  let activePage;
  const hasRegex = /\{\/(.*?)\/([igm]{0,3})\}/g;
  const isWildcard = /^[!*$]$/;

  /**
   * Setup Page router
   * @param config - route config object
   * @param instance - instance of the app
   */
  const startRouter = (config, instance) => {
    // backwards compatible
    let { appInstance, routes, provider = () => {}, widgets = () => {} } = config;

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

    // test if required to host pages in a different child
    if (app.pages) {
      pagesHost = app.pages.childList;
    }

    // test if app uses widgets
    if (app.widgets && app.widgets.children) {
      widgetsHost = app.widgets.childList;
      // hide all widgets on boot
      widgetsHost.forEach(w => (w.visible = false));
    }

    // register step back handler
    app._handleBack = e => {
      step(-1);
      e.preventDefault();
    };

    // register step back handler
    app._captureKey = capture.bind(null);

    if (isArray(routes)) {
      setupRoutes(config);
      start();
    } else if (isFunction(routes)) {
      // register route data bindings
      provider();
      // register routes
      routes();
      // register widgets
      widgets();
    }
  };

  const setupRoutes = routesConfig => {
    let bootPage = routesConfig.bootComponent;

    if (!initialised) {
      rootHash = routesConfig.root;
      if (isFunction(routesConfig.boot)) {
        boot(routesConfig.boot);
      }
      if (bootPage && isPage(bootPage)) {
        route('@boot-page', routesConfig.bootComponent);
      }
      if (isBoolean(routesConfig.updateHash)) {
        updateHash = routesConfig.updateHash;
      }
      if (isFunction(routesConfig.beforeEachRoute)) {
        beforeEachRoute = routesConfig.beforeEachRoute;
      }
      initialised = true;
    }

    routesConfig.routes.forEach(r => {
      route(r.path, r.component || r.hook, r.options);
      if (r.widgets) {
        widget(r.path, r.widgets);
      }
      if (isFunction(r.on)) {
        on(r.path, r.on, r.cache || 0);
      }
      if (isFunction(r.before)) {
        before(r.path, r.before, r.cache || 0);
      }
      if (isFunction(r.after)) {
        after(r.path, r.after, r.cache || 0);
      }
      if (isFunction(r.beforeNavigate)) {
        hook(r.path, r.beforeNavigate);
      }
    });
  };

  /**
   * create a new route
   * @param route - {string}
   * @param type - {(Lightning.Component|Function()*)}
   * @param modifiers - {Object{}} - preventStorage | clearHistory | storeLast
   */
  const route = (route, type, config) => {
    route = route.replace(/\/+$/, '');
    // if the route is defined we try to push
    // the new type on to the stack
    if (pages.has(route)) {
      let stack = pages.get(route);
      if (!isArray(stack)) {
        stack = [stack];
      }

      // iterate stack and look if there is page instance
      // attached to the route
      const hasPage = stack.filter(o => isPage(o));
      if (hasPage.length) {
        // only allow multiple functions for route
        if (isFunction(type) && !isPage(type)) {
          stack.push(type);
        } else {
          console.warn(`Page for route('${route}') already exists`);
        }
      } else {
        if (isFunction(type)) {
          stack.push(type);
        } else {
          if (!routerConfig.get('lazyCreate')) {
            type = isComponentConstructor(type) ? create(type) : type;
            pagesHost.a(type);
          }
          stack.push(type);
        }
      }
      pages.set(route, stack);
    } else {
      if (isPage(type)) {
        // if flag lazy eq false we (test) and create
        // correct component and add it to the childList
        if (!routerConfig.get('lazyCreate')) {
          type = isComponentConstructor(type) ? create(type) : type;
          pagesHost.a(type);
        }
      }

      // if lazy we just store the constructor or function
      pages.set(route, [type]);

      // store router modifiers
      if (config) {
        modifiers.set(route, config);
      }
    }
  };

  /**
   * create a route and define it as root.
   * Upon boot we will automatically point browser hash
   * to the defined route
   * @param route - {string}
   * @param type - {(Lightning.Component|Function()*)}
   */
  const root = (url, type, config) => {
    rootHash = url.replace(/\/+$/, '');
    route(url, type, config);
  };

  /**
   * Define the widgets that need to become visible per route
   * @param url
   * @param widgets
   */
  const widget = (url, widgets = []) => {
    if (!widgetsPerRoute.has(url)) {
      if (!isArray(widgets)) {
        widgets = [widgets];
      }
      widgetsPerRoute.set(url, widgets);
    } else {
      console.warn(`Widgets already exist for ${url}`);
    }
  };

  const create = type => {
    const page = stage.c({ type, visible: false });
    // if the app has widgets we make them available
    // as an object on the app instance
    if (widgetsHost) {
      page.widgets = getWidgetReferences();
    }

    return page
  };

  /**
   * The actual loading of the component
   * @param {String} route - the route blueprint, used for data provider look up
   * @param {String} hash - current hash we're routing to
   * */
  const load = async ({ route, hash }) => {
    let expired = false;
    // for now we maintain one instance of the
    // navigation register and create a local copy
    // that we hand over to the loader
    const routeReg = new Map(register$1);
    try {
      const payload = await loader({ hash, route, routeReg });
      if (payload && payload.hash === lastHash) {
        // in case of on() providing we need to reset
        // app state;
        if (app.state === 'Loading') {
          if (previousState === 'Widgets') {
            app._setState('Widgets', [activeWidget]);
          } else {
            app._setState('');
          }
        }
        // Do page transition if instance
        // is not shared between the routes
        if (!payload.share) {
          await doTransition(payload.page, activePage);
        }
      } else {
        expired = true;
      }
      // on expired we only cleanup
      if (expired) {
        Log.debug('[router]:', `Rejected ${payload.hash} because route to ${lastHash} started`);
        if (payload.create && !payload.share) {
          // remove from render-tree
          pagesHost.remove(payload.page);
        }
      } else {
        onRouteFulfilled(payload, routeReg);
        // resolve promise
        return payload.page
      }
    } catch (payload) {
      if (!expired) {
        if (payload.create && !payload.share) {
          // remove from render-tree
          pagesHost.remove(payload.page);
        }
        handleError(payload);
      }
    }
  };

  const loader = async ({ route, hash, routeReg: register }) => {
    let type = getPageByRoute(route);
    let isConstruct = isComponentConstructor(type);
    let sharedInstance = false;
    let provide = false;
    let page = null;
    let isCreated = false;

    // if it's an instance bt we're not coming back from
    // history we test if we can re-use this instance
    if (!isConstruct && !register.get(symbols.backtrack)) {
      if (!mustReuse(route)) {
        type = type.constructor;
        isConstruct = true;
      }
    }

    // If type is not a constructor
    if (!isConstruct) {
      page = type;
      // if we have have a data route for current page
      if (providers.has(route)) {
        if (isPageExpired(type) || type[symbols.hash] !== hash) {
          provide = true;
        }
      }
      let currentRoute = activePage && activePage[symbols.route];
      // if the new route is equal to the current route it means that both
      // route share the Component instance and stack location / since this case
      // is conflicting with the way before() and after() loading works we flag it,
      // and check platform settings in we want to re-use instance
      if (route === currentRoute) {
        sharedInstance = true;
      }
    } else {
      page = create(type);
      pagesHost.a(page);
      // test if need to request data provider
      if (providers.has(route)) {
        provide = true;
      }
      isCreated = true;
    }

    // we store hash and route as properties on the page instance
    // that way we can easily calculate new behaviour on page reload
    page[symbols.hash] = hash;
    page[symbols.route] = route;

    const payload = {
      page,
      route,
      hash,
      register,
      create: isCreated,
      share: sharedInstance,
      event: [isCreated ? 'mounted' : 'changed'],
    };

    try {
      if (provide) {
        const { type: loadType } = providers.get(route);
        // update payload
        payload.loadType = loadType;

        // update statistics
        send(hash, `${loadType}-start`, Date.now());
        await triggers[sharedInstance ? 'shared' : loadType](payload);
        send(hash, `${loadType}-end`, Date.now());

        if (hash !== lastHash) {
          return false
        } else {
          emit$1(page, 'dataProvided');
          // resolve promise
          return payload
        }
      } else {
        addPersistData(payload);
        return payload
      }
    } catch (e) {
      payload.error = e;
      return Promise.reject(payload)
    }
  };

  /**
   * Will be called when a new navigate() request has completed
   * and has not been expired due to it's async nature
   * @param page
   * @param route
   * @param event
   * @param hash
   * @param register
   */
  const onRouteFulfilled = ({ page, route, event, hash, share }, register) => {
    // clean up history if modifier is set
    if (hashmod(hash, 'clearHistory')) {
      history.length = 0;
    } else if (activeHash && !isWildcard.test(route)) {
      updateHistory(activeHash);
    }

    // we only update the stackLocation if a route
    // is not expired before it resolves
    const location = getPageStackLocation(route);

    if (!isNaN(location)) {
      let stack = pages.get(route);
      stack[location] = page;
      pages.set(route, stack);
    }

    if (event) {
      emit$1(page, event);
    }

    // only update widgets if we have a host
    if (widgetsHost) {
      updateWidgets(page);
    }

    // force refocus of the app
    app._refocus();

    // we want to clean up if there is an
    // active page that is not being shared
    // between current and previous route
    if (activePage && !share) {
      cleanUp(activePage, activePage[symbols.route], register);
    }

    // flag this navigation cycle as ready
    send(hash, 'ready');

    activePage = page;
    activeRoute = route;
    activeHash = hash;

    Log.info('[route]:', route);
    Log.info('[hash]:', hash);
  };

  const triggerAfter = args => {
    // after() we execute the provider
    // and resolve immediately
    try {
      execProvider(args);
    } catch (e) {
      // we fail silently
    }
    return Promise.resolve()
  };

  const triggerBefore = args => {
    // before() we continue only when data resolved
    return execProvider(args)
  };

  const triggerOn = args => {
    // on() we need to place the app in
    // a Loading state and recover from it
    // on resolve
    previousState = app.state || '';
    app._setState('Loading');
    return execProvider(args)
  };

  const triggerShared = args => {
    return execProvider(args)
  };

  const triggers = {
    on: triggerOn,
    after: triggerAfter,
    before: triggerBefore,
    shared: triggerShared,
  };

  const hook = (route, handler) => {
    if (!routeHooks.has(route)) {
      routeHooks.set(route, handler);
    }
  };

  const emit$1 = (page, events = [], params = {}) => {
    if (!isArray(events)) {
      events = [events];
    }
    events.forEach(e => {
      const event = `_on${ucfirst(e)}`;
      if (isFunction(page[event])) {
        page[event](params);
      }
    });
  };

  const send = (hash, key, value) => {
    stats.send(hash, key, value);
  };

  const handleError = args => {
    if (!args.page) {
      console.error(args);
    } else {
      const hash = args.page[symbols.hash];
      // flag this navigation cycle as rejected
      send(hash, 'e', args.error);
      // force expire
      args.page[symbols.expires] = Date.now();
      if (pages.has('!')) {
        load({ route: '!', hash }).then(errorPage => {
          errorPage.error = { page: args.page, error: args.error };
          // on() loading type will force the app to go
          // in a loading state so on error we need to
          // go back to root state
          if (app.state === 'Loading') {
            app._setState('');
          }
          // make sure we delegate focus to the error page
          if (activePage !== errorPage) {
            activePage = errorPage;
            app._refocus();
          }
        });
      } else {
        Log.error(args.page, args.error);
      }
    }
  };

  const updateHistory = hash => {
    const storeHash = getMod(hash, 'store');
    const regStore = register$1.get(symbols.store);
    let configPrevent = hashmod(hash, 'preventStorage');
    let configStore = true;

    if ((isBoolean(storeHash) && storeHash === false) || configPrevent) {
      configStore = false;
    }

    if (regStore && configStore) {
      const toStore = hash.replace(/^\//, '');
      const location = history.indexOf(toStore);
      // store hash if it's not a part of history or flag for
      // storage of same hash is true
      if (location === -1 || routerConfig.get('storeSameHash')) {
        history.push(toStore);
      } else {
        // if we visit the same route we want to sync history
        history.push(history.splice(location, 1)[0]);
      }
    }
  };

  const mustReuse = route => {
    const mod = routemod(route, 'reuseInstance');
    const config = routerConfig.get('reuseInstance');

    // route always has final decision
    if (isBoolean(mod)) {
      return mod
    }
    return !(isBoolean(config) && config === false)
  };

  const boot = cb => {
    bootRequest = cb;
  };

  const addPersistData = ({ page, route, hash, register = new Map() }) => {
    const urlValues = getValuesFromHash(hash, route);
    const pageData = new Map([...urlValues, ...register]);
    const params = {};

    // make dynamic url data available to the page
    // as instance properties
    for (let [name, value] of pageData) {
      page[name] = value;
      params[name] = value;
    }

    // check navigation register for persistent data
    if (register.size) {
      const obj = {};
      for (let [k, v] of register) {
        obj[k] = v;
      }
      page.persist = obj;
    }

    // make url data and persist data available
    // via params property
    page.params = params;
    emit$1(page, ['urlParams'], params);

    return params
  };

  const execProvider = args => {
    const { cb, expires } = providers.get(args.route);
    const params = addPersistData(args);
    /**
     * In the first version of the Router, a reference to the page is made
     * available to the callback function as property of {params}.
     * Since this is error prone (named url parts are also being spread inside this object)
     * we made the page reference the first parameter and url values the second.
     * -
     * We keep it backwards compatible for now but a warning is showed in the console.
     */
    if (incorrectParams(cb, args.route)) {
      // keep page as params property backwards compatible for now
      return cb({ page: args.page, ...params }).then(() => {
        args.page[symbols.expires] = Date.now() + expires;
      })
    } else {
      return cb(args.page, { ...params }).then(() => {
        args.page[symbols.expires] = Date.now() + expires;
      })
    }
  };

  /**
   * execute transition between new / old page and
   * toggle the defined widgets
   * @todo: platform override default transition
   * @param pageIn
   * @param pageOut
   */
  const doTransition = (pageIn, pageOut = null) => {
    let transition = pageIn.pageTransition || pageIn.easing;

    const hasCustomTransitions = !!(pageIn.smoothIn || pageIn.smoothInOut || transition);
    const transitionsDisabled = routerConfig.get('disableTransitions');

    if (pageIn.easing) {
      console.warn('easing() method is deprecated and will be removed. Use pageTransition()');
    }
    // default behaviour is a visibility toggle
    if (!hasCustomTransitions || transitionsDisabled) {
      pageIn.visible = true;
      if (pageOut) {
        pageOut.visible = false;
      }
      return Promise.resolve()
    }

    if (transition) {
      let type;
      try {
        type = transition.call(pageIn, pageIn, pageOut);
      } catch (e) {
        type = 'crossFade';
      }

      if (isPromise(type)) {
        return type
      }

      if (isString(type)) {
        const fn = Transitions[type];
        if (fn) {
          return fn(pageIn, pageOut)
        }
      }

      // keep backwards compatible for now
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
          })
        };
        return pageIn.smoothIn({ pageIn, smooth })
      }
    }

    return Transitions.crossFade(pageIn, pageOut)
  };

  /**
   * update the visibility of the available widgets
   * for the current page / route
   * @param page
   */
  const updateWidgets = page => {
    const route = page[symbols.route];

    // force lowercase lookup
    const configured = (widgetsPerRoute.get(route) || []).map(ref => ref.toLowerCase());

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

  const cleanUp = (page, route, register) => {
    const lazyDestroy = routerConfig.get('lazyDestroy');
    const destroyOnBack = routerConfig.get('destroyOnHistoryBack');
    const keepAlive = read('keepAlive', register);
    const isFromHistory = read(symbols.backtrack, register);
    let doCleanup = false;

    if (isFromHistory && (destroyOnBack || lazyDestroy)) {
      doCleanup = true;
    } else if (lazyDestroy && !keepAlive) {
      doCleanup = true;
    }

    if (doCleanup) {
      // in lazy create mode we store constructor
      // and remove the actual page from host
      const stack = pages.get(route);
      const location = getPageStackLocation(route);

      // grab original class constructor if statemachine routed
      // else store constructor
      stack[location] = page._routedType || page.constructor;
      pages.set(route, stack);

      // actual remove of page from memory
      pagesHost.remove(page);

      // force texture gc() if configured
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
        visible: false,
      });
    }
    send(page[symbols.hash], 'stop');
  };

  /**
   * Test if page passed cache-time
   * @param page
   * @returns {boolean}
   */
  const isPageExpired = page => {
    if (!page[symbols.expires]) {
      return false
    }

    const expires = page[symbols.expires];
    const now = Date.now();

    return now >= expires
  };

  const getPageByRoute = route => {
    return getPageFromStack(route).item
  };

  /**
   * Returns the current location of a page constructor or
   * page instance for a route
   * @param route
   */
  const getPageStackLocation = route => {
    return getPageFromStack(route).index
  };

  const getPageFromStack = route => {
    if (!pages.has(route)) {
      return false
    }

    let index = -1;
    let item = null;
    let stack = pages.get(route);
    if (!Array.isArray(stack)) {
      stack = [stack];
    }

    for (let i = 0, j = stack.length; i < j; i++) {
      if (isPage(stack[i])) {
        index = i;
        item = stack[i];
        break
      }
    }

    return { index, item }
  };

  /**
   * Simple route length calculation
   * @param route {string}
   * @returns {number} - floor
   */
  const getFloor = route => {
    return stripRegex(route).split('/').length
  };

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
    return route
  };

  /**
   * return all stored routes that live on the same floor
   * @param floor
   * @returns {Array}
   */
  const getRoutesByFloor = floor => {
    const matches = [];
    // simple filter of level candidates
    for (let [route] of pages.entries()) {
      if (getFloor(route) === floor) {
        matches.push(route);
      }
    }
    return matches
  };

  /**
   * return a matching route by provided hash
   * hash: home/browse/12 will match:
   * route: home/browse/:categoryId
   * @param hash {string}
   * @returns {string|boolean} - route
   */
  const getRouteByHash = hash => {
    const getUrlParts = /(\/?:?[@\w%\s:-]+)/g;
    // grab possible candidates from stored routes
    const candidates = getRoutesByFloor(getFloor(hash));
    // break hash down in chunks
    const hashParts = hash.match(getUrlParts) || [];
    // test if the part of the hash has a replace
    // regex lookup id
    const hasLookupId = /\/:\w+?@@([0-9]+?)@@/;
    const isNamedGroup = /^\/:/;

    // to simplify the route matching and prevent look around
    // in our getUrlParts regex we get the regex part from
    // route candidate and store them so that we can reference
    // them when we perform the actual regex against hash
    let regexStore = [];

    let matches = candidates.filter(route => {
      let isMatching = true;

      if (isWildcard.test(route)) {
        return false
      }

      // replace regex in route with lookup id => @@{storeId}@@
      if (hasRegex.test(route)) {
        const regMatches = route.match(hasRegex);
        if (regMatches && regMatches.length) {
          route = regMatches.reduce((fullRoute, regex) => {
            const lookupId = regexStore.length;
            fullRoute = fullRoute.replace(regex, `@@${lookupId}@@`);
            regexStore.push(regex.substring(1, regex.length - 1));
            return fullRoute
          }, route);
        }
      }

      const routeParts = route.match(getUrlParts) || [];

      for (let i = 0, j = routeParts.length; i < j; i++) {
        const routePart = routeParts[i];
        const hashPart = hashParts[i];

        // Since we support catch-all and regex driven name groups
        // we first test for regex lookup id and see if the regex
        // matches the value from the hash
        if (hasLookupId.test(routePart)) {
          const routeMatches = hasLookupId.exec(routePart);
          const storeId = routeMatches[1];
          const routeRegex = regexStore[storeId];

          // split regex and modifiers so we can use both
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
          continue
        } else if (hashPart && routePart.toLowerCase() !== hashPart.toLowerCase()) {
          isMatching = false;
        }
      }
      return isMatching
    });

    if (matches.length) {
      // we give prio to static routes over dynamic
      matches = matches.sort(a => {
        return isNamedGroup.test(a) ? -1 : 1
      });
      return matches[0]
    }

    return false
  };

  /**
   * Extract dynamic values from location hash and return a namedgroup
   * of key (from route) value (from hash) pairs
   * @param hash {string} - the actual location hash
   * @param route {string} - the route as defined in route
   */
  const getValuesFromHash = (hash, route) => {
    // replace the regex definition from the route because
    // we already did the matching part
    route = stripRegex(route, '');

    const getUrlParts = /(\/?:?[\w%\s:-]+)/g;
    const hashParts = hash.match(getUrlParts) || [];
    const routeParts = route.match(getUrlParts) || [];
    const getNamedGroup = /^\/:([\w-]+)\/?/;

    return routeParts.reduce((storage, value, index) => {
      const match = getNamedGroup.exec(value);
      if (match && match.length) {
        storage.set(match[1], decodeURIComponent(hashParts[index].replace(/^\//, '')));
      }
      return storage
    }, new Map())
  };

  /**
   * Will be called before a route starts, can be overridden
   * via routes config
   * @param from - route we came from
   * @param to - route we navigate to
   * @returns {Promise<*>}
   */
  let beforeEachRoute = async (from, to) => {
    return true
  };

  const handleHashChange = async override => {
    const hash = override || getHash();
    const route = getRouteByHash(hash);

    let result = (await beforeEachRoute(activeRoute, route)) || true;

    // test if a local hook is configured for the route
    if (routeHooks.has(route)) {
      const handler = routeHooks.get(route);
      result = (await handler()) || true;
    }

    if (isBoolean(result)) {
      // only if resolve value is explicitly true
      // we continue the current route request
      if (result) {
        return resolveHashChange(hash, route)
      }
    } else if (isString(result)) {
      navigate(result);
    } else if (isObject(result)) {
      navigate(result.path, result.params);
    }
  };

  const resolveHashChange = (hash, route) => {
    // add a new record for page statistics
    send(hash);

    // store last requested hash so we can
    // prevent a route that resolved later
    // from displaying itself
    lastHash = hash;

    if (route) {
      // would be strange if this fails but we do check
      if (pages.has(route)) {
        let stored = pages.get(route);
        send(hash, 'route', route);

        if (!isArray(stored)) {
          stored = [stored];
        }

        stored.forEach((type, idx, stored) => {
          if (isPage(type)) {
            load({ route, hash }).then(() => {
              app._refocus();
            });
          } else if (isPromise(type)) {
            type()
              .then(contents => {
                return contents.default
              })
              .then(module => {
                // flag dynamic as loaded
                stored[idx] = module;

                return load({ route, hash })
              })
              .then(() => {
                app._refocus();
              });
          } else {
            const urlParams = getValuesFromHash(hash, route);
            const params = {};
            for (const key of urlParams.keys()) {
              params[key] = urlParams.get(key);
            }

            // invoke
            type.call(null, app, { ...params });
          }
        });
      }
    } else {
      if (pages.has('*')) {
        load({ route: '*', hash }).then(() => {
          app._refocus();
        });
      }
    }
  };

  const getMod = (hash, key) => {
    const config = modifiers.get(getRouteByHash(hash));
    if (isObject(config)) {
      return config[key]
    }
  };

  const hashmod = (hash, key) => {
    return routemod(getRouteByHash(hash), key)
  };

  const routemod = (route, key) => {
    if (modifiers.has(route)) {
      const config = modifiers.get(route);
      return config[key]
    }
  };

  const read = (flag, register) => {
    if (register.has(flag)) {
      return register.get(flag)
    }
    return false
  };

  const createRegister = flags => {
    const reg = new Map()
    // store user defined and router
    // defined flags in register
    ;[...Object.keys(flags), ...Object.getOwnPropertySymbols(flags)].forEach(key => {
      reg.set(key, flags[key]);
    });
    return reg
  };

  const navigate = (url, args, store = true) => {
    let hash = getHash();

    // for now we use one register instance and create a local
    // copy for the loader
    register$1.clear();

    if (!mustUpdateHash() && forcedHash) {
      hash = forcedHash;
    }

    if (isObject(args)) {
      register$1 = createRegister(args);
    } else if (isBoolean(args) && !args) {
      // if explicit set to false we don't want
      // to store the route
      store = args;
    }

    // we only store complete routes, so we set
    // a special register flag
    register$1.set(symbols.store, store);

    if (hash.replace(/^#/, '') !== url) {
      if (!mustUpdateHash()) {
        forcedHash = url;
        handleHashChange(url);
      } else {
        setHash(url);
      }
    } else if (read('reload', register$1)) {
      handleHashChange(hash);
    }
  };

  /**
   * Directional step in history
   * @param direction
   */
  const step = (direction = 0) => {
    if (!direction) {
      return false
    }

    // is we still have routes in our history
    // we splice the last of and navigate to that route
    if (history.length) {
      // for now we only support history back
      const route = history.splice(history.length - 1, 1);
      return navigate(route[0], { [symbols.backtrack]: true }, false)
    } else if (routerConfig.get('backtrack')) {
      const hashLastPart = /(\/:?[\w%\s-]+)$/;
      let hash = stripRegex(getHash());
      let floor = getFloor(hash);

      // test if we got deeplinked
      if (floor > 1) {
        while (floor--) {
          // strip of last part
          hash = hash.replace(hashLastPart, '');
          // if we have a configured route
          // we navigate to it
          if (getRouteByHash(hash)) {
            return navigate(hash, { [symbols.backtrack]: true }, false)
          }
        }
      }
    }

    if (isFunction(app._handleAppClose)) {
      return app._handleAppClose()
    }

    return false
  };

  const capture = ({ key }) => {
    // in Loading state we want to stop propagation
    // by returning undefined
    if (app.state === 'Loading') {
      return
    }

    // if not set we want to continue propagation
    // by explicitly returning false
    if (!routerConfig.get('numberNavigation')) {
      return false
    }
    key = parseInt(key);
    if (!isNaN(key)) {
      let match;
      let idx = 1;
      for (let route of pages.keys()) {
        if (idx === key) {
          match = route;
          break
        } else {
          idx++;
        }
      }
      if (match) {
        navigate(match);
      }
    }
    return false
  };

  // start translating url
  const start = () => {
    const bootKey = '@boot-page';
    const hasBootPage = pages.has('@boot-page');
    const hash = getHash();
    const params = getQueryStringParams(hash);

    // if we refreshed the boot-page we don't want to
    // redirect to this page so we force rootHash load
    const isDirectLoad = hash.indexOf(bootKey) !== -1;
    const ready = () => {
      if (hasBootPage) {
        navigate('@boot-page', {
          [symbols.resume]: isDirectLoad ? rootHash : hash || rootHash,
          reload: true,
        });
      } else if (!hash && rootHash) {
        if (isString(rootHash)) {
          navigate(rootHash);
        } else if (isFunction(rootHash)) {
          rootHash().then(url => {
            navigate(url);
          });
        }
      } else {
        handleHashChange();
      }
    };
    if (isFunction(bootRequest)) {
      bootRequest(params).then(() => {
        ready();
      });
    } else {
      ready();
    }
  };

  /**
   * Data binding to a route will invoke a loading screen
   * @param {String} route - the route
   * @param {Function} cb - must return a promise
   * @param {Number} expires - seconds after first time active that data expires
   * @param {String} type - page loading type
   */
  const on = (route, cb, expires = 0, type = 'on') => {
    if (providers.has(route)) {
      console.warn(`provider for ${route} already exists`);
    } else {
      providers.set(route, {
        cb,
        expires: expires * 1000,
        type,
      });
    }
  };

  /**
   * Request data binding for a route before
   * the page loads (active page will stay visible)
   * @param route
   * @param cb
   * @param expires
   */
  const before = (route, cb, expires = 0) => {
    on(route, cb, expires, 'before');
  };

  /**
   * Request data binding for a route after the page has
   * been loaded
   * @param route
   * @param cb
   * @param expires
   */
  const after = (route, cb, expires = 0) => {
    on(route, cb, expires, 'after');
  };

  const getWidgetReferences = () => {
    return widgetsHost.get().reduce((storage, widget) => {
      const key = widget.ref.toLowerCase();
      storage[key] = widget;
      return storage
    }, {})
  };

  const getWidgetByName = name => {
    name = ucfirst(name);
    return widgetsHost.getByRef(name) || false
  };

  /**
   * delegate app focus to a on-screen widget
   * @param name - {string}
   */
  const focusWidget = name => {
    const widget = getWidgetByName(name);
    if (name) {
      // store reference
      activeWidget = widget;
      // somewhat experimental
      if (app.state === 'Widgets') {
        app.reload(activeWidget);
      } else {
        app._setState('Widgets', [activeWidget]);
      }
    }
  };

  const handleRemote = (type, name) => {
    if (type === 'widget') {
      focusWidget(name);
    } else if (type === 'page') {
      restoreFocus();
    }
  };

  /**
   * Resume Router's page loading process after
   * the BootComponent became visible;
   */
  const resume = () => {
    if (register$1.has(symbols.resume)) {
      const hash = register$1.get(symbols.resume).replace(/^#+/, '');
      if (getRouteByHash(hash) && hash) {
        navigate(hash, false);
      } else if (rootHash) {
        navigate(rootHash, false);
      }
    }
  };

  const restore = () => {
    if (routerConfig.get('autoRestoreRemote')) {
      handleRemote('page');
    }
  };

  const hash = () => {
    return getHash()
  };

  const mustUpdateHash = () => {
    // we need support to either turn change hash off
    // per platform or per app
    const updateConfig = routerConfig.get('updateHash');
    return !((isBoolean(updateConfig) && !updateConfig) || (isBoolean(updateHash) && !updateHash))
  };

  const restoreFocus = () => {
    activeWidget = null;
    app._setState('');
  };

  const getActivePage = () => {
    if (activePage && activePage.attached) {
      return activePage
    } else {
      return app
    }
  };

  const getActiveRoute = () => {
    return activeRoute
  };

  const getActiveHash = () => {
    return activeHash
  };

  const getActiveWidget = () => {
    return activeWidget
  };

  // listen to url changes
  window.addEventListener('hashchange', () => {
    handleHashChange();
  });

  // export API
  var Router = {
    startRouter,
    navigate,
    root,
    resume,
    route,
    on,
    before,
    after,
    boot,
    step,
    restoreFocus,
    focusPage: restoreFocus,
    focusWidget,
    handleRemote,
    start,
    add: setupRoutes,
    widget,
    hash,
    getActivePage,
    getActiveWidget,
    getActiveRoute,
    getActiveHash,
    App: RoutedApp,
    restore,
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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

  const defaultChannels = [
    {
      number: 1,
      name: 'Metro News 1',
      description: 'New York Cable News Channel',
      entitled: true,
      program: {
        title: 'The Morning Show',
        description: "New York's best morning show",
        startTime: new Date(new Date() - 60 * 5 * 1000).toUTCString(), // started 5 minutes ago
        duration: 60 * 30, // 30 minutes
        ageRating: 0,
      },
    },
    {
      number: 2,
      name: 'MTV',
      description: 'Music Television',
      entitled: true,
      program: {
        title: 'Beavis and Butthead',
        description: 'American adult animated sitcom created by Mike Judge',
        startTime: new Date(new Date() - 60 * 20 * 1000).toUTCString(), // started 20 minutes ago
        duration: 60 * 45, // 45 minutes
        ageRating: 18,
      },
    },
    {
      number: 3,
      name: 'NBC',
      description: 'NBC TV Network',
      entitled: false,
      program: {
        title: 'The Tonight Show Starring Jimmy Fallon',
        description: 'Late-night talk show hosted by Jimmy Fallon on NBC',
        startTime: new Date(new Date() - 60 * 10 * 1000).toUTCString(), // started 10 minutes ago
        duration: 60 * 60, // 1 hour
        ageRating: 10,
      },
    },
  ];

  const channels = () => Settings.get('platform', 'tv', defaultChannels);

  const randomChannel = () => channels()[~~(channels.length * Math.random())];

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
    callbacks[event] &&
      callbacks[event].forEach(cb => {
        cb.apply(null, args);
      });
  };

  // local mock methods
  let methods = {
    getChannel() {
      if (!currentChannel) currentChannel = randomChannel();
      return new Promise((resolve, reject) => {
        if (currentChannel) {
          const channel = { ...currentChannel };
          delete channel.program;
          resolve(channel);
        } else {
          reject('No channel found');
        }
      })
    },
    getProgram() {
      if (!currentChannel) currentChannel = randomChannel();
      return new Promise((resolve, reject) => {
        currentChannel.program ? resolve(currentChannel.program) : reject('No program found');
      })
    },
    setChannel(number) {
      return new Promise((resolve, reject) => {
        if (number) {
          const newChannel = channels().find(c => c.number === number);
          if (newChannel) {
            currentChannel = newChannel;
            const channel = { ...currentChannel };
            delete channel.program;
            emit('channelChange', channel);
            resolve(channel);
          } else {
            reject('Channel not found');
          }
        } else {
          reject('No channel number supplied');
        }
      })
    },
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
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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

  var Launch = (App, appSettings, platformSettings, appData) => {
    initSettings(appSettings, platformSettings);

    initUtils(platformSettings);
    initStorage();

    // Initialize plugins
    if (platformSettings.plugins) {
      platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile);
      platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics);
      platformSettings.plugins.mediaPlayer && initMediaPlayer(platformSettings.plugins.mediaPlayer);
      platformSettings.plugins.mediaPlayer && initVideoPlayer(platformSettings.plugins.mediaPlayer);
      platformSettings.plugins.ads && initAds(platformSettings.plugins.ads);
      platformSettings.plugins.router && initRouter(platformSettings.plugins.router);
      platformSettings.plugins.tv && initTV(platformSettings.plugins.tv);
    }

    const app = Application(App, appData, platformSettings);
    ApplicationInstance = new app(appSettings);
    return ApplicationInstance
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
          texture: { type: lng$1.textures.StaticTexture, options: {} },
        },
      }
    }

    set videoEl(v) {
      this._videoEl = v;
    }

    get videoEl() {
      return this._videoEl
    }

    get videoView() {
      return this.tag('Video')
    }

    get videoTexture() {
      return this.videoView.texture
    }

    get isVisible() {
      return this.videoView.alpha === 1 && this.videoView.visible === true
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
      this.videoTexture.options = { source: glTexture, w: this.videoEl.width, h: this.videoEl.height };

      this.videoView.w = this.videoEl.width / this.stage.getRenderPrecision();
      this.videoView.h = this.videoEl.height / this.stage.getRenderPrecision();
    }

    start() {
      const stage = this.stage;
      if (!this._updateVideoTexture) {
        this._updateVideoTexture = () => {
          if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
            const gl = stage.gl;

            const currentTime = new Date().getTime();

            // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
            // We'll fallback to fixed 30fps in this case.
            const frameCount = this.videoEl.webkitDecodedFrameCount;

            const mustUpdate = frameCount
              ? this._lastFrame !== frameCount
              : this._lastTime < currentTime - 30;

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
          y: top,
        },
      });
    }

    size(width, height) {
      this.videoView.patch({
        smooth: {
          w: width,
          h: height,
        },
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
   * Copyright 2020 RDK Management
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
  };

  // todo: add this in a 'Registry' plugin
  // to be able to always clean this up on app close
  let eventHandlers = {};

  const state$1 = {
    adsEnabled: false,
    playing: false,
    _playingAds: false,
    get playingAds() {
      return this._playingAds
    },
    set playingAds(val) {
      if (this._playingAds !== val) {
        this._playingAds = val;
        fireOnConsumer$1(val === true ? 'AdStart' : 'AdEnd');
      }
    },
    skipTime: false,
    playAfterSeek: null,
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
    },
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

  const setupVideoTag = () => {
    const videoEls = document.getElementsByTagName('video');
    if (videoEls && videoEls.length) {
      return videoEls[0]
    } else {
      const videoEl = document.createElement('video');
      videoEl.setAttribute('id', 'video-player');
      videoEl.setAttribute('width', withPrecision(1920));
      videoEl.setAttribute('height', withPrecision(1080));
      videoEl.setAttribute('crossorigin', 'anonymous');
      videoEl.style.position = 'absolute';
      videoEl.style.zIndex = '1';
      videoEl.style.display = 'none';
      videoEl.style.visibility = 'hidden';
      videoEl.style.top = withPrecision(0);
      videoEl.style.left = withPrecision(0);
      videoEl.style.width = withPrecision(1920);
      videoEl.style.height = withPrecision(1080);
      document.body.appendChild(videoEl);
      return videoEl
    }
  };

  const setUpVideoTexture = () => {
    if (!ApplicationInstance.tag('VideoTexture')) {
      const el = ApplicationInstance.stage.c({
        type: VideoTexture,
        ref: 'VideoTexture',
        zIndex: 0,
        videoEl,
      });
      ApplicationInstance.childList.addAt(el, 0);
    }
    return ApplicationInstance.tag('VideoTexture')
  };

  const registerEventListeners = () => {
    Log.info('VideoPlayer', 'Registering event listeners');
    Object.keys(events$1).forEach(event => {
      const handler = e => {
        // Fire a metric for each event (if it exists on the metrics object)
        if (metrics && metrics[event] && typeof metrics[event] === 'function') {
          metrics[event]({ currentTime: videoEl.currentTime });
        }
        // fire an internal hook
        fireHook(event, { videoElement: videoEl, event: e });

        // fire the event (with human friendly event name) to the consumer of the VideoPlayer
        fireOnConsumer$1(events$1[event], { videoElement: videoEl, event: e });
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

    open(url, details = {}) {
      if (!this.canInteract) return
      metrics = Metrics$1.media(url);
      // prep the media url to play depending on platform
      url = mediaUrl(url);

      // if url is same as current clear (which is effectively a reload)
      if (this.src == url) {
        this.clear();
      }

      this.hide();
      deregisterEventListeners();

      // preload the video to get duration (for ads)
      //.. currently actually not working because loadedmetadata didn't work reliably on Sky boxes
      videoEl.setAttribute('src', url);
      videoEl.load();

      // const onLoadedMetadata = () => {
      // videoEl.removeEventListener('loadedmetadata', onLoadedMetadata)
      const config = { enabled: state$1.adsEnabled, duration: 300 }; // this.duration ||
      if (details.videoId) {
        config.caid = details.videoId;
      }
      Ads.get(config, consumer$1).then(ads => {
        state$1.playingAds = true;
        ads.prerolls().then(() => {
          state$1.playingAds = false;
          registerEventListeners();
          if (this.src !== url) {
            videoEl.setAttribute('src', url);
            videoEl.load();
          }
          this.show();
          setTimeout(() => {
            this.play();
          });
        });
      });
      // }

      // videoEl.addEventListener('loadedmetadata', onLoadedMetadata)
    },

    reload() {
      if (!this.canInteract) return
      const url = videoEl.getAttribute('src');
      this.close();
      this.open(url);
    },

    close() {
      Ads.cancel();
      if (state$1.playingAds) {
        state$1.playingAds = false;
        Ads.stop();
        // call self in next tick
        setTimeout(() => {
          this.close();
        });
      }
      if (!this.canInteract) return
      this.clear();
      this.hide();
      deregisterEventListeners();
    },

    clear() {
      if (!this.canInteract) return
      // pause the video first to disable sound
      this.pause();
      if (textureMode === true) videoTexture.stop();
      fireOnConsumer$1('Clear', { videoElement: videoEl });
      videoEl.removeAttribute('src');
      videoEl.load();
    },

    play() {
      if (!this.canInteract) return
      if (textureMode === true) videoTexture.start();
      videoEl.play();
    },

    pause() {
      if (!this.canInteract) return
      videoEl.pause();
    },

    playPause() {
      if (!this.canInteract) return
      this.playing === true ? this.pause() : this.play();
    },

    mute(muted = true) {
      if (!this.canInteract) return
      videoEl.muted = muted;
    },

    loop(looped = true) {
      videoEl.loop = looped;
    },

    seek(time) {
      if (!this.canInteract) return
      if (!this.src) return
      // define whether should continue to play after seek is complete (in seeked hook)
      if (state$1.playAfterSeek === null) {
        state$1.playAfterSeek = !!state$1.playing;
      }
      // pause before actually seeking
      this.pause();
      // currentTime always between 0 and the duration of the video (minus 0.1s to not set to the final frame and stall the video)
      videoEl.currentTime = Math.max(0, Math.min(time, this.duration - 0.1));
    },

    skip(seconds) {
      if (!this.canInteract) return
      if (!this.src) return

      state$1.skipTime = (state$1.skipTime || videoEl.currentTime) + seconds;
      easeExecution(() => {
        this.seek(state$1.skipTime);
        state$1.skipTime = false;
      }, 300);
    },

    show() {
      if (!this.canInteract) return
      if (textureMode === true) {
        videoTexture.show();
      } else {
        videoEl.style.display = 'block';
        videoEl.style.visibility = 'visible';
      }
    },

    hide() {
      if (!this.canInteract) return
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
      return videoEl && (isNaN(videoEl.duration) ? Infinity : videoEl.duration)
    },

    get currentTime() {
      return videoEl && videoEl.currentTime
    },

    get muted() {
      return videoEl && videoEl.muted
    },

    get looped() {
      return videoEl && videoEl.loop
    },

    get src() {
      return videoEl && videoEl.getAttribute('src')
    },

    get playing() {
      return state$1.playing
    },

    get playingAds() {
      return state$1.playingAds
    },

    get canInteract() {
      // todo: perhaps add an extra flag wether we allow interactions (i.e. pauze, mute, etc.) during ad playback
      return state$1.playingAds === false
    },

    get top() {
      return videoEl && parseFloat(videoEl.style.top)
    },

    get left() {
      return videoEl && parseFloat(videoEl.style.left)
    },

    get bottom() {
      return videoEl && parseFloat(videoEl.style.top - videoEl.style.height)
    },

    get right() {
      return videoEl && parseFloat(videoEl.style.left - videoEl.style.width)
    },

    get width() {
      return videoEl && parseFloat(videoEl.style.width)
    },

    get height() {
      return videoEl && parseFloat(videoEl.style.height)
    },

    get visible() {
      if (textureMode === true) {
        return videoTexture.isVisible
      } else {
        return videoEl && videoEl.style.display === 'block'
      }
    },

    get adsEnabled() {
      return state$1.adsEnabled
    },

    // prefixed with underscore to indicate 'semi-private'
    // because it's not recommended to interact directly with the video element
    get _videoEl() {
      return videoEl
    },
  };

  autoSetupMixin(videoPlayerPlugin, () => {
    precision =
      (ApplicationInstance &&
        ApplicationInstance.stage &&
        ApplicationInstance.stage.getRenderPrecision()) ||
      precision;

    videoEl = setupVideoTag();

    textureMode = Settings.get('platform', 'textureMode', false);
    if (textureMode === true) {
      videoTexture = setUpVideoTexture();
    }
  });

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
      postrolls: [],
    })
  };

  const initAds = config => {
    if (config.getAds) {
      getAds = config.getAds;
    }
  };

  const state = {
    active: false,
  };

  const playSlot = (slot = []) => {
    return slot.reduce((promise, ad) => {
      return promise.then(() => {
        return playAd(ad)
      })
    }, Promise.resolve(null))
  };

  const playAd = ad => {
    return new Promise(resolve => {
      if (state.active === false) {
        Log.info('Ad', 'Skipping add due to inactive state');
        return resolve()
      }
      // is it safe to rely on videoplayer plugin already created the video tag?
      const videoEl = document.getElementsByTagName('video')[0];
      videoEl.style.display = 'block';
      videoEl.style.visibility = 'visible';
      videoEl.src = mediaUrl(ad.url);
      videoEl.load();

      let timeEvents = null;
      let timeout;

      const cleanup = () => {
        // remove all listeners
        Object.keys(handlers).forEach(handler =>
          videoEl.removeEventListener(handler, handlers[handler])
        );
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
              thirdQuartile: (videoEl.duration / 4) * 3,
            };
            Log.info('Ad', 'Calculated quartiles times', { timeEvents });
          }
          if (
            timeEvents &&
            timeEvents.firstQuartile &&
            videoEl.currentTime >= timeEvents.firstQuartile
          ) {
            fireOnConsumer('FirstQuartile', ad);
            delete timeEvents.firstQuartile;
            sendBeacon(ad.callbacks, 'firstQuartile');
          }
          if (timeEvents && timeEvents.midPoint && videoEl.currentTime >= timeEvents.midPoint) {
            fireOnConsumer('MidPoint', ad);
            delete timeEvents.midPoint;
            sendBeacon(ad.callbacks, 'midPoint');
          }
          if (
            timeEvents &&
            timeEvents.thirdQuartile &&
            videoEl.currentTime >= timeEvents.thirdQuartile
          ) {
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
        },
        // todo: pause, resume, mute, unmute beacons
      };
      // add all listeners
      Object.keys(handlers).forEach(handler => videoEl.addEventListener(handler, handlers[handler]));

      videoEl.play();
    })
  };

  const sendBeacon = (callbacks, event) => {
    if (callbacks && callbacks[event]) {
      Log.info('Ad', 'Sending beacon', event, callbacks[event]);
      return callbacks[event].reduce((promise, url) => {
        return promise.then(() =>
          fetch(url)
            // always resolve, also in case of a fetch error (so we don't block firing the rest of the beacons for this event)
            // note: for fetch failed http responses don't throw an Error :)
            .then(response => {
              if (response.status === 200) {
                fireOnConsumer('Beacon' + event + 'Sent');
              } else {
                fireOnConsumer('Beacon' + event + 'Failed' + response.status);
              }
              Promise.resolve(null);
            })
            .catch(() => {
              Promise.resolve(null);
            })
        )
      }, Promise.resolve(null))
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
            return Promise.resolve()
          },
        })
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
                })
              }
              return Promise.resolve()
            },
            midrolls() {
              return Promise.resolve()
            },
            postrolls() {
              return Promise.resolve()
            },
          });
        });
      })
    },
    cancel() {
      Log.info('Ad', 'Cancel Ad');
      state.active = false;
    },
    stop() {
      Log.info('Ad', 'Stop Ad');
      state.active = false;
      // fixme: duplication
      const videoEl = document.getElementsByTagName('video')[0];
      videoEl.pause();
      videoEl.removeAttribute('src');
    },
  };

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
      return `${this._src}-${this._scalingOptions.type}-${this._scalingOptions.w}-${this._scalingOptions.h}`
    }

    getNonDefaults() {
      const obj = super.getNonDefaults();
      if (this._src) {
        obj.src = this._src;
      }
      return obj
    }
  }

  /*
   * If not stated otherwise in this file or this component's LICENSE file the
   * following copyright and licenses apply:
   *
   * Copyright 2020 RDK Management
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
        shader: { type: lng$1.shaders.RoundedRectangle, radius: 10 },
        Nr: {
          w: w => w,
          y: 24,
          text: {
            text: '',
            textColor: 0xff333333,
            fontSize: 80,
            textAlign: 'center',
            verticalAlign: 'middle',
          },
        },
      }
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
          text: (v && v.toString()) || '',
          fontSize: v === '*' ? 120 : 80,
        },
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
          shader: { type: lng$1.shaders.RoundedRectangle, radius: 10 },
          Info: {
            y: 24,
            x: 48,
            text: { text: 'Please enter your PIN', fontSize: 32 },
          },
          Msg: {
            y: 260,
            x: 48,
            text: { text: '', fontSize: 28, textColor: 0xffffffff },
          },
          Code: {
            x: 48,
            y: 96,
          },
        },
      }
    }

    _init() {
      const children = [];
      for (let i = 0; i < 4; i++) {
        children.push({
          type: PinInput,
          index: i,
        });
      }

      this.tag('Code').children = children;
    }

    get pin() {
      if (!this._pin) this._pin = '';
      return this._pin
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
      return this._msg
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
        Pin.submit(this.pin)
          .then(val => {
            this.msg = 'Unlocking ...';
            setTimeout(() => {
              Pin.hide();
            }, 1000);
            this.resolve(val);
          })
          .catch(e => {
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
   * Copyright 2020 RDK Management
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

  // only used during local development
  let unlocked = false;

  let submit = pin => {
    return new Promise((resolve, reject) => {
      if (pin.toString() === Settings.get('platform', 'pin', '0000').toString()) {
        unlocked = true;
        resolve(unlocked);
      } else {
        reject('Incorrect pin');
      }
    })
  };

  let check = () => {
    return new Promise(resolve => {
      resolve(unlocked);
    })
  };

  let pinDialog = null;

  // Public API
  var Pin = {
    show() {
      return new Promise((resolve, reject) => {
        pinDialog = ApplicationInstance.stage.c({
          ref: 'PinDialog',
          type: PinDialog,
          resolve,
          reject,
        });
        ApplicationInstance.childList.a(pinDialog);
        ApplicationInstance.focus = pinDialog;
      })
    },
    hide() {
      ApplicationInstance.focus = null;
      ApplicationInstance.children = ApplicationInstance.children.map(
        child => child !== pinDialog && child
      );
      pinDialog = null;
    },
    submit(pin) {
      return new Promise((resolve, reject) => {
        try {
          submit(pin)
            .then(resolve)
            .catch(reject);
        } catch (e) {
          reject(e);
        }
      })
    },
    unlocked() {
      return new Promise((resolve, reject) => {
        try {
          check()
            .then(resolve)
            .catch(reject);
        } catch (e) {
          reject(e);
        }
      })
    },
    locked() {
      return new Promise((resolve, reject) => {
        try {
          check()
            .then(unlocked => resolve(!!!unlocked))
            .catch(reject);
        } catch (e) {
          reject(e);
        }
      })
    },
  };

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
      data = JSON.parse(data.normalize().replace(/\\x([0-9A-Fa-f]{2})/g, ''));
    }
    if (data.id) {
      const request = requestsQueue[data.id];
      if (request) {
        if ('result' in data) request.resolve(data.result);
        else request.reject(data.error);
        delete requestsQueue[data.id];
      } else {
        console.log('no pending request found with id ' + data.id);
      }
    }
  };

  var notificationListener = data => {
    if (typeof data === 'string') {
      data = JSON.parse(data.normalize().replace(/\\x([0-9A-Fa-f]{2})/g, ''));
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
    return [
      (options && options.protocol) || protocol,
      (options && options.host) || host,
      ':' + ((options && options.port) || port),
      (options && options.endpoint) || endpoint,
      options && options.token ? '?token=' + options.token : null,
    ].join('')
  };

  const sockets = {};
  var connect = options => {
    return new Promise((resolve, reject) => {
      const socketAddress = makeWebsocketAddress(options);
      let socket = sockets[socketAddress];
      if (socket && socket.readyState === 1) return resolve(socket)
      if (socket && socket.readyState === 0) {
        const waitForOpen = () => {
          socket.removeEventListener('open', waitForOpen);
          resolve(socket);
        };
        return socket.addEventListener('open', waitForOpen)
      }
      if (socket == null) {
        if (options.debug) {
          console.log('Opening socket to ' + socketAddress);
        }
        socket = new ws_1(socketAddress, (options && options.subprotocols) || 'notification');
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
            method: 'client.ThunderJS.events.error',
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
            method: 'client.ThunderJS.events.connect',
          });
          socket.removeEventListener('close', handleConnectClosure);
          socket.addEventListener('close', () => {
            notificationListener({
              method: 'client.ThunderJS.events.disconnect',
            });
            sockets[socketAddress] = null;
          });
          resolve(socket);
        });
      } else {
        sockets[socketAddress] = null;
        reject('Socket error');
      }
    })
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
      method: [plugin, version, method].join('.'),
    };
    params || params === false
      ?
        typeof params === 'object' && Object.keys(params).length === 0
        ? null
        : (body.params = params)
      : null;
    return body
  };

  var getVersion = (versionsConfig, plugin, params) => {
    const defaultVersion = 1;
    let version;
    if ((version = params && params.version)) {
      return version
    }
    return versionsConfig
      ? versionsConfig[plugin] || versionsConfig.default || defaultVersion
      : defaultVersion
  };

  let id = 0;
  var makeId = () => {
    id = id + 1;
    return id
  };

  var execRequest = (options, body) => {
    return connect(options).then(connection => {
      connection.send(JSON.stringify(body));
    })
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
            reject,
          };
          execRequest(options, body).catch(e => {
            reject(e);
          });
        })
      },
    }
  };

  var DeviceInfo = {
    freeRam(params) {
      return this.call('systeminfo', params).then(res => {
        return res.freeram
      })
    },
    version(params) {
      return this.call('systeminfo', params).then(res => {
        return res.version
      })
    },
  };

  var plugins = {
    DeviceInfo,
  };

  function listener(plugin, event, callback, errorCallback) {
    const thunder = this;
    const index = register.call(this, plugin, event, callback, errorCallback);
    return {
      dispose() {
        const listener_id = makeListenerId(plugin, event);
        if (listeners[listener_id] === undefined) return
        listeners[listener_id].splice(index, 1);
        if (listeners[listener_id].length === 0) {
          unregister.call(thunder, plugin, event, errorCallback);
        }
      },
    }
  }
  const makeListenerId = (plugin, event) => {
    return ['client', plugin, 'events', event].join('.')
  };
  const register = function(plugin, event, callback, errorCallback) {
    const listener_id = makeListenerId(plugin, event);
    if (!listeners[listener_id]) {
      listeners[listener_id] = [];
      if (plugin !== 'ThunderJS') {
        const method = 'register';
        const request_id = listener_id
          .split('.')
          .slice(0, -1)
          .join('.');
        const params = {
          event,
          id: request_id,
        };
        this.api.request(plugin, method, params).catch(e => {
          if (typeof errorCallback === 'function') errorCallback(e.message);
        });
      }
    }
    listeners[listener_id].push(callback);
    return listeners[listener_id].length - 1
  };
  const unregister = function(plugin, event, errorCallback) {
    const listener_id = makeListenerId(plugin, event);
    delete listeners[listener_id];
    if (plugin !== 'ThunderJS') {
      const method = 'unregister';
      const request_id = listener_id
        .split('.')
        .slice(0, -1)
        .join('.');
      const params = {
        event,
        id: request_id,
      };
      this.api.request(plugin, method, params).catch(e => {
        if (typeof errorCallback === 'function') errorCallback(e.message);
      });
    }
  };

  var thunderJS = options => {
    if (
      options.token === undefined &&
      typeof window !== 'undefined' &&
      window.thunder &&
      typeof window.thunder.token === 'function'
    ) {
      options.token = window.thunder.token();
    }
    return wrapper({ ...thunder$2(options), ...plugins })
  };
  const resolve = (result, args) => {
    if (
      typeof result !== 'object' ||
      (typeof result === 'object' && (!result.then || typeof result.then !== 'function'))
    ) {
      result = new Promise((resolve, reject) => {
        result instanceof Error === false ? resolve(result) : reject(result);
      });
    }
    const cb = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null;
    if (cb) {
      result.then(res => cb(null, res)).catch(err => cb(err));
    } else {
      return result
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
        return this[plugin][method](args[2])
      }
      return this.api.request.apply(this, args)
    },
    registerPlugin(name, plugin) {
      this[name] = wrapper(Object.assign(Object.create(thunder$2), plugin, { plugin: name }));
    },
    subscribe() {
    },
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
      return listener.apply(this, args)
    },
    once() {
      console.log('todo ...');
    },
  });
  const wrapper = obj => {
    return new Proxy(obj, {
      get(target, propKey) {
        const prop = target[propKey];
        if (propKey === 'api') {
          return target.api
        }
        if (typeof prop !== 'undefined') {
          if (typeof prop === 'function') {
            if (['on', 'once', 'subscribe'].indexOf(propKey) > -1) {
              return function(...args) {
                return prop.apply(this, args)
              }
            }
            return function(...args) {
              return resolve(prop.apply(this, args), args)
            }
          }
          if (typeof prop === 'object') {
            return wrapper(
              Object.assign(Object.create(thunder$2(target.options)), prop, { plugin: propKey })
            )
          }
          return prop
        } else {
          if (target.plugin === false) {
            return wrapper(
              Object.assign(Object.create(thunder$2(target.options)), {}, { plugin: propKey })
            )
          }
          return function(...args) {
            args.unshift(propKey);
            return target.call.apply(this, args)
          }
        }
      },
    })
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
      },
    };
    
    const language = {
      english:{
        id: 'en',
        fontSrc: 'Play/Play-Regular.ttf',
        font: 'Play'
      },
      spanish:{
        id: 'sp',
        fontSrc: 'Play/Play-Regular.ttf',
        font: 'Play'
      },

    };
    
    var CONFIG = {
      theme: themeOptions['partnerOne'],
      language: language['english']
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
            alpha: 0,
          },
          y: 20,
          Image: {
          },
          Info: {},
        },
      }
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
          scale: this.unfocus,
        });
      } else {
        this.tag('Image').patch({
          rtt: true,
          x: this.x,
          y: this.y,
          w: this.w,
          h: this.h,
          src: this.data.url,
        });
      }

      /* Used static data for develpment purpose ,
      it wil replaced with Dynamic data once implimetation is completed.*/

      if (this.info) {
        this.tag('Info').patch({
          x: this.x - 20,
          y: this.y + this.h + 10,
          w: this.w,
          h: 140,
          alpha: 0,
          PlayIcon: {
            Label: {
              x: this.x,
              y: this.y + 10,
              text: {
                fontFace: CONFIG.language.font,
                text: this.data.displayName,
                fontSize: 25,
                maxLines: 2,
                wordWrapWidth: this.w
              },
            }
          },
          IMDb: {
            x: this.x,
            y: this.y + 40,
            texture: lng$1.Tools.getSvgTexture(Utils.asset('images/player/IMDb.png'), 30, 20),
            Rating: {
              x: this.x + 30,
              y: this.y - 3,
              text: {
                fontFace: CONFIG.language.font,
                text: '8.8/10',
                fontSize: 21,
                maxLines: 2,
                wordWrapWidth: 150
              },
            },
            Ua: {
              text: {
                fontFace: CONFIG.language.font,
                text: 'R',
                fontSize: 20
              },
              x: this.x + 110,
              y: this.y - 3
            },
            Duration: {
              x: this.x + 140,
              y: this.y - 3,
              text: {
                fontFace: CONFIG.language.font,
                text: '2h 30min',
                fontSize: 21,
                maxLines: 2,
                wordWrapWidth: 150
              },
            },
            Year: {
              x: this.x + 240,
              y: this.y - 3,
              text: {
                fontFace: CONFIG.language.font,
                text: '2017',
                fontSize: 21,
                maxLines: 2,
                wordWrapWidth: 150
              },
            }
          }
        });
      } else {
        this.tag('Info').patch({
          x: this.x - 20,
          y: this.y + this.h + 10,
          w: this.w,
          h: 140,
          alpha: 0,
          PlayIcon: {
            Label: {
              x: this.x,
              y: this.y + 10,
              text: {
                fontFace: CONFIG.language.font,
                text: this.data.displayName,
                fontSize: 35,
                maxLines: 2,
                wordWrapWidth: this.w
              },
            }
          },
        });
      }

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
        scale: this.focus,
      });
      this.tag('Info').alpha = 1;
      this.tag('Item').patch({
        zIndex: 2,
      });
      this.tag('Shadow').patch({
        scale: this.focus,
        alpha: 1,
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
      });
      this.tag('Item').patch({
        zIndex: 0,
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
   * Class to render items in main view.
   */
  class AppListItem extends lng$1.Component {
    /**
     * Function to render various elements in the main view item.
     */
    static _template() {
      return {
        Item: {
          Shadow: {
            alpha: 0,
            color: CONFIG.theme.hex,
          },
          x: 0,
          Image: {},
          Title: {
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 22,
              textColor: 0xffffffff,
            },
            mountX: 0.5,
            alpha: 0,
          },
        },

      }
    }

    _init() {
      console.log(this.data);
      if (this.data.url.startsWith('/images')) {
        this.tag('Image').patch({
          w: this.w,
          h: this.h,
          src: Utils.asset(this.data.url),
          scale: this.unfocus,
        });
      } else {
        this.tag('Image').patch({
          src: this.data.url,
          w: this.w,
          h: this.h
        });
      }



    }

    /**
     * Function to change properties of item during focus.
     */

    _focus() {
      
      this.tag('Image').patch({
        x: this.x,
        w: this.w,
        h: this.h,
        zIndex: 1,
        scale: this.focus,
      });
      this.tag('Item').patch({
        zIndex: 2
      });
      this.tag('Shadow').patch({
        scale: this.focus,
        alpha: 1,
        y: -12,
        texture: lng.Tools.getShadowRect(this.w, this.h + 24, 0, 0, 0),
    });

    }

    /**
     * Function to change properties of item during unfocus.
     */
    _unfocus() {
      this.tag('Image').patch({
        x: 0,
        y: 0,
        w: this.w,
        h: this.h,
        scale: this.unfocus,
      });
      this.tag('Item').patch({
        zIndex: 0
      });
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
  const config$1 = {
    host: '127.0.0.1',
    port: 9998,
    default: 1,
  };
  var thunder$1 = thunderJS(config$1);
  /**
   * Class that contains functions which commuicates with thunder API's
   */
  class AppApi {
    checkForInternet() {
      return new Promise((resolve, reject) => {
        let i = 0;
        var poll = () => {
          i++;
          this.getIP().then(result => {
            if (result == true) {
              resolve(result);
            } else if (i < 10) poll();
            else resolve(false);
          });
        };
        poll();
      })
    }

    /**
     * Function to launch Html app.
     * @param {String} url url of app.
     */
    getIP() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.System';
        thunder$1.Controller.activate({ callsign: systemcCallsign })
          .then(() => {
            thunder$1
              .call(systemcCallsign, 'getDeviceInfo', { params: 'estb_ip' })
              .then(result => {
                resolve(result.success);
              })
              .catch(err => {
                resolve(false);
              });
          })
          .catch(err => { });
      })
    }
    /**
    *  Function to get timeZone
    */
    getZone() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.System';
        thunder$1.Controller.activate({ callsign: systemcCallsign })
          .then(() => {
            thunder$1
              .call(systemcCallsign, 'getTimeZoneDST')
              .then(result => {
                resolve(result.timeZone);
              }).catch(err => { resolve(false); });
          }).catch(err => { });
      })
    }
    /**
     * Function to get resolution of the display screen.
     */
    getResolution() {
      return new Promise((resolve, reject) => {

        const systemcCallsign = 'org.rdk.DisplaySettings';
        thunder$1.Controller.activate({ callsign: systemcCallsign })
          .then(() => {
            thunder$1
              .call(systemcCallsign, 'getCurrentResolution', { params: 'HDMI0' })
              .then(result => {
                resolve(result.resolution);
              })
              .catch(err => {
                resolve(false);
              });
          })
          .catch(err => {
            console.log('Display Error', JSON.stringify(err));
          });
      })
    }

    getSupportedResolutions() {
      return new Promise((resolve, reject) => {

        const systemcCallsign = 'org.rdk.DisplaySettings.1';
        thunder$1.Controller.activate({ callsign: systemcCallsign })
          .then(() => {
            thunder$1
              .call(systemcCallsign, 'getSupportedResolutions', { params: 'HDMI0' })
              .then(result => { 
                resolve(result.supportedResolutions);
              })
              .catch(err => {
                resolve(false);
              });
          })
          .catch(err => {
            console.log('Display Error', JSON.stringify(err));
          });
      })
    }

    /**
     * Function to set the display resolution.
     */
    setResolution(res) {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.DisplaySettings';
        thunder$1.Controller.activate({ callsign: systemcCallsign })
          .then(() => {
            thunder$1
              .call(systemcCallsign, 'setCurrentResolution', {
                videoDisplay: 'HDMI0',
                resolution: res,
                persist: true,
              })
              .then(result => {
                resolve(result.success);
              })
              .catch(err => {
                resolve(false);
              });
          })
          .catch(err => {
            console.log('Display Error', JSON.stringify(err));
          });
      })
    }

    /**
     * Function to launch Html app.
     * @param {String} url url of app.
     */
    launchWeb(url) {
      const childCallsign = 'HtmlApp';
      if (webUrl != url) {
        thunder$1
          .call('org.rdk.RDKShell', 'launch', {
            callsign: childCallsign,
            type: childCallsign,
            uri: url,
          })
          .then(() => {
            thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
              client: childCallsign,
            });
            thunder$1.call('org.rdk.RDKShell', 'setFocus', {
              client: childCallsign,
            });
          })
          .catch(err => { });
      } else {
        thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign,
        });
        thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign });
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
        thunder$1
          .call('org.rdk.RDKShell', 'launch', {
            callsign: childCallsign,
            type: childCallsign,
            uri: url,
          })
          .then(() => {
            thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
              client: childCallsign,
            });
            thunder$1.call('org.rdk.RDKShell', 'setFocus', {
              client: childCallsign,
            });
          })
          .catch(err => { });
      } else {
        thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign,
        });
        thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign });
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
      thunder$1
        .call('org.rdk.RDKShell', 'launch', {
          callsign: childCallsign,
          type: childCallsign,
        })
        .then(() => {
          thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
            client: childCallsign,
          });
          thunder$1.call('Cobalt.1', 'deeplink', url);
          thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign });
        })
        .catch(err => { });
      activatedCobalt = true;
    }

    /**
     * Function to launch Netflix/Amazon Prime app.
     */
    launchPremiumApp(childCallsign) {
      // const childCallsign = "Amazon";
      thunder$1
        .call("org.rdk.RDKShell", "launch", {
          callsign: childCallsign,
          type: childCallsign
        })
        .then(() => {
          thunder$1.call("org.rdk.RDKShell", "moveToFront", {
            client: childCallsign
          });
          thunder$1.call("org.rdk.RDKShell", "setFocus", { client: childCallsign });
        })
        .catch(err => { });
      childCallsign === 'Amazon' ? activatedAmazon = true : activatedNetflix = true;
    }

    /**
     * Function to launch Resident app.
     * @param {String} url url of app.
     */
    launchResident(url) {
      const childCallsign = 'ResidentApp';
      thunder$1
        .call('org.rdk.RDKShell', 'launch', {
          callsign: childCallsign,
          type: childCallsign,
          uri: url,
        })
        .then(() => {
          thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
            client: childCallsign,
          });
          thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign });
        })
        .catch(err => {
          console.log('org.rdk.RDKShell launch ' + JSON.stringify(err));
        });
    }

    /**
     * Function to suspend html app.
     */
    suspendWeb() {
      webUrl = '';
      thunder$1.call('org.rdk.RDKShell', 'suspend', { callsign: 'HtmlApp' });
    }

    /**
     * Function to suspend lightning app.
     */
    suspendLightning() {
      lightningUrl = '';
      thunder$1.call('org.rdk.RDKShell', 'suspend', { callsign: 'LightningApp' });
    }

    /**
     * Function to suspend cobalt app.
     */
    suspendCobalt() {
      thunder$1.call('org.rdk.RDKShell', 'suspend', { callsign: 'Cobalt' });
    }


    /**
     * Function to suspend Netflix/Amazon Prime app.
     */
    suspendPremiumApp(appName) {
      thunder$1.call('org.rdk.RDKShell', 'suspend', { callsign: appName });
    }

    /**
     * Function to deactivate html app.
     */
    deactivateWeb() {
      thunder$1.call('org.rdk.RDKShell', 'destroy', { callsign: 'HtmlApp' });
      activatedWeb = false;
      webUrl = '';
    }

    /**
     * Function to deactivate cobalt app.
     */
    deactivateCobalt() {
      thunder$1.call('org.rdk.RDKShell', 'destroy', { callsign: 'Cobalt' });
      activatedCobalt = false;
    }

    /**
     * Function to deactivate Netflix/Amazon Prime app.
     */
    deactivateNativeApp(appName) {
      thunder$1.call('org.rdk.RDKShell', 'destroy', { callsign: appName });
      appName === 'Amazon' ? activatedAmazon = false : activatedNetflix = false;
    }

    /**
     * Function to deactivate lightning app.
     */
    deactivateLightning() {
      thunder$1.call('org.rdk.RDKShell', 'destroy', { callsign: 'LightningApp' });
      activatedLightning = false;
      lightningUrl = '';
    }

    /**
     * Function to set visibility to client apps.
     * @param {client} client client app.
     * @param {visible} visible value of visibility.
     */
    setVisibility(client, visible) {
      thunder$1.call('org.rdk.RDKShell', 'setVisibility', {
        client: client,
        visible: visible,
      });
    }
    /**
     * Function to launch Native app.
     * @param {String} url url of app.
     */
    launchNative(url) {
      const childCallsign = 'testApp';
      if (nativeUrl != url) {
        thunder$1
          .call('org.rdk.RDKShell', 'launchApplication', {
            client: childCallsign,
            uri: url,
            mimeType: 'application/native'
          })
          .then(() => {
            thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
              client: childCallsign,
            });
            thunder$1.call('org.rdk.RDKShell', 'setFocus', {
              client: childCallsign,
            });
          })
          .catch(err => {
            console.log('org.rdk.RDKShell launch ' + JSON.stringify(err));
          });
      } else {
        thunder$1.call('org.rdk.RDKShell', 'moveToFront', {
          client: childCallsign,
        });
        thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: childCallsign });
      }
      nativeUrl = url;
    }



    /**
       * Function to kill native app.
       */
    killNative() {
      thunder$1.call('org.rdk.RDKShell', 'kill', { callsign: 'testApp' });
      nativeUrl = '';
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
        thunder$1
          .call('org.rdk.System.1', 'setPowerState', { "powerState": value, "standbyReason": "Requested by user" })
          .then(result => {
            console.log(JSON.stringify(result, 3, null));
            resolve(result);
          })
          .catch(err => {
            resolve(false);
          });
      })
    }

    audio_mute(value, audio_source) {
      return new Promise((resolve, reject) => {
        thunder$1
          .call('org.rdk.DisplaySettings.1', 'setMuted', { "audioPort": audio_source, "muted": value })
          .then(result => {
            console.log("############ audio_mute ############## value: " + value + " audio_source: " + audio_source);
            console.log(JSON.stringify(result, 3, null));
            resolve(result);
          })
          .catch(err => {
            console.log("audio mute error:", JSON.stringify(err, 3, null));
            resolve(false);
          });

      })
    }

    setVolumeLevel(value) {
      return new Promise((resolve, reject) => {
        thunder$1
          .call('org.rdk.DisplaySettings.1', 'setVolumeLevel', { "audioPort": "HDMI0", "volumeLevel": value })
          .then(result => {
            console.log(JSON.stringify(result, 3, null));
            resolve(result);
          })
          .catch(err => {
            console.log("audio mute error:", JSON.stringify(err, 3, null));
            resolve(false);
          });

      })
    }

    getVolumeLevel() {
      return new Promise((resolve, reject) => {
        thunder$1
          .call('org.rdk.DisplaySettings.1', 'getVolumeLevel', { "audioPort": "HDMI0" })
          .then(result => {
            console.log(JSON.stringify(result, 3, null));
            resolve(result);
          })
          .catch(err => {
            console.log("audio mute error:", JSON.stringify(err, 3, null));
            resolve(false);
          });
      })
    }


    getConnectedAudioPorts() {
      return new Promise((resolve, reject) => {
        thunder$1
          .call('org.rdk.DisplaySettings.1', 'getConnectedAudioPorts', {})
          .then(result => {
            console.log("############ getConnectedAudioPorts ############");
            console.log(JSON.stringify(result, 3, null));
            resolve(result);
          })
          .catch(err => {
            console.log("audio mute error:", JSON.stringify(err, 3, null));
            resolve(false);
          });

      })
    }

    getSoundMode() {
      return new Promise((resolve, reject) => {
        thunder$1
        .call('org.rdk.DisplaySettings.1', 'getSoundMode', {
           "audioPort": "HDMI0" 
        })
        .then(result => {
          console.log("############ getSoundMode ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in getting sound mode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }

    setSoundMode(mode){

      return new Promise((resolve, reject) => {
        thunder$1
        .call('org.rdk.DisplaySettings.1', 'setSoundMode', {
          "audioPort": "HDMI0",
          "soundMode": mode,
          "persist": true

        })

        .then(result => {
          console.log("############ setSoundMode ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in setting sound mode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }

    getSupportedAudioModes(){

      return new Promise((resolve, reject) => {
        thunder$1
        .call('org.rdk.DisplaySettings.1', 'getSupportedAudioModes', {
           "audioPort": "HDMI0" 
        })
        .then(result => {
          console.log("############ getSupportedAudioModes ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in getting support audio sound mode:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }

    //OTHER SETTINGS PAGE API
    
    //1. UI VOICE

    //Start a speech
    speak(){
      return new Promise((resolve, reject) => {
        thunder$1
        .call('org.rdk.TextToSpeech.1', 'speak', {
          "text": "speech_1" 
        })
        .then(result => {
          console.log("############ speak ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in speak:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }

    //Resume a speech
    resume(){
      return new Promise((resolve, reject) => {
        thunder$1
        .call('org.rdk.TextToSpeech.1', 'resume', {
          "speechid": 1 
        })
        .then(result => {
          console.log("############ resume ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in resuming:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }

    //Pause a speech
    pause(){
      return new Promise((resolve, reject) => {
        thunder$1
        .call('org.rdk.TextToSpeech.1', 'pause', {
          "speechid": 1 
        })
        .then(result => {
          console.log("############ pause ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in pausing:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }

    // 2. TTS Options
    getlistVoices(){
      return new Promise((resolve, reject) => {
        thunder$1
        .call('org.rdk.TextToSpeech.1', 'listvoices', {
          "language": "en-US" 
        })
        .then(result => {
          console.log("############ list voices ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in getting voices:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }

    // 3. Sync Location
    syncLocation(){
      return new Promise((resolve, reject) => {
        thunder$1
        .call('LocationSync.1', 'sync')
        .then(result => {
          console.log("############ sync location ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in syncing location:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }



    getLocation(){
      return new Promise((resolve, reject) => {
        thunder$1
        .call('LocationSync.1', 'location')
        .then(result => {
          console.log("############ get location ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in getting location:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }
    // 4. Check for Firmware Update

    //Get Firmware Update Info
    getFirmwareUpdateInfo(){
      return new Promise((resolve, reject) => {
        thunder$1
        .call('org.rdk.System.1', 'getFirmwareUpdateInfo')
        .then(result => {
          console.log("############ firmware update info ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in getting firmware update info:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }

    // Get Firmware Update State
    getFirmwareUpdateState(){
      return new Promise((resolve, reject) => {
        thunder$1
        .call('org.rdk.System.1', 'getFirmwareUpdateState')
        .then(result => {
          console.log("############ firmware update state ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in getting firmware update state:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }

    // 5. Device Info
    systeminfo(){
      return new Promise((resolve, reject) => {
        thunder$1
        .call('DeviceInfo.1', 'systeminfo')
        .then(result => {
          console.log("############ system info ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in getting system info:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
    }

    // 6. Reboot
    reboot(){
      return new Promise((resolve, reject) => {
        thunder$1
        .call('org.rdk.System.1', 'reboot', {
          "rebootReason": "FIRMWARE_FAILURE"
        })
        .then(result => {
          console.log("############ reboot ############");
          console.log(JSON.stringify(result, 3, null));
          resolve(result);
        })
        .catch(err => {
          console.log("error in reboot:", JSON.stringify(err, 3, null));
          resolve(false);
        });
      })
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

  /** Class for main view component in home UI */
  class MainView extends lng$1.Component {
    /**
     * Function to render various elements in main view.
     */
    static _template() {
      return {
        MainView: {
          x: 280,
          w: 1765,
          h: 1080,
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
              textColor: 0xFFFFFFFF,
            },
            zIndex: 0
          },
          AppList: {
            y: 27 + 10,
            x: -20,
            flex: { direction: 'row', paddingLeft: 20, wrap: false },
            type: lng$1.components.ListComponent,
            w: 1745,
            h: 400,
            itemSize: 454 + 20,
            roll: true,
            rollMax: 1745,
            horizontal: true,
            itemScrollOffset: -2,
            clipping: false,
          },
          Text2: {
            // x: 10 + 25,
            y: 425,
            h: 30,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 25,
              text: Language.translate('Featured Apps'),
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF,
            },
          },
          MetroApps: {
            x: -20,
            y: 425 + 30 + 27,
            type: lng$1.components.ListComponent,
            flex: { direction: 'row', paddingLeft: 20, wrap: false },
            w: 1745,
            h: 300,
            itemSize: 268 + 20,
            roll: true,
            rollMax: 1745,
            horizontal: true,
            itemScrollOffset: -4,
            clipping: false,
          },
          Text3: {
            // x: 10 + 25,
            y: 633 + 40,
            h: 30,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 25,
              text: Language.translate('Featured Video on Demand'),
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF,
            },
          },
          TVShows: {
            x: -20,
            y: 673 + 10 + 27,
            w: 1745,
            h: 400,
            type: lng$1.components.ListComponent,
            flex: { direction: 'row', paddingLeft: 20, wrap: false },
            roll: true,
            itemSize: 257 + 20,
            rollMax: 1745,
            horizontal: true,
            itemScrollOffset: -4,
            clipping: false,
          },
        },
      }
    }

    _init() {
      this.settingsScreen = false;
      this._setState('AppList');
      this.indexVal = 0;
      const config = {
        host: '127.0.0.1',
        port: 9998,
        default: 1,
      };
      var thunder = thunderJS(config);
      thunder.on('Controller', 'statechange', notification => {
        if (notification && (notification.callsign == 'Cobalt' || notification.callsign == 'Amazon') && notification.state == 'Deactivation') {
          var appApi = new AppApi();
          Storage.set('applicationType', '');
          appApi.setVisibility('ResidentApp', true);
          thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
            console.log('ResidentApp moveToFront Success' + JSON.stringify(result));
          });
          thunder
            .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
            .then(result => {
              console.log('ResidentApp setFocus Success' + JSON.stringify(result));
            })
            .catch(err => {
              console.log('Error', err);
            });
        }
      });
    }

    /**
     * Function to set details of items in app list.
     */
    set appItems(items) {
      this.tag('AppList').items = items.map(info => {
        return {
          w: 454,
          h: 255,
          type: ListItem,
          data: info,
          focus: 1.11,
          unfocus: 1,
          x_text: 120,
          y_text: 140,
          info: false
        }
      });
      this.tag('AppList').start();
    }

    set metroApps(items) {
      this.tag('MetroApps').items = items.map((info, index) => {
        return {
          w: 268,
          h: 151,
          type: AppListItem,
          data: info,
          focus: 1.15,
          unfocus: 1,
          x_text: 106,
          y_text: 140,
        }
      });
      this.tag('MetroApps').start();
    }

    /**
     * Function to set details of items in tv shows list.
     */
    set tvShowItems(items) {
      this.tag('TVShows').items = items.map(info => {
        return {
          w: 257,
          h: 145,
          type: ListItem,
          data: info,
          focus: 1.15,
          unfocus: 1,
          x_text: 218,
          y_text: 264,
          info: true
        }
      });
      this.tag('TVShows').start();
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
      for (var i = this.tag('AppList').index; i > 0; i--) {
        this.tag('AppList').setPrevious();
      }
      for (var i = this.tag('MetroApps').index; i > 0; i--) {
        this.tag('MetroApps').setPrevious();
      }
      for (var i = this.tag('TVShows').index; i > 0; i--) {
        this.tag('TVShows').setPrevious();
      }
    }

    /**
     * Function to define various states needed for main view.
     */
    static _states() {
      return [
        class AppList extends this {
          _getFocused() {
            this.tag('Text1').text.fontStyle = 'bold';
            if (this.tag('AppList').length) {
              this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('AppList').element.data.url);
              return this.tag('AppList').element
            }
          }
          _handleRight() {
            if (this.tag('AppList').length - 1 != this.tag('AppList').index) {
              this.tag('AppList').setNext();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('AppList').element.data.url);
              return this.tag('AppList').element
            }
          }
          _handleLeft() {
            this.tag('Text1').text.fontStyle = 'normal';
            if (0 != this.tag('AppList').index) {
              this.tag('AppList').setPrevious();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('AppList').element.data.url);
              return this.tag('AppList').element
            } else {
              this.reset();
              this.fireAncestors('$goToSidePanel', 0);
            }
          }
          _handleEnter() {
            var appApi = new AppApi();
            var applicationType = this.tag('AppList').items[this.tag('AppList').index].data.applicationType;
            this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri;
            var appApi = new AppApi();
            applicationType = this.tag('AppList').items[this.tag('AppList').index].data.applicationType;
            Storage.set('applicationType', applicationType);
            this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri;
            if (Storage.get('applicationType') == 'Cobalt') {
              appApi.launchCobalt(this.uri);
              appApi.setVisibility('ResidentApp', false);
            } else if (Storage.get('applicationType') == 'WebApp') {
              appApi.launchWeb(this.uri);
              appApi.setVisibility('ResidentApp', false);
            } else if (Storage.get('applicationType') == 'Lightning') {
              appApi.launchLightning(this.uri);
              appApi.setVisibility('ResidentApp', false);
            } else if (Storage.get('applicationType') == 'Native') {
              appApi.launchNative(this.uri);
              appApi.setVisibility('ResidentApp', false);
            } else if (Storage.get('applicationType') == 'Amazon') {
              appApi.launchPremiumApp('Amazon');
              appApi.setVisibility('ResidentApp', false);
            } else if (Storage.get('applicationType') == 'Netflix') {
              appApi.launchPremiumApp('Netflix');
              appApi.setVisibility('ResidentApp', false);
            }
          }
          _handleKey(key) {
            const config = {
              host: '127.0.0.1',
              port: 9998,
              default: 1,
            };
            var thunder = thunderJS(config);
            console.log('_handleKey', key.keyCode);
            var appApi = new AppApi();
            if (key.keyCode == 27 || key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36 || key.keyCode == 158) {
              if (Storage.get('applicationType') == 'WebApp') {
                Storage.set('applicationType', '');
                appApi.deactivateWeb();
                appApi.setVisibility('ResidentApp', true);
              } else if (Storage.get('applicationType') == 'Lightning') {
                Storage.set('applicationType', '');
                appApi.deactivateLightning();
                appApi.setVisibility('ResidentApp', true);
              } else if (Storage.get('applicationType') == 'Native') {
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
              }
              thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
                console.log('ResidentApp moveToFront Success');
              });
              thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
                console.log('ResidentApp moveToFront Success');
              });
              thunder
                .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
                .then(result => {
                  console.log('ResidentApp moveToFront Success');
                })
                .catch(err => {
                  console.log('Error', err);
                });
            } else return false
          }
        },
        class MetroApps extends this {
          _getFocused() {
            this.tag('Text2').text.fontStyle = 'bold';
            if (this.tag('MetroApps').length) {
              this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('MetroApps').element.data.url);
              return this.tag('MetroApps').element
            }
          }
          _handleRight() {
            if (this.tag('MetroApps').length - 1 != this.tag('MetroApps').index) {
              this.tag('MetroApps').setNext();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('MetroApps').element.data.url);
              return this.tag('MetroApps').element
            }
          }
          _handleLeft() {
            this.tag('Text2').text.fontStyle = 'normal';
            if (0 != this.tag('MetroApps').index) {
              this.tag('MetroApps').setPrevious();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('MetroApps').element.data.url);
              return this.tag('MetroApps').element
            } else {
              this.reset();
              this.fireAncestors('$goToSidePanel', 1);
            }
          }
          _handleEnter() {
            var appApi = new AppApi();
            var applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
            this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;
            var appApi = new AppApi();
            applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
            Storage.set('applicationType', applicationType);
            this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;
            if (Storage.get('applicationType') == 'Cobalt') {
              appApi.launchCobalt(this.uri);
              appApi.setVisibility('ResidentApp', false);
            } else if (Storage.get('applicationType') == 'WebApp') {
              appApi.launchWeb(this.uri);
              appApi.setVisibility('ResidentApp', false);
            } else if (Storage.get('applicationType') == 'Lightning') {
              appApi.launchLightning(this.uri);
              appApi.setVisibility('ResidentApp', false);
            } else if (Storage.get('applicationType') == 'Native') {
              appApi.launchNative(this.uri);
              appApi.setVisibility('ResidentApp', false);
            }
          }
          _handleKey(key) {
            const config = {
              host: '127.0.0.1',
              port: 9998,
              default: 1,
            };
            var thunder = thunderJS(config);
            var appApi = new AppApi();
            console.log('_handleKey', key.keyCode);
            if (Storage.get('applicationType') == 'Cobalt') {
              if ((key.ctrlKey && (key.keyCode == 77 || key.keyCode == 49)) || key.keyCode == 36 || key.keyCode == 27 || key.keyCode == 158) { // To minimise  application when user pressed ctrl+m, ctrl+1, or esc, home buttons
                Storage.set('applicationType', '');
                appApi.suspendCobalt();
                appApi.setVisibility('ResidentApp', true);
              }
            } else if ((key.keyCode == 27 || key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36 || key.keyCode == 158) && !key.ctrlKey) {
              if (Storage.get('applicationType') == 'WebApp') {
                Storage.set('applicationType', '');
                appApi.deactivateWeb();
                appApi.setVisibility('ResidentApp', true);
              } else if (Storage.get('applicationType') == 'Lightning') {
                Storage.set('applicationType', '');
                appApi.deactivateLightning();
                appApi.setVisibility('ResidentApp', true);
              } else if (Storage.get('applicationType') == 'Native') {
                Storage.set('applicationType', '');
                appApi.killNative();
                appApi.setVisibility('ResidentApp', true);
              } else return false;
              thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
                console.log('ResidentApp moveToFront Success');
              });
              thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
                console.log('ResidentApp moveToFront Success');
              });
              thunder
                .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
                .then(result => {
                  console.log('ResidentApp moveToFront Success');
                })
                .catch(err => {
                  console.log('Error', err);
                });
            } else return false;
          }
        },
        class TVShows extends this {
          $enter() {
            this.fireAncestors('$scroll', -350);
          }
          _getFocused() {
            this.tag('Text3').text.fontStyle = 'bold';
            if (this.tag('TVShows').length) {
              this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('TVShows').element.data.url);

              return this.tag('TVShows').element
            }
          }
          _handleRight() {
            if (this.tag('TVShows').length - 1 != this.tag('TVShows').index) {
              this.tag('TVShows').setNext();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('TVShows').element.data.url);
              return this.tag('TVShows').element
            }
          }
          _handleLeft() {
            this.tag('Text3').text.fontStyle = 'normal';
            if (0 != this.tag('TVShows').index) {
              this.tag('TVShows').setPrevious();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('TVShows').element.data.url);
              return this.tag('TVShows').element
            } else {
              this.reset();
              this.fireAncestors('$goToSidePanel', 2);
            }
          }
          // _handleUp() {
          //   this.tag('Text3').text.fontStyle = 'normal'
          //   this._setState('MetroApps')
          // }
          _handleEnter() {
            this.fireAncestors('$goToPlayer');
          }
          $exit() {
            this.fireAncestors('$scroll', 0);
          }
        },
        class RightArrow extends this {
          //TODO
        },
        class LeftArrow extends this {
          //TODO
        },
      ]
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
            H: 70,
          },
          Title: {
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 40,
              textColor: 0xffffffff,
            },
          }
        },
      }
    }

    _init() {
      this.tag('Image').patch({
        src: Utils.asset(this.data.url),
        w: this.w,
        h: this.h,
        scale: this.unfocus,
      });
    }

    /**
     * Function to change properties of item during focus.
     */
    _focus() {
      this.tag('Image').patch({ w: this.w, h: this.h, scale: this.focus, color: CONFIG.theme.hex });
    }

    /**
     * Function to change properties of item during unfocus.
     */
    _unfocus() {
      this.tag('Image').patch({ w: this.w, h: this.h, scale: this.unfocus, color: 0xffffffff });
    }

    setColor(){
      this.tag('Image').patch({ w: this.w, h: this.h, scale: this.focus, color: CONFIG.theme.hex });
    }
    clearColor(){
      this.tag('Image').patch({ w: this.w, h: this.h, scale: this.unfocus, color: 0xffffffff });
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
        default: 1,
      };
      this._thunder = thunderJS(config);
      this.callsign = 'org.rdk.Network.1';
    }

    /**
     * Function to activate network plugin
     */
    activate() {
      return new Promise((resolve, reject) => {
        this._thunder.call('Controller', 'activate', { callsign: this.callsign }).then(result => {
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
      })
    }
    /**
     * Function to return available interfaces.
     */
    getInterfaces(){
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign,'getInterfaces').then(result => {
          if(result.success){
            console.log('getInterfaces result: ' + JSON.stringify(result.interfaces));
            resolve(result.interfaces);
          }
        }).catch(err => {
          console.error(`getInterfaces fail: ${err}`);
          reject(err);
        });
      })
    }

    /**
     * Function to return default interfaces.
     */
    getDefaultInterface(){
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign,'getDefaultInterface').then(result => {
          if(result.success){
            console.log('getDefaultInterface result: ' + result.interface);
            resolve(result.interface);
          }
        }).catch(err => {
          console.error(`getDefaultInterface fail: ${err}`);
          reject(err);
        });
      })
    }

    setDefaultInterface(interfaceName){
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign,'setDefaultInterface', 
          {
            "interface": interfaceName,
            "persist": true
          }).then(result => {
            console.log('setDefaultInterface from network API: '+ JSON.stringify(result));
            resolve(result);
          }).catch(err => {
            console.error(`setDefaultInterface fail: ${err}`);
            reject(err);
          });
      })
    }

    getSTBIPFamily(){
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign,'getSTBIPFamily').then(result => {
          //need to check
        });
      })
    }

    /**
     * Function to return IP Settings.
     */

    getIPSettings(currentInterface){
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign,'getIPSettings', 
          {
            "interface": currentInterface,
          }).then(result => {
            console.log('getIPSettings from network API: '+ JSON.stringify(result));
            resolve(result);
        }).catch(err => {
          console.error(`getIPSettings fail: ${err}`);
          reject(err);
        });
      })
    }

    /**
     * Function to set IP Settings.
     */

    setIPSettings(IPSettings){
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign,'setIPSettings', IPSettings).then(result => {
            console.log('setIPSettings from network API: '+ JSON.stringify(result));
            resolve(result);
        }).catch(err => {
          console.error(`setIPSettings fail: ${err}`);
          reject(err);
        });
      })
    }


    isConnectedToInternet(){
      return new Promise((resolve, reject) => {
        this._thunder.call(this.callsign,'isConnectedToInternet').then(result => {
          if(result.success){
            console.log('from networkAPI isConnectedToInternet result: ' + result.connectedToInternet);
            resolve(result.connectedToInternet);
          }
        }).catch(err => {
          console.error(`isConnectedToInternet fail: ${err}`);
          reject(err);
        });
      })
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
  var appListInfo = [
    {
      displayName: 'Test Youtube',
      applicationType: 'Cobalt',
      uri: 'https://www.youtube.com/tv',
      url: '/images/apps/youtube.png',
    },
    {
      displayName: 'Test Xumo',
      applicationType: 'WebApp',
      uri: 'https://x1box-app.xumo.com/3.0.70/index.html',
      url: '/images/apps/xumo.png',
    },
    {
      displayName: 'Test Netflix',
      applicationType: 'Netflix',
      uri: '',
      url: '/images/apps/netflix.png',
    },
    {
      displayName: 'Test Prime video',
      applicationType: 'Amazon',
      uri: '',
      url: '/images/apps/prime.png',
    },
    {
      displayName: 'Bluetooth Audio',
      applicationType: 'Lightning',
      uri: 'https://rdkwiki.com/rdk-apps/BluetoothAudio/index.html',
      url: '/images/apps/netflix.png',
    }
  ];

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
  var tvShowsInfo = [
    {
      displayName: 'Fantasy-Island',
      url: '/images/tvShows/fantasy-island.jpg',
    },
    {
      displayName: 'Onward',
      url: '/images/tvShows/onward.jpg',
    },
    {
      displayName: 'Let it Snow',
      url: '/images/tvShows/let-it-snow.png',
    },
    {
      displayName: 'Do Little',
      url: '/images/tvShows/do-little.jpg',
    },
    {
      displayName: 'Summerland',
      url: '/images/tvShows/summerland.jpg',
    },
  ];

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
  var settingsInfo = [
    {
      displayName: 'Bluetooth',
      url: '/images/settings/bluetooth.jpg',
    },
    {
      displayName: 'Wi-Fi',
      url: '/images/settings/wifi.jpg',
    },
  ];

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
  var sidePanelInfo = [
    {
      title: 'Apps',
      url: '/images/sidePanel/menu.png',
    },
    {
      title: 'Metro Apps',
      url: '/images/sidePanel/metro.png',
    },
    {
      title: 'TV Shows',
      url: '/images/sidePanel/video.png',
    },
    {
      title: 'Settings',
      url: '/images/sidePanel/settings.png',
    },
  ];

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
  var rightArrowInfo = [

      {
          url: '/images/right-small.png',
      },

      {
          url: '/images/right-small.png',
      },

      {
          url: '/images/right-small.png',
      },

  ];

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
  var leftArrowInfo = [
     {
        url: '/images/left-small.png',
     },

     {
        url: '/images/left-small.png',
     },
     {
        url: '/images/left-small.png',
     },

  ];

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
   var uiInfo = [
    {
      title: 'DEFAULT',
      url: '/images/splash/DefaultUI.png',
      uri: '',
    },
    {
      title: 'LIVE',
      url: '/images/splash/LiveTv.png',
      uri: 'http://35.155.171.121:8088/index.html',

    },
    {
      title: 'TATA',
      url: '/images/splash/TataElxsi.png',
      uri: 'http://35.155.171.121:8088/index.html',

    },
    {
      title: 'EPAM',
      url: '/images/splash/Epam.png',
      uri: 'https://px-apps.sys.comcast.net/lightning_apps/diagnostics/dist/index.html',
    },
    {
      title: 'NEW',
      url: '/images/splash/NewUi.png',
      uri: 'https://px-apps.sys.comcast.net/lightning_apps/diagnostics/dist/index.html',
    },
    {
      title: 'COMINGSOON',
      url: '/images/splash/ComingSoon.png',
      uri: 'https://px-apps.sys.comcast.net/lightning_apps/diagnostics/dist/index.html',
    },
  ];

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
   var metroAppsInfo = [
    {
      displayName: "CNN",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.CNN",
      url: "http://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.CNN.png"
    },
    {
      displayName: "VimeoRelease",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.VimeoRelease",
      url: "http://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.VimeoRelease.png"
    },
    {
      displayName: "WeatherNetwork",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WeatherNetwork",
      url: "http://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.WeatherNetwork.png"
    },
    {
      displayName: "EuroNews",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Euronews",
      url: "http://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.Euronews.png"
    },
    {
      displayName: "AccuWeather",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.AccuWeather",
      url: "http://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.AccuWeather.png"
    },
    {
      displayName: "BaebleMusic",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.BaebleMusic",
      url: "http://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.BaebleMusic.png"
    },
    {
      displayName: "Aljazeera",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Aljazeera",
      url: "http://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.Aljazeera.png"
    },
    {
      displayName: "GuessThatCity",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.GuessThatCity",
      url: "http://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.GuessThatCity.png"
    },
    {
      displayName: "Radioline",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Radioline",
      url: "http://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.Radioline.png"
    },
    {
      displayName: "WallStreetJournal",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WallStreetJournal",
      url: "http://cdn-ipv6.metrological.com/lightning/apps/com.metrological.ui.FutureUI/2.0.15-ea2bf91/static/images/applications/com.metrological.app.WallStreetJournal.png"
    }
  ];

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
  var metroAppsInfoOffline = [
    {
      displayName: "CNN",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.CNN",
      url: "/images/metroApps/Test-01.png"
    },
    {
      displayName: "VimeoRelease",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.VimeoRelease",
      url: "/images/metroApps/Test-02.png"
    },
    {
      displayName: "WeatherNetwork",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WeatherNetwork",
      url: "/images/metroApps/Test-03.png"
    },
    {
      displayName: "EuroNews",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Euronews",
      url: "/images/metroApps/Test-04.png"
    },
    {
      displayName: "AccuWeather",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.AccuWeather",
      url: "/images/metroApps/Test-05.png"
    },
    {
      displayName: "BaebleMusic",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.BaebleMusic",
      url: "/images/metroApps/Test-06.png"
    },
    {
      displayName: "Aljazeera",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Aljazeera",
      url: "/images/metroApps/Test-07.png"
    },
    {
      displayName: "GuessThatCity",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.GuessThatCity",
      url: "/images/metroApps/Test-08.png"
    },
    {
      displayName: "Radioline",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.Radioline",
      url: "/images/metroApps/Test-09.png"
    },
    {
      displayName: "WallStreetJournal",
      applicationType: "Lightning",
      uri: "https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d#app:com.metrological.app.WallStreetJournal",
      url: "/images/metroApps/Test-10.png"
    }
  ];

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
  });

  var appApi$3 = new AppApi();
  appApi$3.getIP().then(ip => {
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
      return appListInfo
    }

    /**
     * Function to get details for tv shows listings.
     */
    getTVShowsInfo() {
      return tvShowsInfo
    }

    /**
     * Function to get details for settings listings.
     */
    getSettingsInfo() {
      return settingsInfo
    }

    /**
     * Function to get details for side panel.
     */
    getSidePanelInfo() {
      return sidePanelInfo
    }

    /**
     * Function to get details of different UI
     */
    getUIInfo() {
      return uiInfo
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

      return metroAppsMetaData
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
      return partnerApps
    }
    /**
    * Function to details of right arrow
    */
    getRightArrowInfo() {
      return rightArrowInfo
    }
    /**
      * Function to details of left arrow
      */
    getLeftArrowInfo() {
      return leftArrowInfo
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
          y: 0,
          w: 240,
          h: 750,
          type: lng$1.components.ListComponent,
          roll: true,
          horizontal: false,
          invertDirection: true,
        },
      }
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
      this.tag('SidePanel').patch({ x: 105 });
      this.tag('SidePanel').items = items.map((info, index) => {
        this.data = info;
        return {
          w: 70,
          h: 70,
          y: index == 0 ? 70 : (index + 1) * 70,
          type: SidePanelItem,
          data: info,
          focus: 1.1,
          unfocus: 1,
          x_text: 100,
          y_text: 160,
          text_focus: 1.1,
          text_unfocus: 0.9,
        }
      });
      this.tag('SidePanel').start();
    }

    /**
     * Function to reset items in side panel.
     */
    set resetSidePanelItems(items) {
      this.tag('SidePanel').patch({ x: 0 });
      this.tag('SidePanel').items = items.map((info, index) => {
        return {
          w: 204,
          h: 184,
          y: index == 0 ? 25 : (index == 1 ? 105 : (index == 2 ? 260 : 470)),
          type: SidePanelItem,
          data: info,
          focus: 0.7,
          unfocus: 0.4,
          x_text: 100,
          y_text: 160,
          text_focus: 1.1,
          text_unfocus: 0.9,
        }
      });
      this.tag('SidePanel').start();
    }
    /**
     * Function to set scaling to side panel.
     */
    set scale(scale) {
      this.tag('SidePanel').patch({ scale: scale });
    }

    /**
     * Function to set x coordinate of side panel.
     */
    set x(x) {
      this.tag('SidePanel').patch({ x: x });
    }

    /**
     * Function to set index value of side panel.
     */
    set index(index) {
      this.tag('SidePanel').items[this.prevIndex].clearColor();
      this.indexVal = index;
    }

    static _states() {
      return [
        class SidePanel extends this {
          _getFocused() {
            if (this.tag('SidePanel').length) {
              if (this.indexVal >= 2) {
                this.fireAncestors('$scroll', -350);
              }
              else {
                this.fireAncestors('$scroll', 0);
              }
              return this.tag('SidePanel').items[this.indexVal]
            }
          }
          _handleKey(key) {
            if (key.keyCode == 39 || key.keyCode == 13) {
              if(this.prevIndex != this.indexVal){
                this.tag('SidePanel').items[this.prevIndex].clearColor();
              }
              
              this.fireAncestors('$goToMainView', this.indexVal == 3 ? 2 : this.indexVal);
              this.tag('SidePanel').items[this.indexVal].setColor();
              this.prevIndex = this.indexVal;
              
            } else if (key.keyCode == 40) {
              if (this.tag('SidePanel').length - 1 != this.indexVal) {
                this.indexVal = this.indexVal + 1;
              }
              return this.tag('SidePanel').items[this.indexVal]
            } else if (key.keyCode == 38) {
              if (0 === this.indexVal) {
                this.fireAncestors('$goToTopPanel', 0);
              }else {
                this.indexVal = this.indexVal - 1;
                return this.tag('SidePanel').items[this.indexVal]
              }
            } else return false;
          }
        },
      ]
    }
  }

  // Inlined version of the `symbol-observable` polyfill
  var $$observable = (function () {
    return typeof Symbol === 'function' && Symbol.observable || '@@observable';
  })();

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
  }

  // Inlined / shortened version of `kindOf` from https://github.com/jonschlinkert/kind-of
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
      return 0
    }
    switch (action.type) {
      case 'ACTION_LISTEN_START':
        return "ACTION_LISTEN_START"
      case 'ACTION_LISTEN_STOP':
        return "ACTION_LISTEN_STOP"
      default:
        return state
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
            y: 77,
            src: Utils.asset('/images/topPanel/microphone.png'),
            w: 70,
            h: 70,
          },
          Logo: {
            x: 315 - 35,
            y: 90,
            src: Utils.asset('/images/' + CONFIG.theme.logo),
            w: 227,
            h: 43
          },
          Page: {
            x: 315 - 35,
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
            h: 37,
          },
          Time: {
            x: 1920 - 105 - 160,
            y: 111,
            mountY: 0.5,
            text: { text: '', fontSize: 35, fontFace: CONFIG.language.font, },
            w: 160,
            h: 60,
          },
        },
      }
    }

    _init() {
      this.indexVal = 0,
        this.timeZone = null;
      this.audiointerval = null;
      new AppApi().getZone().then(function (res) {
        this.timeZone = res;
      }.bind(this)).catch(err => { console.log('Timezone api request error', err); });

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
              if (mode > 20) { mode = 0; }          }.bind(this), 250);
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
        this._setState('Setting');
      }
    }

    set changeText(text) {
      this.tag('Page').text.text = text;
      if (text === 'Home') {
        this.tag('Settings').color = 0xffffffff;
      }

    }

    _build() {
      setInterval(() => {
        let _date = this.updateTime();
        if (this.zone) {
          this.tag('Time').patch({ text: { text: _date.strTime } });
        }
      }, 1000);
    }

    updateIcon(tagname, url) {
      this.tag(tagname).patch({
        src: Utils.asset(url),
      });
    }

    /**
     * Function to update time in home UI.
     */
    updateTime() {
      if (this.zone) {
        let date = new Date();
        date = new Date(date.toLocaleString('en-US', { timeZone: this.zone }));

        // get day
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let strDay = days[date.getDay()];

        // get month
        let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let strMonth = month[date.getMonth()];
        let strDate = date.toLocaleDateString('en-US', { day: '2-digit' }) + ' ' + strMonth + ' ' + date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return { strTime, strDay, strDate }
      } else {
        return ""
      }
    }

    static _states() {
      return [
        class Mic extends this{
          $enter() {
            this.tag('Mic').color = CONFIG.theme.hex;
          }
          _handleEnter() {
          }
          _getFocused() {
            this.tag('Mic').color = CONFIG.theme.hex;
          }
          $exit() {
            this.tag('Mic').color = 0xffffffff;
          }

          _handleKey(key) {
            if (key.keyCode == 39 || key.keyCode == 13) {
              this._setState('Setting');
            } else if (key.keyCode == 40) {
              this.tag('Mic').color = 0xffffffff;
              this.fireAncestors('$goToSidePanel', 0);
            }
          }
        },
        class Setting extends this{
          $enter() {
            this.tag('Settings').color = CONFIG.theme.hex;
          }
          _handleDown() {

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
        },
      ]
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
    headingColor: 0xffffffff,
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
          w: 1535,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        },
        Item: {
          w: 1535,
          h: 90,
        },
        BottomLine: {
          y: 90,
          mountY: 0.5,
          w: 1535,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        },
      }
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
          text: { text: item, fontSize: 25, textColor: COLORS.textColor, fontFace: CONFIG.language.font, },
        },
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
           w: 1535,
           h: 3,
           rect: true,
           color: 0xFFFFFFFF
         },
         Item: {
           w: 1920 -300,
           h: 90,
         },
         BottomLine: {
           y: 90,
           mountY: 0.5,
           w: 1535,
           h: 3,
           rect: true,
           color: 0xFFFFFFFF
         },
       }
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
           text: { text: item.name, fontSize: 25, textColor: COLORS.textColor, fontFace: CONFIG.language.font },
         },
   
         Right: {
           x: 1535-200,
           y: 30,
           mountY: 0.5,
           mountX:1,
           Text: { text: { text: this.status, fontSize: 25,fontFace:CONFIG.language.font,verticalAlign:"middle" } },
         },
        //  Debug:{
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
         zIndex:10
       });
      this.tag('TopLine').h = 6;
      this.tag('BottomLine').h = 6;
     }
   
     _unfocus() {
       this.tag('TopLine').color = 0xFFFFFFFF;
       this.tag('BottomLine').color = 0xFFFFFFFF;
       this.patch({
         zIndex:1
       });
        this.tag('TopLine').h = 3;
        this.tag('BottomLine').h = 3;
     }
     // _handleEnter() {
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
    static _template(){
      return {
        zIndex:1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1535,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        },
        Item: {
          w: 1920 - 300,
          h: 90,
          rect: true,
          color: 0x00000000,
        },
        BottomLine: {
          y: 0 + 90,
          mountY: 0.5,
          w: 1535,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        },
      }
    }

    _init() {

    }

    _focus() {
      this.tag('TopLine').color = CONFIG.theme.hex;
      this.tag('BottomLine').color = CONFIG.theme.hex;
      this.patch({
        zIndex:2
      });
      this.tag('TopLine').h = 6;
      this.tag('BottomLine').h = 6;
    }

    _unfocus() {
      this.tag('TopLine').color = 0xFFFFFFFF;
      this.tag('BottomLine').color = 0xFFFFFFFF;
      this.patch({
        zIndex:1
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
      console.log('Bluetooth constructor');
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
          default: 1,
        };
        this._thunder = thunderJS(config);
        this.callsign = 'org.rdk.Bluetooth';
        this._thunder
          .call('Controller', 'activate', { callsign: this.callsign })
          .then(result => {
            console.log('Bluetooth activated', result);
            this._thunder.on(this.callsign, 'onDiscoveredDevice', notification => {
              console.log('onDiscoveredDevice ' + JSON.stringify(notification));
              this.getDiscoveredDevices().then(() => {
                this._events.get('onDiscoveredDevice')(notification);
              });
            });
            this._thunder.on(this.callsign, 'onStatusChanged', notification => {
              console.log('onStatusChanged ' + notification.newStatus);
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
              console.log('onPairingRequest ' + JSON.stringify(notification));
              this._events.get('onPairingRequest')(notification);
            });
            this._thunder.on(this.callsign, 'onRequestFailed', notification => {
              console.log('onRequestFailed ' + JSON.stringify(notification));
              this._events.get('onRequestFailed')(notification);
            });
            this._thunder.on(this.callsign, 'onConnectionRequest', notification => {
              console.log('onConnectionRequest ' + JSON.stringify(notification));
              this._events.get('onConnectionRequest')(notification);
            });
            resolve('Blutooth activated');
          })
          .catch(err => {
            console.error('Activation failure', err);
            reject('Bluetooth activation failed', err);
          });
      })
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
        this._thunder
          .call('org.rdk.Bluetooth', 'disable')
          .then(result => {
            console.log(JSON.stringify(result));
            resolve(result);
          })
          .catch(err => {
            console.error(`Can't disable : ${err}`);
            reject();
          });
      })
    }

    /**
     * Function to enable the Bluetooth stack.
     */
    enable() {
      return new Promise((resolve, reject) => {
        this._thunder
          .call('org.rdk.Bluetooth', 'enable')
          .then(result => {
            console.log(JSON.stringify(result));
            resolve(result);
          })
          .catch(err => {
            console.error(`Can't enable : ${err}`);
            reject();
          });
      })
    }

    /**
     * Function to start scanning for the Bluetooth devices.
     */
    startScan() {
      return new Promise((resolve, reject) => {
        this._thunder
          .call('org.rdk.Bluetooth', 'startScan', {
            timeout: '10',
            profile: 'KEYBOARD,MOUSE,JOYSTICK',
          })
          .then(result => {
            console.log('scanning : ' + result.success);
            if (result.success) resolve();
            else reject();
          })
          .catch(err => {
            console.error('Error', err);
            reject();
          });
      })
    }

    /**
     * Function to stop scanning for the Bluetooth devices.
     */
    stopScan() {
      return new Promise((resolve, reject) => {
        this._thunder
          .call('org.rdk.Bluetooth', 'startScan', {})
          .then(result => {
            console.log('stopped scanning : ' + result.success);
            if (result.success) resolve();
            else reject();
          })
          .catch(err => {
            console.error('Error', err);
            reject();
          });
      })
    }

    /**
     * Function returns the discovered Bluetooth devices.
     */
    getDiscoveredDevices() {
      return new Promise((resolve, reject) => {
        this._thunder
          .call('org.rdk.Bluetooth', 'getDiscoveredDevices')
          .then(result => {
            console.log(JSON.stringify(result));
            this._devices = result.discoveredDevices;
            resolve(result.discoveredDevices);
          })
          .catch(err => {
            console.error(`Can't get discovered devices : ${err}`);
            reject();
          });
      })
    }
    get discoveredDevices() {
      return this._devices
    }

    /**
     * Function returns the paired Bluetooth devices.
     */
    getPairedDevices() {
      return new Promise((resolve, reject) => {
        this._thunder
          .call('org.rdk.Bluetooth', 'getPairedDevices')
          .then(result => {
            console.log(JSON.stringify(result));
            this._pairedDevices = result.pairedDevices;
            resolve(result.pairedDevices);
          })
          .catch(err => {
            console.error(`Can't get paired devices : ${err}`);
            reject();
          });
      })
    }
    get pairedDevices() {
      return this._pairedDevices
    }

    /**
     * Function returns the connected Bluetooth devices.
     */
    getConnectedDevices() {
      return new Promise((resolve, reject) => {
        this._thunder
          .call('org.rdk.Bluetooth', 'getConnectedDevices')
          .then(result => {
            console.log(JSON.stringify(result));
            this._connectedDevices = result.connectedDevices;
            resolve(result.connectedDevices);
          })
          .catch(err => {
            console.error(`Can't get connected devices : ${err}`);
            reject();
          });
      })
    }

    get connectedDevices() {
      return this._connectedDevices
    }

    /**
     *
     * Function to connect a Bluetooth device.
     * @param {number} deviceID Device ID of the Bluetoth client.
     * @param {string} deviceType Device type of the Bluetooth client.
     */
    connect(deviceID, deviceType) {
      return new Promise((resolve, reject) => {
        console.log(deviceID);
        this._thunder
          .call('org.rdk.Bluetooth', 'connect', {
            deviceID: deviceID,
            deviceType: deviceType,
            profile: deviceType,
          })
          .then(result => {
            console.log('connected : ' + result.success);
            resolve(result.success);
          })
          .catch(err => {
            console.error('Connection failed', err);
            reject();
          });
      })
    }

    /**
     * Function to disconnect a Bluetooth device.
     *@param {number} deviceID Device ID of the Bluetoth client.
     *@param {string} deviceType Device type of the Bluetooth client.
     */
    disconnect(deviceID, deviceType) {
      console.log(deviceID);
      return new Promise((resolve, reject) => {
        this._thunder
          .call('org.rdk.Bluetooth', 'disconnect', {
            deviceID: deviceID,
            deviceType: deviceType,
          })
          .then(result => {
            console.log('disconnected : ' + result.success);
            if (result.success) resolve(true);
            else reject();
          })
          .catch(err => {
            console.error('disconnect failed', err);
            reject();
          });
      })
    }

    /**
     * Function to unpair a Bluetooth device.
     * @param {number} deviceId
     */
    unpair(deviceId) {
      return new Promise((resolve, reject) => {
        this._thunder
          .call('org.rdk.Bluetooth', 'unpair', { deviceID: deviceId })
          .then(result => {
            console.log('unpaired : ' + result.success);
            if (result.success) resolve();
            else reject();
          })
          .catch(err => {
            console.error('unpair failed', err);
            reject();
          });
      })
    }

    /**
     * Function to pair a Bluetooth device.
     * @param {number} deviceId
     */
    pair(deviceId) {
      return new Promise((resolve, reject) => {
        this._thunder
          .call('org.rdk.Bluetooth', 'pair', { deviceID: deviceId })
          .then(result => {
            console.log('paired : ' + result.success);
            if (result.success) resolve();
            else reject();
          })
          .catch(err => {
            console.error('Error on pairing', err);
            reject();
          });
      })
    }

    /**
     * Function to respond to client the Bluetooth event.
     * @param {number} deviceID Device ID of the Bluetooth client.
     * @param {string} eventType Name of the event.
     * @param {string} responseValue Response sent to the Bluetooth client.
     */
    respondToEvent(deviceID, eventType, responseValue) {
      return new Promise((resolve, reject) => {
        this._thunder
          .call('org.rdk.Bluetooth', 'respondToEvent', {
            deviceID: deviceID,
            eventType: eventType,
            responseValue: responseValue,
          })
          .then(result => {
            console.log('responded to event : ' + result.success);
            if (result.success) resolve();
            else reject();
          })
          .catch(err => {
            console.error('Error on respondToEvent', err);
            reject();
          });
      })
    }

    /**
     * Function to get the discoverable name of the Bluetooth plugin.
     */
    getName() {
      return new Promise((resolve, reject) => {
        this._thunder.call('org.rdk.Bluetooth', 'getName').then(result => {
          resolve(result.name);
        });
      })
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
          mount:0.5,
          rect: true,
          color: 0xff000000,
        },
          Title: {
              x: 0,
              y: 0,
              mountX:0.5,
              text: {
                text: "",
                fontFace: CONFIG.language.font,
                fontSize: 40,
                textColor: CONFIG.theme.hex,
              },
            },
            BorderTop: {
              x: 0, y: 75, w: 1558, h: 3, rect: true,mountX:0.5,
            },
            Pairing: {
              x: 0,
              y: 125,
              mountX:0.5,
              text: {
                text: "",
                fontFace: CONFIG.language.font,
                fontSize: 25,
              },
            },
            RectangleDefault: {
              x: 0, y: 200, w: 200, mountX:0.5, h: 50, rect: true, color: CONFIG.theme.hex,
              Ok: {
                x: 100,
                y: 25,
                mount:0.5,
                text: {
                  text: "OK",
                  fontFace: CONFIG.language.font,
                  fontSize: 22,
                },
              }
            },
            BorderBottom: {
              x: 0, y: 300, w: 1558, h: 3, rect: true,mountX:0.5,
            },
          
       }
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
              mount:0.5,
              rect: true,
              color: 0xff000000,
            },
          Title: {
              x: 0,
              y: 0,
              mountX:0.5,
              text: {
                text: "",
                fontFace: CONFIG.language.font,
                fontSize: 40,
                textColor: CONFIG.theme.hex,
              },
            },
            BorderTop: {
              x: 0, y: 75, w: 1558, h: 3, rect: true,mountX:0.5,
            },
            Pairing: {
              x: 0,
              y: 125,
              mountX:0.5,
              text: {
                text: "",
                fontFace: CONFIG.language.font,
                fontSize: 25,
              },
            },
            Buttons:{
              x: 0, y: 200, w: 440, mountX:0.5, h: 50,
              ConnectDisconnect: {
                  x: 0, w: 200, mountX:0.5, h: 50, rect: true, color: 0xFFFFFFFF,
                  Title: {
                  x: 100,
                  y: 25,
                  mount:0.5,
                  text: {
                      text: "",
                      fontFace: CONFIG.language.font,
                      fontSize: 22,
                      textColor:0xFF000000
                  },
                  }
              },
              Unpair: {
                  x: 0+220, w: 200, mountX:0.5, h: 50, rect: true, color: 0xFFFFFFFF,
                  Title: {
                  x: 100,
                  y: 25,
                  mount:0.5,
                  text: {
                      text: "Unpair",
                      fontFace: CONFIG.language.font,
                      fontSize: 22,
                      textColor:0xFF000000
                  },
                  }
              },
              Cancel: {
                  x: 0+220+220, w: 200, mountX:0.5, h: 50, rect: true, color: 0xFF7D7D7D,
                  Title: {
                  x: 100,
                  y: 25,
                  mount:0.5,
                  text: {
                      text: "Cancel",
                      fontFace: CONFIG.language.font,
                      fontSize: 22,
                      textColor:0xFF000000
                  },
                  }
              },
            },
            BorderBottom: {
              x: 0, y: 300, w: 1558, h: 3, rect: true,mountX:0.5,
            },
          
       }
     }

     set item(item) {
         _item = item;
         this._setState('ConnectDisconnect');
      this.tag('Title').text = item.name;
      if (item.connected){
          this.tag('ConnectDisconnect.Title').text = 'Disconnect';
      } else {
          this.tag('ConnectDisconnect.Title').text = 'Connect';
      }
      }

      _init(){
          this._setState('ConnectDisconnect');
      }

      static _states() {
          return [
            class ConnectDisconnect extends this {
                  $enter(){
                    this._focus();
                }
              _handleEnter(){
                  // this.tag('Pairing').text = "Someting is wrong " + _item.name
                  if (_item.connected){
                      // this.tag('Pairing').text = "Connecting to " + _item.name
                      this.fireAncestors('$pressEnter', 'Disconnect');
                  } else {
                      // this.tag('Pairing').text = "Disconnecting from " + _item.name
                      this.fireAncestors('$pressEnter', 'Connect');
                  }
              }
              _handleRight(){
                  this._setState('Unpair');
              }
              _handleBack(){
                  this.fireAncestors('$goBack');
              }
              _focus(){
                  this.tag('ConnectDisconnect').patch({
                      color: CONFIG.theme.hex
                  });
                  this.tag('ConnectDisconnect.Title').patch({
                      text:{
                          textColor:0xFFFFFFFF
                      }
                  });
              }
              _unfocus(){
                  this.tag('ConnectDisconnect').patch({
                      color: 0xFFFFFFFF
                  });
                  this.tag('ConnectDisconnect.Title').patch({
                      text:{
                          textColor:0xFF000000
                      }
                  });
              }
              $exit(){
                  this._unfocus();
              }
            },
            class Unpair extends this {
                  $enter(){
                    this._focus();
                }
              _handleEnter(){
                  this.fireAncestors('$pressEnter', 'Unpair');
              }
              _handleRight(){
                  this._setState('Cancel');
              }
              _handleLeft(){
                  this._setState('ConnectDisconnect');
              }
              _handleBack(){
                  this.fireAncestors('$goBack');
              }
              _focus(){
                  this.tag('Unpair').patch({
                      color: CONFIG.theme.hex
                  });
                  this.tag('Unpair.Title').patch({
                      text:{
                          textColor:0xFFFFFFFF
                      }
                  });
              }
              _unfocus(){
                  this.tag('Unpair').patch({
                      color: 0xFFFFFFFF
                  });
                  this.tag('Unpair.Title').patch({
                      text:{
                          textColor:0xFF000000
                      }
                  });
              }
              $exit(){
                  this._unfocus();
              }
            },
            class Cancel extends this {
                $enter(){
                    this._focus();
                }
              _handleEnter(){
                  this.fireAncestors('$pressEnter', 'Cancel');
              }
              _handleLeft(){
                  this._setState('Unpair');
              }
              _handleBack(){
                  this.fireAncestors('$goBack');
              }
              _focus(){
                  this.tag('Cancel').patch({
                      color: CONFIG.theme.hex
                  });
                  this.tag('Cancel.Title').patch({
                      text:{
                          textColor:0xFFFFFFFF
                      }
                  });
              }
              _unfocus(){
                  this.tag('Cancel').patch({
                      color: 0xFF7D7D7D
                  });
                  this.tag('Cancel.Title').patch({
                      text:{
                          textColor:0xFF000000
                      }
                  });
              }
              $exit(){
                  this._unfocus();
              }
            },
          ]
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
          x: 700,
          y: 100,
          type: BluetoothConfirmation,
          visible: false
        },
        PairingScreen: {
          x: 700,
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
              fontSize: 25,
            }
          },
          Button: {
            h: 30 * 1.5,
            w: 44.6 * 1.5,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/ToggleOnOrange.png'),
          },
        },
        Searching: {
          visible: false,
          h:90,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Searching for Devices',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Loader: {
            h: 30 * 1.5,
            w: 30 * 1.5,
            // x: 1535,
            x: 320,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Loading.gif'),
          },
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
              itemScrollOffset: -6,
            },
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
              itemScrollOffset: -6,
            },
          },
          visible: false,
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
              fontSize: 25,
            }
          },
          visible: false,
        },
        // PairingScreen: {
        //   x: 1920 - 1920 / 3,
        //   y: 0,
        //   w: 1920 / 3,
        //   h: 1080,
        //   visible: false,
        //   type: BluetoothPairingScreen,
        // },
        // Message: {
        //   x: 1920 - 1920 / 3 + 40,
        //   y: 950,
        //   text: { text: '' },
        // },
      }
    }

    _init() {
      // this.loadingAnimation = this.tag('Networks.AvailableNetworks.Loader').animation({
      //   duration: 1,
      //   repeat: -1,
      //   stopMethod: 'immediate',
      //   stopDelay: 0.2,
      //   actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: Math.PI * 2 } }],
      // })
      // this.loadingAnimation.play()
      this._bt = new BluetoothApi();
      this._bluetooth = true;
      this._activateBluetooth();
      this._setState('Switch');
      this._bluetooth = true;
      if (this._bluetooth) {
        this.tag('Networks').visible = true;
        this.tag('AddADevice').visible = true;
      }
      this._pairedNetworks = this.tag('Networks.PairedNetworks');
      this._availableNetworks = this.tag('Networks.AvailableNetworks');
      this.renderDeviceList();


      this.loadingAnimation = this.tag('Searching.Loader').animation({
        duration: 3, repeat: -1, stopMethod: 'immediate', stopDelay: 0.2,
        actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: 2 * Math.PI } }]
      });

      this.loadingAnimation.start();

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
      this.tag('Switch').patch({ alpha: 0 });
      this.tag('PairedNetworks').patch({ alpha: 0 });
      this.tag('AddADevice').patch({ alpha: 0 });
      this.tag('Searching').patch({ visible: true });
      this.tag('AvailableNetworks').patch({ visible: true });
      //  this.loadingAnimation.stop()
      // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }

    hideAvailableDevices() {
      this.tag('Switch').patch({ alpha: 1 });
      this.tag('PairedNetworks').patch({ alpha: 1 });
      this.tag('AddADevice').patch({ alpha: 1 });
      this.tag('Searching').patch({ visible: false });
      this.tag('AvailableNetworks').patch({ visible: false });
      this.tag('Confirmation').patch({ visible: false });
      //  this.loadingAnimation.start()
      // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }

    showPairingScreen() {
      this.tag('Switch').patch({ alpha: 0 });
      this.tag('PairedNetworks').patch({ alpha: 0 });
      this.tag('AddADevice').patch({ alpha: 0 });
      this.tag('Searching').patch({ visible: false });
      this.tag('AvailableNetworks').patch({ visible: false });
      this.tag('Confirmation').patch({ visible: false });
      this.tag('PairingScreen').patch({ visible: true });
      this.fireAncestors('$hideTopPanel');
      // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }

    hidePairingScreen() {
      this.tag('Switch').patch({ alpha: 1 });
      this.tag('PairedNetworks').patch({ alpha: 1 });
      this.tag('AddADevice').patch({ alpha: 1 });
      this.tag('Searching').patch({ visible: false });
      this.tag('AvailableNetworks').patch({ visible: false });
      this.tag('Confirmation').patch({ visible: false });
      this.tag('PairingScreen').patch({ visible: false });
      this.fireAncestors('$showTopPanel');
      // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }

    showConfirmation() {
      this.tag('Switch').patch({ alpha: 0 });
      this.tag('PairedNetworks').patch({ alpha: 0 });
      this.tag('AddADevice').patch({ alpha: 0 });
      this.tag('Searching').patch({ visible: false });
      this.tag('AvailableNetworks').patch({ visible: false });
      this.tag('PairingScreen').patch({ visible: false });
      this.tag('Confirmation').patch({ visible: true });
      this.fireAncestors('$hideTopPanel');
      // this.tag('TopPanel').patch({ alpha: 0 });
      // this.tag('SidePanel').patch({ alpha: 0 });
    }

    hideConfirmation() {
      this.tag('Switch').patch({ alpha: 1 });
      this.tag('PairedNetworks').patch({ alpha: 1 });
      this.tag('AddADevice').patch({ alpha: 1 });
      this.tag('Searching').patch({ visible: false });
      this.tag('AvailableNetworks').patch({ visible: false });
      this.tag('PairingScreen').patch({ visible: false });
      this.tag('Confirmation').patch({ visible: false });
      this.fireAncestors('$showTopPanel');
      // this.tag('TopPanel').patch({ alpha: 0 });
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
            item: item,
          }
        });
      });
      this._bt.getDiscoveredDevices().then(result => {
        this._discoveredList = result;
        this._otherList = this._discoveredList.filter(device => {
          if (!device.paired) {
            result = this._pairedList.map(a => a.deviceID);
            if (result.includes(device.deviceID)) {
              return false
            } else return device
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
            item: item,
          }
        });
      });
    }

    // connectBluetooth(option) {
    //   if (this._pairedNetworks.tag('List').element._item.connected){
    //     this._bt
    //       .disconnect(
    //         this._pairedNetworks.tag('List').element._item.deviceID,
    //         this._pairedNetworks.tag('List').element._item.deviceType
    //       )
    //       .then(() => {})
    //     this._setState('Switch')
    //   } else if( !this._pairedNetworks.tag('List').element._item.connected){
    //     this._setState('Confirmation')
    //     this._bt
    //       .connect(
    //         this._pairedNetworks.tag('List').element._item.deviceID,
    //         this._pairedNetworks.tag('List').element._item.deviceType
    //       )
    //       .then(result => {
    //         if (!result) {
    //           this.tag('Message').text = 'CONNECTION FAILED'
    //           this._setState('Switch')
    //         }
    //         setTimeout(() => {
    //           this.tag('Message').text = ''
    //         }, 2000)
    //       })
    //   }   
    // }

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
        this._bt
          .connect(
            this._pairedNetworks.tag('List').element._item.deviceID,
            this._pairedNetworks.tag('List').element._item.deviceType
          )
          .then(result => {
            this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item;
            if (!result) {
              // this.tag('Message').text = 'CONNECTION FAILED'
              this.tag('Confirmation.Pairing').text = 'Connection Failed';
              this._setState('Confirmation');
            } else {
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
        this._bt
          .disconnect(
            this._pairedNetworks.tag('List').element._item.deviceID,
            this._pairedNetworks.tag('List').element._item.deviceType
          )
          .then(result => {
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
      return [
        class Switch extends this {
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
            // if (this._bluetooth) {
            //   if (this._pairedNetworks.tag('List').length > 0) {
            //     this._setState('PairedDevices')
            //   } else if (this._availableNetworks.tag('List').length > 0) {
            //     this._setState('AvailableDevices')
            //   }
            // }
          }
          _handleUp() {
            // this.fireAncestors('$goToTopPanel', 4)
          }
          _handleLeft() {
            // this.fireAncestors('$goToSidePanel', 0)
          }
          _handleEnter() {
            this.switch();
          }
        },
        class Confirmation extends this{
          $enter() {
            this.showConfirmation();
          }
          _getFocused() {
            return this.tag('Confirmation')
          }
          $pressOK() {
            this._setState('Switch');
            this.hideConfirmation();
          }
        },

        class PairedDevices extends this {
          $enter() {
            this.hideAvailableDevices();
          }
          _getFocused() {
            return this._pairedNetworks.tag('List').element
          }
          _handleDown() {
            this._navigate('MyDevices', 'down');
          }
          _handleUp() {
            this._navigate('MyDevices', 'up');
          }
          _handleEnter() {
            // this.connectBluetooth(this._pairedNetworks.tag('List').element.ref)
            // this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
            this.showPairingScreen();
            // this.tag('PairingScreen').visible = true
            this.tag('PairingScreen').item = this._pairedNetworks.tag('List').element._item;
            this._setState('PairingScreen');
          }
        },
        class AvailableDevices extends this {
          $enter() {
            // this.showAvailableDevices()
          }
          _getFocused() {
            return this._availableNetworks.tag('List').element
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
            // this.tag('PairingScreen').visible = true
            // this.tag('PairingScreen').item = this._availableNetworks.tag('List').element._item
            // this._setState('PairingScreen')
          }
          _handleBack() {
            this.hideAvailableDevices();
            this._setState('Switch');
          }
        },
        class AddADevice extends this {
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
              // if (this._availableNetworks.tag('List').length>0){
              //   this._setState('AvailableDevices')
              // }
              // else{
              //   this._setState('Searching')
              // }
            }
          }
        },
        class Searching extends this {
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
        },
        class PairingScreen extends this {
          $enter() {
            this._disable();
            this._bt.stopScan();
            return this.tag('PairingScreen')
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
            return this.tag('PairingScreen')
          }

          $exit() {
            this.tag('PairingScreen').visible = false;
            this._enable();
          }
        },
      ]
    }

    /**
     * Function to navigate through the lists in the screen.
     * @param {string} listname
     * @param {string} dir
     */
    _navigate(listname, dir) {
      let list;
      if (listname === 'MyDevices') list = this._pairedNetworks.tag('List');
      else if (listname === 'AvailableDevices') list = this._availableNetworks.tag('List');
      if (dir === 'down') {
        if (list.index < list.length - 1) list.setNext();
        else if (list.index == list.length - 1) {
          if (listname === 'MyDevices' && this._availableNetworks.tag('List').length > 0) ;
        }
      } else if (dir === 'up') {
        if (list.index > 0) list.setPrevious();
        else if (list.index == 0) {
          if (listname === 'AvailableDevices' && this._pairedNetworks.tag('List').length > 0) ; else if (listname === 'MyDevices') {
            this._setState('AddADevice');
            // } else if (listname === 'AvailableDevices'){
            //   this._setState('Searching')
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
          this.renderDeviceList();
          //  this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
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
          this.renderDeviceList();
        });
        this._bt.registerEvent('onDiscoveryStarted', () => {
          this.tag('Searching.Loader').visible = true;
        });
        this._bt.registerEvent('onRequestFailed', notification => {
          this._bt.startScan();
          this.renderDeviceList();
          this._setState('Confirmation');
          //  this.tag('Confirmation').item = this._pairedNetworks.tag('List').element._item
          // this.tag('Confirmation').item.name = notification.params.name
          this.tag('Confirmation.Pairing').text = notification.newStatus;
          setTimeout(() => {
            // this.tag('Message').text = ''
            this._setState('Switch');
            this.tag('Confirmation.Pairing').text = '';
          }, 5000);
        });
        this._bt.getName().then(name => {
          this.tag('Name').text.text = `Now discoverable as "${name}"`;
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

  var img$4 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAACxLAAAsSwGlPZapAAAGuWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTAyVDE2OjE4OjUyLTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0yMVQwOTozOTo0NS0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0yMVQwOTozOTo0NS0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMDEzODUxYy0xNWRiLTQ5ZjgtYTA5ZC0wMTVhMTJiMTViYmQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDhkZThiYi0xNjJkLTQwODktYjg2OS0wMjYzZGY3ZmNkMTMiIHN0RXZ0OndoZW49IjIwMjEtMDgtMDJUMTY6MTg6NTItMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmN2JiZjlkNi03OTY5LTQ4M2EtYTdlYi1iNDM4NGMzNDJjM2EiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6MjQ6NDgtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMDEzODUxYy0xNWRiLTQ5ZjgtYTA5ZC0wMTVhMTJiMTViYmQiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6Mzk6NDUtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjZqHi4AAA+hSURBVHic7d17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";

  var img$3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAACxLAAAsSwGlPZapAAAGuWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTAyVDE2OjE4OjUyLTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0yMVQwOToyOToyNi0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0yMVQwOToyOToyNi0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYmIzZDcwOC02MGMxLTQ4MTAtOGRkMi05MDY1MzQ3NDA0MTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDhkZThiYi0xNjJkLTQwODktYjg2OS0wMjYzZGY3ZmNkMTMiIHN0RXZ0OndoZW49IjIwMjEtMDgtMDJUMTY6MTg6NTItMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmN2JiZjlkNi03OTY5LTQ4M2EtYTdlYi1iNDM4NGMzNDJjM2EiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6MjQ6NDgtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmYmIzZDcwOC02MGMxLTQ4MTAtOGRkMi05MDY1MzQ3NDA0MTQiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6Mjk6MjYtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk7s+1gAACNQSURBVHic7d15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";

  var img$2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAACXBIWXMAACxLAAAsSwGlPZapAAAGuWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA4LTAyVDE2OjE4OjUyLTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0yMVQwOToyNjozOC0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0yMVQwOToyNjozOC0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyN2RmOTM5Yi0xZmU5LTRjNjgtYmE2OS1lNTEyM2VmYWMyNDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWQ4ZGU4YmItMTYyZC00MDg5LWI4NjktMDI2M2RmN2ZjZDEzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDhkZThiYi0xNjJkLTQwODktYjg2OS0wMjYzZGY3ZmNkMTMiIHN0RXZ0OndoZW49IjIwMjEtMDgtMDJUMTY6MTg6NTItMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmN2JiZjlkNi03OTY5LTQ4M2EtYTdlYi1iNDM4NGMzNDJjM2EiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6MjQ6NDgtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyN2RmOTM5Yi0xZmU5LTRjNjgtYmE2OS1lNTEyM2VmYWMyNDEiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMDk6MjY6MzgtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlaRZPgAACKlSURBVHic7d13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";

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
         //  Debug: {
   
         //   zIndex: 2,
         //   text: {
         //     fontSize: 16,
         //     wordWrap: true,
         //     wordWrapWidth: 100,
         //     text: "This is a debug object",
         //     color: 0xffffffff,
         //   }
         // },
         TopLine: {
           y: 0,
           mountY: 0.5,
           w: 1535,
           h: 3,
           rect: true,
           color: 0xFFFFFFFF
         },
         Item: {
           w: 1535,
           h: 90,
         },
         BottomLine: {
           y: 90,
           mountY: 0.5,
           w: 1535,
           h: 3,
           rect: true,
           color: 0xFFFFFFFF
         },
       }
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
       }
       else if (item.signalStrength >= -60) {
         wifiicon = img$1;
       }
       else if (item.signalStrength >= -67) {
         wifiicon = img$2;
       }
       else  {
         wifiicon = img$3;
       }
       
   
   
       this.tag('Item').patch({
         Tick: {
           x: 10,
           y: 45,
           mountY: 0.5,
           texture: lng$1.Tools.getSvgTexture(img$5, 32.5, 32.5),
           color: 0xffffffff,
           visible : item.connected ? true : false
         },
         Left: {
           x: 40,
           y: 45,
           mountY: 0.5,
           text: { text: item.ssid, fontSize: 25, textColor: COLORS.textColor, fontFace: CONFIG.language.font, },
         },
   
         Right: {
           x: 1505,
           mountX: 1,
           y: 45,
           mountY: 0.5,
           flex: { direction: 'row' },
           Lock: {
             //color: 0xff000000,
             //  x:1515,
             color: 0xffffffff,
             texture: lng$1.Tools.getSvgTexture(img$4, 32.5, 32.5),
             alpha: 1
           },
           Icon: {
             //color: 0xff000000,
             color: 0xffffffff,
             flexItem: { marginLeft: 15 },
             texture: lng$1.Tools.getSvgTexture(wifiicon, 32.5, 32.5),
           },
         },
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
     FAILED: 6,
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
           default: 1,
         };
         this._thunder = thunderJS(config);
         this.callsign = 'org.rdk.Wifi.1';
         this._thunder
           .call('Controller', 'activate', { callsign: this.callsign })
           .then(result => {
             console.log('Wifi activated', result);
   
             this.getCurrentState().then(state => {
               if (state === WiFiState.DISABLED) {
                 this.setEnabled(true);
               }
             });
   
             this._thunder.on(this.callsign, 'onWIFIStateChanged', notification => {
               console.log('onWIFIStateChanged: ' + notification.state);
               if (this._events.has('onWIFIStateChanged')) {
                 this._events.get('onWIFIStateChanged')(notification);
               }
             });
             this._thunder.on(this.callsign, 'onError', notification => {
               console.log('Error: ' + notification);
               if (this._events.has('onError')) {
                 this._events.get('onError')(notification);
               }
             });
   
             this._thunder.on(this.callsign, 'onAvailableSSIDs', notification => {
               console.log('AvailableSSIDs: ' + JSON.stringify(notification));
               if (notification.moreData === false) {
                 this.stopScan();
                 notification.ssids = notification.ssids.filter(
                   (item, pos) => notification.ssids.findIndex(e => e.ssid === item.ssid) === pos
                 );
                 if (this._events.has('onAvailableSSIDs')) {
                   this._events.get('onAvailableSSIDs')(notification);
                 }
               }
             });
   
             resolve(result);
           })
           .catch(err => {
             console.error(`Wifi activation failed: ${err}`);
             reject(err);
           });
       })
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
         this._thunder
           .call(this.callsign, 'getConnectedSSID')
           .then(result => {
             console.log('ConnectedSSID: ' + result.ssid);
             resolve(result);
           })
           .catch(err => {
             console.error(`getConnectedSSID fail: ${err}`);
             reject(err);
           });
       })
     }
   
     /**
      * Start scanning for available wifi.
      */
     discoverSSIDs() {
       return new Promise((resolve, reject) => {
         this._thunder
           .call(this.callsign, 'startScan', { incremental: true, ssid: '', frequency: '' })
           .then(result => {
             console.log('startScan success');
             resolve(result);
           })
           .catch(err => {
             console.error(`startScan fail: ${err}`);
             reject(err);
           });
       })
     }
   
     /**
      * Stops scanning for networks.
      */
     stopScan() {
       return new Promise((resolve, reject) => {
         this._thunder
           .call(this.callsign, 'stopScan')
           .then(result => {
             console.log('stopScan success');
             resolve(result);
           })
           .catch(err => {
             console.error(`stopScan fail: ${err}`);
             reject(err);
           });
       })
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
           this._thunder
             .call(this.callsign, 'connect', {
               ssid: device.ssid,
               passphrase: passphrase,
               securityMode: device.security,
             })
             .then(result => {
               console.log(`connected SSID ${device.ssid}`);
               resolve(result);
             })
             .catch(err => {
               console.error(`Connection failed: ${err}`);
               reject(err);
             });
         }, reject);
       })
     }
   
     /**
      * Function to disconnect from the SSID.
      */
     disconnect() {
       return new Promise((resolve, reject) => {
         this._thunder.call(this.callsign, 'disconnect', {}).then(
           result => {
             console.log('WiFi disconnected: ' + JSON.stringify(result));
             resolve(result);
           },
           err => {
             console.error(`Can't disconnect WiFi: ${err}`);
             reject(err);
           }
         );
       })
     }
   
     /**
      * Returns current state of the Wi-Fi plugin.
      */
     getCurrentState() {
       return new Promise((resolve, reject) => {
         this._thunder
           .call(this.callsign, 'getCurrentState')
           .then(result => {
             console.log(`WiFi state: ${result.state}`);
             resolve(result.state);
           })
           .catch(err => {
             console.error(`Can't get WiFi state: ${err}`);
             reject(err);
           });
       })
     }
   
     /**
      * Enables/Disables the Wi-Fi.
      * @param {bool} bool
      */
     setEnabled(bool) {
       return new Promise((resolve, reject) => {
         this._thunder
           .call(this.callsign, 'setEnabled', { enable: bool })
           .then(result => {
             resolve(result);
           })
           .catch(err => {
             reject(err);
           });
       })
     }
   
     /**
      * Function to get paired SSID.
      */
     getPaired() {
       return new Promise((resolve, reject) => {
         this._thunder
           .call(this.callsign, 'getPairedSSID', {})
           .then(result => {
             resolve(result);
           })
           .catch(err => {
             console.error(`Can't get paired: ${err}`);
             reject(err);
           });
       })
     }
     getDefaultInterface() {
       return new Promise((resolve, reject) => {
         this._thunder
           .call('org.rdk.Network', 'getDefaultInterface', {})
           .then(result => {
             resolve(result);
           })
           .catch(err => {
             reject(err);
           });
       })
     }
     setInterface(inter, bool) {
       return new Promise((resolve, reject) => {
         this._thunder
           .call('org.rdk.Network', 'setInterfaceEnabled', {
             interface: inter,
             persist: true,
             enabled: bool,
           })
           .then(result => {
             resolve(result);
           })
           .catch(err => {
             reject(err);
           });
       })
     }
     setDefaultInterface(interfaceName, bool) {
       return new Promise((resolve, reject) => {
         this._thunder
           .call('org.rdk.Network', 'setDefaultInterface', {
             interface: interfaceName,
             persist: bool,
           })
           .then(result => {
             resolve(result);
           })
           .catch(err => {
             reject(err);
           });
       })
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
          w:  325, // previous value : ((1920 / 2) - 350) / 2
          h: 85, // previous value: 65
          rect: true,
          color: 0xffffffff,
          shader: { type: lng$1.shaders.RoundedRectangle, radius: 0 },
        },
      }
    }

    /**
     * Function to set contents for an item in settings screen.
     */
    set item(item) {
      this._item = item;
      this.tag('Item').patch({
        Left: {
          x: this.tag("Item").w / 2, // orginal = 10
          y: this.tag('Item').h / 2,
          mountX:0.5,
          mountY: 0.5,
          text: { text: item, fontSize: 25, textColor: 0xff000000, fontFace: CONFIG.language.font, },
        },
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
              src: Utils.asset('images/settings/ToggleOffWhite.png'),
          }
      }
      _handleEnter() {
          if (this.isOn) {
              this.patch({ src: Utils.asset("images/settings/ToggleOffWhite.png") });
          } else {
              this.patch({ src: Utils.asset("images/settings/ToggleOnOrange.png") });
          }
          this.isOn = !this.isOn;
          this.fireAncestors('$handleEnter',this.isOn);

          
      }
      _init() {
          this.isOn = false;
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

    let hexAlpha = Math.round((alpha / 100) * 255).toString(16);
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
  var createStyles = (styles, theme) => {
    return typeof styles === 'function' ? styles(theme) : styles;
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
      const { padding, paddingLeft, paddingRight, strokeWidth } = {
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0,
        strokeWidth: 0,
        ...options
      };

      if (!w) return 0;

      return (
        w - (paddingLeft || padding) - (paddingRight || padding) - strokeWidth
      );
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
      const { padding, paddingBottom, paddingTop, strokeWidth } = {
        padding: 0,
        paddingBottom: 0,
        paddingTop: 0,
        strokeWidth: 0,
        ...options
      };

      if (!h) return 0;

      return (
        h - (paddingBottom || padding) - (paddingTop || padding) - strokeWidth
      );
    }
  };

  /**
   * Merges two objects together and returns the duplicate.
   *
   * @param {Object} target - object to be cloned
   * @param {Object} [object] - secondary object to merge into clone
   */
  function clone(target, object) {
    const _clone = { ...target };
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

    if (
      targetValType !== objectValType ||
      objectValType === 'function' ||
      Array.isArray(objectVal)
    ) {
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
    const fontCss = [
      fontStyle,
      fontWeight,
      fontSize ? `${fontSize}px` : '0',
      `'${fontFamily}'`
    ]
      .filter(Boolean)
      .join(' ');
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
  const getW = component =>
    getDimension('w', component) || component.renderWidth;
  const getH = component =>
    getDimension('h', component) || component.renderHeight;

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
    actions: [
      {
        p: 'colorUl',
        v: {
          0: getHexColor(gradientColor, 72),
          1: getHexColor(gradientColor, 56)
        }
      },
      {
        p: 'colorUr',
        v: {
          0: getHexColor(gradientColor, 24),
          1: getHexColor(gradientColor, 16)
        }
      },
      {
        p: 'colorBr',
        v: { 0: 0x00, 1: getHexColor(gradientColor, 0) }
      },
      {
        p: 'colorBl',
        v: {
          0: getHexColor(gradientColor, 24),
          1: getHexColor(gradientColor, 16)
        }
      }
    ]
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
  function debounce(func, wait, immediate){
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
    var debounced = function(){
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

    debounced.clear = function() {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
    
    debounced.flush = function() {
      if (timeout) {
        result = func.apply(context, args);
        context = args = null;
        
        clearTimeout(timeout);
        timeout = null;
      }
    };

    return debounced;
  }
  // Adds compatibility for ES modules
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
      static get name() { return Base.name }
      static get styles() { return _styles };
      get styles() { return _styles }
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
      const { icon, w, h } = this;
      const template = getIconTemplate(icon, w, h);
      this.patch(template);
    }
  }

  const [isSvgTag, isSvgURI, isImageURI] = [
    /^<svg.*<\/svg\>$/,
    /\.svg$/,
    /\.(a?png|bmp|gif|ico|cur|jpe?g|pjp(eg)?|jfif|tiff?|webp)$/
  ].map(regex => RegExp.prototype.test.bind(regex));

  function getIconTemplate(icon, w, h) {
    const template = { w, h };

    switch (true) {
      case isSvgTag(icon):
        template.texture = lng$1.Tools.getSvgTexture(
          `data:image/svg+xml,${encodeURIComponent(icon)}`,
          w,
          h
        );
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
    w: 200,//150
    h: 80,//40
    radius: 0,
    background: { color: 0xffffffff },// 0xff1f1f1f
    icon: { color: 0xffffffff },
    text: {
      fontSize: 30,
      fontFace:CONFIG.language.font,
      color: 0xff000000
    },
    padding: 50,
    stroke: {
      color: 0x00,
      weight: 2
    },
    focused: {
      background: { color: CONFIG.theme.hex },
      text: { color: 0xff1f1f1f },
      icon: { color: 0xff1f1f1f }
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
          Title: { y: 2 }
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
      this._whenEnabled = new Promise(
        resolve => (this._enable = resolve),
        console.error
      );
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
      const color = this._focused
        ? getFirstNumber(
            this.focusedBackground,
            this.styles.focused.background.color
          )
        : getFirstNumber(this.background, this.styles.background.color);
      if (this._smooth) {
        this.smooth = { color };
      } else {
        this.color = color;
      }
    }

    _updateTitle() {
      if (this.title) {
        this._Title.text = {
          ...this.styles.text,
          fontColor: this.styles.text.color,
          fontSize: this.fontSize || this.styles.text.fontSize,
          fontFamily:
            this.styles.text.fontFace ||
            this.styles.text.fontFamily ||
            this.stage._options.defaultFontFace,
          text: this.title
        };

        const color = this._focused
          ? getFirstNumber(this.focusedTextColor, this.styles.focused.text.color)
          : getFirstNumber(this.textColor, this.styles.text.color);
        if (this._smooth) {
          this._Title.smooth = { color };
        } else {
          this._Title.color = color;
        }
      } else {
        this._Title.texture = false;
      }
    }

    _updateIcon() {
      if (this.icon) {
        const { color, size, spacing, src } = this.icon;
        this._Icon.patch({
          w: size,
          h: size,
          icon: src,
          flexItem: { marginRight: this.title ? spacing : 0 }
        });

        const iconColor = this._focused
          ? getFirstNumber(this.focusedIconColor, this.styles.focused.icon.color)
          : getFirstNumber(color, this.styles.icon.color);
        if (this._smooth) {
          this._Icon.smooth = { color: iconColor };
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

        this.texture = lng$1.Tools.getRoundRect(
          RoundRect.getWidth(this.w),
          RoundRect.getHeight(this.h),
          radius,
          0x00,
          true,
          0xffffffff
        );

        this._Stroke.color = this.strokeColor;
        this._Stroke.texture = lng$1.Tools.getRoundRect(
          RoundRect.getWidth(this.w),
          RoundRect.getHeight(this.h),
          radius,
          this.strokeWeight,
          0xffffffff,
          true,
          this.background
        );
      } else {
        const radius = this.radius || this.styles.radius;
        this.texture = lng$1.Tools.getRoundRect(
          RoundRect.getWidth(this.w),
          RoundRect.getHeight(this.h),
          radius
        );
        this._Stroke.texture = false;
      }
    }

    _updateWidth() {
      if (!this.fixed) {
        const iconSize = this._icon ? this._icon.size + this._icon.spacing : 0;
        const padding = getFirstNumber(this.padding, this.styles.padding, 10);
        const w =
          measureTextWidth(this._Title.text || {}) + padding * 2 + iconSize;

        if (w && w !== this.w) {
          this.w = w > this.styles.w ? w : this.styles.w;
          this.fireAncestors('$itemChanged');
          this.signal('buttonWidthChanged', { w: this.w });
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

    set icon({ src, size = 20, spacing = 5, color = 0xffffffff }) {
      if (src) {
        this._icon = { src, size, spacing, color };
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
      this.patch({ Items: {} });
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
      }
      // Have items update (change height or width) before we render
      this._refocus();
      if (this.selected) {
        this.render(this.selected, prevSelected);
        this.signal('selectedChange', this.selected, prevSelected);
      }
    }

    // Override
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
      let { selected } = this;
      // Make sure we're focused on a component
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
      return [
        class None extends this {},
        class Row extends this {
          _handleLeft() {
            return this.selectPrevious();
          }

          _handleRight() {
            return this.selectNext();
          }
        },

        class Column extends this {
          _handleUp() {
            return this.selectPrevious();
          }

          _handleDown() {
            return this.selectNext();
          }
        }
      ];
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
      this._whenEnabled = new Promise(resolve => (this._firstEnable = resolve));
      this._h = this.stage.h;
      this.debounceDelay = Number.isInteger(this.debounceDelay)
        ? this.debounceDelay
        : 30;
      this._update = debounce_1.debounce(this._updateLayout, this.debounceDelay);
      this._updateImmediate = debounce_1.debounce(
        this._updateLayout,
        this.debounceDelay,
        true
      );
    }

    get _itemTransition() {
      return (
        this.itemTransition || {
          duration: 0.4,
          timingFunction: 'cubic-bezier(0.20, 1.00, 0.30, 1.00)'
        }
      );
    }

    _focus() {
      this.items.forEach(item => (item.parentFocus = true));
    }

    _unfocus() {
      this.items.forEach(item => (item.parentFocus = false));
    }

    selectNext() {
      this._smooth = true;
      return super.selectNext();
    }

    selectPrevious() {
      this._smooth = true;
      return super.selectPrevious();
    }

    // TODO: can be documented in API when lastScrollIndex is made public
    shouldScrollUp() {
      let shouldScroll = false;

      if (this._lastScrollIndex) {
        shouldScroll = this.selectedIndex < this._lastScrollIndex;
        if (
          this._prevLastScrollIndex !== undefined &&
          this._prevLastScrollIndex !== this._lastScrollIndex
        ) {
          shouldScroll = true;
        }
      } else {
        shouldScroll = this.selectedIndex >= this._scrollIndex;
      }

      return this._itemsY < 0 && shouldScroll;
    }

    // TODO: can be documented in API when lastScrollIndex is made public
    shouldScrollDown() {
      const lastChild = this.Items.childList.last;
      return (
        this.selectedIndex > this._scrollIndex &&
        // end of Items container < end of last item
        Math.abs(this._itemsY - this.h) <
          lastChild.y + this.Items.childList.last.h
      );
    }

    render(next, prev) {
      this._prevLastScrollIndex = this._lastScrollIndex;

      if (this.plinko && prev && (prev.currentItem || prev.selected)) {
        next.selectedIndex = this._getIndexOfItemNear(next, prev);
      }

      // Rows are changing height, so we'll render via updateLayout
      if (this.itemsChangeable) {
        return;
      }

      this._performRender();
    }

    _performRender() {
      this._whenEnabled.then(() => {
        const scrollOffset = (this.Items.children[this._scrollIndex] || { y: 0 })
          .y;
        const firstChild = this.Items.childList.first;
        const lastChild = this.Items.childList.last;
        const shouldScroll =
          this.alwaysScroll ||
          (lastChild && (this.shouldScrollUp() || this.shouldScrollDown()));

        if (shouldScroll) {
          const scrollItem =
            this.selectedIndex > this._lastScrollIndex
              ? this.Items.children[this._lastScrollIndex - this._scrollIndex]
              : this.selected;
          if (this._smooth) {
            this.Items.smooth = {
              y: [
                -(scrollItem || firstChild).transition('y').targetValue +
                  (scrollItem === this.selected ? scrollOffset : 0),
                this._itemTransition
              ]
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
      const { h } = child;
      const withinLowerBounds = y + h + this._itemsY > 0;
      const withinUpperBounds = y + this._itemsY < this.h;
      return withinLowerBounds && withinUpperBounds;
    }

    _updateLayout() {
      this._whenEnabled.then(() => {
        let nextY = 0;
        let nextW = 0;
        // layout items in row
        for (let i = 0; i < this.Items.children.length; i++) {
          const child = this.Items.children[i];
          nextW = Math.max(nextW, getW(child));
          if (this._smooth) {
            child.smooth = { y: [nextY, this._itemTransition] };
          } else {
            child.patch({ y: nextY });
          }
          nextY += child.h;
          if (i < this.Items.children.length - 1) {
            nextY += this.itemSpacing;
          }

          if (child.centerInParent) {
            // if the child is another focus manager, check the width of the item container
            const childWidth = (child.Items && child.Items.w) || child.w;
            // only center the child if it is within the bounds of this focus manager
            if (childWidth < this.w) {
              child.x = (this.w - childWidth) / 2;
            }
          }
        }
        this.Items.patch({ w: nextW, h: nextY });

        const lastChild = this.Items.childList.last;
        const endOfLastChild = lastChild ? getY(lastChild) + lastChild.h : 0;
        const scrollOffset = (this.Items.children[this._scrollIndex] || { y: 0 })
          .y;

        // determine when to stop scrolling down
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

    // finds the index of the item with the closest middle to the previously selected item
    _getIndexOfItemNear(selected, prev) {
      // edge case
      if (selected.items.length < 2) return 0;

      let prevItem = prev.selected || prev.currentItem;
      let prevOffset = prev.transition('x').targetValue || 0;
      let [itemX] = prevItem.core.getAbsoluteCoords(-prevOffset, 0);
      let prevMiddle = itemX + prevItem.w / 2;

      // set the first item to be closest
      let closest = selected.items[0];
      let closestMiddle = closest.core.getAbsoluteCoords(0, 0)[0] + closest.w / 2;

      // start at the 2nd item
      for (let i = 1; i < selected.items.length; i++) {
        // for some reason here !!/!.. evals returning number
        if (selected.items[i].skipFocus === true) {
          continue;
        }

        const item = selected.items[i];
        const middle = item.core.getAbsoluteCoords(0, 0)[0] + item.w / 2;

        if (
          Math.abs(middle - prevMiddle) < Math.abs(closestMiddle - prevMiddle)
        ) {
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
            return this._getIndexofClosestFocusable(
              prevIndex,
              selected,
              prevMiddle
            );
          }
        }
      }
      // if last index is focusable return
      return selected.items.length - 1;
    }

    _getIndexofClosestFocusable(selectedIndex, selected, prevMiddle) {
      // dont want to mutate the original selected.items using spread for copy
      // get first focusable item before and after the current focused item's index
      const prevIndex = [...selected.items]
        .slice(0, selectedIndex)
        .map(item => !!item.skipFocus)
        .lastIndexOf(false);
      const nextIndex =
        [...selected.items]
          .slice(selectedIndex + 1)
          .map(item => !!item.skipFocus)
          .indexOf(false) +
        selectedIndex +
        1;

      const prevItem = selected.items[prevIndex];
      const nextItem = selected.items[nextIndex];

      // Check if the items exist if not return the other
      // covers case where at 0 idx, previous would not exist
      // and opposite for last index next would not exist
      if (prevIndex === -1 || !prevItem) {
        return nextIndex;
      }
      if (nextIndex === -1 || !nextItem) {
        return prevIndex;
      }

      // If both items compare coordinates to determine which direction of plinko
      const next = nextItem.core.getAbsoluteCoords(0, 0)[0] + nextItem.w / 2;
      const prev = prevItem.core.getAbsoluteCoords(0, 0)[0] + prevItem.w / 2;
      return Math.abs(prev - prevMiddle) < Math.abs(next - prevMiddle)
        ? prevIndex
        : nextIndex;
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
      this.Items.transition('y').on('finish', () => (this._smooth = false));
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
    }

    // can be overridden
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
      this._margin = { left: 0, right: 0 };
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
      this._setUniform(
        'margin',
        [
          this._positionLeft * renderPrecision,
          this._positionRight * renderPrecision
        ],
        this.gl.uniform1fv
      );
      this._setUniform(
        'resolution',
        new Float32Array([
          owner._w * renderPrecision,
          owner._h * renderPrecision
        ]),
        this.gl.uniform2fv
      );
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
          boundsMargin: [], // overwrite boundsMargin so text won't de-render if moved offscreen
          TextBox: {
            Text: {},
            TextLoopTexture: {}
          }
        }
      };
    }

    get title() {
      return ((this._Text && this._Text.text) || {}).text;
    }

    set title(text) {
      this.patch({
        TextClipper: {
          w: this.finalW + 14,
          h: text.lineHeight + 10,
          TextBox: {
            Text: {
              rtt: true,
              text: { ...text }
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
      this.tag('TextBox.Text').smooth = { color };
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
        shader: { type: FadeShader, positionLeft: 0, positionRight: this._fadeW },
        rtt: true
      });
    }

    _updateAnimation() {
      this._scrollAnimation && this._scrollAnimation.stopNow();
      this._scrollAnimation = this.animation({
        duration: this._textRenderedW / 50,
        delay: isNaN(this.delay) ? 1.5 : this.delay,
        repeat: isNaN(this.repeat) ? -1 : this.repeat,
        actions: [
          {
            t: 'TextBox',
            p: 'x',
            v: {
              sm: 0,
              0: { v: 0 },
              0.5: { v: -(this._textRenderedW + this._offset) }
            }
          },
          {
            t: 'TextClipper',
            p: 'shader.positionLeft',
            v: {
              sm: 0,
              0: { v: 0 },
              0.1: { v: this._fadeW },
              0.4: { v: this._fadeW },
              0.5: { v: 0 }
            }
          }
        ]
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
      this._whenEnabled = new Promise(resolve => (this._firstEnable = resolve));
      this._w = this.stage.w;
      this.debounceDelay = Number.isInteger(this.debounceDelay)
        ? this.debounceDelay
        : 1;
      this._update = debounce_1.debounce(this._updateLayout, this.debounceDelay);
    }

    get _itemTransition() {
      return (
        this.itemTransition || {
          duration: 0.4,
          timingFunction: 'cubic-bezier(0.20, 1.00, 0.30, 1.00)'
        }
      );
    }

    _focus() {
      this.items.forEach(item => (item.parentFocus = true));
    }

    _unfocus() {
      this.items.forEach(item => (item.parentFocus = false));
    }

    selectNext() {
      this._smooth = true;
      return super.selectNext();
    }

    selectPrevious() {
      this._smooth = true;
      return super.selectPrevious();
    }

    // TODO: can be documented in API when lastScrollIndex is made public
    shouldScrollLeft() {
      let shouldScroll = false;

      if (this._lastScrollIndex) {
        shouldScroll = this.selectedIndex < this._lastScrollIndex;
        if (
          this._prevLastScrollIndex !== undefined &&
          this._prevLastScrollIndex !== this._lastScrollIndex
        ) {
          shouldScroll = true;
        }
      } else {
        shouldScroll = this.selectedIndex >= this._scrollIndex;
      }

      return this._itemsX < 0 && shouldScroll;
    }

    // TODO: can be documented in API when lastScrollIndex is made public
    shouldScrollRight() {
      const lastChild = this.Items.childList.last;
      return (
        this.selectedIndex > this._scrollIndex &&
        // end of Items container < end of last item
        Math.abs(this._itemsX - this.w) <
          lastChild.x + this.Items.childList.last.w
      );
    }

    get onScreenItems() {
      return this.Items.children.filter(child => this._isOnScreen(child));
    }

    _isOnScreen(child) {
      const x = getX(child);
      const { w } = child;
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
          shouldScroll =
            lastChild &&
            (this.shouldScrollLeft() ||
              this.shouldScrollRight() ||
              !this._isOnScreenCompletely(this.selected));
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
        itemsContainerX = this.Items.children[itemIndex].transition('x')
          ? -this.Items.children[itemIndex].transition('x').targetValue
          : -this.Items.children[itemIndex].x;
      }
      return itemsContainerX;
    }

    render(next, prev) {
      this._whenEnabled.then(() => {
        this._prevLastScrollIndex = this._lastScrollIndex;

        if (this._shouldScroll()) {
          const itemsContainerX =
            this.lazyScroll && prev
              ? this._getLazyScrollX(prev)
              : this._getScrollX();
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
      let nextH = 0;
      // layout items in row
      for (let i = 0; i < this.Items.children.length; i++) {
        const child = this.Items.children[i];
        nextH = Math.max(nextH, getH(child));
        if (this._smooth) {
          child.smooth = { x: [nextX, this._itemTransition] };
        } else {
          child.patch({ x: nextX });
        }
        nextX += child.w;
        if (i < this.Items.children.length - 1) {
          nextX += this.itemSpacing;
        }

        if (child.centerInParent) {
          // if the child is another focus manager, check the height of the item container
          const childHeight = (child.Items && child.Items.h) || child.h;
          // only center the child if it is within the bounds of this focus manager
          if (childHeight < this.h) {
            child.y = (this.h - childHeight) / 2;
          }
        }
      }
      this.Items.patch({ h: nextH, w: nextX });

      const lastChild = this.Items.childList.last;
      const endOfLastChild = lastChild ? getX(lastChild) + lastChild.w : 0;
      const scrollOffset = (this.Items.children[this._scrollIndex] || { x: 0 }).x;

      // determine when to stop scrolling right
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
    }

    // can be overridden
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

  const KEY_DIMENSIONS = { h: 90, w: 113, padding: 0, fixed: true }; // actualize key values : 60 ,60  ; 90,100
  const isUpperCase = string => /^[A-Z]$/.test(string);
  class Key extends Button$1 {
    static _template() {
      return {
        ...super._template(),
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
      return this.styles.sizes
        ? { ...this.styles.sizes, ...this.sizes }
        : { small: 50, medium: 110, large: 273, xlarge: 760, ...this.sizes }; // actualize values 50,110,212,350 ; 50,110,212,750
    }

    _handleEnter() {
      if (this.toggle) {
        this.fireAncestors('$toggleKeyboard', this.toggle);
      }
      this.fireAncestors('$onSoftKey', { key: this.title });
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
      this._whenEnabled = new Promise(resolve => (this._firstEnable = resolve));
    }

    get announce() {
      return 'Keyboard' + (this.title ? `, ${this.title}` : '');
    }

    get announceContext() {
      return [
        'PAUSE-2',
        'Use arrow keys to choose characters, press center to select'
      ];
    }

    set formats(formats = {}) {
      this._formats = formats;
      this._currentFormat = this._defaultFormat;
      // Ensure formats prop is set last
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
        this.patch({ [key]: { ...rows[0], alpha: 0 } });
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
        let h = (this.keysConfig && this.keysConfig.h) || KEY_DIMENSIONS.h;
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
          return { ...KEY_DIMENSIONS, skipFocus: true };
        } else if (typeof keyProps === 'object') {
          return { ...key, ...keyProps };
        }
        return { ...key, label: keyProps };
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
      keyboardFormat =
        keyboardFormat.charAt(0).toUpperCase() + keyboardFormat.slice(1);
      if (keyboardFormat !== this._currentFormat) {
        this.selectKeyOn(this.tag(keyboardFormat));
        this.tag(this._currentFormat).alpha = 0;
        this.tag(keyboardFormat).alpha = 1;
        this._currentFormat = keyboardFormat;
      }
    }

    selectKeyOn(keyboard, { row, column } = this.getSelectedKey()) {
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
      return { row, column };
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
      if (this._rowCount)
        return (
          this._formats[this._defaultFormat.toLowerCase()].length / this._rowCount
        );
      if (this.inline)
        return this._formats[this._defaultFormat.toLowerCase()].length;
      else return 11;
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
      letters: [
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          {
            label: '#@!',
            size: 'large',
            toggle: 'symbols',
            announce: 'symbol mode, button'
          },
          { label: 'Space', size: 'large' },
          { label: 'Delete', size: 'large' },
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          ''
        ],
        [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z'
        ]
      ],
      symbols: [
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          {
            label: 'ABC',
            size: 'large',
            toggle: 'letters',
            announce: 'caps on, button'
          },
          { label: 'Space', size: 'large' },
          { label: 'Delete', size: 'large' },
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          ''
        ],
        [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '0',
          { label: '!', announce: 'exclamation, button' },
          '@',
          '#',
          '$',
          '%',
          { label: '^', announce: 'caret circumflex, button' },
          '&',
          '*',
          { label: '(', announce: 'open parenthesis, button' },
          { label: ')', announce: 'close parenthesis, button' },
          { label: '`', announce: 'grave accent, button' },
          '~',
          '_',
          '.',
          '-',
          '+'
        ]
      ]
    },
    qwerty: {
      uppercase: [
        [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '0',
          { label: 'Clear', size: 'medium' }
        ],
        [
          'Q',
          'W',
          'E',
          'R',
          'T',
          'Y',
          'U',
          'I',
          'O',
          'P',
          {
            label: '#@!',
            size: 'medium',
            toggle: 'symbols',
            announce: 'symbol mode, button'
          }
        ],
        [
          'A',
          'S',
          'D',
          'F',
          'G',
          'H',
          'J',
          'K',
          'L',
          '@',
          {
            label: 'áöû',
            size: 'medium',
            toggle: 'accents',
            announce: 'accents, button'
          }
        ],
        [
          'Z',
          'X',
          'C',
          'V',
          'B',
          'N',
          'M',
          { label: '_', announce: 'underscore, button' },
          { label: '.', announce: 'period, button' },
          { label: '-', announce: 'dash, button' },
          {
            label: 'shift',
            size: 'medium',
            toggle: 'lowercase',
            announce: 'shift off, button'
          }
        ],
        [
          { label: 'Delete', size: 'large' },
          { label: 'Space', size: 'xlarge' },
          { label: 'Done', size: 'large' }
        ]
      ],
      lowercase: [
        [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '0',
          { label: 'Clear', size: 'medium' }
        ],
        [
          'q',
          'w',
          'e',
          'r',
          't',
          'y',
          'u',
          'i',
          'o',
          'p',
          {
            label: '#@!',
            size: 'medium',
            toggle: 'symbols',
            announce: 'symbol mode, button'
          }
        ],
        [
          'a',
          's',
          'd',
          'f',
          'g',
          'h',
          'j',
          'k',
          'l',
          '@',
          {
            label: 'áöû',
            size: 'medium',
            toggle: 'accents',
            announce: 'accents, button'
          }
        ],
        [
          'z',
          'x',
          'c',
          'v',
          'b',
          'n',
          'm',
          { label: '_', announce: 'underscore, button' },
          { label: '.', announce: 'period, button' },
          { label: '-', announce: 'dash, button' },
          {
            label: 'shift',
            size: 'medium',
            toggle: 'uppercase',
            announce: 'shift on, button'
          }
        ],
        [
          { label: 'Delete', size: 'large' },
          { label: 'Space', size: 'xlarge' },
          { label: 'Done', size: 'large' }
        ]
      ],
      accents: [
        [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '0',
          { label: 'Clear', size: 'medium' }
        ],
        [
          'ä',
          'ë',
          'ï',
          'ö',
          'ü',
          'ÿ',
          'à',
          'è',
          'ì',
          'ò',
          {
            label: '#@!',
            size: 'medium',
            toggle: 'symbols',
            announce: 'symbol mode, button'
          }
        ],
        [
          'ù',
          'á',
          'é',
          'í',
          'ó',
          'ú',
          'ý',
          'â',
          'ê',
          'î',
          {
            label: 'abc',
            size: 'medium',
            toggle: 'lowercase',
            announce: 'alpha mode, button'
          }
        ],
        [
          '',
          '',
          '',
          'ô',
          'û',
          'ã',
          'ñ',
          '',
          '',
          '',
          {
            label: 'shift',
            size: 'medium',
            toggle: 'accentsUpper',
            announce: 'shift off, button'
          }
        ],
        [
          { label: 'Delete', size: 'large' },
          { label: 'Space', size: 'xlarge' },
          { label: 'Done', size: 'large' }
        ]
      ],
      accentsUpper: [
        [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '0',
          { label: 'Clear', size: 'medium' }
        ],
        [
          'Ä',
          'Ë',
          'Ï',
          'Ö',
          'Ü',
          'Ÿ',
          'À',
          'È',
          'Ì',
          'Ò',
          {
            label: '#@!',
            size: 'medium',
            toggle: 'symbols',
            announce: 'symbol mode, button'
          }
        ],
        [
          'Ù',
          'Á',
          'É',
          'Í',
          'Ó',
          'Ú',
          'Ý',
          'Â',
          'Ê',
          'Î',
          {
            label: 'abc',
            size: 'medium',
            toggle: 'lowercase',
            announce: 'alpha mode, button'
          }
        ],
        [
          '',
          '',
          '',
          'Ô',
          'Û',
          'Ã',
          'Ñ',
          '',
          '',
          '',
          {
            label: 'shift',
            size: 'medium',
            toggle: 'accents',
            announce: 'shift off, button'
          }
        ],
        [
          { label: 'Delete', size: 'large' },
          { label: 'Space', size: 'xlarge' },
          { label: 'Done', size: 'large' }
        ]
      ],
      symbols: [
        [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '0',
          { label: 'Clear', size: 'medium' }
        ],
        [
          { label: '!', announce: 'exclamation, button' },
          '@',
          '#',
          '$',
          '%',
          { label: '^', announce: 'caret circumflex, button' },
          '&',
          '*',
          { label: '(', announce: 'open parenthesis, button' },
          { label: ')', announce: 'close parenthesis, button' },
          {
            label: 'abc',
            size: 'medium',
            toggle: 'lowercase',
            announce: 'alpha mode, button'
          }
        ],
        [
          { label: '{', announce: 'open brace, button' },
          { label: '}', announce: 'close brace, button' },
          { label: '[', announce: 'open bracket, button' },
          { label: ']', announce: 'close bracket, button' },
          { label: ';', announce: 'semicolon, button' },
          { label: '"', announce: 'doublequote, button' },
          { label: "'", announce: 'singlequote, button' },
          { label: '|', announce: 'vertical bar, button' },
          { label: '\\', announce: 'backslash, button' },
          { label: '/', announce: 'forwardslash, button' },
          {
            label: 'áöû',
            size: 'medium',
            toggle: 'accents',
            announce: 'accents, button'
          }
        ],
        [
          { label: '<', announce: 'less than, button' },
          { label: '>', announce: 'greater than, button' },
          { label: '?', announce: 'question mark, button' },
          { label: '=', announce: 'equals, button' },
          { label: '`', announce: 'grave accent, button' },
          { label: '~', announce: 'tilde, button' },
          { label: '_', announce: 'underscore, button' },
          { label: '.', announce: 'period, button' },
          { label: '-', announce: 'dash, button' },
          { label: '+', announce: 'plus sign, button' }
        ],
        [
          { label: 'Delete', size: 'large' },
          { label: 'Space', size: 'xlarge' },
          { label: 'Done', size: 'large' }
        ]
      ]
    },
    numbers: {
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      dialpad: [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['', '0', '']
      ],
      dialpadExtended: [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['', '0', ''],
        [{ label: 'Delete', size: 'large' }]
      ]
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
          color: 0xff000000,
        },
        Title: {
          x: w => w / 2,
          y: 95,
          mountX: 0.5,
          zIndex: 2,
          text: { text: '', fontSize: 40, textColor: CONFIG.theme.hex },
        },
        RectangleWithColor: {
          x: w => w / 2, mountX: 0.5, y: 164, w: 1550, h: 2, rect: true, color: 0xFFFFFFFF, zIndex: 2
        },
        PasswordLabel: {
          x: 180,
          y: 240,
          w: 300,
          h: 75,
          zIndex: 2,
          text: { text: 'Password: ', fontSize: 25, fontFace: CONFIG.language.font, textColor: 0xffffffff, textAlign: 'left' },
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
            textOverflow: 'ellipsis',
          },
        },
        PasswordBox: {
          x: 417,
          y: 208,
          zIndex: 2,
          LeftBorder: {
            rect: true,
            x: 0, y: 0,
            w: 3,
            h: 88,
            mountX: 0,
            color: 0xffffffff,
          },
          RightBorder: {
            rect: true,
            x: 0 + 1321, y: 0,
            w: 3,
            h: 88,
            mountX: 1,
            color: 0xffffffff,
          },
          TopBorder: {
            rect: true,
            x: 0, y: 0,
            w: 1321,
            h: 3,
            mountY: 0.5,
            color: 0xffffffff,
          },
          BottomBorder: {
            rect: true,
            x: 0, y: 0 + 88,
            w: 1321,
            h: 3,
            mountY: 0.5,
            color: 0xffffffff,
          }
        },

        PasswrdSwitch: {
          h: 45,
          w: 66.9,
          x: 1920 - 222,
          y: 255,
          zIndex: 2,
          type: PasswordSwitch,
          mount: 0.5,
        },
        ShowPassword: {
          x: 1920 - 480,
          y: 240,
          w: 300,
          h: 75,
          zIndex: 2,
          text: { text: 'Show Password', fontSize: 25, fontFace: CONFIG.language.font, textColor: 0xffffffff, textAlign: 'left' },
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
          x: w => 1920 / 2, mountX: 0.5, y: 451, w: 1550, h: 2, rect: true, color: 0xFFFFFFFF, zIndex: 2
        },
        KeyBoard: {
          y: 501,
          x: 420,
          // mountX:0.5,
          // w:1080,
          type: Keyboard,
          visible: true,
          zIndex: 2,
          // formats: {
          //   qwerty: [
          //     ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', { label: 'backspace', size: 'large' }],
          //     [{ label: 'tab', size: 'large' }, 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
          //     [{ label: 'caps', size: 'medium', w: 170 }, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', { label: '< enter', size: 'medium', w: 170 }],
          //     [{ label: 'shift', size: 'large' }, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', { label: 'shift', size: 'large', w: 195 }],
          //     [{ label: '.com', size: 'medium', w: 170 }, '@', { label: ' ', size: 'xlarge', w: 850 }]
          //   ]
          // }, 
          formats: KEYBOARD_FORMATS.qwerty
        }

      }
    }

    _updateText(txt) {

      this.tag("Pwd").text.text = txt;


    }
    _handleBack() {
      this.patch({ visible: false });
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
          x: index === 0 ? 0 : 0 + 325 * index,
          w: 325,
          h: 85,
          type: ConfirmAndCancel,
          item: item,
        }
      });
      this._setState('Pair');
    }

    _focus() {
      this.fireAncestors("$hideSideAndTopPanels");
    }
    _unfocus() {
      this.fireAncestors("$showSideAndTopPanels");
    }

    _init() {
      this.hidePasswd = true;
      this.star = "";

      this.passwd = "";
      // this.tag('KeyBoard').patch({scale:1558/1080})
    }


    static _states() {
      return [
        class Password extends this {
          $enter() {
            this.shifter = false;
            this.capsLock = false;
            //  this.tag('Password').alpha = 1
          }
          _getFocused() {
            return this.tag("KeyBoard")
            //  return this.tag('Password')
          }
          $exit() {
            // this.tag('Password').alpha = 0
          }


          // $onSoftKey(key) {
          //   // if(key.key.length > 1){

          //   //   if(key.key === "caps"){
          //   //     if(this.capsLock){
          //   //       this.capsLock = false;
          //   //       this.tag("KeyBoard").patch({
          //   //         formats: {
          //   //           qwerty:  [
          //   //             ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', { label: 'backspace', size: 'large' }],
          //   //             [{ label: 'tab', size: 'large' }, 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
          //   //             [{ label: 'caps', size: 'medium', w: 170 }, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '\"', { label: '< enter', size: 'medium', w: 170 }],
          //   //             [{ label: 'shift', size: 'large' }, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', { label: 'shift', size: 'large', w: 195 }],
          //   //             [{ label: '.com', size: 'medium', w: 170 }, '@', { label: ' ', size: 'xlarge', w: 850 }]
          //   //           ]
          //   //         } 
          //   //       });
          //   //     }
          //   //     else{
          //   //       this.capsLock = true;
          //   //       this.tag("KeyBoard").patch({
          //   //         formats: {
          //   //           qwerty: [
          //   //             ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', { label: 'backspace', size: 'large' }],
          //   //             [{ label: 'tab', size: 'large' }, 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
          //   //             [{ label: 'caps', size: 'medium', w: 170 }, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', { label: '< enter', size: 'medium', w: 170 }],
          //   //             [{ label: 'shift', size: 'large' }, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', { label: 'shift', size: 'large', w: 195 }],
          //   //             [{ label: '.com', size: 'medium', w: 170 }, '@', { label: ' ', size: 'xlarge', w: 850 }]
          //   //           ]
          //   //         }
          //   //       });
          //   //     }

          //   //   }
          //   //   else if(key.key === 'shift'){
          //   //     this.shifter  = true;
          //   //   }
          //   //   else if(key.key === 'backspace'){
          //   //     this.passwd = this.passwd.substring(0,this.passwd.length - 1);
          //   //   }
          //   //   else if(key.key === 'tab'){
          //   //     this.passwd += '\t'
          //   //   }
          //   //   else if(key.key === '.com'){
          //   //     this.passwd += '.com'
          //   //   }
          //   //   else if(key.key === '< enter'){
          //   //     this.fireAncestors('$startConnect', this.passwd)
          //   //   }
          //   // }
          //   // else{
          //     if(this.capsLock){
          //       key.key = key.key.toUpperCase();
          //     }
          //     else if(this.shifter){
          //       key.key = key.key.toUpperCase();
          //       this.shifter = false;
          //     }
          //     this.passwd+= key.key;
          //   // }
          //   if(this.hidePasswd){
          //     this.tag("Pwd").text.text =  this.getStars();
          //   } 
          //   else{
          //     this.tag("Pwd").text.text = this.passwd
          //   }
          // }

          $onSoftKey({ key }) {

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
          // _handleKey(event) {
          //   if
          //   // if (
          //   //   event.keyCode == 27 ||
          //   //   event.keyCode == 77 ||
          //   //   event.keyCode == 49 ||
          //   //   event.keyCode == 158
          //   // ) {
          //   //   this._setState('Pair')
          //   // } else return false
          // }


        },
        class Pair extends this {
          $enter() { }
          _getFocused() {
            return this.tag('List').element
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

        },



        class PasswordSwitchState extends this{
          $enter() {
            // this.tag("PasswordBox").patch({
            //   //  texture: Lightning.Tools.getRoundRect(  1321 , 88 , 0, 2, CONFIG.theme.hex, false)
            //   shader: { type: Lightning.shaders.RoundedRectangle, radius: 0}
            //   })
            this.tag("PasswordBox.TopBorder").color = CONFIG.theme.hex;
            this.tag("PasswordBox.RightBorder").color = CONFIG.theme.hex;
            this.tag("PasswordBox.BottomBorder").color = CONFIG.theme.hex;
            this.tag("PasswordBox.LeftBorder").color = CONFIG.theme.hex;
            this.isOn = false;
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
              this.hidePasswd = false;
              // this.tag('Pwd').text.text = this.passwd;
            }
            else {
              this._updateText(this.star);
              this.hidePasswd = true;
              // this.tag('Pwd').text.text = this.getStars();
            }
          }

          $exit() {
            // this.tag("PasswordBox").patch({ 
            //   // texture: Lightning.Tools.getRoundRect(  1321 , 88 , 0, 2, 0xffffffff, false)
            //   shader: { type: Lightning.shaders.RoundedRectangle, radius: 0}
            // });
            this.tag("PasswordBox.TopBorder").color = 0xFFFFFFFF;
            this.tag("PasswordBox.RightBorder").color = 0xFFFFFFFF;
            this.tag("PasswordBox.BottomBorder").color = 0xFFFFFFFF;
            this.tag("PasswordBox.LeftBorder").color = 0xFFFFFFFF;
          }
        }
      ]
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
      }
      else if (securityCode < 0 || securityCode > 14) {
        this._setState("EnterSecurity");
      }
      else if (securityCode !== 0 && !this.textCollection['EnterPassword']) {
        this._setState("EnterPassword");
      }
      else {
        if (this.textCollection['EnterSecurity'] === "0") {
          this.textCollection['EnterPassword'] = "";
          this.tag("Pwd").text.text = "";
        }

        var self = this;
        this.fireAncestors("$startConnectForAnotherNetwork", { ssid: self.textCollection['EnterSSID'], security: securityCode }, self.textCollection['EnterPassword']);
      }
    }
    static _template() {
      return {
        Background: {
          w: 1920,
          h: 1080,
          rect: true,
          color: 0xff000000,
        },
        Text: {
          x: 800,
          y: 70,
          text: {
            text: "Find and join a WiFi network",
            fontFace: CONFIG.language.font,
            fontSize: 35,
            textColor: CONFIG.theme.hex,
          },
        },
        BorderTop: {
          x: 190, y: 130, w: 1530, h: 2, rect: true,
        },
        Network: {
          x: 190,
          y: 176,
          text: {
            text: "Network Name: ",
            fontFace: CONFIG.language.font,
            fontSize: 25,
          },
        },
        NetworkBox: {
          BorderLeft: { x: 400, y: 160, w: 3, h: 58, rect: true, },
          BorderTop: { x: 400, y: 160, w: 1315, h: 3, rect: true, },
          BorderRight: { x: 1715, y: 160, w: 3, h: 59, rect: true, },
          BorderBottom: { x: 400, y: 188 + 28, w: 1315, h: 3, rect: true, }
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
            textOverflow: 'ellipsis',
          },
        },
        NetworkType: {
          x: 190,
          y: 246,
          text: {
            text: "Security: ",
            fontFace: CONFIG.language.font,
            fontSize: 25,
          },
        },
        TypeBox: {
          BorderLeft: { x: 400, y: 230, w: 3, h: 58, rect: true, },
          BorderTop: { x: 400, y: 230, w: 1315, h: 3, rect: true, },
          BorderRight: { x: 1715, y: 230, w: 3, h: 59, rect: true, },
          BorderBottom: { x: 400, y: 258 + 28, w: 1315, h: 3, rect: true, },
          ArrowForward: {
            h: 30,
            w: 45,
            x: 1655,
            y: 245,
            src: Utils.asset('images/settings/Arrow.png'),
          },
          ArrowBackward: {
            h: 30,
            w: 45,
            x: 415,
            scaleX: -1,
            y: 245,
            src: Utils.asset('images/settings/Arrow.png'),
          },
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
            textOverflow: 'ellipsis',
          },
        },
        Password: {
          x: 190,
          y: 316,
          text: {
            text: "Password:",
            fontFace: CONFIG.language.font,
            fontSize: 25,
          },
        },
        PasswordBox: {
          BorderLeft: { x: 400, y: 300, w: 3, h: 58, rect: true, },
          BorderTop: { x: 403, y: 300, w: 1315, h: 3, rect: true, },
          BorderRight: { x: 1715, y: 300, w: 3, h: 59, rect: true, },
          BorderBottom: { x: 403, y: 328 + 28, w: 1315, h: 3, rect: true, },
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
            textOverflow: 'ellipsis',
          },
        },
        BorderBottom: {
          x: 190, y: 396, w: 1530, h: 2, rect: true,
        },
        Keyboard: {
          y: 437,
          x: 400,
          type: Keyboard,
          visible: true,
          zIndex: 2,
          formats: KEYBOARD_FORMATS.qwerty
        }
      }
    }
    _focus() {
      this._setState('EnterSSID');
      this.textCollection = { 'EnterSSID': '', 'EnterPassword': '', 'EnterSecurity': '' };
      this.tag('Pwd').text.text = "";
      this.tag("NetworkText").text.text = "";
      this.tag("TypeText").text.text = this.securityCodes[this.securityCodeIndex].name;

      if (this.securityCodes[this.securityCodeIndex].value === 0) {
        this.pwdUnReachable = true;
        this.tag("PasswordBox").alpha = 0.5;
        this.tag("Password").alpha = 0.5;
      }
      else {
        this.pwdUnReachable = false;
        this.tag("PasswordBox").alpha = 1;
        this.tag("Password").alpha = 1;
      }
    }
    static _states() {
      return [
        class EnterSSID extends this{
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
        },
        class EnterSecurity extends this{
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
            }
            else {
              this.tag("PasswordBox").alpha = 1;
              this.tag("Password").alpha = 1;
              return false;
            }
          }
          _handleLeft() {
            this.securityCodeIndex = (15 + (--this.securityCodeIndex)) % 15;
            this.pwdUnReachable = this.isPasswordUnReachable(this.securityCodeIndex);
            this.tag("TypeText").text.text = this.securityCodes[this.securityCodeIndex].name;
          }
          _handleEnter() {
            this.handleDone();
          }
          _handleRight() {
            this.securityCodeIndex = (15 + (++this.securityCodeIndex)) % 15;
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
        },
        class EnterPassword extends this{
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
        },
        class Keyboard extends this{
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
            return this.tag('Keyboard')
          }

          $onSoftKey({ key }) {
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
        }
      ]
    }

    _init() {
      this.securityCodeIndex = 0;
      this.pwdUnReachable = true;
      this.textCollection = { 'EnterSSID': '', 'EnterPassword': '', 'EnterSecurity': '0' };
      this.securityCodes = [{ name: "Open/None (Unsecure)", value: 0 }, { name: "WEP - Deprecated, not needed", value: 1 }, { name: "WEP", value: 2 }, { name: "WPA Personal TKIP", value: 3 }, { name: "WPA Personal AES", value: 4 }, { name: "WPA2 Personal TKIP", value: 5 }, { name: "WPA2 Personal AES", value: 6 }, { name: "WPA Enterprise TKIP", value: 7 }, { name: "WPA Enterprise AES", value: 8 }, { name: "WPA2 Enterprise TKIP", value: 9 }, { name: "WPA2 Enterprise AES", value: 10 }, { name: "Mixed Personal", value: 11 }, { name: "Mixed Enterprise", value: 12 }, { name: "WPA3 Personal AES", value: 13 }, { name: "WPA3 Personal SAE", value: 14 }];
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
                  color: 0xff000000,
              },
              Title: {
                  x: 0,
                  y: 0,
                  mountX: 0.5,
                  text: {
                      text: "Wifi Error",
                      fontFace: CONFIG.language.font,
                      fontSize: 40,
                      textColor: CONFIG.theme.hex,
                  },
              },
              BorderTop: {
                  x: 0, y: 75, w: 1558, h: 3, rect: true, mountX: 0.5,
              },
              Pairing: {
                  x: 0,
                  y: 125,
                  mountX: 0.5,
                  text: {
                      text: "",
                      fontFace: CONFIG.language.font,
                      fontSize: 25,
                  },
              },
              RectangleDefault: {
                  x: 0, y: 200, w: 200, mountX: 0.5, h: 50, rect: true, color: CONFIG.theme.hex,
                  Ok: {
                      x: 100,
                      y: 25,
                      mount: 0.5,
                      text: {
                          text: "OK",
                          fontFace: CONFIG.language.font,
                          fontSize: 22,
                      },
                  }
              },
              BorderBottom: {
                  x: 0, y: 300, w: 1558, h: 3, rect: true, mountX: 0.5,
              },
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
          x: 700,
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
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 66.9,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/ToggleOffWhite.png'),
          },
        },
        Networks: {
          y: 180,
          flex: { direction: 'column' },
          PairedNetworks: {
            flexItem: { margin: 0 },
            List: {
              type: lng$1.components.ListComponent,
              w: 1920 - 300,
              itemSize: 90,
              horizontal: false,
              invertDirection: true,
              roll: true,
              rollMax: 900,
              itemScrollOffset: -4,
            },
          },
          AvailableNetworks: {
            flexItem: { margin: 0 },
            List: {
              w: 1920 - 300,
              type: lng$1.components.ListComponent,
              itemSize: 90,
              horizontal: false,
              invertDirection: true,
              roll: true,
              rollMax: 900,
              itemScrollOffset: -4,
            },
          },
          visible: false,
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
              fontSize: 25,
            }
          },
          visible: false,
        },
        PairingScreen: {
          x: -300,
          y: -265,
          w: 1920,
          h: 1080,
          zIndex: 4,
          visible: false,
          type: BluetoothPairingScreen
        },
        JoinAnotherNetworkScreen: {
          x: -300,
          y: -265,
          w: 1920,
          h: 1080,
          zIndex: 4,
          visible: false,
          type: JoinAnotherNetworkComponent
        },


      }

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
      // clearTimeout(this.failScreen)
      this._setState('Switch');
      this.childList.remove(this.tag('FailScreen'));
    }

    _setfailState(msg) {
      this.tag('FailScreen').item = msg;
      this._setState('FailScreen');
    }


    _init() {

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
      this.wifiStatus = false;
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
            if (notification.status == 'ACQUIRED') {
              this.fireAncestors('$changeIp', 'IP:' + notification.ip4Address);
            } else if (notification.status == 'LOST') {
              this.fireAncestors('$changeIp', 'IP:' + 'NA');
            }
          });
          this._network.registerEvent('onDefaultInterfaceChanged', notification => {
            console.log(notification);
            if (notification.newInterfaceName == 'WIFI') {
              this._wifi.setEnabled(true).then(result => {
                if (result.success) {
                  this.wifiStatus = true;
                  this.tag('Networks').visible = true;
                  this.tag('JoinAnotherNetwork').visible = true;
                  this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
                  this._wifi.discoverSSIDs();
                }
              });
            } else if (
              notification.newInterfaceName == 'ETHERNET' ||
              notification.oldInterfaceName == 'WIFI'
            ) {
              this._wifi.disconnect();
              this.wifiStatus = false;
              this.tag('Networks').visible = false;
              this.tag('JoinAnotherNetwork').visible = false;
              this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
              this._setState('Switch');
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
            item: item,
          }
        });

        this._otherList = ssids.filter(device => {
          result = this._pairedList.map(a => a.ssid);
          if (result.includes(device.ssid)) {
            return false
          } else return device
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
            item: item,
          }
        });
      });
    }

    $startConnectForAnotherNetwork(device, passphrase) {
      this._wifi.connect({ ssid: device.ssid, security: device.security }, passphrase);
      this._setState("Switch");
    }

    static _states() {
      return [
        class Switch extends this {
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
        },
        class PairedDevices extends this {
          $enter() {
            if (this.wifiStatus === true) {
              this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
              this.tag('Switch.Button').scaleX = -1;
            }

          }
          _getFocused() {
            return this._pairedNetworks.tag('List').element
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
        },
        class AvailableDevices extends this {
          $enter() {
            if (this.wifiStatus === true) {
              this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
              this.tag('Switch.Button').scaleX = -1;
            }

          }
          _getFocused() {
            return this._availableNetworks.tag('List').element
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
        },
        class JoinAnotherNetwork extends this {
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
        },

        class JoinAnotherNetworkScreenState extends this{
          $enter() {
            this.tag('JoinAnotherNetworkScreen').visible = true;
          }
          _getFocused() {
            return this.tag("JoinAnotherNetworkScreen")
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
        },

        class PairingScreen extends this {
          $enter() {
            this._wifi.stopScan();
            this._disable();
            this.tag("PairingScreen").visible = true;
          }
          _getFocused() {
            return this.tag('PairingScreen')
          }
          $pressEnter(option) {
            if (option === 'Cancel') {
              this._setState('Switch');
            } else if (option === 'Connect') {
              if (this._availableNetworks.tag('List').element) {
                this._wifi
                  .connect(this._availableNetworks.tag('List').element._item, '')
                  .then(() => { });
              }
              this._setState('Switch');
            } else if (option === 'Disconnect') {
              this._wifi.disconnect().then(() => { });
              this._setState('Switch');
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
        },
        class FailScreen extends this{
          $enter() {
            this.tag('FailScreen').visible = true;
          }
          _getFocused() {
            return this.tag('FailScreen')
          }
          $exit() {
            this.tag('FailScreen').visible = true;
          }
        }
      ]
    }

    /**
     * Function to navigate through the lists in the screen.
     * @param {string} listname
     * @param {string} dir
     */

    _navigate(listname, dir) {
      let list;
      if (listname === 'MyDevices') list = this._pairedNetworks.tag('List');
      else if (listname === 'AvailableDevices') list = this._availableNetworks.tag('List');
      if (dir === 'down') {
        if (list.index < list.length - 1) list.setNext();
        else if (list.index == list.length - 1) {
          if (listname === 'MyDevices' && this._availableNetworks.tag('List').length > 0) {
            this._setState('AvailableDevices');
          }
        }
      } else if (dir === 'up') {
        if (list.index > 0) list.setPrevious();
        else if (list.index == 0) {
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
        this._wifi.setInterface('ETHERNET', true).then(result => {
          if (result.success) {
            this._wifi.setDefaultInterface('ETHERNET', true).then(result => {
              if (result.success) {
                this._wifi.disconnect();
                this.wifiStatus = false;
                this.tag('Networks').visible = false;
                this.tag('JoinAnotherNetwork').visible = false;
                this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOffWhite.png');
              }
            });
          }
        });
      } else {
        this._wifi.setInterface('WIFI', true).then(result => {
          if (result.success) {
            this._wifi.setDefaultInterface('WIFI', false).then(result => { //try changing this to true
              if (result.success) {
                this._wifi.setEnabled(true).then(result => {
                  if (result.success) {
                    this.wifiStatus = true;
                    this.tag('Networks').visible = true;
                    this.tag('JoinAnotherNetwork').visible = true;
                    this.tag('Switch.Button').src = Utils.asset('images/settings/ToggleOnOrange.png');
                    this._wifi.discoverSSIDs();
                  }
                });
              }
            });
          }
        });
      }
    }


    /**
     * Function to activate Wi-Fi plugin.
     */
    _activateWiFi() {
      this._wifi.activate().then(() => {
        this._wifi.getDefaultInterface().then(result => {
          if (result.interface == 'WIFI') {
            this.switch();
          }
        });
      });
      // this.tag('Networks.AvailableNetworks.Loader').visible = true
      this._wifi.registerEvent('onWIFIStateChanged', notification => {
        if (notification.state === 2 || notification.state === 5) {
          this._wifi.discoverSSIDs();
          // this.tag('Networks.AvailableNetworks.Loader').visible = true
        }
        this._setState('Switch');
      });
      this._wifi.registerEvent('onError', notification => {
        this._wifi.discoverSSIDs();
        this._setfailState(this.onError[notification.code]);
        // this.failScreen = setTimeout(() => {
        //   this.childList.remove(this.tag('FailScreen'))
        //   this._setState('Switch')
        // }, 5000)
      });
      this._wifi.registerEvent('onAvailableSSIDs', notification => {
        this.renderDeviceList(notification.ssids);
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
                  itemScrollOffset: -5,
              }
          }
      }
      _init() {
          this.lastElement = false;
          this.options = [
              { value: 'Off', tick: true },
              { value: '30 Minutes', tick: false },
              { value: '1 Hour', tick: false },
              { value: '1.5 Hours', tick: false },
              { value: '2 Hours', tick: false },
              { value: '3 Hours', tick: false }
          ];
          this.tag('List').h = this.options.length * 90;
          this.tag('List').items = this.options.map(item => {
              return {
                  w: 1920 - 300,
                  h: 90,
                  type: SettingsItem,
                  item: item.value
              }
          });
          this.tag('List').getElement(0).tag('Tick').visible = true;
          this._setState('Options');
      }

      static _states() {
          return [
              class Options extends this{
                  _getFocused() {
                      return this.tag('List').element
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
                  }
              }
          ]
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
    static _template(){
      return {
        zIndex:1,
        TopLine: {
          y: 0,
          mountY: 0.5,
          w: 1535,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        },
        Item: {
          w: 1920 - 300,
          h: 90,
          rect: true,
          color: 0x00000000,
        },
        BottomLine: {
          y: 0 + 90,
          mountY: 0.5,
          w: 1535,
          h: 3,
          rect: true,
          color: 0xFFFFFFFF
        },
      }
    }

    _init() {
      console.log(`!! init comes first !!`);
      if(this.isTicked){
        console.log(`!! is ticked was true for the object ${this}!!`);
        this.fireAncestors("$resetPrevTickObject",this);
      }
      this.appApi = new AppApi();
      console.log(`item value was set to ${this._item} and is a Video Element ${this.videoElement}`);
    }

    _handleEnter(){
      var self = this;
      if(this.videoElement === true){
        this.appApi.setResolution(this._item).then(res=>{
          console.log(`the resolution attempted to be set to ${this._item.split(" ")[1]} and the result was ${res}`);
          this.fireAncestors('$updateResolution', self._item);
          if(res === true){
            self.fireAncestors("$resetPrevTickObject",self);
            self.tag("Item.Tick").visible = true;
          }
          
        }).catch(err=>{
          console.log(`there was an error while setting the resolution.`);
        });
      }
      else {
        console.log("else block");
        this.appApi.setSoundMode(this._item)
        .then(result => {
          console.log(result);
          if(result.success === true){
            self.fireAncestors("$resetPrevTickObject",self);
            self.tag("Item.Tick").visible = true;
           // this.tag('HdmiAudioOutputStereo.Title').text.text = 'HdmiAudioOutputStereo: ' + soundMode
          }
          //this.tag('HdmiAudioOutputStereo.Title').text.text = 'HdmiAudioOutputStereo: ' + result.soundMode
          this.fireAncestors("$updateSoundMode", this._item);
        })
        .catch(err => {
          console.log('Some error while setting the sound mode ',err);
        });
      }
    }

    set item(item) {
      console.log(`!! set comes first !!`);
      this._item = item;
      var self = this;
      console.log(`setting a video element and it ${self.isTicked}ly ticked`);
      this.tag('Item').patch({
          Tick: {
              x: 10,
              y: 45,
              mountY: 0.5,
              texture: lng$1.Tools.getSvgTexture(img$5, 32.5, 32.5),
              color: 0xffffffff,
              visible : self.isTicked ? true : false //implement the logic to show the tick
          },
          Left: {
              x: 50, 
              y: 45,
              mountY: 0.5,
              text: { text: item, fontSize: 25, textColor: 0xffFFFFFF, fontFace: CONFIG.language.font, }, // update the text
          },
      });

    }

    _focus() {
      this.tag('TopLine').color = CONFIG.theme.hex;
      this.tag('BottomLine').color = CONFIG.theme.hex;
      this.patch({
        zIndex:2
      });
      this.tag('TopLine').h = 6;
      this.tag('BottomLine').h = 6;
    }

    _unfocus() {
      this.tag('TopLine').color = 0xFFFFFFFF;
      this.tag('BottomLine').color = 0xFFFFFFFF;
      this.patch({
        zIndex:1
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
              ResolutionScreenContents: {
                  List: {
                      type: lng$1.components.ListComponent,
                      w: 1920 - 300,
                      itemSize: 90,
                      horizontal: false,
                      invertDirection: true,
                      roll: true,
                      rollMax: 900,
                      itemScrollOffset: -6,
                  },
              }
          }
      }


      _init() {
          console.log("Resolution screens init was called");
          var options = [];
          this.appApi = new AppApi();

          this.appApi.getResolution().then(resolution => {
              // self.fireAncestors("$updateResolutionText",resolution);
              //#############  settings the resolution items  ################
              //------------------------------------------------------------------------------

              this.appApi.getSupportedResolutions().then(res => {
                  this._setState("Options");
                  options = [...res];
                  this.tag('ResolutionScreenContents').h = options.length * 90;
                  this.tag('ResolutionScreenContents.List').h = options.length * 90;
                  this.tag('List').items = options.map((item, index) => {
                      console.log(` ------- condition = ${resolution} === ${item} --------------- `);
                      return {
                          ref: 'Option' + index,
                          w: 1920 - 300,
                          h: 90,
                          type: VideoAndAudioItem,
                          isTicked: (resolution === item) ? true : false,
                          item: item,
                          videoElement: true,


                      }
                  });
                  console.log(`
                    
                    Tanjirou's log - the supported resolutions are ${res}
                    
                    `);
              }).catch(err => {
                  console.log(`
                    
                    Tanjirou's log - error while fetching the supported resolution ${err}
                    
                    `);
              });

              //------------------------------------------------------------------------------
          }).catch(ex => { });




      }

      $resetPrevTickObject(prevTicObject) {

          if (!this.prevTicOb) {
              this.prevTicOb = prevTicObject;
              console.log(`prevTicOb = ${this.prevTicOb}`);
          }
          else {
              this.prevTicOb.tag("Item.Tick").visible = false;
              console.log(`tried to reset the prev tickect object ie.${this.prevTicOb}`);
              this.prevTicOb = prevTicObject;
              console.log(`prevTicOb was reset to ${this.prevTicOb}`);
          }
      }

      static _states() {
          return [
              class Options extends this{
                  _getFocused() {
                      return this.tag('List').element
                  }
                  _handleDown() {
                      this.tag('List').setNext();
                  }
                  _handleUp() {
                      this.tag('List').setPrevious();
                  }
                  _handleEnter() {
                      // this.tag("List").element.patch({ "Item.Tick.visible": true });
                      this.tag("List").element.tag("Tick").visible = true;
                      // enable the tick mark in VideoAudioItem.js
                      //to update the resolution value on Video Screen
                  }
              }
          ]
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
                text: 'Resolution: ',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25,
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/Arrow.png'),
            },
          },
          HDR: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'High Dynamic Range: Auto',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25,
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/Arrow.png'),
            },
          },
          MatchContent: {
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
                fontSize: 25,
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/Arrow.png'),
            },
          },
          OutputFormat: {
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
                fontSize: 25,
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/Arrow.png'),
            },
          },
          Chroma: {
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
                fontSize: 25,
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/Arrow.png'),
            },
          },
          HDCP: {
            y: 450,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'HDCP Status: Supported',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25,
              }
            },
          },
        },

        ResolutionScreen: {
          type: ResolutionScreen,
          visible: false,
        }
      }
    }

    _init() {
      new AppApi().getResolution().then(resolution => {
        this.tag("Resolution.Title").text.text = 'Resolution: ' + resolution;
        this.tag("Resolution.Title").patch({ visible: false });
        setTimeout(() => {
          this.tag("Resolution.Title").patch({ visible: true });
        }, 1500);

        console.log(`xxxx the patch is done`);
      }).catch(err => {
        console.log("Error fetching the Resolution");
        this.tag("Resolution.Title").text.text = "Error fetching Resolution";
      });



    }

    _focus() {
      this._setState('Resolution');
    }

    hide() {
      this.tag('VideoScreenContents').visible = false;
    }
    show() {
      this.tag('VideoScreenContents').visible = true;
    }

    static _states() {
      return [
        class Resolution extends this{
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
            this._setState('ResolutionScreen');
          }

        },
        class HDR extends this{
          $enter() {
            this.tag('HDR')._focus();
          }
          $exit() {
            this.tag('HDR')._unfocus();
          }
          _handleUp() {
            this._setState('Resolution');
          }
          _handleDown() {
            this._setState('MatchContent');
          }
          _handleEnter() {
            //
          }
        },
        class MatchContent extends this{
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
          _handleEnter() {
            //
          }
        },
        class OutputFormat extends this{
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
          _handleEnter() {
            //
          }
        },
        class Chroma extends this{
          $enter() {
            this.tag('Chroma')._focus();
          }
          $exit() {
            this.tag('Chroma')._unfocus();
          }
          _handleUp() {
            this._setState('OutputFormat');
          }
          _handleDown() {
            this._setState('HDCP');
          }
          _handleEnter() {
            //
          }
        },
        class HDCP extends this{
          $enter() {
            this.tag('HDCP')._focus();
          }
          $exit() {
            this.tag('HDCP')._unfocus();
          }
          _handleUp() {
            this._setState('Chroma');
          }
          _handleEnter() {
            //
          }
        },
        class ResolutionScreen extends this {
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
            return this.tag('ResolutionScreen')
          }
          _handleBack() {
            this._setState('Resolution');
          }
          $updateResolution(value) {
            this.tag('Resolution.Title').text.text = 'Resolution: ' + value;
          }
        }
      ]

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
  var appApi$2 = new AppApi();
  class HdmiOutputScreen extends lng$1.Component {
      static _template() {
          return {
              x: 0,
              y: 0,
              HdmiOutputScreenContents: {
                  List: {
                      type: lng$1.components.ListComponent,
                      w: 1920 - 300,
                      itemSize: 90,
                      horizontal: false,
                      invertDirection: true,
                      roll: true,
                  },
              }
          }
      }

      $resetPrevTickObject(prevTicObject) {
          if (!this.prevTicOb) {
              this.prevTicOb = prevTicObject;
              console.log(`prevTicOb = ${this.prevTicOb}`);
          }
          else {
              this.prevTicOb.tag("Item.Tick").visible = false;
              console.log(`tried to reset the prev tickect object ie.${this.prevTicOb}`);
              this.prevTicOb = prevTicObject;
              console.log(`prevTicOb was reset to ${this.prevTicOb}`);
          }
      }


      _init() {
          var self = this;
          var tappApi = appApi$2;
          var options = [];

          appApi$2.getSoundMode()
              .then(result => {
                  // updating on the audio screen
                  self.fireAncestors("$updateTheDefaultAudio", result.soundMode);

                  // ###############  setting the audio items  ###############
                  tappApi.getSupportedAudioModes()
                      .then(res => {
                          console.log(res);
                          options = [...res.supportedAudioModes];
                          this.tag('HdmiOutputScreenContents').h = options.length * 90;
                          this.tag('HdmiOutputScreenContents.List').h = options.length * 90;
                          this.tag('List').items = options.map((item, index) => {
                              return {
                                  ref: 'Option' + index,
                                  w: 1920 - 300,
                                  h: 90,
                                  type: VideoAndAudioItem,
                                  isTicked: (result.soundMode===item)?true:false,
                                  item: item,
                                  videoElement: false
                              }
                          });

                      })
                      .catch(err => {
                          console.log('Some error');
                      });
                       this._setState("Options");
                      //--------------------------------------------------------

              })
              .catch(err => {
                  console.log('Some error');
              });


          //options = ['Stereo', 'Auto Detect (Dolby Digital Plus)', 'Expert Mode'],
      }


      static _states() {
          return [
              class Options extends this{
                  _getFocused() {
                      return this.tag('List').element
                  }
                  _handleDown() {
                      this.tag('List').setNext();
                  }
                  _handleUp() {
                      this.tag('List').setPrevious();
                  }
                  _handleEnter() {
                      // enable the tick mark in VideoAudioItem.js
                      // this.fireAncestors('$updateResolution', "current resolution") //to update the resolution value on Video Screen
                  }
              }
          ]
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
  class AudioScreen extends lng$1.Component {
    static _template() {
      return {
        x: 0,
        y: 0,
        Wrapper: {
          AudioOutput: {
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
                fontSize: 25,
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/Arrow.png'),
            },
          },
          OutputMode: {
            y: 90,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Output Mode: Auto',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25,
              },
            },
            Button: {
              h: 45,
              w: 45,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/Arrow.png'),
            },
          },
          DynamicRange: {
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
                fontSize: 25,
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/Arrow.png'),
            },
          },

          AudioLanguage: {
            y: 270,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Audio Language: Auto',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25,
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/Arrow.png'),
            },
          },

          NavigationFeedback: {
            y: 360,
            type: SettingsMainItem,
            Title: {
              x: 10,
              y: 45,
              mountY: 0.5,
              text: {
                text: 'Navigation Feedback',
                textColor: COLORS.titleColor,
                fontFace: CONFIG.language.font,
                fontSize: 25,
              }
            },
            Button: {
              h: 45,
              w: 66,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/ToggleOnWhite.png'),
            },
          },

          Bluetooth: {
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
                fontSize: 25,
              }
            },
            Button: {
              h: 45,
              w: 45,
              x: 1535,
              mountX: 1,
              y: 45,
              mountY: 0.5,
              src: Utils.asset('images/settings/Arrow.png'),
            },
          },
        },
        OutputModeScreen: {
          type: HdmiOutputScreen,
          visible: false,
        }
      }
    }

    _init() {
      //fetch the current HdmiAudioOutputStereo set it
      // this.tag('HdmiAudioOutputStereo.Title').text.text = 'HdmiAudioOutputStereo: ' + currentHdmiAudioOutputStereo

    }

    $updateTheDefaultAudio(audio) {
      console.log(audio);
      this.tag('OutputMode.Title').text.text = 'Output Mode: ' + audio;
    }

    $updateSoundMode(soundMode) {
      this.tag('OutputMode.Title').text.text = 'Output Mode: ' + soundMode;
    }

    _focus() {
      this._setState('AudioOutput');
    }

    hide() {
      this.tag('Wrapper').visible = false;
    }
    show() {
      this.tag('Wrapper').visible = true;
    }

    static _states() {
      return [
        class AudioOutput extends this{
          $enter() {
            this.tag('AudioOutput')._focus();
          }
          $exit() {
            this.tag('AudioOutput')._unfocus();
          }
          _handleDown() {
            this._setState('OutputMode');
          }
          // _handleEnter() {
          //   this._setState('HdmiAudioOutputStereoScreen')
          // }

        },

        class OutputMode extends this{
          $enter() {
            this.tag('OutputMode')._focus();
          }
          $exit() {
            this.tag('OutputMode')._unfocus();
          }
          _handleUp() {
            this._setState('AudioOutput');
          }
          _handleDown() {
            this._setState('DynamicRange');
          }
          _handleEnter() {
            this._setState('HdmiAudioOutputStereoScreen');
          }
        },
        class DynamicRange extends this{
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
            this._setState('NavigationFeedback');
          }
          _handleEnter() {
            //
          }
        },
        class NavigationFeedback extends this{
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
          _handleEnter() {
            //
          }
        },
        class Bluetooth extends this{
          $enter() {
            this.tag('Bluetooth')._focus();
          }
          $exit() {
            this.tag('Bluetooth')._unfocus();
          }
          _handleUp() {
            this._setState('NavigationFeedback');
          }
          _handleEnter() {
            //
          }
        },
        class HdmiAudioOutputStereoScreen extends this {
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
            return this.tag('OutputModeScreen')
          }
          _handleBack() {
            this._setState('OutputMode');
          }
          $updateHdmiAudioOutputStereo(value) {
            this.tag('OutputMode.Title').text.text = 'Output Mode: ' + value;
          }
        }
      ]

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

   class NetworkConfigurationScreen extends lng$1.Component {
      static _template(){
          return {
              x:0,
              y:0,
              NetworkConfigurationScreenContents:{
                  NetworkInterface: {
                      y: 0,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Network Interface: ',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  InternetProtocol: {
                      y: 90,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Internet Protocol: ',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  TestInternetAccess: {
                      y: 180,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Test Internet Access',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  StaticMode: {
                      y: 270,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Static Mode: ',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
              },
              NetworkInterfaceScreen:{
                  // 
              },
          }
      }

      _init(){
          let _currentInterface = ""; //getDefaultInterface
          let _currentIPSettings = {};
          let _newIPSettings = {};
          let _newInterface = "ETHERNET"; //new interface to be set

          console.log('network configuration screen init called');
          this._network = new Network();
          this._network.getInterfaces().then(list => {
              console.log('from network configuration screen ' + JSON.stringify(list));
          });
          this._network.getDefaultInterface().then(interfaceName => {
              console.log('Interface name from network configuration screen: ' + interfaceName );
              _currentInterface = interfaceName;
          });
          this._network.getIPSettings(_currentInterface).then(result => {
              console.log('IP Settings from network configuration screen ' + JSON.stringify(result));
              _currentIPSettings = result;
          }); // we get IP settings of default interface if we pass _currentInterface as ""
          

          _newIPSettings = _currentIPSettings;
          _newIPSettings.ipversion = "IPV6"; // this fails, need to verify how to set proper ip settings


          this._network.setIPSettings(_newIPSettings).then(result => {
              console.log('setIPSettings from network configuration screen ' + JSON.stringify(result)); // result fails
          });

          this._network.setDefaultInterface(_newInterface).then(result => {
              console.log('setDefaultInterface from network configuration screen ' + JSON.stringify(result)); // result fails
          });

          this._network.isConnectedToInternet().then(result => {
              console.log('from network configuration screen isConnectedToInternet: ' + result);
          });
          
      }


      _focus(){
          this._setState('NetworkInterface'); //can be used on init as well
      }

      hide(){
          this.tag('NetworkConfigurationScreenContents').visible = false;
      }

      show(){
          this.tag('NetworkConfigurationScreenContents').visible = true;
      }

      static _states() {
          return [
              class NetworkInterface extends this {
                  $enter(){
                      this.tag('NetworkInterface')._focus();
                  }
                  $exit(){
                      this.tag('NetworkInterface')._unfocus();
                  }
                  _handleDown(){
                      this._setState('InternetProtocol');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class InternetProtocol extends this {
                  $enter(){
                      this.tag('InternetProtocol')._focus();
                  }
                  $exit(){
                      this.tag('InternetProtocol')._unfocus();
                  }
                  _handleUp(){
                      this._setState('NetworkInterface');
                  }
                  _handleDown(){
                      this._setState('TestInternetAccess');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class TestInternetAccess extends this {
                  $enter(){
                      this.tag('TestInternetAccess')._focus();
                  }
                  $exit(){
                      this.tag('TestInternetAccess')._unfocus();
                  }
                  _handleUp(){
                      this._setState('InternetProtocol');
                  }
                  _handleDown(){
                      this._setState('StaticMode');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class StaticMode extends this {
                  $enter(){
                      this.tag('StaticMode')._focus();
                  }
                  $exit(){
                      this.tag('StaticMode')._unfocus();
                  }
                  _handleUp(){
                      this._setState('TestInternetAccess');
                  }
                  _handleEnter(){
                      // 
                  }
              },
          ]
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

   class RemoteControlScreen extends lng$1.Component {
      static _template(){
          return {
              x:0,
              y:0,
              RemoteControlScreenContents:{
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
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
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
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
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
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
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
                              fontSize: 25,
                          }
                      },
                      SignalStrength: {
                          x: 10,
                          y: 45+35,
                          mountY: 0.5,
                          text: {
                              text: 'Signal Strength: ',
                              textColor: COLORS.titleColor,
                              fontFace: CONFIG.language.font,
                              fontSize: 25,
                          }
                      },
                      VoiceCapable: {
                          x: 10,
                          y: 45+35+35,
                          mountY: 0.5,
                          text: {
                              text: 'Voice Capable: ',
                              textColor: COLORS.titleColor,
                              fontFace: CONFIG.language.font,
                              fontSize: 25,
                          }
                      },
                      
                  },
              },
              PairingStatusScreen:{
                  // 
              },
          }
      }


      _focus(){
          this._setState('PairingStatus'); //can be used on init as well
      }

      hide(){
          this.tag('RemoteControlScreenContents').visible = false;
      }

      show(){
          this.tag('RemoteControlScreenContents').visible = true;
      }

      static _states() {
          return [
              class PairingStatus extends this {
                  $enter(){
                      this.tag('PairingStatus')._focus();
                  }
                  $exit(){
                      this.tag('PairingStatus')._unfocus();
                  }
                  _handleDown(){
                      this._setState('FirmwareVersion');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class FirmwareVersion extends this {
                  $enter(){
                      this.tag('FirmwareVersion')._focus();
                  }
                  $exit(){
                      this.tag('FirmwareVersion')._unfocus();
                  }
                  _handleUp(){
                      this._setState('PairingStatus');
                  }
                  _handleDown(){
                      this._setState('TestMicrophone');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class TestMicrophone extends this {
                  $enter(){
                      this.tag('TestMicrophone')._focus();
                  }
                  $exit(){
                      this.tag('TestMicrophone')._unfocus();
                  }
                  _handleUp(){
                      this._setState('FirmwareVersion');
                  }
                  _handleEnter(){
                      // 
                  }
              },
          ]
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
              DeviceInfoContents: {
                  ChipSet: {
                      Title: {
                          x: 10,
                          y: 45,
                          mountY: 0.5,
                          text: {
                              text: `Chipset: XXXX`,
                              textColor: COLORS.titleColor,
                              fontFace: CONFIG.language.font,
                              fontSize: 25,
                          }
                      },
                  },
                  SerialNumber: {
                      Title: {
                          x: 10,
                          y: 45 + 35,
                          mountY: 0.5,
                          text: {
                              text: `Serial Number: XXXX`,
                              textColor: COLORS.titleColor,
                              fontFace: CONFIG.language.font,
                              fontSize: 25,
                          }
                      },
                  },
                  Location: {
                      Title: {
                          x: 10,
                          y: 45 + 35 + 35,
                          mountY: 0.5,
                          text: {
                              text: `Location: XXXX`,
                              textColor: COLORS.titleColor,
                              fontFace: CONFIG.language.font,
                              fontSize: 25,
                          }
                      },
                  },
                  SupportedDRM: {
                      Title: {
                          x: 10,
                          y: 45 + 35 + 35 + 35,
                          mountY: 0.5,
                          text: {
                              text: `Supported DRM & Key-System: XXXX`,
                              textColor: COLORS.titleColor,
                              fontFace: CONFIG.language.font,
                              fontSize: 25,
                          }
                      },
                  },
                  FirmwareVersions: {
                      Title: {
                          x: 10,
                          y: 45 + 35 + 35 + 35 + 35,
                          mountY: 0.5,
                          text: {
                              text: `Firmware version: UI Version, Build Version, Timestamp`,
                              textColor: COLORS.titleColor,
                              fontFace: CONFIG.language.font,
                              fontSize: 25,
                          }
                      },
                  },
                  AppVersions: {
                      Title: {
                          x: 10,
                          y: 45 + 35 + 35 + 35 + 35 + 45,
                          mountY: 0.5,
                          text: {
                              text: 'App Version: 3.1',
                              textColor: COLORS.titleColor,
                              fontFace: CONFIG.language.font,
                              fontSize: 25,
                              fontStyle: 'bold'
                          }
                      },
                  },
              },
          }
      }

      _init(){
          this.appApi = new AppApi();
          this.appApi.systeminfo().then(result => {
              console.log('from advanced settings screen system info: ' + JSON.stringify(result));
              let ram = (result.totalram / 10**9).toFixed(2);
              this.tag('SupportedDRM.Title').text.text = `Supported DRM & Key-System: ${ram} GB`;
              this.tag('SerialNumber.Title').text.text = `Serial Number: ${result.serialnumber}`;
          });
          this.appApi.getLocation().then(result => {
              console.log('from advanced settings screen get location: ' + JSON.stringify(result));
              this.tag('Location.Title').text.text = `Location: ${result.city.length !== 0 ? result.city +", "+result.country : "NA" }`;
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
    * Class for Video and Audio screen.
    */

   class AdvancedSettingsScreen extends lng$1.Component {
      static _template(){
          return { 
              x:0,
              y:0,
              AdvanceScreenContents:{   
                  UIVoice: {
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                      text: 'UI Voice',
                      textColor: COLORS.titleColor,
                      fontFace: CONFIG.language.font,
                      fontSize: 25,
                      }
                      },
                      Button: {
                      h: 30 *1.5,
                      w: 30 *1.5,
                      x: 1535,
                      mountX:1,
                      y: 45,
                      mountY:0.5,
                      src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  TTSOptions: {
                      y: 0+90,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'TTS Options',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                      h: 30 * 1.5,
                      w: 30 * 1.5,
                      x: 1535,
                      mountX: 1,
                      y: 45,
                      mountY: 0.5,
                      src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  CECControl: {
                      y: 0+90+90,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'CEC Control',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                      h: 30 * 1.5,
                      w: 30 * 1.5,
                      x: 1535,
                      mountX: 1,
                      y: 45,
                      mountY: 0.5,
                      src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  Bug: {
                      y: 0+90+90+90 ,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'Bug Report',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                      h: 30 * 1.5,
                      w: 30 * 1.5,
                      x: 1535,
                      mountX: 1,
                      y: 45,
                      mountY: 0.5,
                      src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  Contact: {
                      y: 0+90+90+90+90 ,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'Contact Support',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                      h: 30 * 1.5,
                      w: 30 * 1.5,
                      x: 1535,
                      mountX: 1,
                      y: 45,
                      mountY: 0.5,
                      src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  Sync: {
                      y: 0+90+90+90+90+90 ,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'Synchronize Location',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                      h: 30 * 1.5,
                      w: 30 * 1.5,
                      x: 1535,
                      mountX: 1,
                      y: 45,
                      mountY: 0.5,
                      src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  Firmware: {
                      y: 0+90+90+90+90+90+90 ,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'Check for Firmware Update',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                      h: 30 * 1.5,
                      w: 30 * 1.5,
                      x: 1535,
                      mountX: 1,
                      y: 45,
                      mountY: 0.5,
                      src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  DeviceInfo: {
                      y: 0+90+90+90+90+90+90+90 ,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'Device Info',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                      h: 30 * 1.5,
                      w: 30 * 1.5,
                      x: 1535,
                      mountX: 1,
                      y: 45,
                      mountY: 0.5,
                      src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  Reboot: {
                      y: 0+90+90+90+90+90+90+90+90 ,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'Reboot',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                      h: 30 * 1.5,
                      w: 30 * 1.5,
                      x: 1535,
                      mountX: 1,
                      y: 45,
                      mountY: 0.5,
                      src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  Reset: {
                      y: 0+90+90+90+90+90+90+90+90+90 ,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'Factory Reset',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                      h: 30 * 1.5,
                      w: 30 * 1.5,
                      x: 1535,
                      mountX: 1,
                      y: 45,
                      mountY: 0.5,
                      src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
              },

              DeviceInformationScreen: {
                  type: DeviceInformationScreen,
                  visible: false,
              },

          }

      }

      _init(){
          this.appApi = new AppApi();
          this.appApi.syncLocation().then(result => {
              console.log('from advanced settings screen syncLocation: ' + JSON.stringify(result));
          });
          this.appApi.speak().then(result => {
              console.log('from advanced settings screen speak: ' + JSON.stringify(result));
          });
          this.appApi.getlistVoices().then(result => {
              console.log('from advanced settings screen getlistVoices: ' + JSON.stringify(result));
          });
          this.appApi.getFirmwareUpdateInfo().then(result => {
              console.log('from advanced settings screen getFirmwareUpdateInfo: ' + JSON.stringify(result));
          });
          this.appApi.getFirmwareUpdateState().then(result => {
              console.log('from advanced settings screen getFirmwareUpdateState: ' + JSON.stringify(result));
          });
      }

      _focus(){
          this._setState('UIVoice');
      }

      hide(){
          this.tag('AdvanceScreenContents').visible = false;
      }

      show(){
          this.tag('AdvanceScreenContents').visible = true;
      }

      static _states(){
          return [
              class UIVoice extends this{
                  $enter(){
                      this.tag('UIVoice')._focus();
                  }
                  $exit(){
                      this.tag('UIVoice')._unfocus();
                  }
                  _handleUp(){
                      this._setState('Reset');
                  }
                  _handleDown(){
                      this._setState('TTSOptions');
                  }
                  _handleEnter(){
                      
                  }
              },
              class TTSOptions extends this{
                  $enter(){
                      this.tag('TTSOptions')._focus();
                  }
                  $exit(){
                      this.tag('TTSOptions')._unfocus();
                  }
                  _handleUp(){
                      this._setState('UIVoice');
                  }
                  _handleDown(){
                      this._setState('CECControl');
                  }
                  _handleEnter(){
                      
                  }
              },
              class CECControl extends this{
                  $enter(){
                      this.tag('CECControl')._focus();
                  }
                  $exit(){
                      this.tag('CECControl')._unfocus();
                  }
                  _handleUp(){
                      this._setState('TTSOptions');
                  }
                  _handleDown(){
                      this._setState('Bug');
                  }
                  _handleEnter(){
                      
                  }
              },
              class Bug extends this{
                  $enter(){
                      this.tag('Bug')._focus();
                  }
                  $exit(){
                      this.tag('Bug')._unfocus();
                  }
                  _handleUp(){
                      this._setState('CECControl');
                  }
                  _handleDown(){
                      this._setState('Contact');
                  }
                  _handleEnter(){
                      
                  }
              },
              class Contact extends this{
                  $enter(){
                      this.tag('Contact')._focus();
                  }
                  $exit(){
                      this.tag('Contact')._unfocus();
                  }
                  _handleUp(){
                      this._setState('Bug');
                  }
                  _handleDown(){
                      this._setState('Sync');
                  }
                  _handleEnter(){
                      
                  }
              },
              class Sync extends this{
                  $enter(){
                      this.tag('Sync')._focus();
                  }
                  $exit(){
                      this.tag('Sync')._unfocus();
                  }
                  _handleUp(){
                      this._setState('Contact');
                  }
                  _handleDown(){
                      this._setState('Firmware');
                  }
                  _handleEnter(){
                      
                  }
              },
              class Firmware extends this{
                  $enter(){
                      this.tag('Firmware')._focus();
                  }
                  $exit(){
                      this.tag('Firmware')._unfocus();
                  }
                  _handleUp(){
                      this._setState('Sync');
                  }
                  _handleDown(){
                      this._setState('DeviceInfo');
                  }
                  _handleEnter(){
                      
                  }
              },
              class DeviceInfo extends this{
                  $enter(){
                      this.tag('DeviceInfo')._focus();
                  }
                  $exit(){
                      this.tag('DeviceInfo')._unfocus();
                  }
                  _handleUp(){
                      this._setState('Firmware');
                  }
                  _handleDown(){
                      this._setState('Reboot');
                  }
                  _handleEnter(){
                      this._setState('DeviceInformationScreen');
                      this.hide();
                  }
              },
              class Reboot extends this{
                  $enter(){
                      this.tag('Reboot')._focus();
                  }
                  $exit(){
                      this.tag('Reboot')._unfocus();
                  }
                  _handleUp(){
                      this._setState('DeviceInfo');
                  }
                  _handleDown(){
                      this._setState('Reset');
                  }
                  _handleEnter(){
                      this.appApi.reboot().then(result => {
                          console.log('from advanced settings screen reboot: ' + JSON.stringify(result));
                      }); 
                  }
              },
              class Reset extends this{
                  $enter(){
                      this.tag('Reset')._focus();
                  }
                  $exit(){
                      this.tag('Reset')._unfocus();
                  }
                  _handleUp(){
                      this._setState('Reboot');
                  }
                  _handleDown(){
                      this._setState('UIVoice');
                  }
                  _handleEnter(){
                      
                  }
              },


              //Inner Screens Classes
              class DeviceInformationScreen extends this {
                  $enter() {
                    this.tag('DeviceInformationScreen').visible = true;
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings / Device Info');
                  }
                  _getFocused() {
                    return this.tag('DeviceInformationScreen')
                  }
                  $exit() {
                    this.tag('DeviceInformationScreen').visible = false;
                    this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings');
                  }
                  _handleBack() {
                    this._setState('DeviceInfo');
                    this.show();
                  }
                },
          ]
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

   class PrivacyScreen extends lng$1.Component {
      static _template(){
          return {
              x:0,
              y:0,
              PrivacyScreenContents:{
                  LocalDeviceDiscovery: {
                          y: 0,
                          type: SettingsMainItem,
                          Title: {
                          x: 10,
                          y: 45,
                          mountY: 0.5,
                          text: {
                              text: 'Local Device Discovery',
                              textColor: COLORS.titleColor,
                              fontFace: CONFIG.language.font,
                              fontSize: 25,
                          }
                      },
                      Button: {
                          h: 30 *1.5,
                          w: 44.6 *1.5,
                          x: 1535,
                          mountX:1,
                          y: 45,
                          mountY:0.5,
                          src: Utils.asset('images/settings/ToggleOffWhite.png'),
                      },
                  },
                  UsbMediaDevices: {
                      y: 90,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'USB Media Devices',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                          h: 30 *1.5,
                          w: 44.6 *1.5,
                          x: 1535,
                          mountX:1,
                          y: 45,
                          mountY:0.5,
                          src: Utils.asset('images/settings/ToggleOffWhite.png'),
                      },
                  },
                  AudioInput: {
                      y: 180,
                      type: SettingsMainItem,
                      Title: {
                      x: 10,
                      y: 45,
                      mountY: 0.5,
                      text: {
                          text: 'Audio Input',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                      }
                      },
                      Button: {
                          h: 30 *1.5,
                          w: 44.6 *1.5,
                          x: 1535,
                          mountX:1,
                          y: 45,
                          mountY:0.5,
                          src: Utils.asset('images/settings/ToggleOffWhite.png'),
                      },
                  },
                  ClearCookies: {
                      y: 270,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Clear Cookies and App Data',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  PrivacyPolicy: {
                      y: 360,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Privacy Policy and License',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  

              },
              
          }
      }


      _focus(){
          this._setState('LocalDeviceDiscovery'); //can be used on init as well
      }

      hide(){
          this.tag('PrivacyScreenContents').visible = false;
      }

      show(){
          this.tag('PrivacyScreenContents').visible = true;
      }

      static _states() {
          return [
              class LocalDeviceDiscovery extends this {
                  $enter(){
                      this.tag('LocalDeviceDiscovery')._focus();
                  }
                  $exit(){
                      this.tag('LocalDeviceDiscovery')._unfocus();
                  }
                  _handleDown(){
                      this._setState('UsbMediaDevices');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class UsbMediaDevices extends this {
                  $enter(){
                      this.tag('UsbMediaDevices')._focus();
                  }
                  $exit(){
                      this.tag('UsbMediaDevices')._unfocus();
                  }
                  _handleUp(){
                      this._setState('LocalDeviceDiscovery');
                  }
                  _handleDown(){
                      this._setState('AudioInput');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class AudioInput extends this {
                  $enter(){
                      this.tag('AudioInput')._focus();
                  }
                  $exit(){
                      this.tag('AudioInput')._unfocus();
                  }
                  _handleUp(){
                      this._setState('UsbMediaDevices');
                  }
                  _handleDown(){
                      this._setState('ClearCookies');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class ClearCookies extends this {
                  $enter(){
                      this.tag('ClearCookies')._focus();
                  }
                  $exit(){
                      this.tag('ClearCookies')._unfocus();
                  }
                  _handleUp(){
                      this._setState('AudioInput');
                  }
                  _handleDown(){
                      this._setState('PrivacyPolicy');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class PrivacyPolicy extends this {
                  $enter(){
                      this.tag('PrivacyPolicy')._focus();
                  }
                  $exit(){
                      this.tag('PrivacyPolicy')._unfocus();
                  }
                  _handleUp(){
                      this._setState('ClearCookies');
                  }
                  _handleEnter(){
                      // 
                  }
              },
          ]
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
      static _template(){
          return {
              x:0,
              y:0,
              OtherSettingsScreenContents: {
                  NetworkConfiguration: {
                      y: 0,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Network Configuration',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                    },
                  RemoteControl: {
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
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                    },
                  ScreenSaver: {
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
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                    },
                  EnergySaver: {
                      y: 270,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Energy Saver: ',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                    },
                  Theme: {
                      y: 360,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'UI Theme: ',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  Language: {
                      y: 450,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Language: ',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  Privacy: {
                      y: 540,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Privacy',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
                  AdvancedSettings: {
                      y: 630,
                      type: SettingsMainItem,
                      Title: {
                        x: 10,
                        y: 45,
                        mountY: 0.5,
                        text: {
                          text: 'Advanced Settings',
                          textColor: COLORS.titleColor,
                          fontFace: CONFIG.language.font,
                          fontSize: 25,
                        }
                      },
                      Button: {
                        h: 45,
                        w: 45,
                        x: 1535,
                        mountX: 1,
                        y: 45,
                        mountY: 0.5,
                        src: Utils.asset('images/settings/Arrow.png'),
                      },
                  },
              },
              NetworkConfigurationScreen:{
                  type: NetworkConfigurationScreen,
                  visible:false,
              },
              RemoteControlScreen:{
                  type: RemoteControlScreen,
                  visible:false,
              },

              // 

              PrivacyScreen:{
                  type: PrivacyScreen,
                  visible:false,
              },
              AdvancedSettingsScreen: {
                  type: AdvancedSettingsScreen,
                  visible: false,
              },
          }
      }

      _focus(){
          this._setState('NetworkConfiguration'); //can be used on init as well
      }

      hide(){
          this.tag('OtherSettingsScreenContents').visible = false;
      }

      show(){
          this.tag('OtherSettingsScreenContents').visible = true;
      }

      static _states() {
          return [
              class NetworkConfiguration extends this {
                  $enter(){
                      this.tag('NetworkConfiguration')._focus();
                  }
                  $exit(){
                      this.tag('NetworkConfiguration')._unfocus();
                  }
                  _handleUp(){
                      this._setState('AdvancedSettings');
                  }
                  _handleDown(){
                      this._setState('RemoteControl');
                  }
                  _handleEnter(){
                      this._setState('NetworkConfigurationScreen');
                  }
              },
              class RemoteControl extends this {
                  $enter(){
                      this.tag('RemoteControl')._focus();
                  }
                  $exit(){
                      this.tag('RemoteControl')._unfocus();
                  }
                  _handleUp(){
                      this._setState('NetworkConfiguration');
                  }
                  _handleDown(){
                      this._setState('ScreenSaver');
                  }
                  _handleEnter(){
                      this._setState('RemoteControlScreen');
                  }
              },
              class ScreenSaver extends this {
                  $enter(){
                      this.tag('ScreenSaver')._focus();
                  }
                  $exit(){
                      this.tag('ScreenSaver')._unfocus();
                  }
                  _handleUp(){
                      this._setState('RemoteControl');
                  }
                  _handleDown(){
                      this._setState('EnergySaver');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class EnergySaver extends this {
                  $enter(){
                      this.tag('EnergySaver')._focus();
                  }
                  $exit(){
                      this.tag('EnergySaver')._unfocus();
                  }
                  _handleUp(){
                      this._setState('ScreenSaver');
                  }
                  _handleDown(){
                      this._setState('Theme');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class Theme extends this {
                  $enter(){
                      this.tag('Theme')._focus();
                  }
                  $exit(){
                      this.tag('Theme')._unfocus();
                  }
                  _handleUp(){
                      this._setState('EnergySaver');
                  }
                  _handleDown(){
                      this._setState('Language');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class Language extends this {
                  $enter(){
                      this.tag('Language')._focus();
                  }
                  $exit(){
                      this.tag('Language')._unfocus();
                  }
                  _handleUp(){
                      this._setState('Theme');
                  }
                  _handleDown(){
                      this._setState('Privacy');
                  }
                  _handleEnter(){
                      // 
                  }
              },
              class Privacy extends this {
                  $enter(){
                      this.tag('Privacy')._focus();
                  }
                  $exit(){
                      this.tag('Privacy')._unfocus();
                  }
                  _handleUp(){
                      this._setState('Language');
                  }
                  _handleDown(){
                      this._setState('AdvancedSettings');
                  }
                  _handleEnter(){
                      this._setState('PrivacyScreen'); 
                  }
              },
              class AdvancedSettings extends this {
                  $enter(){
                      this.tag('AdvancedSettings')._focus();
                  }
                  $exit(){
                      this.tag('AdvancedSettings')._unfocus();
                  }
                  _handleUp(){
                      this._setState('Privacy');
                  }
                  _handleDown(){
                      this._setState('NetworkConfiguration');
                  }
                  _handleEnter(){
                      this._setState('AdvancedSettingsScreen'); 
                  }
              },
              class NetworkConfigurationScreen extends this {
                  $enter(){
                      this.hide();
                      this.tag('NetworkConfigurationScreen').visible = true;
                      this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Network Configuration');
                  }
                  $exit(){
                      this.show();
                      this.tag('NetworkConfigurationScreen').visible = false;
                      this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
                  }
                  _getFocused() {
                      return this.tag('NetworkConfigurationScreen')
                    }
                  _handleBack() {
                      this._setState('NetworkConfiguration');
                  }
              },
              class RemoteControlScreen extends this {
                  $enter(){
                      this.hide();
                      this.tag('RemoteControlScreen').visible = true;
                      this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Remote Control');
                  }
                  $exit(){
                      this.show();
                      this.tag('RemoteControlScreen').visible = false;
                      this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
                  }
                  _getFocused() {
                      return this.tag('RemoteControlScreen')
                    }
                  _handleBack() {
                      this._setState('RemoteControl');
                  }
              },


              // 
              

              class PrivacyScreen extends this {
                  $enter(){
                      this.hide();
                      this.tag('PrivacyScreen').visible = true;
                      this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Privacy');
                  }
                  $exit(){
                      this.show();
                      this.tag('PrivacyScreen').visible = false;
                      this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
                  }
                  _getFocused() {
                      return this.tag('PrivacyScreen')
                    }
                  _handleBack() {
                      this._setState('Privacy');
                  }
              },

              class AdvancedSettingsScreen extends this {
                  $enter(){
                      this.hide();
                      this.tag('AdvancedSettingsScreen').visible = true;
                      this.fireAncestors('$changeHomeText', 'Settings / Other Settings / Advanced Settings');
                  }
                  $exit(){
                      this.show();
                      this.tag('AdvancedSettingsScreen').visible = false;
                      this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
                  }
                  _getFocused() {
                      return this.tag('AdvancedSettingsScreen')
                    }
                  _handleBack() {
                      this._setState('AdvancedSettings');
                  }
              },
          ]
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

  class SettingsScreen extends lng$1.Component {
    static _template() {
      return {
        x: 280,
        y: 286,
        SleepTimer: {
          y: 0,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Sleep Timer: Off',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        WiFi: {
          y: 90,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'WiFi',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        Bluetooth: {
          y: 180,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Bluetooth',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        Video: {
          y: 270,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Video',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        Audio: {
          y: 360,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Audio',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        OtherSettings: {
          y: 450,
          type: SettingsMainItem,
          Title: {
            x: 10,
            y: 45,
            mountY: 0.5,
            text: {
              text: 'Other Settings',
              textColor: COLORS.titleColor,
              fontFace: CONFIG.language.font,
              fontSize: 25,
            }
          },
          Button: {
            h: 45,
            w: 45,
            x: 1535,
            mountX: 1,
            y: 45,
            mountY: 0.5,
            src: Utils.asset('images/settings/Arrow.png'),
          },
        },
        WiFiScreen: {
          type: WiFiScreen,
          visible: false,
        },
        BluetoothScreen: {
          type: BluetoothScreen,
          visible: false,
        },
        VideoScreen: {
          type: VideoScreen,
          visible: false,
        },
        AudioScreen: {
          type: AudioScreen,
          visible: false,
        },
        SleepTimerScreen: {
          type: SleepTimerScreen,
          visible: false
        },
        OtherSettingsScreen: {
          type: OtherSettingsScreen,
          visible: false,
        }

      }
    }

    _init() {
      this._setState('SleepTimer');
    }

    hide() {
      this.tag('WiFi').patch({ alpha: 0 });
      this.tag('Bluetooth').patch({ alpha: 0 });
      this.tag('Video').patch({ alpha: 0 });
      this.tag('Audio').patch({ alpha: 0 });
      this.tag('SleepTimer').patch({ alpha: 0 });
      this.tag('OtherSettings').patch({ alpha: 0 });
    }

    show() {
      this.tag('WiFi').patch({ alpha: 1 });
      this.tag('Bluetooth').patch({ alpha: 1 });
      this.tag('Audio').patch({ alpha: 1 });
      this.tag('Video').patch({ alpha: 1 });
      this.tag('SleepTimer').patch({ alpha: 1 });
      this.tag('OtherSettings').patch({ alpha: 1 });
    }

    home() {
      this.fireAncestors('$changeHomeText', Language.translate('home'));
      this.fireAncestors('$goToSidePanel', 0);
    }

    $sleepTimerText(text) {
      this.tag('SleepTimer.Title').text.text = 'Sleep Timer: ' + text;
    }

    static _states() {
      return [
        class SleepTimer extends this{
          $enter() {
            this.tag('SleepTimer')._focus();
          }
          $exit() {
            this.tag('SleepTimer')._unfocus();
          }
          _handleDown() {
            this._setState('WiFi');
          }
          _handleEnter() {
            this._setState('SleepTimerScreen');
            this.hide();
          }
          _handleBack() {
            this.home();
          }
        },
        class WiFi extends this {
          $enter() {
            this.tag('WiFi')._focus();
          }
          $exit() {
            console.log('Botton exit');
            this.tag('WiFi')._unfocus();
          }
          _handleUp() {
            this._setState('SleepTimer');
          }
          _handleDown() {
            this._setState('Bluetooth');
          }
          _handleEnter() {
            this._setState('WiFiScreen');
            this.hide();
          }
          _handleBack() {
            this.home();
          }
        },
        class Bluetooth extends this {
          $enter() {
            console.log('Button enter');
            this.tag('Bluetooth')._focus();
          }
          $exit() {
            console.log('Botton exit');
            this.tag('Bluetooth')._unfocus();
          }
          _handleUp() {
            this._setState('WiFi');
          }
          _handleDown() {
            this._setState('Video');
          }
          _handleLeft() {
          }
          _handleEnter() {
            this._setState('BluetoothScreen');
            this.hide();
          }
          _handleBack() {
            this.home();
          }
        },

        class Video extends this{
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
            this.hide();
          }
          _handleBack() {
            this.home();
          }

        },

        class Audio extends this{
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
            this.hide();
          }
          _handleDown() {
            this._setState('OtherSettings');
          }
          _handleBack() {
            this.home();
          }

        },

        class OtherSettings extends this{
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
            this.hide();
          }
          _handleBack() {
            this.home();
          }

        },

        class SleepTimerScreen extends this{
          $enter() {
            this.tag('SleepTimerScreen').visible = true;
            this.fireAncestors('$changeHomeText', 'Settings / Sleep Timer');
          }
          _getFocused() {
            return this.tag('SleepTimerScreen')
          }
          $exit() {
            this.tag('SleepTimerScreen').visible = false;
            this.fireAncestors('$changeHomeText', 'Settings');
          }
          _handleBack() {
            this._setState('SleepTimer');
            this.show();
          }
        },
        class BluetoothScreen extends this {
          $enter() {
            this.tag('BluetoothScreen').visible = true;
            this.fireAncestors('$changeHomeText', 'Settings / Bluetooth');
          }
          _getFocused() {
            return this.tag('BluetoothScreen')
          }
          $exit() {
            this.tag('BluetoothScreen').visible = false;
            this.fireAncestors('$changeHomeText', 'Settings');
          }
          _handleBack() {
            this._setState('Bluetooth');
            this.show();
          }
        },
        class WiFiScreen extends this {
          $enter() {
            this.tag('WiFiScreen').visible = true;
            this.fireAncestors('$changeHomeText', 'Settings / WiFi');
          }
          _getFocused() {
            return this.tag('WiFiScreen')
          }
          $exit() {
            this.tag('WiFiScreen').visible = false;
            this.fireAncestors('$changeHomeText', 'Settings');
          }
          _handleBack() {
            this._setState('WiFi');
            this.show();
          }
        },

        class VideoScreen extends this {
          $enter() {
            this.tag('VideoScreen').visible = true;
            this.fireAncestors('$changeHomeText', 'Settings / Video');
          }
          _getFocused() {
            return this.tag('VideoScreen')
          }
          $exit() {
            this.tag('VideoScreen').visible = false;
            this.fireAncestors('$changeHomeText', 'Settings');
          }
          _handleBack() {
            this._setState('Video');
            this.show();
          }
        },

        class AudioScreen extends this {
          $enter() {
            this.tag('AudioScreen').visible = true;
            this.fireAncestors('$changeHomeText', 'Settings / Audio');
          }
          _getFocused() {
            return this.tag('AudioScreen')
          }
          $exit() {
            this.tag('AudioScreen').visible = false;
            this.fireAncestors('$changeHomeText', 'Settings');
          }
          _handleBack() {
            this._setState('Audio');
            this.show();
          }
        },
        class OtherSettingsScreen extends this {
          $enter() {
            this.tag('OtherSettingsScreen').visible = true;
            this.fireAncestors('$changeHomeText', 'Settings / Other Settings');
          }
          _getFocused() {
            return this.tag('OtherSettingsScreen')
          }
          $exit() {
            this.tag('OtherSettingsScreen').visible = false;
            this.fireAncestors('$changeHomeText', 'Settings');
          }
          _handleBack() {
            this._setState('OtherSettings');
            this.show();
          }
        },
      ]
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
          },
        },
        OperatorLogo: {},
        Shadow: {
          alpha: 0,
          zIndex: 2,
          x: -25,
          y: -25,
          color: 0x66000000,
          texture: lng.Tools.getShadowRect(350, 180, 10, 10, 20),
        }
      }
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
          src: Utils.asset(this._item.url),
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

  /** Class for top panel in home UI */
  class ShutdownPanel extends lng$1.Component {
    static _template() {
      return {
        Bg: {
          rect: true,
          x: 660 * -1,
          y: 385 * -1,
          w: 1920,
          h: 1080,
          color: 0x33000000,
        },
        Border: {
          rect: true,
          w: 610,
          h: 310,
          color: 0xFF000000,
          alpha: 0.5,
          shader: { type: lng$1.shaders.RoundedRectangle, radius: 19 }
        },
        Box: {
          rect: true,
          w: 600,
          h: 300,
          color: 0xFF000055,
          shader: { type: lng$1.shaders.RoundedRectangle, radius: 19 }
        },
        LightSleepbtn: {
          rect: true,
          x: 150,
          y: 60,
          w: 300,
          h: 80,
          color: 0xFF0000000,
          shader: { type: lng$1.shaders.RoundedRectangle, radius: 19 },
          Txt: {
            x: 60,
            y: 15,
            text: { text: 'Light Sleep', fontSize: 33, fontFace: 'MS-Regular' }
          }
        },
        DeepSleepbtn: {
          rect: true,
          x: 150,
          y: 170,
          w: 300,
          h: 80,
          color: 0xFF0000000,
          shader: { type: lng$1.shaders.RoundedRectangle, radius: 19 },
          Txt: {
            x: 60,
            y: 15,
            text: { text: 'Deep Sleep', fontSize: 33, fontFace: 'MS-Regular' }
          }
        },
      }
    }



    _init() {
      console.log("Shutdown panel init..");
      this.tag('LightSleepbtn').color = '0Xff0000AA';
      this.power_state = 'LightSleepbtn';

    }

    _handleEnter() {
      console.log(" current focus :" + this.power_state);
      if (this.power_state == 'LightSleepbtn') {
        this.fireAncestors('$standby', 'STANDBY');
      } else if (this.power_state == 'DeepSleepbtn') {
        this.fireAncestors('$standby', 'DEEP_SLEEP');

      }

    }

    _handleDown() {
      this.tag('DeepSleepbtn').color = '0Xff0000AA';
      this.tag('LightSleepbtn').color = '0xFF0000000';
      this.power_state = 'DeepSleepbtn';

    }

    _handleUp() {
      this.tag('LightSleepbtn').color = '0Xff0000AA';
      this.tag('DeepSleepbtn').color = '0xFF0000000';
      this.power_state = 'LightSleepbtn';
    }

    _handleBack() {
      this.fireAncestors('$standby', 'Back');
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
          y: 15,
        },
        Subtitle: {
          x: 90,
          y: 88.5,
        },
        NetworkLogo: {
          x: 1740,
          y: 82.5,
        },
        TimeBar: {
          x: 90,
          y: 163.5,
          texture: lng$1.Tools.getRoundRect(1740, 6, 6, 0, 0, true, 0x80eef1f3),
        },
        ProgressBar: {
          x: 90,
          y: 163.5,
        },
        CurrentTime: {
          x: 90,
          y: 184.5,
        },
        TotalTime: {
          x: 1680,
          y: 184.5,
        },
        Buttons: {
          x: 820,
          y: 240,
          children: [
            { src: Utils.asset('images/player/rewind.png'), x: 17, y: 17 },
            { src: Utils.asset('images/player/pause-focus.png'), x: 17, y: 17 },
            { src: Utils.asset('images/player/fast-forward.png'), x: 17, y: 17 },
          ].map((item, idx) => ({
            x: idx * 100,
            texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            ControlIcon: {
              x: item.x,
              y: item.y,
              texture: lng$1.Tools.getSvgTexture(item.src, 50, 50),
            },
          })),
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
              textAlign: 'center',
            },
          },
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
              textAlign: 'center',
            },
          },
        },
      }
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
          text: title,
        },
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
          text: subtitle,
        },
      });
    }

    /**
     * Function to set the network logo in the video control menu.
     * @param {String} logoPath path to the logo.
     */
    set logoPath(logoPath) {
      this.tag('NetworkLogo').patch({ src: logoPath });
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
          text: this.SecondsTohhmmss(duration),
        },
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
          text: this.SecondsTohhmmss(currentTime),
        },
      });
      this.tag('ProgressBar').patch({
        texture: lng$1.Tools.getRoundRect(
          (1740 * currentTime) / this.videoDuration,
          6,
          6,
          0,
          0,
          true,
          0xffffffff
        ),
        SeekBar: {
          x: (1740 * currentTime) / this.videoDuration,
          y: -12,
          texture: lng$1.Tools.getRoundRect(30, 30, 15, 0, 0, true, 0xffffffff),
        },
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
      return this.result
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
        this.tag('Buttons')
          .children[1].tag('ControlIcon')
          .patch({
            texture: lng$1.Tools.getSvgTexture(
              Utils.asset('images/player/play-focus.png'),
              50,
              50
            ),
            x: 17,
          });
        this.toggle = 1;
        return
      }
      this.tag('Buttons')
        .children[1].tag('ControlIcon')
        .patch({
          texture: lng$1.Tools.getSvgTexture(
            Utils.asset('images/player/pause-focus.png'),
            50,
            50
          ),
          x: 17,
        });
      this.toggle = 0;
    }

    /**
     * Timer function to track the inactivity of the player controls.
     */
    timer() {
      clearTimeout(timeout);
      timeout = setTimeout(this.hidePlayerControls.bind(this), 5000);
    }

    /**
     * Function that defines the different states of the player controls.
     */
    static _states() {
      return [
        class AudioOptions extends this {
          $enter() {
            this.timer();
            this.tag('Audio').patch({
              texture: lng$1.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xffffffff),
              scale: 1.1,
            });
            this.tag('Audio').tag('AudioOptions').color = 0xff000000;
          }
          $exit() {
            this.tag('Audio').patch({
              texture: lng$1.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xff8e8e8e),
              scale: 1,
            });
            this.tag('Audio').tag('AudioOptions').color = 0xffffffff;
          }
          _handleRight() {
            this._setState('Rewind');
          }
          _getFocused() {
            this.timer();
          }
        },

        class PlayPause extends this {
          $enter() {
            this.focus = this.toggle
              ? Utils.asset('images/player/play-focus.png')
              : Utils.asset('images/player/pause-focus.png');
            this.timer();
            this.tag('Buttons').children[1].patch({
              texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
              scale: 1.1,
            });
            this.tag('Buttons')
              .children[1].tag('ControlIcon')
              .patch({
                texture: lng$1.Tools.getSvgTexture(this.focus, 50, 50)
              });
          }
          $exit() {
            this.unfocus = this.toggle
              ? Utils.asset('images/player/play.png')
              : Utils.asset('images/player/pause.png');
            this.tag('Buttons').children[1].patch({
              texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
              scale: 1,
            });
            this.tag('Buttons')
              .children[1].tag('ControlIcon')
              .patch({
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
            this.focus = this.toggle
              ? Utils.asset('images/player/play-focus.png')
              : Utils.asset('images/player/pause-focus.png');
            this.timer();
            this.tag('Buttons').children[1].patch({
              texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            });
            this.tag('Buttons')
              .children[1].tag('ControlIcon')
              .patch({
                texture: lng$1.Tools.getSvgTexture(this.focus, 50, 50)
              });
          }
          _handleRight() {
            // this._setState('Forward')
          }
          _handleLeft() {
            // this._setState('Rewind')
          }
          _getFocused() {
            this.timer();
          }
        },

        class Forward extends this {
          $enter() {
            this.timer();
            this.tag('Buttons').children[2].patch({
              texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
              scale: 1.1,
            });
            this.tag('Buttons')
              .children[2].tag('ControlIcon')
              .patch({
                texture: lng$1.Tools.getSvgTexture(
                  Utils.asset('images/player/fast-forward-focus.png'),
                  50,
                  50
                ),
              });
          }
          $exit() {
            this.tag('Buttons').children[2].patch({
              texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
              scale: 1,
            });
            this.tag('Buttons')
              .children[2].tag('ControlIcon')
              .patch({
                texture: lng$1.Tools.getSvgTexture(
                  Utils.asset('images/player/fast-forward.png'),
                  50,
                  50
                ),
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
        },

        class Rewind extends this {
          $enter() {
            this.timer();
            this.tag('Buttons').children[0].patch({
              texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
              scale: 1.1,
            });
            this.tag('Buttons')
              .children[0].tag('ControlIcon')
              .patch({
                texture: lng$1.Tools.getSvgTexture(
                  Utils.asset('images/player/rewind-focus.png'),
                  50,
                  50
                ),
              });
          }
          $exit() {
            this.tag('Buttons').children[0].patch({
              texture: lng$1.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
              scale: 1,
            });
            this.tag('Buttons')
              .children[0].tag('ControlIcon')
              .patch({
                texture: lng$1.Tools.getSvgTexture(
                  Utils.asset('images/player/rewind.png'),
                  50,
                  50
                ),
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
        },

        class Extras extends this {
          $enter() {
            this.tag('Extras').patch({
              texture: lng$1.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xffffffff),
              scale: 1.1,
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
              scale: 1,
            });
            this.tag('Extras').tag('ExtrasOptions').color = 0xffffffff;
          }
        },
        class Hidden extends this {
          _getFocused() { }
        },
      ]
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
            fastrwd: 'fastrwd',
          },
        },
      }
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
      this.videoEl.setAttribute('src', 'placeholder.mp4');
      this.videoEl.setAttribute('type', 'video/ave');
      document.body.appendChild(this.videoEl);
      this.playbackSpeeds = [-16, -8, -4, -2, 1, 2, 4, 8, 16];
      this.playerStatesEnum = { idle: 0, initializing: 1, playing: 8, paused: 6, seeking: 7 };
      this.player = null;
      this.playbackRateIndex = this.playbackSpeeds.indexOf(1);
      this.defaultInitConfig = {
        initialBitrate: 2500000,
        offset: 0,
        networkTimeout: 10,
        preferredAudioLanguage: 'en',
        liveOffset: 15,
        drmConfig: null,
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
      var xPos = 0.67 * x;
      var yPos = 0.67 * y;
      var wPos = 0.67 * w;
      var hPos = 0.67 * h;
      this.player.setVideoRect(xPos, yPos, wPos, hPos);
    }

    /**
     * Event handler to store the current playback state.
     * @param  event playback state of the video.
     */
    _playbackStateChanged(event) {
      switch (event.state) {
        case this.player.playerStatesEnum.idle:
          this.playerState = this.player.playerStatesEnum.idle;
          break
        case this.player.playerStatesEnum.initializing:
          this.playerState = this.player.playerStatesEnum.initializing;
          break
        case this.player.playerStatesEnum.playing:
          this.playerState = this.player.playerStatesEnum.playing;
          break
        case this.player.playerStatesEnum.paused:
          this.playerState = this.player.playerStatesEnum.paused;
          break
        case this.player.playerStatesEnum.seeking:
          this.playerState = this.player.playerStatesEnum.seeking;
          break
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
    _mediaSpeedChanged() { }

    /**
     * Event handler to handle the event of bit rate change.
     */
    _bitrateChanged() { }

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
      // this.tag('PlayerControls').reset()
      // this.tag('PlayerControls').setSmooth('alpha', 1)
      // this.tag('PlayerControls').setSmooth('y', 675, { duration: 1 })
      // this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5000)
    }

    /**
     * Function to handle the event of change in the duration of the playback content.
     */
    _mediaDurationChanged() { }

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
      return this.player
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
      this.tag('PlayerControls').setSmooth('y', 1080, { duration: 0.7 });
      this.tag('PlayerControls').setSmooth('alpha', 0, { duration: 0.7 });
      this._setState('HideControls');
    }

    /**
     * Function to show the player controls.
     */
    showPlayerControls() {
      this.tag('PlayerControls').reset();
      this.tag('PlayerControls').setSmooth('alpha', 1);
      this.tag('PlayerControls').setSmooth('y', 675, { duration: 0.7 });
      this._setState('ShowControls');
      this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5000);
    }
    /**
     * Function to display player controls on down key press.
     */
    _handleDown() {
      this.tag('PlayerControls').setSmooth('alpha', 1, { duration: 1 });
      this.tag('PlayerControls').setSmooth('y', 675, { duration: 1 });
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
    /**
     * Function to define the different states of the video player.
     */
    static _states() {
      return [
        class ShowControls extends this {
          _getFocused() {
            return this.tag('PlayerControls')
          }
        },
        class HideControls extends this {
          _getFocused() { }
        },
      ]
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
  var audio_mute = false;
  var audio_volume = 50;
  var appApi$1 = new AppApi();
  var last_state = '';

  /** Class for home screen UI */
  class HomeScreen extends lng$1.Component {
    /**
     * Function to render various elements in home screen.
     */
    static _template() {
      return {
        BackgroundImage: {
          w: 1920,
          h: 1080,
          alpha: 0,
        },
        BackgroundColor: {
          w: 1920,
          h: 1080,
          alpha: 1,
          rect: true,
          color: CONFIG.theme.background
        },

        TopPanel: {
          type: TopPanel,
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
            type: SidePanel,
          },
          MainView: {
            w: 1994,
            h: 919,
            type: MainView,
          },
        },
        Settings:{
          alpha:0,
          w:1920,
          h:1080,
          type:SettingsScreen,
        },
        IpAddress: {
          x: 200,
          y: 1058,
          mount: 1,
          text: {
            fontFace: CONFIG.language.font,
            text: 'IP:NA',
            textColor: 0xffffffff,
            fontSize: 22,
          },
        },
        Player: { type: AAMPVideoPlayer },
        ShutdownPanel: {
          type: ShutdownPanel,
          x: 660,
          y: 385,
          signals: { select: true },
          alpha: 0
        }
      }
    }

    _init() {
      this.homeApi = new HomeApi();
      
      var appItems = this.homeApi.getAppListInfo();
      var data = this.homeApi.getPartnerAppsInfo();
      var prop_apps = 'applications';
      var prop_displayname = 'displayName';
      var prop_uri = 'uri';
      var prop_apptype = 'applicationType';
      var appdetails = [];
      var appdetails_format = [];
      var usbApps = 0;
      try {
        if (data != null && JSON.parse(data).hasOwnProperty(prop_apps)) {
          appdetails = JSON.parse(data).applications;
          for (var i = 0; i < appdetails.length; i++) {
            if (
              appdetails[i].hasOwnProperty(prop_displayname) &&
              appdetails[i].hasOwnProperty(prop_uri) &&
              appdetails[i].hasOwnProperty(prop_apptype)
            ) {
              appdetails_format.push(appdetails[i]);
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
      }
      this.tag('MainView').appItems = appdetails_format;
      this.tag('MainView').metroApps = this.homeApi.getMetroInfo();
      this.tag('MainView').tvShowItems = this.homeApi.getTVShowsInfo();
      this.tag('MainView').settingsItems = this.homeApi.getSettingsInfo();
      this.tag('MainView').rightArrowIcons = this.homeApi.getRightArrowInfo();
      this.tag('MainView').leftArrowIcons = this.homeApi.getLeftArrowInfo();
      this.tag('SidePanel').sidePanelItems = this.homeApi.getSidePanelInfo();

      this._setState('SidePanel');
      this.initialLoad = true;
      this.networkApi = new Network();
      this.networkApi.activate().then(result => {
        if (result) {
          this.networkApi.registerEvent('onIPAddressStatusChanged', notification => {
            if (notification.status == 'ACQUIRED') {
              this.tag('IpAddress').text.text = 'IP:' + notification.ip4Address;
              // location.reload(true);
            } else if (notification.status == 'LOST') {
              this.tag('IpAddress').text.text = 'IP:NA';
            }
          });
          this.networkApi.getIP().then(ip => {
            this.tag('IpAddress').text.text = 'IP:' + ip;
          });
        }
      });
    
      
    
    }

    _captureKeyRelease(key) {
      if (key.keyCode == 120 || key.keyCode == 217) {
        store.dispatch({ type: 'ACTION_LISTEN_STOP' });
        //app launch code need add here.
        return true
      }
    }

    _captureKey(key) {
      console.log(" _captureKey home screen : " + key.keyCode);

      if (key.keyCode == 120 || key.keyCode == 217) {
        store.dispatch({ type: 'ACTION_LISTEN_START' });
        return true
      }

      if (key.keyCode == 112 || key.keyCode == 142 || key.keyCode == 116) {
        // Remote power key and keyboard F1 key used for STANDBY and POWER_ON
        if (powerState == 'ON') {
          last_state = this._getState();
          this._setState('ShutdownPanel');

          return true
        } else if (powerState == 'STANDBY') {
          appApi$1.standby("ON").then(res => {
            powerState = 'ON';
          });
          return true
        }

      } else if (key.keyCode == 228) {

        console.log("___________DEEP_SLEEP_______________________F12");
        appApi$1.standby("DEEP_SLEEP").then(res => {
          powerState = 'DEEP_SLEEP';
        });
        return true

      } else if (key.keyCode == 118 || key.keyCode == 113) {

        appApi$1.getConnectedAudioPorts().then(res => {
          let audio_source = res.connectedAudioPorts[0];
          let value = !audio_mute;
          new AppApi().audio_mute(value, audio_source).then(res => {
            console.log("__________AUDIO_MUTE_______________________F7");
            console.log(JSON.stringify(res, 3, null));

            if (res.success == true) {
              audio_mute = value;
              new AppApi().zorder("moveToFront", "foreground");
              new AppApi().setVisibility("foreground", audio_mute);
            }
            console.log("audio_mute:" + audio_mute);
          });

        });


        return true

      } else if (key.keyCode == 175) {

        audio_volume += 10;
        if (audio_volume > 100) { audio_volume = 100; }

        let value = "" + audio_volume;
        appApi$1.setVolumeLevel(value).then(res => {
          console.log("__________AUDIO_VOLUME_________Numberpad key plus");
          console.log(JSON.stringify(res, 3, null));
          console.log("setVolumeLevel:" + audio_volume);
        });
        return true

      } else if (key.keyCode == 174) {

        audio_volume -= 10;
        if (audio_volume < 0) { audio_volume = 0; }
        let value = "" + audio_volume;

        appApi$1.setVolumeLevel(value).then(res => {
          console.log("__________AUDIO_VOLUME____________Numberpad key minus");
          console.log(JSON.stringify(res, 3, null));
          console.log("setVolumeLevel:" + audio_volume);
        });
        return true
      }
      return false
    }

    _active() {
      if (this.initialLoad) {
        let home = this;
        this._homeAnimation = home.animation({
          duration: 0.5,
          repeat: 0,
          stopMethod: 'immediate',
          actions: [
            { p: 'scale', v: { 0: 5, 1: 1 } },
            { p: 'x', v: { 0: -1920, 1: 0 } },
            { p: 'y', v: { 0: -1080, 1: 0 } },
          ],
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
          url:
            'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
          drmConfig: null,
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
      console.log('go to top panel');
      this.tag('TopPanel').index = index;
      this._setState('TopPanel');
    }
    $changeBackgroundImageOnFocus(image) {

      if (image.startsWith('/images')) {
        this.tag('BackgroundImage').patch({
          src: Utils.asset(image),
        });
      } else {
        this.tag('BackgroundImage').patch({ src: image });
      }
    }

    $changeBackgroundImageOnNonFocus(image) {
      this.tag('BackgroundImage').patch({

      });
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
    $changeIp(ip){
      this.tag('IpAddress').text.text = ip;
    }

    /**
     * Function to scroll
     */
    $scroll(y) {
      this.tag('MainView').setSmooth('y', y, { duration: 0.5 });
    }

    $standby(value) {
      if (value == 'Back') {
        this._setState(last_state);
      } else {
        if (powerState == 'ON') {
          appApi$1.standby(value).then(res => {
            if (res.success) {
              powerState = 'STANDBY';
            }
            this._setState(last_state);
          });
          return true
        }
      }
    }

    /**
     * Function to hide the home UI.
     */
    hide() {
      this.tag('BackgroundImage').patch({ alpha: 0 });
      this.tag('BackgroundColor').patch({ alpha: 0 });
      this.tag('MainView').patch({ alpha: 0 });
      this.tag('TopPanel').patch({ alpha: 0 });
      this.tag('SidePanel').patch({ alpha: 0 });
    }
    

    /**
       * Function to show home UI.
     */
    show() {
      this.tag('BackgroundImage').patch({ alpha: 1 });
      this.tag('BackgroundColor').patch({ alpha: 1 });
      this.tag('MainView').patch({ alpha: 1 });
      this.tag('TopPanel').patch({ alpha: 1 });
      this.tag('SidePanel').patch({ alpha: 1 });
    }

    /** this function is used to hide only the side and top panels  */
    $hideSideAndTopPanels(){
      this.tag('TopPanel').patch({ alpha: 0 });
      this.tag('SidePanel').patch({ alpha: 0 });
    }

    /** this function will show side and top panels only */
    $showSideAndTopPanels(){
      this.tag('TopPanel').patch({ alpha: 1 });
      this.tag('SidePanel').patch({ alpha: 1 });
    }

    /**
     * Fireancestor to set the state to Settings.
     */
     $goToSettings() {
      this._setState('Settings');
    }

    /**
     * Function to define various states needed for home screen.
     */
    static _states() {
      return [
        class TopPanel extends this {
          _getFocused() {
            return this.tag('TopPanel')
          }
        },
        class SidePanel extends this{
          _getFocused() {
            return this.tag('SidePanel')
          }
        },
        class ShutdownPanel extends this {
          $enter() {
            this.tag('ShutdownPanel').setSmooth('alpha', 1);
          }
          $exit() {
            this.tag('ShutdownPanel').setSmooth('alpha', 0);
          }
          _getFocused() {
            return this.tag('ShutdownPanel')
          }
        },
        class MainView extends this {
          _getFocused() {
            return this.tag('MainView')
          }
        },
        class Settings extends this{
          $enter() {
            this.tag('MainView').alpha = 0;
            this.tag('Settings').alpha = 1;
          }
          _getFocused() {
            return this.tag('Settings')
          }
          $exit() {
            this.tag('MainView').alpha = 1;
            this.tag('Settings').alpha = 0;
          }
        },
        class Playing extends this {
          _getFocused() {
            return this.tag('Player')
          }

          stopPlayer() {
            this._setState('MainView');
            this.player.stop();
            this.show();
          }

          _handleKey(key) {
            if (key.keyCode == 27 || key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36 || key.keyCode == 158) {
              this.stopPlayer();
            } else if (key.keyCode == 227 || key.keyCode == 179) {
              this.stopPlayer();
              return false;
            }
          }
        },
      ]
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
            src: Utils.asset('/images/splash/RDKLogo.png'),
          },
        },
        SplashVideo: {
          w: 1920,
          h: 1080,
          alpha: 0,
          Player: { type: AAMPVideoPlayer, w: 1920, h: 1080, x: 0, y: 0 },
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
              textColor: 0xffffffff,
            },
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
              textColor: 0xffe5e5e5,
            },
          },
          LoadingIcon: {
            x: 750,
            y: 600,
            alpha: 0,
            src: Utils.asset('images/loading.png'),
          },
          RemoteImg: {
            x: 1300,
            y: 300,
            src: Utils.asset('images/remote.png'),
          },
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
              textColor: 0xffffffff,
            },
          },
          Description: {
            w: 1920,
            y: 400,
            text: {
              fontFace: CONFIG.language.font,
              fontSize: 35,
              textAlign: 'center',
              maxLines: 2,
              text:
                'Please connect to either a wired connection or a WiFi Network, For WiFi network press home and then go to settings',
              wordWrapWidth: 1400,
              textColor: 0xffe5e5e5,
            },
          },
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
              textColor: 0xffffffff,
            },
          },
          UIList: {
            x: 1920 / 2 - 20,
            y: 500,
            type: lng$1.components.ListComponent,
            w: 300 * 5,
            h: 150,
            itemSize: 300 + 20,
            roll: true,
            mountX: 0.5,
          },
        },
      }
    }
    /**
     * Function to be excuted when the Bluetooth screen is enabled.
     */
    _enable() {
      this.remotePaired = null;
      this.hasInternet = true;
      this._bt = new BluetoothApi();
      this._bt.activate();
      this._bt
        .getPairedDevices()
        .then(() => this._bt.getConnectedDevices())
        .then(() => {
          let paired = this._bt.pairedDevices;
          this._bt.connectedDevices;

          if (paired.length > 0) {
            this.remotePaired = true;
          }else {
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
          item: item,
        }
      });
    }
    /**
     * Function to startVideo.
     */
    startVideo() {
      this.player = this.tag('SplashVideo.Player');
      try {
        this.player.load({
          title: '',
          subtitle: '',
          image: '',
          url: 'https://rdkwiki.com/rdk-apps/splash/splash.MOV',
          drmConfig: null,
        });

      } catch (error) {
        this.player = null;
        console.log('###########', error);
      }
    }

    /**
     * Function to handle the different states of the app.
     */
    static _states() {
      return [
        class Splashscreen extends this {
          $enter() {
            const myAnimation = this.tag('Splashscreen').animation({
              duration: 0.5,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [{ p: 'alpha', v: { 0: 0, 1: 1 } }],
            });
            myAnimation.start();
            const myAnimationLogo = this.tag('Img').animation({
              duration: 4,
              repeat: 0,
              timingFunction: 'ease-in',
              actions: [
                { p: 'x', v: { 0: { v: 0, sm: 0.5 }, 1: 950 } },
                { p: 'y', v: { 0: { v: 0, sm: 0.5 }, 1: 550 } },
              ]
            });
            myAnimationLogo.start();

            this.screenTimeout = setTimeout(() => {
              this._setState('SplashVideo');
            }, 5000);
          }
          _handleKey(event) {
            if (event.keyCode == 83) this._setState('UISwitch');
          }
          $exit() {
            const myAnimation = this.tag('Splashscreen').animation({
              duration: 0.5,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [{ p: 'alpha', v: { 0: 1, 1: 0 } }],
            });
            myAnimation.start();
            window.clearTimeout(this.screenTimeout);
          }
        },
        class SplashVideo extends this {
          $enter() {
            const myAnimation = this.tag('SplashVideo').animation({
              duration: 0.5,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [{ p: 'alpha', v: { 0: 0, 1: 1 } }],
            });
            myAnimation.start();
            this.startVideo();
            this.timeout = setTimeout(() => {
              if (this.remotePaired == false) this._setState('AutoRemotePair');
              else if (this.hasInternet == false) this._setState('ConnectivityScreen');
              else Router.navigate('home');
            }, 5000);
          }
          $exit() {
            const myAnimation = this.tag('SplashVideo').animation({
              duration: 0.5,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [{ p: 'alpha', v: { 0: 1, 1: 0 } }],
            });
            myAnimation.on('finish', p => {
              if (this.player) this.player.stop();
            });
            myAnimation.start();
            window.clearTimeout(this.timeout);
          }
          _handleKey(event) {
            if (event.keyCode == 83) this._setState('UISwitch');
          }
        },
        class ConnectivityScreen extends this {
          $enter() {
            const myAnimation = this.tag('ConnectivityScreen').animation({
              duration: 0.5,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [
                { p: 'alpha', v: { 0: 0, 1: 1 } },
                { p: 'x', v: { 0: 1000, 1: 0 } },
              ],
            });
            myAnimation.start();
            setTimeout(() => {
              Router.navigate('home');
            }, 5000);
          }
          $exit() {
            const myAnimation = this.tag('ConnectivityScreen').animation({
              duration: 0.5,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [{ p: 'alpha', v: { 0: 1, 1: 0 } }],
            });
            myAnimation.start();
          }
          _handleKey() {
            Router.navigate('home');
          }
        },
        class AutoRemotePair extends this {
          $enter() {
            const myAnimation = this.tag('AutoRemotePair').animation({
              duration: 1,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [
                { p: 'alpha', v: { 0: 0, 1: 1 } },
                { p: 'x', v: { 0: 1000, 1: 0 } },
              ],
            });
            var connected = false;
            var timer = setTimeout(() => {
              if (!connected)
                this.tag('AutoRemotePair.Description').text =
                  'Please put the remote in pairing mode, No Bluetooth device found';
              setTimeout(() => {
                if (this.hasInternet == false) this._setState('ConnectivityScreen');
                else Router.navigate('home');
              }, 1000);
            }, 10000);
            var error = () => {
              this.tag('AutoRemotePair.Description').text =
                'Please put the remote in pairing mode, , No Bluetooth device found';
              setTimeout(() => {
                if (this.hasInternet == false) this._setState('ConnectivityScreen');
                else Router.navigate('home');
              }, 1000);
            };
            myAnimation.start();
            setTimeout(() => {
              this.tag('AutoRemotePair.Description').text =
                'Please put the remote in pairing mode, Scanning...';
              const rotateAnimation = this.tag('AutoRemotePair.LoadingIcon').animation({
                duration: 1,
                repeat: -1,
                stopMethod: 'immediate',
                stopDelay: 0.2,
                actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: Math.PI * 2 } }],
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
                this.tag('AutoRemotePair.Description').text = pairedDevices[0].deviceType+'remote is paired';
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
                  if (this.hasInternet == false) this._setState('ConnectivityScreen');
                  else Router.navigate('home');
                }, 2000);
              } else {
                setTimeout(() => {
                  this._bt.getConnectedDevices().then(() => {
                    let connectedDevices = this._bt.connectedDevices;
                    if (connectedDevices.length > 0) {
                      this.tag('AutoRemotePair.Description').text =
                        'Please put the remote in pairing mode, Connected to ' +
                        connectedDevices[0].name;
                      connected = true;
                      clearTimeout(timer);
                      setTimeout(() => {
                        if (this.hasInternet == false) this._setState('ConnectivityScreen');
                        else Router.navigate('home');
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
              actions: [{ p: 'alpha', v: { 0: 1, 1: 0 } }],
            });
            myAnimation.start();
          }
        },
        class UISwitch extends this {
          $enter() {
            const myAnimation = this.tag('UISwitch').animation({
              duration: 0.5,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [
                { p: 'alpha', v: { 0: 0, 1: 1 } },
                { p: 'x', v: { 0: 1000, 1: 0 } },
              ],
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

            this.tag('UISwitch').patch({ smooth: { color: bgColor } });
            return this.tag('UISwitch.UIList').element
          }
          _handleRight() {
            if (this.tag('UISwitch.UIList').length - 1 != this.tag('UISwitch.UIList').index) {
              this.tag('UISwitch.UIList').setNext();
              return this.tag('UISwitch.UIList').element
            }
          }
          _handleLeft() {
            if (this.tag('UISwitch.UIList').index > 0) {
              this.tag('UISwitch.UIList').setPrevious();
              return this.tag('UISwitch.UIList').element
            }
          }
          _handleEnter() {
            if (this.tag('UISwitch.UIList').element._item.title != 'DEFAULT') {
              this.appApi.launchResident(this.tag('UISwitch.UIList').element._item.uri);
            } else {
              if (this.remotePaired == false) this._setState('AutoRemotePair');
              else if (this.hasInternet == false) this._setState('ConnectivityScreen');
              else Router.navigate('home');
            }
          }
          $exit() {
            const myAnimation = this.tag('UISwitch').animation({
              duration: 1,
              repeat: 0,
              stopMethod: 'immediate',
              actions: [{ p: 'alpha', v: { 0: 1, 1: 0 } }],
            });
            myAnimation.start();
          }
        },
      ]
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
            fontSize: 22,
          },
        },
      }
    }

    _handleEnter() {
      Router.navigate('home');
    }

    _focus() {
      console.log('focus error page');
    }

    set error(obj) {
      const { page, error } = obj;
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
      return 'up'
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
   var musicListInfo = [
   
    ];

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

  class UsbContent extends lng$1.Component {
      static _template() {
          return {
              Background: {
                  w: 1920,
                  h: 1080,
                  src: Utils.asset('images/tvShows/background_new.jpg'),
              },
              UsbHomeTopPanel: {
                  x: 0,
                  y: 0,
                  w: 1920,
                  h: 171,
                  Back: {
                      x: 81,
                      y: 100,
                      mountY: 0.5,
                      src: Utils.asset('/images/settings/Back_icon.png'),
                      w: 70,
                      h: 70,
                  },
                  IconTitle: {
                      x: 200,
                      y: 78,
                      text: { text: 'USB Content Screen', fontSize: 40, fontFace: 'MS-Regular', },
                  },
                  IpAddress: {
                      x: 1835,
                      y: 125,
                      mount: 1,
                      text: {
                          fontFace: 'MS-Regular',
                          text: 'IP:N/A',
                          textColor: 0xffffffff,
                          fontSize: 32,
                          w: 360,
                          h: 40,
                      },
                  },
                  Border: {
                      x: 81,
                      y: 171,
                      mountY: 0.5,
                      RoundRectangle: {
                          zIndex: 2,
                          texture: lng.Tools.getRoundRect(1761, 0, 0, 3, 0xffffffff, true, 0xffffffff),
                      },
                      alpha: 0.4
                  }
              },
              ContentTitle:
              {
                  x: 80,
                  y: 220,
                  text: {
                      fontFace: 'MS-Regular',
                      textColor: 0xffffffff,
                      fontSize: 40,
                      w: 360,
                      h: 60,
                  },
              },
              
              ItemList: {
                  x: 80,
                  y: 320,
                  flex: { direction: 'row', paddingLeft: 20, wrap: false },
                  type: lng$1.components.ListComponent,
                  w: 1761,
                  h: 300,
                  itemSize: 185,
                  roll: true,
                  rollMax: 815,
                  horizontal: true,
                  itemScrollOffset: -5,
                  clipping: true,
              },
              Preview: {
                  x: 500,
                  y: 580,
                  w: 750,
                  h: 450,
              },
              Message:
              {
                  x: 500,
                  y: 800,
                  text: {
                      fontFace: 'MS-Regular',
                      textColor: 0xffffdf00,
                      fontSize: 38,
                      fontStyle: 'italic bold',
                      textColor: 0xffffdf00,
                      shadow: true,
                      shadowColor: 0xffff00ff,
                      shadowOffsetX: 2,
                      shadowOffsetY: 2,
                      shadowBlur: 2,
                      w: 900,
                      h: 100,
                  },
              },

              Player: {
                  type: AAMPVideoPlayer,
              },
          }
      }
      set contentTitle(title) {
          this.tag('ContentTitle').patch({
              text: { text: title }
          });
      }
      set message(message) {
          this.tag('Message').patch({
              text: { text: message }
          });
      }
      

      set itemList(items) {
          this.tag('ItemList').items = items.map(info => {
              return {
                  w: 175,
                  h: 175,
                  type: AppListItem,
                  data: info,
                  focus: 1.2,
                  unfocus: 1,
                  x_text: 106,
                  y_text: 215,
              }
          });
          this.tag('ItemList').start();
      }

      _init() {
          this.videoPlayback=false;
          var networkApi = new Network();
          networkApi.getIP().then(ip => {
              this.tag('IpAddress').text.text = 'IP:' + ip;
          });
      }

      
      previewImageOnFocus(image) {
          if (image.startsWith('/images')) {
            this.tag('Preview').patch({
              src: Utils.asset(image),
            });
          } else {
            this.tag('Preview').patch({ src: image });
          }
        }

    goToPlayer(item) {
         this._setState('Player');
         this.play(item);
    }


     /**
     * Function to hide the home UI.
     */
      hide() {
          this.tag('Background').patch({ alpha: 0 });
          this.tag('UsbHomeTopPanel').patch({ alpha: 0 });
          this.tag('ContentTitle').patch({ alpha: 0 });
          this.tag('ItemList').patch({ alpha: 0 });
          this.tag('Preview').patch({ alpha: 0 });
        }
      
        /**
           * Function to show home UI.
         */
         show() {
          console.log('show -from content');
          this.tag('Background').patch({ alpha: 1 });
          this.tag('UsbHomeTopPanel').patch({ alpha: 1 });
          this.tag('ContentTitle').patch({ alpha: 1 });
          this.tag('ItemList').patch({ alpha: 1 });
          this.tag('Preview').patch({ alpha: 1 });

        }
         /**
     * Function to start video playback.
     */
    play(item) {
      this.player = this.tag('Player');
      try {
        this.player.load({
          title: item.data.displayName,
          subtitle: 'm3u8',
          url:item.data.uri,
          drmConfig: null,
        });
        this.hide();
        this._setState('Playing');
        this.player.setVideoRect(0, 0, 1920, 1080);
      } catch (error) {
        this._setState('ItemList');
        console.error('Playback Failed ' + error);
      }
    }

      static _states() {
          return [
              class ItemList extends this {
                  _getFocused() {
                      if (this.tag('ItemList').length) {
                          this.previewImageOnFocus(this.tag('ItemList').element.data.url);
                          return this.tag('ItemList').element
                      }
                  }
                  _handleRight() {
                      if (this.tag('ItemList').length - 1 != this.tag('ItemList').index) {
                          this.tag('ItemList').setNext();
                          return this.tag('ItemList').element
                      }
                  }
                  _handleLeft() {
                      if (0 != this.tag('ItemList').index) {
                          this.tag('ItemList').setPrevious();
                          return this.tag('ItemList').element
                      }
                  }
                  _handleDown() {
                  }
                  _handleUp() {
                      this.videoPlayback=false;
                      this._setState('Back');
                  }
                  _handleEnter() {
                      let item= this.tag('ItemList').element;
                      if (this.videoPlayback == true) { this.goToPlayer(item); }
                  }
                  $exit() {
                      this.videoPlayback = false;
                  }
              },

              class Back extends this{
                  $enter() {
                      this.tag('Back').patch({
                          src: Utils.asset('/images/settings/back-arrow-small.png'),
                      });
                  }
                  _handleDown() {
                      this.tag('Back').patch({
                          src: Utils.asset('/images/settings/Back_icon.png'),

                      });
                      this._setState('ItemList');
                  }

                  _handleKey(key) {
                      console.log(key.keyCode);
                      if (key.keyCode == 13) {
                          this.tag('Back').patch({
                              src: Utils.asset('/images/settings/Back_icon.png'),
                          });
                          this.fireAncestors('$goToSideMenubar', 2);
                          Router.navigate('settings/SettingsScreen/2', false);
                      }
                  }
              },
              class Playing extends this {
                  _getFocused() {
                    return this.tag('Player')
                  }
          
                  stopPlayer() {
                    this._setState('ItemList');
                    if(this.player !=null)
                       this.player.stop();
                    this.show();
                  }
          
                  _handleKey(key) {
                    if (key.keyCode == 27 || key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36 || key.keyCode == 158) {
                      this.stopPlayer();
                    } else if (key.keyCode == 227 || key.keyCode == 179) {
                      this.stopPlayer();
                      return false;
                    }
                  }
                },
          ]
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

  class UsbAudioScreen extends UsbContent {
    _active() {
      this.contentTitle = 'Audio files';
      this.message='Audio playback functionality not yet implemented';
      this.itemList = musicListInfo;
      this._setState('ItemList');
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
   var imageListInfo = [
    ];

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

  class UsbImageScreen extends UsbContent {
    _active() {
      this.contentTitle = 'Images';
      this.itemList = imageListInfo;
      this._setState('ItemList');
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
   var videoListInfo = [
    ];

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

  class UsbVideoScreen extends UsbContent {
    _active() {
      this.contentTitle = 'Video files';
      this.videoPlayback=true;
      this.itemList = videoListInfo;
      this._setState('ItemList');
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
   * Class for Usb Home screen.
   */

  class UsbContentScreen extends lng$1.Component {

    static _template() {
      return {
        UsbVideoScreen: {
          type: UsbVideoScreen,
          visible: false,
        },
        UsbAudioScreen: {
          type: UsbAudioScreen,
          visible: false,
        },
        UsbImageScreen: {
          type: UsbImageScreen,
          visible: false,
        },
      }
    }

    set screen(screen) {
      this._setState(screen);
    }
    static _states() {
      return [

        class UsbVideoScreen extends this {
          $enter() {
            this.tag('UsbVideoScreen').visible = true;
          }
          _getFocused() {
            return this.tag('UsbVideoScreen')
          }
          $exit() {
            this.tag('UsbVideoScreen').visible = false;
          }
          _handleKey(key) {
          }
        },
        class UsbAudioScreen extends this {
          $enter() {
            this.tag('UsbAudioScreen').visible = true;
          }
          _getFocused() {
            return this.tag('UsbAudioScreen')
          }
          $exit() {
            this.tag('UsbAudioScreen').visible = false;
          }
          _handleKey(key) {

          }
        },
        class UsbImageScreen extends this {
          $enter() {
            this.tag('UsbImageScreen').visible = true;
          }
          _getFocused() {
            return this.tag('UsbImageScreen')
          }
          $exit() {
            this.tag('UsbImageScreen').visible = false;
          }
          _handleKey(key) {

          }
        },
      ]
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
    boot: (queryParam) => {
      let homeApi = new HomeApi();
      homeApi.setPartnerAppsInfo(queryParam.data);
      return Promise.resolve()
    },
    root: 'home',
    routes: [
      {
        path: 'home',
        component: HomeScreen,
        before() {
          return Promise.resolve()
        },
        cache: 10,
      },
      {
        path: 'settings/:screen/:id',
        options: {
          preventStorage: true,
          clearHistory: true,
          reuseInstance: true
        },
        component: SettingsScreen,
        cache: 10,
      },
      {
        path: 'splash',
        component: SplashScreen,
        options: {
          preventStorage: true,
          clearHistory: true,
          reuseInstance: false
        },
        cache: 10,
      },
      {
        path: 'usbContent/:screen',
        options: {
          preventStorage: true,
          clearHistory: true,
          reuseInstance: true
        },
        component: UsbContentScreen,
        cache: 10,
      },
      {
        path: '!',
        component: Error$1,
      },
      {
        path: '*',
        component: HomeScreen,
      },
    ],
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
   * Class for Xcast thunder plugin apis.
   */
  class XcastApi {
    constructor() {
      console.log('Xcast constructor');
      this._events = new Map();
    }

    /**
     * Function to activate the Xcast plugin
     */
    activate() {
      return new Promise((resolve, reject) => {
        const config = {
          host: '127.0.0.1',
          port: 9998,
          default: 1,
        };
        this._thunder = thunderJS(config);
        this.callsign = 'org.rdk.Xcast';
        this._thunder
          .call('Controller', 'activate', { callsign: this.callsign })
          .then(result => {
            console.log('Xcast activation success ' + result);
            this._thunder
              .call('org.rdk.Xcast', 'setEnabled', { enabled: true })
              .then(result => {
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
                    console.log('onApplicationStateRequest ' + JSON.stringify(notification));
                    if (this._events.has('onApplicationStateRequest')) {
                      this._events.get('onApplicationStateRequest')(notification);
                    }
                  });
                  resolve(true);
                } else {
                  console.log('Xcast enabled failed');
                }
              })
              .catch(err => {
                console.error('Enabling failure', err);
                reject('Xcast enabling failed', err);
              });
          })
          .catch(err => {
            console.error('Activation failure', err);
            reject('Xcast activation failed', err);
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
      this._events = new Map();
      this._thunder = null;
    }

    /**
     * Function to notify the state of the app.
     */
    onApplicationStateChanged(params) {
      return new Promise((resolve, reject) => {
        console.log('Notifying back');
        this._thunder.call('org.rdk.Xcast', 'onApplicationStateChanged', params).then(result => {
          console.log(result);
          resolve(result);
        });
      });
    }

    static supportedApps() {
      var xcastApps = { AmazonInstantVideo: 'Amazon', YouTube: 'Cobalt', Netflix: 'Netflix' };
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

  const config = {
    host: '127.0.0.1',
    port: 9998,
    default: 1,
  };
  var thunder = thunderJS(config);
  var appApi = new AppApi();

  class App extends Router.App {
    static getFonts() {
      return [{ family: CONFIG.language.font, url: Utils.asset('fonts/'+ CONFIG.language.fontSrc) }];
    }
    _setup() {
      Router.startRouter(routes, this);
      document.onkeydown = e => {
        if (e.keyCode == 8) {
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
      }
    }

    _init() {
      

      this.xcastApi = new XcastApi();
      this.xcastApi.activate().then(result => {
        if (result) {
          this.registerXcastListeners();
        }
      });
      var thunder = thunderJS(config);
      const rdkshellCallsign = 'org.rdk.RDKShell';
      thunder.Controller.activate({ callsign: rdkshellCallsign })
        .then(result => {
          console.log('Successfully activated RDK Shell');
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder.call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 27,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 112,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 116,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 118,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 175,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 174,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 113,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 228,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 142,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 77,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 36,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 49,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 158,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 227,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
          console.log('Error', err);
        })
        .then(result => {
          thunder
            .call(rdkshellCallsign, 'addKeyIntercept', {
              client: 'ResidentApp',
              keyCode: 179,
              modifiers: [],
            })
            .then(result => {
              console.log('addKeyIntercept success');
            })
            .catch(err => {
              console.log('Error', err);
            });
        })
        .catch(err => {
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
          appApi.suspendCobalt();
          break;
        case 'Lightning':
          appApi.deactivateLightning();
          break;
        case 'Native':
          appApi.killNative();
          break;
        case 'Amazon':
          appApi.suspendPremiumApp('Amazon');
        case 'Netflix':
          appApi.suspendPremiumApp('Netflix');
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
          console.log('Launch ' + this.xcastApps(notification.applicationName));
          if (applicationName == 'Amazon' && Storage.get('applicationType') != 'Amazon') {
            this.deactivateChildApp(Storage.get('applicationType'));
            appApi.launchPremiumApp('Amazon');
            Storage.set('applicationType', 'Amazon');
            appApi.setVisibility('ResidentApp', false);
            let params = { applicationName: notification.applicationName, state: 'running' };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName == 'Netflix' && Storage.get('applicationType') != 'Netflix') {
            this.deactivateChildApp(Storage.get('applicationType'));
            appApi.launchPremiumApp('Netflix');
            Storage.set('applicationType', 'Netflix');
            appApi.setVisibility('ResidentApp', false);
            let params = { applicationName: notification.applicationName, state: 'running' };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName == 'Cobalt' && Storage.get('applicationType') != 'Cobalt') {
            this.deactivateChildApp(Storage.get('applicationType'));
            appApi.launchCobalt(notification.parameters.url);
            Storage.set('applicationType', 'Cobalt');
            appApi.setVisibility('ResidentApp', false);
            let params = {
              applicationName: notification.applicationName,
              state: 'running',
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
            let params = { applicationName: notification.applicationName, state: 'stopped' };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === 'Netflix' && Storage.get('applicationType') === 'Netflix') {
            appApi.suspendPremiumApp('Netflix');
            let params = { applicationName: notification.applicationName, state: 'stopped' };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === 'Cobalt' && Storage.get('applicationType') === 'Cobalt') {
            appApi.suspendCobalt();
            let params = { applicationName: notification.applicationName, state: 'stopped' };
            this.xcastApi.onApplicationStateChanged(params);
          }
          Storage.set('applicationType', '');
          appApi.setVisibility('ResidentApp', true);
          thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
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
            let params = { applicationName: notification.applicationName, state: 'running' };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName == 'Netflix' && Storage.get('applicationType') != 'Netflix') {
            this.deactivateChildApp(Storage.get('applicationType'));
            appApi.launchPremiumApp('Netflix');
            Storage.set('applicationType', 'Amazon');
            appApi.setVisibility('ResidentApp', false);
            let params = { applicationName: notification.applicationName, state: 'running' };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName == 'Cobalt' && Storage.get('applicationType') != 'Cobalt') {
            this.deactivateChildApp(Storage.get('applicationType'));
            appApi.launchCobalt();
            Storage.set('applicationType', 'Cobalt');
            appApi.setVisibility('ResidentApp', false);
            let params = { applicationName: notification.applicationName, state: 'running' };
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
            thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
              console.log('ResidentApp moveToFront Success');
            });
            let params = { applicationName: notification.applicationName, state: 'stopped' };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === 'Netflix' && Storage.get('applicationType') === 'Netflix') {
            appApi.deactivateNativeApp('Netflix');
            Storage.set('applicationType', '');
            appApi.setVisibility('ResidentApp', true);
            thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
              console.log('ResidentApp moveToFront Success');
            });
            let params = { applicationName: notification.applicationName, state: 'stopped' };
            this.xcastApi.onApplicationStateChanged(params);
          } else if (applicationName === 'Cobalt' && Storage.get('applicationType') === 'Cobalt') {
            appApi.deactivateCobalt();
            Storage.set('applicationType', '');
            appApi.setVisibility('ResidentApp', true);
            thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
              console.log('ResidentApp moveToFront Success');
            });
            let params = { applicationName: notification.applicationName, state: 'stopped' };
            this.xcastApi.onApplicationStateChanged(params);
          }
        }
      });
      this.xcastApi.registerEvent('onApplicationStateRequest', notification => {
        console.log('Received a state request ' + JSON.stringify(notification));
        if (this.xcastApps(notification.applicationName)) {
          let applicationName = this.xcastApps(notification.applicationName);
          let status = AppApi.pluginStatus(applicationName);
          let params = { applicationName: notification.applicationName, state: 'stopped' };
          if (status) {
            params.state = 'running';
          }
          this.xcastApi.onApplicationStateChanged(params);
          console.log('State of ' + this.xcastApps(notification.applicationName));
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
      if (key.keyCode == 227) {
        var showMax = 'https://ott-app.dstv.com/';
        this.deactivateChildApp(Storage.get('applicationType'));
        appApi.launchWeb(showMax);
        Storage.set('applicationType', 'WebApp');
        appApi.setVisibility('ResidentApp', false);
      } else if (key.keyCode == 179 && Storage.get('applicationType') != 'Cobalt') {
        this.deactivateChildApp(Storage.get('applicationType'));
        appApi.launchCobalt();
        Storage.set('applicationType', 'Cobalt');
        appApi.setVisibility('ResidentApp', false);
      } else if (key.keyCode == 27 || key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36 || key.keyCode == 158) {
        this.deactivateChildApp(Storage.get('applicationType'));
        Storage.set('applicationType', '');
        appApi.setVisibility('ResidentApp', true);
        thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
          console.log('ResidentApp moveToFront Success');
        });
        thunder
          .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
          .then(result => {
            console.log('ResidentApp moveToFront Success');
          })
          .catch(err => {
            console.log('Error', err);
          });
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
    return Launch(App, ...arguments)
  }

  return index;

}());
