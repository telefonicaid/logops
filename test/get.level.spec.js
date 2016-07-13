'use strict';

var logopsPath = '../lib/logops',
    logger =require(logopsPath);

describe('Get log format with the API', function() {
  it('should return the current log level', function() {
    logger.setLevel('DEBUG');
    
    expect(logger.getLevel()).to.equal('DEBUG');
  });
});