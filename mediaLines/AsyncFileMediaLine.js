const fs = require('fs');

const AbstractFileMediaLine = require('./AbstractFileMediaLine.js');

/**
@main MultiplexedLogger
*/
module.exports = class AsyncFileMediaLine extends AbstractFileMediaLine {
  /**
  * Implementation of MediaLine specific to asynchronous file logging.
  * @class AsyncFileMediaLine
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
  * Logic for async file processing of individual logs.
  * @private
  * @method processingFunction
  * @param {LogEntry} logEntry Entry object to be logged.
  * @return {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(logEntry) {
    let logString = (this.logFormat === 'JSON')? logEntry.toJSONString() : (logEntry.toString() + '\n');

    return new Promise( (resolve, reject) => {
      // Remove starting comma from first entry. (Shame on you, JSON. You should just accept trailing commas already.)
      if (this.fileState === 'blank') {
        logString = logString.replace(',\n\t', '\n\t');
        this.fileState = 'initiated';
      }

      fs.appendFile(this.logFile, logString, 'utf8', (err) => {
        if (err) reject( Error('FATAL ERROR: Could not append to the log file.') );

        resolve(true);
      });
    });
  }

}
