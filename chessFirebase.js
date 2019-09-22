// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCNLE8XbFF5SNwTUKD6to_7MYXAYhG2g3k",
    authDomain: "cheive.firebaseapp.com",
    databaseURL: "https://cheive.firebaseio.com",
    projectId: "cheive",
    storageBucket: "cheive.appspot.com",
    messagingSenderId: "519206724928",
    appId: "1:519206724928:web:4adac1eac9778e3b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  db.collection('listen').onSnapshot(snapshot => {
    var changes = snapshot.docChanges();
    changes.forEach(change => {
      if (change.type == "modified" && change.doc.id == "holder") {
        db.collection('listen').doc('holder').get().then(geez => {
          var info = geez.data();
          var piece = info.before.substring(3, 5);
          var sq = info.current.substring(0, 2)
          //clear falshpieces
          for (let i = 0; i < gameBoard.flashSuggest.length; i++) {
            var pieceNum = customFlashPiece(gameBoard.flashPiece[i]);//pieceNum is the last 2 digits of the id ex: _00 for empty
            var available = gameBoard.flashSuggest[i] + pieceNum; //flashSuggest sets the availale square to green
            document.getElementById(available).style.backgroundColor = "";
            gameBoard.same = false;
          }
          gameBoard.flashSuggest = [];
          gameBoard.flashPiece = [];
          gameBoard.pieces = info.gameBoard;

          //change everything of the before piece
          document.getElementById(info.before).innerHTML = "";
          document.getElementById(info.before).id = info.before.replace(info.before.substring(3, 5), "00");
          //update the moveIn square
          document.getElementById(info.current).id = info.moveIn;
          document.getElementById(info.moveIn).innerHTML = convertPieceHtml(info.piece);
          //turn pawn into queen
          turnQueen(sq);
          //update castle condition
          console.log("execution achieved");
          gameBoard.beforePiece = piece;
          gameBoard.beforePos = info.before.substring(0, 2);
          updateCastle(sq);
          //swaph player
          if (info.player == 1) {
            //turn sign
            document.getElementById('turn').innerHTML = "It's Black's Turn";
            //flip the board
            var table = document.querySelector("table");
            var prefix = document.querySelectorAll("prefix");
            var num = document.querySelectorAll("num");
            var alp = document.querySelectorAll("alp");
          }
          if (info.player == 0) {
            document.getElementById('turn').innerHTML = "It's White's Turn";
          }
          if(info.player == 1 && info.AI == true) {
            moveGen();
          }
          //flash #turn
          document.getElementById('turn').style.backgroundColor = "springgreen";
          document.getElementById('turn').style.color = "#fff";
          setTimeout(function(){
            document.getElementById('turn').style.color = "#000";
            document.getElementById('turn').style.backgroundColor = "#fff";
          },1200);
          //enpas update on the other player when has been activated
          if (info.enPasActivate == 1) {
            document.getElementById(info.enPasName).innerHTML = "";
            document.getElementById(info.enPasName).id = info.enPasId;
            db.collection("listen").doc("holder").update({
              enPasActivate: 0
            })
          }
          //flash the enpas on the other player
          gameBoard.enPas = info.enPasStatus;
          gameBoard.supreme = info.supreme;
        }).catch (err => {
          console.log(err.message);
        })
      }
    })
  })
