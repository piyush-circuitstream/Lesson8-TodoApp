//Specify all APIs regarding my authentication
const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local');

const crypto = require('crypto');

const { User } = require('../models/models');

passport.use(new LocalStrategy(async function verify(username, password, callback) {
    try {
        const user = await User.findOne({ username });

        if (!user) { return callback(null, false, { message: 'Incorrect username or password.' }); }

        crypto.pbkdf2(password, Buffer.from(user.passwordSalt, 'base64'), 310000, 32, 'sha256', function (error, hashedPassword) {
            if (error) { return callback(error); }
            if (!crypto.timingSafeEqual(Buffer.from(user.hashedPassword, 'base64'), hashedPassword)) {
                return callback(null, false, { message: 'Incorrect username or password.' });
            }
            return callback(null, user);
        });
    } catch (error) {
        callback(error);
    }
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user._id,
            username: user.username
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

router.post('/register', async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return next('Username and Password are required for registration.');
    }

    const user = await User.findOne({ username: req.body.username });
    if (user) {
        return next('Username already exists! Please provide another username.')
    }

    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, Buffer.from(salt, 'base64'), 310000, 32, 'sha256', async function (error, hashedPassword) {
        if (error) { return next(error); }

        try {
            const user = User.create({
                username: req.body.username,
                passwordSalt: salt.toString('base64'),
                hashedPassword: hashedPassword.toString('base64')
            });

            if (!user) {
                return next('Error while creating user.');
            }

            req.login(user, function (err) {
                if (err) { return next(err); }
                res.redirect('/app');
            });

        } catch (error) {
            return next(error);
        }
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/app/login.html'
}));

router.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/app/login.html');
    });
});

module.exports = router;