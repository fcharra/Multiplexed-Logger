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

    /**
    * @package
    * @member {string}
    * @desc Internal state of the file. It can either be:
    * 'waiting': File is NOT still created or properly formatted. This is an invalid state, and operations on the file should wait until it's changed.
    * 'blank': File is ready, but no logs have been written yet. Concrete media need to know this, to properly modify the JSON string (remove the first preppended comma.)
    * 'initiated': File is ready, and logs have already been written to it. So no especial steps need to be taken before using it.
    */
    this.fileState = 'waiting';

    // Initializing the JSON file and properly closing it on exit.
    if (this.logFormat === 'JSON') {
      this._initializeJSONFile();
      process.on('exit', () => this._closeJSONFile() );
    }

  }

  /** @ignore */
  _initializeJSONFile() {
    /* Processor waits until file is created and properly formatted, then signals it to start requesting logs from the queue.
    *  If log file already exists, writeFile will delete before proceding.
    */
    fs.writeFile(this.logFile, '{', 'utf8', (err) => {
      if (err) {
        console.error('FATAL ERROR: Could not create file.');
        throw Error(err);
      }

      this.fileState = 'blank';
      // Inform the processor this media is ready to process. (@todo Refactor this into a method.)
      this.processor.mediaIsReady();
    });
  }

  /* Closing the file is done synchronously. Otherwise, it doesn't gets done before closing.
  *  Reading and rewriting the entire file synchronously has now been changed to a single sync append, which still should reduce thread locking significantly.
  */
  /** @ignore */
  _closeJSONFile() {
    try {
      fs.appendFileSync(this.logFile, '\n}', 'utf8');
    }
    catch(err) {
      /* Failing to close will not be considered a fatal error, since the file can still be easily fixed by hand.
      * It will, however, be logged to standard error console.
      */
      console.error('Could not properly close JSON log. ' + Error(err));
      return;
    }
  }

}
