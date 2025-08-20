require('dotenv').config();
const connectDB = require('./src/core/db');
connectDB();
// index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const langMiddleware = require("./src/middleware/lang");
const { setupBot } = require("./src/core/bot");

const app = express();
app.use(bodyParser.json());
app.use(langMiddleware);

app.get("/", (_, res) => res.send("JIPU bot is alive 🚀"));

setupBot(app);

const port = process.env.PORT || 10000;
const adminRouter = require('./src/core/admin');
app.use('/admin', adminRouter);

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});

// xử lý lỗi & sự kiện
const initErrorHandler = require('./src/core/errorHandler');
initErrorHandler(); 
