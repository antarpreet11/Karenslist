const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}));

// ... rest of your code ...

// const MONGODB_URI = process.env.MONGODB_URI;

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://108c-2001-569-51d7-1800-3176-ad5e-f3ca-216c.ngrok-free.app/auth/google/callback', // This should match the callback URL you set in the Google Developer Console
  },
  (accessToken, refreshToken, profile, done) => {
    // This function is called when the user is authenticated
    // You can create or update a user in your database here
    // The `profile` parameter contains user information
    console.log('Authenticated user');
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to a success page or display a message
    res.send('Google OAuth Successful!');
  }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
