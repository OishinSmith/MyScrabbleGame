// Game class skeleton

class Game {

    constructor(id, code, owner, slots, playersJoined) {
        this.id = id;
        this.code = code;
        this.owner = owner;
        this.slots = slots;
        this.playersJoined = playersJoined;
    }

    dealLetters() {
        // Function which hands out random letters to each player
    }

    validateWords() {
        // Function which checks if words are valid
    }

    gatherScores() {
        // Function to collect scores of users
    }

    calculateScore(player) {
        // Function to calculate a players score
    }

}