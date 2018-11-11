const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
const mongoose = require('mongoose');
const Candle = require('./models/candle');
const _ = require('lodash');
const instruments = require('./commons/insturments');
const timeframes = require('./commons/timeframes');

const logger = require('morgan');
const path = require('path');

require('dotenv').load();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.FX_DATABASE_URL, {
    'useNewUrlParser': true
}).then(
    () => console.log('Database connection is ready!'),
    err => console.log(`Ups, something went wrong. Can not connect to database. \n${err}`)
);

app.use(logger('dev'));
app.get('/', (req, res) => {
    res.send('Hello World');
});

io.on('connection', (socket) => {
    setInterval( () => {
        let promises = [];
        _.forEach(instruments, instrument => {
            _.forEach(timeframes, timeframe => {
                promises.push(new Promise((resolve) => {
                    Candle.findOne({instrument, timeframe})
                        .sort({'time':-1})
                        .then(r => resolve(r));
                }));
            })
        })
        Promise.all(promises).then(r => socket.emit('SendFxData', r));
    }, process.env.TIMER)
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})