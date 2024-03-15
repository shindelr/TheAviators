// Perform AJAX operations to add a model to the table
// This code is heavily adapted from step 5 of the CS340 nodejs starter app.
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
// However, improvements were made by Robin to streamline the updateRow function.

let createModelForm = document.getElementById('createModelForm');

// Add event listener. Triggers on submit
createModelForm.addEventListener('submit', function (e){
    e.preventDefault();

    // Grab input from DOM
    let modelInput = document.getElementById('createModelIDInput');
    let makeInput = document.getElementById('makeInput');
    let passCapInput = document.getElementById('passCapInput');

    // Store input as data
    let modelVal = modelInput.value; 
    let makeVal = makeInput.value; 
    let passCapVal = passCapInput.value; 

    let newModelID = modelVal

    // Pack data as JS object, property names are same as SQL table attributes
    let modelData = {
        model_id: modelVal,
        make: makeVal,
        pass_capacity: passCapVal
    };

    // Perform AJAX now
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-model-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200){
            //Process new data and add row to table
            addRowToTable(xhttp.response, newModelID);
            // Reset input form
            modelInput.value = '';
            makeInput.value = '';
            passCapInput.value = '';
        }
        // Error?
        else if (xhttp.readyState == 4 && xhttp.status != 200){
            console.log("Input error, status NOT 200")
        }
    }
    // Data processed and table appended. Return the data.
    xhttp.send(JSON.stringify(modelData));
})

addRowToTable = (modelData, newModelID) => {
    let modelTable = document.getElementById('modelsTable');
    // Parse express data
    let parsedData = JSON.parse(modelData);
    
    let tableLength = modelTable.rows.length;
    let inputRow = NaN

    for (let i=0; i < tableLength; i++) {
        if (parsedData[i].model_id === newModelID) {
            inputRow = parsedData[i];
            break;
        }
    }

    console.log(inputRow)

    // Build the row
    let row = document.createElement('TR');

    for (key in inputRow) {
        if (inputRow.hasOwnProperty(key)) { // Ensure the property belongs to the object itself, not its prototype chain
            let cell = document.createElement('td');
            cell.innerText = inputRow[key];
            row.appendChild(cell);
        }
    }
    
    modelTable.appendChild(row);
    alert('Data Sucessfully Entered');
}
