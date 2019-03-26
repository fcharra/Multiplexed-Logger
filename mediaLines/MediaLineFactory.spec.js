const AbstractMediaLine = require('./AbstractMediaLine.js');
const ConsoleMediaLine = require('./ConsoleMediaLine.js');
const AsyncFileMediaLine = require('./AsyncFileMediaLine.js');
const SyncFileMediaLine = require('./SyncFileMediaLine.js');

const MediaLineFactory = require('./MediaLineFactory');

test('should throw TypeError if called with an invalid parameter', () => {

  expect( () => {
    MediaLineFactory('Should throw')
  }).toThrowError(TypeError);

  expect( () => {
    MediaLineFactory({media: null, verbosity: 'VERBOSE', logFormat: 'PLAIN TEXT'})
  }).toThrowError(TypeError);

  expect( () => {
    MediaLineFactory({media: undefined, verbosity: 'VERBOSE', logFormat: 'PLAIN TEXT'})
  }).toThrowError(TypeError);

  expect( () => {
    MediaLineFactory({media: 3, verbosity: 'VERBOSE', logFormat: 'PLAIN TEXT'})
  }).toThrowError(TypeError);

  expect( () => {
    MediaLineFactory({media: "this media type doesn't exist", verbosity: 'VERBOSE', logFormat: 'PLAIN TEXT'})
  }).toThrowError(TypeError);

  expect( () => {
    MediaLineFactory({verbosity: 'VERBOSE', logFormat: 'PLAIN TEXT'})
  }).toThrowError(TypeError);

});

test('should return a properly build AbstractMediaLine instance, if passed the proper parameters', () => {
  // TODO: Add the rest when implemented.

  let consoleTest = MediaLineFactory({media: 'CONSOLE', verbosity: 'VERBOSE', logFormat: 'PLAIN TEXT'});
  let asyncFileTest = MediaLineFactory({media: 'FILE', verbosity: 'VERBOSE', logFormat: 'PLAIN TEXT', logFile: './asyncFileTest.log'});
  let syncFileTest = MediaLineFactory({media: 'SYNC FILE', verbosity: 'VERBOSE', logFormat: 'PLAIN TEXT', logFile: './syncFileTest.log'});

  expect(consoleTest).toBeInstanceOf(ConsoleMediaLine);
  expect(asyncFileTest).toBeInstanceOf(AsyncFileMediaLine);
  expect(syncFileTest).toBeInstanceOf(SyncFileMediaLine);
});
