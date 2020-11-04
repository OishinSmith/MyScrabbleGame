var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const Game = require("./include/game");
const Board = require("./include/board");
const LetterBag = require("./include/letterBag");
const Piece = require("./include/piece");
const Player = require("./include/player");

var ignoreLimits = false;
var socketToPlayer = {};

server.listen(8000, function() {
	console.log('listening on *:8000');
});

app.get('/player', function(req, res) {
	res.sendFile(__dirname + '/mobile.html');
});

app.get('/client', function(req, res) {
	res.sendFile(__dirname + '/desktop.html'); //'/mainViewIndex.html');
});

app.use(express.static(__dirname + '/public'));

var games = {};

//dictionary of available letters to [score, count]
//if you wanted custom rules for amount of letters, edit this dictioanry
var letters = {
	"A" : [1, 9],
	"B" : [3, 2],
	"C" : [3, 2],
	"D" : [2, 4],
	"E" : [1, 12],
	"F" : [4, 2],
	"G" : [2, 3],
	"H" : [4, 2],
	"I" : [1, 9],
	"J" : [8, 1],
	"K" : [5, 1],
	"L" : [1, 4],
	"M" : [3, 2],
	"N" : [1, 6],
	"O" : [1, 8],
	"P" : [3, 2],
	"Q" : [10, 1],
	"R" : [1, 6],
	"S" : [1, 4],
	"T" : [1, 6],
	"U" : [1, 4],
	"V" : [4, 2],
	"W" : [4, 2],
	"X" : [8, 1],
	"Y" : [4, 2],
	"Z" : [10, 1]
};








function updateView (game, socket = false) {
	/*io.of(game.code).clients((error, clients) => {
		clients.forEach((client) => {
			if */
	if (socket) {
		socket.emit("onClientUpdate", game.getUpdateData());
	} else {
		io.to(game.code).emit("onClientUpdate", game.getUpdateData());
	}
}

