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
app.get('/', function(req, res){
        res.render('index');  // Renders the index.hbs template   
});

// Browse Jets
app.get('/jets', function(req, res){
    let query = `
    select jet_id, Models.make, Jets.model_id, Models.pass_capacity, 
    Jets.date_acquired, Jets.total_hours 
    from Jets 
    left join Models on Jets.model_id = Models.model_id;`;
    db.pool.query(query, function(error, rows, fields){
        console.log(rows)
        res.render('jets', {data: rows});
    })
});

// Browse Models
app.get('/models', function(req, res){
    let query = "select * from Models;";
    db.pool.query(query, function(error, rows, fields){
        console.log(rows)
        res.render('models', {data: rows});
    })
});

// Browse Tickets
app.get('/tickets', function(req, res){
    let query = `select ticket_id as Ticket_Number, Customers.cust_fname, 
    Customers.cust_lname, route_id, jet_id, price, flight_date 
    from Tickets 
    left join Customers on Tickets.customer_id = Customers.customer_id;`;
    db.pool.query(query, function(error, rows, fields){
        console.log(rows)
        res.render('tickets', {data: rows});
    })
});

// LISTENER
app.listen(PORT, function(){
    console.log('The Aviators have commenced flight on localhost:' + PORT);
});

