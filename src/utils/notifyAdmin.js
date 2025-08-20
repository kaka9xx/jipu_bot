// src/utils/notifyAdmin.js

async function notifyAdmin(message) {
  const chatId = process.env.ADMIN_CHAT_ID;   // chatId Telegram của admin
  const token = process.env.BOT_TOKEN;        // token bot Telegram

  if (!chatId || !token) {
    console.warn('⚠️ Missing ADMIN_CHAT_ID or BOT_TOKEN, cannot send admin alert');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
  } catch (err) {
    console.error('❌ Failed to notify admin via Telegram:', err.message);
  }
}

module.exports = notifyAdmin;
