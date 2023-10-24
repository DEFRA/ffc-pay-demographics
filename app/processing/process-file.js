const { sendMessage } = require('../messaging')
const { downloadFile, deleteFile } = require('../storage')
const { createDemographicsUpdate } = require('./create-demographics-update')
const { DEMOGRAPHICS, CUSTOMER } = require('../constants/types')
const { createCustomerUpdate } = require('./create-customer-update')

const processFile = async (file) => {
  console.log(`processing demographics file: ${file}`)
  const data = await downloadFile(file)
  const demographicsData = createDemographicsUpdate(data)
  await sendMessage(demographicsData, DEMOGRAPHICS)
  // Not every update will have customer mapping, once we know file spec we can update this flow
  const customerData = createCustomerUpdate(data)
  await sendMessage(customerData, CUSTOMER)
  await deleteFile(file)
  console.log(`processed demographics file: ${file}`)
}

module.exports = {
  processFile
}
