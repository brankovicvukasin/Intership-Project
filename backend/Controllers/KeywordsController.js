const axios = require("axios");
const cheerio = require("cheerio");
const User = require("../Models/UserModel");
const ScriptAnalysis = require("../Models/ScriptAnalysisModel");
const Keywords = require("../Models/KeywordsModel");
const { subDays } = require("date-fns");

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

const extractKeywords = (text, KEYWORDS) => {
  const words = text.toLowerCase().match(/\b(\w+)\b/g);
  const keywordsCounts = {};
  const foundKeywords = [];

  words.forEach((word) => {
    KEYWORDS.forEach((keyword) => {
      if (word === keyword.toLowerCase()) {
        keywordsCounts[word] = (keywordsCounts[word] || 0) + 1;
        if (!foundKeywords.includes(keyword.toLowerCase())) {
          foundKeywords.push(keyword.toLowerCase());
        }
      }
    });
  });

  const notFoundKeywords = KEYWORDS.filter(
    (keyword) => !foundKeywords.includes(keyword.toLowerCase())
  );

  return { keywordsCounts, notFoundKeywords };
};

exports.getDefaultKeywords = async (req, res) => {
  try {
    const defaultKeywords = req.user.defaultKeywords;

    return res.status(200).json({
      defaultKeywords: defaultKeywords,
      message: "success",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Server error",
      error: error.message,
    });
  }
};

exports.addDefaultKeywords = async (req, res) => {
  try {
    const newKeywords = req.body.keywords;
    const email = req.user.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    newKeywords.forEach((keyword) => {
      if (!user.defaultKeywords.includes(keyword)) {
        user.defaultKeywords.push(keyword);
      }
    });

    await user.save();

    return res.status(200).json({
      defaultKeywords: user.defaultKeywords,
      message: "Keywords added successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteDefaultKeywords = async (req, res) => {
  try {
    const { keywords } = req.query;
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    await User.findByIdAndUpdate(
      user._id,
      { $pull: { defaultKeywords: { $in: keywords } } },
      { new: true }
    );

    const updatedUser = await User.findById(user._id);

    return res.status(200).json({
      defaultKeywords: updatedUser.defaultKeywords,
      message: "Keywords deleted successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Server error",
      error: error.message,
    });
  }
};

exports.addNewAnalysis = async (req, res) => {
  try {
    let { searchkeywords, url, analysisName } = req.body;

    let email = req.user.email;

    let searchUrl = url || process.env.ANALYSIS_URL;

    let analysisname = analysisName || "Unknown";

    const KEYWORDS = searchkeywords || [];

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

    const newContent = await fetchWebsiteContent(searchUrl);

    const { keywordsCounts, notFoundKeywords } = extractKeywords(
      newContent,
      individualKeywords
    );

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

    const newAnalysis = {
      analysisName: analysisname,
      analysisUrl: searchUrl,
      searchedKeywords: KEYWORDS,
      foundKeywords: keywordArray,
      notFoundKeywords,
    };

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $push: { analysisHistory: newAnalysis } },
      { new: true, upsert: true }
    );

    const lastAnalysis =
      updatedUser.analysisHistory[updatedUser.analysisHistory.length - 1];

    res.status(200).json({
      message: "Analysis added successfully",
      status: "success",
      analysisId: lastAnalysis._id,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to add analysis",
      error: error.message,
    });
  }
};

exports.getAllAnalysis = async (req, res) => {
  try {
    let email = req.user.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const sortedAnalysisHistory = user.analysisHistory.sort(
      (a, b) => b.analysisDate - a.analysisDate
    );

    const analysisData = sortedAnalysisHistory.map((analysis) => ({
      id: analysis._id,
      analysisName: analysis.analysisName,
      analysisDate: analysis.analysisDate,
    }));

    res.status(200).json({
      status: "success",
      analysisData: analysisData,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve analysis data",
      error: error.message,
    });
  }
};

exports.getOneAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.query;
    let email = req.user.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const analysis = user.analysisHistory.id(analysisId);

    if (!analysis) {
      return res.status(404).json({
        status: "fail",
        message: "Analysis not found",
      });
    }

    res.status(200).json({
      status: "success",
      analysis,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve analysis",
      error: error.message,
    });
  }
};

