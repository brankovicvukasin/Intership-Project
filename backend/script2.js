const axios = require("axios");
require("dotenv").config();
const Keywords = require("./Models/KeywordsModel");
const ScriptAnalysis = require("./Models/ScriptAnalysisModel");
const Supply = require("./Models/SupplyModel");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const path = require("path");

const checkForNewKeywords = async () => {
  const UNWANTED_KEYWORDS = [
    "High",
    "Medium",
    "Fixed Price",
    "NON-BILLABLE",
    "Time & Material",
    "Miloš Ivanović",
    "Dejan Varmeđa",
  ];

  try {
    const existingKeywordsDoc = await Keywords.findOne({});
    const existingKeywords = existingKeywordsDoc
      ? existingKeywordsDoc.allKeywords
      : [];

    const response = await axios.get(
      "https://boards.vegait.rs/api/v1/projects/50/tags_colors",
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
        },
      }
    );

    const fetchedKeywords = Object.keys(response.data).filter(
      (key) => !key.includes(" - ")
    );

    const newKeywords = fetchedKeywords.filter(
      (keyword) =>
        !existingKeywords.includes(keyword) &&
        !UNWANTED_KEYWORDS.includes(keyword)
    );

    if (newKeywords.length > 0) {
      if (existingKeywordsDoc) {
        existingKeywordsDoc.allKeywords.push(...newKeywords);
        await existingKeywordsDoc.save();
      } else {
        const newKeywordsDoc = new Keywords({ allKeywords: newKeywords });
        await newKeywordsDoc.save();
      }
      console.log("New keywords saved to database:", newKeywords);
    } else {
      console.log("No new keywords found");
    }
  } catch (error) {
    console.error("Error", error);
  }
};

const checkForChanges = async () => {
  try {
    const response = await axios.get(
      "https://boards.vegait.rs/api/v1/userstories?include_attachments=1&include_tasks=1&project=50&status__is_archived=false",
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
          "X-Disable-Pagination": "1",
        },
      }
    );

    const filteredResults = response.data.filter((item) => {
      const name = item.status_extra_info.name.toLowerCase();
      return (
        name.includes("time & material") ||
        name.includes("fixed-price") ||
        name.includes("vega it proposal") ||
        name.includes("with the client")
      );
    });

    const existingKeywordsDocs = await Keywords.findOne({});

    const existingKeywords = existingKeywordsDocs.allKeywords;

    const tagCounts = {};

    filteredResults.forEach((result) => {
      if (result.tags) {
        result.tags.forEach((tag) => {
          if (existingKeywords.includes(tag[0])) {
            if (tagCounts[tag[0]]) {
              tagCounts[tag[0]]++;
            } else {
              tagCounts[tag[0]] = 1;
            }
          }
        });
      }
    });

    const keywords = Object.keys(tagCounts).map((key) => ({
      keyword: key,
      value: tagCounts[key],
    }));

    keywords.sort((a, b) => b.value - a.value);

    const newAnalysis = new ScriptAnalysis({
      foundKeywords: keywords,
    });

    await newAnalysis.save();

    console.log("Data saved to database");
  } catch (error) {
    console.error("Error", error);
  }
};

const fetchGoogleSheet = async () => {
  const keyFilePath = path.join(__dirname, "srclub-424416-eb70dd16d988.json");

  const auth = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEETID,
      range: process.env.RANGE,
    });

    const rows = response.data.values;
    if (rows.length > 1) {
      const technologies = rows[0];
      const values = rows[1];

      const technologySupplyData = technologies.map((tech, index) => ({
        keyword: tech,
        value: parseInt(values[index], 10),
      }));

      const newTechnologySupply = new Supply({
        foundKeywords: technologySupplyData,
      });

      await newTechnologySupply.save();
      console.log("Data saved to the database successfully.");
    } else {
      console.log("No data found.");
    }
  } catch (err) {
    console.error("The API returned an error:", err);
  }
};

const fetchToken = async () => {
  try {
    console.log(process.env.USER_NAME, process.env.PASSWORD);
    const loginResponse = await axios.post(
      "https://boards.vegait.rs/api/v1/auth",
      {
        username: process.env.USER_NAME,
        password: process.env.PASSWORD,
        type: "ldap",
      }
    );

    const authToken = loginResponse.data.auth_token;

    await Keywords.findOneAndUpdate(
      {},
      { token: authToken },
      { upsert: true, new: true }
    );

    console.log("Token saved to database");
  } catch (error) {
    console.error("Error", error);
  }
};

module.exports = {
  checkForNewKeywords,
  checkForChanges,
  fetchGoogleSheet,
  fetchToken,
};
