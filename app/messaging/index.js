const { MessageReceiver } = require('ffc-messaging')
const { messagingConfig } = require('../config')
const processDemographicsMessage = require('./process-demographics-message')
const updateReceivers = []

const start = async () => {
  for (let i = 0; i < messagingConfig.updatesSubscription.numberOfReceivers; i++) {
    let updateReceiver  // eslint-disable-line
    const updateAction = message => processDemographicsMessage(message, updateReceiver)
    updateReceiver = new MessageReceiver(messagingConfig.updatesSubscription, updateAction)
    updateReceivers.push(updateReceiver)
    await updateReceiver.subscribe()
    console.info(`Receiver ${i + 1} ready to receive payment requests`)
  }
}

const stop = async () => {
  for (const updateReceiver of updateReceivers) {
    await updateReceiver.closeConnection()
  }
}

module.exports = { start, stop }
