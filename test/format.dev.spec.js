'use strict';

var logger = require('../lib/logops');

describe('Format traces with development one', function() {
  var context = {};

  before(function() {
    logger.format = logger.formatters.dev;
  });

  it('should have blue color when info trace is formatted', function() {
    var message = 'Sample Message';
    var result = logger.format('INFO', context, message, []);
    expect(result).to.be.equal('INFO'.blue + ' ' + message);
  });

  it('should have grey color when debug trace is formatted', function() {
    var message = 'Sample Message';
    var result = logger.format('DEBUG', context, message, []);
    expect(result).to.be.equal('DEBUG'.grey + ' ' + message);
  });

  it('should have yellow color when warn trace is formatted', function() {
    var message = 'Sample Message';
    var result = logger.format('WARN', context, message, []);
    expect(result).to.be.equal('WARN'.yellow + ' ' + message);
  });

  it('should have red color when error trace is formatted', function() {
    var message = 'Sample Message';
    var result = logger.format('ERROR', context, message, []);
    expect(result).to.be.equal('ERROR'.red + ' ' + message);
  });

  it('should have fatal style when fatal trace is formatted', function() {
    var message = 'Sample Message';
    var result = logger.format('FATAL', context, message, []);
    expect(result).to.be.equal('FATAL'.white.bold.redBG + ' ' + message);
  });

  it('should have red color when error trace is formatted and message is an Error instance', function() {
    var error = new Error('Sample message');
    var result = logger.format('ERROR', context, error, []);
    expect(result).to.be.equal('ERROR'.red + ' ' + error.stack);
  });

  it('should have red color when error trace is formatted' +
      ' and message is an Error instance without stack', function() {
    var error = new Error('Sample message');
    error.stack = null;
    var result = logger.format('ERROR', context, error, []);
    expect(result).to.be.equal('ERROR'.red + ' ' + error.toString());
  });
});