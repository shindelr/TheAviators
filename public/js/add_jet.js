// Perform the AJAX operations to add a jet to the table
// This code is heavily adapted from step 5 of the CS340 nodejs starter app.
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


let addJetForm = document.getElementById('createJetForm');

// Add the event listener to trigger on submit
addJetForm.addEventListener('submit', function(e){
    // Premature submission prevention?
    e.preventDefault();
    
    // Grab Input
    let jetIDInput = document.getElementById('jetIDInput');
    let modelIDInput = document.getElementById('modelIDInput');
    let dateInput = document.getElementById('dateInput');
    let hoursInput = document.getElementById('hoursInput');

    // Store Data in variables
    let jetIDVal = jetIDInput.value;
    let modelIDVal = modelIDInput.value;
    let dateVal = dateInput.value;
    let hourVal = hoursInput.value; 
     
    let newJetID = jetIDVal;

    // Pack the data into an object
    let jetData = {
        jet_id: jetIDVal,
        model_id: modelIDVal,
        date_acquired: dateVal,
        total_hours: hourVal
    }

    // AJAX
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-jet-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200){
            // Process the new data
            addRowToTable(xhttp.response, newJetID);
            // Clear input fields for the next go
            jetIDVal = '';
            modelIDVal = '';
            dateVal = '';
            hourVal = '';
        }
        // Error handling
        else if (xhttp.readyState == 4 && xhttp.status != 200){
            console.log("Input erorr, status NOT 200")
        }
    }
    // Send request
    xhttp.send(JSON.stringify(jetData));
})

// Create a single row of data corresponding to the input data
addRowToTable = (jetData, newJetID) => {
    let jetsTable = document.getElementById('jetsTable');
    let tableLength = jetsTable.rows.length;
    // Parse incoming Express data
    let parsedData = JSON.parse(jetData);
    let inputRow = NaN

    // let inputRow = parsedData[parsedData.length - 1]

    for (let i=0; i < tableLength; i++) {
        if (parsedData[i].jet_id === newJetID) {
            inputRow = parsedData[i];
            break;
        }
    }

    console.log(inputRow)

    // Build new row
    let row = document.createElement('TR');
    let jetIDCell = document.createElement('TD');
    let makeCell = document.createElement('TD');
    let modelIDCell = document.createElement('TD');
    let passCapCell = document.createElement('TD');
    let hoursCell= document.createElement('TD');
    let dateCell = document.createElement('TD');

    // Populate cells
    jetIDCell.innerText = inputRow.jet_id;
    makeCell.innerText = '';
    modelIDCell.innerText = inputRow.model_id;
    passCapCell.innerText = '';
    hoursCell.innerText = inputRow.total_hours;
    dateCell.innerText = inputRow.date_acquired;

    // Add cells to row in the DOM
    row.appendChild(jetIDCell);
    row.appendChild(makeCell);
    row.appendChild(modelIDCell);
    row.appendChild(passCapCell);
    row.appendChild(hoursCell);
    row.appendChild(dateCell);
    
    // Finally, add the row to the table
    jetsTable.appendChild(newRow);

    // Added the reload to get the data to fill in properly
    alert('Data Sucessfully Entered');
    location.reload();
}
