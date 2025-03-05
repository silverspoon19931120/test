require("dotenv").config();
const express = require("express");
const router = express.Router();
const kafka = require("kafka-node");

const KAFKA_BROKER = process.env.KAFKA_BROKER || "localhost:9092";
const kafkaClient = new kafka.KafkaClient({ kafkaHost: KAFKA_BROKER});
const producer = new kafka.Producer(kafkaClient);

router.post("/events", async (req, res) => {
    const { event_type, resource, metadata } = req.body;
    const timestamp = new Date().toISOString();

    try {
        const eventPayload = { event_type, resource, metadata, timestamp };

        producer.send([{ topic: "events", messages: JSON.stringify(eventPayload) }], (err) => {
            if (err) return res.status(500).json({ error: "Event Queue Error" });
            res.status(200).json({ message: "Event published" });
        })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error"});
    }
});

module.exports = router;