const MultiplexedLogger = require('../MultiplexedLogger.js');

var logger = new MultiplexedLogger([
                   {
                     verbosity: 'VERBOSE',
                     media: 'CONSOLE',
                     logFormat: 'PLAIN TEXT'
                   },
                   {
                     verbosity: 'WARNING',
                     media: 'FILE',
                     logFormat: 'JSON',
                     logFile: './testLog-Async.log'
                   },
                   {
                     verbosity: 'ERROR',
                     media: 'SYNC FILE',
                     logFormat: 'JSON',
                     logFile: './testLog-Sync.log'
                   }
                 ]);

logger.log('SECURITY ALERT', 'Esto es un Security Alert');
logger.log('SECURITY WARNING', 'Esto es un Security Warning');
logger.log('ERROR', 'Esto es un Error');
logger.log('WARNING', 'Esto es un Warning');
setTimeout( () => {
  logger.log('WARNING', 'Esto es un Warning diferido por 2 segundos');
}, 2000 );
logger.log('VERBOSE', 'Esto es un Verbose');
