const { getPaymentFiles } = require('../storage')
const { transferFile } = require('./transfer-file')

const transferFiles = async () => {
  const files = await getPaymentFiles()
  for (const file of files) {
    try {
      await transferFile(file)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = {
  transferFiles
}
