jest.mock('../ffc-pay-file-consumer/config', () => ({ totalRetries: 1 }))
const mockContext = require('./mock-context')
const mockGetContainerClient = jest.fn()
const mockUpload = jest.fn()
const mockBlob = {
  upload: mockUpload
}
const mockContainer = {
  getBlockBlobClient: jest.fn().mockReturnValue(mockBlob)
}
const mockBlobServiceClient = {
  getContainerClient: mockGetContainerClient.mockReturnValue(mockContainer)
}
jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockBlobServiceClient)
    }
  }
})
const mockGetShareClient = jest.fn()
const mockFileContent = 'content'
const mockDelete = jest.fn()
const mockFile = {
  downloadToBuffer: jest.fn().mockResolvedValue(Buffer.from(mockFileContent)),
  delete: mockDelete
}
const mockShare = {
  rootDirectoryClient: {
    getFileClient: jest.fn().mockReturnValue(mockFile)
  }
}
const mockShareServiceClient = {
  getShareClient: mockGetShareClient.mockReturnValue(mockShare)
}
jest.mock('@azure/storage-file-share', () => {
  return {
    ShareServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockShareServiceClient)
    }
  }
})

const consumer = require('../ffc-pay-file-consumer')
let message

describe('consumer', () => {
  beforeEach(() => {
    message = {
      AzureFileShare: 'dax',
      OutputFileName: 'file.csv',
      ProcessingLocation: 'SERVER.earth.gsi.gov.uk/SchemeFinance/AXWorkspaceSchemeFinance/PRODUCTION/folder/subfolder',
      AzureAdapterType: 'AzureFileStorage'
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should sanitize share filepath', async () => {
    await consumer(mockContext, message)
    expect(mockShare.rootDirectoryClient.getFileClient).toHaveBeenCalledWith('SERVER.earth.gsi.gov.uk/SchemeFinance/AXWorkspaceSchemeFinance/PRODUCTION/folder/subfolder/file.csv')
  })

  test('should write file to blob', async () => {
    await consumer(mockContext, message)
    expect(mockUpload).toHaveBeenCalledWith(mockFileContent, mockFileContent.length)
  })

  test('should delete original share', async () => {
    await consumer(mockContext, message)
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  test('should throw error if message schema invalid', async () => {
    message = {}
    await expect(consumer(mockContext, message)).rejects.toThrow()
  })

  test('should throw error if file missing', async () => {
    mockShare.rootDirectoryClient.getFileClient.mockImplementation(() => { throw new Error() })
    await expect(consumer(mockContext, message)).rejects.toThrow()
  })
})
