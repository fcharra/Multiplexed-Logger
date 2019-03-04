/**
* @module LogEntry
* @license MIT
* @author Federico Charra
*
* @requires Globals
* @requires Helpers
*/

const MPLogger_GLOBALS = require('./misc/globals.js');
const helpers = require('./misc/helpers.js');

/**
* @classdesc Represents an individual entry in the log.
*/
module.exports = class LogEntry {
  /**
  * @desc Initialize data attributes for this log entry.
  * @param {(string|Globals.PRIORITY)} priority - A verbosity value that represents the priority of this entry, as defined in the globals object. It can either be string coded, or a numeric value in the range defined.
  * @param {string} message - Message to be logged.
  * @param {Date} [time=null] - Time at which the event took place. If ommited, the constructor will assign one when this instance of the entry is created. (Which means it can differ from media to media, even for the same event.)
  */
  constructor(priority, message, time = null) {
    if (!time || !(time instanceof Date))
      time = new Date();

    /**
    * @package
    * @member {string}
    * @desc Time at which the event took place.
    */
    this.timestamp = time.toISOString();
    /**
    * @package
    * @readonly
    * @member {number|Globals.PRIORITY}
    * @desc A verbosity value that represents the priority of this entry, as defined in the globals object.
    */
    this.priority = helpers.parsePriority(priority);
    /**
    * @private
    * @readonly
    * @member {string}
    * @desc Tag corresponding to the priority level of the object.
    */
    this.priorityTag = MPLogger_GLOBALS.PRIORITY.properties[this.priority].tag;
    /**
    * @package
    * @readonly
    * @member {string}
    * @desc Message to be logged.
    */
    this.message = message;
  }


  /**
  * @instance
  * @method toString
  * @desc Returns a string representing the log entry.
  * @returns {string} A string representing the log entry.
  */
  toString() {
    return `${this.timestamp} - \(${this.priorityTag}\): ${this.message}`;
  }

  /**
  * @instance
  * @method toJSONString
  * @desc Returns a JSON-formatted string representing the log entry.
  * @returns {string} A JSON-formatted string representing the log entry.
  */
  toJSONString() {
    let entry = `\t"${this.timestamp}": {
      \t\t"Priority": ${this.priority},
      \t\t"Priority tag": "${this.priorityTag}",
      \t\t"Message": "${this.message}"\n\t},`;

    return entry;
  }

}
