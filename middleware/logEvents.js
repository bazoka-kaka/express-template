const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = async (msg, filename) => {
  const datetime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${datetime}\t${uuid()}\t${msg}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", filename),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

const reqLog = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  next();
};

const errLog = (err, req, res, next) => {
  console.log(`${err.name}: ${err.message}`);
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  next();
};

module.exports = { reqLog, errLog };
