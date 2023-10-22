jest.mock('../../../app/storage')
const { downloadFile: mockDownloadFile, uploadFile: mockUploadFile, deleteFile: mockDeleteFile } = require('../../../app/storage')

const { transferFile } = require('../../../app/transfer/transfer-file')

const filename = 'file1'
const content = 'file data'

describe('transfer file', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDownloadFile.mockResolvedValue(content)
  })

  test('should download file from file storage', async () => {
    await transferFile(filename)
    expect(mockDownloadFile).toHaveBeenCalledWith(filename)
  })

  test('should upload file to blob storage', async () => {
    await transferFile(filename)
    expect(mockUploadFile).toHaveBeenCalledWith(filename, content)
  })

  test('should delete file from file storage', async () => {
    await transferFile(filename)
    expect(mockDeleteFile).toHaveBeenCalledWith(filename)
  })
})
