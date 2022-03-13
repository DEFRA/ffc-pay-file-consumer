jest.mock('../ffc-pay-file-consumer/config', () => ({ totalRetries: 1 }))
const sender = require('../ffc-pay-file-consumer')
const mockContext = require('./mock-context')
jest.mock('../ffc-pay-file-consumer/storage')
const mockStorage = require('../ffc-pay-file-consumer/storage')
let message
const blob = {}
const content = 'content'

describe('sender', () => {
  beforeEach(() => {
    message = { filename: 'my-file.dat', ledger: 'AP' }
    mockStorage.getFile.mockReturnValue({ blob, content })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should write file to share', async () => {
    await sender(mockContext, message)
    expect(mockStorage.writeFile).toHaveBeenCalledWith(message.filename, message.ledger, content)
  })

  test('should archive original blob', async () => {
    await sender(mockContext, message)
    expect(mockStorage.archiveFile).toHaveBeenCalledWith(message.filename, blob)
  })

  test('should throw error if file missing', async () => {
    mockStorage.getFile.mockImplementation(() => { throw new Error() })
    await expect(sender(mockContext, message)).rejects.toThrow()
  })
})
