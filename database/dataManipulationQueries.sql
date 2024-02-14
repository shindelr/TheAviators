-- Authors: Alma Valenzuela & Robin Shindelman
-- Group 31 "The Aviators"
-- Date: 2024-02-14
-- The data manipulation queries the interface will use to control CRUD on
--  the connected MySQL database

---------- CREATE ---------------
-- There should be 6 queries here
---------------------------------
-- Create a new entry for a Jet
insert into Jets (jet_id, model_id, total_hours, date_acquired)
values (:jet_id_input, :model_id_input, :total_hours_input, :date_acquired_input)

-- Create new entry for a Model
insert into Models (model_id, make, pass_capacity)
values (:model_id_input, :make_input, :pass_capacity_input)

-- Create new entry for a Ticket
insert into Tickets (customer_id, route_id, jet_id, price, flight_date)
values (:customer_id_input, :route_id_input, :jet_id_input, :price_input, :flight_date_input)


----------- READ ----------------
-- There should be 6 queries here
---------------------------------
-- Display Jets where model_id has been replaced by all the info from Models
    select 
        jet_id, 
        Models.make, 
        Jets.model_id, 
        Models.pass_capacity, 
        date_format(Jets.date_acquired, '%a %b %d %Y') as date_acquired, 
        Jets.total_hours 
    from Jets 
        left join Models 
        on Jets.model_id = Models.model_id;

-- Display Models
    select * from Models;

-- Display Tickets where customer_id is replaced by the names of the customer
    select 
        ticket_id as Ticket_Number, 
        Customers.cust_fname, 
        Customers.cust_lname, 
        route_id, 
        jet_id, 
        price, 
        date_format(flight_date, '%a %b %d %Y') as flight_date 
    from Tickets 
        left join Customers 
        on Tickets.customer_id = Customers.customer_id;

-- Prepopulate Ticket Edit Form, the button will pass the appropriate ID number
-- to the JS function that populates form.
    select * from Tickets
        where ticket_id = :selected_ticket_id;
        

---------- UPDATE -------------
-- There should be 1 query here
-------------------------------
-- Update a ticket 
update Tickets
    set
    ticket_id = :ticket_id_input,
    customer_id = :customer_id_input,
    route_id = :route_id_input,
    jet_id = :jet_id_input,
    price = :price_input,
    flight_date = :flight_date_input
where ticket_id = :selected_ticket_id;


---------- DELETE -------------
-- There should be 1 query here
-------------------------------
