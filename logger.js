const winston = require("winston");
const expressWinston = require("express-winston");

// Console transport for winton.
const consoleTransport = new winston.transports.Console();

// Set up winston logging.
const log = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [consoleTransport],
});

// Print all winston log levels.
log.level = "silly";

const init = (app) => {
  // Enable express.js debugging. This logs all received requests.
  app.use(
    expressWinston.logger({
      transports: [consoleTransport],
      winstonInstance: log,
    })
  );
};

module.exports = { init, log, consoleTransport };
