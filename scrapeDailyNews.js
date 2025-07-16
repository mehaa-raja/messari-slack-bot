const axios = require("axios");
require("dotenv").config();

const MESSARI_API_KEY = process.env.MESSARI_API_KEY;

async function scrapeDailyNews() {
  const headers = {
    "x-messari-api-key": MESSARI_API_KEY,
    "Content-Type": "application/json",
  };

  console.log("📰 Fetching latest crypto news...");
  
  try {
    const { data } = await axios.get("https://data.messari.io/api/v1/news", { 
      headers,
      params: {
        page: 1,
        limit: 15  // Get more focused news stories
      }
    });
    const articles = data?.data || [];

    console.log(`📈 Found ${articles.length} articles from Messari News`);
    
    // Filter for actual news stories (not research reports)
    const newsArticles = articles.filter(article => {
      const title = article.title.toLowerCase();
      const isResearch = title.includes('research') || 
                        title.includes('report') || 
                        title.includes('analysis') ||
                        title.includes('state of') ||
                        title.includes('understanding');
      
      return !isResearch && 
             article.content && 
             article.content.length > 200;
    });

    console.log(`📋 Filtered to ${newsArticles.length} news stories`);

    return newsArticles.map(article => {
      // Clean content for news reader format
      let content = article.content || '';
      
      // Remove "Key Insights" headers and bullet points
      content = content
        .replace(/Key Insights\s*/gi, '')
        .replace(/^\s*[-•]\s*/gm, '')
        .replace(/\n+/g, ' ')
        .trim();

      // Extract the most important sentences (first 2-3 substantive ones)
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 15);
      const newsContent = sentences.slice(0, 2).join('. ').trim() + '.';

      return {
        title: article.title,
        content: newsContent,
        fullContent: content.slice(0, 600),
        url: article.url,
        publishedAt: article.published_at,
        assets: article.assets?.map(a => a.slug?.toLowerCase()) || []
      };
    });
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    return [];
  }
}

module.exports = scrapeDailyNews;
