/**
* @module AbstractMediaLine
* @license MIT
* @author Federico Charra
*
* @requires Settings
* @requires Helpers
* @requires module:LogEntry
* @requires module:LogQueue
*/

const MPLogger_SETTINGS = require('../misc/settings.js');

const helpers = require('../misc/helpers.js');

const LogEntry = require('../LogEntry.js');
const LogQueue = require('../LogQueue.js');

/**
* @abstract
* @augments Helpers.Abstract
* @classdesc Media lines specify different media behaviour for processing log entries, and hold reference of those logs that are in their (media line's) levels of verbosity via a private LogQueue object. This class abstracts away logic and attributes common to all the various implementations.
*/
module.exports = class AbstractMediaLine extends helpers.Abstract {
  /**
  * @abstract
  * @override
  * @desc Initialize basic configuration common to all MediaLine objects.
  * @param {Object} config - Configuration parameters object.
  * @param {(string|Globals.MEDIA)} config.media - Type of media to output log entries to.
  * @param {(string|Globals.PRIORITY)} config.verbosity - Level of verbosity for this particular log.
  */
  constructor(config) {
    super();
    /**
    * @readonly
    * @member {Globals.MEDIA}
    * @desc Type of media to output log entries to.
    */
    this.media = config.media || null;
    /**
    * @readonly
    * @member {Globals.PRIORITY}
    * @desc Level of verbosity for this particular log.
    */
    this.verbosity = helpers.parsePriority(
                       config.verbosity ||
                       MPLogger_SETTINGS.DEFAULT_VERBOSITY
                     );
    /**
    * @private
    * @readonly
    * @member {LogQueue}
    */
    this.queue = new LogQueue(this);
    /**
    * @private
    * @ignore
    * @readonly
    * @member {Processor}
    * @desc Inner object that abstracts away common logic for processing entries.
    */
    this.processor = new Processor(this);

  }

  /**
  * @public
  * @instance
  * @method log
  * @desc Send a LogEntry with the specified parameters to the queue, to wait in line for processing.
  * @param {Globals.PRIORITY} priority - Priority of the log entry.
  * @param {string} message - Data to be logged.
  * @param {Date} [time=null] - Time object to be used as timestamp. If ommited, the log entry will be stamped with the date and time of the log object's creation.
  */
  log(priority, message, time = null) {
    // Priority is ordered in reverse from min to max. (1 (highest) = SEC ALERT, 5 (lowest) = VERBOSE)
    if (helpers.parsePriority(priority) <= this.verbosity)
      this.queue.push(new LogEntry(priority, message, time));
  }

  /**
  * @public
  * @instance
  * @method processNext
  * @desc Called from this class' associated LogQueue object to signal the availability of more logs waiting in line for processing. Delegates generic processing to this class' processing object.
  */
  processNext() {
    this.processor.processEntry();
  }

  /**
  * @abstract
  * @protected
  * @instance
  * @method processingFunction
  * @desc Send log entry to be processed by this media instance. Override this method when extending to implement new media. Remember to return a Promise when you do it.
  * @param {module:LogEntry} logEntry - Entry object to be logged.
  * @returns {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(logEntry) {}

}

/**
* @inner
* @protected
* @desc Inner class that abstracts away common logic for processing entries. Concrete instances' processingFunction methods get called internally to delegate logic specific to each kind of media.
*/
class Processor {
  /** @param {AbstractMediaLine} context - Stores a reference to this processor's owner class. */
  constructor(context) {
    this.context = context;
    /** @member {string} state - Indicates to the queue whether the processor is waiting until the media is ready to begin ('waiting'), is ready for more processing ('listening'), or is currently processing a log entry ('busy'). */
    this.state = 'waiting';
  }

  /**
  * @protected
  * @async
  * @instance
  * @method
  * @desc Generic processing logic, common to all types of media. processingFunction gets called internally to delegate logic specific to each kind of media.
  */
  async processEntry() {
    if (this.state !== 'listening') return; // Not ready to process yet. LogEntry will be waiting in queue.
    let currLogEntry = this.context.queue.next();
    if (!currLogEntry) return; // "undefined" means we're done with the stack for the moment.

    this.state = 'busy';

    let strategy = this.context.processingFunction;

    /* But... Muh' encapsulation!!!
     * Yeah, some compromises were made to keep concerns
     * as separated and abstracted as possible... */
    try {
      await strategy.call(this.context, currLogEntry);
      this.state = 'listening'; // Ready for more processing
      this.context.queue.doneProcessing();
    }
    catch(err) {
      // Failure to log individual events will not be considered a fatal error, but will be logged via normal error console.
      console.error('Could not log. ' + Error(err));
    }
  }

}
