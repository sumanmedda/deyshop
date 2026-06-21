const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  
  // 🌟 Naye Price Fields 🌟
  price: { type: Number, required: true }, // Yeh final price hoga jo customer pay karega
  actualPrice: { type: Number },           // MRP (Kati hui price dikhane ke liye) - Optional
  
  // 🌟 Naya Hot Deal Field 🌟
  isHotDeal: { type: Boolean, default: false }, // 🔥 Emoji lagane ke liye
  
  category: { type: String, required: true, default: 'Home & Kitchen' },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);