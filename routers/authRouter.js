//Specify all APIs regarding my authentication
const express = require('express');
const router = express.Router();

const { User } = require('../models/models');

router.post('/register', (req, res, next) => {

});

router.post('/login', (req, res, next) => {

});

router.post('/logout', (req, res, next) => {

});

module.exports = router;