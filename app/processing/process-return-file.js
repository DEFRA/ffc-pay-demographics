const { downloadFile, archiveFile, quarantineFile } = require('../storage')
const { DAX } = require('../constants/containers')
const { parseAcknowledgementFile } = require('./parse-acknowledgement-file')
const { sendDemographicsFailureEvent } = require('../event')

const processReturnFile = async (file) => {
  try {
    console.log(`Processing return file: ${file}`)
    const xmlData = await downloadFile(file, DAX)
    const output = await parseAcknowledgementFile(xmlData)
    if (output.failedFRNs[0]) {
      let error = 'Demographics updates for the following FRNs have failed to be processed by DAX: '
      for (let i = 0; i < output.failedFRNs.length; i++) {
        if (i === 0) {
          error += output.failedFRNs[i]
        } else {
          error += `, ${output.failedFRNs[i]}`
        }
      }
      error += '.'
      await sendDemographicsFailureEvent(file, error)
    }
    await archiveFile(file)
    console.log(`Processed return file: ${file}`)
  } catch (err) {
    console.error(err)
    console.log(`Error occurred processing file: ${file}`)
    await quarantineFile(file, DAX)
  }
}

module.exports = {
  processReturnFile
}
