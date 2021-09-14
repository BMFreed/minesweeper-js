export class Tile {
    #tile;
    #states = {
        clicked: false,
        flagged: false,
        mined: false,
    };
    number = 0;

    constructor(id) {
        this.#tile = document.createElement("div");
        this.id = id;
    }
    mineTile() {
        this.#states.mined = true;
        this.#tile.dataset.mined = "mined";
    }

    isMined() {
        return this.#states.mined;
    }

    assignNumber() {
        if (!this.#states.mined) {
            this.number += 1;
            this.#tile.innerText = this.number;
        }
    }

    renderDOM() {
        this.#tile.className = "tile";
        this.#tile.id = this.id;
        return this.#tile;
    }

    click() {
        if (!this.#states.flagged) {
            this.#states.clicked = true;
            this.#tile.dataset.clicked = "clicked";
        }
    }

    isClicked() {
        return this.#states.clicked;
    }

    isNeedsToBeOpened() {
        if (!this.#states.mined && !this.#states.clicked) {
            return true;
        }
    }

    flag() {
        if (!this.#states.clicked) {
            this.#states.flagged = !this.#states.flagged;
        }
        if (this.#states.flagged) {
            this.#tile.dataset.flagged = "flagged";
        } else {
            this.#tile.removeAttribute("data-flagged");
        }
    }

    isFlagged() {
        return this.#states.flagged;
    }
}
