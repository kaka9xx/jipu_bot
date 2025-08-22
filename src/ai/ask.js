// src/ai/ask.js
const { OpenAI } = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function handleAskAI(bot, chatId, text) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // nhẹ & rẻ, có thể đổi sang gpt-4.1 nếu muốn
      messages: [{ role: "user", content: text }],
    });

    const reply = response.choices[0].message.content;
    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error("AI error:", err);
    await bot.sendMessage(chatId, "⚠️ Xin lỗi, AI tạm thời không phản hồi được.");
  }
}

module.exports = { handleAskAI };
