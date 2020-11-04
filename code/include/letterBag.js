const Piece = require("./piece");

class LetterBag {
	constructor (letterDict) {
		this.bag = [];
		//for loop to fill bag with relevant amount of pieces based on dict letters
		console.log(letterDict);
		console.log(letterDict["A"][0])
		for (var x in letterDict) {
			for (var i = 0; i < letterDict[x][1]; i++) {
				this.bag.push(new Piece(x, letterDict));
			}
		}
	}

	count () {
		return this.bag.length;
	}

	random () {
		return Math.floor(Math.random() * this.bag.length);
	}

	scramble () {
		console.log("Before scramble: " + this.bag.length);
		this.bag.forEach((piece, index) => {
			let randomIndex = this.random();
			let tmp = this.bag[randomIndex];
			this.bag[randomIndex] = piece;
			this.bag[index] = tmp;
		});
		console.log("After scramble: " + this.bag.length);
	}

	take (count = 1) {
		/*if (this.bag.length < count) {
			throw "Not enough letters in letter bag!";
		}*/
		this.scramble();
		let pieces = [];
		for (var i = 0; i < Math.min(count, this.bag.length); i++) {
			pieces.push(this.bag.pop());
		}
		return pieces;
	}

	put (letters) {
		if (typeof letters != "array") {
			throw "Invalid argument specified";
		}
		letters.forEach((piece) => {
			this.bag.push(piece);
		});
		this.scramble();
	}
}

module.exports = LetterBag;
