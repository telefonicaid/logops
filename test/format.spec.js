'use strict';

var logger = null,
    context = {};

require('colors');

describe('Format traces with development environment', function() {

  before(function(done) {
    delete process.env.LOGOPS_FORMAT;
    process.env.NODE_ENV = 'development';
    logger = require('../lib/logops');
    done();
  });

  it('should have blue color when info trace is formatted', function(done) {
    var message = 'Sample Message';
    var result = logger.format('INFO', context, message, '');
    expect(result).to.be.equal('INFO'.blue + ' ' + message + ' ');
    done();
  });

  it('should have grey color when debug trace is formatted', function(done) {
    var message = 'Sample Message';
    var result = logger.format('DEBUG', context, message, '');
    expect(result).to.be.equal('DEBUG'.grey + ' ' + message + ' ');
    done();
  });

  it('should have yellow color when warn trace is formatted', function(done) {
    var message = 'Sample Message';
    var result = logger.format('WARN', context, message, '');
    expect(result).to.be.equal('WARN'.yellow + ' ' + message + ' ');
    done();
  });

  it('should have red color when error trace is formatted', function(done) {
    var message = 'Sample Message';
    var result = logger.format('ERROR', context, message, '');
    expect(result).to.be.equal('ERROR'.red + ' ' + message + ' ');
    done();
  });

  it('should have fatal style when fatal trace is formatted', function(done) {
    var message = 'Sample Message';
    var result = logger.format('FATAL', context, message, '');
    expect(result).to.be.equal('FATAL'.white.bold.redBG + ' ' + message + ' ');
    done();
  });

  it('should have red color when error trace is formatted and message is an Error instance', function(done) {
    var error = new Error('Sample message');
    var result = logger.format('ERROR', context, error, '');
    expect(result).to.be.equal('ERROR'.red + ' ' + error.stack);
    done();
  });

  it('should have red color when error trace is formatted' +
    ' and message is an Error instance without stack', function(done) {
    var error = new Error('Sample message');
    error.stack = null;
    var result = logger.format('ERROR', context, error, '');
    expect(result).to.be.equal('ERROR'.red + ' ' + error.toString());
    done();
  });

  after(function(done) {
    process.env.NODE_ENV = 'production';
    delete require.cache[require.resolve('../')];
    done();
  });
});

describe('Select value for not available fields', function() {
  before(function(done) {
    logger = require('../lib/logops');
    done();
  });

  it('should log a custom value', function(done) {
    logger.formatters.setNotAvailable('NOTAVAILABLE');

    var result = logger.format('INFO', context, 'Message', []);
    expect(result.indexOf('corr=NOTAVAILABLE')).to.be.gt(0);
    expect(result.indexOf('trans=NOTAVAILABLE')).to.be.gt(0);
    expect(result.indexOf('op=NOTAVAILABLE')).to.be.gt(0);
    done();
  });

  after(function(done) {
    logger.formatters.setNotAvailable('n/a'); // restore default value
    delete require.cache[require.resolve('../')];
    done();
  });
});

describe('Select log format with an env variable', function() {
  before(function(done) {
    delete process.env.LOGOPS_FORMAT;
    done();
  });

  it('should select "json" format', function(done) {
    process.env.LOGOPS_FORMAT = 'json';
    logger = require('../lib/logops');

    expect(logger.format).to.be.equal(logger.formatters.json);
    done();
  });

  it('should select "dev" format', function(done) {
    process.env.LOGOPS_FORMAT = 'dev';
    logger = require('../lib/logops');

    expect(logger.format).to.be.equal(logger.formatters.dev);
    done();
  });

  it('should select "pipe" format', function(done) {
    process.env.LOGOPS_FORMAT = 'pipe';
    logger = require('../lib/logops');

    expect(logger.format).to.be.equal(logger.formatters.pipe);
    done();
  });

  afterEach(function(done) {
    delete require.cache[require.resolve('../')];
    done();
  });
});

describe('Format traces in JSON format', function() {
  before(function(done) {
    process.env.NODE_ENV = 'development';
    logger = require('../lib/logops');
    logger.format = logger.formatters.json;
    done();
  });

  it('should log a simple message as JSON', function(done) {
    var message = 'Sample Message';
    var result = logger.format('INFO', context, message, []);
    var resultJson = JSON.parse(result);

    expect(resultJson.lvl).to.be.equal('INFO');
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
    var result = logger.format('INFO', context, '', [message]);
    var resultJson = JSON.parse(result);
    expect(resultJson.number).to.be.equal(42);

    var date = new Date(resultJson.date);
    expect(date).to.exist;

    expect(resultJson.nested.john).to.be.equal('snow');
    expect(resultJson.nested.stannis).to.be.equal('baratheon');
    done();
  });

  it('should log two custom objects as JSON', function(done) {
    var obj1 = {a: 1};
    var obj2 = {b: 2};

    var result = logger.format('INFO', context, '', [obj1, obj2]);
    var resultJson = JSON.parse(result);
    expect(resultJson.a).to.be.equal(1);
    expect(resultJson.b).to.be.equal(2);

    done();
  });

  it('should log as JSON with a context', function(done) {
    var message = 'Sample Message';

    var context = {
      corr: 'fake_corr',
      trans: 'fake_trans',
      op: 'fake_op'
    };
    var result = logger.format('INFO', context, message, []);
    var resultJson = JSON.parse(result);

    expect(resultJson.corr).to.be.equal('fake_corr');
    expect(resultJson.trans).to.be.equal('fake_trans');
    expect(resultJson.op).to.be.equal('fake_op');

    done();
  });

  it('should log as JSON with extra args', function(done) {
    var message = 'Sample Message %d %s';
    var result = logger.format('INFO', context, message, [1234, 'fakearg']);
    var resultJson = JSON.parse(result);

    expect(resultJson.msg).to.be.equal('Sample Message 1234 fakearg');
    done();
  });

  it('should log as JSON with placeholders', function(done) {
    var obj1 = {a: 1};
    var obj2 = {b: 2};

    var result = logger.format('INFO', context, 'placeholder %d %j', [123, obj1, obj2]);
    var resultJson = JSON.parse(result);

    expect(resultJson.msg).to.equal('placeholder 123 {\"a\":1}');
    expect(resultJson.a).to.not.exist; // the first object goes to the placeholder
    expect(resultJson.b).to.be.equal(2);

    done();
  });

  it('should log as JSON with placeholders', function(done) {
    var obj1 = {a: 1};
    var obj2 = {toJSON: function() { return {b: 2}; }};

    var result = logger.format('INFO', context, 'placeholder %d %j', [123, obj1, obj2]);
    var resultJson = JSON.parse(result);

    expect(resultJson.msg).to.equal('placeholder 123 {\"a\":1}');
    expect(resultJson.a).to.not.exist; // the first object goes to the placeholder
    expect(resultJson.b).to.be.equal(2);

    done();
  });

  it('should log as JSON in the message not literal objects', function(done) {
    var obj1 = {a: 1};

    var result = logger.format('INFO', context, 'placeholder', [obj1, 123]);
    var resultJson = JSON.parse(result);

    expect(resultJson.msg).to.equal('placeholder 123');
    expect(resultJson.a).to.be.equal(1);

    done();
  });

  after(function(done) {
    delete require.cache[require.resolve('../')];
    done();
  });
});
