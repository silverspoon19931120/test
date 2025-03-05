require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const kafka = require("kafka-node");

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DATABASE_URL;
const KAFKA_BROKER = process.env.KAFKA_BROKER || "localhost:9092";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new Pool({ connectionString: DB_URL });
db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Database Connection Error", err));

const kafkaClient = new kafka.KafkaClient({ kafkaHost: KAFKA_BROKER });
const producer = new kafka.Producer(kafkaClient);

producer.on("ready", () => console.log("Kafka Producer Ready"));
producer.on("error", (err) => console.error("Kafka Producer Error", err));

const subscriptionRoutes = require("./src/api/subscription");
const eventRoutes = require("./src/api/events");

app.use("/api", subscriptionRoutes);
app.use("/api", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
