// Delete Tickets AJAX
// The functions below are adapted from step 7 of the CS340 nodejs starter app.
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

function deleteTicket(ticketID) {
    let link = '/delete-ticket/';
    let data = {
      id: ticketID
    };
    
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(ticketID);
      }
    });
  }
  
  function deleteRow(ticketID){
  
      let table = document.getElementById("ticketTable");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == ticketID) {
              table.deleteRow(i);
              break;
         }
      }
  }
  