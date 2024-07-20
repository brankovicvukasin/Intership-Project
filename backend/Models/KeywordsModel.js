const mongoose = require("mongoose");

const keywordsSchema = new mongoose.Schema({
  token: { type: String, default: "" },
  allKeywords: {
    type: [String],
    default: [],
  },
});

const Keywords = mongoose.model("Keywords", keywordsSchema);
module.exports = Keywords;
