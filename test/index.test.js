jest.mock('../ffc-pay-file-consumer/config', () => ({ totalRetries: 1 }))
const consumer = require('../ffc-pay-file-consumer')
const mockContext = require('./mock-context')
jest.mock('../ffc-pay-file-consumer/storage')
const mockStorage = require('../ffc-pay-file-consumer/storage')
let message
const file = {}
const content = 'content'

describe('consumer', () => {
  beforeEach(() => {
    message = { 
      AzureFileShare: 'dax',
      OutputFileName 'file.csv',
      ProcessingLocation: 'SERVER.earth.gsi.gov.uk/SchemeFinance/AXWorkspaceSchemeFinance/PRODUCTION/folder'
    }
    mockStorage.getFile.mockReturnValue({ file, content })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should write file to blob', async () => {
    await consumer(mockContext, message)
    expect(mockStorage.writeFile).toHaveBeenCalledWith(message.filename, content)
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
