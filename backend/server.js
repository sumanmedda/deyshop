require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log("🔍 [LOGGER START] server.js initial execution shuru ho rha hai...");

const app = express();

// 🌟 LEVEL 1: RAW NETWORK LOG VALUE (Sabse top pe taaki rasta pata chale) 🌟
app.use((req, res, next) => {
  console.log(`\n🚨 [INBOUND REQUEST DETECTED] Time: ${new Date().toLocaleTimeString()}`);
  console.log(`👉 Method: ${req.method}`);
  console.log(`👉 URL: ${req.url}`);
  console.log(`👉 Origin Header: ${req.headers.origin || 'No Origin'}`);
  console.log(`👉 User-Agent: ${req.headers['user-agent']}`);
  next();
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// 🌟 LEVEL 2: DATABASE CONNECT LOGS 🌟
console.log("⏳ [DATABASE] MongoDB se handshake karne ki koshish ja rhi hai...");
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('🔥 [DB SUCCESS] MongoDB cloud se safely connect ho gaya!'))
  .catch(err => console.log('❌ [DB ERROR] MongoDB connect nahi ho paya:', err.message));

// 🌟 LEVEL 3: INLINE ROUTE FOR PRODUCTS (Taaki rasta bhatke nahi) 🌟
app.get('/api/products', async (req, res) => {
  console.log("🎯 [ROUTE HIT] Browser/Frontend se '/api/products' hit ho gaya!");
  try {
    const Product = require('./models/Product'); 
    console.log("⏳ [MONGO QUERY] Database se data find() kiya ja rha hai...");
    const data = await Product.find();
    console.log(`✅ [MONGO SUCCESS] Data mil gaya! Total items: ${data.length}`);
    return res.json(data);
  } catch (e) {
    console.error("❌ [ROUTE CRASH] /api/products ke andar error aaya:", e.message);
    return res.status(500).json({ error: e.message });
  }
});

// Baaki Routes mount karo
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

// 🌟 LEVEL 4: GLOBAL CRASH TRACKER 🌟
process.on('uncaughtException', (err) => {
  console.error('💥 [CRITICAL ERROR] Process crash hone se bacha:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('💥 [CRITICAL REJECTION] Atka hua promise:', reason);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 [SERVER LIVE] Backend strictly listening on port: ${PORT}`);
});