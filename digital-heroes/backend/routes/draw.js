const express = require("express");
const router = express.Router();

const Draw = require("../Models/Draw");
const Score = require("../Models/Score");
const Winner = require("../Models/Winner");

// 🎲 Generate 5 unique numbers (1–45)
const generateNumbers = () => {
  let nums = [];
  while (nums.length < 5) {
    let n = Math.floor(Math.random() * 45) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  return nums;
};

// 💰 Prize rules
const getPrize = (matchCount) => {
  if (matchCount === 5) return 10000;
  if (matchCount === 4) return 5000;
  if (matchCount === 3) return 2000;
  return 0;
};

// 🟢 RUN DRAW
router.post("/run", async (req, res) => {
  try {
    const winningNumbers = generateNumbers();

    const draw = await Draw.create({
      month: new Date().toLocaleString("default", { month: "long" }),
      year: new Date().getFullYear(),
      winningNumbers
    });

    // ✅ get scores sorted by date
    const scores = await Score.find().sort({ date: -1 });

    // ✅ group latest 5 scores per user
    const grouped = {};

    scores.forEach((s) => {
      if (!grouped[s.userId]) grouped[s.userId] = [];

      if (grouped[s.userId].length < 5) {
        grouped[s.userId].push(Number(s.score));
      }
    });

    let winners = [];

    // ✅ check matches per user
    Object.keys(grouped).forEach((userId) => {
      const uniqueScores = [...new Set(grouped[userId])];

      const matchCount = uniqueScores.filter(num =>
        winningNumbers.includes(num)
      ).length;

      const amount = getPrize(matchCount);

      if (amount > 0) {
        winners.push({
          userId,
          drawId: draw._id,
          matchedCount: matchCount,
          amount
        });
      }
    });

    if (winners.length > 0) {
      await Winner.insertMany(winners);
    }

    res.json({
      success: true,
      draw,
      winningNumbers,
      winnersCount: winners.length,
      message: "Monthly draw executed successfully"
    });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;