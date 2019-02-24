const AbstractMediaLine = require('./AbstractMediaLine.js');
const MPLogger_GLOBALS = require('../misc/globals.js');

module.exports = class ConsoleMediaLine extends AbstractMediaLine {
  constructor(config) {
    super(config);
    this.logFormat = config.logFormat || 'PLAIN TEXT';
  }

  processingFunction(logEntry) {
    let logString = (this.logFormat === 'JSON')? logEntry.toJSONString() : logEntry.toString();

    return new Promise( (resolve, reject) => {
      if (!logEntry) reject(Error("Invalid or null log entry"));

      if (logEntry.priority <= MPLogger_GLOBALS.PRIORITY.ERROR) console.error( logString );
      else console.log( logString );

      resolve(true);
    });
  }
}
