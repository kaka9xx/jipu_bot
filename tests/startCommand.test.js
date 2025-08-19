const start = require("../src/commands/start");

describe("Start command", () => {
  test("trả về thông báo chào mừng đúng", () => {
    const mockConsole = jest.spyOn(console, "log").mockImplementation(() => {});
    start.execute({ user: "tester" });
    expect(mockConsole).toHaveBeenCalledWith("Xin chào tester, bot đã sẵn sàng!");
    mockConsole.mockRestore();
  });
});