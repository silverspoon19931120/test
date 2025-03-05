const db = require("../config/db");
const axios = require("axios");

const retryFailedNotifications = async () => {
  const { rows } = await db.query("SELECT * FROM failed_notifications WHERE retry_attempts < 5");

  for (const failed of rows) {
    try {
      await axios.post(failed.callback_url, JSON.parse(failed.payload));
      console.log(`Retry successful for ${failed.callback_url}`);

      await db.query("DELETE FROM failed_notifications WHERE id = $1", [failed.id]);
    } catch (error) {
      console.error(`Retry failed for ${failed.callback_url}`);
      await db.query(
        "UPDATE failed_notifications SET retry_attempts = retry_attempts + 1 WHERE id = $1",
        [failed.id]
      );
    }
  }
};

setInterval(retryFailedNotifications, 300000);

module.exports = retryFailedNotifications;
