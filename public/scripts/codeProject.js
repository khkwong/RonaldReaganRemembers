init();
//test();
//initialize the game
function init() {
  initBoard();
  updateListsMaterial();
//set section for the players
  db.collection('section').doc("state").get().then(state => {
    if (state.data().section == 1) {
      //overwriting the css of default
      var table = document.querySelector("table");
      var prefix = document.querySelectorAll(".prefix");
      var num = document.querySelectorAll(".num");
      var alp = document.querySelector(".alp");
      var cell = document.querySelectorAll(".cell");
      table.style.transform = "translateX(45px)";
      table.style.transform += "rotate(180deg)";
      table.style.transform += "translateY(50px)"
      //cell
      for (let i = 0; i < 64; i++) {
        cell[i].style.transform += "rotate(180deg)";
      }
      //prefix
      for (let i = 0; i < 17; i++) {
        prefix[i].style.transform += "rotate(180deg)";
      }
      //num
      for (let i = 0; i < 8; i++) {
        num[i].style.transform += "translateX(-600px)";
      }
      alp.style.transform += "translateY(-600px)";
      gameBoard.server = 1; //set the server for player one
    } else {
      gameBoard.server = 2;
    }
    //initialize the collection on firebase
    db.collection('section').doc("state").set({
      section: 2 //for player 2
    });
    db.collection('listen').doc("holder").set({
      player: 0,//for player 2
      ply: 0,
      //update local board
      gameBoard: gameBoard.pieces,
      ai: gameBoard.ai
    });
    //reset the section
    db.collection('section').doc("state").set({
      section: 0 //for player 2
    })
  })
}

function test(){
}
/*
window.onload = function() {
    var anchors = document.getElementsByClassName("cell");
    for(var i = 0; i < 32; i++) {
        var anchor = anchors[i];
        anchor.onclick = function() {
          for (let i = 0; i < 32; i++){
            anchors[i].style.backgroundColor = "#30c722";
          }
        }
    }
}

function myF(elem){
  document.getElementById(elem.id).style.backgroundColor = "rgb(25, 156, 31,.2)";
  console.log(Number(elem.id) + 3);
}
*/
