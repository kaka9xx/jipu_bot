// src/ai/ask.js
const { OpenAI } = require("openai");
require("dotenv").config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askAI(userId, question) {
try {
const response = await client.chat.completions.create({
model: "gpt-4o-mini", // nhanh + rẻ
messages: [
{ role: "system", content: "Bạn là Jipu AI, trợ lý dễ thương, chuyên hỗ trợ farm." },
{ role: "user", content: question }
],
});

return response.choices[0].message.content;
} catch (err) {
console.error("AI error:", err);
return "❌ Xin lỗi, AI đang bị lỗi hoặc quá tải.";
}
}

module.exports = { askAI };
