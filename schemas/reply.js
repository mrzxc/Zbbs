var mongoose = require("mongoose");
var ReplySchema = new mongoose.Schema({
  id: Number,
  questionId: Number,
  userName: String,
  like: Number,
  content: String,
})
module.exports = replySchema;