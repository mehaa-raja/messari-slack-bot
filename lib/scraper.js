import axios from 'axios';

// Dedicated portfolio company news request
async function getPortfolioCompanyNewsFromMessari() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  try {
    console.log('💎 Fetching dedicated Pantera portfolio company news...');
    const response = await axios.post('https://api.messari.io/ai/openai/chat/completions', {
      messages: [
        {
          role: "user",
          content: `What are the top recent news and developments regarding Pantera Capital portfolio companies from the last 2-3 days? Include funding rounds, strategic investments, product launches, partnerships, and any other significant business developments. Focus on companies like Circle, Lido, Solana Labs, Near Protocol, Polkadot, Arbitrum, Injective, Ondo, Morpho, Worldcoin, Filecoin, Uniswap, Ethena, Wintermute, StarkWare, Bitstamp, OpenMind, Subzero Labs, and other major Pantera portfolio companies.`
        }
      ],
      verbosity: "balanced",
      response_format: "markdown",
      inline_citations: false,
      stream: false,
      generate_related_questions: 0
    }, {
      timeout: 60000,
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
    }
  } catch (error) {
    console.log(`❌ Portfolio news request failed: ${error.message}`);
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

  // Try comprehensive request first, then get dedicated portfolio news
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
        combinedContent += `\n\n# Dedicated Portfolio Company News\n\n${portfolioNews}`;
        console.log('✅ Added dedicated portfolio company news to content');
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
            content: `What are today's top 5 crypto news stories from the last 2-3 days? Focus on broader market developments, protocol launches, and institutional activity. Exclude Pantera-specific news as that will be covered separately. Focus on developments that wouldn't have been in yesterday's news. Only include fresh information - no outdated price data.`
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
          combinedContent += `\n\n# Dedicated Portfolio Company News\n\n${portfolioNews}`;
          console.log('✅ Added dedicated portfolio company news to simplified brief');
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
              content: `Summarize today's top crypto news from the last 2-3 days in 3-4 bullet points. Include any major RECENT Pantera portfolio company business developments if they exist. Focus on developments that wouldn't have been covered yesterday. Only include fresh developments, not outdated information or companies with no news.`
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
            content: `# Crypto Daily Brief – ${today}\n\n${content}`,
            sources: response.data.citations || [],
            generatedAt: new Date().toISOString()
          };
        }
      } catch (minimalError) {
        console.log(`❌ All Messari AI attempts failed. Last error: ${minimalError.message}`);
        throw new Error('All Messari AI request attempts failed');
      }
    }
  }
  
  throw new Error('No valid response received from Messari AI');
}

// Fallback: Simple brief if main pipeline fails
async function generateFallbackBrief() {
  console.log('🔄 Generating fallback brief...');
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    content: `# Crypto Daily Brief – ${today}

## Market Overview
- The crypto market continues to show dynamic activity with ongoing developments across major protocols and institutions.
- Bitcoin and Ethereum remain focal points for institutional adoption and regulatory discussions.

## Major Developments  
- DeFi protocols continue innovation with new features and upgrades
- Regulatory landscape evolving with new guidance and frameworks
- Infrastructure improvements across Layer 1 and Layer 2 solutions

*Note: This is a fallback brief. Please check individual sources for the most current information.*`,
    sources: [],
    generatedAt: new Date().toISOString()
  };
}

// Messari Data API fallback
async function fetchMessariAPI() {
  console.log('📡 Fetching crypto news from Messari Data API...');
  
  try {
    const response = await axios.get('https://data.messari.io/api/v1/news', {
      params: {
        fields: 'title,content,url,published_at',
        limit: 20
      },
      headers: {
        'x-messari-api-key': 'f4e1aead-3412-446e-abac-8819357d6075'
      },
      timeout: 15000
    });

    if (response.data && response.data.data) {
      console.log(`✅ Retrieved ${response.data.data.length} articles from Messari Data API`);
      return response.data.data;
    }
  } catch (error) {
    console.log(`❌ Messari Data API error: ${error.message}`);
    throw error;
  }
}

export { generateNewsWithMessariAI, generateFallbackBrief, fetchMessariAPI }; 