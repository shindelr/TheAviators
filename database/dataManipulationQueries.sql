-- Authors: Alma Valenzuela & Robin Shindelman
-- Group 31 "The Aviators"
-- Date: 2024-02-14
-- The data manipulation queries the interface will use to control CRUD on
--  the connected MySQL database

---------- CREATE ---------------
-- Using : to denote variables
---------------------------------
-- Create a new entry for a Jet
insert into Jets (jet_id, model_id, total_hours, date_acquired)
values (:jet_id_input, :model_id_input, :total_hours_input, :date_acquired_input);

-- Create new entry for a Model
insert into Models (model_id, make, pass_capacity)
values (:model_id_input, :make_input, :pass_capacity_input);

-- Create new entry for a Ticket
insert into Tickets (customer_id, route_id, jet_id, price, flight_date)
values (:customer_id_input, :route_id_input, :jet_id_input, :price_input, :flight_date_input);

-- Create new entry for a Route
insert into Routes (route_id, origin_loc, destination_loc, distance, times_flown)
values (:route_id_input, :origin_loc_input, :destination_loc_input, :distance_input, :times_flown_input);

-- Create new entry for a Customer
insert into Customers (cust_fname, cust_lname, cust_email, cust_phone, airline_miles, member_since)
values (:cust_fname_input, :cust_lname_input, :cust_email_input, :cust_phone_input, NULL, {date today});
-- Not sure how to auto populate as today's date, but I'm sure we'll figure it out.

-- Create new entry for an Airport
insert into Airports (airport_id, city, state, country)
values (:airport_id_input, :city_input, :state_input, :country_input);


----------- READ ----------------
-- Using : to denote variables
---------------------------------
-- Display Jets where model_id has been replaced by all the info from Models
    select 
        jet_id, 
        Models.make, 
        Jets.model_id, 
        Models.pass_capacity, 
        date_format(Jets.date_acquired, '%a %b %d %Y') as date_acquired,  --date_format() cuts off the timestamp.
        Jets.total_hours 
    from Jets 
        left join Models on Jets.model_id = Models.model_id;

-- Display Models
    select * from Models;

-- Display model_id for dropdown in Jets
    select model_id from Models;

-- Display Tickets where customer_id is replaced by the names of the customer
    select 
        ticket_id as Ticket_Number, 
        Customers.cust_fname, 
        Customers.cust_lname, 
        route_id, 
        jet_id, 
        price, 
        date_format(flight_date, '%a %b %d %Y') as flight_date  --date_format() cuts off the timestamp.
    from Tickets 
        left join Customers on Tickets.customer_id = Customers.customer_id;

-- Prepopulate Ticket Edit Form, the button will pass the appropriate ID number
-- to the JS function that populates form.
    select * from Tickets
        where ticket_id = :selected_ticket_id;

-- Read Routes
    select
        route_id as Route_Number,
        origin_loc as Origin,
        destination_loc as Destination,
        distance as Distance,
        times_flown as Times_Flown
        from Routes
            left join Airports on Routes.origin_loc = Airports.airport_id;

-- Read Airports
    select 
        airport_id as Airport_ID,
        city as City,
        state as State,
        country as Country
    from Airports;

-- Read Customers
    select
        customer_id as ID,
        cust_fname as First_Name,
        cust_lname as Last_Name,
        cust_email as Email,
        cust_phone as Phone_Number,
        airline_miles as Airline_Miles,
        date_format(member_since,'%a %b %d %Y') as Member_Since
    from Customers;


---------- UPDATE -------------
-- Using : to denote variables
-------------------------------
-- Update a ticket, used a select statement so that the user doesn't need to enter
-- the customer ID, that way we can avoid update anomalies. I created dropdowns for
-- the names so that it's less error prone.
update Tickets
    set
    ticket_id = :ticket_id_input,
    (select customer_id from Customers where cust_fname = :cust_fname_input and cust_lname = :cust_lname_input),
    route_id = :route_id_input,
    jet_id = :jet_id_input,
    price = :price_input,
    flight_date = :flight_date_input
where ticket_id = :selected_ticket_id;

---------- DELETE -------------
-- Using : to denote variables
-------------------------------
-- Delete a Route
delete from Routes
where route_id = :route_id_input;
