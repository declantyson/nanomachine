/*
*   Nanomachine API/Day
*   Declan Tyson
*   v0.0.1
*   01/11/2021
*
*/

const bcrypt = require('bcrypt');

const saltRounds = 10;

const log = require('../log');
const data = require('../data');
const connection = data.connection();

module.exports = {
    getUserDays: (userId, callback) => {
        getUserDays(userId, callback);
    }
};

const getUserDays = (userId, callback = () => {}) => {
    const results = [];
    log.info("Getting days for user...");
    connection.query('SELECT * FROM days WHERE ?', {
        userId
    }, (err, rows) => {
       if(!err && rows.length) {
          results.push({
            rows: rows,
          });
          callback(JSON.stringify(results, null, 2));
       } else {
           log.error(`Error validating session (${err})`);
           callback(err);
       }
    });
};
