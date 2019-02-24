const fs = require('fs');

const AbstractFileMediaLine = require('./AbstractFileMediaLine.js');

module.exports = class AsyncFileMediaLine extends AbstractFileMediaLine {

  constructor(config) {
    super(config);
  }

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
