const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name: String,
    cities: [String],

});

const  City= mongoose.model('city', Schema);

module.exports = City;