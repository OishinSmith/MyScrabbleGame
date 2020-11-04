
class Piece {
	constructor (char, letters) {
		char = char.toString();
		char = char.toUpperCase();
		this.char = char;
		//console.log(letters[char]);
		this.score = letters[char][0];
	}

	equals(other){
		return(other.char == this.char)
	}

}

module.exports = Piece;
