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
