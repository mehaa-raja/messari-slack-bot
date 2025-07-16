const axios = require("axios");
require("dotenv").config();

const MESSARI_API_KEY = process.env.MESSARI_API_KEY;

async function summarizeWithAI(content) {
  const headers = {
    "x-messari-api-key": MESSARI_API_KEY,
    "Content-Type": "application/json",
  };

  const prompt = `Write a professional crypto newsletter summary in the same tone and style as these examples:

EXAMPLE STYLE:
"XRP is breaking out of consolidation, hinting at a bullish move. India is pivoting away from BRICS to strengthen US trade ties, reinforcing the dollar's dominance in global commerce. BlackRock's iShares Bitcoin Trust (IBIT) is now the largest corporate Bitcoin holder, and over 1,000 new Bitcoin ATMs were installed globally in the first half of 2025."

"Lawmakers are set to debate key digital asset bills during 'Crypto Week.' The US Treasury and IRS have repealed the 'crypto broker' tax rule, signaling a friendlier regulatory stance. The Senate aims to finalize digital asset regulations by September, seeking to keep the US at the forefront of crypto innovation."

WRITING STYLE REQUIREMENTS:
- Professional but engaging tone
- Include specific metrics and data points when available
- Connect events to broader market implications
- Use active voice and engaging language
- Explain why developments matter
- 2-3 concise sentences maximum
- Focus on actionable insights

Summarize this crypto news in the same style:\n"${content}"`;

  try {
    const res = await axios.post("https://api.messari.io/ai/openai/chat/completions", {
      messages: [{ role: "user", content: prompt }],
      verbosity: "balanced",
      response_format: "markdown",
      stream: false,
    }, { headers });

    return res.data?.choices?.[0]?.message?.content?.trim() || "Summary not available.";
  } catch (error) {
    console.log("⚠️  AI summarization failed, using enhanced fallback");
    
    // Enhanced fallback: Try to create a professional summary
    let processedContent = content
      .replace(/Key Insights:?/gi, '')
      .replace(/^\s*[-•]\s*/gm, '')
      .trim();
    
    // Extract key sentences and metrics
    const sentences = processedContent.split(/[.!?]+/).filter(s => s.trim().length > 15);
    
    if (sentences.length >= 2) {
      // Try to find sentences with metrics, implications, or market context
      const prioritySentences = sentences.filter(s => 
        /(\$\d+|\d+%|\d+\.\d+|billion|million|trillion|up|down|increase|decrease|surge|rally|bullish|bearish)/i.test(s)
      );
      
      if (prioritySentences.length >= 2) {
        return prioritySentences.slice(0, 2).join('. ').trim() + '.';
      }
    }
    
    // Fallback to first 2-3 sentences with better formatting
    const summary = sentences.slice(0, 2).join('. ').trim();
    return summary.length > 0 ? summary + '.' : content.slice(0, 200) + '...';
  }
}

module.exports = summarizeWithAI;
