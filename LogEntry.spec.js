const LogEntry = require('./LogEntry.js');

let logEntry = new LogEntry('VERBOSE', 'Verbose entry', new Date('1995-12-17T03:24:00.000Z') );
let logEntry2 = new LogEntry( 4, 'Warning entry', new Date('1995-12-17T03:24:00.000Z') );

test('should have all its methods defined', () => {
  expect(logEntry.toString).toBeDefined();
  expect(logEntry.toJSONString).toBeDefined();
});

test('should construct properly with Date argument', () => {
  expect(logEntry.timestamp).toBe('1995-12-17T03:24:00.000Z');
  expect(logEntry.priority).toBe(5);
  expect(logEntry.priorityTag).toBe('VERBOSE');
  expect(logEntry.message).toBe('Verbose entry');

  expect(logEntry2.timestamp).toBe('1995-12-17T03:24:00.000Z');
  expect(logEntry2.priority).toBe(4);
  expect(logEntry2.priorityTag).toBe('WARNING');
  expect(logEntry2.message).toBe('Warning entry');
});

test('should construct properly WITHOUT Date argument', () => {
  jest.spyOn(Date.prototype, 'toISOString').mockImplementation( () => {return '2019-03-23T18:21:49.132Z';} );

  let logEntry = new LogEntry('VERBOSE', 'Verbose entry');

  expect(logEntry.timestamp).toBe('2019-03-23T18:21:49.132Z');
  expect(logEntry.priority).toBe(5);
  expect(logEntry.priorityTag).toBe('VERBOSE');
  expect(logEntry.message).toBe('Verbose entry');
});

test('should throw TypeError if priority is not parseable by helpers.parsePriority()', () => {
  expect( () => new LogEntry(true, 'message') ).toThrowError(TypeError);
});

test('should throw TypeError if message is not a string', () => {
  expect( () => new LogEntry('VERBOSE', 7) ).toThrowError(TypeError);
});

test('should throw TypeError if time is not a Date instance', () => {
  expect( () => new LogEntry('VERBOSE', 'Verbose entry', "Look mom! I'm a string!") ).toThrowError(TypeError);
});

test('method toString should return a properly formatted log string', () => {
  expect(logEntry.toString()).toBe('1995-12-17T03:24:00.000Z - (VERBOSE): Verbose entry');
});
