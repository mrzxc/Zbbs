var mongoose = require("mongoose");
var ReplySchema = require("../schemas/reply")
var Reply = mongoose.model('reply', ReplySchema);
module.exports = Reply;