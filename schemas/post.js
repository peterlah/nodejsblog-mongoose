const mongoose = require("mongoose");

// post 스키마 정의
const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
  },
});

module.exports = mongoose.model("Post", postSchema);
