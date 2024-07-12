const getFileNameFromUrl = require('./get-file-name-from-url')
const processFile = require('../processing/process-file')

const processDemographicsMessage = async (message, receiver) => {
  try {
    const filePath = message.body.data.url
    const file = getFileNameFromUrl(filePath)
    await processFile(file)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process demographics message:', err)
  }
}

module.exports = processDemographicsMessage
