import { scrapeMessariNews } from './lib/scraper.js';
import { filterPortfolioMentions, detectPortfolioMentions, PANTERA_PORTFOLIO_COMPANIES } from './lib/filter.js';
import { summarizeWithOpenAI } from './lib/openai.js';
import { postToSlack } from './slack.js';

const companies = PANTERA_PORTFOLIO_COMPANIES;

async function runBriefBot() {
  try {
    console.log('🚀 Starting Crypto Daily Brief Bot...');
    console.log('📰 Scraping latest Messari articles...');
    
    const articles = await scrapeMessariNews();

    console.log(`🔎 Found ${articles.length} articles.`);
    
    // Detect portfolio company mentions with enhanced detection
    const portfolioMentions = detectPortfolioMentions(articles, companies);
    
    console.log(`💎 ${portfolioMentions.length} Pantera-related stories found.`);
    
    if (portfolioMentions.length > 0) {
      console.log('📊 Portfolio companies detected:');
      portfolioMentions.forEach(mention => {
        console.log(`   • ${mention.title} (${mention.detectedCompanies.join(', ')})`);
      });
    }

    console.log('✍️ Generating summary with OpenAI...');
    const summary = await summarizeWithOpenAI(articles.slice(0, 7), portfolioMentions);

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

    console.log(`\n📊 Final stats: ${articles.length} articles → ${portfolioMentions.length} portfolio mentions → ${summary.length} char brief`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Provide specific guidance based on error type
    if (error.message.includes('axios') || error.message.includes('Network')) {
      console.error('🌐 Network issue - check connection or try again later');
    } else if (error.message.includes('OpenAI')) {
      console.error('🧠 OpenAI issue - check API key and quota');
      console.error('💡 Verify OPENAI_API_KEY environment variable');
    } else if (error.message.includes('Slack')) {
      console.error('💬 Slack delivery issue - check credentials');
      console.error('💡 Verify SLACK_BOT_TOKEN and SLACK_CHANNEL_ID variables');
    }
    
    console.error('\n🚫 Bot stopped to prevent sending invalid content');
    process.exit(1);
  }
}

runBriefBot();
