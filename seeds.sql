USE employee_mgmtDB;

INSERT INTO department (dept_name)
VALUES 
("Legal"), 
("Engineering"), 
("Finance"), 
("Sales");

INSERT INTO role (title, salary, department_id)
VALUES
("Legal Executive", 200000, 1),
("Lead Engineer", 200000, 2),
("Programmer", 150000, 2),
("Senior Accountant", 200000, 3),
("Accountant", 150000, 3),
("Sales Lead", 100000, 4),
("Salesperson", 80000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Anna", "Spanakopita", 1, null),
("James", "Vanderbilt", 2, null),
("Susan", "Kilpatrick", 3, 2),
("Jessica", "Milligan", 4, null),
("Katherine", "Patter", 5, 3),
("Maya", "Rodgers", 6, null),
("Peter", "Tillens", 7, 6),
("Jacob", "Anders", 7, 6);
