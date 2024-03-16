// This code is heavily adapted from step 5 of the CS340 nodejs starter app.
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


// Get the objects we need to modify
let addAirportForm = document.getElementById('add-airport');

// Modify the objects we need
addAirportForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCode = document.getElementById("input-code");
    let inputCity = document.getElementById("input-city");
    let inputState = document.getElementById("input-state");
    let inputCountry = document.getElementById("input-country");

    // Get the values from the form fields
    let codeValue = inputCode.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let countryValue = inputCountry.value;

    newAirportID = codeValue;

    // Put our data we want to send in a javascript object
    let data = {
        airport_id: codeValue,
        city: cityValue,
        state: stateValue,
        country: countryValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-airport", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response, newAirportID);

            // Clear the input fields for another transaction
            inputCode.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputCountry.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object representing a single record from 
// Airports
addRowToTable = (data, newAirportID) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("airports-table");

    // Get length of table
    let tableLength = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);

    // The following loop looks for the row index of the newly added row 
    // This is needed bc primary keys aren't always added in order
    for (let i = 0; i < tableLength; i++) {
        if (parsedData[i].Airport_Code == newAirportID) {
             newRow = parsedData[i]
             break;
        }
     }

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let codeCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let countryCell = document.createElement("TD");

    // Fill the cells with correct data
    codeCell.innerText = newRow.Airport_Code;
    cityCell.innerText = newRow.City;
    stateCell.innerText = newRow.State;
    countryCell.innerText = newRow.Country;

    // Add the cells to the row 
    row.appendChild(codeCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(countryCell);
    
    // Add the row to the table
    currentTable.appendChild(row);

}