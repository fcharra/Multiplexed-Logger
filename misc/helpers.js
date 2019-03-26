const MPLogger_GLOBALS = require('./globals.js');

module.exports = {

  /* NOTE: AFAIK this should work. But I can't get it to do so. JS has no capability to represent Abstract objects. I'll just leave the 'Abstract' mark testimonially, as an indication to developers.
  Abstract: class {
    /*
    * Duck-tape fix to provide Abstract capability to javascript.
    * @class Abstract
    * @constructor
    * @throws {TypeError} When code tries to instantiate it directly with the new keyword.
    */
    /*constructor() {
      if (new.target === this) {
        throw new TypeError("Cannot construct Abstract instances directly");
      }
    }
  },*/

  // Parser for priority arguments.
  parsePriority: function(priority) {
    if (typeof priority === 'number') {
      if (priority >= MPLogger_GLOBALS.PRIORITY.SECURITY_ALERT && priority <= MPLogger_GLOBALS.PRIORITY.VERBOSE)
        return Math.floor(priority);
      else
        throw RangeError('Wrong priority argument. Perhaps a typo?');
    }

    let result = null;
    if (typeof priority === 'string') {
      switch(priority) {
        case 'SECURITY ALERT':
          result = MPLogger_GLOBALS.PRIORITY.SECURITY_ALERT;
          break;
        case 'SECURITY WARNING':
          result = MPLogger_GLOBALS.PRIORITY.SECURITY_WARNING;
          break;
        case 'ERROR':
          result = MPLogger_GLOBALS.PRIORITY.ERROR;
          break;
        case 'WARNING':
          result = MPLogger_GLOBALS.PRIORITY.WARNING;
          break;
        case 'VERBOSE':
          result = MPLogger_GLOBALS.PRIORITY.VERBOSE;
          break;
        default:
          throw RangeError('Wrong priority argument. Perhaps a typo?');
      }

      return result;
    }

    // Invalid Argument
    throw TypeError('Wrong priority argument. Perhaps a typo?');
  }

}
