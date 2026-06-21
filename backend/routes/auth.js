const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER API
router.post('/register', async (req, res) => {
  console.log("🛠️ Register process shuru hua...");
  try {
    const { name, email, password, role } = req.body;
    console.log("👉 Data mila:", email);

    console.log("🔍 Database check kar rahe hain...");
    let user = await User.findOne({ email });
    if (user) {
      console.log("❌ User pehle se hai.");
      return res.status(400).json({ msg: 'Bhai, yeh email pehle se registered hai!' });
    }

    user = new User({ name, email, password, role });

    console.log("🔒 Password encrypt kar rahe hain...");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log("💾 Data save kar rahe hain...");
    await user.save();
    console.log("✅ Register ek dum successful!");
    res.status(201).json({ msg: 'User mast register ho gaya!' });

  } catch (err) {
    console.error('❌ Register ka Error:', err.message);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// LOGIN API
router.post('/login', async (req, res) => {
  console.log("🛠️ Login process shuru hua...");
  try {
    const { email, password } = req.body;
    console.log("👉 Login Data:", email);

    console.log("🔍 Database check kar rahe hain...");
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User nahi mila.");
      return res.status(400).json({ msg: 'Email galat hai ya user nahi mila!' });
    }

    console.log("🔐 Password check kar rahe hain...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password galat hai.");
      return res.status(400).json({ msg: 'Password galat hai bhai!' });
    }

    console.log("🎟️ Token bana rahe hain...");
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log("✅ Login Success, token bhej rahe hain.");
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).send('Server Error: ' + err.message);
  }
});

module.exports = router;