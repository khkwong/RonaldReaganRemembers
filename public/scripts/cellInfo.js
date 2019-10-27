//extract the info about the cell as well indicate available moves
function supreme() {
  gameBoard.AI = true;
}

function cellInfo(elem) {
  try {
    //extract cell info
    var sq = Number(elem.id.substring(0,2));
    var piece = Number(elem.id.substring(3,5));
    var current = sq + customFlashPiece(piece); //current piece
    var before = gameBoard.beforePos + customFlashPiece(gameBoard.beforePiece);
    var beforePiece = gameBoard.beforePiece;
    //if green piece is clicked
    if (document.getElementById(current).style.backgroundColor == "springgreen") {
      var moveIn = sq + customFlashPiece(gameBoard.beforePiece);
      //enPassant
      if (gameBoard.enPas == 1) {
        gameBoard.enPas = 0;
      }
      if (sq == gameBoard.beforePos - 20 && gameBoard.beforePiece == 1) {
        gameBoard.enPas = 1;
        gameBoard.supreme = sq;
      }
      if (sq == gameBoard.beforePos + 20 && gameBoard.beforePiece == 7) {
        gameBoard.enPas = 1;
        gameBoard.supreme = sq;
      }
      //white gets enPassanted
      var enpassanterColor = blackWhite(gameBoard.beforePiece);
      if (gameBoard.enPasPos == sq && enpassanterColor == "BLACK"){
        var assasinatedSq = sq - 10;
        var assasinatedPiece = gameBoard.pieces[sq - 10];
        var name = assasinatedSq + customFlashPiece(assasinatedPiece);
        document.getElementById(name).innerHTML = "";
        document.getElementById(name).id = assasinatedSq + customFlashPiece(0);
        gameBoard.pieces[assasinatedSq] = 0;
        gameBoard.enPasPos = 0;
        gameBoard.enPasName = name;
        gameBoard.enPasActivate = 1;
        gameBoard.enPasId = assasinatedSq + customFlashPiece(0);
      }
      //black  gets enPassanted
      if (gameBoard.enPasPos == sq && enpassanterColor == "WHITE"){
        var assasinatedSq = sq + 10;
        var assasinatedPiece = gameBoard.pieces[sq + 10];
        var name = assasinatedSq + customFlashPiece(assasinatedPiece);
        document.getElementById(name).innerHTML = "";
        document.getElementById(name).id = assasinatedSq + customFlashPiece(0);
        gameBoard.pieces[assasinatedSq] = 0;
        gameBoard.enPasPos = 0;
        gameBoard.enPasName = name;
        gameBoard.enPasActivate = 1;
        gameBoard.enPasId = assasinatedSq + customFlashPiece(0);
      }
      //clear the flashing squares
      for (let i = 0; i < gameBoard.flashSuggest.length; i++) {
        var pieceNum = customFlashPiece(gameBoard.flashPiece[i]);//pieceNum is the last 2 digits of the id ex: _00 for empty
        var available = gameBoard.flashSuggest[i] + pieceNum; //flashSuggest sets the availale square to green
        document.getElementById(available).style.backgroundColor = "";
      }
      gameBoard.flashSuggest = [];
      gameBoard.flashPiece = [];
      //update ply and player
      db.collection('listen').doc('holder').get().then(holder => {
        //switch player
        var ply = holder.data().ply;
        ply++;
        var player = ply % 2;
        //push before, current, and moveIn piece onto firebase
        db.collection('listen').doc('holder').update({
          before: before,
          current: current,
          moveIn: moveIn,
          piece: beforePiece,
          ply: ply,
          player: player,
          enPasName: gameBoard.enPasName,
          enPasId: gameBoard.enPasId,
          enPasStatus: gameBoard.enPas,
          supreme: gameBoard.supreme
        });
      });
    
      //swap position
      gameBoard.pieces[sq] = gameBoard.beforePiece;
      gameBoard.pieces[gameBoard.beforePos] = 0;

      db.collection("listen").doc("holder").update({
        gameBoard: gameBoard.pieces,
        enPasActivate: gameBoard.enPasActivate
      })
      //quick reset
      gameBoard.flash = true;
      gameBoard.notFlash = true;
      gameBoard.enPasActivate = 0;
    }
    //clear square if user click other spot
    if(gameBoard.flash == true) {
      for (let i = 0; i < gameBoard.flashSuggest.length; i++) {
        var pieceNum = customFlashPiece(gameBoard.flashPiece[i]);//pieceNum is the last 2 digits of the id ex: _00 for empty
        var available = gameBoard.flashSuggest[i] + pieceNum; //flashSuggest sets the availale square to green
        document.getElementById(available).style.backgroundColor = "";
      }
      gameBoard.flashSuggest = [];
      gameBoard.flashPiece = [];
    }


      //show the available move
    if(gameBoard.notFlash == false) {
      console.log('cell')
      enPas(sq);
      db.collection("listen").doc("holder").get().then(geez => {
        SqBlocked(piece,sq,geez.data().player);
        for (let i = 0; i < gameBoard.flashSuggest.length; i++) {
          var pieceNum = customFlashPiece(gameBoard.flashPiece[i]);//pieceNum is the last 2 digits of the id ex: _00 for empty
          var available = gameBoard.flashSuggest[i] + pieceNum; //flashSuggest sets the availale square to green
          document.getElementById(available).style.backgroundColor = "springgreen";
        }
      })
    }
    //clear square if user click same spot twice
    if(gameBoard.same == true && gameBoard.beforePos == sq) {
      for (let i = 0; i < gameBoard.flashSuggest.length; i++) {
        var pieceNum = customFlashPiece(gameBoard.flashPiece[i]);//pieceNum is the last 2 digits of the id ex: _00 for empty
        var available = gameBoard.flashSuggest[i] + pieceNum; //flashSuggest sets the availale square to green
        document.getElementById(available).style.backgroundColor = "";
        gameBoard.same = false;
      }
      gameBoard.flashSuggest = [];
      gameBoard.flashPiece = [];
    }
    //the current piece now becomes before piece
    gameBoard.beforePiece = piece;
    gameBoard.beforePos = sq;
    gameBoard.flash = true;
    gameBoard.notFlash = false;
    gameBoard.count++;
    gameBoard.same = (gameBoard.count % 2 == 0) ? false : true;
    //flash #turn locally
    document.getElementById('turn').style.backgroundColor = "springgreen";
    document.getElementById('turn').style.color = "#fff";
    setTimeout(function(){
      document.getElementById('turn').style.color = "#000";
      document.getElementById('turn').style.backgroundColor = "#fff";
    },1200);
  } catch {err => {
    console.log(err);
  }}
}

