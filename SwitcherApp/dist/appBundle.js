/**
 * App version: 1.0.0
 * SDK version: 2.1.0
 * CLI version: 1.7.4
 * 
 * Generated: Wed, 09 Sep 2020 14:47:42 GMT
 */

var APP_SwitcherApp = (function () {
	'use strict';

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

	var Lightning = window.lng;

	/**
	 * Simple module for localization of strings.
	 *
	 * How to use:
	 * 1. Create localization file with following JSON format:
	 * {
	 *   "en" :{
	 *     "how": "How do you want your egg today?",
	 *     "boiledEgg": "Boiled egg",
	 *     "softBoiledEgg": "Soft-boiled egg",
	 *     "choice": "How to choose the egg",
	 *     "buyQuestion": "I'd like to buy {0} eggs, {1} dollars each."
	 *   },
	 *
	 *   "it": {
	 *     "how": "Come vuoi il tuo uovo oggi?",
	 *     "boiledEgg": "Uovo sodo",
	 *     "softBoiledEgg": "Uovo alla coque",
	 *     "choice": "Come scegliere l'uovo",
	 *     "buyQuestion": "Mi piacerebbe comprare {0} uova, {1} dollari ciascuna."
	 *   }
	 * }
	 *
	 * 2. Use Locale's module load method, specifying path to your localization file and set chosen language, e.g.:
	 *    > Locale.load('static/locale/locale.json');
	 *    > Locale.setLanguage('en');
	 *
	 * 3. Use localization strings:
	 *    > console.log(Locale.tr.how);
	 *    How do you want your egg today?
	 *    > console.log(Locale.tr.boiledEgg);
	 *    Boiled egg
	 *
	 * 4. String formatting
	 *    > console.log(Locale.tr.buyQuestion.format(10, 0.5));
	 *    I'd like to buy 10 eggs, 0.5 dollars each.
	 */

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
	    this.__enabled = true;
	    this.language = lang;
	  }

	  /**
	   * Returns reference to translation object for current language.
	   *
	   * @return {Object}
	   */
	  get tr() {
	    return this.__trObj[this.language]
	  }

	  /**
	   * Loads translation object from existing object (binds existing object).
	   *
	   * @param {Object} trObj
	   */
	  loadFromObject(trObj) {
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

	const settings = {};

	const initSettings = (appSettings, platformSettings) => {
	  settings['app'] = appSettings;
	  settings['platform'] = platformSettings;
	};

	// todo: support key for nested settings with dot notation? e.g. stage.useImageworker from 'app' settings
	var Settings = {
	  get(type, key) {
	    return settings[type] && settings[type][key]
	  },
	  has(type, key) {
	    return settings[type] && key in settings[type]
	  },
	};

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

	let sendMetric = (type, event, params) => {
	  Log.info('Sending metric', type, event, params);
	};

	const initMetrics = config => {
	  sendMetric = config.sendMetric;
	};

	// available metric per category
	const metrics = {
	  app: ['launch', 'loaded', 'ready', 'close'],
	  page: ['view', 'leave'],
	  user: ['click', 'input'],
	  media: [
	    'abort',
	    'canplay',
	    'ended',
	    'pause',
	    'play',
	    'suspend',
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

	var Metrics$1 = Metrics(metrics);

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
	        text: {
	          fontSize: 22,
	          textAlign: 'center',
	        },
	      },
	    }
	  }

	  set version(version) {
	    this.tag('Text').text = `v${version}`;
	    this.tag('Text').loadTexture();
	    this.w = this.tag('Text').renderWidth + 40;
	  }
	}

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
	  Metrics$1.app.launch();
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
	        rect: true,
	        color: 0x00000000,
	      }
	    }

	    _setup() {
	      Promise.all([
	        this.loadFonts((App.config && App.config.fonts) || (App.getFonts && App.getFonts()) || []),
	        Locale$1.load((App.config && App.config.locale) || (App.getLocale && App.getLocale())),
	      ])
	        .then(() => {
	          Metrics$1.app.loaded();
	          this.childList.a({
	            ref: 'App',
	            type: App,
	            appData,
	            forceZIndexContext: !!platformSettings.showVersion,
	          });

	          if (platformSettings.showVersion) {
	            this.childList.a({
	              ref: 'VersionLabel',
	              type: VersionLabel,
	              version: this.config.version,
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
	      if (platformSettings.onClose && typeof platformSettings.onClose === 'function') {
	        Metrics$1.app.close();
	        platformSettings.onClose();
	      }
	      this.childList.remove(this.tag('App'));

	      // force texture garbage collect
	      this.stage.gc();
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

	    _getFocused() {
	      return this.tag('App')
	    }
	  }
	}

	let basePath;
	let proxyUrl;

	const initUtils = config => {
	  if (config.path) {
	    basePath = ensureUrlWithProtocol(makeFullStaticPath(document.location.pathname, config.path));
	  }

	  if (config.proxyUrl) {
	    proxyUrl = ensureUrlWithProtocol(config.proxyUrl);
	  }
	};

	var Utils = {
	  asset(relPath) {
	    return basePath + '/' + relPath
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
	  // if path is URL, we assume it's already the full static path, so we just return it
	  if (/^(?:https?:)?(?:\/\/)/.test(path)) {
	    return path
	  }
	  // cleanup the pathname
	  pathname = /(.*)\//.exec(pathname)[1];

	  // remove possible leading dot from path
	  path = path.charAt(0) === '.' ? path.substr(1) : path;
	  // ensure path has leading slash
	  path = path.charAt(0) !== '/' ? '/' + path : path;

	  return pathname + path
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

	let getInfo = () => Promise.resolve();
	let setInfo = () => Promise.resolve();

	const initProfile = config => {
	  getInfo = config.getInfo;
	  setInfo = config.setInfo;
	};

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

	let mediaUrl = url => url;

	const initMediaPlayer = config => {
	  if (config.mediaUrl) {
	    mediaUrl = config.mediaUrl;
	  }
	};

	class Mediaplayer extends Lightning.Component {
	  _construct() {
	    this._skipRenderToTexture = false;
	    this._metrics = null;
	    this._textureMode = Settings.get('platform', 'textureMode') || false;
	    Log.info('Texture mode: ' + this._textureMode);
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
	        if (this._metrics[event] && typeof this._metrics[event] === 'function') {
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
	    url = mediaUrl(url);
	    this._metrics = Metrics$1.media(url);
	    Log.info('Playing stream', url);
	    if (this.application.noVideo) {
	      Log.info('noVideo option set, so ignoring: ' + url);
	      return
	    }
	    if (this.videoEl.getAttribute('src') === url) return this.reload()
	    this.videoEl.setAttribute('src', url);

	    this.videoEl.style.display = 'block';

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

	class localCookie{constructor(e){return e=e||{},this.forceCookies=e.forceCookies||!1,!0===this._checkIfLocalStorageWorks()&&!0!==e.forceCookies?{getItem:this._getItemLocalStorage,setItem:this._setItemLocalStorage,removeItem:this._removeItemLocalStorage,clear:this._clearLocalStorage,keys:this._getLocalStorageKeys}:{getItem:this._getItemCookie,setItem:this._setItemCookie,removeItem:this._removeItemCookie,clear:this._clearCookies,keys:this._getCookieKeys}}_checkIfLocalStorageWorks(){if("undefined"==typeof localStorage)return !1;try{return localStorage.setItem("feature_test","yes"),"yes"===localStorage.getItem("feature_test")&&(localStorage.removeItem("feature_test"),!0)}catch(e){return !1}}_getItemLocalStorage(e){return window.localStorage.getItem(e)}_setItemLocalStorage(e,t){return window.localStorage.setItem(e,t)}_removeItemLocalStorage(e){return window.localStorage.removeItem(e)}_clearLocalStorage(){return window.localStorage.clear()}_getLocalStorageKeys(){return Object.keys(window.localStorage)}_getItemCookie(e){var t=document.cookie.match(RegExp("(?:^|;\\s*)"+function(e){return e.replace(/([.*+?\^${}()|\[\]\/\\])/g,"\\$1")}(e)+"=([^;]*)"));return t&&""===t[1]&&(t[1]=null),t?t[1]:null}_setItemCookie(e,t){document.cookie=`${e}=${t}`;}_removeItemCookie(e){document.cookie=`${e}=;Max-Age=-99999999;`;}_clearCookies(){document.cookie.split(";").forEach(e=>{document.cookie=e.replace(/^ +/,"").replace(/=.*/,"=;expires=Max-Age=-99999999");});}_getCookieKeys(){return document.cookie.split(";").map(e=>{const t=e.split("=");return ""!==t[1]&&t[0].trim()}).filter(e=>e)}}

	let namespace;
	let lc;

	const initStorage = () => {
	  namespace = Settings.get('platform', 'appId');
	  // todo: pass options (for example to force the use of cookies)
	  lc = new localCookie();
	};

	var Launch = (App, appSettings, platformSettings, appData) => {
	  initSettings(appSettings, platformSettings);

	  initUtils(platformSettings);
	  initStorage();

	  // Initialize plugins
	  if (platformSettings.plugins) {
	    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile);
	    platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics);
	    platformSettings.plugins.mediaPlayer && initMediaPlayer(platformSettings.plugins.mediaPlayer);
	  }

	  const app = Application(App, appData, platformSettings);
	  return new app(appSettings)
	};

	/* Image Constants */
	const ImageConstants = {
	  BACKGROUND_IMAGE: '/images/backgrounds/Main_Menu_BG1_720p.jpg',
	  RDK_LOGO: '/images/RDKLogo400x79.png',
	  WEATHER_ICON: '/images/icons/weather_icon.png',
	  SHADOW: '/images/shadow.png',
	  CHEVRON: '../../static/images/icons/Chevron.png'
	};

	/* Color Constants */
	const Colors = {
	  BLACK: 0xff000000,
	  WHITE: 0xffffffff,
	  GREY: 0x88888888,
	  TRANSPARENT_LIGHT_GREY: 0x55888888,
	  TRANSPARENT_DARK_GREY: 0xaa888888
	};

	/**
	 * Class to render items in app listings pane..
	 */
	class ListItem extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        Caption: {
	          y: -40,
	          text: {
	            fontSize: 52.5,
	            textColor: Colors.WHITE
	          },
	          mountY: 0.5,
	          alpha: 0
	        },
	        Background: {
	          rect: true,
	          color: Colors.GREY,
	          scale: 0.75
	        },
	        ImageItem: {
	          x: 6,
	          y: 6,
	          scale: 0.75
	        }
	      }
	    }
	  }

	  _init() {
	    if (this.data.url.startsWith('/usb')) {
	      this.data.url = '/images/usb.png';
	      this.tag('ImageItem').patch({ src: Utils.asset(this.data.url), w: this.w, h: this.h });
	    } else if (this.data.url.startsWith('/images')) {
	      this.tag('ImageItem').patch({ src: Utils.asset(this.data.url), w: this.w, h: this.h });
	    } else {
	      this.tag('ImageItem').patch({ src: this.data.url, w: this.w, h: this.h });
	    }
	    this.tag('Background').patch({ w: this.w + 12, h: this.h + 12 });
	    this.tag('Caption').patch({ text: { text: this.data.displayName } });
	  }

	  /**
	   * Function to change properties of items during focus.
	   */
	  _focus() {
	    this.tag('Caption').patch({ alpha: 1 });
	    this.tag('ImageItem').patch({ w: this.w, h: this.h, scale: 1 });
	    this.tag('Background').patch({ w: this.w + 12, h: this.h + 12, scale: 1 });
	    this.tag('Container').patch({ zIndex: 1 });
	  }

	  /**
	   * Function to change properties of items during unfocus.
	   */
	  _unfocus() {
	    this.tag('Caption').patch({ alpha: 0 });
	    this.tag('ImageItem').patch({ w: this.w, h: this.h, scale: 0.75 });
	    this.tag('Background').patch({ w: this.w + 12, h: this.h + 12, scale: 0.75 });
	    this.tag('Container').patch({ zIndex: 0 });
	  }
	}

	/**
	 * Class to render items in listings pane..
	 */
	class ButtonItem extends Lightning.Component {
	  static _template() {
	    return {
	      ItemObj: {
	        w: 379.5,
	        h: 142.5,
	        Shadow: {
	          rect: true,
	          x: 0,
	          y: -15,
	          w: 367.5,
	          h: 7.5,
	          color: Colors.WHITE,
	          alpha: 0
	        },
	        Text: {
	          x: 160,
	          y: 65,
	          text: { text: ' ', textColor: '0xFFFFFFFF', fontSize: 33 }
	        },
	        Image: {
	          x: 100,
	          y: 55
	        }
	      }
	    }
	  }
	  _init() {
	    this.tag('Text').patch({ text: { text: this.data.title } });
	    this.tag('Image').patch({
	      texture: Lightning.Tools.getSvgTexture(Utils.asset(this.data.icon), 60, 60)
	    });
	  }

	  /**
	   * Function to change properties of items during focus.
	   */
	  _focus() {
	    this.tag('Shadow').patch({ alpha: 1 });
	    this.tag('Image').patch({
	      texture: Lightning.Tools.getSvgTexture(
	        Utils.asset(this.data.icon.replace('.svg', '_focus.svg')),
	        60,
	        60
	      )
	    });
	  }

	  /**
	   * Function to change properties of items during unfocus.
	   */
	  _unfocus() {
	    this.tag('Shadow').patch({ alpha: 0 });
	    this.tag('Image').patch({
	      texture: Lightning.Tools.getSvgTexture(Utils.asset(this.data.icon), 60, 60)
	    });
	  }
	}

	/**
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
	    ? typeof params === 'object' && Object.keys(params).length === 0
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
	  return wrapper({ ...thunder(options), ...plugins })
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
	const thunder = options => ({
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
	    this[name] = wrapper(Object.assign(Object.create(thunder), plugin, { plugin: name }));
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
	            Object.assign(Object.create(thunder(target.options)), prop, { plugin: propKey })
	          )
	        }
	        return prop
	      } else {
	        if (target.plugin === false) {
	          return wrapper(
	            Object.assign(Object.create(thunder(target.options)), {}, { plugin: propKey })
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

	var activatedWeb = false;
	var activatedLightning = false;
	var activatedCobalt = false;
	var activatedSearchAndDiscoveryApp = false;
	var webUrl = '';
	var lightningUrl = '';
	var searchAndDiscoveryAppUrl = '';
	const config = {
	  host: '127.0.0.1',
	  port: 9998,
	  default: 1
	};
	var thunder$1 = thunderJS(config);
	/**
	 * Class that contains functions which commuicates with thunder API's
	 */
	class ThunderCalls {
	  /**
	   * Function to launch Html app.
	   * @param {String} url url of app.
	   */
	  launchWeb(url) {
	    if (!activatedWeb) {
	      this.activateWeb(url);
	    } else {
	      this.updateWebUrl(url);
	    }
	  }

	  /**
	   * Function to activate html app.
	   * @param {String} url url of app.
	   */
	  activateWeb(url) {
	    const childCallsign = 'HtmlApp';
	    thunder$1.Controller.activate({ callsign: childCallsign })
	      .then(() => {
	        thunder$1.call(childCallsign, 'localstorageenabled', true);
	      })
	      .then(() => {
	        activatedWeb = true;
	        thunder$1.call(childCallsign, 'state', 'resumed');
	      })
	      .then(result => {
	        this.updateWebUrl(url);
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });
	  }

	  /**
	   * Function to update url of html app.
	   * @param {String} url url of app.
	   */
	  updateWebUrl(url) {
	    const childCallsign = 'HtmlApp';
	    if (webUrl != url) {
	      webUrl = url;
	      thunder$1.call(childCallsign, 'url', url);
	    }
	    thunder$1
	      .call(childCallsign, 'state', 'resumed')
	      .then(() => {
	        this.setVisibility('HtmlApp', true);
	        thunder$1.call('org.rdk.RDKShell', 'moveToFront', { client: 'HtmlApp' });
	      })
	      .then(() => {
	        thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: 'HtmlApp' });
	      })
	      .catch(err => {
	        console.log('Error' + JSON.stringify(err));
	      });
	  }

	  /**
	   * Function to launch Html app.
	   * @param {String} url url of app.
	   */
	  launchCobalt(url) {
	    if (!activatedCobalt) {
	      this.activateCobalt(url);
	    } else {
	      const childCallsign = 'Cobalt';
	      thunder$1
	        .call(childCallsign, 'state', 'resumed')
	        .then(() => {
	          this.setVisibility('Cobalt', true);
	          thunder$1.call('org.rdk.RDKShell', 'moveToFront', { client: 'Cobalt' });
	        })
	        .catch(err => {
	          console.log('Error' + JSON.stringify(err));
	        });

	      setTimeout(() => {
	        thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: 'Cobalt' });
	      }, 500);
	    }
	  }

	  /**
	   * Function to activate cobalt app.
	   * @param {String} url url of app.
	   */
	  activateCobalt(url) {
	    const childCallsign = 'Cobalt';
	    thunder$1.Controller.activate({ callsign: childCallsign })
	      .then(() => {
	        activatedCobalt = true;
	        thunder$1
	          .call(childCallsign, 'state', 'resumed')
	          .then(() => {
	            this.setVisibility('Cobalt', true);
	            thunder$1.call('org.rdk.RDKShell', 'moveToFront', { client: 'Cobalt' });
	          })
	          .then(() => {
	            thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: 'Cobalt' });
	          })
	          .catch(err => {
	            console.log('Error' + JSON.stringify(err));
	          });
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });
	  }
	  /**
	   * Function to launch Lightning app.
	   * @param {String} url url of app.
	   */
	  launchLightning(url) {
	    if (!activatedLightning) {
	      this.activateLightning(url);
	    } else {
	      this.updateLightningUrl(url);
	    }
	  }

	  /**
	   * Function to activate lightning app.
	   * @param {String} url url of app.
	   */
	  activateLightning(url) {
	    const childCallsign = 'LightningApp';
	    thunder$1.Controller.activate({ callsign: childCallsign })
	      .then(result => {
	        this.updateLightningUrl(url);
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });
	  }

	  /**
	   * Function to update url of lightning app.
	   * @param {String} url url of app.
	   */
	  updateLightningUrl(url) {
	    const childCallsign = 'LightningApp';
	    if (lightningUrl != url) {
	      lightningUrl = url;
	      thunder$1.call(childCallsign, 'url', url);
	    }
	    thunder$1
	      .call(childCallsign, 'state', 'resumed')
	      .then(() => {
	        this.setVisibility('LightningApp', true);
	        thunder$1.call('org.rdk.RDKShell', 'moveToFront', { client: 'LightningApp' });
	      })
	      .then(() => {
	        thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: 'LightningApp' });
	      })
	      .catch(err => {
	        console.log('Error' + JSON.stringify(err));
	      });
	  }
	  /**
	   * Function to launch Lightning app.
	   * @param {String} url url of app.
	   */
	  launchSearchAndDiscoveryApp(url) {
	    if (!activatedSearchAndDiscoveryApp) {
	      this.activateSearchAndDiscoveryApp(url);
	    } else {
	      this.updateSearchAndDiscoveryAppUrl(url);
	    }
	  }

	  /**
	   * Function to activate lightning app.
	   * @param {String} url url of app.
	   */
	  activateSearchAndDiscoveryApp(url) {
	    const childCallsign = 'SearchAndDiscoveryApp';
	    thunder$1.Controller.activate({ callsign: childCallsign })
	      .then(result => {
	        this.updateSearchAndDiscoveryAppUrl(url);
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });
	  }

	  /**
	   * Function to update url of lightning app.
	   * @param {String} url url of app.
	   */
	  updateSearchAndDiscoveryAppUrl(url) {
	    const childCallsign = 'SearchAndDiscoveryApp';
	    if (searchAndDiscoveryAppUrl != url) {
	      searchAndDiscoveryAppUrl = url;
	      thunder$1.call(childCallsign, 'url', url);
	    }
	    thunder$1
	      .call(childCallsign, 'state', 'resumed')
	      .then(() => {
	        this.setVisibility('SearchAndDiscoveryApp', true);
	        thunder$1.call('org.rdk.RDKShell', 'moveToFront', { client: 'SearchAndDiscoveryApp' });
	      })
	      .then(() => {
	        thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: 'SearchAndDiscoveryApp' });
	      })
	      .catch(err => {
	        console.log('Error' + JSON.stringify(err));
	      });
	  }

	  /**
	   * Function to suspend html app.
	   */
	  suspendWeb() {
	    thunder$1.call('HtmlApp', 'state', 'suspended');
	  }

	  /**
	   * Function to suspend cobalt app.
	   */
	  suspendCobalt() {
	    thunder$1.call('Cobalt', 'state', 'suspended');
	  }

	  /**
	   * Function to suspend lightning app.
	   */
	  suspendLightning() {
	    thunder$1.call('LightningApp', 'state', 'suspended');
	  }

	  /**
	   * Function to suspend lightning app.
	   */
	  suspendSearchAndDiscoveryApp() {
	    thunder$1.call('SearchAndDiscoveryApp', 'state', 'suspended');
	  }

	  /**
	   * Function to deactivate html app.
	   */
	  deactivateWeb() {
	    thunder$1.Controller.deactivate({ callsign: 'HtmlApp' });
	    activatedWeb = false;
	    webUrl = '';
	  }

	  /**
	   * Function to deactivate cobalt app.
	   */
	  deactivateCobalt() {
	    thunder$1.Controller.deactivate({ callsign: 'Cobalt' });
	    activatedCobalt = false;
	  }

	  /**
	   * Function to deactivate lightning app.
	   */
	  deactivateLightning() {
	    thunder$1.Controller.deactivate({ callsign: 'LightningApp' });
	    activatedLightning = false;
	    lightningUrl = '';
	  }

	  /**
	   * Function to deactivate lightning app.
	   */
	  deactivateSearchAndDiscoveryApp() {
	    thunder$1.Controller.deactivate({ callsign: 'SearchAndDiscoveryApp' });
	    activatedSearchAndDiscoveryApp = false;
	    searchAndDiscoveryAppUrl = '';
	  }

	  /**
	   * Function called while exiting from Cobalt app..
	   */
	  exitCobalt() {
	    activatedCobalt = false;
	  }

	  setVisibility(client, visible) {
	    //thunder.call('org.rdk.RDKShell', 'setVisibility', { client: client, visible: visible })
	  }
	}

	/*
	BluetoothRemoteControl 
	 */


	class BluetoothRemoteControl {
	  constructor(){
	    console.log('BluetoothRemoteControl constructor');
	    this._connectTimer = null;
	    this._stopScan = false;
	    this._availableSSIDs = {
	      ssids: []
	    };
	    this._events=new Map();
	    this._listeners = [];
	  }
	  activate() {
	    return new Promise((resolve, reject) => {
	      const config = {
	        host: '127.0.0.1',
	        port: 9998,
	        default: 1
	      };
	      this._thunder = thunderJS(config);
	      this.callsign = 'BluetoothRemoteControl';
	      this._thunder.call("Controller", "activate", { callsign: this.callsign }).then(result => {
	        console.log('BluetoothRemoteControl activated', result);

	        this._listeners.push(this._thunder.on(this.callsign, 'audiotransmission', (notification) => {
	          console.log('Received audiotransmission  Event');
	          console.log(notification.profile);
	        }));

	        this._listeners.push(this._thunder.on(this.callsign, 'audioframe', (notification) => {
	          console.log('Received audioframe  Event');
	          console.log(notification.seq);
	          console.log(notification.data);
	        }));

	        resolve("BluetoothRemoteControl activated");
	      }).catch(err => {
	        console.error('Activation failure', err);
	        reject("BluetoothRemoteControl activation failed",err);
	      });
	    })
	  }
	  registerEvent(eventId, callback) {
	    this._events.set(eventId, callback);
	  }
	  deactivate() {
	    this._events = new Map();
	    this._listeners.forEach(listener => listener.dispose());
	    this._listeners = [];
	    this._thunder = null;
	  }
	  static init() {
	   
	  }
	  
	}

	var maxButtonItems = 4;
	var gap = 12;
	var row_h = 142.5;
	var col_w = 367.5;
	var total_w = col_w + gap;
	var ww = total_w * maxButtonItems;
	var hh = row_h + maxButtonItems + 45;

	/**
	 * Class to render the Switcher page.
	 */
	class Switcher extends Lightning.Component {
	  /**
	   * Function to render the components in the app.
	   */
	  static _template() {
	    return {
	      TopMargin: {
	        x: 0,
	        y: 15,
	        w: 1920,
	        h: 90,
	        zIndex: 0,
	        MenuChevronUP: {
	          x: 960,
	          y: 30,
	          w: 60,
	          h: 60,
	          mountX: 0.5,
	          rotation: Math.PI * 7,
	          src: Utils.asset(ImageConstants.CHEVRON)
	        },
	        TimeTempContainer: {
	          x: 1890,
	          y: 30,
	          w: 300,
	          h: 60,
	          mountX: 1,
	          ClockText: { x: 190, y: 30, text: { text: '', fontSize: 33 }, mountY: 0.5 }
	        }
	      },
	      VoiceSearch: {
	        x: 0,
	        y: 0,
	        w: 1920,
	        h: 120,
	        rect: true,
	        color: 0xffa9a9a9,
	        alpha: 0,
	        Microphone: {
	          x: 100,
	          y: 70,
	          w: 40,
	          h: 65,
	          mountX: 0.5,
	          mountY: 0.5,
	          src: Utils.asset('/images/microphone.png')
	        },
	        Listen: {
	          x: 230,
	          y: 70,
	          mountX: 0.5,
	          mountY: 0.5,
	          text: { text: 'Listening..', fontSize: 36, textColor: Colors.BLACK }
	        }
	      },
	      AppsListPane: {
	        x: 64,
	        y: 321.82,
	        w: 1920,
	        h: 360,
	        zIndex: 1,
	        ImageListView: {
	          x: 0,
	          y: 0,
	          w: 1920,
	          h: 360,
	          type: Lightning.components.ListComponent,
	          roll: true,
	          itemSize: 640 + 45,
	          horizontal: true,
	          rollMax: 3200
	        }
	      },
	      ListingsPane: {
	        x: 0,
	        y: 856.5,
	        w: 1920,
	        h: 223.5,
	        zIndex: 0,
	        ListingsBG: {
	          rect: true,
	          w: 1920,
	          h: 223.5,
	          color: Colors.TRANSPARENT_DARK_GREY
	        },
	        ButtonListView: {
	          type: Lightning.components.ListComponent,
	          x: 960,
	          y: 15,
	          w: ww,
	          h: hh,
	          mountX: 0.5,
	          roll: true,
	          itemSize: total_w,
	          horizontal: true
	        }
	      },
	      Diagbackground: {
	        x: 1920,
	        y: 1080,
	        w: 0,
	        h: 0,
	        zIndex: 1,
	        src: Utils.asset('/images/rdkm-settings.jpg')
	      }
	    }
	  }

	  _init() {
	    this.zoomIn = false;
	    this.nUsbApps = 0;
	    this._setState('ImageListView');
	    const config = {
	      host: '127.0.0.1',
	      port: 9998,
	      default: 1
	    };
	    var thunder = thunderJS(config);
	    this.bluetoothRemoteControl = new BluetoothRemoteControl();
	    this.bluetoothRemoteControl.activate();
	    const rdkshellCallsign = 'org.rdk.RDKShell';
	    thunder.Controller.activate({ callsign: rdkshellCallsign }).then(result => {
	      console.log('activate rdk shell success');
	    });
	    thunder.call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' });
	    thunder
	      .call(rdkshellCallsign, 'addKeyIntercept', {
	        client: 'ResidentApp',
	        keyCode: 77,
	        modifiers: []
	      })
	      .then(result => {
	        console.log('addKeyIntercept success');
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });
	    thunder
	      .call(rdkshellCallsign, 'addKeyIntercept', {
	        client: 'ResidentApp',
	        keyCode: 49,
	        modifiers: []
	      })
	      .then(result => {
	        console.log('addKeyIntercept success');
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });

	    thunder
	      .call(rdkshellCallsign, 'addKeyIntercept', {
	        client: 'ResidentApp',
	        keyCode: 36,
	        modifiers: []
	      })
	      .then(result => {
	        console.log('addKeyIntercept success');
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });

	      thunder
	      .call(rdkshellCallsign, 'addKeyIntercept', {
	        client: 'ResidentApp',
	        keyCode: 86,
	        modifiers: []
	      })
	      .then(result => {
	        console.log('addKeyIntercept success');
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });

	      thunder
	      .call(rdkshellCallsign, 'addKeyIntercept', {
	        client: 'ResidentApp',
	        keyCode: 217,
	        modifiers: []
	      })
	      .then(result => {
	        console.log('addKeyIntercept success');
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });
	    thunder.on('Controller', 'statechange', notification => {
	      if (
	        notification &&
	        notification.callsign == 'Cobalt' &&
	        notification.state == 'Deactivation'
	      ) {
	        var thunderCalls = new ThunderCalls();
	        thunderCalls.exitCobalt();
	        thunderCalls.setVisibility('Cobalt', false);
	        this._zoomOut();
	        thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
	          console.error('ResidentApp moveToFront Success');
	        });
	        thunder
	          .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
	          .then(result => {
	            console.log('ResidentApp setFocus Success');
	          })
	          .catch(err => {
	            console.log('Error', err);
	          });
	      }
	    });
	    this.timeZone='America/New_York';
	    thunder
	      .call('org.rdk.System', 'getTimeZoneDST')
	      .then(result => {
	        this.timeZone=result.timeZone;
	      })
	      .catch(err => {
	        this.timeZone='America/New_York';
	      });
	  }
	  _build() {
	    setInterval(() => {
	      this.updateTime();
	    }, 1000);
	  }

	  /**
	   * Function to return current time.
	   */
	  updateTime() {
	    let date = new Date();
	    date = new Date(date.toLocaleString('en-US', { timeZone: this.timeZone }));
	    let hours = date.getHours();
	    let minutes = date.getMinutes();
	    let ampm = hours >= 12 ? 'p' : 'a';

	    hours = hours % 12;
	    hours = hours ? hours : 12;
	    minutes = minutes < 10 ? '0' + minutes : minutes;

	    let strTime = hours + '.' + minutes + ampm;
	    this.tag('ClockText').patch({ text: { text: strTime } });
	  }

	  /**
	   * Function to set items to the list.
	   */
	  set imageitems(items) {
	    this.tag('ImageListView').items = items.map(info => {
	      return {
	        w: 640,
	        h: 360,
	        y_text: -15,
	        type: ListItem,
	        data: info
	      }
	    });
	    this.tag('ImageListView').start();
	  }

	  /**
	   * Function to set items to the list.
	   */
	  set buttonitems(items) {
	    this.tag('ButtonListView').items = items.map((info, index) => {
	      return {
	        w: total_w,
	        h: hh,
	        w_image: 60,
	        h_image: 60,
	        gap: gap,
	        type: ButtonItem,
	        data: info
	      }
	    });
	    this.tag('ButtonListView').start();
	  }

	  /**
	   * usb apps count.
	   */
	  set usbAppsCout(count) {
	    this.nUsbApps = count;
	  }

	  /**
	   * Function to zoom in tile image to full screen.
	   */
	  _zoomIn() {
	    this.zoomIn = true;
	    var item = this.tag('ImageListView').items[this.tag('ImageListView').index].tag('Container');
	    const startZoom = item.animation({
	      duration: 0.5,
	      repeat: 0,
	      stopMethod: 'immediate',
	      actions: [
	        { p: 'x', v: { 0: 0, 1: -80 } },
	        { p: 'y', v: { 0: 0, 1: -340 } },
	        { p: 'scaleX', v: { 0: 1, 1: 3 } },
	        { p: 'scaleY', v: { 0: 1, 1: 3 } }
	      ]
	    });
	    startZoom.start();
	    setTimeout(() => {
	      if (this.zoomIn) this.parent.parent.alpha = 0;
	    }, 500);
	  }

	  /**
	   * Function to zoom out tile image.
	   */
	  _zoomOut() {
	    this.parent.parent.alpha = 1;
	    var item = this.tag('ImageListView').items[this.tag('ImageListView').index].tag('Container');
	    const stopZoom = item.animation({
	      duration: 0.5,
	      repeat: 0,
	      stopMethod: 'immediate',
	      actions: [
	        { p: 'x', v: { 0: -70, 1: 0 } },
	        { p: 'y', v: { 0: -330, 1: 0 } },
	        { p: 'scaleX', v: { 0: 3, 1: 1 } },
	        { p: 'scaleY', v: { 0: 3, 1: 1 } }
	      ]
	    });
	    if (this.zoomIn) {
	      stopZoom.start();
	    } else {
	      item.x = 0;
	      item.y = 0;
	      item.scaleX = 1;
	      item.scaleY = 1;
	    }
	    this.zoomIn = false;
	    this._updateFocus(500);
	    this._updateFocus(1500);
	  }

	  /**
	   * Function to zoom in settings image.
	   */
	  _diagIn() {
	    this.zoomIn = true;
	    var item = this.tag('Diagbackground');
	    const startZoom = item.animation({
	      duration: 0.5,
	      repeat: 0,
	      stopMethod: 'immediate',
	      actions: [
	        { p: 'x', v: { 0: 1920, 1: 0 } },
	        { p: 'y', v: { 0: 1080, 1: 0 } },
	        { p: 'w', v: { 0: 1, 1: 1920 } },
	        { p: 'h', v: { 0: 1, 1: 1080 } }
	      ]
	    });
	    startZoom.start();
	    setTimeout(() => {
	      if (this.zoomIn) this.parent.parent.alpha = 0;
	    }, 500);
	  }

	  /**
	   * Function to zoom out settings image.
	   */
	  _diagOut() {
	    this.parent.parent.alpha = 1;
	    var item = this.tag('Diagbackground');
	    const stopZoom = item.animation({
	      duration: 0.5,
	      repeat: 0,
	      stopMethod: 'immediate',
	      actions: [
	        { p: 'x', v: { 0: 0, 1: 1920 } },
	        { p: 'y', v: { 0: 0, 1: 1080 } },
	        { p: 'w', v: { 0: 1920, 1: 0 } },
	        { p: 'h', v: { 0: 1080, 1: 0 } }
	      ]
	    });
	    if (this.zoomIn) {
	      stopZoom.start();
	    } else {
	      item.x = 1920;
	      item.y = 1080;
	      item.w = 0;
	      item.h = 0;
	    }
	    this.zoomIn = false;
	    this._updateFocus(500);
	    this._updateFocus(1500);
	  }

	  /**
	   * Function to zoom out settings image.
	   */
	  _updateFocus(interval) {
	    setTimeout(() => {
	      if (!this.zoomIn) {
	        const config = {
	          host: '127.0.0.1',
	          port: 9998,
	          default: 1
	        };
	        var thunder = thunderJS(config);
	        thunder
	          .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
	          .then(result => {
	            console.log('ResidentApp setFocus Success');
	          })
	          .catch(err => {
	            console.log('Error', err);
	          });
	      }
	    }, interval);
	  }
	  /**
	   * Function to handle the different states of the app.
	   */
	  static _states() {
	    return [
	      class ImageListView extends this {
	        _getFocused() {
	          if (this.tag('ImageListView').length) {
	            return this.tag('ImageListView').element
	          }
	        }
	        _handleRight() {
	          if (this.tag('ImageListView').length - 1 != this.tag('ImageListView').index) {
	            this.tag('ImageListView').setNext();
	          }
	          return this.tag('ImageListView').element
	        }
	        _handleLeft() {
	          if (0 != this.tag('ImageListView').index) {
	            this.tag('ImageListView').setPrevious();
	          }
	          return this.tag('ImageListView').element
	        }
	        _handleDown() {
	          this._setState('ButtonListView');
	        }
	        _handleUp() {
	          this.fireAncestors('$moveToBackground');
	        }
	        _handleEnter() {
	          if (this.zoomIn) return
	          var url = this.tag('ImageListView').items[this.tag('ImageListView').index].data.uri;
	          var applicationType = this.tag('ImageListView').items[this.tag('ImageListView').index]
	            .data.applicationType;
	          var thunderCalls = new ThunderCalls();
	          this._zoomIn();
	          if (applicationType == 'WebApp') {
	            thunderCalls.launchWeb(url);
	          } else if (applicationType == 'Lightning') {
	            thunderCalls.launchLightning(url);
	          } else if (applicationType == 'Cobalt') {
	            thunderCalls.launchCobalt(url);
	          }
	        }
	        _handleKey(key) {
	          const config = {
	            host: '127.0.0.1',
	            port: 9998,
	            default: 1
	          };
	          var thunder = thunderJS(config);
	          console.log('_handleKey', key.keyCode);
	          if (key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36) {
	            this._zoomOut();
	            var applicationType = this.tag('ImageListView').items[this.tag('ImageListView').index]
	              .data.applicationType;
	            var thunderCalls = new ThunderCalls();
	            thunderCalls.suspendCobalt();
	            thunderCalls.deactivateWeb();
	            thunderCalls.deactivateLightning();
	            thunderCalls.deactivateSearchAndDiscoveryApp();
	            thunderCalls.setVisibility('Cobalt', false);
	            thunderCalls.setVisibility('HtmlApp', false);
	            thunderCalls.setVisibility('LightningApp', false);
	            thunder
	              .call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' })
	              .then(result => {
	                console.error('ResidentApp moveToFront Success');
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
	          else if (key.keyCode == 86 || key.keyCode == 217) {
	            this.tag('VoiceSearch').patch({alpha: 0.8});
	            setTimeout(() => {
	              this.tag('VoiceSearch').patch({alpha: 0});
	            }, 5000);
	           }
	        }
	      },

	      class ButtonListView extends this {
	        _getFocused() {
	          if (this.tag('ButtonListView').length) {
	            return this.tag('ButtonListView').element
	          }
	        }
	        _handleRight() {
	          if (this.tag('ButtonListView').length - 1 != this.tag('ButtonListView').index) {
	            this.tag('ButtonListView').setNext();
	          }
	          return this.tag('ButtonListView').element
	        }
	        _handleLeft() {
	          if (0 != this.tag('ButtonListView').index) {
	            this.tag('ButtonListView').setPrevious();
	          }
	          return this.tag('ButtonListView').element
	        }
	        _handleUp() {
	          this._setState('ImageListView');
	        }
	        _handleEnter() {
	          if (this.zoomIn) return
	          var title = this.tag('ButtonListView').items[this.tag('ButtonListView').index].data.title;
	          var thunderCalls = new ThunderCalls();
	          if (title == 'Setup') {
	            this._diagIn();
	            thunderCalls.launchSearchAndDiscoveryApp(
	              'http://127.0.0.1:50050/lxdiag/index.html'
	            );
	          } else if (title == 'About') ; else if (title == 'TV Shows') {
	            let appIndex = this.nUsbApps + 2;
	            this.tag('ImageListView').setIndex(appIndex);
	            setTimeout(() => {
	              this._zoomIn();
	              this.tag('ImageListView').items[appIndex].patch({
	                Container: {
	                  zIndex: 1,
	                  Background: {
	                    scale: 1
	                  },
	                  ImageItem: {
	                    scale: 1
	                  }
	                }
	              });
	              thunderCalls.launchLightning(
	                'https://rdkwiki.com/rdk-apps/BouncingBall/index.html'
	              );
	            }, 200);
	          } else if (title == 'Apps') {
	            let appIndex = this.nUsbApps + 0;
	            this.tag('ImageListView').setIndex(appIndex);
	            setTimeout(() => {
	              this._zoomIn();
	              this.tag('ImageListView').items[appIndex].patch({
	                Container: {
	                  zIndex: 1,
	                  Background: {
	                    scale: 1
	                  },
	                  ImageItem: {
	                    scale: 1
	                  }
	                }
	              });
	              thunderCalls.launchLightning(
	                'https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d'
	              );
	            }, 200);
	          }
	        }
	        _handleKey(key) {
	          const config = {
	            host: '127.0.0.1',
	            port: 9998,
	            default: 1
	          };
	          var thunder = thunderJS(config);
	          console.log('_handleKey 2', key.keyCode);
	          if (key.keyCode == 77 || key.keyCode == 49 || key.keyCode == 36) {
	            var title = this.tag('ButtonListView').items[this.tag('ButtonListView').index].data
	              .title;
	            var thunderCalls = new ThunderCalls();
	            if (title == 'Setup') {
	              this._diagOut();
	            } else if (title == 'About') ; else if (title == 'TV Shows') {
	              this._zoomOut();
	              let appIndex = this.nUsbApps + 2;
	              this.tag('ImageListView').items[appIndex].patch({
	                Container: {
	                  zIndex: 0,
	                  Background: {
	                    scale: 0.75
	                  },
	                  ImageItem: {
	                    scale: 0.75
	                  }
	                }
	              });
	            } else if (title == 'Apps') {
	              let appIndex = this.nUsbApps + 0;
	              this._zoomOut();
	              this.tag('ImageListView').items[appIndex].patch({
	                Container: {
	                  zIndex: 0,
	                  Background: {
	                    scale: 0.75
	                  },
	                  ImageItem: {
	                    scale: 0.75
	                  }
	                }
	              });
	            }
	            thunderCalls.deactivateLightning();
	            thunderCalls.deactivateWeb();
	            thunderCalls.suspendCobalt();
	            thunderCalls.deactivateSearchAndDiscoveryApp();
	            thunderCalls.setVisibility('Cobalt', false);
	            thunderCalls.setVisibility('HtmlApp', false);
	            thunderCalls.setVisibility('LightningApp', false);
	            thunder
	              .call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' })
	              .then(result => {
	                console.error('ResidentApp moveToFront Success');
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
	          else if (key.keyCode == 86 || key.keyCode == 217) {
	            this.tag('VoiceSearch').patch({alpha: 0.8});
	            setTimeout(() => {
	              this.tag('VoiceSearch').patch({alpha: 0});
	            }, 5000);
	          }
	        }
	      }
	    ]
	  }
	}

	/**
	 * Class to render items in Background tray.
	 */
	class ListItem$1 extends Lightning.Component {
	  static _template() {
	    return {
	      ItemObj: {
	        y: 15,
	        Shadow: {
	          x: 22.5,
	          y: 22.5,
	          src: Utils.asset(ImageConstants.SHADOW),
	          alpha: 0,
	          scale: 1
	        },
	        Image: {
	          x: 7.5,
	          y: 0,
	          scale: 1
	        }
	      }
	    }
	  }

	  _init() {
	    this.tag('ItemObj').patch({ w: this.w + 15, h: this.h + 15 });
	    this.tag('Shadow').patch({
	      w: this.w,
	      h: this.h
	    });
	    this.tag('Image').patch({
	      src: Utils.asset('images/backgrounds/tiles/' + this.data),
	      w: this.w,
	      h: this.h,
	      images: this.data.images
	    });
	  }

	  /**
	   * Function to change properties of items during focus.
	   */
	  _focus() {
	    this.tag('Image').patch({ scale: 1.3 });
	    this.tag('Shadow').patch({ alpha: 1, scale: 1.3 });
	  }

	  /**
	   * Function to change properties of items during unfocus.
	   */
	  _unfocus() {
	    this.tag('Image').patch({ scale: 1 });
	    this.tag('Shadow').patch({ alpha: 0, scale: 1 });
	  }
	}

	var maxButtonItems$1 = 7;
	var gap$1 = 105;
	var row_h$1 = 194.4;
	var col_w$1 = 345.6;
	var total_w$1 = col_w$1 + gap$1;
	var ww$1 = total_w$1 * maxButtonItems$1;
	var hh$1 = row_h$1 + maxButtonItems$1 + 45;

	/**
	 * Class to render the Background page.
	 */
	class Background extends Lightning.Component {
	  /**
	   * Function to render the components in the app.
	   */
	  static _template() {
	    return {
	      ImageTrayView: {
	        x: 0,
	        y: 0,
	        w: 1920,
	        h: 1080,
	        MenuContainer: {
	          x: 0,
	          w: 1920,
	          h: 420,
	          MenuBackground: {
	            x: 0,
	            y: 0,
	            w: 1920,
	            h: 420,
	            rect: true,
	            color: Colors.TRANSPARENT_LIGHT_GREY,
	            MenuChevronIMG: {
	              x: 960,
	              y: 420,
	              w: 60,
	              h: 60,
	              mountX: 0.5,
	              mountY: 1,
	              rotation: Math.PI * 7,
	              src: Utils.asset(ImageConstants.CHEVRON)
	            },
	            MenuCaptionTXT: {
	              x: 30,
	              y: 30,
	              text: { text: 'Select Background', fontSize: 42 }
	            }
	          }
	        },
	        MyButtonsList: {
	          x: 15,
	          y: 112.5,
	          type: Lightning.components.ListComponent,
	          w: ww$1 + 15,
	          h: hh$1,
	          itemSize: total_w$1 + 15,
	          roll: true,
	          rollMax: (total_w$1 + 15) * 4,
	          rollMin: 0,
	          itemScrollOffset: -3
	        }
	      },
	      BotMargin: {
	        x: 0,
	        y: 1050,
	        w: 1920,
	        h: 127.5,
	        mountY: 1,
	        StatusContainer: {
	          x: 1815,
	          y: 30,
	          w: 180,
	          h: 52.5,
	          mountX: 1,
	          StatusText: {
	            x: 0,
	            y: 27,
	            text: {
	              text: '',
	              fontSize: 33,
	              textColor: Colors.WHITE
	            },
	            mountY: 0.5
	          }
	        },
	        MenuChevronDN: {
	          x: 960,
	          y: 30,
	          w: 60,
	          h: 60,
	          src: Utils.asset(ImageConstants.CHEVRON),
	          mountX: 0.5
	        }
	      }
	    }
	  }
	  _init() {
	    this._setState('ShowBackgroundPage');
	    this.timeZone='America/New_York';
	    const config = {
	      host: '127.0.0.1',
	      port: 9998,
	      default: 1
	    };
	    var thunder = thunderJS(config);
	    thunder
	      .call('org.rdk.System', 'getTimeZoneDST')
	      .then(result => {
	        this.timeZone=result.timeZone;
	      })
	      .catch(err => {
	        this.timeZone='America/New_York';
	      });
	  }

	  _build() {
	    setInterval(() => {
	      this.updateTime();
	    }, 1000);
	  }

	  /**
	   * Function to return current time.
	   */
	  updateTime() {
	    let date = new Date();
	    date = new Date(date.toLocaleString('en-US', { timeZone: this.timeZone }));
	    let hours = date.getHours();
	    let minutes = date.getMinutes();
	    let ampm = hours >= 12 ? 'p' : 'a';

	    hours = hours % 12;
	    hours = hours ? hours : 12;
	    minutes = minutes < 10 ? '0' + minutes : minutes;

	    let strTime = hours + '.' + minutes + ampm;
	    this.tag('StatusText').patch({ text: { text: strTime } });
	  }

	  /**
	   * Function to set items to the list.
	   */
	  set trayitems(items) {
	    this.tag('MyButtonsList').items = items.map(info => {
	      return {
	        w: col_w$1,
	        h: row_h$1,
	        type: ListItem$1,
	        data: info
	      }
	    });
	    this.tag('MyButtonsList').start();
	  }

	  /**
	   * Function to set background images.
	   */
	  set backgroundImage(backgroundImage) {
	    this.backgroundImageInfo = backgroundImage;
	  }

	  /**
	   * Function to get background images.
	   */
	  get backgroundImage() {
	    return this.backgroundImageInfo
	  }

	  /**
	   * Function to handle the different states of the app.
	   */
	  static _states() {
	    return [
	      class ShowBackgroundPage extends this {
	        _getFocused() {
	          this.tag('ImageTrayView').setSmooth('y', '0');
	          if (this.tag('MyButtonsList').length) {
	            return this.tag('MyButtonsList').element
	          }
	        }
	        _handleRight() {
	          if (this.tag('MyButtonsList').length - 1 != this.tag('MyButtonsList').index) {
	            this.tag('MyButtonsList').setNext();
	          }
	          return this.tag('MyButtonsList').element
	        }
	        _handleLeft() {
	          if (0 != this.tag('MyButtonsList').index) {
	            this.tag('MyButtonsList').setPrevious();
	          }
	          return this.tag('MyButtonsList').element
	        }
	        _handleEnter() {
	          this._setState('HideBackgroundPage');
	          this.fireAncestors(
	            '$changeBackgroundImage',
	            this.backgroundImage[this.tag('MyButtonsList').index]
	          );
	        }
	        _handleDown() {
	          this.fireAncestors('$moveToSwitcher');
	        }
	        _handleUp() {
	          this.tag('ImageTrayView').setSmooth('y', '0');
	        }
	      },
	      class HideBackgroundPage extends this {
	        $enter() {
	          this.tag('ImageTrayView').setSmooth('y', '-420');
	        }
	        _getFocused() {
	          if (this.tag('MyButtonsList').length) {
	            return this.tag('MyButtonsList').element
	          }
	        }
	        _handleDown() {
	          this.fireAncestors('$moveToSwitcher');
	          this._setState('ShowBackgroundPage');
	        }
	        _handleUp() {
	          this._setState('ShowBackgroundPage');
	        }
	      }
	    ]
	  }
	}

	class Logo extends Lightning.Component {
	  static _template() {
	    return {
	      Logo: {
	        x: 30,
	        y: 30,
	        w: 200,
	        h: 45,
	        src: Utils.asset(ImageConstants.RDK_LOGO)
	      }
	    }
	  }
	}

	/**
	 * Class which contains data for background tray.
	 */
	var trayViewInfo = [
	  'philly_img2.jpg',
	  'Main_Menu_BG10_Rtile.png',
	  'Main_Menu_BG1_Rtile.png',
	  'Main_Menu_BG2_Rtile.png',
	  'Main_Menu_BG3_Rtile.png',
	  'Main_Menu_BG4_Rtile.png',
	  'Main_Menu_BG5_Rtile.png'
	];

	// import { Utils } from 'wpe-lightning-sdk'

	/**
	 * Class which contains data for app listings.
	 */
	var imageViewInfo = [
	  {
	    displayName: 'App Store',
	    applicationType: 'Lightning',
	    uri: 'https://widgets.metrological.com/lightning/rdk/d431ce8577be56e82630650bf701c57d',
	    url: '/images/metro.jpg',
	    mSuspended: 100,
	    mPeak: 100
	  },
	  {
	    displayName: 'YouTube TV',
	    applicationType: 'Cobalt',
	    uri: 'https://www.youtube.com/tv',
	    url: '/images/youtube.jpg',
	    mSuspended: 100,
	    mPeak: 100
	  },
	  {
	    displayName: 'Bouncing Ball',
	    applicationType: 'Lightning',
	    uri: 'https://rdkwiki.com/rdk-apps/BouncingBall/index.html',
	    url: '/images/lightning.jpg',
	    mSuspended: 100,
	    mPeak: 100
	  },
	  {
	    displayName: 'Bluetooth Audio',
	    applicationType: 'Lightning',
	    uri: 'http://127.0.0.1:50050/btaudio/index.html',
	    url: '/images/rdkm-bluetooth1.jpg',
	    mSuspended: 40,
	    mPeak: 40
	  }
	];

	/**
	 * Class which contains data for button view..
	 */
	var buttonViewInfo = [
	  {
	    itemType: 'MenuActionButtonItem',
	    title: 'TV Shows',
	    icon: './images/icons/ic_movies_40px.svg'
	  },
	  {
	    itemType: 'MenuActionButtonItem',
	    title: 'Apps',
	    icon: './images/icons/ic_apps_40px.svg'
	  },
	  {
	    itemType: 'MenuActionButtonItem',
	    title: 'Setup',
	    icon: './images/icons/ic_TVshows_40px.svg'
	  },
	  //    {
	  //      itemType: 'MenuActionButtonItem',
	  //      title: 'Screensaver',
	  //      icon: './images/icons/ic_library_40px.svg',
	  //    },
	  {
	    itemType: 'MenuActionButtonItem',
	    title: 'About',
	    icon: './images/icons/ic_favorite_40px.svg'
	  }
	];

	/**
	 * Class which contains data for background images.
	 */
	var backgroundImageInfo = [
	  'philly_img2.jpg',
	  'Main_Menu_BG10_720p.jpg',
	  'Main_Menu_BG1_720p.jpg',
	  'Main_Menu_BG2_720p.jpg',
	  'Main_Menu_BG3_720p.jpg',
	  'Main_Menu_BG4_720p.jpg',
	  'Main_Menu_BG5_720p.jpg'
	];

	/**
	 * Class that returns the data required for app.
	 */
	class Api {
	  /**
	   * Function that returns the data for background tray view.
	   */
	  getTrayViewInfo() {
	    return trayViewInfo
	  }

	  /**
	   * Function that returns the data for background images.
	   */
	  getBackgroundImageInfo() {
	    return backgroundImageInfo
	  }

	  /**
	   * Function that returns the data for app image view.
	   */
	  getImageViewInfo() {
	    return imageViewInfo
	  }

	  /**
	   * Function that returns the data for button view.
	   */
	  getButtonViewInfo() {
	    return buttonViewInfo
	  }
	}

	/**
	 * Class to render the Switcher app.
	 */
	class App extends Lightning.Component {
	  /**
	   * Function to render the components in the app.
	   */
	  static _template() {
	    return {
	      BackgroundImage: {
	        w: 1920,
	        h: 1080,
	        src: Utils.asset(ImageConstants.BACKGROUND_IMAGE),
	        Logo: {
	          type: Logo
	        }
	      },
	      ContentView: {
	        x: 0,
	        y: 0,
	        w: 1920,
	        h: 1080,
	        Switcher: {
	          type: Switcher,
	          x: 0,
	          y: 0,
	          w: 1920,
	          h: 1080
	        },
	        Background: {
	          type: Background,
	          x: 0,
	          y: -1080,
	          w: 1920,
	          h: 1080,
	          alpha: 1
	        }
	      }
	    }
	  }

	  _init() {
	    this._api = new Api();
	    var appItems = this._api.getImageViewInfo();
	    const URL_PARAMS = new window.URLSearchParams(window.location.search);
	    var data = URL_PARAMS.get('data');
	    var prop_apps = 'applications';
	    var prop_displayname = 'displayName';
	    var prop_uri = 'uri';
	    var prop_apptype = 'applicationType';
	    var prop_url = 'url';
	    var appdetails =[];
	    var appdetails_format = [];
	    var usbApps = 0;
	    try {
	      if (data != null && JSON.parse(data).hasOwnProperty(prop_apps)) {
	        appdetails = JSON.parse(data).applications;
	        for (var i = 0; i < appdetails.length; i++){
	         if(appdetails[i].hasOwnProperty(prop_displayname) &&
	         appdetails[i].hasOwnProperty(prop_uri) &&
	         appdetails[i].hasOwnProperty(prop_apptype) &&
	         appdetails[i].hasOwnProperty(prop_url)) {
	         appdetails_format.push(appdetails[i]);
	         usbApps++;
	        }
	        }
	        for (var i = 0; i < appItems.length; i++){
	          appdetails_format.push(appItems[i]);
	        }
	      }
	      else {
	        appdetails_format = appItems;
	      }
	  } catch (e) {
	      appdetails_format = appItems;
	      console.log("Query data is not proper: "+ e);
	  }
	    this.tag('Switcher').usbAppsCout = usbApps;
	    this.tag('Switcher').imageitems = appdetails_format;
	    this.tag('Switcher').buttonitems = this._api.getButtonViewInfo();
	    this.tag('Background').trayitems = this._api.getTrayViewInfo();
	    this.tag('Background').backgroundImage = this._api.getBackgroundImageInfo();
	    this._setState('Switcher');
	  }

	  /**
	   * Function to set the app to Background state.
	   */
	  $moveToBackground() {
	    this._setState('Background');
	  }

	  /**
	   * Function to set the app to Switcher state.
	   */
	  $moveToSwitcher() {
	    this._setState('Switcher');
	  }

	  /**
	   * Function to change the background image.
	   */
	  $changeBackgroundImage(image) {
	    this.tag('BackgroundImage').patch({
	      src: Utils.asset('images/backgrounds/' + image)
	    });
	  }
	  /**
	   * Function to handle the different states of the app.
	   */
	  static _states() {
	    return [
	      class Switcher extends this {
	        $enter() {
	          this.tag('ContentView').y = 0;
	        }
	        _getFocused() {
	          return this.tag('Switcher')
	        }
	      },
	      class Background extends this {
	        $enter() {
	          this.tag('ContentView').y = 1080;
	        }
	        _getFocused() {
	          return this.tag('Background')
	        }
	      }
	    ]
	  }
	}

	function index() {
	  return Launch(App, ...arguments)
	}

	return index;

}());
//# sourceMappingURL=appBundle.js.map
