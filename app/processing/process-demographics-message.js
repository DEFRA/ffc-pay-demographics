const { getFileNameFromUrl } = require('./get-file-name-from-url')
const processFile = require('./process-file')

const processDemographicsMessage = async (body) => {
  const filePath = body.data.url
  const file = getFileNameFromUrl(filePath)
  await processFile(file)
}

module.exports = {
  processDemographicsMessage
}
