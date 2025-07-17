export function filterPortfolioMentions(articles, companies) {
  return articles.filter(article => {
    const content = `${article.title} ${article.summary}`.toLowerCase();
    return companies.some(company =>
      content.includes(company.toLowerCase())
    );
  });
}

export function detectPortfolioMentions(articles, companies) {
  const mentions = [];
  
  articles.forEach(article => {
    const content = `${article.title} ${article.summary}`.toLowerCase();
    const detectedCompanies = companies.filter(company =>
      content.includes(company.toLowerCase())
    );
    
    if (detectedCompanies.length > 0) {
      mentions.push({
        ...article,
        detectedCompanies
      });
    }
  });
  
  return mentions;
}

// Extended portfolio company list for detection
export const PANTERA_PORTFOLIO_COMPANIES = [
  // Major tokens/projects
  'Bitcoin', 'BTC', 'Ethereum', 'ETH', 'Solana', 'SOL', 'Avalanche', 'AVAX',
  'Polygon', 'MATIC', 'Chainlink', 'LINK', 'Uniswap', 'UNI', 'Compound', 'COMP',
  'Circle', 'USDC', 'The Graph', 'GRT', 'Filecoin', 'FIL', 'Arweave', 'AR',
  
  // DeFi platforms
  'Aave', 'Curve', 'Balancer', 'SushiSwap', 'SUSHI', '1inch', 'dYdX', 'Synthetix', 'SNX',
  'Maker', 'MKR', 'Yearn', 'YFI', 'Bancor', 'BNT', 'Kyber', 'KNC',
  
  // NFT platforms
  'OpenSea', 'Magic Eden', 'SuperRare', 'Foundation', 'Async Art',
  
  // Infrastructure
  'Alchemy', 'Infura', 'Moralis', 'QuickNode', 'Ankr', 'Pocket Network', 'POKT',
  'Livepeer', 'LPT', 'Helium', 'HNT', 'Audius', 'AUDIO',
  
  // Enterprise/Institutional
  'Anchorage', 'BitGo', 'Chainalysis', 'Elliptic', 'TRM Labs', 'Fireblocks',
  'Gemini', 'Kraken', 'Bitstamp', 'Bitwise', 'Galaxy Digital',
  
  // Layer 2 & Scaling
  'Arbitrum', 'ARB', 'Optimism', 'OP', 'StarkWare', 'STARK', 'Immutable', 'IMX',
  'Loopring', 'LRC', 'Polygon Hermez', 'zkSync',
  
  // Privacy & Security
  'Zcash', 'ZEC', 'Oasis Network', 'ROSE', 'Secret Network', 'SCRT',
  'Tornado Cash', 'Aztec Protocol',
  
  // Gaming & Metaverse
  'Axie Infinity', 'AXS', 'Decentraland', 'MANA', 'The Sandbox', 'SAND',
  'Enjin', 'ENJ', 'Gala', 'GALA', 'Immutable X',
  
  // Cross-chain & Interoperability
  'Cosmos', 'ATOM', 'Polkadot', 'DOT', 'Kusama', 'KSM', 'IBC Protocol',
  'Wormhole', 'LayerZero', 'Multichain', 'Synapse Protocol',
  
  // Emerging sectors
  'Flashbots', 'MEV-Boost', 'Lido', 'LDO', 'Rocket Pool', 'RPL',
  'Frax', 'FXS', 'Liquity', 'LQTY', 'Reflexer', 'RAI',
  
  // Trading & Market Making
  'Wintermute', '0x', 'ZRX', 'Kyber Network', 'Bancor Network',
  'Paraswap', 'Matcha', 'DEX.AG',
  
  // Additional mentions
  'Pantera Capital', 'Pantera', 'portfolio company', 'investment'
]; 