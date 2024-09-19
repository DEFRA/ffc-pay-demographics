const { MessageReceiver } = require('ffc-messaging')
const { messagingConfig, processingConfig } = require('../config')
const processDemographicsMessage = require('./process-demographics-message')
let updateReceiver

const start = async () => {
  if (processingConfig.enabled) {
    const updateAction = message => processDemographicsMessage(message, updateReceiver)
    updateReceiver = new MessageReceiver(messagingConfig.updatesSubscription, updateAction)
    await updateReceiver.subscribe()
    console.info('Receiver ready to receive demographics updates')
  } else {
    console.info('Demographics updates are not configured in this environment')
  }
}

const stop = async () => {
  await updateReceiver.closeConnection()
}

module.exports = { start, stop }
