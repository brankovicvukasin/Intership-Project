const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter your email!"],
    unique: [true, "We are sorry but this email already exists!"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password!"],
  },
  role: { type: String, default: "user" },
  defaultKeywords: {
    type: [String],
  },
  analysisHistory: [
    {
      analysisName: { type: String, default: "Unknown" },
      analysisDate: { type: Date, default: Date.now },
      analysisUrl: {
        type: String,
        default: Date.now,
        required: [true, "Please enter your Url"],
      },
      searchedKeywords: { type: [String] },
      foundKeywords: [{ keyword: String, value: Number }],
      notFoundKeywords: { type: [String] },
    },
  ],
});

const UserModel = mongoose.model("UserModel", userSchema);
module.exports = UserModel;
