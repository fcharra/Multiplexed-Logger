const MultiplexedLogger = require('../MultiplexedLogger.js');

var logger = new MultiplexedLogger({ verbosity: 'VERBOSE', media: ['CONSOLE', 'FILE'], logFormat: 'PLAIN_TEXT' });

logger.log('SECURITY ALERT', 'Esto es un Security Alert');
logger.log('SECURITY WARNING', 'Esto es un Security Warning');
logger.log('ERROR', 'Esto es un Error');
logger.log('WARNING', 'Esto es un Warning');
setTimeout( () => {
  logger.log('WARNING', 'Esto es un Warning diferido por 2 segundos');
}, 2000 );
logger.log('VERBOSE', 'Esto es un Verbose');
