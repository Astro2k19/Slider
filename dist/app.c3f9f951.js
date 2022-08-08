// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/Slider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Slider = /*#__PURE__*/function () {
  /**
   * Instantiate a new slider
   * @param {Options} options - Component configuration options
   * 1. attr - data attribute for defining slider
   * 2. sliderContainer - slider container class
   * 3. slider - slider class
   */
  function Slider(options) {
    _classCallCheck(this, Slider);

    /**
     * Slider component configuration
     * @type {{slider: string, sliderContainer: string, attr: string} & Options}
     *
     */
    this.config = Object.assign({
      attr: 'data-slider',
      sliderContainer: '.slider',
      slider: '.slides'
    }, options);
    this.init();
  }
  /**
   * Initialize component
   * @return {void}
   */


  _createClass(Slider, [{
    key: "init",
    value: function init() {
      var _this = this;

      /**
       * Component state
       * @type {State}
       */
      this.state = {
        index: 0,
        length: 0,
        slider: null,
        sliderContainer: null,
        start: null,
        isSwiping: false,
        swipingDistance: 0,
        threshold: 20
      };
      document.addEventListener('click', this.click.bind(this));
      document.addEventListener('touchstart', this.touchStart.bind(this));
      document.addEventListener('touchmove', this.touchMove.bind(this));
      document.addEventListener('touchend', this.touchEnd.bind(this));
      document.querySelectorAll("[".concat(this.config.attr, "]")).forEach(function (slide) {
        _this.setSliderWidth(slide);
      });
    }
    /**
     * Update slider state
     * @return {void}
     */

  }, {
    key: "setState",
    value: function setState() {
      if (!this.state.slider) return;

      if (this.state.index < 0) {
        this.state.index = 0;
      } else if (this.state.index >= this.state.length) {
        this.state.index = this.state.length - 1;
      }

      this.state.slider.classList[this.state.isSwiping ? 'add' : 'remove']('swiping');
      this.state.slider.style.left = "".concat(this.state.index * -100 + this.caclPercetageDistance(), "%");
    }
    /**
     * Navigate slider forwards of backwards
     * @param {HTMLElement} el - Element from which to begin traversal
     * @param {boolean} forward - Navigate forward?
     */

  }, {
    key: "navigate",
    value: function navigate(el) {
      var forward = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.loadState(el);
      forward ? this.state.index++ : this.state.index--;
      this.setState();
    }
    /**
     * Set slider width based on child count
     * @param {HTMLElement} slider - Slider element
     * @return {void}
     */

  }, {
    key: "setSliderWidth",
    value: function setSliderWidth(slider) {
      slider.style.width = "".concat(slider.childElementCount * 100, "%");
    }
    /**
     * Load slider state from given child Element
     * @param {HTMLElement} el - Element from which to begin traversal to find slider state
     * @return {void}
     */

  }, {
    key: "loadState",
    value: function loadState(el) {
      this.state.sliderContainer = el.closest(this.config.sliderContainer);
      if (!this.state.sliderContainer) throw new Error('The slider container doesnt exist');
      this.state.slider = this.state.sliderContainer.querySelector(this.config.slider);
      if (!this.state.slider) throw new Error('The slider element doesnt exist');
      this.state.length = this.state.slider.childElementCount;
      this.state.width = this.state.sliderContainer.getBoundingClientRect().width;
      this.state.index = this.getCurrentIndex();
    }
    /**
     *  Get current slider slide index
     * @return {number}
     */

  }, {
    key: "getCurrentIndex",
    value: function getCurrentIndex() {
      var left = this.state.slider.style.left || '0%';
      left = parseInt(left.replace(/[-%]/, ''));
      return Math.round(left / 100);
    }
    /**
     * Click listener
     * @param {HTMLElement} target - Click target
     */

  }, {
    key: "click",
    value: function click(_ref) {
      var target = _ref.target;
      var prev = target.matches("[".concat(this.config.attr, "-prev]"), "[".concat(this.config.attr, "-prev] *"));
      var next = !prev && target.matches("[".concat(this.config.attr, "-next]"), "[".concat(this.config.attr, "-next] *"));
      if (!prev && !next) return;
      this.navigate(target, next);
    }
    /**
     * Touchstart listener
     * @param {HTMLElement} target - Touch target
     * @param {TouchList} touchesStart - Touchstart event list
     */

  }, {
    key: "touchStart",
    value: function touchStart(_ref2) {
      var target = _ref2.target,
          touchesStart = _ref2.changedTouches;
      console.log(touchesStart);
      if (!target.closest("[".concat(this.config.attr, "]"))) return;
      if (touchesStart.length !== 1) return;
      this.loadState(target);
      this.state.start = touchesStart[0].screenX;
      this.state.isSwiping = true;
    }
    /**
     * Touchmove listener
     * @param {TouchList} touchesMove - Touchmove event list
     */

  }, {
    key: "touchMove",
    value: function touchMove(_ref3) {
      var touchesMove = _ref3.changedTouches;
      if (!this.state.isSwiping) return;
      this.state.swipingDistance = touchesMove[0].screenX - this.state.start;
      this.setState();
    }
    /**
     * Touchend listener
     */

  }, {
    key: "touchEnd",
    value: function touchEnd() {
      var distance = this.caclPercetageDistance();

      if (distance <= -this.state.threshold) {
        this.navigate(this.state.sliderContainer, true);
      } else if (distance >= this.state.threshold) {
        this.navigate(this.state.sliderContainer, false);
      }

      this.state.swipingDistance = 0;
      this.state.isSwiping = false;
      this.setState();
    }
    /**
     * Get swiping distance in percents
     * @return {number}
     */

  }, {
    key: "caclPercetageDistance",
    value: function caclPercetageDistance() {
      return this.state.swipingDistance / this.state.width * 100;
    }
  }]);

  return Slider;
}();

exports.default = Slider;
},{}],"js/app.js":[function(require,module,exports) {
"use strict";

var _Slider = _interopRequireDefault(require("./Slider.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _Slider.default();
},{"./Slider.js":"js/Slider.js"}],"../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55290" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=/app.c3f9f951.js.map