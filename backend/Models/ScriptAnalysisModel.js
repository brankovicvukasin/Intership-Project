const mongoose = require("mongoose");

const scriptAnalysisSchema = new mongoose.Schema({
  analysisDate: {
    type: Date,
    default: Date.now,
  },
  foundKeywords: [{ keyword: String, value: Number }],
});

const ScriptAnalysis = mongoose.model("ScriptAnalysis", scriptAnalysisSchema);
module.exports = ScriptAnalysis;
