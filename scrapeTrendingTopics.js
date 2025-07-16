const axios = require("axios");
require("dotenv").config();

const MESSARI_API_KEY = process.env.MESSARI_API_KEY;

async function scrapeTrendingTopics() {
  const headers = {
    "X-MESSARI-API-KEY": MESSARI_API_KEY,
    "accept": "application/json",
  };

  console.log("🔥 Fetching trending crypto topics...");
  
  try {
    const { data } = await axios.get("https://api.messari.io/signal/v0/topics/global/current", { 
      headers,
      params: {
        sort: "trending"
      }
    });
    
    const topics = data?.data || [];
    console.log(`📈 Found ${topics.length} trending topics`);

    return topics.map((topic, index) => {
      // Clean content for news reader format
      let content = topic.summary || topic.content || '';
      
      // Remove bullet points and format for news reader
      content = content
        .replace(/^\s*[•·-]\s*/gm, '')
        .replace(/\n+/g, ' ')
        .trim();

      // Extract first 2 sentences for clean summary
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 15);
      const cleanSummary = sentences.slice(0, 2).join('. ').trim() + '.';

      return {
        title: topic.title,
        content: cleanSummary,
        fullContent: topic.content || '',
        summary: topic.summary || '',
        rank: topic.rank || index + 1,
        documentCount: topic.documentCount || 0,
        assets: topic.assets?.map(a => ({
          name: a.name,
          symbol: a.symbol,
          slug: a.slug?.toLowerCase()
        })) || [],
        classes: topic.classes || [],
        url: topic.topDocuments?.[0]?.url || null,
        timestamp: topic.avgDocumentTimestamp
      };
    });
  } catch (error) {
    console.error("❌ Error fetching trending topics:", error.response?.status, error.response?.statusText);
    console.error("Error details:", error.response?.data || error.message);
    return [];
  }
}

module.exports = scrapeTrendingTopics; 