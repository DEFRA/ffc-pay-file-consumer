const retry = require('./retry')
const storage = require('./storage')

const getFile = async (context, filepath) => {
  return retry(() => storage.getFile(context, filepath))
}

module.exports = getFile
