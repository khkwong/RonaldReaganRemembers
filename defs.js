const PIECES = { EMPTY : 0, wP : 1, wN : 2, wB : 3, wR : 4, wQ : 5, wK : 6, bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12 };
//conventioanalize rank 0-7
var RANKS = { RANK_1:0, RANK_2:1, RANK_3:2, RANK_4:3, RANK_5:4, RANK_6:5 ,RANK_7:6, RANK_8:7, RANK_NONE: 8};
//bottom header (a-h)
var FILES = { FILE_A:0, FILE_B:1,FILE_C:2, FILE_D:3,FILE_E:4, FILE_F:5,FILE_G:6, FILE_H:7, FILE_NONE:8};
//white & black square
var COLOURS = { WHITE:0, BLACK:1, BOTH:2};
//value for the border squares
var SQUARES = {
A8:21, B8:22, C8:23, D8:24, E8:25, F8:26, G8:27, H8:28,
A1:91, B1:92, C1:93, D1:94, E1:95, F1:96, G1:97, H1:98,
NO_SQ:99, OFFBOARD: 100
};
var BOOL = { FALSE:0, TRUE:1 };

//used to qunatize moves for AI
var maxGameMoves = 2048;
var maxPositionMoves = 256;
var maxDepth = 64;

//castle values
var CASTLEBIT = { WKCA : 1, WQCA : 2, BKCA : 4, BQCA : 8 };

//arrays for both (a-f) and (1-8)
var filesBrd = new Array(120);
var ranksBrd = new Array(120);

var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ]; //non-pawn
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ]; //queen or PieceRookQueen
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ]; //bishop or knight
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ]; //value of pawn (100), knight & bishop (325), rook (550), queen (1000)
var PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
	COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ];

var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
var PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
var PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];

//used for SqBlocked()
var KnDir = [-8, -19, -21, -12, 8, 19, 21, 12];
var RkDir = [-1, -10, 1, 10];
var BiDir = [-9, -11, 11, 9];
var KiDir = [-1, -10, 1, 10, -9, -11, 11, 9]; //used for queen too
var movedList = new Array(8); //if moved list for both white and black pawns
function wpMoved (sq){
  for (let i = 0; i < 8; i++) {
    movedList[i] = 81 + i;
    if(movedList[i] == sq){
      //return false if haven't moved
      return false;
    }
  }
  return true;
}
function bpMoved (sq){
  for (let i = 0; i < 8; i++) {
    movedList[i] = 31 + i;
    if(movedList[i] == sq){
      //return false if haven't moved
      return false;
    }
  }
  return true;
}

var PieceKeys = new Array(14 * 120);
var SideKey;
var CastleKeys = new Array(16);

//interchange between 2 boards
var Sq120To64 = new Array(120);
var Sq64To120 = new Array(64);

//converts the html piece value into PIECES object reference
function convertPieceHtml(piece){
  switch (piece) {
		case 0: return ''; break;
    case 1: return '&#9817;'; break;
    case 2: return '&#9816;'; break;
    case 3: return '&#9815;'; break;
    case 4: return '&#9814;'; break;
    case 5: return '&#9813;'; break;
    case 6: return '&#9812;'; break;
    case 7: return '&#9823;'; break;
    case 8: return '&#9822;'; break;
    case 9: return '&#9821;'; break;
    case 10: return'&#9820;'; break;
    case 11: return '&#9819;'; break;
    case 12: return '&#9818;'; break;
    default: console.log("fail");
  }
}

//calculate the value the specific square has
function calcSquare(column,row) {
  return (21 + column + row * 10); //0 based
}

//convert 120 board value to 64 board value
function Sq64(Sq120) {
 let k = 63 - (98 - Sq120) + Math.floor((98 - Sq120) / 10) * 2;
 k = k <= 64 ? k : 1000;
 return k;
}

//convert 64 board value to 120 baord value
function Sq120(Sq64) {
  let v = Sq64 + 21 + (Math.floor(Sq64 / 8) * 2);
  v = v<= 120 ? v : 1000;
  return v;
}
