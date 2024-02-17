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
// Tell express where to find static files, not needed atm
// app.use(express.static('public'));
// Database connection
var db = require('./database/db_connector')


// ROUTES
// Display Home page
app.get('/', function(req, res){
        res.render('index');  // Renders the index.hbs template   
});

// Browse Jets & Models
app.get('/jets', function(req, res){
    let jetQuery = `
    select jet_id, Models.make, Jets.model_id, Models.pass_capacity, 
    date_format(Jets.date_acquired, '%a %b %d %Y') as date_acquired, Jets.total_hours 
    from Jets 
    left join Models on Jets.model_id = Models.model_id;`;

    let modelQuery = "select * from Models;";


    db.pool.query(jetQuery, function(error1, rows, fields1){
        console.log(rows);
        let rows1 = rows
        db.pool.query(modelQuery, function(error2, rows, fields2){
            console.log(rows);
            let rows2 = rows

        res.render('jets', {
                    jetData: rows1, 
                    modelData: rows2
            });
        });
    });
});

// Browse Tickets
app.get('/tickets', function(req, res){
    let query = `select ticket_id as Ticket_Number, Customers.cust_fname, 
    Customers.cust_lname, route_id, jet_id, price, date_format(flight_date, '%a %b %d %Y') as flight_date 
    from Tickets 
    left join Customers on Tickets.customer_id = Customers.customer_id;`;
    db.pool.query(query, function(error, rows, fields){
        console.log(rows)
        res.render('tickets', {data: rows});
    })
});

// Browse Airports
app.get('/airports', function(req, res){
    let airportQuery = `select * from Airports;`
    db.pool.query(airportQuery, function(error, rows, fields){
        res.render('airports', {data: rows});
    })
    
});

// Browse Customers
app.get('/customers', function(req, res){
    let customersQuery = `select * from Customers;`
    db.pool.query(customersQuery, function(error, rows, fields){
        res.render('customers', {data: rows});
    })
    
});

// Browse Routes
app.get('/routes', function(req, res){
    let routesQuery = `select * from Routes;`
    db.pool.query(routesQuery, function(error, rows, fields){
        res.render('routes', {data: rows});
    })
    
});


// LISTENER
app.listen(PORT, function(){
    console.log('The Aviators have commenced flight on localhost:' + PORT);
});
