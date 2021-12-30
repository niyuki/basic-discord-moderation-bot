const mongoose = require('mongoose')

module.exports = mongoose.model('warnings', new mongoose.Schema({
    userID: String,
    guildID: String,
    reason: String,
    moderatorID: String,
    timestamp: Number
}))