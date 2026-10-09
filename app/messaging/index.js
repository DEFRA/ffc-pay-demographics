const { messagingConfig, processingConfig } = require('../config')
const { createServiceBusClient, createReceiver, subscribeReceiver, closeSenders } = require('./service-bus')
const processDemographicsMessage = require('./process-demographics-message')
let sbClient
let updateReceiver

const start = async () => {
  if (processingConfig.enabled) {
    sbClient = createServiceBusClient(messagingConfig.updatesSubscription)
    updateReceiver = createReceiver(sbClient, messagingConfig.updatesSubscription)
    const updateAction = message => processDemographicsMessage(message, updateReceiver)
    subscribeReceiver(updateReceiver, updateAction, console.error, messagingConfig.updatesSubscription)
    console.info('Receiver ready to receive demographics updates')
  } else {
    console.info('Demographics updates are not configured in this environment')
  }
}

const stop = async () => {
  if (updateReceiver) {
    await updateReceiver.close()
  }
  if (sbClient) {
    await sbClient.close()
  }
  await closeSenders()
}

module.exports = { start, stop }
