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
    
    // Format portfolio highlights with rich detail and numbering
    const emojiNumbers = [':one:', ':two:', ':three:', ':four:', ':five:'];
    const portfolioSection = `\n:gem: *Pantera Portfolio Highlights*\n\n` +
      portfolioMentions.slice(0, 3).map((mention, index) => {
        const emojiNumber = emojiNumbers[index] || `:${index + 1}:`;
        if (typeof mention === 'object' && mention.headline) {
          // Rich format with headline and context
          return `${emojiNumber} *${mention.headline}*\n\n${mention.context.substring(0, 300)}...`;
        } else if (typeof mention === 'object' && mention.summary && typeof mention.summary === 'object') {
          // Handle new object format
          return `${emojiNumber} *${mention.summary.headline}*\n\n${mention.summary.context.substring(0, 300)}...`;
        } else {
          // Fallback to company name format
          const companyName = typeof mention === 'string' ? mention : 
                             typeof mention.summary === 'string' ? mention.summary.split(':')[0] :
                             mention.company || 'Portfolio Company';
          return `${emojiNumber} *${companyName} Reports Major Development*\n\nPortfolio company featured in today's major crypto market developments with significant business activity.`;
        }
      }).join('\n\n') + '\n';
    
    // Insert after Market Overview section
    content = content.replace(/(:chart_with_upwards_trend: \*Market Overview\*[\s\S]*?\n\n)/, `$1${portfolioSection}`);
  }
  
  // Remove any remaining markdown artifacts
  content = content.replace(/\*\*([^*]+)\*\*/g, '*$1*'); // Convert **bold** to *bold*
  content = content.replace(/^\s*Prepared by.*$/m, ''); // Remove signature line
  
  // Remove interactive language from fallback content too
  content = content.replace(/\*?Let me know if you want more details.*?\*?/gi, '');
  content = content.replace(/\*?Feel free to ask.*?\*?/gi, '');
  content = content.replace(/\*?Contact us for.*?\*?/gi, '');
  content = content.replace(/\*?Reach out if.*?\*?/gi, '');
  
  // Clean up final formatting
  content = content.replace(/\n{3,}/g, '\n\n').trim();
  
  return content;
}

export async function formatNewsWithOpenAI(rawNewsContent, portfolioMentions = null) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  try {
    console.log('🧠 Formatting news brief with OpenAI GPT-4...');
    
    // Use provided portfolio mentions or detect them if not provided
    const finalPortfolioMentions = portfolioMentions || await detectPortfolioMentionsInText(rawNewsContent, PANTERA_PORTFOLIO_COMPANIES);
    console.log(`💎 Using ${finalPortfolioMentions.length} main topic portfolio companies`);
    
    // Enhanced logging for debugging
    if (finalPortfolioMentions.length > 0) {
      console.log('📊 Main Topic Portfolio Companies:');
      finalPortfolioMentions.forEach((mention, index) => {
        console.log(`  ${index + 1}. ${mention.summary}`);
        console.log(`     Detected via: ${mention.reasons}`);
      });
    }
    
    // Create portfolio section instruction if mentions found
    const portfolioInstruction = finalPortfolioMentions.length > 0 
      ? `\n- PORTFOLIO HIGHLIGHTS SECTION: Include a dedicated section ":gem: *Pantera Portfolio Highlights*" with the following portfolio companies that are main topics of today's news. Format each as a rich, detailed highlight similar to the main stories:

${finalPortfolioMentions.map((m, index) => {
  if (typeof m.summary === 'object') {
    return `${index + 1}. **${m.summary.headline}**
   ${m.summary.context}`;
  } else {
    return `${index + 1}. ${m.summary}`;
  }
}).join('\n\n')}

FORMATTING RULES FOR PORTFOLIO HIGHLIGHTS:
- Format each as: ":one:", ":two:", ":three:" etc. followed by "*[Headline]*" and 2-3 sentences of explanation
- Start each paragraph with "*Company Name (SYMBOL):*" using single asterisks for bolding
- Include specific details like amounts, partnerships, technical details, and business implications
- Use the rich context provided above to create meaningful explanations
- DO NOT use simple bullet points - use full story format like the main newsletter sections
- Each highlight should be substantial and informative
- Number each portfolio highlight using emoji numbers like the main stories

EXAMPLE FORMAT:
:gem: *Pantera Portfolio Highlights*

:one: *Bitstamp Raises $40M Series A2 in Robinhood Acquisition*

*Bitstamp (BTSP):* Completed a $200M acquisition by Robinhood, securing a $40M Series A2 funding round as part of the deal. This acquisition expands Robinhood's global presence and provides additional liquidity infrastructure for retail crypto trading across international markets.

:two: *Expand Protocol Launches TREE Token with 75% APR Staking*

*Expand (TREE):* Launched its TREE token on several major exchanges, offering staking vaults with up to 75% APR to attract liquidity providers. The protocol aims to build on-chain fixed income markets and expand its tAssets and derivatives offerings in the DeFi ecosystem.`
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

CRITICAL FORMATTING RULES:
- Use numbered emojis (:one:, :two:, :three:, :four:, :five:) for major stories
- Each bullet point must start with tab + "• " (tab + bullet + space)
- Keep stories concise - 2-3 sentences max per story
- Use *single asterisks* for bolding only
- No markdown tables or complex formatting
- End with Noteworthy Developments section (no summary section needed)
- Do NOT include interactive language like "Let me know if you want more details" or "Feel free to ask" - this is an automated newsletter`
        },
        {
          role: "user",
          content: `Please format this crypto news content for a professional daily newsletter:\n\n${rawNewsContent}`
        }
      ],
      max_tokens: 4000,
      temperature: 0.7
    });

    let formattedContent = response.choices[0].message.content.trim();
    
    // Remove any interactive language that shouldn't be in an automated newsletter
    formattedContent = formattedContent.replace(/\*?Let me know if you want more details.*?\*?/gi, '');
    formattedContent = formattedContent.replace(/\*?Feel free to ask.*?\*?/gi, '');
    formattedContent = formattedContent.replace(/\*?Contact us for.*?\*?/gi, '');
    formattedContent = formattedContent.replace(/\*?Reach out if.*?\*?/gi, '');
    
    // Clean up any resulting empty lines
    formattedContent = formattedContent.replace(/\n{3,}/g, '\n\n').trim();
    
    console.log(`✅ OpenAI formatted content: ${formattedContent.length} characters`);
    
    return formattedContent;
    
  } catch (error) {
    console.log(`❌ OpenAI formatting error: ${error.message}`);
    
    // Use provided portfolio mentions for fallback formatter
    const fallbackPortfolioMentions = portfolioMentions || await detectPortfolioMentionsInText(rawNewsContent, PANTERA_PORTFOLIO_COMPANIES);
    console.log(`🔄 Using fallback formatter with ${fallbackPortfolioMentions.length} main topic portfolio companies detected`);
    
    // Extract company names for fallback formatter compatibility
    const portfolioCompanyNames = fallbackPortfolioMentions.map(mention => mention.company);
    
    // Use sophisticated fallback formatter
    const fallbackContent = formatMessariContentForSlack(rawNewsContent, portfolioCompanyNames, today);
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