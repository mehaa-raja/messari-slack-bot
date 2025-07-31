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

// Updated Pantera Portfolio Companies - Comprehensive List
export const PANTERA_PORTFOLIO_COMPANIES = [
  '0x', '1inch.exchange', '6529.io', 'Abra', 'Acala Network', 'Alchemy', 'Altius', 'Amber Group',
  'Ampleforth', 'Anchor', 'Anchorage', 'Ancient8', 'Andalusia Labs', 'Ankr', 'API3', 'Apollo',
  'aPriori', 'Arbitrum', 'Arcade.xyz', 'Arch Network', 'ASST', 'Audius', 'Aurora', 'AutoLotto',
  'Avantis', 'Azra Games', 'B3', 'NPC Labs', 'Bakkt', 'Balancer Labs', 'Basecoin', 'Basis', 
  'BCB Group', 'BGOGO', 'Bitaccess', 'BitDAO', 'BitGo', 'BitOasis', 'BitPesa', 'Bitso', 'Bitstamp', 
  'Bittensor', 'Bitwise', 'Blockchain.com', 'Blockfolio', 'Bloom', 'BloXroute Labs', 'BMNR', 
  'Bounce Finance', 'Braavos', 'Braintrust', 'Brave', 'BTCjam', 'Cantor Equity Partners', 'Cega',
  'Celer Network', 'Chain', 'Chainalysis', 'Chainflip', 'ChangeCoin', 'Chronicled', 'Circle', 
  'Civic', 'Codex Protocol', 'CoinDCX', 'Coinme', 'Coins.ph', 'Coinsuper', 'Computable Labs', 
  'Cosigned', 'Onyx', 'Cosmos Network', 'Cypherium', 'DATA', 'DCOE', 'Definitive', 'DeSo', 
  'DIRT Protocol', 'DMarket', 'doc.ai', 'Dodo Exchange', 'Earn.com', 'Earth', 'Eco', 'EDX Markets', 
  'Enigma', 'ErisX', 'Ethena', 'Everclear', 'Connext', 'Expand', 'Faraway', 'Fastbreaklabs', 
  'Few and Far', 'Figure', 'Filament', 'Filecoin', 'Flashbots', 'Flexa', 'Fordefi', 
  'FunFair Technologies', 'Futureswap', 'Gemini', 'Genopets', 'GEODNET', 'Gifto', 'Gliph', 
  'GlobeDX', 'Gondi', 'Florida St', 'Guildfi', 'Handshake', 'Harbor', 'Hedge', 'Heights Labs', 
  'Helika', 'Hivemapper', 'Hyperspace', 'ICON', 'InfiniGods', 'Injective Protocol', 'InstaDApp',
  'Jambo Wallet', 'Janover', 'DDC', 'Jumbo Exchange', 'Kik', 'Kin Ecosystem', 'Kindred', 
  'Kinesis.money', 'Korbit', 'Kyber Network', 'LaunchKey', 'Leap Wallet', 'Leeway', 'Antic', 
  'Lido', 'Liquity', 'Lithium Finance', 'Livepeer', 'Luda', 'M^0', 'Maecenas', 'MakersPlace', 
  'MarginFi Protocol', 'Maverick Protocol', 'Merit Circle', 'Merkle Data', 'Metalend', 
  'Metaloop', 'Metaplex', 'Metatheory', 'Metaverse.gg', 'Meter.io', 'Mezo', 'Mina Protocol', 
  'Mirror Protocol', 'MonkeyTilt', 'Moonfrost', 'Morph', 'Morpho', 'Near Protocol', 'Nexus', 
  'Nitra', 'Notional', 'Nova Labs', 'Numerai', 'Oasis Labs', 'Obol Network', 'ODX Pte. Ltd', 
  'Omise', 'Omni', 'Ondo', 'OpenEdge', 'Gradient', 'OpenMind', 'OpenToken', 'OPSkins', 'Optic',
  'Orderly', 'Origin Protocol', 'Paradex', 'Parallel', 'Perion', 'Perpetual Protocol', 'Pinata',
  'Pintu', 'PLAY3', 'Polkadot', 'Polychain Capital', 'Pontem Network', 'Potion Labs', 
  'PowerTrade', 'Proof Group', 'Prysm', 'Pryze', 'PsyOptions', 'Quantstamp', 'Radius', 'Raiku',
  'Rangers Protocol', 'Rarimo', 'Reflexer Labs', 'Revolving Games', 'Rialo', 'Ripio', 'Ripple',
  'Sahara Labs', 'SBET', 'Sender', 'Sentient', 'ShapeShift', 'Solana Labs', 'Space Runners',
  'Stacked', 'Stader Labs', 'Staked', 'StarkWare Industries', 'Stride', 'Strike Protocol', 
  'Sturdy Finance', 'Subspace Labs', 'Sumer.money', 'Summoners Arena', 'Swim', 'Symbiotic', 
  'Synfutures', 'Synthetic Minds', 'Tagomi', 'TanX', 'Tari Labs', 'Teahouse', 'Temple Capital', 
  'Terra', 'The Block', 'Thruster', 'ThunderCore', 'TipLink', 'TON', 'TOP', 'Tradehill', 
  'TranScrypts', 'Transparent Systems', 'True Flip', 'TruStory', 'Unbound Finance', 'Unikrn', 
  'Uniswap Labs', 'Unit-E', 'Unstoppable Domains', 'UPEXI', 'Urbit', 'VALR', 'Vauld', 'Veem',
  'Vega Protocol', 'Vigil', 'Virtue Poker', 'Waterfall', 'Whetstone', 'Wintermute', 'Worldcoin', 
  'Worldwide Webb', 'Wyre', 'Xapo', 'Xkit', 'YOLOrekt', 'Zama', 'Zcash',
  
  // Add common token symbols
  'UNI', 'COMP', 'LDO', 'FIL', 'AAVE', 'MKR', 'CRV', 'BAL', 'SUSHI', 'ZRX', 
  'AUDIO', 'LPT', 'DOT', 'NEAR', 'ATOM', 'SOL', 'AVAX', 'MATIC', 'LINK', 'GRT'
];

