'use strict';

var logopsPath = '../lib/logops',
    logger =require(logopsPath);

describe('Select value for not available fields', function() {
  var context;
  before(function() {
    logger = require(logopsPath);
    logger.format = logger.formatters.pipe;
    context = {};
  });

  it('should log a custom value', function() {
    logger.formatters.setNotAvailable('NOTAVAILABLE');

    var result = logger.format('INFO', context, 'Message', []);
    expect(result.indexOf('corr=NOTAVAILABLE')).to.be.gt(0);
    expect(result.indexOf('trans=NOTAVAILABLE')).to.be.gt(0);
    expect(result.indexOf('op=NOTAVAILABLE')).to.be.gt(0);
  });

  after(function() {
    logger.formatters.setNotAvailable('n/a'); // restore default value
    delete require.cache[require.resolve(logopsPath)];
  });
});

describe('Select log format with an env variable', function() {
  before(function() {
    delete process.env.LOGOPS_FORMAT;
  });

  it('should select "json" format', function() {
    process.env.LOGOPS_FORMAT = 'json';
    logger = require(logopsPath);

    expect(logger.format).to.be.equal(logger.formatters.json);
  });

  it('should select "dev" format', function() {
    process.env.LOGOPS_FORMAT = 'dev';
    logger = require(logopsPath);

    expect(logger.format).to.be.equal(logger.formatters.dev);
  });

  it('should select "pipe" format', function() {
    process.env.LOGOPS_FORMAT = 'pipe';
    logger = require(logopsPath);

    expect(logger.format).to.be.equal(logger.formatters.pipe);
  });

  afterEach(function() {
    delete require.cache[require.resolve(logopsPath)];
  });
});
