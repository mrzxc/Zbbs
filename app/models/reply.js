var mongoose = require("mongoose");
var ReplySchema = require("../schemas/reply")
var Reply = mongoose.model('Reply', ReplySchema);
module.exports = Reply;