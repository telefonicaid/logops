/**
 * @license
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
 */

/*jshint -W072*/
'use strict';

var util = require('util'),
    colors = require('colors/safe');

var DEFAULT_NOT_AVAILABLE = 'n/a';

var notAvailable = DEFAULT_NOT_AVAILABLE,
    templateTrace = 'time=%s | lvl=%s | corr=%s | trans=%s | op=%s | msg=';

/**
 * The exported formatters.
 *
 * @type {Object}
 */
var API = module.exports = {
  pipe: formatTrace,
  dev: formatDevTrace,
  json: formatJsonTrace,
  setNotAvailable: setNotAvailable,
  getFullErrorStack: getFullErrorStack
};
/**
 * Sets a value for those fields that are not available in the context. This field
 * will only be used in the 'pipes' formatter.
 *
 * @param {String} na New value for not available fields.
 * @deprecated
 */
function setNotAvailable(na) {
  notAvailable = na;
}

/**
 * Formats a trace message with some nice TTY colors
 *
 * @param {String} level One of the following values
 *      ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
 * @param {Object} context Additional information to add to the trace
 * @param {String} message The main message to be added to the trace
 * @param {Array} args More arguments provided to the log function
 * @param {Error|null} err A cause error used to log extra information
 *
 * @return {String} The trace formatted
 */
function formatDevTrace(level, context, message, args, err) {
  var str;
  switch (level) {
    case 'DEBUG':
      str = colors.grey(level);
      break;
    case 'INFO':
      str = colors.blue(level);
      break;
    case 'WARN':
      str = colors.yellow(level);
      break;
    case 'ERROR':
      str = colors.red(level);
      break;
    case 'FATAL':
      str = colors.white.bold.redBG(level);
      break;
  }
  str += ' ';
  str += util.format.apply(global, [message].concat(args));
  str += err ? '\n' + API.getFullErrorStack(err, level) : '';
  return str;
}

/**
 * Formats a trace message with fields separated by pipes.
 *
 * DEPRECATED!
 *
 * @param {String} level One of the following values
 *      ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
 * @param {Object} context Additional information to add to the trace
 * @param {String} message The main message to be added to the trace
 * @param {Array} args More arguments provided to the log function
 * @param {Error|null} err A cause error used to log extra information
 *
 * @return {String} The trace formatted
 * @deprecated
 */
function formatTrace(level, context, message, args, err) {
  args.unshift(
      templateTrace + message,
      (new Date()).toISOString(),
      level,
      context.corr || notAvailable,
      context.trans || notAvailable,
      context.op || notAvailable
  );
  if (err && message !== '' + err) {
    args.push(err);
  }

  return util.format.apply(global, args);
}

/**
 * Formats a trace message in JSON format
 *
 * @param {String} level One of the following values
 *      ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
 * @param {Object} context Additional information to add to the trace
 * @param {String} message The main message to be added to the trace
 * @param {Array} args More arguments provided to the log function
 * @param {Error|null} err A cause error used to log extra information
 *
 * @return {String} The trace formatted
 */
function formatJsonTrace(level, context, message, args, err) {
  var log = {};

  for (var attrname in context) {
    log[attrname] = context[attrname];
  }

  log.time = new Date();
  log.lvl = level;
  log.err = serializeErr(err, level);
  log.msg = util.format.apply(global, [message].concat(args));

  return JSON.stringify(log);
}

/**
 * Serializes an error as a literal object
 *
 * @param {Error} err The error to serialize
 * @returns {*}
 */
function serializeErr(err, level) {
  if (!(err instanceof Error)) {
    return err;
  }

  // add the enumerable error properties to the serialized err
  var ret = Object.keys(err).reduce(function(memo, key) {
    memo[key] = err[key];
    return memo;
  }, {});

  // and add common ones
  ret.message = err.message;
  ret.name = err.name;
  ret.constructor = err.constructor.name;
  ret.stack = API.getFullErrorStack(err, level);

  return ret;
}

/*
 * Dumps long stack traces for exceptions having a cause() method when the desired
 * trace has a FATAL or ERROR level
 *
 * The error classes from
 * [verror](https://github.com/davepacheco/node-verror) and
 * [restify v2.0](https://github.com/mcavage/node-restify) are examples.
 *
 * Based on `dumpException` in
 * https://github.com/davepacheco/node-extsprintf/blob/master/lib/extsprintf.js
 *
 * @param {Error} err The error
 * @param {String} level One of the following values
 *      ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
 */
function getFullErrorStack(err, level) {
  var ret = '';
  if (!err) {
    return ret;
  }

  if (level === 'FATAL' || level === 'ERROR') {
    ret += err.stack || err;
  } else {
    ret += err;
  }

  if (err.cause && typeof (err.cause) === 'function') {
    var cex = err.cause();
    if (cex) {
      ret += '\nCaused by: ' + API.getFullErrorStack(cex, level);
    }
  }
  return ret;
}
