const mongoose = require("mongoose");

const guild = new mongoose.Schema({
  guildID: String,
  Day: { type: Number, default: 1 },
  NextUpdate: { type: Number, default: new Date().setHours(24, 0, 0, 0) }
});

module.exports = mongoose.model("Guilds", guild);

