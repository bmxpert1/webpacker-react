'use strict';

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureHotModuleReplacement(origConfig) {
  var config = origConfig;
  config.module.rules = config.module.rules.map(function (rule) {
    if (rule.loader === 'babel-loader') {
      return (0, _webpackMerge2.default)(rule, { options: { plugins: ['react-hot-loader/babel'] } });
    }
    return rule;
  });

  return config;
}

module.exports = configureHotModuleReplacement;