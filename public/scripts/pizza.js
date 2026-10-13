
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

    //Do not submit form if data is invalid
    return isValid;
    

};

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}

