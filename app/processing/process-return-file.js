const { downloadFile, archiveFile, quarantineFile } = require('../storage')
const { DAX } = require('../constants/containers')
const { parseAcknowledgementFile } = require('./parse-acknowledgement-file')
const { sendDemographicsFailureEvent } = require('../event')
const { DEMOGRAPHICS_UPDATE_FAILED } = require('../constants/events')

const processReturnFile = async (file) => {
  try {
    console.log(`Processing return file: ${file}`)
    const xmlData = await downloadFile(file, DAX)
    const output = await parseAcknowledgementFile(xmlData)
    if (output.failedFRNs[0]) {
      const error = 'Demographics updates for the following FRNs have failed to be processed by DAX: ' + output.failedFRNs.map((frn, index) => (index === 0 ? frn : `, ${frn}`)).join('')
      await sendDemographicsFailureEvent(file, DEMOGRAPHICS_UPDATE_FAILED, error)
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
