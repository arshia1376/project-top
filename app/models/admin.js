const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,

});

const admin = mongoose.model('cityState', adminSchema);

module.exports = admin;