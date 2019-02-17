const LogProcessor = require('./LogProcessor.js');

module.exports = class LogQueue {

  constructor(logger) {
    this.logProcessor = new LogProcessor(this, logger);
    this.queue = [];
  }

  push(log) {
    this.queue.push(log);
    this.logProcessor.processEntry();
  }

  doneProcessing() {
    this.logProcessor.processEntry();
  }

  next() {
    return this.queue.shift();
  }

}
