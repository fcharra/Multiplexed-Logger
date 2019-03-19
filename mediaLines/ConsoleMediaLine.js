const AbstractMediaLine = require('./AbstractMediaLine.js');
const MPLogger_GLOBALS = require('../misc/globals.js');

/**
@main MultiplexedLogger
*/
module.exports = class ConsoleMediaLine extends AbstractMediaLine {
  /**
  * Initialize basic configuration for console output.
  * @class ConsoleMediaLine
  * @constructor
  * @extends AbstractMediaLine
  * @param {Object} config Configuration parameters object. Inherits all of {{#crossLink "AbstractMediaLine"}}{{/crossLink}}'s config object parameters, plus the following:
  * @param {string} [config.logFormat='PLAIN TEXT'] Format to output logs in.
  */
  constructor(config) {
    super(config);
    /**
    * Format to output logs in.
    * @private
    * @writeOnce
    * @property logFormat
    * @type {string}
    */
    this.logFormat = config.logFormat || 'PLAIN TEXT';

    // Inform the processor this media is ready to process.
    this.processor.mediaIsReady();
  }

  /**
  * Output to error console if priority is higher than Error. Otherwise, output to log console.
  * @private
  * @method processingFunction
  * @param {LogEntry} logEntry Entry object to be logged.
  * @return {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(logEntry) {
    let logString = (this.logFormat === 'JSON')? logEntry.toJSONString() : logEntry.toString();

    return new Promise( (resolve, reject) => {
      if (!logEntry) reject(Error("Invalid or null log entry"));

      if (logEntry.priority <= MPLogger_GLOBALS.PRIORITY.ERROR) console.error(logString);
      else console.log(logString);

      resolve(true);
    });
  }
}
