import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Complete Pantera portfolio companies for detection
const PANTERA_COMPANIES = [
  // Major tokens/protocols
  'Circle', 'USDC', 'Solana', 'SOL', 'Avalanche', 'AVAX', 'Polygon', 'MATIC',
  'Compound', 'COMP', 'Uniswap', 'UNI', 'Chainlink', 'LINK', 'The Graph', 'GRT',
  'Polkadot', 'DOT', 'Near Protocol', 'NEAR', 'Cosmos', 'ATOM', 'Filecoin', 'FIL',
  'Arbitrum', 'ARB', 'Balancer', 'BAL', 'Audius', 'AUDIO', 'Livepeer', 'LPT',
  'Mina Protocol', 'MINA', 'Zcash', 'ZEC', 'Ampleforth', 'AMPL',
  
  // Companies and platforms
  '0x', '1inch', '1inch.exchange', '6529.io', 'Abra', 'Acala Network', 'Alchemy',
  'Altius', 'Amber Group', 'Anchor', 'Anchorage', 'Ancient8', 'Andalusia Labs',
  'Ankr', 'API3', 'Apollo', 'aPriori', 'Arcade.xyz', 'Arch Network', 'ASST',
  'Aurora', 'AutoLotto', 'Avantis', 'Azra Games', 'B3', 'NPC Labs', 'Bakkt',
  'Balancer Labs', 'Basecoin', 'Basis', 'BCB Group', 'BGOGO', 'Bitaccess',
  'BitDAO', 'BitGo', 'BitOasis', 'BitPesa', 'Bitso', 'Bitstamp', 'Bittensor',
  'Bitwise', 'BITB', 'ETHW', 'Blockchain.com', 'Blockfolio', 'Bloom',
  'BloXroute Labs', 'BMNR', 'Bounce Finance', 'Braavos', 'Braintrust', 'Brave',
  'BTCjam', 'Cantor Equity Partners', 'Cega', 'Celer Network', 'Chain',
  'Chainalysis', 'Chainflip', 'ChangeCoin', 'Chronicled', 'Civic', 'Codex Protocol',
  'CoinDCX', 'Coinme', 'Coins.ph', 'Coinsuper', 'Computable Labs', 'Cosigned',
  'Onyx', 'Cosmos Network', 'Cypherium', 'DATA', 'DCOE', 'Definitive', 'DeSo',
  'DIRT Protocol', 'DMarket', 'doc.ai', 'Dodo Exchange', 'Earn.com', 'Earth',
  'Eco', 'EDX Markets', 'Enigma', 'ErisX', 'Ethena', 'Everclear', 'Connext',
  'Expand', 'Faraway', 'Fastbreaklabs', 'Few and Far', 'Figure', 'Filament',
  'Flashbots', 'Flexa', 'Fordefi', 'FunFair Technologies', 'Futureswap', 'Gemini',
  'Genopets', 'GEODNET', 'Gifto', 'Gliph', 'GlobeDX', 'Gondi', 'Florida St',
  'Guildfi', 'Handshake', 'Harbor', 'Hedge', 'Heights Labs', 'Helika', 'Hivemapper',
  'Hyperspace', 'ICON', 'InfiniGods', 'Injective Protocol', 'InstaDApp',
  'Jambo Wallet', 'Janover', 'DDC', 'Jumbo Exchange', 'Kik', 'Kin Ecosystem',
  'Kindred', 'Kinesis.money', 'Korbit', 'Kyber Network', 'LaunchKey', 'Leap Wallet',
  'Leeway', 'Antic', 'Lido', 'Liquity', 'Lithium Finance', 'Luda', 'M^0',
  'Maecenas', 'MakersPlace', 'MarginFi Protocol', 'Maverick Protocol', 'Merit Circle',
  'Merkle Data', 'Metalend', 'Metaloop', 'Metaplex', 'Metatheory', 'Metaverse.gg',
  'Meter.io', 'Mezo', 'Mirror Protocol', 'MonkeyTilt', 'Moonfrost', 'Morph',
  'Morpho', 'Nexus', 'Nitra', 'Notional', 'Nova Labs', 'Numerai', 'Oasis Labs',
  'Obol Network', 'ODX Pte. Ltd', 'Omise', 'Omni', 'Ondo', 'OpenEdge', 'Gradient',
  'OpenMind', 'OpenToken', 'OPSkins', 'Optic', 'Orderly', 'Origin Protocol',
  'Paradex', 'Parallel', 'Perion', 'Perpetual Protocol', 'Pinata', 'Pintu',
  'PLAY3', 'Polychain Capital', 'Pontem Network', 'Potion Labs', 'PowerTrade',
  'Proof Group', 'Prysm', 'Pryze', 'PsyOptions', 'Quantstamp', 'Radius', 'Raiku',
  'Rangers Protocol', 'Rarimo', 'Reflexer Labs', 'Revolving Games', 'Rialo',
  'Ripio', 'Ripple', 'Sahara Labs', 'SBET', 'Sender', 'Sentient', 'ShapeShift',
  'Solana Labs', 'Space Runners', 'Stacked', 'Stader Labs', 'Staked', 'StarkWare',
  'StarkWare Industries', 'Stride', 'Strike Protocol', 'Sturdy Finance', 'Subspace Labs',
  'Sumer.money', 'Summoners Arena', 'Swim', 'Symbiotic', 'Synfutures', 'Synthetic Minds',
  'Tagomi', 'TanX', 'Tari Labs', 'Teahouse', 'Temple Capital', 'Terra', 'The Block',
  'Thruster', 'ThunderCore', 'TipLink', 'TON', 'TOP', 'Tradehill', 'TranScrypts',
  'Transparent Systems', 'True Flip', 'TruStory', 'Unbound Finance', 'Unikrn',
  'Uniswap Labs', 'Unit-E', 'Unstoppable Domains', 'UPEXI', 'Urbit', 'VALR',
  'Vauld', 'Veem', 'Vega Protocol', 'Vigil', 'Virtue Poker', 'Waterfall', 'Whetstone',
  'Wintermute', 'Worldcoin', 'Worldwide Webb', 'Wyre', 'Xapo', 'Xkit', 'YOLOrekt',
  'Zama',
  
  // Common abbreviations and alternative names
  'OpenSea', 'Magic Eden', 'Polymarket', 'FTX', 'Blockdaemon', 'Tendermint',
  'Biconomy', 'StarkNet', 'Starknet', 'zkSync', 'Optimism', 'Base'
];

