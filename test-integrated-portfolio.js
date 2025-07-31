import { formatNewsWithOpenAI } from './lib/openai.js';
import { detectPortfolioMentionsInText, PANTERA_PORTFOLIO_COMPANIES } from './lib/filter.js';

// Test news content with portfolio companies having meaningful activity
const testNewsContent = `
# Crypto Daily Brief – July 30, 2025

## Market Overview
The crypto market cap reached $3.94 trillion today with strong institutional buying.

## Major Stories

### 1. **Uniswap Labs Announces Revolutionary V5 Protocol**
Uniswap Labs unveiled its highly anticipated V5 protocol upgrade, introducing advanced cross-chain functionality and improved gas efficiency. The upgrade includes automated market making enhancements and could process up to 50,000 transactions per second. Trading volume on Uniswap surged 300% following the announcement, with UNI token rallying 25%. This marks a significant milestone for the DEX protocol as it competes with centralized exchanges.

### 2. **Circle Secures $1.2B Series E Funding Round** 
Circle, the issuer of USDC stablecoin, completed a massive $1.2 billion Series E funding round led by BlackRock and Fidelity. The funding will accelerate Circle's expansion into traditional banking and cross-border payments. USDC market cap reached a new all-time high of $58 billion as institutional adoption accelerates across global financial institutions.

### 3. **Chainlink Expands Cross-Chain Infrastructure**
Chainlink unveiled major upgrades to its Cross-Chain Interoperability Protocol (CCIP), enabling seamless data transfer between 12 major blockchains including Ethereum, Polygon, and Avalanche. The upgrade reduces cross-chain transaction costs by 40% and processing time to under 30 seconds, positioning LINK as the backbone of multi-chain DeFi.

### 4. **Solana Labs Partners with Visa for Enterprise Payments**
Solana Labs announced a groundbreaking partnership with Visa to integrate SOL-based payments into Visa's global merchant network. The collaboration will enable real-time settlements for enterprise customers across 200+ countries. SOL price jumped 15% on the news, reaching $195, as institutional payment adoption accelerates.

## Other News
Bitcoin continues to trade around $118,500. Ethereum remains stable at $3,800.
`;

async function testIntegratedPortfolioSystem() {
  console.log('🧪 Testing Integrated Portfolio Detection System...\n');
  
  try {
    // Step 1: Test portfolio detection
    console.log('📊 Step 1: Testing Portfolio Detection');
    const detectedMentions = detectPortfolioMentionsInText(testNewsContent, PANTERA_PORTFOLIO_COMPANIES);
    console.log(`💎 Detected ${detectedMentions.length} portfolio companies:`, detectedMentions);
    
    // Step 2: Test OpenAI formatting with portfolio integration
    console.log('\n🧠 Step 2: Testing OpenAI Formatting with Portfolio Section');
    const formattedNews = await formatNewsWithOpenAI(testNewsContent);
    
    console.log('\n📋 FORMATTED NEWSLETTER:');
    console.log('═'.repeat(80));
    console.log(formattedNews);
    console.log('═'.repeat(80));
    
    // Step 3: Verify portfolio section exists
    const hasPortfolioSection = formattedNews.includes(':gem: *Pantera Portfolio Highlights*');
    console.log(`\n🎯 Portfolio Section Generated: ${hasPortfolioSection ? '✅ YES' : '❌ NO'}`);
    
    if (hasPortfolioSection) {
      console.log('💎 SUCCESS: Portfolio companies with meaningful activity were properly highlighted!');
      
      // Count portfolio mentions in the formatted output
      const portfolioMatches = formattedNews.match(/\t• \*\*.*?\*\*:/g) || [];
      console.log(`📈 Portfolio companies highlighted: ${portfolioMatches.length}`);
      
      portfolioMatches.forEach((match, index) => {
        const companyName = match.match(/\*\*(.*?)\*\*/)[1];
        console.log(`   ${index + 1}. ${companyName}`);
      });
    } else {
      console.log('⚠️  No portfolio section - companies may not have met meaningful activity criteria');
    }
    
    console.log(`\n📊 Total newsletter length: ${formattedNews.length} characters`);
    console.log('✅ Integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

testIntegratedPortfolioSystem(); 