// data base connection configuration
const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "Database_learning",
  password: "admin",

  port: 54320,
});

module.exports = pool;
