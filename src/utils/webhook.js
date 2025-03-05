const crypto = require("crypto");
require("dotenv").config();

const verifyWebhookSignature = (req, secret) => {
  const signature = req.headers["x-webhook-signature"];
  const computedSignature = crypto.createHmac("sha256", secret).update(req.body).digest("hex");

  return signature === computedSignature;
};

module.exports = verifyWebhookSignature;
