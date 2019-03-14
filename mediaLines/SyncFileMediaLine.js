/**
* @module SyncFileMediaLine
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
* @classdesc Implementation of MediaLine specific to synchronous file logging.
*/
module.exports = class SyncFileMediaLine extends AbstractFileMediaLine {
  /**
  * @override
  * @desc Initialize basic configuration for synchronous file logging.
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
  * @desc Logic for sync processing of individual logs.
  * @param {module:LogEntry} logEntry - Entry object to be logged.
  * @returns {Promise} True if resolved, Error object if rejected.
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
