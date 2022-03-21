jest.mock('../ffc-pay-file-consumer/config', () => ({ totalRetries: 1 }))
const mockContext = require('./mock-context')
jest.mock('../ffc-pay-file-consumer/storage')
const mockStorage = require('../ffc-pay-file-consumer/storage')

const consumer = require('../ffc-pay-file-consumer')

const file = {}
const content = 'content'

let message

describe('consumer', () => {
  beforeEach(() => {
    message = {
      AzureFileShare: 'dax',
      OutputFileName: 'file.csv',
      ProcessingLocation: 'SERVER.earth.gsi.gov.uk/SchemeFinance/AXWorkspaceSchemeFinance/PRODUCTION/folder/subfolder',
      AzureAdapterType: 'AzureFileStorage'
    }
    mockStorage.getFile.mockReturnValue({ file, content })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should sanitize share filepath', async () => {
    await consumer(mockContext, message)
    expect(mockStorage.getFile).toHaveBeenCalledWith(mockContext, 'folder/subfolder/file.csv')
  })

  test('should write file to blob', async () => {
    await consumer(mockContext, message)
    expect(mockStorage.writeFile).toHaveBeenCalledWith(message.OutputFileName, content)
  })

  test('should delete original share', async () => {
    await consumer(mockContext, message)
    expect(mockStorage.deleteFile).toHaveBeenCalledWith(file)
  })

  test('should throw error if file missing', async () => {
    mockStorage.getFile.mockImplementation(() => { throw new Error() })
    await expect(consumer(mockContext, message)).rejects.toThrow()
  })
})
