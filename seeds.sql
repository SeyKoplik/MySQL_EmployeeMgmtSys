USE employee_mgmtDB;

INSERT INTO department (dept_name)
VALUES 
("Legal"), 
("Engineering"), 
("Finance"), 
("Sales");

SELECT id FROM department;

INSERT INTO role (title, salary, dept_id)
VALUES
("Lawyer", 200000, 1),
("Lead Engineer", 200000, 2),
("Programmer", 150000, 2),
("Senior Accountant", 200000, 3),
("Accountant", 150000, 3),
("Sales Lead", 100000, 4),
("Salesperson", 80000, 4);

SELECT * FROM role;

SELECT title FROM role ORDER BY dept_id ASC title ASC;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Anna", "Spanakopita", 1, null),
("James", "Vanderbilt", 2, null),
("Susan", "Kenst", 2, 1),
("Jessie", "Milligan", 2, 1),
("Katherine", "Patter", 2, 1),
("Maya", "Rodgers", 2, 1),
("Peter", "Tillens", 2, 1),
("Jacob", "Anders", 2, 1);

SELECT * FROM employee;

SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', d.name AS 'Department', r.title, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS 'Manager' FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.dept_id ORDER BY e.id ASC;