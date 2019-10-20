let signOutbtn = document.getElementById("signOutBtn");
signOutbtn.addEventListener('click', signOut);

//sign out function
function signOut() {
    firebase.auth().signOut().then(function () {
        console.log("success");
        window.location = "index.html";
    })
}