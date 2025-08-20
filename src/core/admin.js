// src/core/admin.js
const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../core/user');
const fs = require('fs');
const path = require('path');

function checkAdmin(req, res, next) {
  const token = req.header('x-admin-token') || req.query.admin_token || process.env.ADMIN_TOKEN;
  if (!process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'ADMIN_TOKEN not set on server' });
  }
  if (token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.use(checkAdmin);

router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get('/shop', (req, res) => {
  const file = path.join(__dirname, '../../data/shop.json');
  if (!fs.existsSync(file)) return res.json({ items: [] });
  const raw = fs.readFileSync(file, 'utf-8');
  res.json(JSON.parse(raw || '{}'));
});

module.exports = router;
