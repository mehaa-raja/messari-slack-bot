import { detectPortfolioMentionsInText, PANTERA_PORTFOLIO_COMPANIES } from './lib/filter.js';

// Test the actual Ondo Finance news that should have been detected
const ondoNewsText = `
Real-World Asset (RWA) Tokenization
Ondo Finance and Pantera Capital have launched a $250 million fund, Ondo Catalyst, to invest in tokenized real-world asset projects. The fund targets both equity and token investments in protocols and infrastructure that advance on-chain capital markets. This move reflects the growing trend of bringing traditional assets like bonds, stocks, and real estate onto blockchains for faster, more efficient transactions.
`;

async function testOndoDetection() {
  console.log('🧪 Testing Ondo Finance Detection...\n');
  
  console.log('📰 News Content:');
  console.log(ondoNewsText.trim());
  
  console.log('\n🔍 Testing Detection Function:');
  const detectedCompanies = detectPortfolioMentionsInText(ondoNewsText, PANTERA_PORTFOLIO_COMPANIES);
  
  console.log(`💎 Detected Companies: ${detectedCompanies.length}`);
  console.log('Companies:', detectedCompanies);
  
  // Check if Ondo is in the portfolio list
  console.log('\n📋 Portfolio List Check:');
  const ondoVariants = ['Ondo', 'Ondo Finance'];
  ondoVariants.forEach(variant => {
    const inList = PANTERA_PORTFOLIO_COMPANIES.includes(variant);
    console.log(`  "${variant}" in portfolio: ${inList ? '✅' : '❌'}`);
  });
  
  // Manual regex test
  console.log('\n🔧 Manual Regex Test:');
  const ondoRegex = /\bOndo\b/i;
  const regexMatch = ondoRegex.test(ondoNewsText);
  console.log(`Regex "\\bOndo\\b" matches: ${regexMatch ? '✅' : '❌'}`);
  
  // Check activity keywords
  console.log('\n🎯 Activity Keywords Check:');
  const activityKeywords = ['launched', 'fund', 'invest', 'advance'];
  activityKeywords.forEach(keyword => {
    const found = ondoNewsText.toLowerCase().includes(keyword);
    console.log(`  "${keyword}": ${found ? '✅' : '❌'}`);
  });
}

testOndoDetection(); 