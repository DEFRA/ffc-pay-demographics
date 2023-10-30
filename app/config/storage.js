const Joi = require('joi')

const schema = Joi.object({
  enabled: Joi.boolean().default(true),
  demographicsShareConnectionString: Joi.string().required(),
  demographicsShareName: Joi.string().required(),
  demographicsFolder: Joi.string().required(),
  daxShareConnectionString: Joi.string().required(),
  daxShareName: Joi.string().required(),
  daxFolder: Joi.string().required()
})

const config = {
  enabled: process.env.ENABLED,
  demographicsShareConnectionString: process.env.DEMOGRAPHICS_STORAGE_CONNECTION_STRING,
  demographicsShareName: process.env.DEMOGRAPHICS_STORAGE_SHARE_NAME,
  demographicsFolder: process.env.DEMOGRAPHICS_STORAGE_FOLDER_NAME,
  daxShareConnectionString: process.env.DAX_STORAGE_CONNECTION_STRING,
  daxShareName: process.env.DAX_STORAGE_SHARE_NAME,
  daxFolder: process.env.DAX_STORAGE_FOLDER_NAME
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
