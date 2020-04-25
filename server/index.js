var express    = require("express");
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var routes = require("./routes.js");
var cors = require('cors');
var config = require('./db-config.js');
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


/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get('/cvcountries', routes.getCoronaVirusCountries);

app.get('/gccountries', routes.getGlobalCausesCountries);

app.get('/gccauses', routes.getGlobalCauses);

app.get('/gyears', routes.getGlobalCauseYears);

app.get('/nyears', routes.getNationalCauseYears);

app.get('/globalcauses/:year', routes.getTopGlobalCauses);

app.get('/nationalcauses/:year', routes.getTopNationalCauses);

app.get('/coronavirus/:country', routes.coronaDataPerCountry);

app.get('/timeline/:country/:cause1/:cause2', routes.timelineData);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});