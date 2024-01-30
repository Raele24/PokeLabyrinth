import * as labUtils from './generateLab.js';

const nodeMatrix = labUtils.nodeMatrix;
const rawMaze = labUtils.rawMaze;
const solution = labUtils.solution;
const canvas = labUtils.canvas;
const ctx = labUtils.ctx;
const dim = labUtils.dim;

function pokemonPresence() {
    const pokemon = JSON.parse(localStorage.getItem("pokemon"));
    if (pokemon == null) {
        alert("No pokemon selected");
        window.location.href = "index.html";
    }
    else {
        placePokemonAtStart(pokemon);
    }
}

function placePokemonAtStart(pokemon) {
     const start = nodeMatrix[0][0];
     const end = nodeMatrix[rawMaze.length - 1][rawMaze.length - 1];
     const pokemonImg = new Image();
     pokemonImg.src = pokemon.gif;
     pokemonImg.onload = function () {
         ctx.drawImage(pokemonImg,0,0, dim , dim);
     }
}

//window.onload = pokemonPresence();