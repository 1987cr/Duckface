var mongoose    = require('mongoose');
var User = mongoose.model('User');


var wordSchema = mongoose.Schema({
    word     : String,
    emotion  :
    {
        name : String,
        path : String
    },
    type     : {
        type : String,
        enum : ['Verbo', 'Sustantivo', 'Adjetivo']
    },
    enabled  : String
});

module.exports = mongoose.model('Word', wordSchema);