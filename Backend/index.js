require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//To serve uploaded files
app.use('/uploads', express.static('uploads'));


app.get('/', function (req, res) {
    res.send("This is User Home Page....!!!")
});

const usercontroller = require('./controller/UserController')
app.use('/user', usercontroller)


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})