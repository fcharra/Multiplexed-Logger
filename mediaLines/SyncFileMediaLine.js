const fs = require('fs');

const AbstractFileMediaLine = require('./AbstractFileMediaLine.js');

module.exports = class SyncFileMediaLine extends AbstractFileMediaLine {

  constructor(config) {
    super(config);
  }

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
