const { messagingConfig } = require('../config')
const { getSender, sendMessage } = require('./service-bus')
const { createMessage } = require('./create-message')
const { EXTRACT } = require('../constants/message-types')

const sendExtractMessage = async (body) => {
  const message = createMessage(body, EXTRACT)
  const sender = getSender(messagingConfig.extractTopic)
  await sendMessage(sender, message)
}

module.exports = {
  sendExtractMessage
}
