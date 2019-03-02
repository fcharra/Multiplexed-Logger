/**
* @module MediaLineFactory
* @license MIT
* @author Federico Charra
*
* @requires module:AbstractMediaLine
* @requires module:ConsoleMediaLine
* @requires module:AsyncFileMediaLine
* @requires module:SyncFileMediaLine
* @requires module:NetworkMediaLine
* @requires Globals
*/

const AbstractMediaLine = require('./AbstractMediaLine.js');
const ConsoleMediaLine = require('./ConsoleMediaLine.js');
const AsyncFileMediaLine = require('./AsyncFileMediaLine.js');
const SyncFileMediaLine = require('./SyncFileMediaLine.js');
const NetworkMediaLine = require('./NetworkMediaLine.js');
const MPLogger_GLOBALS = require('../misc/globals.js');

/**
* @function mediaLineFactory
* @desc Return a new, properly configured instance of the Media Line subclass corresponding to the passed configuration object's media attribute.
* @param {Object} config - Configuration parameters object. Carries all pertinent configurations to apply to the media handler (MediaLine object) to be created.
* @param {(Globals.PRIORITY|string)} config.media - Attribute specifying what media handler to create.
* @throws {TypeError} Argument config must be a valid type of media.
* @returns {module:AbstractMediaLine}
*/
module.exports = function(config) {
  switch(config.media) {
    case 'CONSOLE':
      return new ConsoleMediaLine(config);
    case 'FILE':
      return new AsyncFileMediaLine(config);
    case 'SYNC FILE':
      return new SyncFileMediaLine(config);
    case 'NETWORK':
      return new NetworkMediaLine(config);
    default:
      throw new TypeError("Invalid Argument. Perhaps a typo?");
  }
}
