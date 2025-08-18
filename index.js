import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

import { handleFarm } from "./services/farm.js";
import { handleBalance } from "./services/balance.js";
import { handleReferral } from "./services/referral.js";
import { handleHelp } from "./services/help.js";
import { handleAbout } from "./services/about.js";
import { showLangMenu, handleLangSet } from "./services/lang.js";

import lang from "./lang.json" assert { type: "json" };

dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

function t(userLang, key, vars = {}) {
  let str = lang[userLang]?.[key] || lang["en"][key] || key;
  Object.keys(vars).forEach((k) => {
    str = str.replace(`{${k}}`, vars[k]);
  });
  return str;
}

// gửi message về Messenger
async function callSendAPI(senderPsid, response) {
  await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: senderPsid },
      message: response,
    }),
  });
}

// webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// webhook nhận message
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const webhookEvent = entry.messaging[0];
      const senderPsid = webhookEvent.sender.id;

      if (webhookEvent.message) {
        await handleMessage(senderPsid, webhookEvent.message);
      } else if (webhookEvent.postback) {
        await handlePostback(senderPsid, webhookEvent.postback);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Xử lý message text
async function handleMessage(senderPsid, receivedMessage) {
  let response;

  if (receivedMessage.text) {
    const text = receivedMessage.text.toLowerCase();

    if (text.includes("farm")) {
      response = await handleFarm(senderPsid);
    } else if (text.includes("balance")) {
      response = await handleBalance(senderPsid);
    } else if (text.includes("ref")) {
      response = await handleReferral(senderPsid);
    } else if (text.includes("help")) {
      response = await handleHelp(senderPsid);
    } else if (text.includes("about")) {
      response = await handleAbout(senderPsid);
    } else if (text.includes("lang")) {
      response = showLangMenu(senderPsid);
    } else {
      response = { text: "⚡ Use menu to interact with JIPU Bot." };
    }
  }

  if (response) {
    await callSendAPI(senderPsid, response);
  }
}

// Xử lý postback button
async function handlePostback(senderPsid, receivedPostback) {
  const payload = receivedPostback.payload;

  let response;
  switch (payload) {
    case "FARM":
      response = await handleFarm(senderPsid);
      break;
    case "BALANCE":
      response = await handleBalance(senderPsid);
      break;
    case "REFERRAL":
      response = await handleReferral(senderPsid);
      break;
    case "HELP":
      response = await handleHelp(senderPsid);
      break;
    case "ABOUT":
      response = await handleAbout(senderPsid);
      break;
    case "LANG":
      response = showLangMenu(senderPsid);
      break;
    default:
      if (payload.startsWith("SET_LANG_")) {
        const langCode = payload.replace("SET_LANG_", "");
        response = handleLangSet(senderPsid, langCode);
      } else {
        response = { text: "❓ Unknown action." };
      }
      break;
  }

  if (response) {
    await callSendAPI(senderPsid, response);
  }
}

app.listen(3000, () => console.log("🚀 Server is running on port 3000"));
