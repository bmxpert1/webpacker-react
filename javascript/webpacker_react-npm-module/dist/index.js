'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _client = require('react-dom/client');

var _intersection = require('lodash/intersection');

var _intersection2 = _interopRequireDefault(_intersection);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _ujs = require('./ujs');

var _ujs2 = _interopRequireDefault(_ujs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CLASS_ATTRIBUTE_NAME = 'data-react-class';
var PROPS_ATTRIBUTE_NAME = 'data-react-props';

var WebpackerReact = {
  registeredComponents: {},
  renderedRoots: [],

  render: function render(node, component) {
    var propsJson = node.getAttribute(PROPS_ATTRIBUTE_NAME);
    var props = propsJson && JSON.parse(propsJson);

    var reactElement = _react2.default.createElement(component, props);
    var root = (0, _client.createRoot)(node);

    root.render(reactElement);
    this.renderedRoots.push(root);
  },
  registerComponents: function registerComponents(components) {
    var collisions = (0, _intersection2.default)((0, _keys2.default)(this.registeredComponents), (0, _keys2.default)(components));
    if (collisions.length > 0) {
      console.error('webpacker-react: can not register components. Following components are already registered: ' + collisions);
    }

    (0, _assign2.default)(this.registeredComponents, (0, _omit2.default)(components, collisions));
    return true;
  },
  unmountComponents: function unmountComponents() {
    for (var i = 0; i < this.renderedRoots.length; i++) {
      this.renderedRoots[i].unmount();
    }
    this.renderedRoots = [];
  },
  mountComponents: function mountComponents() {
    var registeredComponents = this.registeredComponents;

    var toMount = document.querySelectorAll('[' + CLASS_ATTRIBUTE_NAME + ']');

    for (var i = 0; i < toMount.length; i += 1) {
      var node = toMount[i];
      var className = node.getAttribute(CLASS_ATTRIBUTE_NAME);
      var component = registeredComponents[className];

      if (component) {
        if (node.innerHTML.length === 0) this.render(node, component);
      } else {
        console.error('webpacker-react: can not render a component that has not been registered: ' + className);
      }
    }
  },
  setup: function setup() {
    var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (typeof window.WebpackerReact === 'undefined') {
      window.WebpackerReact = this;
      _ujs2.default.setup(this.mountComponents.bind(this), this.unmountComponents.bind(this));
    }

    window.WebpackerReact.registerComponents(components);
    window.WebpackerReact.mountComponents();
  }
};

exports.default = WebpackerReact;