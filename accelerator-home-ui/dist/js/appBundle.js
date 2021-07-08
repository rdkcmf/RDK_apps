/**
 * App version: 1.0.0
 * SDK version: 3.2.1
 * CLI version: 2.5.0
 *
 * Generated: Thu, 08 Jul 2021 12:01:29 GMT
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

  var Lightning = window.lng;

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

  class Mediaplayer extends Lightning.Component {
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
              texture: { type: Lightning.textures.StaticTexture, options: {} },
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

      if (!Lightning.Utils.equalValues(this._stream, settings.stream)) {
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
      if (Lightning.Utils.equalValues(this._videoPos, videoPos)) {
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
    if (v instanceof Lightning.Element || isComponentConstructor(v)) {
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

  class VersionLabel extends Lightning.Component {
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
  class FpsIndicator extends Lightning.Component {
    static _template() {
      return {
        rect: true,
        color: 0xffffffff,
        texture: Lightning.Tools.getRoundRect(80, 80, 40),
        h: 80,
        w: 80,
        x: 100,
        y: 100,
        mount: 1,
        Background: {
          x: 3,
          y: 3,
          texture: Lightning.Tools.getRoundRect(72, 72, 36),
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
  let language = null;

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

  const setLanguage = lng => {
    language = null;

    return new Promise((resolve, reject) => {
      if (lng in translations) {
        language = lng;
      } else {
        if ('map' in meta && lng in meta.map && meta.map[lng] in translations) {
          language = meta.map[lng];
        } else if ('default' in meta && meta.default in translations) {
          language = meta.default;
          const error =
            'Translations for Language ' +
            language +
            ' not found. Using default language ' +
            meta.default;
          Log.warn(error);
          reject(error);
        } else {
          const error = 'Translations for Language ' + language + ' not found.';
          Log.error(error);
          reject(error);
        }
      }

      if (language) {
        Log.info('Setting language to', language);

        const translationsObj = translations[language];
        if (typeof translationsObj === 'object') {
          resolve();
        } else if (typeof translationsObj === 'string') {
          const url = Utils.asset(translationsObj);

          fetch(url)
            .then(response => response.json())
            .then(json => {
              // save the translations for this language (to prevent loading twice)
              translations[language] = json;
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
    return class Application extends Lightning.Application {
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

  class RoutedApp extends Lightning.Component {
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

  class VideoTexture extends Lightning.Component {
    static _template() {
      return {
        Video: {
          alpha: 1,
          visible: false,
          pivot: 0.5,
          texture: { type: Lightning.textures.StaticTexture, options: {} },
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

  class ScaledImageTexture extends Lightning.textures.ImageTexture {
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

  class PinInput extends Lightning.Component {
    static _template() {
      return {
        w: 120,
        h: 150,
        rect: true,
        color: 0xff949393,
        alpha: 0.5,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
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

  class PinDialog extends Lightning.Component {
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
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
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

  const protocols = 'notification';
  let socket = null;
  var connect = options => {
    return new Promise((resolve, reject) => {
      if (socket && socket.readyState === 1) return resolve(socket)
      if (socket && socket.readyState === 0) {
        const waitForOpen = () => {
          socket.removeEventListener('open', waitForOpen);
          resolve(socket);
        };
        return socket.addEventListener('open', waitForOpen)
      }
      if (socket === null) {
        socket = new ws_1(makeWebsocketAddress(options), protocols);
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
          socket = null;
        });
        const handleConnectClosure = event => {
          socket = null;
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
            socket = null;
          });
          resolve(socket);
        });
      } else {
        socket = null;
        reject('Socket error');
      }
    })
  };

  var makeBody = (requestId, plugin, method, params, version) => {
    params ? delete params.version : null;
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

  let api;
  var thunderJS = options => {
    if (
      options.token === undefined &&
      typeof window !== 'undefined' &&
      window.thunder &&
      typeof window.thunder.token === 'function'
    ) {
      options.token = window.thunder.token();
    }
    api = API(options);
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
          return api
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

  /**
   * Class to render items in main view.
   */
  class ListItem extends Lightning.Component {
    /**
     * Function to render various elements in the main view item.
     */
    static _template() {
      return {
        Item: {
          Shadow: {
            alpha: 0,
            x: -45,
            y: -40,
            color: 0x66000000,
            texture: lng.Tools.getShadowRect(375, 420, 0, 10, 20),
          },
          x: 0,
          y: 18,
          Image: {},
          Info: {},
        },
      }
    }

    _init() {
      if (this.data.url.startsWith('/images')) {
        this.tag('Image').patch({
          rtt: true,
          w: this.w,
          h: this.h,
          shader: {
            type: lng.shaders.RoundedRectangle,
            radius: 10
          },
          src: Utils.asset(this.data.url),
          scale: this.unfocus,
        });
      } else {
        this.tag('Image').patch({
          rtt: true,
          w: this.w,
          h: this.h,
          shader: {
            type: lng.shaders.RoundedRectangle,
            radius: 10
          },
          src: this.data.url,
        });
      }

      /* Used static data for develpment purpose ,
      it wil replaced with Dynamic data once implimetation is completed.*/
      this.tag('Info').patch({
        rect: true,
        color: 0xff141F31,
        x: this.x,
        y: this.y + this.h + 30,
        w: this.w,
        h: 140,
        alpha: 0,
        PlayIcon: {
          x: this.x + 20,
          y: this.y + 20,
          texture: Lightning.Tools.getSvgTexture(Utils.asset('images/player/play_icon_new.png'), 50, 50),
          Label: {
            x: this.x + 65,
            y: this.y + 10,
            text: {
              text: this.data.displayName,
              fontSize: 25,
              maxLines: 2,
              wordWrapWidth: 150
            },
          }
        },
        IMDb: {
          x: this.x + 25,
          y: this.y + 90,
          texture: Lightning.Tools.getSvgTexture(Utils.asset('images/player/IMDb.png'), 45, 30),
          Rating: {
            x: this.x + 65,
            y: this.y,
            text: {
              text: '8.8/10',
              fontSize: 20,
              maxLines: 2,
              wordWrapWidth: 150
            },
          },
          Ua: {
            text: {
              text: '16+',
              fontSize: 18
            },
            x: this.x + 135,
            y: this.y,
            RoundRectangle: {
              zIndex: 2,
              texture: lng.Tools.getRoundRect(30, 20, 4, 3, 0xffff00ff, false, 0xff00ffff),
            },
          },
          Duration: {
            x: this.x + 190,
            y: this.y,
            text: {
              text: '2h 30m',
              fontSize: 20,
              maxLines: 2,
              wordWrapWidth: 150
            },
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
        w: this.w,
        h: this.h,
        scale: this.focus,
        shader: {
          type: lng.shaders.RoundRectangle,
          radius: 0
        }
      });

      this.tag('Info').alpha = 1;
      this.tag('Info').patch({
        smooth: {
          x: this.x,
          w: this.w,
          h: 140,
          scale: this.focus
        }
      });
      this.tag('Item').patch({
        smooth: {
          zIndex: 1,
          y: this.y - 65,
        }
      });
      this.tag('Shadow').patch({
        smooth: {
          alpha: 1
        }
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
        shader: {
          type: lng.shaders.RoundedRectangle,
          radius: 10
        }
      });
      this.tag('Item').patch({
        smooth: {
          zIndex: 0,
          y: this.y + 20
        }
      });
      this.tag('Info').alpha = 0;
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
   * Class to render items in main view.
   */
  class AppListItem extends Lightning.Component {
    /**
     * Function to render various elements in the main view item.
     */
    static _template() {
      return {
        Shadow:{          
          alpha: 0,
          x: -25,
          y: 0,
          color: 0x66000000,
        },
        Item: {
          x: 0,
          y: 18,
          Image: {},
        },
      }
    }

    _init() {

      if (this.data.url.startsWith('/images')) {
        this.tag('Image').patch({
          w: this.w,
          h: this.h,
          src: Utils.asset(this.data.url),
          shader: {
            type: lng.shaders.RoundedRectangle,
            radius: 10
          },
          scale: this.unfocus,
        });
      } else {
        this.tag('Image').patch({
          shader: {
            type: lng.shaders.RoundedRectangle,
            radius: 10
          },
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
      this.tag('Shadow').patch({
        smooth: {
          alpha: 1,
          zIndex:1,
          texture: lng.Tools.getShadowRect(this.w+35, this.h+25, 0, 10, 20),
        }
      });
      this.tag('Image').patch({
        x: this.x,
        w: this.w,
        h: this.h,
        scale: this.focus,
        shader: {
          type: lng.shaders.RoundedRectangle,
          radius: 0
        }
      });
      this.tag('Item').patch({
          zIndex: 2
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
        shader: {
          type: lng.shaders.RoundedRectangle,
          radius: 10
        }
      });
      this.tag('Item').patch({
          zIndex: 0
      });
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
            console.log('Display Error', err);
          });
      })
    }

    /**
     * Function to set the display resolution.
     */
    setResolution() {
      return new Promise((resolve, reject) => {
        const systemcCallsign = 'org.rdk.DisplaySettings';
        thunder$1.Controller.activate({ callsign: systemcCallsign })
          .then(() => {
            thunder$1
              .call(systemcCallsign, 'setCurrentResolution', {
                videoDisplay: 'HDMI0',
                resolution: '1080p',
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
            console.log('Display Error', err);
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
            console.log("############ standby ##############" + value);
            console.log(JSON.stringify(result, 3, null));
            resolve(result);
          })
          .catch(err => {
            resolve(false);
          });
      })
    }

    audio_mute(value) {
      return new Promise((resolve, reject) => {
        thunder$1
          .call('org.rdk.DisplaySettings.1', 'setMuted', { "audioPort": "HDMI0", "muted": value })
          .then(result => {
            console.log("############ audio_mute ##############" + value);
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
            console.log("############ setVolumeLevel ############" + value);
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
            console.log("############ getVolumeLevel ############");
            console.log(JSON.stringify(result, 3, null));
            resolve(result);
          })
          .catch(err => {
            console.log("audio mute error:", JSON.stringify(err, 3, null));
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

  /**
   * Class to render items in Arrow Icon Item.
   */
  class ArrowIconItem extends Lightning.Component {
    /**
     * Function to render Arrow Icon elements in the Main View.
     */
    static _template() {
      return {
        Item: {
          Image: {
            x: 0,
            alpha: 1,
          },
        },
      }
    }

    _init() {
      this.tag('Image').patch({
        src: Utils.asset(this.data.url),
        w: this.w,
        h: this.h,
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

  /** Class for main view component in home UI */
  class MainView extends Lightning.Component {
    /**
     * Function to render various elements in main view.
     */
    static _template() {
      return {
        MainView: {
          x: 0,
          y: 0,
          w: 1765,
          h: 1080,
          clipping: true,
          Text1: {
            x: 10,
            y: 50,
            w: 91,
            text: {
              fontSize: 40,
              text: 'Apps',
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF,
            },
            zIndex: 0
          },
          AppList: {
            x: 0,
            y: 137,
            flex: { direction: 'row', paddingLeft: 15, wrap: false },
            type: Lightning.components.ListComponent,
            w: 1745,
            h: 300,
            itemSize: 250,
            roll: true,
            rollMax: 1745,
            horizontal: true,
            itemScrollOffset: -5,
            clipping: false,
          },
          Text2: {
            x: 10,
            y: 338,
            text: {
              fontSize: 40,
              text: 'Metro Apps',
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF,
            },
          },
          MetroApps: {
            x: 0,
            y: 410,
            type: Lightning.components.ListComponent,
            flex: { direction: 'row', paddingLeft: 20, wrap: false },
            w: 1745,
            h: 400,
            itemSize: 328,
            roll: true,
            rollMax: 1745,
            horizontal: true,
            itemScrollOffset: -4,
            clipping: false,
          },
          Text3: {
            x: 10,
            y: 665,
            text: {
              fontSize: 40,
              text: 'TVShows',
              fontStyle: 'normal',
              textColor: 0xFFFFFFFF,
            },
          },
          TVShows: {
            x: 0,
            y: 735,
            w: 1745,
            h: 400,
            type: Lightning.components.ListComponent,
            flex: { direction: 'row', paddingLeft: 20, wrap: false },
            roll: true,
            itemSize: 328,
            rollMax: 1745,
            horizontal: true,
            itemScrollOffset: -4,
            clipping: false,
          },
          RightArrow: {
            x: 0,
            y: 0,
            w: 25,
            h: 750,
            type: Lightning.components.ListComponent,
            roll: true,
            horizontal: false,
            invertDirection: true,
            alpha: 0.9,
          },
          LeftArrow: {
            x: 0,
            y: 0,
            w: 25,
            h: 750,
            type: Lightning.components.ListComponent,
            roll: true,
            horizontal: false,
            invertDirection: true,
            alpha: 0.9,
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

    _active() {
      if (this.settingsScreen) {
        let app = this.parent.parent;
        this._appAnimation = app.animation({
          duration: 0,
          repeat: 0,
          stopMethod: 'immediate',
          actions: [
            { p: 'x', v: { 0: 0, 1: -320 } },
            { p: 'y', v: { 0: 0, 1: -180 } },
            { p: 'scale', v: { 0: 1, 1: 1.17 } },
          ],
        });
        this._appAnimation.start();
        this.settingsScreen = false;
      }
    }

    /**
     * Function to set details of items in app list.
     */
    set appItems(items) {
      this.tag('AppList').items = items.map(info => {
        return {
          w: 235,
          h: 136,
          type: AppListItem,
          data: info,
          focus: 1.2,
          unfocus: 1,
          x_text: 106,
          y_text: 140,
        }
      });
      this.tag('AppList').start();
    }
    /**
    * Function to set details of items in right Icons list.
    * 
    */
    set rightArrowIcons(items) {
      this.tag('RightArrow').items = items.map((info, index) => {
        this.data = info;
        return {
          w: index == 0 ? 20 : 25,
          h: index == 0 ? 30 : 35,
          x: 1735,
          y: index == 0 ? 210 : (index == 1 ? 405 : (index == 2 ? 635 : 0)),
          type: ArrowIconItem,
          data: info,
        }
      });
      this.tag('RightArrow').start();
    }
    /**
    * Function to set details of items in left Icons list.
    * 
    */
    set leftArrowIcons(items) {
      this.tag('LeftArrow').patch({ x: 25 });
      this.tag('LeftArrow').items = items.map((info, index) => {
        this.data = info;
        return {
          w: index == 0 ? 20 : 25,
          h: index == 0 ? 30 : 35,
          y: index == 0 ? 205 : (index == 1 ? 405 : (index == 2 ? 635 : 0)),
          type: ArrowIconItem,
          data: info,
        }
      });
      this.tag('LeftArrow').start();
    }

    set metroApps(items) {
      this.tag('MetroApps').items = items.map((info, index) => {
        return {
          w: 308,
          h: 200,
          type: ListItem,
          data: info,
          focus: 1.2,
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
          w: 308,
          h: 200,
          type: ListItem,
          data: info,
          focus: 1.2,
          unfocus: 1,
          x_text: 218,
          y_text: 264,
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
            if (0 != this.tag('AppList').index) {
              this.tag('AppList').setPrevious();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('AppList').element.data.url);
              return this.tag('AppList').element
            }
          }
          _handleDown() {
            this._setState('MetroApps');
          }
          _handleUp() {
            console.log('handle up');
            this.fireAncestors('$goToTopPanel', 0);
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
              } else if (Storage.get('applicationType') == 'Amazon') {
                Storage.set('applicationType', '');
                appApi.suspendPremiumApp('Amazon');
                appApi.setVisibility('ResidentApp', true);
              } else if (Storage.get('applicationType') == 'Netflix') {
                Storage.set('applicationType', '');
                appApi.suspendPremiumApp('Netflix');
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
            if (this.tag('MetroApps').length) {
              this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('MetroApps').element.data.url);
              return this.tag('MetroApps').element
            }
          }
          _handleUp() {
            this._setState('AppList');
          }
          _handleRight() {
            if (this.tag('MetroApps').length - 1 != this.tag('MetroApps').index) {
              this.tag('MetroApps').setNext();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('MetroApps').element.data.url);
              return this.tag('MetroApps').element
            }
          }
          _handleLeft() {
            if (0 != this.tag('MetroApps').index) {
              this.tag('MetroApps').setPrevious();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('MetroApps').element.data.url);
              return this.tag('MetroApps').element
            } else {
              this.reset();

            }
          }
          _handleDown() {
            this._setState('TVShows');
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
            this.fireAncestors('$scroll', -300);
          }
          _getFocused() {
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
            if (0 != this.tag('TVShows').index) {
              this.tag('TVShows').setPrevious();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('TVShows').element.data.url);
              return this.tag('TVShows').element
            }
          }
          _handleUp() {
            this._setState('MetroApps');
          }
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

  function kindOf(val) {
    var typeOfVal = typeof val;

    {
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
  class TopPanel extends Lightning.Component {
    static _template() {
      return {
        TopPanel: {
          x: 0,
          y: 0,
          w: 1920,
          h: 171,
          Mic: {
            x: 80,
            y: 100,
            mountY: 0.5,
            src: Utils.asset('/images/topPanel/mic_new.png'),
            w: 70,
            h: 70,
          },
          WaveRectangle: {
            x: 165, y: 70, w: 200, h: 60, clipping: true, rect: false, colorTop: 0xffffffff, colorBottom: 0xffffffff,
            Wave: {
              x: -200, y: 2, w: 400, h: 60, rect: true,
              src: Utils.asset('/images/topPanel/wave.png'),
              zIndex: 2
            },
            alpha: 0
          },
          Search: {
            x: 200,
            y: 105,
            mountY: 0.5,
            text: { text: 'Search TV shows, movies and more...', fontSize: 42 },
            w: 600,
            h: 50,
            alpha: 0.5,
          },
          Settings: {
            x: 1445,
            y: 100,
            mountY: 0.5,
            src: Utils.asset('/images/topPanel/settings_new.png'),
            w: 70,
            h: 70,
          },
          Time: {
            x: 1550,
            y: 105,
            mountY: 0.5,
            text: { text: '', fontSize: 48 },
            w: 160,
            h: 60,
          },
          Day: {
            x: 1740,
            y: 95,
            mountY: 0.5,
            text: { text: '', fontSize: 32 },
            w: 95,
            h: 32,
          },
          Date: {
            x: 1741,
            y: 115,
            mountY: 0.5,
            text: { text: '', fontSize: 22 },
            w: 95,
            h: 22,
          },
          Border: {
            x: 80,
            y: 170,
            mountY: 0.5,
            RoundRectangle: {
              zIndex: 2,
              texture: lng.Tools.getRoundRect(1761, 0, 0, 3, 0xffffffff, true, 0xffffffff),
            },
            alpha: 0.4
          }
        },
      }
    }

    waveAnimation() {
      const lilLightningAnimation = this.tag('Wave').animation({
        duration: 3,
        repeat: -1,
        actions: [
          { p: 'x', v: { 0: -165, 0.5: 0, 1: 0 } }
        ]
      });
      lilLightningAnimation.start();
    }

    _init() {
      this.indexVal = 0,
        this.timeZone = null;
      this.audiointerval = null;
      this.waveAnimation();
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

    _build() {
      setInterval(() => {
        let _date = this.updateTime();
        if (this.timeZone) {
          this.tag('Time').patch({ text: { text: _date.strTime } });
          this.tag('Day').patch({ text: { text: _date.strDay } });
          this.tag('Date').patch({ text: { text: _date.strDate } });
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
      if (this.timeZone) {
        let date = new Date();
        date = new Date(date.toLocaleString('en-US', { timeZone: this.timeZone }));

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

    setVisibilityWave(value) {
      this.tag('WaveRectangle').patch({
        alpha: value
      });
    }

    setVisibilitySearch(value) {
      this.tag('Search').patch({
        alpha: value
      });
    }

    static _states() {
      return [
        class Mic extends this{
          $enter() {
            this.updateIcon('Mic', '/images/topPanel/mic_focused.png');
            this.setVisibilityWave(1);
            this.setVisibilitySearch(0);
          }
          _handleEnter() {
          }
          _getFocused() {
            this.updateIcon('Mic', '/images/topPanel/mic_focused.png');
            this.setVisibilityWave(1);
            this.setVisibilitySearch(0);
          }
          _exit() {
            this.updateIcon('Mic', '/images/topPanel/mic_new.png');
            this.setVisibilityWave(0);
            this.setVisibilitySearch(1);
          }

          _handleKey(key) {
            if (key.keyCode == 39 || key.keyCode == 13) {
              this.updateIcon('Mic', '/images/topPanel/mic_new.png');
              this.setVisibilityWave(0);
              this.setVisibilitySearch(1);
              this._setState('Search');
            } else if (key.keyCode == 40) {
              this.updateIcon('Mic', '/images/topPanel/mic_new.png');
              this.setVisibilityWave(0);
              this.setVisibilitySearch(1);
              this.fireAncestors('$goToMainView', 0);
            }
          }
        },
        class Search extends this{
          $enter() {
            this.tag('Search').patch({
              alpha: 1
            });
          }
          $exit() {
            this.tag('Search').patch({
              alpha: 0.5
            });
          }
          _handleEnter() {
          }
          _getFocused() {
          }
          _handleKey(key) {
            if (key.keyCode == 39 || key.keyCode == 13) {
              this.updateIcon('Mic', '/images/topPanel/mic_new.png');
              this._setState('Setting');
            } else if (key.keyCode == 40) {
              this.tag('Search').patch({
                alpha: 0.5
              });
              this.fireAncestors('$goToMainView', 0);
            } else if (key.keyCode == 37) {
              console.log(this.indexVal);
              this.updateIcon('Mic', '/images/topPanel/mic_new.png');
              this._setState('Mic');
            }
          }
        },
        class Setting extends this{
          $enter() {
            this.updateIcon('Settings', '/images/topPanel/setting_focused.png');
          }
          _handleDown() {
            this.updateIcon('Settings', '/images/topPanel/settings_new.png');
            this.fireAncestors('$goToMainView', 0);
          }
          _handleLeft() {
            this.updateIcon('Settings', '/images/topPanel/settings_new.png');
            this._setState('Search');
          }
          _handleEnter() {
            Router.navigate('settings/SettingsScreen/0', false);
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
   * Variable to store the timer
   */
  var timeout;

  /**
   * Class to render the UI controls for the video player.
   */
  class PlayerControls extends Lightning.Component {
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
          texture: Lightning.Tools.getRoundRect(1740, 6, 6, 0, 0, true, 0x80eef1f3),
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
            texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
            ControlIcon: {
              x: item.x,
              y: item.y,
              texture: Lightning.Tools.getSvgTexture(item.src, 50, 50),
            },
          })),
        },
        Audio: {
          x: 90,
          y: 240,
          texture: Lightning.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xff8e8e8e),
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
          texture: Lightning.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xff8e8e8e),
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
        texture: Lightning.Tools.getRoundRect(
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
          texture: Lightning.Tools.getRoundRect(30, 30, 15, 0, 0, true, 0xffffffff),
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
            texture: Lightning.Tools.getSvgTexture(
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
          texture: Lightning.Tools.getSvgTexture(
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
              texture: Lightning.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xffffffff),
              scale: 1.1,
            });
            this.tag('Audio').tag('AudioOptions').color = 0xff000000;
          }
          $exit() {
            this.tag('Audio').patch({
              texture: Lightning.Tools.getRoundRect(240, 90, 6, 0, 0, true, 0xff8e8e8e),
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
              texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
              scale: 1.1,
            });
            this.tag('Buttons')
              .children[1].tag('ControlIcon')
              .patch({
                texture: Lightning.Tools.getSvgTexture(this.focus, 50, 50)
              });
          }
          $exit() {
            this.unfocus = this.toggle
              ? Utils.asset('images/player/play.png')
              : Utils.asset('images/player/pause.png');
            this.tag('Buttons').children[1].patch({
              texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
              scale: 1,
            });
            this.tag('Buttons')
              .children[1].tag('ControlIcon')
              .patch({
                texture: Lightning.Tools.getSvgTexture(this.unfocus, 50, 50)
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
              texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
            });
            this.tag('Buttons')
              .children[1].tag('ControlIcon')
              .patch({
                texture: Lightning.Tools.getSvgTexture(this.focus, 50, 50)
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
              texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
              scale: 1.1,
            });
            this.tag('Buttons')
              .children[2].tag('ControlIcon')
              .patch({
                texture: Lightning.Tools.getSvgTexture(
                  Utils.asset('images/player/fast-forward-focus.png'),
                  50,
                  50
                ),
              });
          }
          $exit() {
            this.tag('Buttons').children[2].patch({
              texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
              scale: 1,
            });
            this.tag('Buttons')
              .children[2].tag('ControlIcon')
              .patch({
                texture: Lightning.Tools.getSvgTexture(
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
              texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xffffffff),
              scale: 1.1,
            });
            this.tag('Buttons')
              .children[0].tag('ControlIcon')
              .patch({
                texture: Lightning.Tools.getSvgTexture(
                  Utils.asset('images/player/rewind-focus.png'),
                  50,
                  50
                ),
              });
          }
          $exit() {
            this.tag('Buttons').children[0].patch({
              texture: Lightning.Tools.getRoundRect(80, 80, 40, 0, 0, true, 0xff8e8e8e),
              scale: 1,
            });
            this.tag('Buttons')
              .children[0].tag('ControlIcon')
              .patch({
                texture: Lightning.Tools.getSvgTexture(
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
              texture: Lightning.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xffffffff),
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
              texture: Lightning.Tools.getRoundRect(130, 90, 6, 0, 0, true, 0xff8e8e8e),
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
  class AAMPVideoPlayer extends Lightning.Component {
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
  class Network {
    constructor() {
      this._events = new Map();
      const config = {
        host: '127.0.0.1',
        port: 9998,
        default: 1,
      };
      this._thunder = thunderJS(config);
      this.callsign = 'org.rdk.Network';
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
            console.log(result);
            resolve(result.ip);
          }
          reject(false);
        }).catch(err => {
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

  var appApi$2 = new AppApi();
  appApi$2.getIP().then(ip => {
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

  var powerState = 'ON';
  var audio_mute = false;
  var audio_volume = 50;
  var appApi$1 = new AppApi();

  /** Class for home screen UI */
  class HomeScreen extends Lightning.Component {
    /**
     * Function to render various elements in home screen.
     */
    static _template() {
      return {
        BackgroundImage: {
          w: 1920,
          h: 1080,
          alpha: 6,
        },
        BackgroundColor: {
          w: 1920,
          h: 1080,
          alpha: 0.9,
          rect: true,
          color: 0xff20344D
        },

        TopPanel: {
          type: TopPanel,
        },
        View: {
          x: 80,
          y: 171,
          w: 1994,
          h: 919,
          clipping: true,
          MainView: {
            w: 1994,
            h: 919,
            type: MainView,
          },
        },
        IpAddress: {
          x: 1850,
          y: 1060,
          mount: 1,
          text: {
            text: 'IP:NA',
            textColor: 0xffffffff,
            fontSize: 30,
          },
        },
        Player: { type: AAMPVideoPlayer },
      }
    }

    _init() {
      this.homeApi = new HomeApi();
      var appItems = this.homeApi.getAppListInfo();
      var data = this.homeApi.getPartnerAppsInfo();
      console.log(data);
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

      this._setState('MainView');
      this.initialLoad = true;
      this.networkApi = new Network();
      this.networkApi.activate().then(result => {
        if (result) {
          this.networkApi.registerEvent('onIPAddressStatusChanged', notification => {
            if (notification.status == 'ACQUIRED') {
              this.tag('IpAddress').text.text = 'IP:' + notification.ip4Address;
              location.reload(true);
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

        let value = !audio_mute;
        appApi$1.audio_mute(value).then(res => {
          console.log("__________AUDIO_MUTE_______________________F7");
          console.log(JSON.stringify(res, 3, null));

          if (res.success == true) {
            audio_mute = value;
          }
          console.log("audio_mute:" + audio_mute);
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
        // todo
      });
    }
    /**
     * Fireancestor to set the state to player.
     */
    $goToPlayer() {
      this._setState('Player');
      this.play();
    }

    /**
     * Function to scroll
     */
    $scroll(y) {
      this.tag('MainView').setSmooth('y', y, { duration: 0.5 });
    }

    /**
     * Function to hide the home UI.
     */
     hide() {
      this.tag('BackgroundImage').patch({ alpha: 0 });
      this.tag('BackgroundColor').patch({ alpha: 0 });
      this.tag('MainView').patch({ alpha: 0 });
      this.tag('TopPanel').patch({ alpha: 0 });
    }

    /**
       * Function to show home UI.
     */
     show() {
      this.tag('BackgroundImage').patch({ alpha: 1 });
      this.tag('BackgroundColor').patch({ alpha: 1 });
      this.tag('MainView').patch({ alpha: 1 });
      this.tag('TopPanel').patch({ alpha: 1 });
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
        class MainView extends this {
          _getFocused() {
            return this.tag('MainView')
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
   * Class for rendering items in UI list.
   */
  class Item extends Lightning.Component {
    static _template() {
      return {
        Item: {
          w: 300,
          h: 150,
          rect: true,
          color: 0xFFDBEBFF,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
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

  /**
   * Class for splash screen.
   */
  class SplashScreen extends Lightning.Component {
    static _template() {
      return {
        Splashscreen: {
          w: 1920,
          h: 1080,
          alpha: 1,
          src: Utils.asset('/images/splash/Splash-Background.jpg'),
          //just to cache the image
          Cache: {
            w: 0,
            h: 0,
            x: -1920,
            src: Utils.asset('/images/splash/Splash-Background.jpg'),
          },
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
              fontSize: 55,
              textAlign: 'center',
              text: 'Choose a Service',
              textColor: 0xffffffff,
            },
          },
          UIList: {
            x: 1920 / 2 - 20,
            y: 500,
            type: Lightning.components.ListComponent,
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
      this.remotePaired = true;
      this.hasInternet = true;
      this._bt = new BluetoothApi();
      this._bt.activate();
      this._bt
        .getPairedDevices()
        .then(() => this._bt.getConnectedDevices())
        .then(() => {
          let paired = this._bt.pairedDevices;
          let connected = this._bt.connectedDevices;

          if (paired.length == 0 && connected.length == 0) {
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
                this.tag('AutoRemotePair.Description').text =
                  'Please put the remote in pairing mode, Connected to ' + connectedDevices[0].name;
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
            console.log('get focused called with ele and tag ' + _tagEle + " ::bgColor ::" + bgColor);
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
  /**Color constants */
  var COLORS = {
    textColor: 0xffffffff,
    titleColor: 0xffffffff,
    hightlightColor: 0xffc0c0c0,
    headingColor: 0xffffffff,
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
   * Class for rendering items in Settings screen.
   */
  class SettingsItem extends Lightning.Component {
    static _template() {
      return {
        Item: {
          w: 1920 / 3 - 70,
          h: 65,
          rect: true,
          color: 0x00000000,
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 9 },
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
          x: 10,
          y: this.tag('Item').h / 2,
          mountY: 0.5,
          text: { text: item, fontSize: 25, textColor: COLORS.textColor },
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
      this.tag('Item').color = COLORS.hightlightColor;
    }

    _unfocus() {
      this.tag('Item').color = 0x00000000;
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
        Item: {
          w: 1920 / 3 - 70,
          h: 65,
          rect: true,
          color: 0x00000000,
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 9 },
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
          y: 32.5,
          mountY: 0.5,
          text: { text: item.name, fontSize: 25, textColor: COLORS.textColor },
        },

        Right: {
          x: 1920 / 3 - 80,
          mountX: 1,
          y: 32.5,
          mountY: 0.5,
          flex: { direction: 'row' },
          Text: { x: 0, flexItem: {}, text: { text: this.status, fontSize: 25 } },
          Info: {
            color: 0xff0000ff,
            flexItem: { marginLeft: 10 },
            texture: Lightning.Tools.getSvgTexture(Utils.asset('images/info.png'), 32.5, 32.5),
          },
        },
      });
      if (this.status == 'Connected') {
        this.tag('Item.Right.Info').visible = false;
      } else {
        this.tag('Item.Right.Info').visible = true;
      }
    }

    _focus() {
      this.tag('Item').color = COLORS.hightlightColor;
    }

    _unfocus() {
      this.tag('Item').color = 0x00000000;
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
  class BluetoothPairingScreen$1 extends Lightning.Component {
    static _template() {
      return {
        PairingScreen: {
          x: 0,
          y: 0,
          w: 1920 / 3,
          h: 1080,
          rect: true,
          color: 0xff364651,
        },
        Title: {
          x: 20,
          y: 100,
          text: { text: '', fontSize: 30, textColor: COLORS.titleColor },
        },
        List: {
          x: 20,
          y: 150,
          type: Lightning.components.ListComponent,
          w: 1920 / 3,
          h: 400,
          itemSize: 65,
          horizontal: false,
          invertDirection: true,
          roll: true,
        },
        Status: {
          x: 20,
          y: 500,
          Text: {
            text: {
              text: 'Enter the below code in your Bluetooth device and press enter',
              wordWrapWidth: 1920 / 3 - 70,
              fontSize: 30,
            },
          },
          Code: {
            x: 0,
            y: 60,
            text: { text: '' },
          },
          visible: false,
        },
      }
    }
    set item(item) {
      this.tag('Status').visible = false;
      this.tag('Title').text = item.name;
      var options = [];
      this._item = item;
      if (item.paired) {
        if (item.connected) {
          options = ['Disconnect', 'Unpair', 'Cancel'];
        } else {
          options = ['Connect', 'Unpair', 'Cancel'];
        }
      } else {
        options = ['Pair', 'Cancel'];
      }
      this.tag('List').items = options.map((item, index) => {
        return {
          ref: item,
          w: 1920 / 3,
          h: 65,
          type: SettingsItem,
          item: item,
        }
      });
    }

    set code(code) {
      this.tag('Status.Code').text.text = code;
      this.tag('Status').visible = true;
    }

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
      this.fireAncestors('$pressEnter', this.tag('List').element.ref);
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
  class BluetoothScreen extends Lightning.Component {
    static _template() {
      return {
        Switch: {
          x: 825,
          y: 310,
          Shadow: {
            alpha: 0,
            x: -15,
            y: 0,
            color: 0x66000000,
            texture: lng.Tools.getShadowRect(205, 60, 50, 10, 20),
          },
          Button: {
            h: 60,
            w: 180,
            src: Utils.asset('images/switch-on-new.png'),
          },
        },
        Name: {
          x: 1050,
          y: 320,
          text: {
            text: 'Bluetooth now discoverable as Xfinity x1 guest Remote',
            textColor: COLORS.textColor,
            fontSize: 28,
          },
        },
        Networks: {
          x: 825,
          y: 400,
          flex: { direction: 'column' },
          PairedNetworks: {
            flexItem: { margin: 20 },
            w: 1920 / 3,
            h: 30,
            Title: {
              text: {
                text: 'My Devices: ',
                textColor: COLORS.titleColor,
                fontSize: 32,
              },
            },
            List: {
              x: 0,
              y: 65,
              type: Lightning.components.ListComponent,
              w: 1920 / 3,
              itemSize: 65,
              horizontal: false,
              invertDirection: true,
              roll: true,
            },
          },
          AvailableNetworks: {
            flexItem: { margin: 20, marginTop: 30 },
            w: 1920 / 3,
            h: 30,
            Title: {
              text: {
                text: 'Other Devices: ',
                textColor: COLORS.titleColor,
                fontSize: 32,
              },
            },
            Loader: {
              x: 250,
              y: -10,
              w: 50,
              h: 50,
              color: 0xff000000,
              src: Utils.asset('images/loader.png'),
              visible: false,
            },

            List: {
              x: 0,
              y: 65,
              w: 1920 / 3,
              h: 100,
              type: Lightning.components.ListComponent,
              itemSize: 65,
              horizontal: false,
              invertDirection: true,
              roll: true,
            },
          },
          visible: false,
        },
        PairingScreen: {
          x: 1920 - 1920 / 3,
          y: 0,
          w: 1920 / 3,
          h: 1080,
          visible: false,
          type: BluetoothPairingScreen$1,
        },
        Message: {
          x: 1920 - 1920 / 3 + 40,
          y: 950,
          text: { text: '' },
        },
      }
    }

    toggleBtnAnimationX() {
      const lilLightningAnimation = this.tag('Button').animation({
        duration: 1,
        repeat: 0,
        actions: [
          { p: 'x', v: { 0: 0, 0.5: 0, 1: 0 } }
        ]
      });
      lilLightningAnimation.start();
    }
    toggleBtnAnimationY() {
      const lilLightningAnimation = this.tag('Button').animation({
        duration: 1,
        repeat: 0,
        actions: [
          { p: 'x', v: { 0: 0, 0.5: 0, 1: 0 } }
        ]
      });
      lilLightningAnimation.start();
    }

    _init() {
      this.loadingAnimation = this.tag('Networks.AvailableNetworks.Loader').animation({
        duration: 1,
        repeat: -1,
        stopMethod: 'immediate',
        stopDelay: 0.2,
        actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: Math.PI * 2 } }],
      });
      this.loadingAnimation.play();
      this._bt = new BluetoothApi();
      this._bluetooth = true;
      this._bluetoothIcon = true;


      this._activateBluetooth();
      this._bluetooth = true;
      if (this._bluetooth) {
        this.tag('Networks').visible = true;
      }
      this._pairedNetworks = this.tag('Networks.PairedNetworks');
      this._availableNetworks = this.tag('Networks.AvailableNetworks');
      this.renderDeviceList();
    }

    /**
     * Function to be excuted when the Bluetooth screen is enabled.
     */
    _enable() {
      console.log('eanble--');
      this._setState('Button');
    }

    /**
     * Function to be executed when the Bluetooth screen is disabled from the screen.
     */
    _disable() {
      clearInterval(this.scanTimer);
    }

    /**
     * Function to render list of Bluetooth devices
     */
    renderDeviceList() {
      this._bt.getPairedDevices().then(result => {
        this._pairedList = result;
        this._pairedNetworks.h = this._pairedList.length * 65 + 30;
        this._pairedNetworks.tag('List').h = this._pairedList.length * 65;
        this._pairedNetworks.tag('List').items = this._pairedList.map((item, index) => {
          item.paired = true;
          return {
            ref: 'Paired' + index,
            w: 1920 / 3,
            h: 65,
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
        this._availableNetworks.h = this._otherList.length * 65 + 30;
        this._availableNetworks.tag('List').h = this._otherList.length * 65;
        this._availableNetworks.tag('List').items = this._otherList.map((item, index) => {
          return {
            ref: 'Other' + index,
            w: 1920 / 3,
            h: 65,
            type: BluetoothItem,
            item: item,
          }
        });
      });
    }

    static _states() {
      return [
        class Button extends this{
          $enter() {
            console.log('Button enter');

          }
          $exit() {
            console.log('Botton exit');
            this.tag('Button').patch({
              h: 60,
              w: 180
            });
          }
          _getFocused() {
            console.log('switch button');
            this.tag('Button').patch({
              h: 70,
              w: 200
            });
            this.tag('Shadow').patch({
              smooth: {
                alpha: 1
              }
            });
          }
          _handleEnter() {
            console.log('enterrr');
            this._bluetoothIcon = !this._bluetoothIcon;
            this.switchOnOff();
          }
          _handleLeft() {
            console.log('handle left bluetooth');
            this.tag('Button').patch({
              h: 60,
              w: 180
            });
            this.tag('Shadow').patch({
              smooth: {
                alpha: 0
              }
            });
            this.fireAncestors('$goToSideMenubar', 0);
          }
        },
        class Switch extends this {
          $enter() {
            console.log('Switch enter');
            this.tag('Button').patch({
              h: 70
            });
          }
          $exit() {
            console.log('Switch exit');
            this.tag('Button').patch({
              h: 60
            });
            this.tag('Shadow').patch({
              smooth: {
                alpha: 0
              }
            });
          }
          _getFocused() {
            console.log('switch focus');
            this.tag('Button').patch({
              h: 70
            });
            this.tag('Shadow').patch({
              smooth: {
                alpha: 1
              }
            });
          }
          _handleLeft() {
            console.log('handle left bluetooth');
            this.fireAncestors('$goToSideMenubar', 0);
            this.tag('Shadow').patch({
              smooth: {
                alpha: 0
              }
            });
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
          _handleEnter() {
            console.log('enterrr');
            this._bluetoothIcon = !this._bluetoothIcon;
            this.switchOnOff();
          }
        },
        class PairedDevices extends this {
          $enter() { }
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
          $enter() { }
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
        class PairingScreen extends this {
          $enter() {
            this._disable();
            this._bt.stopScan();
          }
          _getFocused() {
            return this.tag('PairingScreen')
          }
          $pressEnter(option) {
            if (option === 'Cancel') {
              this._setState('Switch');
            } else if (option === 'Pair') {
              this._bt.pair(this._availableNetworks.tag('List').element._item.deviceID).then(() => { });
            } else if (option === 'Connect') {
              this._bt
                .connect(
                  this._pairedNetworks.tag('List').element._item.deviceID,
                  this._pairedNetworks.tag('List').element._item.deviceType
                )
                .then(result => {
                  if (!result) {
                    this.tag('Message').text = 'CONNECTION FAILED';
                    this._setState('Switch');
                  }
                  setTimeout(() => {
                    this.tag('Message').text = '';
                  }, 2000);
                });
            } else if (option === 'Disconnect') {
              this._bt
                .disconnect(
                  this._pairedNetworks.tag('List').element._item.deviceID,
                  this._pairedNetworks.tag('List').element._item.deviceType
                )
                .then(() => { });
              this._setState('Switch');
            } else if (option === 'Unpair') {
              this._bt.unpair(this._pairedNetworks.tag('List').element._item.deviceID).then(() => { });
              this._setState('Switch');
            }
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
            this._setState('Switch');
          }
        }
      }
    }


    switchOnOff() {
      console.log('onnnnnnnnffffffffffff' + this._bluetoothIcon);
      if (this._bluetoothIcon) {
        this.tag('Switch.Button').src = Utils.asset('images/switch-on-new.png');
        this.toggleBtnAnimationX();
        this.tag('Button').patch({
          src: Utils.asset('images/switch-on-new.png')
        });
      } else if (!this._bluetoothIcon) {
        this.toggleBtnAnimationY();
        this.tag('Button').patch({
          src: Utils.asset('images/switch-off-new.png')
        });
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
            this.tag('Switch.Button').src = Utils.asset('images/switch-off-new.png');
          }
        });
      } else {
        this._bt.enable().then(result => {
          if (result.success) {
            this._bluetooth = true;
            this.tag('Networks').visible = true;
            this.tag('Switch.Button').src = Utils.asset('images/switch-on-new.png');
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
          this._setState('Switch');
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
          console.log('CONNECTION CHANGED' + JSON.stringify(notification));
          this.renderDeviceList();
          this._setState('Switch');
          if (notification.connected) {
            this.tag('Message').text = 'CONNECTION SUCCESS';
          } else {
            this.tag('Message').text = 'CONNECTION FAILED';
          }
          setTimeout(() => {
            this.tag('Message').text = '';
          }, 2000);
        });
        this._bt.registerEvent('onDiscoveryCompleted', () => {
          this.tag('Networks.AvailableNetworks.Loader').visible = false;
          this.renderDeviceList();
        });
        this._bt.registerEvent('onDiscoveryStarted', () => {
          this.tag('Networks.AvailableNetworks.Loader').visible = true;
        });
        this._bt.registerEvent('onRequestFailed', notification => {
          this._bt.startScan();
          this.renderDeviceList();
          this._setState('Switch');
          this.tag('Message').text = notification.newStatus;
          setTimeout(() => {
            this.tag('Message').text = '';
          }, 2000);
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
        Item: {
          w: 1920 / 3 - 70,
          h: 65,
          rect: true,
          color: 0x00000000,
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 9 },
        },
      }
    }

    /**
     * Function to set contents of an item in the Bluetooth screen.
     */
    set item(item) {
      this._item = item;
      this.status = item.connected ? 'Connected' : 'Not Connected';
      this.tag('Item').patch({
        Left: {
          x: 10,
          y: 32.5,
          mountY: 0.5,
          text: { text: item.ssid, fontSize: 25, textColor: COLORS.textColor },
        },

        Right: {
          x: 1920 / 3 - 80,
          mountX: 1,
          y: 32.5,
          mountY: 0.5,
          flex: { direction: 'row' },
          Lock: {
            color: 0xff000000,
            flexItem: { marginLeft: 10 },
            texture: Lightning.Tools.getSvgTexture(Utils.asset('images/wifi-lock.png'), 32.5, 32.5),
          },
          Icon: {
            color: 0xff000000,
            flexItem: { marginLeft: 10 },
            texture: Lightning.Tools.getSvgTexture(Utils.asset('images/wifi-icon.png'), 32.5, 32.5),
          },
          Info: {
            color: 0xff000000,
            flexItem: { marginLeft: 10 },
            texture: Lightning.Tools.getSvgTexture(Utils.asset('images/info.png'), 32.5, 32.5),
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
      this.tag('Item').color = COLORS.hightlightColor;
    }

    _unfocus() {
      this.tag('Item').color = 0x00000000;
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
        this.callsign = 'org.rdk.Wifi';
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
          .call(this.callsign, 'startScan', { incremental: false, ssid: '', frequency: '' })
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
   * Class to render the keypad for the wifi screen.
   */
  class Keypad extends Lightning.Component {
    static _template() {
      return {
        Wrapper: {
          flex: { direction: 'row' },
        },
      }
    }

    /**
     * Function to add items to the list.
     */
    set items(items) {
      this._scroll = true;
      this.tag('Wrapper').children = items;
      this._index = 0;
      if (items.length > 0) {
        this._setState('Filled');
      } else {
        this._setState('Empty');
      }
    }

    set wrap(bool) {
      if (bool) {
        let wrapper = this.tag('Wrapper');
        wrapper.w = 428;
        wrapper.h = 56;
        this.tag('Wrapper').patch({
          flex: { direction: 'row', wrap: true },
        });
      }
      this._wrap = true;
    }
    get items() {
      return this.tag('Wrapper').children
    }

    get currentItem() {
      return this.items[this._index]
    }

    get length() {
      return this.items.length
    }

    set orientation(v) {
      this._orientation = v;
      if (v === 'horizontal') {
        this.tag('Wrapper').patch({ flex: { direction: 'row' } });
      } else {
        this.tag('Wrapper').patch({ flex: { direction: 'column' } });
      }
    }

    get orientation() {
      return this._orientation || 'horizontal'
    }

    set jump(bool) {
      this._jump = bool;
    }

    get jump() {
      return this._jump || false
    }

    set jumpToStart(bool) {
      this._jumpToStart = bool;
    }

    get jumpToStart() {
      return this._jumpToStart !== undefined ? this._jumpToStart : this.jump
    }

    set jumpToEnd(bool) {
      this._jumpToEnd = bool;
    }

    get jumpToEnd() {
      return this._jumpToEnd !== undefined ? this._jumpToEnd : this.jump
    }

    _navigate(dir) {
      this._prevY = this.currentItem.finalY;
      this.orientation;
      if (dir === 'right' || dir === 'left' || dir === 'up' || dir === 'down') {
        const length = this.items.length;
        const currentIndex = this._index;
        let targetIndex = currentIndex + 1;
        if (dir === 'left' || (dir === 'up' && this._wrap === false)) {
          targetIndex = currentIndex - 1;
        }
        if (dir === 'up' && this._wrap === true) {
          let n = Math.floor(this.tag('Wrapper').w / this.currentItem.finalW);
          let pos = currentIndex - n;
          targetIndex = currentIndex - n >= 0 ? pos : -1;
        }
        if (dir === 'down' && this._wrap === true) {
          let n = Math.floor(this.tag('Wrapper').w / this.currentItem.finalW);
          let pos = currentIndex + n;
          targetIndex = pos < length ? pos : -1;
          if (targetIndex == -1) return this.fireAncestors('$listEnd')
        }
        if (targetIndex < 0) {
          return this.fireAncestors('$listStart')
        }
        if (targetIndex > -1 && targetIndex < length) {
          this._index = targetIndex;
        } else if (this.jump || this.jumpToStart || this.jumpToEnd) {
          if (targetIndex < 0 && this.jumpToEnd) {
            this._index = targetIndex + length;
          } else if (targetIndex === length && this.jumpToStart) {
            this._index = 0;
          }
        } else {
          return false
        }

        if (currentIndex !== this._index) {
          this.indexChanged({ index: this._index, previousIndex: currentIndex });
        }
      }
      //return false
    }

    setIndex(targetIndex) {
      if (targetIndex > -1 && targetIndex < this.items.length) {
        const currentIndex = this._index;
        this._index = targetIndex;
        this.indexChanged({ index: this._index, previousIndex: currentIndex });
      }
    }

    indexChanged(event) {
      this.signal('indexChanged', event);
    }

    _getFocused() {
      return this
    }

    _construct() {
      this._index = 0;
    }

    _init() {
      this._setState('Empty');
    }

    static _states() {
      return [
        class Empty extends this { },
        class Filled extends this {
          _getFocused() {
            return this.currentItem
          }
          _handleRight() {
            return this._navigate('right')
          }

          _handleLeft() {
            return this._navigate('left')
          }

          _handleUp() {
            return this._navigate('up')
          }

          _handleDown() {
            return this._navigate('down')
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
   * Class to render the key for wifi screen
   */
  class Key extends Lightning.Component {
    _construct() {
      this._keyType = 'alphanum';
      this._fontSize = 36;
    }
    static _template() {
      return {
        Border: {
          w: this.width,
          h: this.height,
          type: Lightning.components.BorderComponent,
          colorBorder: 0xff000000,
        },
      }
    }
    set item(item) {
      this._key = item;
      this.tag('Border').w = this.w;
      this.tag('Border').h = this.h;
      this.tag('Border').colorBorder = 0xff000000;
      this.tag('Border').content = {
        Focus: {
          rect: true,
          w: this.w,
          h: this.h,
          color: 0x00c0c0c0,
        },

        Key: {
          x: this.w / 2,
          y: this.h / 2,
          mount: 0.5,
          text: { text: item, fontSize: this._fontSize, fontFace: 'Light' },
        },
      };
      if (this._keyType == 'delete') {
        this.tag('Border').content = {
          Key: {
            src: Utils.asset('images/del.png'),
            zIndex: 10,
          },
        };
      }
    }
    set keyType(type) {
      this._keyType = type;
    }
    set fontSize(size) {
      this._fontSize = size;
    }
    _focus() {
      this.tag('Border').content = {
        Focus: { color: 0xffc0c0c0 },
        Key: {
          color: 0xff000000,
        },
      };
      this.tag('Border').colorBorder = 0xffc0c0c0;
    }
    _unfocus() {
      this.tag('Border').content = {
        Focus: { color: 0x00c0c0c0 },
        Key: {
          color: 0xffffffff,
        },
      };
      this.tag('Border').colorBorder = 0xff000000;
    }
    _handleEnter() {
      this.fireAncestors('$pressedKey', this._key, this._keyType);
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
   * Class that contains the data for the keypad.
   */
  class KeyDetails {
    getAlphabet() {
      let alphabet = 'abcdefghijklmnopqrstuvwxyz  '.split('');
      return alphabet
    }
    getSymbols() {
      let symbols = '1234567890+/:;()$$@"\'.,?!#*-'.split('');
      return symbols
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
   * Class to render the key for type selection
   */
  class SelectionKey extends Key {
    set item(item) {
      this._key = item;
    }
    _init() {
      this._arr = [
        [25, 0, 0, 25],
        [0, 0, 0, 0],
        [0, 25, 25, 0],
      ];
      this.patch({
        Bg: {
          x: 0,
          y: 0,
          texture: Lightning.Tools.getRoundRect(
            143,
            53,
            this._arr[this._keyType],
            1,
            0xff000000,
            true,
            0x00000000
          ),
        },
        Text: {
          x: this.w / 2,
          y: this.h / 2,
          mount: 0.5,
          text: { text: this._key, fontSize: 24, textColor: 0xffffffff, fontFace: 'Regular' },
        },
      });
    }

    _focus() {
      this.tag('Text').text.fontStyle = 'Bold';
      this.tag('Text').text.textColor = 0xff000000;
      this.patch({
        Bg: {
          x: 0,
          y: 0,
          texture: Lightning.Tools.getRoundRect(
            143,
            56,
            this._arr[this._keyType],
            0,
            0xffc0c0c0,
            true,
            0xffc0c0c0
          ),
        },
      });
    }

    _unfocus() {
      this.tag('Text').text.fontStyle = 'normal';
      this.tag('Text').text.textColor = 0xffffffff;
      this.patch({
        Bg: {
          x: 0,
          y: 0,
          texture: Lightning.Tools.getRoundRect(
            143,
            53,
            this._arr[this._keyType],
            1,
            0xff000000,
            true,
            0x00000000
          ),
        },
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
   * Class to render the wifi password screen.
   */
  class WiFiPasswordScreen extends Lightning.Component {
    _construct() {
      this._width = 428;
      this._height = 56;
      this._radius = 28;
      this._strokeWidth = 2;
      this.keySpace = 5;
    }
    static _template() {
      return {}
    }
    _init() {
      this._api = new KeyDetails();

      this.patch({
        src: Utils.asset('images/tvShows/background.jpg'),
        w: 440,
        h: 560,
        Entry: {
          x: 4,
          y: 10,
          texture: Lightning.Tools.getRoundRect(
            this._width,
            this._height,
            this._radius,
            this._strokeWidth,
            0xff1b1b1b,
            true,
            0x00a5a5a5
          ),
          Text: {
            x: 20,
            y: this._height / 2 + 5,
            mountY: 0.5,
            text: { text: 'Password', fontSize: 18, fontFace: 'Light', textColor: 0xffa5a5a5 },
          },
          Pwd: {
            x: 130,
            y: this._height / 2 + 5,
            mountY: 0.5,
            text: {
              text: '',
              fontSize: 24,
              fontFace: 'Light',
              textColor: 0xffc0c0c0,
              wordWrapWidth: this._width - 130,
              wordWrap: false,
              textOverflow: 'ellipsis',
            },
          },
        },
        Selection: {
          x: 4,
          y: this._height + 21,
          texture: Lightning.Tools.getRoundRect(
            this._width,
            this._height,
            this._radius,
            this._strokeWidth,
            0x001b1b1b,
            true,
            0x00a5a5a5
          ),
          Types: {
            type: Lightning.components.ListComponent,
            itemSize: 143,
            w: this._width,
            h: this._height,
            clipping: true,
            roll: true,
            zIndex: 10,
          },
        },
        Keypad: {
          x: 9,
          y: (this._height + 21) * 2,
          w: this._width,
          wrap: true,
          type: Keypad,
        },
        FunctionalKeys: {
          x: 9,
          y: (this._height + 21) * 5 + 15,
          w: this._width,
          wrap: true,
          type: Keypad,
        },
        Submit: {
          x: 4,
          y: (this._height + 21) * 5 + 15 + 61,
          texture: Lightning.Tools.getRoundRect(
            this._width,
            this._height,
            this._radius,
            this._strokeWidth,
            0xff1b1b1b,
            true,
            0x00a5a5a5
          ),
          Text: {
            x: this._width / 2,
            y: this._height / 2,
            mount: 0.5,
            text: { text: 'Submit', fontSize: 24, fontFace: 'Light', textColor: 0xffffffff },
          },
        },
      });
      this.setKeypad('abc');
      let clear = {
        ref: 'Keyclear',
        w: 117,
        h: 56,
        type: Key,
        fontSize: 24,
        item: 'CLEAR',
        keyType: 'clear',
        flexItem: { marginRight: 5, marginBottom: 5 },
      };
      let space = {
        ref: 'Keyspace',
        w: 178,
        h: 56,
        type: Key,
        fontSize: 24,
        item: 'Space',
        keyType: 'space',
        flexItem: { marginRight: 5, marginBottom: 5 },
      };
      let del = {
        ref: 'Keydel',
        w: 117,
        h: 56,
        keyType: 'delete',
        type: Key,
        fontSize: 24,
        item: '',
        flexItem: { marginRight: 5, marginBottom: 5 },
      };
      this.tag('FunctionalKeys').items = [clear, space, del];
      this.tag('Selection.Types').items = ['abc', 'ABC', '#+-'].map((item, index) => {
        return {
          ref: 'Item',
          w: this._width / 3,
          h: this._height,
          fontSize: 24,
          keyType: index,
          item: item,
          type: SelectionKey,
          clipping: true,
          //keyType: 'selection' + index,
        }
      });
    }
    _active() {
      this.tag('Selection.Types').start();
      this._setState('Selection');
    }
    _inactive() {
      this.tag('Entry.Pwd').text.text = '';
    }
    $pressedKey(key, keyType) {
      console.log(key);
      let pwd = this.tag('Entry.Pwd');
      if (keyType === 'alphanum') {
        pwd.text.text = pwd.text.text + key;
      } else if (keyType === 'clear') {
        pwd.text.text = '';
      } else if (keyType === 'space') {
        pwd.text.text = pwd.text.text + ' ';
      } else if (keyType === 'delete') {
        pwd.text.text = pwd.text.text.substring(0, pwd.text.text.length - 1);
      }
    }
    setKeypad(type) {
      let data = [];
      if (type === 'abc') data = this._api.getAlphabet();
      else if (type === '#+-') data = this._api.getSymbols();
      else if (type === 'ABC') {
        data = this._api.getAlphabet().map(i => {
          return i.toUpperCase()
        });
      }
      this.tag('Keypad').items = [];
      this.tag('Keypad').items = data.map(index => {
        return {
          ref: 'Key' + index,
          w: 56,
          h: 56,
          type: Key,
          item: index,
          flexItem: { marginRight: 5, marginBottom: 5 },
        }
      });
    }
    static _states() {
      return [
        class Selection extends this {
          $enter() {
            this.setKeypad(this.tag('Selection.Types').element._key);
          }
          _getFocused() {
            return this.tag('Selection.Types').element
          }
          _handleRight() {
            if (this.tag('Selection.Types').index < this.tag('Selection.Types').length - 1) {
              this.tag('Selection.Types').setNext();
              this.setKeypad(this.tag('Selection.Types').element._key);
            }
          }
          _handleLeft() {
            if (this.tag('Selection.Types').index != 0) {
              this.tag('Selection.Types').setPrevious();
              this.setKeypad(this.tag('Selection.Types').element._key);
            }
          }
          _handleDown() {
            this._setState('Keypad');
          }
        },
        class Keypad extends this {
          _getFocused() {
            return this.tag('Keypad')
          }
          $listEnd() {
            this._setState('Function');
          }
          $listStart() {
            this._setState('Selection');
          }
        },
        class Function extends this {
          _getFocused() {
            return this.tag('FunctionalKeys')
          }
          _handleUp() {
            this._setState('Keypad');
          }
          $listEnd() {
            console.log('down');
            this._setState('Submit');
          }
          $listStart() {
            this._setState('Keypad');
          }
        },
        class Submit extends this {
          $enter() {
            this.patch({
              Submit: {
                x: 0,
                y: (this._height + 21) * 5 + 15 + 61,
                texture: Lightning.Tools.getRoundRect(
                  this._width,
                  this._height,
                  this._radius,
                  this._strokeWidth,
                  0x00c0c0c0,
                  true,
                  0xffc0c0c0
                ),
              },
            });
            this.tag('Submit.Text').text.textColor = 0xff000000;
          }
          $exit() {
            this.patch({
              Submit: {
                x: 0,
                y: (this._height + 21) * 5 + 15 + 61,
                texture: Lightning.Tools.getRoundRect(
                  this._width,
                  this._height,
                  this._radius,
                  this._strokeWidth,
                  0xff1b1b1b,
                  true,
                  0x00c0c0c0
                ),
              },
            });
            this.tag('Submit.Text').text.textColor = 0xffffffff;
          }
          _handleEnter() {
            this.fireAncestors('$password', this.tag('Entry.Pwd').text.text);
          }
          _handleUp() {
            console.log('Up');
            this._setState('Function');
          }
          _handleLeft() {
            this._setState('Function');
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
  class BluetoothPairingScreen extends Lightning.Component {
    static _template() {
      return {
        PairingScreen: {
          x: 0,
          y: 0,
          w: 1920 / 3,
          h: 1080,
          rect: true,
          color: 0xff364651,
        },
        Title: {
          x: 20,
          y: 100,
          text: { text: '', fontSize: 30, textColor: COLORS.titleColor },
        },
        List: {
          x: 20,
          y: 150,
          type: Lightning.components.ListComponent,
          w: 1920 / 3,
          h: 400,
          itemSize: 65,
          horizontal: false,
          invertDirection: true,
          roll: true,
        },
        Password: {
          type: WiFiPasswordScreen,
          x: 1920 / 3 / 2,
          y: 350,
          mountX: 0.5,
          w: 428,
          h: 56,
          alpha: 0,
        },
      }
    }
    set item(item) {
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
          w: 1920 / 3,
          h: 65,
          type: SettingsItem,
          item: item,
        }
      });
      this._setState('Pair');
    }

    static _states() {
      return [
        class Password extends this {
          $enter() {
            this.tag('Password').alpha = 1;
          }
          _getFocused() {
            return this.tag('Password')
          }
          $password(password) {
            this.fireAncestors('$startConnect', password);
          }
          $exit() {
            this.tag('Password').alpha = 0;
          }
          _handleKey(event) {
            if (
              event.keyCode == 27 ||
              event.keyCode == 77 ||
              event.keyCode == 49 ||
              event.keyCode == 158
            ) {
              this._setState('Pair');
            } else return false
          }
        },
        class Pair extends this {
          $enter() { }
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
            if (this.tag('List').element.ref == 'Connect' && this._item.security != '0') {
              this._setState('Password');
            } else {
              this.fireAncestors('$pressEnter', this.tag('List').element.ref);
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
   * Class for WiFi screen.
   */
  class WiFiScreen extends Lightning.Component {
    static _template() {
      return {
        Switch: {
          x: 825,
          y: 310,
          Shadow: {
            alpha: 0,
            x: -15,
            y: 0,
            color: 0x66000000,
            texture: lng.Tools.getShadowRect(205, 60, 50, 10, 20),
          },
          Button: {
            h: 60,
            w: 180,
            src: Utils.asset('images/switch-on-new.png'),
          },
        },
        Networks: {
          x: 900,
          y: 450,
          flex: { direction: 'column' },
          PairedNetworks: {
            flexItem: { margin: 20 },
            w: 1920 / 3,
            h: 30,
            Title: {
              text: {
                text: 'My Network',
                textColor: COLORS.titleColor,
                fontSize: 30,
              },
            },
            List: {
              x: 0,
              y: 65,
              type: Lightning.components.ListComponent,
              w: 1920 / 3,
              itemSize: 65,
              horizontal: false,
              invertDirection: true,
              roll: true,
            },
          },
          AvailableNetworks: {
            flexItem: { margin: 20, marginTop: 30 },
            w: 1920 / 3,
            h: 30,
            Title: {
              text: {
                text: 'Other Networks',
                textColor: COLORS.titleColor,
                fontSize: 30,
              },
            },
            Loader: {
              x: 250,
              y: -10,
              w: 50,
              h: 50,
              color: 0xff000000,
              src: Utils.asset('images/loader.png'),
              visible: false,
            },
            List: {
              x: 0,
              y: 65,
              w: 1920 / 3,
              h: 100,
              type: Lightning.components.ListComponent,
              itemSize: 65,
              horizontal: false,
              invertDirection: true,
              roll: true,
            },
          },
          visible: false,
        },
        PairingScreen: {
          x: 1920 - 1920 / 3,
          y: 0,
          w: 1920 / 3,
          h: 1080,
          visible: false,
          type: BluetoothPairingScreen,
        },
        IpAddress: {
          x: 1820,
          y: 920,
          mountX: 1,
          mountY: 0,
          text: {
            text: 'IP:NA',
            textColor: COLORS.titleColor,
            fontSize: 30,
          },
        },
      }
    }
    _active() {
      this._setState('Button');
    }

    _focus() {
      new Network().getIP().then(ip => {
        this.tag('IpAddress').text.text = 'IP:' + ip;
      });
    }

    toggleBtnAnimationX() {
      const lilLightningAnimation = this.tag('Button').animation({
        duration: 1,
        repeat: 0,
        actions: [
          { p: 'x', v: { 0: 0, 0.5: 0, 1: 0 } }
        ]
      });
      lilLightningAnimation.start();
    }

    toggleBtnAnimationY() {
      const lilLightningAnimation = this.tag('Button').animation({
        duration: 1,
        repeat: 0,
        actions: [
          { p: 'x', v: { 0: 0, 0.5: 0, 1: 0 } }
        ]
      });
      lilLightningAnimation.start();
    }

    _init() {
      this.loadingAnimation = this.tag('Networks.AvailableNetworks.Loader').animation({
        duration: 1,
        repeat: -1,
        stopMethod: 'immediate',
        stopDelay: 0.2,
        actions: [{ p: 'rotation', v: { sm: 0, 0: 0, 1: Math.PI * 2 } }],
      });
      this.loadingAnimation.play();
      this._wifi = new Wifi();
      this._network = new Network();
      this.wifiStatus = false;
      this._wifiIcon = true;
      this._activateWiFi();
      if (this.wiFiStatus) {
        this.tag('Networks').visible = true;
      }
      this._pairedNetworks = this.tag('Networks.PairedNetworks');
      this._availableNetworks = this.tag('Networks.AvailableNetworks');
      this._network.activate().then(result => {
        if (result) {
          this._network.registerEvent('onIPAddressStatusChanged', notification => {
            if (notification.status == 'ACQUIRED') {
              this.tag('IpAddress').text.text = 'IP:' + notification.ip4Address;
              location.reload(true);
            } else if (notification.status == 'LOST') {
              this.tag('IpAddress').text.text = 'IP:NA';
            }
          });
          this._network.registerEvent('onDefaultInterfaceChanged', notification => {
            console.log(notification);
            if (notification.newInterfaceName == 'WIFI') {
              this._wifi.setEnabled(true).then(result => {
                if (result.success) {
                  this.wifiStatus = true;
                  this.tag('Networks').visible = true;
                  this.tag('Switch.Button').src = Utils.asset('images/switch-on.png');
                  this._wifi.discoverSSIDs();
                  this.tag('Networks.AvailableNetworks.Loader').visible = true;
                }
              });
            } else if (
              notification.newInterfaceName == 'ETHERNET' ||
              notification.oldInterfaceName == 'WIFI'
            ) {
              this._wifi.disconnect();
              this.wifiStatus = false;
              this.tag('Networks').visible = false;
              this.tag('Switch.Button').src = Utils.asset('images/switch-off.png');
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
      // Todo
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
        this._pairedNetworks.h = this._pairedList.length * 65 + 30;
        this._pairedNetworks.tag('List').h = this._pairedList.length * 65;
        this._pairedNetworks.tag('List').items = this._pairedList.map((item, index) => {
          item.connected = true;
          return {
            ref: 'Paired' + index,
            w: 1920 / 3,
            h: 65,
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
        this._availableNetworks.h = this._otherList.length * 65 + 30;
        this._availableNetworks.tag('List').h = this._otherList.length * 65;
        this._availableNetworks.tag('List').items = this._otherList.map((item, index) => {
          item.connected = false;
          return {
            ref: 'Other' + index,
            w: 1920 / 3,
            h: 65,
            type: WiFiItem,
            item: item,
          }
        });
      });
    }
    switchOnOff() {
      console.log('onnnnnnnnffffffffffff' + this._bluetoothIcon);
      if (this._wifiIcon) {
        this.tag('Switch.Button').src = Utils.asset('images/switch-on-new.png');
        this.toggleBtnAnimationX();
        this.tag('Button').patch({
          src: Utils.asset('images/switch-on-new.png')
        });
      } else if (!this._wifiIcon) {
        this.toggleBtnAnimationY();
        this.tag('Button').patch({
          src: Utils.asset('images/switch-off-new.png')
        });
      }
    }

    static _states() {
      return [
        class Button extends this{
          $enter() {
            console.log('Button enter');

          }
          $exit() {
            console.log('Botton exit');
            this.tag('Button').patch({
              h: 60,
              w: 180
            });
            this.tag('Shadow').patch({
              smooth: {
                alpha: 0
              }
            });
          }
          _getFocused() {
            console.log('switch button');
            this.tag('Button').patch({
              h: 70,
              w: 200
            });
            this.tag('Shadow').patch({
              smooth: {
                alpha: 1
              }
            });
          }
          _handleEnter() {
            console.log('enterrr');
            this._wifiIcon = !this._wifiIcon;
            this.switchOnOff();
          }
          _handleLeft() {
            console.log('handle left bluetooth');
            this.tag('Button').patch({
              h: 60,
              w: 180
            });
            this.tag('Shadow').patch({
              smooth: {
                alpha: 0
              }
            });
            this.fireAncestors('$goToSideMenubar', 1);
          }
        },
        class Switch extends this {
          $enter() {
            this.tag('Switch').color = COLORS.hightlightColor;
          }
          $exit() {
            this.tag('Switch').color = 0x00c0c0c0;
          }
          _handleDown() {
            if (this.wifiStatus) {
              if (this._pairedNetworks.tag('List').length > 0) {
                this._setState('PairedDevices');
              } else if (this._availableNetworks.tag('List').length > 0) {
                this._setState('AvailableDevices');
              }
            }
          }

          _handleLeft() {
            console.log('handle left Wifi');
            this.fireAncestors('$goToSideMenubar', 1);
          }
          _handleEnter() {
            this.switch();
          }
        },
        class PairedDevices extends this {
          $enter() { }
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
          $enter() { }
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
        class PairingScreen extends this {
          $enter() {
            this._wifi.stopScan();
            this._disable();
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
            } else {
              this.patch({
                FailureMessage: {
                  x: (1920 * 2) / 3 + 40,
                  y: 950,
                  text: { text: 'FAILED' },
                },
              });
              setTimeout(() => {
                this.childList.remove(this.tag('FailureMessage'));
              }, 2000);
            }
            this._setState('Switch');
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
      let findex = 4;
      let list_element_h = 65;

      if (listname === 'MyDevices') list = this._pairedNetworks.tag('List');
      else if (listname === 'AvailableDevices') list = this._availableNetworks.tag('List');
      if (dir === 'down') {
        if (list.index < list.length - 1) {
          if (listname === 'AvailableDevices') {
            if (list.index > findex) {
              list.y = list.y - list_element_h;
              list.getElement(((list.index - 1) - findex)).visible = false;
            }
          }
          list.setNext();
        }
        else if (list.index == list.length - 1) {
          if (listname === 'MyDevices' && this._availableNetworks.tag('List').length > 0) {
            this._setState('AvailableDevices');
          }
        }
      } else if (dir === 'up') {
        if (list.index > 0) {
          if (listname === 'AvailableDevices') {
            if (list.y < list_element_h) {
              list.y = list.y + list_element_h;
              list.getElement((list.index - 2) - findex).visible = true;
            }
          }
          list.setPrevious();
        }
        else if (list.index == 0) {
          if (listname === 'AvailableDevices' && this._pairedNetworks.tag('List').length > 0) {
            this._setState('PairedDevices');
          } else {
            this._setState('Switch');
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
                this.tag('Switch.Button').src = Utils.asset('images/switch-off.png');
              }
            });
          }
        });
      } else {
        this._wifi.setInterface('WIFI', true).then(result => {
          if (result.success) {
            this._wifi.setDefaultInterface('WIFI', false).then(result => {
              if (result.success) {
                this._wifi.setEnabled(true).then(result => {
                  if (result.success) {
                    this.wifiStatus = true;
                    this.tag('Networks').visible = true;
                    this.tag('Switch.Button').src = Utils.asset('images/switch-on.png');
                    this._wifi.discoverSSIDs();
                    this.tag('Networks.AvailableNetworks.Loader').visible = true;
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
      //this._wifi.discoverSSIDs()
      this.tag('Networks.AvailableNetworks.Loader').visible = true;
      this._wifi.registerEvent('onWIFIStateChanged', notification => {
        if (notification.state === 2 || notification.state === 5) {
          this._wifi.discoverSSIDs();
          this.tag('Networks.AvailableNetworks.Loader').visible = true;
        }
        this._setState('Switch');
      });
      this._wifi.registerEvent('onError', notification => {
        this._wifi.discoverSSIDs();
        this.tag('Networks.AvailableNetworks.Loader').visible = true;
        if (notification.code == 4) {
          this.patch({
            FailureMessage: {
              x: (1920 * 2) / 3 + 40,
              y: 950,
              text: { text: 'INCORRECT PASSWORD' },
            },
          });
          setTimeout(() => {
            this.childList.remove(this.tag('FailureMessage'));
          }, 2000);
        }
        this._setState('Switch');
      });
      this._wifi.registerEvent('onAvailableSSIDs', notification => {
        this.tag('Networks.AvailableNetworks.Loader').visible = false;
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

  /**
   * Class to render items in side setting Items .
   */
  class SideSettinglItem extends Lightning.Component {
    /**
     * Function to render various elements in the side setting  item.
     */
    static _template() {
      return {
        Shadow: {
          alpha: 0,
          x: -15,
          y: 0,
          color: 0x66000000,
          texture: lng.Tools.getShadowRect(620, 115, 10, 10, 20),
        },
        Item: {
          rect: true,
          texture: lng.Tools.getRoundRect(612, 121, 24, 2, 0xffffffff, false, 0xffffffff),
          Image: {
            x: 25,
            y: 25,
            w: 70,
            H: 70,
          },
          Title: {
            text: {
              fontSize: 40,
              textColor: 0xffffffff,
            },
          },
        },
      }
    }

    _init() {
      this.tag('Title').patch({ x: this.x_text, y: this.y_text, text: { text: this.data.title } });
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
      this.tag('Image').patch({ src: Utils.asset(this.data.img), w: this.w, h: this.h, scale: this.focus });
      this.tag('Title').patch({ alpha: 1, text: { textColor: '0xff141e30', } });
      this.tag('Item').patch({
        zIndex: 1,
        texture: lng.Tools.getRoundRect(612, 121, 24, 2, 0xffffffff, true, 0xffffffff),
      });
      this.tag('Shadow').patch({
        smooth: {
          alpha: 1
        }
      });
    }

    /**
     * Function to change properties of item during unfocus.
     */
    _unfocus() {
      this.tag('Image').patch({ src: Utils.asset(this.data.url), w: this.w, h: this.h, scale: this.unfocus });
      this.tag('Title').patch({ alpha: 1, text: { textColor: 0xffffffff } });
      this.tag('Item').patch({
        zIndex: 1, texture: lng.Tools.getRoundRect(612, 121, 24, 2, 0xffffffff, false, 0xffffffff),
      });
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
   * Class which contains data for listings in side panel.
   */
   var sideSettingInfo = [
      {
        title: 'Bluetooth',
        url: '/images/settings/bluetooth_n.png',
        img: '/images/settings/Bluetooth_Focused.png',
      },
      {
        title: 'Wi-Fi',
        url: '/images/settings/wifi_new.png',
        img: '/images/settings/Wifi_Focused.png',
      },
       {
         title: 'USB',
         url: '/images/usb/usb-white-small.png',
         img: '/images/usb/usb-dark-small.png',
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

  /** Class for side setting screen in setting UI */
  class SideSettingScreen extends Lightning.Component {
      static _template() {
          return {
              SideSettingScreen: {
                  x: 0,
                  y: 0,
                  w: 620,
                  h: 200,
                  type: Lightning.components.ListComponent,
                  roll: true,
                  horizontal: false,
                  invertDirection: true,

              },
          }
      }

      _init() {
          this.sidePanelItems = this.getSideSettingInfo();
          this.indexVal = 0;
      }
      _getFocused() {
          return this.tag('SideSettingScreen')
      }

      getSideSettingInfo() {
          return sideSettingInfo
      }

      _active() {
          this._setState('SideSettingScreen');
      }

      /**
       * Function to set items in side panel.
       */
      set sidePanelItems(items) {
          console.log('sidePanelItems');
          this.tag('SideSettingScreen').patch({ x: 80 });
          this.tag('SideSettingScreen').items = items.map((info, index) => {
              this.data = info;
              return {
                  y: index == 0 ? 282 : (index == 1 ? 331 : (index == 2 ? 382 : 0)),
                  type: SideSettinglItem,
                  data: info,
                  focus: 1,
                  unfocus: 1,
                  x_text: 130,
                  y_text: 35,
                  text_focus: 1,
                  text_unfocus: 1,
              }
          });
          this.tag('SideSettingScreen').start();
      }

      /**
       * Function to reset items in side panel.
       */
      set resetSidePanelItems(items) {
          this.tag('SideSettingScreen').patch({ x: 80 });
          this.tag('SideSettingScreen').items = items.map((info, index) => {
              return {
                  y: index == 0 ? 282 : (index == 1 ? 331 : (index == 2 ? 382 : 0)),
                  type: SideSettinglItem,
                  data: info,
                  focus: 1,
                  unfocus: 1,
                  x_text: 130,
                  y_text: 35,
                  text_focus: 1,
                  text_unfocus: 1,
              }
          });
          this.tag('SideSettingScreen').start();
      }
      /**
       * Function to set scaling to side panel.
       */
      set scale(scale) {
          this.tag('SideSettingScreen').patch({ scale: scale });
      }

      /**
       * Function to set x coordinate of side panel.
       */
      set x(x) {
          this.tag('SideSettingScreen').patch({ x: x });
      }

      /**
       * Function to set index value of side panel.
       */
      set index(index) {
          this.indexVal = index;
      }

      $goToSideMenubar(index) {
          this.tag('SideSettingScreen').index = index;
          this._setState('SideSettingScreen');
      }

      changeItemBg(index) {
          return this.tag('SideSettingScreen').items[index].patch({
              Item: {
                  texture: lng.Tools.getRoundRect(612, 121, 24, 2, 0xff121C2C, true, 0xff121C2C),
              }
          })
      }

      static _states() {
          return [
              class SideSettingScreen extends this {

                  _getFocused() {
                      if (this.tag('SideSettingScreen').length) {
                          this.fireAncestors('$setVisibleSetting', this.indexVal);
                          return this.tag('SideSettingScreen').items[this.indexVal]
                      }
                  }

                  _handleKey(key) {
                      if (key.keyCode == 39 || key.keyCode == 13) {
                          if (0 == this.indexVal) {
                              this.fireAncestors('$goToBluetoothScreen', this.indexVal);

                              return this.changeItemBg(this.indexVal)
                          } else if (1 == this.indexVal) {
                              this.fireAncestors('$goToWiFiScreen', this.indexVal);

                              return this.changeItemBg(this.indexVal)

                          } else if (2 == this.indexVal) {
                              this.fireAncestors('$goToUsbFolders', this.indexVal);
                              return this.changeItemBg(this.indexVal)
                          }

                      } else if (key.keyCode == 40) {
                          if (this.tag('SideSettingScreen').length - 1 != this.indexVal) {
                              this.indexVal = this.indexVal + 1;
                          }

                          return this.tag('SideSettingScreen').items[this.indexVal]
                      } else if (key.keyCode == 38) {
                          if (0 != this.indexVal) {
                              this.indexVal = this.indexVal - 1;
                          } else if (0 == this.indexVal) {
                              this.fireAncestors('$goToSettingsTopPanel', this.indexVal);
                          }

                          return this.tag('SideSettingScreen').items[this.indexVal]
                      } else return false;
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
   * Class which contains data for app listings.
   */
   var UsbFolderListInfo = [
      {
        displayName: 'Video',
        url: '/images/usb/video-folder.png',
      },
      {
          displayName: 'Audio',
          url: '/images/usb/music-folder.png',
        },
        {
          displayName: 'Images',
          url: '/images/usb/picture-folder.png',
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
   * Class to render items in Folder ListItem.
   */
  class FolderListItem extends Lightning.Component {
    /**
     * Function to render various elements in the main view item.
     */
    static _template() {
      return {
        Item: {
          Shadow: {
            alpha: 0,
            x: -25,
            y: 0,
            color: 0x66000000,
            texture: lng.Tools.getShadowRect(270, 170, 10, 10, 20),
          },
          x: 30,
          y: 18,
          Title: {
            text: {
              fontSize: 32,
              textColor: 0xffffffff,
            },
            mountX: 0.5,
            alpha: 1,
          },
          Image: {},
        },
      }
    }

    _init() {
      if (this.data.show) {
        this.tag('Title').patch({
          x: this.x_text,
          y: this.y_text,
          alpha: 1,
          text: { text: this.data.title },
        });
      }
      this.tag('Title').patch({
        x: this.x_text,
        y: this.y_text,
        text: { text: this.data.displayName },
      });

      if (this.data.url.startsWith('/images')) {
        this.tag('Image').patch({
          src: Utils.asset(this.data.url),
          w: this.w,
          h: this.h,
          scale: this.unfocus,
        });
      } else {
        this.tag('Image').patch({ src: this.data.url, w: this.w, h: this.h });
      }
    }

    /**
     * Function to change properties of item during focus.
     */
    _focus() {
      this.tag('Image').patch({ w: this.w, h: this.h, scale: this.focus });
      this.tag('Title').patch({
        x: this.x_text,
        y: this.y_text,
        text: { text: this.data.displayName },
      });
      this.tag('Item').patch({ zIndex: 1 });
      this.tag('Shadow').patch({
        smooth: {
          alpha: 1
        }
      });
    }

    /**
     * Function to change properties of item during unfocus.
     */
    _unfocus() {
      this.tag('Image').patch({ x: 0, y: 0, w: this.w, h: this.h, scale: this.unfocus });
      this.tag('Item').patch({ zIndex: 0 });
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
   * Class for settings screen.
   */

  class UsbFolders extends Lightning.Component {
    static _template() {
      return {
        UsbFolderList: {
          x: 800,
          y: 275,
          flex: { direction: 'row', paddingLeft: 20, wrap: false },
          type: Lightning.components.ListComponent,
          w: 1020,
          h: 300,
          itemSize: 250,
          roll: true,
          rollMax: 1020,
          horizontal: true,
          itemScrollOffset: -5,
          clipping: false,
        },
        Shadow: {
          alpha: 0,
          zIndex: 3,
          x: -15,
          y: 0,
          color: 0x66000000,
          texture: lng.Tools.getShadowRect(205, 60, 10, 10, 20),
        },
      }
    }

    _init() {
      this.usbFolderList = UsbFolderListInfo;
    }
    _active() {
      this._setState('UsbFolderList');
    }

    set usbFolderList(items) {
      this.tag('UsbFolderList').items = items.map(info => {
        return {
          w: 235,
          h: 170,
          type: FolderListItem,
          data: info,
          focus: 1.2,
          unfocus: 1,
          x_text: 115,
          y_text: 180,
        }
      });
      this.tag('UsbFolderList').start();
    }


    launchUsbFolder(index) {
      if (index == 0) {
        Router.navigate('usbContent/UsbVideoScreen', false);
      } else if (index == 1) {
        Router.navigate('usbContent/UsbAudioScreen', false);
      }
      else if (index == 2) {
        Router.navigate('usbContent/UsbImageScreen', false);
      }
    }

    static _states() {
      return [
        class UsbFolderList extends this {
          _getFocused() {
            if (this.tag('UsbFolderList').length) {
              this.fireAncestors('$changeBackgroundImageOnFocus', this.tag('UsbFolderList').element.data.url);
              return this.tag('UsbFolderList').element
            }
          }
          _handleRight() {

            if (this.tag('UsbFolderList').length - 1 != this.tag('UsbFolderList').index) {
              this.tag('UsbFolderList').setNext();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('UsbFolderList').element.data.url);
              return this.tag('UsbFolderList').element
            }
          }
          _handleLeft() {

            if (0 != this.tag('UsbFolderList').index) {
              this.tag('UsbFolderList').setPrevious();
              this.fireAncestors('$changeBackgroundImageOnNonFocus', this.tag('UsbFolderList').element.data.url);
              return this.tag('UsbFolderList').element
            }
            if (0 == this.tag('UsbFolderList').index) {
              this.fireAncestors('$goToSideMenubar', 2);
            }

          }
          _handleDown() {
          }
          _handleUp() {
            console.log('handle up');
            this.fireAncestors('$goToTopPanel', 0);
          }
          _handleEnter() {
            this.launchUsbFolder(this.tag('UsbFolderList').index);
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

  /**
   * Class for settings screen.
   */

  class SettingsScreen extends Lightning.Component {
    static _template() {
      return {
        Background: {
          w: 1920,
          h: 1080,
          src: Utils.asset('images/tvShows/background_new.jpg'),
        },
        SettingsTopPanel: {
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
            text: { text: 'Settings', fontSize: 40 },
          },
          IpAddress: {
            x: 1840,
            y: 115,
            mount: 1,
            text: {
              text: 'IP:N/A',
              textColor: 0xffffffff,
              fontSize: 40,
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

        SideMenubar: {
          type: SideSettingScreen,
          rect: true,
          color: 0xff364651,
          visible: true
        },
        WiFiScreen: {
          type: WiFiScreen,
          visible: true,
        },
        BluetoothScreen: {
          type: BluetoothScreen,
          visible: true,
        },
        UsbFolders: {
          type: UsbFolders,
          visible: true,
        },
        HBorder: {
          x: 760,
          y: 220,
          mountY: 0.5,
          RoundRectangle: {
            zIndex: 2,
            texture: lng.Tools.getRoundRect(0, 809, 0, 3, 0xffffffff, true, 0xffffffff),
          },
          alpha: 0.4
        }
      }
    }

    _init() {
      var networkApi = new Network();
      networkApi.getIP().then(ip => {
        this.tag('IpAddress').text.text = 'IP:' + ip;
      });
    }
    _active() {
      this._setState('SideMenubar');
      this.tag('SideMenubar').index = this.sideMenubarIndex;
    }

    set screen(screen) {
      this._setState(screen);
    }

    set id(id) {
      this.sideMenubarIndex = parseInt(id);
    }

    set params(args) {
      if (args.animation != undefined) {
        args.animation.start();
      }
    }

    /**
     * Fireancestor to set the state to side panel.
     * @param {index} index index value of side panel item.
     */
    $goToSettingsTopPanel() {
      this._setState('Back');
    }

    $goToBluetoothScreen(index) {
      this._setState('BluetoothScreen');
    }
    $goToWiFiScreen(index) {
      this._setState('WiFiScreen');
    }
    $goToUsbFolders(index) {
      this._setState('UsbFolders');
    }

    $goToSideMenubar(index) {
      this.tag('SideMenubar').index = index;
      this._setState('SideMenubar');
    }

    $setVisibleSetting(index) {
      if (index == 0) {
        this.tag('BluetoothScreen').alpha = 1;
        this.tag('WiFiScreen').alpha = 0;
        this.tag('UsbFolders').alpha = 0;
      }
      else if (index == 1) {
        this.tag('BluetoothScreen').alpha = 0;
        this.tag('WiFiScreen').alpha = 1;
        this.tag('UsbFolders').alpha = 0;

      } else if (index == 2) {
        this.tag('BluetoothScreen').alpha = 0;
        this.tag('WiFiScreen').alpha = 0;
        this.tag('UsbFolders').alpha = 1;
      }
    }

    static _states() {
      return [
        class SideMenubar extends this{
          _getFocused() {
            return this.tag('SideMenubar')
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
            this._setState('SideMenubar');
          }
          _handleKey(key) {
            if (key.keyCode == 13) {
              this.tag('Back').patch({
                src: Utils.asset('/images/settings/Back_icon.png'),
              });
              Router.navigate('/home', false);
            }
          }
        },
        class BluetoothScreen extends this {
          $enter() {
            this.tag('BluetoothScreen').visible = true;
          }
          _getFocused() {
            return this.tag('BluetoothScreen')
          }
          $exit() {
            // this.tag('BluetoothScreen').visible = false
          }
          _handleKey(key) {
            if (
              (Storage.get('applicationType') == '') &&
              (key.keyCode == 77 ||
                key.keyCode == 49 ||
                key.keyCode == 36 ||
                key.keyCode == 158 ||
                key.keyCode == 27 ||
                (key.keyCode == 73 && key.ctrlKey == true))
            ) {
              this._appAnimation = this.animation({
                duration: 0.5,
                repeat: 0,
                stopMethod: 'immediate',
                actions: [
                  { p: 'alpha', v: { 0: 0.5, 1: 1 } },
                  { p: 'y', v: { 0: 0, 1: 1080 } },
                ],
              });
              this._appAnimation.start();
              this._appAnimation.on('finish', p => {
                Router.navigate('home');
              });
            } else return false;
          }
        },
        class UsbFolders extends this {
          $enter() {
            this.tag('UsbFolders').visible = true;
          }
          _getFocused() {
            return this.tag('UsbFolders')
          }
          $exit() {
            // this.tag('UsbFolders').visible = false
          }
        },
        class WiFiScreen extends this {
          $enter() {
            this.tag('WiFiScreen').visible = true;
          }
          _getFocused() {
            return this.tag('WiFiScreen')
          }
          $exit() {
            // this.tag('WiFiScreen').visible = false
          }
          _handleKey(key) {
            if (
              (Storage.get('applicationType') == '') &&
              (key.keyCode == 77 ||
                key.keyCode == 49 ||
                key.keyCode == 36 ||
                key.keyCode == 158 ||
                key.keyCode == 27 ||
                (key.keyCode == 73 && key.ctrlKey == true))
            ) {
              this._appAnimation = this.animation({
                duration: 0.3,
                repeat: 0,
                stopMethod: 'immediate',
                actions: [
                  { p: 'alpha', v: { 0: 0.5, 1: 1 } },
                  { p: 'y', v: { 0: 0, 1: 1080 } },
                ],
              });
              this._appAnimation.start();
              this._appAnimation.on('finish', p => {
                Router.navigate('home');
              });
            } else return false;
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

  class Error$1 extends Lightning.Component {
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
      {
        displayName: 'Test Xumo',
        applicationType: 'WebApp',
        uri: 'https://x1box-app.xumo.com/3.0.70/index.html',
        url: '/images/usb/music-default-tile.jpg',

      },
      {
        displayName: 'Test Netflix',
        applicationType: 'Netflix',
        uri: '',
        url: '/images/usb/music-default-tile.jpg',

      },
      {
        displayName: 'Test Prime video',
        applicationType: 'Amazon',
        uri: '',
        url: '/images/usb/music-default-tile.jpg',

      },
      {
        displayName: 'Bluetooth Audio',
        applicationType: 'Lightning',
        uri: 'https://rdkwiki.com/rdk-apps/BluetoothAudio/index.html',
        url: '/images/usb/music-default-tile.jpg',
        
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

  class UsbContent extends Lightning.Component {
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
                      text: { text: 'USB Content Screen', fontSize: 40 },
                  },
                  IpAddress: {
                      x: 1840,
                      y: 115,
                      mount: 1,
                      text: {
                          text: 'IP:N/A',
                          textColor: 0xffffffff,
                          fontSize: 40,
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
                  type: Lightning.components.ListComponent,
                  w: 1761,
                  h: 300,
                  itemSize: 185,
                  roll: true,
                  rollMax: 815,
                  horizontal: true,
                  itemScrollOffset: -5,
                  clipping: true,
              },
          }
      }
      set contentTitle(title) {
          this.tag('ContentTitle').patch({
              text: { text: title }
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
                  y_text: 140,
              }
          });
          this.tag('ItemList').start();
      }

      _init() {
          var networkApi = new Network();
          networkApi.getIP().then(ip => {
              this.tag('IpAddress').text.text = 'IP:' + ip;
          });
      }

      static _states() {
          return [
              class ItemList extends this {
                  _getFocused() {
                      if (this.tag('ItemList').length) {
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
                      // todo
                  }
                  _handleUp() {
                      this._setState('Back');
                  }
              },

              class Back extends this{
                  $enter() {

                      console.log('enter back');
                      this.tag('Back').patch({
                          src: Utils.asset('/images/settings/back-arrow-small.png'),
                      });
                  }
                  _handleDown() {
                      console.log('handle down');
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
     
      {
        displayName: 'Test Xumo',
        applicationType: 'WebApp',
        uri: 'https://x1box-app.xumo.com/3.0.70/index.html',
        url: '/images/usb/picture-default-tile.jpg',
      },
      {
        displayName: 'Test Netflix',
        applicationType: 'Netflix',
        uri: '',
        url: '/images/usb/picture-default-tile.jpg',
      },
      {
        displayName: 'Test Prime video',
        applicationType: 'Amazon',
        uri: '',
        url: '/images/usb/picture-default-tile.jpg',
      },
      {
        displayName: 'Bluetooth Audio',
        applicationType: 'Lightning',
        uri: 'https://rdkwiki.com/rdk-apps/BluetoothAudio/index.html',
        url: '/images/usb/picture-default-tile.jpg',
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
   
      {
        displayName: 'Test Xumo',
        uri: 'https://x1box-app.xumo.com/3.0.70/index.html',
        url: '/images/usb/video-default-tile.jpg',
      },
      {
        displayName: 'Test Netflix',
        url: '/images/usb/video-default-tile.jpg',
      },
      {
        displayName: 'Test Prime video',
        url: '/images/usb/video-default-tile.jpg',
      },
      {
        displayName: 'Bluetooth Audio',
        url: '/images/usb/video-default-tile.jpg',
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

  class UsbVideoScreen extends UsbContent {
    _active() {
      this.contentTitle = 'Video files';
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

  class UsbContentScreen extends Lightning.Component {

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
          console.log('before home!');
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
            console.log(result);
            console.log('Xcast activation success');
            this._thunder
              .call('org.rdk.Xcast', 'getEnabled')
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
      return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }];
    }
    _setup() {
      Router.startRouter(routes, this);
      document.onkeydown = e => {
        if (e.keyCode == 8) {
          e.preventDefault();
        }
      };
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
            appApi.launchCobalt();
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
            params.status = 'running';
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
