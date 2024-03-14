// Routes AJAX
// This code is heavily adapted from step 5 of the CS340 nodejs starter app.
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


// Get the objects we need to modify
let addRouteForm = document.getElementById('add-route');

// Modify the objects we need
addRouteForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();


    // Get form fields we need to get data from
    let inputRouteID = document.getElementById("input-id");
    let inputOrigin = document.getElementById("input-origin");
    let inputDestination = document.getElementById("input-destination");
    let inputDistance = document.getElementById("input-distance");

    //debugger;

    // Get the values from the form fields
    let routeIDValue = inputRouteID.value;
    let originValue = inputOrigin.value;
    let destinationValue = inputDestination.value;
    let distanceValue = inputDistance.value;

    newRouteID = parseInt(routeIDValue);

    // Put our data we want to send in a javascript object
    let data = {
        route_id: routeIDValue,
        origin_loc: originValue,
        destination_loc: destinationValue,
        distance: distanceValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-route", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response, newRouteID);

            // Clear the input fields for another transaction
            inputRouteID.value = '';
            inputOrigin.value = '';
            inputDestination.value = '';
            inputDistance.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    debugger;

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object

addRowToTable = (data, newRouteID) => {

    debugger;

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("routes-table");

    // Get the location where we should insert the new row (end of table)
    let tableLength = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    //let newRow = parsedData[parsedData.length - 1]

    debugger;

    //routeNum = parsedData[0].Route_Number

    for (let i = 0; i < tableLength; i++) {
        if (parsedData[i].Route_Number == newRouteID) {
             newRow = parsedData[i]
             break;
        }
     }

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let originCell = document.createElement("TD");
    let destinationCell = document.createElement("TD");
    let distanceCell = document.createElement("TD");
    let timesFlownCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.Route_Number;
    originCell.innerText = newRow.Origin;
    destinationCell.innerText = newRow.Destination;
    distanceCell.innerText = newRow.Distance;
    timesFlownCell.innerText = newRow.Times_Flown;
    
    
 
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(originCell);
    row.appendChild(destinationCell);
    row.appendChild(distanceCell);
    row.appendChild(timesFlownCell);
    
    //Add Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function(){deleteRoute(RouteID);};

    deleteCell.innerText = deleteButton; // not a text element I want to add...
 
    row.appendChild(deleteCell);
   

    
    // Add the row to the table
    currentTable.appendChild(row);
    //location.reload();
}