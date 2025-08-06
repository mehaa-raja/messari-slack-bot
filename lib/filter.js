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
  'Sturdy Finance', 'Subspace Labs', 'Subzero Labs', 'Sumer.money', 'Summoners Arena', 'Swim', 'Symbiotic', 
  'Synfutures', 'Synthetic Minds', 'Tagomi', 'TanX', 'Tari Labs', 'Teahouse', 'Temple Capital', 
  'Terra', 'The Block', 'Thruster', 'ThunderCore', 'TipLink', 'TON', 'TOP', 'Tradehill', 
  'TranScrypts', 'Transparent Systems', 'True Flip', 'TruStory', 'Unbound Finance', 'Unikrn', 
  'Uniswap Labs', 'Unit-E', 'Unstoppable Domains', 'UPEXI', 'Urbit', 'VALR', 'Vauld', 'Veem',
  'Vega Protocol', 'Vigil', 'Virtue Poker', 'Waterfall', 'Whetstone', 'Wintermute', 'Worldcoin', 
  'Worldwide Webb', 'Wyre', 'Xapo', 'Xkit', 'YOLOrekt', 'Zama', 'Zcash'
];

// Parse content into individual article sections
function parseArticleSections(rawContent) {
  const articles = [];
  
  // Split by various section patterns
  const sectionPatterns = [
    /^#{1,3}\s+\d+\.\s+(.+?)$/gm,  // ### 1. Title format
    /^#{1,3}\s+(.+?)$/gm,          // ### Title format
    /^\*\*(\d+\.\s+.+?)\*\*$/gm,   // **1. Title** format
    /^(\d+\.\s+.+?)$/gm            // 1. Title format
  ];
  
  // Try to find section breaks and extract articles
  const lines = rawContent.split('\n');
  let currentArticle = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line looks like an article title
    const isTitleLine = sectionPatterns.some(pattern => {
      const match = line.match(pattern.source);
      return match && match[0] === line;
    });
    
    if (isTitleLine && line.length > 20) {
      // Save previous article if exists
      if (currentArticle && currentArticle.title) {
        articles.push(currentArticle);
      }
      
      // Start new article
      currentArticle = {
        title: line.replace(/^#{1,3}\s*|\*\*|\*$/g, '').trim(),
        content: '',
        fullText: line
      };
    } else if (currentArticle && line.length > 10) {
      // Add content to current article
      currentArticle.content += line + ' ';
      currentArticle.fullText += '\n' + line;
    }
  }
  
  // Add the last article
  if (currentArticle && currentArticle.title) {
    articles.push(currentArticle);
  }
  
  // Filter to get substantial articles (title + meaningful content)
  const substantialArticles = articles.filter(article => 
    article.title.length > 15 && 
    article.content.length > 50 &&
    !article.title.toLowerCase().includes('crypto daily brief') &&
    !article.title.toLowerCase().includes('market overview')
  );
  
  console.log(`📄 Parsed ${substantialArticles.length} substantial articles from content`);
  substantialArticles.forEach((article, i) => {
    console.log(`  ${i + 1}. "${article.title.substring(0, 60)}..."`);
  });
  
  return substantialArticles;
}

