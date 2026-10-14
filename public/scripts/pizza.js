
// Get the element with the id of pizza-form, assign that to the validate form function
document.getElementById("pizza-form").onsubmit = () => {

    let isValid = true;

    // Clear all errors
    clearErrors();

    // Validate first name
    let fname = document.getElementById("fname").value.trim();
    if (fname === "") {
       document.getElementById("err-fname").style.display = "block";
       isValid = false;
    }

    // Validate last name 
    let lname = document.getElementById("lname").value.trim();
    if (lname === "") {
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }

    // Validate the email address
    let email = document.getElementById("email").value.trim();
    if (email === "") {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    //Validate the delivery option
    let pickup = document.getElementById("pickup");
    let delivery = document.getElementById("delivery");
    let optionChosen = false; //The default state is that no option is checke

    //If either of the options is checked
    if ((pickup.checked === true) || (delivery.checked === true)) {
        optionChosen = true; //Return optionChosen as true
    } else {
        //Display the error
        document.getElementById("err-d-or-p").style.display = "block";
        isValid = false;
    }

    //Validate the options
    //Grab all the toppings, assign them to a toppigns variable
    let toppings = document.querySelectorAll('input[name="topppings[]"]:checked');

    //If the length of toppings NodeList is 0, then it contain no elements, 
    // Meaning, that not option is selected.
    if (toppings.length === 0) {
        //Display the error
        document.getElementById("err-toppings").style.display = "block";
        isValid = false;
    }
    
    //Validate the size
    let pizzaSize = document.getElementById("size").value;

    //If not option for the pizza size is selected, throw the display error.
    if (pizzaSize === "none") {
        document.getElementById("err-size").style.display = "block";
    }

    //Do not submit form if data is invalid
    return isValid;


    

};

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}

