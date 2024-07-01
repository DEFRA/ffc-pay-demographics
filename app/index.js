require('./insights').setup()
require('log-timestamp')
const processing = require('./processing')
const messaging = require('./messaging')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await messaging.stop()
  process.exit(0)
})

module.exports = (async () => {
  messaging.start()
  processing.start()
})()
