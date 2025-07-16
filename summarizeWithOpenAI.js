const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeWithOpenAI(articles) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found. Cannot generate newsletter.');
    }
    
    if (!articles || articles.length === 0) {
      throw new Error('No articles provided for summarization');
    }
    
    console.log(`📝 Generating crypto daily brief from ${articles.length} articles...`);
    
    // Format articles for OpenAI
    const articlesText = articles.map((article, i) => 
      `${i + 1}. Title: ${article.title}\n   Summary: ${article.summary}\n   URL: ${article.url}`
    ).join('\n\n');
    
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const prompt = `Create a professional crypto daily brief from these ${articles.length} news articles using this EXACT format:

REQUIRED STRUCTURE:
📰 **Crypto Daily Brief – ${today}**

**TOP STORIES**

:chart_with_upwards_trend: **[Rewrite most important headline here]**
2-3 sentence Bloomberg-style summary with specific numbers, names, and market insights.

:money_with_wings: **[Second most important headline]**  
2-3 sentence summary focusing on market impact and implications.

**PANTERA MENTIONS**
- 💠 **[Company Name]** - Brief description if any articles mention Pantera portfolio companies (Circle, Solana, Avalanche, etc.)

**OTHER NOTEWORTHY STORIES**
- 📊 **[Headline]**
- 🔄 **[Another headline]**  
- 💡 **[Third headline]**
- 🏛️ **[Fourth headline]**

FORMAT RULES:
- NO static categories like "Bitcoin" or "Ethereum"
- NO prefixes like "BitcoinBitcoin" or "EthereumEthereum"  
- NO dates in headlines
- Each story stands alone with proper spacing
- Use relevant emojis (:chart_with_upwards_trend:, :money_with_wings:, etc.)
- Skip Pantera section if no portfolio company mentions
- 3-6 items in Other Noteworthy Stories

Pantera Portfolio Companies: Circle, Solana, Avalanche, Polygon, Compound, Uniswap, OpenSea, Magic Eden, Chainlink, The Graph

Articles to reformat:
${articlesText}

Generate clean, professional content following the EXACT structure above.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a crypto analyst creating daily briefings. Follow the EXACT format: TOP STORIES (2-3 major stories), PANTERA MENTIONS (only if portfolio companies mentioned), OTHER NOTEWORTHY STORIES (bullet list). CRITICAL: NO static categories like Bitcoin/Ethereum, NO prefixes like 'BitcoinBitcoin', NO dates in headlines. Use clean spacing and professional Bloomberg-style writing with specific numbers and insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3, // Low temperature for consistent, professional output
    });

    const newsletter = completion.choices[0]?.message?.content;
    
    if (!newsletter || newsletter.trim().length < 100) {
      throw new Error('OpenAI generated insufficient newsletter content');
    }
    
    // Clean up the newsletter formatting for new structure
    const cleanNewsletter = newsletter
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/^\s+/gm, '') // Remove leading whitespace
      .replace(/\*\*\s*\*\*/g, '') // Remove empty bold tags
      .replace(/🔗.*$/gm, '') // Remove any remaining links
      .replace(/Read more.*$/gm, '') // Remove "Read more" text
      .replace(/\*\*([^*]+)\*\*\s*-\s*/g, '**$1**\n') // Fix headline formatting
      .replace(/(:chart_with_upwards_trend:|:money_with_wings:|📊|🔄|💡|🏛️)\s*\*\*([^*]+)\*\*(.+)/gm, '$1 **$2**\n$3') // Fix emoji story formatting
      .replace(/\n\n\n+/g, '\n\n') // Clean up triple line breaks
      .replace(/TOP STORIES(.+?)PANTERA MENTIONS/gs, 'TOP STORIES$1\nPANTERA MENTIONS') // Ensure proper spacing
      .replace(/OTHER NOTEWORTHY STORIES(.+?)$/gs, 'OTHER NOTEWORTHY STORIES$1'); // Clean ending
    
          console.log('✅ Crypto daily brief generated successfully');
    
    // Validate newsletter quality for new format
    const hasTopStories = /TOP STORIES/.test(cleanNewsletter);
    const hasOtherStories = /OTHER NOTEWORTHY STORIES/.test(cleanNewsletter);
    const hasBoldHeadlines = /\*\*.*\*\*/.test(cleanNewsletter);
    const hasBulletPoints = /^-\s+/.test(cleanNewsletter);
    
    if (!hasTopStories || !hasOtherStories || !hasBoldHeadlines) {
      console.log('⚠️  Warning: Newsletter may not be properly formatted');
    }
    
    return cleanNewsletter;
    
  } catch (error) {
    console.error('❌ OpenAI newsletter generation failed:', error.message);
    
    if (error.message.includes('API key')) {
      console.error('🔑 Check your OpenAI API key configuration');
    } else if (error.message.includes('quota')) {
      console.error('💳 OpenAI API quota exceeded');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ OpenAI API request timed out');
    }
    
    throw error;
  }
}

// Helper function to validate newsletter quality for new format
function validateNewsletter(newsletter) {
  const checks = {
    hasTopStories: /TOP STORIES/.test(newsletter),
    hasOtherStories: /OTHER NOTEWORTHY STORIES/.test(newsletter),
    hasBoldText: /\*\*.*\*\*/.test(newsletter),
    hasMinLength: newsletter.length > 200,
    noFillerText: !newsletter.includes('powered by') && !newsletter.includes('Read more'),
    hasBulletPoints: /^-\s+/m.test(newsletter),
    hasDateHeader: /Crypto Daily Brief/.test(newsletter)
  };
  
  const passed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  
  console.log(`📊 Newsletter quality: ${passed}/${total} checks passed`);
  
  return passed >= 5; // Must pass at least 5/7 checks for new format
}

module.exports = { 
  summarizeWithOpenAI, 
  validateNewsletter 
}; 