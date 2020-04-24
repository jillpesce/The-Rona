var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
//var connection = mysql.createPool(config);

// var connection = mysql.createPool({
//     host     : config.host,
//     user     : config.user,
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



/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- Q1a (Dashboard) ---- */
// function getAllGenres(req, res) {
//     var query = `
//         SELECT DISTINCT g.genre
//         FROM Genres g;
//     `;
//     connection.query(query, function(err, rows, fields) {
//         if (err) console.log(err);
//         else {
//         console.log(rows);
//         res.json(rows);
//         }
//     });
// };
  
/* ---- Q1b (Dashboard) ---- */
// function getTopInGenre(req, res) {
//     var genre = req.params.genre;
//     var query = `
//         SELECT m.title, m.rating, m.vote_count
//         FROM Movies m JOIN Genres g ON m.id = g.movie_id
//         WHERE g.genre = '${ genre }'
//         ORDER BY rating DESC, vote_count DESC
//         LIMIT 10;
//     `;
//     connection.query(query, function(err, rows, fields) {
//         if (err) console.log(err);
//         else {
//         console.log(rows);
//         res.json(rows);
//         }
//     });
// };
  
/* ---- Q2 (Recommendations) ---- */
// function getRecs(req, res) {
//     var inputTitle = req.params.title;
//     var query = `
//         WITH target_genres AS (
//         SELECT DISTINCT g1.genre, m1.id
//         FROM Genres g1 JOIN Movies m1 ON g1.movie_id = m1.id
//         WHERE m1.title = '${inputTitle}'
//         ), target_num AS (
//         SELECT COUNT(*) as num, id
//         FROM target_genres
//         ), num_and_genres AS (
//         SELECT tg.genre, tn.num, tn.id
//         FROM target_genres tg JOIN target_num tn ON tg.id = tn.id
//         ), possible_movies AS (
//         SELECT g.genre, g.movie_id AS id, COUNT(g.movie_id) AS movie_count
//         FROM Genres g JOIN num_and_genres ng ON g.genre = ng.genre
//         GROUP BY g.movie_id
//         )
//         SELECT DISTINCT m.title, m.id, m.rating, m.vote_count
//         FROM Movies m JOIN possible_movies pm ON m.id = pm.id JOIN num_and_genres ng1 ON ng1.num<=pm.movie_count
//         WHERE m.title <> '${inputTitle}'
//         ORDER BY rating DESC, vote_count DESC
//         LIMIT 5;
//     `;
//     connection.query(query, function(err, rows, fields) {
//         if (err) console.log(err);
//         else {
//         res.json(rows);
//         }
//     });
// };
  
/* ---- (Best Genres) ---- */
// function getDecades(req, res) {
//     var query = `
//         SELECT DISTINCT (FLOOR(year/10)*10) AS decade
//         FROM (
//         SELECT DISTINCT release_year as year
//         FROM Movies
//         ORDER BY release_year
//         ) y
//     `;
//     connection.query(query, function(err, rows, fields) {
//         if (err) console.log(err);
//         else {
//         res.json(rows);
//         }
//     });
// };

function getCountries(req, res) {
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