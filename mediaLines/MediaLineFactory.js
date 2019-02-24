const ConsoleMediaLine = require('./ConsoleMediaLine.js');
const AsyncFileMediaLine = require('./AsyncFileMediaLine.js');
const SyncFileMediaLine = require('./SyncFileMediaLine.js');
const NetworkMediaLine = require('./NetworkMediaLine.js');

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
