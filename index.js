const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = 5000;

const authRouter = require('./routers/authRouter');
const todoRouter = require('./routers/todoRouter');

app.use(express.json());

app.use(cors());

app.use('/app', express.static('public'));
app.use('/auth', authRouter);
app.use('/', todoRouter);

//Connection of mongoDB
mongoose.connect('mongodb://localhost:27017/test')
    .then((data) => {
        console.log("My database is connected!")
    }).catch((err) => {
        console.error("Error connecting to MongoDB: ", err);
    });

// Serve the index.html for default route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

//server listening to the requests
app.listen(PORT, () => {
    console.log(`My server is listening to ${PORT}`)
});