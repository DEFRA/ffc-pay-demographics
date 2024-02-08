const { getReturnFiles } = require('../storage')
const { processReturnFile } = require('./process-return-file')

const processFiles = async () => {
  const returnFiles = await getReturnFiles()
  for (const rtn of returnFiles) {
    try {
      await processReturnFile(rtn)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = {
  processFiles
}
