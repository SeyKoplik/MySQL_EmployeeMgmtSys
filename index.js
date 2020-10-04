var figlet = require('figlet');
 
figlet('\n\n\n\nEmployee\n\n\n\n\n\n\n\n\n     Tracker\n\n\n', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

console.log('Welcome! Select an action in the prompt...')