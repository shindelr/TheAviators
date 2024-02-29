-- Authors: Alma Valenzuela, Robin Shindelman
-- Date Created: 2024-02-07
-- Last Modified: 2024-02-28 by Alma

-- Contained in this file are The Aviators' (Formerly Known As Team 31!) data
-- definition queries. The file is neatly structured into two sections concerned
-- with table creation and sample data insertions. 


-- ------------------------- Creation of the schema ----------------------------
-- Drop tables if they already exist in the database to avoid errors
set foreign_key_checks = 0;
SET AUTOCOMMIT = 0;
drop table if exists Customers, Tickets, Jets, Models, Airports, Routes;


-- Create the Customers table
create or replace table Customers (
customer_id int auto_increment not null primary key,
cust_fname      varchar(45) not null,
cust_lname      varchar(45) not null,
cust_email      varchar(145) not null,
cust_phone      varchar(45) not null,
airline_miles   int,
member_since    date,
unique key (customer_id)
);


-- Create the Models table
create or replace table Models (
model_id        varchar(145) not null primary key,
make            varchar(145) not null,
pass_capacity   int not null,
unique key (model_id)
);


-- Create Jets table
CREATE OR REPLACE TABLE Jets (
jet_id          varchar(45) not null unique,
model_id        varchar(145) not null,
date_acquired   date not null,
total_hours     int not null,
PRIMARY KEY (jet_id),
foreign key (model_id) references Models(model_id) on delete cascade
);


-- Create Airports table
CREATE OR REPLACE TABLE Airports (
airport_id      varchar(45) not null unique,
city            varchar(45) not null,
state           varchar(45),
country         varchar(45) not null,
PRIMARY KEY (airport_id)
);


-- Create Routes table
CREATE OR REPLACE TABLE Routes (
route_id         int not null unique,
origin_loc       varchar(45) not null,
destination_loc  varchar(45) not null,
distance         int not null,
times_flown      int,
PRIMARY KEY (route_id),
FOREIGN KEY (origin_loc) REFERENCES Airports(airport_id) on delete cascade,
FOREIGN KEY (destination_loc) REFERENCES Airports(airport_id) on delete cascade
);


-- Create the Tickets table
create or replace table Tickets (
ticket_id       int auto_increment not null primary key,
customer_id     int not null,
route_id        int not null default 0000,
jet_id          varchar(45) not null,
price           decimal(19,2) not null,
flight_date     date not null,
foreign key (customer_id) references Customers(customer_id)on delete cascade,
foreign key (route_id) references Routes(route_id)on delete set default,
foreign key (jet_id) references Jets(jet_id) on delete cascade,
unique key (ticket_id)
);

-- ------------------------------------------------------------------------------
-- -------------------------- Sample Data Insertion -----------------------------

-- Airports
insert into Airports (airport_id, city, state, country)
values ('LAX', 'Los Angeles', 'California', 'USA'),
('JFK', 'New York City', 'New York', 'USA'),
('LHR', 'London', null, 'UK'),
('CDG', 'Paris', null, 'France');


-- Routes
insert into Routes (route_id, origin_loc, destination_loc, distance, times_flown)
values (1594, (select airport_id from Airports where airport_id = 'LAX'), (select airport_id from Airports where airport_id = 'JFK'), 2469, 1635),
(1595, (select airport_id from Airports where airport_id = 'JFK'), (select airport_id from Airports where airport_id = 'LAX'), 2469, 1547),
(2297, (select airport_id from Airports where airport_id = 'JFK'), (select airport_id from Airports where airport_id = 'LHR'), 3442, 950),
(2114, (select airport_id from Airports where airport_id = 'JFK'), (select airport_id from Airports where airport_id = 'CDG'), 3623, 1163);


-- Models
insert into Models (model_id, make, pass_capacity)
values ('Global 6000', 'Bombadier', 17),
('Global 7500', 'Bombadier', 19),
('G280', 'Gulfstream', 10),
('Challenger 350', 'Bombadier', 10);


-- Jets
insert into Jets (jet_id, model_id, total_hours, date_acquired)
values ('JJX', (select model_id from Models where model_id = 'Global 6000'), 4100, 20180116),
('ZDH', (select model_id from Models where model_id = 'Global 7500'), 2505, 20200617),
('RHQ', (select model_id from Models where model_id = 'G280'), 7231, 20180425),
('TML', (select model_id from Models where model_id = 'Global 7500'), 5735, 20181003),
('NQA', (select model_id from Models where model_id = 'Challenger 350'), 6422, 20190221);


-- Customers
insert into Customers (cust_fname, cust_lname, cust_email, cust_phone, airline_miles, member_since)
values
    ('Cheryl', 'Polman', 'polman.chery@aol.com', '(123)265-6789', 34000, 20070402),
    ('Norbert', 'Terrorboi', 'terrorboi.norbert@gmail.com', '(456)876-1234', 565, 20190711),
    ('Griselda', 'Poppins', 'poppins.griselda@hotmail.com', '(789)796-2345', 43234, 20000101),
    ('Mateo', 'Fernandez', 'fernandez.matero@msn.com', '(321)382-8765', NULL, NULL),
    ('Heinrich', 'Schwartz', 'schwartz.heinrich@yahoo.com', '(987)392-4321', 87654, 20230916),
    ('Lily', 'Gruber', 'gruber.lily@icloud.com', '(654)123-7890', 90000, 20231125);


-- Tickets
insert into Tickets (customer_id, route_id, jet_id, price, flight_date)
values
    (
    (select customer_id from Customers where customer_id = 2),
    (select route_id from Routes where route_id = 2297),
    (select jet_id from Jets where jet_id = 'ZDH'),
    80500,
    20200823
        ),
    (
    (select customer_id from Customers where customer_id = 2),
    (select route_id from Routes where route_id = 2114),
    (select jet_id from Jets where jet_id = 'TML'),
    30350,
    20220315
        ),
    (
    (select customer_id from Customers where customer_id = 6),
    (select route_id from Routes where route_id = 2114),
    (select jet_id from Jets where jet_id = 'TML'),
    43500,
    20231127
        ),
    (
    (select customer_id from Customers where customer_id = 1),
    (select route_id from Routes where route_id = 1594),
    (select jet_id from Jets where jet_id = 'RHQ'),
    15800,	
    20181225
        );


-- make sure the following is all the way at the end of the code
SET FOREIGN_KEY_CHECKS=1;
COMMIT;
