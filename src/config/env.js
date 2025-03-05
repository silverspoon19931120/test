require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  KAFKA_BROKER: process.env.KAFKA_BROKER || "localhost:9092",
};
