const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");
const Player = require("../models/schemas/playerModel");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const GOOGLE_CLIENT_ID = "219662561135-pm8u2seq0jn6h9bebu6j86jlrjv8pmsi.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

passport.use(
  new GoogleStrategy(
    {
      //options for the google strat
      callbackURL: "http://localhost:3000/auth/google/redirect",
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      new Player({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        usename: profile.displayName,
        googleId: profile.id,
      })
        .save()
        .then((newPlayer) => {
          console.log("newPlayer: ", newPlayer);
        })
        .catch((err) => console.log(err));
    }
  )
);

passport.serializeUser(function(user, done) {
  done(ull, user);
})

passport.deserializeUser(function(user, done) {
  done(ull, user);
})
