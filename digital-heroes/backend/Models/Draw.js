const mongoose = require("mongoose");

const drawSchema = new mongoose.Schema({
  month: String,
  year: Number,
  winningNumbers: [Number],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Draw", drawSchema);