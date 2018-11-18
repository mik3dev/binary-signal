const express = require('express');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
// const cors = require('cors')
const _ = require('lodash');

const config = require('./server/config');
const userRouter = require('./server/routes/userRoutes');

mongoose.connect(config.FX_DATABASE_URL, {
    'useNewUrlParser': true
}).then(
    () => console.log('Database connection is ready!'),
    err => console.log(`Ups, something went wrong. Can not connect to database. \n${err}`)
);

express()
    // .use(cors({
    //     "origin": 'http://localhost:8080/'
    // }))
    .use(logger('dev'))
    .use(express.json())
    .use('/users', userRouter)
    .use(express.static(path.join(__dirname, '/server/public')))
    .listen(config.PORT, () => {
        console.log(`The server is running on port ${config.PORT}`);
    });