// rearange letters class, to basically rearrange the letters by swapping the order.
//a get score function
//a get letters function to be able to access the letters
//sumScore is basically done, but I need information about what the board looks like
//getNewLetters function wasnt working for me at all, the basic logic for me is there, but I couldnt access letter bag, or the functions in board.js
//

class Player {

    constructor(letters, score, name) {
        this.letters = letters;
        this.score = score;
        this.name = name;
    }

    rearrangeLetters(letterArray,a,b) { //assuming letters is a list
        //a is the 'index' value of the piece in the array to be moved
        //b is the 'index' value of the target piece to be moved
        // Function to rearrange players letters
        var temp = letterArray[a];
        letterArray[a] = letterArray[b]; //simply swapping letters.
        letterArray[b] = temp;
    }

    getScore() {
        return(this.score);
    }

    getLetters(){ //return the current letters that the player has
        return(this.letters)
    }

    sumScore(string_of_letters,){ //when player places values into board, put them into a string, pass the string into this function.

    }

    const stringOfCharacters = "  EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ";
    getNewLetters() {
        // Get New letters from letter bag, the attribute is in board
        const Board = require('./board.js'); //I need to access the lettersbag attribute in board.js
        let instance = new Board();
        if((this.letters.length) < 7){ //keep adding values into
            for(var i=0; i <= 7; i++)
                console.log("in this loop");
                this.letters.push(instance.getRandomValue());
        }

    }

    skipTurn() {
        // Skip players turn
        
    }

    placeLetters(coords) { //find 
        // PLayer places letters on board
    }

    leave() {
        // PLayer leaves game
    }

}
let user = new Player(["A","B","C",18,"Norbert"]);
console.log(user.getNewLetters());
