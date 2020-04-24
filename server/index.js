var express    = require("express");
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var cookieSession = require("cookie-session");
var cookieParser = require("cookie-parser"); // parse cookie header
const passportSetup = require("./passport-setup");
var passport = require('passport');
const keys = require("./keys");
var cors = require('cors');
var authRoutes =  require('./auth-routes');
var app = express();

var connection = mysql.createConnection({
    host     : 'mysqldb.csugpczkhpw3.us-east-1.rds.amazonaws.com',
    port     : '1521',
    user     : 'admin',
    password : 'GirlPower2020',
    database : 'mysqldb'

});
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... ");    
    } else {
        console.log("Error connecting database ... ");    
    }
});

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(
    cookieSession({
        name: "session",
        keys: [keys.cookieKey],
        maxAge: 24 * 60 * 60 * 100
    })
);
// set up routes
app.use('/auth', authRoutes);
// parse cookies
app.use(cookieParser());
// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());
  
var authCheck = (req, res, next) => {
    if(!req.user) {
        // not logged in
        res.redirect('/auth/login');
    } else {
        next();
    }
};
  
// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
app.get("/", authCheck, (req, res) => {
    res.status(200).json({
        authenticated: true,
        message: "user successfully authenticated",
        user: req.user,
        cookies: req.cookies
    });
});

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
// The route localhost:8081/genres is registered to the function
// routes.getAllGenres, specified in routes.js.
// app.get('/genres', routes.getAllGenres);


/* ---- Q1b (Dashboard) ---- */
// app.get('/genres/:genre', routes.getTopInGenre); // Hint: Replace () => {} with the appropriate route handler.


/* ---- Q2 (Recommendations) ---- */
// app.get('/recommendations/:title', routes.getRecs);


/* ---- (Best Genre) ---- */
// app.get('/decades', routes.getDecades);


/* ---- Q3b (Best Genre) ---- */
// app.get('/decades/:decade', routes.bestGenresPerDecade);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});