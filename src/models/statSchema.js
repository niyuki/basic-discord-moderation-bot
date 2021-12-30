const mongoose = require("mongoose");

const stat = new mongoose.Schema({
  userID: String,
  AllVoice: { type: Number, default: 0 },
  AllMessage: { type: Number, default: 0 },
  Voice: { type: Object, default: {} },
  Message: { type: Object, default: {} }
});

module.exports = mongoose.model("Stats", stat);