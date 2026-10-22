//Import the module
import express from 'express';

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

//Define a default route ("/")
app.get('/', (req, res) => {
    // res.send('Welcome to Radical Pies!');
    res.sendFile(`${import.meta.dirname}/views/home.html`);
});

//Add a contact route to display a contact view page
app.get('/contact-us', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/contact.html`);
});

//Add a confirm order route to display the confirm page
app.get('/confirm-order', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/confirm.html`);
});

//Add a menu route te display the menu page
app.get('/menu', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/menu.html`);
});

//Add a route to process a pizza orddr
app.post('/submit-order', (req, res) => {
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
    order['timestamp'] = new Date();

    console.log(order);

    //Add order object to orders array
    orders.push(order);
    console.log(orders);

    //Display the confirmation page
    res.sendFile(`${import.meta.dirname}/views/confirm.html`)

});

//Add an admin route
app.get('/admin', (req, res) => {
    res.send(orders);
})

//Start the server on the designated port by telling the app to "listen" for the PORT
app.listen(PORT, () => {
    console.log(`Server running in port http://localhost:${PORT}`);
})