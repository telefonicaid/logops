'use strict';

var logopsPath = '../lib/logops',
    logger =require(logopsPath);

describe('Select log format with an env variable', function() {

  beforeEach(function () {
    delete require.cache[require.resolve(logopsPath)];
  });

  afterEach(function () {
    delete require.cache[require.resolve(logopsPath)];
    delete process.env.LOGOPS_FORMAT;
    delete process.env.NODE_ENV;

  });

  it('should select "json" format', function () {
    process.env.LOGOPS_FORMAT = 'json';
    logger = require(logopsPath);

    expect(logger.format).to.be.equal(logger.formatters.json);
  });

  it('should select "dev" format', function () {
    process.env.LOGOPS_FORMAT = 'dev';
    logger = require(logopsPath);

    expect(logger.format).to.be.equal(logger.formatters.dev);
  });

  it('should select "pipe" format', function () {
    process.env.LOGOPS_FORMAT = 'pipe';
    logger = require(logopsPath);

    expect(logger.format).to.be.equal(logger.formatters.pipe);
  });

  it('should select "dev" format when in development env', function () {
    process.env.NODE_ENV = 'development';
    logger = require(logopsPath);

    expect(logger.format).to.be.equal(logger.formatters.dev);
  });

  it('should select "json" format when in other env', function () {
    logger = require(logopsPath);

    expect(logger.format).to.be.equal(logger.formatters.json);
  });
});

