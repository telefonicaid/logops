'use strict';

var logger = require('../lib/logops');

describe('Pipe format', function() {
  before(function() {
    logger.format = logger.formatters.pipe;
  });

  describe('Logging Messages', function() {
    beforeEach(function() {
      sandbox.stub(logger, 'getContext').returns();
    });

    it('should log empty strings', function() {
      logger.info('');
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg='
      );
    });

    it('should log undefined', function() {
      logger.info();
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=undefined'
      );
    });

    it('should log null', function() {
      logger.info(null);
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=null'
      );
    });

    it('should log empty arrays', function() {
      logger.info([]);
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg='
      );
    });

    it('should log objects representation', function() {
      logger.info({}, {});
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=[object Object]'
      );
    });

    it('should log nothing but context', function() {
      logger.info({});
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=undefined'
      );
    });

    it('should log stringificable objects', function() {
      function Obj() {
        this.toString = function() {
          return 'Obj';
        };
      }
      logger.info({}, new Obj());
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=Obj'
      );
    });

    it('should log nothing but context with Objects representation', function() {
      function Obj() {
        this.toString = function() {
          return 'Obj';
        };
      }
      logger.info(new Obj());
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=undefined'
      );
    });

    it('should log dates', function() {
      var now = new Date();
      logger.info({}, now);
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=1970-01-01T00:00:00.000Z'
      );
    });

    it('should nothing but context with a Data as context', function() {
      logger.info(new Date());
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=undefined'
      );
    });

    it('should log booleans', function() {
      logger.info(false);
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=false'
      );
      logger.info(true);
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=true'
      );
    });

    it('should log strings', function() {
      logger.info('Simple Message');
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=Simple Message'
      );
    });

    it('should log formatted strings', function() {
      logger.info('Format %s %d %j', 'foo', 4, {bar:5});
      logger.info('Format %s %d %j', 'foo', 4, {bar:5});
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=Format foo 4 {"bar":5}'
      );
    });

    it('should log arrays', function() {
      logger.info(['Sample', 'Array']);
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=Sample,Array'
      );
    });

    it('should log extra simple params', function() {
      logger.info('Format', 'foo', 4, {bar:5});
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=Format foo 4 { bar: 5 }'
      );
    });

    it('should log errors', function() {
      logger.info(new Error('foo'));
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=Error: foo'
      );
    });

    it('should log extra errors', function() {
      var error = new Error('foo');
      logger.info('Format', error);
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=Format ' + error.stack
      );
    });

    it('should log errors with extra information', function() {
      var error = new Error('foo');
      logger.info(error, 'Format %s', 'works');
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=Format works ' + error.stack
      );
    });

    it('should log dynamic context properties', function() {
      logger.info({ srv: 'Service', subsrv: 'Subservice'}, 'Format %s', 'works');
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | srv=Service | subsrv=Subservice | msg=Format works'
      );
    });

    it('should use corr, trans, op from context properties', function() {
      logger.info({ corr: 1, trans: 2, op: '3', srv: 'Service' }, 'Format %s', 'works');
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=1 | trans=2 | op=3 | srv=Service | msg=Format works'
      );
    });

    it('should use corr, trans, op from global context', function() {
      logger.getContext = function() {
        return { corr: 1, trans: 2, op: 'original'};
      };
      logger.info({ corr: 999, op: 'override', srv: 'Service' }, 'Format %s', 'works');
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=999 | trans=2 | op=override | srv=Service | msg=Format works'
      );
    });

    it('should be able to set custom not available', function() {
      logger.formatters.setNotAvailable('NOTAVAILABLE');
      logger.info('');
      expect(logger._lastTrace).to.be.eql(
          'time=1970-01-01T00:00:00.000Z | lvl=INFO | corr=NOTAVAILABLE | trans=NOTAVAILABLE | op=NOTAVAILABLE | msg='
      );
    });
  });
});
