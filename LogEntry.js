const MPLogger_GLOBALS = require('./misc/globals.js');
const helpers = require('./misc/helpers.js');

module.exports = class LogEntry {

  constructor(priority, message) {
    this.timestamp = new Date().toISOString();
    this.priority = helpers._parsePriority(priority);
    this.priorityTag = MPLogger_GLOBALS.PRIORITY.properties[this.priority].tag;
    this.message = message;
  }

  toString() {
    return `${this.timestamp} - \(${this.priorityTag}\): ${this.message}`;
  }

  toJSON() {
    return {
      'Timestamp': this.timestamp,
      'Priority': this.priority,
      'Priority tag': this.priorityTag,
      'Message': this.message
    };
  }

}
