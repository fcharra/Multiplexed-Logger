/**
* @module MediaLineFactory
* @license MIT
* @author Federico Charra
*
* @requires AbstractMediaLine.js
* @requires ConsoleMediaLine.js
* @requires AsyncFileMediaLine.js
* @requires SyncFileMediaLine.js
* @requires NetworkMediaLine.js
* @requires ../misc/globals.js
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
* @param { {media: (MPLogger_GLOBALS.PRIORITY|string)} } config - Configuration object with a media attribute specifying what media handler to create, along with all pertinent configurations to apply to it.
* @returns {AbstractMediaLine}
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
  }
}
