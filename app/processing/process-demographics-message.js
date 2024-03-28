const { getFileNameFromUrl } = require('./get-file-name-from-url')
const processFile = require('./process-file')

const processDemographicsMessage = async (message) => {
  const filePath = message.body[0].data.url
  const file = getFileNameFromUrl(filePath)
  await processFile(file)
}

module.exports = {
  processDemographicsMessage
}
