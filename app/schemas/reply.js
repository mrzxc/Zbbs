var mongoose = require("mongoose");
var ReplySchema = new mongoose.Schema({
  questionId: String,
  userPhoneNumber: String,
  like: Number,
  content: String,
  date: {
    type: Date,
    default: Date.now()
  }
})
ReplySchema.pre("save", function(next) {
  if(this.isNew) {
    this.date = Date.now()
  }
  next();
});
module.exports = ReplySchema;