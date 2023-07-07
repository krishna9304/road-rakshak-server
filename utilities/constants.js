const ISDEV = process.env.NODE_ENV === "development";
const MONGO_URI = ISDEV
  ? "mongodb://localhost:27017/road-rakshak"
  : process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "somesecret";
const NODE_MAILER_EMAIL = process.env.NODE_MAILER_EMAIL || "";
const NODE_MAILER_PASSWORD = process.env.NODE_MAILER_PASSWORD || "";
const SERVER_URL = ISDEV ? "localhost:8080" : process.env.SERVER_URL;
const CLIENT_URL = ISDEV ? "http://localhost:3000" : process.env.CLIENT_URL;
const ADMIN_CLIENT_URL = ISDEV
  ? "http://localhost:3001"
  : process.env.ADMIN_CLIENT_URL;

module.exports = {
  ISDEV,
  MONGO_URI,
  PORT,
  JWT_SECRET,
  NODE_MAILER_EMAIL,
  NODE_MAILER_PASSWORD,
  SERVER_URL,
  CLIENT_URL,
  ADMIN_CLIENT_URL,
};
