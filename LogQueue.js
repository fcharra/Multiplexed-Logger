module.exports = class LogQueue {

  constructor(mediaLine) {
    this.mediaLine = mediaLine;
    this.queue = [];
  }

  push(log) {
    this.queue.push(log);
    this.mediaLine.processEntry();
  }

  doneProcessing() {
    if (this.queue.length > 0)
      this.mediaLine.processEntry();
  }

  next() {
    return this.queue.shift();
  }

}
