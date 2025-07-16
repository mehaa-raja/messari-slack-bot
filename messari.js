// messari.js
const axios = require("axios");
require("dotenv").config();

const MESSARI_API_KEY = process.env.MESSARI_API_KEY;
const PANTERA_COMPANIES = process.env.PANTERA_PORTFOLIO_COMPANIES
  ? process.env.PANTERA_PORTFOLIO_COMPANIES.split(",").map((c) => c.trim().toLowerCase())
  : [];

async function getTopStoriesAndPanteraMentions() {
  const headers = {
    "x-messari-api-key": MESSARI_API_KEY,
    "Content-Type": "application/json",
  };

  // Fetch latest 10–15 news articles
  const { data } = await axios.get("https://data.messari.io/api/v1/news", { headers });
  const articles = data?.data || [];

  const topStories = [];
  const panteraMentions = [];

  for (let article of articles) {
    const title = article.title;
    const url = article.url;
    const content = article.content?.slice(0, 500).replace(/\n+/g, " ") || "";

    const prompt = `Summarize this crypto news in 2–3 sentences like a financial newsletter:\n"${content}"`;

    const summaryResponse = await axios.post(
      "https://api.messari.io/ai/openai/chat/completions",
      {
        messages: [{ role: "user", content: prompt }],
        verbosity: "balanced",
        response_format: "markdown",
        stream: false,
      },
      { headers }
    );

    const summary = summaryResponse.data?.choices?.[0]?.message?.content?.trim();
    const story = {
      title,
      content: summary,
      link: url,
    };

    const slugMatches = (article.assets || []).some((asset) =>
      PANTERA_COMPANIES.includes(asset.slug?.toLowerCase())
    );

    if (slugMatches) {
      panteraMentions.push(story);
    } else if (topStories.length < 5) {
      topStories.push(story);
    }
  }

  return { topStories, panteraMentions };
}

module.exports = { getTopStoriesAndPanteraMentions };
