/**
* @module AbstractFileMediaLine
* @license MIT
* @author Federico Charra
*
* @requires module:AbstractMediaLine
* @requires Settings
*/

const fs = require('fs');

const MPLogger_SETTINGS = require('../misc/settings.js');
const AbstractMediaLine = require('./AbstractMediaLine.js');

/**
* @abstract
* @augments module:AbstractMediaLine
* @classdesc Partial implementation of logging specific to files.
* @todo Uncouple JSON file handling by either abstracting away opening and closing of files into abstract functions to be implemented by subclasses, or dynamically adding functions via a Factory Object.
@todo Maybe add XML output, once decoupling of this class is done.
*/
module.exports = class AbstractFileMediaLine extends AbstractMediaLine {
  /**
  * @abstract
  * @override
  * @desc Initialize basic configuration common to all FileMediaLine objects.
  * @param {Object} config - Configuration parameters object.
  * @param {string} config.logFile - Path to log file, file name, and extension. Behaviour with other kinds of paths from nodejs fs module API remain untested at the moment.
  * @param {string} [config.logFormat='PLAIN TEXT'] - Format to output logs in.
  */
  constructor(config) {
    super(config);

    // Make class abstract
    if (new.target === this) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }

    // Settings specific to log files
    /**
    * @readonly
    * @member {string}
    * @desc String containing path to log file, file name, and extension. Behaviour with other kinds of paths from nodejs fs module API remain untested at the moment.
    */
    this.logFile = config.logFile ||
                   MPLogger_SETTINGS.OUT_DIR + MPLogger_SETTINGS.OUT_FILE;
    /**
    * @readonly
    * @member {string}
    * @desc Format to output logs in.
    */
    this.logFormat = config.logFormat || 'PLAIN TEXT';

    // If log file already exists, delete before proceding.
    if (fs.existsSync(this.logFile))
      fs.unlinkSync(this.logFile);

    // Initializing and properly closing the JSON file on exit
    if (this.logFormat === 'JSON') {
      this._initializeJSONFile();
      process.on('exit', () => this._closeJSONFile() );
    }

  }

  /** @ignore */
  _initializeJSONFile() {
    try {
      // Sync because we need to be certain the root object brackets are opened before we write any entry.
      fs.writeFileSync(this.logFile, '{\n', 'utf8');
    }
    catch (err) {
      console.error('FATAL ERROR: Could not create file.');
      throw Error(err);
    }
  }

  /* Ensure proper JSON formatting of the log file.
   * When the logger stops, the root JSON object hasn't been closed yet, and the last entry object has a trailing comma at the end.
   * Regrettably, since preppending the comma didn't work out either because of async writing, the only way I found so far to remove it is to rewrite the entire file.
  */
  /** @ignore */
  _closeJSONFile() {
    try {
      let data = fs.readFileSync(this.logFile, 'utf8');
      let result = data.replace(/,\n$/, '\n}');
      fs.writeFileSync(this.logFile, result, 'utf8');
    }
    catch (err) {
      // Failing to close will not be considered a fatal error, since the file can still be fixed by hand. It will, however, be logged to standard error console.
      console.error('Could not properly close JSON log. ' + Error(err));
      return;
    }
  }

}
