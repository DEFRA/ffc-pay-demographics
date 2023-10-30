const { getDemographicsFiles } = require('../storage')
const { processFile } = require('./process-file')

const processFiles = async () => {
  const files = await getDemographicsFiles()
  for (const file of files) {
    try {
      await processFile(file)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = {
  processFiles
}
