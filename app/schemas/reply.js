var mongoose = require("mongoose");
var ReplySchema = new mongoose.Schema({
  questionId: Number,
  userphoneNumber: String,
  like: Number,
  content: String,
  date: {
    type: Date,
    default: Date.now()
  }
})
QuestionSchema.pre("save", function(next) {
  if(this.isNew) {
    this.date = Date.now()
  }
  next();
});
module.exports = replySchema;