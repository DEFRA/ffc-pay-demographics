const Joi = require('joi')

const schema = Joi.object({
  enabled: Joi.boolean().default(true),
  pollingInterval: Joi.number().integer().default(60000)
})

const config = {
  enabled: process.env.ENABLED,
  pollingInterval: process.env.POLLING_INTERVAL
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The transfer config is invalid. ${result.error.message}`)
}

module.exports = result.value
