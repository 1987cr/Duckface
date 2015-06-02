var LocalStrategy    = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var User       = require('../app/models/user');

module.exports = function(passport) {

    // Login
    passport.use('local-login', new LocalStrategy(
    function(username, password, done) {

        if (username)
            username = username.toLowerCase();

        process.nextTick(function() {
            User.findOne({ 'username' :  username }, function(err, user) {

                if (err)
                    return done(err);

                if (!user){
                    return done(null, false, {message: 'No user found.'});
                }

                if (!user.validPassword(password)){
                    return done(null, false, {message: 'Wrong Password'});
                }

                return done(null, user);
            });
        });

    }));

    // Signup
    passport.use('local-signup', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {

        if (username)
            username = username.toLowerCase();

        process.nextTick(function() {

            if (!req.user) {
                User.findOne({ 'username' :  username }, function(err, user) {

                    if (err)
                        return done(err);


                    if (user) {
                        return done(null, false, {message: 'That username is already taken.'});
                    } else {


                        var newUser            = new User();

                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.nombre    = req.param('nombre');
                        newUser.apellido    = req.param('apellido');

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            } else {
                return done(null, req.user);
            }

        });

    }));

    // Bearer
    passport.use(new BearerStrategy(
    function(token, done) {

        var decoded = User.decode(token);

        User.findOne({ username: decoded }, function (err, user) {

            if (err)
                return done(err);
            if (!user)
                return done(null, false);

            return done(null, user);
        });
      }
    ));

};
