require('./insights').setup()
require('log-timestamp')
const { start } = require('./processing')

module.exports = (async () => start())()
