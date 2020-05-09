var config = require("./db-config.js");
var mysql = require("mysql");

config.connectionLimit = 10;

var connection = mysql.createConnection({
  host: "mysqldb.csugpczkhpw3.us-east-1.rds.amazonaws.com",
  port: "1521",
  user: "admin",
  password: "GirlPower2020",
  database: "mysqldb",
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
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

function coronaDataPerCountry(req, res) {
  let inputCountry = req.params.country;

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

  connection.query(query, function (err, rows, fields) {
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

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getCoronaVsOtherCauses(req, res) {
  let inputCountry = req.params.country;

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

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {

      var post_query = new Date().getTime();
      var duration = (post_query - pre_query) / 1000;
      console.log("time taken: " + duration)

      res.json(rows);
    }
  });
}

function getGlobalCausesCountries(req, res) {
  var query = `
        SELECT DISTINCT country 
        FROM cause_of_death_globally
        WHERE country <> ""
        ORDER BY country
    `;
  if (connection) {
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

function getGlobalCauses(req, res) {
  var query = `
        SELECT DISTINCT cause FROM cause_of_death_globally
        ORDER BY cause
    `;
  if (connection) {
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

function getTimelineData(req, res) {
  let inputCountry = req.params.country;
  let inputCause1 = req.params.cause1;
  let inputCause2 = req.params.cause2;
  // var pre_query = new Date().getTime();

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

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      // var post_query = new Date().getTime();
      // var duration = (post_query - pre_query) / 1000;
      // console.log("timeline data took: " +duration);
      res.json(rows);
    }
  });
}

function getTimelinePop(req, res) {
  let inputCountry = req.params.country;
  let query = `
        SELECT population
        FROM population
        WHERE country = "${inputCountry}";
    `;

  connection.query(query, function (err, rows, fields) {
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
  // var pre_query = new Date().getTime();
  let query = `WITH cause1(cause, num_deaths, stdev) AS (
        SELECT cause, AVG(num_deaths), STDDEV(num_deaths)
        FROM cause_of_death_globally
        WHERE country = "${inputCountry}"
        AND cause = "${inputCause1}"
        GROUP BY cause),
        cause2(cause, num_deaths, stdev) AS (
        SELECT cause, AVG(num_deaths), STDDEV(num_deaths)
        FROM cause_of_death_globally
        WHERE country = "${inputCountry}"
        AND cause = "${inputCause2}"
        GROUP BY cause)
        SELECT c1.num_deaths AS avg1, c2.num_deaths AS avg2, c1.stdev AS stdev1, c2.stdev AS stdev2
        FROM cause1 c1, cause2 c2;
        `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      // var post_query = new Date().getTime();
      // var duration = (post_query - pre_query) / 1000;
      // console.log("stats data took: " +duration);
      res.json(rows);
    }
  });
}

function getGlobalCauseYears(req, res) {
  var query = `
        SELECT DISTINCT year FROM cause_of_death_globally
        WHERE year <> "0"
    `;
  if (connection) {
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

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
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

function getNationalCauseYears(req, res) {
  var query = `
        SELECT DISTINCT year FROM cause_of_death_nationally
    `;
  if (connection) {
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

function getTopNationalCauses(req, res) {
  let year = req.params.year;
  var query = `
        SELECT cause, SUM(num_deaths) as num_deaths
        FROM cause_of_death_nationally
        WHERE year = "${year}" AND cause <> "All causes"
        AND num_deaths IS NOT NULL
        GROUP BY (cause)
        ORDER BY SUM(num_deaths) DESC  
    `;
  if (connection) {
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

function getLifeExpCountries(req, res) {
  var query = `
          SELECT DISTINCT country
          FROM life_expectancy;
      `;
  if (connection) {
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

function getLifeExpYears(req, res) {
  var query = `
          SELECT DISTINCT year
          FROM life_expectancy;
      `;
  if (connection) {
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

function getAvgLifeExpectancy(req, res) {
  let country = req.params.country;
  var query = `
        SELECT avg_life_expectancy, year
        FROM life_expectancy
        WHERE country = ${country};
    `;
  if (connection) {
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

function getCorrelation(req, res) {
  let country = req.params.country;
  let cause = req.params.cause;
  var pre_query = new Date().getTime();
  var query = `
        WITH CauseByPopulation AS (
          SELECT c.country, c.cause, c.year, c.num_deaths as num
          FROM cause_of_death_globally c
          WHERE c.country = "${country}"
          AND c.cause = "${cause}"
          AND c.num_deaths IS NOT NULL
          AND c.num_deaths <> 0)
      SELECT * 
      FROM
      CauseByPopulation a
      NATURAL JOIN population p;
    `;
  if (connection) {
    connection.query(query, function (err, rows, fields) {
      if (err) console.log(err);
      else {
        var post_query = new Date().getTime();
        var duration = (post_query - pre_query) / 1000;
        console.log("correlation 1 data took: " +duration);
        res.json(rows);
      }
    });
  }
}

function getCorrelation2(req, res) {
    let country = req.params.country;
    let cause = req.params.cause;
    var pre_query = new Date().getTime();
    var query = `

    WITH TotalCorona AS (
        SELECT c.country, 'COVID-19' COLLATE utf8_general_ci as cause, 2020 as year, SUM(c.deaths) as num, SUM(c.deaths) as all_deaths
        FROM coronavirus c
        WHERE c.country = "${country}"
        GROUP BY (c.country)),
    CauseByPopulation AS (
        SELECT c.country, c.cause, c.year, c.num_deaths as num
        FROM cause_of_death_globally c
        WHERE c.country = "${country}"
        AND c.cause = "${cause}"
        AND c.num_deaths IS NOT NULL
        AND c.num_deaths <> 0),
    AllCauses AS (
        SELECT c.country, c.year, SUM(num_deaths) as all_deaths
        FROM 
        cause_of_death_globally c
        WHERE c.country = "${country}"
        GROUP BY c.country, c.year),
    Othercauses AS (
      SELECT *
      FROM AllCauses a
      NATURAL JOIN CauseByPopulation b
    )
    SELECT * 
    FROM
      (SELECT * 
        FROM Othercauses o
        UNION
        SELECT *
        FROM TotalCorona t) x
    `;

    if (connection) {
      connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
          var post_query = new Date().getTime();
          var duration = (post_query - pre_query) / 1000;
          console.log("correlation data 2 took: " +duration);
          res.json(rows);
        }
      });
    }
  }

// The exported functions, which can be accessed in index.js.
module.exports = {
  coronaDataPerCountry: coronaDataPerCountry,
  getCoronaVirusCountries: getCoronaVirusCountries,
  getGlobalCausesCountries: getGlobalCausesCountries,
  getMostRecentGlobalStatistics: getMostRecentGlobalStatistics,
  getCoronaVsOtherCauses: getCoronaVsOtherCauses,
  getTimelineData: getTimelineData,
  getAvgNumDeaths: getAvgNumDeaths,
  getTimelinePop: getTimelinePop,
  getGlobalCauses: getGlobalCauses,
  getGlobalCauseYears: getGlobalCauseYears,
  getTopGlobalCauses: getTopGlobalCauses,
  getNationalCauseYears: getNationalCauseYears,
  getTopNationalCauses: getTopNationalCauses,
  getLifeExpCountries: getLifeExpCountries,
  getLifeExpYears: getLifeExpYears,
  getAvgLifeExpectancy: getAvgLifeExpectancy,
  getCorrelation: getCorrelation,
  getCorrelation2: getCorrelation2
};
