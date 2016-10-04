/** Simple and performant nodejs JSON logger */

/**
 * The NODEJS stream where the logger will write string traces
 * Defaults to process.stdout
 */
export function setStream(stream: NodeJS.WritableStream): void;
export let stream: NodeJS.WritableStream;

/**
 * Log levels
 */
type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
/**
 * Gets the current log level. The default level is INFO
 */
export function getLevel(): Level;

/**
 * Sets the enabled logging level.
 * All the disabled logging methods are replaced by a noop,
 * so there is not any performance penalty at production using an undesired level
 * You can also set the logging level using the `LOGOPS_LEVEL` environment variable:
 * ```
 * $> LOGOPS_LEVEL=DEBUG node app.js
 * ```
 *
 * @param level one of 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'
 */
export function setLevel(level: Level): void;

/**
 * Sets a global context that should be printed and merged with specific
 * log context props
 *
 * @example
 * ```
 * logops.setContextGetter(function getContext() {
 *  return {
 *    hostname: require('os').hostname,
 *    pid: process.pid
 *  };
 * });
 *
 * logger.info({app: 'server'}, 'Startup');
 * // {"hostname":"host.local","pid":35502,"app":"server","time":"2015-12-23T11:47:25.862Z","lvl":"INFO","msg":"Startup"}
 * ```
 *  @return The context object
 */
export function setContextGetter(getContext: () => Context): void;
export function getContext(): Context;

/**
 * Specifies the Formatter used for printing traces
 * @example
 * ```
 * logops.setFormat(logops.formatters.dev);
 * ```
 *
 * You can also set the format specifying the formatter with `LOGOPS_FORMAT` environment variable:
 * @example
 * ```
 * $> LOGOPS_FORMAT=json node app.js
 * ```
 */
export function setFormat(format: Formatter): void;
export let format: Formatter;

/**
 * The available formatters
 */
export let formatters: Formatters;

/**
 * Logs a debug trace with the provided Context
 * ```
 * logger.debug({ip: '127.0.0.0'}, 'Something went wrong');
 * // {"ip":"127.0.0.0","time":"2015-12-22T16:33:17.002Z","lvl":"DEBUG","msg":"Something went wrong"}
 * ```
 *
 * @param props the Context to print
 * @param format A printf-like format string as you will use in console.log()
 * @param params Additional properties to be coerced in the format string
 */
export function debug(props:Context, format?:string, ...params:any[]): void;

/**
 * Logs an Error as a debug trace.
 * See Logops.stacktracesWith to print the stack traces
 * ```
 * logger.debug(new Error('Out of memory'), 'SYSTEM UNSTABLE. BYE');
 * ```
 *
 * @param error the Error to serialize and print
 * @param format A printf-like format string as you will use in console.log().
 *  If not present, the message will be the Error message itself
 * @param params Additional properties to be coerced in the format string
 */
export function debug(error:Error, format?:string, ...params:any[]): void;

/**
 * Logs a debug trace, as you will do with console.log
 * ```
 * logger.debug('Request %s %d %j', 'is', 5, {key: 'value'}, 'guy');
 * // {"time":"2015-12-22T16:31:56.184Z","lvl":"DEBUG","msg":"Request is 5 {\"key\":\"value\"} guy"}
 * ```
 *
 * @param format A printf-like format string as you will use in console.log().
 * @param params Additional properties to be coerced in the format string
 */
export function debug(format:string, ...params:any[]): void;

/**
 * Logs an info trace with the provided Context
 * ```
 * logger.info({ip: '127.0.0.0'}, 'Something went wrong');
 * // {"ip":"127.0.0.0","time":"2015-12-22T16:33:17.002Z","lvl":"INFO","msg":"Something went wrong"}
 * ```
 *
 * @param props the Context to print
 * @param format A printf-like format string as you will use in console.log()
 * @param params Additional properties to be coerced in the format string
 */

export function info(props:Context, format?:string, ...params:any[]): void;
/**
 * Logs an Error as a info trace.
 * See Logops.stacktracesWith to print the stack traces
 * ```
 * logger.info(new Error('Out of memory'), 'SYSTEM UNSTABLE. BYE');
 * ```
 *
 * @param error the Error to serialize and print
 * @param format A printf-like format string as you will use in console.log().
 *  If not present, the message will be the Error message itself
 * @param params Additional properties to be coerced in the format string
 */
export function info(error:Error, format?:string, ...params:any[]): void;

/**
 * Logs a info trace, as you will do with console.log
 * ```
 * logger.info('Request %s %d %j', 'is', 5, {key: 'value'}, 'guy');
 * // {"time":"2015-12-22T16:31:56.184Z","lvl":"INFO","msg":"Request is 5 {\"key\":\"value\"} guy"}
 * ```
 *
 * @param format A printf-like format string as you will use in console.log().
 * @param params Additional properties to be coerced in the format string
 */
export function info(format:string, ...params:any[]): void;

/**
 * Logs a warning trace with the provided Context
 * ```
 * logger.warn({ip: '127.0.0.0'}, 'Something went wrong');
 * // {"ip":"127.0.0.0","time":"2015-12-22T16:33:17.002Z","lvl":"WARN","msg":"Something went wrong"}
 * ```
 *
 * @param props the Context to print
 * @param format A printf-like format string as you will use in console.log()
 * @param params Additional properties to be coerced in the format string
 */

