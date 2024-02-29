//The following code is based on the CS340 nodejs-starter-app

function deleteRoute(routeID) {
  let link = '/delete-route/';
  let data = {
    id: routeID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deleteRow(routeID);
    }
  });
}

function deleteRow(routeID){

    let table = document.getElementById("routes-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == routeID) {
            table.deleteRow(i);
            break;
       }
    }
}