//check if there is an ally piece blocking its way
function SqBlocked(piece, sq, player) {
  // console.log("white: " + gameBoard.server);
  // console.log("player: " + player);
  // console.log("gameBoard.ai: " + gameBoard.ai);
    //for white pawn
    if (player == 0 && gameBoard.server == 2) { //black is always server 1
      switch (piece) {
        //for white pawn
        case 1: isEmptyWp(sq); break;
        //for white knight
        case 2: isEmptyKn(sq); break;
        case 3: isEmptyBi(sq); break;
        case 4: isEmptyRo(sq); break;
        case 5: isEmptyQu(sq); break;
        case 6: isEmptyKi(sq); break;
        default: console.log("fail white");
      }
    } else if (player == 1 && gameBoard.server == 1 || gameBoard.ai) {
      console.log("black: " + gameBoard.server);
        switch(piece) {
          //for black pawn
          case 7: isEmptyBp(sq); break;
          //for black knight
          case 8: isEmptyKn(sq); break;
          case 9: isEmptyBi(sq); break;
          case 11: isEmptyQu(sq); break;
          case 10: isEmptyRo(sq); break;
          case 12: isEmptyKi(sq); break;
          default: console.log("fail black");
        }
    }
}
//sub function of SqBlocked() for wp
function isEmptyWp(sq) {
  var specialCon = false;
  if (gameBoard.pieces[sq - 10] == PIECES.EMPTY){
    gameBoard.flashSuggest.push(sq - 10);
    gameBoard.flashPiece.push(gameBoard.pieces[sq - 10]);
    let specialCon1 = (false == wpMoved(sq)) ? true : false;
    specialCon = (specialCon1 == true) ? true : false;
  }
  //speical move 2 squares rule for pawns
  //wpMoved return false if white pawn hasn't moved
  if (gameBoard.pieces[sq - 20] == PIECES.EMPTY && specialCon == true ){
    gameBoard.flashSuggest.push(sq - 20);
    gameBoard.flashPiece.push(gameBoard.pieces[sq - 20]);
  }
  //pawn attack mode for white
  if (blackWhite(gameBoard.pieces[sq - 9]) == "BLACK"){
    gameBoard.flashSuggest.push(sq - 9);
    gameBoard.flashPiece.push(gameBoard.pieces[sq - 9]);
  }
  if (blackWhite(gameBoard.pieces[sq - 11]) == "BLACK"){
    gameBoard.flashSuggest.push(sq - 11);
    gameBoard.flashPiece.push(gameBoard.pieces[sq - 11]);
  }
}
//sub function of SqBlocked() for wp
function isEmptyBp(sq) {
  var specialCon = false;
  if (gameBoard.pieces[sq + 10] == PIECES.EMPTY ) {
    gameBoard.flashSuggest.push(sq + 10);
    gameBoard.flashPiece.push(gameBoard.pieces[sq + 10]);
    gameBoard.genCount.push(7);
    let specialCon1 = (false == bpMoved(sq)) ? true : false;
    specialCon = (specialCon1 == true) ? true : false;
  }
  //speical move 2 squares rule for pawns
  //wpMoved return false if white pawn hasn't moved
   if (gameBoard.pieces[sq + 20] == PIECES.EMPTY && specialCon == true) {
    gameBoard.flashSuggest.push(sq + 20);
    gameBoard.flashPiece.push(gameBoard.pieces[sq + 20]);
    gameBoard.genCount.push(7);
  }
  //pawn attack mode for black
  if (blackWhite(gameBoard.pieces[sq + 9]) == "WHITE"){
    gameBoard.flashSuggest.push(sq + 9);
    gameBoard.flashPiece.push(gameBoard.pieces[sq + 9]);
    gameBoard.genCount.push(7);
  }
  if (blackWhite(gameBoard.pieces[sq + 11]) == "WHITE"){
    gameBoard.flashSuggest.push(sq + 11);
    gameBoard.flashPiece.push(gameBoard.pieces[sq + 11]);
    gameBoard.genCount.push(7);
  }
}
//enPassant
function enPas(sq) {
  //black just took 2 squares
  if (gameBoard.pieces[sq - 1] == 7 && gameBoard.enPas == 1 && (sq - 1) == gameBoard.supreme) {
    gameBoard.flashSuggest.push(sq - 11);
    gameBoard.flashPiece.push(gameBoard.pieces[sq - 11]);
    gameBoard.enPasPos = sq - 11;
  }
  //black just took 2 squares
  if (gameBoard.pieces[sq + 1] == 7 && gameBoard.enPas == 1 && (sq + 1) == gameBoard.supreme) {
    gameBoard.flashSuggest.push(sq - 9);
    gameBoard.flashPiece.push(gameBoard.pieces[sq - 9]);
    gameBoard.enPasPos = sq - 9;
  }
  //white just took 2 squares
  if (gameBoard.pieces[sq - 1] == 1 && gameBoard.enPas == 1 && sq - 1 == gameBoard.supreme) {
    gameBoard.flashSuggest.push(sq + 9);
    gameBoard.flashPiece.push(gameBoard.pieces[sq + 9]);
    gameBoard.enPasPos = sq + 9;
  }
  //white just took 2 squares
  if (gameBoard.pieces[sq + 1] == 1 && gameBoard.enPas == 1 && sq + 1 == gameBoard.supreme) {
    gameBoard.flashSuggest.push(sq + 11);
    gameBoard.flashPiece.push(gameBoard.pieces[sq + 11]);
    gameBoard.enPasPos = sq + 11;
  }
}
//turn pawn into a queen
function turnQueen(sq) {
  var name = sq + customFlashPiece(gameBoard.pieces[sq]);
  for (let i = 21; i <= 28; i++) {
      if (sq == i && gameBoard.pieces[sq] == 1) {
        document.getElementById(name).id = sq + customFlashPiece(5);
        document.getElementById(sq + customFlashPiece(5)).innerHTML = convertPieceHtml(5);
        gameBoard.pieces[sq] = 5;
      }
  }
  for (let i = 91; i <= 98; i++) {
      if (sq == i && gameBoard.pieces[sq] == 7) {
        document.getElementById(name).id = sq + customFlashPiece(11);
        document.getElementById(sq + customFlashPiece(11)).innerHTML = convertPieceHtml(11);
        gameBoard.pieces[sq] = 11;
      }
  }

}

