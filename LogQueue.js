/*
* @license MIT
* @author Federico Charra
*
* @requires module:AbstractMediaLine
* @requires module:LogEntry
*/

const AbstractMediaLine = require('./mediaLines/AbstractMediaLine.js');
const LogEntry = require('./LogEntry.js');

/**
* @main MultiplexedLogger
*/
module.exports = class LogQueue {
  /**
  * Represents a queue of log entries, ordered in a FIFO stack.
  * @class LogQueue
  * @constructor
  * @param {AbstractMediaLine} mediaLine (Concrete) Medialine owner of this queue.
  */
  constructor(mediaLine) {
    /**
    * An instance from a concrete implementation of the MediaLine class, that this queue will belong to.
    * @private
    * @readonly
    * @property mediaLine
    * @type {AbstractMediaLine}
    */
    this.mediaLine = mediaLine;
    /**
    * @private
    * @property queue
    * @type {LogEntry[]}
    */
    this.queue = [];
  }

  /**
  * Register a log entry in the queue. Log entries will stay in the queue until it's their turn to be processed. This class's associated media line object directs the entire process transparently to the user of this class.
  * @method push
  * @param {LogEntry} log LogEntry instance to be pushed to the queue. */
  push(log) {
    this.queue.push(log);
    this.mediaLine.processNext();
  }


  /**
  * Used by this class' associated media line object to signal its readiness to receive more logs. If this queue has log entries waiting in line to be processed, it will signal it back to the medialine object via {{#crossLink "AbstractMediaLine/processNext:method"}}its processNext method{{/crossLink}}, so that the processing can continue until the queue is empty.
  * @method doneProcessing
  */
  doneProcessing() {
    if (this.queue.length > 0)
      this.mediaLine.processNext();
  }

  /**
  * Pop and return the first element of the queue, which will be the oldest. (FIFO stack.)
  * @method next
  * @return {LogEntry|undefined} Oldest log entry in the stack. Undefined if stack is empty.
  */
  next() {
    return this.queue.shift();
  }

}
