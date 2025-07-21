import 'dotenv/config';
import { scrapeMessariNews } from './lib/scraper.js';
import { formatNewsWithOpenAI } from './lib/openai.js';
import { detectPortfolioMentionsInText, PANTERA_PORTFOLIO_COMPANIES } from './lib/filter.js';
import { postToSlack } from './slack.js';

// Load environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

async function runBriefBot() {
  try {
    console.log('🚀 Starting Crypto Daily Brief Bot...');
    
    // Check for required environment variables
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY environment variable is required');
      process.exit(1);
    }
    
    console.log('📰 Generating comprehensive crypto news brief...');
    
    const newsBrief = await scrapeMessariNews();
    
    if (!newsBrief || !newsBrief.content) {
      console.error('❌ Failed to generate news brief');
      process.exit(1);
    }

    // Check if this is a fallback/error message - don't send to Slack
    const isFallbackMessage = newsBrief.content.includes('Service temporarily unavailable') || 
                             newsBrief.content.includes('technical issues') ||
                             newsBrief.content.includes('fallback message');

    if (isFallbackMessage) {
      console.log('⚠️ Generated fallback message due to API issues');
      console.log('🛑 Skipping Slack delivery to prevent sending error messages');
      console.log('💡 Bot will retry tomorrow when APIs are available');
      process.exit(0); // Exit gracefully without sending anything
    }

    console.log('✨ Formatting news brief with OpenAI...');
    const summary = await formatNewsWithOpenAI(newsBrief.content);

    console.log('\n📋 DAILY BRIEF PREVIEW:');
    console.log('═'.repeat(60));
    console.log(summary.slice(0, 800) + (summary.length > 800 ? '...' : ''));
    console.log('═'.repeat(60));

    // Only send to Slack if we have real content (not fallback) and credentials
    if (SLACK_BOT_TOKEN && SLACK_CHANNEL_ID) {
      console.log('\n📤 Sending to Slack...');
      await postToSlack(summary);
      console.log('✅ Successfully sent to Slack!');
    } else {
      console.log('\n📋 Slack credentials not configured - displaying newsletter only');
    }

    // Detect portfolio mentions for stats
    const portfolioMentions = detectPortfolioMentionsInText(newsBrief.content, PANTERA_PORTFOLIO_COMPANIES);
    
    console.log(`\n📊 Final stats: ${summary.length} char brief generated at ${newsBrief.generatedAt}`);
    if (portfolioMentions.length > 0) {
      console.log(`💎 Portfolio mentions: ${portfolioMentions.slice(0, 5).join(', ')}${portfolioMentions.length > 5 ? ` +${portfolioMentions.length - 5} more` : ''}`);
    }
    if (newsBrief.sources && newsBrief.sources.length > 0) {
      console.log(`📄 Based on ${newsBrief.sources.length} sources`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Provide specific guidance based on error type
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      console.error('🔒 API rate limit exceeded - bot will retry tomorrow');
      console.error('💡 No message sent to prevent spam');
    } else if (error.message.includes('axios') || error.message.includes('Network')) {
      console.error('🌐 Network issue - check connection or try again later');
    } else if (error.message.includes('Messari AI') || error.message.includes('AI error')) {
      console.error('🧠 Messari AI issue - check API key and service status');
      console.error('💡 Verify Messari API key is valid and has sufficient quota');
    } else if (error.message.includes('OpenAI') || error.message.includes('formatting')) {
      console.error('🤖 OpenAI formatting issue - check API key and quota');
      console.error('💡 Verify OPENAI_API_KEY environment variable');
    } else if (error.message.includes('Slack')) {
      console.error('💬 Slack delivery issue - check credentials');
      console.error('💡 Verify SLACK_BOT_TOKEN and SLACK_CHANNEL_ID variables');
    }
    
    console.error('\n🚫 Bot stopped to prevent sending invalid content');
    process.exit(1);
  }
}

// Run the bot with proper error handling for production
console.log('🌟 Environment:', process.env.NODE_ENV || 'development');
console.log('🚀 Starting in:', process.cwd());

runBriefBot().catch(error => {
  console.error('💥 Critical error:', error);
  console.error('🛑 Exiting without sending to Slack to prevent error messages');
  process.exit(1);
});