//sub function of SqBlocked() for both knight
function isEmptyKn(sq) {
  var selfColor = blackWhite(gameBoard.pieces[sq]);
  for (let i = 0; i < 8; i++) {
    var pieceAhead = gameBoard.pieces[sq + KnDir[i]];
    var colorAhead =  blackWhite(pieceAhead);
    if (pieceAhead == PIECES.EMPTY || (colorAhead != "OFFBOARD" && selfColor != colorAhead)) {
      gameBoard.flashSuggest.push(sq + KnDir[i]);
      gameBoard.flashPiece.push(gameBoard.pieces[sq + KnDir[i]]);
      gameBoard.genCount.push(8);
    }
  }
}
//sub function of SqBlocked() for both bishop
function isEmptyBi(sq) {
  var selfColor = blackWhite(gameBoard.pieces[sq]);
  for (let i = 0; i < 4; i++) {
    var temp = sq + BiDir[i];
    var pieceAhead = gameBoard.pieces[temp];
    var colorAhead =  blackWhite(pieceAhead);
    while(pieceAhead == PIECES.EMPTY) {
      gameBoard.flashSuggest.push(temp);
      gameBoard.flashPiece.push(gameBoard.pieces[temp]);
      gameBoard.genCount.push(9);
      temp += BiDir[i];
      pieceAhead = gameBoard.pieces[temp];
      colorAhead =  blackWhite(pieceAhead);
    }
    if (colorAhead != "OFFBOARD" && selfColor != colorAhead) {
      gameBoard.flashSuggest.push(temp);
      gameBoard.flashPiece.push(gameBoard.pieces[temp]);
      gameBoard.genCount.push(9);
    }
  }
}
//sub function of SqBlocked() for both rook
function isEmptyRo(sq) {
  var selfColor = blackWhite(gameBoard.pieces[sq]);
  for (let i = 0; i < 4; i++) {
    var temp = sq + RkDir[i];
    var pieceAhead = gameBoard.pieces[temp];
    var colorAhead =  blackWhite(pieceAhead);
    while(pieceAhead == PIECES.EMPTY) {
      gameBoard.flashSuggest.push(temp);
      gameBoard.flashPiece.push(gameBoard.pieces[temp]);
      gameBoard.genCount.push(10);
      temp += RkDir[i];
      pieceAhead = gameBoard.pieces[temp];
      colorAhead =  blackWhite(pieceAhead);
    }
    if (colorAhead != "OFFBOARD" && selfColor != colorAhead) {
      gameBoard.flashSuggest.push(temp);
      gameBoard.flashPiece.push(gameBoard.pieces[temp]);
      gameBoard.genCount.push(10);
    }
  }
}
//sub function of SqBlocked() for both king
function isEmptyKi(sq) {
  var selfColor = blackWhite(gameBoard.pieces[sq]);
  for (let i = 0; i < 8; i++) {
    var pieceAhead = gameBoard.pieces[sq + KiDir[i]];
    var colorAhead =  blackWhite(pieceAhead);
    if (pieceAhead == PIECES.EMPTY || (colorAhead != "OFFBOARD" && selfColor != colorAhead)) {
      gameBoard.flashSuggest.push(sq + KiDir[i]);
      gameBoard.flashPiece.push(gameBoard.pieces[sq + KiDir[i]]);
      gameBoard.genCount.push(12);
    }
  }
  //castle for white king to the right
  if(sq == 95 && gameBoard.castleWhite[0] == 0 && gameBoard.castleWhite[1] == 0 && gameBoard.pieces[96] == 0 && gameBoard.pieces[97] == 0) {
    gameBoard.flashSuggest.push(97);
    gameBoard.flashPiece.push(0);
    gameBoard.genCount.push(12);
  }
  //castle for white king to the left
  if(sq == 95 && gameBoard.castleWhite[0] == 0 && gameBoard.castleWhite[1] == 0 && gameBoard.pieces[92] == 0 && gameBoard.pieces[93] == 0 && gameBoard.pieces[94] == 0) {
    gameBoard.flashSuggest.push(93);
    gameBoard.flashPiece.push(0);
    gameBoard.genCount.push(12);
  }
  //castle for black king to the right
  if(sq == 25 && gameBoard.castleBlack[0] == 0 && gameBoard.castleBlack[1] == 0 && gameBoard.pieces[26] == 0 && gameBoard.pieces[27] == 0) {
    gameBoard.flashSuggest.push(27);
    gameBoard.flashPiece.push(0);
    gameBoard.genCount.push(12);
  }
  //castle for black king to the left
  if(sq == 25 && gameBoard.castleBlack[0] == 0 && gameBoard.castleBlack[1] == 0 && gameBoard.pieces[22] == 0 && gameBoard.pieces[23] == 0 && gameBoard.pieces[24] == 0) {
    gameBoard.flashSuggest.push(23);
    gameBoard.flashPiece.push(0);
    gameBoard.genCount.push(12);
  }
}
//update castle condition
function updateCastle(sq) {
  //first half check if the rooks and the kings have been moved
  //blackKing
  if (gameBoard.beforePiece == 12 && gameBoard.beforePos == 25) {
    gameBoard.castleBlack[0] = 1;
  }
  //left btm corner rook
  if (gameBoard.beforePiece == 10 && gameBoard.beforePos == 91) {
    gameBoard.castleBlack[1] = 1
  }
  //right btm corner rook
  if (gameBoard.beforePiece == 10 && gameBoard.beforePos == 98) {
    gameBoard.castleBlack[2] = 1;
  }
  //whiteKing
  if (gameBoard.beforePiece == 6 && gameBoard.beforePos == 95) {
    gameBoard.castleWhite[0] = 1;
  }
  //left top corner rook
  if (gameBoard.beforePiece == 4 && gameBoard.beforePos == 21) {
    gameBoard.castleWhite[1] = 1;
  }
  //right top corner rook
  if (gameBoard.beforePiece == 4 && gameBoard.beforePos == 28) {
    gameBoard.castleWhite[2] = 1;
  }

  //second half swap the position of rook and king
  //for blackKing to the right
  if (gameBoard.beforePiece == 12 && gameBoard.beforePos == 25 && sq == 27) {
    console.log("castle success")
    gameBoard.pieces[26] = 10;
    gameBoard.pieces[28] = 0;
    document.getElementById('28_10').id = '28_00';
    document.getElementById('28_00').innerHTML = convertPieceHtml(0);
    document.getElementById('26_00').id = '26_10';
    document.getElementById('26_10').innerHTML = convertPieceHtml(10);
  }
  //for blackKing to the left
  if (gameBoard.beforePiece == 12 && gameBoard.beforePos == 25 && sq == 23) {
    console.log("castle success")
    gameBoard.pieces[24] = 10;
    gameBoard.pieces[21] = 0;
    document.getElementById('21_10').id = '21_00';
    document.getElementById('21_00').innerHTML = convertPieceHtml(0);
    document.getElementById('24_00').id = '24_10';
    document.getElementById('24_10').innerHTML = convertPieceHtml(10);
  }
  //for whiteKing to the right
  if (gameBoard.beforePiece == 6 && gameBoard.beforePos == 95 && sq == 97) {
    console.log("castle success")
    gameBoard.pieces[96] = 4;
    gameBoard.pieces[98] = 0;
    document.getElementById('98_04').id = '98_00';
    document.getElementById('98_00').innerHTML = convertPieceHtml(0);
    document.getElementById('96_00').id = '96_04';
    document.getElementById('96_04').innerHTML = convertPieceHtml(4);
  }
  //for whiteKing to the left
  if (gameBoard.beforePiece == 6 && gameBoard.beforePos == 95 && sq == 93) {
    console.log("castle success")
    gameBoard.pieces[94] = 4;
    gameBoard.pieces[91] = 0;
    document.getElementById('91_04').id = '91_00';
    document.getElementById('91_00').innerHTML = convertPieceHtml(0);
    document.getElementById('94_00').id = '94_04';
    document.getElementById('94_04').innerHTML = convertPieceHtml(4);
  }
}
//sub function of SqBlocked() for both queen
function isEmptyQu(sq) {
  var selfColor = blackWhite(gameBoard.pieces[sq]);
  for (let i = 0; i < 8; i++) {
    var temp = sq + KiDir[i];
    var pieceAhead = gameBoard.pieces[temp];
    var colorAhead =  blackWhite(pieceAhead);
    while(pieceAhead == PIECES.EMPTY) {
      gameBoard.flashSuggest.push(temp);
      gameBoard.flashPiece.push(gameBoard.pieces[temp]);
      gameBoard.genCount.push(11);
      temp += KiDir[i];
      pieceAhead = gameBoard.pieces[temp];
      colorAhead =  blackWhite(pieceAhead);
    }
    if (colorAhead != "OFFBOARD" && selfColor != colorAhead) {
      gameBoard.flashSuggest.push(temp);
      gameBoard.flashPiece.push(gameBoard.pieces[temp]);
      gameBoard.genCount.push(11);
    }
  }
}
//see if a piece is black or white
function blackWhite(piece) {
  switch (piece){
    case 0: return "EMPTY"; break;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: return "WHITE"; break;
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12: return "BLACK"; break;
    default: return "OFFBOARD";
  }
}
//custom the output of gameBoard.flashPiece[]
function customFlashPiece(piece) {
  switch(piece){
    case 0: return "_00"; break;
    case 1: return "_01"; break;
    case 2: return "_02"; break;
    case 3: return "_03"; break;
    case 4: return "_04"; break;
    case 5: return "_05"; break;
    case 6: return "_06"; break;
    case 7: return "_07"; break;
    case 8: return "_08"; break;
    case 9: return "_09"; break;
    case 10: return "_10"; break;
    case 11: return "_11"; break;
    case 12: return "_12"; break;
    default: console.log("fail");
  }
}

