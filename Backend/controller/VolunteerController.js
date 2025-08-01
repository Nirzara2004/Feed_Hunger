const express = require('express');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Volunteer = require('../model/Volunteer');
const multer = require('../middleware/multer');

const router = express.Router();

// Home
router.get('/', (req, res) => {
  res.send('This is Volunteer Home Page....!!!');
});

// Register
router.post('/register', multer.single('image'), async (req, res) => {
  try {
    const { email, name, password, contact, address } = req.body;

    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVolunteer = new Volunteer({
      email,
      name,
      password: hashedPassword,
      contact,
      address,
      image: req.file.filename,
    });

    const savedVolunteer = await newVolunteer.save();
    res.status(201).json(savedVolunteer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: volunteer._id }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });

    res
      .cookie('token', token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: 'strict',
      })
      .json({
        message: `Welcome ${volunteer.name}`,
        volunteer,
        success: true,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
});

// Get Volunteer by ID
router.get('/get/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

    const result = {
      ...volunteer._doc,
      image: `${req.protocol}://${req.get('host')}/uploads/${volunteer.image}`,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Volunteers
router.get('/getAll', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    const updatedList = volunteers.map((v) => ({
      ...v._doc,
      image: `${req.protocol}://${req.get('host')}/uploads/${v.image}`,
    }));

    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Volunteer (optional image update)
router.patch('/update/:id', multer.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(updatedVolunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Volunteer
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!deletedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.send(`Volunteer ${deletedVolunteer.name} deleted successfully`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
