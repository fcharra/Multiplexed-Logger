const fs = require('fs');

const AbstractFileMediaLine = require('./AbstractFileMediaLine.js');

/**
* @main MultiplexedLogger
*/
module.exports = class SyncFileMediaLine extends AbstractFileMediaLine {
  /**
  * Implementation of MediaLine specific to synchronous file logging.
  * @class SyncFileMediaLine
  * @constructor
  * @extends AbstractFileMediaLine
  * @param {Object} config Configuration parameters object. Inherits all of {{#crossLink "AbstractMediaLine"}}{{/crossLink}}'s config object parameters, plus the following:
  * @param {string} config.logFile Path to log file, file name, and extension. Behaviour with other kinds of paths from nodejs fs module API remain untested at the moment.
  * @param {string} [config.logFormat='PLAIN TEXT'] Format to output logs in.
  */
  constructor(config) {
    super(config);
  }

  /**
  * Logic for sync file processing of individual logs.
  * @private
  * @method processingFunction
  * @param {LogEntry} logEntry Entry object to be logged.
  * @return {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(logEntry) {
    let logString = (this.logFormat === 'JSON')? logEntry.toJSONString() : (logEntry.toString() + '\n');

    return new Promise( (resolve, reject) => {
      try {
        // Remove starting comma from first entry. (Shame on you, JSON. You should just accept trailing commas already.)
        if (this.fileState === 'blank') {
          logString = logString.replace(',\n\t', '\n\t');
          this.fileState = 'initiated';
        }

        fs.appendFileSync(this.logFile, logString, 'utf8');
        resolve(true);
      }
      catch (err) {
        reject(Error('ERROR FATAL: No se pudo crear el archivo de log.'));
      }
    });
  }

}
