const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  userId: String,
  score: {
    type: Number,
    min: 1,
    max: 45
  },
  date: String
});

module.exports = mongoose.model("Score", scoreSchema);