describe('Select log level', function() {
  var levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'],
      DEFAULT_LEVEL = 'INFO';

  beforeEach(function() {
    delete require.cache[require.resolve(logopsPath)];
    logger.stream = {write: function() {}};
  });

  afterEach(function() {
    delete require.cache[require.resolve(logopsPath)];
  });

  it('should have INFO as default level', function() {
    sandbox.spy(logger, 'format');

    logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

    // Check our noop function name
    expect(logger.debug.name).to.be.eql('noop');
    expect(logger.info.name).not.to.be.eql('noop');
    expect(logger.warn.name).not.to.be.eql('noop');
    expect(logger.error.name).not.to.be.eql('noop');
    expect(logger.fatal.name).not.to.be.eql('noop');

    expect(logger.format).to.not.have.been.calledWith('DEBUG');
    expect(logger.format).to.have.been.calledWith('INFO');
    expect(logger.format).to.have.been.calledWith('WARN');
    expect(logger.format).to.have.been.calledWith('ERROR');
    expect(logger.format).to.have.been.calledWith('FATAL');
  });

  describe('with the API', function() {

    beforeEach(function() {
      sandbox.spy(logger, 'format');
    });

    afterEach(function() {
      logger.setLevel(DEFAULT_LEVEL);
    });

    it('should set DEBUG level', function() {
      logger.setLevel('DEBUG');

      logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

      expect(logger.format).to.have.been.calledWith('DEBUG');
      expect(logger.format).to.have.been.calledWith('INFO');
      expect(logger.format).to.have.been.calledWith('WARN');
      expect(logger.format).to.have.been.calledWith('ERROR');
      expect(logger.format).to.have.been.calledWith('FATAL');
    });

    it('should set INFO level', function() {
      logger.setLevel('info');

      logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

      expect(logger.format).to.not.have.been.calledWith('DEBUG');
      expect(logger.format).to.have.been.calledWith('INFO');
      expect(logger.format).to.have.been.calledWith('WARN');
      expect(logger.format).to.have.been.calledWith('ERROR');
      expect(logger.format).to.have.been.calledWith('FATAL');
    });

    it('should set WARN level', function() {
      logger.setLevel('warn');

      logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

      expect(logger.format).to.not.have.been.calledWith('DEBUG');
      expect(logger.format).to.not.have.been.calledWith('INFO');
      expect(logger.format).to.have.been.calledWith('WARN');
      expect(logger.format).to.have.been.calledWith('ERROR');
      expect(logger.format).to.have.been.calledWith('FATAL');
    });

    it('should set ERROR level', function() {
      logger.setLevel('ERROR');

      logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

      expect(logger.format).to.not.have.been.calledWith('DEBUG');
      expect(logger.format).to.not.have.been.calledWith('INFO');
      expect(logger.format).to.not.have.been.calledWith('WARN');
      expect(logger.format).to.have.been.calledWith('ERROR');
      expect(logger.format).to.have.been.calledWith('FATAL');
    });

    it('should set FATAL level', function() {
      logger.setLevel('fatal');

      logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

      expect(logger.format).to.not.have.been.calledWith('DEBUG');
      expect(logger.format).to.not.have.been.calledWith('INFO');
      expect(logger.format).to.not.have.been.calledWith('WARN');
      expect(logger.format).to.not.have.been.calledWith('ERROR');
      expect(logger.format).to.have.been.calledWith('FATAL');
    });
  });

  describe('with ENV vars', function() {

    it('should set DEBUG level', function() {
      process.env.LOGOPS_LEVEL = 'DEBUG';
      logger = require(logopsPath);
      sandbox.spy(logger, 'format');
      logger.stream = {write: function() {}};


      logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

      expect(logger.format).to.have.been.calledWith('DEBUG');
      expect(logger.format).to.have.been.calledWith('INFO');
      expect(logger.format).to.have.been.calledWith('WARN');
      expect(logger.format).to.have.been.calledWith('ERROR');
      expect(logger.format).to.have.been.calledWith('FATAL');
    });

    it('should set INFO level', function() {
      process.env.LOGOPS_LEVEL = 'info';
      logger = require(logopsPath);
      sandbox.spy(logger, 'format');
      logger.stream = {write: function() {}};

      logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

      expect(logger.format).to.not.have.been.calledWith('DEBUG');
      expect(logger.format).to.have.been.calledWith('INFO');
      expect(logger.format).to.have.been.calledWith('WARN');
      expect(logger.format).to.have.been.calledWith('ERROR');
      expect(logger.format).to.have.been.calledWith('FATAL');
    });

    it('should set WARN level', function() {
      process.env.LOGOPS_LEVEL = 'WARN';
      logger = require(logopsPath);
      sandbox.spy(logger, 'format');
      logger.stream = {write: function() {}};

      logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

      expect(logger.format).to.not.have.been.calledWith('DEBUG');
      expect(logger.format).to.not.have.been.calledWith('INFO');
      expect(logger.format).to.have.been.calledWith('WARN');
      expect(logger.format).to.have.been.calledWith('ERROR');
      expect(logger.format).to.have.been.calledWith('FATAL');
    });

    it('should set ERROR level', function() {
      process.env.LOGOPS_LEVEL = 'ERROR';
      logger = require(logopsPath);
      sandbox.spy(logger, 'format');
      logger.stream = {write: function() {}};

      logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

      expect(logger.format).to.not.have.been.calledWith('DEBUG');
      expect(logger.format).to.not.have.been.calledWith('INFO');
      expect(logger.format).to.not.have.been.calledWith('WARN');
      expect(logger.format).to.have.been.calledWith('ERROR');
      expect(logger.format).to.have.been.calledWith('FATAL');
    });

    it('should set FATAL level', function() {
      process.env.LOGOPS_LEVEL = 'fatal';
      logger = require(logopsPath);
      sandbox.spy(logger, 'format');
      logger.stream = {write: function() {}};

      logger.debug(); logger.info(); logger.warn(); logger.error(); logger.fatal();

      expect(logger.format).to.not.have.been.calledWith('DEBUG');
      expect(logger.format).to.not.have.been.calledWith('INFO');
      expect(logger.format).to.not.have.been.calledWith('WARN');
      expect(logger.format).to.not.have.been.calledWith('ERROR');
      expect(logger.format).to.have.been.calledWith('FATAL');
    });
  });
});
