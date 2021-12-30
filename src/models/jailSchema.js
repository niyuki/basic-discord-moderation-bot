const mongoose = require('mongoose');

let jaill = new mongoose.Schema({
    userID: String,
    moderatorID: String,
    reason: String,
    timestamp: Number,
    duration: Number,
    oldRoles: Array,
})

module.exports = mongoose.model('jailehe', jaill)