USE employee_mgmtDB;


SELECT * FROM employee LEFT JOIN department ON employee.department_id = department.id;

SELECT role.title, role.salary, role.department_id, department.dept_name, department.id FROM department INNER JOIN role ON role.department_id = department.id

SELECT employee.id AS 'empID', CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee', department.dept_name AS 'Department', role.title AS 'Title', role.salary AS 'Salary', CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager' FROM employee employee LEFT JOIN employee manager ON manager.id = employee.manager_id LEFT JOIN role role ON employee.role_id = role.id LEFT JOIN department department ON department.id = role.department_id ORDER BY employee.id ASC;

SELECT employee.id AS 'empID', CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee' FROM employee employee LEFT JOIN employee manager ON manager.id = employee.manager_id

SELECT employee.id AS 'empID', CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee', employee.role_id, role.id, role.title, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id