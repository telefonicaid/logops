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

/*jshint -W072*/
'use strict';

var util = require('util');

var notAvailable = 'n/a',
    templateTrace = 'time=%s | lvl=%s | corr=%s | trans=%s | op=%s | msg=';

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
  var log = {};

  args.forEach(function(obj) {
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(function copyProperty(key) {
        log[key] = obj[key];
      });
    }
  });

  log.msg = util.format.apply(global, [message].concat(args)).trim();
  log.time = new Date();
  log.level = level;
  log.v = 0;
  log.pid = process.pid;

  if (context) {
    log.op = context.op;
    log.corr = context.corr;
    log.trans = context.trans;
  }

  return JSON.stringify(log);
}

/**
 * The exported formatters.
 *
 * @type {Object}
 */
module.exports = {
  formatTrace: formatTrace,
  formatDevTrace: formatDevTrace,
  formatJsonTrace: formatJsonTrace
};
