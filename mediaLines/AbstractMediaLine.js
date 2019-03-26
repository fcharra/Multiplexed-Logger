const MPLogger_SETTINGS = require('../misc/settings.js');

const helpers = require('../misc/helpers.js');

const LogEntry = require('../LogEntry.js');
const LogQueue = require('../LogQueue.js');

/**
* @main MultiplexedLogger
*/
module.exports = class AbstractMediaLine {
  /**
  * Media lines specify different media behaviour for processing log entries, and hold reference of those logs that are in their (media line's) levels of verbosity via a private LogQueue object. This class abstracts away logic and attributes common to all the various implementations.
  * @class AbstractMediaLine
  * @constructor
  * @extends Helpers.Abstract
  * @param {Object} config Configuration parameters object.
  * @param {string|Globals.MEDIA} config.media Type of media to output log entries to.
  * @param {string|Globals.PRIORITY} config.verbosity Level of verbosity for this particular log.
  * @throws {TypeError} If the config parameter is invalid.
  */
  constructor(config) {
    // Unparseable verbosity is handled by the parser.
    let doError = false;
    if (!config)
      doError = true;
    if (!(config instanceof Object))
      doError = true;
    if (config.verbosity && (typeof config.verbosity !== 'string'))
      doError = true;
    if (!(config.media))
      doError = true;
    if (typeof config.media !== 'string')
      doError = true;

    if (doError) throw TypeError('Invalid config parameter');

    /**
    * Type of media to output log entries to.
    * @public
    * @writeOnce
    * @property media
    * @type {Globals.MEDIA}
    */
    this.media = config.media;
    /**
    * Level of verbosity for this particular log.
    * @public
    * @writeOnce
    * @property verbosity
    * @type {Globals.PRIORITY}
    */
    this.verbosity = helpers.parsePriority(
                       config.verbosity ||
                       MPLogger_SETTINGS.DEFAULT_VERBOSITY
                     );
    /**
    * @protected
    * @writeOnce
    * @property queue
    * @type {LogQueue}
    */
    this.queue = new LogQueue(this);
    /**
    * Inner object that abstracts away common logic for processing entries.
    * @protected
    * @writeOnce
    * @property processor
    * @type {Processor}
    */
    this.processor = new Processor(this);

  }

  /**
  * Send a LogEntry with the specified parameters to the queue, to wait in line for processing.
  * @public
  * @method log
  * @param {Globals.PRIORITY} priority Priority of the log entry.
  * @param {string} message Data to be logged.
  * @param {Date} [time=null] Time object to be used as timestamp. If ommited, the log entry will be stamped with the date and time of the log object's creation.
  */
  log(priority, message, time = null) {
    // Priority is ordered in reverse from min to max. (1 (highest) = SEC ALERT, 5 (lowest) = VERBOSE)
    if (helpers.parsePriority(priority) <= this.verbosity)
      this.queue.push(new LogEntry(priority, message, time));
  }

  /**
  * Called from this class' associated LogQueue object to signal the availability of more logs waiting in line for processing. Delegates generic processing to this class' processing object.
  * @public
  * @method processNext
  */
  processNext() {
    this.processor.processEntry();
  }

  /**
  * !ABSTRACT! Send log entry to be processed by this media instance. Override this method when extending to implement new media. Remember to return a Promise when you do it.
  * @protected
  * @method processingFunction
  * @param {LogEntry} logEntry Entry object to be logged.
  * @return {Promise} True if resolved, Error object if rejected.
  */
  processingFunction(logEntry) {}

}

class Processor {
  /**
  * Inner class that abstracts away common logic for processing entries. Concrete instances' processingFunction methods get called internally to delegate logic specific to each kind of media.
  * @class Processor
  * @constructor
  * @param {AbstractMediaLine} context Stores a reference to this processor's owner class. */
  constructor(context) {
    /**
    * Stores a reference to this processor's owner class.
    * @protected
    * @writeOnce
    * @property context
    * @type {AbstractMediaLine}
    */
    this.context = context;
    /**
    * Indicates to the queue whether the processor is waiting until the media is ready to begin ('waiting'), is ready for more processing ('listening'), or is currently processing a log entry ('busy').
    * @protected
    * @property state
    * @type {string}
    */
    this.state = 'waiting';
  }

  /**
  * Used by media to signal they are ready to start receiving logs.
  * @public
  * @method mediaIsReady
  */
  mediaIsReady() {
    this.state = 'listening';
    this.context.processNext();
  }

  /**
  * Generic processing logic, common to all types of media. processingFunction gets called internally to delegate logic specific to each kind of media.
  * @protected
  * @async
  * @method processEntry
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
