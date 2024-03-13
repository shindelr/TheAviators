// Perform AJAX UPDATE operations on existing Tickets
// This code is heavily adapted from step 8 of the CS340 nodejs starter app.
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
// However, improvements were made by Robin to streamline the updateRow function.

let ticketEditForm = document.getElementById('ticketEditForm');

// Add an event listener for the submit button
ticketEditForm.addEventListener('submit', function(e){
    e.preventDefault()

    // DOM Input 
    let ticketIDInput = document.getElementById('ticketLabel')
    let custIDInput = document.getElementById("editCustIDInput");
    let routeIDInput = document.getElementById("editRouteIDInput");
    let jetIDInput = document.getElementById("editJetIDInput");
    let priceInput = document.getElementById("editPriceInput");
    let flightDateInput = document.getElementById("editFlightDateInput");
    
    // Create data variables
    let ticketVal = ticketIDInput.textContent;
    let custVal = custIDInput.value;
    let routeVal = routeIDInput.value;
    let jetVal = jetIDInput.value;
    let priceVal = priceInput.value;
    let flightDateVal = flightDateInput.value;

    // Pack as an object, prop names are same as SQL table attributes
    let ticketData = {
        ticket_id: ticketVal,
        customer_id: custVal,
        route_id: routeVal,
        jet_id: jetVal,
        price: priceVal,
        flight_date: flightDateVal
    };

    // Check for NULLS
    for (let key in ticketData){
        if (!ticketData[key]){
            alert('Please fill in all fields.');
            return;
        }
    }

    // AJAX Section
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-ticket-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200){
            // Update
            updateRow(xhttp.response, ticketVal);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200){
            console.log("Input error, status NOT 200");
        }
    }
    // Data processed and table updated. Return the data.
    xhttp.send(JSON.stringify(ticketData));  
})

function updateRow(data, ticketID){
    let parsedData = JSON.parse(data);
    console.log(parsedData)
    let table = document.getElementById('ticketTable');
    
    // Iterate through table row by row
    for (let i=0, row; row=table.rows[i]; i++){
        if (table.rows[i].getAttribute("data-value") == ticketID){
            // Get row index
            let updateRowIndex = i;
            // let updateRowIndex = table.getElementsByTagName('tr')[i];
            for (let j=1; j < parsedData.length; j++){
                table.rows[updateRowIndex].cells[j].textContent = parsedData[j].value;
            }
        }
    }
    location.reload()
}