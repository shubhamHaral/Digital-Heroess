const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema({
  userId: String,
  drawId: String,
  matchedCount: Number,
  amount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Winner", winnerSchema);