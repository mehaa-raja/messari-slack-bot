import axios from 'axios';

// Dedicated portfolio company news request
async function getPortfolioCompanyNewsFromMessari() {
  try {
    console.log('💎 Fetching dedicated Pantera portfolio company news...');
    const today = new Date().toISOString().split('T')[0];
    
    const response = await axios.post('https://api.messari.io/ai/openai/chat/completions', {
      messages: [
        {
          role: 'system',
          content: 'You are a crypto news analyst focused on Pantera Capital portfolio companies. Provide comprehensive, recent news about their business developments, funding, partnerships, and strategic moves.'
        },
        {
          role: 'user', 
          content: `Please provide detailed news and developments about Pantera Capital portfolio companies from the last 2-3 days. Focus on:

- Business developments, funding rounds, product launches
- Strategic partnerships and integrations  
- Major announcements or milestones
- Regulatory or policy impacts
- Market performance with business context (not just price movements)

Please include companies like: Ondo Finance, Circle, Lido, Solana Labs, Near Protocol, Injective Protocol, Chainlink, Bitstamp, Uniswap Labs, Filecoin, Arbitrum, Ethena, Morpho, Wintermute, Subzero Labs, OpenMind, and other major Pantera portfolio companies.

Format as a comprehensive news brief with clear section headers and detailed context for each development.`
        }
      ],
      verbosity: 'balanced',
      response_format: 'markdown',
      stream: false,
      generate_related_questions: 0
    }, {
      timeout: 45000, // 45 seconds for dedicated request
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
          content: "You are a crypto news analyst. Generate a concise daily brief covering today's most important crypto developments. Focus on major news stories, market movements, and significant company updates."
        },
        {
          role: "user",
          content: `Write today's (${today}) crypto news brief covering the most important developments in:

          **Market News**: Price movements, funding rounds, institutional activity
          **Tech Updates**: Protocol launches, DeFi developments, upgrades  
          **Business & Regulatory**: Policy changes, partnerships, company news
          **Pantera Portfolio**: News from Circle, Lido, Solana Labs, Near Protocol, Polkadot, Arbitrum, Injective, Ondo, Morpho, Worldcoin, Filecoin, Uniswap, Ethena, Wintermute, StarkWare, Bitstamp, OpenMind, Subzero Labs, or other major Pantera companies
          
          Keep it concise but informative with specific details.`
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
            content: `What are today's top 5 crypto news stories? Also include any news about Pantera Capital portfolio companies like Circle, Solana Labs, Uniswap Labs, Polkadot, Bitstamp, Injective Protocol, Alchemy, Lido, Morpho, Near Protocol, Ondo, OpenMind, Subzero Labs, or other major crypto projects they've invested in. Give me a brief summary.`
          }
        ],
        verbosity: "balanced",
        response_format: "markdown",
        inline_citations: false,
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
      
      // Last attempt: Ultra-minimal request
      try {
        console.log('🔄 Trying ultra-minimal request...');
        const response = await axios.post('https://api.messari.io/ai/openai/chat/completions', {
          messages: [
            {
              role: "user",
              content: `Summarize today's top crypto news in 3-4 bullet points. Include any major Pantera portfolio company news if available.`
            }
          ],
          verbosity: "simple",
          response_format: "text",
          inline_citations: false,
          stream: false
        }, {
          timeout: 20000, // 20 seconds for minimal request
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
            content: `# Crypto Daily Brief – ${today}\n\n## Today's Key Developments\n\n${content}`,
            sources: [],
            generatedAt: new Date().toISOString()
          };
        }
      } catch (minimalError) {
        console.log(`❌ All Messari AI attempts failed: ${minimalError.message}`);
      }
      
      throw simplifiedError;
    }
  }
  
  return null;
}

// Fallback: Generate basic news summary if AI fails
async function generateFallbackBrief() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    content: `# Crypto Daily Brief – ${today}

⚠️ **Service temporarily unavailable**

We're currently unable to fetch the latest crypto news due to technical issues. Please check back later for today's comprehensive market update.

## What to expect in our daily brief:
- 📈 Major market movements and price analysis
- 🏦 DeFi protocol updates and developments  
- ⚖️ Regulatory news and policy changes
- 🛠️ Infrastructure and technology developments
- 💰 Funding rounds and partnerships

*This is a fallback message. Normal service will resume shortly.*`,
    sources: [],
    generatedAt: new Date().toISOString()
  };
}

// Main function to generate crypto news brief
export async function scrapeMessariNews() {
  console.log('🧠 Generating crypto news brief with Messari AI...');
  
  try {
    // Primary approach: Use Messari AI to generate comprehensive news brief
    const newsBrief = await generateNewsWithMessariAI();
    if (newsBrief && newsBrief.content) {
      console.log('✅ Messari AI generated comprehensive news brief');
      return newsBrief;
    } else {
      throw new Error('Messari AI returned no content');
    }
  } catch (aiError) {
    console.log(`❌ Messari AI failed: ${aiError.message}`);
    
    // Fallback: Generate basic message
    console.log('📝 Generating fallback brief...');
    const fallbackBrief = await generateFallbackBrief();
    
    console.log(`✅ Fallback brief generated`);
    return fallbackBrief;
  }
} 