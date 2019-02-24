module.exports = {

  PRIORITY: {
    SECURITY_ALERT: 1,
    SECURITY_WARNING: 2,
    ERROR: 3,
    WARNING: 4,
    VERBOSE: 5,
    properties: {
      1: { tag: 'SECURITY ALERT' },
      2: { tag: 'SECURITY WARNING' },
      3: { tag: 'ERROR'   },
      4: { tag: 'WARNING' },
      5: { tag: 'VERBOSE' }
    }
  },

  MEDIA: {
    CONSOLE: 'CONSOLE',
    FILE: 'FILE',
    SYNC_FILE: 'SYNC FILE',
    NETWORK: 'NETWORK'
  },

}