//move for ai
function moveGen() {
  SqAttacked();
  // var actual = gameBoard.flashSuggest.map(x => {
  //   if (x != 0) return x;
  // });
  var random = Math.floor(Math.random() * gameBoard.flashSuggest.length);
  while(gameBoard.flashSuggest[random] == 0) {
    random = Math.floor(Math.random() * gameBoard.flashSuggest.length);
  }
  var count = 0;
  for (var i = 0; i <= random; i++) {
    if (gameBoard.flashSuggest[i] == 0) count++;
  }
  console.log(gameBoard.flashSuggest[random]);
  console.log(gameBoard.flashPiece[random]);
  var piece = gameBoard.blackPiece[count];
  var pos = gameBoard.flashSuggest[random];
  var moveIn = pos + customFlashPiece(gameBoard.flashPiece[random]); //current piece
  console.log(gameBoard.blackPiece);
  console.log(gameBoard.blackPos);
  var before = gameBoard.blackPos[count] + customFlashPiece(piece);
  console.log(before);
  //change everything of the before piece
  document.getElementById(before).innerHTML = "";
  document.getElementById(before).id = before.replace(before.substring(3, 5), "00");
  //update the moveIn square
  console.log(moveIn);
  document.getElementById(moveIn).innerHTML = convertPieceHtml(gameBoard.blackPiece[count]);
  document.getElementById(moveIn).id = pos + gameBoard.blackPiece[count];
  gameBoard.pieces[pos] = gameBoard.blackPiece[random];
  gameBoard.pieces[gameBoard.blackPos[random]] = 0;
  db.collection('listen').doc('holder').get().then(geez => {
    var info = geez.data();
    db.collection('listen').doc('holder').update({
      ply: info.ply + 1
    });
  });
  gameBoard.notFlash = false;
}
//check if a piece is being attacked
function SqAttacked() {
  for (var i = 0; i < gameBoard.pieces.length; i++) {
    if (gameBoard.pieces[i] >= 7 && gameBoard.pieces[i] <= 12) {
      gameBoard.blackPos.push(i);
      gameBoard.blackPiece.push(gameBoard.pieces[i]);
    }
  }
  // var whitePos = [];
  // var whitePiece = [];
  // for (var i = 0; i < gameBoard.pieces.length; i++) {
  //   if (gameBoard.pieces[i] >= 1 && gameBoard.pieces[i] <= 6) {
  //     whitePos.push(i);
  //     whitePiece.push(gameBoard.pieces[i]);
  //   }
  // }
  for (var i = 0; i < gameBoard.blackPos.length; i++) {
    SqBlocked(gameBoard.blackPiece[i], gameBoard.blackPos[i], 1);
    gameBoard.flashPiece.push(0);
    gameBoard.flashSuggest.push(0);
  }
  console.log(gameBoard.flashSuggest);
  console.log(gameBoard.flashPiece);
  console.log(gameBoard.genCount);
}
