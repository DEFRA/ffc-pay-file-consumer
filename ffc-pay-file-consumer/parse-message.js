const parseMessage = (message) => {
  return {
    shareName: message.AzureFileShare,
    filename: message.OutputFileName,
    filepath: `${sanitizeFolder(message.ProcessingLocation)}/${message.OutputFileName}`
  }
}

// folder path provided is a network share address.  We need to strip the first four elements so only the Azure file share folders remain
const sanitizeFolder = (location) => {
  return location.split('/').slice(4).join('/')
}

module.exports = parseMessage
