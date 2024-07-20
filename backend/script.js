const axios = require("axios");
require("dotenv").config();
const cheerio = require("cheerio");
const { KEYWORDS } = require("./constants");
const ScriptAnalysis = require("./Models/ScriptAnalysisModel");

const checkForChanges = async () => {
  try {
    const response = await axios.get(process.env.ANALYSIS_URL);

    const $ = cheerio.load(response.data);
    const relevantContent = $("body")
      .clone()
      .find("script")
      .end()
      .remove()
      .find("style")
      .remove()
      .end()
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const words = relevantContent.toLowerCase().match(/\b(\w+)\b/g);

    const keywordsCounts = {};
    let individualKeywords = [];
    let compoundKeywordsMap = {};

    KEYWORDS.forEach((keyword) => {
      if (keyword.startsWith("(") && keyword.endsWith(")")) {
        const parts = keyword.slice(1, -1).split("+");
        parts.forEach((part) => {
          individualKeywords.push(part);
          compoundKeywordsMap[part] = keyword;
        });
      } else {
        individualKeywords.push(keyword);
      }
    });

    words.forEach((word) => {
      individualKeywords.forEach((keyword) => {
        if (word === keyword.toLowerCase()) {
          keywordsCounts[word] = (keywordsCounts[word] || 0) + 1;
        }
      });
    });

    let combinedKeywordsCounts = {};
    Object.keys(keywordsCounts).forEach((key) => {
      if (compoundKeywordsMap[key]) {
        let compoundKey = compoundKeywordsMap[key];
        if (!combinedKeywordsCounts[compoundKey]) {
          combinedKeywordsCounts[compoundKey] = 0;
        }
        combinedKeywordsCounts[compoundKey] += keywordsCounts[key];
      } else {
        combinedKeywordsCounts[key] = keywordsCounts[key];
      }
    });

    const keywordArray = Object.keys(combinedKeywordsCounts).map((key) => ({
      keyword: key,
      value: combinedKeywordsCounts[key],
    }));

    keywordArray.sort((a, b) => b.value - a.value);

    const newAnalysis = new ScriptAnalysis({
      foundKeywords: keywordArray,
    });

    //await newAnalysis.save();
    console.log("Data saved to database");
  } catch (error) {
    console.error("Error", error);
  }
};

module.exports = { checkForChanges };
