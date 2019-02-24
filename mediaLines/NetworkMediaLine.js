const AbstractMediaLine = require('./AbstractMediaLine.js');

module.exports = class NetworkMediaLine extends AbstractMediaLine {
  constructor(config) {
    super(config);
  }

  processingFunction(logEntry) {
    // TODO: implement transmitting via HTTP to server
    return new Promise( (resolve, reject) => {
      resolve(true);
    });
  }
}
