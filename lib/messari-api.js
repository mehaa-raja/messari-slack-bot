import axios from 'axios';

const MESSARI_API_KEY = 'f4e1aead-3412-446e-abac-8819357d6075';
const BASE_URL = 'https://data.messari.io/api/v1';

// Fetch latest news from Messari API
export async function fetchMessariAPI() {
  try {
    console.log('📡 Fetching data from Messari API...');
    
    const response = await axios.get(`${BASE_URL}/news`, {
      headers: {
        'x-messari-api-key': MESSARI_API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'messari-slack-bot/1.0'
      },
      timeout: 15000
    });

    if (response.status !== 200) {
      throw new Error(`Messari API returned status ${response.status}`);
    }

    const newsData = response.data.data;
    if (!newsData || newsData.length === 0) {
      throw new Error('No news data received from Messari API');
    }

    // Transform API response to match expected format
    const articles = newsData.slice(0, 10).map(item => ({
      title: item.title,
      content: item.content || item.summary,
      url: item.url,
      publishedAt: item.published_at,
      source: item.source_name || 'Messari'
    }));

    console.log(`✅ Successfully fetched ${articles.length} articles from Messari API`);
    return articles;

  } catch (error) {
    console.error('❌ Messari API error:', error.message);
    throw error;
  }
}

// Fetch specific asset data
export async function fetchAssetData(assetSymbol = 'BTC') {
  try {
    const response = await axios.get(`${BASE_URL}/assets/${assetSymbol}/metrics`, {
      headers: {
        'x-messari-api-key': MESSARI_API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    return response.data.data;
  } catch (error) {
    console.error(`❌ Error fetching ${assetSymbol} data:`, error.message);
    throw error;
  }
}

// Fetch market data for portfolio companies
export async function fetchPortfolioData() {
  const portfolioAssets = ['BTC', 'ETH', 'SOL', 'AVAX', 'MATIC', 'UNI', 'LINK'];
  
  try {
    const promises = portfolioAssets.map(symbol => 
      fetchAssetData(symbol).catch(err => {
        console.warn(`⚠️  Failed to fetch ${symbol}:`, err.message);
        return null;
      })
    );

    const results = await Promise.all(promises);
    return results.filter(Boolean); // Remove null results
  } catch (error) {
    console.error('❌ Error fetching portfolio data:', error.message);
    throw error;
  }
} 