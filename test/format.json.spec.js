'use strict';

var logger = require('../lib/logops');

describe('Format traces in JSON format', function() {
  var context;
  before(function() {
    logger.format = logger.formatters.json;
    context = {};
  });

  it('should log a simple message as JSON', function() {
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
  });

  it('should log a custom object as JSON', function() {
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
  });

  it('should log two custom objects as JSON', function() {
    var obj1 = {a: 1};
    var obj2 = {b: 2};

    var result = logger.format('INFO', context, '', [obj1, obj2]);
    var resultJson = JSON.parse(result);
    expect(resultJson.a).to.be.equal(1);
    expect(resultJson.b).to.be.equal(2);
  });

  it('should log as JSON with a context', function() {
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
  });

  it('should log as JSON with extra args', function() {
    var message = 'Sample Message %d %s';
    var result = logger.format('INFO', context, message, [1234, 'fakearg']);
    var resultJson = JSON.parse(result);

    expect(resultJson.msg).to.be.equal('Sample Message 1234 fakearg');
  });

  it('should log as JSON with placeholders', function() {
    var obj1 = {a: 1};
    var obj2 = {b: 2};

    var result = logger.format('INFO', context, 'placeholder %d %j', [123, obj1, obj2]);
    var resultJson = JSON.parse(result);

    expect(resultJson.msg).to.equal('placeholder 123 {\"a\":1}');
    expect(resultJson.a).to.not.exist; // the first object goes to the placeholder
    expect(resultJson.b).to.be.equal(2);
  });

  it('should log as JSON with placeholders', function() {
    var obj1 = {a: 1};
    var obj2 = {toJSON: function() { return {b: 2}; }};

    var result = logger.format('INFO', context, 'placeholder %d %j', [123, obj1, obj2]);
    var resultJson = JSON.parse(result);

    expect(resultJson.msg).to.equal('placeholder 123 {\"a\":1}');
    expect(resultJson.a).to.not.exist; // the first object goes to the placeholder
    expect(resultJson.b).to.be.equal(2);
  });

  it('should log as JSON with not literal objects and no placeholders', function() {
    var obj1 = {a: 1};

    var result = logger.format('INFO', context, 'no placeholders', [1, 2, obj1, 3, 4]);
    var resultJson = JSON.parse(result);

    expect(resultJson.msg).to.equal('no placeholders 1 2 3 4');
    expect(resultJson.a).to.be.equal(1);
  });
});
