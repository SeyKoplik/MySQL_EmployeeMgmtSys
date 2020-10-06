USE employee_mgmtDB;


SELECT * FROM employee LEFT JOIN department ON employee.department_id = department.id;

