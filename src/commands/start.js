module.exports = {
  name: "start",
  description: "Lệnh bắt đầu",
  execute(ctx) {
    console.log(`Xin chào ${ctx.user}, bot đã sẵn sàng!`);
  }
}