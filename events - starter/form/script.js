// 1. Select the form

let form = document.querySelector("#personalInfoForm")

// 2. Create a function to verify the input. If the input is invalid, prevent form from submitting

function verifyInput(event){
    form.classList.add("was-validated")
    let validInput = true;
    
    if(document.querySelectorAll(".valid-feedback, .invalid-feedback")){
        document.querySelectorAll(".valid-feedback, .invalid-feedback").forEach(function(element){
            element.remove()
        })
    }
    
    // 4. In verifyInput(), construct rules for each input:
    
    let fname = document.querySelector("#validationCustom01")
    let lname = document.querySelector("#validationCustom02")
    let username = document.querySelector("#validationCustomUsername")
    let usernameUpper = 0;
    let usernameLower = 0;
    let usernameSpecial = 0;
    let special = "/[ `!@#$%^&*()_+-=[]{};':\"\\|,.<>?~]"
    if(username.value.length >= 8){
        for(let i = 0;i < special.length; i++){
            for(let j = 0; j < username.value.length; j++){
                special[i] == username.value[j] ? usernameSpecial += 1 : usernameSpecial = usernameSpecial
            }
        }
        usernameUpper -= usernameSpecial
        usernameLower -= usernameSpecial
        for(let i = 0; i < username.value.length; i++){
            username.value[i] == username.value.toUpperCase()[i] ? usernameUpper += 1 : usernameUpper = usernameUpper
        }
        for(let i = 0; i < username.value.length; i++){
            username.value[i] == username.value.toLowerCase()[i] ? usernameLower += 1 : usernameLower = usernameLower
        }
        // console.log("usernameUpper:" + usernameUpper)
        // console.log("usernameLower:" + usernameLower)
        // console.log("usernameSpecial:" + usernameSpecial)
        if(usernameUpper >= 1 && usernameLower >= 1 && usernameSpecial >= 1){
            username.setCustomValidity('')
            username.parentNode.appendChild(document.createRange().createContextualFragment(validBlockcode))
        }else{
            username.setCustomValidity("Invalid Username, must have at least one lower-case, one upper-case, one special characters.")
            username.parentNode.appendChild(document.createRange().createContextualFragment(invalidBlockcode))
            validInput = false;
        }
    }else{
        username.setCustomValidity("Invalid Username, too short.")
        username.parentNode.appendChild(document.createRange().createContextualFragment(invalidBlockcode))
        validInput = false;
    }

    let number = "0123456789"
    let zip = document.querySelector("#validationCustom05")
    let zipCheck = 0;
    if(zip.value.length == 5){
        for(let i = 0; i < 5; i++){
            for(let j = 0; j < number.length; j++){
                number[j] == zip.value[i] ? zipCheck += 1 : zipCheck = zipCheck
            }
        }
        // console.log(zipCheck)
        if(zipCheck == 5){
            zip.setCustomValidity('')
            zip.parentNode.appendChild(document.createRange().createContextualFragment(validBlockcode))
        }else{
            zip.setCustomValidity("Invalid Zip, must number.")
            zip.parentNode.appendChild(document.createRange().createContextualFragment(invalidBlockcode))
            validInput = false;
        }
    }else{
        zip.setCustomValidity("Invalid Zip, length must be 5.")
        zip.parentNode.appendChild(document.createRange().createContextualFragment(invalidBlockcode))
        validInput = false;
    }
    
    
    if(fname.value.length < 8){
        // console.log("Invalid Firstname")
        fname.setCustomValidity("Invalid Firstname, too short.")
        fname.parentNode.appendChild(document.createRange().createContextualFragment(invalidBlockcode))
        validInput = false;
    } else {
        // console.log("valid Feedback")
        fname.setCustomValidity('')
        fname.parentNode.appendChild(document.createRange().createContextualFragment(validBlockcode))
    }
    
    if(lname.value == fname.value || lname.value.length < 5){
        // console.log("Invalid Lastname")
        lname.setCustomValidity("Invalid Lastname, too short.")
        lname.parentNode.appendChild(document.createRange().createContextualFragment(invalidBlockcode))
        validInput = false;
    } else {
        // console.log("valid Feedback")
        lname.setCustomValidity('')
        lname.parentNode.appendChild(document.createRange().createContextualFragment(validBlockcode))
    }

    if(!document.querySelector("#invalidCheck").checked){
        validInput = false;
    }
    
    if(!validInput){
        event.preventDefault();
    }
}

// 3. Bind the event "submit" with the form.

form.addEventListener("submit", verifyInput);

// Create a valid-feedback HTML element

let validBlockcode = `
<div class="valid-feedback">
    Looks good!
</div>`
const validFeedback = document.createRange().createContextualFragment(validBlockcode);

let invalidBlockcode = `
<div class="invalid-feedback">
    Invalid feedback;
</div>`
const invalidFeedback = document.createRange().createContextualFragment(invalidBlockcode);
