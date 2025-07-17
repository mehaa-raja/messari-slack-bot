// Demo: Enhanced Portfolio Detection
// Shows how the system detects Pantera portfolio companies in crypto news

const PANTERA_COMPANIES = [
  // Major tokens/protocols
  'Circle', 'USDC', 'Solana', 'SOL', 'Avalanche', 'AVAX', 'Polygon', 'MATIC',
  'Compound', 'COMP', 'Uniswap', 'UNI', 'Chainlink', 'LINK', 'The Graph', 'GRT',
  'Polkadot', 'DOT', 'Near Protocol', 'NEAR', 'Cosmos', 'ATOM', 'Filecoin', 'FIL',
  'Arbitrum', 'ARB', 'Balancer', 'BAL', 'Audius', 'AUDIO', 'Livepeer', 'LPT',
  'Mina Protocol', 'MINA', 'Zcash', 'ZEC', 'Ampleforth', 'AMPL',
  
  // Key companies (subset for demo)
  'Alchemy', 'Anchorage', 'BitGo', 'Chainalysis', 'Flashbots', 'Gemini',
  'OpenSea', 'Magic Eden', 'Polymarket', 'Ripple', 'Wintermute', 'StarkWare',
  'Lido', 'Morpho', 'Origin Protocol', 'Perpetual Protocol'
];

// Sample news articles
const sampleArticles = [
  {
    title: "Uniswap Labs Announces V4 Upgrade with Enhanced Features",
    content: "Uniswap Labs today revealed plans for a major protocol upgrade that includes improved capital efficiency and reduced gas costs for traders.",
    source: "CoinDesk"
  },
  {
    title: "Circle Expands USDC to New Blockchain Networks", 
    content: "Circle announced the expansion of USD Coin (USDC) to additional blockchain networks, improving accessibility for institutional users.",
    source: "The Block"
  },
  {
    title: "Solana Network Sees Record Daily Transactions",
    content: "The Solana blockchain processed over 2 million transactions yesterday, marking a new all-time high for the network.",
    source: "Decrypt"
  },
  {
    title: "Flashbots Releases MEV Protection for Ethereum Users",
    content: "Flashbots launched a new service to protect retail users from MEV extraction during trades on Ethereum.",
    source: "CoinTelegraph"
  },
  {
    title: "Ripple Wins Key Legal Victory in SEC Case",
    content: "A federal judge ruled in favor of Ripple Labs in a significant development for the ongoing SEC lawsuit.",
    source: "Reuters"
  },
  {
    title: "Bitcoin Price Reaches New Monthly High",
    content: "Bitcoin surged to its highest level this month amid increased institutional demand and ETF inflows.",
    source: "Bloomberg"
  }
];

function detectPortfolioMentions(articles) {
  const mentions = [];
  const mentionedCompanies = new Set();

  articles.forEach(article => {
    const text = `${article.title} ${article.content}`.toLowerCase();
    const companiesInArticle = [];

    PANTERA_COMPANIES.forEach(company => {
      if (text.includes(company.toLowerCase())) {
        companiesInArticle.push(company);
        mentionedCompanies.add(company);
      }
    });

    if (companiesInArticle.length > 0) {
      mentions.push({
        ...article,
        detectedCompanies: companiesInArticle
      });
    }
  });

  return { mentions, mentionedCompanies: Array.from(mentionedCompanies) };
}

function generatePortfolioSpotlight(mentions, mentionedCompanies) {
  if (mentions.length === 0) return "No portfolio company mentions detected.";

  let spotlight = `💼 PANTERA PORTFOLIO SPOTLIGHT\n`;
  spotlight += `Portfolio companies mentioned: ${mentionedCompanies.slice(0, 5).join(', ')}${mentionedCompanies.length > 5 ? ' +more' : ''}\n\n`;
  
  mentions.slice(0, 3).forEach(article => {
    spotlight += `• ${article.title}\n`;
    spotlight += `  Companies: ${article.detectedCompanies.join(', ')}\n`;
  });

  return spotlight;
}

console.log('🏦 Pantera Portfolio Detection Demo');
console.log('='.repeat(50));

const { mentions, mentionedCompanies } = detectPortfolioMentions(sampleArticles);

console.log(`\n📊 Detection Results:`);
console.log(`• Total articles analyzed: ${sampleArticles.length}`);
console.log(`• Portfolio mentions found: ${mentions.length}`);
console.log(`• Unique companies detected: ${mentionedCompanies.length}`);
console.log(`• Companies: ${mentionedCompanies.join(', ')}\n`);

console.log('📈 Portfolio Articles:');
mentions.forEach((article, index) => {
  console.log(`${index + 1}. ${article.title}`);
  console.log(`   Companies detected: ${article.detectedCompanies.join(', ')}`);
  console.log(`   Source: ${article.source}\n`);
});

console.log('='.repeat(50));
console.log(generatePortfolioSpotlight(mentions, mentionedCompanies));
console.log('='.repeat(50));

console.log('\n✅ Portfolio Detection System Active');
console.log(`✅ Tracking ${PANTERA_COMPANIES.length}+ portfolio companies`);
console.log('✅ Real-time news analysis ready');
console.log('✅ Institutional-grade briefing format ready'); 