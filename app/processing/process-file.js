const { sendMessage } = require('../messaging')
const { downloadFile, uploadFile, deleteFile } = require('../storage')
const { createDemographicsUpdate } = require('./create-demographics-update')
const { DEMOGRAPHICS, CUSTOMER } = require('../constants/message-types')
const { DEMOGRAPHICS: DEMOGRAPHICS_TYPE } = require('../constants/file-types')
const { createCustomerUpdate } = require('./create-customer-update')
const { createDaxUpdate } = require('./create-dax-update')
const { getOutboundFileName } = require('./get-outbound-file-name')

const processFile = async (file) => {
  console.log(`Processing demographics file: ${file}`)
  const data = await downloadFile(file, DEMOGRAPHICS_TYPE)
  const demographicsData = createDemographicsUpdate(data)
  await sendMessage(demographicsData, DEMOGRAPHICS)
  for (let i = 0; i < data.capparty.length; i++) {
    const customerData = await createCustomerUpdate(data.capparty[i])
    await sendMessage(customerData, CUSTOMER)
    const daxData = createDaxUpdate(customerData)
    console.log(`Updated customer data received: ${daxData}`)
    const filename = getOutboundFileName(file, i)
    await uploadFile(filename, daxData, DEMOGRAPHICS_TYPE)
    console.log(`Updated customer data sent to DAX with file name: ${filename}`)
  }
  await deleteFile(file, DEMOGRAPHICS_TYPE)
  console.log(`Processed demographics file: ${file}`)
}

module.exports = {
  processFile
}
