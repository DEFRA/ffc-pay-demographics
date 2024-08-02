const { MessageSender } = require('ffc-messaging')
const { messagingConfig } = require('../config')
const { createMessage } = require('./create-message')
const { EXTRACT } = require('../constants/message-types')

const sendExtractMessage = async (body) => {
  const message = createMessage(body, EXTRACT)
  const sender = new MessageSender(messagingConfig.extractTopic)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendExtractMessage
}
