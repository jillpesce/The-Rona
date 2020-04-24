var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;

var authCheck = (req, res, next) => {
    if(!req.user) {
        // not logged in
        res.redirect('/auth/login');
    } else {
        next();
    }
};

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

function getCountries(req, res) {
    // authCheck();
    var query = `
        SELECT DISTINCT country FROM coronavirus LIMIT 5
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

/* ---- Q3 (Best Genres) ---- */
// function bestGenresPerDecade(req, res) {
//     console.log("test here!!");
//     var inputDecade = req.params.decade;
//     var query = `
//         WITH all_genres AS (
//         SELECT DISTINCT genre
//         FROM Genres
//         ), all_movies AS (
//         SELECT id, (FLOOR(release_year/10)*10) as decade
//         FROM Movies 
//         WHERE (FLOOR(release_year/10)*10) = ${inputDecade}
//         ), avg_ratings_per_genre AS (
//         SELECT g.genre, AVG(m.rating) AS avg_rating
//         FROM all_movies am JOIN Movies m ON m.id = am.id JOIN Genres g ON m.id = g.movie_id
//         GROUP BY g.genre
//         )
//         (SELECT ag.genre, arpg.avg_rating
//         FROM avg_ratings_per_genre arpg JOIN all_genres ag ON arpg.genre = ag.genre)
//         UNION
//         (SELECT ag1.genre, 0 AS avg_rating
//         FROM all_genres ag1
//         WHERE ag1.genre NOT IN (
//         SELECT genre
//         FROM avg_ratings_per_genre 
//         ))
//         ORDER BY avg_rating DESC, genre;
//     `;
//     connection.query(query, function(err, rows, fields) {
//         if (err) console.log(err);
//         else {
//         res.json(rows);
//         }
//     });
// };
  
// The exported functions, which can be accessed in index.js.
module.exports = {
    // getAllGenres: getAllGenres,
    // getTopInGenre: getTopInGenre,
    // getRecs: getRecs,
    // getDecades: getDecades,
    // bestGenresPerDecade: bestGenresPerDecade
    getCountries: getCountries
}