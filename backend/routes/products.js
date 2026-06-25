const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth'); 

// GET
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

// POST
router.post('/', auth(['Admin', 'Shop Manager']), async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

// PUT (ID wala)
router.put('/:id', auth(['Admin', 'Shop Manager']), async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

// DELETE (ID wala)
router.delete('/:id', auth(['Admin', 'Shop Manager']), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

module.exports = router;