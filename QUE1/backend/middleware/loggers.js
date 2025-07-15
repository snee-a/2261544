const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'logs.txt');

const logger = (req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;

  fs.appendFile(logPath, log, (err) => {
    if (err) console.error('Logging failed', err);
  });

  next();
};

module.exports = logger;
