const request = require('request');
var checkWord = require('check-word');

class Board {
	//create the spacelist with nested for loops, had to be done inefficient way to avoid shallow copies of list
	constructor () {
		this.spaceList = [];
		this.newPieces = [];
		this.wordSpaces = [];
		this.fillSpaceList(this.spaceList);
		//console.log(this.spaceList);
	}

	placePiece (piece, x, y) {
		if (this.spaceList[y][x].piece) {
			return false;
		}
		this.spaceList[y][x].piece = piece;
		this.newPieces.push([y, x]);
		return true;
	}

	removePiece(x,y){
		if (this.spaceList[y][x].piece == null) {
			return false;
		}
		this.spaceList[y][x].piece = null;
		return true;
	}

	validateWords(words) {

		for(var i = 0; i < words.length; i++)
		{
			var word = checkWord('en');
			var wordToCheck = words[i].toLowerCase();

			var valid = word.check(wordToCheck);

			if(!valid)
			{
				console.log(wordToCheck + " Is NOT valid");
				return false;
			}
		}

		return true;

	}

	gatherWords() {
		var board = this.spaceList;
		let list_of_new_words = [];

		// GRAB ALL WORDS ON THE HORIZONTAL
		for (var i=0; i < board.length; i++)
		{
			var word = "";
			for (var j=0; j < board.length; j++)
			{
				try {
					var current_square = board[i][j].piece.char;
					var current_multiplier = board[i][j].multiplier;

					word = word + current_square;
				}
				catch(err)
				{

					if(word != "" && word.length > 1)
					{
						list_of_new_words.push(word);
					}
					word = "";
					continue;
				}
			}
		}

		// GRAB ALL WORDS ON THE VERTICAL
		for(var i = 0; i < board.length; i++)
		{
			var word = "";
			for(var j = 0; j < board.length; j++)
			{
				try {
					var current_square = board[j][i].piece.char;
					var current_multiplier = board[j][i].multiplier;

					word = word + current_square;

				} catch(err) {

					if(word != "" && word.length > 1)
					{
						list_of_new_words.push(word);
					}
						word = "";
						continue;
					}
				}
			}

		return list_of_new_words;
	}

	spacesEqual(x,y){
		return(x.piece.equals(y.piece));
	}

	spaceListEqual(x,y){
		if(x.length != y.length){
			return false
		}

		for(var i = 0; i < x.length; i++){
			if(!this.spacesEqual(x[i], y[i])){
				return false
			}
		}
		return true
	}

	containsCoord(coordList, x, y){

		for (var i=0; i < coordList.length; i++){
			if((x == coordList[i].x) && (y == coordList[i].y)){
				return true;
			}
		}
		return false
	}

	createPieceCoords(x,y,coordList){
		//console.log("visiting", x, y);
		if(this.containsCoord(coordList, x, y)){
			return;
		}
		else if((0 <= x && x <= 14) && (0 <= y && y <= 14) && this.spaceList[y][x].piece){
		//anticlockwise, starting down
			coordList.push({x:x, y:y});
			this.createPieceCoords(x,y+1, coordList);
			this.createPieceCoords(x+1,y, coordList);
			this.createPieceCoords(x,y-1, coordList);
			this.createPieceCoords(x-1,y, coordList);
		}
		else{
			return;
		}

	}

	removeFromPieceAlone(p){
		for(var yIndex in this.spaceList){
			for(var xIndex in this.spaceList[yIndex]){
				if(this.spaceList[yIndex][xIndex].piece == p){
					this.removePiece(xIndex, yIndex);
					return;
				}
			}
		}
	}

	amountOfWordsPieceIsIn(p){
		var count = 0
		for(var index1 in this.wordSpaces){
			for(var index2 in this.wordSpaces[index1]){
				for(var index3 in this.wordSpaces[index1][index2]){
					if(this.wordSpaces[index1][index2][index3] == p){
						count = count + 1
					}
				}
			}
		}
		return count
	}

	getInvalidPieces(coordList){
		var invalidPieces = []
		var valid = true;
		for(var yIndex in this.spaceList){
				for(var xIndex in this.spaceList[yIndex]){
					if(this.spaceList[yIndex][xIndex].piece){
						if(!this.containsCoord(coordList, xIndex, yIndex)){
							invalidPieces.push(this.spaceList[yIndex][xIndex].piece)
							this.removePiece(xIndex, yIndex);
						}
					}
				}
		}
		return invalidPieces;
	}

