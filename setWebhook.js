import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = process.env.BASE_URL;

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

(async () => {
  const url = `${BASE_URL}/webhook`;
  const res = await fetch(`${TELEGRAM_API}/setWebhook?url=${url}`);
  const data = await res.json();
  console.log("SetWebhook response:", data);
})();
