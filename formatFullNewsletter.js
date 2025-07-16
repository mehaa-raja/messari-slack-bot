function formatFullNewsletter(groupedStories, panteraMentions = []) {
    const date = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  
   let message = `📰 *Crypto Daily Brief – ${date}*\nYour 5-minute crypto market wrap-up from Messari\n\n`;
  
   // Pantera Section
  if (panteraMentions.length > 0) {
    message += `🏢 *Pantera Portfolio Mentions*\n`;
    panteraMentions.forEach(story => {
      message += `*${story.title}*:\n`;
      const sentences = getBulletPoints(story.summary);
      sentences.forEach(sentence => {
        message += `• ${sentence}\n`;
      });
      message += `<${story.url}|Read more>\n`;
    });
    message += `\n`;
  }
  
   // Emoji & Category labels
  const categoryConfig = {
    Bitcoin: { emoji: '🚀', name: 'Bitcoin' },
    Ethereum: { emoji: '🏦', name: 'Ethereum' },
    Altcoins: { emoji: '🌐', name: 'Altcoins & DeFi' },
    DeFi: { emoji: '🌐', name: 'Altcoins & DeFi' },
    Regulatory: { emoji: '🏛️', name: 'Regulatory & Political Moves' },
    AI: { emoji: '🤖', name: 'AI Meets Crypto' },
    Global: { emoji: '🌍', name: 'Global & Macro Trends' },
  };
  
  Object.entries(groupedStories).forEach(([category, stories]) => {
    if (stories.length === 0) return;
  
    const { emoji, name } = categoryConfig[category] || { emoji: '', name: category };
    const topStory = stories[0];
  
    message += `${emoji} *${name}*\n`;
    message += `*${topStory.title}*:\n`;
    const sentences = getBulletPoints(topStory.summary);
    sentences.forEach(sentence => {
      message += `• ${sentence}\n`;
    });
    message += `<${topStory.url}|Read more>\n\n`;
  });
  
  return message.trim();
}

// Helper: Create clear, meaningful bullet points
function getBulletPoints(summary) {
  if (!summary) return [];
  
  // Clean up the summary
  let clean = summary.replace(/Key Insights:?/gi, '').trim();
  
  // Be very conservative - only split on clear sentence boundaries
  // Avoid splitting on decimals, abbreviations, etc.
  const sentences = clean.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(s => s.trim().length > 30);
  
  // If we have 2+ clear sentences, use them
  if (sentences.length >= 2) {
    return sentences.slice(0, 3).map(s => {
      let bullet = s.trim();
      if (!/[.!?]$/.test(bullet)) bullet += '.';
      return bullet;
    });
  }
  
  // If the summary is reasonably short, just use it as one bullet
  if (clean.length < 200) {
    return [clean + (!/[.!?]$/.test(clean) ? '.' : '')];
  }
  
  // For longer summaries, try to split on natural breaks more carefully
  const chunks = clean.split(/\.\s+(?=\w+\s+(?:is|are|has|have|will|was|were|can|could|should|would))/);
  if (chunks.length > 1) {
    return chunks.slice(0, 2).map(chunk => {
      let bullet = chunk.trim();
      if (bullet.length > 30) {
        if (!/[.!?]$/.test(bullet)) bullet += '.';
        return bullet;
      }
      return null;
    }).filter(Boolean);
  }
  
  // Last resort: Return the whole summary as one bullet
  return [clean + (!/[.!?]$/.test(clean) ? '.' : '')];
}

module.exports = formatFullNewsletter;
