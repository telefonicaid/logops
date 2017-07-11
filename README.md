# logops

Really simple and performant JSON logger for node.js.

[![npm version](https://img.shields.io/npm/v/logops.svg)](http://badge.fury.io/js/logops)
[![Build Status](https://img.shields.io/travis/telefonicaid/logops.svg)](https://travis-ci.org/telefonicaid/logops)
[![Coveralls branch](https://img.shields.io/coveralls/telefonicaid/logops/master.svg)](https://coveralls.io/r/telefonicaid/logops?branch=master)
[![Dependency Status](https://img.shields.io/gemnasium/telefonicaid/logops.svg)](https://gemnasium.com/telefonicaid/logops)
![Typescript definitions](https://img.shields.io/badge/TypeScript%20Definition-.d.ts-blue.svg)

## Installation

```bash
npm install logops
```

## Basic usage

```js
var logger = require('logops');

//plain strings
logger.debug('This is an example');
// {"time":"2015-12-22T16:31:39.220Z","lvl":"DEBUG","msg":"This is an example"}

//util.format support
logger.info('Request %s %d %j', 'is', 5, {key: 'value'}, 'guy');
// {"time":"2015-12-22T16:31:56.184Z","lvl":"INFO","msg":"Request is 5 {\"key\":\"value\"} guy"}

//properties in the log trace
logger.warn({ip: '127.0.0.0'}, 'Something went wrong');
// {"ip":"127.0.0.0","time":"2015-12-22T16:33:17.002Z","lvl":"WARN","msg":"Something went wrong"}

//special case: error instance to print error info (and stack traces)...
logger.error(new TypeError('String required'));
/* {"time":"2015-12-22T16:36:39.650Z","lvl":"ERROR",
 *  "err":{"message":"String required","name":"TypeError","constructor":"TypeError","stack":"TypeError: String required\n    at...",
 *  "msg":"TypeError: String required"} */

//... or specify the message
logger.fatal(new Error('Out of memory'), 'SYSTEM UNSTABLE. BYE');
/* {"time":"2015-12-22T16:45:36.468Z","lvl":"FATAL",
 *  "err":{"message":"Out of memory","name":"Error","constructor":"Error","stack":"Error: Out of memory\n    at...",
 *  "msg":"SYSTEM UNSTABLE. BYE"} */
```

* If you give an object as the first argument, you will print its properties but not a String representation of it. `logger.info(req)` will set all `req` properties in the final json. `logger.info({a:'guy'}) =>
{"a":"guy","time":"2015-12-23T12:09:12.610Z","lvl":"INFO","msg":"undefined"}`

* The pattern `logger.error(err)` is very common. This API embraces the requirenment, and makes an special management of it. But getting an error stack trace is not cheap. It only will be get and printed when `log.error` or `log.fatal` is used, so you can use `logger.info(new Error('User Not Found'));` to not print useless stackstraces for your bussiness logic errors. _You can override it, btw_

* With the rest of arguments is just like calling `console.log`. It will be serialized as the trace message. Easy to remember.


## Context support

Logops supports using global properties that will be merged with the specific ones defined in the call. Simply override the `logger.getContext` method to let the logger get it. See `logops.child` to see how to also create loggers with context 

```js
var logger = require('logops'),
    hostname = require('os').hostname();

logger.getContext = function getContext() {
  return {
    hostname: hostname,
    pid: process.pid
  };
}

logger.info({app: 'server'}, 'Startup');
// {"hostname":"host.local","pid":35502,"app":"server","time":"2015-12-23T11:47:25.862Z","lvl":"INFO","msg":"Startup"}
```

## Logger Level

You can set the logging level at any time. All the disabled logging methods are replaced by a noop,
so there is not any performance penalty at production using an undesired level

```js
var logger = require('logops');

// {String} level one of the following values ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
logger.setLevel('DEBUG');
```

You can also set the logging level using the `LOGOPS_LEVEL` environment variable:

```bash
export LOGOPS_LEVEL=DEBUG
```

You can get the logging level using the `getLevel()` function of the logger:
```
currentLevel = logger.getLevel();
```

## Trace format

This library incorporates two flavors of trace formatting:
* "json": writes logs as JSON. This is the **DEFAULT in v1.0.0**
* "dev": for development. Used with 'de-facto' NODE_ENV variable is set to 'development'
* "pipe": writes logs separating fields with pipes. **DEPRECATED in v1.0.0** 

```js
logger.format = logger.formatters.json;
logger.info({key:'value'}, 'This is an example: %d', 5);
// {"key":"value","time":"2015-12-23T11:55:27.041Z","lvl":"INFO","msg":"This is an example: 5"}

logger.format = logger.formatters.dev;
logger.info({key:'value'}, 'This is an example: %d', 5);
// INFO  This is an example: 5 { key: 'value' }

logger.format = logger.formatters.pipe; //DEPRECATED in v1.0.0
logger.info({key:'value'}, 'This is an example: %d', 5);
// time=2015-12-23T11:57:24.879Z | lvl=INFO | corr=n/a | trans=n/a | op=n/a | msg=This is an example: 5
```

You can also set the format specifying the formatter with `LOGOPS_FORMAT` environment variable:

```bash
export LOGOPS_FORMAT=json
# export LOGOPS_FORMAT=dev
```

## Child Loggers 
You can create an specialized logger for a part of your app with bound static context/properties. The child logger
will inherit its parent config: level, format, stream and context. If the parent logger has a context returned by `parent.getContext()`, the conflicting child logger context will take precedence
```js
let child = logger.child({component: 'client'});
child.info('Startup');
// {"component":"client","time":"2015-12-23T11:47:25.862Z","lvl":"INFO","msg":"Startup"}
```

**TIP: Using with express/connect**
You can create a simply middleware to add a logger to every request with something like
```js
app.use(function(req, res, next) {
  req.logger = logger.child({
    requestId: uuid.v4()
  });
  next();
});
```
So your `req.logger` will log the requestId to allow correlation of traces in your server traces.

_Note: setting `child.getContext` property, will override the context used to create the logger and its merge with its parent one. So you can use it to create a context free logger_

## Advanced Usage

### Trace format

You can override the format function and manage by yourself the formatting taking into account your own environment variables by
overriding the `logger.format` function

### Don't print specific properties with `dev` format 

Omit some boring/repeated/always-the-same context properties from being logged with the `dev` formatter:

```js
logger.format = logger.formatters.dev;
logger.getContext = () => ({ pid: process.pid });
logger.info({key:'value', ip:'127.0.0.1'}, 'This is an example: %d', 5);
// INFO  This is an example: 5 { pid: 123342, key: 'value', ip: '127.0.0.1' }

// Specify the context fields to omit as an array
logger.formatters.dev.omit = ['pid', 'ip'];

logger.info({key:'value', ip:'127.0.0.1'}, 'This is an example: %d', 5);
// INFO  This is an example: 5 { key: 'value' }
```

### Don't print Error Stack traces

Set `logger.formatters.stacktracesWith` array with the error levels that will print stacktraces. Default is `stacktracesWith: ['ERROR', 'FATAL']`

### Writing to files

This library writes by default to `process.stdout`, the safest, fastest and easy way to manage logs. It's how you execute your app when you define how to manage logs.

This approach is also compatible with [logrotate](http://linuxcommand.org/man_pages/logrotate8.html) as this is how many servers and PaaS manage the logs.
Therefore you don't need to put __anything__ in your source code relative to logs, and all is done at execution time depending on the deployment.

__Recommended execution:__ Pipelining the stdout to [tee](http://en.wikipedia.org/wiki/Tee_(command)).
With this configuration, you will not fail when the disk is full

```bash
# write all traces to out.log
set -o pipefail
node index.js | tee -a out.log > /dev/null
```

```bash
# write error and fatal traces to error.log and all traces to out.log (using json formatter)
set -o pipefail
LOGOPS_FORMAT=json node index.js | tee >(grep -a -F -e '"lvl":"ERROR"' -e '"lvl":"FATAL"' > error.log) > out.log
```

You can also write logs and fail miserably stopping your app when the disk is full by doing

```bash
node index.js > out.log
```

Please read carefully in the node documentation how the `stdout`/`stderr` stream behaves [regarding synchronous/asynchronous writing](https://nodejs.org/api/process.html#process_process_stdout)

If you want to pipe the output stream to any other stream in your source code, or even write to files *(not recommended)*,
you can override the stream used by this library

```js
var logger = require('logops');
logger.stream = new MyOtherSuperStreamThatDoesGreatThingsExceptWriteToDisk();
```

## History
This project was created initially for logging using the now deprecated pipe format, used internally at Telefonica by some logging infrastructure deployments.
Now we are switching to a new one one, based on documents and a NoSQL infrastructure, where the JSON format is the one that 
fits best. We got inspired by the wonderful [`bunyan`](https://github.com/trentm/node-bunyan) project and made some little adjustments in our API
to be compliant with it, to reduce developer learning curve, make our preexisting code compatible and keep (or even improve) [its great performance](https://www.loggly.com/blog/a-benchmark-of-five-node-js-logging-libraries/).
  

## Benchmark
A very basic [benchmark](./benchmark/index.js) with the most common use case has 
been setup to compare with [`bunyan`](https://github.com/trentm/node-bunyan)

Running on a MAC OS X Yosemite, 2,5 GHz Intel Core i5, 8 GB 1333 MHz DDR3, SSD disk, node 6.10.0
 
```
$ cd benchmark; npm start
 
> benchmarklogops@1.0.0 tee /Users/javier/Documents/Proyectos/logops/benchmark
> node index.js | tee -a out.log > /dev/null

logops x 70,675 ops/sec ±11.89% (65 runs sampled)
bunyan x 81,981 ops/sec ±4.76% (70 runs sampled)
Basic logging: Fastest is bunyan,logops
logops x 67,169,402 ops/sec ±2.79% (80 runs sampled)
bunyan x 5,774,822 ops/sec ±5.74% (75 runs sampled)
Disabled logging: Fastest is logops

> benchmarklogops@1.0.0 file /Users/javier/Documents/Proyectos/logops/benchmark
> node index.js > out.log

logops x 37,479 ops/sec ±5.69% (76 runs sampled)
bunyan x 36,211 ops/sec ±2.72% (77 runs sampled)
Basic logging: Fastest is logops
logops x 70,740,515 ops/sec ±1.71% (82 runs sampled)
bunyan x 6,324,283 ops/sec ±2.68% (78 runs sampled)
Disabled logging: Fastest is logops

> benchmarklogops@1.0.0 null /Users/javier/Documents/Proyectos/logops/benchmark
> node index.js > /dev/null

logops x 49,509 ops/sec ±4.92% (77 runs sampled)
bunyan x 47,759 ops/sec ±4.34% (69 runs sampled)
Basic logging: Fastest is logops
logops x 68,293,618 ops/sec ±2.64% (80 runs sampled)
bunyan x 6,232,825 ops/sec ±2.42% (81 runs sampled)
Disabled logging: Fastest is logops
```

## License

Copyright 2014, 2015 [Telefonica Investigación y Desarrollo, S.A.U](http://www.tid.es)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
