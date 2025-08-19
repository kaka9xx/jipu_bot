const echo = require("../src/commands/echo");

describe("Echo command", () => {
  test("in ra đúng message khi có tin nhắn", () => {
    const mockConsole = jest.spyOn(console, "log").mockImplementation(() => {});
    echo.execute({ message: "Hello world!" });
    expect(mockConsole).toHaveBeenCalledWith("Echo: Hello world!");
    mockConsole.mockRestore();
  });

  test("xử lý khi không có message", () => {
    const mockConsole = jest.spyOn(console, "log").mockImplementation(() => {});
    echo.execute({});
    expect(mockConsole).toHaveBeenCalledWith("Không có tin nhắn để echo.");
    mockConsole.mockRestore();
  });
});