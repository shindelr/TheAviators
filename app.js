// Main entry point to our web application
// The following code was adapted from the CS340 nodejs-starter-app

// SETUP
// Server setup 
var express = require('express');
var app = express()
// Configuring to handle JSON and form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
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
// GET Functions
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
    let airportQuery = `select airport_id as Airport_Code, city as City, 
    state as State, country as Country 
    from Airports;`;
    db.pool.query(airportQuery, function(error, rows, fields){
        console.log(rows)
        res.render('airports', {data: rows});
    })
    
});

// Browse Customers
app.get('/customers', function(req, res){
    let customersQuery = `select customer_id as Customer_ID, cust_fname as First_Name, cust_lname as Last_Name, 
    cust_email as Email, cust_phone as Phone_Number, airline_miles as Airline_Miles,  
    date_format(member_since, '%a %b %d %Y') as Member_Since
    from Customers;`;
    db.pool.query(customersQuery, function(error, rows, fields){
        console.log(rows)
        res.render('customers', {data: rows});
    })
    
});

// Browse Routes
app.get('/routes', function(req, res){
    let routesQuery = `select route_id AS Route_Number, origin_loc AS Origin,
    destination_loc AS Destination, distance AS Distance, 
    times_flown AS Times_Flown 
    from Routes;`;
    let airportQuery = `select airport_id from Airports;`;

    db.pool.query(routesQuery, function(error1, rows, fields1){
        console.log(rows);
        let routes = rows
        db.pool.query(airportQuery, function(error2, rows, fields2){
            console.log(rows);
            let airports = rows

        res.render('routes', {
                    data: routes, 
                    airportsData: airports
            });
        });
    });
});

//POST Routes

// INSERT Airport
app.post('/add-airport', function(req, res) 
{
    let data = req.body;
    // Capture NULL values - State can be NULL
    let state = parseInt(data.state);
    if (isNaN(state))
    {state = 'NULL'}
    // Create the query and run it on the database
    query1 = `INSERT INTO Airports (airport_id, city, state, country) VALUES ('${data.airport_id}', '${data.city}', '${data.state}', '${data.country}')`;
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `select airport_id as Airport_Code, city as City, 
            state as State, country as Country 
            from Airports;`;
            db.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {               
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {res.send(rows);}
            })
        }
    })
});

// INSERT Customer
app.post('/add-customer', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (cust_fname, cust_lname, cust_email, cust_phone, airline_miles, member_since) VALUES ('${data.cust_fname}', '${data.cust_lname}', '${data.cust_email}', '${data.cust_phone}', ${0}, ${CURRENT_DATE()})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `select customer_id as Customer_ID, cust_fname as First_Name, cust_lname as Last_Name, 
            cust_email as Email, cust_phone as Phone_Number, airline_miles as Airline_Miles,  
            date_format(member_since, '%a %b %d %Y') as Member_Since
            from Customers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {                   
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// INSERT Route
app.post('/add-route', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO Routes (route_id, origin_loc, destination_loc, distance, times_flown) 
    VALUES ('${data.route_id}', '${data.origin_loc}', '${data.destination_loc}', '${data.distance}', ${0})`;
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `select route_id AS Route_Number, origin_loc AS Origin,
            destination_loc AS Destination, distance AS Distance, 
            times_flown AS Times_Flown 
            from Routes;`;
            db.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {                    
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// DELETE Routes

app.delete('/delete-route/', function(req,res,next){
  let data = req.body;
  let routeID = parseInt(data.id);
// delete references to the deleted route from Routes and Tickets table
  let deleteTickets = `DELETE FROM Tickets WHERE pid = ?`;
  let deleteRoutes= `DELETE FROM Routes WHERE id = ?`;


        // Run the 1st query
        db.pool.query(deleteTickets, [routeID], function(error, rows, fields){
            if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            else
            {
                // If no errors found, run this next query
                db.pool.query(deleteRoutes, [routeID], function(error, rows, fields) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});


// LISTENER
app.listen(PORT, function(){
    console.log('The Aviators have commenced flight on localhost:' + PORT);
});
