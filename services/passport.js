const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require('mongoose')
const keys = require("../config/keys.js");

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) =>{
  User.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({googleId: profile.id}).then((existingUser) => {
          if(existingUser){
            //we already have a record with given profile ID
            done(null, existingUser)
          }else{
            //we dont have a record for the requested Id, make a new record
            new User ({ 
              googleId: profile.id,
             }).save().then((user) => {
                done(null, user)
             });
          }
        })
        
      }
    )
  );