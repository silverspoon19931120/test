const kafka = require("kafka-node");
require("dotenv").config();

const kafkaClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || "localhost:9092" });

const producer = new kafka.Producer(kafkaClient);
producer.on("ready", () => console.log("Kafka Producer Ready"));
producer.on("error", (err) => console.error("Kafka Producer Error", err));

module.exports = { kafkaClient, producer };
