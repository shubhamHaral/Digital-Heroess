const express = require("express");
const Charity = require("../Models/Charity");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, charityName, contribution } = req.body;

    const data = await Charity.findOneAndUpdate(
      { userId },
      { userId, charityName, contribution },
      { upsert: true, new: true }
    );

    res.json({ success: true, data });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  const data = await Charity.findOne({ userId: req.params.userId });
  res.json(data || { charityName: "None", contribution: 0 });
});

module.exports = router;