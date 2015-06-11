# logops

Really simple and performant logger for node.js projects.

## Installation

```bash
npm install logops
```

## Basic usage

```js
var logger = require('logops');

//plain strings
logger.debug('This is an example');

//util.format support
logger.info('Request %s %d %j', 'is', 5, {key: 'value'});

//Multi string
logger.warn('Something went wrong:', value);

//error to print stack traces
logger.error(new Error('Something went REALLY wrong'));

//errors as parameter to print messages only
logger.fatal('SYSTEM UNSTABLE. BYE', error);
```

## Advanced usage

### Context support

Logops supports using a context holding information about a correlator (corr), transaction (trans) and operation (op).
If you pass a context object as a first argument, those fields are also logged as separate fields.

```js
var logger = require('logops');
var context = {
  corr: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
  trans: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
  op: 'SendEMail'
};

logger.debug(context, 'This is an example');
```

If you are holding your context information in other places, like [Domains](http://nodejs.org/api/domain.html), you don't
need to pass a context to __every__ log function. Simply override the `logger.getContext` method to let the logger to get it.

```js
var logger = require('logops');

logger.getContext = function getDomainContext() {
  return require('domain').active.myContextObject;
}

logger.debug('This is an example');
```

### Trace format

This library incorporates three flavors of trace formatting:
* "json": writes logs as JSON. This is the default value since 0.3.x
* "pipe": writes logs separating fields with pipes. This is the default value in logops <0.3.x
* "dev": for development, used if the 'de-facto' NODE_ENV variable is set to 'development'

```bash
logger.format = logger.formatters.json;
logger.debug('This is an example');
{"msg":"This is an example","time":"2015-06-11T08:36:16.628Z","level":"DEBUG","op":null,"corr":null,"trans":null}

logger.format = logger.formatters.pipe;
logger.debug('This is an example');
time=2015-06-11T08:36:16.628Z | lvl=DEBUG | corr=n/a | trans=n/a | op=n/a | msg=This is an example

logger.format = logger.formatters.dev;
logger.debug('This is an example');
This is an example
```

### Logger Level

You can set the logging level at any time. All the disabled logging methods are replaced by a noop,
so there is not any performance penalty at production using an undesired level

```js
var logger = require('logops');

// {String} level one of the following values ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
logger.setLevel('DEBUG');
```

### Writing to files

This library writes by default to `process.stdout`, the safest, fastest and easy way to manage logs. It's how you execute your app when
you define how to manage logs.

This approach is also compatible with [logratate](http://linuxcommand.org/man_pages/logrotate8.html) as this is how many servers and PaaS manage the logs.
Therefore you don't need to put __anything__ in your source code relative to logs, and all is done at execution time depending on the deployment.

__Recommended execution:__ Pipelining the stdout to [tee](http://en.wikipedia.org/wiki/Tee_(command).
With this configuration, you write logs fully asynchronously and don't fails when the disk is full. It's also the best
performant solution

```
node index.js | tee -a ./out.log > /dev/null
```

You can also write logs synchronously and fail miserably stopping your app when the disk is full by doing

```bash
node index.js > ./out.log
```

## Customization

### Trace format

You can override the format function and manage by yourself the formatting taking into account your own environment variables by
overriding the `logger.format` function

```js
var logger = require('logops');
/**
 * Return a String representation for a trace.
 * @param {String} level One of the following values
 *      ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
 * @param {Object} context Additional information to add to the trace
 * @param {String} message The main message to be added to the trace
 * @param {Array} args More arguments provided to the log function
 *
 * @return {String} The trace formatted
 */
logger.format = function myCustomFormat(level, context, message, args) {
  var str = '';
  //...
  return str;
};
```

### Output stream

If you want to pipe the output stream to any other stream in your source code, or even write to files *(not recommended)*,
you can override the stream used by this library

```js
var logger = require('logops');
logger.stream = new MyOtherSuperStreamThatDoesGreatThingsExceptWriteToDisk();
```

## More info

* [Development information](./README_DEV.md)

## License

Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
