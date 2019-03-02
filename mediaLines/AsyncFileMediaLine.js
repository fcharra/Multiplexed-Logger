/**
* @module AsyncFileMediaLine
* @license MIT
* @author Federico Charra
*
* @requires fs
* @requires module:AbstractFileMediaLine
*/

const fs = require('fs');

const AbstractFileMediaLine = require('./AbstractFileMediaLine.js');

/**
* @augments module:AbstractFileMediaLine
* @classdesc Implementation of MediaLine specific to asynchronous file logging.
*/
module.exports = class AsyncFileMediaLine extends AbstractFileMediaLine {
  /**
  * @override
  * @desc Initialize basic configuration for asynchronous file logging.
  * @param {Object} config - Configuration parameters object.
  * @param {string} config.logFile - Path to log file, file name, and extension. Behaviour with other kinds of paths from nodejs fs module API remain untested at the moment.
  * @param {string} [config.logFormat='PLAIN TEXT'] - Format to output logs in.
  */
  constructor(config) {
    super(config);
  }

  /**
  * @augments module:AbstractMediaLine#processingFunction
  * @private
  * @instance
  * @method processingFunction
  * @desc Logic for async file processing of individual logs.
  * @param {module:LogEntry} logEntry - Entry object to be logged.
  * @returns {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(logEntry) {
    let logString = (this.logFormat === 'JSON')? (logEntry.toJSONString() + '\n') : (logEntry.toString() + '\n');

    return new Promise( (resolve, reject) => {
      fs.appendFile(this.logFile, logString, 'utf8', (err) => {
        if (err) reject( Error('FATAL ERROR: Could not append to the log file.') );

        resolve(true);
      });
    });
  }

}
