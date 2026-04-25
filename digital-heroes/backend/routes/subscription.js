const express = require("express");
const Subscription = require("../Models/Subscription");

const router = express.Router();

// CREATE / UPDATE SUBSCRIPTION
router.post("/", async (req, res) => {
    try {
        const { userId, plan } = req.body;

        // 🔥 IMPORTANT VALIDATION
        if (!userId || !plan) {
            return res.json({
                success: false,
                message: "userId and plan required"
            });
        }

        let renewalDate = new Date();

        if (plan === "Monthly") {
            renewalDate.setDate(renewalDate.getDate() + 30);
        } else if (plan === "Yearly") {
            renewalDate.setDate(renewalDate.getDate() + 365);
        }

        const subscription = await Subscription.findOneAndUpdate(
            { userId },
            {
                userId,
                plan,
                status: "Active",
                renewalDate
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, subscription });

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});


// GET SUBSCRIPTION
router.get("/:userId", async (req, res) => {
    try {
        const sub = await Subscription.findOne({ userId: req.params.userId });

        if (!sub) {
            return res.json({
                plan: "None",
                status: "Inactive",
                renewalDate: null
            });
        }

        res.json(sub);

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

module.exports = router;