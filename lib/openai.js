import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function formatNewsWithOpenAI(rawNewsContent) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  try {
    console.log('🧠 Formatting news brief with OpenAI GPT-4...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional newsletter formatter. Take the provided crypto news content and format it into a clean, well-structured Slack-friendly newsletter. 

Format the user's raw crypto news content into the following layout, exactly:
- Start with the line: ":newspaper: Crypto Daily Brief – ${today}"
- Use section headers with emojis (e.g., ":chart_with_upwards_trend: Market Overview", ":books: Top Stories")
- Use paragraph-style summaries, not just bullet points. Keep them concise and info-rich.
- For Top Stories, number each story (1., 2., 3., etc.) and use bolded titles (no asterisks or markdown), followed by short paragraphs per item
- Use short paragraphs or bullet-like lines (with dashes) under Notable Events & Listings
- Keep emojis only in section titles — do NOT include emojis in the content itself
- Use *bold* for titles and headings
- Make it sound like a human-written newsletter (like Messari or Bloomberg), not an AI or bot
- Prioritize institutional, regulatory, and infrastructure-focused summaries over fluff
- Ensure tone is professional, engaging, and actionable — with proper punctuation and formatting
- Include a final section titled “Summary:” with 2–3 clean sentences that synthesize the day’s themes
- Keep the full output to a ~3–5 minute read (~400–700 words)


Make the content visually appealing and easy to scan while maintaining all important information.`
        },
        {
          role: "user",
          content: `Please format this crypto news content for a professional daily newsletter:\n\n${rawNewsContent}`
        }
      ],
      max_tokens: 4000,
      temperature: 0.7
    });

    const formattedContent = response.choices[0].message.content.trim();
    console.log(`✅ OpenAI formatted content: ${formattedContent.length} characters`);
    
    return formattedContent;
    
  } catch (error) {
    console.log(`❌ OpenAI formatting error: ${error.message}`);
    
    // Fallback: Return original content with basic formatting
    return `📰 *Crypto Daily Brief – ${today}*\n\n${rawNewsContent}`;
  }
}

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

📰 *Crypto Daily Brief – ${today}*
${portfolioMentions.length > 0 ? `
*Pantera Portfolio mentions:*
${portfolioMentions.slice(0, 3).map(p => `* ${p.title.slice(0, 80)}`).join('\n')}
` : ''}
🚀 *[Top Headline]*
[2-3 sentence summary with market implications]

🏦 *[Second Headline]*  
[2-3 sentence summary with market implications]

🌐 *[DeFi/Altcoin Focus]*
[2-3 sentence summary]

🏛️ *Regulatory & Political*
* Key government/legal developments

🤖 *AI & Crypto*
* AI-crypto partnerships/launches

🌍 *Global & Macro*
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