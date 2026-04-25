const express = require("express");
const router = express.Router();

const Winner = require("../Models/Winner");

router.get("/:userId", async (req, res) => {
  try {
    const winners = await Winner.find({ userId: req.params.userId });

    const total = winners.reduce((sum, w) => sum + (w.amount || 0), 0);

    let status = "No Win";

    if (total >= 10000) status = "Jackpot 🎉";
    else if (total > 0) status = "Won 🎉";

    res.json({
      total,
      status,
      history: winners
    });

  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = router;