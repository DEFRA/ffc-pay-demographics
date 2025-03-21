const Joi = require('joi')

const schema = Joi.object({
  enabled: Joi.boolean().default(true),
  connectionString: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  daxConnectionString: Joi.string().when('useDaxConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  daxStorageAccount: Joi.string().required(),
  demographicsContainer: Joi.string().required(),
  demographicsClientId: Joi.string().allow('').optional(),
  demographicsClientSecret: Joi.string().allow('').optional(),
  demographicsTenantId: Joi.string().allow('').optional(),
  daxContainer: Joi.string().required(),
  daxFolder: Joi.string().required(),
  daxOutboundFolder: Joi.string().required(),
  archiveFolder: Joi.string().required(),
  useConnectionStr: Joi.boolean().default(false),
  useDaxConnectionStr: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(false),
  managedIdentityClientId: Joi.string().optional()
})

const config = {
  enabled: process.env.ENABLED,
  connectionString: process.env.DEMOGRAPHICS_STORAGE_CONNECTION_STRING,
  daxConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.DEMOGRAPHICS_STORAGE_ACCOUNT_NAME,
  daxStorageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  demographicsContainer: process.env.DEMOGRAPHICS_STORAGE_SHARE_NAME,
  demographicsClientId: process.env.DEMOGRAPHICS_CLIENT_ID,
  demographicsClientSecret: process.env.DEMOGRAPHICS_CLIENT_SECRET,
  demographicsTenantId: process.env.DEMOGRAPHICS_TENANT_ID,
  daxContainer: process.env.AZURE_STORAGE_CONTAINER,
  daxFolder: process.env.AZURE_STORAGE_FOLDER,
  daxOutboundFolder: process.env.DAX_STORAGE_OUTBOUND_FOLDER_NAME,
  archiveFolder: 'archive',
  useConnectionStr: process.env.DEMOGRAPHICS_STORAGE_USE_CONNECTION_STRING,
  useDaxConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS,
  managedIdentityClientId: process.env.AZURE_CLIENT_ID
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
