'use strict';

var logger = null;
require('colors');
describe('Format traces with development environment', function() {

  before(function(done) {
    process.env.NODE_ENV = 'development';
    logger = require('../../');
    done();
  });

  it('should have blue color when info trace is formatted', function(done) {
    var message = 'Sample Message';
    var result = logger.format('INFO', null, message, '');
    expect(result).to.be.equal('INFO'.blue + ' ' + message + ' ');
    done();
  });

  it('should have grey color when debug trace is formatted', function(done) {
    var message = 'Sample Message';
    var result = logger.format('DEBUG', null, message, '');
    expect(result).to.be.equal('DEBUG'.grey + ' ' + message + ' ');
    done();
  });

  it('should have yellow color when warn trace is formatted', function(done) {
    var message = 'Sample Message';
    var result = logger.format('WARN', null, message, '');
    expect(result).to.be.equal('WARN'.yellow + ' ' + message + ' ');
    done();
  });

  it('should have red color when error trace is formatted', function(done) {
    var message = 'Sample Message';
    var result = logger.format('ERROR', null, message, '');
    expect(result).to.be.equal('ERROR'.red + ' ' + message + ' ');
    done();
  });

  it('should have fatal style when fatal trace is formatted', function(done) {
    var message = 'Sample Message';
    var result = logger.format('FATAL', null, message, '');
    expect(result).to.be.equal('FATAL'.white.bold.redBG + ' ' + message + ' ');
    done();
  });


  it('should have red color when error trace is formatted and message is an Error instance', function(done) {
    var error = new Error('Sample message');
    var result = logger.format('ERROR', null, error, '');
    expect(result).to.be.equal('ERROR'.red + ' ' + error.stack);
    done();
  });


  it('should have red color when error trace is formatted' +
    ' and message is an Error instance without stack', function(done) {
    var error = new Error('Sample message');
    error.stack = null;
    var result = logger.format('ERROR', null, error, '');
    expect(result).to.be.equal('ERROR'.red + ' ' + error.toString());
    done();
  });

  after(function(done) {
    process.env.NODE_ENV = 'production';
    delete require.cache[require.resolve('../../')];
    done();
  });
});
