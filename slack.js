const axios = require("axios");
require("dotenv").config();

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

async function postToSlack(message) {
  try {
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: SLACK_CHANNEL_ID,
        text: message,
        mrkdwn: true,
      },
      {
        headers: {
          Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.ok) {
      console.error("❌ Slack API error:", response.data.error);
    } else {
      console.log("📤 Message sent to Slack successfully!");
    }
  } catch (error) {
    console.error("❌ Error sending to Slack:", error.response?.data || error.message);
  }
}

module.exports = { postToSlack };
