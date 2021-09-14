import { Tile } from "./Tile.js";

export class Board {
    #board;
    #boardSize;
    #numberOfMines;
    #tiles = [];
    #remaining;
    face;
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
    outcome = "ongoing";
    constructor(difficulty) {
        this.#configureBoard(difficulty);
        this.#initiateBoard();
        this.#populateBoard();
        this.#plantMines();
        this.#renderTileNumbers();
        this.#startGame();
        this.#revealTiles();
        this.#handleFace();
    }

    get conditions() {
        return `На сложности ${this.difficulty} доска будет размером ${this.#boardSize} на ${
            this.#boardSize
        } тайлов и будет содержать в себе ${this.#numberOfMines} мин`;
    }

    #initiateBoard() {
        this.#board = document.querySelector(".board");
        this.#board.style.setProperty("--size", this.#boardSize);
    }

    #configureBoard(difficulty) {
        const level = this.#config[difficulty];
        this.#boardSize = level.boardSize;
        this.#numberOfMines = level.numberOfMines;
    }

    getNumberOfTiles() {
        return Math.pow(this.#boardSize, 2);
    }

    #populateBoard() {
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
        } while (minePositions.length < this.#numberOfMines);
        return minePositions;
    }

    #plantMines() {
        const minePositions = this.getMinePositions();
        for (let i = 0; i < this.#tiles.length; i++) {
            for (let j = 0; j < minePositions.length; j++) {
                if (this.#tiles[i].id === minePositions[j]) {
                    this.#tiles[i].mineTile();
                }
            }
        }
    }

    scanNeighbourTiles(i) {
        const neighbourTiles = [];
        const neighbourTileIds = [
            i + 1,
            i - 1,
            i + this.#boardSize,
            i - this.#boardSize,
            i + 1 + this.#boardSize,
            i + 1 - this.#boardSize,
            i - 1 + this.#boardSize,
            i - 1 - this.#boardSize,
        ];

        //Крайняя левая плитка
        if (i % this.#boardSize === 0) {
            delete neighbourTileIds[1];
            delete neighbourTileIds[6];
            delete neighbourTileIds[7];
        }

        //Крайняя правая плитка
        if ((i + 1) % this.#boardSize === 0) {
            delete neighbourTileIds[0];
            delete neighbourTileIds[4];
            delete neighbourTileIds[5];
        }

        //Крайняя верхняя плитка
        if (i < this.#boardSize) {
            delete neighbourTileIds[3];
            delete neighbourTileIds[5];
            delete neighbourTileIds[7];
        }

        //Крайняя нижняя плитка
        if (i > this.getNumberOfTiles() - this.#boardSize) {
            delete neighbourTileIds[2];
            delete neighbourTileIds[4];
            delete neighbourTileIds[6];
        }

        for (let i = 0; i < neighbourTileIds.length; i++) {
            if (this.#tiles[neighbourTileIds[i]]) {
                neighbourTiles.push(this.#tiles[neighbourTileIds[i]]);
            }
        }
        return neighbourTiles;
    }

    #renderTileNumbers() {
        for (let i = 0; i < this.#tiles.length; i++) {
            if (this.#tiles[i].isMined()) {
                const neighbourTiles = this.scanNeighbourTiles(i);
                for (let n = 0; n < neighbourTiles.length; n++) {
                    neighbourTiles[n].assignNumber();
                }
            }
        }
    }

    #startGame() {
        this.#board.addEventListener("click", (event) => {
            if (event.target.classList.contains("tile")) {
                this.#tiles[event.target.id].click();
                this.#revealTiles(
                    event.target,
                    event.target.id,
                    event.target.innerText,
                    this.#tiles[event.target.id].isMined(),
                    this.#tiles[event.target.id].isClicked()
                );
            }
            this.#loseHandler(event.target.dataset.mined, event.target.dataset.clicked);
            this.#winHandler();
            this.#handleFace();
        });
        this.#board.addEventListener("contextmenu", (event) => {
            if (event.target.classList.contains("tile")) {
                event.preventDefault();
                this.#tiles[event.target.id].flag();
            }
        });
    }

    #revealTiles(tile, id, numbered, mined, clicked) {
        if (tile && !numbered && !mined && clicked) {
            let clickableTiles = [];
            const neighbourTiles = this.scanNeighbourTiles(parseInt(id));
            this.revealNearbyNumbers(neighbourTiles);
            clickableTiles = this.getClickableTiles(neighbourTiles);
            for (let i = 0; i < clickableTiles.length; i++) {
                if (clickableTiles.length > 0) {
                    clickableTiles[i].click();
                    this.#revealTiles(
                        clickableTiles[i],
                        clickableTiles[i].id,
                        clickableTiles[i].innerText,
                        clickableTiles[i].isMined(),
                        clickableTiles[i].isClicked()
                    );
                }
            }
        }
    }

    revealNearbyNumbers(neighbourTiles) {
        for (let i = 0; i < neighbourTiles.length; i++) {
            if (neighbourTiles[i].number > 0) {
                neighbourTiles[i].click();
            }
        }
    }

    getClickableTiles(neighbourTiles) {
        const clickableTiles = [];
        for (let i = 0; i < neighbourTiles.length; i++) {
            if (
                neighbourTiles[i] &&
                !neighbourTiles[i].isMined() &&
                !neighbourTiles[i].isClicked() &&
                neighbourTiles[i].number === 0
            ) {
                clickableTiles.push(neighbourTiles[i]);
            }
        }
        return clickableTiles;
    }

    #audio(name) {
        let audio = new Audio();
        audio.src = `audio/${name}.mp3`;
        audio.play();
    }

    #handleFace() {
        this.face = document.querySelector(".face");
        const clickableTiles = this.getNumberOfTiles() - this.#numberOfMines;
        const winRatio = this.#remaining / clickableTiles;
        if (winRatio < 0.5 && winRatio > 0) {
            this.face.src = "img/almost_win.png";
        }
        if (this.outcome === "win") {
            this.face.src = "img/win.png";
        }
        if (this.outcome === "lose") {
            this.face.src = "img/lose.png";
        }
    }

    #winHandler() {
        this.#remaining = 0;
        for (let i = 0; i < this.#tiles.length; i++) {
            if (this.#tiles[i].isNeedsToBeOpened()) {
                this.#remaining++;
            }
        }
        if (this.#remaining === 0) {
            this.outcome = "win";
            this.#audio("win");
            setTimeout(function () {
                alert("Вы победили!");
                window.location.reload();
            }, 300);
        }
    }

    #loseHandler(mined, clicked) {
        if (mined && clicked) {
            this.outcome = "lose";
            this.#audio("lose");
            setTimeout(function () {
                alert("П О Т Р А Ч Е Н О");
                window.location.reload();
            }, 300);
        }
    }
}
