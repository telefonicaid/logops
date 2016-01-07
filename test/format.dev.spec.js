'use strict';

var logger = require('../lib/logops'),
    util = require('util'),
    colors = require('colors/safe');

describe('Development format', function() {
  var context = {};
  before(function() {
    logger.format = logger.formatters.dev;
  });

  describe('Colors in traces', function() {
    it('should have blue color when info trace is formatted', function() {
      var message = 'Sample Message';
      var result = logger.format('INFO', context, message, []);
      expect(result).to.be.equal(colors.blue('INFO') + '  ' + message);
    });

    it('should have grey color when debug trace is formatted', function() {
      var message = 'Sample Message';
      var result = logger.format('DEBUG', context, message, []);
      expect(result).to.be.equal(colors.grey('DEBUG') + ' ' + message);
    });

    it('should have yellow color when warn trace is formatted', function() {
      var message = 'Sample Message';
      var result = logger.format('WARN', context, message, []);
      expect(result).to.be.equal(colors.yellow('WARN') + '  ' + message);
    });

    it('should have red color when error trace is formatted', function() {
      var message = 'Sample Message';
      var result = logger.format('ERROR', context, message, []);
      expect(result).to.be.equal(colors.red('ERROR') + ' ' + message);
    });

    it('should have fatal style when fatal trace is formatted', function() {
      var message = 'Sample Message';
      var result = logger.format('FATAL', context, message, []);
      expect(result).to.be.equal(colors.red.bold('FATAL') + ' ' + message);
    });
  });


  describe('Logging Messages', function() {
    // Disabling colors for this suite
    var colorsEnabled = colors.enabled;
    before(function() {
      colors.enabled = false;
    });
    after(function() {
      colors.enabled = colorsEnabled;
    });

    it('should log empty strings', function() {
      logger.info('');
      expect(logger._lastTrace).to.be.eql('INFO');
    });

    it('should log undefined', function() {
      logger.info();
      expect(logger._lastTrace).to.be.eql('INFO  undefined');
    });

    it('should log null', function() {
      logger.info(null);
      expect(logger._lastTrace).to.be.eql('INFO  null');
    });

    it('should log empty arrays', function() {
      logger.info([]);
      expect(logger._lastTrace).to.be.eql('INFO  []');
    });

    it('should log objects representation', function() {
      logger.info({}, {});
      expect(logger._lastTrace).to.be.eql('INFO  {} {}');
    });

    it('should log nothing but context', function() {
      logger.info({});
      expect(logger._lastTrace).to.be.eql('INFO  undefined {}');
    });

    it('should log dates', function() {
      var now = new Date();
      logger.info({}, now);
      expect(logger._lastTrace).to.be.eql('INFO  ' + now + ' {}');
    });

    it('should nothing but context with a Data as context', function() {
      var now = new Date();
      logger.info(now);
      expect(logger._lastTrace).to.be.eql('INFO  undefined ' + now);
    });

    it('should log booleans', function() {
      logger.info(false);
      expect(logger._lastTrace).to.be.eql('INFO  false');
      logger.info(true);
      expect(logger._lastTrace).to.be.eql('INFO  true');
    });

    it('should log strings', function() {
      logger.info('Simple Message');
      expect(logger._lastTrace).to.be.eql('INFO  Simple Message');
    });

    it('should log formatted strings', function() {
      logger.info('Format %s %d %j', 'foo', 4, {bar:5});
      expect(logger._lastTrace).to.be.eql('INFO  Format foo 4 {"bar":5}');
    });

    it('should log arrays', function() {
      logger.info(['Sample', 'Array']);
      expect(logger._lastTrace).to.be.eql("INFO  [ 'Sample', 'Array' ]");
    });

    it('should log extra simple params', function() {
      logger.info('Format', 'foo', 4, {bar:5});
      expect(logger._lastTrace).to.be.eql('INFO  Format foo 4 { bar: 5 }');
    });

    it('should add localContext to the trace', function() {
      var ctx = {foo: 'bar'};
      logger.info(ctx, 'Hello %s!', 'darling');
      expect(logger._lastTrace).to.be.eql('INFO  Hello darling! ' + util.inspect(ctx));
    });
  });

  describe('Logging Errors', function() {
    function pad(str) {
      return str.replace(new RegExp('\r?\n','g'), '\n      ')
    }
    var colorsEnabled = colors.enabled;
    before(function() {
      colors.enabled = false;
    });
    after(function() {
      colors.enabled = colorsEnabled;
    });

    it('should log errors without stacktrace', function() {
      var error = new Error('foo');
      logger.info(error);
      expect(logger._lastTrace).to.be.eql(pad('INFO  Error: foo'));
    });

    it('should log errors with stacktrace', function() {
      var error = new Error('foo');
      logger.error(error);
      expect(logger._lastTrace).to.be.eql(pad('ERROR Error: foo\n' + error.stack));
    });

    it('should log errors with stacktrace and cause', function() {
      var error = new Error('foo'), error2 = new Error('bar'), error3 = new Error('baz');
      error2.cause = sandbox.stub().returns(error3);
      error.cause = sandbox.stub().returns(error2);
      logger.error(error);
      expect(logger._lastTrace).to.be.eql(pad([
        'ERROR Error: foo',
        error.stack,
        'Caused by: ' + error2.stack,
        'Caused by: ' + error3.stack
      ].join('\n')));
    });

    it('should log extra errors', function() {
      logger.info('Format', new Error('foo'));
      expect(logger._lastTrace).to.be.eql(pad('INFO  Format [Error: foo]'));
    });

    it('should log errors with extra information without stacktrace', function() {
      var error = new Error('foo');
      logger.info(error, 'Format %s', 'works');
      expect(logger._lastTrace).to.be.eql(pad('INFO  Format works\nError: foo'));
    });

    it('should log errors with extra information and cause', function() {
      var error = new Error('foo'), error2 = new Error('bar'), error3 = new Error('baz');
      error2.cause = sandbox.stub().returns(error3);
      error.cause = sandbox.stub().returns(error2);
      logger.fatal(error, 'Format %s', 'works');
      expect(logger._lastTrace).to.be.eql(pad([
        'FATAL Format works',
        error.stack,
        'Caused by: ' + error2.stack,
        'Caused by: ' + error3.stack
      ].join('\n')));
    });

  });
});
