'use strict';

var logger = require('../lib/logops');

describe('JSON format', function() {
  before(function() {
    logger.format = logger.formatters.json;
  });

  describe('Logging Messages', function() {
    describe('without context', function() {
      it('should log empty strings', function() {
        logger.info('');
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: ''
        }));
      });

      it('should log undefined', function() {
        logger.info();
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: 'undefined'
        }));
      });

      it('should log null', function() {
        logger.info(null);
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: 'null'
        }));
      });

      it('should log empty arrays', function() {
        logger.info([]);
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: '[]'
        }));
      });

      it('should log objects representation', function() {
        logger.info({}, {});
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: '{}'
        }));
      });

      it('should log nothing but context', function() {
        logger.info({});
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: 'undefined'
        }));
      });

      it('should log dates', function() {
        var now = new Date();
        logger.info({}, now);
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: '' + now
        }));
      });

      it('should nothing but context with a Data as context', function() {
        logger.info(new Date());
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: 'undefined'
        }));
      });

      it('should log booleans', function() {
        logger.info(false);
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: 'false'
        }));
        logger.info(true);
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: 'true'
        }));
      });

      it('should log strings', function() {
        logger.info('Simple Message');
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: 'Simple Message'
        }));
      });

      it('should log formatted strings', function() {
        logger.info('Format %s %d %j', 'foo', 4, {bar:5});
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: 'Format foo 4 {"bar":5}'
        }));
      });

      it('should log arrays', function() {
        logger.info(['Sample', 'Array']);
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: "[ 'Sample', 'Array' ]"
        }));
      });

      it('should log extra simple params', function() {
        logger.info('Format', 'foo', 4, {bar:5});
        expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
          msg: 'Format foo 4 { bar: 5 }'
        }));
      });
    });

    describe('with context', function() {
      it('should append global context', function() {
        sandbox.stub(logger, 'getContext').returns({
          corr: null,
          trans: undefined, //must be dropped
          op: 'OP'
        });
        logger.info('Simple Message');
        expect(logger._lastTrace).to.be.eql(JSON.stringify({
          corr: null,
          op: 'OP',
          time: '1970-01-01T00:00:00.000Z',
          lvl: 'INFO',
          msg: 'Simple Message'
        }));
      });

      it('should append local context to global context', function() {
        sandbox.stub(logger, 'getContext').returns({
          corr: null,
          trans: undefined, //must be dropped
          op: 'OP'
        });

        logger.info({
              corr: 'corr',
              custom: 'custom'
            },
            'Simple Message'
        );

        expect(logger._lastTrace).to.be.equal(JSON.stringify({
          corr: 'corr',
          op: 'OP',
          custom: 'custom',
          time: '1970-01-01T00:00:00.000Z',
          lvl: 'INFO',
          msg: 'Simple Message'
        }));
      });


      it('should not overwrite logops internal properties', function() {
        sandbox.stub(logger, 'getContext').returns({
          time: 'contextTime',
          lvl: 'contextLevel',
          msg: 'contextMsg'
        });

        logger.info({
              time: 'logTime',
              lvl: 'logLevel',
              msg: 'logMsg'
            },
            'Simple Message'
        );

        expect(logger._lastTrace).to.be.equal(JSON.stringify({
          time: '1970-01-01T00:00:00.000Z',
          lvl: 'INFO',
          msg: 'Simple Message'
        }));
      });
    });
  });

  describe('Logging Errors', function() {
    it('should log errors without stacktrace', function() {
      var error = new Error('foo');
      error.custom = 'custom';
      logger.info(error);
      expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
        err: {
          custom: 'custom',
          message: 'foo',
          name: 'Error',
          constructor: 'Error'
        },
        msg: 'Error: foo'
      }));
    });

    it('should log errors with stacktrace', function() {
      var error = new Error('foo');
      error.custom = 'custom';
      logger.error(error);
      expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'ERROR',
        err: {
          custom: 'custom',
          message: 'foo',
          name: 'Error',
          constructor: 'Error',
          stack: error.stack
        },
        msg: 'Error: foo'
      }));
    });

    it('should log errors with stacktrace and cause', function() {
      var error = new Error('foo'), error2 = new Error('bar'), error3 = new Error('baz');
      error.custom = 'custom';
      error2.cause = sandbox.stub().returns(error3);
      error.cause = sandbox.stub().returns(error2);
      logger.error(error);
      expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'ERROR',
        err: {
          custom: 'custom',
          message: 'foo',
          name: 'Error',
          constructor: 'Error',
          causes: [
            { message: 'bar', name: 'Error', constructor: 'Error' },
            { message: 'baz', name: 'Error', constructor: 'Error' }
          ],
          stack: [error.stack, 'Caused by: ' + error2.stack, 'Caused by: ' + error3.stack].join('\n')
        },
        msg: 'Error: foo'
      }));
    });

    it('should log extra errors', function() {
      logger.info('Format', new Error('foo'));
      expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
        msg: 'Format [Error: foo]'
      }));
    });

    it('should log errors with extra information without stacktrace', function() {
      var err = new Error('foo');
      logger.info(err, 'Format %s', 'works');
      expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'INFO',
        err: {
          message: 'foo',
          name: 'Error',
          constructor: 'Error'
        },
        msg: 'Format works'
      }));
    });

    it('should log errors with extra information and cause', function() {
      var error = new Error('foo'), error2 = new Error('bar'), error3 = new Error('baz');
      error2.cause = sandbox.stub().returns(error3);
      error.cause = sandbox.stub().returns(error2);
      logger.fatal(error, 'Format %s', 'works');
      expect(logger._lastTrace).to.be.eql(JSON.stringify({time: '1970-01-01T00:00:00.000Z', lvl: 'FATAL',
        err: {
          message: 'foo',
          name: 'Error',
          constructor: 'Error',
          causes: [
            { message: 'bar', name: 'Error', constructor: 'Error' },
            { message: 'baz', name: 'Error', constructor: 'Error' }
          ],
          stack: [error.stack, 'Caused by: ' + error2.stack, 'Caused by: ' + error3.stack].join('\n')
        },
        msg: 'Format works'
      }));
    });
  });
});
