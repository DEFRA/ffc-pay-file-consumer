const { BlobServiceClient } = require('@azure/storage-blob')
const { ShareServiceClient } = require('@azure/storage-file-share')
const { containerName, inboundFolder } = require('./config')

let blobServiceClient
let shareServiceClient
let container
let share

const connect = (blobConnectionString, shareConnectionString, shareName) => {
  blobServiceClient = BlobServiceClient.fromConnectionString(blobConnectionString)
  container = blobServiceClient.getContainerClient(containerName)
  shareServiceClient = ShareServiceClient.fromConnectionString(shareConnectionString)
  share = shareServiceClient.getShareClient(shareName)
}

const getFile = async (context, filepath) => {
  context.log(`Searching for ${filepath}`)
  const file = share.rootDirectoryClient.getFileClient(filepath)
  const downloaded = await file.downloadToBuffer()
  context.log(`Found ${filepath}`)
  return { file, content: downloaded.toString() }
}

const writeFile = async (filename, content) => {
  const blob = container.getBlockBlobClient(`${inboundFolder}/${filename}`)
  await blob.upload(content, content.length)
}

const deleteFile = async (file) => {
  await file.delete()
}

module.exports = {
  connect,
  getFile,
  writeFile,
  deleteFile
}
