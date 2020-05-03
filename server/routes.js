var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;

var connection = mysql.createConnection({
    host     : 'mysqldb.csugpczkhpw3.us-east-1.rds.amazonaws.com',
    port     : '1521',
    user     : 'admin',
    password : 'GirlPower2020',
    database : 'mysqldb'

});

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* --------------------CoronaVirus Page Queries -------------------- */
function getCoronaVirusCountries(req, res) {
    var query = `
        SELECT DISTINCT country FROM coronavirus
    `;
    if (connection) {
        connection.query(query, function(err, rows, fields) {
            if (err) console.log(err);
            else {
                res.json(rows);
            }
        });
    }
};

function coronaDataPerCountry(req, res) {
    console.log('coronaData api hit');
    let inputCountry = req.params.country;
    console.log(inputCountry);

    let query = `
        WITH country(confirmed, recovered, deaths, date_checked) AS (
            SELECT confirmed, recovered, deaths, date_checked
            FROM coronavirus 
            WHERE country = ${inputCountry}),
            global(confirmed, recovered, deaths, date_checked) AS (
            SELECT SUM(confirmed), SUM(recovered), SUM(deaths), date_checked
            FROM coronavirus
            GROUP BY date_checked)
            SELECT c.date_checked, 
            c.confirmed AS confirmed, 
            c.recovered AS recovered, 
            c.deaths AS deaths, 
            g.confirmed AS confirmed_glob, 
            g.recovered AS recovered_glob, 
            g.deaths AS deaths_glob
            FROM country c JOIN global g ON c.date_checked = g.date_checked ORDER BY STR_TO_DATE(c.date_checked, '%m/%d/%y');
    `;

    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
            res.json(rows);
        }
    });
}

function getMostRecentGlobalStatistics(req, res) {
    let query = `
        SELECT SUM(confirmed) AS confirmed, SUM(recovered) AS recovered, SUM(deaths) AS deaths, date_checked
        FROM coronavirus
        GROUP BY date_checked
        ORDER BY STR_TO_DATE(date_checked, '%m/%d/%y') DESC LIMIT 1;
    `;
    // let query = 'SELECT * FROM coronavirus;';

    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
            res.json(rows);
        }
    });
}

function getCoronaVsOtherCauses(req, res) {
    let inputCountry = req.params.country;
    console.log(inputCountry);

    let query = `
        WITH TotalCorona AS (
            SELECT c.country, 'COVID-19' COLLATE utf8_general_ci as cause, c.deaths as num
            FROM coronavirus c 
            WHERE c.country = ${inputCountry}
            ORDER BY STR_TO_DATE(c.date_checked, '%m/%d/%y') DESC LIMIT 1),
        CauseByPopulation AS (
            SELECT c.country, c.cause, c.num_deaths as num
            FROM cause_of_death_globally c
            WHERE c.year = '2017'
            AND c.country = ${inputCountry}
            AND c.num_deaths IS NOT NULL)
            SELECT * 
            FROM
                (SELECT *
                FROM TotalCorona
                    UNION
                SELECT *
                FROM CauseByPopulation) X
            WHERE num<>0
            ORDER BY num DESC;
    `;

    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
            res.json(rows);
        }
    });
}

function getGlobalCausesCountries(req, res) {
    var query = `
        SELECT DISTINCT country FROM cause_of_death_globally
    `;
    if (connection) {
        connection.query(query, function(err, rows, fields) {
            if (err) console.log(err);
            else {
                res.json(rows);
            }
        });
    }
};

function getGlobalCauses(req, res) {
    var query = `
        SELECT DISTINCT cause FROM cause_of_death_globally
    `;
    if (connection) {
        connection.query(query, function(err, rows, fields) {
            if (err) console.log(err);
            else {
                res.json(rows);
            }
        });
    }
};

function getTimelineData(req, res) {
    console.log('timelineData api hit');
    let inputCountry = req.params.country;
    let inputCause1 = req.params.cause1;
    let inputCause2 = req.params.cause2;

    let query = `
        WITH cause1(year, cause, num_deaths) AS (
            SELECT year, cause, num_deaths
            FROM cause_of_death_globally
            WHERE country = "${inputCountry}"
            AND cause = "${inputCause1}"),
            cause2(year, cause, num_deaths) AS (
            SELECT year, cause, num_deaths
            FROM cause_of_death_globally
            WHERE country = "${inputCountry}"
            AND cause = "${inputCause2}")
            SELECT c1.year AS year, c1.num_deaths AS deaths_cause1, c2.num_deaths AS deaths_cause2
            FROM cause1 c1 JOIN cause2 c2 ON c1.year = c2.year
            ORDER BY c1.year;
    `;

    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
            res.json(rows);
        }
    });
}

