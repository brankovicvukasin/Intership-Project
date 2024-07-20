const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const cheerio = require("cheerio");
const { KEYWORDS, CACHE_FILE, WEBSITE_URL } = require("./constants");

const previousContentPath = path.join(__dirname, CACHE_FILE);

const fetchWebsiteContent = async (url) => {
  const response = await axios.get(url);
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
  return relevantContent;
};

const detectChanges = async (oldContent, newContent) => {
  if (oldContent === newContent) {
    console.log("No changes detected.");
  } else {
    console.log("Changes detected, new content is written!");
    await fs.writeFile(previousContentPath, newContent, "utf-8");
  }
};

const extractKeywords = (text) => {
  const words = text.toLowerCase().match(/\b(\w+)\b/g);
  const keywordsCounts = {};

  words.forEach((word) => {
    split_words = word.split(" ");
    split_words.forEach((split_word) => {
      KEYWORDS.forEach((keyword) => {
        if (split_word === keyword) {
          keywordsCounts[word] = (keywordsCounts[word] || 0) + 1;
        }
      });
    });
  });

  return keywordsCounts;
};

const checkForChanges = async () => {
  console.log("Checking for changes...");

  try {
    const newContent = await fetchWebsiteContent(WEBSITE_URL);

    if (
      await fs
        .access(previousContentPath)
        .then(() => true)
        .catch(() => false)
    ) {
      const oldContent = (await fs.readFile(previousContentPath, "utf-8"))
        .replace(/\s+/g, " ")
        .trim();
      await detectChanges(oldContent, newContent);
    } else {
      await fs.writeFile(previousContentPath, newContent, "utf-8");
      console.log("Initial content saved.");
    }

    const keywordsCounts = extractKeywords(newContent);
    console.log("Keywords Counts:", keywordsCounts);
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
  }
};

exports.getKeywords = async (req, res) => {
  try {
    let { url } = req.query;

    const newContent = await fetchWebsiteContent(url);

    const keywordsCounts = extractKeywords(newContent);

    const keywordArray = Object.keys(keywordsCounts).map((key) => ({
      keyword: key,
      value: keywordsCounts[key],
    }));

    console.log(keywordArray);

    res.status(200).json({
      keywords: keywordArray,
      message: "success",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Keywords not found",
      error: error.message,
    });
  }
};
