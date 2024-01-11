const { MessageSender } = require('ffc-messaging')
const { messagingConfig } = require('../config')
const { createMessage } = require('./create-message')
const { CUSTOMER } = require('../constants/message-types')

const sendMessage = async (body, type) => {
  const message = createMessage(body, type)
  const topic = getTopic(type)
  const sender = new MessageSender(topic)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

const getTopic = (type) => {
  return type === CUSTOMER ? messagingConfig.customerTopic : messagingConfig.demographicsTopic
}

module.exports = {
  sendMessage
}