export function warn(props:Context, format?:string, ...params:any[]): void;
/**
 * Logs an Error as a warn trace.
 * See Logops.stacktracesWith to print the stack traces
 * ```
 * logger.warn(new Error('Out of memory'), 'SYSTEM UNSTABLE. BYE');
 * ```
 *
 * @param error the Error to serialize and print
 * @param format A printf-like format string as you will use in console.log().
 *  If not present, the message will be the Error message itself
 * @param params Additional properties to be coerced in the format string
 */
export function warn(error:Error, format?:string, ...params:any[]): void;

/**
 * Logs a warn trace, as you will do with console.log
 * ```
 * logger.warn('Request %s %d %j', 'is', 5, {key: 'value'}, 'guy');
 * // {"time":"2015-12-22T16:31:56.184Z","lvl":"WARN","msg":"Request is 5 {\"key\":\"value\"} guy"}
 * ```
 *
 * @param format A printf-like format string as you will use in console.log().
 * @param params Additional properties to be coerced in the format string
 */
export function warn(format:string, ...params:any[]): void;

/**
 * Logs an error trace with the provided Context
 * ```
 * logger.error({ip: '127.0.0.0'}, 'Something went wrong');
 * // {"ip":"127.0.0.0","time":"2015-12-22T16:33:17.002Z","lvl":"ERROR","msg":"Something went wrong"}
 * ```
 *
 * @param props the Context to print
 * @param format A printf-like format string as you will use in console.log()
 * @param params Additional properties to be coerced in the format string
 */
export function error(props:Context, format?:string, ...params:any[]): void;

/**
 * Logs an Error as an error trace.
 * See Logops.stacktracesWith to print the stack traces
 * ```
 * logger.error(new Error('Out of memory'), 'SYSTEM UNSTABLE. BYE');
 * ```
 *
 * @param error the Error to serialize and print
 * @param format A printf-like format string as you will use in console.log().
 *  If not present, the message will be the Error message itself
 * @param params Additional properties to be coerced in the format string
 */
export function error(error:Error, format?:string, ...params:any[]): void;

/**
 * Logs a error trace, as you will do with console.log
 * ```
 * logger.error('Request %s %d %j', 'is', 5, {key: 'value'}, 'guy');
 * // {"time":"2015-12-22T16:31:56.184Z","lvl":"ERROR","msg":"Request is 5 {\"key\":\"value\"} guy"}
 * ```
 *
 * @param format A printf-like format string as you will use in console.log().
 * @param params Additional properties to be coerced in the format string
 */
export function error(format:string, ...params:any[]): void;

/**
 * Logs a fatal trace with the provided Context
 * ```
 * logger.fatal({ip: '127.0.0.0'}, 'Something went wrong');
 * // {"ip":"127.0.0.0","time":"2015-12-22T16:33:17.002Z","lvl":"FATAL","msg":"Something went wrong"}
 * ```
 *
 * @param props the Context to print
 * @param format A printf-like format string as you will use in console.log()
 * @param params Additional properties to be coerced in the format string
 */
export function fatal(props:Context, format?:string, ...params:any[]): void;

/**
 * Logs an Error as a debug trace.
 * See Logops.stacktracesWith to print the stack traces
 * ```
 * logger.fatal(new Error('Out of memory'), 'SYSTEM UNSTABLE. BYE');
 * ```
 *
 * @param error the Error to serialize and print
 * @param format A printf-like format string as you will use in console.log().
 *  If not present, the message will be the Error message itself
 * @param params Additional properties to be coerced in the format string
 */
export function fatal(error:Error, format?:string, ...params:any[]): void;

/**
 * Logs a fatal trace, as you will do with console.log
 * ```
 * logger.fatal('Request %s %d %j', 'is', 5, {key: 'value'}, 'guy');
 * // {"time":"2015-12-22T16:31:56.184Z","lvl":"FATAL","msg":"Request is 5 {\"key\":\"value\"} guy"}
 * ```
 *
 * @param format A printf-like format string as you will use in console.log().
 * @param params Additional properties to be coerced in the format string
 */
export function fatal(format:string, ...params:any[]): void;

/**
 * A key value map that should be printed and serialized as first class
 * citizien in the traces.
 */
interface Context {
    [key: string]: any;
}

/**
 * Interface for a logops formatter, that formats the user input as a readable
 * string ready to be written to a Stream
 */
interface Formatter {
    /**
     * Format the user input as a readable string ready to be written to a Stream
     * @param level One of the following values
     *      ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
     * @param context Additional information to add to the trace
     * @param message The main message to be added to the trace
     * @param args More arguments provided to the log function
     * @param err A cause error used to log extra information
     */
    format(level: string, context:Context, message:string, args:any[], err?:Error): string;
}

/**
 * The additional properties in a DevFormatter
 */
interface DevFormatter extends Formatter {
    /**
     * Context properties keys that should be skipped from printing in dev format
     */
    omit: string[];
}

/**
 * The formatters interface. All relative to customization of how a trace
 * is printed is located here
 */
interface Formatters {
    /**
     *  Formats a trace message in JSON format
     */
    json: Formatter;
    /**
     * Formats a trace message with some nice TTY colors
     */
    dev: DevFormatter;
    /**
     * Formats a trace message with fields separated by pipes.
     * @deprecated
     */
    pipe: Formatter;
    /**
     * Array of logger levels that will print error stacktraces
     * Defaults to `['ERROR', 'FATAL']
     */
    stacktracesWith: Level[];
    /**
     * Sets a value for those fields that are not available in the context. This field
     * will only be used in the 'pipes' formatter.
     *
     * @param str New value for not available fields.
     * @deprecated
     */
    setNotAvailable(str: string): void;
}
