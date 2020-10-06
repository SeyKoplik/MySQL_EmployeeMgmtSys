const cTable = require('console.table');
const figlet = require('figlet');
const mysql = require("mysql");
const inquirer = require("inquirer");

//======= function for displaying the employee tracker
function showFunDisplay() {
    figlet('\n\n\n\nEmployee\n\n\n\n\n\n\n\n\n     Tracker\n\n\n', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
    });
} //=== end of showFunDisplay, need to call this function before everything else
showFunDisplay(); //<< to show fun display

// ** ESTABLISH CONNECTION TO MySQL employee_mgmtDB **
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Loveboat10",
    database: "employee_mgmtDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database as ID:" + connection.threadId + "\n");
    whatToDoFirst();
});

const whatToDoFirst = function () {
    inquirer.prompt({
        type: "list",
        name: "firstPrompt",
        message: "What would you like to do?",
        choices: [
            "View departments, roles, employees, or everything",
            "Add department, roles, or employees",
            "Update Employee Role"]
    }).then(function (answer) {
        //what to do next
        switch (answer.firstPrompt) {
            case "View departments, roles, employees, or everything":
                // console.log('View something!');
                whatToView();
                break;

            case "Add department, roles, or employees":
                // console.log(`Add something!`);
                whatToAdd();
                break;

            case "Update Employee Role":
                console.log('Update Employee Role!');
            // updateEmployeeRole();
        };
    })
} // === end of whatToDoFirst function

const whatToView = function () {
    inquirer.prompt({
        type: "list",
        name: "viewPrompt",
        message: "What would you like to view?",
        choices: [
            "Departments",
            "Roles",
            "Employees",
            "Everything!"]
    }).then(function (answer) {
        switch (answer.viewPrompt) {
            case "Departments":
                // console.log(`View departments!`);
                viewDepts();
                break;

            case "Roles":
                // console.log('View Roles!');
                viewRoles();
                break;

            case "Employees":
                // console.log('View Employees!');
                viewEmployees();
                break;

            case "Everything!":
                // console.log("View Everything!");
                viewAll();
                break;
        }
    })
} //=== end of whatWouldYouLikeToView function


function viewDepts() {
    console.log("Selecting all Departments...\n");
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        // connection.end();
        whatToDoFirst();
    });
}

function viewRoles() {
    console.log("Selecting all Roles...\n");
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        // connection.end();
        whatToDoFirst();
    });
}

function viewEmployees() {
    console.log("Selecting all Employees...\n");
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        // connection.end();
        whatToDoFirst();
    });
}

function viewAll() {
    console.log("Selecting all info...\n");
    connection.query
        ("SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee', department.dept_name AS 'Department', role.title AS 'Title', role.salary AS 'Salary', CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager' FROM employee employee LEFT JOIN employee manager ON manager.id = employee.manager_id LEFT JOIN role role ON employee.role_id = role.id LEFT JOIN department department ON department.id = role.department_id ORDER BY employee.id ASC;", function (err, res) {
            if (err) throw err;
            console.table(res);
            whatToDoFirst();
        });
}


const whatToAdd = function () {
    inquirer.prompt([{
        type: "list",
        name: "addingPrompt",
        message: "What would you like to add?",
        choices: [
            "Department",
            "Role",
            "Employee"
        ]
    }]).then(function (answer) {
        switch (answer.addingPrompt) {
            case "Department":
                // console.log(`Add department!`);
                createDept();
                break;

            case "Role":
                // console.log('Add a Role!');
                createRole();
                break;

            case "Employee":
                // console.log('Add Employee!');
                createEmployee();
                break;

        }
    })
} //=== end of whatWouldYouLikeToAdd function

function createDept() {
    inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "What department would you like to add?"
    }).then(function (answer) {
        console.log("Inserting a new department...\n");
        connection.query(
            "INSERT INTO department SET ?",
            {
                dept_name: answer.departmentName,
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " department added!\n");
                whatToDoFirst();
            }
        );
    });
} // === end of createDept function

