var Benchmark = require('benchmark');
var logops = require('../');
var bunyan = require('bunyan');

var logopsLogger;
function setupLogops() {
  logops.getContext = function() {
    return {
      name: 'myapp',
      hostname: 'jmendiaraMac.hi.inet',
      pid: 12321
    };
  };
  logops.format = logops.formatters.json;
  logops.setLevel('info');
  logopsLogger = logops;
}

var bunyanLogger;
function setupBunyan() {
  bunyanLogger = bunyan.createLogger({
    name: 'myapp'
  });
  bunyanLogger.level('info')
}

setupLogops();
setupBunyan();

new Benchmark.Suite('Basic logging')
    .add('logops', function() {
      logopsLogger.info({custom: 'field'}, 'This is a String');
    })
    .add('bunyan', function() {
      bunyanLogger.info({custom: 'field'}, 'This is a String');
    })
    // add listeners
    .on('cycle', function(event) {
      process.stderr.write(String(event.target) + '\n');
    })
    .on('complete', function() {
      process.stderr.write(this.name + ': Fastest is ' + this.filter('fastest').map('name') + '\n');
    })
    .run({ 'async': false });

new Benchmark.Suite('Disabled logging')
    .add('logops', function() {
      logopsLogger.debug({custom: 'field'}, 'This is a String');
    })
    .add('bunyan', function() {
      bunyanLogger.debug({custom: 'field'}, 'This is a String');
    })
    // add listeners
    .on('cycle', function(event) {
      process.stderr.write(String(event.target) + '\n');
    })
    .on('complete', function() {
      process.stderr.write(this.name + ': Fastest is ' + this.filter('fastest').map('name') + '\n');
    })
    .run({ 'async': false });

