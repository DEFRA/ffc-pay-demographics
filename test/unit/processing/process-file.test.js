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

const { processFile } = require('../../../app/processing/process-file')
const { DEMOGRAPHICS, CUSTOMER } = require('../../../app/constants/types')

const filename = 'file1'
const content = 'file data'

describe('process file', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDownloadFile.mockResolvedValue(content)
    mockCreateDemographicsUpdate.mockReturnValue({})
    mockCreateCustomerUpdate.mockReturnValue({})
    mockCreateDaxUpdate.mockReturnValue({})
  })

  test('should download file from file storage', async () => {
    await processFile(filename)
    expect(mockDownloadFile).toHaveBeenCalledWith(filename)
  })

  test('should create demographics update', async () => {
    await processFile(filename)
    expect(mockCreateDemographicsUpdate).toHaveBeenCalledWith(content)
  })

  test('should send demographics update', async () => {
    await processFile(filename)
    expect(mockSendMessage).toHaveBeenNthCalledWith(1, {}, DEMOGRAPHICS)
  })

  test('should create customer update', async () => {
    await processFile(filename)
    expect(mockCreateCustomerUpdate).toHaveBeenCalledWith(content)
  })

  test('should send customer update', async () => {
    await processFile(filename)
    expect(mockSendMessage).toHaveBeenNthCalledWith(2, {}, CUSTOMER)
  })

  test('should upload file to file storage', async () => {
    await processFile(filename)
    expect(mockUploadFile).toHaveBeenCalledWith(filename, {})
  })

  test('should delete file from file storage', async () => {
    await processFile(filename)
    expect(mockDeleteFile).toHaveBeenCalledWith(filename)
  })
})
