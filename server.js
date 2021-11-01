/*
*
*   Nanomachine API
*   Declan Tyson
*   v0.0.1
*   01/11/2021
*
*/

const http = require("http"),
  ejs = require("ejs"),
  fs = require("fs"),
  express = require("express"),
  app = express(),
  bodyParser = require('body-parser'),
  port = process.env.PORT || 3001;

require('dotenv').config();

const initialSpec = process.env.npm_config_initialSpec || -1,
  dbUser = process.env.DB_USER || process.env.npm_config_dbUser || -1,
  dbPass = process.env.DB_PASS || process.env.npm_config_dbPass || -1,
  dbName = process.env.DB_NAME || process.env.npm_config_dbName || -1,
  dbHost = process.env.DB_HOST || process.env.npm_config_dbHost || -1,
  initialUser = process.env.INITIAL_USER || false,
  initialPassword = process.env.INITIAL_PASSWORD || false;

if (dbUser === -1 || dbPass === -1) {
  console.log(
    "No database credentials provided. Please pass them with --dbUser and --dbPass."
  );
  process.exit();
}

const setCORS = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(setCORS);
app.use(bodyParser.urlencoded({ extended: true }));

const settings = require("./settings/settings"),
  user = require("./user/user"),
  dataControls = require("./data");

if(initialUser && initialPassword) {
  user.createUser(initialUser, initialPassword);
}

const registerAuthenticatedEndpoint = (url, callback) => {
  app.put(url, (req, res) => {
    user.validateSession(req.body.sessionId, data => {
      if(data.sessionStatus === "valid") {
        callback(req, res, user);
      } else {
        res.end(JSON.stringify({ sessionStatus: "expired" }));
      }
    });
  });
};

app.put('/login', (req, res) => {
  user.authenticateUser(req.body.user, req.body.password, data => {
    res.end(JSON.stringify(data));
  });
});

app.put('/validate-session', (req, res) => {
  user.validateSession(req.body.sessionId, data => {
    res.end(JSON.stringify(data));
  });
});

app.get("/settings/:key", (req, res) => {
  settings.get(req.params.key, data => {
    renderJson(res, data);
  });
});


const renderJson = (res, body) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  console.log(body);
  body = dataControls.cleanResults(body);

  res.end(body);
};

http.createServer(app).listen(port);

console.log(`App running on ${port}`);
