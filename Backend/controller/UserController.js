const express = require('express');
const User = require('../model/User')
const multer = require('../middleware/multer')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

require('dotenv').config();

const router = express.Router();

router.get('/', function (req, res) {
    res.send("This is User Home Page....!!!")
});

router.post('/registeruser',multer.single('image'), async function (req, res) {

   try {
      const { userid, name, password, email, contact, location,  } = req.body;
      if (!req.file) return res.status(400).json({ error: 'Image is required' });
      const hash = await bcrypt.hash(password, 10);
  
      const newuser = new User({
        userid,
        name,
        password:hash,
        email,
        contact,
        location,
        image: req.file.filename, // store filename or full path if needed
      });
  
      const saved = await newuser.save();
      res.status(201).json({message: true, data: saved});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }

});

router.post('/login', async function (req, res) {
    try {
        const { userid, password} = req.body;
        
        if (!userid|| !password ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ userid });
        console.log(user)
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
       
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            name:user.name,
            userid: user.userid,
            password: bcrypt.hash,
            email:user.email,
            contact: user.contact,
            location: user.location,
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
});


router.get('/filterByName/:name', async function (req, res) {
    try {
        const allUsers = await User.find({name:{$regex:req.params.name,$options:"i"}});

        const usersWithImageUrl = allUsers.map(user => ({
            ...user._doc,
            image: `${req.protocol}://${req.get('host')}/uploads/${user.image}`,
        }));

        res.json(usersWithImageUrl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

router.patch('/update/:id', async function (req, res) {
     try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await User.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

});

router.delete('/delete/:id',async function (req, res) {
    try {
        const id = req.params.id;
        const data = await User.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

});


module.exports = router;      