import * as labUtils from './generateLab.js';

const nodeMatrix = labUtils.nodeMatrix;
const rawMaze = labUtils.rawMaze;
const ctx = labUtils.ctx;
const dim = labUtils.dim;
const start = nodeMatrix[0][0];
const end = nodeMatrix[rawMaze.length - 1][rawMaze.length - 1];
const pokemonImg = new Image();
window.onload = pokemonPresence();

function pokemonPresence() {
    const pokemon = JSON.parse(localStorage.getItem("pokemon"));
    if (pokemon == null) {
        backToUrl();
    }
    else {
        placePokemonAtStart(pokemon);
    }
}

function placePokemonAtStart(pokemon) {
    pokemonImg.src = pokemon.selectedImg;
    pokemonImg.onload = function () {
        ctx.drawImage(pokemonImg, 0, 0, dim, dim);
    }
}

let currentNode = { node: start, row: 0, col: 0 };

document.onkeydown = function (e) {
    switch (e.key) {
        case "ArrowUp":
            movePokemon(currentNode, "Up");
            break;
        case "ArrowDown":
            movePokemon(currentNode, "Down");
            break;
        case "ArrowLeft":
            movePokemon(currentNode, "Left");
            break;
        case "ArrowRight":
            movePokemon(currentNode, "Right");
            break;
    }
};

function movePokemon(currentNode, direction) {
    switch (direction) {
        case "Up":
            if (currentNode.node.hasNorthWall == false) {
                currentNode.node = nodeMatrix[currentNode.row - 1][currentNode.col];
                currentNode.row -= 1;
            }
            else {
                return;
            };
            break;
        case "Down":
            if (currentNode.node.hasSouthWall == false) {
                currentNode.node = nodeMatrix[currentNode.row + 1][currentNode.col];
                currentNode.row += 1;
            }
            else {
                return;
            };
            break;
        case "Left":
            if (currentNode.node.hasWestWall == false) {
                currentNode.node = nodeMatrix[currentNode.row][currentNode.col - 1];
                currentNode.col -= 1;
            }
            else {
                return;
            };
            break;
        case "Right":
            if (currentNode.node.hasEastWall == false) {
                currentNode.node = nodeMatrix[currentNode.row][currentNode.col + 1];
                currentNode.col += 1;
            }
            else {
                return;
            };
            break;
    }
    
    
    if (currentNode.node == end) {
        alert("You have found the exit!");
        labUtils.showSolution();
    }else{
        labUtils.updateMaze();
        ctx.drawImage(pokemonImg, currentNode.col * dim, currentNode.row * dim, dim, dim);
    }




}



