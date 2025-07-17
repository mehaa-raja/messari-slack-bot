import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Pantera portfolio companies for detection
const PANTERA_COMPANIES = [
  'Circle', 'USDC', 'Solana', 'SOL', 'Avalanche', 'AVAX', 'Polygon', 'MATIC',
  'Compound', 'COMP', 'Uniswap', 'UNI', 'OpenSea', 'Magic Eden', 'Chainlink',
  'LINK', 'The Graph', 'GRT', 'Polymarket', 'Biconomy', 'FTX', 'Blockdaemon',
  'Tendermint', 'Cosmos', 'ATOM'
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
[2-3 major headlines with 1-2 sentence Bloomberg-style summaries]

`;

  if (panteraMentions.length > 0) {
    prompt += `**💼 PANTERA PORTFOLIO SPOTLIGHT**
[Highlight mentions of: ${panteraMentions.map(a => a.title).join(', ')}]

`;
  }

  prompt += `**📰 OTHER NOTEWORTHY STORIES**
[Clean bullet points for remaining stories]

**Market Intelligence** • *Real-time crypto insights*

ARTICLES TO SUMMARIZE:
${articles.map((article, index) => `
${index + 1}. **${article.title}**
   ${article.content}
   Source: ${article.source}
`).join('\n')}

Requirements:
- Keep total length under 1200 characters
- Use professional, Bloomberg-style language
- Focus on market impact and institutional relevance
- Include relevant emojis for visual appeal
- No promotional language or speculation`;

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