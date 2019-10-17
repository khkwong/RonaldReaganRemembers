//sign up function
function signUp() {
    let email = document.getElementById("emailTxt").value;
    let pw = document.getElementById("pwTxt").value;
    firebase.auth().createUserWithEmailAndPassword(email, pw).then(function (user) {
        console.log("success sign up");
        firestore.collection('users').doc(firebase.auth().currentUser.uid + "").set({
            email: email,
            id: firebase.auth().currentUser.uid
        }).catch(function (error) {
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
    })
}