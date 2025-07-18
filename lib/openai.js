import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function summarizeWithOpenAI(articles, portfolioMentions = []) {
  // Truncate articles to reduce token usage
  const truncatedArticles = articles.map(a => ({
    title: a.title,
    summary: a.summary.slice(0, 200) // Limit summary to 200 chars
  }));
  
  const formatted = truncatedArticles.map((a, i) => `${i + 1}. ${a.title} — ${a.summary}`).join('\n');
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const prompt = `Write a crypto daily brief for ${today}. Use this format:

📰 **Crypto Daily Brief – ${today}**
${portfolioMentions.length > 0 ? `
**Pantera Portfolio mentions:**
${portfolioMentions.slice(0, 3).map(p => `* ${p.title.slice(0, 80)}`).join('\n')}
` : ''}
🚀 **[Top Headline]**
[2-3 sentence summary with market implications]

🏦 **[Second Headline]**  
[2-3 sentence summary with market implications]

🌐 **[DeFi/Altcoin Focus]**
[2-3 sentence summary]

🏛️ **Regulatory & Political**
* Key government/legal developments

🤖 **AI & Crypto**
* AI-crypto partnerships/launches

🌍 **Global & Macro**
* Market movements, ETFs, regional trends

Articles:
${formatted}

Write professional analysis for institutional investors. Focus on actionable intelligence. Output only the formatted newsletter.`;

  try {
    console.log('🧠 Generating newsletter with OpenAI GPT-4...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500, // Reduced from 2000
    });

    const newsletter = completion.choices[0].message.content;
    console.log('✅ Newsletter generated successfully');
    
    return newsletter;

  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    
    // Fallback newsletter with key article highlights
    return `📰 **Crypto Daily Brief – ${today}**
${portfolioMentions.length > 0 ? `
**Portfolio companies detected:** ${portfolioMentions.slice(0, 5).map(p => p.detectedCompanies.join(', ')).join(', ')}
` : ''}
🚀 **Market Intelligence Update**
${articles.slice(0, 3).map((article, i) => 
`**${i + 1}. ${article.title}**
${article.summary.slice(0, 150)}...`
).join('\n\n')}

🏛️ **System Status**
* Newsletter generation optimized for reliability
* Manual review recommended for critical updates
* Portfolio detection: ${portfolioMentions.length} companies identified

*Automated brief with fallback content. Verify information independently.*`;
  }
} 