const AbstractMediaLine = require('./AbstractMediaLine.js');

let absMediaLine;

beforeEach( () => {
  absMediaLine = new AbstractMediaLine({media:'CONSOLE', verbosity:'VERBOSE'});
});

test('should throw if given an incorrect config parameter', () => {

  expect( () => {
    new AbstractMediaLine()
  }).toThrowError(TypeError);

  expect( () => {
    new AbstractMediaLine(1)
  }).toThrowError(TypeError);

  expect( () => {
    new AbstractMediaLine({})
  }).toThrowError(TypeError);

  expect( () => {
    new AbstractMediaLine({media: 'CONSOLE', Verbosity: true})
  }).toThrowError(TypeError);

  expect( () => {
    new AbstractMediaLine({media: 'CONSOLE', verbosity: 'should throw'})
  }).toThrowError(TypeError);

  // Lacking media type! It's an mandatory parameter
  expect( () => {
    new AbstractMediaLine({verbosity: 'VERBOSE'})
  }).toThrowError(TypeError);

  // Remember: Verbosity is an optional parameter. There's a default verbosity defined in settings.
  expect( () => {
    new AbstractMediaLine({media: 'CONSOLE'})
  }).not.toThrowError(TypeError);

});
