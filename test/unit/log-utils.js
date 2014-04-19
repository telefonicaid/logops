/*
 * Copyright 2014 Telefonica Investigación y Desarrollo, S.A.U
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

/**
 * Function that parses the TDAF log format.
 *
 * @param trace
 */
var parseLog = function parseLog(trace) {
  var pattern = /^time=(\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) \| lvl=(INFO|WARN|ERROR|FATAL|DEBUG) \| corr=(.*) \| trans=(.*) \| op=(.*) \| msg=(.*)$/;
  var fields = trace.trim().match(pattern);
  if (fields === null) {
    return false;
  }
  return {
    time: new Date(Date.parse(fields[1])),
    lvl: fields[2],
    corr: fields[3],
    trans: fields[4],
    op: fields[5],
    msg: fields[6]
  };
};

module.exports = { parseLog: parseLog };
