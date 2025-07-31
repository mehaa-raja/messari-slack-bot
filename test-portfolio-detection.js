import { formatNewsWithOpenAI } from './lib/openai.js';

// Test with simulated news containing meaningful portfolio activity
const testNewsWithPortfolioActivity = `
# Crypto Daily Brief – July 30, 2025

## Major Stories

### 1. **Uniswap Labs Announces Revolutionary V5 Protocol**
Uniswap Labs unveiled its highly anticipated V5 protocol upgrade, introducing advanced cross-chain functionality and improved gas efficiency. The upgrade includes automated market making enhancements and could process up to 50,000 transactions per second. Trading volume on Uniswap surged 300% following the announcement, with UNI token rallying 25%.

### 2. **Circle Secures $1.2B Series E Funding Round** 
Circle, the issuer of USDC stablecoin, completed a massive $1.2 billion Series E funding round led by BlackRock and Fidelity. The funding will accelerate Circle's expansion into traditional banking and cross-border payments. USDC market cap reached a new all-time high of $58 billion as institutional adoption accelerates.

### 3. **Solana Labs Partners with Visa for Enterprise Payments**
Solana Labs announced a groundbreaking partnership with Visa to integrate SOL-based payments into Visa's global merchant network. The collaboration will enable real-time settlements for enterprise customers across 200+ countries. SOL price jumped 15% on the news, reaching $195.

### 4. **Chainlink Expands Cross-Chain Infrastructure**
Chainlink unveiled major upgrades to its Cross-Chain Interoperability Protocol (CCIP), enabling seamless data transfer between 12 major blockchains including Ethereum, Polygon, and Avalanche. The upgrade reduces cross-chain transaction costs by 40% and processing time to under 30 seconds.

## Market Data
Bitcoin trades at $118,500, Ethereum at $3,800. Total market cap: $3.94T.
`;

async function testPortfolioDetection() {
  console.log('🧪 Testing Portfolio Detection with Meaningful Activity...\n');
  
  try {
    const formattedNews = await formatNewsWithOpenAI(testNewsWithPortfolioActivity);
    
    console.log('📊 FORMATTED NEWSLETTER:');
    console.log('═'.repeat(80));
    console.log(formattedNews);
    console.log('═'.repeat(80));
    
    // Check if portfolio section was included
    const hasPortfolioSection = formattedNews.includes(':gem: *Pantera Portfolio Highlights*');
    
    console.log(`\n🎯 Portfolio Section Detected: ${hasPortfolioSection ? '✅ YES' : '❌ NO'}`);
    
    if (hasPortfolioSection) {
      console.log('💎 SUCCESS: Portfolio companies with meaningful activity were highlighted!');
    } else {
      console.log('⚠️  Portfolio section not included - companies may not have met "meaningful activity" criteria');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPortfolioDetection(); 