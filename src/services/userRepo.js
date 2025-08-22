// src/services/userRepo.js
// Repository layer: use MongoDB (Mongoose) if MONGO_URI is provided; otherwise fall back to file storage.

const path = require("path");
const fs = require("fs");
const storageFile = path.join(__dirname, "../../data/users.json");

let UserModel = null;
try {
  UserModel = require("../models/User");
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
    const raw = fs.readFileSync(storageFile, "utf-8");
    return JSON.parse(raw || "[]");
  }
}

async function getById(id) {
  const idNum = Number(id);
  if (isNaN(idNum)) return null; // 🚨 chặn hacker gửi id không hợp lệ

  if (UserModel && process.env.MONGO_URI) {
    return await UserModel.findOne({ id: idNum }).lean();
  } else {
    await ensureFile();
    const all = JSON.parse(fs.readFileSync(storageFile, "utf-8") || "[]");
    return all.find((u) => u.id === idNum) || null;
  }
}

async function upsert(user) {
  const idNum = Number(user.id);
  if (isNaN(idNum)) throw new Error("❌ Invalid chatId");

  if (UserModel && process.env.MONGO_URI) {
    // MongoDB upsert
    return await UserModel.findOneAndUpdate(
      { id: idNum },
      { $set: user },
      { upsert: true, new: true }
    );
  } else {
    // File storage upsert
    await ensureFile();
    const all = JSON.parse(fs.readFileSync(storageFile, "utf-8") || "[]");
    const idx = all.findIndex((u) => u.id === idNum);
    if (idx >= 0) {
      all[idx] = user;
    } else {
      all.push(user);
    }
    fs.writeFileSync(storageFile, JSON.stringify(all, null, 2), "utf-8");
    return user;
  }
}

async function deleteById(chatId) {
  const idNum = Number(chatId); // ✅ ép chặt về số
  if (isNaN(idNum)) {
    throw new Error("Invalid chatId"); // 🚨 chặn hacker truyền string
  }

  if (UserModel && process.env.MONGO_URI) {
    return await UserModel.deleteOne({ id: idNum });
  } else {
    await ensureFile();
    let all = JSON.parse(fs.readFileSync(storageFile, "utf-8") || "[]");
    const before = all.length;
    all = all.filter((u) => u.id !== idNum);
    fs.writeFileSync(storageFile, JSON.stringify(all, null, 2), "utf-8");
    return { deletedCount: before - all.length };
  }
}

module.exports = { getAll, getById, upsert, deleteById };
