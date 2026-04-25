const mongoose = require("mongoose");

const charitySchema = new mongoose.Schema({
  userId: String,
  charityName: String,
  contribution: Number
});

module.exports = mongoose.model("Charity", charitySchema);