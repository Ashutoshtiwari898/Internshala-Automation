const { join } = require("path");

/** @type {import('puppeteer').Configuration} */
module.exports = {
  // Store Chrome inside the project so Render keeps it
  cacheDirectory: join(__dirname, ".puppeteer-cache"),
};
