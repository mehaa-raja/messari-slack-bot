const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Safe wrapper with retry logic and exponential backoff
async function safeGetMessariNews() {
  const MAX_RETRIES = 3;
  const BASE_DELAY = 1500; // 1.5 seconds
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔍 Scraping Messari news page... (attempt ${attempt}/${MAX_RETRIES})`);
      
      const response = await axios.get('https://messari.io/news', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        },
        timeout: 10000 // 10 second timeout
      });
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.response?.status || error.message);
      
      // If this is a 429 error and we have retries left, wait and try again
      if (error.response?.status === 429 && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY * attempt; // Exponential backoff: 1.5s, 3s, 4.5s
        console.log(`⏱️  Rate limited (429). Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If this is the last attempt or not a retryable error, throw
      if (attempt === MAX_RETRIES) {
        throw new Error(`Failed to fetch Messari news after ${MAX_RETRIES} attempts: ${error.response?.status || error.message}`);
      }
    }
  }
}

async function getLatestMessariNews() {
  try {
    const htmlData = await safeGetMessariNews();
    const $ = cheerio.load(htmlData);
    const articles = [];

    // Updated selectors based on current Messari news page structure
    $('.card-title-container, .news-card, .article-preview, [data-testid*="news"], .news-item').each((_, el) => {
      const $el = $(el);
      
      // Try different ways to extract title
      let title = $el.find('h3, h2, .title, .headline, [data-testid="title"]').first().text().trim();
      if (!title) {
        // Look for title in parent or sibling elements
        title = $el.find('a').first().text().trim();
        if (!title) {
          title = $el.closest('.card, .news-item').find('h3, h2').first().text().trim();
        }
      }
      
      // Try different ways to extract URL
      let url = $el.find('a').first().attr('href');
      if (!url) {
        url = $el.closest('a').attr('href');
      }
      if (url && !url.startsWith('http')) {
        url = 'https://messari.io' + url;
      }
      
      // Try different ways to extract summary/content
      let summary = $el.find('p, .summary, .description, .excerpt, .card-content').first().text().trim();
      if (!summary) {
        // Look in next sibling or parent elements
        summary = $el.next().find('p').first().text().trim();
        if (!summary) {
          summary = $el.closest('.card, .news-item').find('p').first().text().trim();
        }
      }
      
      // Get published date if available
      let publishedAt = $el.find('.date, .published, time, [data-testid*="date"]').first().text().trim();
      
      if (title && url && title.length > 15) { // Ensure meaningful title length
        articles.push({ 
          title: title.replace(/\s+/g, ' ').trim(), // Clean up whitespace
          summary: summary || 'Latest crypto news from Messari',
          url,
          publishedAt: publishedAt || new Date().toISOString(),
          content: summary || 'Latest crypto news from Messari'
        });
      }
    });

    // Fallback: look for any links that might be news articles
    if (articles.length === 0) {
      console.log('🔄 Trying fallback selector approach...');
      
      $('a[href*="/news/"]').each((_, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        let url = $el.attr('href');
        
        if (url && !url.startsWith('http')) {
          url = 'https://messari.io' + url;
        }
        
        if (title && url && title.length > 15) {
          // Get surrounding context for summary
          const summary = $el.closest('div, article, section').find('p').first().text().trim();
          
          articles.push({
            title: title.replace(/\s+/g, ' ').trim(),
            summary: summary || 'Latest crypto news from Messari',
            url,
            publishedAt: new Date().toISOString(),
            content: summary || 'Latest crypto news from Messari'
          });
        }
      });
    }

    console.log(`📰 Found ${articles.length} articles from Messari`);
    
    // CRITICAL: Guard clause to prevent fallback to OpenAI if no articles found
    if (articles.length === 0) {
      throw new Error('No articles found from Messari news page. DOM selectors may need updating or site may be blocking requests.');
    }
    
    // Remove duplicates and limit to 12
    const uniqueArticles = articles.filter((article, index, self) => 
      index === self.findIndex(a => a.title === article.title)
    );
    
    const finalArticles = uniqueArticles.slice(0, 12);
    
    if (finalArticles.length === 0) {
      throw new Error('No valid articles after deduplication. All articles may be duplicates or malformed.');
    }
    
    return finalArticles;
    
  } catch (error) {
    console.error('❌ Error in getLatestMessariNews:', error.message);
    throw error; // Re-throw to prevent fallback to OpenAI
  }
}

async function generateCryptoBriefing() {
  try {
    console.log('🤖 Starting web scraper + AI briefing generation...');
    
    // This will throw an error if scraping fails - no silent fallback
    const articles = await getLatestMessariNews();
    
    console.log(`✅ Successfully scraped ${articles.length} articles. Generating AI briefing...`);
    
    const formattedInput = articles
      .map((a, i) => `Article ${i + 1}: ${a.title}\nSummary: ${a.content}\nURL: ${a.url}`)
      .join('\n\n');

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found. Cannot generate AI briefing.');
    }

    const prompt = `Create a comprehensive crypto news briefing from these ${articles.length} latest articles from Messari scraped in real-time.

Format as a professional newsletter with:
- Engaging headline with today's date
- Brief market overview highlighting key themes from the articles
- Top 5-6 stories with compelling headlines and 2-3 sentence summaries
- Each story should reference specific information from the provided articles
- Brief market outlook based on the news
- Professional closing with Messari attribution

Articles to summarize (all from Messari's latest news):
${formattedInput}

Make it engaging, professional, and suitable for Slack formatting with emojis and markdown. Ensure all content is based on the provided articles - do not add speculative market data or prices.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional crypto market analyst creating daily briefings from real-time scraped news. Only use information from the provided articles. Do not add speculative prices or market data not found in the source material."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.6, // Lower temperature for more consistent, factual output
    });

    const briefing = completion.choices[0]?.message?.content;
    
    if (!briefing || briefing.trim().length < 100) {
      throw new Error('OpenAI generated insufficient briefing content');
    }
    
    console.log('✅ Real-time AI briefing generated successfully from scraped data');
    return briefing.trim();
    
  } catch (error) {
    // Log the specific error but don't return null - let the error bubble up
    console.error('❌ Web scraper + AI briefing failed:', error.message);
    
    // Provide specific error context
    if (error.message.includes('429')) {
      console.error('🚫 Rate limited by Messari. The bot should wait before trying again.');
    } else if (error.message.includes('No articles found')) {
      console.error('🔍 DOM selectors may need updating. Check Messari news page structure.');
    } else if (error.message.includes('OpenAI')) {
      console.error('🤖 OpenAI API issue. Check API key and quota.');
    }
    
    throw error; // Re-throw to prevent silent fallback to outdated content
  }
}

module.exports = { 
  getLatestMessariNews, 
  generateCryptoBriefing 
}; 