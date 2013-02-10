define([], function() {
  'use strict';

  /**
   * console.*
   */
  (function() {
    var method;
    var noop = function() {};
    var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
      method = methods[length];

      // Only stub undefined methods.
      if (!console[method]) {
        console[method] = noop;
      }
    }
  }());

  /**
   * Function.prototype.bind
   */
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(ctx) {
      var that = this;
      var args = Array.prototype.slice.call(arguments, 1);

      return function() {
        return that.apply(ctx, args.concat(
          Array.prototype.slice.call(arguments)));
      };
    };
  }

  /**
   * trim
   */
  if(!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }

  /**
   * Array.prototype.indexOf
   */
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    }
  }

  /**
   * Object.keys
   */
  if (!Object.keys) {
    Object.keys = (function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
      dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      dontEnumsLength = dontEnums.length;

      return function (obj) {
        if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
          throw new TypeError('Object.keys called on non-object');
        }

        var result = [];

        for (var prop in obj) {
          if (hasOwnProperty.call(obj, prop)) result.push(prop);
        }

        if (hasDontEnumBug) {
          for (var i=0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])){
              result.push(dontEnums[i]);
            }
          }
        }

        return result;
      };
    })();
  }

  /**
   * Date.now
   */
  if (!Date.now) {
    Date.now = function now() {
      return +(new Date);
    };
  }
  /**
   * Request animation frame
   */
  (function(w) {
    var lastTime = 0;
    var v = ['ms', 'moz', 'webkit', 'o', ''];
    for (var x = 0; x < v.length && !w.requestAnimationFrame; ++x) {
      w.requestAnimationFrame = w[v[x] + 'RequestAnimationFrame'];
      w.cancelAnimationFrame = w[v[x] + 'CancelAnimationFrame'] ||
      w[v[x] + 'CancelRequestAnimationFrame'];
    }

    if (!w.requestAnimationFrame)
    w.requestAnimationFrame = function(callback, element) {
      var currTime = +new Date();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = w.setTimeout(function() {
        callback(currTime + timeToCall); }, timeToCall);

      lastTime = currTime + timeToCall;
      return id;
    };

    if (!w.cancelAnimationFrame)
    w.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }(window));

});
