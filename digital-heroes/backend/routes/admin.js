const express = require("express");
const router = express.Router();

const User = require("../Models/User");
const Draw = require("../Models/Draw");
const Winner = require("../Models/Winner");
const Charity = require("../Models/Charity");
const Subscription = require("../Models/Subscription");

// =======================
// ADMIN CHECK FIXED
// =======================
const isAdmin = async (req, res, next) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not admin"
            });
        }

        next();

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// =======================
// STATS (FIXED)
// =======================
router.get("/stats", isAdmin, async (req, res) => {
    try {
        const users = await User.countDocuments();
        const subscriptions = await Subscription.countDocuments({ status: "Active" });
        const winners = await Winner.countDocuments();

        const prizePoolData = await Winner.find();
        const prizePool = prizePoolData.reduce(
            (sum, w) => sum + (Number(w.amount) || 0),
            0
        );

        const charities = await Charity.countDocuments();

        res.json({
            users,
            subscriptions,
            winners,
            prizePool,
            charities
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// =======================
// USERS
// =======================
router.get("/users", isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =======================
// DRAW
// =======================
router.post("/run-draw", isAdmin, async (req, res) => {
    try {
        const nums = [];

        while (nums.length < 5) {
            const n = Math.floor(Math.random() * 45) + 1;
            if (!nums.includes(n)) nums.push(n);
        }

        const draw = await Draw.create({
            month: new Date().toLocaleString("default", { month: "long" }),
            year: new Date().getFullYear(),
            winningNumbers: nums
        });

        res.json({
            success: true,
            draw
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// =======================
// WINNERS
// =======================
router.get("/winners", isAdmin, async (req, res) => {
    try {
        const winners = await Winner.find();
        res.json({ winners });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =======================
// VERIFY WINNER
// =======================
router.post("/verify", isAdmin, async (req, res) => {
    try {
        const { winnerId, status } = req.body;

        const updated = await Winner.findByIdAndUpdate(
            winnerId,
            { status },
            { new: true }
        );

        res.json({
            success: true,
            updated
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =======================
// CHARITY
// =======================
router.get("/charities", isAdmin, async (req, res) => {
    try {
        const charities = await Charity.find();
        res.json({ charities });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/charities", isAdmin, async (req, res) => {
    try {
        const { name, percent } = req.body;

        const charity = await Charity.create({
            charityName: name,
            contribution: percent
        });

        res.json({ charity });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;