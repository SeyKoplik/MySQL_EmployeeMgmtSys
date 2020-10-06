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
    connection.query("SELECT * FROM department INNER JOIN role ON department.id = role.department_id INNER JOIN employee ON role.id = employee.role_id", function (err, res) {
        if (err) throw err;
        // console.log(res); //<< returns everything as promised
        const deptArray = res.map(({ dept_name }) => dept_name);
        // console.log(deptArray);
        const deptChoice = [];
        deptArray.forEach((dept) => {
            if (!deptChoice.includes(dept)){
                deptChoice.push(dept)
            }
        });
        // console.log(deptChoice);
        const roleArray = res.map(({ title }) => title);
        // console.log(roleArray);
        const roleChoice = [];
        roleArray.forEach((role) => {
            if (!roleChoice.includes(role)){
                roleChoice.push(role)
            }
        });
        // console.log(roleChoice);
    });

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
        message: "Which department is the new employer going to be assigned to?",
        choices: deptChoice
    }, {
        type: "list",
        name: "title",
        message: "What is your new employees's role title?",
        choices: roleChoice
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





 // connection.query("SELECT * FROM department", function (err, res) {
 //     if (err) throw err;
 //     // console.log(res);
 //     const deptName = res.map(({ dept_name }) => dept_name);
 //     // console.log(deptName);
 //     const deptId = res.map(({ id }) => id);
 //     // console.log(deptId);

 //     for (var i = 0; i < deptName.length; i++) {
 //         if (deptName[i] === answer.role_dept) {
 //             const dept_id = deptId[i];

 //             connection.query("INSERT INTO role SET ?",
 //  {
 //      department_id: dept_id
 //                 }, function (err, res) {
 //      if (err) throw err;
 //  }) // end closest query
 //         }
 //     }; //== ending for loop
 // }); // === end second closest query
















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



