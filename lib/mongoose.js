let mongoose = require('mongoose')
let config = require('../config/configset')

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'))

module.exports = mongoose