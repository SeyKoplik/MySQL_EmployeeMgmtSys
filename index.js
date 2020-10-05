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
        ("SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS 'Employee', d.dept_name AS 'Department', r.title, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS 'Manager' FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id ORDER BY e.id ASC;", function (err, res) {
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
    connection.query("SELECT dept_name FROM department", function (err, res) {
        if (err) throw err;

        const newRes = (JSON.parse(JSON.stringify(res)));

        // for (const newNewRes of newRes) 
        // {
            console.log(newRes);

            const choiceArray = [];
            choiceArray.push(newRes);
        // }

            inquirer.prompt([{
                type: "list",
                name: "role_dept",
                message: "What department is this new role in?",
                choices: choiceArray,
                validate: function () {
                    return 'Please select a choice or add department first if it is not on the list';
                }
            }, {
                type: "input",
                name: "role_title",
                message: "What is the title of the new role?"
            }, {
                type: "input",
                name: "role_salary",
                message: "What is salary for this new role?"
            }]).then(function (answer) {
                if (answer.role_dept === "New Department") {
                    createDept();

                } else {
                    console.log("Inserting a new role...\n");
                    for (let i = 0; i < choiceArray.length; i++) {
                        console.log(answer.role_dept[i]);
                        const newDeptId = (parseInt(answer.role_dept[i]))

                        connection.query(
                            "INSERT INTO role SET ?",
                            {
                                title: answer.role_title,
                                salary: answer.role_salary,
                                department_id: newDeptId

                            }, function (err, res) {
                                if (err) { throw err; }
                                console.log(res.affectedRows + " role added!\n");
                            }
                        );
                    }
                }
            });
    })
}; // === End of createRole function

function createEmployee() {
    inquirer.prompt([{
        type: "input",
        name: "first_name",
        message: "What is your new employees's first name?"
    }, {
        type: "input",
        name: "last_name",
        message: "What is your new employees's last name?"
    }, {
        type: "input",
        name: "dept_name",
        message: "Which department is the new employer going to be assigned to?",
    }, {
        type: "input",
        name: "title",
        message: "What is your new employees's role title?"
    }, {
        type: "input",
        name: "managerName",
        message: "Who is your new employee's manager?"
    }]).then(function (answer) {
        console.log("Inserting your new employee...\n");
        var query = connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name
            },
            //*********** NEED TO FIX */
            "INSERT INTO department SET ?",
            {
                dept_name: answer.dept_name
            },
            "INSERT INTO role SET ?",
            {
                title: answer.title,
                salary: answer.salary
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " new employee added!\n");
            }
        );
        // logs the actual query being run
        console.log(query.sql);
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
//         choices: function () {
//         let choiceArray = res.map(choice => choice.employee_FULLname)
//         return choiceArray; }
//     }, {
//         type: "input",
//         name: "role_update",
//         message: "What role would you like to update it to?"
//     }]).then(function (answer) {
            // let chosenEmp;
            // for (let i = 0; i < results.length; i++) {
            //     if (results[i].employee_name === answer.empChoice) {
            //         chosenEmp = results[i];
            //     }
            // }
//         var query = connection.query(
//             "UPDATE role SET ? WHERE ?",
//             [
//                 {
//                     title: answer.role_update,
//                 },
//                 {
//                     name: answer.employee_name
//                 }
//             ],
//             function (err, res) {
//                 if (err) throw err;
//                 console.log(res.affectedRows + " products updated!\n");
//                 // Call deleteProduct AFTER the UPDATE completes
//                 deleteProduct();
//             }
//         );

//         // logs the actual query being run
//         console.log(query.sql);
//         });
//        })
//     };



//============================== ALL OF HW RELATED STOP HERE


// function createProduct() {
//     console.log("Inserting a new product...\n");
//     var query = connection.query(
//         "INSERT INTO products SET ?",
//         {
//             flavor: "Rocky Road",
//             price: 3.0,
//             quantity: 50
//         },
//         function (err, res) {
//             if (err) throw err;
//             console.log(res.affectedRows + " product inserted!\n");
//             // Call updateProduct AFTER the INSERT completes
//             updateProduct();
//         }
//     );

//     // logs the actual query being run
//     console.log(query.sql);
// }

// function updateProduct() {
//     console.log("Updating all Rocky Road quantities...\n");
//     var query = connection.query(
//         "UPDATE products SET ? WHERE ?",
//         [
//             {
//                 quantity: 100
//             },
//             {
//                 flavor: "Rocky Road"
//             }
//         ],
//         function (err, res) {
//             if (err) throw err;
//             console.log(res.affectedRows + " products updated!\n");
//             // Call deleteProduct AFTER the UPDATE completes
//             deleteProduct();
//         }
//     );

//     // logs the actual query being run
//     console.log(query.sql);
// }

// function deleteProduct() {
//     console.log("Deleting all strawberry icecream...\n");
//     connection.query(
//         "DELETE FROM products WHERE ?",
//         {
//             flavor: "strawberry"
//         },
//         function (err, res) {
//             if (err) throw err;
//             console.log(res.affectedRows + " products deleted!\n");
//             // Call readProducts AFTER the DELETE completes
//             readProducts();
//         }
//     );
// }

// function readProducts() {
//     console.log("Selecting all products...\n");
//     connection.query("SELECT * FROM products", function (err, res) {
//         if (err) throw err;
//         // Log all results of the SELECT statement
//         console.log(res);
//         connection.end();
//     });
// }
//===================== ALL NEEDED FOR CRUD CONNECTION TO MYSQL



