/**
* @module SyncFileMediaLine
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
* @classdesc Implementation of MediaLine specific to synchronous file logging.
*/
module.exports = class SyncFileMediaLine extends AbstractFileMediaLine {
  /**
  * @override
  * @desc Initialize basic configuration for synchronous file logging.
  */
  constructor(config) {
    super(config);
  }
  /**
  * @method
  * @desc Logic for sync processing of individual logs.
  * @param {LogEntry} logEntry - Entry object to be logged.
  * @returns {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(logEntry) {
    let logString = (this.logFormat === 'JSON')? (logEntry.toJSONString() + '\n') : (logEntry.toString() + '\n');

    return new Promise( (resolve, reject) => {
      try {
        fs.appendFileSync(this.logFile, logString, 'utf8');
        resolve(true);
      }
      catch (err) {
        reject(Error('ERROR FATAL: No se pudo crear el archivo de log.'));
      }
    });
  }

}
