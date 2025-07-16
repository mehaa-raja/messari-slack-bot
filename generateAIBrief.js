const axios = require("axios");
const { generateCryptoBriefing } = require("./messariWebScraper");
require("dotenv").config();

const MESSARI_API_KEY = process.env.MESSARI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateAIBrief() {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Try web scraper + OpenAI first (latest approach with real-time data)
  console.log("🔍 Trying web scraper + OpenAI approach for real-time briefing...");
  try {
    const webScrapedBrief = await generateCryptoBriefing();
    console.log("✅ Real-time web scraper + OpenAI brief generated successfully");
    return webScrapedBrief;
    
  } catch (error) {
    console.error("❌ Web scraper approach failed:", error.message);
    
    // Check if this is a rate limiting issue - if so, don't fallback to avoid outdated content
    if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
      console.error("🚫 Rate limited by Messari. To prevent outdated content, the bot will not fallback to OpenAI.");
      console.error("💡 Suggestion: Wait 10-15 minutes before running the bot again.");
      return null; // Explicitly return null to prevent any briefing
    }
    
    // If no articles found, likely DOM structure changed - don't fallback to avoid hallucinated content
    if (error.message.includes('No articles found') || error.message.includes('DOM selectors')) {
      console.error("🔍 No articles found from Messari. DOM selectors may need updating.");
      console.error("🚫 To prevent hallucinated content, the bot will not fallback to OpenAI.");
      return null; // Explicitly return null to prevent any briefing
    }
    
    // For other errors (network issues, etc.), log but continue to try fallback methods
    console.log("⚠️  Web scraper failed with non-critical error. Trying fallback methods...");
  }

  // Try Messari AI with grounded data prompt
  if (MESSARI_API_KEY) {
    console.log("🤖 Trying Messari AI with real data...");
    try {
      const messariPrompt = {
        "verbosity": "balanced",
        "response_format": "markdown",
        "inline_citations": false,
        "stream": false,
        "generate_related_questions": 0,
        "messages": [
          {
            "role": "user",
            "content": `📰 Crypto Daily Brief – ${today}\n\nUse only the latest Messari news articles published in the last 24–48 hours. Write a clean, Slack-ready crypto market briefing that summarizes the most impactful news. Each story must be grounded in a specific article or dataset Messari has published. Do not make up prices, upgrades, or events. Format with emoji headers and bold titles.`
          }
        ]
      };

      const response = await axios.post("https://api.messari.io/ai/openai/chat/completions", messariPrompt, {
        headers: {
          "X-MESSARI-API-KEY": MESSARI_API_KEY,
          "Content-Type": "application/json",
        }
      });
      
      const aiContent = response.data?.choices?.[0]?.message?.content;
      if (aiContent) {
        console.log("✅ Messari AI brief generated with real data");
        return aiContent.trim();
      }
    } catch (error) {
      console.log("⚠️  Messari AI failed:", error.response?.status, error.response?.statusText);
      console.log("⚠️  Trying OpenAI fallback...");
    }
  }

  // Fallback to OpenAI with disclaimer
  if (OPENAI_API_KEY) {
    console.log("🤖 Using OpenAI fallback (may not have latest data)...");
    try {
      const openaiPrompt = {
        "model": "gpt-4o-mini",
        "messages": [
          {
            "role": "system",
            "content": "You are a crypto analyst. Write a brief based on general crypto knowledge, but add a disclaimer that this is not based on real-time data. Focus on likely market trends and use realistic but conservative estimates."
          },
          {
            "role": "user",
            "content": `📰 Crypto Daily Brief – ${today}\n\nWrite a clean, Slack-ready crypto briefing with emoji headers and bold titles. Include a disclaimer that this is based on general market knowledge, not real-time data. Use conservative, realistic information.`
          }
        ],
        "max_tokens": 1500,
        "temperature": 0.6
      };

      const response = await axios.post("https://api.openai.com/v1/chat/completions", openaiPrompt, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        }
      });
      
      const aiContent = response.data?.choices?.[0]?.message?.content;
      if (aiContent) {
        console.log("✅ OpenAI fallback brief generated (with disclaimer)");
        return aiContent.trim();
      }
    } catch (error) {
      console.error("❌ OpenAI API failed:", error.response?.status, error.response?.statusText);
    }
  }

  // Return null to trigger news reader fallback
  console.log("⚠️  All AI sources failed, using news reader");
  return null;
}

module.exports = generateAIBrief; 