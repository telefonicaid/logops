'use strict';

var logopsPath = '../lib/logops',
    logger = require(logopsPath);

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

describe('Get log format with the API', function() {
  it('should return the current log level', function() {
    logger.setLevel('DEBUG');

    expect(logger.getLevel()).to.equal('DEBUG');
  });
});

describe('Setters', function() {

  var toSave= ['getContext', 'format', 'stream'];
  var saved = {}, level;
  beforeEach(function() {
    toSave.forEach(prop => saved[prop] = logger[prop]);
    level = logger.getLevel();
  });

  afterEach(function() {
    toSave.forEach(prop => logger[prop] = saved[prop]);
    logger.setLevel(level);
  });

  it('should set the context', function() {
    function getContext() {
      return { a: 1 };
    };
    logger.setContextGetter(getContext);
    expect(logger.getContext).to.be.eql(getContext);
  });

  it('should set the format', function() {
    var format = { };
    logger.setFormat(format);
    expect(logger.format).to.be.eql(format);
  });

  it('should set the stream', function() {
    var stream = { };
    logger.setStream(stream);
    expect(logger.stream).to.be.eql(stream);
  });
});

describe('Child Loggers', function() {
  // TODO: Move to environment.js, but causes more tests
  // to fail. REview the test strategy, as now depends on the
  // excution order
  var toSave= ['getContext', 'format', 'stream'];
  var saved = {}, level;
  beforeEach(function() {
    toSave.forEach(prop => saved[prop] = logger[prop]);
    level = logger.getLevel();
  });

  afterEach(function() {
    toSave.forEach(prop => logger[prop] = saved[prop]);
    logger.setLevel(level);
  });

  it('should be able to create a child', function() {
    var child = logger.child();
    Object.keys(logger)
      .forEach(prop => expect(child).to.have.ownProperty(prop));
  });

  it('should have own context', function() {
    let context = { a: 1 };
    let child = logger.child(context);
    sandbox.spy(child, 'format');

    child.info();
    expect(child.format).to.have.been.calledWith('INFO', context);
  });

  it('should append own context to parent one', function() {
    logger.getContext = function() { return {
      a: true,
      b: 'should be overwritten'
    }; };
    let child = logger.child({
      b: true
    });
    sandbox.spy(child, 'format');
    child.info();

    expect(child.format).to.have.been.calledWith('INFO', {
      a: true,
      b: true
    });
  });

  it('should use parent log level', function() {
    logger.setLevel('ERROR')
    let child = logger.child();
    sandbox.spy(child, 'format');
    child.info();

    expect(child.format).not.to.have.been.called;
  });

  it('should use own log level', function() {
    logger.setLevel('DEBUG')
    let child = logger.child();
    child.setLevel('ERROR')
    sandbox.spy(child, 'format');
    sandbox.spy(logger, 'format');
    child.info();
    logger.info();
    expect(child.format).not.to.have.been.called;
    expect(logger.format).to.have.been.called;
  });

  it('should use parent stream', function() {
    logger.stream = {
      write: sandbox.spy()
    }

    let child = logger.child();
    child.info();

    expect(logger.stream.write).to.have.been.called;
  });

  it('should have several generations', function() {
    logger.getContext = () => ({a: 1});
    let child1 = logger.child({b:2});
    let child2 = child1.child({c:3});
    let child3 = child2.child({d:4});

    sandbox.spy(child3, 'format');
    child3.info();
    expect(child3.format).to.have.been.calledWith('INFO', {
      a: 1, b: 2, c: 3, d:4
    });
  });
});
