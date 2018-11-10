const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
const mongoose = require('mongoose');
const Candle = require('./models/candle');

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
    console.log('User is connected');
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})