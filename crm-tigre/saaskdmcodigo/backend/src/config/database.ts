import "../bootstrap";

const isTest = process.env.NODE_ENV === "test";

module.exports = {
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin"
  },
  dialect: process.env.DB_DIALECT || "mysql",
  timezone: "-03:00",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || (process.env.DB_DIALECT === "postgres" ? 5432 : 3306),
  database: isTest ? (process.env.DB_NAME_TEST || process.env.DB_NAME) : process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  logging: process.env.DB_DEBUG === "true"
};
