module.exports = {

  OUT_DIR: process.argv[1],

  OUT_FILE: '-' +
            new Date()
              .toISOString()
              .replace(/:/g, '_') +
            '.log',

  DEFAULT_REMOTEHOST: 'localhost',

  DEFAULT_REMOTEPORT: 8080

}
