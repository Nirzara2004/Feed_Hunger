const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userid: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true // optional, for preventing duplicates
    },
    contact: {
        required: true,
        type: String
    },
    image: { // added to match your controller
        type: String,
        required: true
    }
}, { timestamps: true }); // optional but recommended

module.exports = mongoose.model('User', dataSchema);


