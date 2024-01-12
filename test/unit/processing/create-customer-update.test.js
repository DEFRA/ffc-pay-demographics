const { createCustomerUpdate } = require('../../../app/processing/create-customer-update')

const fileContent = require('../../mocks/file-content')
const customerContent = require('../../mocks/customer-content')
const trader = require('../../mocks/trader')
const vendor = require('../../mocks/vendor')

let customer
let input
describe('create customer update', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    customer = { ...customerContent }
    input = { ...fileContent.capparty[0].organisation }
  })

  test('should return correct output if SBI provided', async () => {
    const result = await createCustomerUpdate(input)
    expect(result).toEqual(customer)
  })

  test('should return correct output if trader provided', async () => {
    delete input.sbi
    input.trader = trader
    delete customer.sbi
    customer.trader = trader
    const result = await createCustomerUpdate(input)
    expect(result).toEqual(customer)
  })

  test('should return correct output if vendor provided', async () => {
    delete input.sbi
    input.vendor = vendor
    delete customer.sbi
    customer.vendor = vendor
    const result = await createCustomerUpdate(input)
    expect(result).toEqual(customer)
  })
})
