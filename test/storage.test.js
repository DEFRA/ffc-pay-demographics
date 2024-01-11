const mockFileContent = 'content'
const mockDelete = jest.fn()
const mockCreate = jest.fn()
const mockContainerClient = {
  createIfNotExists: jest.fn(),
  listBlobsFlat: jest.fn().mockReturnValue([
    { name: 'file.txt', kind: 'file' },
    { name: 'file.json', kind: 'file' },
    { name: '1234855_1321434.json', kind: 'file' }
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

const { DEMOGRAPHICS } = require('../app/constants/containers')
const { getDemographicsFiles, downloadFile, uploadFile, deleteFile } = require('../app/storage')

describe('storage', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe('get demographics files', () => {
    test('should return only demographics files', async () => {
      const fileList = await getDemographicsFiles()
      expect(fileList).toEqual(['1234855_1321434.json'])
    })
  })

  describe('download file', () => {
    test('should download file', async () => {
      const fileContent = await downloadFile('1234855_1321434', DEMOGRAPHICS)
      expect(fileContent).toEqual(mockFileContent)
    })
  })

  describe('upload file', () => {
    test('should upload file', async () => {
      await uploadFile('new_file', 'content', DEMOGRAPHICS)
      expect(mockCreate).toHaveBeenCalled()
    })
  })

  describe('delete file', () => {
    test('should delete file', async () => {
      await deleteFile('1234855_1321434')
      expect(mockDelete).toHaveBeenCalled()
    })
  })
})
