// var provider = new firebase.auth.GoogleAuthProvider();

// const btnGoogle = document.querySelector("#btnGoogle");
// btnGoogle.addEventListener("click", function(){
//     firebase.auth().signInWithPopup(provider)
//     .then(() => {
//         alert("Login Complete!")
//     }).catch((error) => {
//         var errorMessage = error.message;
//         alert(errorMessage)
//     });
// })
const accountRef = firebase.database().ref("Account");

const signupForm = document.querySelector("#signup-form")
signupForm.addEventListener("submit", createUser);

const signupFeedback = document.querySelector("#feedback-msg-signup")
const signupModal = new bootstrap.Modal(document.querySelector("#modal-signup"));

function createUser(event) {
    event.preventDefault();
    const email = signupForm["input-email-signup"].value;
    const password = signupForm["input-password-signup"].value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            signupFeedback.style = "color: green";
            signupFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> Signup completed."
            accountRef.push({
                email: email,
                score: 0
            })
            setTimeout(() => {
                signupForm.reset();
                signupFeedback.innerHTML = "";
                signupModal.hide()
            }, 1000)
        })
        .catch((error) => {
            signupFeedback.style = "color: crimson";
            signupFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`
            signupForm.reset();
        })
}

const btnCancels = document.querySelectorAll(".btn-cancel");
btnCancels.forEach((btn) => {
    btn.addEventListener("click", () => {
        signupForm.reset();
        signupFeedback.innerHTML = "";
    })
})

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        accountRef.once("value").then((snapshot) => {
            snapshot.forEach((data) => {
                let accountid = data.key
                let accountemail = data.val().email
                if(accountemail == user.email){
                    accountRef.child(accountid).update({
                        uid: user.uid
                    })
                }
            })
        })
        console.log("User :", user);
        // getList(user);
        // document.querySelector("#profileImg").src = user.photoURL == null ? "" : user.photoURL
        // document.querySelector("#profileName").innerText = user.displayName
        firebase.database().ref("Game").on("value", (snapshot) => {
            let checkJoin;
            snapshot.forEach((data) => {
                const gameInfo = data.val();
                Object.keys(gameInfo).forEach((key) => {
                    if (gameInfo[key] == user.email) {
                        checkJoin = true;
                    }
                })
            })
            if (checkJoin) {
                btnJoins.forEach((btnJoin) => {
                    btnJoin.disabled = true
                })
            } else {
                document.getElementById("inputPlayer-o").value == "" ? document.querySelector("#btnJoin-o").disabled = false : document.querySelector("#btnJoin-o").disabled = true
                document.getElementById("inputPlayer-x").value == "" ? document.querySelector("#btnJoin-x").disabled = false : document.querySelector("#btnJoin-x").disabled = true
            }
        })
    }
    setupUI(user);
})

const btnLogout = document.querySelector("#btnLogout");
btnLogout.addEventListener("click", function () {
    firebase.auth().signOut();
    console.log("Logout completed.")
})

const loginForm = document.querySelector("#login-form")
loginForm.addEventListener("submit", loginUser);

const loginFeedback = document.querySelector("#feedback-msg-login")
const loginModal = new bootstrap.Modal(document.querySelector("#modal-login"));

function loginUser(event) {
    event.preventDefault();
    const email = loginForm["input-email-login"].value;
    const password = loginForm["input-password-login"].value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            loginFeedback.style = "color: green";
            loginFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> login completed."
            setTimeout(() => {
                loginForm.reset();
                loginFeedback.innerHTML = "";
                loginModal.hide()
            }, 1000)
        })
        .catch((error) => {
            loginFeedback.style = "color: crimson";
            loginFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`
            loginForm.reset();
        })
}