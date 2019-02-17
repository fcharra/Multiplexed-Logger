module.exports = {

  OUT_DIR: process.argv[1],

  OUT_FILE: '-' +
            new Date()
              .toISOString()
              .replace(/:/g, '_') +
            '.log',

  OUT_FORMAT: 'PLAIN_TEXT',

  DEFAULT_MEDIA: ['CONSOLE'],

  DEFAULT_REMOTEHOST: 'localhost',

  DEFAULT_REMOTEPORT: 8080

}
