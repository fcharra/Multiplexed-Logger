const fs = require('fs');

const MPLogger_SETTINGS = require('../misc/settings.js');
const AbstractMediaLine = require('./AbstractMediaLine.js');

module.exports = class AbstractFileMediaLine extends AbstractMediaLine {

  constructor(config) {
    super(config);

    // Make class abstract
    if (new.target === this) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }

    // Settings specific to log files
    this.logFormat = config.logFormat || 'PLAIN TEXT';
    this.logFile = config.logFile ||
                   MPLogger_SETTINGS.OUT_DIR + MPLogger_SETTINGS.OUT_FILE;

    // If log file already exists, delete before proceding.
    if (fs.existsSync(this.logFile))
      fs.unlinkSync(this.logFile);

    // Initializing and properly closing the JSON file on exit
    if (this.logFormat === 'JSON') {
      this._initializeJSONFile();
      process.on('exit', () => this._closeJSONFile() );
    }

  }

  _initializeJSONFile() {
    try {
      fs.writeFileSync(this.logFile, '{\n', 'utf8'); // Sync because we need to
                                                     // be certain the root
                                                     // object brackets are
                                                     // opened before we write
                                                     // any entry
    }
    catch (err) {
      console.error('FATAL ERROR: Could not create file.');
      throw Error(err);
    }
  }

  /** Ensure proper JSON formatting of the log file.
   * When the logger stops, the root JSON object hasn't been closed yet, and
   * the last entry object has a trailing comma at the end. */
  _closeJSONFile() {
    try {
      let data = fs.readFileSync(this.logFile, 'utf8');
      let result = data.replace(/,\n$/, '\n}');
      fs.writeFileSync(this.logFile, result, 'utf8');
    }
    catch (err) {
      console.error('Could not properly close JSON log. ' + Error(err));
    }
  }

}
