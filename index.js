import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import {
  handleFarm,
  handleBalance,
  handleReferral,
  handleHelp,
  handleIntro,
  showLangMenu,
  handleLangSet,
} from "./services/index.js";

import { getUser, createUser } from "./utils/db.js";
import { mainMenu } from "./utils/i18n.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ========== VERIFY WEBHOOK ==========
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ========== HANDLE EVENTS ==========
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const webhookEvent = entry.messaging[0];
      const senderId = webhookEvent.sender.id;
      const messageText = webhookEvent.message?.text;

      // Đăng ký user nếu chưa có
      await createUser(senderId);

      if (messageText) {
        let reply;

        switch (messageText) {
          case "/start":
            reply = { text: await mainMenu(senderId, "start"), menu: ["🌾 Farm", "💰 Balance", "👥 Referral", "❓ Help", "🌐 Language", "📜 About"] };
            break;

          case "🌾 Farm":
            reply = await handleFarm(senderId);
            break;

          case "💰 Balance":
            reply = await handleBalance(senderId);
            break;

          case "👥 Referral":
            reply = await handleReferral(senderId);
            break;

          case "❓ Help":
            reply = await handleHelp(senderId);
            break;

          case "📜 About":
            reply = await handleIntro(senderId);
            break;

          case "🌐 Language":
            reply = await showLangMenu();
            break;

          case "🇻🇳":
            reply = await handleLangSet(senderId, "vi");
            break;

          case "🇬🇧":
            reply = await handleLangSet(senderId, "en");
            break;

          case "⬅️":
            reply = { text: await mainMenu(senderId, "menu"), menu: ["🌾 Farm", "💰 Balance", "👥 Referral", "❓ Help", "🌐 Language", "📜 About"] };
            break;

          default:
            reply = { text: "❓ Không hiểu lệnh, gõ /start để bắt đầu.", menu: ["⬅️"] };
        }

        console.log("👉 Reply:", reply);
        // TODO: gửi reply về Messenger bằng Send API
      }
    }

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
