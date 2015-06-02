var mongoose    = require('mongoose');
var User = mongoose.model('User');


var tweetSchema = mongoose.Schema({
    created_by : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    created_at : {type: Date, default: Date.now},
    paths      : [String],
    text       : String
});

module.exports = mongoose.model('Tweet', tweetSchema);