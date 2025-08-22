// src/core/errorHandler.js
const mongoose = require('mongoose');
const notifyAdmin = require('../utils/notifyAdmin');

function initErrorHandler() {
  // Bắt lỗi không bắt được trong async (Promise)
  process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection:', reason);
    notifyAdmin(`⚠️ Unhandled Rejection: ${reason}`);
  });

  // Bắt lỗi không bắt được trong sync
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    notifyAdmin(`❌ Uncaught Exception: ${err.message}`);
    // Không thoát app để bot vẫn chạy
  });

  // MongoDB disconnected
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
    notifyAdmin('⚠️ MongoDB disconnected, bot sẽ thử reconnect...');
  });

  // MongoDB reconnected
  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
    notifyAdmin('🔄 MongoDB reconnected');
  });
}

module.exports = initErrorHandler;
