const { transferConfig } = require('../config')
const { transferFiles } = require('./transfer-files')

const start = async () => {
  try {
    if (transferConfig.enabled) {
      await transferFiles()
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, transferConfig.pollingInterval)
  }
}

module.exports = {
  start
}
