function checkAntiCheat(userId) {
const now = Date.now();
if (!userActions[userId]) userActions[userId] = [];
userActions[userId].push(now);

// Giữ lại log 1 phút gần nhất
userActions[userId] = userActions[userId].filter(ts => now - ts < 60000);

if (userActions[userId].length > 20) {
return "⚠️ Phát hiện spam! Hành vi có dấu hiệu cheat.";
}

return null;
}

module.exports = { checkAntiCheat };
