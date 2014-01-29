# tdaf-node-logger

Really simple and performant logger for node projects compatible with TDAF deployments as 
[our Operations Team defined](http://wikis.hi.inet/tdaf/index.php/OP%26S) 

## Installation
Use the develop branch until some release is done
```bash
npm install --save git+ssh://git@pdihub.hi.inet:TDAF/tdaf-node-logger.git#develop
```

## Usage
```js
var logger = require('tdaf-node-logger');
var context = {
  corr: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
  trans: 'cbefb082-3429-4f5c-aafd-26b060d6a9fc',
  op: 'SendEMail'
};

//plain strings
logger.debug(context, 'This is an example');

//util.format support
logger.info(context, 'Request %s %d %j', 'is', 5, {key: 'value'});

//Multi string
logger.warn(context, 'Something went wrong:', value);

//error as second parameter to print stack traces 
logger.error(context, new Error('Something went REALLY wrong'));

//errors as parameter to print messages only
logger.fatal(context, 'SYSTEM UNSTABLE. BYE', error);
```

### Delegated context support
If you are holding your context information in other places, like [Domains](http://nodejs.org/api/domain.html), you don't
need to pass a context to __every__ log function. Simply override the `logger.getContext` method to let the logger to get it.

```js
var logger = require('tdaf-node-logger');
//Set the operation 
logger.getContext = function getDomainContext() {
  return require('domain').active.myContextObject;
}

logger.debug('This is an example');
logger.info('Request %s %d %j', 'is', 5, {key: 'value'});
logger.warn('Something went wrong:', value);
logger.error(new Error('Something went REALLY wrong'));
logger.fatal('SYSTEM UNSTABLE. BYE', error);
```

### Trace format
This library incorporates two flavours of trace formatting for `development` and `production` usage. 
Checks the 'de-facto' NODE_ENV variable to use the built-in format functions.

In production, when you perform `node index.js` the lib will use the [format specified by our operations team in the TDAF wiki] (http://wikis.hi.inet/tdaf/index.php/OP%26S#Log_Format)
```bash
time=2014-01-29T10:31:32.288Z | lvl=ERROR | corr=cbefb082-3429-4f5c-aafd-26b060d6a9fc | trans=cbefb082-3429-4f5c-aafd-26b060d6a9fc | op=SendSMS | msg=Message
```

If you execute your node app this way: `NODE_ENV=development node index.js` the logger will write traces for developers
```bash
ERROR Message
```

### Logger Level
You can set the loggin level ant any time. All the disabled logging methods are replaced by a noop,
so there is not any performance penalty at production using an undesired level
```js
var logger = require('tdaf-node-logger');

// {String} level one of the following values ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
logger.setLevel('DEBUG');
```

### Writing to files
This library writes by default to `process.stdout`, the safest, fastest and easy way to manage logs. It's how you execute your app when 
you define how to manage logs. This way, you completly delegate to the operations team this management, and you dont need
to change your source code to fit with every need.

This approach is also compatible with [logratate](http://linuxcommand.org/man_pages/logrotate8.html) as this is how [OPs manage
the logs](http://wikis.hi.inet/tdaf/index.php/OP%26S#Log_file_naming_conventions). Therefore you don't need to put __anything__ 
in your source code relative to logs, and all is done at execution time depending on the deployment (and the OPs team).

__Recommended execution:__ Pipelining the stdout to [tee](http://en.wikipedia.org/wiki/Tee_(command). 
With this configuration, you write logs fully asyncronously and don't fails when the disk is full. It's also the best 
performant solution
```
node index.js | tee -a ./out.log > /dev/null
```

You can also write logs syncronously and fail miserabilly stopping your app when the disk is full by doing
```bash
node index.js > ./out.log
```

## Customization

### Trace format
You can override the format function and manage by yourself the formatting taking into account your own environment variables by 
overriding the `logger.format` function

```js
var logger = require('tdaf-node-logger');
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
var logger = require('tdaf-node-logger');
logger.stream = new MyOtherSuperStreamThatDoesGreatThingsExceptWriteToDisk();
```


## Development Documentation
### Project build
The project is managed using Grunt Task Runner.

For a list of available task, type
```bash
grunt --help
```

The following sections show the available options in detail.


### Testing
[Mocha](http://visionmedia.github.io/mocha/) Test Runner + [Chai](http://chaijs.com/) Assertion Library + [Sinon](http://sinonjs.org/) Spies, stubs.

The test environment is preconfigured to run [BDD](http://chaijs.com/api/bdd/) testing style with
`chai.expect` and `chai.should()` available globally while executing tests, as well as the [Sinon-Chai](http://chaijs.com/plugins/sinon-chai) plugin.

Module mocking during testing can be done with [proxyquire](https://github.com/thlorenz/proxyquire)

To run tests, type
```bash
grunt test
```

Tests reports can be used together with Jenkins to monitor project quality metrics by means of TAP or XUnit plugins.
To generate TAP report in `report/test/unit_tests.tap`, type
```bash
grunt test-report
```


### Coding guidelines
jshint, gjslint

Uses provided .jshintrc and .gjslintrc flag files. The latter requires Python and its use can be disabled
while creating the project skeleton with grunt-init.
To check source code style, type
```bash
grunt lint
```

Checkstyle reports can be used together with Jenkins to monitor project quality metrics by means of Checkstyle
and Violations plugins.
To generate Checkstyle and JSLint reports under `report/lint/`, type
```bash
grunt lint-report
```


### Continuous testing

Support for continuous testing by modifying a src file or a test.
For continuous testing, type
```bash
grunt watch
```


### Source Code documentation
dox-foundation

Generates HTML documentation under `site/doc/`. It can be used together with jenkins by means of DocLinks plugin.
For compiling source code documentation, type
```bash
grunt doc
```


### Code Coverage
Istanbul

Analizes the code coverage of your tests.

To generate an HTML coverage report under `site/coverage/` and to print out a summary, type
```bash
# Use git-bash on Windows
grunt coverage
```

To generate a Cobertura report in `report/coverage/cobertura-coverage.xml` that can be used together with Jenkins to
monitor project quality metrics by means of Cobertura plugin, type
```bash
# Use git-bash on Windows
grunt coverage-report
```


### Code complexity
Plato

Analizes code complexity using Plato and stores the report under `site/report/`. It can be used together with jenkins
by means of DocLinks plugin.
For complexity report, type
```bash
grunt complexity
```

### PLC

Update the contributors for the project
```bash
grunt contributors
```


### Development environment

Initialize your environment with git hooks

```bash
grunt init-dev-env
```
