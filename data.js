/*
 *
 *   Nanomachine API/MySQL
 *   Declan Tyson
 *   v0.0.1
 *   01/11/2021
 *
 */

const mysql = require("mysql");

module.exports = {
  connection: () => {
    const credentials = {
      dbUser: process.env.DB_USER || process.env.npm_config_dbUser || 'localhost',
      dbPass: process.env.DB_PASS || process.env.npm_config_dbPass,
      dbHost: process.env.DB_HOST || process.env.npm_config_dbHost,
      dbName: process.env.DB_NAME || process.env.npm_config_dbName || 'bracketer',
    }
    return createMySQLConnection(credentials.dbUser, credentials.dbPass, credentials.dbHost, credentials.dbName);
  },
  generateId: (length) => {
    return generateId(length);
  },
  cleanResults: (data) => {
    return cleanResults(data);
  },
  isNumber: (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
};

const createMySQLConnection = (dbUser, dbPass, dbHost, dbName) => {
  return mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName,
    multipleStatements: true
  });
};

const generateId = (length = 16) => {
  let id = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++)
    id += characters.charAt(Math.floor(Math.random() * characters.length));

  return id;
};

const cleanResults = data => {
  let rows = JSON.parse(data)[0].rows;
  return JSON.stringify(rows);
};
