// ai/ask.js
// Gọi OpenAI API để trả lời chat

const OpenAI = require("openai");

let client = null;
if (process.env.OPENAI_API_KEY) {
client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

module.exports = async function askAI(question) {
if (!client) {
return "⚠️ AI chưa được cấu hình (thiếu OPENAI_API_KEY).";
}

try {
const response = await client.chat.completions.create({
model: "gpt-4o-mini", // dùng model nhỏ cho tiết kiệm token
messages: [{ role: "user", content: question }],
max_tokens: 200
});

return response.choices[0].message.content.trim();
} catch (err) {
console.error("AI error:", err);
return "❌ Xin lỗi, AI hiện không thể trả lời.";
}
};
