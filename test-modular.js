import { fetchCryptoBrief, scrapeMessariNews } from './messariWebScraper.js';
import { fetchMessariAPI, fetchPortfolioData } from './lib/messari-api.js';
import { summarizeWithOpenAI } from './lib/openai.js';

// Test portfolio detection with sample articles
async function testPortfolioDetection() {
  console.log('\n💼 Testing Enhanced Portfolio Detection');
  console.log('='.repeat(50));

  // Sample articles with portfolio company mentions
  const testArticles = [
    {
      title: "Uniswap Labs Announces V4 Upgrade with Enhanced Features",
      content: "Uniswap Labs today revealed plans for a major protocol upgrade that includes improved capital efficiency and reduced gas costs for traders.",
      source: "CoinDesk",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Circle Expands USDC to New Blockchain Networks",
      content: "Circle announced the expansion of USD Coin (USDC) to additional blockchain networks, improving accessibility for institutional users.",
      source: "The Block",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Solana Network Sees Record Daily Transactions",
      content: "The Solana blockchain processed over 2 million transactions yesterday, marking a new all-time high for the network.",
      source: "Decrypt",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Bitcoin ETF Sees $500M Inflows This Week",
      content: "Institutional Bitcoin ETFs attracted significant capital as institutional interest in crypto continues to grow.",
      source: "Bloomberg",
      publishedAt: new Date().toISOString()
    }
  ];

  try {
    const brief = await summarizeWithOpenAI(testArticles);
    console.log('✅ Generated portfolio-aware brief:');
    console.log('\n' + '='.repeat(50));
    console.log(brief);
    console.log('='.repeat(50));
    
    // Count portfolio mentions
    const portfolioMentioned = testArticles.filter(article => {
      const text = `${article.title} ${article.content}`.toLowerCase();
      return ['uniswap', 'circle', 'usdc', 'solana'].some(company => text.includes(company));
    });
    
    console.log(`\n📊 Portfolio Analysis:`);
    console.log(`• Total articles: ${testArticles.length}`);
    console.log(`• Portfolio mentions: ${portfolioMentioned.length}`);
    console.log(`• Companies detected: Uniswap Labs, Circle, Solana`);

  } catch (error) {
    console.error('❌ Portfolio detection test failed:', error.message);
  }
}

// Test the new modular architecture
async function testModularSystem() {
  console.log('🧪 Testing Modular Messari System');
  console.log('='.repeat(50));

  try {
    // Test 1: Direct API call
    console.log('\n📡 Test 1: Direct Messari API');
    const apiData = await fetchMessariAPI();
    console.log(`✅ API returned ${apiData.length} articles`);

    // Test 2: Portfolio data
    console.log('\n💼 Test 2: Portfolio Data');
    const portfolioData = await fetchPortfolioData();
    console.log(`✅ Portfolio data for ${portfolioData.length} assets`);

    // Test 3: Unified fetcher (full workflow)
    console.log('\n🚀 Test 3: Unified Crypto Brief Generation');
    const brief = await fetchCryptoBrief();
    console.log(`✅ Generated brief (${brief.length} characters):`);
    console.log('\n' + '='.repeat(50));
    console.log(brief);
    console.log('='.repeat(50));

    // Test 4: Portfolio detection
    await testPortfolioDetection();

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Test fallback
    console.log('\n🔄 Testing fallback summary...');
    try {
      const fallbackBrief = await summarizeWithOpenAI(null);
      console.log('✅ Fallback summary generated:');
      console.log(fallbackBrief);
    } catch (fallbackError) {
      console.error('❌ Even fallback failed:', fallbackError.message);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testModularSystem().catch(console.error);
}

export { testModularSystem, testPortfolioDetection }; 