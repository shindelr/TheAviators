// Perform AJAX operations to add a model to the table

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
            addRowToTable(xhttp.response);
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

addRowToTable = (modelData) => {
    let modelTable = document.getElementById('modelsTable');
    // Parse express data
    let parsedData = JSON.parse(modelData);
    let inputRow = parsedData[parsedData.length - 1];
    // Build the row
    let row = document.createElement('TR');
    for (let i = 0; i<inputRow.length; i++ ){
        let cell = document.createElement('TD');
        cell.innerText = inputRow[i];
        row.appendChild(cell);
    }
    modelTable.appendChild(row);
    alert('Data Sucessfully Entered');
    location.reload();
}