//Import the express module
import express from 'express';

//Import the mySQL module
import mysql2 from 'mysql2';

//Import .env
import dotenv from 'dotenv';
dotenv.config(); //Necessary to use dotenv.

//Import express session
import session from 'express-session';

//Login function. Takes a request, response and next
function requireLogin(req, res, next) {
    //If the user is logged in...
    if (req.session.loggedIn) {
        //Proceed
        next();
    //Else...
    } else {
        //Redirect back to the login page
        res.redirect('/login')
    }
}

//Create a connection pool
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

//Create an instance of an express application (Creates an express object)
const app = express();

//Define a port number for our server to listen on
const PORT = 3001;

//Create an array to store our orders
const orders = [];

//Enable static file serving
app.use(express.static('public'));

/* Add "middleware" to allow the app to parse (read) the form data
Access form data through req.body */
app.use(express.urlencoded({extended: true}));

//Create session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 66}
}))

//Set the view engine to ejs
app.set('view engine', 'ejs');

//Define a default route ("/")
app.get('/', (req, res) => {
    // res.send('Welcome to Radical Pies!');
    res.render('home'); //Send the page in response, render the ejs page named 'home'
    // res.sendFile(`${import.meta.dirname}/views/home.html`);
});

//Define a route to the login page.
/* 
We pass error: null because ther is no error yet.
login.ejs checks "if (error)", so the error must always be null
*/
app.get('/login', (req, res) => {
    res.render('login', {error: null});
})

app.post('/login', (req, res) => {
    //Get the values the user typed into the form
    const username = req.body.username;
    const password = req.body.password;
    
    //Compare the user submitted values to the the user and password stored in the .env file
    if (username === process.env.ADMIN_USER && 
        password === process.env.ADMIN_PASSWORD) {
            //Correct! Remember that this user is logged in
            req.session.loggedIn = true;

            //Send them to the admin page
            res.redirect('/admin')
        } else {
            //Wrong username or password. Show the form again
            res.render('login', {error: 'Invalid username or password'})
        }

});

//Create a route to test the database
/*
app.get('/db-test', async(req, res) => {
    try {
        const orders = await pool.query('SELECT * FROM orders')
        res.send(orders[0]);
    } catch(err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error occurred.')
    }
}); */

//Add a contact route to display a contact view page
app.get('/contact-us', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/contact.html`);
});

// //Add a confirm order route to display the confirm page
// app.get('/confirm-order', (req, res) => {
//     res.render('confirm');
//     // res.sendFile(`${import.meta.dirname}/views/confirm.html`);
// });

//Add a menu route te display the menu page
app.get('/menu', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/menu.html`);
});

//Add a route to process a pizza orddr
app.post('/submit-order', async(req, res) => {
    console.log(req.body);

    // const order = {
    //     fname: req.body.fname,
    //     lanme: req.body.lanme,
    //     email: req.body.email,
    //     method: req.body.method,
    //     toppings: req.body.toppings,
    //     size: req.body.size,
    //     comment: req.body.comment,
    //     timestamp: new Date()
    // }

    // Create a JSON object to store order data
    const order = req.body;

    order['timestamp'] = new Date(); //Get and store the timestamp.

    //Convert the toppings array into a comma delimited string.
    order.toppings = Array.isArray(order.toppings) ?
        order.toppings.join(", ") : "";

    //Define a SQL query to insert the new order
    const sql = `INSERT INTO orders (fname, lname, email, size, method, toppings, comment)
    VALUES(?, ?, ?, ?, ?, ?, ?)`;  //Values set to ? to prevent SQL injection. These are placeholders.
    //The number of placeholders has to be equal to the number of columns in the datatable.

    //Create an array of parameters to plug into the sql statement from the order object.
    const params = [
        order.fname,
        order.lname,
        order.email,
        order.size,
        order.method,
        order.toppings,
        order.comment
    ];

    //Execute the query
    const [result] = await pool.execute(sql, params); //This is an SQL insert query.

    //Get the id from the newly inserted row.
    order.id = result.insertId;
    console.log(`A new row was inserted with id ${order.id}`)

    //Display the confirmation page
    res.render('confirm', {order});
});

//Add an admin route
app.get('/admin', requireLogin, async(req, res) => {  
    try {
        //Array destructuring gives us just the data from the query
        const [orders] = await 
            pool.query('SELECT * FROM orders ORDER BY timestamp DESC') //Get the orders table from the pizza_db
        console.log(orders);
            res.render('admin', {orders}); 
    } catch(err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error occurred.')
    }
    // res.send(orders);
}) 

//Add an logout route
/* req.session.destroy() deleters the session from the server
    After, we redirect the user back to the login page.
 */

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})

//Start the server on the designated port by telling the app to "listen" for the PORT
app.listen(PORT, () => {
    console.log(`Server running in port http://localhost:${PORT}`);
})