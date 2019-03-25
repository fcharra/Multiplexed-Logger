const LogEntry = require('./LogEntry.js');
const AbstractMediaLine = require('./mediaLines/AbstractMediaLine.js');
const MediaLineFactory = require('./mediaLines/MediaLineFactory.js');

const LogQueue = require('./LogQueue.js');

let logQueue;

beforeEach( () => {
  logQueue = new LogQueue(MediaLineFactory({media: 'CONSOLE', verbosity: 'VERBOSE'}));

  logQueue.push(new LogEntry('VERBOSE', 'Verbose Entry'));
  logQueue.push(new LogEntry('WARNING', 'Warning Entry'));
  logQueue.push(new LogEntry('ERROR', 'Error Entry'));
});

test('should have all its methods defined', () => {
  expect(logQueue.push).toBeDefined();
  expect(logQueue.doneProcessing).toBeDefined();
  expect(logQueue.next).toBeDefined();
});

test('should build properly if all parameters are correct', () => {
  expect( () =>
    new LogQueue(
      MediaLineFactory({media: 'CONSOLE', verbosity: 'VERBOSE'})
    ).not.toThrowError(TypeError)
  );
});

test('should throw TypeError if mediaLine is not an instance of the AbstractMediaLine type.', () => {
  expect( () =>
    new LogQueue(
      'supossedly should throw'
    )
  ).toThrowError(TypeError);
});

test('queue should be empty when instantiated', () => {
  let logQueueEmpty = new LogQueue( MediaLineFactory({media: 'CONSOLE', verbosity: 'VERBOSE'}) );

  expect(logQueueEmpty.queue).toEqual([]);
});

test('push() should throw TypeError if called with an invalid parameter', () => {
  expect( () =>
    logQueue.push(4)
  ).toThrowError(TypeError);
});

test('push() should add one element to the queue, and then call mediaLine.processNext() once', () => {
  let spy = jest.spyOn(AbstractMediaLine.prototype, 'processNext').mockImplementation( () => {} );

  let queueLengthAtTestStart = logQueue.queue.length;
  logQueue.push(new LogEntry('SECURITY WARNING', 'Sec Warning Entry'));

  expect(logQueue.queue.length).toBe(queueLengthAtTestStart + 1);
  expect(spy).toHaveBeenCalledTimes(1);

  spy.mockRestore();
});

test('doneProcessing() should call mediaLine.processNext() if called with elements still in queue', () => {
  let spy = jest.spyOn(AbstractMediaLine.prototype, 'processNext').mockImplementation( () => {} );

  logQueue.doneProcessing();

  expect(spy).toHaveBeenCalledTimes(1);

  spy.mockRestore();
});

test('doneProcessing() should NOT call mediaLine.processNext() if called with an empty queue', () => {
  let spy = jest.spyOn(AbstractMediaLine.prototype, 'processNext').mockImplementation( () => {} );

  logQueue.queue = [];
  logQueue.doneProcessing();

  expect(spy).not.toHaveBeenCalled();

  spy.mockRestore();
});

test('next() should return oldest LogEntry in the queue if called with elements still in it. (FIFO stack), and should substract one element from the queue', () => {
  let queueLengthAtTestStart = logQueue.queue.length;
  let oldestElement = logQueue.queue[0];
  let result = logQueue.next();
  expect(result).toBe(oldestElement);
  expect(logQueue.queue.length).toBe(queueLengthAtTestStart - 1);
});

test('next() should return undefined if called with an empty queue', () => {
  logQueue.queue = [];
  let result = logQueue.next();
  expect(result).toBe(undefined);
});
