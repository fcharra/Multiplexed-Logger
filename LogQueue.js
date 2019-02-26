/**
* @module LogQueue
* @license MIT
* @author Federico Charra
*
* @requires mediaLines/AbstractMediaLine.js
* @requires LogEntry.js
*/

const AbstractMediaLine = require('./mediaLines/AbstractMediaLine.js');
const LogEntry = require('./LogEntry.js');

/**
* @classdesc Represents a queue of log entries, ordered in a FIFO stack.
*/
module.exports = class LogQueue {

  /**
  * @param {AbstractMediaLine} mediaLine - An instance from a concrete implementation of the MediaLine class, that this queue will belong to.
  */
  constructor(mediaLine) {
    /** @private @member {AbstractMediaLine} */
    this.mediaLine = mediaLine;
    /** @private @member {LogEntry[]} */
    this.queue = [];
  }

  /**
  * @desc Register a log entry in the queue. Log entries will stay in the queue until it's their turn to be processed. This class's associated media line object directs the entire process transparently to the user of this class.
  * @param {LogEntry} log - LogEntry instance to be pushed to the queue. */
  push(log) {
    this.queue.push(log);
    this.mediaLine.processEntry();
  }


  /**
  * @desc Used by this class's associated media line object to signal its readiness to receive more logs. If this queue has log entries waiting in line to be processed, it will signal it back to the medialine object via {@link AbstractMediaLine.processEntry}, so that the processing can continue until the queue is empty.
  */
  doneProcessing() {
    if (this.queue.length > 0)
      this.mediaLine.processEntry();
  }

  /**
  * @desc Pop and return the first element of the queue, which will be the oldest. (FIFO stack.)
  * @returns {LogEntry} Oldest log entry in the stack.
  */
  next() {
    return this.queue.shift();
  }

}
