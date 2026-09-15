const { getSender, sendMessage: sendServiceBusMessage } = require('./service-bus')
const { messagingConfig } = require('../config')
const { createMessage } = require('./create-message')

const sendMessages = async (messages, type) => {
  for (const message of messages) {
    await sendMessage(message, type)
  }
}

const sendMessage = async (body, type) => {
  const sender = getSender(messagingConfig.customerTopic)
  const message = createMessage(body, type)
  await sendServiceBusMessage(sender, message)
}

module.exports = {
  sendMessages
}
