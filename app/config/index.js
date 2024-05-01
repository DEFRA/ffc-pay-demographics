const databaseConfig = require('./database')
const storageConfig = require('./storage')
const processingConfig = require('./processing')
const serverConfig = require('./server')
const messagingConfig = require('./messaging')

module.exports = {
  databaseConfig,
  storageConfig,
  processingConfig,
  serverConfig,
  messagingConfig
}
