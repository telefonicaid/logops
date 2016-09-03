
import * as logops from '../lib/logops';

let lvl = logops.getLevel();

logops.setLevel(lvl);

logops.getContext = function() {
    return { a: 1 };
};

logops.stream = process.stderr;

logops.format = logops.formatters.dev;
logops.format = logops.formatters.json;
logops.format = logops.formatters.pipe;

logops.formatters.dev.omit = ['a'];
logops.formatters.stacktracesWith = ['DEBUG'];
logops.formatters.setNotAvailable('nope');

logops.debug({ a: 1 });
logops.debug({ a: 1 }, 'Some');
logops.debug({ a: 1 }, 'Some %d', 1);
logops.debug(new Error('Error'));
logops.debug(new Error('Error'), 'Some');
logops.debug(new Error('Error'), 'Some %d', 1);
logops.debug('Some');
logops.debug('Some %d', 1);

logops.info({ a: 1 });
logops.info({ a: 1 }, 'Some');
logops.info({ a: 1 }, 'Some %d', 1);
logops.info(new Error('Error'));
logops.info(new Error('Error'), 'Some');
logops.info(new Error('Error'), 'Some %d', 1);
logops.info('Some');
logops.info('Some %d', 1);

logops.warn({ a: 1 });
logops.warn({ a: 1 }, 'Some');
logops.warn({ a: 1 }, 'Some %d', 1);
logops.warn(new Error('Error'));
logops.warn(new Error('Error'), 'Some');
logops.warn(new Error('Error'), 'Some %d', 1);
logops.warn('Some');
logops.warn('Some %d', 1);

logops.error({ a: 1 });
logops.error({ a: 1 }, 'Some');
logops.error({ a: 1 }, 'Some %d', 1);
logops.error(new Error('Error'));
logops.error(new Error('Error'), 'Some');
logops.error(new Error('Error'), 'Some %d', 1);
logops.error('Some');
logops.error('Some %d', 1);

logops.fatal({ a: 1 });
logops.fatal({ a: 1 }, 'Some');
logops.fatal({ a: 1 }, 'Some %d', 1);
logops.fatal(new Error('Error'));
logops.fatal(new Error('Error'), 'Some');
logops.fatal(new Error('Error'), 'Some %d', 1);
logops.fatal('Some');
logops.fatal('Some %d', 1);