// Identify main companies/projects mentioned in an article
function identifyMainSubjects(article, portfolioList) {
  const { title, content, fullText } = article;
  const combinedText = `${title} ${content}`.toLowerCase();
  const mainSubjects = [];
  
  for (const company of portfolioList) {
    const lowerCompany = company.toLowerCase();
    
    // Skip common false positives
    if (isLikelyFalsePositive(company, combinedText)) {
      continue;
    }
    
    // Create flexible regex that matches base company name
    // Extract base name by removing common suffixes
    const baseName = company.replace(/\s+(Labs?|Protocol|Network|Group|Finance|Technologies?|Industries|Capital|Exchange|Wallet)$/i, '').trim();
    
    // Create regex for both full name and base name matching
    const fullNameRegex = new RegExp(`\\b${company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`, 'gi');
    const baseNameRegex = new RegExp(`\\b${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`, 'gi');
    
    // Check if company appears in title (strong signal of main subject)
    const titleMatches = title.match(fullNameRegex) || title.match(baseNameRegex);
    if (titleMatches) {
      // Check if company is the main actor, not just platform/infrastructure
      if (!isPassiveMention(title, content, baseName)) {
        mainSubjects.push({
          company,
          confidence: 'high',
          reason: 'mentioned in title',
          context: title
        });
        console.log(`🎯 ${company} (matched as "${baseName}") identified as main subject in title: "${title.substring(0, 80)}..."`);
      } else {
        console.log(`🚫 ${company} in title but passive mention: "${title.substring(0, 80)}..."`);
      }
      continue;
    }
    
    // Check if company appears in first sentence (secondary signal)
    const firstSentence = content.split(/[.!?]/)[0];
    const firstSentenceMatches = firstSentence.match(fullNameRegex) || firstSentence.match(baseNameRegex);
    if (firstSentenceMatches && !isPassiveMention(firstSentence, content, baseName)) {
      mainSubjects.push({
        company,
        confidence: 'medium',
        reason: 'mentioned in first sentence',
        context: firstSentence
      });
      console.log(`📍 ${company} (matched as "${baseName}") identified as subject in first sentence`);
      continue;
    }
    
    // NEW: Check if company appears with meaningful action verbs anywhere in content
    const contentMatches = content.match(fullNameRegex) || content.match(baseNameRegex);
    if (contentMatches && !isPassiveMention(title, content, baseName)) {
      // Look for meaningful action patterns around the company mention
      const actionPatterns = [
        new RegExp(`\\b${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(announced|launched|unveiled|introduced|deployed|released|secured|raised|partnered|acquired|completed|signed)`, 'gi'),
        new RegExp(`\\b(announced|launched|unveiled|introduced|deployed|released|secured|raised|partnered|acquired|completed|signed)\\s+[^.]*?\\b${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi'),
        new RegExp(`\\b${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(raised|secured|closed)\\s+[^.]*?(funding|investment|round)`, 'gi')
      ];
      
      const hasActionPattern = actionPatterns.some(pattern => pattern.test(content));
      if (hasActionPattern) {
        // Find the sentence containing the company mention
        const sentences = content.split(/[.!?]+/);
        const companySentence = sentences.find(sentence => 
          sentence.match(fullNameRegex) || sentence.match(baseNameRegex)
        );
        
        mainSubjects.push({
          company,
          confidence: 'medium',
          reason: 'mentioned with meaningful action',
          context: companySentence ? companySentence.trim() : content.substring(0, 200)
        });
        console.log(`⚡ ${company} (matched as "${baseName}") identified via meaningful action pattern`);
      }
    }
  }
  
  return mainSubjects;
}

// Check if company mention is passive (e.g., "builds on TON", "uses Ethereum")
function isPassiveMention(title, content, baseName) {
  const combinedText = `${title} ${content}`.toLowerCase();
  const lowerBaseName = baseName.toLowerCase();
  
  // Patterns that indicate passive/infrastructure usage - more precise matching
  const passivePatterns = [
    new RegExp(`\\b(builds?|built)\\s+on\\s+${lowerBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
    new RegExp(`\\b(uses?|using|utilized?)\\s+${lowerBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
    new RegExp(`\\b(powered|supported)\\s+by\\s+${lowerBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
    new RegExp(`\\b(deployed|launched)\\s+on\\s+${lowerBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
    new RegExp(`\\b(validator|contract|dapp|application|token)\\s+on\\s+${lowerBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
    new RegExp(`\\b${lowerBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(blockchain|network|chain)(?!\\s+(launched|deployed|announced))`, 'i'),
    // More precise infrastructure pattern - only within 50 characters
    new RegExp(`\\b(platform|ecosystem|infrastructure)\\s+.{0,50}?\\b${lowerBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
    new RegExp(`\\b${lowerBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+.{0,50}?\\b(platform|ecosystem|infrastructure)\\b`, 'i')
  ];
  
  return passivePatterns.some(pattern => pattern.test(combinedText));
}

// Generate meaningful summary for a portfolio company's activity
function generateCompanySummary(article, company) {
  const { title, content } = article;
  const combinedText = `${title} ${content}`;
  
  // Extract base name for matching
  const baseName = company.replace(/\s+(Labs?|Protocol|Network|Group|Finance|Technologies?|Industries|Capital|Exchange|Wallet)$/i, '').trim();
  
  // Find the sentence(s) containing the company mention for context
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const companyRegex = new RegExp(`\\b${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
  
  // Find all sentences mentioning the company
  const companySentences = sentences.filter(sentence => companyRegex.test(sentence));
  
  // Get surrounding context (previous and next sentences)
  const getDetailedContext = () => {
    for (let i = 0; i < sentences.length; i++) {
      if (companyRegex.test(sentences[i])) {
        const contextSentences = [];
        // Add previous sentence for context
        if (i > 0) contextSentences.push(sentences[i - 1].trim());
        // Add the main sentence
        contextSentences.push(sentences[i].trim());
        // Add next sentence for additional details
        if (i < sentences.length - 1) contextSentences.push(sentences[i + 1].trim());
        
        return contextSentences.join('. ').trim();
      }
    }
    return companySentences.join('. ').trim();
  };
  
  const detailedContext = getDetailedContext();
  
  // Enhanced action patterns that capture more context
  const enhancedActionPatterns = [
    // Funding patterns with amounts and details
    { 
      pattern: new RegExp(`${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?(?:raised|secured|closed|completed)\\s+([^.]*?)(?:funding|investment|round)([^.]*?)`, 'gi'),
      template: (match) => {
        const details = match[0];
        // Extract amount if present
        const amountMatch = details.match(/\$[\d.]+[BMK]?/gi);
        const amount = amountMatch ? amountMatch[0] : '';
        // Extract round type
        const roundMatch = details.match(/(seed|series [a-z][\d]*|pre-seed|strategic)/gi);
        const roundType = roundMatch ? roundMatch[0] : 'funding round';
        return amount ? `raised ${amount} ${roundType}` : `completed ${roundType}`;
      }
    },
    
    // Acquisition patterns with amounts
    { 
      pattern: new RegExp(`(?:acquired|bought|purchased).*?${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?(?:for|worth)?\\s*(\\$[\\d.]+[BMK]?)?`, 'gi'),
      template: (match) => {
        const amount = match[1] || '';
        return amount ? `was acquired for ${amount}` : 'was acquired';
      }
    },
    
    // Partnership patterns with details
    { 
      pattern: new RegExp(`${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?(?:partnered|collaborated|signed)\\s+(?:with|an?)\\s+([^.]*?)(?:to|for|enabling|providing)([^.]*?)`, 'gi'),
      template: (match) => `partnered with ${(match[1] || '').trim()} to ${(match[2] || 'collaborate').trim().toLowerCase()}`
    },
    
    // Product/Protocol launches with details
    { 
      pattern: new RegExp(`${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?(?:launched|unveiled|introduced|released)\\s+([^.]*?)(?:protocol|platform|product|feature|token|network)?([^.]*?)`, 'gi'),
      template: (match) => {
        const product = (match[1] || '').trim();
        const details = match[2] ? match[2].trim() : '';
        return `launched ${product}${details ? ` ${details}` : ''}`;
      }
    },
    
    // Deployment patterns with technical details
    { 
      pattern: new RegExp(`${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*?deployed\\s+([^.]*?)(?:on|to)\\s+([^.]*?)`, 'gi'),
      template: (match) => `deployed ${(match[1] || 'upgrade').trim()} on ${(match[2] || 'platform').trim()}`
    }
  ];
  
  // Try enhanced patterns first
  for (const { pattern, template } of enhancedActionPatterns) {
    const match = detailedContext.match(pattern);
    if (match) {
      const summary = template(match);
      const cleanedSummary = cleanupSummary(summary, baseName);
      // Return both the action and the context for rich formatting
      return {
        action: cleanedSummary,
        context: detailedContext,
        headline: extractHeadline(article, company, cleanedSummary)
      };
    }
  }
  
  // Fallback to original patterns if enhanced ones don't match
  const actionPatterns = [
    { 
      pattern: /(?:raised|secured|closed|completed)\s+([^.]*?)(?:funding|investment|round)/i,
      template: (match) => `raised ${match[1].trim()} funding`
    },
    { 
      pattern: /(?:launched|unveiled|introduced|released)\s+([^.]*?)(?:protocol|platform|product|feature|token|network)/i,
      template: (match) => `launched ${match[1].trim()}`
    },
    { 
      pattern: /(?:deployed)\s+([^.]*?)(?:on|to)/i,
      template: (match) => `deployed ${match[1].trim()}`
    },
    { 
      pattern: /(?:partnered|collaborated)\s+with\s+([^.]*?)(?:to|for|in)/i,
      template: (match) => `partnered with ${match[1].trim()}`
    }
  ];
  
  for (const { pattern, template } of actionPatterns) {
    const match = combinedText.match(pattern);
    if (match) {
      const summary = template(match);
      const cleanedSummary = cleanupSummary(summary, baseName);
      return {
        action: cleanedSummary,
        context: detailedContext,
        headline: extractHeadline(article, company, cleanedSummary)
      };
    }
  }
  
  // Ultimate fallback
  return {
    action: 'involved in significant crypto market development',
    context: detailedContext,
    headline: `${company} Makes Strategic Move`
  };
}

// Helper function to extract a compelling headline
function extractHeadline(article, company, action) {
  const { title, content } = article;
  const baseName = company.replace(/\s+(Labs?|Protocol|Network|Group|Finance|Technologies?|Industries|Capital|Exchange|Wallet)$/i, '').trim();
  
  // If company is in the title, use a variation of the title
  if (title.toLowerCase().includes(baseName.toLowerCase())) {
    return title.replace(/^\d+\.\s*/, '').trim();
  }
  
  // Generate headline based on action
  if (action.includes('raised') && action.includes('funding')) {
    const amountMatch = action.match(/\$[\d.]+[BMK]?/);
    const amount = amountMatch ? amountMatch[0] : '';
    return `${company} Raises ${amount} Funding Round`;
  }
  
  if (action.includes('launched')) {
    const productMatch = action.match(/launched\s+([^,]+)/i);
    const product = productMatch ? productMatch[1].trim() : 'New Product';
    return `${company} Launches ${product}`;
  }
  
  if (action.includes('partnered')) {
    return `${company} Announces Strategic Partnership`;
  }
  
  if (action.includes('deployed')) {
    return `${company} Deploys Protocol Upgrade`;
  }
  
  if (action.includes('acquired')) {
    return `${company} Completes Major Acquisition`;
  }
  
  // Generic fallback
  return `${company} Reports Major Development`;
}

// Enhanced cleanup function for summaries
function cleanupSummary(summary, baseName) {
  let cleaned = summary
    // Remove footnote citations
    .replace(/\[\^\d+\]/g, '')
    // Remove vague phrases
    .replace(/highlighting?\s+importance/gi, '')
    .replace(/demonstrates?\s+growth/gi, '')
    .replace(/shows?\s+potential/gi, '')
    .replace(/indicates?\s+progress/gi, '')
    .replace(/reflects?\s+expansion/gi, '')
    // Remove redundant company mentions (both base name and with common suffixes)
    .replace(new RegExp(`\\b${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(Labs?|Protocol|Network|Group|Finance|Technologies?|Industries|Capital|Exchange|Wallet)s?\\b`, 'gi'), '')
    .replace(new RegExp(`\\b${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`, 'gi'), '')
    // Remove markdown artifacts
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Clean up extra spaces and punctuation
    .replace(/\s{2,}/g, ' ')
    .replace(/^[,\s:\-\.]+|[,\s:\-\.]+$/g, '')
    .trim();
  
  // Ensure it starts with a lowercase letter (since it follows "Company: ")
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }
  
  // Add fallback if summary is too short or empty
  if (cleaned.length < 10) {
    cleaned = 'made significant business developments';
  }
  
  return cleaned;
}

// Helper function to filter out false positives
function isLikelyFalsePositive(company, text) {
  const lowerText = text.toLowerCase();
  const lowerCompany = company.toLowerCase();
  
  // Common false positive patterns
  const falsePositivePatterns = {
    'chain': ['on-chain', 'off-chain', 'cross-chain', 'side-chain', 'blockchain', 'supply chain'],
    'ton': ['button', 'skeleton', 'washington', 'cotton', 'bottom'],
    'data': ['metadata', 'database'],
    'top': ['laptop', 'desktop', 'stop', 'cryptocurrency', 'top 5', 'top 10', 'top-ups', 'top-up', 'on top', 'crypto top'],
    'expand': ['to expand', 'will expand', 'can expand', 'expand defi', 'expand into', 'expand their', 'expand its', 'expand on'],
    'harbor': ['harbor freight', 'safe harbor']
  };
  
  if (falsePositivePatterns[lowerCompany]) {
    for (const pattern of falsePositivePatterns[lowerCompany]) {
      if (lowerText.includes(pattern)) {
        console.log(`🚫 Filtering out ${company} - likely false positive from "${pattern}"`);
        return true;
      }
    }
  }
  
  return false;
}

// Helper function to detect price-only news
function isPriceOnlyNews(title, content, company) {
  const combinedText = `${title} ${content}`.toLowerCase();
  
  // Strong price-only indicators - expanded for portfolio news
  const priceOnlyPatterns = [
    /\b(price|token|coin)\s+(up|down|rises?|falls?|gains?|loses?)\s+\d+[\d.,]*%/i,
    /\b(surged?|rallied?|dropped?|plunged?|jumped?)\s+\d+[\d.,]*%/i,
    /\b\d+[\d.,]*%\s+(gain|loss|increase|decrease|rally|surge)/i,
    /\btop\s+(gainer|loser|performer)s?\b/i,
    /\bmarket\s+(cap|performance|value)\s+(hits?|reaches?)/i,
    /\btrading\s+(volume|activity)\s+(up|down|increases?|decreases?)/i,
    /\btechnical\s+(analysis|breakout|support|resistance)/i,
    /\b(bullish|bearish)\s+(momentum|sentiment|trend)/i,
    // Additional patterns for portfolio news filtering
    /\bposts?\s+\d+[\d.,]*%\s+(gain|return)/i,
    /\bup\s+\d+[\d.,]*%/i,
    /\bdown\s+\d+[\d.,]*%/i,
    /\bgained?\s+\d+[\d.,]*%/i,
    /\bincreased?\s+\d+[\d.,]*%/i,
    /\bvolume-backed\s+breakout/i,
    /\boutperforms?\s+with\s+\d+[\d.,]*%/i
  ];
  
  // Check if it's mainly about price movement
  const hasPricePattern = priceOnlyPatterns.some(pattern => pattern.test(combinedText));
  
  // Look for meaningful business content - if none found, likely price-only
  const businessPatterns = [
    /\b(launch|announce|partnership|funding|raised?|investment|acquisition|merge)/i,
    /\b(integration|protocol|platform|feature|product|service)/i,
    /\b(regulatory|approval|compliance|license|exempt)/i,
    /\b(hiring|layoffs?|appointed?|strategic|governance)/i
  ];
  
  const hasBusinessContent = businessPatterns.some(pattern => pattern.test(combinedText));
  
  if (hasPricePattern && !hasBusinessContent) {
    console.log(`📈 Filtering out ${company} - appears to be price-only news`);
    return true;
  }
  
  return false;
}

// Helper function to detect "no developments" content
function isNoNewsContent(title, content, company) {
  const combinedText = `${title} ${content}`.toLowerCase();
  
  const noNewsPatterns = [
    /\bno\s+(major|significant|new)\s+(developments?|news|updates?)/i,
    /\bshow\s+no\s+major\s+new\s+developments?/i,
    /\bno\s+major\s+new\s+developments?\s+reported/i,
    /\bno\s+significant\s+(activity|news|updates?)/i,
    /\bmaintains?\s+(current|existing)\s+position/i,
    /\bcontinues?\s+without\s+major\s+changes?/i
  ];
  
  const hasNoNewsPattern = noNewsPatterns.some(pattern => pattern.test(combinedText));
  
  if (hasNoNewsPattern) {
    console.log(`📭 Filtering out ${company} - no developments content detected`);
    return true;
  }
  
  return false;
}

// AI-powered validation to determine if a company mention is meaningful
async function validateCompanyMentionWithAI(article, company, context) {
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  No OpenAI key - using pattern-based validation');
    return true; // Fallback to existing logic
  }

  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Analyze this crypto news snippet and determine if "${company}" is the main actor taking meaningful business action, or just passively mentioned.

ARTICLE CONTEXT:
Title: ${article.title}
Content: ${context}

QUESTION: Is "${company}" the main subject performing a meaningful business action?

Consider MEANINGFUL if the company is:
- Raising funds, securing investment, or announcing funding (e.g., "$20M raise", "Series A")
- Launching products, services, or protocols
- Forming partnerships or strategic alliances
- Making acquisitions or being acquired
- Experiencing regulatory changes (approvals, exemptions, compliance)
- Making corporate decisions (layoffs, restructuring, appointments)
- Having significant governance or operational updates
- Being featured prominently in major crypto ecosystem developments
- Featured in the headline/title of the news story about a business development
- The main subject of the article doing something newsworthy

Consider PASSIVE if:
- Only mentioned as underlying infrastructure/platform (e.g., "built on Ethereum")
- Just background context or casual mention
- Validator/node operator activities on their network

Consider PRICE_ONLY if:
- Only about token price movements, percentage gains/losses, or trading volume
- Market cap discussions without business developments
- Technical analysis or chart patterns
- "Price surged", "token rallied", "market performance" without business news
- Daily price updates or trading metrics

RESPOND WITH ONLY:
- "MEANINGFUL" if ${company} is the main actor doing something significant
- "PASSIVE" if ${company} is just mentioned as infrastructure or background  
- "PRICE_ONLY" if it's only about price/trading activity without business context

Examples:
- "OpenMind raises $20M from Pi Network" → MEANINGFUL (funding round)
- "Rialo announces blockchain for dApps" → MEANINGFUL (product announcement)
- "SEC exempts Lido from securities laws" → MEANINGFUL (regulatory development)
- "Injective Protocol launches new feature" → MEANINGFUL (product launch)
- "Token launches on Ethereum blockchain" → PASSIVE (Ethereum just infrastructure)
- "Bitcoin price rises 5%" → PRICE_ONLY
- "ONDO token up 1.67% after developments" → PRICE_ONLY (unless developments are detailed)
- "Ondo Finance announces new tokenization platform" → MEANINGFUL (product announcement)
- "Circle partners with JPMorgan Chase" → MEANINGFUL (strategic partnership)
- "Subzero Labs secures Pantera funding" → MEANINGFUL (funding/investment)

Your answer:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Faster and cheaper for this validation task
      messages: [{ role: "user", content: prompt }],
      max_tokens: 20,
      temperature: 0.1 // Low temperature for consistent classification
    });

    const result = response.choices[0].message.content.trim().toUpperCase();
    
    if (result === 'MEANINGFUL') {
      console.log(`🤖 AI confirmed: ${company} is taking meaningful action`);
      return true;
    } else {
      console.log(`🤖 AI filtered out: ${company} - reason: ${result}`);
      return false;
    }

  } catch (error) {
    console.log(`⚠️  AI validation failed for ${company}: ${error.message} - using fallback`);
    return true; // Fallback to existing pattern-based logic on error
  }
}

// Main function: Detect portfolio highlights using article-by-article analysis
export async function detectPortfolioMentionsInText(rawContent, portfolioList = PANTERA_PORTFOLIO_COMPANIES) {
  console.log('📰 Starting article-by-article portfolio analysis...');
  
  // Step 1: Parse content into individual article sections
  const articles = parseArticleSections(rawContent);
  
  if (articles.length === 0) {
    console.log('⚠️ No articles found to analyze');
    return [];
  }
  
  const portfolioHighlights = [];
  
  // Step 2: Analyze each article for main subjects
  for (const article of articles) {
    console.log(`\n🔍 Analyzing: "${article.title.substring(0, 60)}..."`);
    
    // Step 3: Identify main subjects in this article
    const mainSubjects = identifyMainSubjects(article, portfolioList);
    
    if (mainSubjects.length === 0) {
      console.log(`   No portfolio companies as main subjects`);
      continue;
    }
    
    // Step 4: Generate summaries for valid portfolio companies
    for (const subject of mainSubjects) {
      const { company, confidence, reason } = subject;
      
      // Generate meaningful summary (now returns rich object)
      const summaryData = generateCompanySummary(article, company);
      
      // Handle both old string format and new object format
      const actionSummary = typeof summaryData === 'string' ? summaryData : summaryData.action;
      
      // Pre-filter: Skip obvious price-only news before AI validation
      if (isPriceOnlyNews(article.title, article.content, company)) {
        console.log(`   📈 ${company} skipped - price-only news detected`);
        continue;
      }
      
      // Pre-filter: Skip "no developments" content
      if (isNoNewsContent(article.title, article.content, company)) {
        console.log(`   📭 ${company} skipped - no developments content detected`);
        continue;
      }
      
      // AI-powered validation step (for remaining candidates)
      const contextForAI = typeof summaryData === 'object' ? summaryData.context : article.content.substring(0, 400);
      const isValidMention = await validateCompanyMentionWithAI(article, company, contextForAI);
      
      if (isValidMention) {
          portfolioHighlights.push({
            company,
            summary: typeof summaryData === 'object' ? summaryData : `${company}: ${actionSummary}`,
            confidence,
            reason,
            article: article.title,
            context: typeof summaryData === 'object' ? summaryData.context : article.content.substring(0, 200)
          });
          
          console.log(`   ✅ ${company} (${confidence}): ${actionSummary}`);
        } else {
          console.log(`   🚫 ${company} filtered out by AI validation`);
        }
    }
  }
  
  // Step 5: Return top 3-5 most relevant highlights
  const topHighlights = portfolioHighlights
    .sort((a, b) => {
      // Prioritize high confidence over medium
      if (a.confidence !== b.confidence) {
        return a.confidence === 'high' ? -1 : 1;
      }
      return 0;
    })
    .slice(0, 5);
  
  console.log(`\n💎 Final portfolio highlights: ${topHighlights.length} companies`);
  topHighlights.forEach((highlight, i) => {
    if (typeof highlight.summary === 'object') {
      console.log(`  ${i + 1}. ${highlight.summary.headline} (${highlight.confidence} confidence)`);
    } else {
      console.log(`  ${i + 1}. ${highlight.summary} (${highlight.confidence} confidence)`);
    }
  });
  
  return topHighlights;
}

// Check if the action represents meaningful business activity
function isMeaningfulBusinessAction(article, summary) {
  const lowerSummary = summary.toLowerCase();
  const lowerContent = `${article.title} ${article.content}`.toLowerCase();
  
  // Exclude price-only movements
  const priceOnlyPatterns = [
    /\b(price|token|coin)\s+(fell|dropped|declined|down|decreased)/i,
    /\b(fell|dropped|declined|down|decreased)\s+\d+%/i,
    /\bdue to\s+(market|selling|pressure|conditions)/i,
    /\bmarket\s+(volatility|conditions|movement)/i
  ];
  
  for (const pattern of priceOnlyPatterns) {
    if (pattern.test(lowerSummary) || pattern.test(lowerContent)) {
      return false;
    }
  }
  
  // Check for meaningful business actions
  const meaningfulActions = [
    'raised', 'secured', 'funding', 'investment', 'launched', 'unveiled',
    'partnered', 'acquired', 'announced', 'introduced', 'developed',
    'integrated', 'upgraded', 'released', 'completed', 'signed', 'deployed',
    'laid off', 'layoffs', 'restructured', 'restructuring', 'merger', 'partnership',
    'expansion', 'expands', 'collaboration', 'strategic', 'appointed', 'hiring'
  ];
  
  return meaningfulActions.some(action => lowerSummary.includes(action) || lowerContent.includes(action));
}