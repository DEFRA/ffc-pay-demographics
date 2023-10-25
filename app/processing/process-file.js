const { sendMessage } = require('../messaging')
const { downloadFile, uploadFile, deleteFile } = require('../storage')
const { createDemographicsUpdate } = require('./create-demographics-update')
const { DEMOGRAPHICS, CUSTOMER } = require('../constants/types')
const { createCustomerUpdate } = require('./create-customer-update')
const { createDaxUpdate } = require('./create-dax-update')

const processFile = async (file) => {
  console.log(`processing demographics file: ${file}`)
  const data = await downloadFile(file)
  const demographicsData = createDemographicsUpdate(data)
  await sendMessage(demographicsData, DEMOGRAPHICS)
  // Not every update will have customer mapping, once we know file spec we can update this flow
  const customerData = createCustomerUpdate(data)
  await sendMessage(customerData, CUSTOMER)
  // Need to further understand how and where updates are published from the TL
  const daxData = createDaxUpdate(data)
  await uploadFile(file, daxData)
  await deleteFile(file)
  console.log(`processed demographics file: ${file}`)
}

module.exports = {
  processFile
}
