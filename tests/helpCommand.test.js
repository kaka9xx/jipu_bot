const help = require("../src/commands/help");

describe("Help command", () => {
  test("in ra danh sách lệnh", () => {
    const mockConsole = jest.spyOn(console, "log").mockImplementation(() => {});
    help.execute({});
    expect(mockConsole).toHaveBeenCalledWith("Các lệnh khả dụng: /start, /help, /echo");
    mockConsole.mockRestore();
  });
});