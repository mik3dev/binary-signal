const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candleSchema = new Schema({
    instrument: {
        type: String,
        required: true
    },
    timeframe: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    volume: {
        type: Number,
        min: 0,
        default: 0,
    },
    time: {
        type: Date,
        required: true
    },
    open: {
        type: Number,
        required: true
    },
    high: {
        type: Number,
        required: true
    },
    low: {
        type: Number,
        required: true
    },
    close: {
        type: Number,
        required: true
    },
    indicatorStochLong: Number,
    indicatorStochShort: Number,
    indicatorEma: Number,
    indicatorWma: Number,
    indicatorSma: Number,
    indicatorBolBand: Number,
    indicatorUpperBand: Number,
    indicatorLowerBand: Number,
    indicatorAwesomeOsc: Number
});

module.exports = mongoose.model('Candle', candleSchema);