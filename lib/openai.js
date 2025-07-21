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
- Start with ":newspaper: *Crypto Daily Brief – ${today}*" as the top headline
- Every section must have a clear emoji heading, e.g., ":chart_with_upwards_trend: *Market Overview*"
- Use *single asterisks* for bolding section headers and numbered story titles only — no double asterisks
- Use "- " (dash followed by space) for all bullet points — do NOT use asterisks, bullets, or other characters
- Never include markdown tables or dense asset snapshots — summarize any market data as a sentence (e.g., "BTC trades at $117,338 with $20B in volume")
- Do not use code blocks or multi-column layouts — plain text only
- Use paragraph-style summaries under each numbered story, keep them 2–4 lines max
- Notable Events & Listings should be 4–6 bulleted points with brief, punchy updates
- Infrastructure & Ecosystem should also have an emoji header and contain "- " bullets only
- End with ":crystal_ball: *Looking Ahead*" or ":bookmark_tabs: *Summary*" — include 2–3 sentence market reflection
- The tone should be professional, concise, and human — like a Messari or Bloomberg analyst
- Final output should be Slack-optimized and visually easy to scan — no markdown quirks


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