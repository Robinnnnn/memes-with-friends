const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");

const session = require("express-session");

const config = require("./config");

const auth = (passport) => {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  passport.use(
    new Strategy(
      {
        clientID: config.oAuthClientID,
        clientSecret: config.oAuthClientSecret,
        callbackURL: config.oAuthCallbackUrl,
      },
      (token, refreshToken, profile, done) => done(null, { profile, token })
    )
  );
};

const init = (app) => {
  auth(passport);

  app.use(
    session({
      secret: config.expressSessionSecret,
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = { init };
