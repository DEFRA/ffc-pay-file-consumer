const parseMessage = (message) => {
  return {
    shareName: message.AzureFileShare,
    filename: message.OutputFileName,
    filepath: `${sanitizeFolder(message.ProcessingLocation)}/${message.OutputFileName}`
  }
}

const sanitizeFolder = (location) => {
  return location.split('/').slice(4).join('/')
}

module.exports = parseMessage
