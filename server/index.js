var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
var cookieParser = require("cookie-parser"); // parse cookie header
var passportSetup = require("./passport-setup");
var passport = require("passport");
const keys = require("./keys");
var cors = require("cors");
// var authRoutes = require("./auth-routes");
var config = require("./db-config.js");
var app = express();
var routes = require("./routes");

var connection = mysql.createConnection({
  host: "mysqldb.csugpczkhpw3.us-east-1.rds.amazonaws.com",
  port: "1521",
  user: "admin",
  password: "GirlPower2020",
  database: "mysqldb",
});

connection.connect(function (err) {
  if (!err) {
    console.log("Database is connected ... ");
  } else {
    console.log("Error connecting database ... ");
  }
});

app.use(
  cors({
    credentials: true,
    origin: `https://localhost:${process.env.PORT}`,
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: [keys.session.cookieKey],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// parse cookies
app.use(cookieParser());
// initalize passport
// app.use(passport.initialize());
// deserialize cookie from the browser
// app.use(passport.session());

// set up routes
// app.use("/auth", authRoutes);

app.use("/api", routes.router);

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */



app.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});
