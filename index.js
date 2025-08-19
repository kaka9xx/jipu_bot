const express = require("express");
const bodyParser = require("body-parser");
const { initBot } = require("./src/core/bot");
const langMiddleware = require("./src/middleware/lang"); // 🔥 sửa chỗ này

const token = process.env.TELEGRAM_BOT_TOKEN;
const url = process.env.RENDER_EXTERNAL_URL;
const port = process.env.PORT || 10000;

console.log("🚀 Bot webhook server running on port", port);

const app = express();
app.use(bodyParser.json());

const bot = initBot();

// gắn webhook
bot.deleteWebHook().then(async () => {
  await bot.setWebHook(`${url}/bot${token}`);
  console.log("🌐 Webhook set to:", `${url}/bot${token}`);
});

app.post(`/bot${token}`, async (req, res) => {
  const update = req.body;

  if (update.message) {
    // đảm bảo middleware chạy trước khi bot xử lý
    await langMiddleware(update.message, async () => {
      bot.processUpdate(update);
    });
  } else {
    bot.processUpdate(update);
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
