jest.mock('../../../app/storage')
const { downloadFile: mockDownloadFile, uploadFile: mockUploadFile, deleteFile: mockDeleteFile } = require('../../../app/storage')

jest.mock('../../../app/processing/create-demographics-update')
const { createDemographicsUpdate: mockCreateDemographicsUpdate } = require('../../../app/processing/create-demographics-update')

jest.mock('../../../app/processing/create-customer-update')
const { createCustomerUpdate: mockCreateCustomerUpdate } = require('../../../app/processing/create-customer-update')

jest.mock('../../../app/processing/create-dax-update')
const { createDaxUpdate: mockCreateDaxUpdate } = require('../../../app/processing/create-dax-update')

jest.mock('../../../app/messaging')
const { sendMessage: mockSendMessage } = require('../../../app/messaging')

const content = require('../../mocks/file-content')
const customerContent = require('../../mocks/customer-content')

const { processFile } = require('../../../app/processing/process-file')
const { DEMOGRAPHICS: DEMOGRAPHICS_MSG, CUSTOMER: CUSTOMER_MSG } = require('../../../app/constants/message-types')
const { DEMOGRAPHICS: DEMOGRAPHICS_FILE } = require('../../../app/constants/file-types')

const filename = require('../../mocks/filename')
const exportFilename = require('../../mocks/export-filename')
const daxUpdate = require('../../mocks/dax-update')

describe('process file', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDownloadFile.mockResolvedValue(content)
    mockCreateDemographicsUpdate.mockReturnValue(content)
    mockCreateCustomerUpdate.mockReturnValue(customerContent)
    mockCreateDaxUpdate.mockReturnValue(daxUpdate)
  })

  test('should download file from file storage', async () => {
    await processFile(filename)
    expect(mockDownloadFile).toHaveBeenCalledWith(filename, DEMOGRAPHICS_FILE)
  })

  test('should create demographics update', async () => {
    await processFile(filename)
    expect(mockCreateDemographicsUpdate).toHaveBeenCalledWith(content)
  })

  test('should send demographics update', async () => {
    await processFile(filename)
    expect(mockSendMessage).toHaveBeenNthCalledWith(1, content, DEMOGRAPHICS_MSG)
  })

  test('should create customer update for each party', async () => {
    await processFile(filename)
    expect(mockCreateCustomerUpdate).toHaveBeenCalledTimes(1)
  })

  test('should create customer update', async () => {
    await processFile(filename)
    expect(mockCreateCustomerUpdate).toHaveBeenCalledWith(content.capparty[0])
  })

  test('should send customer update', async () => {
    await processFile(filename)
    expect(mockSendMessage).toHaveBeenNthCalledWith(2, customerContent, CUSTOMER_MSG)
  })

  test('should upload file to file storage', async () => {
    await processFile(filename)
    expect(mockUploadFile).toHaveBeenCalledWith(exportFilename, daxUpdate, DEMOGRAPHICS_FILE)
  })

  test('should delete file from file storage', async () => {
    await processFile(filename)
    expect(mockDeleteFile).toHaveBeenCalledWith(filename, DEMOGRAPHICS_FILE)
  })
})
