/**
* @module AsyncFileMediaLine
* @license MIT
* @author Federico Charra
*
* @requires fs
* @requires AbstractFileMediaLine.js
*/

const fs = require('fs');

const AbstractFileMediaLine = require('./AbstractFileMediaLine.js');

/**
* @augments {AbstractFileMediaLine}
* @classdesc Implementation of MediaLine specific to asynchronous file logging.
*/
module.exports = class AsyncFileMediaLine extends AbstractFileMediaLine {
  /**
  * @override
  * @desc Initialize basic configuration for asynchronous file logging.
  */
  constructor(config) {
    super(config);
  }

  /**
  * @method
  * @desc Logic for async processing of individual logs.
  * @param {LogEntry} logEntry - Entry object to be logged.
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
