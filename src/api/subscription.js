const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateToken = require("../middleware/auth");

router.post("/subscribe", authenticateToken, async (req, res) => {
    const { business_id, event_type, callback_url } = req.body;

    try {
        await db.query("INSERT INTO subscriptions (business_id, event_type, callback_url) VALUES ($1, $2, $3)", [business_id, event_type, callback_url]);
        res.status(201).json({ message: "Subscription succesfull"});
    } catch (error) {
        res.status(500).json({ error: "Database error"});
    }
});

module.exports = router;