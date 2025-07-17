import { fetchCryptoBrief, scrapeMessariNews } from './messariWebScraper.js';
import { fetchMessariAPI, fetchPortfolioData } from './lib/messari-api.js';
import { summarizeWithOpenAI } from './lib/openai.js';

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

export { testModularSystem }; 