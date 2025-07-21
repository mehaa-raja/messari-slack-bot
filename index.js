import 'dotenv/config';
import { scrapeMessariNews } from './lib/scraper.js';
import { formatNewsWithOpenAI } from './lib/openai.js';
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
      throw new Error('OPENAI_API_KEY environment variable is required for formatting');
    }
    
    console.log('📰 Generating comprehensive crypto news brief...');
    
    const newsBrief = await scrapeMessariNews();
    
    if (!newsBrief || !newsBrief.content) {
      throw new Error('Failed to generate news brief');
    }

    console.log('✨ Formatting news brief with OpenAI...');
    const summary = await formatNewsWithOpenAI(newsBrief.content);

    console.log('\n📋 DAILY BRIEF PREVIEW:');
    console.log('═'.repeat(60));
    console.log(summary.slice(0, 800) + (summary.length > 800 ? '...' : ''));
    console.log('═'.repeat(60));

    // Send to Slack if credentials are available
    if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID) {
      console.log('\n📤 Sending to Slack...');
      await postToSlack(summary);
      console.log('✅ Successfully sent to Slack!');
    } else {
      console.log('\n📋 Slack credentials not configured - displaying newsletter only');
    }

    console.log(`\n📊 Final stats: ${summary.length} char brief generated at ${newsBrief.generatedAt}`);
    if (newsBrief.sources && newsBrief.sources.length > 0) {
      console.log(`📄 Based on ${newsBrief.sources.length} sources`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Provide specific guidance based on error type
    if (error.message.includes('axios') || error.message.includes('Network')) {
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
  process.exit(1);
});
