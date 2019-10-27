let loginPopUp = document.getElementById("loginBtn");
let signUpPopup = document.getElementById("signUpPopup");
let loginPopUp2 = document.getElementById("loginBtn2");
let signUpPopup2 = document.getElementById("signUpPopup2");
let loginSubmit = document.getElementById("submitBtn");
let createAccountBtn = document.getElementById("createAccBtn");
let firestore = firebase.firestore();

loginPopUp.addEventListener('click', function () {
    document.getElementsByClassName("Login-in")[0].style.display = "block";
    document.getElementsByClassName("Sign-up")[0].style.display = "none";
    document.getElementById("homePage").style.display = "none";
})
signUpPopup.addEventListener('click', function () {
    document.getElementsByClassName("Login-in")[0].style.display = "none";
    document.getElementsByClassName("Sign-up")[0].style.display = "block";
})

loginPopUp2.addEventListener('click', function () {
    document.getElementsByClassName("Login-in")[0].style.display = "block";
    document.getElementsByClassName("Sign-up")[0].style.display = "none";
    document.getElementById("homePage").style.display = "none";
})
signUpPopup2.addEventListener('click', function () {
    document.getElementsByClassName("Login-in")[0].style.display = "none";
    document.getElementsByClassName("Sign-up")[0].style.display = "block";
    document.getElementById("homePage").style.display = "none";
})

loginSubmit.addEventListener('click', login);
createAccountBtn.addEventListener('click', signUp);



//sign up function
function signUp() {
    let username = document.getElementById("usernameInput").value;
    let email = document.getElementById("emailSignUp").value;
    let pw = document.getElementById("passwordSignUp").value;
    let level = document.getElementById("answers").value;
    firebase.auth().createUserWithEmailAndPassword(email, pw).then(function (user) {
        console.log("success sign up");
        firestore.collection('users').doc(firebase.auth().currentUser.uid + "").set({
                email: email,
                username: username,
                playLevel: level,
                id: firebase.auth().currentUser.uid
            }).then(function () {
                window.location = "landing.html";
            })
            .catch(function (error) {
                console.log("didnt do it dumbass", error);
            })
    })
}

//login function
function login() {
    let loginEmail = document.getElementById("email").value;
    let loginpw = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(loginEmail, loginpw).then(function () {
        console.log("successful sign in");
        window.location = "landing.html";
    })
}