export async function summarizeWithOpenAI(articles) {
  if (!articles || articles.length === 0) {
    return generateFallbackSummary();
  }

  try {
    console.log(`🧠 Processing ${articles.length} articles with OpenAI...`);

    // Detect Pantera mentions
    const panteraMentions = articles.filter(article => {
      const text = `${article.title} ${article.content}`.toLowerCase();
      return PANTERA_COMPANIES.some(company => 
        text.includes(company.toLowerCase())
      );
    });

    const prompt = createSummaryPrompt(articles, panteraMentions);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional crypto market analyst creating daily briefings for institutional investors. Write in a Bloomberg News style - concise, authoritative, and focused on market impact."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.3
    });

    const summary = completion.choices[0].message.content;
    console.log(`✅ Generated ${summary.length} character summary`);
    
    return summary;

  } catch (error) {
    console.error('❌ OpenAI error:', error.message);
    throw error;
  }
}

function createSummaryPrompt(articles, panteraMentions) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let prompt = `Create a professional crypto daily brief for ${dateStr}. Format as follows:

**📈 CRYPTO DAILY BRIEF**
*${dateStr}*

**🚀 TOP STORIES**
[2-3 major headlines with 1-2 sentence Bloomberg-style summaries focusing on market impact]

`;

  if (panteraMentions.length > 0) {
    // Extract unique company names mentioned
    const mentionedCompanies = new Set();
    panteraMentions.forEach(article => {
      const text = `${article.title} ${article.content}`.toLowerCase();
      PANTERA_COMPANIES.forEach(company => {
        if (text.includes(company.toLowerCase())) {
          mentionedCompanies.add(company);
        }
      });
    });

    prompt += `**💼 PANTERA PORTFOLIO SPOTLIGHT**
[Portfolio companies mentioned: ${Array.from(mentionedCompanies).slice(0, 5).join(', ')}${mentionedCompanies.size > 5 ? ' +more' : ''}]
${panteraMentions.slice(0, 2).map(article => `• ${article.title}`).join('\n')}

`;
  }

  prompt += `**📰 OTHER NOTEWORTHY STORIES**
[Clean bullet points for remaining significant stories]

**Market Intelligence** • *Real-time crypto insights*

ARTICLES TO SUMMARIZE:
${articles.map((article, index) => `
${index + 1}. **${article.title}**
   Content: ${article.content ? article.content.substring(0, 300) : 'No content'}...
   Source: ${article.source || 'Unknown'}
   Published: ${article.publishedAt || 'Recent'}
`).join('\n')}

PORTFOLIO DETECTION CONTEXT:
${panteraMentions.length > 0 ? 
  `Found ${panteraMentions.length} articles mentioning Pantera portfolio companies. Highlight these prominently in the Portfolio Spotlight section.` : 
  'No direct portfolio company mentions detected in headlines.'
}

Requirements:
- Keep total length under 1200 characters for Slack compatibility
- Use professional, Bloomberg News institutional language
- Focus on market impact, regulatory developments, and institutional relevance
- Highlight Pantera portfolio companies prominently when mentioned
- Include relevant emojis for visual appeal and section clarity
- Prioritize breaking news and significant market movements
- No promotional language, speculation, or price predictions
- If limited content, focus on what's available and note data limitations`;

  return prompt;
}

function generateFallbackSummary() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `📈 **CRYPTO DAILY BRIEF**
*${dateStr}*

⚠️ **Data Collection Notice**
Unable to fetch real-time news data. Please check:
• Network connectivity
• API rate limits
• Service availability

🔄 **System Status**
Bot is operational and monitoring for updates.

📊 **Market Intelligence** • *Automated crypto insights*
*Next update in 1 hour*`;
} 