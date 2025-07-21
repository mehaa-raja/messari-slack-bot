import OpenAI from 'openai';
import { detectPortfolioMentionsInText, PANTERA_PORTFOLIO_COMPANIES } from './filter.js';

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
    
    // Detect portfolio mentions in the raw content
    const portfolioMentions = detectPortfolioMentionsInText(rawNewsContent, PANTERA_PORTFOLIO_COMPANIES);
    console.log(`💎 Detected ${portfolioMentions.length} portfolio mentions:`, portfolioMentions.slice(0, 5));
    
    // Create portfolio section instruction if mentions found
    const portfolioInstruction = portfolioMentions.length > 0 
      ? `\n- IMPORTANT: Include a dedicated section ":gem: Pantera Portfolio Highlights" ONLY if there is news where these exact portfolio companies are the PRIMARY SUBJECT: ${portfolioMentions.join(', ')}. Do NOT include news about other companies (like Jito Labs, LayerZero, etc.) that just happen to mention these names. For example: "Solana Labs announces X" = INCLUDE, "Jito Labs does something on Solana" = EXCLUDE. If no portfolio company is the main subject of any news, DO NOT include this section at all.`
      : '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional newsletter formatter. Take the provided crypto news content and format it into a clean, well-structured Slack-friendly newsletter. 

Format the user's raw crypto news content into the following layout, exactly:
- Start with the line: ":newspaper: Crypto Daily Brief – ${today}"
- Use section headers with emojis and single asterisk bold: ":chart_with_upwards_trend: *Market Overview*", ":books: *Top Stories*"
- CRITICAL: NO markdown tables (|---|---| format), NO data tables, NO charts - use simple text only
- Use paragraph-style summaries, not just bullet points. Keep them concise and info-rich.
- For Top Stories, number each story: "1. *Story Title Here*" using single asterisks for bold, followed by paragraph text
- Use short paragraphs or bullet-like lines (with dashes) under Notable Events & Listings
- Keep emojis only in section titles — do NOT include emojis in the content itself
- Use single asterisks to bold titles and section headers (*text*) — Slack requires single asterisks. NO double asterisks (**bold**)
- NO markdown tables or data formatting - keep all content as simple text paragraphs only
- Make it sound like a human-written newsletter (like Messari or Bloomberg), not an AI or bot
- Prioritize institutional, regulatory, and infrastructure-focused summaries over fluff
- Ensure tone is professional, engaging, and actionable — with proper punctuation and formatting
- Include a final section titled “Summary:” with 2–3 clean sentences that synthesize the day’s themes
- Use - (dash followed by a space) for all bullet points — no asterisks, dots, or other symbols. This ensures clean Slack rendering.
- Keep the full output to a ~3–5 minute read (~400–700 words)${portfolioInstruction}

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