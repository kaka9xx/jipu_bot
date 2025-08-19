require("dotenv").config(); // load env TRƯỚC

const { initBot } = require("./src/core/bot");

// chỉ gọi initBot (khởi tạo bot bên trong core/bot.js)
initBot();
