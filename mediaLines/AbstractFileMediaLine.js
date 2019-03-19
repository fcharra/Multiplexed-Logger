const fs = require('fs');

const MPLogger_SETTINGS = require('../misc/settings.js');
const AbstractMediaLine = require('./AbstractMediaLine.js');

/**
* @main MultiplexedLogger
*/
module.exports = class AbstractFileMediaLine extends AbstractMediaLine {
  /**
  * Partial implementation of logging specific to files.
  * TODO: Uncouple JSON file handling by either abstracting away opening and closing of files into abstract functions to be implemented by subclasses, or dynamically adding functions via a Factory Object.
  * TODO: Maybe add XML output, once decoupling of this class is done.
  * @class AbstractFileMediaLine
  * @constructor
  * @extends AbstractMediaLine
  * @param {Object} config Configuration parameters object. Inherits all of {{#crossLink "AbstractMediaLine"}}{{/crossLink}}'s config object parameters, plus the following:
  * @param {string} config.logFile Path to log file, file name, and extension. Behaviour with other kinds of paths from nodejs fs module API remain untested at the moment.
  * @param {string} [config.logFormat='PLAIN TEXT'] Format to output logs in.
  */
  constructor(config) {
    super(config);

    // Make class abstract
    if (new.target === this) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }

    // Settings specific to log files
    /**
    * String containing path to log file, file name, and extension. Behaviour with other kinds of paths from nodejs fs module API remain untested at the moment.
    * @protected
    * @writeOnce
    * @property logFile
    * @type {string}
    */
    this.logFile = config.logFile ||
                   MPLogger_SETTINGS.OUT_DIR + MPLogger_SETTINGS.OUT_FILE;
    /**
    * Format to output logs in.
    * @protected
    * @writeOnce
    * @property logFormat
    * @type {string}
    */
    this.logFormat = config.logFormat || 'PLAIN TEXT';

    /**
    * Internal state of the file. It can either be:
    * 'waiting': File is NOT still created or properly formatted. This is an invalid state, and operations on the file should wait until it's changed.
    * 'blank': File is ready, but no logs have been written yet. Concrete media need to know this, to properly modify the JSON string (remove the first preppended comma.)
    * 'initiated': File is ready, and logs have already been written to it. So no especial steps need to be taken before using it.
    * @public
    * @property
    * @type {string}
    */
    this.fileState = 'waiting';

    // Initializing the JSON file and properly closing it on exit.
    if (this.logFormat === 'JSON') {
      this._initializeJSONFile();
      process.on('exit', () => this._closeJSONFile() );
    }

  }

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
