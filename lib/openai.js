import OpenAI from 'openai';
import { detectPortfolioMentionsInText, PANTERA_PORTFOLIO_COMPANIES } from './filter.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Fallback formatter: Convert Messari AI markdown to Slack format
function formatMessariContentForSlack(rawContent, portfolioMentions, today) {
  let content = rawContent;
  
  // Remove footnote citations [^1], [^2], etc.
  content = content.replace(/\[\^\d+\]/g, '');
  
  // Convert markdown headers to emoji headers
  content = content.replace(/^# Crypto Daily Brief.*$/m, `:newspaper: *Crypto Daily Brief – ${today}*`);
  content = content.replace(/^## Market Overview$/m, ':chart_with_upwards_trend: *Market Overview*');
  content = content.replace(/^## Major Stories$/m, ':fire: *Top Stories*');
  content = content.replace(/^## Other Notable Developments$/m, ':newspaper2: *Notable Events*');
  content = content.replace(/^## Market Sentiment & Trends$/m, ':bar_chart: *Market Sentiment*');
  content = content.replace(/^## Regulatory & Macro Outlook$/m, ':bank: *Regulatory Updates*');
  content = content.replace(/^## Closing Thoughts$/m, ':crystal_ball: *Looking Ahead*');
  content = content.replace(/^## Looking Ahead$/m, ':crystal_ball: *Looking Ahead*');
  
  // Remove any remaining ## headers that weren't converted (like data tables)
  content = content.replace(/^## .*$/gm, '');
  
  // Convert ### subheaders to numbered stories
  content = content.replace(/^### (\d+)\.\s*\*\*(.*?)\*\*$/gm, '*$1. $2*');
  content = content.replace(/^### (.*?)$/gm, '*$1*');
  
  // Remove ALL markdown tables and table-like content
  const tableRegex = /\|\s*Asset.*?\|\s*\n\|[-:\s|]+\|\s*\n((?:\|.*?\|\s*\n)+)/gm;
  const simpleTableRegex = /\|.*?\|.*?\|.*?\|\s*\n/gm;
  const pipeTableRegex = /\|\|\|\|\|\|\|/gm;
  
  content = content.replace(tableRegex, 'Major cryptocurrencies showing strong trading volumes across the market.');
  content = content.replace(simpleTableRegex, '');
  content = content.replace(pipeTableRegex, '');
  
  // Remove any remaining table artifacts and pipe characters
  content = content.replace(/\|\s*\w+.*?\|\s*\n/gm, '');
  content = content.replace(/\|[-:\s|]+\|/gm, '');
  
  // Convert markdown bullet points to Slack format (tab + bullet)
  content = content.replace(/^- \*\*(.*?)\*\*/gm, '\t• *$1*');
  content = content.replace(/^- (.*?)$/gm, '\t• $1');
  
  // Remove horizontal rules (multiple patterns)
  content = content.replace(/^---+$/gm, '');
  content = content.replace(/---+/g, '');
  
  // Clean up multiple empty lines and weird spacing
  content = content.replace(/\n{3,}/g, '\n\n');
  content = content.replace(/\.\n\n---\n\n/g, '.\n\n');
  content = content.replace(/\n---\n/g, '\n\n');
  
  // Shorten content for fallback: Focus on key sections only
  // Keep content focused - trim after Looking Ahead section
  const lookingAheadIndex = content.indexOf(':crystal_ball: *Looking Ahead*');
  if (lookingAheadIndex !== -1) {
    const afterLookingAhead = content.indexOf('\n\n', lookingAheadIndex + 200);
    if (afterLookingAhead !== -1) {
      content = content.substring(0, afterLookingAhead);
    }
  }
  
  // Trim overly long bullet points to 1-2 sentences max
  content = content.replace(/(\t• [^•\n]*?[.!?])\s+[^•\n]*?[.!?][^•\n]*/g, '$1');
  
  // Remove verbose introductory text
  content = content.replace(/Welcome to your comprehensive.*?cryptocurrencies\./g, '');
  content = content.replace(/Here's everything you need to know.*?\./g, '');
  
  // Add portfolio highlights section if portfolio companies found with meaningful activity
  if (portfolioMentions.length > 0) {
    // Check if any portfolio companies appear in major story headlines/content (not just mentions)
    const majorStoryPattern = /\*(\d+\.\s*.*?)\*[\s\S]*?(?=\*\d+\.|:[\w_]+:|$)/g;
    const majorStories = [];
    let match;
    
    while ((match = majorStoryPattern.exec(content)) !== null) {
      majorStories.push(match[1].toLowerCase());
    }
    
    // Find portfolio companies that appear in major stories
    const portfolioInMajorStories = portfolioMentions.filter(company => 
      majorStories.some(story => story.includes(company.toLowerCase()))
    );
    
    // Only add portfolio section if companies are in major stories (meaningful activity)
    if (portfolioInMajorStories.length > 0) {
      const portfolioSection = `\n:gem: *Pantera Portfolio Highlights*\n\n` +
        portfolioInMajorStories.slice(0, 3).map(name =>
          `\t• **${name}:** Featured in today's major developments`
        ).join('\n') + '\n';
      
      // Insert after Market Overview section
      content = content.replace(/(:chart_with_upwards_trend: \*Market Overview\*[\s\S]*?\n\n)/, `$1${portfolioSection}`);
    }
  }
  
  // Remove any remaining markdown artifacts
  content = content.replace(/\*\*([^*]+)\*\*/g, '*$1*'); // Convert **bold** to *bold*
  content = content.replace(/^\s*Prepared by.*$/m, ''); // Remove signature line
  
  // Clean up final formatting
  content = content.trim();
  
  return content;
}

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
    
    // Enhanced logging for debugging
    if (portfolioMentions.length > 0) {
      console.log('📊 Portfolio Detection Details:');
      portfolioMentions.forEach((company, index) => {
        if (index < 5) { // Log first 5
          const regex = new RegExp(`\\b${company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          const match = rawNewsContent.match(regex);
          if (match) {
            const matchIndex = rawNewsContent.search(regex);
            const context = rawNewsContent.substring(Math.max(0, matchIndex - 50), matchIndex + company.length + 50);
            console.log(`  ${index + 1}. ${company}: "${context.trim()}"`);
          }
        }
      });
      if (portfolioMentions.length > 5) {
        console.log(`  ... and ${portfolioMentions.length - 5} more companies`);
      }
    }
    
    // Create portfolio section instruction if mentions found
    const portfolioInstruction = portfolioMentions.length > 0 
      ? `\n- PORTFOLIO HIGHLIGHTS SECTION: Include a dedicated section ":gem: *Pantera Portfolio Highlights*" ONLY if portfolio companies have MEANINGFUL ACTIVITY in today's news. Meaningful activity includes: major funding rounds, protocol launches, exchange listings, governance proposals, significant integrations, institutional partnerships, or major press features.

CRITICAL PORTFOLIO RULES:
- Only include companies with substantial news (not just casual mentions)
- Format exactly like this for each company: "\t• **Company Name:** Brief description of their news or activity"
- Add 1-2 sentences of insight with metrics and context explaining why it matters
- Keep it concise and professional - like a polished financial news editor
- Companies detected with meaningful activity: ${portfolioMentions.join(', ')}
- If no portfolio company has meaningful activity, DO NOT include this section at all

EXAMPLE FORMAT:
:gem: *Pantera Portfolio Highlights*

\t• *Uniswap Labs:* Announced V4 protocol upgrade with enhanced cross-chain functionality
\t• *Circle:* Secured $1.2B Series E funding round led by institutional investors
\t• *Solana Labs:* Partnered with Visa for enterprise payment integration`
      : '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional newsletter formatter. Take the provided crypto news content and format it into a clean, well-structured Slack-friendly newsletter. 

Format the user's raw crypto news content into the following layout, exactly:

:newspaper: *Crypto Daily Brief – ${today}*

:chart_with_upwards_trend: *Market Overview*

	• Brief market summary (1-2 bullet points)
	• Key metrics and overall sentiment

:one: *[First Major Story Headline]*

[2-3 sentence paragraph explaining the story and its implications]

:two: *[Second Major Story Headline]*

[2-3 sentence paragraph explaining the story and its implications]

:three: *[Third Major Story Headline]*

[2-3 sentence paragraph explaining the story and its implications]

:four: *[Fourth Story - can be regulatory, partnerships, etc.]*

	• *Country/Company:* Brief development
	• *Country/Company:* Brief development

:five: *[Fifth Story - infrastructure, DeFi, etc.]*

[2-3 sentence paragraph about infrastructure/technical developments]

:earth_americas: *Noteworthy Developments*

	• Brief notable item
	• Brief notable item  
	• Brief notable item

${portfolioInstruction}

:bookmark_tabs: *Summary*

[2-3 sentence market reflection and outlook]

CRITICAL FORMATTING RULES:
- Use numbered emojis (:one:, :two:, :three:, :four:, :five:) for major stories
- Each bullet point must start with tab + "• " (tab + bullet + space)
- Keep stories concise - 2-3 sentences max per story
- Use *single asterisks* for bolding only
- No markdown tables or complex formatting
- End with Summary section for market outlook`
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
    
    // Detect portfolio mentions for fallback formatter
    const portfolioMentions = detectPortfolioMentionsInText(rawNewsContent, PANTERA_PORTFOLIO_COMPANIES);
    console.log(`🔄 Using fallback formatter with ${portfolioMentions.length} portfolio mentions detected`);
    
    // Use sophisticated fallback formatter
    const fallbackContent = formatMessariContentForSlack(rawNewsContent, portfolioMentions, today);
    console.log(`✅ Fallback formatter generated ${fallbackContent.length} character Slack-friendly newsletter`);
    
    return fallbackContent;
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