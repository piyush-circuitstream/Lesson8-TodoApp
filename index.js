const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

const app = express();

const session = require('express-session');

const authRouter = require('./routers/authRouter');
const todoRouter = require('./routers/todoRouter');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/app/login.html');
    }
}
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.session());

app.use('/app', express.static('public'));
app.use('/auth', authRouter);
app.use('/', loggedIn, todoRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status ?? 500).send(err);
});

// Connection of mongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then((data) => {
        console.log("My database is connected!")
    }).catch((err) => {
        console.error("Error connecting to MongoDB: ", err);
    });

//server listening to the requests
app.listen(PORT, () => {
    // console.log(`${process.env.MONGODB_URI}`)
    console.log(`My server is listening to ${PORT}`)
});