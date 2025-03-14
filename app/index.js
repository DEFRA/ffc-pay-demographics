require('log-timestamp')
require('./insights').setup()

const processing = require('./processing')
const messaging = require('./messaging')
const { initialiseContainers } = require('./storage')
const { start: startServer } = require('./server')
const { processingConfig } = require('./config')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await messaging.stop()
  process.exit(0)
})

const startApp = async () => {
  await startServer()
  if (processingConfig.processingActive) {
    await initialiseContainers()
    await messaging.start()
    await processing.start()
  } else {
    console.info('Processing capabilities are currently not enabled in this environment')
  }
}

(async () => {
  await startApp()
})()

module.exports = startApp
