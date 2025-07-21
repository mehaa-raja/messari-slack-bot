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

// Pantera Capital Portfolio Companies (exact names)
export const PANTERA_PORTFOLIO_COMPANIES = [
  // Major Protocols/Tokens
  'Circle', 'USDC', 'Solana', 'SOL', 'Avalanche', 'AVAX', 'Polygon', 'MATIC',
  'Compound', 'COMP', 'Uniswap', 'UNI', 'Chainlink', 'LINK', 'The Graph', 'GRT',
  'Polkadot', 'DOT', 'Near Protocol', 'NEAR', 'Cosmos', 'ATOM', 'Filecoin', 'FIL',
  'Arbitrum', 'ARB', 'Balancer', 'BAL', 'Audius', 'AUDIO', 'Livepeer', 'LPT',
  'Mina Protocol', 'MINA', 'Zcash', 'ZEC', 'Ampleforth', 'AMPL',
  
  // Companies A-B
  '0x', '1inch', '1inch.exchange', '6529.io', 'Abra', 'Acala Network', 'Alchemy',
  'Altius', 'Amber Group', 'Ampleforth', 'Anchor', 'Anchorage', 'Ancient8',
  'Andalusia Labs', 'Ankr', 'API3', 'Apollo', 'aPriori', 'Arbitrum', 'Arcade.xyz',
  'Arch Network', 'ASST', 'Audius', 'Aurora', 'AutoLotto', 'Avantis', 'Azra Games',
  'B3', 'NPC Labs', 'Bakkt', 'Balancer Labs', 'Basecoin', 'Basis', 'BCB Group',
  'BGOGO', 'Bitaccess', 'BitDAO', 'BitGo', 'BitOasis', 'BitPesa', 'Bitso',
  'Bitstamp', 'Bittensor', 'Bitwise', 'BITB', 'ETHW', 'Blockchain.com',
  'Blockfolio', 'Bloom', 'BloXroute Labs', 'BMNR', 'Bounce Finance', 'Braavos',
  'Braintrust', 'Brave', 'BTCjam',
  
  // Companies C-E
  'Cantor Equity Partners', 'Cega', 'Celer Network', 'Chain', 'Chainalysis',
  'Chainflip', 'ChangeCoin', 'Chronicled', 'Circle', 'Civic', 'Codex Protocol',
  'CoinDCX', 'Coinme', 'Coins.ph', 'Coinsuper', 'Computable Labs', 'Cosigned',
  'Onyx', 'Cosmos Network', 'Cypherium', 'DATA', 'DCOE', 'Definitive', 'DeSo',
  'DIRT Protocol', 'DMarket', 'doc.ai', 'Dodo Exchange', 'Earn.com', 'Earth',
  'Eco', 'EDX Markets', 'Enigma', 'ErisX', 'Ethena', 'Everclear', 'Connext', 'Expand',
  
  // Companies F-H
  'Faraway', 'Fastbreaklabs', 'Few and Far', 'Figure', 'Filament', 'Filecoin',
  'Flashbots', 'Flexa', 'Fordefi', 'FunFair Technologies', 'Futureswap', 'Gemini',
  'Genopets', 'GEODNET', 'Gifto', 'Gliph', 'GlobeDX', 'Gondi', 'Florida St',
  'Guildfi', 'Handshake', 'Harbor', 'Hedge', 'Heights Labs', 'Helika',
  'Hivemapper', 'Hyperspace',
  
  // Companies I-M
  'ICON', 'InfiniGods', 'Injective Protocol', 'InstaDApp', 'Jambo Wallet',
  'Janover', 'DDC', 'Jumbo Exchange', 'Kik', 'Kin Ecosystem', 'Kindred',
  'Kinesis.money', 'Korbit', 'Kyber Network', 'LaunchKey', 'Leap Wallet',
  'Leeway', 'Antic', 'Lido', 'Liquity', 'Lithium Finance', 'Livepeer', 'Luda',
  'M^0', 'Maecenas', 'MakersPlace', 'MarginFi Protocol', 'Maverick Protocol',
  'Merit Circle', 'Merkle Data', 'Metalend', 'Metaloop', 'Metaplex', 'Metatheory',
  'Metaverse.gg', 'Meter.io', 'Mezo', 'Mina Protocol', 'Mirror Protocol',
  'MonkeyTilt', 'Moonfrost', 'Morph', 'Morpho',
  
  // Companies N-R
  'Near Protocol', 'Nexus', 'Nitra', 'Notional', 'Nova Labs', 'Numerai',
  'Oasis Labs', 'Obol Network', 'ODX Pte. Ltd', 'Omise', 'Omni', 'Ondo',
  'OpenEdge', 'Gradient', 'OpenMind', 'OpenToken', 'OPSkins', 'Optic', 'Orderly',
  'Origin Protocol', 'Paradex', 'Parallel', 'Perion', 'Perpetual Protocol',
  'Pinata', 'Pintu', 'PLAY3', 'Polkadot', 'Polychain Capital', 'Pontem Network',
  'Potion Labs', 'PowerTrade', 'Proof Group', 'Prysm', 'Pryze', 'PsyOptions',
  'Quantstamp', 'Radius', 'Raiku', 'Rangers Protocol', 'Rarimo', 'Reflexer Labs',
  'Revolving Games', 'Rialo', 'Ripio', 'Ripple',
  
  // Companies S-Z
  'Sahara Labs', 'SBET', 'Sender', 'Sentient', 'ShapeShift', 'Solana Labs',
  'Space Runners', 'Stacked', 'Stader Labs', 'Staked', 'StarkWare Industries',
  'Stride', 'Strike Protocol', 'Sturdy Finance', 'Subspace Labs', 'Sumer.money',
  'Summoners Arena', 'Swim', 'Symbiotic', 'Synfutures', 'Synthetic Minds',
  'Tagomi', 'TanX', 'Tari Labs', 'Teahouse', 'Temple Capital', 'Terra',
  'The Block', 'Thruster', 'ThunderCore', 'TipLink', 'TON', 'TOP', 'Tradehill',
  'TranScrypts', 'Transparent Systems', 'True Flip', 'TruStory', 'Unbound Finance',
  'Unikrn', 'Uniswap Labs', 'Unit-E', 'Unstoppable Domains', 'UPEXI', 'Urbit',
  'VALR', 'Vauld', 'Veem', 'Vega Protocol', 'Vigil', 'Virtue Poker', 'Waterfall',
  'Whetstone', 'Wintermute', 'Worldcoin', 'Worldwide Webb', 'Wyre', 'Xapo',
  'Xkit', 'YOLOrekt', 'Zama', 'Zcash',
  
  // Additional Platforms
  'OpenSea', 'Magic Eden', 'Polymarket', 'FTX', 'Blockdaemon', 'Tendermint',
  'Biconomy', 'StarkNet', 'Starknet', 'zkSync', 'Optimism', 'Base',
  
  // General mentions
  'Pantera Capital', 'Pantera', 'portfolio company'
];

// Helper function to detect portfolio mentions in raw text content
export function detectPortfolioMentionsInText(text, portfolioList) {
  const lowerText = text.toLowerCase();
  const matches = new Set();

  for (const name of portfolioList) {
    const normalized = name.toLowerCase().replace(/[^\w]/g, ''); // Normalize punctuation
    const normalizedText = lowerText.replace(/[^\w\s]/g, ''); // Normalize text
    
    // Check for various forms of the company name
    if (normalizedText.includes(normalized) || 
        lowerText.includes(name.toLowerCase()) ||
        lowerText.includes(name.toLowerCase().replace(/\s+/g, ''))) {
      matches.add(name);
    }
  }

  return Array.from(matches);
} 