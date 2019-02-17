const fs = require('fs');

const MPLogger_GLOBALS = require('../misc/globals.js');

const LogEntry = require('../LogEntry.js');

module.exports = {

  consoleStrategy: function(context) {
    let logString = (context.logger.logFormat === 'JSON')? JSON.stringify( context.currLogEntry.toJSON() ) : context.currLogEntry.toString();

    return new Promise( (resolve, reject) => {
      if (!context.currLogEntry) reject(Error("Invalid or null log entry"));

      if (context.currLogEntry.priority <= MPLogger_GLOBALS.PRIORITY.ERROR) console.error( logString );
      else console.log( logString );

      resolve(true);
    });
  },

  fileStrategy: function(context) {
    let logString = (context.logger.logFormat === 'JSON')? JSON.stringify( context.currLogEntry.toJSON() ) : context.currLogEntry.toString();

    return new Promise( (resolve, reject) => {
      fs.appendFile(context.logger.logFile, logString + '\n', (err) => {
        if (err) {
          reject(Error('ERROR FATAL: No se pudo crear el archivo de log.'));
        }
          resolve(true);
      });
    });
  },

  syncFileStrategy: function(context) {
    // TODO: implement writing to file synchronously. (Warn about it not being recommended, performance issues, yada-yada.)
    return new Promise( (resolve, reject) => {
      resolve(true);
    });
  },

  networkStrategy: function(context) {
    // TODO: implement transmitting via HTTP to server
    return new Promise( (resolve, reject) => {
      resolve(true);
    });
  },

  voidStrategy: function(context) {
    return new Promise( (resolve, reject) => {
      resolve(true);
    });
  }

};
