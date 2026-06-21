const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Customer naya order place karega (Frontend Cart se yahan hit aayega)
router.post('/', async (req, res) => {
  console.log("\n🚨 NAYA ORDER AAYA FRONTEND SE!");
  console.log("👉 Order Details:", req.body);
  
  try {
    const newOrder = new Order(req.body);
    console.log("⏳ MongoDB mein save kar rahe hain..."); // Agar yahan atka, toh DB Issue hai
    
    const savedOrder = await newOrder.save();
    console.log("✅ Order DB mein successfully save ho gaya!");
    
    res.status(201).json(savedOrder);
  } catch (err) {
    console.log("❌ DB Save Error:", err.message);
    res.status(500).json({ msg: 'Order failed', error: err.message });
  }
});

// Admin Dashboard ke liye saare orders fetch karna
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Admin Dashboard se order status update karna
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;