const fs = require("fs");
const path = require("path");
const { t } = require("../i18n");

const SHOP_FILE = path.join(__dirname, "../../data/shop.json");

function loadShop() {
  try {
    if (!fs.existsSync(SHOP_FILE)) return { items: [] };
    const raw = fs.readFileSync(SHOP_FILE, "utf-8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    console.error("loadShop error:", e);
    return { items: [] };
  }
}

function itemName(item, lang) {
  if (lang === "vi") return item.name_vi || item.name_en || item.id;
  return item.name_en || item.name_vi || item.id;
}
function itemDesc(item, lang) {
  if (lang === "vi") return item.desc_vi || item.desc_en || "";
  return item.desc_en || item.desc_vi || "";
}

function shopLogic(bot, chatId, lang = "en") {
  const shop = loadShop();
  const buttons = [];
  for (const it of shop.items) {
    buttons.push([{ text: itemName(it, lang) + ` (${it.price})`, callback_data: `shop_item_${it.id}` }]);
  }
  // back to main already on menu; here no explicit back
  const keyboard = { reply_markup: { inline_keyboard: [...buttons, [{ text: t(lang, "btn_back"), callback_data: "back_to_menu" }] ] } };
  bot.sendMessage(chatId, `${t(lang, "shop_title")}\n${t(lang, "shop_choose_item")}`, keyboard);
}

function shopShowItem(bot, chatId, lang, itemId) {
  const shop = loadShop();
  const it = shop.items.find(x => x.id === itemId);
  if (!it) {
    bot.sendMessage(chatId, "Item not found.");
    return;
  }
  const info = t(lang, "shop_item_info")
    .replace("{{name}}", itemName(it, lang))
    .replace("{{price}}", String(it.price))
    .replace("{{desc}}", itemDesc(it, lang));

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: t(lang, "btn_buy"), callback_data: `shop_buy_${it.id}` }],
        [{ text: t(lang, "btn_shop_back"), callback_data: "shop" }],
        [{ text: t(lang, "btn_back"), callback_data: "back_to_menu" }],
      ]
    }
  };
  bot.sendMessage(chatId, info, keyboard);
}

function shopBuyDemo(bot, chatId, lang, itemId) {
  bot.sendMessage(chatId, "✅ Demo purchase success (not implemented).");
}

module.exports = { shopLogic, shopShowItem, shopBuyDemo };
