function formatNewsReader(articles, panteraMentions = []) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let newsletter = `📺 **CRYPTO NEWS BRIEFING**\n`;
  newsletter += `📅 ${dateStr}\n`;
  newsletter += `📰 ${articles.length} stories • Powered by Messari\n\n`;
  newsletter += `─────────────────────────────────\n\n`;

  // Pantera portfolio company mentions first (if any)
  if (panteraMentions.length > 0) {
    newsletter += `🚀 **PORTFOLIO COMPANY SPOTLIGHT**\n\n`;
    
    panteraMentions.slice(0, 3).forEach((story, index) => {
      newsletter += `**${index + 1}. ${story.title}**\n`;
      newsletter += `${story.content}\n`;
      newsletter += `🔗 [Read more](${story.url})\n\n`;
    });
    
    newsletter += `─────────────────────────────────\n\n`;
  }

  // Main news stories
  newsletter += `📈 **TODAY'S TOP CRYPTO NEWS**\n\n`;

  articles.slice(0, 8).forEach((story, index) => {
    const storyNumber = index + 1;
    const publishedDate = new Date(story.publishedAt).toLocaleDateString();
    
    newsletter += `**${storyNumber}. ${story.title}**\n`;
    newsletter += `📅 ${publishedDate}\n`;
    newsletter += `${story.content}\n`;
    newsletter += `🔗 [Full story](${story.url})\n\n`;
    
    // Add separator between stories (except last one)
    if (index < Math.min(articles.length - 1, 7)) {
      newsletter += `• • •\n\n`;
    }
  });

  newsletter += `─────────────────────────────────\n`;
  newsletter += `📊 **Market Intelligence by Messari**\n`;
  newsletter += `🔄 Updated every hour • Real-time crypto insights\n`;
  newsletter += `📱 Stay informed, stay ahead`;

  return newsletter;
}

module.exports = formatNewsReader; 