function getTimelinePeaks(req, res) {
    let inputCountry = req.params.country;
    let inputCause = req.params.cause;
    let query = `SELECT DISTINCT c1.year AS year
    FROM cause_of_death_globally c1
    WHERE (c1.cause = "${inputCause}"
        AND c1.country = "${inputCountry}"
        AND (c1.num_deaths > 500 + 
            (SELECT num_deaths 
            FROM cause_of_death_globally c2
            WHERE c2.year = c1.year - 1
            AND c2.cause = "${inputCause}"
            AND c2.country = "${inputCountry}"))
        OR  (c1.num_deaths + 500 < 
            (SELECT c2.num_deaths 
            FROM cause_of_death_globally c2
            WHERE c2.year = c1.year - 1
            AND c2.cause = "${inputCause}"
            AND c2.country = "${inputCountry}")))
    AND (c1.cause = "${inputCause}"
        AND c1.country = "${inputCountry}"
        AND (c1.num_deaths > 500 + 
            (SELECT num_deaths 
            FROM cause_of_death_globally c2
            WHERE c2.year = c1.year + 1
            AND c2.cause = "${inputCause}"
            AND c2.country = "${inputCountry}"))
        OR (c1.num_deaths + 500 < 
            (SELECT c2.num_deaths 
            FROM cause_of_death_globally c2
            WHERE c2.year = c1.year + 1
            AND c2.cause = "${inputCause}"
            AND c2.country = "${inputCountry}")))
    ORDER BY c1.year;
    `;
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
            res.json(rows);
        }
    });
}

function getAvgNumDeaths(req, res) {
    let inputCountry = req.params.country;
    let inputCause1 = req.params.cause1;
    let inputCause2 = req.params.cause2;
    let query = `WITH cause1(cause, num_deaths) AS (
        SELECT cause, AVG(num_deaths)
        FROM cause_of_death_globally
        WHERE country = "${inputCountry}"
        AND cause = "${inputCause1}"
        GROUP BY cause),
        cause2(cause, num_deaths) AS (
        SELECT cause, AVG(num_deaths)
        FROM cause_of_death_globally
        WHERE country = "${inputCountry}"
        AND cause = "${inputCause2}"
        GROUP BY cause)
        SELECT c1.num_deaths AS avg1, c2.num_deaths AS avg2
        FROM cause1 c1, cause2 c2;
        `;
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
            res.json(rows);
        }
    });
}

function getGlobalCauseYears(req, res) {
    console.log("getting years")
    var query = `
        SELECT DISTINCT year FROM cause_of_death_globally
    `;
    if (connection) {
        connection.query(query, function(err, rows, fields) {
            if (err) console.log(err);
            else {
                res.json(rows);
            }
        });
    }
};

function getTopGlobalCauses(req, res) {
    let year = req.params.year;
    var query = `
        SELECT cause, SUM(num_deaths) as num_deaths
        FROM cause_of_death_globally
        WHERE year = "${year}"
        AND num_deaths IS NOT NULL
        GROUP BY (cause)
        ORDER BY SUM(num_deaths) DESC    
    `;
    if (connection) {
        connection.query(query, function(err, rows, fields) {
            if (err) console.log(err);
            else {
                res.json(rows);
            }
        });
    }
};

function getNationalCauseYears(req, res) {
    console.log("getting national years")
    var query = `
        SELECT DISTINCT year FROM cause_of_death_nationally
    `;
    if (connection) {
        connection.query(query, function(err, rows, fields) {
            if (err) console.log(err);
            else {
                console.log(rows);
                res.json(rows);
            }
        });
    }
};

function getTopNationalCauses(req, res) {
    let year = req.params.year;
    var query = `
        SELECT cause, SUM(num_deaths) as num_deaths
        FROM cause_of_death_nationally
        WHERE year = "${year}"
        AND num_deaths IS NOT NULL
        GROUP BY (cause)
        ORDER BY SUM(num_deaths) DESC    
    `;
    if (connection) {
        connection.query(query, function(err, rows, fields) {
            if (err) console.log(err);
            else {
                res.json(rows);
            }
        });
    }
};
  
// The exported functions, which can be accessed in index.js.
module.exports = {
    coronaDataPerCountry: coronaDataPerCountry,
    getCoronaVirusCountries: getCoronaVirusCountries,
    getMostRecentGlobalStatistics: getMostRecentGlobalStatistics,
    getCoronaVsOtherCauses: getCoronaVsOtherCauses,
    getGlobalCausesCountries: getGlobalCausesCountries,
    getTimelineData: getTimelineData,
    getTimelinePeaks: getTimelinePeaks,
    getAvgNumDeaths: getAvgNumDeaths,
    getGlobalCauses: getGlobalCauses,
    getGlobalCauseYears: getGlobalCauseYears,
    getTopGlobalCauses: getTopGlobalCauses,
    getNationalCauseYears: getNationalCauseYears,
    getTopNationalCauses: getTopNationalCauses,
}