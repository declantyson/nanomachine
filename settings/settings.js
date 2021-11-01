/*
 *
 *   Nanomachine API/Settings
 *   Declan Tyson
 *   v0.0.1
 *   01/11/2021
 *
 */

const data = require('../data'),
  fs = require('fs'),
  connection = data.connection();

module.exports = {
  get: (key = -1, callback) => {
    let results = [],
      errors = [];

    if (key === -1) {
      errors.push({
        ST02: 'Insufficient or incorrect parameters supplied. Please check the documentation for required parameters.',
      });
    }

    if (errors.length > 0) {
      console.log(errors);
      if (callback) callback(JSON.stringify(errors));
      return;
    }

    const query = 'SELECT * FROM settings WHERE settingKey = ?';
    connection.query(query, key, (err, rows, fields) => {
      if (err) {
        console.log(err);
        results.push({
          'ST01-S': 'An error occurred - please check logs or contact an administrator.',
        });
      } else {
        results.push({
          rows: rows,
        });
      }
      callback(JSON.stringify(results, null, 2));
    });
  },
  update: (params = {}, callback = null) => {
    updateSetting(params, callback);
  },
};

const updateSetting = (params = {}, callback = null) => {
  let results = [],
    errors = [];

  if (!params.key || !params.value) {
    errors.push({
      ST03: 'Insufficient or incorrect parameters supplied. Please check the documentation for required parameters.',
    });
  }

  if (errors.length > 0) {
    console.log(errors);
    if (callback) callback(JSON.stringify(errors));
    return;
  }

  const updateQuery = 'UPDATE settings SET ? WHERE settingKey = ?';
  const updateParams = [{ settingValue: params.value }, params.key];
  connection.query(updateQuery, updateParams, (err, rows, fields) => {
    if (err) {
      console.log(err);
      results.push({
        'ST01-I': 'An error occurred - please check logs or contact an administrator.',
      });
    } else {
      console.log(updateParams);
    }

    if(callback) callback();
  });
};
