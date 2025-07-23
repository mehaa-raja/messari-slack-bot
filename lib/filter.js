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

// Helper function to detect portfolio mentions in raw text content with activity filtering
export function detectPortfolioMentionsInText(text, portfolioList) {
  const lowerText = text.toLowerCase();
  const matches = new Set();
  
  // Keywords that indicate meaningful activity (not just mentions)
  const meaningfulActivityKeywords = [
    'launch', 'announce', 'funding', 'raised', 'investment', 'partnership', 'integration',
    'listing', 'governance', 'proposal', 'upgrade', 'protocol', 'mainnet', 'acquisition',
    'collaboration', 'institutional', 'exchange', 'feature', 'release', 'development',
    'expanding', 'growth', 'milestone', 'breakthrough', 'strategic', 'series', 'round',
    'closes', 'secures', 'partners', 'integrates', 'debuts', 'unveils', 'introduces'
  ];

  for (const name of portfolioList) {
    const normalized = name.toLowerCase().replace(/[^\w]/g, ''); // Normalize punctuation
    const normalizedText = lowerText.replace(/[^\w\s]/g, ''); // Normalize text
    
    // Check for various forms of the company name
    const companyFound = normalizedText.includes(normalized) || 
                        lowerText.includes(name.toLowerCase()) ||
                        lowerText.includes(name.toLowerCase().replace(/\s+/g, ''));
    
    if (companyFound) {
      // Check if there's meaningful activity context around the mention
      const companyIndex = lowerText.indexOf(name.toLowerCase());
      if (companyIndex !== -1) {
        // Extract surrounding context (100 chars before and after)
        const contextStart = Math.max(0, companyIndex - 100);
        const contextEnd = Math.min(lowerText.length, companyIndex + name.length + 100);
        const context = lowerText.substring(contextStart, contextEnd);
        
        // Check if any meaningful activity keywords are in the context
        const hasMeaningfulActivity = meaningfulActivityKeywords.some(keyword => 
          context.includes(keyword)
        );
        
        if (hasMeaningfulActivity) {
          matches.add(name);
        }
      }
    }
  }

  return Array.from(matches);
}

