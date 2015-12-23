var sinon = require ('sinon'),
    chai = require ('chai'),
    sinonChai = require('sinon-chai'),
    logger = require('../lib/logops');

chai.use(sinonChai);

global.expect = chai.expect;

beforeEach(function(){
  logger._traces = [];
  logger._lastTrace = null;
  logger.stream = {
    write: function(str) {
      logger._traces.push(str);
      logger._lastTrace = str.trim();
    }
  };
  global.sandbox = sinon.sandbox.create();
  global.sandbox.useFakeTimers();
});

afterEach(function(){
  global.sandbox.restore();
});

