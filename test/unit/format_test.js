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

describe('Format traces in JSON format', function() {
  before(function(done) {
    process.env.NODE_ENV = 'development';
    logger = require('../../');
    logger.format = require('../../lib/formatters').formatJsonTrace;
    done();
  });

  it('should log a simple message as JSON', function(done) {
    var message = 'Sample Message';
    var result = logger.format('INFO', null, message, '');
    var resultJson = JSON.parse(result);

    expect(resultJson.level).to.be.equal('INFO');
    expect(resultJson.msg).to.be.equal(message);

    expect(resultJson.corr).to.not.exist;
    expect(resultJson.trans).to.not.exist;
    expect(resultJson.op).to.not.exist;

    var date = new Date(resultJson.time);
    expect(date).to.exist;
    done();
  });

  it('should log a custom object as JSON', function(done) {
    var message = {
      number: 42,
      date: new Date(),
      nested: {
        john: 'snow',
        stannis: 'baratheon'
      }
    };
    var result = logger.format('INFO', null, message, '');
    var resultJson = JSON.parse(result);

    expect(resultJson.number).to.be.equal(42);

    var date = new Date(resultJson.date);
    expect(date).to.exist;

    expect(resultJson.nested.john).to.be.equal('snow');
    expect(resultJson.nested.stannis).to.be.equal('baratheon');
    done();
  });

  it('should log as JSON with a context', function(done) {
    var message = 'Sample Message';

    var context = {
      corr: 'fake_corr',
      trans: 'fake_trans',
      op: 'fake_op'
    };
    var result = logger.format('INFO', context, message, '');
    var resultJson = JSON.parse(result);

    expect(resultJson.corr).to.be.equal('fake_corr');
    expect(resultJson.trans).to.be.equal('fake_trans');
    expect(resultJson.op).to.be.equal('fake_op');

    done();
  });

  it('should log as JSON with extra args', function(done) {
    var message = 'Sample Message %d %s';
    var result = logger.format('INFO', null, message, [1234, 'fakearg']);
    var resultJson = JSON.parse(result);

    expect(resultJson.msg).to.be.equal('Sample Message 1234 fakearg');
    done();
  });

  after(function(done) {
    delete require.cache[require.resolve('../../')];
    done();
  });
});
