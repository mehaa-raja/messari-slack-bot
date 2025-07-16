require("dotenv").config();

const PANTERA_COMPANIES = process.env.PANTERA_PORTFOLIO_COMPANIES
  ? process.env.PANTERA_PORTFOLIO_COMPANIES.split(",").map(c => c.trim().toLowerCase())
  : [];

function groupTrendingTopics(topics) {
  const panteraMentions = [];

  for (let topic of topics) {
    // Check if any associated assets match Pantera portfolio companies
    const hasPortfolioAsset = topic.assets.some(asset => 
      PANTERA_COMPANIES.includes(asset.slug?.toLowerCase())
    );

    // Also check title and content for company mentions
    const titleContent = (topic.title + " " + topic.content).toLowerCase();
    const hasPortfolioMention = PANTERA_COMPANIES.some(company => {
      const companyLower = company.toLowerCase();
      // Escape special regex characters in company name
      const escapedCompany = companyLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const mentions = (titleContent.match(new RegExp(escapedCompany, 'g')) || []).length;
      return mentions >= 1; // Even one mention in trending topics is significant
    });

    if (hasPortfolioAsset || hasPortfolioMention) {
      panteraMentions.push(topic);
    }
  }

  // Sort remaining topics by rank
  const remainingTopics = topics.filter(topic => 
    !panteraMentions.some(pm => pm.title === topic.title)
  ).sort((a, b) => a.rank - b.rank);

  return { 
    topics: remainingTopics, 
    panteraMentions: panteraMentions.sort((a, b) => a.rank - b.rank) 
  };
}

module.exports = groupTrendingTopics; 