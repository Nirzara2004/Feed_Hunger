const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
   location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: " https://t4.ftcdn.net/jpg/08/23/95/89/360_F_823958944_1c9covIC7Tl7eyJtWoTiXc0L4vP6f43q.jpg"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema);