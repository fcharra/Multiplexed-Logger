const MediaLineFactory = require('./mediaLines/MediaLineFactory.js');
const AbstractMediaLine = require('./mediaLines/AbstractMediaLine.js');
const MPLogger_GLOBALS = require('./misc/globals.js');

/**
* @module MultiplexedLogger
*/
module.exports = class Logger {
  /**
  * Logger's main entry point. Instantiate with proper configurations for each media, then use calling the {{#crossLink "MultiplexedLogger/log:method"}}{{/crossLink}} method.
  * @class MultiplexedLogger
  * @constructor
  * @param {Object[]} configArray Array of configurations. (Vary for each media.)
  */
  constructor(configArray) {
    /**
    * Array of media ({@link module:AbstractMediaLine} derived objects) that this logger will log to.
    * @public
    * @property mediaLine
    * @type {Object[]}
    */
    this.mediaLine = [];

    configArray.forEach( (config) =>
        this.mediaLine.push( MediaLineFactory(config) )
    )
  }

  /**
  * Log to all configured media, a given message with a given priority.
  * @public
  * @method log
  * @param {string|Globals.PRIORITY} priority A verbosity value that represents the priority of this entry, as defined in the globals object. It can either be string coded, or a numeric value in the range defined.
  * @param {string} message The message to be logged.
  */
  log(priority, message) {
    let time = new Date();
    this.mediaLine.forEach( (media) => media.log(priority, message, time) );
  }

}
