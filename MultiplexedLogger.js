const MPLogger_GLOBALS = require('./misc/globals.js');
const MPLogger_SETTINGS = require('./misc/settings.js');
const helpers = require('./misc/helpers.js');

const LogEntry = require('./LogEntry.js');
const LogQueue = require('./LogQueue.js');

module.exports = class Logger {

  constructor(config) {
    this.verbosity = helpers._parsePriority(config.verbosity) ||
                     MPLogger_GLOBALS.PRIORITY.ERROR;

    this.media = config.media ||
                 MPLogger_SETTINGS.DEFAULT_MEDIA;

    this.remoteHost = config.remoteHost ||
                      MPLogger_SETTINGS.DEFAULT_REMOTEHOST;

    this.remotePort = config.remotePort ||
                      MPLogger_SETTINGS.DEFAULT_REMOTEPORT;

    this.logFile = MPLogger_SETTINGS.OUT_DIR + MPLogger_SETTINGS.OUT_FILE;

    this.logFormat = config.logFormat ||
                     MPLogger_SETTINGS.OUT_FORMAT;

    this.queue = new LogQueue(this);
  }

  log(priority, message) {
      if (helpers._parsePriority(priority) <= this.verbosity)
        this.queue.push(new LogEntry(priority, message));
  }

}
