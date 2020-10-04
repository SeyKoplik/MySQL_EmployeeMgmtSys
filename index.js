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
        console.log('Please select action from the following prompt...')
    });
} //=== end of showFunDisplay, need to call this function before everything else
showFunDisplay(); //<< to show fun display

// ** ESTABLISH CONNECTION TO MySQL DB **
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Loveboat10",
    database: "employee_mgmtDB" //=== change to right DB
});
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    whatWouldYouLikeToDo();
});

const whatWouldYouLikeToDo = function () {
    inquirer.prompt({
        type: "list",
        name: "firstPrompt",
        message: "What would you like to do?",
        choices: [
            "Add department, roles, or employees",
            "View departments, roles, or employees",
            "Update Employee Role"]
    }).then(function (answer) {
        //what to do next
        if (answer.firstPrompt === "Add department, roles, or employees") {
            // console.log(`Add something!`);
            whatToAdd();
        } else if (answer.firstPrompt === "View departments, roles, or employees") {
            // console.log('View something!');
            whatToView();
        } else {
            console.log('Update Employee Role!');
            //updateEmployeeRole();
        }
    })
} // === end of whatWouldYouLikeToDo function

const whatToAdd = function () {
    inquirer.prompt({
        type: "list",
        name: "addingPrompt",
        message: "What would you like to add?",
        choices: [
            "Department",
            "Role",
            "Employee"]
    }).then(function (answer) {
        if (answer.addingPrompt === "Department") {
            // console.log(`Add department!`);
            createDept();

        } else if (answer.addingPrompt === "Role") {
            // console.log('Add a Role!');
            createRole();

        } else if (answer.addingPrompt === "Employee") {
            // console.log('Add Employee!');
            createEmployee();

        } else {
            return;
        }
    })
} //=== end of whatWouldYouLikeToAdd function


const whatToView = function () {
    inquirer.prompt({
        type: "list",
        name: "viewPrompt",
        message: "What would you like to view?",
        choices: [
            "Departments",
            "Roles",
            "Employees"]
    }).then(function (answer) {
        if (answer.viewPrompt === "Departments") {
            console.log(`View departments!`);
            read_viewDepts();

        } else if (answer.viewPrompt === "Roles") {
            console.log('View Roles!');
            read_viewRoles();

        } else if (answer.viewPrompt === "Employees") {
            console.log('View Employees!');
            read_viewEmployees();
        } else {
            return;
        }
    })
} //=== end of whatWouldYouLikeToView function


function createDept() {
    inquirer.prompt([{
        type: "input",
        name: "departmentName",
        message: "What department name would you like to add?"
    }]).then(function (answer) {
        console.log("Inserting a new department...\n");
        var query = connection.query(
            "INSERT INTO department SET ?",
            {
                dept_name: answer.departmentName,
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " department added!\n");
            }
        );
        // logs the actual query being run
        console.log(query.sql);
    });
} // === end of createDept

function createRole() {
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
        var query = connection.query(
            "INSERT INTO role SET ?",
            {
                title: answer.role_title,
                salary: answer.role_salary
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " role added!\n");
            }
        );
        // logs the actual query being run
        console.log(query.sql);
    });
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
        message: "What is your new employees's department?",
    }, {
        type: "input",
        name: "title",
        message: "What is your new employees's title?"
    }, {
        type: "input",
        name: "salary",
        message: "What is your new employees's salary?"
    }]).then(function (answer) {
        console.log("Inserting your new employee...\n");
        var query = connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name
            },
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


function read_viewDepts() {
    console.log("Selecting all Departments...\n");
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        // connection.end();
    });
}

function read_viewRoles() {
    console.log("Selecting all Roles...\n");
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        console.table(res);
        // connection.end();
    });
}

function read_viewEmployees() {
    console.log("Selecting all Employees...\n");
    connection.query("SELECT * FROM employees", function (err, res) {
        if (err) throw err;
        console.table(res);
        // connection.end();
    });
}


// function updateEmployeeRole() {
//     inquirer.prompt([{
//         type: "list",
//         name: "employee_name",
//         message: "Which employee would you like to update?",
//         choices: ["a","b","c"]
//     }, {
//         type: "input",
//         name: "role_update",
//         message: "What role would you like to update it to?"
//     }]).then(function (answer) {
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



