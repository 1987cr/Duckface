var User       = require('../app/models/user');
var Word       = require('../app/models/word');
var Tweet       = require('../app/models/tweet');

var mongoose = require('mongoose');

module.exports = function(app, passport) {

    // Get all users
    app.get('/user/all', passport.authenticate('bearer', {session: false }),
    function(req, res){

        var query = User.find();
        query.select('username nombre apellido _id');

        query.exec(function(err, users){
            if(err)
                res.status(500).send(err.message);

            res.status(200).json(users);
        });

    });

    // Get user by username
    app.get('/user/:username', passport.authenticate('bearer', {session: false }),
    function(req, res){


        var query = User.findOne({'username': req.params.username});
        query.select('username nombre apellido _id');

        query.exec(function(err, user){
            if(err)
                res.status(500).send(err.message);

            if(!user){
                res.status(400).json({msg: 'User not found.'});
            }else{
                res.status(200).json(user);
            }

        });

    });

    // Delete Users
    app.delete('/user/:user_id', passport.authenticate('bearer', {session: false }),
    function(req, res){

        if(req.user.username == 'admin'){

            User.findById(req.params.user_id, function(err, user){

                if(!user){
                    res.status(400).json({msg: 'User not found.'});
                }else{
                    user.remove(function(err){

                    if(err)
                        res.status(500).send(err.message);

                    res.status(200).json({msg: 'User Deleted'});
                    });
                }
            });
        } else {
            res.status(403).json({msg: 'Forbidden'});
        }
    });

    // Update user
    app.patch('/user/:user_id', passport.authenticate('bearer', {session: false }),
    function(req, res) {

        if(req.user.username == 'admin'){

            User.findById(req.params.user_id, function(err, user){

                if(!user){
                    res.status(400).json({msg: 'User not found.'});
                }else{
                    user.nombre   = req.body.nombre;
                    user.apellido = req.body.apellido;

                    user.save(function(err){
                        if(err){
                            res.status(500).send(err.message);
                        }
                        res.status(200).json({msg: "User Updated."});
                    });
                }
            });

        } else {
            res.status(403).json({msg: 'Forbidden'});
        }
    });

    // Get Tweets
    app.get('/dual', passport.authenticate('bearer', {session: false }),
    function(req, res){

        if (!req.body) return res.sendStatus(400);

        var query = Tweet.find();
        query.select('created_at text -_id');
        query.sort({'created_at': 'desc'});

        query.exec(function(err, tweets){
            if(err)
                res.status(500).send(err.message);

            res.status(200).json(tweets);
        });
    });


    // Get Last 10 Tweets from user
    app.get('/museet/1', passport.authenticate('bearer', {session: false }),
    function(req, res){

        var query = Tweet.find({'created_by': req.user._id});
        query.select('created_at text words -_id');
        query.sort({'created_at': 'desc'});
        query.limit(10);

        query.exec(function(err, tweets){
            if(err)
                res.status(500).send(err.message);
            res.status(200).json(tweets);
        });

    });

    // Get Last 10 Tweets from everyone
    app.get('/museet/2', passport.authenticate('bearer', {session: false }),
    function(req, res){

        var query = Tweet.find();
        query.select('created_at text words -_id');
        query.sort({'created_at': 'desc'});
        query.limit(10);

        query.exec(function(err, tweets){
            if(err)
                res.status(500).send(err.message);
            res.status(200).json(tweets);
        });

    });

    // Make a Tweet
    app.post('/dual', passport.authenticate('bearer', {session: false }),
    function(req, res){

       var tweet = new Tweet();
       tweet.created_by = req.user.id;
       tweet.paths = req.body.paths;
       tweet.text = req.body.text;

       tweet.save(function(err){
            if(err){
                res.status(500).send(err.message);
            }
            res.status(201).json({msg: "Tweet Crated."});
        });
    });

    // Get all words
    app.get('/word/all', passport.authenticate('bearer', {session: false }),
    function(req, res){
        Word.find(function(err, words){

            if(err)
                res.status(500).send(err.message);

            res.status(200).json(words);
        });
    });

    // Get a word
    app.get('/word/:word', passport.authenticate('bearer', {session: false }),
    function(req, res){

        var query = Word.findOne({'word': req.params.word});

        query.exec(function(err, word){
            if(err)
                res.status(500).send(err.message);

            if(!word){
                res.status(400).json({msg: 'Word not found.'});
            }else{
                res.status(200).json(word);
            }

        });

    });

    // Create a word
    app.post('/word', passport.authenticate('bearer', {session: false }),
    function(req, res) {

        if(req.user.username == 'admin'){

            var word = new Word();
            word.word         = req.body.word;
            word.emotion.name = req.body.emotion;
            word.emotion.path = req.body.path;
            word.type         = req.body.type;
            word.enabled      = req.body.enabled;

            word.save(function(err){
                if(err){
                    res.status(500).send(err.message);
                }
                res.status(201).json({msg: "Word Created."});
            });
        } else {
            res.status(403).json({msg: 'Forbidden'});
        }

    });

    // Update a word
    app.put('/word/:word_id', passport.authenticate('bearer', {session: false }),
    function(req, res) {

        if(req.user.username == 'admin'){
            Word.findById(req.params.word_id, function(err, word){

                if(!word){
                    res.status(400).json({msg: 'Word not found.'});
                }else{
                    word.word         = req.body.word;
                    word.emotion.name = req.body.emotion;
                    word.emotion.path = req.body.path;
                    word.type         = req.body.type;
                    word.enabled      = req.body.enabled;

                    word.save(function(err){
                        if(err){
                            res.status(500).send(err.message);
                        }
                        res.status(200).json({msg: "Word Updated."});
                    });
                }
            });
        } else {
            res.status(403).json({msg: 'Forbidden'});
        }
    });

    // Disable/Enable a word
    app.patch('/words/:word_id', passport.authenticate('bearer', {session: false }),
    function(req, res) {

        if(req.user.username == 'admin'){
            Word.findById(req.params.word_id, function(err, word){

                if(!word){
                    res.status(400).json({msg: 'Word not found.'});
                }else{
                    word.enabled    = req.body.enabled;

                    word.save(function(err){
                        if(err){
                            res.status(500).send(err.message);
                        }
                        res.status(200).json({msg: "Word Disabled/Enabled."});
                    });
                }
            });
        } else {
            res.status(403).json({msg: 'Forbidden'});
        }
    });

    // login
    app.post('/login', passport.authenticate('local-login', { session: false }),
    function(req, res){
        if(req.user){

            var token = User.encode(req.user.username);

            res.status(200).json({token: token});

        } else {
            res.status(401).json({error: 'Authentication error'});
        }

    });

    //signup
    app.post('/signup', passport.authenticate('local-signup', { session: false }),
    function(req, res){
        res.status(201).json({msg: "User Created."});
    });

    // Catch 404
    app.get('*', function(req, res, next) {
      var err = new Error();
      err.status = 404;
      next(err);
    });

    // Handle 404
    app.use(function(err, req, res, next) {
      if(err.status !== 404) {
        return next();
      }

      res.status(404);
      res.send(err.message || 'Not found.');
    });
}

