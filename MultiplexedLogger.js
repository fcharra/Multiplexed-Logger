const MediaLineFactory = require('./mediaLines/MediaLineFactory.js');

module.exports = class Logger {

  constructor(configArray) {
    this.mediaLine = [];

    configArray.forEach( (config) =>
        this.mediaLine.push( MediaLineFactory(config) )
    )
  }

  log(priority, message) {
    this.mediaLine.forEach( (media) => media.log(priority, message) );
  }

}
