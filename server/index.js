const express = require('express');
const app = express();
const logger = require('morgan');
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})