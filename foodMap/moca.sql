Create table Store_Fix (ID int not null primary key, name varchar(255), discription varchar(255), latitude float, longitude float, address varchar(255))
Create table Store_Flex (ID int not null primary key, sum_of_like int, comment varchar(255))
Create table User (UID int not null primary key, PersonId int, City varchar(255), State varchar(255))


Truncate table Person
-- insert into Person (PersonId, LastName, FirstName) values ('1', 'Wang', 'Allen')
Truncate table Address
-- insert into Address (AddressId, PersonId, City, State) values ('1', '2', 'New York City', 'New York')