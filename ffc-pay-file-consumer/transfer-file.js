const { blobConnectionString, shareConnectionString } = require('./config')
const getFile = require('./get-file')
const storage = require('./storage')

const transferFile = async (context, request) => {
  storage.connect(blobConnectionString, shareConnectionString, request.shareName)
  const { file, content } = await getFile(context, request.filepath)
  await storage.writeFile(request.filename, content)
  await storage.deleteFile(file)
  context.log(`Successfully transferred ${request.filename}`)
}

module.exports = transferFile
