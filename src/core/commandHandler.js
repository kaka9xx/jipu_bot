const start = require('../commands/start');
const help = require('../commands/help');
const echo = require('../commands/echo');

function handleCommand(command, context) {
  switch(command) {
    case "start":
      start.execute(context);
      break;
    case "help":
      help.execute(context);
      break;
    case "echo":
      echo.execute(context);
      break;
    default:
      console.log("Unknown command:", command);
  }
}

module.exports = { handleCommand };