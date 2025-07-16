require("dotenv").config();
const { scrapeMessariWithPuppeteer } = require("./scrapeMessariWithPuppeteer");
const { summarizeWithOpenAI, validateNewsletter } = require("./summarizeWithOpenAI");
const { postToSlack } = require("./slack");

console.log("🚀 Starting Crypto Daily Brief Bot...");

async function runBot() {
  try {
    console.log("📰 STEP 1: Scraping latest crypto news with Puppeteer...");
    
    // Scrape articles using Puppeteer (no fallback - either works or fails)
    const articles = await scrapeMessariWithPuppeteer();
    
    if (!articles || articles.length === 0) {
      throw new Error("No articles scraped from Messari");
    }
    
    console.log(`✅ Successfully scraped ${articles.length} articles`);
    
    console.log("\n📝 STEP 2: Generating crypto daily brief...");
    
    // Format into crypto daily brief using OpenAI
    const newsletter = await summarizeWithOpenAI(articles);
    
    if (!newsletter) {
      throw new Error("Failed to generate daily brief from scraped articles");
    }
    
    // Validate newsletter quality
    const isQualityNewsletter = validateNewsletter(newsletter);
    
    if (!isQualityNewsletter) {
      console.log("⚠️  Daily brief quality below standards, but proceeding...");
    }
    
    console.log("\n📋 PREVIEW - CRYPTO DAILY BRIEF:");
    console.log("═".repeat(60));
    console.log(newsletter.slice(0, 800) + "...");
    console.log("═".repeat(60));
    
    console.log("\n📤 STEP 3: Sending to Slack...");
    
    // Send to Slack
    await postToSlack(newsletter);
    
    console.log("✅ Crypto daily brief sent successfully!");
    console.log(`📊 Final stats: ${articles.length} articles → ${newsletter.length} char brief`);
    
  } catch (error) {
    console.error("❌ Daily brief bot failed:", error.message);
    
    // Provide specific guidance based on error type
    if (error.message.includes('Puppeteer')) {
      console.error("🤖 Puppeteer scraping issue - check browser dependencies or network");
      console.error("💡 Try: npm install puppeteer --force");
    } else if (error.message.includes('OpenAI')) {
      console.error("🧠 OpenAI formatting issue - check API key and quota");
      console.error("💡 Verify OPENAI_API_KEY in your .env file");
    } else if (error.message.includes('Slack')) {
      console.error("💬 Slack delivery issue - check webhook URL");
      console.error("💡 Verify SLACK_WEBHOOK_URL in your .env file");
    } else if (error.message.includes('No articles')) {
      console.error("📰 No articles found - Messari site may have changed");
      console.error("💡 Check DOM selectors in scrapeMessariWithPuppeteer.js");
    }
    
    console.error("\n🚫 Bot stopped - no fallback to prevent sending outdated/hallucinated content");
    process.exit(1);
  }
}

runBot();
