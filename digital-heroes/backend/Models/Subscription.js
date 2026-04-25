const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
    userId: { type: String, required: true },

    plan: {
        type: String,
        enum: ["Monthly", "Yearly"],
        required: true
    },

    status: {
        type: String,
        enum: ["Active", "Expired"],
        default: "Active"
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    renewalDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Subscription", subSchema);