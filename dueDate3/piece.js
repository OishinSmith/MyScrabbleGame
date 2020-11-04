// Piece class skeleton
// I couldnt get dictionaries to work, So i just used a butt load of IF statements
//I also got a "getWords function" working, it basically finds all words in a matrix. Its a bit buggy though, was working on it at 4am
//
class Piece {

    //_score;
    //character;
    constructor(character, score) {
        this.character = character;
        this._score = score;
    }
    

    getScore() { //you would use this to get the score(value) of the letter 
        if("EAIONRTLSU".includes(this.character)) {return 1}
        else if("DG".includes(this.character)) {return 2}
        else if("BCMP".includes(this.character)) {return 3}
        else if("FHVWY".includes(this.character)) {return 4}
        else if("K".includes(this.character)) {return 5}
        else if("JX".includes(this.character)) {return 8}
        else if("QZ".includes(this.character)) {return 10}
        else {return 0}

        //var chars;
        //chars = this.character; //tried this for dictiionaries
        //return(letterScoreDict.chars);
    }


    getAllWords() { //I dont know where to put this function
        var board=["1111CAR22234222",
                   "333RATTTTTTTT44",
                   "1111T1111111111",
                   "111111111111111",
                   "222222222222222"]; //example board (still not sure what itll look like)
    
        var list_of_words = [];
        for(var i=0; i<board.length;i++){ //check horizontal words
            var string = "";
            for(var j=0;j<board[i].length;j++)
              if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(board[i][j])){
                string = string + board[i][j];
            }
            if(string.length > 1){
            list_of_words.push(string);
            }
        }
        for(var i=0; i<board[0].length;i++){ //check vertical
            var string = "";
            for(var j=0;j<board.length;j++){
                if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(board[j][i])){
                string = string + board[j][i];
                
                }
        }
        if(string.length > 1){
             list_of_words.push(string);
        }
    } 
    return(list_of_words);
  }

}

let user = new Piece("Q");
user.getScore();
user.getAllWords();
test = user.getAllWords();
console.log(test);


var letterScoreDict = { //dictionaries didnt seem to work tbh
    " " : 0,
    "E" : 1,
    "A" : 1,
    "I" : 1,
    "O" : 1,
    "N" : 1,
    "R" : 1,
    "T" : 1,
    "L" : 1,
    "S" : 1,
    "U" : 1,
    "D" : 2,
    "G" : 2,
    "B" : 3,
    "C" : 3,
    "M" : 3,
    "P" : 3,
    "F" : 4,
    "H" : 4,
    "V" : 4,
    "W" : 4,
    "Y" : 4,
    "K" : 5,
    "J" : 8,
    "X" : 8,
    "Q" : 10,
    "Z" : 10,
}