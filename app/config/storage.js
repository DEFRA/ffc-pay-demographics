const Joi = require('joi')

const schema = Joi.object({
  enabled: Joi.boolean().default(true),
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  useConnectionStr: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(false),
  container: Joi.string().required(),
  inboundFolder: Joi.string().required(),
  shareConnectionString: Joi.string().required(),
  shareName: Joi.string().required(),
  demographicsFolder: Joi.string().required()
})

const config = {
  enabled: process.env.ENABLED,
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  useConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS,
  container: 'batch',
  inboundFolder: 'inbound',
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
