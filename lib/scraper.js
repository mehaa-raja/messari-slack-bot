import axios from 'axios';

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
          content: "You are a professional crypto news analyst with access to real-time data. Provide comprehensive, well-structured daily briefs that include market context, key developments, and their implications. Focus on the most significant stories, trends, major funding rounds, partnerships, protocol launches, and institutional developments across all sectors of crypto."
        },
        {
          role: "user",
          content: `Please provide today's (${today}) comprehensive crypto news brief covering:
          
          1. Major market movements and price action
          2. Significant funding rounds, acquisitions, and investments
          3. Protocol launches, upgrades, and major announcements  
          4. Institutional partnerships and enterprise adoption
          5. Regulatory developments and policy changes
          6. DeFi protocol updates and infrastructure developments
          7. Notable developments from major crypto projects and companies
          
          Include specific details about amounts, partnerships, and institutional activity. Format as a professional newsletter with clear sections covering all major crypto news for the day.`
        }
      ],
      verbosity: "verbose",
      response_format: "markdown",
      inline_citations: true,
      stream: false,
      generate_related_questions: 0
    }, {
      timeout: 60000, // Increased to 60 seconds
      headers: {
        'accept': 'application/json',
        'x-messari-api-key': 'f4e1aead-3412-446e-abac-8819357d6075',
        'content-type': 'application/json'
      }
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      const content = response.data.choices[0].message.content;
      console.log(`✅ Messari AI generated ${content.length} character comprehensive brief`);
      
      return {
        content: content,
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
            content: `What are today's top 5 crypto news stories? Give me a brief summary.`
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
        
        return {
          content: `# Crypto Daily Brief – ${today}\n\n${content}`,
          sources: response.data.citations || [],
          generatedAt: new Date().toISOString()
        };
      }
    } catch (simplifiedError) {
      console.log(`❌ Simplified request also failed: ${simplifiedError.message}`);
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