require("dotenv").config();
const kafka = require("kafka-node");
const { Pool } = require("pg");
const axios = require("axios");

const KAFKA_BROKER = process.env.KAFKA_BROKER || "localhost:9092";
const db = new Pool({ connectionString: process.env.DATABASE_URL });

const consumer = new kafka.Consumer(
  new kafka.KafkaClient({ kafkaHost: KAFKA_BROKER }),
  [{ topic: "events", partition: 0 }],
  { autoCommit: true }
);

consumer.on("message", async (message) => {
  const event = JSON.parse(message.value);
  console.log(`Received event: ${event.event_type}`);

  try {
    const { rows } = await db.query(
      "SELECT callback_url FROM subscriptions WHERE event_type = $1",
      [event.event_type]
    );

    if (rows.length === 0) {
      console.log("No subscribers for this event.");
      return;
    }

    for (const sub of rows) {
      try {
        await axios.post(sub.callback_url, event, {
          headers: { "Content-Type": "application/json" }
        });
        console.log(`Notification sent to ${sub.callback_url}`);
      } catch (error) {
        console.error(`Failed to deliver to ${sub.callback_url}. Saving for retry.`);
        await db.query(
          "INSERT INTO failed_notifications (event_type, payload, callback_url) VALUES ($1, $2, $3)",
          [event.event_type, JSON.stringify(event), sub.callback_url]
        );
      }
    }
  } catch (error) {
    console.error("Database Query Error:", error);
  }
});

consumer.on("error", (error) => {
  console.error("Kafka Consumer Error:", error);
});
