'use strict';

var logger = require('../lib/logops');

describe('Format traces in pipe format', function() {
  var context;
  before(function() {
    logger.format = logger.formatters.pipe;
    context = {};
  });
});
