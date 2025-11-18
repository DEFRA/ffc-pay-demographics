const mockFileContent = 'content'
const mockDelete = jest.fn()
const mockCreate = jest.fn()
const mockCopySuccess = () => ({ pollUntilDone: jest.fn().mockResolvedValue({ copyStatus: 'success' }) })
const mockCopyFail = () => ({ pollUntilDone: jest.fn().mockResolvedValue({ copyStatus: 'failed' }) })
const mockCopyFromURL = jest.fn().mockResolvedValue(mockCopySuccess())
const mockBeginCopyFromURL = jest.fn().mockImplementation(mockCopyFromURL)
const returnFilename = require('./mocks/return-filename')

const mockContainerClient = {
  createIfNotExists: jest.fn(),
  listBlobsFlat: jest.fn().mockReturnValue([
    { name: 'file.txt', kind: 'file' },
    { name: 'file.json', kind: 'file' },
    { name: '1234855_1321434.json', kind: 'file' },
    { name: returnFilename, kind: 'file' }
  ]),
  getBlockBlobClient: jest.fn().mockImplementation(() => ({
    upload: jest.fn().mockImplementation(mockCreate),
    delete: jest.fn().mockImplementation(mockDelete),
    downloadToBuffer: jest.fn().mockResolvedValue(mockFileContent),
    beginCopyFromURL: jest.fn().mockImplementation(mockBeginCopyFromURL)
  }))
}

const mockBlobServiceClient = { getContainerClient: jest.fn().mockReturnValue(mockContainerClient) }

jest.mock('@azure/storage-blob', () => {
  const BlobServiceClient = jest.fn().mockImplementation(() => mockBlobServiceClient)
  BlobServiceClient.fromConnectionString = jest.fn().mockReturnValue(mockBlobServiceClient)
  return { BlobServiceClient }
})

jest.mock('@azure/identity', () => ({
  DefaultAzureCredential: jest.fn(),
  ClientSecretCredential: jest.fn()
}))

const { DEMOGRAPHICS } = require('../app/constants/containers')
const {
  initialiseContainers,
  getDemographicsFiles,
  getReturnFiles,
  downloadFile,
  uploadFile,
  deleteFile,
  quarantineFile,
  archiveFile,
  _testOnly: { resetInitialisationState }
} = require('../app/storage')
const { storageConfig } = require('../app/config')
const { DefaultAzureCredential, ClientSecretCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetInitialisationState()
  })

  describe('get demographics files', () => {
    test('should return only demographics files', async () => {
      await initialiseContainers()
      const files = await getDemographicsFiles()
      expect(files).toEqual(['1234855_1321434.json'])
    })
  })

  describe('get return files', () => {
    test('should return only return files', async () => {
      await initialiseContainers()
      const files = await getReturnFiles()
      expect(files).toEqual([returnFilename])
    })
  })

  describe('download file', () => {
    test('should download file', async () => {
      await initialiseContainers()
      const content = await downloadFile('1234855_1321434', DEMOGRAPHICS)
      expect(content).toEqual(mockFileContent)
    })
  })

  describe('upload file', () => {
    test('should upload file', async () => {
      await initialiseContainers()
      await uploadFile('new_file', 'content', DEMOGRAPHICS)
      expect(mockCreate).toHaveBeenCalled()
    })
  })

  describe('delete file', () => {
    test('should delete file', async () => {
      await initialiseContainers()
      await deleteFile('1234855_1321434')
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe('initialise containers', () => {
    test('should initialise containers when enabled', async () => {
      await initialiseContainers()
      expect(mockContainerClient.createIfNotExists).toHaveBeenCalledTimes(2)
    })
  })

  describe('quarantine file', () => {
    test('should quarantine file and delete original on success', async () => {
      await initialiseContainers()
      const result = await quarantineFile('1234855_1321434.json', DEMOGRAPHICS)
      expect(mockBeginCopyFromURL).toHaveBeenCalled()
      expect(mockDelete).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    test('should not delete original if copy fails', async () => {
      await initialiseContainers()
      mockCopyFromURL.mockResolvedValueOnce(mockCopyFail())
      const result = await quarantineFile('1234855_1321434.json', DEMOGRAPHICS)
      expect(mockDelete).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('archive file', () => {
    test('should archive file and delete original on success', async () => {
      await initialiseContainers()
      const result = await archiveFile('1234855_1321434.json', DEMOGRAPHICS)
      expect(mockBeginCopyFromURL).toHaveBeenCalled()
      expect(mockDelete).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    test('should not delete original if copy fails', async () => {
      await initialiseContainers()
      mockCopyFromURL.mockResolvedValueOnce(mockCopyFail())
      const result = await archiveFile('1234855_1321434.json', DEMOGRAPHICS)
      expect(mockDelete).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('Blob Service Client Setup', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      resetInitialisationState()
    })

    describe('setupBlobServiceClient', () => {
      test('should use connection string when useConnectionStr is true', async () => {
        storageConfig.useConnectionStr = true
        storageConfig.connectionString = 'mock-connection-string'
        await initialiseContainers()
        expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledWith('mock-connection-string')
      })

      test('should use ClientSecretCredential when client credentials are provided', async () => {
        storageConfig.useConnectionStr = false
        storageConfig.demographicsClientId = 'mock-client-id'
        storageConfig.demographicsClientSecret = 'mock-client-secret'
        storageConfig.demographicsTenantId = 'mock-tenant-id'
        await initialiseContainers()
        expect(ClientSecretCredential).toHaveBeenCalledWith(
          'mock-tenant-id',
          'mock-client-id',
          'mock-client-secret'
        )
      })

      test('should use DefaultAzureCredential when no client credentials', async () => {
        storageConfig.useConnectionStr = false
        storageConfig.demographicsClientId = null
        storageConfig.demographicsClientSecret = null
        storageConfig.demographicsTenantId = null
        await initialiseContainers()
        expect(DefaultAzureCredential).toHaveBeenCalled()
        expect(ClientSecretCredential).not.toHaveBeenCalled()
      })
    })

    describe('setupDaxBlobServiceClient', () => {
      test('should use connection string when useDaxConnectionStr is true', async () => {
        storageConfig.useDaxConnectionStr = true
        storageConfig.connectionString = 'mock-dax-connection-string'
        await initialiseContainers()
        expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledWith('mock-dax-connection-string')
      })

      test('should use DefaultAzureCredential when useDaxConnectionStr is false', async () => {
        storageConfig.useDaxConnectionStr = false
        await initialiseContainers()
        expect(DefaultAzureCredential).toHaveBeenCalled()
      })
    })
  })
})
