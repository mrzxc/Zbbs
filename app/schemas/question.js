var mongoose = require("mongoose");
var QuestionSchema = new mongoose.Schema({
  userPhoneNumber: String,
  title: String,
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

QuestionSchema.static = {
  fetch: function(cb) {
    return this.find({}).sort('date');
    exec(cb)
  },
  findById: function(id, cb) {
    return this.find({_id: id})
    exec(cb)
  }
}
module.exports = QuestionSchema;