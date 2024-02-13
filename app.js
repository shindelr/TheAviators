// Main entry point to our web application

// SETUP
// Server setup 
var express = require('express');
var app = express()
PORT = 5000
// Template (handlebars) setup
const {engine} = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');


// ROUTES
app.get('/', function(req, res)
    {
        res.render('index');  // Renders the index.hbs template
    
});


// LISTENER
app.listen(PORT, function(){
    console.log('The Aviators have commenced flight on localhost:' + PORT);
});

