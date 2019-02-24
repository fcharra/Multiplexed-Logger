const MPLogger_GLOBALS = require('./misc/globals.js');
const helpers = require('./misc/helpers.js');

module.exports = class LogEntry {

  constructor(priority, message) {
    this.timestamp = new Date().toISOString();
    this.priority = helpers.parsePriority(priority);
    this.priorityTag = MPLogger_GLOBALS.PRIORITY.properties[this.priority].tag;
    this.message = message;
  }

  toString() {
    return `${this.timestamp} - \(${this.priorityTag}\): ${this.message}`;
  }

  toJSONString() {
    let entry = `\t"${this.timestamp}": {
      \t\t"Priority": ${this.priority},
      \t\t"Priority tag": "${this.priorityTag}",
      \t\t"Message": "${this.message}"\n\t},`;

    return entry;
  }

}
