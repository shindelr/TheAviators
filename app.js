// Main entry point to our web application

// SETUP
// Server setup 
var express = require('express');
var app = express()

// Configuring to handle JSON and form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT = 5003  // Dev PORT

// Template (handlebars) setup
const {engine} = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');

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
        // console.log(rows);
        let rows1 = rows
        db.pool.query(modelQuery, function(error2, rows, fields2){
            // console.log(rows);
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
    // Variety of queries to get all the necessary dropdowns populated.
    // Doing this will helps with creating new entries in the interesection table
    let ticketQuery = `select 
                ticket_id as \`Ticket Number\`, 
                Customers.cust_fname as \`First Name\`, 
                Customers.cust_lname as \`Last Name\`, 
                route_id as \`Route Number\`, 
                jet_id as \`Jet ID\`, 
                price as Price, 
                date_format(flight_date, '%a %b %d %Y') as \`Flight Date\` 
                from Tickets 
                left join Customers on Tickets.customer_id = Customers.customer_id;`;

    let customerQuery = `select customer_id, cust_fname, cust_lname from Customers;`;
    let routeQuery = `select route_id from Routes;`;
    let jetQuery = `select jet_id from Jets;`;

    db.pool.query(ticketQuery, function(error, rows, fields){
        let ticketRows = rows;
        db.pool.query(customerQuery, function(error, rows, fields){
            let custRows = rows;
            db.pool.query(routeQuery, function(error, rows, fields){
                let routeRows = rows;
                db.pool.query(jetQuery, function(error, rows, fields){
                    let jetRows = rows;
                    res.render('tickets', {
                                            ticketData: ticketRows,
                                            custData: custRows,
                                            routeData: routeRows,
                                            jetData: jetRows
                                        });
                })
            })
        })     
    })
});

// Browse Airports
app.get('/airports', function(req, res){
    let airportQuery = `select * from Airports;`;
    db.pool.query(airportQuery, function(error, rows, fields){
        res.render('airports', {data: rows});
    })
    
});

// Browse Customers
app.get('/customers', function(req, res){
    let customersQuery = `select * from Customers;`;
    db.pool.query(customersQuery, function(error, rows, fields){
        res.render('customers', {data: rows});
    })
    
});

// Browse Routes
app.get('/routes', function(req, res){
    let routesQuery = `select * from Routes;`;
    db.pool.query(routesQuery, function(error, rows, fields){
        res.render('routes', {data: rows});
    })
    
});

// POST ROUTES

// Create a new Jet
app.post('/add-jet-ajax', function(req, res){
    let data = req.body;
    // May need to do some null handling here
    insertQuery = `insert into Jets (jet_id, model_id, total_hours, date_acquired) 
                   values (
                    '${data.jet_id}', 
                    (select model_id from Models where model_id = '${data.model_id}'), 
                    ${data.total_hours}, 
                    '${data.date_acquired}'
                    );`; 

    db.pool.query(insertQuery, function(error, rows, fields){
        // Error handling
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        // Send back the whole table now
        else {
            selectQuery = `select 
                                jet_id, 
                                Models.make, 
                                Jets.model_id, 
                                Models.pass_capacity, 
                                date_format(Jets.date_acquired, '%a %b %d %Y') as date_acquired, 
                                Jets.total_hours 
                           from Jets 
                                left join Models on Jets.model_id = Models.model_id;`;

            db.pool.query(selectQuery, function(error, rows, fields){
                // Error handling
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })

        }
    })

});

// Create a new Model
app.post('/add-model-ajax', function(req, res){
    let data = req.body;

    insertQuery = `insert into Models (model_id, make, pass_capacity)
                    values (
                        '${data.model_id}', 
                        '${data.make}', 
                        ${data.pass_capacity}
                        );`;

    db.pool.query(insertQuery, function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else {
            selectQuery = `select * from Models`;
            db.pool.query(selectQuery, function(error, rows, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})

// Create a new Ticket
app.post('/add-ticket-ajax', function(req, res){
    let data = req.body

    insertQuery = `insert into Tickets (customer_id, route_id, jet_id, price, flight_date)
                    values (
                        (select customer_id from Customers where customer_id = ${data.customer_id}),
                        (select route_id from Routes where route_id = ${data.route_id}),
                        (select jet_id from Jets where jet_id = '${data.jet_id}'),
                        ${data.price},
                       '${data.flight_date}'
                    );`;
    db.pool.query(insertQuery, function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else {
            selectQuery = `select 
            ticket_id as \`Ticket Number\`, 
            Customers.cust_fname as \`First Name\`, 
            Customers.cust_lname as \`Last Name\`, 
            route_id as \`Route Number\`, 
            jet_id as \`Jet ID\`, 
            price as Price, 
            date_format(flight_date, '%a %b %d %Y') as \`Flight Date\` 
            from Tickets 
            left join Customers on Tickets.customer_id = Customers.customer_id;`;
            db.pool.query(selectQuery, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })

})

// UPDATE Ticket
app.put('/update-ticket-ajax', function(req, res, next){
    let data = req.body;
    let ticketID = data.ticket_id;
    let custID = data.customer_id;
    let routeID = data.route_id;
    let jet_id = parseInt(data.jet_id);
    let price = data.price;
    let flight_date = parseInt(data.flight_date);

    let updateQuery = `update Tickets
                            set
                            customer_id = ?,
                            route_id = ?,
                            jet_id = ?,
                            price = ?,
                            flight_date = ?
                       where ticket_id = ?;`;
    let selectQuery =  `select 
                        ticket_id as \`Ticket Number\`, 
                        Customers.cust_fname as \`First Name\`, 
                        Customers.cust_lname as \`Last Name\`, 
                        route_id as \`Route Number\`, 
                        jet_id as \`Jet ID\`, 
                        price as Price, 
                        date_format(flight_date, '%a %b %d %Y') as \`Flight Date\` 
                        from Tickets 
                        left join Customers on Tickets.customer_id = Customers.customer_id;`;
    db.pool.query(updateQuery, [custID, routeID, jet_id, price, flight_date, ticketID], function(error, rows, fields){
        // Error handling
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectQuery, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
})


// LISTENER
app.listen(PORT, function(){
    console.log('The Aviators have commenced flight on localhost:' + PORT);
});
