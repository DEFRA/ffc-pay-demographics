const mockFileContent = 'content'
const mockDelete = jest.fn()
const mockCreate = jest.fn()
const mockContainerClient = {
  createIfNotExists: jest.fn(),
  listBlobsFlat: jest.fn().mockReturnValue([
    { name: 'file.txt', kind: 'file' },
    { name: 'file2.json', kind: 'file' }
  ]),
  getBlockBlobClient: jest.fn().mockImplementation(() => {
    return {
      upload: jest.fn().mockImplementation(mockCreate),
      delete: jest.fn().mockImplementation(mockDelete),
      downloadToBuffer: jest.fn().mockResolvedValue(mockFileContent)
    }
  })
}
const mockBlobServiceClient = {
  getContainerClient: jest.fn().mockReturnValue(mockContainerClient)
}
jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockBlobServiceClient)
    }
  }
})

const { getDemographicsFiles, downloadFile, uploadFile, deleteFile } = require('../app/storage')

describe('storage', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe('get demographics files', () => {
    test('should return only demographics files', async () => {
      const fileList = await getDemographicsFiles()
      expect(fileList).toEqual(['file2.json'])
    })
  })

  describe('download file', () => {
    test('should download file', async () => {
      const fileContent = await downloadFile('file2', 'demographics')
      expect(fileContent).toEqual(mockFileContent)
    })
  })

  describe('upload file', () => {
    test('should upload file', async () => {
      await uploadFile('file1', 'content', 'demographics')
      expect(mockCreate).toHaveBeenCalled()
    })
  })

  describe('delete file', () => {
    test('should delete file', async () => {
      await deleteFile('file1')
      expect(mockDelete).toHaveBeenCalled()
    })
  })
})
