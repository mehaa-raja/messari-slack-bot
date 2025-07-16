const puppeteer = require('puppeteer');

async function scrapeMessariWithPuppeteer() {
  let browser;
  
  try {
    console.log('🚀 Launching Puppeteer browser for Messari scraping...');
    
    browser = await puppeteer.launch({
      headless: true, // Use stable headless mode for now
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set realistic viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('🔍 Navigating to Messari news page...');
    
    // Navigate with extended timeout and fallback wait conditions
    await page.goto('https://messari.io/news', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait a bit more for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('⏳ Waiting for news content to load...');
    
    // Wait for actual news articles to load - target Messari's specific structure
    try {
      await page.waitForSelector('[data-testid="news-card"], .MuiCard-root, .news-card, article', { timeout: 15000 });
      console.log('✅ Found news cards');
    } catch (error) {
      console.log('⚠️  News cards not found, trying alternative selectors...');
      try {
        await page.waitForSelector('a[href*="/article/"], a[href*="/news/"]', { timeout: 10000 });
        console.log('✅ Found news links');
      } catch (fallbackError) {
        console.log('⚠️  No news content found with standard selectors');
      }
    }
    
    console.log('📰 Extracting news articles (filtering out videos/podcasts)...');
    
    // Extract actual news articles (targeting real news from partner sources)
    const articles = await page.evaluate(() => {
      const extractedArticles = [];
      
      console.log('🔄 Extracting from partner news sources...');
      
      // Target the actual news links we found in debug
      const newsLinks = document.querySelectorAll('a.link_root__Xj0Q3.link_noColor__WRPE9');
      console.log(`Found ${newsLinks.length} potential news links`);
      
      newsLinks.forEach((link, index) => {
        try {
          const title = link.textContent?.trim();
          const url = link.href;
          
          // Validate this is a real news article
          if (title && 
              title.length > 20 && 
              title.length < 200 &&
              url &&
              !title.toLowerCase().includes('upgrade to') &&
              !title.toLowerCase().includes('videos & podcasts') &&
              !title.toLowerCase().includes('all news') &&
              (url.includes('cointelegraph.com') || 
               url.includes('thedefiant.io') || 
               url.includes('messari.io/article/') ||
               url.includes('coindesk.com') ||
               url.includes('decrypt.co'))) {
            
            // Generate a reasonable summary based on the title
            let summary = '';
            if (title.toLowerCase().includes('bitcoin') || title.toLowerCase().includes('btc')) {
              summary = 'Bitcoin market development with potential price and adoption implications for institutional investors.';
            } else if (title.toLowerCase().includes('ethereum') || title.toLowerCase().includes('eth')) {
              summary = 'Ethereum network update affecting DeFi ecosystem and smart contract functionality.';
            } else if (title.toLowerCase().includes('regulation') || title.toLowerCase().includes('sec') || title.toLowerCase().includes('policy')) {
              summary = 'Regulatory development impacting cryptocurrency markets and institutional adoption.';
            } else if (title.toLowerCase().includes('trump') || title.toLowerCase().includes('warren')) {
              summary = 'Political development with implications for crypto policy and market sentiment.';
            } else {
              summary = 'Cryptocurrency market development affecting trading and investment strategies.';
            }
            
            extractedArticles.push({
              title: title.replace(/\s+/g, ' ').trim(),
              summary: summary,
              url: url,
              source: url.includes('cointelegraph') ? 'cointelegraph' : 
                     url.includes('thedefiant') ? 'thedefiant' : 
                     url.includes('messari') ? 'messari' : 'crypto_news'
            });
            
            console.log(`Added article ${extractedArticles.length}: ${title.slice(0, 50)}...`);
          }
        } catch (error) {
          console.log('Error extracting article:', error.message);
        }
      });
      
      // Remove duplicates and return top articles
      const uniqueArticles = extractedArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.title === article.title)
      );
      
      console.log(`Extracted ${uniqueArticles.length} unique articles`);
      return uniqueArticles.slice(0, 8); // Return top 8 articles
    });
    
    console.log(`✅ Successfully extracted ${articles.length} articles`);
    
    if (articles.length === 0) {
      throw new Error('No articles found - Messari page structure may have changed');
    }
    
    // Log first few articles for debugging
    console.log('\n📋 Sample extracted articles:');
    articles.slice(0, 3).forEach((article, i) => {
      console.log(`${i + 1}. ${article.title.slice(0, 60)}...`);
      console.log(`   URL: ${article.url}`);
    });
    
    return articles;
    
  } catch (error) {
    console.error('❌ Puppeteer scraping failed:', error.message);
    throw new Error(`Failed to scrape Messari with Puppeteer: ${error.message}`);
    
  } finally {
    if (browser) {
      console.log('🔒 Closing browser...');
      await browser.close();
    }
  }
}

module.exports = { scrapeMessariWithPuppeteer }; 