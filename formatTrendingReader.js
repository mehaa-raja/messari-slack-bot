function formatTrendingReader(topics, panteraMentions = []) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let newsletter = `🔥 **CRYPTO TRENDING TOPICS**\n`;
  newsletter += `📅 ${dateStr}\n`;
  newsletter += `📊 ${topics.length} trending topics • Real-time market signals\n\n`;
  newsletter += `─────────────────────────────────\n\n`;

  // Pantera portfolio company mentions first (if any)
  if (panteraMentions.length > 0) {
    newsletter += `🚀 **PORTFOLIO TRENDING**\n\n`;
    
    panteraMentions.slice(0, 3).forEach((topic, index) => {
      const engagement = topic.documentCount ? `📈 ${topic.documentCount} mentions` : '';
      const assets = topic.assets.map(a => `$${a.symbol}`).join(', ');
      
      newsletter += `**#${topic.rank} ${topic.title}**\n`;
      if (assets) newsletter += `🏷️ ${assets}\n`;
      if (engagement) newsletter += `${engagement}\n`;
      newsletter += `${topic.content}\n`;
      if (topic.url) newsletter += `🔗 [View source](${topic.url})\n`;
      newsletter += `\n`;
    });
    
    newsletter += `─────────────────────────────────\n\n`;
  }

  // Main trending topics
  newsletter += `📈 **TOP TRENDING TOPICS**\n\n`;

  topics.slice(0, 10).forEach((topic, index) => {
    const engagement = topic.documentCount ? `📈 ${topic.documentCount} mentions` : '';
    const assets = topic.assets.map(a => `$${a.symbol}`).join(', ');
    const categories = topic.classes.slice(0, 2).join(', ');
    
    newsletter += `**#${topic.rank} ${topic.title}**\n`;
    
    // Add metadata line
    let metadata = [];
    if (assets) metadata.push(`🏷️ ${assets}`);
    if (engagement) metadata.push(engagement);
    if (categories) metadata.push(`📂 ${categories}`);
    if (metadata.length > 0) {
      newsletter += `${metadata.join(' • ')}\n`;
    }
    
    newsletter += `${topic.content}\n`;
    if (topic.url) newsletter += `🔗 [View source](${topic.url})\n`;
    newsletter += `\n`;
    
    // Add separator between topics (except last one)
    if (index < Math.min(topics.length - 1, 9)) {
      newsletter += `• • •\n\n`;
    }
  });

  newsletter += `─────────────────────────────────\n`;
  newsletter += `🚨 **Live Market Intelligence**\n`;
  newsletter += `📊 Powered by Messari Signal • Real-time trending analysis\n`;
  newsletter += `🔥 Updated continuously • Stay ahead of the trends`;

  return newsletter;
}

module.exports = formatTrendingReader; 