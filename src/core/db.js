const mongoose = require('mongoose');
const notifyAdmin = require('../utils/notifyAdmin');  // 👈 thêm dòng này

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️ MONGO_URI not set; skipping MongoDB connection (using file storage).');
    return;
  }

  const safeUri = uri.replace(/:\/\/(.*?):(.*?)@/, '://$1:****@');

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DBNAME || 'jipu_bot',
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
    });
    console.log(`✅ MongoDB connected to ${safeUri}, db: ${process.env.MONGO_DBNAME || 'jipu_bot'}`);
    await notifyAdmin(`✅ Bot đã kết nối MongoDB thành công tới ${safeUri}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    await notifyAdmin(`❌ Lỗi kết nối MongoDB: ${err.message}`);
  }

  mongoose.connection.on('disconnected', async () => {
    console.warn('⚠️ MongoDB disconnected. Trying to reconnect...');
    await notifyAdmin('⚠️ MongoDB bị ngắt kết nối, thử reconnect sau 5s...');
    setTimeout(connectDB, 5000);
  });

  mongoose.connection.on('reconnected', async () => {
    console.log('🔄 MongoDB reconnected');
    await notifyAdmin('🔄 MongoDB đã reconnect thành công');
  });

  mongoose.connection.on('error', async (err) => {
    console.error('❌ MongoDB error:', err.message);
    await notifyAdmin(`❌ Lỗi MongoDB: ${err.message}`);
  });
}

module.exports = connectDB;
