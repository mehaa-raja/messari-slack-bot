function formatSlackMessage(topStories = [], panteraMentions = []) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  let message = `📰 *Crypto Daily Brief – ${today}*\nYour 5-minute crypto market wrap-up from Messari\n`;

  const emojis = ["🚀", "🏦", "🌐", "🏛️", "🤖", "🌍"];
  const getEmoji = (i) => emojis[i % emojis.length];

  // Top Market Stories
  if (topStories.length > 0) {
    message += `\n🔥 *Top Market Stories*\n`;
    topStories.forEach((story, i) => {
      message += `${getEmoji(i)} *${story.title.trim()}*\n${story.content.trim()} [<${story.link}|Read more>]\n\n`;
    });
  } else {
    message += `\nNo top stories found today.\n`;
  }

  // Pantera Mentions
  if (panteraMentions.length > 0) {
    message += `\n💼 *Pantera Portfolio Highlights*\n`;
    panteraMentions.forEach((story, i) => {
      message += `🔷 *${story.title.trim()}*\n${story.content.trim()} [<${story.link}|Read more>]\n\n`;
    });
  }

  message += `\n---\n_Powered by Messari Intelligence | Auto-generated_`;
  return message;
}

module.exports = { formatSlackMessage };
