// Perform AJAX to add a ticket
// Perform AJAX UPDATE operations on existing Tickets
// This code is heavily adapted from step 5 of the CS340 nodejs starter app.
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
// However, improvements were made by Robin to streamline the updateRow function.

let createTicketForm = document.getElementById('createTicketForm');

// Add submit event listener to the create ticket form
createTicketForm.addEventListener('submit', function (e){
    e.preventDefault();

    // DOM Input 
    let custIDInput = document.getElementById("custIDInput");
    let routeIDInput = document.getElementById("routeIDInput");
    let jetIDInput = document.getElementById("jetIDInput");
    let priceInput = document.getElementById("priceInput");
    let flightDateInput = document.getElementById("flightDateInput");

    // Create data variables
    let custVal = custIDInput.value;
    let routeVal = routeIDInput.value;
    let jetVal = jetIDInput.value;
    let priceVal = priceInput.value;
    let flightDateVal = flightDateInput.value;

    // Pack as an object, prop names are same as SQL table attributes
    let ticketData = {
        customer_id: custVal,
        route_id: routeVal,
        jet_id: jetVal,
        price: priceVal,
        flight_date: flightDateVal
    };

    // AJAX Section
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-ticket-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200){
            // Process new data, add row to table
            addRowToTable(xhttp.response);
            // Reset input form
            custIDInput.value = '';
            routeIDInput.value = '';
            jetIDInput.value = '';
            priceInput.value = '';
            flightDateInput.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("Input error, status NOT 200");
        }
    }
    // Data processed and table appended. Return the data.
    xhttp.send(JSON.stringify(ticketData));
})

addRowToTable = (ticketData) => {
    let ticketTable = document.getElementById('ticketTable');
    // Parse express data
    let parsedData = JSON.parse(ticketData);
    let inputRow = parsedData[parsedData.length -1];
    // Build new row
    let row = document.createElement('TR');
    for (let i = 0; i<inputRow.length; i++) {
        let cell = document.createElement('TD');
        cell.innerText = inputRow[i];
        row.appendChild(cell);
    }
    ticketTable.appendChild(row);
    alert('Data Sucessfully Entered');
    location.reload();
}
