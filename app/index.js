require('./insights').setup()
require('log-timestamp')
const { start: startServer } = require('./server')
const processing = require('./processing')

module.exports = (async () => {
  await startServer()
  await processing.start()
})()
