// src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const langMiddleware = require("./middleware/lang");
const { setupBot } = require("./core/bot");

const app = express();
app.use(bodyParser.json());

// middleware ngôn ngữ
app.use(langMiddleware);

// khởi tạo bot + webhook
setupBot(app);

// test route
app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
