const hexToHsl = require('hex-to-hsl');

class Player {
	constructor (game, name) {
		game.addPlayer(this);
		this.gameCode = game.code; //why not make it 2 way
		this.name = name;
		this.rack = [];
		this.score = 0;
	}

	set colour (hex) {
		this.textColour = Player.getTextColour(hex);
		this.bgColour = hex;
		return true;
	}

	static getTextColour (hex) {
		let hsl = hexToHsl(hex);
		if (hsl[2] > 120) {
			return "#000";
		} else {
			return "#fff";
		}
	}

	hasPiece (letter) {
		for (let i = 0; i < this.rack.length; i++) {
			if (this.rack[i].char == letter) {
				return true;
			}
		}
		return false;
	}

	fillRack (letterBag) {
		if (Array.isArray(letterBag)) { //returning pieces
			letterBag.forEach((piece) => {
				this.rack.push(piece);
			});
		} else {
			let toFill = 7 - this.rack.length;
			letterBag.take(toFill).forEach((piece) => {
				this.rack.push(piece);
			});
		}
	}

	removePiece (letter) {
		let newRack = [];
		console.log(this.rack);
		for (let i = 0; i < this.rack.length; i++) {
			console.log(this.rack[i].char + " / " + letter);
			if (this.rack[i].char == letter) {
				this.rack = newRack.concat(this.rack.splice(i+1));
				return;
			} else {
				newRack.push(this.rack[i]);
			}
		}
		console.log(this.rack);
	}

	giveScore(spaceList){
		var total = 0;
		var mults = []
		console.log(spaceList)
		for(var outerIndex in spaceList){
			for(var sIndex in spaceList[outerIndex]){
				var tempScore = spaceList[outerIndex][sIndex].piece.score;
				if(spaceList[outerIndex][sIndex].multiplier == "dl"){
					tempScore = tempScore * 2;
				}
				else if(spaceList[outerIndex][sIndex].multiplier == "tl"){
					tempScore = tempScore * 3;
				}
				else if(spaceList[outerIndex][sIndex].multiplier == "tw"){
					mults.push("tw")
				}
				else if(spaceList[outerIndex][sIndex].multiplier == "dw"){
					mults.push("dw")
				}
				total = total + tempScore
			}
		}
		for(var i in mults){
			if(mults[i] == "tw"){
				total = total * 3

			}
			else if(mults[i] == "dw"){
				total = total * 2
			}
			else if(mults[i] == "st"){
				total = total * 2
			}
		}
		console.log("gained points: ", total);

		this.score = this.score + total;
	}
}

module.exports = Player;
