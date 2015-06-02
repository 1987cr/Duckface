// load the things we need
var mongoose    = require('mongoose');
var bcrypt      = require('bcrypt-nodejs');
var jwt         = require('jwt-simple');
var secretStuff = 'Hail-The-Kung-Führer';


// define the schema for our user model
var userSchema = mongoose.Schema({
    username     : {type: String, required: true, unique: true},
    nombre       : {type: String, required: true},
    apellido     : {type: String, required: true},
    password     : {type: String, required: true}
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.statics.encode = function(data){
    return jwt.encode(data, secretStuff);
};

userSchema.statics.decode = function(data){
    return jwt.decode(data, secretStuff);
};

module.exports = mongoose.model('User', userSchema);
