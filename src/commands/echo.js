module.exports = {
  name: "echo",
  description: "Lặp lại tin nhắn người dùng",
  execute(ctx) {
    if (!ctx.message) {
      console.log("Không có tin nhắn để echo.");
      return;
    }
    console.log(`Echo: ${ctx.message}`);
  }
}