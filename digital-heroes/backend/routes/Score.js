const express = require("express");
const Score = require("../Models/Score");

const router = express.Router();

/**
 * ADD SCORE (PRD RULES)
 * - max 5 scores only
 * - no duplicate date
 */
router.post("/", async (req, res) => {
  const { userId, score, date } = req.body;

  try {
    //  check duplicate date
    const exists = await Score.findOne({ userId, date });
    if (exists) {
      return res.json({ success: false, message: "Score already exists for this date" });
    }

    const count = await Score.countDocuments({ userId });

    //  if more than 5 → remove oldest
    if (count >= 5) {
      const oldest = await Score.find({ userId }).sort({ _id: 1 }).limit(1);
      await Score.deleteOne({ _id: oldest[0]._id });
    }

    await Score.create({ userId, score, date });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/**
 * GET LAST 5 SCORES
 */
router.get("/:userId", async (req, res) => {
  const scores = await Score.find({ userId })
    .sort({ _id: -1 })
    .limit(5);

  res.json(scores);
});

module.exports = router;