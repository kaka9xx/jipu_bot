# 🤖 JIPU Bot

Một Telegram bot farm meme coin với đa ngôn ngữ, menu inline và backend Express để deploy dễ dàng trên Render/AWS.

---

## 🚀 Tính năng
- Farm để nhận năng lượng ⚔️  
- Xem số dư 💰  
- Nhận link giới thiệu 👥  
- Chọn ngôn ngữ 🇻🇳/🇬🇧  
- Luôn hiển thị menu sau mỗi hành động  

---

## 📂 Cấu trúc thư mục

jipu-bot/
│── index.js
│── package.json
│── lang.json
│── database/
│ └── users.json
│── services/
│ ├── menu.js
│ ├── lang.js
│ ├── farm.js
│ ├── balance.js
│ ├── referral.js
│ └── help.js


Tạo file .env:

BOT_TOKEN=your-telegram-bot-token
BOT_USERNAME=your_bot_username_without_@
WEB_URL=https://jipu-bot.onrender.com
PORT=10000

