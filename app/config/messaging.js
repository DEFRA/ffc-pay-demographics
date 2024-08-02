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
  customerTopic: {
    address: Joi.string()
  },
  extractTopic: {
    address: Joi.string()
  },
  eventsTopic: {
    address: Joi.string()
  },
  updatesMessageQueue: {
    host: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    connectionString: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object()
  },
  updatesSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
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
  customerTopic: {
    address: process.env.CUSTOMER_TOPIC_ADDRESS
  },
  extractTopic: {
    address: process.env.DEMOGRAPHICS_EXTRACT_TOPIC_ADDRESS
  },
  eventsTopic: {
    address: process.env.EVENTS_TOPIC_ADDRESS
  },
  updatesMessageQueue: {
    host: process.env.UPDATES_MESSAGE_QUEUE_HOST,
    username: process.env.UPDATES_MESSAGE_QUEUE_USER,
    password: process.env.UPDATES_MESSAGE_QUEUE_PASSWORD,
    connectionString: process.env.UPDATES_MESSAGE_QUEUE_CONNECTION_STRING,
    useCredentialChain: process.env.UPDATES_MESSAGE_USE_CREDENTIAL_CHAIN,
    appInsights: process.env.NODE_ENV === PRODUCTION ? require('applicationinsights') : undefined
  },
  updatesSubscription: {
    address: process.env.DEMOGRAPHICS_SUBSCRIPTION_ADDRESS,
    topic: process.env.DEMOGRAPHICS_TOPIC_ADDRESS,
    type: 'subscription'
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The messaging config is invalid. ${result.error.message}`)
}

const customerTopic = { ...result.value.messageQueue, ...result.value.customerTopic }
const extractTopic = { ...result.value.messageQueue, ...result.value.extractTopic }
const eventsTopic = { ...result.value.messageQueue, ...result.value.eventsTopic }
const updatesSubscription = { ...result.value.updatesMessageQueue, ...result.value.updatesSubscription }

module.exports = {
  customerTopic,
  extractTopic,
  eventsTopic,
  updatesSubscription
}
