var QuestionSchema = new mongoose.Schema({
  id: Number,
  userName: String,
  title: String,
  content: String,
  date: {
    type: Date,
    default: Date.now();
  }
})
questionSchema.pre("save", function(next) {

});
module.exports = questionSchema;