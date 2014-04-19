/*
 * Copyright 2014 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of tdaf-node-logger
 *
 * tdaf-node-logger is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * tdaf-node-logger is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with tdaf-node-logger.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[contacto@tid.es]
 */

'use strict';

var logUtils = require('./log-utils');
var logger = require('../../');
var levels = ['debug', 'info', 'warn', 'error', 'fatal'];
var lastTraces = [];
var streamStub = {
  write: function(trace) {
    lastTraces.push(logUtils.parseLog(trace));
  }
};


describe('Logger Unit Tests', function() {

  before( function(done) {
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
        expect(trace.corr).to.be.equal('n/a');
        expect(trace.trans).to.be.equal('n/a');
        expect(trace.op).to.be.equal('n/a');
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
        expect(trace.corr).to.be.equal('n/a');
        expect(trace.trans).to.be.equal('n/a');
        expect(trace.op).to.be.equal('n/a');
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
        expect(trace.corr).to.be.equal('n/a');
        expect(trace.trans).to.be.equal('n/a');
        expect(trace.op).to.be.equal('n/a');
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
        expect(trace.corr).to.be.equal('n/a');
        expect(trace.trans).to.be.equal('n/a');
        expect(trace.op).to.be.equal('n/a');
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
        expect(trace.corr).to.be.equal('n/a');
        expect(trace.trans).to.be.equal('n/a');
        expect(trace.op).to.be.equal('n/a');
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
        expect(trace.corr).to.be.equal('n/a');
        expect(trace.trans).to.be.equal('n/a');
        expect(trace.op).to.be.equal('n/a');
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

});
