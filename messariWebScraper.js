import axios from 'axios';
import { summarizeWithOpenAI } from './lib/openai.js';
import { fetchMessariAPI } from './lib/messari-api.js';

// Enhanced Messari Web Scraper with anti-429 headers
export async function scrapeMessariNews() {
  try {
    console.log('🔍 Scraping Messari news page...');
    const res = await axios.get('https://messari.io/news', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Referer': 'https://messari.io'
      },
      timeout: 10000
    });

    if (res.status !== 200) throw new Error(`Non-200 status: ${res.status}`);

    // TODO: Add actual scraping logic here
    return parseNewsArticles(res.data);
  } catch (error) {
    console.error('❌ Error scraping Messari news:', error.message);
    throw error;
  }
}

// Unified fetcher
export async function fetchCryptoBrief() {
  try {
    const articles = await scrapeMessariNews();
    if (!articles || articles.length === 0) throw new Error('No articles found');
    return await summarizeWithOpenAI(articles);
  } catch (scrapeError) {
    console.warn('⚠️  Falling back to Messari API...');
    try {
      const apiData = await fetchMessariAPI();
      return await summarizeWithOpenAI(apiData);
    } catch (apiError) {
      console.warn('⚠️  Messari API failed:', apiError.message);
      console.log('🧠 Falling back to OpenAI base model (no real-time data)...');
      return summarizeWithOpenAI(null); // fallback summary prompt
    }
  }
}

function parseNewsArticles(html) {
  // placeholder for cheerio scraping logic
  return [];
} 