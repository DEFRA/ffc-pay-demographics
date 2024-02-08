const Joi = require('joi')

const schema = Joi.object({
  enabled: Joi.boolean().default(true),
  daxEnabled: Joi.boolean().default(false),
  pollingInterval: Joi.number().integer().default(60000),
  useEvents: Joi.boolean().default(true)
})

const config = {
  enabled: process.env.ENABLED,
  daxEnabled: process.env.DAX_ENABLED,
  pollingInterval: process.env.POLLING_INTERVAL,
  useEvents: process.env.USE_EVENTS
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The transfer config is invalid. ${result.error.message}`)
}

module.exports = result.value