exports.deleteAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.query;
    const email = req.user.email;

    if (!analysisId) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide an analysisId",
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { analysisHistory: { _id: analysisId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User or Analysis not found",
      });
    }

    const analysisData = user.analysisHistory.map((analysis) => ({
      id: analysis._id,
      analysisName: analysis.analysisName,
    }));

    return res.status(200).json({
      analysisData: analysisData,
      message: "Keywords deleted successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getDefaultAnalysis = async (req, res) => {
  try {
    const { timeRange, selectedKeywords } = req.query;

    if (!selectedKeywords) {
      return res.status(200).json({
        status: "success",
        data: [],
      });
    }

    const keywordLabels = selectedKeywords.map((keyword) => keyword.label);

    const endDate = new Date();
    const startDate = subDays(endDate, Number(timeRange));

    const analyses = await ScriptAnalysis.find({
      analysisDate: {
        $gte: startDate,
        $lte: endDate,
      },
      "foundKeywords.keyword": { $in: keywordLabels },
    });

    const filteredAnalyses = analyses.map((analysis) => ({
      ...analysis._doc,
      foundKeywords: analysis.foundKeywords.filter((keyword) =>
        keywordLabels.includes(keyword.keyword)
      ),
    }));

    res.status(200).json({
      status: "success",
      data: filteredAnalyses,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve analysis",
      error: error.message,
    });
  }
};

exports.getAllKeywords = async (req, res) => {
  try {
    const existingKeywords = await Keywords.findOne({});
    const keywords = existingKeywords ? existingKeywords.allKeywords : [];

    res.status(200).json({
      status: "success",
      data: keywords,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve analysis",
      error: error.message,
    });
  }
};

exports.getLastDemandData = async (req, res) => {
  try {
    const latestAnalysis = await ScriptAnalysis.findOne().sort({
      analysisDate: -1,
    });

    if (!latestAnalysis) {
      return res.status(404).json({
        status: "fail",
        message: "No analysis found",
      });
    }

    res.status(200).json({
      status: "success",
      data: latestAnalysis,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve analysis",
      error: error.message,
    });
  }
};

exports.getCrawlingStats = async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = subDays(endDate, 1);

    const analyses = await ScriptAnalysis.find(
      {
        analysisDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      "analysisDate"
    );

    res.status(200).json({
      status: "success",
      analyses,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve analysis",
      error: error.message,
    });
  }
};

exports.getTopTechnologies = async (req, res) => {
  try {
    const { timeRange } = req.query;

    const latestAnalysis = await ScriptAnalysis.findOne().sort({
      analysisDate: -1,
    });

    if (!latestAnalysis) {
      return res.status(404).json({
        status: "fail",
        message: "No analysis found!",
      });
    }

    const topKeyword = latestAnalysis.foundKeywords.reduce(
      (prev, current) => {
        return prev.value > current.value ? prev : current;
      },
      { keyword: "", value: -Infinity }
    );

    res.status(200).json({
      status: "success",
      topKeyword,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve information!",
      error: error.message,
    });
  }
};

exports.getUpDownDemandTrend = async (req, res) => {
  try {
    const { timeRange } = req.query;

    const time = new Date();
    time.setDate(time.getDate() - timeRange);

    const data = await ScriptAnalysis.find({
      analysisDate: { $gte: time },
    });

    const keywordTrends = {};

    data.forEach((entry) => {
      entry.foundKeywords.forEach(({ keyword, value }) => {
        if (!keywordTrends[keyword]) {
          keywordTrends[keyword] = [];
        }
        keywordTrends[keyword].push(value);
      });
    });

    const keywordTrendAnalysis = Object.keys(keywordTrends).map((keyword) => {
      const values = keywordTrends[keyword];
      const startValue = values[0];
      const endValue = values[values.length - 1];
      const trend = endValue - startValue;
      const percentageChange = ((endValue - startValue) / startValue) * 100;
      return {
        keyword,
        trend,
        percentageChange: parseFloat(percentageChange.toFixed(2)),
      };
    });

    let highestRisingKeyword = {
      keyword: null,
      trend: -Infinity,
      percentageChange: -Infinity,
    };
    let lowestRisingKeyword = {
      keyword: null,
      trend: Infinity,
      percentageChange: Infinity,
    };

    keywordTrendAnalysis.forEach(({ keyword, trend, percentageChange }) => {
      if (percentageChange > highestRisingKeyword.percentageChange) {
        highestRisingKeyword = { keyword, trend, percentageChange };
      }
      if (percentageChange < lowestRisingKeyword.percentageChange) {
        lowestRisingKeyword = { keyword, trend, percentageChange };
      }
    });

    if (!highestRisingKeyword.keyword) {
      highestRisingKeyword.keyword = "No Data";
      highestRisingKeyword.trend = 0;
      highestRisingKeyword.percentageChange = 0;
    }

    if (!lowestRisingKeyword.keyword) {
      lowestRisingKeyword.keyword = "No Data";
      lowestRisingKeyword.trend = 0;
      lowestRisingKeyword.percentageChange = 0;
    }

    res.status(200).json({
      status: "success",
      data: {
        highestRisingKeyword,
        lowestRisingKeyword,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve information!",
      error: error.message,
    });
  }
};
