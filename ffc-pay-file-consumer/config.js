module.exports = {
  blobConnectionString: process.env.BATCH_STORAGE,
  shareConnectionString: process.env.DAX_STORAGE,
  containerName: 'dax',
  inboundFolder: 'inbound',
  archiveFolder: 'archive',
  shareName: process.env.DAX_SHARE_NAME,
  totalRetries: 10
}
