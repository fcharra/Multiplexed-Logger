/**
* @module ConsoleMediaLine
* @license MIT
* @author Federico Charra
*
* @requires module:AbstractMediaLine
* @requires Globals
*/

const AbstractMediaLine = require('./AbstractMediaLine.js');
const MPLogger_GLOBALS = require('../misc/globals.js');

/**
* @augments module:AbstractMediaLine
* @classdesc Implementation of MediaLine specific to console output.
*/
module.exports = class ConsoleMediaLine extends AbstractMediaLine {
  /**
  * @override
  * @desc Initialize basic configuration for console output.
  * @param {Object} config - Configuration parameters object.
  */
  constructor(config) {
    super(config);
    /**
    * @readonly
    * @member {string}
    * @desc Format to output logs in.
    */
    this.logFormat = config.logFormat || 'PLAIN TEXT';
  }

  /**
  * @augments module:AbstractMediaLine#processingFunction
  * @private
  * @instance
  * @method processingFunction
  * @desc Output to error console if priority is higher than Error. Otherwise, output to log console.
  * @param {module:LogEntry} logEntry - Entry object to be logged.
  * @returns {Promise} True if resolved, Error object if rejected.
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
