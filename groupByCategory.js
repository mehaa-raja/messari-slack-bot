require("dotenv").config();

const PANTERA_COMPANIES = process.env.PANTERA_PORTFOLIO_COMPANIES
  ? process.env.PANTERA_PORTFOLIO_COMPANIES.split(",").map(c => c.trim().toLowerCase())
  : [];

function groupByCategory(articles) {
  const grouped = {
    "🚀 Bitcoin": [],
    "🏦 Ethereum": [],
    "🌐 Altcoins & DeFi": [],
    "🏛️ Regulatory & Political Moves": [],
    "🤖 AI Meets Crypto": [],
    "🌍 Global & Macro Trends": []
  };

  const panteraMentions = [];

  for (let article of articles) {
    const text = article.title.toLowerCase() + " " + article.content.toLowerCase();

    // Only include if the news is ABOUT the company (not just mentioning it)
    const isAboutPanteraCompany = PANTERA_COMPANIES.some(company => {
      const companyLower = company.toLowerCase();
      // Check if company name is in the title (strong signal it's about the company)
      if (article.title.toLowerCase().includes(companyLower)) {
        return true;
      }
      // Or if it's mentioned multiple times in content (not just passing reference)
      const contentLower = article.content.toLowerCase();
      // Escape special regex characters in company name
      const escapedCompany = companyLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const mentions = (contentLower.match(new RegExp(escapedCompany, 'g')) || []).length;
      return mentions >= 2;
    });

    if (isAboutPanteraCompany) {
      panteraMentions.push(article);
    }

    if (/bitcoin/.test(text)) grouped["🚀 Bitcoin"].push(article);
    else if (/ethereum|eth/.test(text)) grouped["🏦 Ethereum"].push(article);
    else if (/altcoin|defi|sui|ada|ton/.test(text)) grouped["🌐 Altcoins & DeFi"].push(article);
    else if (/regulat|senate|congress|politic|irs|tax|etf/.test(text)) grouped["🏛️ Regulatory & Political Moves"].push(article);
    else if (/ai|agent|perplexity|studio|model/.test(text)) grouped["🤖 AI Meets Crypto"].push(article);
    else grouped["🌍 Global & Macro Trends"].push(article);
  }

  return { grouped, panteraMentions };
}

module.exports = groupByCategory;