// Enhanced detection function with meaningful activity filtering
export function detectPortfolioMentionsInText(text, portfolioList = PANTERA_PORTFOLIO_COMPANIES) {
  const lowerText = text.toLowerCase();
  const matches = new Set();
  
  // Keywords that indicate meaningful activity (not just mentions)
  const meaningfulActivityKeywords = [
    'launch', 'announce', 'funding', 'raised', 'investment', 'partnership', 'integration',
    'listing', 'governance', 'proposal', 'upgrade', 'protocol', 'mainnet', 'acquisition',
    'collaboration', 'institutional', 'exchange', 'feature', 'release', 'development',
    'expanding', 'growth', 'milestone', 'breakthrough', 'strategic', 'series', 'round',
    'closes', 'secures', 'partners', 'integrates', 'debuts', 'unveils', 'introduces',
    'partnership', 'deal', 'agreement', 'expansion', 'update', 'new', 'major', 'significant'
  ];

  for (const company of portfolioList) {
    // Create regex for exact word boundary matching
    const regex = new RegExp(`\\b${company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    
    if (regex.test(text)) {
      // Check if there's meaningful activity context around the mention
      const companyIndex = lowerText.search(regex);
      if (companyIndex !== -1) {
        // Extract surrounding context (150 chars before and after)
        const contextStart = Math.max(0, companyIndex - 150);
        const contextEnd = Math.min(lowerText.length, companyIndex + company.length + 150);
        const context = lowerText.substring(contextStart, contextEnd);
        
        // Check if any meaningful activity keywords are in the context
        const hasMeaningfulActivity = meaningfulActivityKeywords.some(keyword => 
          context.includes(keyword)
        );
        
        if (hasMeaningfulActivity) {
          matches.add(company);
        }
      }
    }
  }

  return Array.from(matches);
} 