	generateWordList(){
			var wl = []
			var wordSpaces = []
			for(var yIndex = 0; yIndex < this.spaceList.length; yIndex++){
				for(var xIndex = 0; xIndex < this.spaceList[yIndex].length; xIndex++){
					var word = ""
					var wordSpaceSet = []
					while((xIndex < 15) && this.spaceList[yIndex][xIndex].piece){
						word = word + this.spaceList[yIndex][xIndex].piece.char;
						wordSpaceSet.push(this.spaceList[yIndex][xIndex])
						xIndex = xIndex + 1
					}

					if(!(word == "") && word.length > 1){
						wl.push(word);
					}

					if(wordSpaceSet.length > 1){
						wordSpaces.push(wordSpaceSet);
					}
				}
			}

			for(var xIndex = 0; xIndex < this.spaceList.length; xIndex++){
				for(var yIndex = 0; yIndex < this.spaceList.length; yIndex++){
					var word = ""
					var wordSpaceSet = []
					while((yIndex < 15) && this.spaceList[yIndex][xIndex].piece){
						word = word + this.spaceList[yIndex][xIndex].piece.char;
						wordSpaceSet.push(this.spaceList[yIndex][xIndex])
						yIndex = yIndex + 1
					}

					if(!(word == "") && word.length > 1){
						wl.push(word)
					}

					if(wordSpaceSet.length > 1){
						wordSpaces.push(wordSpaceSet);
					}
				}
			}


			var newWordSpaces = []

			for(var index1 in wordSpaces){
				var contains = false
				for(var index2 in this.wordSpaces){
					if(this.spaceListEqual(wordSpaces[index1], this.wordSpaces[index2])){
						contains = true;
					}
				}
				if(!contains){
					newWordSpaces.push(wordSpaces[index1])
				}
			}





			return {wordlist:wl, wordSpaces : wordSpaces, newSpaces : newWordSpaces}
		}


	validate () {
		var valid = true
		//word validation
		this.newPieces = [];
		var pieceCoordList = [];
		this.createPieceCoords(7,7,pieceCoordList);

		var invalidlist = this.getInvalidPieces(pieceCoordList)
		var wordresult = this.generateWordList();
		var validwords = this.validateWords(wordresult.wordlist);
		console.log("VALID WORD? ", validwords);

		console.log("newWords:");
		//this is just to log the new Words list properly for testing, can delete if want
		for(var i in wordresult.newSpaces){
			for(var j in wordresult.newSpaces[i]){
				console.log(wordresult.newSpaces[i][j])
			}
			console.log("------");
		}

		this.wordSpaces = wordresult.wordSpaces

		console.log("invalid beforre", invalidlist)
		if(!validwords){
			for(var i in wordresult.newSpaces){
				for(var j in wordresult.newSpaces[i]){
					console.log(wordresult.newSpaces[i][j].piece, this.amountOfWordsPieceIsIn(wordresult.newSpaces[i][j].piece))
					if(this.amountOfWordsPieceIsIn(wordresult.newSpaces[i][j].piece) <= 1){
						invalidlist.push(wordresult.newSpaces[i][j].piece)
					}
				}
				console.log("invalidAfter", invalidlist)
			}
			for(var i in invalidlist){
				this.removeFromPieceAlone(invalidlist[i]);
			}
			return invalidlist;
		}
		if(invalidlist.length > 0){
			return invalidlist;
		}
		return {newWordSpaces: wordresult.newSpaces}

	}


	//this is a function to put all the multipliers in right place, (basically just a load of if statements, quite messy)
	fillSpaceList(sl){
		var dimX = 15
		var dimY = 15
		for (var i = 0; i<dimY ; i++){
			var template = [];
			for (var j = 0; j < dimX; j++){
				//outer edge
				if((j == 0) || (i == 0) || (j == dimX - 1) || (i == dimY - 1)){
					if(j==i || j == dimY - 1 - i || i == 7 || j == 7){
						template.push({piece: null, multiplier: "tw"})
					}
					else if (i == 3 || i == dimY - 4 || j == 3 || j == dimX - 4){
						template.push({piece: null, multiplier: "dl"})
					}
					else{
						template.push({piece: null, multiplier: null})
					}
				}
				// middle
				else if( i == Math.floor(dimX/2) && j == Math.floor(dimX/2) ){
					template.push({piece: null, multiplier: "st"})
				}
				//diagonals
				else if( ((j == i)||(j == dimY - i - 1)) && ( 0 < i < 5 || (dimY - 5) < i < (dimY - 1)) ){
					if( i == 5 || i == 9){
						template.push({piece: null, multiplier: "tl"})
					}
					else if( i == 6 || i == 8){
						template.push({piece: null, multiplier: "dl"})
					}
					else{
					template.push({piece: null, multiplier: "dw"})
					}
				}

				else if([1,5,9,13].indexOf(j) >= 0 && [1,5,9,13].indexOf(i) >= 0){
					template.push({piece: null, multiplier: "tl"})
				}
				else if([2,6,8,12].indexOf(j) >= 0 && [2,6,8,12].indexOf(i) >= 0){
					template.push({piece: null, multiplier: "dl"})
				}
				else if([3,7,11].indexOf(j) >= 0 && [3,7,11].indexOf(i) >= 0){
					template.push({piece: null, multiplier: "dl"})
				}
				else{
					template.push({piece: null, multiplier: null})
				}
				//Don't use an actual Piece if there is none + object is better than an array (for readability only)
			}
			this.spaceList.push(template);
		}

	}
}

module.exports = Board;
