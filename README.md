# Multiplexed-Logger
Simultaneously log to multiple media with a single line of code in NodeJS. Supports logging to console and file (sync and async). Supports both plain text and JSON formats. Logging to a database and to a server via HTTP are planned in a future version. Still WIP.

# Installing (TODO)
This and the following sections will be modified when Multiplexed-Logger is released to npm.

# Usage

First, require the logger:

```javascript
const MultiplexedLogger = require('MultiplexedLogger');
```

Then, instantiate it with the parameters you want. For example, the following example logs:

- In full verbosity. Plain text output. To the console.
- Warnings, errors, security warnings, and security alerts. In plain text output. Asynchronously. To the specified log file.
- Errors, security warnings, and security alerts. In JSON output. Synchronously. To the specified log file.

```javascript
var logger = new MultiplexedLogger([
                   {
                     verbosity: 'VERBOSE',
                     media: 'CONSOLE',
                     logFormat: 'PLAIN TEXT'
                   },
                   {
                     verbosity: 'WARNING',
                     media: 'FILE',
                     logFormat: 'PLAIN TEXT',
                     logFile: './testLog-Async.log'
                   },
                   {
                     verbosity: 'ERROR',
                     media: 'SYNC FILE',
                     logFormat: 'JSON',
                     logFile: './testLog-Sync.log'
                   }
                 ]);
```

And finally, use it specifying a priority level, and the message or data you want to log in string format. Like this:

```javascript
logger.log('SECURITY ALERT', '[Type your description of the event here]');
```

(Tip: If your message includes any input provided by the user, you may want to escape it first in order to prevent any possible code injection.)

# Priority levels and verbosity

Both verbosity for each media and priority levels for each log entry are defined in the [Globals object]. By default, Multiplexed-Logger defines five levels of priority, going from 1 (MAX priority) to 5 (MIN priority).

| Priority |       Tag        |                              Example usage                                |
| -------- | ---------------- | ------------------------------------------------------------------------- |
|    1     |  SECURITY ALERT  | SQL injection attempts, attempt at vulnerability exploitation...          |
|    2     | SECURITY WARNING | Multiple login attempts, sudden spike in requests...                      |
|    3     |      ERROR       | 404, wrong format in parameters...                                        |
|    4     |     WARNING      | Using defaults or fallbacks, using features untested or not recommended... |
|    5     |     VERBOSE      | What it says on the label. ;) :)                                          |

You can create new levels, or modify or rearrange the existing ones, by following the format outlined in the [Globals object] (remember to update the properties element accordingly), and modifying helpers.parsePriority() to allow for them.

# Output formats

Multiplexed-Logger can output in either JSON or plain text format. XML or custom string formats may be added in the future.

# Default settings

Default settings can be modified in your local copy of the [Settings object].

# Documentation

Further information about the API will be published in the [Documentation page]. (Still WIP, like everything else.)

[Globals object]: <https://github.com/fcharra/Multiplexed-Logger/blob/master/misc/globals.js>
[Settings object]: <https://github.com/fcharra/Multiplexed-Logger/blob/master/misc/settings.js>
[Documentation page]: <https://fcharra.github.io/Multiplexed-Logger/>