io.on('connection', function (socket) {

	//get user type via url (probably not best way)
	/*var type = socket.handshake.headers.referer.split("/").slice(-1)[0];

	if(type == "client"){
	var gamecode = Math.random().toString(36).slice(2,7);
	socket.join(gamecode);
	games[gamecode] = new Game(gamecode);
	console.log(games);
	io.to(gamecode).emit('update gamecode', gamecode);
	}*/

	socket.on('onConnect', function (data) {
		if (data['type'] == "client") {
			let game = new Game();
			game.setLetterBag(new LetterBag(letters));
			socket.join(game.code);
			games[game.code] = game;
			console.log(game.code);
			//make list of pieces out of gamecode
			gameCodePieces = [];
			for(var i=0; i < game.code.length; i++){
				gameCodePieces.push(new Piece(game.code.charAt(i), letters))
			}
			io.to(game.code).emit('update gamecode', gameCodePieces);
		}

		if (data['type'] == "player") {
			//console.log(data);
			var name = data['name'];
			var code = data['gameCode'].toUpperCase();
			var colour = data["colour"];

			if (!games[code]) {
				io.to(socket.id).emit("onClientJoin", {success: false, message: "Invalid room ID"}); //Will only ever get sent to the player trying to connect
				return;
			} else if (!name.trim() || name.length > 12) {
				io.to(socket.id).emit("onClientJoin", {success: false, message: "Invalid name"});
				return;
			} else if (!colour.match(/^#[0-9a-fA-F]{6}$/)) {
				io.to(socket.id).emit("onClientJoin", {success: false, message: "Invalid colour"});
				return;
			} else if (games[code].players.length >= 4) {
				io.to(socket.id).emit("onClientJoin", {success: false, message: "Room full"});
				return;
			} else if (games[code].status != "waiting") {
				io.to(socket.id).emit("onClientJoin", {success: false, message: "This game has already begun"});
				return;
			}
			var newPlayer = new Player(games[code], name);
			newPlayer.colour = colour;
			socket.player = newPlayer;
			socket.join(code); //?
			io.to(code).emit("onClientJoin", {success: true, game: games[code], newPlayer: newPlayer});
		}
	});

	socket.on("everyoneReady", function (gameCode) {
		//console.log("emmitting on " + gameCode);
		if (!games[gameCode]) {
			return;
		} else if (games[gameCode].players.length < 2 && !ignoreLimits) {
			socket.emit("everyoneReady", {success: false, message: "At least two players needed to start the game"});
			return;
		}

		io.to(gameCode).emit("everyoneReady", {success: true, board: games[gameCode].board});
		games[gameCode].start();
		updateView(games[gameCode]);
	});

	socket.on('piecePlayed', function (data) {
		let game = games[data.gameCode];
		let player = socket.player;
		if (!player) {
			return; //whoa, not even a player
		} else if (!game || game.status != "running") {
			return; //nice try
		} else if (game.currentPlayer != player) {
			return; //gotta wait
		} else if (!player.hasPiece(data["letter"])) {
			return; //shame on you!
		}
		if (game.board.placePiece(new Piece(data['letter'], letters), data['x'], data['y'])) {
			player.removePiece(data["letter"]);
			updateView(game, socket) //don't care about others
		}
		io.to(data['gameCode']).emit("updateBoard", games[data['gameCode']].board);
	});

	socket.on("endTurn", function (data) {
		let player = socket.player;
		if (!player) {
			console.log("not a player");
			return;
		}
		let game = games[player.gameCode];
		if (!game || game.status != "running") {
			console.log("invalid game");
			return;
		} else if (game.currentPlayer != player) {
			console.log("not his turn");
			return;
		} else if (!game.endTurn()) { //send him back his pieces
			updateView(game);
			socket.emit("onClientMessage", {type: "error", message: "Board not in a valid state"});
		} else {
			updateView(game);
		}
	});

});


function test() {
	console.log("running tests");
	//---Tests---

	var test = {testN: 0, successN: 0, testString: ""}

	//---Piece TestCases---


	p = new Piece("a", letters);

	test.testN += 1;

	if (p.char != "A") {
		test.testString += "Error Piece char is incorrect\n";
	} else if (p.score != 1) {
		test.testString += "Error Piece score is incorrect\n";
	} else {
		test.successN += 1;
	}

	//---Board TestCases---

	b = new Board()
	console.log(b.spaceList);

	test.testN += 1;

	if (b.spaceList.length != 15) {
		test.testString += "Error Board Y dimension incorrect\n";
	} else if (b.spaceList[0].length != 15) {
		test.testString += "Error Board X dimension incorrect\n";
	} else {
		test.successN += 1;
	}

	test.testN += 1;

	//console.log(p == {char: "A", score: 1});
	b.placePiece(p, 1,5)

	if (b.spaceList[5][1].piece != p) {
		test.testString += "Error Placing Piece on Board, piece incorrect\n";
	} else {
		test.successN += 1;
	}

	//---Game Test Cases---

	testGame = new Game();

	test.testN += 1;

	if (typeof(testGame.code) != "string" || testGame.code.length != 4) {
		test.testString += "Error adding game code\n"
	} else if (testGame.players.length !== 0) {
		test.testString += "Error player list is initiated as non-empty\n";
	} else {
		test.successN += 1;
	}

	//--Player Test Cases--

	testPlayer = new Player(testGame, "John");

	test.testN += 1;

	if (testPlayer.name != "John") {
		test.testString += "Error adding player name\n"
	} else if (testPlayer.id != 1) {
		test.testString += "Error assigning ID to player\n";
	} else if (testGame.players.length != 1 || testGame.players[0] != testPlayer) {
		test.testString += "Error adding player to game\n";
	} else {
		test.successN += 1;
	}



	console.log(test.successN + " out of " + test.testN + " test(s) passed.");
	console.log(test.testString);
	return test.successN === test.testN;
};

if (process.argv[2] == "test") {
	if (test()) {
		process.exit(0);
	} else {
		process.exit(1);
	}
} else if (process.argv[2] == "ignore-limits") {
	ignoreLimits = true;
}
