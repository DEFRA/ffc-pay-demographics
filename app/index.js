require('./insights').setup()
require('log-timestamp')
const { start } = require('./transfer')

module.exports = (async () => start())()
