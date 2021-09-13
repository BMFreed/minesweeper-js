export class Tile {
    #tile;
    #states = {
        hidden: true,
        flagged: false,
        mined: false,
    };

    constructor(id) {
        this.#tile = document.createElement("div");
        this.id = id;
    }
    mineTile() {
        this.#states.mined = true;
    }

    renderDOM() {
        this.#tile.id = this.id;
        this.#tile.className = "tile";
        return this.#tile;
    }
}
