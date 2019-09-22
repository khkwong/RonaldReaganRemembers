var gameBoard = {};
gameBoard.pieces = new Array(120);
gameBoard.side = COLOURS.WHITE;
gameBoard.fiftyMove = 0; //if both players make 50 move, then it's a draw. if fiftyMove hits 100, then it's a draw
gameBoard.hisPly = 0; //count of every move made from the start
gameBoard.ply = 0; //number of half move
gameBoard.enPas = 0;
gameBoard.enPasPos = 0;
gameBoard.supreme = 0; //for enPas
gameBoard.castleWhite = [0,0,0]; //condition to castle for white
gameBoard.castleBlack = [0,0,0]; //condition ot castle for black
gameBoard.material = new Array(2); //white or Black
gameBoard.pceNum = new Array(13); //index of PIECES
gameBoard.pList = new Array(14 * 10);
gameBoard.posKey = 0;
gameBoard.flashSuggest = []; //indicate the available square to move in
gameBoard.flashPiece = []; //indicate the corresponding piece of the available square
gameBoard.beforePiece = 0; //indicate the piece clicked just now
gameBoard.beforePos = 0; //indicate the location of the piece just clicked now
gameBoard.flash = false; //for flashSuggest()
gameBoard.moveList = new Array (maxDepth * maxPositionMoves);
gameBoard.moveScores = new Array(maxDepth * maxPositionMoves);
gameBoard.moveListStart = new Array(maxDepth);
gameBoard.notFlash = false;
gameBoard.same = true; //user clicks on same spot
gameBoard.count = 0; //user clicks on same spot
gameBoard.player = 0; //0 for p1, 1 for p2
gameBoard.enPasName = "";
gameBoard.enPasActivate = 0;
gameBoard.enPasId = "";
gameBoard.server; //server of the player
//initialize the board
function initBoard() {
  //set all the values (ranks & square value) to 100
  for (let i = 0; i < 120; i++) {
    filesBrd[i] = 100;
    ranksBrd[i] = 100;
  }
  //assign the correct values to the onboard squares
  for (let i = 21; i <= 98; i++) {
    filesBrd[i] = i % 10 - 1;
    ranksBrd[i] = Math.floor((i - 20) / 10);
    if(i % 10 == 0 || i % 10 == 9){
      filesBrd[i] = 100;
      ranksBrd[i] = 100;
    }
  }
  //fill piece array (used to retunr the piece value at particular cell in the 120 board)
  for (let i = 0; i < 120; i++) {
    gameBoard.pieces[i] = SQUARES.OFFBOARD;
  }
  for (let i = 0; i < 64; i++) {
    gameBoard.pieces[Sq120(i)] = PIECES.EMPTY;
  }
  gameBoard.pieces[21] = PIECES.bR; gameBoard.pieces[22] = PIECES.bN; gameBoard.pieces[23] = PIECES.bB; gameBoard.pieces[24] = PIECES.bQ; gameBoard.pieces[25] = PIECES.bK; gameBoard.pieces[26] = PIECES.bB; gameBoard.pieces[27] = PIECES.bN; gameBoard.pieces[28] = PIECES.bR;
  gameBoard.pieces[31] = PIECES.bP; gameBoard.pieces[32] = PIECES.bP; gameBoard.pieces[33] = PIECES.bP; gameBoard.pieces[34] = PIECES.bP; gameBoard.pieces[35] = PIECES.bP; gameBoard.pieces[36] = PIECES.bP; gameBoard.pieces[37] = PIECES.bP; gameBoard.pieces[38] = PIECES.bP;
  gameBoard.pieces[81] = PIECES.wP; gameBoard.pieces[82] = PIECES.wP; gameBoard.pieces[83] = PIECES.wP; gameBoard.pieces[84] = PIECES.wP; gameBoard.pieces[85] = PIECES.wP; gameBoard.pieces[86] = PIECES.wP; gameBoard.pieces[87] = PIECES.wP; gameBoard.pieces[88] = PIECES.wP;
  gameBoard.pieces[91] = PIECES.wR; gameBoard.pieces[92] = PIECES.wN; gameBoard.pieces[93] = PIECES.wB; gameBoard.pieces[94] = PIECES.wQ; gameBoard.pieces[95] = PIECES.wK; gameBoard.pieces[96] = PIECES.wB; gameBoard.pieces[97] = PIECES.wN; gameBoard.pieces[98] = PIECES.wR;

  db.collection("listen").doc("holder").set({
    gameBoard: gameBoard.pieces
  })
}

function updateListsMaterial () {
  //reset other lists in the gameboard
  for (let i = 0; i < 14 * 120; i++){
    gameBoard.pList[i] == PIECES.EMPTY;
  }
  for (let i = 0; i < 2; i++) {
    gameBoard.material[i] = 0;
  }
  for (let i = 0; i < 13; i++) {
    gameBoard.pceNum[i] = 0;
  }

  var piece, sq, colour;
  for (let i = 0; i < 64; i++) {
    sq = Sq120(i);
    piece = gameBoard.pieces[sq];
    if(piece != PIECES.EMPTY){ //check if there is a piece, not empty
      colour = PieceCol[piece]; //extract color
      gameBoard.material[colour] += PieceVal[piece]; //total white value & total black value
      /*gameBoard.pList[PCEINDEX(piece, gameBoard.pceNum[piece])] = sq;
        gameBoard.pceNum[piece]++;
      */
    }
  }
}

//reset the board
function resetBoard() {
  //reset the 120 board
  for (let i = 0; i < 120; i++){
    gameBoard.pieces[index] = SQUARES.OFFBOARD;
  }
  for (let i = 0; i < 64; i++){
    gameBoard.pieces[Sq120(i)] = PIECES.EMPTY;
  }

  gameBoard.side = COLOURS.BOTH;
  gameBoard.enPas = SQUARES.NO_SQ;
  gameBoard.fiftyMove = 0;
  gameBoard.ply = 0;
  gameBoard.hisPly = 0;
  gameBoard.castlePerm = 0;
  gameBoard.posKey = 0;
  gameBoard.flashSuggest = []; //indicate the available square to move in
  gameBoard.flashPiece = []; //indicate the corresponding piece of the available square
  gameBoard.beforePiece = 0; //indicate the piece clicked just now
  gameBoard.moveListStart[gameBoard.ply] = 0;
}
