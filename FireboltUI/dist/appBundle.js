/**
 * App version: 1.0.0
 * SDK version: 2.2.0
 * CLI version: 1.7.4
 * 
 * Generated: Wed, 16 Sep 2020 11:47:05 GMT
 */

var APP_firebolt_ui_applaunch = (function () {
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
	            forceZIndexContext: !!platformSettings.showVersion || !!platformSettings.showFps,
	          });

	          if (platformSettings.showVersion) {
	            this.childList.a({
	              ref: 'VersionLabel',
	              type: VersionLabel,
	              version: this.config.version,
	            });
	          }

	          if (platformSettings.showFps) {
	            this.childList.a({
	              ref: 'FpsCounter',
	              type: FpsIndicator,
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
	      if (platformSettings.onClose && typeof platformSettings.onClose === 'function') {
	        platformSettings.onClose();
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

	    _getFocused() {
	      return this.tag('App')
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

	const formatLocale = locale => {
	  if (locale && locale.length === 2) {
	    return `${locale.toLowerCase()}-${locale.toUpperCase()}`
	  } else {
	    return locale
	  }
	};

	const getLocale = defaultValue => {
	  if ('language' in navigator) {
	    const locale = formatLocale(navigator.language);
	    return Promise.resolve(locale)
	  } else {
	    return Promise.resolve(defaultValue)
	  }
	};

	const getLanguage = defaultValue => {
	  if ('language' in navigator) {
	    const language = formatLocale(navigator.language).slice(0, 2);
	    return Promise.resolve(language)
	  } else {
	    return Promise.resolve(defaultValue)
	  }
	};

	const getCountryCode = defaultValue => {
	  if ('language' in navigator) {
	    const countryCode = formatLocale(navigator.language).slice(3, 5);
	    return Promise.resolve(countryCode)
	  } else {
	    return Promise.resolve(defaultValue)
	  }
	};

	const getLatLon = defaultValue => {
	  return new Promise(resolve => {
	    const geoLocationSuccess = success => {
	      const coords = success && success.coords;
	      return resolve([coords.latitude, coords.longitude])
	    };
	    const geoLocationError = error => {
	      return resolve(defaultValue)
	    };
	    const geoLocationOptions = {
	      enableHighAccuracy: true,
	      timeout: 5000,
	      maximumAge: 0,
	    };

	    if ('geolocation' in navigator) {
	      navigator.geolocation.getCurrentPosition(
	        geoLocationSuccess,
	        geoLocationError,
	        geoLocationOptions
	      );
	    } else {
	      return resolve(defaultValue)
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

	const defaultProfile = {
	  ageRating: 'adult',
	  city: 'New York',
	  countryCode: getCountryCode('US'),
	  ip: '127.0.0.1',
	  household: 'b2244e9d4c04826ccd5a7b2c2a50e7d4',
	  language: getLanguage('en'),
	  latlon: getLatLon([40.7128, 74.006]),
	  locale: getLocale('en-US'),
	  mac: '00:00:00:00:00:00',
	  operator: 'Metrological',
	  platform: 'Metrological',
	  packages: [],
	  uid: 'ee6723b8-7ab3-462c-8d93-dbf61227998e',
	  stbType: 'Metrological',
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

	let getInfo = key => {
	  const profile = { ...defaultProfile, ...Settings.get('platform', 'profile') };
	  return Promise.resolve(profile[key])
	};

	let setInfo = (key, params) => {
	  if (key in defaultProfile) defaultProfile[key] = params;
	};

	const initProfile = config => {
	  getInfo = config.getInfo;
	  setInfo = config.setInfo;
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

	class localCookie{constructor(e){return e=e||{},this.forceCookies=e.forceCookies||!1,!0===this._checkIfLocalStorageWorks()&&!0!==e.forceCookies?{getItem:this._getItemLocalStorage,setItem:this._setItemLocalStorage,removeItem:this._removeItemLocalStorage,clear:this._clearLocalStorage}:{getItem:this._getItemCookie,setItem:this._setItemCookie,removeItem:this._removeItemCookie,clear:this._clearCookies}}_checkIfLocalStorageWorks(){if("undefined"==typeof localStorage)return !1;try{return localStorage.setItem("feature_test","yes"),"yes"===localStorage.getItem("feature_test")&&(localStorage.removeItem("feature_test"),!0)}catch(e){return !1}}_getItemLocalStorage(e){return window.localStorage.getItem(e)}_setItemLocalStorage(e,t){return window.localStorage.setItem(e,t)}_removeItemLocalStorage(e){return window.localStorage.removeItem(e)}_clearLocalStorage(){return window.localStorage.clear()}_getItemCookie(e){var t=document.cookie.match(RegExp("(?:^|;\\s*)"+function(e){return e.replace(/([.*+?\^${}()|\[\]\/\\])/g,"\\$1")}(e)+"=([^;]*)"));return t&&""===t[1]&&(t[1]=null),t?t[1]:null}_setItemCookie(e,t){document.cookie=`${e}=${t}`;}_removeItemCookie(e){document.cookie=`${e}=;Max-Age=-99999999;`;}_clearCookies(){document.cookie.split(";").forEach(e=>{document.cookie=e.replace(/^ +/,"").replace(/=.*/,"=;expires=Max-Age=-99999999");});}}

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
	  namespace = Settings.get('platform', 'appId');
	  // todo: pass options (for example to force the use of cookies)
	  lc = new localCookie();
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

	const Screen={
	    width:1920,
	    height:1080,
	    navBarHeight:75,
	    gridViewWidth:244.5*4+45*4,
	    itemWidth:244.5,
	    itemHeight:319.5,
	    gapW: 45,
	    gapH: 45,
	};

	var apps={"applications":
	    [
	      {
	        "displayName" : "YouTube TV",
	        "uri" : "https://www.youtube.com/tv",
	        "applicationType" : "Cobalt",
	        "version" : "1.0",
	        "url" : "/images/youtube.png"
	      },
	      {
	        "displayName" : "Fancy",
	        "uri" : "https://rdkwiki.com/rdk-apps/BouncingBall/index.html",
	        "applicationType" : "Lightning",
	        "version" : "1.0",
	        "url" : "/images/logo.png"
	      }
	    ]
	  };

	class GridViewItem extends Lightning.Component {
	    static _template() {
	        return {
	            Item: {}
	        }
	    }
	    set item(item) {

	        this.tag('Item').patch({
	            BgImg: {
	                x: 0,
	                y: 0,
	                texture: Lightning.Tools.getSvgTexture(Utils.asset('images/square.png'), this.w, this.h - 75)
	            },
	            Img: {
	                x: this.w / 2,
	                y: (this.h - 75) / 2,
	                mount: 0.5,
	            },
	            CheckBox:{
	                x:this.w-100,
	                y:50,
	                src:Utils.asset('images/app-box.png'),
	                visible:false
	            },
	            Text:{
	                x:this.w/2,
	                y:(this.h-37.5),
	                mount:0.5,
	                text: {text:item.displayName,fontSize:24,}
	            }
	        });
	        if(item.url.startsWith("/usb")){
	            item.url = '/images/usb.png';
	            this.tag('Item').patch({Img: {
	                texture: Lightning.Tools.getSvgTexture(Utils.asset(item.url), this.w * 0.6, (this.h - 75) * 0.6)
	             } });
	        }
	        else if (item.url.startsWith("/images")){
	            this.tag('Item').patch({Img: {
	                texture: Lightning.Tools.getSvgTexture(Utils.asset(item.url), this.w * 0.6, (this.h - 75) * 0.6)
	             } });
	            }
	        else {
	            this.tag('Item').patch({Img: {
	                src: item.url,
	                w: this.w * 0.6,
	                h: (this.h - 75) * 0.6
	             } });
	        }
	        this.data=item;
	    }

	    _focus() {

	        this.tag('Item.BgImg').patch({
	            x: 0,
	            y: 0,
	            texture: Lightning.Tools.getSvgTexture(Utils.asset('images/square_select.png'), this.w, this.h - 75)
	        });
	    }
	    _unfocus() {

	        this.tag('Item.BgImg').patch({
	            x: 0,
	            y: 0,
	            texture: Lightning.Tools.getSvgTexture(Utils.asset('images/square.png'), this.w, this.h - 75)
	        });
	    }
	    set check(bool){
	        console.log('here');
	        this.tag('Item.CheckBox').visible=bool;
	    }
	    set checkImage(str){
	        console.log(str);
	        if (str==='play'){
	            this.tag('Item.CheckBox').src=Utils.asset('images/app-play.png');
	        }
	        else if(str==='pause'){
	            this.tag('Item.CheckBox').src=Utils.asset('images/app-pause.png');
	        }
	        else
	        this.tag('Item.CheckBox').src=Utils.asset('images/app-box.png');
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

	var activatedWeb = false;
	var activatedLightning = false;
	var activatedCobalt = false;
	var webUrl = '';
	var lightningUrl = '';
	var cobaltUrl = '';
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
	        activatedLightning=true;
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
	   * Function to launch Cobalt app.
	   * @param {String} url url of app.
	   */
	  launchCobalt(url) {
	    console.log(activatedCobalt);
	    if (!activatedCobalt) {
	      this.activateCobalt(url);
	    } else {
	      this.updateCobaltUrl(url);
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
	        thunder$1.call(childCallsign, 'state', 'resumed');
	      })
	      .then(result => {
	        this.updateCobaltUrl(url);
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });
	  }

	  /**
	   * Function to update url of cobalt app.
	   * @param {String} url url of app.
	   */
	  updateCobaltUrl(url) {
	    const childCallsign = 'Cobalt';
	    if (cobaltUrl != url) {
	      cobaltUrl = url;
	      thunder$1.call(childCallsign, 'url', url);
	    }
	    thunder$1
	      .call(childCallsign, 'state', 'resumed')
	      .then(() => {
	        thunder$1.call('org.rdk.RDKShell', 'moveToFront', { client: 'Cobalt' });
	      })
	      .then(() => {
	        thunder$1.call('org.rdk.RDKShell', 'setFocus', { client: 'Cobalt' });
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
	   * Function to suspend lightning app.
	   */
	  suspendLightning() {
	    thunder$1.call('LightningApp', 'state', 'suspended');
	  }

	    /**
	   * Function to suspend cobalt app.
	   */
	  suspendCobalt() {
	    thunder$1.call('Cobalt', 'state', 'suspended');
	  }

	  refresh(){
	    thunder$1.call('ResidentApp', 'url', 'http://127.0.0.1:50050/lxresui/index.html');
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
	    cobaltUrl = '';
	  }

	  /**
	   * Function to deactivate lightning app.
	   */
	  deactivateLightning() {
	    thunder$1.Controller.deactivate({ callsign: 'LightningApp' });
	    activatedLightning = false;
	    lightningUrl = '';
	  }

	  static pluginStatus(plugin){
	    switch(plugin){
	      case'WebApp': return activatedWeb    
	      case 'Cobalt': return activatedCobalt
	      case 'Lightning': return activatedLightning
	    }
	  }
	}

	/* String Constants */
	const StringConstants = {
	  TITLE: 'Firebolt Apps',
	  LIVETV: 'Live TV',
	  GUIDE: 'Guide',
	  SETTINGS: 'Settings'
	};

	/**
	 * Class to render items in listings pane..
	 */
	class ButtonItem extends Lightning.Component {
	  static _template() {
	    return {
	      Rect: {
	        rect: true,
	        x: 0,
	        y: 10,
	        w: 600,
	        h: 50,
	        color: 0xffe6781e,
	        alpha: 0
	      }
	      ,
	      Text: {
	        x: 0,
	        y: 10,
	        text: { text: ' ', textColor: '0xffffffff', fontSize: 33 }
	      },
	      Icon: {
	        x: 470,
	        y: 20,
	      }

	    }
	  }
	  _init() {
	    console.log('&*&*&*&*&');
	    //this.tag('Rect').patch({ color:0xffffffff})
	    console.log(this.y);
	    this.tag('Text').patch({ text: { text: this.data.title, textColor: '0xffffffff', fontSize: 33  } });
	    if (this.data.isTitle) {
	      this.tag('Text').text.fontStyle = 'normal';
	    }
	    else {
	      this.tag('Icon').src = Utils.asset(this.data.icon);
	      this.tag('Text').text.fontStyle = 'bold';
	    }
	    this.suspend = false;

	  }
	  /**
	   * Function to change properties of items during focus.
	   */
	  _focus() {
	    //  this.tag('Text').patch({ text: { textColor: 0xffffffff} })
	    this.tag('Rect').patch({ alpha: 1 });


	  }

	  /**
	   * Function to change properties of items during unfocus.
	   */
	  _unfocus() {
	    this.tag('Rect').patch({ alpha: 0 });
	    //  this.tag('Text').patch({ text: { textColor: 0xfff5ec42} })

	  }
	  _handleEnter() {
	    console.log("button Enter*****************");
	    if (this.data.title == 'Suspend') {
	      this.tag('Icon').src = !this.suspend ? Utils.asset('images/switch-on.png') : Utils.asset('images/switch-off.png');
	      this.suspend = !this.suspend;
	      this.fireAncestors('$textVisible', this.suspend);
	    }
	  }
	}

	/**
	 * @export
	 * @class SideNavbar
	 * @extends {Lightning.Component}
	 */
	class SideNavbar extends Lightning.Component {
	  static getFonts() {
	    return [{ family: 'Bold', url: Utils.asset('fonts/DejaVuSans-Bold.ttf') }]
	  }
	  static _template() {
	    return {
	      Wrapper: {
	        Home: {
	          x: 60,
	          text: {
	            fontSize: 56,
	            fontFace: 'Regular',
	            textAlign: 'center',
	            text: StringConstants.TITLE,
	          },
	        },
	        SuspendText: {
	          x: 1370,
	          y: 5,
	          mountX: 1,
	          text: {
	            text: "Suspend mode Active",
	            fontSize: 20,
	            fontStyle: 'bold'
	          },
	          visible: false
	        },
	        Popup: {
	          rect: true,
	          x: 1310 - 50,
	          y: 0,
	          alpha: 0,
	          color: 0xff000000,
	          w: 610,
	          h: 1080,
	          Control: {
	            x: 610,
	            y: 5,
	            rect: true,
	            w: 200,
	            h: 70,
	            mountX: 1,
	            color: 0xff292929,
	            Searchtext: {
	              x: 100,
	              y: 35,
	              mount: 0.5,
	              text: {
	                fontSize: 36,
	                textAlign: 'center',
	                text: 'Controls',
	              },
	            },
	          },
	          Popuptext: {
	            x: 10,
	            y: 90,
	            text: {
	              fontSize: 56,
	              fontFace: 'Regular',
	              textAlign: 'center',
	              textColor: 0xffffffff,
	              text: 'Options',
	            },
	          },
	          ButtonListView: {
	            type: Lightning.components.ListComponent,
	            x: 10,
	            y: 176,
	            w: 600,
	            h: 1080,
	            invertDirection: true,
	            roll: true,
	            itemSize: 80,
	            horizontal: false,
	          },
	          zIndex: 5
	        },

	        Diagnostics: {
	          x: 1390,
	          // y: -5,
	          rect: true,
	          color: 0xabbabbcf,
	          w: 225,
	          h: 55,
	          Searchtext: {
	            x: 225 / 2,
	            y: 55 / 2,
	            mount: 0.5,
	            text: {
	              // color:0xffffffff,
	              fontSize: 27,
	              fontFace: 'Regular',
	              textAlign: 'center',
	              text: 'Diagnostics',
	            },
	          },
	        },
	        Controls: {
	          x: 1690,
	          // y:5,
	          rect: true,
	          w: 180,
	          h: 55,
	          color: 0xabbabbcf,
	          Searchtext: {
	            x: 90,
	            y: 55 / 2,
	            mount: 0.5,
	            text: {
	              fontSize: 27,
	              fontFace: 'Regular',
	              textAlign: 'center',
	              text: 'Controls',
	            },
	          },
	        },

	      },
	    }
	  }

	  $textVisible(bool) {
	    this.tag('SuspendText').visible = bool;
	    this.fireAncestors('$checkBox', bool);
	  }
	  /**
	   * @memberof SideNavbar
	   * Init method.
	   */
	  _init() {
	    var items = [
	      {
	        title: 'Suspend',
	        icon: '/images/switch-off.png'
	      },
	      {
	        title: 'KEYBOARD',
	        isTitle: true
	      },
	      {
	        title: 'Stop',
	        icon: '/images/icon-sidebar-stop.png'
	      },
	      {
	        title: 'Refresh',
	        icon: '/images/dev-ctrl-i.png'
	      },
	      //Below mappings are required for Xi boxes only.
	      {
	        title: 'REMOTE',
	        isTitle: true
	      },
	      {
	        title: 'Stop',
	        icon: '/images/dev-xfinity-exit.png'
	      },
	      {
	        title: 'Refresh',
	        icon: '/images/dev-info-i.png'
	      },
	    ];
	    items =  items.slice(0, 4);
	    this.tag('ButtonListView').items = items.map((info, index) => {
	      return {
	        type: ButtonItem,
	        data: info,
	      }
	    });
	    this.tag('ButtonListView').start();
	  }
	  _getFocused() {
	    this._setState('HomeState');
	    //call from applist
	  }
	  /**
	   * @memberof SideNavbar
	   * Focus method.
	   */
	  _focus() {
	    // this.tag('HorizontalBar').setSmooth('alpha', 0.3)
	    // this.tag('Wrapper').alpha = 1
	  }

	  /**
	   * @memberof SideNavbar
	   * Unfocus method.
	   */
	  _unfocus() {
	    //this.tag('HorizontalBar').setSmooth('alpha', 0)
	    //this.tag('Wrapper').alpha = 0.5
	  }

	  /**
	   * @static
	   * @returns array of States
	   * @memberof SideNavbar
	   */
	  static _states() {
	    return [
	      class ButtonListView extends this {
	        _getFocused() {
	          if (this.tag('ButtonListView').length) {
	            return this.tag('ButtonListView').element
	          }
	        }
	        _handleDown() {
	          this.tag('Popup').patch({ alpha: 0 });
	          this._setState('LiveTVState');
	          return this.tag('ButtonListView').element
	        }
	        _handleUp() {
	          if (0 != this.tag('ButtonListView').index) {
	            this.tag('ButtonListView').setPrevious();
	          }
	          return this.tag('ButtonListView').element
	        }
	        _handleLeft() {
	          this.tag('Popup').patch({ alpha: 0 });
	          this._setState('HomeState');
	        }
	      },
	      class HomeState extends this {
	        $enter() {
	          this.tag('Diagnostics').color = 0xff00b3dc;
	        }
	        _getFocused() {
	          return this.tag('Wrapper').Diagnostics
	          //call from applist
	        }

	        _focus() {
	          this.tag('Diagnostics').color = 0xff00b3dc;
	          return this.tag('Diagnostics')
	        }
	        _handleEnter() {
	          console.log('enter pressed homestate');
	          var url = 'http://127.0.0.1:50050/lxdiag/index.html';
	          var thunderCalls = new ThunderCalls();

	          thunderCalls.launchLightning(url);
	        }

	        _handleKey(event) {
	          var thunderCalls = new ThunderCalls();
	          if (event.keyCode == 77) {
	            const config = {
	              host: '127.0.0.1',
	              port: 9998,
	              default: 1,
	            };
	            var thunder = thunderJS(config);
	            thunderCalls.suspendLightning();
	            thunder
	              .call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' })
	              .then(result => {
	                console.error('firebolt moveToFront Success');
	              });
	            thunder
	              .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
	              .then(result => {
	                console.log('fb setFocus Success');
	              })
	              .catch(err => {
	                console.log('Error', err);
	              });
	          }
	        }

	        _unfocus() {
	          console.log('exit');
	          this.tag('Diagnostics').color = 0xabbabbcf;
	        }
	        $exit() {
	          console.log('exitt called homestate');
	          this.tag('Diagnostics').color = 0xabbabbcf;
	        }
	        _handleDown() {
	          this.fireAncestors('$setGridViewState');
	        }
	        _handleRight() {
	          this._setState('LiveTVState');
	        }
	      },
	      class LiveTVState extends this {
	        $enter() {
	          this.tag('Controls').color = 0xff00b3dc;
	        }

	        _getFocused() {
	          return this.tag('Wrapper').Controls

	          //call from applist
	        }
	        _focus() {
	          this.tag('Controls').color = 0xff00b3dc;
	        }
	        _unfocus() {
	          this.tag('Controls').color = 0xabbabbcf;
	        }
	        _handleLeft() {
	          console.log('handle left pressed');
	          this.tag('Popup').patch({ alpha: 0 });
	          this._setState('HomeState');
	        }
	        _handleBack() {
	          console.log('handle back pressed');
	          this._setState('HomeState');
	        }
	        _handleEnter() {
	          console.log('handle enter called');
	          this.tag('Popup').patch({ alpha: 1 });
	          this._setState('ButtonListView');
	        }
	        $exit() {
	          this.tag('Controls').color = 0xabbabbcf;
	        }
	      },

	      ,
	      ,
	    ]
	  }
	}

	/**
	 * Bottom menu item
	 */
	class BottomMenuItem extends Lightning.Component {
	    static _template() {
	        return {
	            Item: {}
	        }
	    }

	    /**
	     * Set bottom menu item.
	     */
	    set item(item) {
	        this._item = item;
	        let path = 'images/control-' + item + '.png';
	        this.tag('Item').patch({
	            w: 200,
	            h: 200,
	            src: Utils.asset(path)
	        });
	    }

	    _focus() {
	        let path = 'images/control-' + this._item + '-on.png';
	        this.tag('Item').src = Utils.asset(path);
	    }

	    _unfocus() {
	        let path = 'images/control-' + this._item + '.png';
	        this.tag('Item').src = Utils.asset(path);
	    }
	    
	}

	/**
	 * Bottom menu
	 */
	class BottomMenu extends Lightning.Component {
	    static _template() {
	        return {
	            x: 0,
	            y: 0,
	            w: 1920,
	            h: 400,
	            rect: true,
	            color: 0xff000000,
	            List: {
	                type: Lightning.components.ListComponent,
	                x: 1920 / 2,
	                y: 100,
	                w: 800,
	                h: 300,
	                mountX: 0.5,
	                roll: true,
	                itemSize: 250,
	            }
	        }
	    }

	    /**
	     * Set the items for bottom menu.
	     */
	    set info(info) {
	        this.items = info;
	        this.tag('List').items = [];
	        this.tag('List').items = this.items.map((info, index) => {
	            return {
	                w: 200,
	                h: 200,
	                type: BottomMenuItem,
	                item: info,
	            }
	        });
	    }

	    _getFocused() {
	        console.log('list');
	        return this.tag('List').element
	    }

	    _handleLeft() {
	        return this.tag('List').setPrevious()
	    }

	    _handleRight() {
	        return this.tag('List').setNext()
	    }

	    _handleEnter() {
	        console.log(this.tag('List').element._item);
	        this.fireAncestors('$selectedOption', this.tag('List').element._item);
	    }
	}

	class ContentContainer extends Lightning.Component {
	  static _template() {
	    return {
	      GridView: {
	        color: 0xff292929,
	        rect: true,
	        x: Screen.width / 2,
	        y: 200,
	        mountX: 0.5,
	        w: Screen.gridViewWidth,
	        h: Screen.height - Screen.navBarHeight,
	        flex: { direction: 'row', wrap: true }
	      },
	      SideNavBar: { x: 0, y: 40, type: SideNavbar },
	      IpAddress: {
	        x: 1820,
	        y: 850,
	        mountX: 1,
	        mountY: 0,
	        text: { text: 'IP:NA', fontStyle: 'bold', textColor: 0xffffffff }
	      },
	      BottomMenu: {
	        x: 0,
	        y: 680,
	        w: 1920,
	        h: 1080,
	        type: BottomMenu,
	        visible: false,

	      },

	    }
	  }
	  _init() {
	    this.suspend = false;
	    this.appRunning = false;
	    const config = {
	      host: '127.0.0.1',
	      port: 9998,
	      default: 1
	    };
	    var thunder = thunderJS(config);

	    const systemcCallsign = 'org.rdk.System';
	    thunder.Controller.activate({ callsign: systemcCallsign })
	      .then(() => {
	        setInterval(() => {
	          thunder
	            .call(systemcCallsign, 'getDeviceInfo', { params: 'estb_ip' })
	            .then(result => {
	              this.tag('IpAddress').text.text = 'IP:' + result.estb_ip;
	            })
	            .catch(err => {
	              console.log('IpAddress Error', err);
	            });
	        }, 10000);
	      })
	      .catch(err => {
	        console.log('System Error', err);
	      });



	    const rdkshellCallsign = 'org.rdk.RDKShell';
	    thunder.Controller.activate({ callsign: rdkshellCallsign }).then(result => {
	      console.log('activate rdk shell success');
	    });
	    thunder.call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' });
	    thunder
	      .call(rdkshellCallsign, 'addKeyIntercept', {
	        client: 'ResidentApp',
	        keyCode: 77,
	        modifiers: ["ctrl"]
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
	        keyCode: 73,
	        modifiers: ["ctrl"]
	      })
	      .then(result => {
	        console.log('addKeyIntercept success');
	      })
	      .catch(err => {
	        console.log('Error', err);
	      });
	    this._index = 0;
	    const URL_PARAMS = new window.URLSearchParams(window.location.search);
	    var data = URL_PARAMS.get('data');
	    var prop_apps = 'applications';
	    var prop_displayname = 'displayName';
	    var prop_uri = 'uri';
	    var prop_apptype = 'applicationType';
	    var prop_url = 'url';
	    var appdetails = [];
	    var appdetails_format = [];
	    try {
	      if (data != null && JSON.parse(data).hasOwnProperty(prop_apps)) {
	        appdetails = JSON.parse(data).applications;
	        for (var i = 0; i < appdetails.length; i++) {
	          if (appdetails[i].hasOwnProperty(prop_displayname) &&
	            appdetails[i].hasOwnProperty(prop_uri) &&
	            appdetails[i].hasOwnProperty(prop_apptype) &&
	            appdetails[i].hasOwnProperty(prop_url)) {
	            appdetails_format.push(appdetails[i]);
	          }
	        }
	        for (var i = 0; i < apps.applications.length; i++) {
	          appdetails_format.push(apps.applications[i]);
	        }
	      }
	      else {
	        appdetails_format = apps.applications;
	      }
	    } catch (e) {
	      appdetails_format = apps.applications;
	      console.log("Query data is not proper: " + e);
	    }
	    this.tag('GridView').children = appdetails_format.map((app, index) => {
	      return {
	        ref: 'AppListItem' + index,
	        w: Screen.itemWidth,
	        h: Screen.itemHeight,
	        type: GridViewItem,
	        item: app,
	        appRunning: false,
	        suspend: false,
	        flexItem: { marginRight: Screen.gapW, marginBottom: Screen.gapH }

	      }
	    });
	    this._setState('GridView');
	  }

	  $checkBox(bool) {
	    this.suspend = bool;
	    this.tag('GridView').children.map((child) => {
	      child.check = bool;
	    });
	  }
	  $setGridViewState() {
	    this._setState('GridView');
	  }
	  openApp() {
	    console.log(this.tag('GridView').children[this._index].data.uri);
	    var url = this.tag('GridView').children[this._index].data.uri;
	    var applicationType = this.tag('GridView').children[this._index].data.applicationType;
	    var thunderCalls = new ThunderCalls();
	    //this._zoomIn()
	    if (applicationType == 'WebApp') {
	      console.log("********webapp enter" + url);
	      thunderCalls.launchWeb(url);
	    }
	    else if (applicationType == 'Cobalt') {
	      thunderCalls.launchCobalt(url);
	      this.tag('GridView').children[this._index].checkImage = 'play';
	    }
	    else if (applicationType == 'Lightning') {
	      thunderCalls.launchLightning(url);
	      this.tag('GridView').children[this._index].checkImage = 'play';
	    }
	    if (this.suspend == true) {
	      this.tag('BottomMenu').info = ['stop', 'suspend', 'home'];
	    }
	    this.tag('GridView').children[this._index].appRunning = true;
	  }
	  static _states() {
	    return [
	      //set class sidenavbar,get focussed
	      class SideNavBar extends this {
	        _getFocused() {
	          console.log("focussss");
	          return this.tag('SideNavBar')
	        }

	        $exit() {
	        }
	        _handleDown() {
	          this._setState('GridView');
	        }

	      },
	      class GridView extends this {
	        _getFocused() {
	          return this.tag('GridView').children[this._index]
	        }

	        _handleKey(event) {
	          console.log(event.keyCode);
	          let prevIndex = this._index;
	          let currentIndex = this._index;
	          if (event.keyCode == 77 && this.suspend == false) {
	            const config = {
	              host: '127.0.0.1',
	              port: 9998,
	              default: 1
	            };
	            console.log("applicationType index " + currentIndex);
	            var applicationType = this.tag('GridView').children[this._index].data.applicationType;
	            console.log("applicationType is " + applicationType);
	            var thunder = thunderJS(config);

	            var thunderCalls = new ThunderCalls();
	            if (applicationType == 'WebApp') {
	              thunderCalls.deactivateWeb();
	            }
	            else if (applicationType == 'Cobalt') {
	              thunderCalls.deactivateCobalt();
	            }
	            else if (applicationType == 'Lightning') {
	              thunderCalls.deactivateLightning();
	            }
	            thunder
	              .call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' })
	              .then(result => {
	                this.tag('GridView').children[this._index].checkImage = '';
	                console.error('firebolt moveToFront Success');
	              });
	            thunder
	              .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
	              .then(result => {
	                console.log('fb setFocus Success');
	              })
	              .catch(err => {
	                console.log('Error', err);
	              });
	            this.appRunning = false;
	          }
	          if (event.keyCode == 77 && this.suspend == true && this.tag('GridView').children[this._index].appRunning == true) {
	            this.tag('BottomMenu').visible = true;
	            const config = {
	              host: '127.0.0.1',
	              port: 9998,
	              default: 1
	            };
	            var thunder = thunderJS(config);
	            var thunderCalls = new ThunderCalls();
	            console.log("applicationType index " + currentIndex);
	            var applicationType = this.tag('GridView').children[this._index].data.applicationType;
	            this.tag('BottomMenu').visible = true;
	            thunder
	              .call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' })
	              .then(result => {

	                console.error('firebolt moveToFront Success');
	              });
	            thunder
	              .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
	              .then(result => {
	                console.log('fb setFocus Success');
	                this.tag('GridView').visible = false;
	                this.tag('SideNavBar').visible = false;
	                this.parent.color = 0x00000000;
	                this._setState('BottomMenu');
	              })
	              .catch(err => {
	                console.log('Error', err);
	              });
	          }
	          if (event.keyCode == 73 ) {
	            const config = {
	              host: '127.0.0.1',
	              port: 9998,
	              default: 1
	            };
	            console.log("applicationType index " + currentIndex);
	            var applicationType = this.tag('GridView').children[this._index].data.applicationType;
	            console.log("applicationType is " + applicationType);
	            var thunder = thunderJS(config);

	            var thunderCalls = new ThunderCalls();
	            if (applicationType == 'WebApp') {
	              thunderCalls.suspendWeb();
	            }
	            else if (applicationType == 'Cobalt') {
	              thunderCalls.suspendCobalt();
	            }
	            else if (applicationType == 'Lightning') {
	              thunderCalls.suspendLightning();
	            }
	            thunder
	              .call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' })
	              .then(result => {
	                console.error('firebolt moveToFront Success');
	              });
	            thunder
	              .call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' })
	              .then(result => {
	                console.log('fb setFocus Success');
	              })
	              .catch(err => {
	                console.log('Error', err);
	              });
	            thunderCalls.refresh();
	          }
	          if (event.key === 'ArrowRight') {
	            currentIndex = prevIndex + 1;
	          }
	          else if (event.key === 'ArrowLeft') {
	            console.log("arrow left pressed");
	            currentIndex = prevIndex - 1;
	          }
	          else if (event.key === 'ArrowDown') {
	            currentIndex = prevIndex + 4;
	          }
	          else if (event.key === 'ArrowUp') {
	            console.log("currentIndex up" + currentIndex);
	            console.log("prevIndex up" + prevIndex);
	            if (currentIndex < 4) {
	              this._setState('SideNavBar');
	            } else {
	              currentIndex = prevIndex - 4;
	            }
	          }
	          else if (event.key === 'Enter') {
	            if (this.tag('GridView').children[this._index].appRunning) {
	              this.openApp();
	              return
	            }
	            if (this.suspend == false) {
	              this.openApp();
	            }
	            else if (this.suspend == true) {
	              console.log(ThunderCalls.pluginStatus(this.tag('GridView').children[this._index].data.applicationType));
	              if (ThunderCalls.pluginStatus(this.tag('GridView').children[this._index].data.applicationType)) {
	                console.log('false');
	                this.tag('BottomMenu').info = ['stop', 'resume'];
	                this._setState('BottomMenu');
	              }
	              else {
	                this.openApp();
	              }
	            }
	          }
	          if (currentIndex >= 0 && currentIndex < this.tag('GridView').children.length) {
	            this._index = currentIndex;
	            this._scroll(event.key);
	          }
	        }

	        _scroll(dir) {
	          let requiredH = this.tag('GridView').children[this._index].finalY + Screen.itemHeight + Screen.gapH;
	          console.log('scroll' + requiredH + '  ' + this.tag('GridView').h);
	          if (dir === 'ArrowDown' || dir === 'ArrowRight') {
	            if (requiredH < this.tag('GridView').h)
	              return
	            else
	              this.tag('GridView').setSmooth('y', -1 * (this.tag('GridView').children[this._index].finalY), { duration: 1 });
	          }
	          else if (dir === 'ArrowUp' || dir === 'ArrowLeft') {
	            console.log("arrow up calledsss");
	            if (this.tag('GridView').y === 0 || this.tag('GridView').y < 0) {
	              this.tag('GridView').setSmooth('y', 0, { duration: 1 });
	              return
	            }
	          }
	        }
	      },
	      class BottomMenu extends this {
	        $enter() {
	          this.tag('BottomMenu').visible = true;
	        }
	        $exit() {
	          this.tag('GridView').visible = true;
	          this.tag('SideNavBar').visible = true;
	          this.parent.color = 0xff292929;
	        }
	        _getFocused() {
	          console.log('Bottmmenu');
	          return this.tag('BottomMenu')
	        }
	        $selectedOption(option) {
	          const config = {
	            host: '127.0.0.1',
	            port: 9998,
	            default: 1
	          };
	          var applicationType = this.tag('GridView').children[this._index].data.applicationType;
	          console.log("applicationType is " + applicationType);
	          var thunder = thunderJS(config);

	          var thunderCalls = new ThunderCalls();
	          if (applicationType == 'WebApp') {
	            if (option == 'stop') {
	              thunderCalls.deactivateWeb();
	              this.tag('GridView').children[this._index].checkImage = '';
	              this.tag('GridView').children[this._index].appRunning = false;
	            }
	            else if (option == 'suspend') {
	              thunderCalls.suspendWeb();
	              this.tag('GridView').children[this._index].checkImage = 'pause';
	              this.tag('GridView').children[this._index].appRunning = false;

	            }
	          }
	          else if (applicationType == 'Cobalt') {
	            if (option == 'stop') {
	              thunderCalls.deactivateCobalt();
	              this.tag('GridView').children[this._index].checkImage = '';
	              this.tag('GridView').children[this._index].appRunning = false;
	            }
	            else if (option == 'suspend') {
	              thunderCalls.suspendCobalt();
	              this.tag('GridView').children[this._index].checkImage = 'pause';
	              this.tag('GridView').children[this._index].appRunning = false;
	            }
	          }
	          else if (applicationType == 'Lightning') {
	            if (option == 'stop') {
	              thunderCalls.deactivateLightning();
	              this.tag('GridView').children[this._index].checkImage = '';
	              this.tag('GridView').children[this._index].appRunning = false;
	            }
	            else if (option == 'suspend') {
	              thunderCalls.suspendLightning();
	              this.tag('GridView').children[this._index].checkImage = 'pause';
	              this.tag('GridView').children[this._index].appRunning = false;

	            }
	          }
	          if (option == 'resume') {
	            this.openApp();
	          }
	          this.tag('BottomMenu').visible = false;
	          this._setState('GridView');
	        }
	      }
	    ]
	  }
	}

	class App extends Lightning.Component {
	  static getFonts() {
	    return [{ family: 'Regular', url: Utils.asset('fonts/DejaVuSans.ttf') }, 
	    { family: 'Bold', url: Utils.asset('fonts/DejaVuSans-Bold.ttf') }]
	  }

	  static _template() {
	    return {
	      FullScreen: {
	        w: Screen.width,
	        h: Screen.height,
	        rect: true,
	        color: 0xff292929,
	        AppList: {
	          type: ContentContainer,
	          w: Screen.width,
	          h: Screen.height - Screen.navBarHeight,
	          x: 0,
	          y: Screen.navBarHeight
	        },
	        alpha: 1
	      },
	    }
	  }

	  _init() {
	    Log.info('Firebolt App');
	    this._setState('AppList');
	  }

	  static _states() {
	    return [
	      class AppList extends this {
	        _getFocused() {
	          return this.tag('FullScreen.AppList')
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
