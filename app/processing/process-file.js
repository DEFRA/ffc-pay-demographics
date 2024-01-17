const { sendMessages } = require('../messaging')
const { downloadFile, uploadFile, deleteFile, quarantineFile } = require('../storage')
const { CUSTOMER } = require('../constants/message-types')
const { DEMOGRAPHICS, DAX } = require('../constants/containers')
const { createCustomerUpdate } = require('./create-customer-update')
const { createDaxData } = require('./create-dax-data')
const { createDaxUpdate } = require('./create-dax-update')
const { getOutboundFileName } = require('./get-outbound-file-name')

const processFile = async (file) => {
  try {
    console.log(`Processing demographics file: ${file}`)
    const data = await downloadFile(file, DEMOGRAPHICS)
    // confirmed by V1 team there will only be one party per file
    const parsedData = JSON.parse(data)
    const party = parsedData.capparty[0]
    // if no organisation element - no updates to be made
    if (party.organisation) {
      const customerMessages = await createCustomerUpdate(party.organisation, party.legacyIdentifier)
      await sendMessages(customerMessages, CUSTOMER)
      const daxData = await createDaxData(party)
      const daxFile = createDaxUpdate(daxData)
      console.log(`Updated customer data received: ${daxFile}`)
      const filename = getOutboundFileName(file)
      await uploadFile(filename, daxFile, DAX)
      console.log(`Updated customer data sent to DAX with file name: ${filename}`)
    }
    await deleteFile(file, DEMOGRAPHICS)
    console.log(`Processed demographics file: ${file}`)
  } catch (err) {
    console.error(err)
    console.log(`Error occurred processing file: ${file}`)
    await quarantineFile(file, DEMOGRAPHICS)
  }
}

module.exports = {
  processFile
}