// Comprehensive Pantera Capital Portfolio Companies
export const PANTERA_PORTFOLIO_COMPANIES = [
  // Major Protocols & Core Holdings
  '0x', '1inch', '1inch.exchange', 'Abra', 'Acala Network', 'Alchemy', 'Altius', 
  'Amber Group', 'Ampleforth', 'Anchor', 'Anchorage', 'Ancient8', 'Andalusia Labs', 
  'Ankr', 'API3', 'Apollo', 'aPriori', 'Arbitrum', 'Arcade.xyz', 'Arch Network', 
  'ASST', 'Audius', 'Aurora', 'AutoLotto', 'Avantis', 'Azra Games',
  
  // B-C Companies
  'B3', 'NPC Labs', 'Bakkt', 'Balancer Labs', 'Basecoin', 'Basis', 'BCB Group',
  'BGOGO', 'Bitaccess', 'BitDAO', 'BitGo', 'BitOasis', 'BitPesa', 'Bitso',
  'Bitstamp', 'Bittensor', 'Bitwise', 'BITB', 'ETHW', 'Blockchain.com',
  'Blockfolio', 'Bloom', 'BloXroute Labs', 'BMNR', 'Bounce Finance', 'Braavos',
  'Braintrust', 'Brave', 'BTCjam', 'Cantor Equity Partners', 'Cega', 'Celer Network',
  'Chain', 'Chainalysis', 'Chainflip', 'ChangeCoin', 'Chronicled', 'Circle',
  'Civic', 'Codex Protocol', 'CoinDCX', 'Coinme', 'Coins.ph', 'Coinsuper',
  'Computable Labs', 'Cosigned', 'Onyx', 'Cosmos Network', 'Cypherium',
  
  // D-F Companies  
  'DATA', 'DCOE', 'Definitive', 'DeSo', 'DIRT Protocol', 'DMarket', 'doc.ai',
  'Dodo Exchange', 'Earn.com', 'Earth', 'Eco', 'EDX Markets', 'Enigma', 'ErisX',
  'Ethena', 'Everclear', 'Connext', 'Expand', 'Faraway', 'Fastbreaklabs',
  'Few and Far', 'Figure', 'Filament', 'Filecoin', 'Flashbots', 'Flexa',
  'Fordefi', 'FunFair Technologies', 'Futureswap',
  
  // G-L Companies
  'Gemini', 'Genopets', 'GEODNET', 'Gifto', 'Gliph', 'GlobeDX', 'Gondi',
  'Florida St', 'Guildfi', 'Handshake', 'Harbor', 'Hedge', 'Heights Labs',
  'Helika', 'Hivemapper', 'Hyperspace', 'ICON', 'InfiniGods', 'Injective Protocol',
  'InstaDApp', 'Jambo Wallet', 'Janover', 'DDC', 'Jumbo Exchange', 'Kik',
  'Kin Ecosystem', 'Kindred', 'Kinesis.money', 'Korbit', 'Kyber Network',
  'LaunchKey', 'Leap Wallet', 'Leeway', 'Antic', 'Lido', 'Liquity',
  'Lithium Finance', 'Livepeer', 'Luda',
  
  // M-P Companies
  'M^0', 'Maecenas', 'MakersPlace', 'MarginFi Protocol', 'Maverick Protocol',
  'Merit Circle', 'Merkle Data', 'Metalend', 'Metaloop', 'Metaplex', 'Metatheory',
  'Metaverse.gg', 'Meter.io', 'Mezo', 'Mina Protocol', 'Mirror Protocol',
  'MonkeyTilt', 'Moonfrost', 'Morph', 'Morpho', 'Near Protocol', 'Nexus',
  'Nitra', 'Notional', 'Nova Labs', 'Numerai', 'Oasis Labs', 'Obol Network',
  'ODX Pte. Ltd', 'Omise', 'Omni', 'Ondo', 'OpenEdge', 'Gradient', 'OpenMind',
  'OpenToken', 'OPSkins', 'Optic', 'Orderly', 'Origin Protocol', 'Paradex',
  'Parallel', 'Perion', 'Perpetual Protocol', 'Pinata', 'Pintu', 'PLAY3',
  'Polkadot', 'Polychain Capital', 'Pontem Network', 'Potion Labs', 'PowerTrade',
  'Proof Group', 'Prysm', 'Pryze', 'PsyOptions',
  
  // Q-Z Companies
  'Quantstamp', 'Radius', 'Raiku', 'Rangers Protocol', 'Rarimo', 'Reflexer Labs',
  'Revolving Games', 'Rialo', 'Ripio', 'Ripple', 'Sahara Labs', 'SBET', 'Sender',
  'Sentient', 'ShapeShift', 'Solana Labs', 'Space Runners', 'Stacked', 'Stader Labs',
  'Staked', 'StarkWare Industries', 'Stride', 'Strike Protocol', 'Sturdy Finance',
  'Subspace Labs', 'Sumer.money', 'Summoners Arena', 'Swim', 'Symbiotic',
  'Synfutures', 'Synthetic Minds', 'Tagomi', 'TanX', 'Tari Labs', 'Teahouse',
  'Temple Capital', 'Terra', 'The Block', 'Thruster', 'ThunderCore', 'TipLink',
  'TON', 'TOP', 'Tradehill', 'TranScrypts', 'Transparent Systems', 'True Flip',
  'TruStory', 'Unbound Finance', 'Unikrn', 'Uniswap Labs', 'Unit-E',
  'Unstoppable Domains', 'UPEXI', 'Urbit', 'VALR', 'Vauld', 'Veem',
  'Vega Protocol', 'Vigil', 'Virtue Poker', 'Waterfall', 'Whetstone',
  'Wintermute', 'Worldcoin', 'Worldwide Webb', 'Wyre', 'Xapo', 'Xkit',
  'YOLOrekt', 'Zama', 'Zcash',
  
  // Major Token Symbols
  'USDC', 'SOL', 'AVAX', 'MATIC', 'COMP', 'UNI', 'LINK', 'GRT', 'DOT', 'NEAR',
  'ATOM', 'FIL', 'ARB', 'BAL', 'AUDIO', 'LPT', 'MINA', 'ZEC', 'AMPL'
]; 