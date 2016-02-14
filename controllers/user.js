// Load required packages
var mongoose = require('mongoose');
var expressJWT = require('express-jwt')
var passport = require('passport');
var jwt = require('jsonwebtoken')


var secret = require('../private/keys.js').JWT.secret
var auth = expressJWT({secret: secret}).unless({path: ['/']})


var User = mongoose.model('User');


// End Point for Returning details of the user
exports.getProfile = function(req, res){
  res.json(req.user)
}

// End Point for logging out of PASSPORT, --- DOES NOT REMOVE THE TOKEN
exports.getLogout = function(req, res) {
     console.log('Ive hit logged out, attempting log out now.')
      req.logout();
      res.redirect('/')
}

// End Point for Logging in
      // Will use PASSPORT to AUTHENTICATE CREDENTIALS
      // Will then create a JWT and pass the token back to requester that is responsible for storing to localStorage
exports.postLogin = function(req, res, next){
    passport.authenticate('local-login', function(err, user, info){
      if(err){
        console.log('1')
        return res.status(500).json({err:err});
      }
      if(!user){
        console.log('2')
        return res.status(401).json({err:info});
      }
      req.logIn(user, function(err){
        if(err){
          console.log(err)
          console.log(user)
          return res.status(500).json({err: 'Could not load'})
        }
        var myToken = jwt.sign(user, secret);
        //console.log(myToken)
        res.status(200).json({status: 'Login Successful', token: myToken})
      })
    })(req, res, next);
  }






/*
// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'New user added to the equipment room!' });
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};
*/