function createRole() {
    connection.query("SELECT role.title, role.salary, role.department_id, department.dept_name, department.id FROM department INNER JOIN role ON role.department_id = department.id", function (err, res) {
        if (err) throw err;
        const resArray = res.map(({ dept_name }) => dept_name);
        resArray.push('New Department')
        // console.log(resArray)
        inquirer.prompt([{
            type: "list",
            name: "role_dept",
            message: "What department is this new role in?",
            choices: resArray
        }]).then(function (answer) {
            if (answer.role_dept === "New Department") {
                console.log(`!! ** PLEASE ENTER NEW DEPARTMENT FIRST ** !!`);
                createDept();
            } else {
                const deptName = res.map(({ dept_name }) => dept_name);
                const newId = deptName.indexOf(answer.role_dept);
                // console.log(newId);
                inquirer.prompt([{
                    type: "input",
                    name: "role_title",
                    message: "What is the title of the new role?"
                }, {
                    type: "input",
                    name: "role_salary",
                    message: "What is salary for this new role?"
                }]).then(function (answer) {
                    console.log("Inserting a new role...\n");
                    connection.query(
                        "INSERT INTO role SET ?",
                        {
                            title: answer.role_title,
                            salary: answer.role_salary,
                            department_id: newId
                        }, function (err, res) {
                            if (err) throw err;

                            console.log(`New Role Added!`);

                            whatToDoFirst();
                        }
                    )
                })
            }
        })
    })
}//=== end function


function createEmployee() {
    connection.query("SELECT employee.id AS 'empID', CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee', department.dept_name AS 'Department', role.title AS 'Title', role.salary AS 'Salary', CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager' FROM employee employee LEFT JOIN employee manager ON manager.id = employee.manager_id LEFT JOIN role role ON employee.role_id = role.id LEFT JOIN department department ON department.id = role.department_id ORDER BY employee.id ASC;", function (err, res) {
        if (err) throw err;
        // console.log(res); //<< returns everything as promised
        const deptArray = res.map(({ Department }) => Department);
        // console.log(deptArray);
        const deptChoice = [];
        deptArray.forEach((dept) => {
            if (!deptChoice.includes(dept)) {
                deptChoice.push(dept)
            }
        });
        // console.log(deptChoice);
        const roleArray = res.map(({ Title }) => Title);
        // console.log(roleArray);
        const roleChoice = [];
        roleArray.forEach((role) => {
            if (!roleChoice.includes(role)) {
                roleChoice.push(role)
            }
        });
        const fullNameArray = res.map(({ Employee }) => Employee)
        // console.log(fullNameArray);

        inquirer.prompt([{
            type: "input",
            name: "first_name",
            message: "What is your new employees's first name?"
        }, {
            type: "input",
            name: "last_name",
            message: "What is your new employees's last name?"
        }, {
            type: "list",
            name: "dept_name",
            message: "Which department is the new employee going to be assigned to?",
            choices: deptChoice
        }, {
            type: "list",
            name: "title",
            message: "What is your new employees's role?",
            choices: roleChoice
        }, {
            type: "list",
            name: "managerName",
            message: "Who is your new employee's manager?",
            choices: fullNameArray
        }]).then(function (answer) {
            console.log("Inserting your new employee...\n");

            connection.query("SELECT * FROM role", function (err, roleData) {
                const roleID = roleData.map(({ id }) => id);
                const roleTitle = roleData.map(({ title }) => title);
                for (var i = 0; i < roleTitle.length; i++)
                    if (answer.title === roleTitle[i]) {
                        const newRoleID = roleID[i];
                        // console.log(newRoleID);
                        
                        connection.query("SELECT employee.id AS 'empID', CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee' FROM employee employee LEFT JOIN employee manager ON manager.id = employee.manager_id", function (err, empData) {
                            const empID = empData.map(({empID }) => empID);
                            const mgrFullName = empData.map(({ Employee }) => Employee);
                            for (var i = 0; i < roleTitle.length; i++)
                                if (answer.managerName === mgrFullName[i]) {
                                    const newMgrID = empID[i];
                                    // console.log(newMgrID);

                                    connection.query(
                                        "INSERT INTO employee SET ?",
                                        {
                                            first_name: answer.first_name,
                                            last_name: answer.last_name,
                                            role_id: newRoleID,
                                            manager_id: newMgrID,
                                        }, function (err, res) {
                                            if (err) throw err;

                                            console.log(`${answer.first_name} ${answer.last_name} has been added to the employee list!`);

                                            whatToDoFirst();
                                        }
                                    )
                                }//=== end for-loop
                        })
                    }
                    }) 
                });
        });
    } // ==== End of createEmployee function


// function updateEmployeeRole() {
        // const employeeQuery = 'SELECT * FROM employee';
        // connection.query(employeeQuery, (err, res) => {
        // if(err) throw err;
//     inquirer.prompt([{
//         type: "list",
//         name: "empChoice",
//         message: "Which employee would you like to update?",
//         choices: 
//     }, {
//         type: "list",
//         name: "role_update",
//         message: "What role would you like to update it to?"
//         choices:
//     }]).then(function (answer) {

