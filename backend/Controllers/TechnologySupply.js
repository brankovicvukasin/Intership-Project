const Supply = require("../Models/SupplyModel");
const { subDays } = require("date-fns");

exports.getAllSupplyTechnologies = async (req, res) => {
  try {
    const lastDocument = await Supply.findOne().sort({ analysisDate: -1 });

    if (!lastDocument) {
      return res.status(404).json({
        status: "fail",
        message: "No data found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: lastDocument.foundKeywords,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAllSupply = async (req, res) => {
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

    const analyses = await Supply.find({
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
    console.error("Error retrieving analysis", error);
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve analysis",
      error: error.message,
    });
  }
};

exports.getTopSupply = async (req, res) => {
  try {
    const latestSupply = await Supply.findOne().sort({ analysisDate: -1 });

    if (!latestSupply) {
      return res.status(404).json({
        status: "fail",
        message: "No analysis found!",
      });
    }

    const topSupply = latestSupply.foundKeywords.reduce(
      (prev, current) => {
        return prev.value > current.value ? prev : current;
      },
      { keyword: "", value: -Infinity }
    );

    res.status(200).json({
      status: "success",
      topSupply,
    });
  } catch (error) {
    console.error("Error retrieving analysis", error);
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve analysis",
      error: error.message,
    });
  }
};

exports.getUpDownSupplyTrend = async (req, res) => {
  try {
    const { timeRange } = req.query;

    const time = new Date();
    time.setDate(time.getDate() - timeRange);

    const data = await Supply.find({
      analysisDate: { $gte: time },
    });

    const supplyTrends = {};

    data.forEach((entry) => {
      entry.foundKeywords.forEach(({ keyword, value }) => {
        if (!supplyTrends[keyword]) {
          supplyTrends[keyword] = [];
        }
        supplyTrends[keyword].push(value);
      });
    });

    const supplyTrendAnalysis = Object.keys(supplyTrends).map((keyword) => {
      const values = supplyTrends[keyword];
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

    supplyTrendAnalysis.forEach(({ keyword, trend, percentageChange }) => {
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

exports.getLastSupplyData = async (req, res) => {
  try {
    const latestAnalysis = await Supply.findOne().sort({ analysisDate: -1 });

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
