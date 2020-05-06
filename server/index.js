var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
var cookieParser = require("cookie-parser"); // parse cookie header
var passportSetup = require("./passport-setup");
var passport = require("passport");
const keys = require("./keys");
var cors = require("cors");
var authRoutes = require("./auth-routes");
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
    origin: "http://localhost:3000",
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
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

// set up routes
app.use("/auth", authRoutes);

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get("/cvcountries", routes.getCoronaVirusCountries);

app.get("/gccountries", routes.getGlobalCausesCountries);

app.get("/gccauses", routes.getGlobalCauses);

app.get("/gyears", routes.getGlobalCauseYears);
app.get("/coronavirus/:country", routes.coronaDataPerCountry);

app.get("/globalstats", routes.getMostRecentGlobalStatistics);

app.get("/coronaVsOtherCauses/:country", routes.getCoronaVsOtherCauses);

app.get("/gccountries", routes.getGlobalCausesCountries);

app.get("/nyears", routes.getNationalCauseYears);

app.get("/globalcauses/:year", routes.getTopGlobalCauses);

app.get("/nationalcauses/:year", routes.getTopNationalCauses);

app.get("/coronavirus/:country", routes.coronaDataPerCountry);

app.get("/timeline/:country/:cause1/:cause2", routes.timelineData);

app.get("/lecraces", routes.getLifeExpRaces);

app.get("/lecsexes", routes.getLifeExpSexes);

app.get("/lecyears", routes.getLifeExpYears);

app.get("/lifeexpcalc/:race/:sex/:year", routes.getAvgLifeExpectancy);

app.get("/timeline/:country/:cause1/:cause2", routes.getTimelineData);

app.get("/timeline/average/:country/:cause1/:cause2", routes.getAvgNumDeaths);

app.get("/timeline/population/:country", routes.getTimelinePop);

app.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});
