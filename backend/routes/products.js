const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth'); 

// 1. GET API - Sabhi products dikhane ke liye
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); 
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// 2. POST API - Naya Product Add karne ke liye
router.post('/', auth(['Admin', 'Shop Manager']), async (req, res) => {
  try {
    const { name, description, price, actualPrice, isHotDeal, category, imageUrl, stock } = req.body;
    
    const newProduct = new Product({ 
      name, description, price, actualPrice, isHotDeal, category, imageUrl, stock 
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// 3. PUT API - Product ko EDIT karne ke liye (🌟 NAYA ADD HUA 🌟)
router.put('/:id', auth(['Admin', 'Shop Manager']), async (req, res) => {
  try {
    const { name, description, price, actualPrice, isHotDeal, category, imageUrl, stock } = req.body;
    
    // Product dhoondh ke usko naye data se update karna
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, price, actualPrice, isHotDeal, category, imageUrl, stock } },
      { new: true } // Yeh ensure karega ki update hone ke baad naya data return ho
    );

    if (!updatedProduct) return res.status(404).json({ msg: 'Product nahi mila' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// 4. DELETE API - Product hatane ke liye
router.delete('/:id', auth(['Admin', 'Shop Manager']), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product successfully deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;