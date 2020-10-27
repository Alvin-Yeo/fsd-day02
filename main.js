// Load libraries
const express = require('express');
const handlebars = require('express-handlebars');

// Configure the environment
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;


// Create an instance of express
const app = express();

// Configure handlebars
app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}));
app.set('view engine', 'hbs');

// Log requests
app.use((req, res, next) => {
    console.info(`${new Date()}: ${req.method} ${req.originalUrl}`);
    next();
});

let timeCounter = 0;

app.use('/time', (_, __, next) => {     // prefix match
    timeCounter++;
    next();
});

// GET /cart
const cart = [
    { name: 'apple', quantity: 10 },
    { name: 'orange', quantity: 2 },
];

app.get('/cart', (req, res) => {
    count = 3;
    res.status(200);                
    res.type('text/html'); 
    /* res.render('cart', {
        empty: count <= 0,
        notEmpty: count > 0,
        count: count
    }); */
    res.render('cart', {
        empty: cart.length <= 0,
        count: cart.length,
        myCart: cart
    });
});

// GET /time/used
app.get('/time/used', (req, res) => {   // literal match
    res.status(200);                
    res.type('text/html');          
    res.send(`<h1>/time has been used ${timeCounter} times</h1>`); // Set the payload
});

// GET /time/hbs
app.get('/time/hbs', (req, res) => {
    res.status(200);                
    res.type('text/html');          
    // res.render('time', { currentTime: new Date() });     // give the name of the view, without .hbs extension
    res.render('timeCounter', { times: timeCounter });
});

// GET /time
app.get('/time', (req, res) => {
    console.info(`The request is ${req.originalUrl}`);
    
    res.status(200);                // Set the status
    res.set('X-My-Header', 'Fred')  // Set custom header
    res.type('text/html');          // Set the data type
    res.send(`<h1>The current time is ${new Date()}</h1>`); // Set the payload
});

// Configure the application
app.use(express.static(__dirname + '/public'));     // A middleware (function) is returned by express.static()

// 404 error page
app.use((req, res) => {
    // res.redirect('/404.html');
    res.status(404);
    res.type('text/html');
    res.sendFile(__dirname + '/public/404.html')
});


// Print the middleware returned by express.static()
// console.log('.......................................');
// console.log(express.static(__dirname + '/public').toString());

// Start the server
app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`);
});