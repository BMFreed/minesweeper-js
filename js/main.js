import { Board } from "./Board.js";

let difficulty;
let board;
const difficultySelect = document.querySelector(".difficulty-wrapper");
const gameSection = document.querySelector(".game-wrapper");
const difficulties = document.querySelectorAll(".difficulty-select > li > button");

difficulties.forEach(function (item) {
    item.addEventListener("click", function () {
        difficulty = item.id;
        difficultySelect.classList.toggle("hidden");
        gameSection.classList.toggle("hidden");
        board = new Board(difficulty);
    });
});
