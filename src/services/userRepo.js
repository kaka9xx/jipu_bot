// src/services/userRepo.js
// Repository layer: use MongoDB (Mongoose) if MONGO_URI is provided; otherwise fall back to file storage.
const path = require('path');
const fs = require('fs');
const storageFile = path.join(__dirname, '../../data/users.json');

let UserModel = null;
try {
  UserModel = require('../models/User');
} catch (e) {
  UserModel = null;
}

async function ensureFile() {
  if (!fs.existsSync(storageFile)) {
    fs.mkdirSync(path.dirname(storageFile), { recursive: true });
    fs.writeFileSync(storageFile, JSON.stringify([], null, 2));
  }
}

async function getAll() {
  if (UserModel && process.env.MONGO_URI) {
    return await UserModel.find({}).lean();
  } else {
    await ensureFile();
    const raw = fs.readFileSync(storageFile, 'utf-8');
    return JSON.parse(raw || '[]');
  }
}

async function getById(id) {
  if (UserModel && process.env.MONGO_URI) {
    return await UserModel.findOne({ id });
  } else {
    await ensureFile();
    const all = JSON.parse(fs.readFileSync(storageFile, 'utf-8') || '[]');
    return all.find(u => u.id === id) || null;
  }
}

async function upsert(user) {
  if (UserModel && process.env.MONGO_URI) {
    // ⚡ Loại bỏ _id để tránh duplicate key
    const { _id, ...safeUser } = user;

    return await UserModel.findOneAndUpdate(
      { id: user.id },
      { $set: safeUser },
      { upsert: true, new: true }
    );
  } else {
    await ensureFile();
    const all = JSON.parse(fs.readFileSync(storageFile, 'utf-8') || '[]');
    const idx = all.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...user };
    } else {
      all.push(user);
    }
    fs.writeFileSync(storageFile, JSON.stringify(all, null, 2), 'utf-8');
    return user;
  }
}

module.exports = { getAll, getById, upsert };
