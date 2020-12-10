/**
 * App version: 1.0.0
 * SDK version: 2.0.3
 * CLI version: 1.7.4
 * 
 * Generated: Tue, 18 Aug 2020 16:16:57 GMT
 */

var APP_com_comcast_app_reference = (function () {
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

	window.attachInspector = function({
	  Element,
	  ElementCore,
	  Stage,
	  Component,
	  ElementTexturizer,
	  Texture
	}) {
	  const isAlreadyAttached = window.hasOwnProperty('mutationCounter');
	  if (isAlreadyAttached) {
	    return
	  }

	  window.mutationCounter = 0;
	  window.mutatingChildren = false;
	  var observer = new MutationObserver(function(mutations) {
	    var fa = [
	      'x',
	      'y',
	      'w',
	      'h',
	      'alpha',
	      'mountX',
	      'mountY',
	      'pivotX',
	      'pivotY',
	      'scaleX',
	      'scaleY',
	      'rotation',
	      'visible',
	      'clipping',
	      'rect',
	      'colorUl',
	      'colorUr',
	      'colorBl',
	      'colorBr',
	      'color',
	      'borderWidthLeft',
	      'borderWidthRight',
	      'borderWidthTop',
	      'borderWidthBottom',
	      'borderWidth',
	      'borderColorLeft',
	      'borderColorRight',
	      'borderColorTop',
	      'borderColorBottom',
	      'borderColor',
	      'zIndex',
	      'forceZIndexContext',
	      'renderToTexture',
	      'renderToTextureLazy',
	      'renderOffscreen',
	      'colorizeResultTexture',
	      'texture'
	    ];
	    var fac = fa.map(function(v) {
	      return v.toLowerCase()
	    });

	    mutations.forEach(function(mutation) {
	      if (mutation.type == 'childList') {
	        var node = mutation.target;
	        var c = mutation.target.element;
	      }

	      if (
	        mutation.type == 'attributes' &&
	        mutation.attributeName !== 'style' &&
	        mutation.attributeName !== 'class'
	      ) {
	        var n = mutation.attributeName.toLowerCase();
	        var c = mutation.target.element;

	        if (c.__ignore_attrib_changes === window.mutationCounter) {
	          // Ignore attribute changes that were caused by actual value modifications by js.
	          return
	        }

	        var v = mutation.target.getAttribute(mutation.attributeName);

	        if (n.startsWith('texture-')) {
	          if (c.displayedTexture) {
	            const att = n.substr(8).split('_');
	            const camelCaseAtt =
	              att[0] +
	              att
	                .slice(1)
	                .map(a => {
	                  return a.substr(0, 1).toUpperCase() + a.substr(1).toLowerCase()
	                })
	                .join();

	            c.displayedTexture[camelCaseAtt] = v;
	          }
	          return
	        }

	        var index = fac.indexOf(n);
	        if (index !== -1) {
	          var rn = fa[index];
	          var pv;
	          try {
	            if (v === null) {
	              switch (rn) {
	                case 'pivotX':
	                case 'pivotY':
	                  pv = 0.5;
	                  break
	                case 'alpha':
	                case 'scaleX':
	                case 'scaleY':
	                  pv = 1;
	                  break
	                case 'visible':
	                  pv = true;
	                  break
	                case 'clipping':
	                  pv = false;
	                  break
	                case 'rect':
	                  pv = false;
	                  break
	                case 'zIndex':
	                  pv = 0;
	                  break
	                case 'forceZIndexContext':
	                  pv = false;
	                  break
	                case 'color':
	                  pv = 0xffffffff;
	                  break
	                case 'colorUl':
	                case 'colorUr':
	                case 'colorBl':
	                case 'colorBr':
	                  if (mutation.target.hasAttribute('color')) {
	                    // This may happen when the separate values are combined.
	                    return
	                  }
	                  pv = 0xffffffff;
	                  break
	                case 'renderToTexture':
	                  pv = false;
	                  break
	                case 'renderToTextureLazy':
	                  pv = false;
	                  break
	                case 'renderOffscreen':
	                  pv = false;
	                  break
	                case 'colorizeResultTexture':
	                  pv = false;
	                  break
	                default:
	                  pv = 0;
	              }
	            } else {
	              switch (rn) {
	                case 'color':
	                case 'colorUl':
	                case 'colorUr':
	                case 'colorBl':
	                case 'colorBr':
	                  pv = parseInt(v, 16);
	                  break
	                case 'visible':
	                case 'clipping':
	                case 'rect':
	                case 'forceZIndexContext':
	                case 'renderToTexture':
	                case 'renderToTextureLazy':
	                case 'renderOffscreen':
	                case 'colorizeResultTexture':
	                  pv = v === 'true';
	                  break
	                case 'texture':
	                  pv = JSON.parse(v);
	                  break
	                default:
	                  pv = parseFloat(v);
	                  if (isNaN(pv)) throw 'e'
	              }
	            }

	            var fv;
	            switch (rn) {
	              case 'color':
	                var f = ['colorUl', 'colorUr', 'colorBl', 'colorBr'].map(function(q) {
	                  return mutation.target.hasAttribute(q)
	                });

	                if (!f[0]) c['colorUl'] = pv;
	                if (!f[1]) c['colorUr'] = pv;
	                if (!f[2]) c['colorBl'] = pv;
	                if (!f[3]) c['colorBr'] = pv;
	                break
	              default:
	                c[rn] = pv;
	            }

	            // Set final value, not the transitioned value.
	          } catch (e) {
	            console.error('Bad (ignored) attribute value', rn);
	          }
	        }
	      }
	    });

	    window.mutationCounter++;
	  });

	  ElementCore.prototype.dhtml = function() {
	    return this._element.dhtml()
	  };

	  Element.prototype.dhtml = function() {
	    if (!this.debugElement) {
	      this.debugElement = document.createElement('DIV');
	      this.debugElement.setAttribute('type', this.constructor.name);
	      this.debugElement.element = this;
	      this.debugElement.style.position = 'absolute';

	      this.debugElement.id = '' + this.id;
	      observer.observe(this.debugElement, { attributes: true });
	    }
	    if (this.stage.root === this && !this.dhtml_root) {
	      // Root element.
	      var root = document.createElement('DIV');
	      document.body.appendChild(root);
	      var self = this;
	      setTimeout(function() {
	        var bcr = self.stage.getCanvas().getBoundingClientRect();
	        root.style.left = bcr.left + 'px';
	        root.style.top = bcr.top + 'px';
	        root.style.width = Math.ceil(bcr.width / self.stage.getRenderPrecision()) + 'px';
	        root.style.height = Math.ceil(bcr.height / self.stage.getRenderPrecision()) + 'px';
	        root.style.transformOrigin = '0 0 0';
	        root.style.transform =
	          'scale(' + self.stage.getRenderPrecision() + ',' + self.stage.getRenderPrecision() + ')';
	      }, 1000);

	      root.style.position = 'absolute';
	      root.style.overflow = 'hidden';
	      root.style.zIndex = '65535';
	      root.appendChild(this.debugElement);

	      this.dhtml_root = root;
	    }
	    return this.debugElement
	  };

	  var oElement = Element;

	  var oSetParent = oElement.prototype._setParent;
	  Element.prototype._setParent = function(parent) {
	    var prevParent = this.parent;
	    oSetParent.apply(this, arguments);

	    if (!window.mutatingChildren) {
	      if (parent) {
	        var index = parent._children.getIndex(this);
	        if (index == parent._children.get().length - 1) {
	          parent.dhtml().appendChild(this.dhtml());
	        } else {
	          parent.dhtml().insertBefore(this.dhtml(), parent.dhtml().children[index]);
	        }
	      } else {
	        if (prevParent) {
	          prevParent.dhtml().removeChild(this.dhtml());
	        }
	      }
	    }
	  };

	  var oInit = Stage.prototype.init;
	  Stage.prototype.init = function() {
	    oInit.apply(this, arguments);

	    // Apply stage scaling.
	    this.root.core.updateDebugTransforms();
	  };

	  var oAddTag = oElement.prototype.addTag;
	  Element.prototype.addTag = function(tag) {
	    oAddTag.apply(this, arguments);

	    if (tag) {
	      this.dhtml().classList.add(tag);
	    }
	  };

	  var oRemoveTag = oElement.prototype.removeTag;
	  Element.prototype.removeTag = function(tag) {
	    oRemoveTag.apply(this, arguments);

	    if (tag) {
	      this.dhtml().classList.remove(tag);
	    }
	  };

	  // Change an attribute due to new value inputs.
	  var val = function(c, n, v, dv) {
	    if (c._element) {
	      c = c._element;
	    }
	    if (v == dv) {
	      c.dhtmlRemoveAttribute(n);
	    } else {
	      c.dhtmlSetAttribute(n, v);
	    }
	  };

	  Element.prototype.dhtmlRemoveAttribute = function() {
	    // We don't want the attribute listeners to be called during the next observer cycle.
	    this.__ignore_attrib_changes = window.mutationCounter;
	    this.dhtml().removeAttribute.apply(this.dhtml(), arguments);
	  };

	  Element.prototype.dhtmlSetAttribute = function() {
	    this.__ignore_attrib_changes = window.mutationCounter;
	    this.dhtml().setAttribute.apply(this.dhtml(), arguments);
	  };

	  if (typeof Component !== 'undefined') {
	    Object.defineProperty(Component.prototype, '_state', {
	      get: function() {
	        return this.__state
	      },
	      set: function(v) {
	        if (this.__state !== v) {
	          if (this.__state !== null) {
	            // Ignore initial.
	            val(this, 'state', v ? v.__path : '', '');
	          }
	          this.__state = v;
	        }
	      }
	    });
	  }

	  Element.prototype.$ref = Element.prototype.__ref;
	  Object.defineProperty(Element.prototype, '__ref', {
	    get: function() {
	      return this.$ref
	    },
	    set: function(v) {
	      if (this.$ref !== v) {
	        val(this, 'ref', v, null);
	        this.$ref = v;
	      }
	    }
	  });

	  ElementCore.prototype.$x = ElementCore.prototype._x;
	  Object.defineProperty(ElementCore.prototype, '_x', {
	    get: function() {
	      return this.$x
	    },
	    set: function(v) {
	      if (this.$x !== v) {
	        val(this, 'x', v, 0);
	        this.$x = v;
	        this.updateLeft();
	      }
	    }
	  });

	  ElementCore.prototype.$y = ElementCore.prototype._y;
	  Object.defineProperty(ElementCore.prototype, '_y', {
	    get: function() {
	      return this.$y
	    },
	    set: function(v) {
	      if (this.$y !== v) {
	        val(this, 'y', v, 0);
	        this.$y = v;
	        this.updateTop();
	      }
	    }
	  });

	  Element.prototype.$w = Element.prototype._w;
	  Object.defineProperty(Element.prototype, '_w', {
	    get: function() {
	      return this.$w
	    },
	    set: function(v) {
	      if (this.$w !== v) {
	        val(this, 'w', v, 0);
	        this.$w = v;
	      }
	    }
	  });

	  Element.prototype.$h = Element.prototype._h;
	  Object.defineProperty(Element.prototype, '_h', {
	    get: function() {
	      return this.$h
	    },
	    set: function(v) {
	      if (this.$h !== v) {
	        val(this, 'h', v, 0);
	        this.$h = v;
	      }
	    }
	  });

	  ElementCore.prototype.updateLeft = function() {
	    var mx = this._mountX * this._w;
	    var x = this._x - mx;
	    this.dhtml().style.left = x + 'px';
	  };

	  ElementCore.prototype.updateTop = function() {
	    var my = this._mountY * this._h;
	    var y = this._y - my;
	    this.dhtml().style.top = y + 'px';
	  };

	  ElementCore.prototype.__w = 0;
	  Object.defineProperty(ElementCore.prototype, '_w', {
	    get: function() {
	      return this.__w
	    },
	    set: function(v) {
	      this.__w = v;
	      this.dhtml().style.width = v + 'px';
	      this.updateLeft();
	    }
	  });

	  ElementCore.prototype.__h = 0;
	  Object.defineProperty(ElementCore.prototype, '_h', {
	    get: function() {
	      return this.__h
	    },
	    set: function(v) {
	      this.__h = v;
	      this.dhtml().style.height = v + 'px';
	      this.updateTop();
	    }
	  });

	  ElementCore.prototype.$alpha = 1;
	  Object.defineProperty(ElementCore.prototype, '_alpha', {
	    get: function() {
	      return this.$alpha
	    },
	    set: function(v) {
	      if (this.$alpha !== v) {
	        val(this, 'alpha', v, 1);
	        this.$alpha = v;
	        this.dhtml().style.opacity = v;
	        this.dhtml().style.display = this.$visible && this.$alpha ? 'block' : 'none';
	      }
	    }
	  });

	  ElementCore.prototype.$visible = true;
	  Object.defineProperty(ElementCore.prototype, '_visible', {
	    get: function() {
	      return this.$visible
	    },
	    set: function(v) {
	      if (this.$visible !== v) {
	        val(this, 'visible', v, true);
	        this.$visible = v;
	        this.dhtml().style.visibility = v ? 'visible' : 'hidden';
	        this.dhtml().style.display = this.$visible && this.$alpha ? 'block' : 'none';
	      }
	    }
	  });

	  ElementCore.prototype.$rotation = 0;
	  Object.defineProperty(ElementCore.prototype, '_rotation', {
	    get: function() {
	      return this.$rotation
	    },
	    set: function(v) {
	      if (this.$rotation !== v) {
	        val(this, 'rotation', v, 0);
	        this.$rotation = v;
	        this.updateDebugTransforms();
	      }
	    }
	  });

	  ElementCore.prototype.$scaleX = 1;
	  Object.defineProperty(ElementCore.prototype, '_scaleX', {
	    get: function() {
	      return this.$scaleX
	    },
	    set: function(v) {
	      if (this.$scaleX !== v) {
	        val(this, 'scaleX', v, 1);
	        this.$scaleX = v;
	        this.updateDebugTransforms();
	      }
	    }
	  });

	  ElementCore.prototype.$scaleY = 1;
	  Object.defineProperty(ElementCore.prototype, '_scaleY', {
	    get: function() {
	      return this.$scaleY
	    },
	    set: function(v) {
	      if (this.$scaleY !== v) {
	        val(this, 'scaleY', v, 1);
	        this.$scaleY = v;
	        this.updateDebugTransforms();
	      }
	    }
	  });

	  ElementCore.prototype.$pivotX = 0.5;
	  Object.defineProperty(ElementCore.prototype, '_pivotX', {
	    get: function() {
	      return this.$pivotX
	    },
	    set: function(v) {
	      if (this.$pivotX !== v) {
	        val(this, 'pivotX', v, 0.5);
	        this.$pivotX = v;
	        this.updateDebugTransforms();
	      }
	    }
	  });

	  ElementCore.prototype.$pivotY = 0.5;
	  Object.defineProperty(ElementCore.prototype, '_pivotY', {
	    get: function() {
	      return this.$pivotY
	    },
	    set: function(v) {
	      if (this.$pivotY !== v) {
	        val(this, 'pivotY', v, 0.5);
	        this.$pivotY = v;
	        this.updateDebugTransforms();
	      }
	    }
	  });

	  ElementCore.prototype.$mountX = 0;
	  Object.defineProperty(ElementCore.prototype, '_mountX', {
	    get: function() {
	      return this.$mountX
	    },
	    set: function(v) {
	      if (this.$mountX !== v) {
	        val(this, 'mountX', v, 0);
	        this.$mountX = v;
	        this.updateLeft();
	      }
	    }
	  });

	  ElementCore.prototype.$mountY = 0;
	  Object.defineProperty(ElementCore.prototype, '_mountY', {
	    get: function() {
	      return this.$mountY
	    },
	    set: function(v) {
	      if (this.$mountY !== v) {
	        val(this, 'mountY', v, 0);
	        this.$mountY = v;
	        this.updateTop();
	      }
	    }
	  });

	  ElementCore.prototype.__zIndex = 0;
	  Object.defineProperty(ElementCore.prototype, '_zIndex', {
	    get: function() {
	      return this.__zIndex
	    },
	    set: function(v) {
	      if (this.__zIndex !== v) {
	        val(this, 'zIndex', v, 0);
	        this.__zIndex = v;
	        if (this.__zIndex || v) {
	          this.dhtml().style.zIndex = v;
	        }
	      }
	    }
	  });

	  ElementCore.prototype.__forceZIndexContext = false;
	  Object.defineProperty(ElementCore.prototype, '_forceZIndexContext', {
	    get: function() {
	      return this.__forceZIndexContext
	    },
	    set: function(v) {
	      if (this.__forceZIndexContext !== v) {
	        val(this, 'forceZIndexContext', v, false);
	        this.__forceZIndexContext = v;
	      }
	    }
	  });

	  ElementCore.prototype.__clipping = false;
	  Object.defineProperty(ElementCore.prototype, '_clipping', {
	    get: function() {
	      return this.__clipping
	    },
	    set: function(v) {
	      if (this.__clipping !== v) {
	        val(this, 'clipping', v, false);
	        this.__clipping = v;
	        var nv = v ? 'hidden' : 'visible';
	        if (v || (!v && this.dhtml().style.overflow == 'hidden')) {
	          this.dhtml().style.overflow = nv;
	        }
	      }
	    }
	  });

	  ElementCore.prototype.__withinBoundsMargin = false;
	  Object.defineProperty(ElementCore.prototype, '_withinBoundsMargin', {
	    get: function() {
	      return this.__withinBoundsMargin
	    },
	    set: function(v) {
	      if (this.__withinBoundsMargin !== v) {
	        val(this, 'withinBoundsMargin', v, false);
	        this.__withinBoundsMargin = v;
	      }
	    }
	  });

	  ElementCore.prototype.__colorUl = 0xffffffff;
	  Object.defineProperty(ElementCore.prototype, '_colorUl', {
	    get: function() {
	      return this.__colorUl
	    },
	    set: function(v) {
	      if (this.__colorUl !== v) {
	        val(this, 'colorUl', v.toString(16), 'ffffffff');
	        this.__colorUl = v;
	        checkColors(this);
	      }
	    }
	  });

	  ElementCore.prototype.__colorUr = 0xffffffff;
	  Object.defineProperty(ElementCore.prototype, '_colorUr', {
	    get: function() {
	      return this.__colorUr
	    },
	    set: function(v) {
	      if (this.__colorUr !== v) {
	        val(this, 'colorUr', v.toString(16), 'ffffffff');
	        this.__colorUr = v;
	        checkColors(this);
	      }
	    }
	  });

	  ElementCore.prototype.__colorBl = 0xffffffff;
	  Object.defineProperty(ElementCore.prototype, '_colorBl', {
	    get: function() {
	      return this.__colorBl
	    },
	    set: function(v) {
	      if (this.__colorBl !== v) {
	        val(this, 'colorBl', v.toString(16), 'ffffffff');
	        this.__colorBl = v;
	        checkColors(this);
	      }
	    }
	  });

	  ElementCore.prototype.__colorBr = 0xffffffff;
	  Object.defineProperty(ElementCore.prototype, '_colorBr', {
	    get: function() {
	      return this.__colorBr
	    },
	    set: function(v) {
	      if (this.__colorBr !== v) {
	        val(this, 'colorBr', v.toString(16), 'ffffffff');
	        this.__colorBr = v;
	        checkColors(this);
	      }
	    }
	  });

	  Element.prototype.$texture = null;
	  Object.defineProperty(Element.prototype, '__texture', {
	    get: function() {
	      return this.$texture
	    },
	    set: function(v) {
	      this.$texture = v;

	      val(this, 'rect', this.rect, false);
	      val(this, 'src', this.src, null);
	    }
	  });

	  var checkColors = function(elementRenderer) {
	    let element = elementRenderer._element;
	    if (elementRenderer._colorBr === undefined) {
	      // Element initialization.
	      return
	    }

	    if (
	      elementRenderer._colorUl === elementRenderer._colorUr &&
	      elementRenderer._colorUl === elementRenderer._colorBl &&
	      elementRenderer._colorUl === elementRenderer._colorBr
	    ) {
	      if (elementRenderer._colorUl !== 0xffffffff) {
	        element.dhtmlSetAttribute('color', elementRenderer._colorUl.toString(16));
	      } else {
	        element.dhtmlRemoveAttribute('color');
	      }
	      element.dhtmlRemoveAttribute('colorul');
	      element.dhtmlRemoveAttribute('colorur');
	      element.dhtmlRemoveAttribute('colorbl');
	      element.dhtmlRemoveAttribute('colorbr');
	    } else {
	      val(element, 'colorUr', elementRenderer.colorUr.toString(16), 'ffffffff');
	      val(element, 'colorUl', elementRenderer.colorUl.toString(16), 'ffffffff');
	      val(element, 'colorBr', elementRenderer.colorBr.toString(16), 'ffffffff');
	      val(element, 'colorBl', elementRenderer.colorBl.toString(16), 'ffffffff');
	      element.dhtmlRemoveAttribute('color');
	    }
	  };

	  ElementTexturizer.prototype.__enabled = false;
	  Object.defineProperty(ElementTexturizer.prototype, '_enabled', {
	    get: function() {
	      return this.__enabled
	    },
	    set: function(v) {
	      if (this.__enabled !== v) {
	        val(this, 'renderToTexture', v, false);
	        this.__enabled = v;
	      }
	    }
	  });

	  ElementTexturizer.prototype.__lazy = false;
	  Object.defineProperty(ElementTexturizer.prototype, '_lazy', {
	    get: function() {
	      return this.__lazy
	    },
	    set: function(v) {
	      if (this.__lazy !== v) {
	        val(this, 'renderToTextureLazy', v, false);
	        this.__lazy = v;
	      }
	    }
	  });

	  ElementTexturizer.prototype.__colorize = false;
	  Object.defineProperty(ElementTexturizer.prototype, '_colorize', {
	    get: function() {
	      return this.__colorize
	    },
	    set: function(v) {
	      if (this.__colorize !== v) {
	        val(this, 'colorizeResultTexture', v, false);
	        this.__colorize = v;
	      }
	    }
	  });

	  ElementTexturizer.prototype.__renderOffscreen = false;
	  Object.defineProperty(ElementTexturizer.prototype, '_renderOffscreen', {
	    get: function() {
	      return this.__renderOffscreen
	    },
	    set: function(v) {
	      if (this.__renderOffscreen !== v) {
	        val(this, 'renderOffscreen', v, false);
	        this.__renderOffscreen = v;
	      }
	    }
	  });

	  ElementCore.prototype.updateDebugTransforms = function() {
	    const stage = this._element.stage;

	    if (this._pivotX !== 0.5 || this._pivotY !== 0.5) {
	      this.dhtml().style.transformOrigin = this._pivotX * 100 + '% ' + this._pivotY * 100 + '%';
	    } else if (this.dhtml().style.transformOrigin) {
	      this.dhtml().style.transformOrigin = '50% 50%';
	    }

	    var r = this._rotation;
	    var sx = this._scaleX;
	    var sy = this._scaleY;

	    if (sx !== undefined && sy !== undefined && this._element.id === 0) {
	      // Root element: must be scaled.
	      if (
	        stage.options.w !== stage.options.renderWidth ||
	        stage.options.h !== stage.options.renderHeight
	      ) {
	        sx *= stage.options.w / stage.options.renderWidth;
	        sy *= stage.options.h / stage.options.renderHeight;
	      }
	    }
	    var parts = [];
	    if (r) parts.push('rotate(' + r + 'rad)');
	    if (sx !== undefined && sy !== undefined && (sx !== 1 || sy !== 1))
	      parts.push('scale(' + sx + ', ' + sy + ')');

	    this.dhtml().style.transform = parts.join(' ');
	  };

	  var updateTextureAttribs = function(element) {
	    if (element.texture) {
	      const nonDefaults = element.texture.getNonDefaults();
	      const keys = Object.keys(nonDefaults);
	      keys.forEach(key => {
	        let f = '';
	        for (let i = 0, n = key.length; i < n; i++) {
	          const c = key.charAt(i);
	          if (c !== c.toLowerCase()) {
	            f += '_' + c.toLowerCase();
	          } else {
	            f += c;
	          }
	        }
	        val(element, `texture-${f}`, nonDefaults[key], false);
	      });
	    }
	  };

	  const _performUpdateSource = Texture.prototype._performUpdateSource;
	  Texture.prototype._performUpdateSource = function() {
	    _performUpdateSource.apply(this, arguments);
	    this.elements.forEach(v => {
	      updateTextureAttribs(v);
	    });
	  };

	  const _setDisplayedTexture = Element.prototype._setDisplayedTexture;
	  Element.prototype._setDisplayedTexture = function() {
	    _setDisplayedTexture.apply(this, arguments);
	    updateTextureAttribs(this);
	  };
	};

	if (window.lng) {
	  // Automatically attach inspector if lng was already loaded.
	  attachInspector(lng);
	}

	let BaseEventManager = function() {
	  this._listeners = {};
	  this._queue = [];
	};

	/**
	 * Add listener to specified event
	 */
	BaseEventManager.prototype.on = function(event_name, callback) {
	  if (!this._listeners[event_name]) {
	    this._listeners[event_name] = [];
	  }
	  if (this._listeners[event_name].indexOf(callback) === -1) {
	    this._listeners[event_name].push(callback);
	  }
	};

	/**
	 * Remove specified event listener
	 */
	BaseEventManager.prototype.delListener = function(event_name, callback) {
	  if (!this._listeners[event_name]) {
	    return
	  }

	  let pos = this._listeners[event_name].indexOf(callback);

	  if (!pos === -1) {
	    delete this._listeners[event_name][pos];
	  }
	};

	/**
	 * Clears listeners (remove all listeners for all events)
	 */
	BaseEventManager.prototype.clearListeners = function() {
	  this._listeners = {};
	};

	/**
	 * Fire specified event
	 */
	BaseEventManager.prototype.fireEvent = function(event_name, original_event) {
	  var list = this._queue;

	  list.push({
	    event_name: event_name,
	    original_event: original_event
	  });

	  this._queue = [];

	  this._processEvents(list);
	};

	/**
	 * Delayed events.
	 * Add event to the queue and keep the queue until some other event is fired,
	 * Then a) process the queued events  b) process the event that has been fired
	 * In other words, the queue must be emptied _before_ the event causing it to empty
	 * is processed
	 */
	BaseEventManager.prototype.queueEvent = function(event_name, original_event) {
	  this._queue.push({
	    event_name: event_name,
	    original_event: original_event
	  });
	};

	/**
	 * Processing events from specified list
	 */
	BaseEventManager.prototype._processEvents = function(list) {
	  if (!this._listeners) {
	    return
	  }

	  for (var e of list) {
	    if (!this._listeners[e.event_name]) {
	      continue
	    }

	    for (let i in this._listeners[e.event_name]) {
	      this._listeners[e.event_name][i](e.original_event);
	    }
	  }
	};

	const Utils$1 = {
	  parseBool: function(value) {
	    const string_value = String(value).toLowerCase();
	    let ret = false;

	    switch (string_value) {
	      case '1':
	      case 'on':
	      case 'yes':
	      case 'true':
	        ret = true;
	        break

	      default:
	        ret = false;
	    }

	    return ret
	  },

	  isEmpty: function(object) {
	    return Object.keys(object).length === 0
	  },

	  sprintf: function(format) {
	    for (let i = 1; i < arguments.length; i++) {
	      format = format.replace(/%[sd]/, arguments[i]);
	    }
	    return format
	  }
	};

	/**
	 * Application options
	 */
	let Options = {
	  debug: 'off',
	  emulation: 'off',
	  webpack: 'on',
	  require: 'off' // used only in logger.js, requires ~/.pxsceneEnableRequire file to be present
	};

	let requireEnabled = Utils$1.parseBool(Options.require);
	let fs = null;
	let filename = 'bt-audio-in-log.txt';

	let Logger = function() {
	  /**
	   * This is a very simple string formatter which expects arguments[0] to be a string with %s occurrences
	   * These occurrences are substituted with the next entries of the arguments object
	   * In other words:
	   * let s = sprintf('Hello, %s', 'world'); // would work
	   * let s = sprintf('Hello', 'world'); // would not work
	   * let s = sprintf(555); // would not work
	   */

	  let sprintf = function(format) {
	    for (let i = 1; i < arguments.length; i++) {
	      format = format.replace(/%[sd]/, arguments[i]);
	    }
	    return format
	  };

	  let getTimestamp = function() {
	    let date = new Date();
	    let m = date.getMonth();
	    let d = date.getDate();
	    let h = date.getHours();
	    let i = date.getMinutes();
	    let s = date.getSeconds();
	    let l = date.getMilliseconds();

	    let l_str = ('00' + l).slice(-3);

	    return (
	      date.getFullYear() +
	      '-' +
	      (m > 9 ? '' : '0') +
	      m +
	      '-' +
	      (d > 9 ? '' : '0') +
	      d +
	      ' ' +
	      (h > 9 ? '' : '0') +
	      h +
	      ':' +
	      (i > 9 ? '' : '0') +
	      i +
	      ':' +
	      (s > 9 ? '' : '0') +
	      s +
	      ':' +
	      l_str
	    )
	  };

	  this._log_stream = null;

	  this.log = function() {
	    let identity_prop = 'identity';
	    let identity_name;
	    let identity_marker;

	    let default_name = this.constructor.name;
	    let default_marker = { left: '(', right: ') ' };

	    if (this.hasOwnProperty(identity_prop)) {
	      identity_name = this[identity_prop].hasOwnProperty('name') ? this.identity.name : default_name;
	      identity_marker = this[identity_prop].hasOwnProperty('marker')
	        ? this.identity.marker
	        : default_marker;
	    } else {
	      identity_name = default_name;
	      identity_marker = default_marker;
	    }

	    let arguments_start_length = arguments.length;

	    let prompt = identity_marker.left + identity_name + identity_marker.right;

	    if (arguments.hasOwnProperty('0') && typeof arguments[0] === 'string') {
	      arguments[0] = prompt + arguments[0];
	    } else {
	      for (let i = Object.keys(arguments).length; i > 0; i--) {
	        arguments[i] = arguments[i - 1];
	      }

	      arguments[0] = prompt;

	      if (arguments.length === arguments_start_length) {
	        // length is not being updated automatically
	        arguments.length += 1;
	      }
	    }

	    console.log.apply(this, arguments);

	    let msg = sprintf.apply(this, arguments); //(!) see the sprintf notes above
	    //let new_args = JSON.parse(JSON.stringify({"0": msg}));
	    //this._log_stream.apply(this, new_args);
	    if (this._log_stream && typeof (this._log_stream === 'function')) {
	      this._log_stream(msg);
	    }

	    if (requireEnabled && fs) {
	      let record = '[' + getTimestamp() + '] ' + msg + '\n';
	      fs.appendFile(filename, record, function(err) {
	        if (err) throw err
	      });
	    }
	  };
	};

	/**
	 *  Bluetooth player emulation
	 *  Represents a bluetooth player program. Used by a bluetooth controller to emulate setPlayback commands
	 *  author: sgladk001c
	 *
	 */

	//let Logger = imported.Logger;

	// ------->> node starts here >>-------
	/*

	    let BaseEventManager = require('./base-event-manager');
	    //let Logger = require('./logger');

	*/
	// Common node/pxScene code
	//

	/**
	 * Internals
	 */

	let PlayerState = Object.freeze({ stopped: 1, paused: 2, playing: 3 });

	// Represents the current player state
	let AudioInfo = {
	  album: '',
	  artist: '',
	  genre: '',
	  title: '',
	  year: '',
	  duration: 0, // In milliseconds
	  number_of_tracks: 0,
	  track_number: 0,
	  track_idx: -1, // Not the same as TrackNumber in Playlist,
	  position: 0, // Number of milliseconds played back already
	  player_state: PlayerState.stopped
	};

	/**
	 * Constructor
	 */

	let Player = function() {
	  BaseEventManager.call(this);

	  this.name = 'player (emulation)';

	  this.identity = {
	    name: 'player',
	    marker: { left: '        ~', right: ' ~ ' } // indent = 8
	  };

	  this.playlist = null;

	  /**
	   * Private fields
	   */
	  this._options = {
	    speed_factor: 1
	  };

	  this._avaliable = false;
	  this._ai = AudioInfo;

	  this._tick_timer = null;
	  this._stream_timer = null;
	};

	/**
	 * Private methods
	 */

	Player.prototype = Object.create(BaseEventManager.prototype);
	Player.constructor = Player;
	// Logger.call(Player.prototype); // Enable for debugging (then use  this.log() for logging

	// Populates audio info from playlist item
	Player.prototype._setAi = function(idx) {
	  if (idx < 0 || idx > this.playlist.length() - 1) return false

	  let current_track = this.playlist.tracks[idx];

	  this._ai.album = current_track.Album;
	  this._ai.artist = current_track.Artist;
	  this._ai.genre = current_track.Genre;
	  this._ai.title = current_track.Title;
	  this._ai.year = current_track.Year;
	  this._ai.duration = current_track.Duration; // milliseconds
	  this._ai.number_of_tracks = current_track.NumberOfTracks;
	  this._ai.track_number = current_track.TrackNumber;
	  this._ai.track_idx = idx;
	  this._ai.position = 0;

	  return true
	};

	/**
	 * Public methods
	 */

	Player.prototype.init = function(playlist) {
	  if (typeof playlist !== 'object') {
	    this.fireEvent('plr_onError', { value: 'ERROR_INVALID_PLAYLIST', message: 'Invalid playlist' });
	    return false
	  }

	  this.playlist = playlist;
	  this.playlist.length = function() {
	    return this.tracks.length
	  };

	  this._setAi(0);
	  this._avaliable = true;

	  return true
	};

	Player.prototype.setOption = function(option, value) {
	  if (this._options.hasOwnProperty(option) && this._options[option] === value) {
	    return
	  }

	  this._options[option] = value;
	};

	Player.prototype.close = function() {
	  //makes it unavailable. Then init is required
	  this._avaliable = false;
	  this._ai.player_state = PlayerState.stopped;
	  clearInterval(this._tick_timer);
	  this.playlist = null;

	  this.fireEvent('plr_onClose', { audio_info: this._ai });
	};

	Player.prototype.play = function() {
	  // playing back the selected track from current offset
	  if (!this.isAvailable(1)) return
	  let _this = this;

	  clearInterval(this._tick_timer);

	  if (this.isPaused()) {
	    this.fireEvent('plr_onResume', { audio_info: this._ai });
	  } else {
	    this.fireEvent('plr_onStart', { audio_info: this._ai });
	  }
	  this._ai.player_state = PlayerState.playing;

	  // gradually increment play offset
	  // when it is reached this._ai.duration, call :next()
	  let increment = 333 * this._options.speed_factor;

	  if (!this._tick_timer === undefined) {
	    clearInterval(this._tick_timer);
	    this._tick_timer = null;
	  }

	  this._tick_timer = setInterval(function tick() {
	    _this._ai.position += increment;

	    if (!_this.isPlaying()) clearInterval(_this._tick_timer);

	    if (_this._ai.position >= _this._ai.duration) {
	      clearInterval(_this._tick_timer);
	      _this.next();
	    }
	  }, 333);

	  if (!this._stream_timer === undefined) {
	    clearInterval(this._stream_timer);
	    this._stream_timer = null;
	  }

	  this._stream_timer = setInterval(function streamStatus() {
	    if (_this.isPlaying()) {
	      _this.fireEvent('plr_onStreamUpdate', { audio_info: _this._ai });
	    } else {
	      clearInterval(_this._stream_timer);
	    }
	  }, 1000);
	};

	Player.prototype.pause = function() {
	  // keeping play offset
	  if (!this.isAvailable(1)) return

	  this._ai.player_state = PlayerState.paused;

	  this.fireEvent('plr_onPause', { audio_info: this._ai });
	};

	Player.prototype.stop = function() {
	  // stop and reset track position
	  if (!this.isAvailable(1)) return

	  this._ai.player_state = PlayerState.stopped;
	  this._ai.position = 0;

	  this.fireEvent('plr_onStop', { audio_info: this._ai });
	};

	Player.prototype.reset = function() {
	  // reset to track 0
	  if (!this.isAvailable(1)) return

	  this._ai.player_state = PlayerState.stopped;

	  this._setAi(0);

	  this.fireEvent('plr_onReset', { audio_info: this._ai });
	};

	Player.prototype.restart = function() {
	  // start the current track over
	  if (!this.isAvailable(1)) return

	  this._ai.position = 0;
	  this._ai.player_state = PlayerState.playing;

	  this.fireEvent('plr_onRestart', { audio_info: this._ai });
	};

	Player.prototype.next = function() {
	  if (!this.isAvailable(1)) return

	  let idx = this._ai.track_idx;

	  ++idx;

	  if (idx >= this.playlist.length()) {
	    // Loop over
	    idx = idx - this.playlist.length();
	  }

	  this._setAi(idx);
	  this.fireEvent('plr_onNext', { audio_info: this._ai });
	  if (this.isPlaying()) this.play();
	};

	Player.prototype.skipNext = function() {
	  if (!this.isAvailable(1)) return

	  let idx = this._ai.track_idx;

	  idx += 2;

	  if (idx >= this.playlist.length()) {
	    // Loop over
	    idx = idx - this.playlist.length();
	  }

	  this._setAi(idx);

	  this.fireEvent('plr_onSkipNext', { audio_info: this._ai });
	  if (this.isPlaying()) this.play();
	};

	Player.prototype.previous = function() {
	  if (!this.isAvailable(1)) return

	  let idx = this._ai.track_idx;

	  --idx;

	  if (idx < 0) {
	    // Loop over
	    idx += this.playlist.length();
	  }

	  this._setAi(idx);

	  this.fireEvent('plr_onPrevious', { audio_info: this._ai });
	  if (this.isPlaying()) this.play();
	};

	Player.prototype.skipPrevious = function() {
	  if (!this.isAvailable(1)) return

	  let idx = this._ai.track_idx;

	  idx -= 2;

	  if (idx < 0) {
	    // Loop over
	    idx += this.playlist.length();
	  }

	  this._setAi(idx);

	  this.fireEvent('plr_onSkipPrevious', { audio_info: this._ai });
	  if (this.isPlaying()) this.play();
	};

	Player.prototype.getAudioInfo = function() {
	  return this._ai
	};

	Player.prototype.isPlaying = function() {
	  return this._ai.player_state === PlayerState.playing
	};

	Player.prototype.isPaused = function() {
	  return this._ai.player_state === PlayerState.paused
	};

	Player.prototype.isStopped = function() {
	  return this._ai.player_state === PlayerState.stopped
	};

	Player.prototype.isAvailable = function(f) {
	  // f === true indicates the error event is required

	  if (!this._avaliable && Boolean(f)) {
	    this.fireEvent('plr_onError', {
	      value: 'STATUS_NOT_AVAILABLE',
	      message: 'Player is not available. Perform init first.'
	    });
	  }

	  return this._avaliable
	};

	/**
	 * Devices visible to controller
	 * Contains the list of devices that can be discovered after `startDeviceDiscovery` command (`scan on` in controller)
	 * Also contains the list of paired/trusted devices that controller stores internally
	 * author: sgladk001c
	 */
	const Devices = {
	  // Retrieved on device discovery
	  in_range: [
	    {
	      mac: '18:65:90:5D:4D:CA',
	      name: 'Valley Seven',
	      alias: 'Valley Seven',
	      class: '0x7a020c',
	      icon: 'phone',
	      legacy: false,
	      uuid_vendor_specific: '00000000-deca-fade-deca-deafdecacafe',
	      uuid_service_discovery_server: '00001000-0000-1000-8000-00805f9b34fb',
	      uuid_autio_source: '0000110a-0000-100-8000-00805f9b34fb',
	      uuid_av_remote_control_target: '0000110c-0000-1000-8000-00805f9b34fb',
	      uuid_advanced_audio_distribution: '0000110d-0000-1000-8000-00805f9b34fb',
	      uuid_a_v_remote_control: '0000110e-0000-1000-8000-00805f9b34fb',
	      uuid_nap: '00001116-0000-1000-8000-00805f9b34fb',
	      uuid_handsfree_audio_gateway: '0000111f-0000-1000-8000-00805f9b34fb',
	      uuid_phonebook_access_server: '0000112f-0000-1000-8000-00805f9b34fb',
	      uuid_message_access_server: '00001132-0000-1000-8000-00805f9b34fb',
	      uuid_pnp_information: '00001200-0000-1000-8000-00805f9b34fb',
	      modalias: 'bluetooth:v004Cp7006d0A30'
	    },
	    {
	      mac: '90:72:40:69:BB:93',
	      name: 'iSport',
	      alias: 'iSport',
	      class: '0x7a020c',
	      icon: 'phone',
	      legacy: false,
	      uuid_vendor_specific: '00000000-deca-fade-deca-deafdecacafe',
	      uuid_service_discovery_server: '00001000-0000-1000-8000-00805f9b34fb',
	      uuid_audio_source: '0000110a-0000-1000-8000-00805f9b34fb',
	      uuid_av_remote_control_target: '0000110c-0000-1000-8000-00805f9b34fb',
	      uuid_a_v_remote_control: '0000110e-0000-1000-8000-00805f9b34fb',
	      uuid_nap: '00001116-0000-1000-8000-00805f9b34fb',
	      uuid_handsfree_audio_gateway: '0000111f-0000-1000-8000-00805f9b34fb',
	      uuid_phonebook_access_server: '0000112f-0000-1000-8000-00805f9b34fb',
	      uuid_message_access_server: '00001132-0000-1000-8000-00805f9b34fb',
	      uuid_pnp_information: '00001200-0000-1000-8000-00805f9b34fb',
	      modalias: 'usb:v05ACp12A8d0A30'
	    },
	    {
	      mac: 'C8:7E:75:FC:F0:81',
	      name: 'B5722',
	      alias: 'B5722',
	      class: '0x5a0204',
	      icon: 'phone',
	      legacy: false,
	      uuid_av_remote_control_target: '0000110c-0000-1000-8000-00805f9b34fb',
	      uuid_dialup_networking: '00001103-0000-1000-8000-00805f9b34fb',
	      uuid_headset_ag: '00001112-0000-1000-8000-00805f9b34fb',
	      uuid_generic_audio: '00001203-0000-1000-8000-00805f9b34fb',
	      uuid_audio_source: '0000110a-0000-1000-8000-00805f9b34fb',
	      uuid_obex_object_push: '00001105-0000-1000-8000-00805f9b34fb',
	      uuid_obex_file_transfer: '00001106-0000-1000-8000-00805f9b34fb',
	      uuid_serial_port: '00001101-0000-1000-8000-00805f9b34fb',
	      uuid_handsfree_audio_gateway: '0000111f-0000-1000-8000-00805f9b34fb'
	    },
	    {
	      mac: 'A8:66:7F:08:DA:27',
	      name: 'art',
	      alias: 'art',
	      class: '0x38010c',
	      icon: 'computer',
	      legacy: false,
	      uuid_vendor_specific: '00000000-deca-fade-deca-deafdecacafe',
	      uuid_service_discovery_server: '00001101-0000-1000-8000-00805f9b34fb',
	      uuid_audio_source: '0000110a-0000-1000-8000-00805f9b34fb',
	      uuid_av_remote_control_target: '0000110c-0000-1000-8000-00805f9b34fb',
	      uuid_a_v_remote_control: '0000110e-0000-1000-8000-00805f9b34fb',
	      uuid_nap: '00001116-0000-1000-8000-00805f9b34fb',
	      uuid_handsfree_audio_gateway: '0000111f-0000-1000-8000-00805f9b34fb',
	      uuid_phonebook_access_server: '0000112f-0000-1000-8000-00805f9b34fb',
	      uuid_message_access_server: '00001132-0000-1000-8000-00805f9b34fb',
	      uuid_pnp_information: '00001200-0000-1000-8000-00805f9b34fb',
	      modalias: 'bluetooth:v004Cp4A3Bd1011'
	    },
	    {
	      mac: 'CC:44:63:B9:5F:41',
	      name: 'iPad Pro',
	      alias: 'iPad Pro',
	      class: '0x38010c',
	      icon: 'computer',
	      legacy: false,
	      uuid_vendor_specific: '00000000-deca-fade-deca-deafdecacafe',
	      uuid_service_discovery_server: '00001100-0000-1000-8000-00805f9b34fb',
	      uuid_audio_source: '0000110a-0000-1000-8000-00805f9b34fb',
	      uuid_av_remote_control_target: '0000110c-0000-1000-8000-00805f9b34fb',
	      uuid_a_v_remote_control: '0000110e-0000-1000-8000-00805f9b34fb',
	      uuid_nap: '00001116-0000-1000-8000-00805f9b34fb',
	      uuid_handsfree_audio_gateway: '0000111f-0000-1000-8000-00805f9b34fb',
	      uuid_phonebook_access_server: '0000112f-0000-1000-8000-00805f9b34fb',
	      uuid_message_access_server: '00001132-0000-1000-8000-00805f9b34fb',
	      uuid_pnp_information: '00001200-0000-1000-8000-00805f9b34fb',
	      modalias: 'bluetooth:v004Cp4A3Bd1011'
	    },
	    {
	      mac: 'AA:44:43:B9:5D:4C',
	      name: 'Black',
	      alias: 'Black',
	      class: '0x7a020c',
	      icon: 'phone',
	      legacy: false,
	      uuid_vendor_specific: '00000000-deca-fade-deca-deafdecacafe',
	      uuid_service_discovery_server: '00001000-0000-1000-8000-00805f9b34fb',
	      uuid_audio_source: '0000110a-0000-1000-8000-00805f9b34fb',
	      uuid_av_remote_control_target: '0000110c-0000-1000-8000-00805f9b34fb',
	      uuid_a_v_remote_control: '0000110e-0000-1000-8000-00805f9b34fb',
	      uuid_nap: '00001116-0000-1000-8000-00805f9b34fb',
	      uuid_handsfree_audio_gateway: '0000111f-0000-1000-8000-00805f9b34fb',
	      uuid_phonebook_access_server: '0000112f-0000-1000-8000-00805f9b34fb',
	      uuid_message_access_server: '00001132-0000-1000-8000-00805f9b34fb',
	      uuid_pnp_information: '00001200-0000-1000-8000-00805f9b34fb',
	      modalias: 'usb:v04ACp12A8d0A40'
	    }
	  ],

	  /**
	   *  The following was supposed to be stored on a disk after pairing etc
	   *  It is declared here because pxScene does not allow fs in trust mode
	   */

	  // Previously paired devices "stored" in controller
	  paired: [], //["90:72:40:69:BB:93", "C8:7E:75:FC:F0:81"],

	  // Trusted devices "stored" in controller
	  // (only paired devices can be trusted)
	  trusted: ['90:72:40:69:BB:93', 'C8:7E:75:FC:F0:81'],

	  // Devices currently connected to controller
	  // (only paired devices can connected)
	  // "connected": ["C8:7E:75:FC:F0:81"],
	  connected: [],

	  // Blocked devices "stored" in controller
	  blocked: ['AA:44:43:B9:5D:4C'],

	  /**
	   * Next section describes audio tracks "available" at certain devices
	   * Used for playback and audio info simulation.
	   * Organized as key-value pairs, where key - device mac, value - playlist
	   * Track Duration is in milliseconds
	   */

	  playlists: [
	    [
	      '18:65:90:5D:4D:CA',
	      {
	        name: 'Thin Lizzy',
	        tracks: [
	          {
	            Album: 'Chinatown',
	            TrackNumber: 1,
	            Genre: 'Rock',
	            Duration: 250055,
	            NumberOfTracks: 9,
	            Title: 'We Will Be Strong',
	            Artist: 'Thin Lizzy'
	          },
	          {
	            Album: 'Chinatown',
	            TrackNumber: 2,
	            Genre: 'Rock',
	            Duration: 240024,
	            NumberOfTracks: 9,
	            Title: 'Chinatown',
	            Artist: 'Thin Lizzy'
	          },
	          {
	            Album: 'Chinatown',
	            TrackNumber: 3,
	            Genre: 'Rock',
	            Duration: 250034,
	            NumberOfTracks: 9,
	            Title: 'Sweetheart',
	            Artist: 'Thin Lizzy'
	          }
	        ]
	      }
	    ],
	    [
	      'C8:7E:75:FC:F0:81',
	      {
	        name: 'Delerium - Poem (2001)',
	        tracks: [
	          {
	            Album: 'Poem',
	            TrackNumber: 1,
	            Genre: 'Electronic',
	            Duration: 322800,
	            NumberOfTracks: 11,
	            Title: 'Terra Firma',
	            Artist: 'Delerium'
	          },
	          {
	            Album: 'Poem',
	            TrackNumber: 2,
	            Genre: 'Electronic',
	            Duration: 377736,
	            NumberOfTracks: 11,
	            Title: 'Innocente',
	            Artist: 'Delerium'
	          },
	          {
	            Album: 'Poem',
	            TrackNumber: 3,
	            Genre: 'Electronic',
	            Duration: 214600,
	            NumberOfTracks: 11,
	            Title: 'Aria',
	            Artist: 'Delerium'
	          },
	          {
	            Album: 'Poem',
	            TrackNumber: 4,
	            Genre: 'Electronic',
	            Duration: 378520,
	            NumberOfTracks: 11,
	            Title: 'Fallen Icons (feat. Jenifer McLaren)',
	            Artist: 'Delerium'
	          },
	          {
	            Album: 'Poem',
	            TrackNumber: 5,
	            Genre: 'Electronic',
	            Duration: 312679,
	            NumberOfTracks: 11,
	            Title: 'Underwater',
	            Artist: 'Delerium'
	          },
	          {
	            Album: 'Poem',
	            TrackNumber: 6,
	            Genre: 'Electronic',
	            Duration: 366280,
	            NumberOfTracks: 11,
	            Title: 'Myth',
	            Artist: 'Delerium'
	          },
	          {
	            Album: 'Poem',
	            TrackNumber: 7,
	            Genre: 'Electronic',
	            Duration: 309280,
	            NumberOfTracks: 11,
	            Title: "Nature's Kingdom",
	            Artist: 'Delerium'
	          },
	          {
	            Album: 'Poem',
	            TrackNumber: 8,
	            Genre: 'Electronic',
	            Duration: 319464,
	            NumberOfTracks: 11,
	            Title: 'Daylight',
	            Artist: 'Delerium'
	          },
	          {
	            Album: 'Poem',
	            TrackNumber: 9,
	            Genre: 'Electronic',
	            Duration: 483960,
	            NumberOfTracks: 11,
	            Title: 'Temptation',
	            Artist: 'Delerium'
	          },
	          {
	            Album: 'Poem',
	            TrackNumber: 10,
	            Genre: 'Electronic',
	            Duration: 332160,
	            NumberOfTracks: 11,
	            Title: 'A Poem for Byzantium',
	            Artist: 'Delerium'
	          },
	          {
	            Album: 'Poem',
	            TrackNumber: 11,
	            Genre: 'Electronic',
	            Duration: 616369,
	            NumberOfTracks: 11,
	            Title: 'Amongst the Ruins',
	            Artist: 'Delerium'
	          }
	        ]
	      }
	    ],
	    [
	      '90:72:40:69:BB:93',
	      {
	        name: 'Asura',
	        tracks: [
	          {
	            Album: 'Life^2',
	            TrackNumber: 1,
	            Genre: 'Downtempo',
	            Year: '2016',
	            Duration: 240033,
	            NumberOfTracks: 10,
	            Title: 'Golgotha',
	            Artist: 'Asura'
	          },
	          {
	            Album: 'Life^2',
	            TrackNumber: 2,
	            Genre: 'Downtempo',
	            Year: '2016',
	            Duration: 210112,
	            NumberOfTracks: 10,
	            Title: 'Back to Light',
	            Artist: 'Asura'
	          },
	          {
	            Album: 'Life^2',
	            TrackNumber: 3,
	            Genre: 'Downtempo',
	            Year: '2016',
	            Duration: 200124,
	            NumberOfTracks: 10,
	            Title: 'Galaxies, Pt. 1',
	            Artist: 'Asura'
	          },
	          {
	            Album: 'Life^2',
	            TrackNumber: 3,
	            Genre: 'Downtempo',
	            Year: '2016',
	            Duration: 200124,
	            NumberOfTracks: 10,
	            Title: 'Celestial tendencies',
	            Artist: 'Asura'
	          }
	        ]
	      }
	    ]
	  ]
	};

	/**
	 *  Bluetooth controller emulation
	 *  Represents a bt controller abstraction similar to what can be seen with bluetoothctl tool
	 *  author: sgladk001c
	 *
	 *  Emulation features:
	 *  - ctl_onDeviceFound event will always send device.last_connected = false
	 *  - ctl_onDeviceLost event is not supported
	 */

	// ------->> node starts here >>-------
	/*

	    let Utils = require('./utils');
	    let BaseEventManager = require('./base-event-manager');
	    let Devices = require('./bluetooth-devices-emu');
	    let Player  = require('./bluetooth-player-emu');
	    let Logger = require('./logger');

	*/

	// Common node/pxScene code
	//

	/**
	 *  Internal functions
	 */

	// attention: genPin (not getPin)
	// generates a 6 digits PIN code
	let genPin = function() {
	  let min = Math.ceil(100000);
	  let max = Math.floor(999999);
	  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
	};

	/**
	 * Constructor
	 */
	let BluetoothController = function() {
	  BaseEventManager.call(this);

	  this.name = 'bluetoothctl (emulation)';

	  this.identity = {
	    name: 'bluetoothctl',
	    marker: { left: '      # ', right: ' # ' } // indent = 6
	  };

	  this._options = {
	    auto_pairable: false /* if true, controller becomes pairable after reset */,
	    auto_trust: false /* if true, paired device becomes trusted automatically */
	  };

	  this.player = new Player();

	  // Event handlers
	  let _this = this;
	  for (let [key, value] of event_listeners.entries()) {
	    this.on(key, function(event) {
	      value.apply(_this, arguments);
	    });
	  }

	  this._devices = new Map();
	  this._pairing_requests = new Map();
	  this._connection_requests = new Map();
	  this._playback_requests = new Map();
	  this._playlists = null; // Assigned on reset

	  this._power = false;
	  this._power_state = 1; // 0 - low powered for init/reset. No events are sent; 1 - normal condition
	  this._defalut_timeout = 5; // seconds

	  this._pin_required = false;
	  this._pairable = false;
	  this._discoverable = false;
	  this._scan = false;
	};

	BluetoothController.prototype = Object.create(BaseEventManager.prototype);
	BluetoothController.constructor = BluetoothController;
	Logger.call(BluetoothController.prototype);

	/**
	 * Public methods
	 */

	// Redefinition of the standard fireEvent procedure, which suppresses the events being sent in power_state 0
	BluetoothController.prototype.fireEvent = function(event_name, original_event) {
	  if (this._power_state < 1) return

	  BaseEventManager.prototype.fireEvent.apply(this, arguments);
	};

	BluetoothController.prototype.power = function(option) {
	  let value = Utils$1.parseBool(option);

	  // It seems that hw implementation _does_ react on sequential commands with the same value
	  // eg power on, power on, power on...
	  // same for other commands
	  this._power = value;

	  this.fireEvent('ctl_onPowerChanged', { value: value });

	  if (!this._power && this._power_state > 0) this.reset();
	};

	BluetoothController.prototype.init = function() {
	  this.queueEvent('ctl_onInit', { value: 'started' });
	  this.reset();
	};

	BluetoothController.prototype.reset = function() {
	  this.log('Resetting the controller.');
	  this._setPowerState(0);
	  this.power('on'); //powering the controller for init in power_state 0

	  this._pin_required = false;
	  this._pairable = this._options.auto_pairable;
	  this._discoverable = false;
	  this._scan = false;

	  this._devices.clear();
	  this._pairing_requests.clear();
	  this._connection_requests.clear();
	  this._playback_requests.clear();

	  this._playlists = new Map(Devices.playlists);

	  this.log('Restoring devices.');
	  // Restore a "persistent state"
	  // (tweak bluetooth-devices-emu.js for different initial setup)
	  for (let device of Devices.in_range) {
	    this._devices.set(device.mac, device);

	    // Adding the standard attributes
	    device.discovered = false;
	    device.paired = false;
	    device.trusted = false;
	    device.connected = false;
	    device.blocked = false;

	    // Now restoring the state
	    if (Devices.paired.indexOf(device.mac) !== -1) this.pair(device.mac);
	    if (Devices.trusted.indexOf(device.mac) !== -1) this.trust(device.mac);
	    if (Devices.connected.indexOf(device.mac) !== -1) this.connect(device.mac);
	    if (Devices.blocked.indexOf(device.mac) !== -1) this.block(device.mac);
	  }

	  this.power('off');
	  this._setPowerState(1);
	  this.log('Controller was reset.');
	};

	BluetoothController.prototype._setPowerState = function(value) {
	  if (value === 'undefined' || value < 0 || value > 1) {
	    value = 1;
	  }

	  if (value !== this._power_state) {
	    this._power_state = value;
	  }
	};

	BluetoothController.prototype.pairable = function(option) {
	  if (!this.isPowered(1)) return
	  let value = Utils$1.parseBool(option);

	  this._pairable = value;

	  this.fireEvent('ctl_onPairableChanged', { value: value });
	};

	BluetoothController.prototype.discoverable = function(option) {
	  if (!this.isPowered(1)) return

	  let value = Utils$1.parseBool(option);
	  this._discoverable = value;

	  this.fireEvent('ctl_onDiscoverableChanged', { value: value });
	};

	BluetoothController.prototype.isPowered = function(f) {
	  // f === true indicates the error event is required
	  f = Utils$1.parseBool(f);
	  if (!this._power && f) {
	    this.fireEvent('ctl_onError', {
	      value: 'ERROR_NOT_POWERED',
	      message: "Power is off. Use power('on') to enable"
	    });
	  }

	  return this._power
	};

	BluetoothController.prototype.isPairable = function() {
	  return this.isPowered(1) && this._pairable
	};

	BluetoothController.prototype.isDiscoverable = function() {
	  return this.isPowered(1) && this._discoverable
	};

	BluetoothController.prototype.isScanning = function() {
	  return this.isPowered(1) && this._scan
	};

	BluetoothController.prototype.scan = function(option) {
	  let value = Utils$1.parseBool(option);
	  let _this = this;

	  if (!this.isPowered(1)) {
	    return
	  }

	  this._scan = value;

	  if (value) {
	    this.fireEvent('ctl_onDiscoveryStarted', { value: value });

	    setTimeout(function() {
	      if (_this.isScanning()) {
	        for (let device of _this.getDevicesByCriteria('blocked', false)) {
	          if (device !== undefined) device.discovered = true;
	        }

	        _this.fireEvent('ctl_onDeviceListChanged', { value: _this._devices });
	      }
	    }, this._defalut_timeout * 1000);
	  } else {
	    this.fireEvent('ctl_onDiscoveryStopped', { value: value });
	  }
	};

	BluetoothController.prototype.pair = function(mac) {
	  //precondition: discovered, not blocked
	  let result = false;

	  if (!this.isPowered(1)) return

	  let device = this._devices.get(mac);

	  // in power_state 0 controller recovers its persistent state, so undiscovered
	  // devices get paired
	  if (device !== undefined && (device.discovered || this._power_state === 0)) {
	    if (!device.paired) {
	      // TODO: check pin?
	      device.paired = true;
	      this.dropPairingRequest(mac);
	      if (this.hasOption('auto_trust', 'on')) {
	        this.trust(mac);
	      }
	    }

	    this.fireEvent('ctl_onPair', { device: device, result: result });
	    result = true;
	  } else {
	    this.fireEvent('ctl_onPairFailed', { device: { mac: mac } });
	  }

	  return result
	};

	BluetoothController.prototype.unpair = function(mac) {
	  //executes disconnect and untrust
	  // TODO: rename to 'remove'
	  if (!this.isPowered(1)) return

	  let device = this._devices.get(mac);
	  if (device !== undefined && device.paired) {
	    if (device.connected) this.disconnect(mac);
	    if (device.trusted) this.untrust(mac);
	    device.paired = false;
	    this.fireEvent('ctl_onUnpair', { device: device, result: true });
	  } else {
	    this.log("Device %s wasn't paired, but requested to unpair. Ignored.", mac);
	  }

	  return true
	};

	BluetoothController.prototype.trust = function(mac) {
	  //precondition: paired, not blocked
	  let result = false;

	  if (!this.isPowered(1)) return

	  let device = this._devices.get(mac);

	  if (device !== undefined && device.paired && !device.blocked) {
	    if (!device.trusted) {
	      device.trusted = true;
	    }
	    result = true;
	    this.fireEvent('ctl_onTrust', { device: device, result: result });
	  } else {
	    this.fireEvent('ctl_onWarning', {
	      value: 'WARNING_WRONG_DEVICE',
	      message: 'device ' + mac + " can't be trusted"
	    });
	  }

	  return result
	};

	BluetoothController.prototype.untrust = function(mac) {
	  // executes disconnect
	  if (!this.isPowered(1)) return

	  let device = this._devices.get(mac);
	  if (device !== undefined && device.trusted) {
	    if (device.connected) this.disconnect(mac);
	    device.trusted = false;
	    this.fireEvent('ctl_onUntrust', { device: device, result: true });
	  } else {
	    this.log("Device %s wasn't trusted, but requested to untrust. Ignored.", mac);
	  }

	  return true
	};

	BluetoothController.prototype.connect = function(mac) {
	  //precondition: trusted
	  let result = false;
	  if (!this.isPowered(1)) return

	  //let ActiveState = {
	  //     STANDBY:    0,
	  //     LOW_POWER:  1,
	  //     ACTIVE:     2
	  // };

	  let device = this._devices.get(mac);

	  if (!device.connected) {
	    let macs_connected = this.getMacsByCriteria('connected', true);
	    for (let mac_connected of macs_connected) this.disconnect(mac_connected);

	    device.connected = true;
	    device.active = 2; // TODO: on connect it most likely is active, but we should have separate incoming events to simulate device going standby etc

	    this.player.init(this._playlists.get(device.mac));

	    result = true;
	    this.dropConnectionRequest(mac);
	    this.fireEvent('ctl_onConnect', { device: device, result: result });
	  } else {
	    this.fireEvent('ctl_onConnectFailed', { device: { mac: mac } });
	  }

	  return result
	};

	BluetoothController.prototype.disconnect = function(mac) {
	  if (!this.isPowered(1)) return

	  let device = this._devices.get(mac);
	  if (device !== undefined && device.connected) {
	    device.connected = false;

	    this.player.close();
	    this.log('Disconnected %s(%s)', device.name, device.mac);
	    this.fireEvent('ctl_onDisconnect', { device: device, result: true });
	  } else {
	    this.log("Device %s wasn't connected, but requested to disconnect. Ignored.", mac);
	  }

	  return true
	};

	BluetoothController.prototype.block = function(mac) {
	  //disconnect, untrust and unpair
	  let result = false;
	  if (!this.isPowered(1)) return

	  let device = this._devices.get(mac);
	  if (device !== undefined && !device.blocked) {
	    if (device.connected) this.disconnect(mac);
	    if (device.trusted) this.untrust(mac);
	    if (device.paired) this.unpair(mac);
	    device.blocked = true;

	    result = true;
	    this.fireEvent('ctl_onBlock', { device: device, result: result });
	  } else {
	    let message =
	      device !== undefined ? 'Device ' + mac + ' is blocked' : 'Device ' + mac + ' is unknown';
	    this.fireEvent('ctl_onWarning', {
	      value: 'WARNING_WRONG_DEVICE',
	      message: message
	    });
	  }

	  return result
	};

	BluetoothController.prototype.unblock = function(mac) {
	  if (!this.isPowered(1)) return

	  let device = this._devices.get(mac);

	  if (device !== undefined && device.blocked) {
	    device.blocked = false;
	    this.fireEvent('ctl_onUnblock', { device: device, result: true });
	  } else {
	    this.log("Device %s wasn't blocked, but requested to unblock. Ignored.", mac);
	  }

	  return true
	};

	BluetoothController.prototype.info = function(mac) {
	  if (!this.isPowered(1)) return

	  return this._devices.get(mac)
	};

	BluetoothController.prototype.remove = function(mac) {
	  if (!this.isPowered(1)) return
	  let result = false;

	  let device = this._devices.get(mac);

	  if (device !== undefined) {
	    this.fireEvent('ctl_onRemove', { device: device });
	    result = this._devices.delete(mac);
	  } else {
	    this.fireEvent('ctl_onWarning', {
	      value: 'WARNING_WRONG_DEVICE',
	      message: 'Device ' + mac + ' is unknown'
	    });
	  }

	  return result
	};

	BluetoothController.prototype.list = function() {
	  if (!this.isPowered(1)) return
	  let list = [];

	  for (let device of this._devices.values()) {
	    list.push(device);
	  }

	  return list
	};

	BluetoothController.prototype.requirePin = function(value) {
	  this._pin_required = Utils$1.parseBool(value);
	};

	BluetoothController.prototype.isPinRequired = function() {
	  return this._pin_required
	};

	/**
	 * Emulation-specific methods
	 */
	// Retrieves a list of device macs matching a key-value criteria
	// Returns array of macs of matching devices
	// Example: getMacsByCriteria('blocked', true);
	BluetoothController.prototype.getMacsByCriteria = function(key, value) {
	  if (!this.isPowered(1)) return []

	  let list = [];
	  for (let mac of this._devices.keys()) {
	    let device = this._devices.get(mac);
	    if (device.hasOwnProperty(key) && device[key] === value) {
	      list.push(mac);
	    }
	  }

	  return list
	};

	BluetoothController.prototype.getDevicesByCriteria = function(key, value) {
	  if (!this.isPowered(1)) return []

	  let list = [];
	  for (let device of this._devices.values()) {
	    if (device.hasOwnProperty(key) && device[key] === value) {
	      list.push(device);
	    }
	  }

	  return list
	};

	BluetoothController.prototype.getDevice = function(mac) {
	  if (!this.isPowered(1)) return {}

	  return this._devices.get(mac)
	};

	// Returns the first entry matching name or undefined
	BluetoothController.prototype.getDeviceByName = function(name) {
	  if (!this.isPowered(1)) return {}

	  return this.getDevicesByCriteria('name', name)[0]
	};

	BluetoothController.prototype.setOption = function(option, value) {
	  value = Utils$1.parseBool(value);

	  if (this._options.hasOwnProperty(option) && this._options[option] === value) {
	    return
	  }

	  this._options[option] = value;
	  this.fireEvent('ctl_onSetOption', { option: option, value: value });
	};

	BluetoothController.prototype.hasOption = function(option, value) {
	  value = Utils$1.parseBool(value);

	  return this._options.hasOwnProperty(option) && this._options[option] === value
	};

	// Drops the pending pairing request
	BluetoothController.prototype.dropPairingRequest = function(mac) {
	  if (this._pairing_requests.has(mac)) {
	    this.log('Dropping pairing request for %s', mac);
	    this._pairing_requests.delete(mac);
	  } else {
	    this.log('Ignoring drop pairing request for %s: no such request present.', mac);
	    this.log('Pending pairing requests: ', this._pairing_requests);
	  }
	};

	// Drops the pending connection request
	BluetoothController.prototype.dropConnectionRequest = function(mac) {
	  if (this._connection_requests.has(mac)) {
	    this.log('Dropping connection request for %s', mac);
	    this._connection_requests.delete(mac);
	  } else {
	    this.log('Ignoring drop connection request for %s: no such request present.', mac);
	    this.log('Pending connection requests: ', this._connection_requests);
	  }
	};

	// Drops the pending playback request
	BluetoothController.prototype.dropPlaybackRequest = function(mac) {
	  if (this._playback_requests.has(mac)) {
	    this.log('Dropping playback request for %s', mac);
	    this._playback_requests.delete(mac);
	  } else {
	    this.log('Ignoring drop playback request for %s: no such request present.', mac);
	    this.log('Pending playback requests: ', this._playback_requests);
	  }
	};

	BluetoothController.prototype.getPlaylist = function(mac) {
	  return this._playlists.get(mac)
	};

	// Adds the new 'audio_stream' field to the connected device: Values are: PRIMARY or AUXILIARY
	BluetoothController.prototype.setAudioStream = function(mac, stream_name) {
	  let result;
	  if (!this.isPowered(1)) return

	  let device = this._devices.get(mac);

	  if (device !== undefined && device.connected) {
	    device.audio_stream = stream_name;
	    result = true;
	  } else {
	    result = false;
	    this.log(
	      'Cannot set audio stream for %s, because device is %s ',
	      mac,
	      device === undefined ? 'unknown.' : 'not connected.'
	    );
	  }

	  return result
	};

	/**
	 * Event listeners for BluetoothController. This is the incoming events (the expected user activity in most cases)
	 * Some other events might be fired in response. Those are representing the SPEC events (eg incoming 'usr_pairingRequest' event from the user's device
	 * leads to a 'pairingRequest' and optionally 'pinRequest' events described in the SPEC
	 */
	let event_listeners = new Map();

	event_listeners.set('usr_pairingRequest', function(event /*.device*/) {
	  //ignored if power is off. Controller must be pairable

	  this.log(
	    'Got a user pairing request from %s (%s) (controller powered: %s; pairable: %s)',
	    event.device.name,
	    event.device.mac,
	    this.isPowered(),
	    this.isPairable()
	  );

	  if (!this.isPowered()) return
	  if (!this.isPairable()) return

	  let device = JSON.parse(JSON.stringify(event.device));
	  device.pin = genPin();

	  this._pairing_requests.set(device.mac, device.pin); // overwrites a possible pending request from the same device

	  this.fireEvent('ctl_onPairingRequest', { device: device } /* this time with a pin */);
	});

	event_listeners.set('usr_ConnectionRequest', function(event /*.device*/) {
	  //ignored if power is off. If device is not trusted, the request fails

	  this.log(
	    'Got a user connection request from %s (%s) (controller powered: %s)',
	    event.device.name,
	    event.device.mac,
	    this.isPowered()
	  );

	  if (!this.isPowered()) return

	  let device = JSON.parse(JSON.stringify(event.device));

	  this._connection_requests.set(device.mac, '' /*rfu*/);

	  this.fireEvent('ctl_onConnectionRequest', { device: device });
	});

	event_listeners.set('usr_PlaybackRequest', function(event) {
	  //ignored if power is off. Device must be connected

	  this.log(
	    'Got a user playbackRequest from %s (%s) (controller powered: %s)',
	    event.device.name,
	    event.device.mac,
	    this.isPowered()
	  );

	  if (!this.isPowered()) return

	  let device = JSON.parse(JSON.stringify(event.device));

	  this._playback_requests.set(device.mac, '' /*rfu*/);

	  this.fireEvent('ctl_onPlaybackRequest', { device: device });
	});

	/**
	 * Not implemented
	 */

	BluetoothController.prototype.agent = function(option) {
	  throw 'Not implemented'
	};

	BluetoothController.prototype.defaultAgent = function(option) {
	  throw 'Not implemented'
	};

	BluetoothController.prototype.advertise = function(option) {
	  throw 'Not implemented'
	};

	BluetoothController.prototype.show = function(controller) {
	  throw 'Not implemented'
	};

	BluetoothController.prototype.select = function(controller) {
	  throw 'Not implemented'
	};

	/**
	 * Service Manager's BluetoothService emulation
	 * author: sgladk001c
	 *
	 * Emulation features:
	 *
	 */
	// ------->> node starts here >>-------
	/*

	    let Utils = require('./utils');
	    let BaseEventManager = require('./base-event-manager');
	    let BluetoothController = require('./bluetooth-controller-emu');
	    let Logger = require('./logger');

	*/
	// Common node/pxscene code
	//

	/**
	 *  Internal functions
	 */

	/**
	 * Function: deviceTypeFromIcon
	 * Params: device_icon: string
	 * Return: string
	 * -
	 * Translates device.icon string provided by bluetoothctl to a device type required by the SPEC
	 */
	let deviceTypeFromIcon = function(device_icon) {
	  let device_type = 'UNKNOWN';

	  switch (device_icon) {
	    case 'phone':
	      device_type = 'SMARTPHONE';
	      break
	    case 'computer':
	      device_type = 'COMPUTER';
	      break
	  }

	  return device_type
	};

	let deviceIdFromMac = function(mac) {
	  let hexstr = String(mac)
	    .split(':')
	    .join('');

	  return parseInt(hexstr, 16)
	};

	let macFromDeviceId = function(id) {
	  let hex = Number(id)
	    .toString(16)
	    .toUpperCase();
	  let hexlen = hex.length;
	  let mac = '';

	  for (let i = 0; i < hexlen; i += 2) {
	    mac = mac + hex.substr(i, 2);
	    if (i + 2 < hexlen) {
	      mac = mac + ':';
	    }
	  }

	  return mac
	};

	let devicePayloadFromRawData = function(device) {
	  let device_id = deviceIdFromMac(device.mac);
	  let device_type = deviceTypeFromIcon(device.icon);
	  let supported_profile;
	  let manufacturer;

	  if (device.hasOwnProperty('uuid_audio_source')) {
	    supported_profile = device.uuid_audio_source;
	  } else {
	    supported_profile = 'null';
	  }

	  if (device.hasOwnProperty('uuid_vendor_specific')) {
	    manufacturer = device.uuid_vendor_specific;
	  } else {
	    manufacturer = '0';
	  }

	  return {
	    deviceID: device_id,
	    name: device.name,
	    deviceType: device_type,
	    supportedProfile: supported_profile,
	    manufacturer: manufacturer,
	    MAC: device.mac
	  }
	};

	// generates a random Received Signal Strength Indicator value
	let genRSSI = function() {
	  let min = Math.ceil(-100);
	  let max = Math.floor(-26); //??
	  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
	};

	// generates signalStrength param for device. Correlates with RSSI
	let genRX = function(rssi) {
	  return (rssi - 2 * rssi) / 25 + Math.random() // Nonsense calc. Just some correlated value ranged 1 .. 3
	};

	/**
	 * Constructor
	 */

	window.BluetoothService = function(bluetooth_service_name) {
	  BaseEventManager.call(this);

	  this.name = 'Bluetooth Service Manager service (emulation)';

	  this.identity = {
	    name: 'service manager',
	    marker: { left: '    { ', right: ' } ' }
	  };

	  let _this = this;

	  this.service_name = bluetooth_service_name;
	  this.name = this.service_name; // compatibility

	  this.api_version = 1;
	  this.onEvent = {};

	  this._bluetooth_event_subscriptions = [];
	  this.bluetoothctl = new BluetoothController();

	  // Subscribe to controller events
	  for (let [key, value] of controller_listeners.entries()) {
	    this.bluetoothctl.on(key, function(event) {
	      value.apply(_this, arguments);
	    });
	  }

	  // Subscribe to player events
	  for (let [key, value] of plr_event_listeners.entries()) {
	    this.bluetoothctl.player.on(key, function(event) {
	      value.apply(_this, arguments);
	    });
	  }

	  // Init.
	  // BluetoothService does not have a dedicated init() because Service Manager does not have it either

	  // SPEC does not provide an API to change 'pairable' state of controller
	  // One way to make it pairable is to call 'getPairableDevices(), which looks like a hack
	  // Another way would be to make it pairable automatically
	  // The following will enable the emulation to be pairable by default
	  this.bluetoothctl.setOption('auto_pairable', 'on');

	  // SPEC does not provide an API to change the 'trust' state of a device
	  // This option allows device to become trusted automatically
	  // once it is paired
	  this.bluetoothctl.setOption('auto_trust', 'on');
	  this.bluetoothctl.init();
	  this.bluetoothctl.power('on');
	};

	BluetoothService.prototype = Object.create(BaseEventManager.prototype);
	BluetoothService.constructor = BluetoothService;
	Logger.call(BluetoothService.prototype);

	/**
	 * Service Manager API
	 */
	BluetoothService.prototype.setApiVersionNumber = function(api_version) {
	  if (typeof api_version === 'number') {
	    this.api_version = api_version;
	  }
	};

	BluetoothService.prototype.registerForEvents = function(bluetooth_events) {
	  let event_list = JSON.parse(bluetooth_events);
	  if (event_list.events.constructor === Array) {
	    this._bluetooth_event_subscriptions = event_list.events;
	  }
	};

	BluetoothService.prototype.callMethod = function(method, params) {
	  this.log('Calling: %s with params: %s', method, params);
	  params = JSON.stringify(JSON.parse(params));

	  if (this.__proto__.hasOwnProperty(method)) {
	    return this[method](params)
	  } else {
	    return '{"success":false, "message": "unknown method ' + method + '"}'
	  }
	};

	/**
	 * Internals
	 */

	// invokes 'onEvent' callback for events the caller has subscribed on
	// payload is stringified here
	BluetoothService.prototype.fireBluetoothEvent = function(event, payload) {
	  let is_subscribed = !(this._bluetooth_event_subscriptions.indexOf(event) === -1);

	  if (typeof payload === 'object') {
	    //in case we forgot..
	    payload = JSON.stringify(payload);
	  }

	  if (typeof this.onEvent === 'function' && is_subscribed) {
	    this.onEvent(event, payload);
	  } else {
	    this.log('"onEvent" function is not yet defined for %s', this.identity.name);
	    this.log('Firing to void: %s, payload: %s', event, payload);
	  }
	};

	// SPEC methods; params is stringified JSON like {params: [ ... ]}
	BluetoothService.prototype.getStatusSupport = function(params) {
	  //let args = JSON.parse(params).params; // getting params array as object

	  let ret = { success: false };

	  if (this.bluetoothctl.isPowered()) {
	    ret.success = true;
	    ret.status = 'AVAILABLE';
	  } else {
	    ret.success = false;
	    ret.status = 'SOFTWARE_DISABLED';
	  }

	  return JSON.stringify(ret)
	};

	BluetoothService.prototype.setBluetoothEnabled = function(params) {
	  let args = JSON.parse(params).params;

	  let enabled = args[0];
	  let switch_pos;
	  let ret = { success: false };
	  let payload = { newStatus: '' };
	  let _this = this;

	  switch (enabled) {
	    case 'BLUETOOTH_ENABLED':
	      switch_pos = 'on';
	      break

	    case 'BLUETOOTH_DISABLED':
	      switch_pos = 'off';
	      break
	  }

	  this.bluetoothctl.on('ctl_onPowerChanged', function(event) {
	    ret.success = true;

	    payload.newStatus = event.value ? 'SOFTWARE_ENABLED' : 'SOFTWARE_DISABLED';
	    _this.fireBluetoothEvent('statusChanged', payload);
	  });

	  this.bluetoothctl.power(switch_pos);

	  return JSON.stringify(ret)
	};

	/**
	 * Method: setBluetoothDiscoverable
	 * Params: enabled:String
	 * Return: none
	 * -
	 * This method enables settop discovery by other Bluetooth devices.
	 * enabled - true Settop broadcasts Bluetooth sink discovery signal; false - Settop stops broadcasting Bluetooth sink discovery signal.
	 */
	BluetoothService.prototype.setBluetoothDiscoverable = function(params) {
	  let args = JSON.parse(params).params;

	  let ret = { success: false };
	  let enabled = Utils$1.parseBool(args[0]);

	  this.bluetoothctl.on('ctl_onDiscoverableChanged', function(event) {
	    ret.success = true;
	  });

	  this.bluetoothctl.discoverable(enabled);

	  return JSON.stringify(ret)
	};

	/**
	 * Method: setSinkDiscovery
	 * Params: enabled:String
	 * Return: none
	 * -
	 * This method is OBSOLETE. Use setBluetoothDiscoverable instead.
	 * This method enables settop discovery by other Bluetooth devices.
	 * enabled - true Settop broadcasts Bluetooth sink discovery signal; false - Settop stops broadcasting Bluetooth sink discovery signal.
	 */
	BluetoothService.prototype.setSinkDiscovery = function(params) {
	  return this.setBluetoothDiscoverable(params)
	};

	BluetoothService.prototype.startDeviceDiscovery = function(params) {
	  let args = JSON.parse(params).params;

	  let ret = { success: false };
	  let timeout = args[0];
	  let _this = this;

	  this.bluetoothctl.on('ctl_onDiscoveryStarted', function(event) {
	    ret.success = true;
	    ret.status = 'AVAILABLE';
	  });

	  this.bluetoothctl.on('ctl_onError', function(event) {
	    ret.success = false;
	    if (event.value === 'ERROR_NOT_POWERED') {
	      ret.status = 'SOFTWARE_DISABLED';
	    }
	  });

	  this.bluetoothctl.scan('on');

	  if (timeout) {
	    setTimeout(function() {
	      if (_this.bluetoothctl.isScanning()) {
	        _this.bluetoothctl.scan('off');
	      }
	    }, timeout * 1000);
	  } else {
	    this.bluetoothctl.scan('off');
	  }

	  return JSON.stringify(ret)
	};

	BluetoothService.prototype.stopDeviceDiscovery = function(params) {
	  // let args = JSON.parse(params).params;

	  let ret = { success: false };

	  this.bluetoothctl.on('ctl_onDiscoveryStopped', function(event) {
	    ret.success = true;
	  });

	  this.bluetoothctl.scan('off');

	  return JSON.stringify(ret)
	};

	BluetoothService.prototype.getDiscoveredDevices = function(params) {
	  // let args = JSON.parse(params).params;

	  let ret = { success: false };
	  let discovered_devices = [];

	  this.bluetoothctl.on('ctl_onError', function(event) {
	    ret.success = false;
	  });

	  let devices = this.bluetoothctl.getDevicesByCriteria('discovered', true);

	  for (let device of devices) {
	    let discovered_device = {};

	    discovered_device.deviceType = deviceTypeFromIcon(device.icon);
	    discovered_device.deviceID = deviceIdFromMac(device.mac);
	    discovered_device.name = device.name;
	    discovered_device.paired = device.paired;
	    discovered_device.connected = device.connected;

	    discovered_devices.push(discovered_device);
	  }

	  ret.success = discovered_devices.length > 0;

	  ret.discoveredDevices = discovered_devices;

	  return JSON.stringify(ret)
	};

	BluetoothService.prototype.getPairedDevices = function(params) {
	  // let args = JSON.parse(params).params;

	  let ret = { success: false };
	  let paired_devices = [];

	  this.bluetoothctl.on('ctl_onError', function(event) {
	    ret.success = false;
	  });

	  if (!this.bluetoothctl.isPairable()) {
	    this.log('Setting pairable on automatically');
	    this.bluetoothctl.pairable('on');
	  }

	  let devices = this.bluetoothctl.getDevicesByCriteria('paired', true);

	  for (let device of devices) {
	    let paired_device = {};

	    paired_device.deviceType = deviceTypeFromIcon(device.icon);
	    paired_device.deviceID = deviceIdFromMac(device.mac);
	    paired_device.name = device.name;
	    paired_device.connected = device.connected;

	    paired_devices.push(paired_device);
	  }

	  ret.success = paired_devices.length > 0;

	  ret.pairedDevices = paired_devices;

	  return JSON.stringify(ret)
	};

	BluetoothService.prototype.getConnectedDevices = function(params) {
	  // let args = JSON.parse(params).params;

	  let ret = { success: false };
	  let connected_devices = [];

	  this.bluetoothctl.on('ctl_onError', function(event) {
	    ret.success = false;
	  });

	  let devices = this.bluetoothctl.getDevicesByCriteria('connected', true);

	  for (let device of devices) {
	    let connected_device = {};

	    connected_device.deviceType = deviceTypeFromIcon(device.icon);
	    connected_device.deviceID = deviceIdFromMac(device.mac);
	    connected_device.name = device.name;
	    connected_device.active = device.active;

	    connected_devices.push(connected_device);
	  }

	  ret.success = connected_devices.length > 0;
	  ret.connectedDevices = connected_devices;

	  return JSON.stringify(ret)
	};

	BluetoothService.prototype.setDevicePairing = function(params) {
	  let args = JSON.parse(params).params;
	  let ret = { success: false };
	  this.log('Got a device pairing command: ', params);

	  let device_mac = macFromDeviceId(args[0]);

	  // TODO: check pin here? Pin value is missed at this point (not in the SPEC)
	  // At controller:
	  // let stored_pin = this.bluetoothctl._pairing_reguests.get(device_mac);

	  let do_pair = args[1];
	  let do_unpair = !args[1];

	  if (do_pair) {
	    ret.success = this.bluetoothctl.pair(device_mac);
	  }

	  if (do_unpair) {
	    ret.success = this.bluetoothctl.unpair(device_mac);
	  }

	  return JSON.stringify(ret)
	};

	BluetoothService.prototype.setDeviceConnection = function(params) {
	  let args = JSON.parse(params).params;
	  this.log('Got a device connection command: ', params);

	  let ret = { success: false };

	  let device_mac = macFromDeviceId(args[0]);
	  let do_connect = args[1] === 'CONNECT';
	  let do_disconnect = args[1] === 'DISCONNECT';

	  if (do_connect) {
	    ret.success = this.bluetoothctl.connect(device_mac);
	  }

	  if (do_disconnect) {
	    ret.success = this.bluetoothctl.disconnect(device_mac);
	  }

	  return JSON.stringify(ret)
	};

	BluetoothService.prototype.setAudioStream = function(params) {
	  let args = JSON.parse(params).params;
	  this.log('Got an audio stream setup command: ', params);

	  let ret = { success: false };

	  let mac = macFromDeviceId(args[0]);
	  let stream_name = args[1];

	  ret.success = this.bluetoothctl.setAudioStream(mac, stream_name);

	  return JSON.stringify(ret)
	};

	BluetoothService.prototype.getDeviceInfo = function(params /*deviceID*/) {
	  let args = JSON.parse(params).params;
	  let mac = macFromDeviceId(args[0]);

	  let device = this.bluetoothctl.getDevice(mac);
	  let payload = devicePayloadFromRawData(device);

	  payload.rssi = genRSSI();
	  payload.signalStrength = genRX(payload.rssi);

	  //delete payload.deviceType

	  return JSON.stringify(payload)
	};

	BluetoothService.prototype.setPlayback = function(params) {
	  let args = JSON.parse(params).params;

	  let ret = { success: false };

	  if (this.bluetoothctl.player.isAvailable()) {
	    switch (args[1]) {
	      case 'PLAY':
	        this.bluetoothctl.player.play();
	        break

	      case 'PAUSE':
	        this.bluetoothctl.player.pause();
	        break

	      case 'STOP':
	        this.bluetoothctl.player.stop();
	        break

	      case 'SKIP_NEXT':
	        this.bluetoothctl.player.skipNext();
	        break

	      case 'RESTART':
	        this.bluetoothctl.player.restart();
	        break

	      case 'SKIP_PREVIOUS':
	        this.bluetoothctl.player.skipPrevious();
	        break

	      default:
	        this.log('Unknown setPlayback command %s. Ignored.', args[0]);
	        break
	    }
	    ret.success = true;
	  } else {
	    this.log('Player is not available. Ignoring setPlayback command.');
	  }

	  return JSON.stringify(ret)
	};

	BluetoothService.prototype.getAudioInfo = function(params /* deviceID */) {
	  let args = JSON.parse(params).params;
	  let ret = { success: false };

	  let device_id = args[0];
	  let mac = macFromDeviceId(device_id);
	  let device = this.bluetoothctl.getDevice(mac);

	  if (!device) {
	    this.log('Failed to get audio info for %s (mac: %s). Device is not connected.', device_id, mac);
	    ret.success = false;
	    return ret
	  }

	  if (this.bluetoothctl.player.isAvailable()) {
	    let ai = this.bluetoothctl.player.getAudioInfo();

	    ret.deviceID = device_id;
	    ret.album = ai.album;
	    ret.artist = ai.artist;
	    ret.genre = ai.genre;
	    ret.title = ai.title;
	    ret.ui32Duration = ai.duration;
	    ret.ui32NumberOfTracks = ai.number_of_tracks;
	    ret.ui32TrackNumber = ai.track_number;

	    ret.success = true;
	  } else {
	    this.log('Player is not available. Ignoring getAudioInfo command.');
	  }

	  return JSON.stringify(ret)
	};

	/**
	 * Initiates pairing, connecting or playback action
	 * if user has accepted the request
	 *
	 * Params (with example values):
	 * eventType: "pairingRequest"
	 * responseValue: "ACCEPTED"
	 * deviceID: 26824492797386
	 */
	BluetoothService.prototype.respondToEvent = function(params) {
	  let ret = { success: false };
	  let args = JSON.parse(params).params;

	  switch (args[0].eventType) {
	    case 'pairingRequest':
	      if (args[0].responseValue === 'ACCEPTED') {
	        let device_params = '{"params":[' + args[0].deviceID + ',"true"]}';
	        let result = this.setDevicePairing(device_params);
	        ret = JSON.parse(result);
	      } else if (args[0].responseValue === 'REJECTED') {
	        this.bluetoothctl.dropPairingRequest(macFromDeviceId(args[0].deviceID));
	        ret = { success: true };
	      }
	      break

	    case 'connectionRequest':
	      if (args[0].responseValue === 'ACCEPTED') {
	        let device_params = '{"params":[' + args[0].deviceID + ',"CONNECT"]}';
	        let result = this.setDeviceConnection(device_params);
	        ret = JSON.parse(result);
	      } else if (args[0].responseValue === 'REJECTED') {
	        this.bluetoothctl.dropConnectionRequest(macFromDeviceId(args[0].deviceID));
	        ret = { success: true };
	      }
	      break

	    case 'playbackRequest':
	      if (args[0].responseValue === 'ACCEPTED') {
	        let device_params = '{"params":["PLAY"]}';
	        let result = this.setPlayback(device_params);
	        ret = JSON.parse(result);
	      } else if (args[0].responseValue === 'REJECTED') {
	        this.bluetoothctl.dropPlaybackRequest(macFromDeviceId(args[0].deviceID));
	        ret = { success: true };
	      }
	      break
	  }

	  return JSON.stringify(ret)
	};

	/**
	 * Events from controller
	 */

	let controller_listeners = new Map();

	// Controller was reset
	controller_listeners.set('ctl_onInit', function(event) {
	  this.log('Device init: %s.', event.value);

	  let payload = { newStatus: 'HARDWARE_AVAILABLE' };

	  this.fireBluetoothEvent('statusChanged', JSON.stringify(payload));
	});

	// Controller encountered an error. Such as an attempt to do something
	// without enabling bluetooth first
	controller_listeners.set('ctl_onError', function(event) {
	  this.log('%s: %s', event.value, event.message);
	});

	// Controller is instructed to perform something it wouldn't expect
	// in its current state. Not critical
	controller_listeners.set('ctl_onWarning', function(event) {
	  this.log('%s: %s', event.value, event.message);
	});

	// Issued after Power On and Power off commands
	controller_listeners.set('ctl_onPowerChanged', function(event) {
	  this.log('Power is %s.', event.value ? 'ON' : 'OFF');
	});

	// Discovery has just started
	controller_listeners.set('ctl_onDiscoveryStarted', function(event) {
	  this.log('Discovery started.', JSON.stringify(event));
	});

	// Discovery has just stopped (manually or after timeout)
	controller_listeners.set('ctl_onDiscoveryStopped', function(event) {
	  this.log('Discovery stopped.', JSON.stringify(event));
	});

	// One or more new devices have been discovered
	controller_listeners.set('ctl_onDeviceListChanged', function(event) {
	  this.log('New devices found');

	  let payload = { newStatus: 'DISCOVERY_COMPLETED' };
	  this.fireBluetoothEvent('statusChanged', JSON.stringify(payload));
	});

	// One or more new devices have been discovered
	controller_listeners.set('ctl_onDeviceFound', function(event /*device*/) {
	  let device = JSON.parse(JSON.stringify(event.device));

	  this.log('A known device found: %s (%s)', device.name, device.mac);

	  let payload = devicePayloadFromRawData(device);

	  delete payload.supportedProfile;
	  delete payload.manufacturer;
	  delete payload.MAC;

	  payload.lastConnected = device.last_connected;

	  this.fireBluetoothEvent('deviceFound', JSON.stringify(payload));
	});

	// Controller pairable state has been flipped (on or off)
	controller_listeners.set('ctl_onPairableChanged', function(event) {
	  // missing in the SPEC
	  this.log('Pairable is %s.', event.value ? 'ON' : 'OFF');
	});

	// Controller discoverable state has been flipped (on or off)
	controller_listeners.set('ctl_onDiscoverableChanged', function(event) {
	  this.log('Discoverable is %s.', event.value ? 'ON' : 'OFF');
	});

	// A device has been paired just now
	controller_listeners.set('ctl_onPair', function(event) {
	  this.log('Device paired:', event.device.mac);

	  let payload = { newStatus: 'PAIRING_CHANGE' };

	  this.fireBluetoothEvent('statusChanged', JSON.stringify(payload));
	});

	// Device pairing attempt has failed
	controller_listeners.set('ctl_onPairFailed', function(event) {
	  this.log('Device pairing failed:', event.device.mac);

	  let payload = { errorID: 'PAIRING_FAILED', MAC: event.device.mac };

	  this.fireBluetoothEvent('requestFailed', JSON.stringify(payload));
	});

	// A device has been unpaired just now
	controller_listeners.set('ctl_onUnpair', function(event) {
	  this.log('Device unpaired:', event.device.mac);

	  let payload = { newStatus: 'PAIRING_CHANGE' };

	  this.fireBluetoothEvent('statusChanged', JSON.stringify(payload));
	});

	// A device has been trusted just now
	controller_listeners.set('ctl_onTrust', function(event) {
	  // missing in the SPEC
	  this.log('Device trusted:', event.device.mac);

	  let payload = { newStatus: 'TRUST_CHANGE' };

	  this.fireBluetoothEvent('statusChanged', JSON.stringify(payload));
	});

	// A device has been untrusted just now
	controller_listeners.set('ctl_onUntrust', function(event) {
	  // missing in the SPEC
	  this.log('Device is not trusted now:', event.device.mac);

	  let payload = { newStatus: 'TRUST_CHANGE' };

	  this.fireBluetoothEvent('statusChanged', JSON.stringify(payload));
	});

	// A device has been connected just now
	controller_listeners.set('ctl_onConnect', function(event) {
	  this.log('Device connected:', event.device.mac);

	  let payload = { newStatus: 'CONNECTION_CHANGE' };

	  this.fireBluetoothEvent('statusChanged', JSON.stringify(payload));

	  // Causing a playbackNewTrack event to be fired, as required by the SPEC
	  let ai = this.bluetoothctl.player.getAudioInfo();
	  this.bluetoothctl.player.fireEvent('plr_onNext', { audio_info: ai });
	});

	// A device has been disconnected just now
	controller_listeners.set('ctl_onDisconnect', function(event) {
	  this.log('Device disconnected:', event.device.mac);

	  let payload = { newStatus: 'CONNECTION_CHANGE' };

	  this.fireBluetoothEvent('statusChanged', JSON.stringify(payload));
	});

	// Device connection attempt has failed
	controller_listeners.set('ctl_onConnectFailed', function(event) {
	  this.log('Device connecting failed:', event.device.mac);

	  let payload = { newStatus: 'CONNECTION_FAILED', MAC: event.device.mac };

	  this.fireBluetoothEvent('requestFailed', JSON.stringify(payload));
	});

	// A device has been blocked just now
	controller_listeners.set('ctl_onBlock', function(event) {
	  // missing in the SPEC
	  this.log('Device blocked:', event.device.mac);
	});

	// A device has been unblocked just now
	controller_listeners.set('ctl_onUnblock', function(event) {
	  // missing in the SPEC
	  this.log('Device unblocked:', event.device.mac);
	});

	// A device has sent a pairing request
	controller_listeners.set('ctl_onPairingRequest', function(event /*.device*/) {
	  this.log('Pairing request from %s (%s)', event.device.name, event.device.mac);

	  let device = JSON.parse(JSON.stringify(event.device));
	  let payload = devicePayloadFromRawData(device);

	  let pin_required = this.bluetoothctl.isPinRequired();
	  payload.pinRequired = pin_required;
	  payload.pinValue = device.pin;

	  this.fireBluetoothEvent('pairingRequest', JSON.stringify(payload));

	  if (pin_required) {
	    payload = { pinValue: device.pin };
	    this.fireBluetoothEvent('pinRequest', JSON.stringify(payload));
	  }
	});

	// A device has sent a connection request
	controller_listeners.set('ctl_onConnectionRequest', function(event /*.device*/) {
	  this.log('Connection request from %s (%s)', event.device.name, event.device.mac);

	  let device = JSON.parse(JSON.stringify(event.device));
	  let payload = devicePayloadFromRawData(device);

	  this.fireBluetoothEvent('connectionRequest', JSON.stringify(payload));
	});

	// A device has sent a playback request
	controller_listeners.set('ctl_onPlaybackRequest', function(event /*.device*/) {
	  this.log('Playback request from %s (%s)', event.device.name, event.device.mac);

	  let device = JSON.parse(JSON.stringify(event.device));
	  let payload = devicePayloadFromRawData(device);

	  this.fireBluetoothEvent('playbackRequest', JSON.stringify(payload));
	});

	/**
	 * Events from player
	 * onClose and onError events: {value: '', message: ''}
	 * Other events: {audio_info: <audio info object> });
	 */

	let plr_event_listeners = new Map();

	//
	plr_event_listeners.set('plr_onStart', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Selected track: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );

	  let payload = {
	    Duration: audio_info.duration,
	    position: audio_info.position
	  };

	  let macs = this.bluetoothctl.getMacsByCriteria('connected', true);
	  if (macs.length > 0) {
	    payload.deviceID = deviceIdFromMac(macs[0]);
	  }

	  this.fireBluetoothEvent('playbackStarted', JSON.stringify(payload));
	});

	//
	plr_event_listeners.set('plr_onPause', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Player is on pause: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );

	  let payload = {
	    Duration: audio_info.duration,
	    position: audio_info.position
	  };

	  let macs = this.bluetoothctl.getMacsByCriteria('connected', true);
	  if (macs.length > 0) {
	    payload.deviceID = deviceIdFromMac(macs[0]);
	  }

	  this.fireBluetoothEvent('playbackPaused', JSON.stringify(payload));
	});

	plr_event_listeners.set('plr_onResume', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Player resumed: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );

	  let payload = {
	    Duration: audio_info.duration,
	    position: audio_info.position
	  };

	  let macs = this.bluetoothctl.getMacsByCriteria('connected', true);
	  if (macs.length > 0) {
	    payload.deviceID = deviceIdFromMac(macs[0]);
	  }

	  this.fireBluetoothEvent('playbackResumed', JSON.stringify(payload));
	});

	plr_event_listeners.set('plr_onStreamUpdate', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Player is playing: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );

	  let payload = {
	    Duration: audio_info.duration,
	    position: audio_info.position
	  };

	  let macs = this.bluetoothctl.getMacsByCriteria('connected', true);
	  if (macs.length > 0) {
	    payload.deviceID = deviceIdFromMac(macs[0]);
	  }

	  this.fireBluetoothEvent('playbackResumed', JSON.stringify(payload));
	});

	//
	plr_event_listeners.set('plr_onStop', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Player is stopped: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );

	  let payload = {
	    Duration: audio_info.duration,
	    position: audio_info.position
	  };

	  let macs = this.bluetoothctl.getMacsByCriteria('connected', true);
	  if (macs.length > 0) {
	    payload.deviceID = deviceIdFromMac(macs[0]);
	  }

	  this.fireBluetoothEvent('playbackStopped', JSON.stringify(payload));
	});

	//
	plr_event_listeners.set('plr_onRestart', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Player has restarted the track: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );
	});

	//
	plr_event_listeners.set('plr_onClose', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Player is closed: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );

	  let payload = {};

	  let macs = this.bluetoothctl.getMacsByCriteria('connected', true);
	  if (macs.length > 0) {
	    payload.deviceID = deviceIdFromMac(macs[0]);
	  }

	  this.fireBluetoothEvent('playbackEnded', JSON.stringify(payload));
	});

	// Player track switching causes the new plr_onStart event to be fired (provided the player was playing)
	// and hence the new streamingStatusChanged event will be issued automatically

	//
	plr_event_listeners.set('plr_onNext', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Player has moved to the next track: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );

	  let payload = {
	    album: audio_info.album,
	    artist: audio_info.artist,
	    genre: audio_info.genre,
	    title: audio_info.title,
	    ui32Duration: audio_info.duration,
	    ui32NumberOfTracks: audio_info.number_of_tracks,
	    ui32TrackNumber: audio_info.track_number
	  };

	  let macs = this.bluetoothctl.getMacsByCriteria('connected', true);
	  if (macs.length > 0) {
	    payload.deviceID = deviceIdFromMac(macs[0]);
	  }

	  this.fireBluetoothEvent('playbackNewTrack', JSON.stringify(payload));
	});

	//
	plr_event_listeners.set('plr_onSkipNext', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Player has skipped next track. Selected now: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );

	  let payload = {
	    album: audio_info.album,
	    artist: audio_info.artist,
	    genre: audio_info.genre,
	    title: audio_info.title,
	    ui32Duration: audio_info.duration,
	    ui32NumberOfTracks: audio_info.number_of_tracks,
	    ui32TrackNumber: audio_info.track_number
	  };

	  let macs = this.bluetoothctl.getMacsByCriteria('connected', true);
	  if (macs.length > 0) {
	    payload.deviceID = deviceIdFromMac(macs[0]);
	  }

	  this.fireBluetoothEvent('playbackNewTrack', JSON.stringify(payload));
	});

	//
	plr_event_listeners.set('plr_onPrevious', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Player has moved to the previous track: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );

	  let payload = {
	    album: audio_info.album,
	    artist: audio_info.artist,
	    genre: audio_info.genre,
	    title: audio_info.title,
	    ui32Duration: audio_info.duration,
	    ui32NumberOfTracks: audio_info.number_of_tracks,
	    ui32TrackNumber: audio_info.track_number
	  };

	  let macs = this.bluetoothctl.getMacsByCriteria('connected', true);
	  if (macs.length > 0) {
	    payload.deviceID = deviceIdFromMac(macs[0]);
	  }

	  this.fireBluetoothEvent('playbackNewTrack', JSON.stringify(payload));
	});

	//
	plr_event_listeners.set('plr_onSkipPrevious', function(event) {
	  let audio_info = event.audio_info;

	  this.log(
	    'Player has skipped the previous track. Selected now: %s - %s - %s (pos: %d)',
	    audio_info.artist,
	    audio_info.album,
	    audio_info.title,
	    audio_info.position
	  );

	  let payload = {
	    album: audio_info.album,
	    artist: audio_info.artist,
	    genre: audio_info.genre,
	    title: audio_info.title,
	    ui32Duration: audio_info.duration,
	    ui32NumberOfTracks: audio_info.number_of_tracks,
	    ui32TrackNumber: audio_info.track_number
	  };

	  let macs = this.bluetoothctl.getMacsByCriteria('connected', true);
	  if (macs.length > 0) {
	    payload.deviceID = deviceIdFromMac(macs[0]);
	  }

	  this.fireBluetoothEvent('playbackNewTrack', JSON.stringify(payload));
	});

	//
	plr_event_listeners.set('plr_onError', function(event) {
	  this.log('Player error occurred: %s (%d)', event.message, event.value);
	});

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

	/*
	 Bluetooth interop
	 */


	class BT {
	  static init() {
	   
	  }
	  
	  constructor() {
	    this.dDevices = null;
	    this.pDevices = null;
	    this.cDevices = null;
	    this.dDevicesPromise = true;
		  this.pDevicesPromise = true;
		  this.cDevicesPromise = true;
	    this._updateInProgress = false;
	    this._input = {
	      title: 'Networking:  Bluetooth',
	      subtitle: 'Connections',
	      types: [

	      ]
	    };
	    this._events = new Map();
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
	      this.callsign = 'org.rdk.Bluetooth';
	      this._thunder.call("Controller", "activate", { callsign: this.callsign }).then(result => {
	        console.log('Bluetooth activated', result);

	        this._listeners.push(this._thunder.on(this.callsign, 'onStatusChanged', (notification) => {
	          console.log('Received onStatusChanged  Event');
	          console.log(notification.newStatus);
	          if (notification.newStatus === "PAIRING_CHANGE") {
	       
	            var callback=this._events.get('updatePairedDevice');
	           
	             callback();
	           }
	          
	           if (notification.newStatus === "DISCOVERY_COMPLETED") {
	            this.getDiscoveredDevices();
	            this.getDevices();
	           // console.log("this._events.get('updateList') DISCOVERY_COMPLETED"+JSON.stringify(this._events))
	           // console.log("***"+this._events.get('updateList'))
	            var callback=this._events.get('updateList');
	            callback();
	          }
	        }));

	        this._listeners.push(this._thunder.on(this.callsign, 'onStatusChanged', (notification) => {
	         
	    
	          
	           if (notification.newStatus === "CONNECTION_CHANGE") {
	            this.getConnectedDevices();
	            this._thunder.call(this.callsign, "getConnectedDevices").then(result => {
		       
	            this.cDevices = result.connectedDevices;
	            console.log("result is* "+JSON.stringify(result));
	            console.log("cdevices issss "+result.connectedDevices);
	            if(this.cDevices!=null && result.connectedDevices.length && this._events.has("connected")){
	           
	            var callback=this._events.get('connected');
	            callback(true);
	            
	          }
	              // resolve(result);
	             }).catch(err => {
	              
	               reject("failes");
	             });

	           
	           
	            
	          }
	        
	        }));
	    
	    
	        this._listeners.push(this._thunder.on(this.callsign, 'onPlaybackChange', (notification) => {
	          
	          if(notification.action==='ended'){
	            var callback=this._events.get('disconnected');
	                callback(notification);
	          }else {
	          var callback=this._events.get('playbackchanged');
	                callback(notification);
	          }
	    
	        
	        }));
	    
	        
	        this._listeners.push(this._thunder.on(this.callsign, 'onPlaybackRequest', (notification) => {
	          console.log('Received onStatusChanged  Event on playback'+notification.action);
	          console.log("notification is "+JSON.stringify(notification));
	         
	          var callback=this._events.get('playbackrequest');
	                callback(notification);
	    
	        
	        }));
	        
	        this._listeners.push(this._thunder.on(this.callsign, 'onPlaybackProgress', (notification) => {
	          console.log('Received onStatusChanged  Event'+notification.action);
	          console.log("notification is "+JSON.stringify(notification));
	         
	          var callback=this._events.get('playbackprogress');
	                callback(notification);
	    
	        
	        }));
	        
	        this._listeners.push(this._thunder.on(this.callsign, 'onPlaybackNewTrack', (notification) => {
	          console.log('Received onStatusChanged  Event'+notification.action);
	          console.log("notification is "+JSON.stringify(notification));
	         
	          var callback=this._events.get('playbacknewtrack');
	                callback(notification);
	    
	        
	        }));
	    

	        this.getPairedDevices();
	        this.getConnectedDevices();
	        this.startScan();

	        resolve("Bluetooth activated");
	      }).catch(err => {
	        console.error('Activation failure', err);
	        reject("Bluetooth activation failed",err);
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



	 /**
	  * Method to handle device array creation 
	  * @param {*} discoveredDevices 
	  * @param {*} connectedDevices 
	  * @param {*} pairedDevices 
	  * @param {*} callback 
	  */
	  createArray(discoveredDevices, connectedDevices, pairedDevices, callback) {
	    this._input.types=[];
	    if (connectedDevices.length > 0) {
	      for (let i = 0; i < connectedDevices.length; i++) {
	        this.deviceArray = {

	          title: '',
	          icon: '',
	          connected: null,
	          deviceID: '',
	          paired: null

	        };
	        this.deviceArray.title = connectedDevices[i].name;
	        this.deviceArray.icon = "images/bluetooth_icon.png";
	        this.deviceArray.connected = true;
	        this.deviceArray.deviceID = connectedDevices[i].deviceID;
	        this.deviceArray.paired = true;

	        this._input.types.push(this.deviceArray);


	      }
	    }
	    if (pairedDevices.length > 0) {
	      for (let i = 0; i < pairedDevices.length; i++) {
	        this.deviceArray = {

	          title: '',
	          icon: '',
	          connected: null,
	          deviceID: '',
	          paired: null

	        };
	        
	        this.deviceArray.title = pairedDevices[i].name;
	        this.deviceArray.icon = "images/bluetooth_icon.png";
	        this.deviceArray.connected = pairedDevices[i].connected;
	        this.deviceArray.deviceID = pairedDevices[i].deviceID;
	        this.deviceArray.paired = true;

	        if (!pairedDevices[i].connected) {
	          this._input.types.push(this.deviceArray);
	        }


	      }
	    }

	    if (discoveredDevices.length > 0) {
	      for (let i = 0; i < discoveredDevices.length; i++) {
	        this.deviceArray = {

	          title: '',
	          icon: '',
	          connected: null,
	          deviceID: '',
	          paired: null


	        };
	        this.deviceArray.title = discoveredDevices[i].name;
	        this.deviceArray.icon = "images/bluetooth_icon.png";
	        this.deviceArray.connected = discoveredDevices[i].connected;
	        this.deviceArray.deviceID = discoveredDevices[i].deviceID;
	        this.deviceArray.paired = false;


	        this._input.types.push(this.deviceArray);


	      }
	    }
	    console.log("this._input is "+JSON.stringify(this._input));
	    callback(this._input);
	  }

	/**
	 * method to connect to bluetooth for given deviceId
	 * @param {*} deviceId 
	 * @param {*} paired 
	 * @param {*} callback 
	 */
	  connectBluetooth(deviceId, paired) {
	    console.log(deviceId+"inside connect bluetop"+ paired);
	    var paramsforconnect = { "deviceID": deviceId, "deviceType": "SMARTPHONE", "profile": "SMARTPHONE" };
	    var params = { "deviceID": deviceId };

	   



	    if (paired) {
	      console.log(this._thunder);
	      this._thunder.call(this.callsign, "connect", paramsforconnect).then(result => {
	        console.log("connected "+JSON.stringify(result));
	        this.getConnectedDevices();
	        //resolve("success")
	      }).catch(err => {
	        //reject("connection fail");
	      });
	    } else {
	      this.registerEvent("updatePairedDevice", () => {
	        this._thunder.call(this.callsign, "connect", paramsforconnect).then(result => {
	          // resolve("success")
	         }).catch(err => {
	           console.error('Connection failed', err);
	          // reject("connection fail");
	         });
	      });
	      this._thunder.call(this.callsign, "pair", params).then(result => {
	        
	      }).catch(err => {
	        console.error('Error on pairing', err);
	      //  reject("connection fail");

		      });
		    }
		  }
		/**
		 * common method to call create array and return promise
		 * @param {*} callback 
		 */
		  getDevices() {
		    if (this._updateInProgress)
		      return
		    this._updateInProgress = true;
	      Promise.all([this.dDevicesPromise, this.pDevicesPromise, this.cDevicesPromise]).then(result => {
		      this._updateInProgress = false;
		      this.createArray(this.dDevices, this.cDevices, this.pDevices, this._events.get('updateList'));
	      });
		  }

		/**
		 * Method to get discovered devices
		 */
		  startScan() {
		    this.dDevices = null;
		    return new Promise((resolve, reject) => {
		      const params = { "timeout": "8", "profile": "DEFAULT" };
		      this._thunder.call(this.callsign, "startScan", params).then(result => {
		        
		        resolve('scan started');
		      }).catch(err => {
		        reject("scan started fail");
		      });
		    })
		  }
	  /**
		 * Method to get paired devices
		 */
		  getDiscoveredDevices() {
		    this.dDevices = null;
		    this.dDevicesPromise =  new Promise((resolve, reject) => {
		      this._thunder.call(this.callsign, "getDiscoveredDevices").then(result => {
		        
		        this.dDevices = result.discoveredDevices;
		        resolve(result);
		      }).catch(err => {
		        reject("failes");
		      });
		    });
		  }
		/**
		 * Method to get paired devices
		 */
		  getPairedDevices() {
		    this.pDevices = null;
		    this.pDevicesPromise =  new Promise((resolve, reject) => {
		      this._thunder.call(this.callsign, "getPairedDevices").then(result => {
		        
		        this.pDevices = result.pairedDevices;
		        resolve(result);
		      }).catch(err => {
		        reject("failes");
		      });
		    });
		  }
		/**
		 * Method to get connected devices
		 */
		  getConnectedDevices() {
		    this.cDevices = null;
		    this.cDevicesPromise =  new Promise((resolve, reject) => {
		      this._thunder.call(this.callsign, "getConnectedDevices").then(result => {
		       
		        this.cDevices = result.connectedDevices;
		        resolve(result);
		      }).catch(err => {
		       
		        reject("failes");
		      });
		    });
	    }

	    /**
		 * Method to get connected devices
		 */
		  getConnectedDeviceInfo() {
		    this.cDevices = null;
		    this.cDevicesPromise =  new Promise((resolve, reject) => {
		      this._thunder.call(this.callsign, "getConnectedDevices").then(result => {
		       
		       // this.cDevices = result.connectedDevices;
		        resolve(result);
		      }).catch(err => {
		       
		        reject("failes");
		      });
		    });
	    }

	    sendAudioPlaybackCommand(command){
	      console.log("command  is"+command);
	      console.log("conected device is"+this.cDevices[0].deviceID);
	      const params = { "deviceID": this.cDevices[0].deviceID, "command":command};
	      this._thunder.call(this.callsign, "sendAudioPlaybackCommand",params).then(result => {
		       
	       console.log(JSON.stringify(result));
	      }).catch(err => {
	       
	        reject(err+"failes");
	      });

	    }

	    getAudioInfo(deviceId){
	      console.log("deviceid for audio info is"+deviceId);
	      const params = { "deviceID": deviceId };
	      new Promise((resolve, reject) => {

	        this._thunder.call(this.callsign, "getConnectedDevices").then(result => {
		       
		        this.cDevices = result.connectedDevices;
		        this._thunder.call(this.callsign, "getAudioInfo",params).then(result => {
		       
	            // this.cDevices = result.connectedDevices;
	             resolve(result);
	           }).catch(err => {
	            
	             reject("failes");
	           });
		      }).catch(err => {
		       
		        reject("failes");
	        });
	        


		      
	      });
	   
	    }
	    
	    
		  
		  disconnectBluetooth(deviceId) {
		    const params = { "deviceID": deviceId };
		    this._thunder.call(this.callsign, "disconnect", params).then(result => {
		   
		    }).catch(err => {
		      console.error('Error on disconnection', err);
		    });
	    }
	    
	    pairDevice(deviceId){
	      return new Promise((resolve, reject) => {
	      const params = { "deviceID": deviceId };
	      this._thunder.call(this.callsign, "pair", params).then(result => {
	        resolve("Device Paired");
	      }).catch(err => {
	        console.error('Error on pairing', err);
	        });
	      }).catch(err => {
	          console.error('pair failure', err);
	          reject("Bluetooth activation failed",err);
	        });
	   
	    }

	   /**
		 * Method to get unpair device
		 */
		  unpair(deviceId) {
		    return new Promise((resolve, reject) => {
	        const params = { "deviceID": deviceId };
		      this._thunder.call(this.callsign, "unpair", params).then(result => {
		       resolve('success');
		      }).catch(err => {
	         reject('error');
	        });
		    })
	    }
	    
	     /**
		 * Method to get unpair device
		 */
		  disconnect(deviceId) {
	      console.log("disconnect BT Service");
	      const params = { "deviceID": deviceId };
		      this._thunder.call(this.callsign, "disconnect", params).then(result => {
		       return "success"
		      }).catch(err => {
	         return "failure"
	        });
		   
	    }
	    

	    



		}

	/*
	 Bluetooth interop
	 */

	class BT$1 {
	  static init() {
	    {
	      this.bluetoothService=new BT();
	    }
	  }

	  static get discover() {
	    return {
	      start: () => {
	          
	        this.bluetoothService.activate().then(result => {
	          console.log("inside types"+this.bluetoothService._input.types);
	          

	        }).catch(err => {
	          console.log("failed here", err);
	        }); 
	      
	      },
	      stop: () => {
	       // this.bluetoothService.stopDeviceDiscovery()
	      },
	      devices: this.bluetoothService._input.types
	    }
	  }

	  static connect(deviceID,paired,isConnected) {
	    let ret = { success: false };
	    if(!isConnected){
	   var connected=this.bluetoothService.connectBluetooth(deviceID,paired);
	   ret.success=connected;
	    console.log(connected);
	    return JSON.stringify(ret)

	    }
	    
	  }

	  static disconnect(deviceID) {
	    this.bluetoothService.setDeviceConnection(JSON.stringify({ params: [deviceID, 'DISCONNECT'] }));
	    this.bluetoothService.setDevicePairing(JSON.stringify({ params: [deviceID, false] }));
	  }

	  static getPaired() {
	  this.bluetoothService.getConnectedDeviceInfo().then(result => {
	  }).catch(err => {
	    console.log("cdevices error is");
	    reject("failes");
	  });
	   


	     
	   
	  }
	}

	var theme = {
	  primary: 0xff4286f9,
	  deviceBG: 0xff212121,
	  devicesBG: 0xff1d1d1d,
	  background:0xff000000,
	  text: 0xff727272,
	  highlight: 0xff444444,
	  light: 0xffededed,
	  textLight: 0xff707070,
	  textDark: 0xff292929,
	  eq: {
	    red: 0xffff0000,
	    orange: 0xffff8900,
	    yellow: 0xffffff00,
	    green: 0xff00ff00
	  }
	};

	var screen = {
	  w: 1920,
	  h: 1080
	};

	class Header extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        w: screen.w - 100,
	        h: 80,
	        y: 60,
	        x: 50,
	        flex: { direction: 'row', justifyContent: 'space-between', alignItems: 'center' },
	        Title: {
	          color: theme.primary,
	          text: { text: 'XFinity Bluetooth Audio', fontSize: 30, fontFace: 'Default' }
	        },
	        Time: {
	          color: theme.primary,
	          text: { text: '', fontSize: 30, fontFace: 'Default' }
	        }
	      }
	    }
	  }

	  _active() {
	    this.tag('Title').patch({
	      text: { text: this.title ? this.title : 'XFinity Bluetooth Audio' }
	    });
	  }

	  updateTime() {
	    let date = new Date();
	    let hours = date.getHours();
	    let minutes = date.getMinutes();
	    let ampm = hours >= 12 ? 'PM' : 'AM';
	    hours = hours % 12;
	    hours = hours ? hours : 12;
	    minutes = minutes < 10 ? '0' + minutes : minutes;

	    let strTime = hours + ':' + minutes + ' ' + ampm;

	    this.tag('Time').patch({ text: { text: strTime } });
	  }

	  _init() {
	    setInterval(() => {
	      this.updateTime();
	    }, 1000);
	  }
	}

	class Device extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        rect: true,
	        color: theme.deviceBG,
	        w: screen.w / 2 + 100,
	        h: 65,
	        flex: { direction: 'row', alignItems: 'center', justifyContent: 'space-between' },
	        LeftSide: {
	          flex: { direction: 'row', alignItems: 'center' },
	          DeviceTypeImageBG: {
	            x: 20,
	            src: Utils.asset('images/png/deviceTypeImageBG.png'),
	            w:40,
	            h:40,
	            // texture: Lightning.Tools.getSvgTexture(
	            //   40,
	            //   40
	            // ),
	            DeviceTypeImage: {
	              x: 5,
	              y: 4,
	              src: Utils.asset('images/png/phoneDefault.png'),
	            w:30,
	            h:30,
	            }
	          },

	          Text: {
	            x: 50,
	            y: 3,
	            color: theme.primary,
	            text: { fontFace: 'Default', fontSize: 30 }
	          }
	        },
	        RightSide: {
	          x: -40,
	          flex: { direction: 'row', alignItems: 'center' },
	          ConnectButton: {
	            texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.light, true, theme.light),
	            ConnectText: {
	              mount: 0.5,
	              x: 150 / 2 + 2.5,
	              y: 40 / 2 + 4.5,
	              color: theme.textLight,
	              text: { text: 'CONNECT', fontSize: 20, fontFace: 'Default' }
	            }
	          },
	          MoreOptionsButton: {
	            x: 15,
	            texture: Lightning.Tools.getSvgTexture(
	              Utils.asset('images/moreOptionsLight.svg'),
	              40,
	              40
	            )
	          }
	        }
	      }
	    }
	  }

	  _init() {
	    this.tag('Text').patch({ text: { text: this.item.title } });
	    if (!this.item.paired) {
	      this.tag('ConnectText').patch({ color: theme.textLight, text: { text: 'PAIR' } });
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.textDark, true, theme.deviceBG)
	      });
	    }
	    else if (this.item.paired) {
	      this.tag('ConnectText').patch({ color: theme.textLight, text: { text: 'CONNECT' } });
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.highlight, true, theme.highlight)
	      });
	    }
	    else if (this.item.connected) {
	      this.tag('ConnectText').patch({ color: theme.textDark, text: { text: 'CONNECTED' } });
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.highlight, true, theme.highlight)
	      });
	    } else {
	      this.tag('ConnectText').patch({ color: theme.textLight, text: { text: 'DISCONNECT' } });
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.highlight, false, theme.highlight)
	      });
	    }
	  }

	  connectedStyle() {
	    this.tag('ConnectButton').patch({
	      texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.light, true, theme.light)
	    });
	    this.tag('ConnectText').patch({ smooth: { color: theme.textDark } });
	  }

	  _focus() {
	    this.tag('Container').patch({ smooth: { color: theme.highlight } });
	    this.tag('Text').patch({ smooth: { color: theme.light } });
	    if (this.item.connected) {
	      this.connectedStyle();
	    } else {
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.light, false, theme.light)
	      });
	      this.tag('ConnectText').patch({ smooth: { color: theme.light } });
	    }
	  }

	  _unfocus() {
	    this.tag('Container').patch({ smooth: { color: theme.deviceBG } });
	    this.tag('Text').patch({ smooth: { color: theme.primary } });
	    if (this.item.connected) {
	      this.connectedStyle();
	    } else {
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.textDark, false, theme.deviceBG)
	      });
	      this.tag('ConnectText').patch({ smooth: { color: theme.textLight } });
	    }
	  }
	}

	class DeviceList extends Lightning.Component {
	  static _template() {
	    return {
	      y: 85,
	      flex: { direction: 'column' }
	    }
	  }

	  get deviceID() {
	    return this.children[this.index].item.deviceID
	  }

	  _handleEnter() {
	    console.log("handle enter in devicelist pressed");
	    this.fireAncestors('$rerenderDeviceOptions', this.children[this.index].item.connected,this.children[this.index].item.paired);
	  }

	  pair() {//
	        
	    
	    BT$1.bluetoothService.registerEvent("updatePairedDevice", () => {
	      this.children[this.index].item.paired=true;
	      this.fireAncestors('$rerenderDeviceOptionsForPaired');
	      this.rerenderDevices(false);
	     // this.tag('ConnectText').patch({ color: theme.textLight, text: { text: 'CONNECT' } });
	     // this.tag('DiscoverText').patch({ text: { text: 'Discover New Devices' } })
	      //this.tag('DiscoveringText').patch({ alpha: 0 })
	     });

	     console.log('deviceID'+this.deviceID);
	    BT$1.bluetoothService.pairDevice(this.deviceID).then(result => {
	    }).catch(err => {
	      console.log("failed here", err);
	    }); 
	   // BT.connect(this.deviceID,this.children[this.index].item.paired,this.children[this.index].item.connected)
	   
	   // this.fireAncestors('$switchToPlayer')
	  }

	  
	  registerPlayerEvents() {
	    console.log("event registration started");
	    BT$1.bluetoothService.registerEvent("playbackchanged", (notification) => {
	      console.log("action playbackchanged is  " + notification.action);
	     
	      
	    });
	    BT$1.bluetoothService.registerEvent("disconnected", (notification) => {
	      console.log("action ended came is " +notification.action);
	    });
	    BT$1.bluetoothService.registerEvent("playbackprogress", (notification) => {
	      console.log("action playbackprogress is " );
	    });
	    BT$1.bluetoothService.registerEvent("playbackrequest", (notification) => {
	      console.log("action playbackrequest is " + notification.action);
	    });
	    BT$1.bluetoothService.registerEvent("playbacknewtrack", (notification) => {
	      console.log("action playbacknewtrack*** is " + notification.action);
	    });
	    console.log("event registration closed");
	  }


	  connect() {
	BT$1.bluetoothService.registerEvent("disconnected", (notification) => {
	  this.fireAncestors('$switchToConnection');
	});
	    BT$1.bluetoothService.registerEvent("connected", (isConnected) => {
	      console.log("connected in devicelist connect method is "+isConnected);
	      if(isConnected){
	        this.children[this.index].item.paired=true;
	        this.fireAncestors('$rerenderDeviceOptionsForPaired');
	        //this.registerPlayerEvents()
	        
	      this.fireAncestors('$switchToPlayer');
	      }else {
	        this.fireAncestors('$closeDeviceOptions');
	      }
	     });
	     
	    BT$1.bluetoothService.connectBluetooth(this.deviceID,this.children[this.index].item.paired).then(result => {
	      console.log("connected succusfully"+result);


	    }).catch(err => {
	      console.log("failed here", err);
	      this.fireAncestors('$closeDeviceOptions');
	    }); 
	   // BT.connect(this.deviceID,this.children[this.index].item.paired,this.children[this.index].item.connected)
	   
	   // this.fireAncestors('$switchToPlayer')
	  }
	  

	  unpair() {
	    BT$1.bluetoothService.registerEvent("updatePairedDevice", () => {
	      BT$1.discover.start();
	     });
	    BT$1.bluetoothService.unpair(this.deviceID).then(result=>{
	    });
	    //BT.disconnect(this.deviceID)
	  }

	  disconnect() {
	    console.log("disconnect called in devicelist"+this.deviceID);
	    this.children[this.index].item.connected=false;
	    BT$1.bluetoothService.disconnect(this.deviceID);
	    //BT.disconnect(this.deviceID)
	    this.rerenderDevices(false);
	  }

	  getConnectedDevices() {
	    return this.children.map(device => {
	      const connectedDevice = BT$1.discover.devices.find(
	        discoveredDevice => device.item.deviceID === discoveredDevice.deviceID
	      );

	      if (connectedDevice) {
	        return connectedDevice
	      }

	      return device.item
	    })
	  }

	  rerenderDevices(fromDiscover = true) {
	    this.devices = fromDiscover ? BT$1.discover.devices : this.getConnectedDevices();

	    this.children = this.devices.map((item, index) => {
	      return {
	        type: Device,
	        y: index * 65,
	        item
	      }
	    });

	    this.fireAncestors('$checkForDevices');
	    this._refocus();
	  }

	  remove() {
	    this.childList.removeAt(this.index);
	    this.children.forEach((device, i) => {
	      device.patch({ y: 65 * i });
	    });
	    this.index = this.index === 0 ? 0 : this.index - 1;
	    this.fireAncestors('$checkForDevices');
	  }

	  _init() {
	    this.index = 0;
	    this._setState('Devices');
	  }

	  _getFocused() {
	    return this.children[this.index]
	  }

	  _handleUp() {
	    if (this.index > 0) {
	      this.index--;
	    }
	  }

	  _handleDown() {
	    if (this.index < this.children.length - 1) {
	      this.index++;
	    }
	  }
	}

	class Devices$1 extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        rect: true,
	        color: theme.devicesBG,
	        w: screen.w / 2 + 100,
	        h: screen.h / 1.2,
	        x: 50,
	        y: 200,
	        Title: {
	          x: 20,
	          y: 25,
	          color: theme.text,
	          text: { text: 'Bluetooth Devices', fontFace: 'Default', fontSize: 28 }
	        },
	        DeviceList: { type: DeviceList },
	        NoDevicesFound: {
	          alpha: 0,
	          x: 50,
	          y: 90,
	          text: { fontFace: 'Default', text: 'No Devices Found', fontSize: 30 }
	        }
	      }
	    }
	  }

	  $checkForDevices() {
	    if (this.tag('DeviceList').children.length === 0) {
	      this.tag('NoDevicesFound').patch({ alpha: 1 });
	    } else {
	      this.tag('NoDevicesFound').patch({ alpha: 0 });
	    }
	  }

	  _init() {
	    this._setState('DeviceList');
	    this.$checkForDevices();
	  }

	  static _states() {
	    return [
	      class DeviceList extends this {
	        _getFocused() {
	          return this.tag('DeviceList')
	        }
	      }
	    ]
	  }
	}

	class Discover extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        x: screen.w / 2 + 350,
	        y: screen.h / 2 - 150,
	        flex: { direction: 'column', alignItems: 'center' },
	        BluetoothImage: {
	          src: Utils.asset('images/png/bluetoothSignal.png'),
	          w:200,
	          h:200,
	          // texture: Lightning.Tools.getSvgTexture(
	          //   200,
	          //   200
	          // )
	        },
	        DiscoveringText: {
	          alpha: 0,
	          y: 60,
	          color: theme.text,
	          text: { text: 'Discovering...', fontFace: 'Default', fontSize: 28 }
	        },
	        ConnectText: {
	          y: 30,
	          color: theme.text,
	          text: { text: 'Connect to', fontFace: 'Default', fontSize: 28 }
	        },
	        ConnectText2: {
	          y: 19,
	          color: theme.text,
	          text: {
	            text: 'XFinity Bluetooth Audio',
	            fontFace: 'Default',
	            fontSize: 28
	          }
	        },
	        DiscoverButton: {
	          y: 200,
	          texture: Lightning.Tools.getRoundRect(450, 80, 40, 3, theme.text, true, theme.text),
	          DiscoverText: {
	            mountX: 0.5,
	            x: 450 / 2,
	            y: 22,
	            color: theme.light,
	            text: { text: 'Discover New Devices', fontFace: 'Default', fontSize: 30 }
	          }
	        }
	      }
	    }
	  }

	  _init() {
	    this.isLoading = false;
	    this._bt = new BT();
	    this._bluetoothSpin = this.tag('BluetoothImage').animation({
	      duration: 2,
	      repeat: -1,
	      stopMethod: 'immediate',
	      actions: [{ p: 'rotation', v: { 0: 0, 1: 6.25 } }]
	    });

	    setTimeout(() => {
	      this._handleEnter();
	    }, 500);
	  }

	  _focus() {
	    this.tag('DiscoverButton').patch({
	      texture: Lightning.Tools.getRoundRect(450, 80, 40, 3, theme.primary, true, theme.primary)
	    });
	  }

	  _unfocus() {
	    this.tag('DiscoverButton').patch({
	      texture: Lightning.Tools.getRoundRect(450, 80, 40, 3, theme.text, true, theme.text)
	    });
	  }

	  startDiscovery() {
	    console.log("discovery started");
	    BT$1.discover.start();

	    this.tag('DiscoveringText').patch({ alpha: 1 });
	    this.tag('ConnectText').patch({ alpha: 0 });
	    this.tag('ConnectText2').patch({ alpha: 0 });
	    this.tag('DiscoverButton').patch({ y: 158 });
	    this.tag('DiscoverText').patch({ text: { text: 'Cancel' } });
	    this._bluetoothSpin.start();


	    BT$1.bluetoothService.registerEvent("updateList", () => {
	     this.stopDiscovery();
	     this.fireAncestors('$rerenderDevices');
	    // this.tag('DiscoverText').patch({ text: { text: 'Discover New Devices' } })
	     //this.tag('DiscoveringText').patch({ alpha: 0 })
	    });


	    // setTimeout(() => {
	    //   this.stopDiscovery()
	    //   this.fireAncestors('$rerenderDevices')
	    // }, 10000)
	  }

	  stopDiscovery() {
	    //BT.discover.stop()
	    this.tag('DiscoveringText').patch({ alpha: 0 });
	    this.tag('ConnectText').patch({ y: 0, alpha: 1 });
	    this.tag('ConnectText2').patch({ y: -12, alpha: 1 });
	    this.tag('DiscoverText').patch({ text: { text: 'Discover New Devices' } });
	    this._bluetoothSpin.stop();
	  }

	  _handleEnter() {
	    this.isLoading = !this.isLoading;
	    if (this.isLoading) {
	      this.startDiscovery();
	    } else {
	      this.stopDiscovery();
	    }
	  }
	}

	class Option extends Lightning.Component {
	  static _template() {
	    return {
	      texture: Lightning.Tools.getRoundRect(250, 70, 35, 3, theme.textDark, false, theme.text),
	      Text: {
	        mount: 0.5,
	        x: 250 / 2 + 5,
	        y: 70 / 2 + 5,
	        color: theme.textLight,
	        text: { fontFace: 'Default', fontSize: 20 }
	      }
	    }
	  }

	  _init() {
	    this.tag('Text').patch({ text: { text: this.item.label } });
	  }

	  _focus() {
	    this.patch({
	      texture: Lightning.Tools.getRoundRect(250, 70, 35, 3, theme.primary, false, theme.text)
	    });
	    this.tag('Text').patch({ smooth: { color: theme.primary } });
	  }

	  _unfocus() {
	    this.patch({
	      texture: Lightning.Tools.getRoundRect(250, 70, 35, 3, theme.textDark, false, theme.text)
	    });
	    this.tag('Text').patch({ smooth: { color: theme.textLight } });
	  }
	}

	class OptionList extends Lightning.Component {
	  static _template() {
	    return {
	      mountY: 0.5,
	      y: 400 / 2,
	      flex: { direction: 'row', alignItems: 'center', justifyContent: 'space-between' }
	    }
	  }

	  rerender(isConnected,isPaired) {
	    console.log("rerender called paired is "+isPaired+" isConnected is "+isConnected);
	    this.children[0].tag('Text').patch({ text: { text: `${isPaired ? 'UNPAIR' : 'PAIR'} DEVICE` } });
	    this.children[1]
	      .tag('Text')
	      .patch({ text: { text: `${isConnected ? 'DISCONNECT' : 'CONNECT'} DEVICE` } });
	  }

	  rerenderForPaired(isPaired,isConnected=false) {
	    console.log("***********************rerendering"+isPaired);
	    this.children[0]
	      .tag('Text')
	      .patch({ text: { text: `${isPaired ? 'UNPAIR' : 'PAIR'} DEVICE` } });
	      console.log( this.children[0].tag('Text').text.text);
	      console.log("finished rerender for paired");
	      this.children[1]
	      .tag('Text')
	      .patch({ text: { text: `${isConnected ? 'DISCONNECT' : 'CONNECT'} DEVICE` } });
	  }

	  set items(items) {
	    this.children = items.map((item, i) => {
	      return {
	        type: Option,
	        item,
	        x: i * 100 + 50
	      }
	    });
	  }

	  _init() {
	    this.index = 0;
	  }

	  _getFocused() {
	    return this.children[this.index]
	  }

	  _handleLeft() {
	    if (this.index > 0) {
	      this.index--;
	    }
	  }

	  _handleRight() {
	    if (this.index < this.children.length - 1) {
	      this.index++;
	    }
	  }

	  _handleEnter() {
	    console.log("handle enter is");
	    console.log("handle enter is "+this.children[this.index].tag('Text').text.text.toLowerCase());
	    switch (this.children[this.index].tag('Text').text.text.toLowerCase()) {
	      case 'pair device':
	        return this.fireAncestors('$pairDevice')
	      case 'unpair device':
	        return this.fireAncestors('$unpairDevice')
	      case 'forget device':
	        return this.fireAncestors('$removeDevice')
	      case 'connect device':
	        console.log("case is connect device");
	        return this.fireAncestors('$connectDevice')
	      case 'disconnect device':
	      return this.fireAncestors('$disconnectDevice')
	      case 'cancel':
	        return this.fireAncestors('$closeDeviceOptions')
	    }
	  }
	}

	class DeviceOptions extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        mount: 0.5,
	        x: screen.w / 2,
	        y: screen.h / 2,
	        rect: true,
	        color: theme.devicesBG,
	        w: 1100,
	        h: 400,
	        Options: {
	          type: OptionList
	        }
	      }
	    }
	  }

	  _init() {
	    this.tag('Options').items = ['PAIR DEVICE', 'FORGET DEVICE', 'CANCEL'].map(label => ({
	      label
	    }));
	  }

	  _getFocused() {
	    return this.tag('Options')
	  }
	}

	class App extends Lightning.Component {
	  static _template() {
	    return {
	      Header: { type: Header },
	      Devices: { type: Devices$1 },
	      Discover: { type: Discover },
	      DeviceOptions: { type: DeviceOptions, alpha: 0 }
	    }
	  }

	  _init() {
	    this._setState('Devices');
	  }

	  $pairDevice() {
	    this.tag('Devices.DeviceList').pair();
	    this.$closeDeviceOptions();
	  }

	  $connectDevice(){
	    console.log("calling $connectDevice");
	    this.tag('Devices.DeviceList').connect();
	    this.$closeDeviceOptions();
	  }
	  disconnectDevice(){
	    console.log("disconnect device called inside connection screen");
	    this.tag('Devices.DeviceList').disconnect();
	    this.$closeDeviceOptions();
	   // this.tag('Devices.DeviceList').connect()
	    //this.$closeDeviceOptions()
	  }

	  $unpairDevice() {
	    this.tag('Devices.DeviceList').unpair();
	    this.$closeDeviceOptions();
	  }

	  $removeDevice() {
	    this.tag('Devices.DeviceList').unpair();
	    this.tag('Devices.DeviceList').remove();
	    this.$closeDeviceOptions();
	  }

	  $closeDeviceOptions() {
	    this._setState('Devices');
	  }

	  $rerenderDevices() {
	    this.tag('Devices.DeviceList').rerenderDevices();
	  }

	  $rerenderDeviceOptions(isConnected,isPaired) {
	    this._setState('DeviceOptions');
	    this.tag('DeviceOptions.Options').rerender(isConnected,isPaired);
	  }

	  $rerenderDeviceOptionsForPaired(isPaired=true) {
	    //this._setState('DeviceOptions')
	    this.$closeDeviceOptions();
	    this.tag('DeviceOptions.Options').rerenderForPaired(isPaired);
	   
	  }

	  static _states() {
	    return [
	      class Devices extends this {
	        _getFocused() {
	          return this.tag('Devices')
	        }

	        _handleRight() {
	          this._setState('Discover');
	        }
	      },
	      class Discover extends this {
	        _getFocused() {
	          return this.tag('Discover')
	        }

	        _handleLeft() {
	          this._setState('Devices');
	        }
	      },
	      class DeviceOptions extends this {
	        _getFocused() {
	          return this.tag('DeviceOptions')
	        }

	        $enter() {
	          console.log("handle enter in device options called");
	          this.tag('DeviceOptions').patch({ alpha: 1 });
	          this.tag('Header').patch({ alpha: 0.5 });
	          this.tag('Devices').patch({ alpha: 0.5 });
	          this.tag('Discover').patch({ alpha: 0.5 });
	        }

	        $exit() {
	          this.tag('DeviceOptions').patch({ alpha: 0 });
	          this.tag('Header').patch({ alpha: 1 });
	          this.tag('Devices').patch({ alpha: 1 });
	          this.tag('Discover').patch({ alpha: 1 });
	        }
	      }
	    ]
	  }
	}

	class Titles extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        y: screen.h - 300,
	        x: screen.w / 2 + 15,
	        mountX: 0.5,
	        flex: { direction: 'column', alignItems: 'center' },
	        SongTitle: {
	          text: { fontFace: 'Default', fontSize: 30 }
	        },
	        ArtistAndAlbum: {
	          text: { fontFace: 'Default', fontSize: 30 }
	        }
	      }
	    }
	  }


	  setTitle(song){
	    console.log("set tiltle called"+JSON.stringify(song));
	    this.tag('SongTitle').patch({ text: { text: song.title } });
	    this.tag('ArtistAndAlbum').patch({ text: { text: `${song.artist} - ${song.album}` } });
	  }
	  _active() {
	    console.log("active method is called");
	    //BT.getPaired()
	    //console.log("active method song is "+song )
	   // this.tag('SongTitle').patch({ text: { text: "song title is" } })
	   // this.tag('ArtistAndAlbum').patch({ text: { text: `${song.artist} - ${song.album}` } })
	  }
	}

	class Seekbar extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        w: screen.w - 150,
	        y: screen.h - 190,
	        x: 220,
	        
	      //  flex: { direction: 'row', alignItems: 'center' },
	        StartTimeText: {
	          mount:0.5,
	          text: { text: '0:00', fontFace: 'Default', fontSize: 28 }
	        },
	        EndTimeText: {
	          // x: 50,
	          x:1500,
	           mount:0.5,
	           text: { text: '-3:49', fontFace: 'Default', fontSize: 28 }
	         },
	        // BarStart: {
	        //   x: 50,
	        //   y: -3,
	        //   w: 120,
	        //   h: 10,
	        //   color: theme.primary,
	        //   rect: true
	        // },
	        // Circle: {
	        //   x: 20,
	        //   y: -1,
	        //   texture: Lightning.Tools.getRoundRect(30, 30, 15, 3, theme.light, true, theme.light)
	        // },
	        // BarEnd: {
	        //   y: -3,
	        //   w: 1250,
	        //   h: 10,
	        //   color: theme.light,
	        //   rect: true
	       // },
	       TimeBar: {
	        x: 50,
	        y: -3,
	        texture: Lightning.Tools.getRoundRect(1380, 6, 0, 0, 0, true, 0x80eef1f3)
	      },
	      ProgressBar: {
	        x: 50,
	        y: -3,
	        SeekBar: {
	          x: 0,
	          y: -12,
	          texture: Lightning.Tools.getRoundRect(30, 30, 15, 0, 0, true, 0xffeef1f3)
	        }
	      }
	        
	      }
	    }
	  }

	  setStartEnd(starttime,endtime,begintime,duration){
	    console.log("starting time is "+begintime+" duration "+duration);
	    this.tag('EndTimeText').patch({ text: endtime, fontFace: 'Default', fontSize: 28 });
	    this.tag('StartTimeText').patch({ text: { text: starttime, fontFace: 'Default', fontSize: 28 } });
	    this.tag('ProgressBar').patch({
	      texture: Lightning.Tools.getRoundRect(
	        (1380 * begintime) / duration,
	        6, 
	        0,
	        0,
	        0,
	        true,
	        0xffeef1f3
	      ),
	      SeekBar: {
	        x: (1380 * begintime) / duration,
	        y: -12,
	        texture: Lightning.Tools.getRoundRect(30, 30, 15, 0, 0, true, 0xffeef1f3)
	      }
	    });
	  }
	}

	class ControlButton extends Lightning.Component {
	  _focus() {
	    this.patch({
	      texture: Lightning.Tools.getRoundRect(60, 60, 30, 3, theme.primary, true, theme.primary)
	    });
	  }

	  _unfocus() {
	    this.patch({
	      texture: Lightning.Tools.getRoundRect(60, 60, 30, 3, theme.devicesBG, true, theme.devicesBG)
	    });
	  }
	}

	class Controls extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        flex: { direction: 'row' },
	        y: screen.h - 60,
	        x: screen.w / 2,
	        mountY: 1,
	        mountX: 0.5,
	        SkipBack: {
	          type: ControlButton,
	          texture: Lightning.Tools.getRoundRect(
	            60,
	            60,
	            30,
	            3,
	            theme.devicesBG,
	            true,
	            theme.devicesBG
	          ),
	          SkipBackIcon: {
	            x: 60 / 2 + 3,
	            y: 60 / 2 + 2,
	            mount: 0.5,
	            src: Utils.asset('images/png/wireSkipBwd.png'),
	            w:30,
	            h:30,
	          }
	        },
	        PlayPause: {
	          type: ControlButton,
	          x: 15,
	          texture: Lightning.Tools.getRoundRect(
	            60,
	            60,
	            30,
	            3,
	            theme.devicesBG,
	            true,
	            theme.devicesBG
	          ),
	          PlayIcon: {
	            alpha: 0,
	            x: 60 / 2 + 5,
	            y: 60 / 2 + 2,
	            mount: 0.5,
	            src: Utils.asset('images/png/wirePlay.png'),
	            w:30,
	            h:30,
	          },
	          PauseIcon: {
	            x: 60 / 2 + 1.5,
	            y: 60 / 2 + 2,
	            mount: 0.5,
	            src: Utils.asset('images/png/wirePause.png'),
	            w:30,
	            h:30,
	          }
	        },
	        SkipForward: {
	          type: ControlButton,
	          x: 30,
	          texture: Lightning.Tools.getRoundRect(
	            60,
	            60,
	            30,
	            3,
	            theme.devicesBG,
	            true,
	            theme.devicesBG
	          ),
	          SkipForwardIcon: {
	            x: 60 / 2 + 3,
	            y: 60 / 2 + 2,
	            mount: 0.5,
	            src: Utils.asset('images/png/wireSkipFwd.png'),
	            w:30,
	            h:30,
	          }
	        }
	      }
	    }
	  }

	  _init() {
	    this.index = 1;
	    this.isPlaying = true;
	  }

	  get child() {
	    return this.tag('Container').children[this.index]
	  }

	  _getFocused() {
	    return this.child
	  }

	  _handleLeft() {
	    if (this.index > 0) {
	      this.index--;
	    }
	  }

	  _handleRight() {
	    if (this.index < this.tag('Container').children.length - 1) {
	      this.index++;
	    }
	  }

	  updatePlayPause(action){
	if(action==="paused"){
	    this.tag('PlayPause.PauseIcon').patch({ alpha: 0 });
	    this.tag('PlayPause.PlayIcon').patch({ alpha: 1});
	  }else {
	    this.tag('PlayPause.PauseIcon').patch({ alpha: 1 });
	    this.tag('PlayPause.PlayIcon').patch({ alpha: 0 });
	  }
	  }
	  _handleEnter() {
	    switch (this.index) {
	      case 1:
	        this.isPlaying = !this.isPlaying;

	        if (this.isPlaying) {
	          
	          this.tag('PlayPause.PauseIcon').patch({ alpha: 1 });
	          this.tag('PlayPause.PlayIcon').patch({ alpha: 0 });
	          this.fireAncestors('$pause');
	        } else {
	          
	          this.tag('PlayPause.PauseIcon').patch({ alpha: 0 });
	          this.tag('PlayPause.PlayIcon').patch({ alpha: 1 });
	          this.fireAncestors('$play');
	        }
	        break
	      case 0:
	        this.fireAncestors('$sendAudioPlayBackCommand',"SKIP_PREVIOUS");
	        break
	      case 2:
	        this.fireAncestors('$sendAudioPlayBackCommand',"SKIP_NEXT");
	        break
	    }
	  }
	}

	class AlbumArt extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        mountX: 0.5,
	        x: screen.w / 2 + 15,
	        y: 280,
	        src: Utils.asset('images/png/headphones.png'),
	        w:500,
	        h:500,
	      }
	    }
	  }
	}

	const rowWidth = 1400;
	const columnWidth = rowWidth / 20;

	const activeBlocks = new Array(11).fill(null).map(() => new Array(20).fill(true));

	class Column extends Lightning.Component {
	  static _template() {
	    return {
	      w: columnWidth - 5,
	      h: 45,
	      rect: true
	    }
	  }

	  randomToggle() {
	    if (Boolean(Math.round(Math.random()))) {
	      // move down
	      if (activeBlocks[this.rowIndex + 1] && activeBlocks[this.rowIndex + 1][this.columnIndex]) {
	        // below is active
	        if (activeBlocks[this.rowIndex - 1] && activeBlocks[this.rowIndex - 1][this.columnIndex]) {
	          // above is active
	          return
	        }
	        this.patch({
	          alpha: 0
	        });
	        activeBlocks[this.rowIndex][this.columnIndex] = false;
	      }
	    } else {
	      // move up
	      if (
	        activeBlocks[this.rowIndex - 1] &&
	        activeBlocks[this.rowIndex - 1][this.columnIndex] === false
	      ) {
	        // above is inactive
	        if (activeBlocks[this.rowIndex + 1] && activeBlocks[this.rowIndex + 1][this.columnIndex]) {
	          // below is active
	          this.patch({
	            alpha: 1
	          });
	          activeBlocks[this.rowIndex][this.columnIndex] = true;
	        }
	      }
	    }
	  }

	  _init() {
	    setInterval(() => {
	      this.randomToggle();
	    }, 100);
	  }
	}

	class Row extends Lightning.Component {
	  _init() {
	    this.children = this.row.map((row, i) => {
	      return {
	        type: Column,
	        colorTop: row.colorTop,
	        colorBottom: row.colorBottom,
	        x: columnWidth * i + 5,
	        rowIndex: row.i,
	        columnIndex: i
	      }
	    });
	  }
	}

	class Grid extends Lightning.Component {
	  static _template() {
	    return {
	      x: screen.w / 2 - rowWidth / 2,
	      y: screen.h / 2 - 300,
	      mount: 0
	    }
	  }

	  _init() {
	    const red = new Array(20)
	      .fill(null)
	      .map(() => ({ colorTop: theme.eq.red, colorBottom: theme.eq.red }));
	    const redOrange = new Array(20)
	      .fill(null)
	      .map(() => ({ colorTop: theme.eq.red, colorBottom: theme.eq.orange }));
	    const orange = new Array(20)
	      .fill(null)
	      .map(() => ({ colorTop: theme.eq.orange, colorBottom: theme.eq.orange }));
	    const orangeYellow = new Array(20)
	      .fill(null)
	      .map(() => ({ colorTop: theme.eq.orange, colorBottom: theme.eq.yellow }));
	    const yellow = new Array(20)
	      .fill(null)
	      .map(() => ({ colorTop: theme.eq.yellow, colorBottom: theme.eq.yellow }));
	    const yellowGreen = new Array(20)
	      .fill(null)
	      .map(() => ({ colorTop: theme.eq.yellow, colorBottom: theme.eq.green }));
	    const green = new Array(20)
	      .fill(null)
	      .map(() => ({ colorTop: theme.eq.green, colorBottom: theme.eq.green }));

	    this.children = [
	      red,
	      red,
	      redOrange,
	      orange,
	      orangeYellow,
	      yellow,
	      yellowGreen,
	      green,
	      green,
	      green,
	      green
	    ].map((row, i) => {
	      return { type: Row, y: i * 48, row: row.map(contents => ({ ...contents, i })) }
	    });
	  }
	}

	class Equalizer extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        // Placeholder: {
	        //   y: 130,
	        //   mountX: 0.5,
	        //   x: screen.w / 2,
	        //   src: Utils.asset('images/equalizer.jpg')
	        // },
	        Grid: { type: Grid }
	      }
	    }
	  }
	}

	class App$1 extends Lightning.Component {
	  static _template() {
	    return {
	      Header: { type: Header, title: 'Bluetooth Audio In / Player' },
	      Equalizer: { type: Equalizer },
	      AlbumArt: { type: AlbumArt },
	      Titles: { type: Titles },
	      Seekbar: { type: Seekbar },
	      Controls: { type: Controls }
	    }
	  }

	  registerPlayerEvents() {
	   console.log("event registration started from player");
	    BT$1.bluetoothService.registerEvent("playbackchanged", (notification) => {
	     // console.log("action playbackchanged is " + notification.action)
	      if(notification.action==="paused"){
	        this.tag("Controls").updatePlayPause("paused");
	      }
	      if(notification.action==="started"){
	        this.tag("Controls").updatePlayPause("started");
	      }
	    });
	    BT$1.bluetoothService.registerEvent("playbackprogress", (notification) => {
	     console.log("action playbackprogress is "+notification.position);
	     console.log("action duration is "+notification.Duration );

	      this.tag('Seekbar').setStartEnd(this.millisToMinutesAndSeconds(notification.position),
	      this.millisToMinutesAndSeconds(notification.Duration-notification.position),
	        notification.position,notification.Duration);
	    });
	    BT$1.bluetoothService.registerEvent("playbackrequest", (notification) => {
	     // console.log("action playbackrequest is " + notification.action)
	    });
	    BT$1.bluetoothService.registerEvent("playbacknewtrack", (notification) => {
	     
	      this.tag('Titles').setTitle(notification);
	     // this.tag('Titles')._active()
	      //console.log("action playbacknewtrack*** is " + notification.album)
	    });
	  //  console.log("event registration closed")
	  }

	   millisToMinutesAndSeconds(millis) {
	    var minutes = Math.floor(millis / 60000);
	    var seconds = ((millis % 60000) / 1000).toFixed(0);
	    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
	  }

	   $play(){
	  //  console.log("play pressed")
	BT$1.bluetoothService.sendAudioPlaybackCommand("PLAY");

	   }

	   
	   $pause(){
	    //console.log("pause pressed")

	    BT$1.bluetoothService.sendAudioPlaybackCommand("PAUSE");



	  }
	  $sendAudioPlayBackCommand(command){
	console.log("sendAudioPlayBackCommand command is"+command);
	    BT$1.bluetoothService.sendAudioPlaybackCommand(command);
	  }
	 
	  _getFocused() {
	   
	    //this.fireAncestors('$registerPlayerEvents')
	    return this.tag('Controls')
	    
	  }
	  
	}

	class App$2 extends Lightning.Component {
	  static getFonts() {
	    return [
	      { family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }
	    ]
	  }

	  static _template() {
	    return {
	      Bg: {
	        rect: true,
	        color: theme.background,
	        w: screen.w,
	        h: screen.h,
	      },
	      Line: {
	        rect: true,
	        color: theme.devicesBG,
	        w: screen.w,
	        h: 2,
	        y: 160
	      },
	      Connection: { type: App },
	      Player: { type: App$1, alpha: 0 }
	    }
	  }

	  _init() {
	    this._setState('Connection');
	    BT$1.init();
	  }

	  $switchToPlayer() {
	    this._setState('Player');
	  }

	  $switchToConnection() {
	    this.tag('Player').patch({ alpha: 0});
	    this._setState('Connection');
	  }


	  static _states() {
	    return [
	      class Connection extends this {
	        _getFocused() {
	          return this.tag('Connection')
	        }

	        _handleBack() {}
	      },
	      class Player extends this {
	        _getFocused() {
	          return this.tag('Player')
	        }

	        $enter() {
	          this.tag('Connection').patch({ alpha: 0 });
	          this.tag('Player').registerPlayerEvents();
	          this.tag('Player').patch({ alpha: 1 });
	        }

	        $exit() {
	          console.log("exit called");
	          //this.fireAncestors('$disconnectDevice')
	          //this.tag('Connection').disconnectDevice()
	          this.tag('Connection').patch({ alpha: 1 });
	          this.tag('Player').patch({ alpha: 0 });
	        }

	        _handleBack() {
	          console.log("exit called");
	          //this.fireAncestors('$disconnectDevice')
	          this.tag('Connection').disconnectDevice();
	          this._setState('Connection');
	        }
	      }
	    ]
	  }
	}

	function index() {
	  return Launch(App$2, ...arguments)
	}

	return index;

}());
//# sourceMappingURL=appBundle.js.map
