const { MessageSender } = require('ffc-messaging')
const { messagingConfig } = require('../config')
const { createMessage } = require('./create-message')

const sendMessages = async (messages, type) => {
  for (const message of messages) {
    await sendMessage(message, type)
  }
}

const sendMessage = async (body, type) => {
  const message = createMessage(body, type)
  const sender = new MessageSender(messagingConfig.customerTopic)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendMessages
}
