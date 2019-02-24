const MPLogger_GLOBALS = require('../misc/globals.js');
const MPLogger_SETTINGS = require('../misc/settings.js');

const helpers = require('../misc/helpers.js');

const LogEntry = require('../LogEntry.js');
const LogQueue = require('../LogQueue.js');

module.exports = class AbstractMediaLine extends helpers.Abstract {

  constructor(config) {
    super();

    this.media = config.media || null;

    this.verbosity = helpers.parsePriority(
                       config.verbosity ||
                       MPLogger_SETTINGS.DEFAULT_VERBOSITY
                     );

    this.queue = new LogQueue(this);

    this.processor = new Processor(this);

  }

  log(priority, message) {
    if (helpers.parsePriority(priority) <= this.verbosity)
      this.queue.push(new LogEntry(priority, message));
  }

  processEntry() {
    this.processor.processEntry();
  }

  // Override this method when extending
  // to implement new media. Remember
  // to return a Promise when you do it.
  processingFunction(logEntry) {}

}

class Processor {

  constructor(context) {
    this.context = context;
    this.state = 'listening';
    this.strategy = null; // Will be set in constructor of subclasses
  }

  async processEntry() {
    if (!this.state === 'listening') return; // Not ready to process yet. LogEntry will be waiting in queue.
    let currLogEntry = this.context.queue.next();
    if (!currLogEntry) return; // "undefined" means we're done with the stack for the moment.

    this.state = 'busy';

    let strategy = this.context.processingFunction;

    /* But... Muh' encapsulation!!!
     * Yeah, some compromises were made to keep concerns
     * as separated and abstracted as possible... */
    await strategy.call(this.context, currLogEntry)
          .then( () => {
            this.state = 'listening'; // Ready for more processing
            this.context.queue.doneProcessing();
          })
          .catch( (err) => {
            console.error('Could not log. ' + Error(err));
            this.state = 'listening'; // Ready for more processing
            return;
          });
  }

}
