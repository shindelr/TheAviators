// This code is taken directly from step 1 of the CS340 nodejs starter app.
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

var mysql = require('mysql')
var pool = mysql.createPool({
    connectionLimit: 10,
    user: '<username>',
    host: 'classmysql.engr.oregonstate.edu',
    password: '<password>',
    database: '<database name>'
});

module.exports.pool = pool
