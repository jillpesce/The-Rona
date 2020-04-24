var express    = require("express");
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var routes = require("./routes.js");
var cors = require('cors');
var config = require('./db-config.js');
// var authRoutes =  require('./auth-routes');
var app = express();

// var connection = mysql.createConnection({
//     host : config.host,
//     port : '1512',
//     user : config.user,
//     password : config.password,
//     database : config.database
// });

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
// app.use('/auth', authRoutes);


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

app.get('/countries', routes.getCountries);


/* ---- Q3b (Best Genre) ---- */
// app.get('/decades/:decade', routes.bestGenresPerDecade);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});