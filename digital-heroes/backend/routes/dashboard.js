const express = require("express");
const router = express.Router();

const Subscription = require("../Models/Subscription");
const Score = require("../Models/Score");
const Charity = require("../Models/Charity");
const Winner = require("../Models/Winner"); // 🔥 IMPORTANT ADD

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const subscription = await Subscription.findOne({ userId });

    const scores = await Score.find({ userId })
      .sort({ _id: -1 })
      .limit(5);

    const charity = await Charity.findOne({ userId });

    // 🔥 REAL WINNINGS LOGIC
    const winners = await Winner.find({ userId });

    const total = winners.reduce((sum, w) => sum + (w.amount || 0), 0);

    let status = "No winnings yet";
    if (total >= 10000) status = "Jackpot 🎉";
    else if (total > 0) status = "Won 🎉";

    res.json({
      subscription: subscription || {
        plan: "None",
        status: "Inactive",
        renewalDate: null
      },

      scores,
      charity: charity || {
        charityName: "Not Selected",
        contribution: 0
      },

      drawsEntered: winners.length, // 🔥 FIXED

      winnings: {
        total,
        status
      }
    });

  } catch (err) {
    res.json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;