// ai/npc.js
// NPC trả lời tuỳ chỉnh dựa trên hành vi người dùng (DB)

const askAI = require("./ask");
const userRepo = require("../services/userRepo");

module.exports = async function npcChat(userId, message) {
// Lấy user từ DB
const user = await userRepo.findOrCreate(userId);

// Tạo "tính cách" NPC dựa trên dữ liệu
const personality = `
Bạn là NPC "Jipu" trong game farm.
Người chơi hiện có ${user.tokens || 0} $JIP token.
Bạn phải trả lời ngắn gọn, dễ thương, dí dỏm như nhân vật chibi.
`;

// Gửi vào AI
const prompt = personality + "\nNgười chơi: " + message;

const reply = await askAI(prompt);
return reply;
};
