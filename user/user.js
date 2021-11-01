/*
*   Nanomachine API/User
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
    createUser: (user, password, callback) => {
        createUser(user, password, callback);
    },

    authenticateUser: (user, password, callback) => {
        authenticateUser(user, password, callback);
    },

    validateSession: (sessionId, callback) => {
        validateSession(sessionId, callback);
    }
};

const createUser = (user, password, callback = () => {}) => {
    log.info(`Creating user ${user}...`);
    connection.query('SELECT * FROM user WHERE ?', {
        email: user
    }, (err, rows) => {
        if(!err && rows.length === 0) {
            const userId = data.generateId();
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    connection.query('INSERT INTO user SET ?', {
                        id: userId,
                        email: user,
                        password: hash
                    }, (err, rows) => {
                        log.success("User created");
                        log.info("Generating days");
                        for(let i = 1; i <= 30; i++) {
                            const date = new Date();
                            date.setFullYear(2021);
                            date.setMonth(10);
                            date.setDate(i);

                            connection.query('INSERT INTO day SET ?', {
                                id: data.generateId(),
                                date: date.toISOString().split('T')[0],
                                index: i,
                                userId
                            });
                        }  

                        log.success("You're all set!");
                    });
                });
            });
        } else if(err) {
            log.error(`Error creating user (${err})`);
            callback();
        } else {
            log.warn(`Error creating user ${user} (User already exists)`);
            callback();
        }
    });
};

const authenticateUser = (user, password, callback = () => {}) => {
    log.info(`Authenticating user ${user}...`);
    connection.query('SELECT * FROM user WHERE ?', {
        email: user
    }, (err, rows) => {
        if(!err && rows.length) {
            log.info("User found");
            bcrypt.compare(password, rows[0].password, (err, result) => {
                if(result) {
                    log.success("User authenticated");
                    createSession(rows[0].id, callback);
                } else {
                    log.warn("Login failed");
                    callback({ sessionId: null });
                }
            });
        } else if(rows.length === 0) {
            log.warn(`User not found`);
            callback({ sessionId: null });
        } else {
            log.error(`Error logging in user (${err})`);
            callback(err);
        }
    })
};

const createSession = (userId, callback = () => {}) => {
    log.info("Creating session...");
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    const sessionId = data.generateId(64);
    connection.query('INSERT INTO session SET ?', {
        id: sessionId,
        userId,
        expiry
    }, (err, rows) => {
        if(!err) {
            log.success(`Session ${sessionId} created expiring at ${expiry}`);
            callback({ sessionId });
        } else {
            log.error(`Error creating session (${err})`);
            callback(err);
        }
    });
};

const validateSession = (sessionId, callback = () => {}) => {
    log.info("Validating session...");
    connection.query('SELECT * FROM session WHERE ? ORDER BY expiry DESC', {
        id: sessionId
    }, (err, rows) => {
       if(!err && rows.length) {
           const now = new Date();
           if(now > rows[0].expiry) {
               log.warn("Session expired");
               callback({ sessionStatus: "expired" });
           } else {
               log.info("Session is valid");
               callback({ sessionStatus: "valid" });
           }
       } else {
           log.error(`Error validating session (${err})`);
           callback(err);
       }
    });
};
