const Joi = require('joi')

const schema = Joi.object({
  enabled: Joi.boolean().default(true),
  shareConnectionString: Joi.string().required(),
  shareName: Joi.string().required(),
  demographicsFolder: Joi.string().required()
})

const config = {
  enabled: process.env.ENABLED,
  shareConnectionString: process.env.DEMOGRAPHICS_STORAGE_CONNECTION_STRING,
  shareName: process.env.DEMOGRAPHICS_STORAGE_SHARE_NAME,
  demographicsFolder: process.env.DEMOGRAPHICS_STORAGE_FOLDER_NAME
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
