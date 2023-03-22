'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// This module is an adapted version from rails-ujs module
// implemented in http://github.com/reactjs/react-rails
// which is distributed under Apache License 2.0

var ujs = {
  handleEvent: function handleEvent(eventName, callback) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { once: false },
        once = _ref.once;

    var $ = typeof window.jQuery !== 'undefined' && window.jQuery;

    if ($) {
      if (once) {
        $(document).one(eventName, callback);
      } else {
        $(document).on(eventName, callback);
      }
    } else {
      document.addEventListener(eventName, callback, { once: once });
    }
  },
  setup: function setup(onMount, onUnmount) {
    var $ = typeof window.jQuery !== 'undefined' && window.jQuery;
    var _window = window,
        Turbolinks = _window.Turbolinks;

    // Detect which kind of events to set up:

    if (typeof Turbolinks !== 'undefined' && Turbolinks.supported) {
      if (typeof Turbolinks.EVENTS !== 'undefined') {
        // Turbolinks.EVENTS is in classic version 2.4.0+
        this.turbolinksClassic(onMount, onUnmount);
      } else if (typeof Turbolinks.controller !== 'undefined') {
        // Turbolinks.controller is in version 5+
        this.turbolinks5(onMount, onUnmount);
      } else {
        this.turbolinksClassicDeprecated(onMount, onUnmount);
      }
    } else if ($ && typeof $.pjax === 'function') {
      this.pjax(onMount, onUnmount);
    } else {
      this.native(onMount);
    }
  },
  turbolinks5: function turbolinks5(onMount, onUnmount) {
    this.handleEvent('turbolinks:load', onMount, { once: true });
    this.handleEvent('turbolinks:render', onMount);
    this.handleEvent('turbolinks:before-render', onUnmount);
  },
  turbolinksClassic: function turbolinksClassic(onMount, onUnmount) {
    var _window2 = window,
        Turbolinks = _window2.Turbolinks;


    this.handleEvent(Turbolinks.EVENTS.CHANGE, onMount);
    this.handleEvent(Turbolinks.EVENTS.BEFORE_UNLOAD, onUnmount);
  },
  turbolinksClassicDeprecated: function turbolinksClassicDeprecated(onMount, onUnmount) {
    // Before Turbolinks 2.4.0, Turbolinks didn't
    // have named events and didn't have a before-unload event.
    // Also, it didn't work with the Turbolinks cache, see
    // https://github.com/reactjs/react-rails/issues/87
    var _window3 = window,
        Turbolinks = _window3.Turbolinks;

    Turbolinks.pagesCached(0);
    this.handleEvent('page:change', onMount);
    this.handleEvent('page:receive', onUnmount);
  },
  pjax: function pjax(onMount, onUnmount) {
    this.handleEvent('ready', onMount);
    this.handleEvent('pjax:end', onMount);
    this.handleEvent('pjax:beforeReplace', onUnmount);
  },
  native: function native(onMount) {
    var $ = typeof window.jQuery !== 'undefined' && window.jQuery;
    if ($) {
      $(function () {
        return onMount();
      });
    } else if ('addEventListener' in window) {
      document.addEventListener('DOMContentLoaded', onMount);
    } else {
      // add support to IE8 without jQuery
      window.attachEvent('onload', onMount);
    }
  }
};

exports.default = ujs;