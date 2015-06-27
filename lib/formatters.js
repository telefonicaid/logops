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

var util = require('util');

var DEFAULT_NOT_AVAILABLE = 'n/a';

var notAvailable = DEFAULT_NOT_AVAILABLE,
    templateTrace = 'time=%s | lvl=%s | corr=%s | trans=%s | op=%s | msg=';

/**
 * Sets a value for those fields that are not available in the context. This field
 * will only be used in the 'pipes' formatter.
 *
 * @param {String} na New value for not available fields.
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
 * Formats a trace message with fields separated by pipes.
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
 * Counts the number of placeholders (%s, %d, %j) in a String
 *
 * @param {String} str Input string
 *
 * @return {Number} The number of placeholders found
 */
function countPlaceholders(str) {
  var formatRegExp = /%[sdj%]/g;

  var placeholders = 0;

  // use replace to go one by one and exclude '%%' and other combinations
  String(str).replace(formatRegExp, function(x) {
    if (['%s', '%d', '%j'].indexOf(x) >= 0) {
      placeholders++;
    }
    return x;
  });

  return placeholders;
}

/**
 * Formats a trace message in JSON format
 *
 * @param {String} level One of the following values
 *      ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
 * @param {Object} context Additional information to add to the trace
 * @param {String} message The main message to be added to the trace
 * @param {Array} args More arguments provided to the log function
 *
 * @return {String} The trace formatted
 */
function formatJsonTrace(level, context, message, args) {
  var log = {
        time: new Date(),
        lvl: level,
        corr: context.corr || null,
        trans: context.trans || null,
        op: context.op || null
      },
      placeholders = countPlaceholders(message),
      printableArgs = args.splice(0, placeholders);// XXX splice modifies args,

  args.forEach(function(obj, index) {
    //Literal objects will be appended to the log object. Keep others in the message
    if (Object.prototype.toString.call(obj) !== '[object Object]' &&
        typeof obj.toJSON !== 'function') {
      printableArgs = printableArgs.concat(args.splice(index, 1));
    }
  });

  log.msg = util.format.apply(global, [message].concat(printableArgs)).trim();

  args.forEach(function(obj) {
    obj = typeof obj.toJSON === 'function' ? obj.toJSON() : obj;
    Object.keys(obj).forEach(function copyProperty(key) {
      if (typeof log[key] === 'undefined') {
        log[key] = obj[key];
      }
    });
  });

  return JSON.stringify(log);
}

/**
 * The exported formatters.
 *
 * @type {Object}
 */
module.exports = {
  pipe: formatTrace,
  dev: formatDevTrace,
  json: formatJsonTrace,
  setNotAvailable: setNotAvailable
};
