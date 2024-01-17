const { getDemographicsFiles, getReturnFiles } = require('../storage')
const { processFile } = require('./process-file')
const { processReturnFile } = require('./process-return-file')

const processFiles = async () => {
  const files = await getDemographicsFiles()
  for (const file of files) {
    try {
      await processFile(file)
    } catch (err) {
      console.error(err)
    }
  }
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
