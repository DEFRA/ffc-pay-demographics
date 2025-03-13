const databaseConfig = require('./database')
const storageConfig = require('./storage')
const processingConfig = require('./processing')
const messagingConfig = require('./messaging')
const serverConfig = require('./server')

module.exports = {
  databaseConfig,
  storageConfig,
  processingConfig,
  messagingConfig,
  serverConfig
}
