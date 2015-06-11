/*
 * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
 *
 * @license
 */

'use strict';

var formatters = require('./formatters');

require('colors');

var levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'],
    DEFAULT_LEVEL = 'INFO',
    API = {};

/*
 * Shorcuts
 */
var toString = Object.prototype.toString,
    noop = function noop() {};

/**
 * Internal private function that implements a decorator to all
 * the level functions.
 *
 * Checks the parameters to support the following API:
 *   //Passing context with every call
 *   //plain strings
 *   logger.info(context, 'This', 'is', 'an', 'example');
 *
 *   //util.format support
 *   logger.info(context, 'Request %s %d %j', 'is', 5, {key: 'value'});
 *
 *   //error as first parameter
 *   logger.info(context, new Error('This is an example'));
 *
 *   //Use a logger.getContext for context information
 *   //plain strings
 *   logger.info('This', 'is', 'an', 'example');
 *
 *   //util.format support
 *   logger.info('Request %s %d %j', 'is', 5, {key: 'value'});
 *
 *   //error as first parameter
 *   logger.info(new Error('This is an example'));
 *
 * @param {String} level one of
 *   ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
 */
function logWrap(level) {
  var context, message, args, trace;

  if (toString.call(arguments[1]) === '[object String]' ||
    arguments[1] instanceof Error) {
    context = API.getContext();
    message = arguments[1];
    args = Array.prototype.slice.call(arguments, 2);
  } else if (toString.call(arguments[1]) === '[object Object]') {
    context = arguments[1];
    message = arguments[2];
    args = Array.prototype.slice.call(arguments, 3);
  }

  trace = API.format(level, context || {}, message, args);
  API.stream.write(trace + '\n');
}

/**
 * Sets the enabled logging level.
 * All the disabled logging methods are replaced by a noop,
 * so there is not any performance penalty at production using an undesired level
 *
 * @param {String} level
 */
function setLevel(level) {
  level = level || DEFAULT_LEVEL;
  var logLevel = levels.indexOf(level.toUpperCase());

  levels.forEach(function iterator(level) {
    var fn;
    if (logLevel <= levels.indexOf(level)) {
      fn = logWrap.bind(global, level);
    } else {
      fn = noop;
    }
    API[level.toLowerCase()] = fn;
  });
}

/**
 * The exported API.
 * The following methods are added dynamically
 * API.debug
 * API.info
 * API.warn
 * API.error
 * API.fatal
 *
 * @type {Object}
 */
module.exports = API = {
  /**
   * The stream where the logger will write string traces
   * Defaults to process.stdout
   */
  stream: process.stdout,

  /**
   * Sets the enabled logging level.
   * All the disabled logging methods are replaced by a noop,
   * so there is not any performance penalty at production using an undesired level
   *
   * @param {String} level one of the following values
   *     ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
   */
  setLevel: setLevel,

  /**
   * Gets the context for a determinate trace. By default, this is a noop that
   * you can override if you are managing your execution context with node domains
   *
   * This function must return an object with the following fields
   * {
   *   corr: {String},
   *   trans: {String},
   *   op: {String}
   * }
   *
   * If you are not using domain, you should pass the context information for
   * EVERY log call
   *
   * Both examples will produce the same trace
   *
   * Example usage not using getContext:
   *   var logger = require('logops');
   *   req.context = {
   *    corr: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
   *    trans: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
   *    op: 'SendEMail'
   *   }
   *   logger.info(req.context, 'This is an example');
   *
   * Example using this feature:
   *    var logger = require('logops'),
   *        domain = require('domain');
   *
   *    logger.getContext = function domainContext() {
   *        return domain.active.myCustomContext;
   *    }
   *    //...
   *
   *    logger.info('This is an example');
   *
   * @return {Object} The context object
   */
  getContext: noop,

  /**
   * Return a String representation for a trace.
   * Checks the 'de-facto' NODE_ENV variable to use the built-in
   * format functions.
   * Therefore, if you execute your node app the following way:
   *   NODE_ENV=development node index.js
   * the logger will write traces for developers
   *
   * Otherwise it will use JSON format by default.
   *
   * You can override this func and manage by yourself the formatting taking
   * into account your own environment variables
   *
   * @param {String} level One of the following values
   *      ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
   * @param {Object} context Additional information to add to the trace
   * @param {String} message The main message to be added to the trace
   * @param {Array} args More arguments provided to the log function
   *
   * @return {String} The trace formatted
   */
  format: process.env.NODE_ENV === 'development' ?
      formatters.dev :
      formatters.json,

  /**
   * Return an Object containing the available formatters ("dev", "pipe", "json").
   *
   * Example using this feature to write JSON logs.
   *
   * var logger = require('logops');
   * logger.format = logger.formatters.json;
   * logger.info('This is an example')
   *
   * @return {Object} The available formatters.
   */
  formatters: formatters
};

setLevel(DEFAULT_LEVEL);
