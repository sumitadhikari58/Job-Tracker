create database job_tracker;
use job_tracker;
create table users(
id int not null primary key auto_increment,
name varchar(30) not null,
email varchar(100) not null unique,
password varchar(255) ,
created_at timestamp default current_timestamp
);
create table jobs(
id int not null primary key auto_increment,
user_id int not null,
company_name varchar(30) not null,
role varchar(20) not null,
status ENUM('Applied', 'OA', 'Interview', 'Offer', 'Rejected'),
job_link varchar(40),
notes text,
date_applied date not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp,
foreign key (user_id) references users(id) 
);
ALTER TABLE users MODIFY COLUMN password varchar(255) not null;
SELECT * FROM jobs;