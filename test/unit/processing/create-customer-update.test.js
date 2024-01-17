const { createCustomerUpdate } = require('../../../app/processing/create-customer-update')

const fileContent = require('../../mocks/file-content-manual-address')
const customerContent = require('../../mocks/customer-content')
const trader = require('../../mocks/trader')
const vendor = require('../../mocks/vendor')

let customer
let input
let legacyDetails
describe('create customer update', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    customer = { ...customerContent }
    input = { ...fileContent.capparty[0].organisation }
    legacyDetails = [...fileContent.capparty[0].legacyIdentifier]
  })

  test('should return correct output if only SBI provided', async () => {
    delete input.tradernumber
    delete input.vendornumber
    const result = await createCustomerUpdate(input, [])
    expect(result).toEqual([customer])
  })

  test('should return correct output if SBI provided, via legacyDetails', async () => {
    delete input.sbi
    delete input.tradernumber
    delete input.vendornumber
    delete legacyDetails[1]
    delete legacyDetails[2]
    const result = await createCustomerUpdate(input, legacyDetails)
    expect(result).toEqual([customer])
  })

  test('should return correct output if only tradernumber provided', async () => {
    delete input.sbi
    delete input.vendornumber
    delete customer.sbi
    customer.trader = trader
    const result = await createCustomerUpdate(input, [])
    expect(result).toEqual([customer])
  })

  test('should return correct output if trader provided, via legacyDetails', async () => {
    delete input.sbi
    delete input.tradernumber
    delete input.vendornumber
    delete legacyDetails[0]
    delete legacyDetails[2]
    delete customer.sbi
    customer.trader = trader
    const result = await createCustomerUpdate(input, legacyDetails)
    expect(result).toEqual([customer])
  })

  test('should return correct output if only vendor provided', async () => {
    delete input.sbi
    delete input.tradernumber
    delete customer.sbi
    customer.vendor = vendor
    const result = await createCustomerUpdate(input, [])
    expect(result).toEqual([customer])
  })

  test('should return correct output if vendor provided, via legacyDetails', async () => {
    delete input.sbi
    delete input.tradernumber
    delete input.vendornumber
    delete legacyDetails[0]
    delete legacyDetails[1]
    delete customer.sbi
    customer.vendor = vendor
    const result = await createCustomerUpdate(input, legacyDetails)
    expect(result).toEqual([customer])
  })

  test('should return correct output if SBI and trader provided', async () => {
    delete input.vendornumber
    const traderCustomer = { ...customer }
    delete traderCustomer.sbi
    traderCustomer.trader = trader
    const result = await createCustomerUpdate(input, [])
    expect(result).toEqual([customer, traderCustomer])
  })

  test('should return correct output if SBI and vendor provided', async () => {
    delete input.tradernumber
    const vendorCustomer = { ...customer }
    delete vendorCustomer.sbi
    vendorCustomer.vendor = vendor
    const result = await createCustomerUpdate(input, [])
    expect(result).toEqual([customer, vendorCustomer])
  })

  test('should return correct output if SBI, trader and vendor provided', async () => {
    const vendorCustomer = { ...customer }
    delete vendorCustomer.sbi
    vendorCustomer.vendor = vendor
    const traderCustomer = { ...customer }
    delete traderCustomer.sbi
    traderCustomer.trader = trader
    const result = await createCustomerUpdate(input, [])
    expect(result).toEqual([customer, traderCustomer, vendorCustomer])
  })

  test('should return empty array if no SBI, trader and vendor provided', async () => {
    delete input.sbi
    delete input.tradernumber
    delete input.vendornumber
    const result = await createCustomerUpdate(input, [])
    expect(result).toEqual([])
  })
})
