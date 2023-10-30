const { processingConfig } = require('../config')
const { processFiles } = require('./process-files')

const start = async () => {
  try {
    if (processingConfig.enabled) {
      await processFiles()
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.pollingInterval)
  }
}

module.exports = {
  start
}
