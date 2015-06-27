
/**
 * Function that parses the TDAF log format.
 *
 * @param {String} trace Log trace.
 *
 * @return {Object} parsedTrace Javascript object of TDAF formatted trace.
 *
 */
/*jshint -W101*/
var parseLog = function parseLog(trace) {
  var patternStr = '^time=(\\d{4}\\-\\d{2}\\-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z) \\|' +
      ' lvl=(INFO|WARN|ERROR|FATAL|DEBUG) \\| corr=(.*) \\| trans=(.*) \\| op=(.*) \\| msg=(.*)$';
  var pattern = new RegExp(patternStr);
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

/**
 * The exported parseLog method.
 *
 * @type {Object}
 */
module.exports = { parseLog: parseLog };
