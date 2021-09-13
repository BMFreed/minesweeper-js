import { Tile } from "./Tile.js";

export class Board {
    #board;
    #boardSize;
    #numberOfMines;
    #tiles = [];
    #config = {
        easy: {
            boardSize: 8,
            numberOfMines: 8,
        },
        medium: {
            boardSize: 10,
            numberOfMines: 16,
        },
        hard: {
            boardSize: 15,
            numberOfMines: 60,
        },
    };
    constructor(difficulty) {
        this.configureBoard(difficulty);
        this.initiateBoard();
        this.populateBoard();
        this.plantMines();
        this.numberTiles();
    }

    get conditions() {
        return `На сложности ${this.difficulty} доска будет размером ${this.#boardSize} на ${
            this.#boardSize
        } тайлов и будет содержать в себе ${this.#numberOfMines} мин`;
    }

    initiateBoard() {
        this.#board = document.querySelector(".board");
        this.#board.style.setProperty("--size", this.#boardSize);
    }

    configureBoard(difficulty) {
        const level = this.#config[difficulty];
        this.#boardSize = level.boardSize;
        this.#numberOfMines = level.numberOfMines;
    }

    getNumberOfTiles() {
        return Math.pow(this.#boardSize, 2);
    }

    populateBoard() {
        for (let i = 0; i < this.getNumberOfTiles(); i++) {
            const tile = new Tile(i);
            this.#tiles.push(tile);
        }

        for (let i = 0; i < this.#tiles.length; i++) {
            const tileElement = this.#tiles[i].renderDOM();
            this.#board.appendChild(tileElement);
        }
    }

    getMinePositions() {
        let minePositions = [];
        do {
            let position = Math.floor(Math.random() * this.getNumberOfTiles());
            if (!minePositions.includes(position)) {
                minePositions.push(position);
            }
        } while (minePositions.length < 8);
        return minePositions;
    }

    plantMines() {
        const minePositions = this.getMinePositions();
        console.log(minePositions);
        for (let i = 0; i < this.#tiles.length; i++) {
            for (let j = 0; j < minePositions.length; j++) {
                if (this.#tiles[i].id === minePositions[j]) {
                    this.#tiles[i].mineTile();
                }
            }
        }
    }

    numberTiles() {}
}
