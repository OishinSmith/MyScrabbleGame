const LetterBag = require("./letterBag");
const Board = require("./board");
const alpha = "ABCDEFGHJKLMNOPQRSTUVWXYZ";

class Game {
	constructor () {
		this.code = Game.generateCode();
		this.players = [];
		this.letterBag = null;
		this.status = "waiting";
		this.currentPlayer = null;
		this.newPieces = [];
		//maybe allow changing board dimensions in settings?
		this.board = new Board();
		//console.log("game created", gamecode);
		//console.log(this.letterBag);
	}

	static generateCode () {
		let code = "";
		for (var i = 0; i < 4; i++) {
			code += alpha[Math.floor(Math.random()*alpha.length)];
		}
		return code;
	}

	addPlayer (player) {
		let id = 1;
		this.players.forEach((player) => {
			if (player.id >= id) {
				id = player.id + 1;
			}
		});
		player.id = id;
		this.players.push(player);
	}

	endTurn () {
		let result = this.board.validate();
		if (Array.isArray(result)) {
			this.currentPlayer.fillRack(result);
			return false;
		}
		//good? Let him have his points..
		this.currentPlayer.giveScore(result.newWordSpaces);
		console.log(this.currentPlayer.name, " score: ", this.currentPlayer.score)
		this.currentPlayer.fillRack(this.letterBag);
		let currID = this.currentPlayer.id;
		let nextPlayer = false;
		this.players.forEach((player) => {
			if (player.id > currID) {
				nextPlayer = player; //got our winner!
				return;
			}
		});
		this.currentPlayer = nextPlayer ? nextPlayer : this.players[0];
		return true;
	}

	getUpdateData () {
		let data = {
			status: this.status,
			players: this.players,
			currentPlayer: this.currentPlayer.id,
			letterCount: this.letterBag.count(),
			board: this.board
		};
		return data;
	}

	setLetterBag (letterBag) {
		if (letterBag.constructor.name != "LetterBag") {
			throw "Invalid letterbag";
		} else {
			this.letterBag = letterBag;
			console.log(this.letterBag);
			this.letterBag.scramble();
			console.log(this.letterBag);
		}
	}

	start () {
		this.players.forEach((player) => {
			player.fillRack(this.letterBag);
		});
		this.status = "running";
		this.currentPlayer = this.players[0]; //could make it random
	}
}

module.exports = Game;
