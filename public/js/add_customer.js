// This code is heavily adapted from step 5 of the CS340 nodejs starter app.
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-fname");
    let inputLastName = document.getElementById("input-lname");
    let inputEmail = document.getElementById("input-email");
    let inputNumber = document.getElementById("input-number");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let emailValue = inputEmail.value;
    let numberValue = inputNumber.value;

    // Put our data we want to send in a javascript object
    let data = {
        cust_fname: firstNameValue,
        cust_lname: lastNameValue,
        cust_email: emailValue,
        cust_phone: numberValue,
    }
    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputEmail.value = '';
            inputNumber.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from 
// Customers
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("customers-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 7 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let numberCell = document.createElement("TD");
    let airlineMilesCell = document.createElement("TD");
    let memberSinceCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.Customer_ID;
    firstNameCell.innerText = newRow.First_Name;
    lastNameCell.innerText = newRow.Last_Name;
    emailCell.innerText = newRow.Email;
    numberCell.innerText = newRow.Phone_Number;
    airlineMilesCell.innerText = newRow.Airline_Miles; 
    memberSinceCell.innerText = newRow.Member_Since;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(emailCell);
    row.appendChild(numberCell);
    row.appendChild(airlineMilesCell);
    row.appendChild(memberSinceCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}