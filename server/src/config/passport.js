const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(new GoogleStrategy({
  clientID: process.env.GG_CLIENT_ID,
  clientSecret: process.env.GG_CLIENT_SECRET,
  callbackURL: '/api/users/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { email: profile.emails[0].value } });
    if (!user) {
      user = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: '', // Google user không có password
        role: 'user'
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport; 