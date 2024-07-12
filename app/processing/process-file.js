const { sendMessages } = require('../messaging/send-messages')
const { downloadFile, uploadFile } = require('../storage')
const { CUSTOMER } = require('../constants/message-types')
const { DEMOGRAPHICS, DAX } = require('../constants/containers')
const { createCustomerUpdate } = require('./create-customer-update')
const { createDaxData } = require('./create-dax-data')
const { createDaxUpdate } = require('./create-dax-update')
const { getOutboundFileName } = require('./get-outbound-file-name')
const { sendDemographicsFailureEvent } = require('../event')
const { DEMOGRAPHICS_PROCESSING_FAILED } = require('../constants/events')
const { processingConfig } = require('../config')
const { sendExtractMessage } = require('../messaging/send-extract-message')

const processFile = async (file) => {
  try {
    console.log(`Processing demographics file: ${file}`)
    const data = await downloadFile(file, DEMOGRAPHICS)
    const parsedData = JSON.parse(data)
    const party = parsedData.capparty[0]
    // if no organisation element - no updates to be made
    if (party.organisation) {
      await sendExtractMessage(party)
      const customerMessages = await createCustomerUpdate(party.organisation, party.legacyIdentifier)
      await sendMessages(customerMessages, CUSTOMER)
      if (processingConfig.daxEnabled) {
        const daxData = await createDaxData(party)
        const daxFile = createDaxUpdate(daxData)
        console.log(`Updated customer data received: ${daxFile}`)
        const filename = getOutboundFileName(file)
        await uploadFile(filename, daxFile, DAX)
        console.log(`Updated customer data sent to DAX with file name: ${filename}`)
      }
    }
    console.log(`Processed demographics file: ${file}`)
  } catch (err) {
    console.error(err)
    console.log(`Error occurred processing file: ${file}`)
    await sendDemographicsFailureEvent(file, DEMOGRAPHICS_PROCESSING_FAILED, err)
  }
}

module.exports = processFile
