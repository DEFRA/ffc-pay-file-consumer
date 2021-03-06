jest.mock('../ffc-pay-file-consumer/config', () => ({ totalRetries: 1 }))
const retry = require('../ffc-pay-file-consumer/retry')

describe('retry', () => {
  const mockFunction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should retry as specified in config', async () => {
    await retry(mockFunction)
    expect(mockFunction).toHaveBeenCalledTimes(1)
  })

  test('should throw error if retries exceeded', async () => {
    mockFunction.mockImplementation(() => { throw new Error() })
    await expect(retry(mockFunction)).rejects.toThrow()
  })
})
