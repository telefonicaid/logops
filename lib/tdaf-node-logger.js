/*
 * Copyright 2013 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of tdaf-node-logger
 *
 * tdaf-node-logger is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * tdaf-node-logger is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with tdaf-node-logger.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[contacto@tid.es]
 */

/*jshint -W072*/
'use strict';

var util = require('util');

require('colors');

var levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'],
    notAvailable = 'n/a',
    templateTrace = 'time=%s | lvl=%s | corr=%s | trans=%s | op=%s | msg=',
    API = {};

/*
 * Shorcuts
 */
var toString = Object.prototype.toString,
    noop = function noop() {};

/**
 * Formats a trace message with some nice TTY colors
 *
 * @param {String} level One of the following values
 *      ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
 * @param {Object} context Additional information to add to the trace
 * @param {String} message The main message to be added to the trace
 * @param {Array} args More arguments provided to the log function
 *
 * @return {String} The trace formatted
 */
function formatDevTrace(level, context, message, args) {
  var str;
  switch (level) {
    case 'DEBUG':
      str = level.grey;
      break;
    case 'INFO':
      str = level.blue;
      break;
    case 'WARN':
      str = level.yellow;
      break;
    case 'ERROR':
      str = level.red;
      break;
    case 'FATAL':
      str = level.white.bold.redBG;
      break;
  }
  str += ' ';
  if (message instanceof Error) {
    str += message.stack || message.toString();
  } else {
    str += util.format.apply(global, [message].concat(args));
  }
  return str;
}

/**
 * Follows the http://wikis.hi.inet/tdaf/index.php/OP%26S#Log_Format
 *
 * @param {String} level One of the following values
 *      ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
 * @param {Object} context Additional information to add to the trace
 * @param {String} message The main message to be added to the trace
 * @param {Array} args More arguments provided to the log function
 *
 * @return {String} The trace formatted
 */
function formatTrace(level, context, message, args) {
  args.unshift(
      templateTrace + message,
      (new Date()).toISOString(),
      level,
      context.corr || notAvailable,
      context.trans || notAvailable,
      context.op || notAvailable
  );
  return util.format.apply(global, args);
}


/**
 * Internal private function that implements a decorator to all
 * the level functions.
 *
 * Checks the parameters to support the following api:
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
 *
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
  level = level || 'INFO';
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
   *   var logger = require('tdaf-node-logger');
   *   req.context = {
   *    corr: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
   *    trans: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
   *    op: 'SendEMail'
   *   }
   *   logger.info(req.context, 'This is an example');
   *
   * Example using this feature:
   *    var logger = require('tdaf-node-logger'),
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
   * Otherwise,
   *   node index.js
   *
   * Will use the format specified by our operations team in
   * http://wikis.hi.inet/tdaf/index.php/OP%26S#Log_Format
   *
   * You can override this func and manage by yourself the formatting taking
   * into account your own environment variables
   *
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
      formatDevTrace :
      formatTrace
};

setLevel('INFO');
