/**
 * App version: 1.0.0
 * SDK version: 2.2.0
 * CLI version: 1.7.4
 *
 * Generated: Mon, 10 Aug 2020 16:08:35 GMT
 */

var APP_diagnostics = (function () {
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

	class Utils$1 {
	  static get textColor() {
	    return 0xffffffff
	  }
	  static get greyColor() {
	    return 0xffbababa
	  }
	  static get charcoalGreyColor() {
	    return 0xff303030
	  }
	  static get xfinityBlueColor() {
	    return 0xff2b9cd8
	  }
	  static get almostBlackColor() {
	    return 0x26ffffff
	  }
	  static get transparentColor() {
	    return 0x00ffffff
	  }
	  static get coolGreyColor() {
	    return 0xffb1b9bf
	  }
	  static get blackSolidColor() {
	    return 0xff000000
	  }
	  static get coolGrey1Color() {
	    return 0xfffbfcfc
	  }
	  static get coolGrey5Color() {
	    return 0xffe6eaed
	  }
	  static get coolGrey9Color() {
	    return 0xff9ba4aa
	  }
	  static get coolGrey11Color() {
	    return 0xff646a70
	  }
	  static get placeHolderWrapText() {
	    return 'PlaceHolder Text For Wrap'
	  }
	  static get placeholderLoading() {
	    return 'loading...'
	  }
	  static get placeholderError() {
	    return 'error!'
	  }
	  static get placeholderNA() {
	    return 'n/a'
	  }
	}

	class Toast extends Lightning.Component {
	  static _template() {
	    return {
	      mount: 0.5,
	      x: 960,
	      y: 540,
	      w: 300,
	      h: 100,
	      rect: true,
	      pivot: 0.5,
	      color: Utils$1.blackSolidColor,
	    }
	  }

	  show() {
	    this.animation({
	      duration: 0.3,
	      actions: [
	        {
	          p: 'alpha',
	          v: {
	            0: 0,
	            1: 1,
	          },
	        },
	        {
	          p: 'scale',
	          v: {
	            0: 0,
	            1: 1,
	          },
	        },
	      ],
	    }).start();
	  }
	}

	class TabView extends Lightning.Component {
	  static _template() {
	    return {
	      h: 55,
	      text: {
	        fontFace: 'Regular',
	        fontSize: 25,
	        textColor: Utils$1.textColor,
	      },
	      BotSeparator: {
	        rect: true,
	        w: w => w,
	        y: y => y - 1,
	        h: 1,
	        color: Utils$1.greyColor,
	      },
	      Line: {
	        rect: true,
	        w: w => w,
	        y: y => y - 5,
	        h: 5,
	        color: Utils$1.xfinityBlueColor,
	      },
	    }
	  }

	  get name() {
	    return this.text
	  }

	  set name(name) {
	    this.text = name;
	  }

	  get highlighted() {
	    return this.tag('Line').visible
	  }

	  set highlighted(highlighted) {
	    this.tag('Line').visible = highlighted;
	  }
	}

	const scrollDuration = 0.2;

	class HScrollList extends Lightning.Component {
	  static _template() {
	    return {
	      clipping: true,
	      Content: {
	        flex: { direction: 'row' },
	        h: h => h,
	      },
	    }
	  }

	  _init() {
	    this.index = 0;
	  }

	  get content() {
	    return this.tag('Content')
	  }

	  left() {
	    if (this.index > 0) {
	      --this.index;
	      this._scroll();
	    }
	  }

	  right() {
	    if (this.index < this.content.childList.length - 1) {
	      ++this.index;
	      this._scroll();
	    }
	  }

	  _scroll() {
	    this.content
	      .animation({
	        duration: scrollDuration,
	        actions: [
	          {
	            p: 'x',
	            v: {
	              0: this.content.x,
	              1: -this.content.childList.getAt(this.index).finalX,
	            },
	          },
	        ],
	      })
	      .start();
	  }
	}

	class TabContainer extends Lightning.Component {
	  static _template() {
	    return {
	      Header: {
	        mountX: 0.5,
	        x: w => w / 2,
	        h: 55,
	        flex: { direction: 'row' },
	      },
	      HScroll: {
	        type: HScrollList,
	        y: 65,
	        w: w => w,
	        h: h => h - 65,
	      },
	    }
	  }

	  _init() {
	    this.index = 0;
	    this.numTabs = 0;
	    this.$setState('Navigation');
	  }

	  $setState(state) {
	    this._setState(state);
	  }

	  addTab(name, type) {
	    this.tag('Header').childList.a({
	      ref: 'Title-' + this.numTabs,
	      type: TabView,
	      name: name,
	      highlighted: !this.numTabs,
	      flexItem: { marginLeft: 20, marginRight: 20 },
	    });
	    this.tag('HScroll').content.childList.a({
	      ref: 'Tab-' + this.numTabs,
	      type: type,
	      w: this.tag('HScroll').finalW,
	      h: h => h,
	    });
	    ++this.numTabs;
	  }

	  static _states() {
	    return [
	      class Navigation extends this {
	        _getFocused() {
	          return this.tag(`HScroll.Tab-${this.index}`)
	        }
	        $enter() {
	          if (this.index >= 0 && this.index < this.numTabs) {
	            this.tag(`Title-${this.index}`).highlighted = true;
	          }
	        }
	        $exit() {
	          if (this.index >= 0 && this.index < this.numTabs) {
	            this.tag(`Title-${this.index}`).highlighted = false;
	          }
	        }
	        $handleLeft() {
	          this._handleLeft();
	        }
	        $handleRight() {
	          this._handleRight();
	        }
	        _handleLeft() {
	          if (this.index > 0) {
	            this.tag(`Title-${this.index}`).highlighted = false;
	            this.index = this.index - 1;
	            this.tag(`Title-${this.index}`).highlighted = true;
	            this.tag('HScroll').left();
	          }
	        }
	        _handleRight() {
	          if (this.index < this.numTabs - 1) {
	            this.tag(`Title-${this.index}`).highlighted = false;
	            this.index = this.index + 1;
	            this.tag(`Title-${this.index}`).highlighted = true;
	            this.tag('HScroll').right();
	          }
	        }
	      },
	    ]
	  }
	}

	const separatorLine = 2; // TODO why 1 not visible
	const keyFontSize = 12;
	const valueFontSize = 12;
	const valueMargin = 5;

	class DetailsItemRow extends Lightning.Component {
	  static _template() {
	    return {
	      flex: { direction: 'row' },
	      h: 25, // TODO: how remove this
	      Item1: {
	        flexItem: { grow: 2 },
	        rect: true,
	        Key: {
	          mount: 0.5,
	          x: w => w / 2,
	          y: h => h / 2,
	          text: {
	            fontFace: 'Bold',
	            fontSize: keyFontSize,
	            textColor: Utils$1.charcoalGreyColor,
	            textAlign: 'center',
	          },
	        },
	      },
	      Item2: {
	        rect: true,
	        w: separatorLine,
	      },
	      Item3: {
	        flexItem: { grow: 3 },
	        rect: true,
	        Value: {
	          mountY: 0.5,
	          x: valueMargin,
	          y: h => h / 2,
	          text: {
	            fontFace: 'Regular',
	            fontSize: valueFontSize,
	            textColor: Utils$1.blackSolidColor,
	            wordWrap: true,
	          },
	        },
	      },
	    }
	  }

	  set key(text) {
	    this.tag('Key').text = text;
	  }

	  set value(text) {
	    this.tag('Value').text = text;
	  }

	  set odd(odd) {
	    this.tag('Item1').color = this.tag('Item3').color = odd ? 0xffe8e8e8 : 0xffd1d1d1;
	    this.tag('Item2').color = odd ? 0xffd1d1d1 : 0xffe8e8e8;
	  }
	}

	const lineMargin = 20;
	const titleFontSize = 18;

	class DetailsItem extends Lightning.Component {
	  static _template() {
	    let t = {
	      flex: { direction: 'column' },
	      rect: true,
	      color: Utils$1.greyColor,
	      Row0: {
	        flex: { direction: 'row' },
	        Header: {
	          flexItem: { grow: 1 },
	          h: 35,
	          rect: true,
	          color: Utils$1.xfinityBlueColor,
	          Title: {
	            mount: 0.5,
	            x: w => w / 2,
	            y: h => h / 2,
	            text: {
	              fontFace: 'Bold',
	              fontSize: titleFontSize,
	              textColor: Utils$1.charcoalGreyColor,
	            },
	          },
	        },
	      },
	      Columns: {
	        flex: { direction: 'row' },
	        flexItem: { margin: lineMargin },
	        w: w => w - 2 * lineMargin,
	        Left: {
	          flex: { direction: 'column' },
	          w: w => w,
	        },
	        Right: {
	          flex: { direction: 'column' },
	          w: 0,
	        },
	      },
	    };
	    let rt = this._rowsTemplate();
	    rt.forEach((v, i) => (v.odd = i % 2));
	    rt.forEach(v => (v.type = DetailsItemRow));
	    rt.forEach(v => (v.flexItem = { marginTop: v.separator ? lineMargin : 0 }));
	    rt.forEach((v, i) => {
	      if (v.left || v.right) {
	        t.Columns.Left.w = w => (w - lineMargin) / 2;
	        t.Columns.Right.w = w => (w - lineMargin) / 2;
	        t.Columns.Right.flexItem = { marginLeft: lineMargin };
	      }
	      t.Columns[v.right ? 'Right' : 'Left'][`Row${i}`] = v;
	    });
	    return t
	  }

	  static _rowsTemplate() {
	    return []
	  }

	  get rows() {
	    return this.tag('Left').children.concat(this.tag('Right').children)
	  }

	  get title() {
	    return this.tag('Title').text
	  }

	  set title(title) {
	    this.tag('Title').text = title;
	  }
	}

	const tr69Url = 'http://127.0.0.1:10999';
	const tr69NameRegex = /\w+\.\w+/;

	class Tr69 {
	  constructor() {
	    console.log('Tr69 constructor');
	  }

	  loadData(list, debug = false) {
	    return new Promise((resolve, reject) => {
	      list = list.filter(s => tr69NameRegex.test(s));
	      let result = {};
	      if (!list.length) resolve(result);
	      else {
	        const xhr = new XMLHttpRequest();
	        xhr.open('POST', tr69Url, true);
	        xhr.setRequestHeader('Content-Type', 'application/json');
	        xhr.onerror = reject;
	        xhr.onreadystatechange = () => {
	          if (xhr.readyState === XMLHttpRequest.DONE) {
	            if (xhr.status === 200) {
	              JSON.parse(xhr.responseText).paramList.forEach(o => (result[o.name] = o.value));
	              if (debug) console.log(`RESP: ${JSON.stringify(result)}`);
	              resolve(result);
	            } else {
	              reject(xhr.status);
	            }
	          }
	        };
	        let body = { paramList: list.map(x => ({ name: x })) };
	        if (debug) console.log(`REQ: ${JSON.stringify(body)}`);
	        xhr.send(JSON.stringify(body));
	      }
	    })
	  }
	}

	const DeviceDiagnosticsCallsign = 'org.rdk.DeviceDiagnostics';

	const thunderConfig = {
	  host: '127.0.0.1',
	  port: 9998,
	  default: 1,
	};

	class DeviceDiagnostics {
	  constructor() {
	    console.log('DeviceDiagnostics constructor');
	  }

	  activate(debug) {
	    return new Promise((resolve, reject) => {
	      this._thunder = thunderJS(Object.assign({ debug: debug }, thunderConfig));
	      this._thunder
	        .call('Controller', 'activate', { callsign: DeviceDiagnosticsCallsign })
	        .then(result => {
	          console.log('DeviceDiagnostics activated', result);
	          resolve();
	        })
	        .catch(err => {
	          console.error('DeviceDiagnostics activation failed', err);
	          reject();
	        });
	    })
	  }

	  getConfiguration(names) {
	    return new Promise((resolve, reject) => {
	      this._thunder
	        .call(DeviceDiagnosticsCallsign, 'getConfiguration', {
	          names: names,
	        })
	        .then(result => {
	          console.log(JSON.stringify(result));
	          if (result.success)
	            resolve(
	              result.paramList.reduce((map, obj) => {
	                map[obj.name] = obj.value;
	                return map
	              }, {})
	            );
	          else reject();
	        })
	        .catch(err => {
	          console.error('Error', err);
	          reject();
	        });
	    })
	  }
	}

	const tr69 = new Tr69();
	const deviceDiagnostics = new DeviceDiagnostics();
	let globalProvider = null;

	class StatusView extends DetailsItem {
	  get provider() {
	    if (!globalProvider) {
	      let debug = this.stage.root.getOption('debug');
	      {
	        let activate = deviceDiagnostics.activate(debug);
	        globalProvider = names => activate.then(() => deviceDiagnostics.getConfiguration(names));
	      }
	    }
	    return globalProvider
	  }

	  refresh() {
	    let rows = this.rows.filter(r => /\w+\.\w+/.test(r.ref));
	    if (rows.length) {
	      let names = rows.map(r => r.ref);
	      rows.forEach(r => (r.value = Utils$1.placeholderLoading));
	      return this.provider(names).then(
	        map => {
	          rows.forEach(r => {
	            if (r.ref in map) {
	              r.value = String(map[r.ref]);
	            } else {
	              r.value = Utils$1.placeholderNA;
	            }
	          });
	        },
	        e => {
	          console.log('Err', e);
	          rows.forEach(r => (r.value = Utils$1.placeholderError));
	        }
	      )
	    }
	  }
	}

	const modelMakeMap = {
	  PX013AN: 'Pace XG1v3',
	  PX022AN: 'Pace XG2v2',
	  PX001AN: 'Pace XG1v1',
	  PXD01ANI: 'Pace XiD',
	  PX032ANI: 'Pace Xi3v2',
	  PX051AEI: 'Pace Xi5',
	  AX061AEI: 'Arris Xi6',
	  AX014AN: 'Arris XG1v4',
	  AX013AN: 'Arris XG1v3',
	  MX011AN: 'Arris XG1v1',
	  SX022AN: 'Samsung XG2v2',
	  CXD01ANI: 'Cisco XiD',
	  CS011AN: 'Cisco G8',
	  PR150BN: 'Pace RNG150',
	  SR150BN: 'Samsung RNG150',
	};

	class DeviceStatus extends StatusView {
	  static _rowsTemplate() {
	    let list = [
	      {
	        key: 'Make',
	        value: modelMakeMap[Object.keys(modelMakeMap).find(k => Utils$1.modelName.indexOf(k) !== -1)],
	      },
	      {
	        key: 'Model',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.ModelName',
	      },
	      {
	        key: 'Serial Number',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.SerialNumber',
	      },
	      {
	        key: 'eSTB Mac (Device/Mgmt)',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.X_COMCAST-COM_STB_MAC',
	      },
	    ];
	    if (Utils$1.isClientDevice) {
	      if (Utils$1.isClientNoMocaDevice) {
	        list = list.concat([
	          {
	            key: 'WiFi Mac',
	            value: 'TODO',
	            ref: 'Device.WiFi.SSID.1.MACAddress',
	          },
	          {
	            key: 'Ethernet Mac',
	            value: 'TODO',
	            ref: 'Device.Ethernet.Interface.1.MACAddress',
	          },
	        ]);
	      } else {
	        list = list.concat([
	          {
	            key: 'MoCA Mac',
	            value: 'TODO',
	            ref: 'Device.MoCA.Interface.1.MACAddress',
	          },
	        ]);
	      }
	    }
	    list = list.concat([
	      {
	        key: 'Receiver ID',
	        value: Utils$1.placeHolderWrapText,
	        ref: 'Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreReceiverId',
	        separator: true,
	      },
	      {
	        key: 'HW Rev',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.HardwareVersion',
	      },
	      {
	        key: 'Uptime',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.UpTime',
	      },
	      {
	        key: 'Power Status',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.X_COMCAST-COM_PowerStatus',
	      },
	      {
	        key: 'Boot Status',
	        value: 'XRE connection established - successful',
	        ref: 'Device.DeviceInfo.X_RDKCENTRAL-COM.BootStatus',
	      },
	    ]);
	    return list
	  }
	}

	class NetworkConnection extends StatusView {
	  static _rowsTemplate() {
	    let list = [
	      {
	        key: 'eSTB IP',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.X_COMCAST-COM_STB_IP',
	      },
	    ];
	    if (!Utils$1.isClientNoMocaDevice) {
	      list = list.concat([
	        {
	          key: 'MoCA Status',
	          value: 'TODO',
	          ref: 'Device.MoCA.Interface.1.Status',
	        },
	        {
	          key: '# of Connected Devices',
	          value: 'TODO',
	          ref: 'Device.MoCA.Interface.1.AssociatedDeviceNumberOfEntries',
	        },
	        {
	          key: 'Node ID',
	          value: 'TODO',
	          ref: 'Device.MoCA.Interface.1.NodeID',
	        },
	        {
	          key: 'NC Name',
	          value: 'TODO',
	          ref: 'Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewayDeviceFriendlyName',
	        },
	        {
	          key: 'NC MoCA MAC',
	          value: 'TODO',
	          ref: 'Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC',
	        },
	        {
	          key: 'NC Tx Rate',
	          value: 'TODO',
	          ref: 'Device.MoCA.Interface.1.AssociatedDevice.1.PHYTxRate',
	        },
	        {
	          key: 'NC Rx Rate',
	          value: 'TODO',
	          ref: 'Device.MoCA.Interface.1.AssociatedDevice.1.PHYRxRate',
	        },
	      ]);
	    }
	    if (Utils$1.isClientDevice) {
	      if (Utils$1.isClientNoMocaDevice) {
	        list = list.concat([
	          // TODO: implement
	          /*{
	            key: 'Ethernet Status',
	            value: 'TODO',
	          },
	          {
	            key: 'Ethernet LinkLocal IPv4',
	            value: 'TODO',
	          },
	          {
	            key: 'Ethernet DHCP IPv4',
	            value: 'TODO',
	          },
	          {
	            key: 'Ethernet LinkLocal IPv6',
	            value: 'TODO',
	          },
	          {
	            key: 'Ethernet GloballyUnique IPv6',
	            value: 'TODO',
	          },*/
	          {
	            key: 'WiFi Status',
	            value: 'TODO',
	            ref: 'Device.WiFi.SSID.1.Status',
	          },
	          // TODO: implement
	          /*{
	            key: 'WiFi LinkLocal IPv4',
	            value: 'TODO',
	          },
	          {
	            key: 'WiFi DHCP IPv4',
	            value: 'TODO',
	          },
	          {
	            key: 'WiFi LinkLocal IPv6',
	            value: 'TODO',
	          },
	          {
	            key: 'WiFi GloballyUnique IPv6',
	            value: 'TODO',
	          },*/
	        ]);
	      }
	      list = list.concat([
	        // TODO: implement
	        /*{
	          key: 'Hub Connection Status',
	          value: 'TODO',
	          separator: true,
	        },*/
	        {
	          key: 'Allocated Tuner Number',
	          value: 'TODO',
	          ref: 'Device.X_COMCAST-COM_Xcalibur.TRM.trmTunerNumber',
	        },
	      ]);
	    }
	    return list
	  }
	}

	class FirmwareStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'Running',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.X_COMCAST-COM_FirmwareFilename',
	      },
	      {
	        key: 'Last Download Version',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.X_RDKCENTRAL-COM_FirmwareFilename',
	      },
	      {
	        key: 'Download Status',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.X_COMCAST-COM_FirmwareDownloadStatus',
	      },
	      {
	        key: 'Boot Status',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.X_RDKCENTRAL-COM.BootStatus',
	      },
	    ]
	  }
	}

	class XreStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'XRE Server Version',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreVersion',
	      },
	      {
	        key: 'Last XRE Reconnect Date/Time',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreSessionLastModTs',
	      },
	      {
	        key: 'XRE Connection Status',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreStatus',
	      },
	      {
	        key: 'XRE Connection Uptime',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreSessionUptime',
	      },
	      {
	        key: 'XRE VOD ID',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreVodId',
	      },
	      {
	        key: 'XRE Last URL',
	        value:
	          'https://nexus.teamccp.com/nexus/content/repositories/arris_brcm_xg1v3/images/signing_stage/ARRISXG1V3-Yocto-Build/76112/signed/',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreLastURLAccessed',
	      },
	    ]
	  }
	}

	class TunerStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'TRM eSTB MAC',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC',
	        left: true,
	      },
	      {
	        key: 'TRM MoCA MAC',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewayMoCAMAC',
	        left: true,
	      },
	    ]
	  }
	}

	class MemoryStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'SD Card Health',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.Status',
	        left: true,
	      },
	      {
	        key: 'TSB Enable Status',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.TSBQualified',
	        left: true,
	      },
	      {
	        key: 'SD Write Enable',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.ReadOnly',
	        left: true,
	      },
	      {
	        key: 'Life Elapsed',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.LifeElapsed',
	        left: true,
	      },
	      {
	        key: 'Capacity',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.Capacity',
	        right: true,
	      },
	      {
	        key: 'Card Failed',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.CardFailed',
	        right: true,
	      },
	    ]
	  }
	}

	class InitHistoryStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'Init History Status',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.Client.XRE.InitHistoryStatus',
	      },
	    ]
	  }
	}

	class HostTru2WayStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'Hardware Revision',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.HardwareVersion',
	      },
	      {
	        key: 'Vendor',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.Manufacturer',
	      },
	      {
	        key: 'Software Revision',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.SoftwareVersion',
	      },
	      {
	        key: 'Model',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.ModelName',
	      },
	    ]
	  }
	}

	class HostPropertiesStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'Serial Number',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.SerialNumber',
	      },
	      {
	        key: 'Model Name',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.ModelName',
	      },
	      {
	        key: 'Vendor Name',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.Manufacturer',
	      },
	      {
	        key: 'Total Memory',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.MemoryStatus.Total',
	      },
	    ]
	  }
	}

	class CableCardStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'Uptime',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.UpTime',
	      },
	      {
	        key: 'Manufacturer',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.Manufacturer',
	      },
	      {
	        key: 'Time Zone',
	        value: 'TODO',
	        ref: 'Device.Time.LocalTimeZone',
	      },
	    ]
	  }
	}

	class MCardCertificateStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Host ID',
	        value: 'TODO',
	      },
	      {
	        key: 'Certificate Available',
	        value: 'TODO',
	      },
	      {
	        key: 'Certificate Valid',
	        value: 'TODO',
	      },
	      {
	        key: 'Verified with Chain',
	        value: 'TODO',
	      },
	      {
	        key: 'Production Key',
	        value: 'TODO',
	      },*/
	      {
	        key: 'DeviceCertSubjectName',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.UpTime',
	      },
	      {
	        key: 'DeviceCertIssuerName',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.Manufacturer',
	      },
	      // TODO: implement
	      /*{
	        key: 'ManufacturerCertSubjectName',
	        value: 'TODO',
	      },
	      {
	        key: 'ManufacturerCertIssuerName',
	        value: 'TODO',
	      },*/
	    ]
	  }
	}

	class WifiStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'AP MAC',
	        value: 'TODO',
	        ref: 'Device.WiFi.SSID.1.MACAddress',
	      },
	      {
	        key: 'SSID',
	        value: 'TODO',
	        ref: 'Device.WiFi.SSID.1.Name',
	      },
	      {
	        key: 'Frequency',
	        value: 'TODO',
	        ref: 'Device.WiFi.Radio.1.OperatingFrequencyBand',
	      },
	      // TODO: implement
	      /*{
	        key: 'Channel',
	        value: 'TODO',
	      },
	      {
	        key: 'SNR',
	        value: 'TODO',
	      },*/
	      {
	        key: 'RSSI',
	        value: 'TODO',
	        ref: 'Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.DeviceInfo.RSSI',
	      },
	      // TODO: implement
	      /*{
	        key: 'Security',
	        value: 'TODO',
	      },*/
	    ]
	  }
	}

	const scrollDuration$1 = 0.2;

	class VScrollList extends Lightning.Component {
	  static _template() {
	    return {
	      flex: { direction: 'column', padding: 0 },
	    }
	  }

	  get scrollIndex() {
	    if (this._scrollIndex === undefined) this._scrollIndex = 0;
	    return this._scrollIndex
	  }

	  set scrollIndex(val) {
	    this._scrollIndex = val;
	  }

	  _handleUp() {
	    if (this.scrollIndex > 0) {
	      --this.scrollIndex;
	      this.updateScroll();
	    }
	  }

	  _handleDown() {
	    if (this.scrollIndex < this.childList.length - 1) {
	      ++this.scrollIndex;
	      this.updateScroll();
	    }
	  }

	  _handleLeft() {
	    this.fireAncestors('$handleLeft');
	  }

	  _handleRight() {
	    this.fireAncestors('$handleRight');
	  }

	  updateScroll() {
	    this.animation({
	      duration: scrollDuration$1,
	      actions: [
	        {
	          p: 'y',
	          v: {
	            0: this.y,
	            1: -this.childList.getAt(this.scrollIndex).finalY + this.flex.padding,
	          },
	        },
	      ],
	    }).start();
	  }
	}

	const gridLine = 2; // TODO why 1 not visible

	class InstallSummaryView extends Lightning.Component {
	  static _template() {
	    const t = {
	      clipping: true,
	      Content: {
	        type: VScrollList,
	        flex: { direction: 'column', padding: gridLine },
	        w: w => w - 2 * gridLine,
	        rect: true,
	        color: Utils$1.blackSolidColor,
	        Row1: {
	          w: w => w - 2 * gridLine,
	          flex: { direction: 'row' },
	          Item1: {
	            w: w => (w - gridLine) / 2,
	            type: DeviceStatus,
	            title: 'Device Status',
	          },
	          Item2: {
	            flexItem: { marginLeft: gridLine },
	            w: w => (w - gridLine) / 2,
	            type: NetworkConnection,
	            title: 'Network Connection',
	          },
	        },
	        Row2: {
	          w: w => w - 2 * gridLine,
	          flex: { direction: 'row' },
	          flexItem: { marginTop: gridLine },
	          Item3: {
	            w: w => (w - gridLine) / 2,
	            type: FirmwareStatus,
	            title: 'Firmware',
	          },
	          Item4: {
	            flexItem: { marginLeft: gridLine },
	            w: w => (w - gridLine) / 2,
	            type: XreStatus,
	            title: 'XRE',
	          },
	        },
	        Row3: {
	          w: w => w - 2 * gridLine,
	          flex: { direction: 'row' },
	          flexItem: { marginTop: gridLine },
	          Item5: {
	            w: w => (w - gridLine) / 2,
	            type: TunerStatus,
	            title: 'Tuner Status',
	          },
	          Item6: {
	            flexItem: { marginLeft: gridLine },
	            w: w => (w - gridLine) / 2,
	            type: MemoryStatus,
	            title: 'Memory',
	          },
	        },
	      },
	    };
	    if (Utils$1.isClientNoMocaDevice) {
	      t.Content.Row4 = {
	        w: w => w - 2 * gridLine,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine },
	        Item7: {
	          w: w => w,
	          type: WifiStatus,
	          title: 'WIFI Stats',
	        },
	      };
	    }
	    if (!Utils$1.isClientDevice) {
	      t.Content.Row5 = {
	        w: w => w - 2 * gridLine,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine },
	        Item8: {
	          w: w => (w - gridLine) / 2,
	          type: InitHistoryStatus,
	          title: 'Init History',
	        },
	        Item9: {
	          flexItem: { marginLeft: gridLine },
	          w: w => (w - gridLine) / 2,
	          type: HostTru2WayStatus,
	          title: 'Host: Tru2Way',
	        },
	      };
	      t.Content.Row6 = {
	        w: w => w - 2 * gridLine,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine },
	        Item10: {
	          w: w => (w - gridLine) / 2,
	          type: HostPropertiesStatus,
	          title: 'Host: Properties',
	        },
	        Item11: {
	          flexItem: { marginLeft: gridLine },
	          w: w => (w - gridLine) / 2,
	          type: CableCardStatus,
	          title: 'Cable Card',
	        },
	      };
	      t.Content.Row7 = {
	        w: w => w - 2 * gridLine,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine },
	        Item12: {
	          w: w => w,
	          type: MCardCertificateStatus,
	          title: 'M-Card Certificate',
	        },
	      };
	    }
	    return t
	  }

	  _init() {
	    this.refresh();
	  }

	  refresh() {
	    for (let i = 1; i <= 12; i++) {
	      if (this.tag(`Content.Item${i}`)) this.tag(`Content.Item${i}`).refresh();
	    }
	  }

	  _getFocused() {
	    return this.tag('Content')
	  }
	}

	class DeviceLocalStatus extends StatusView {
	  static _rowsTemplate() {
	    let list;
	    if (Utils$1.isClientDevice) {
	      if (Utils$1.isClientNoMocaDevice) {
	        list = [
	          {
	            key: 'WiFi Status',
	            value: 'TODO',
	            ref: 'Device.WiFi.SSID.1.Status',
	          },
	          {
	            key: 'WiFi MAC',
	            value: 'TODO',
	            ref: 'Device.WiFi.SSID.1.MACAddress',
	          },
	          {
	            key: 'SSID',
	            value: 'TODO',
	            ref: 'Device.WiFi.SSID.1.Name',
	          },
	          {
	            key: 'Frequency',
	            value: 'TODO',
	            ref: 'Device.WiFi.Radio.1.OperatingFrequencyBand',
	          },
	          {
	            key: 'Channel',
	            value: 'TODO',
	            ref: 'Device.WiFi.Radio.1.Channel',
	          },
	          {
	            key: 'RSSI',
	            value: 'TODO',
	            ref: 'Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.DeviceInfo.RSSI',
	          },
	          {
	            key: 'Security',
	            value: 'TODO',
	            ref: 'Device.WiFi.AccessPoint.1.Security.ModeEnabled',
	          },
	          // TODO: implement
	          /*{
	            key: 'Device',
	            value: 'MAC',
	            separator: true,
	          },*/
	        ];
	      } else {
	        list = [
	          // TODO: implement
	          /*{
	            key: 'Device',
	            value: 'MAC',
	          },*/
	        ];
	      }

	      list = list.concat([
	        {
	          key: 'eSTB',
	          value: 'TODO',
	          ref: 'Device.DeviceInfo.X_COMCAST-COM_STB_MAC',
	        },
	        {
	          key: 'Video Gateway MAC',
	          value: 'TODO',
	          ref: 'Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC',
	          separator: true,
	        },
	        {
	          key: 'Time Zone',
	          value: 'TODO',
	          ref: 'Device.Time.LocalTimeZone',
	        },
	        {
	          key: 'Local Time',
	          value: 'TODO',
	          ref: 'Device.Time.CurrentLocalTime',
	        },
	      ]);
	    } else {
	      list = [
	        {
	          key: 'eSTB',
	          value: 'TODO',
	          ref: 'Device.DeviceInfo.X_COMCAST-COM_STB_MAC',
	          left: true,
	        },
	        {
	          key: 'Video Gateway MAC',
	          value: 'TODO',
	          ref: 'Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC',
	          left: true,
	        },
	        {
	          key: 'Time Zone',
	          value: 'TODO',
	          ref: 'Device.Time.LocalTimeZone',
	          right: true,
	        },
	        {
	          key: 'Local Time',
	          value: 'TODO',
	          ref: 'Device.Time.CurrentLocalTime',
	          right: true,
	        },
	      ];
	    }
	    return list
	  }
	}

	class DocsisStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Downstream Center Frequency',
	        value: 'TODO',
	      },
	      {
	        key: 'Downstream Received Power',
	        value: 'TODO',
	      },
	      {
	        key: 'Downstream Carrier Lock',
	        value: 'TODO',
	      },
	      {
	        key: 'Downstream SNR',
	        value: 'TODO',
	      },*/
	      {
	        key: 'Upstream Center Frequency',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC',
	      },
	      // TODO: implement
	      /*{
	        key: 'Upstream Power',
	        value: 'TODO',
	      },
	      {
	        key: 'eCM Serial Number',
	        value: 'TODO',
	      },
	      {
	        key: 'eCM Version',
	        value: 'TODO',
	      },
	      {
	        key: 'eCM Boot Status',
	        value: 'TODO',
	      },
	      {
	        key: 'eCM Boot File',
	        value: 'TODO',
	      },
	      {
	        key: 'CM Status',
	        value: 'TODO',
	      },*/
	    ]
	  }
	}

	class DocsisLevelsStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Downstream Center Frequency',
	        value: 'TODO',
	      },
	      {
	        key: 'Downstream Rcvd Power',
	        value: 'TODO',
	      },
	      {
	        key: 'Downstream Carrier Lock',
	        value: 'TODO',
	      },
	      {
	        key: 'Downstream SNR',
	        value: 'TODO',
	      },*/
	      {
	        key: 'Upstream Center Frequency',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC',
	      },
	      // TODO: implement
	      /*{
	        key: 'Upstream Power',
	        value: 'TODO',
	      },
	      {
	        key: 'DSG Status',
	        value: 'TODO',
	      },
	      {
	        key: 'CM Status',
	        value: 'TODO',
	      },*/
	    ]
	  }
	}

	class InBandNetworkStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Tuner',
	        value: 'Frequency(hertz)',
	      },
	      {
	        key: 'Tuner-1',
	        value: 'TODO',
	      },
	      {
	        key: 'Tuner-2',
	        value: 'TODO',
	      },
	      {
	        key: 'Tuner-3',
	        value: 'TODO',
	      },
	      {
	        key: 'Tuner-4',
	        value: 'TODO',
	      },
	      {
	        key: 'Tuner-5',
	        value: 'TODO',
	      },
	      {
	        key: 'Tuner-6',
	        value: 'TODO',
	      },*/
	    ]
	  }
	}

	class ErrorsNetworkStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Application Signaling',
	        value: 'unknown',
	      },
	      {
	        key: 'Timeouts',
	        value: 'TODO',
	      },
	      {
	        key: 'PAT',
	        value: '0',
	      },
	      {
	        key: 'PMT',
	        value: '0',
	      },
	      {
	        key: 'IB OC',
	        value: '0',
	      },
	      {
	        key: 'OOB OC',
	        value: '0',
	      },
	      {
	        key: 'Tuner',
	        value: 'Failed Tune Count',
	        separator: true,
	      },
	      {
	        key: 'Tuner-1',
	        value: '0',
	      },
	      {
	        key: 'Tuner-2',
	        value: '0',
	      },
	      {
	        key: 'Tuner-3',
	        value: '0',
	      },
	      {
	        key: 'Tuner-4',
	        value: '0',
	      },
	      {
	        key: 'Tuner-5',
	        value: '0',
	      },
	      {
	        key: 'Tuner-6',
	        value: '0',
	      },*/
	    ]
	  }
	}

	class FlowsInUseStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'MPEG',
	        value: '21333',
	      },
	      {
	        key: 'IPU',
	        value: '0',
	      },
	      {
	        key: 'IPM',
	        value: '0',
	      },
	      {
	        key: 'DSG',
	        value: '0',
	      },
	      {
	        key: 'Socket',
	        value: '0',
	      },*/
	    ]
	  }
	}

	class DsgStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'ADV DSG',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Host EDC Ver',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'DSG Flow Status',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'DSG Mode',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'CA Tunnel',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Br. Tunnel',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Device',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Filters',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'Rate Current',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'Rate Top',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'Reportback Status',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'CC MAC Addr',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'IP_U Address',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'RB Flow Status',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'RADD Addr Status',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'Auto Reg. Status',
	        value: 'TODO',
	        right: true,
	      },*/
	    ]
	  }
	}

	class TunnelInfoScreenStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Tunnel ID 1',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'MAC Addr 1',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Src IP/Mask 1',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Dest. IP 1',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'UDP Port Range 1',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'UCIDs',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Tunnel ID 2',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'MAC Addr 2',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'Src IP/Mask 2',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'Dest. IP 2',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'UDP Port Range 2',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'UCIDs',
	        value: 'TODO',
	        right: true,
	      },*/
	    ]
	  }
	}

	class McardCahnStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'CANH Status',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'CANH Protocol Version',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'MCARD',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'IPPV Protocol Version',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'MCARD',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'OOB ID',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'CANH SAS Msgs Rcvd',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'IPPV SAS Msgs Rcvd',
	        value: 'TODO',
	        right: true,
	      },*/
	    ]
	  }
	}

	class CanhStatus2 extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'CANH API',
	        value: 'TODO',
	      },
	      {
	        key: 'Rev',
	        value: 'TODO',
	      },
	      {
	        key: 'CANH State',
	        value: 'TODO',
	      },
	      {
	        key: 'UnitAddress',
	        value: 'TODO',
	      },
	      {
	        key: 'Host_ID',
	        value: 'TODO',
	      },
	      {
	        key: 'Validation State',
	        value: 'TODO',
	      },
	      {
	        key: 'Connected',
	        value: 'TODO',
	      },
	      {
	        key: 'OOB_ID',
	        value: 'TODO',
	      },
	      {
	        key: 'VCT_ID',
	        value: 'TODO',
	      },*/
	    ]
	  }
	}

	class CanhStatus3 extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Listeners',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'SUB',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Pending Purchases',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Pass-Thru Msgs',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Rcvd',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Pass-Thru Filters',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'Destination IP',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'OOB_ID Rcvd',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'STB IP Addr Rcvd',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'UnitAddress Rcvd',
	        value: 'TODO',
	        right: true,
	      },*/
	    ]
	  }
	}

	class CanhStatus4 extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Prgind',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Prgind',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'Auth',
	        value: 'TODO',
	        left: true,
	      },
	      {
	        key: 'EID',
	        value: 'TODO',
	        right: true,
	      },
	      {
	        key: 'Prgind',
	        value: 'TODO',
	        right: true,
	      },*/
	    ]
	  }
	}

	class CanhStatus5 extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Prgind',
	        value: 'TODO',
	      },
	      {
	        key: 'Prgind',
	        value: 'TODO',
	      },
	      {
	        key: 'Prgind',
	        value: 'TODO',
	      },
	      {
	        key: 'Prgind',
	        value: 'TODO',
	      },*/
	    ]
	  }
	}

	class CanhStatus6 extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Status',
	        value: 'TODO',
	      },
	      {
	        key: 'No errors',
	        value: 'TODO',
	      },
	      {
	        key: 'Pending Purchase List in Hex',
	        value: 'TODO',
	      },
	      {
	        key: 'None',
	        value: 'TODO',
	      },*/
	    ]
	  }
	}

	class OperationalStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      // TODO: implement
	      /*{
	        key: 'Param',
	        value: 'OK',
	      },
	      {
	        key: 'eSTB IP',
	        value: 'OK',
	      },
	      {
	        key: 'eCM IP',
	        value: 'OK',
	      },
	      {
	        key: 'Card Return Path',
	        value: 'OK',
	      },
	      {
	        key: 'Local Time',
	        value: 'OK',
	      },
	      {
	        key: 'CA System',
	        value: 'OK',
	      },
	      {
	        key: 'CP System',
	        value: 'OK',
	      },
	      {
	        key: 'DSG/Card VCT-Id',
	        value: 'OK',
	      },
	      {
	        key: 'DSG UCID',
	        value: 'OK',
	      },
	      {
	        key: 'DSG Status',
	        value: 'OK',
	      },
	      {
	        key: 'CM Status',
	        value: 'OK',
	      },
	      {
	        key: 'Channel Map',
	        value: 'OK',
	      },*/
	    ]
	  }
	}

	const gridLine$1 = 2; // TODO why 1 not visible

	class NetworkConnectionsView extends Lightning.Component {
	  static _template() {
	    const t = {
	      clipping: true,
	      Content: {
	        type: VScrollList,
	        flex: { direction: 'column', padding: gridLine$1 },
	        w: w => w - 2 * gridLine$1,
	        rect: true,
	        color: Utils$1.blackSolidColor,
	        Row1: {
	          w: w => w - 2 * gridLine$1,
	          flex: { direction: 'row' },
	          Item1: {
	            w: w => (w - gridLine$1) / 2,
	            type: DeviceLocalStatus,
	            title: 'Device Local',
	          },
	          Item2: {
	            flexItem: { marginLeft: gridLine$1 },
	            w: w => (w - gridLine$1) / 2,
	            type: NetworkConnection,
	            title: 'Network Connection',
	          },
	        },
	      },
	    };
	    if (Utils$1.isClientNoMocaDevice) {
	      t.Content.Row2 = {
	        w: w => w - 2 * gridLine$1,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine$1 },
	        Item3: {
	          w: w => w,
	          type: WifiStatus,
	          title: 'WIFI Stats',
	        },
	      };
	    }
	    if (!Utils$1.isClientDevice) {
	      t.Content.Row3 = {
	        w: w => w - 2 * gridLine$1,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine$1 },
	        Item4: {
	          w: w => (w - gridLine$1) / 2,
	          type: DocsisStatus,
	          title: 'DOCSIS',
	        },
	        Item5: {
	          flexItem: { marginLeft: gridLine$1 },
	          w: w => (w - gridLine$1) / 2,
	          type: DocsisLevelsStatus,
	          title: 'DOCSIS Levels',
	        },
	      };
	      t.Content.Row4 = {
	        w: w => w - 2 * gridLine$1,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine$1 },
	        Item6: {
	          w: w => (w - gridLine$1) / 2,
	          type: InBandNetworkStatus,
	          title: 'In-Band Network',
	        },
	        Item7: {
	          flexItem: { marginLeft: gridLine$1 },
	          w: w => (w - gridLine$1) / 2,
	          type: ErrorsNetworkStatus,
	          title: 'Errors',
	        },
	      };
	      t.Content.Row5 = {
	        w: w => w - 2 * gridLine$1,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine$1 },
	        Item8: {
	          w: w => (w - gridLine$1) / 2,
	          type: FlowsInUseStatus,
	          title: 'Flows in Use',
	        },
	        Item9: {
	          flexItem: { marginLeft: gridLine$1 },
	          w: w => (w - gridLine$1) / 2,
	          type: DsgStatus,
	          title: 'DSG',
	        },
	      };
	      t.Content.Row6 = {
	        w: w => w - 2 * gridLine$1,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine$1 },
	        Item10: {
	          w: w => (w - gridLine$1) / 2,
	          type: TunnelInfoScreenStatus,
	          title: 'Tunnel Info Screen 1',
	        },
	        Item11: {
	          flexItem: { marginLeft: gridLine$1 },
	          w: w => (w - gridLine$1) / 2,
	          type: McardCahnStatus,
	          title: 'MCARD CAHN Status 1',
	        },
	      };
	      t.Content.Row7 = {
	        w: w => w - 2 * gridLine$1,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine$1 },
	        Item12: {
	          w: w => (w - gridLine$1) / 2,
	          type: CanhStatus2,
	          title: 'CANH Status 2',
	        },
	        Item13: {
	          flexItem: { marginLeft: gridLine$1 },
	          w: w => (w - gridLine$1) / 2,
	          type: CanhStatus3,
	          title: 'CANH Status 3',
	        },
	      };
	      t.Content.Row8 = {
	        w: w => w - 2 * gridLine$1,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine$1 },
	        Item14: {
	          w: w => (w - gridLine$1) / 2,
	          type: CanhStatus4,
	          title: 'CANH Status 4',
	        },
	        Item15: {
	          flexItem: { marginLeft: gridLine$1 },
	          w: w => (w - gridLine$1) / 2,
	          type: CanhStatus5,
	          title: 'CANH Status 5',
	        },
	      };
	      t.Content.Row9 = {
	        w: w => w - 2 * gridLine$1,
	        flex: { direction: 'row' },
	        flexItem: { marginTop: gridLine$1 },
	        Item16: {
	          w: w => (w - gridLine$1) / 2,
	          type: CanhStatus6,
	          title: 'CANH Status 6',
	        },
	        Item17: {
	          flexItem: { marginLeft: gridLine$1 },
	          w: w => (w - gridLine$1) / 2,
	          type: OperationalStatus,
	          title: 'Operational Status',
	        },
	      };
	    }
	    return t
	  }

	  _init() {
	    this.refresh();
	  }

	  refresh() {
	    for (let i = 1; i <= 17; i++) {
	      if (this.tag(`Content.Item${i}`)) this.tag(`Content.Item${i}`).refresh();
	    }
	  }
	  _getFocused() {
	    return this.tag('Content')
	  }
	}

	class AvStatus extends StatusView {
	  static _rowsTemplate() {
	    let list = [
	      {
	        key: '#Horizontal Lines',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.HDMI.1.ResolutionValue',
	      },
	      {
	        key: '#Horizontal Lines',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.HDMI.1.ResolutionValue',
	      },
	      {
	        key: '#Vertical Lines',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.VideoOutput.1.DisplayFormat',
	      },
	      {
	        key: 'Frame Rate',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.HDMI.1.DisplayDevice.SupportedResolutions',
	      },
	      {
	        key: 'Aspect Ratio',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.VideoDecoder.1.ContentAspectRatio',
	      },
	      {
	        key: 'Scanning Format',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.VideoOutput.1.HDCP',
	      },
	      {
	        key: 'Audio Setting',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.AudioOutput.1.X_COMCAST-COM_AudioStereoMode',
	      },
	      {
	        key: 'Resolution',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.HDMI.1.DisplayDevice.PreferredResolution',
	      },
	    ];
	    // TODO: implement
	    /*if (!Utils.isClientDevice) {
	      list = list.concat([
	        {
	          key: 'Component Audio',
	          value: 'TODO',
	        },
	      ])
	    }*/
	    if (Utils$1.isClientNoMocaDevice) {
	      list = list.concat([
	        {
	          key: 'Bluetooth Status',
	          value: 'TODO',
	          ref: 'Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.Enabled',
	        },
	        {
	          key: 'Bluetooth Active Profile',
	          value: 'TODO',
	          ref: 'Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.DeviceInfo.Profile',
	        },
	        {
	          key: 'Bluetooth Active Make/Model',
	          value: 'TODO',
	          ref: 'Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.DeviceInfo.Manufacturer',
	        },
	      ]);
	    }
	    // TODO: implement
	    /*if (!Utils.isClientDevice) {
	      list = list.concat([
	        {
	          key: 'State Code',
	          value: 'TODO',
	        },
	        {
	          key: 'County Code',
	          value: 'TODO',
	        },
	        {
	          key: 'County Sub-Division Code',
	          value: 'TODO',
	        },
	      ])
	    }*/
	    return list
	  }
	}

	class HdmiStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'Connection Status',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.HDMI.1.Status',
	      },
	      {
	        key: 'HDCP Status',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.VideoOutput.1.HDCP',
	      },
	      {
	        key: 'HDMI Audio',
	        value: 'TODO',
	        ref: 'Device.Services.STBService.1.Components.AudioOutput.1.X_COMCAST-COM_AudioDB',
	      },
	    ]
	  }
	}

	class VodStatus extends StatusView {
	  static _rowsTemplate() {
	    return [
	      {
	        key: 'VOD ID',
	        value: 'TODO',
	        ref: 'Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreVodId',
	      },
	    ]
	  }
	}

	const gridLine$2 = 2; // TODO why 1 not visible

	class CableCardView extends Lightning.Component {
	  static _template() {
	    return {
	      clipping: true,
	      Content: {
	        type: VScrollList,
	        flex: { direction: 'column', padding: gridLine$2 },
	        w: w => w - 2 * gridLine$2,
	        rect: true,
	        color: Utils$1.blackSolidColor,
	        Item1: {
	          w: w => w - 2 * gridLine$2,
	          type: HdmiStatus,
	          title: 'HDMI',
	        },
	        Item2: {
	          flexItem: { marginTop: gridLine$2 },
	          w: w => w - 2 * gridLine$2,
	          type: AvStatus,
	          title: 'A/V',
	        },
	        Item3: {
	          flexItem: { marginTop: gridLine$2 },
	          w: w => w - 2 * gridLine$2,
	          type: VodStatus,
	          title: 'VOD',
	        },
	      },
	    }
	  }

	  _init() {
	    this.refresh();
	  }

	  refresh() {
	    for (let i = 1; i <= 3; i++) {
	      if (this.tag(`Content.Item${i}`)) this.tag(`Content.Item${i}`).refresh();
	    }
	  }

	  _getFocused() {
	    return this.tag('Content')
	  }
	}

	const gridLine$3 = 2; // TODO why 1 not visible

	class AvView extends Lightning.Component {
	  static _template() {
	    return {
	      clipping: true,
	      Content: {
	        type: VScrollList,
	        flex: { direction: 'column', padding: gridLine$3 },
	        w: w => w - 2 * gridLine$3,
	        rect: true,
	        color: Utils$1.blackSolidColor,
	        Item1: {
	          w: w => w - 2 * gridLine$3,
	          type: HdmiStatus,
	          title: 'HDMI',
	        },
	        Item2: {
	          flexItem: { marginTop: gridLine$3 },
	          w: w => w - 2 * gridLine$3,
	          type: AvStatus,
	          title: 'A/V',
	        },
	        Item3: {
	          flexItem: { marginTop: gridLine$3 },
	          w: w => w - 2 * gridLine$3,
	          type: VodStatus,
	          title: 'VOD',
	        },
	      },
	    }
	  }

	  _init() {
	    this.refresh();
	  }

	  refresh() {
	    for (let i = 1; i <= 3; i++) {
	      if (this.tag(`Content.Item${i}`)) this.tag(`Content.Item${i}`).refresh();
	    }
	  }

	  _getFocused() {
	    return this.tag('Content')
	  }
	}

	const supportedDeviceTypes = [
	  'KEYBOARD',
	  'HUMAN INTERFACE DEVICE',
	  'MOUSE',
	  'JOYSTICK',
	  //'HIFI AUDIO DEVICE',
	  // 'SMARTPHONE',
	  'LOUDSPEAKER',
	];

	class BT {
	  constructor() {
	    console.log('Bluetooth constructor');
	    this._events = new Map();
	    this._devices = [];
	    this._pairedDevices = [];
	    this._connectedDevices = [];
	  }

	  /**
	   * Function to activate the bluetooth plugin
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
	                this._events.get('onPairingChange')();
	              });
	            } else if (notification.newStatus === 'CONNECTION_CHANGE') {
	              this.getConnectedDevices().then(() => {
	                this._events.get('onConnectionChange')();
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
	   * Function to register the events for bluetooth plugin.
	   */
	  registerEvent(eventId, callback) {
	    this._events.set(eventId, callback);
	  }

	  /**
	   * Function to deactivate the bluetooth plugin.
	   */
	  deactivate() {
	    this._events = new Map();
	    this._thunder = null;
	  }

	  /**
	   * Function to start scanning for bluetooth devices.
	   */
	  startScan() {
	    return new Promise((resolve, reject) => {
	      this._thunder
	        //.call('org.rdk.Bluetooth', 'startScan', { timeout: '30', profile: 'DEFAULT' })
	        .call('org.rdk.Bluetooth', 'startScan', {
	          timeout: '30',
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
	   * Function returns the discovered bluetooth devices.
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
	   * Function to connect the required SSID.
	   * @param deviceID
	   * @param deviceType
	   */
	  connect(deviceID, deviceType) {
	    return new Promise((resolve, reject) => {
	      this._thunder
	        .call('org.rdk.Bluetooth', 'connect', {
	          deviceID: deviceID,
	          deviceType: deviceType,
	          profile: deviceType,
	        })
	        .then(result => {
	          console.log('connected : ' + result.success);
	          if (result.success) resolve();
	          else reject();
	        })
	        .catch(err => {
	          console.error('Connection failed', err);
	          reject();
	        });
	    })
	  }

	  /**
	   *
	   * @param deviceID
	   * @param deviceType
	   */
	  disconnect(deviceID, deviceType) {
	    return new Promise((resolve, reject) => {
	      this._thunder
	        .call('org.rdk.Bluetooth', 'disconnect', {
	          deviceID: deviceID,
	          deviceType: deviceType,
	        })
	        .then(result => {
	          console.log('disconnected : ' + result.success);
	          if (result.success) resolve();
	          else reject();
	        })
	        .catch(err => {
	          console.error('disconnect failed', err);
	          reject();
	        });
	    })
	  }

	  /**
	   *
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
	   *
	   * @param {number} deviceId
	   * Function to pair the device.
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
	}

	var screen = {
	  w: 1920,
	  h: 1080
	};

	var theme = {
	  primary: 0xff4286f9,
	  deviceBG: 0xff212121,
	  devicesBG: 0xff1d1d1d,
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
	          text: { text: 'Bluetooth HID', fontSize: 36, fontFace: 'Default' },
	        },
	      },
	    }
	  }

	  _active() {
	    this.tag('Title').patch({
	      text: { text: this.title ? this.title : 'Bluetooth HID' },
	    });
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
	            w: 40,
	            h: 40,
	            src: Utils.asset('images/png/deviceTypeImageBG.png'),
	            DeviceTypeImage: {
	              x: 5,
	              y: 4,
	              w: 30,
	              h: 30,
	              src: Utils.asset('images/png/phoneDefault.png'),
	            },
	          },

	          Text: {
	            x: 50,
	            y: 3,
	            color: theme.primary,
	            text: { fontFace: 'Default', fontSize: 30 },
	          },
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
	              text: { text: 'CONNECT', fontSize: 20, fontFace: 'Default' },
	            },
	          },
	          MoreOptionsButton: {
	            x: 15,
	            w: 40,
	            h: 40,
	            src: Utils.asset('images/png/moreOptionsLight.png'),
	          },
	        },
	      },
	    }
	  }

	  _init() {
	    this.tag('Text').patch({ text: { text: this.item.name } });
	    if (this.item.connected) {
	      this.tag('ConnectText').patch({ color: theme.textDark, text: { text: 'CONNECTED' } });
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.light, true, theme.light),
	      });
	    } else if (this.item.paired) {
	      this.tag('ConnectText').patch({ color: theme.textLight, text: { text: 'CONNECT' } });
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.textDark, false, theme.light),
	      });
	    } else {
	      this.tag('ConnectText').patch({ color: theme.textLight, text: { text: 'PAIR' } });
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.textDark, false, theme.light),
	      });
	    }
	  }

	  connectedStyle() {
	    this.tag('ConnectButton').patch({
	      texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.light, true, theme.light),
	    });
	    this.tag('ConnectText').patch({ smooth: { color: theme.textDark } });
	  }

	  changeConnectStyle() {
	    console.log('method called to ');
	    this.tag('ConnectText').patch({ color: theme.textLight, text: { text: 'CONNECTED' } });
	  }

	  _focus() {
	    this.tag('Container').patch({ smooth: { color: theme.highlight } });
	    this.tag('Text').patch({ smooth: { color: theme.light } });
	    if (this.item.connected) {
	      this.connectedStyle();
	    } else {
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.light, false, theme.light),
	      });
	      this.tag('ConnectText').patch({ smooth: { color: theme.light } });
	    }
	    this.fireAncestors('$onDeviceFocus');
	  }

	  _unfocus() {
	    this.tag('Container').patch({ smooth: { color: theme.deviceBG } });
	    this.tag('Text').patch({ smooth: { color: theme.primary } });
	    if (this.item.connected) {
	      this.connectedStyle();
	    } else {
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(
	          150,
	          40,
	          20,
	          3,
	          theme.textDark,
	          false,
	          theme.deviceBG
	        ),
	      });
	      this.tag('ConnectText').patch({ smooth: { color: theme.textLight } });
	    }
	    this.fireAncestors('$onDeviceFocus');
	  }
	}

	class DeviceList extends Lightning.Component {
	  _construct() {
	    this._BT = new BT();
	    this._BT.activate();
	    this._BT.registerEvent('onDiscoveredDevice', () => {
	      this.renderDevices();
	    });
	    this._BT.registerEvent('onPairingChange', () => {
	      this.renderDevices();
	    });
	    this._BT.registerEvent('onConnectionChange', () => {
	      this.renderDevices();
	    });
	    this._BT.registerEvent('onPairingRequest', notification => {
	      if (notification.pinRequired === 'true' && notification.pinValue) {
	        this.fireAncestors('$rerenderDeviceOptions', notification.pinValue);
	      } else {
	        this.respondToPairingRequest(notification.deviceID, 'ACCEPTED');
	      }
	    });
	    this._BT.registerEvent('onRequestFailed', () => {
	      this.fireAncestors('$closeDeviceOptions');
	    });
	    this._BT.registerEvent('onConnectionRequest', notification => {
	      this.respondToConnectionRequest(notification.deviceID, 'ACCEPTED');
	    });
	  }
	  static _template() {
	    return {
	      flex: { direction: 'column' },
	    }
	  }
	  get deviceID() {
	    return this.children[this.index].item.deviceID
	  }
	  get deviceType() {
	    return this.children[this.index].item.deviceType
	  }
	  _handleEnter() {
	    this.fireAncestors(
	      '$rerenderDeviceOptions',
	      this.children[this.index].item.paired,
	      this.children[this.index].item.connected
	    );
	  }

	  pair() {
	    console.log(`pairing id ${this.deviceID}`);
	    this._BT.pair(this.deviceID);
	  }

	  unpair() {
	    console.log(`unpairing ${this.deviceID}`);
	    this._BT.unpair(this.deviceID);
	  }

	  connect() {
	    console.log(`connecting ${this.deviceID} ${this.deviceType}`);
	    this._BT.connect(this.deviceID, this.deviceType);
	  }

	  disconnect() {
	    console.log(`disconnecting ${this.deviceID} ${this.deviceType}`);
	    this._BT.disconnect(this.deviceID, this.deviceType);
	  }

	  respondToPairingRequest(deviceID, responseValue) {
	    console.log(`responding to onPairingRequest for ${deviceID}`);
	    this._BT.respondToEvent(deviceID, 'onPairingRequest', responseValue);
	  }

	  respondToConnectionRequest(deviceID, responseValue) {
	    console.log(`responding to onConnectionRequest for ${deviceID}`);
	    this._BT.respondToEvent(deviceID, 'onConnectionRequest', responseValue);
	  }

	  acceptPairingRequest() {
	    this.respondToPairingRequest(this.deviceID, 'ACCEPTED');
	  }

	  rejectPairingRequest() {
	    this.respondToPairingRequest(this.deviceID, 'REJECTED');
	  }

	  rerenderDevices() {
	    this._BT
	      .getPairedDevices()
	      .then(() => this._BT.getConnectedDevices())
	      .then(() => this.renderDevices())
	      .then(() => this._BT.startScan());
	  }

	  renderDevices() {
	    let discovered = this._BT.discoveredDevices;
	    let paired = this._BT.pairedDevices;
	    let connected = this._BT.connectedDevices;

	    paired.forEach(p => {
	      p.paired = true;
	      p.connected = false;
	    });
	    connected.forEach(p => {
	      p.paired = true;
	      p.connected = true;
	    });
	    discovered.forEach(p => {
	      p.paired = false;
	      p.connected = false;
	    });

	    // if device isn't paired it isn't connected
	    connected = connected.filter(p => paired.find(a => a.deviceID === p.deviceID));

	    let all = [...connected];
	    paired.forEach(p => {
	      if (!all.find(a => a.deviceID === p.deviceID)) all.push(p);
	    });
	    discovered.forEach(p => {
	      if (!all.find(a => a.deviceID === p.deviceID)) all.push(p);
	    });
	    let filtered = all.filter(item => supportedDeviceTypes.includes(item.deviceType));
	    console.log(`Found ${all.length}, showing ${filtered.length}`);

	    this.children = filtered.map((item, index) => ({
	      type: Device,
	      y: index * 65,
	      input: item,
	      item,
	    }));
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
	    this.rerenderDevices();
	  }

	  _getFocused() {
	    return this.children[this.index]
	  }

	  _handleUp() {
	    if (this.index > 0) {
	      this.index--;
	    } else {
	      this.fireAncestors('$setState', 'Navigation');
	    }
	  }

	  _handleDown() {
	    if (this.index < this.children.length - 1) {
	      this.index++;
	    }
	  }
	}

	class Devices extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        rect: true,
	        color: theme.devicesBG,
	        w: screen.w / 2 + 100,
	        h: screen.h / 1.5,
	        x: 50,
	        y: 200,
	        Title: {
	          x: 20,
	          y: 25,
	          color: theme.text,
	          text: { text: 'Bluetooth Devices', fontFace: 'Default', fontSize: 28 },
	        },
	        List: {
	          clipping: true,
	          y: 85,
	          w: w => w,
	          h: h => h - 85,
	          DeviceList: { type: DeviceList },
	        },
	        NoDevicesFound: {
	          alpha: 0,
	          x: 50,
	          y: 90,
	          text: { fontFace: 'Default', text: 'No Devices Found', fontSize: 30 },
	        },
	      },
	    }
	  }

	  $checkForDevices() {
	    if (this.tag('DeviceList').children.length === 0) {
	      this.tag('NoDevicesFound').patch({ alpha: 1 });
	    } else {
	      this.tag('NoDevicesFound').patch({ alpha: 0 });
	    }
	  }

	  $onDeviceFocus() {
	    let dev = this.tag('DeviceList')._getFocused();
	    let scroll = this.tag('DeviceList');
	    let area = this.tag('List');
	    if (dev) {
	      let devY = scroll.y + dev.finalY;
	      if (devY < 0) {
	        scroll.y = -dev.finalY;
	      } else if (devY + 100 > area.finalH) {
	        scroll.y = -dev.finalY + area.finalH - 100;
	      }
	    } else {
	      scroll.y = 0;
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
	      },
	    ]
	  }
	}

	class Discover extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        x: screen.w / 2 + 300,
	        y: screen.h / 2 - 250,
	        flex: { direction: 'column', alignItems: 'center' },
	        BluetoothImage: {
	          w: 200,
	          h: 200,
	          src: Utils.asset('images/png/bluetoothSignal.png'),
	        },
	        DiscoveringText: {
	          alpha: 0,
	          y: 60,
	          color: theme.text,
	          text: { text: 'Discovering...', fontFace: 'Default', fontSize: 28 },
	        },
	        ConnectText: {
	          y: 30,
	          color: theme.text,
	          text: { text: 'Connect to', fontFace: 'Default', fontSize: 28 },
	        },
	        ConnectText2: {
	          y: 19,
	          color: theme.text,
	          text: {
	            text: 'Bluetooth HID',
	            fontFace: 'Default',
	            fontSize: 28,
	          },
	        },
	        DiscoverButton: {
	          y: 200,
	          texture: Lightning.Tools.getRoundRect(450, 80, 40, 3, theme.text, true, theme.text),
	          DiscoverText: {
	            mountX: 0.5,
	            x: 450 / 2,
	            y: 22,
	            color: theme.light,
	            text: { text: 'Discover New Devices', fontFace: 'Default', fontSize: 30 },
	          },
	        },
	      },
	    }
	  }

	  _init() {
	    this.isLoading = false;

	    this._bluetoothSpin = this.tag('BluetoothImage').animation({
	      duration: 2,
	      repeat: -1,
	      stopMethod: 'immediate',
	      actions: [{ p: 'rotation', v: { 0: 0, 1: 6.25 } }],
	    });

	    setTimeout(() => {
	      this._handleEnter();
	    }, 500);
	  }
	  // _focus() {

	  //   this.tag('DiscoverButton').patch({
	  //    texture: Lightning.Tools.getRoundRect(450, 80, 40, 3, theme.primary, true, theme.primary)
	  //   })

	  // }

	  _getFocused() {
	    this.tag('DiscoverButton').patch({
	      texture: Lightning.Tools.getRoundRect(450, 80, 40, 3, theme.primary, true, theme.primary),
	    });
	  }
	  _unfocus() {
	    this.tag('DiscoverButton').patch({
	      texture: Lightning.Tools.getRoundRect(450, 80, 40, 3, theme.text, true, theme.text),
	    });
	  }

	  startDiscovery() {
	    console.log('inside start discovery');
	    this.tag('DiscoveringText').patch({ alpha: 1 });
	    this.tag('ConnectText').patch({ alpha: 0 });
	    this.tag('ConnectText2').patch({ alpha: 0 });
	    this.tag('DiscoverText').patch({ text: { text: 'Cancel' } });
	    this._bluetoothSpin.start();

	    this.fireAncestors('$rerenderDevices');
	    setTimeout(() => {
	      this.stopDiscovery();
	    }, 30000); // see BT.startScan()
	  }

	  stopDiscovery() {
	    //BT.discover.stop()
	    this.tag('DiscoveringText').patch({ alpha: 0 });
	    this.tag('ConnectText').patch({ y: 0, alpha: 1 });
	    this.tag('ConnectText2').patch({ y: -12, alpha: 1 });
	    this.tag('DiscoverText').patch({ text: { text: 'Discover New Devices' } });
	    this._bluetoothSpin.stop();
	    this.isLoading = false;
	  }

	  _handleEnter() {
	    this.isLoading = !this.isLoading;
	    if (this.isLoading) {
	      this.startDiscovery();
	    } else {
	      this.stopDiscovery();
	    }
	  }

	  _handleUp() {
	    this.fireAncestors('$setState', 'Navigation');
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
	      flex: { direction: 'row', alignItems: 'center', justifyContent: 'space-between' },
	    }
	  }

	  rerender(isPaired, isConnected) {
	    let pin = typeof isPaired === 'string' ? isPaired : false;
	    this.children[0].tag('Text').patch({
	      text: {
	        text: pin ? `PIN ${pin} ENTERED` : `${isPaired ? 'UNPAIR' : 'PAIR'} DEVICE`,
	      },
	    });
	    this.children[1].tag('Text').patch({
	      text: {
	        text: pin ? 'REJECT PIN' : `${isConnected ? 'DISCONNECT' : 'CONNECT'} DEVICE`,
	      },
	    });
	  }

	  set items(items) {
	    this.children = items.map((item, i) => {
	      return {
	        type: Option,
	        item,
	        x: i * 100 + 50,
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
	    let text = this.children[this.index].tag('Text').text.text.toLowerCase();
	    if (/pin .+ entered/.test(text)) {
	      return this.fireAncestors('$acceptPairingRequest')
	    }
	    switch (text) {
	      case 'pair device':
	        return this.fireAncestors('$pairDevice')
	      case 'unpair device':
	        return this.fireAncestors('$unpairDevice')
	      case 'connect device':
	        return this.fireAncestors('$connectDevice')
	      case 'disconnect device':
	        return this.fireAncestors('$disconnectDevice')
	      case 'reject pin':
	        return this.fireAncestors('$rejectPairingRequest')
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
	    this.tag('Options').items = ['PAIR DEVICE', 'CONNECT DEVICE', 'CANCEL'].map(label => ({
	      label
	    }));
	  }

	  _getFocused() {
	    return this.tag('Options')
	  }
	}

	class ConnectionScreen extends Lightning.Component {
	  static _template() {
	    return {
	      Header: { type: Header },
	      Devices: { type: Devices },
	      Discover: { type: Discover },
	      DeviceOptions: { type: DeviceOptions, alpha: 0 },
	    }
	  }

	  _init() {
	    if (this.tag('Devices.DeviceList').children.length == 0) {
	      this._setState('Discover');
	    } else {
	      this._setState('Devices');
	    }
	  }

	  _active() {
	    this.fireAncestors('$showNav');
	  }

	  $pairDevice() {
	    this.tag('Devices.DeviceList').pair();
	    this.$closeDeviceOptions();
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

	  $connectDevice() {
	    this.tag('Devices.DeviceList').connect();
	    this.$closeDeviceOptions();
	  }

	  $disconnectDevice() {
	    this.tag('Devices.DeviceList').disconnect();
	    this.$closeDeviceOptions();
	  }

	  $acceptPairingRequest() {
	    this.tag('Devices.DeviceList').acceptPairingRequest();
	    this.$closeDeviceOptions();
	  }

	  $rejectPairingRequest() {
	    this.tag('Devices.DeviceList').rejectPairingRequest();
	    this.$closeDeviceOptions();
	  }

	  $closeDeviceOptions() {
	    this._setState('Devices');
	  }

	  $rerenderDevices() {
	    this.tag('Devices.DeviceList').rerenderDevices();
	  }

	  $rerenderDeviceOptions(isPaired, isConnected) {
	    this._setState('DeviceOptions');
	    this.tag('DeviceOptions.Options').rerender(isPaired, isConnected);
	  }

	  static _states() {
	    return [
	      class Devices extends this {
	        _getFocused() {
	          if (this.tag('Devices.DeviceList').children.length == 0) {
	            return this.tag('Discover')
	          } else {
	            return this.tag('Devices.DeviceList')
	          }
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
	      },
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

	  _active() {
	    const song = BT.getPaired();
	    this.tag('SongTitle').patch({ text: { text: song.title } });
	    this.tag('ArtistAndAlbum').patch({ text: { text: `${song.artist} - ${song.album}` } });
	  }
	}

	class Seekbar extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        w: screen.w - 150,
	        y: screen.h - 190,
	        x: 150,
	        flex: { direction: 'row', alignItems: 'center' },
	        StartTimeText: {
	          text: { text: '0:20', fontFace: 'Default', fontSize: 28 }
	        },
	        BarStart: {
	          x: 50,
	          y: -3,
	          w: 120,
	          h: 10,
	          color: theme.primary,
	          rect: true
	        },
	        Circle: {
	          x: 20,
	          y: -1,
	          texture: Lightning.Tools.getRoundRect(30, 30, 15, 3, theme.light, true, theme.light)
	        },
	        BarEnd: {
	          y: -3,
	          w: 1250,
	          h: 10,
	          color: theme.light,
	          rect: true
	        },
	        EndTimeText: {
	          x: 50,
	          text: { text: '-3:49', fontFace: 'Default', fontSize: 28 }
	        }
	      }
	    }
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
	            texture: Lightning.Tools.getSvgTexture(Utils.asset('images/wireSkipBwd.svg'), 30, 30)
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
	            texture: Lightning.Tools.getSvgTexture(Utils.asset('images/wirePlay.svg'), 30, 30)
	          },
	          PauseIcon: {
	            x: 60 / 2 + 1.5,
	            y: 60 / 2 + 2,
	            mount: 0.5,
	            texture: Lightning.Tools.getSvgTexture(Utils.asset('images/wirePause.svg'), 30, 30)
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
	            texture: Lightning.Tools.getSvgTexture(Utils.asset('images/wireSkipFwd.svg'), 30, 30)
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

	  _handleEnter() {
	    switch (this.index) {
	      case 1:
	        this.isPlaying = !this.isPlaying;

	        if (this.isPlaying) {
	          this.tag('PlayPause.PauseIcon').patch({ alpha: 1 });
	          this.tag('PlayPause.PlayIcon').patch({ alpha: 0 });
	        } else {
	          this.tag('PlayPause.PauseIcon').patch({ alpha: 0 });
	          this.tag('PlayPause.PlayIcon').patch({ alpha: 1 });
	        }
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
	        texture: Lightning.Tools.getSvgTexture(Utils.asset('images/headphones.svg'), 500, 500)
	      }
	    }
	  }
	}

	const rowWidth = 1400;
	const columnWidth = rowWidth / 20;

	const activeBlocks = Array.from({ length: 11 }).map(() => Array(20).fill(true));

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
	        Grid: { type: Grid }
	      }
	    }
	  }
	}

	class PlayerScreen extends Lightning.Component {
	  static _template() {
	    return {
	      y: -160,
	      Header: { type: Header, title: 'Bluetooth Audio In / Player' },
	      Equalizer: { type: Equalizer },
	      AlbumArt: { type: AlbumArt },
	      Titles: { type: Titles },
	      Seekbar: { type: Seekbar },
	      Controls: { type: Controls }
	    }
	  }

	  _active() {
	    this.fireAncestors('$hideNav');
	  }

	  _getFocused() {
	    return this.tag('Controls')
	  }
	}

	class Bluetooth extends Lightning.Component {
	 

	  static _template() {
	    return {
	      Connection: { type: ConnectionScreen },
	      Player: { type: PlayerScreen, alpha: 0 }
	    }
	  }

	  _init() {
	    console.log("called init bluetooth");
	    this._setState('Connection');
	    //BT.init()
	  }

	  $switchToPlayer() {
	    this._setState('Player');
	  }

	  static _states() {
	    return [
	      class Connection extends this {
	        _getFocused() {
	         // console.log("called get focussed connection")
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
	          this.tag('Player').patch({ alpha: 1 });
	        }

	        $exit() {
	          this.tag('Connection').patch({ alpha: 1 });
	          this.tag('Player').patch({ alpha: 0 });
	        }

	        _handleBack() {
	          this._setState('Connection');
	        }
	      }
	    ]
	  }
	}

	class Device$1 extends Lightning.Component {
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
	            texture: Lightning.Tools.getSvgTexture(
	              Utils.asset('images/deviceTypeImageBG.svg'),
	              40,
	              40
	            ),
	            DeviceTypeImage: {
	              x: 5,
	              y: 4,
	              texture: Lightning.Tools.getSvgTexture(Utils.asset('images/phoneDefault.svg'), 30, 30)
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
	          Status: {
	            x: -40,
	            y: 3,
	            color: theme.textLight,
	            text: { fontFace: 'Default', fontSize: 20 }
	          },
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
	    this.tag('Text').patch({ text: { text: this.item.ssid } });
	    if (this.item.connected) {
	      this.tag('Status').patch({ text: { text: 'CONNECTED' } });
	      this.tag('ConnectText').patch({ color: theme.textDark, text: { text: 'DISCONNECT' } });
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.light, true, theme.light)
	      });
	    } else {
	      this.tag('ConnectText').patch({ color: theme.textLight, text: { text: 'CONNECT' } });
	      this.tag('ConnectButton').patch({
	        texture: Lightning.Tools.getRoundRect(150, 40, 20, 3, theme.textDark, false, theme.light)
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
	  set connected(bool){
	    console.log('here');
	    if (bool){
	      this.tag('Status').patch({ text: { text: 'CONNECTED' } });
	      this.tag('ConnectText').patch({ color: theme.light, text: { text: 'DISCONNECT' } });
	    }
	  }
	}

	class DeviceList$1 extends Lightning.Component {
	  static _template() {
	    return {
	      y: 85,
	      flex: { direction: 'column' }
	    }
	  }

	  set items(items) {
	    this.children = items.map((item, index) => {
	      return {
	        type: Device$1,
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

	  get device() {
	    return this.children[this.index].item
	  }
	  get item(){
	    return this.children[this.index]
	  }
	  _handleEnter() {
	    this.fireAncestors('$connectWifi',this.device);

	  }

	  _getFocused() {
	    return this.children[this.index]
	  }

	  _handleUp() {
	    if (this.index > 0) {
	      this.index--;
	    } else {
	      this.fireAncestors('$setState', 'Navigation');
	    }
	  }

	  _handleDown() {
	    if (this.index < this.children.length - 1) {
	      this.index++;
	    }
	  }
	}

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
	              this.setEnabled();
	            }
	          });

	          this._thunder.on(this.callsign, 'onWIFIStateChanged', notification => {
	            console.log('onWIFIStateChanged: ' + notification.state);
	            if (this._events.has('onWIFIStateChanged')) {
	              this._events.get('onWIFIStateChanged')(notification);
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
	   *
	   * @param {string} eventId
	   * @param {function} callback
	   * Register events and event listeners.
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
	   *
	   * @param {object,string} device
	   * Function to connect the required SSID.
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

	  setEnabled() {
	    return new Promise((resolve, reject) => {
	      this._thunder
	        .call(this.callsign, 'setEnabled', { enable: true })
	        .then(result => {
	          console.log('WiFi enabled');
	          resolve(result);
	        })
	        .catch(err => {
	          console.error(`Can't enable WiFi: ${err}`);
	          reject(err);
	        });
	    })
	  }
	}

	/**
	 * Class to render the keypad for the wifi screen.
	 */
	class GalleryRow extends Lightning.Component {
	  static _template() {
	    return {
	      Wrapper: {
	        flex: { direction: 'row' }
	      }
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
	        flex: { direction: 'row', wrap: true }
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
	    const ori = this.orientation;
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
	      class Empty extends this {},
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
	      }
	    ]
	  }
	}

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
	        colorBorder: 0xff000000
	      }
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
	        color: 0x0000b3dc
	      },

	      Key: {
	        x: this.w / 2,
	        y: this.h / 2,
	        mount: 0.5,
	        text: { text: item, fontSize: this._fontSize, fontFace: 'Light' }
	      }
	    };
	    if (this._keyType == 'delete') {
	      this.tag('Border').content = {
	        Key: {
	          src: Utils.asset('images/del.png'),
	          zIndex: 10
	        }
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
	      Focus: { color: 0xff00b3dc },
	      Key: {
	        color: 0xff000000
	      }
	    };
	    this.tag('Border').colorBorder = 0xff00b3dc;
	  }
	  _unfocus() {
	    this.tag('Border').content = {
	      Focus: { color: 0x0000b3dc },
	      Key: {
	        color: 0xffffffff
	      }
	    };
	    this.tag('Border').colorBorder = 0xff000000;
	  }
	  _handleEnter() {
	    this.fireAncestors('$pressedKey', this._key, this._keyType);
	  }
	}

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
	 * Class to render the key for type selection
	 */

	class SelectionKey extends Key {
	  _init() {
	    this.patch({
	      Highlight: {
	        src: Utils.asset('images/' + this._keyType + '.png'),
	        color: 0xff000000
	      }
	    });
	  }

	  _focus() {
	    this.tag('Highlight').color = 0xff00b3dc;
	    this.tag('Highlight').zIndex = 10;
	    this.tag('Border').content = {
	      Key: {
	        text: { textColor: 0xff00b3dc }
	      }
	    };
	  }
	  _unfocus() {
	    this.tag('Highlight').color = 0xff000000;
	    this.tag('Highlight').zIndex = 1;
	    this.tag('Border').content = {
	      Key: {
	        text: { textColor: 0xffffffff }
	      }
	    };
	  }
	}

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
	      rect:true,
	      color:0xff000000,
	      w:428,
	      h:560,
	      Entry: {
	        x: 0,
	        y: 0,
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
	          text: { text: 'Password', fontSize: 18, fontFace: 'Light', textColor: 0xffa5a5a5 }
	        },
	        Pwd: {
	          x: 130,
	          y: this._height / 2 + 5,
	          mountY: 0.5,
	          text: {
	            text: '',
	            fontSize: 24,
	            fontFace: 'Light',
	            textColor: 0xff00b3dc,
	            wordWrapWidth: this._width - 130,
	            wordWrap: false,
	            textOverflow: 'ellipsis'
	          }
	        }
	      },
	      Selection: {
	        x: 0,
	        y: this._height + 21,
	        texture: Lightning.Tools.getRoundRect(
	          this._width,
	          this._height,
	          this._radius,
	          this._strokeWidth,
	          0xff1b1b1b,
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
	          zIndex: 10
	        }
	      },
	      Keypad: {
	        x: 7,
	        y: (this._height + 21) * 2,
	        w: this._width,
	        wrap: true,
	        type: GalleryRow
	      },
	      FunctionalKeys: {
	        x: 7,
	        y: (this._height + 21) * 5 + 15,
	        w: this._width,
	        wrap: true,
	        type: GalleryRow
	      },
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
	          0x00a5a5a5
	        ),
	        Text: {
	          x: this._width / 2,
	          y: this._height / 2,
	          mount: 0.5,
	          text: { text: 'Submit', fontSize: 24, fontFace: 'Light', textColor: 0xff6c6c6c }
	        }
	      }
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
	      flexItem: { marginRight: 5, marginBottom: 5 }
	    };
	    let space = {
	      ref: 'Keyspace',
	      w: 178,
	      h: 56,
	      type: Key,
	      fontSize: 24,
	      item: 'Space',
	      keyType: 'space',
	      flexItem: { marginRight: 5, marginBottom: 5 }
	    };
	    let del = {
	      ref: 'Keydel',
	      w: 117,
	      h: 56,
	      keyType: 'delete',
	      type: Key,
	      fontSize: 24,
	      item: '',
	      flexItem: { marginRight: 5, marginBottom: 5 }
	    };
	    this.tag('FunctionalKeys').items = [clear, space, del];
	    this.tag('Selection.Types').items = ['abc', 'ABC', '#+-'].map((item, index) => {
	      return {
	        ref: 'Item',
	        w: this._width / 3,
	        h: this._height,
	        fontSize: 24,
	        item: item,
	        type: SelectionKey,
	        clipping: true,
	        keyType: 'selection' + index
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
	        flexItem: { marginRight: 5, marginBottom: 5 }
	      }
	    });
	  }
	  static _states() {
	    return [
	      class Selection extends this {
	        $enter(){
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
	                0x0000b3dc,
	                true,
	                0xff00b3dc
	              )
	            }
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
	                0x0000b3dc
	              )
	            }
	          });
	          this.tag('Submit.Text').text.textColor = 0xff6c6c6c;
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
	      }
	    ]
	  }
	}

	class Devices$1 extends Lightning.Component {
	  _construct() {
	    console.log('Wifi constructor');
	    let device = this;
	    this._wifi = new Wifi();
	    this._wifi.activate();
	    this._wifi.registerEvent('onWIFIStateChanged', notification => {
	      if (notification.state === 2 || notification.state === 5) {
	        this._wifi.discoverSSIDs();
	      }
	    });
	    this._wifi.registerEvent('onAvailableSSIDs', notification => {
	      this._wifi.getConnectedSSID().then(result => {
	        notification.ssids.forEach(s => {
	          if (s.ssid === result.ssid) {
	            s.connected = true;
	          }
	        });
	        device.tag('DeviceList').items = notification.ssids;
	      });
	    });
	  }
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
	          text: { text: 'Wireless Network Connections', fontFace: 'Default', fontSize: 28 }
	        },
	        DeviceList: { type: DeviceList$1 },
	        NoDevicesFound: {
	          alpha: 0,
	          x: 50,
	          y: 90,
	          text: { fontFace: 'Default', text: 'No Devices Found', fontSize: 30 }
	        },
	        Loader: {
	          x: (screen.w / 2 + 100)/2,
	          y: 50,
	          mountX:0.5,
	          w: 781, h: 638, color:0x66000000, zIndex: 99,
	          transitions: { color: { duration: 0.5, delay: 0 } },
	          Icon: {
	            mount: 0.5, x: 1920 / 4, y: 1080 / 4, src:Utils.asset('images/loader.png')
	          },
	          alpha:0
	        },
	        Password: {
	          type: WiFiPasswordScreen,
	          x: (screen.w / 2 + 100)/2,
	          y: 50,
	          mountX:0.5,
	          w: 428,
	          h: 56,
	          alpha: 0
	        },
	        Status:{
	          x: (screen.w / 2 + 100)/2,
	          y: 200,
	          mountX:0.5,
	          w: 400,
	          h: 100,
	          rect:true,
	          color:0xff000000,
	          Text:{
	            x:200,
	            y:50,
	            mount:0.5,
	            text:{text:'Unable to connect',fontSize:24}
	          },
	          alpha:0
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

	  _startLoader() {
	    this.tag('Loader').setSmooth('alpha', 1);
	    this.loadingAnimation.play();
	  }

	  _stopLoader() {
	    this.tag('Loader').setSmooth('alpha', 0);
	    this.loadingAnimation.stop();
	  }
	  _init() {
	    this._setState('DeviceList');
	    this._wifi.discoverSSIDs();
	    //this.tag('DeviceList').items = ['D37531D9F8B041E2A1'].map(name => ({ name }))
	 
	    this.$checkForDevices();
	    this.loadingAnimation = this.tag('Loader').animation({
	      duration: 1, repeat: -1, stopMethod: 'immediate', stopDelay: 0.2, actions: [
	        { t: '.Icon', p: 'rotation', v: { sm: 0, 0: 0, 1: Math.PI * 2 } },
	      ]
	    });
	  }
	refresh() {
	  this._wifi.discoverSSIDs();
	}
	  static _states() {
	    return [
	      class DeviceList extends this {
	        _getFocused() {
	          return this.tag('DeviceList')
	        }
	        $connectWifi(device) {
	          this._device = device;
	          console.log('connect: ' + device.security);
	          if (device.connected) {
	            this.disconnect();
	          } else if (device.security === 0) {
	            console.log('connect directly');
	            this.$startConnect('');
	          } else {
	            this._setState('DeviceList.Password');
	          }
	        }
	        $startConnect(password) {
	          let device = this;
	          this._startLoader();
	          this._wifi.connect(this._device, password).then(result => {
	            device._stopLoader();
	            if (!result.success) {
	              device.tag('Container.Status').alpha = 1;
	              setTimeout(() => {
	                device.tag('Container.Status').alpha = 0;
	              }, 2000);
	            }
	          });
	        }
	        disconnect() {
	          let device = this;
	          this._startLoader();
	          this._wifi.disconnect().then(() => device._stopLoader());
	        }
	        static _states() {
	          return [
	            class Password extends DeviceList {
	              $enter() {
	                this.tag('Container.Password').alpha = 1;
	              }
	              _getFocused() {
	                return this.tag('Container.Password')
	              }
	              _handleRight(){}
	              $password(password) {
	                console.log('submitted');
	                this.tag('Container.Password').alpha = 0;
	                this.$startConnect(password);
	                this._setState('DeviceList');
	      
	              }
	              _handleBack() {
	                this._setState('DeviceList');
	              }
	              $exit() {
	                this.tag('Container.Password').alpha = 0;
	              }
	            },
	          ]
	        }
	      },

	      
	    ]
	  }
	}

	class Refresh extends Lightning.Component {
	  static _template() {
	    return {
	      Container: {
	        x: screen.w / 2 + 300,
	        y: screen.h / 2 - 250,
	        flex: { direction: 'column', alignItems: 'center' },
	        WiFiImage: {
	          x: -20,
	          w: 200,
	          h: 200,
	          src: Utils.asset('images/wifi.png')
	        },
	        RefreshButton: {
	          x: -5,
	          y: 200,
	          texture: Lightning.Tools.getRoundRect(450, 80, 40, 3, theme.text, true, theme.text),
	          DiscoverText: {
	            mountX: 0.5,
	            x: 450 / 2,
	            y: 22,
	            color: theme.light,
	            text: { text: 'Refresh Network List', fontFace: 'Default', fontSize: 30 }
	          }
	        }
	      }
	    }
	  }

	  _focus() {
	    this.tag('RefreshButton').patch({
	      texture: Lightning.Tools.getRoundRect(450, 80, 40, 3, theme.primary, true, theme.primary)
	    });
	  }

	  _unfocus() {
	    this.tag('RefreshButton').patch({
	      texture: Lightning.Tools.getRoundRect(450, 80, 40, 3, theme.text, true, theme.text)
	    });
	  }

	  _handleUp() {
	    this.fireAncestors('$setState', 'Navigation');
	  }
	}

	class WiFiSettings extends Lightning.Component {
	  static _template() {
	    return {
	      Title: {
	        x: 50,
	        y: 60,
	        color: theme.primary,
	        text: {
	          fontFace: 'Default',
	          fontSize: 36,
	          text: 'WiFi Settings'
	        }
	      },
	      Devices: { type: Devices$1 },
	      Refresh: { type: Refresh }
	    }
	  }

	  _init() {
	    this._setState('Devices');
	  }

	  static _states() {
	    return [
	      class Devices extends this {
	        _getFocused() {
	          return this.tag('Devices')
	        }

	        _handleRight() {
	          this._setState('Refresh');
	        }
	      },
	      class Refresh extends this {
	        _getFocused() {
	          return this.tag('Refresh')
	        }

	        _handleLeft() {
	          this._setState('Devices');
	        }
	        _handleEnter() {
	          this.tag('Devices').refresh();
	        }
	      }
	    ]
	  }
	}



	const SystemCallsign = 'org.rdk.System';
	const WifiCallsign = 'org.rdk.Wifi';
	const BluetoothCallsign = 'org.rdk.BluetoothSettings';

	const thunderConfig$1 = {
	  host: '127.0.0.1',
	  port: 9998,
	  default: 1,
	};

	class App extends Lightning.Component {
	  static getFonts() {
	    return [
	      { family: 'Regular', url: Utils.asset('fonts/DejaVuSans.ttf') },
	      { family: 'Bold', url: Utils.asset('fonts/DejaVuSans-Bold.ttf') },
	    ]
	  }

	  static _template() {
	    return {
	      Background: {
	        w: 1920,
	        h: 1080,
	        rect: true,
	        color: Utils$1.charcoalGreyColor,
	      },
	      Text: {
	        mountX: 0.5,
	        x: 960,
	        y: 15,
	        text: {
	          text: 'Press and hold the OK button for 5 seconds to reboot the device.',
	          fontFace: 'Regular',
	          fontSize: 18,
	          textColor: Utils$1.greyColor,
	        },
	      },
	      TabContainer: {
	        type: TabContainer,
	        x: 20,
	        y: 60,
	        w: 1880,
	        h: 1020,
	      },
	      Toast: {
	        alpha: 0,
	        type: Toast,
	        Text: {
	          mount: 0.5,
	          x: 150,
	          y: 50,
	          text: {
	            text: '',
	            fontFace: 'Regular',
	            fontSize: 40,
	            textColor: Utils$1.textColor,
	          },
	        },
	      },
	    }
	  }

	  _init() {
	    this.thunderJS = thunderJS(
	      Object.assign(
	        {
	          debug: this.stage.root.getOption('debug'),
	        },
	        thunderConfig$1
	      )
	    );
	    this._setState('Activate');
	  }

	  static _states() {
	    return [
	      class Activate extends this {
	        $enter() {
	          Promise.all([
	            this.thunderJS.Controller.activate({ callsign: SystemCallsign }),
	            this.thunderJS.Controller.activate({ callsign: BluetoothCallsign }).then(
	              () => (Utils$1.hasBluetoothSupport = true),
	              () => {}
	            ),
	            this.thunderJS.Controller.activate({ callsign: WifiCallsign }).then(
	              () => (Utils$1.hasWiFiSupport = true),
	              () => {}
	            ),
	          ]).then(this.activated.bind(this), err => console.error('Error', err));
	        }
	        activated() {
	          this._setState('Load');
	        }
	      },

	      class Load extends this {
	        $enter() {
	          Promise.all([
	            this.thunderJS[SystemCallsign].getXconfParams(),
	            new Promise(resolve => {
	              this.maclistener = this.thunderJS[SystemCallsign].on(
	                'onMacAddressesRetreived',
	                resolve
	              );
	            }),
	            this.thunderJS[SystemCallsign].getMacAddresses(),
	          ]).then(this.all.bind(this), err => console.error('Error', err));
	        }
	        $exit() {
	          this.maclistener.dispose();
	        }
	        all(values) {
	          Utils$1.modelName = values[0].xconfParams.model;
	          let addr = values[1];
	          if (!addr.ecm_mac || addr.ecm_mac === '00:00:00:00:00:00') {
	            Utils$1.isClientDevice = true;
	          }
	          console.log(
	            `Spark Diagnostics - ${Utils$1.isClientDevice ? 'Client(Xi)' : 'gateway(XG)'}  device`
	          );
	          if (addr.wifi_mac && addr.wifi_mac !== '00:00:00:00:00:00') {
	            Utils$1.isClientNoMocaDevice = true;
	            console.log('Spark Diagnostics - Client(Xi) device with no moca');
	          }
	          this._setState('Loaded');
	        }
	      },

	      class Loaded extends this {
	        $enter() {
	          this.tag('TabContainer').addTab('Install Summary', InstallSummaryView);
	          this.tag('TabContainer').addTab('Network Connections', NetworkConnectionsView);
	          if (!Utils.isClientDevice) {
	            this.tag('TabContainer').addTab('Cable Card', CableCardView);
	          }
	          this.tag('TabContainer').addTab('AV', AvView);
	          this.tag('TabContainer').addTab('Bluetooth Settings', Bluetooth);
	          this.tag('TabContainer').addTab('Wi-Fi Settings', WiFiSettings);
	          this._setState('Main');
	        }
	      },

	      class Main extends this {
	        _getFocused() {
	          return this.tag('TabContainer')
	        }
	        _handleEnter() {
	          this.enterPressTimeout = setTimeout(this.reboot.bind(this), 5000);
	        }
	        _handleEnterRelease() {
	          clearTimeout(this.enterPressTimeout);
	        }
	        reboot() {
	          this._setState('Reboot');
	        }
	      },

	      class Reboot extends this {
	        $enter() {
	          this.showToast({ message: 'Rebooting.....' });
	          this.thunderJS[SystemCallsign].reboot({ reason: 'Restarting STB from Spark Diagnostics' })
	            .then(() => console.log('Rebooting'))
	            .catch(err => console.error('Error', err));
	        }
	        showToast(param) {
	          this.tag('Toast.Text').text = param.message;
	          this.tag('Toast').show();
	          setTimeout(this.hide.bind(this), 5000);
	        }
	        hide() {
	          this.tag('Toast').alpha = 0;
	          this._setState('Main');
	        }
	      },
	    ]
	  }
	}



	function index() {
	  return Launch(App, ...arguments)
	}

	return index;

}());
//# sourceMappingURL=appBundle.js.map
