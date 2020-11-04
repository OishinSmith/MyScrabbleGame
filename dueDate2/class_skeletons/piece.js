// Piece class skeleton

class Piece {

    _score;
    character;

    constructor(character, score) {
        this.character = character;
        this._score = score;
    }


    get getScore() {
        return this._score;
    }

    set setScore(value) {
        this._score = value;
    }
}