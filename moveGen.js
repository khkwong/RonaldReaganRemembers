var PawnTable = [
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
10	,	10	,	0	,	-10	,	-10	,	0	,	10	,	10	,
5	,	0	,	0	,	5	,	5	,	0	,	0	,	5	,
0	,	0	,	10	,	20	,	20	,	10	,	0	,	0	,
5	,	5	,	5	,	10	,	10	,	5	,	5	,	5	,
10	,	10	,	10	,	20	,	20	,	10	,	10	,	10	,
20	,	20	,	20	,	30	,	30	,	20	,	20	,	20	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0
];


var KnightTable = [
0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
0	,	0	,	0	,	5	,	5	,	0	,	0	,	0	,
0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0
];

var BishopTable = [
0	,	0	,	-10	,	0	,	0	,	-10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0
];

var RookTable = [
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0
];

var BishopPair = 40;

function countEachPiece (piece){
  gameBoard.pList = [];
  let count = 0;
  for (let i = 21; i <= 98; i++) {
    if (gameBoard.pieces[i] == piece) {
      count++;
      gameBoard.pList.push(i);

    }
  }
  return count;
}

function EvalPosition() {
	var score = 0;

	var pce;
	var sq;

	pce = PIECES.wP;
  for (let i = 0; i < countEachPiece(1); i++) {
		sq = gameBoard.pList[i];
		score += PawnTable[MIRROR64(Sq64(sq))];
	}
	pce = PIECES.bP;
	for(let i = 0; i < countEachPiece(7); i++) {
		sq = gameBoard.pList[i];
    score -= PawnTable[(Sq64(sq))];
	}

	pce = PIECES.wN;
	for(let i = 0; i < countEachPiece(2); i++) {
		sq = gameBoard.pList[i];
		score += KnightTable[MIRROR64(Sq64(sq))];
	}

	pce = PIECES.bN;
	for (let i = 0; i < countEachPiece(8); i++) {
		sq = gameBoard.pList[i];
		score -= KnightTable[Sq64(sq)];
	}

	pce = PIECES.wB;
	for(let i = 0; i < countEachPiece(3); i++) {
		sq = gameBoard.pList[i];
		score += BishopTable[MIRROR64(Sq64(sq))];
	}

	pce = PIECES.bB;
	for(let i = 0; i < countEachPiece(9); i++) {
		sq = gameBoard.pList[i];
		score -= BishopTable[Sq64(sq)];
	}

	pce = PIECES.wR;
	for(let i = 0; i < countEachPiece(4); i++) {
		sq = gameBoard.pList[i];
		score += RookTable[MIRROR64(Sq64(sq))];
	}

	pce = PIECES.bR;
	for(let i = 0; i < countEachPiece(10);i++) {
		sq = gameBoard.pList[i];
		score -= RookTable[Sq64(sq)];
	}

	pce = PIECES.wQ;
	for(let i = 0; i < countEachPiece(5);i++) {
		sq = gameBoard.pList[i];
		score += RookTable[MIRROR64(Sq64(sq))];
	}

	pce = PIECES.bQ;
	for (let i = 0; i < countEachPiece(11); i++) {
		sq = gameBoard.pList[i];
		score -= RookTable[Sq64(sq)];
	}

	if(gameBoard.pceNum[PIECES.wB] >= 2) {
		score += BishopPair;
	}

	if(gameBoard.pceNum[PIECES.bB] >= 2) {
		score -= BishopPair;
	}

	if(gameBoard.player == 0) {
		return score;
	} else {
		return -score;
	}

}
