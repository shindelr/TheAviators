// Main entry point to our web application

// SETUP
// Server setup 
var express = require('express');
var app = express()
PORT = 5001
// Template (handlebars) setup
const {engine} = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');
// Tell express where to find static files
app.use(express.static('public'));
// Database connection
var db = require('./database/db_connector')


// ROUTES
// Display Home page
app.get('/index', function(req, res){
        res.render('index');  // Renders the index.hbs template   
});

// Browse Jets
app.get('/jets', function(req, res){
    let query1 = "select * from Jets;";
    db.pool.query(query1, function(error, rows, fields){
        console.log(rows)
        res.render('jets', {data: rows});
    })
});


// LISTENER
app.listen(PORT, function(){
    console.log('The Aviators have commenced flight on localhost:' + PORT);
});

