module.exports = {
  blobConnectionString: process.env.BATCH_STORAGE,
  shareConnectionString: process.env.DAX_STORAGE,
  containerName: 'dax',
  inboundFolder: 'inbound',
  totalRetries: 10
}
