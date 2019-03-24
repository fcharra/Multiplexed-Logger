const MPLogger_GLOBALS = require('./misc/globals.js');
const helpers = require('./misc/helpers.js');

/**
* @main MultiplexedLogger
*/
module.exports = class LogEntry {
  /**
  * Represents an individual entry in the log.
  * @class LogEntry
  * @constructor
  * @param {string|Globals.PRIORITY} priority A verbosity value that represents the priority of this entry, as defined in the globals object. It can either be string coded, or a numeric value in the range defined.
  * @param {string} message Message to be logged.
  * @param {Date} [time=null] Time at which the event took place. If ommited, the constructor will assign one when this instance of the entry is created. (Which means it can differ from media to media, even for the same event.)
  * @throws {TypeError} If any of the arguments are not of a valid type.
  */
  constructor(priority, message, time = null) {
    if (!time) time = new Date();
    if (!time instanceof Date) throw TypeError('time must be a Date object.');
    if (typeof message !== 'string') throw TypeError('message must be a string.');

    /**
    * Time at which the event took place.
    * @property timestamp
    * @type {string}
    */
    this.timestamp = time.toISOString();
    /**
    * A verbosity value that represents the priority of this entry, as defined in the globals object.
    * @writeOnce
    * @property priority
    * @type {number|Globals.PRIORITY}
    */
    this.priority = helpers.parsePriority(priority);
    /**
    * Tag corresponding to the priority level of the object.
    * @private
    * @writeOnce
    * @property priorityTag
    * @type {string}
    */
    this.priorityTag = MPLogger_GLOBALS.PRIORITY.properties[this.priority].tag;
    /**
    * Message to be logged.
    * @writeOnce
    * @property message
    * @type {string}
    */
    this.message = message;
  }


  /**
  * Returns a string representing the log entry.
  * @method toString
  * @return {string} A string representing the log entry.
  */
  toString() {
    return `${this.timestamp} - \(${this.priorityTag}\): ${this.message}`;
  }

  /**
  * Returns a JSON-formatted string representing the log entry.
  * @method toJSONString
  * @return {string} A JSON-formatted string representing the log entry.
  */
  toJSONString() {
    let entry = `,\n\t"${this.timestamp}": {
      \t\t"Priority": ${this.priority},
      \t\t"Priority tag": "${this.priorityTag}",
      \t\t"Message": "${this.message}"\n\t}`;

    return entry;
  }

}
