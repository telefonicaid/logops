'use strict';

var logUtils = require('./log_utils');
var logger = null;
var levels = ['debug', 'info', 'warn', 'error', 'fatal'];
var lastTraces = [];

var NOT_AVAILABLE = 'n/a';

var streamStub = {
  write: function(trace) {
    lastTraces.push(logUtils.parseLog(trace));
  }
};

describe('Logger Unit Tests', function() {

  before(function(done) {
    process.env.NODE_ENV = 'production';
    logger = new require('../../');
    logger.stream = streamStub;
    done();
  });

  describe('Logs with default level', function() {

    beforeEach(function(done) {
      lastTraces = [];
      done();
    });

    it(' write all kind of traces only with a message.', function(done) {
      var message = 'Sample Message.';
      var streamSpy = sinon.spy(streamStub, 'write');

      levels.forEach(function(level) {
        logger[level](message);
        if (level === 'debug') {
          expect(streamSpy.callCount).to.be.equal(0);
        } else {
          expect(streamSpy.calledOnce).to.be.true;
        }
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(4);
      lastTraces.forEach(function(trace) {
        expect(trace.lvl).to.not.equal('DEBUG');
        expect(trace.corr).to.be.equal(NOT_AVAILABLE);
        expect(trace.trans).to.be.equal(NOT_AVAILABLE);
        expect(trace.op).to.be.equal(NOT_AVAILABLE);
        expect(trace.msg).to.be.equal(message);
      });
      done();

    });

    it(' write all kind of traces only with a message with format', function(done) {
      var streamSpy = sinon.spy(streamStub, 'write');

      levels.forEach(function(level) {
        logger[level]('Request %s %d %j', 'is', 5, {key: 'value'});
        if (level === 'debug') {
          expect(streamSpy.callCount).to.be.equal(0);
        } else {
          expect(streamSpy.calledOnce).to.be.true;
        }
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(4);
      lastTraces.forEach(function(trace) {
        expect(trace.lvl).to.not.equal('DEBUG');
        expect(trace.corr).to.be.equal(NOT_AVAILABLE);
        expect(trace.trans).to.be.equal(NOT_AVAILABLE);
        expect(trace.op).to.be.equal(NOT_AVAILABLE);
        expect(trace.msg).to.be.equal('Request is 5 {"key":"value"}');
      });
      done();

    });

    it(' write all kind of traces with message and context', function(done) {
      var streamSpy = sinon.spy(streamStub, 'write');
      var message = 'Sample Message.';
      var context = {
        corr: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        trans: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        op: 'SendEMail'
      };

      levels.forEach(function(level) {
        logger[level](context, message);
        if (level === 'debug') {
          expect(streamSpy.callCount).to.be.equal(0);
        } else {
          expect(streamSpy.calledOnce).to.be.true;
        }
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(4);
      lastTraces.forEach(function(trace) {
        expect(trace.lvl).to.not.equal('DEBUG');
        expect(trace.corr).to.be.equal(context.corr);
        expect(trace.trans).to.be.equal(context.trans);
        expect(trace.op).to.be.equal(context.op);
        expect(trace.msg).to.be.equal(message);
      });
      done();

    });

    it(' write all kind of traces with message format and context', function(done) {
      var streamSpy = sinon.spy(streamStub, 'write');
      var context = {
        corr: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        trans: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        op: 'SendEMail'
      };

      levels.forEach(function(level) {
        logger[level](context, 'Request %s %d %j', 'is', 5, {key: 'value'});
        if (level === 'debug') {
          expect(streamSpy.callCount).to.be.equal(0);
        } else {
          expect(streamSpy.calledOnce).to.be.true;
        }
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(4);
      lastTraces.forEach(function(trace) {
        expect(trace.lvl).to.not.equal('DEBUG');
        expect(trace.corr).to.be.equal(context.corr);
        expect(trace.trans).to.be.equal(context.trans);
        expect(trace.op).to.be.equal(context.op);
        expect(trace.msg).to.be.equal('Request is 5 {"key":"value"}');
      });
      done();

    });

  });


  describe('Logs with DEBUG level', function() {

    before(function(done) {
      logger.setLevel('DEBUG');
      done();
    });

    beforeEach(function(done) {
      lastTraces = [];
      done();
    });

    it(' write all kind of traces only with a message.', function(done) {
      var message = 'Sample Message.';
      var streamSpy = sinon.spy(streamStub, 'write');

      levels.forEach(function(level) {
        logger[level](message);
        expect(streamSpy.calledOnce).to.be.true;
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(5);
      lastTraces.forEach(function(trace) {
        expect(trace.corr).to.be.equal(NOT_AVAILABLE);
        expect(trace.trans).to.be.equal(NOT_AVAILABLE);
        expect(trace.op).to.be.equal(NOT_AVAILABLE);
        expect(trace.msg).to.be.equal(message);
      });
      done();

    });

    it(' write all kind of traces only with a message with format', function(done) {
      var streamSpy = sinon.spy(streamStub, 'write');

      levels.forEach(function(level) {
        logger[level]('Request %s %d %j', 'is', 5, {key: 'value'});
        expect(streamSpy.calledOnce).to.be.true;
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(5);
      lastTraces.forEach(function(trace) {
        expect(trace.corr).to.be.equal(NOT_AVAILABLE);
        expect(trace.trans).to.be.equal(NOT_AVAILABLE);
        expect(trace.op).to.be.equal(NOT_AVAILABLE);
        expect(trace.msg).to.be.equal('Request is 5 {"key":"value"}');
      });
      done();

    });

    it(' write all kind of traces with message and context', function(done) {
      var streamSpy = sinon.spy(streamStub, 'write');
      var message = 'Sample Message.';
      var context = {
        corr: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        trans: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        op: 'SendEMail'
      };

      levels.forEach(function(level) {
        logger[level](context, message);
        expect(streamSpy.calledOnce).to.be.true;
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(5);
      lastTraces.forEach(function(trace) {
        expect(trace.corr).to.be.equal(context.corr);
        expect(trace.trans).to.be.equal(context.trans);
        expect(trace.op).to.be.equal(context.op);
        expect(trace.msg).to.be.equal(message);
      });
      done();

    });

    it(' write all kind of traces with message format and context', function(done) {
      var streamSpy = sinon.spy(streamStub, 'write');
      var context = {
        corr: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        trans: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        op: 'SendEMail'
      };

      levels.forEach(function(level) {
        logger[level](context, 'Request %s %d %j', 'is', 5, {key: 'value'});
        expect(streamSpy.calledOnce).to.be.true;
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(5);
      lastTraces.forEach(function(trace) {
        expect(trace.corr).to.be.equal(context.corr);
        expect(trace.trans).to.be.equal(context.trans);
        expect(trace.op).to.be.equal(context.op);
        expect(trace.msg).to.be.equal('Request is 5 {"key":"value"}');
      });
      done();

    });


    after(function(done) {
      logger.setLevel(null);
      done();
    });

  });


  describe('Logs with WARN level', function() {

    before(function(done) {
      logger.setLevel('WARN');
      done();
    });

    beforeEach(function(done) {
      lastTraces = [];
      done();
    });

    it(' write all kind of traces only with a message.', function(done) {
      var message = 'Sample Message.';
      var streamSpy = sinon.spy(streamStub, 'write');

      levels.forEach(function(level) {
        logger[level](message);
        if (level === 'debug' || level === 'info') {
          expect(streamSpy.callCount).to.be.equal(0);
        } else {
          expect(streamSpy.calledOnce).to.be.true;
        }
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(3);
      lastTraces.forEach(function(trace) {
        expect(trace.lvl).to.not.equal('DEBUG');
        expect(trace.lvl).to.not.equal('INFO');
        expect(trace.corr).to.be.equal(NOT_AVAILABLE);
        expect(trace.trans).to.be.equal(NOT_AVAILABLE);
        expect(trace.op).to.be.equal(NOT_AVAILABLE);
        expect(trace.msg).to.be.equal(message);
      });
      done();

    });

    it(' write all kind of traces only with a message with format', function(done) {
      var streamSpy = sinon.spy(streamStub, 'write');

      levels.forEach(function(level) {
        logger[level]('Request %s %d %j', 'is', 5, {key: 'value'});
        if (level === 'debug' || level === 'info') {
          expect(streamSpy.callCount).to.be.equal(0);
        } else {
          expect(streamSpy.calledOnce).to.be.true;
        }
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(3);
      lastTraces.forEach(function(trace) {
        expect(trace.lvl).to.not.equal('DEBUG');
        expect(trace.lvl).to.not.equal('INFO');
        expect(trace.corr).to.be.equal(NOT_AVAILABLE);
        expect(trace.trans).to.be.equal(NOT_AVAILABLE);
        expect(trace.op).to.be.equal(NOT_AVAILABLE);
        expect(trace.msg).to.be.equal('Request is 5 {"key":"value"}');
      });
      done();

    });

    it(' write all kind of traces with message and context', function(done) {
      var streamSpy = sinon.spy(streamStub, 'write');
      var message = 'Sample Message.';
      var context = {
        corr: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        trans: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        op: 'SendEMail'
      };

      levels.forEach(function(level) {
        logger[level](context, message);
        if (level === 'debug' || level === 'info') {
          expect(streamSpy.callCount).to.be.equal(0);
        } else {
          expect(streamSpy.calledOnce).to.be.true;
        }
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(3);
      lastTraces.forEach(function(trace) {
        expect(trace.lvl).to.not.equal('DEBUG');
        expect(trace.lvl).to.not.equal('INFO');
        expect(trace.corr).to.be.equal(context.corr);
        expect(trace.trans).to.be.equal(context.trans);
        expect(trace.op).to.be.equal(context.op);
        expect(trace.msg).to.be.equal(message);
      });
      done();

    });

    it(' write all kind of traces with message format and context', function(done) {
      var streamSpy = sinon.spy(streamStub, 'write');
      var context = {
        corr: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        trans: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
        op: 'SendEMail'
      };

      levels.forEach(function(level) {
        logger[level](context, 'Request %s %d %j', 'is', 5, {key: 'value'});
        if (level === 'debug' || level === 'info') {
          expect(streamSpy.callCount).to.be.equal(0);
        } else {
          expect(streamSpy.calledOnce).to.be.true;
        }
        streamSpy.reset();
      });
      expect(lastTraces).to.have.length(3);
      lastTraces.forEach(function(trace) {
        expect(trace.lvl).to.not.equal('DEBUG');
        expect(trace.lvl).to.not.equal('INFO');
        expect(trace.corr).to.be.equal(context.corr);
        expect(trace.trans).to.be.equal(context.trans);
        expect(trace.op).to.be.equal(context.op);
        expect(trace.msg).to.be.equal('Request is 5 {"key":"value"}');
      });
      done();

    });

  });

  after(function(done) {
    logger = null;
    delete require.cache[require.resolve('../../')];
    done();
  });

});
