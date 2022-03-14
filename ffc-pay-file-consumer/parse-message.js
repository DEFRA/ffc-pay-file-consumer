// TODO: likely filepath needs more processing to remove network path prefix
const parseMessage = (message) => {
  return {
    shareName: message.AzureFileShare,
    filename: message.OutputFileName,
    filepath: `${message.ProcessingLocation}/${message.OutputFileName}`
  }
}

module.exports = parseMessage
