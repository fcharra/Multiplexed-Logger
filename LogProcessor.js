const MPLogger_GLOBALS = require('./misc/globals.js');

const Strategies = require('./strategies/Strategies.js');

module.exports = class LogProcessor {

  constructor(logQueue, logger) {
    this.currLogEntry = null;
    this.logger = logger;
    this.logQueue = logQueue;
    this.strategies = null;
    this.state = 'listening';
  }

  async processEntry() {
    if (!this.state === 'listening') return; // Not ready to process yet. LogEntry will be waiting in queue.
    this.currLogEntry = this.logQueue.next();
    if (!this.currLogEntry) return; // "undefined" means we're done with the stack for the moment.

    this.state = 'busy';
    this.strategies = this._setStrategies();

    await Promise.all(this.strategies)
          .then( () => {
            this.state = 'listening'; // Ready for more processing
            this.logQueue.doneProcessing();
          })
          .catch( (err) => {
            console.error('Could not log. ' + err);
            return;
          });
  }

  _setStrategies() {
    let workStack = [];

    this.logger.media.map( (obj) => {
      switch(obj) {
        case MPLogger_GLOBALS.MEDIA.CONSOLE:
          workStack.push( Strategies.consoleStrategy(this) );
          break;

        case MPLogger_GLOBALS.MEDIA.FILE:
          workStack.push( Strategies.fileStrategy(this) );
          break;

        case MPLogger_GLOBALS.MEDIA.SYNC_FILE:
          workStack.push( Strategies.syncFileStrategy(this) );
          break;

        case MPLogger_GLOBALS.MEDIA.NETWORK:
          workStack.push( Strategies.networkStrategy(this) );
          break;

        case MPLogger_GLOBALS.MEDIA.VOID:
          workStack.push( Strategies.voidStrategy(this) );
          break;
      }
    });

    return workStack;
  }

}
