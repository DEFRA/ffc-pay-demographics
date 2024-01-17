const Joi = require('joi')
const { PRODUCTION } = require('../constants/environments')

const schema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object()
  },
  demographicsTopic: {
    address: Joi.string()
  },
  customerTopic: {
    address: Joi.string()
  },
  eventsTopic: {
    address: Joi.string()
  }
})

const config = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === PRODUCTION,
    appInsights: process.env.NODE_ENV === PRODUCTION ? require('applicationinsights') : undefined
  },
  demographicsTopic: {
    address: process.env.DEMOGRAPHICS_TOPIC_ADDRESS
  },
  customerTopic: {
    address: process.env.CUSTOMER_TOPIC_ADDRESS
  },
  eventsTopic: {
    address: process.env.EVENTS_TOPIC_ADDRESS
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The messaging config is invalid. ${result.error.message}`)
}

const demographicsTopic = { ...result.value.messageQueue, ...result.value.demographicsTopic }
const customerTopic = { ...result.value.messageQueue, ...result.value.customerTopic }
const eventsTopic = { ...result.value.messageQueue, ...result.value.eventsTopic }

module.exports = {
  demographicsTopic,
  customerTopic,
  eventsTopic
}
