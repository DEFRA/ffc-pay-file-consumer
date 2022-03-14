const parseMessage = require('./parse-message')
const transferFile = require('./transfer-file')

module.exports = async function (context, mySbMsg) {
  context.log('JavaScript ServiceBus topic trigger function received message', mySbMsg)
  const request = parseMessage(mySbMsg)
  await transferFile(context, request)
}
