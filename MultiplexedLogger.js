/**
* @module MultiplexedLogger
* @license MIT
* @author Federico Charra
*
* @requires mediaLines/MediaLineFactory
* @requires mediaLines/AbstractMediaLine
* @requires misc/globals
*/

const MediaLineFactory = require('./mediaLines/MediaLineFactory.js');
const AbstractMediaLine = require('./mediaLines/AbstractMediaLine.js');
const MPLogger_GLOBALS = require('./misc/globals.js');

/**
* @classdesc Logger's main entry point. Instantiate with proper configurations for each media, then use calling the (@link Logger.log) method.
*/
module.exports = class Logger {

  /**
  * @desc Set up all media from passed array of configuration objects.
  * @param {Object[]} - Array of configurations. (Vary for each media.)
  */
  constructor(configArray) {
    this.mediaLine = [];

    configArray.forEach( (config) =>
        this.mediaLine.push( MediaLineFactory(config) )
    )
  }

  /**
  * @desc Log to all configured media, a given message with a given priority.
  * @param {(string|MPLogger_GLOBALS.PRIORITY)} priority - A verbosity value that represents the priority of this entry, as defined in the globals object. It can either be string coded, or a numeric value in the range defined.
  * @param {string} message - The message to be logged.
  */
  log(priority, message) {
    let time = new Date();
    this.mediaLine.forEach( (media) => media.log(priority, message, time) );
  }

}
