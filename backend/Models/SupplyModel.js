const mongoose = require("mongoose");

const supplySchema = new mongoose.Schema({
  analysisDate: {
    type: Date,
    default: Date.now,
  },
  foundKeywords: [{ keyword: String, value: Number }],
});

const Supply = mongoose.model("Supply", supplySchema);
module.exports = Supply;
