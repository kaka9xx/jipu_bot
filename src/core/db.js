// src/core/db.js
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set; skipping MongoDB connection (using file storage).');
    return;
  }
  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DBNAME || 'jipu_bot',
      // useNewUrlParser/useUnifiedTopology not needed in mongoose v6+
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    // do not exit; allow fallback to file storage if needed
  }
}

module.exports = connectDB;
