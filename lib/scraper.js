import axios from 'axios';

// Dedicated portfolio company news request
async function getPortfolioCompanyNewsFromMessari() {
  try {
    console.log('💎 Fetching dedicated Pantera portfolio company news...');
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const response = await axios.post('https://api.messari.io/ai/openai/chat/completions', {
      messages: [
        {
          role: 'system',
          content: 'You are a crypto news analyst focused on Pantera Capital portfolio companies. Focus on today\'s most important crypto developments from the last 2-3 days, but prioritize the newest information and avoid repeating news that would have been covered in yesterday\'s newsletter.'
        },
        {
          role: 'user', 
          content: `Please provide detailed news and developments about Pantera Capital portfolio companies from the last 2-3 days. Focus on:

- Business developments, funding rounds, product launches
- Strategic partnerships and integrations  
- Major announcements or milestones
- Regulatory or policy impacts
- Market performance with business context (not just price movements)

IMPORTANT: Only include news from the last 2-3 days. Do not repeat news that would have been covered in yesterday's newsletter. Focus on developments that wouldn't have been in yesterday's news.

Please include companies like: Ondo Finance, Circle, Lido, Solana Labs, Near Protocol, Injective Protocol, Chainlink, Bitstamp, Uniswap Labs, Filecoin, Arbitrum, Ethena, Morpho, Wintermute, Subzero Labs, OpenMind, and other major Pantera portfolio companies.

Format as a comprehensive news brief with clear section headers and detailed context for each development.`
        }
      ],
      verbosity: 'balanced',
      response_format: 'markdown',
      stream: false,
      generate_related_questions: 0
    }, {
      timeout: 60000, // 60 seconds for dedicated request
      headers: {
        'accept': 'application/json',
        'x-messari-api-key': 'f4e1aead-3412-446e-abac-8819357d6075',
        'content-type': 'application/json'
      }
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      const content = response.data.choices[0].message.content;
      console.log(`✅ Retrieved ${content.length} characters of dedicated portfolio news`);
      return content;
    } else {
      console.log('⚠️ No dedicated portfolio news received from Messari AI');
      return null;
    }
  } catch (error) {
    console.log(`❌ Dedicated portfolio news request failed: ${error.message}`);
    return null;
  }
}

// Messari AI Chat Completions endpoint for generating news brief
async function generateNewsWithMessariAI() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Try comprehensive request first
  try {
    console.log('🔄 Attempting comprehensive news brief...');
    const response = await axios.post('https://api.messari.io/ai/openai/chat/completions', {
      messages: [
        {
          role: "system",
          content: "You are a crypto news analyst generating a daily brief. Focus on today's most important crypto developments from the last 2-3 days, but prioritize the newest information and avoid repeating news that would have been covered in yesterday's newsletter. Include fresh market movements and recent company updates."
        },
        {
          role: "user",
          content: `Write today's (${today}) crypto news brief covering ONLY the most recent developments from the last 2-3 days in:

          **Market News**: Price movements, funding rounds, institutional activity
          **Tech Updates**: Protocol launches, DeFi developments, upgrades  
          **Business & Regulatory**: Policy changes, partnerships, company news
          **General Market**: Focus on broader crypto market developments, major protocol launches, and institutional activity
          
          IMPORTANT: Only include news from the last 2-3 days. Do not repeat news that would have been covered in yesterday's newsletter. Focus on the most recent developments and avoid outdated price information. Keep it concise but informative with specific details.`
        }
      ],
      verbosity: "balanced", 
      response_format: "markdown",
      inline_citations: false,
      stream: false,
      generate_related_questions: 0
    }, {
      timeout: 120000, // Extended to 2 minutes for complex comprehensive requests
      headers: {
        'accept': 'application/json',
        'x-messari-api-key': 'f4e1aead-3412-446e-abac-8819357d6075',
        'content-type': 'application/json'
      }
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      const content = response.data.choices[0].message.content;
      console.log(`✅ Messari AI generated ${content.length} character comprehensive brief`);
      
      // Get dedicated portfolio company news
      const portfolioNews = await getPortfolioCompanyNewsFromMessari();
      
      let combinedContent = content;
      if (portfolioNews && portfolioNews.trim().length > 100) {
        // Truncate portfolio news to prevent token overflow
        const truncatedPortfolioNews = portfolioNews.slice(0, 3000); // Limit to 3000 chars
        combinedContent += `\n\n# Dedicated Portfolio Company News\n\n${truncatedPortfolioNews}`;
        console.log(`✅ Added dedicated portfolio company news to content (${truncatedPortfolioNews.length} chars)`);
      } else {
        console.log('📭 No additional portfolio company news found');
      }
      
      return {
        content: combinedContent,
        sources: response.data.citations || [],
        generatedAt: new Date().toISOString()
      };
    }
  } catch (error) {
    console.log(`❌ Comprehensive request failed: ${error.message}`);
    
    // Fallback to simpler request
    try {
      console.log('🔄 Trying simplified news brief...');
      const response = await axios.post('https://api.messari.io/ai/openai/chat/completions', {
        messages: [
          {
            role: "user",
            content: `Generate a concise crypto news brief for ${today} covering the most important developments from the last 2-3 days. Include market news, tech updates, business moves, and regulatory updates. Focus on developments that wouldn't have been in yesterday's news. Keep it focused and current.`
          }
        ],
        verbosity: "balanced",
        response_format: "markdown",
        stream: false,
        generate_related_questions: 0
      }, {
        timeout: 30000,
        headers: {
          'accept': 'application/json',
          'x-messari-api-key': 'f4e1aead-3412-446e-abac-8819357d6075',
          'content-type': 'application/json'
        }
      });

      if (response.data && response.data.choices && response.data.choices[0]) {
        const content = response.data.choices[0].message.content;
        console.log(`✅ Messari AI generated ${content.length} character simplified brief`);
        
        // Get dedicated portfolio company news
        const portfolioNews = await getPortfolioCompanyNewsFromMessari();
        
        let combinedContent = `# Crypto Daily Brief – ${today}\n\n${content}`;
        if (portfolioNews && portfolioNews.trim().length > 100) {
          // Truncate portfolio news to prevent token overflow
          const truncatedPortfolioNews = portfolioNews.slice(0, 3000); // Limit to 3000 chars
          combinedContent += `\n\n# Dedicated Portfolio Company News\n\n${truncatedPortfolioNews}`;
          console.log(`✅ Added dedicated portfolio company news to simplified brief (${truncatedPortfolioNews.length} chars)`);
        }
        
        return {
          content: combinedContent,
          sources: response.data.citations || [],
          generatedAt: new Date().toISOString()
        };
      }
    } catch (simplifiedError) {
      console.log(`❌ Simplified request also failed: ${simplifiedError.message}`);
      
      // Ultra-minimal request as last resort
      try {
        console.log('🔄 Last resort: minimal news brief...');
        const response = await axios.post('https://api.messari.io/ai/openai/chat/completions', {
          messages: [
            {
              role: "user",
              content: `Brief crypto news update for ${today}. Focus only on major developments from today.`
            }
          ],
          verbosity: "concise",
          stream: false
        }, {
          timeout: 20000,
          headers: {
            'accept': 'application/json',
            'x-messari-api-key': 'f4e1aead-3412-446e-abac-8819357d6075',
            'content-type': 'application/json'
          }
        });

        if (response.data && response.data.choices && response.data.choices[0]) {
          const content = response.data.choices[0].message.content;
          console.log(`✅ Messari AI generated ${content.length} character minimal brief`);
          return {
            content: `# Crypto Daily Brief – ${today}\n\n${content}`,
            sources: [],
            generatedAt: new Date().toISOString()
          };
        }
      } catch (minimalError) {
        console.log(`❌ All Messari AI requests failed: ${minimalError.message}`);
      }
    }
  }

  // Return fallback content if all requests fail
  console.log('🔄 Generating fallback news brief...');
  return generateFallbackBrief();
}

// Generate a simple fallback brief when Messari AI is unavailable
function generateFallbackBrief() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    content: `# Crypto Daily Brief – ${today}

## Service Notice
Our news generation service is temporarily experiencing high demand. Please check back later for today's comprehensive crypto news update.

## Market Status
- Major cryptocurrencies continue trading across global exchanges
- DeFi protocols and institutional adoption remain active
- Regulatory developments and tech updates ongoing

*This is a fallback message. Full news service will resume shortly.*`,
    sources: [],
    generatedAt: new Date().toISOString()
  };
}

// Simple Messari Data API fallback  
async function fetchMessariAPI() {
  try {
    console.log('📊 Fetching from Messari Data API...');
    const response = await axios.get('https://data.messari.io/api/v1/news', {
      headers: {
        'accept': 'application/json',
        'x-messari-api-key': 'f4e1aead-3412-446e-abac-8819357d6075'
      },
      params: {
        limit: 10
      }
    });

    if (response.data && response.data.data) {
      const articles = response.data.data.slice(0, 5).map(article => ({
        title: article.title,
        summary: article.content ? article.content.substring(0, 200) + '...' : 'No summary available',
        url: article.url
      }));
      
      console.log(`✅ Retrieved ${articles.length} articles from Messari Data API`);
      return articles;
    }
  } catch (error) {
    console.log(`❌ Messari Data API error: ${error.message}`);
    return [];
  }
}

export { generateNewsWithMessariAI, generateFallbackBrief, fetchMessariAPI }; 