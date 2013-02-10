define([], function() {
  'use strict';

  var w = window;
  var d = document;
  /**
   * User agent string
   *
   * @private
   * @type {string}
   */
  var ua = w.navigator.userAgent; 

  /**
   * Returns the version of Internet Explorer or a -1.
   * (indicating the use of another browser).
   * 
   * @private
   * @return {number} Version of IE or -1 if not ie;
   */
  function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");

    if (re.exec(ua) != null) {
      rv = parseFloat(RegExp.$1);
    }

    return rv;
  }

  /**
   * Test if string contains other string.
   *
   * @private
   * @param {string} str Text which will be tested if contains substr.
   * @param {string} substr Text which will be looking for inside str.
   * @return {boolean} true|false depends on the result.
   */
  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  }

  /**
   * Detect transition property name.
   *
   * @private
   * @return {string|undefined} Return property name or undefined if transition is not supported.
   */
  function detectTransitionPropertyName() {
    var name = undefined;
    var prefixes = 'Webkit Moz O ms'.split(' ');  
    var property = 'transition';
    var ucProproperty = 'Transition';
    var properties = (property + ' ' + prefixes.join(ucProproperty + ' ') + ucProproperty).split(' ');
    var element = d.createElement('asdf');


    for (var key in properties) {
      if (properties.hasOwnProperty(key)) {
        property = properties[key];
        if (element.style[property] !== undefined ) {
          name = property;
          break;
        }
      }
    }

    return name;
  };

  /**
   * Transition property name.
   *
   * @private
   * @type {string|undefined}
   */
  var transitionPropertyName = detectTransitionPropertyName();

  /**
   * Version of IE.
   *
   * @private
   * @type {number}
   */
  var versionIE = getInternetExplorerVersion();

  /**
   * Object which contains browser vendor and feature detection properties.
   *
   * @type {object}
   */
  return {
    /**
     * Bunch of browser vendor detect properties.
     */
    isOldIE: versionIE != -1 && versionIE < 8,
    isIE: versionIE != -1,
    isIE8: versionIE == 8,
    isGecko: ua.indexOf('Gecko') != -1,
    isOpera: w.opera || ua.indexOf('Opera') != -1,

    /**
     * Expose transition property name outside the scope.
     *
     * @type {string}
     */
    transitionPropertyName: transitionPropertyName, 

    /**
     * Contain the name of transition event.
     *
     * @type {string}
     */
    transitionEventName: (function () {
      var transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd',
        'msTransition'     : 'MSTransitionEnd',
        'transition'       : 'transitionend'
      };

      return transEndEventNames[transitionPropertyName];
    }()),

    /**
     * Flag if browser supports css3 transition property.
     *
     * @type {boolean}
     */
    hasTransition: typeof transitionPropertyName != 'undefined'  
  };
});
