const Joi = require('joi')

const schema = Joi.object({
  enabled: Joi.boolean().default(true),
  connectionString: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  demographicsContainer: Joi.string().required(),
  daxContainer: Joi.string().required(),
  demographicsFolder: Joi.string().required(),
  daxFolder: Joi.string().required(),
  archiveFolder: Joi.string().required(),
  useConnectionStr: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(false)
})

const config = {
  enabled: process.env.ENABLED,
  connectionString: process.env.DEMOGRAPHICS_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  demographicsContainer: 'demographics',
  daxContainer: 'dax',
  demographicsFolder: process.env.DEMOGRAPHICS_STORAGE_FOLDER_NAME,
  daxFolder: process.env.DAX_STORAGE_FOLDER_NAME,
  archiveFolder: 'archive',
  useConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
