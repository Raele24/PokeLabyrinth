import * as algernon from "https://cdn.jsdelivr.net/npm/algernon-js/dist/algernon.js";

const nCells = 10   //lab size
const [rows, cols] = [nCells, nCells];
const rawMaze = algernon.generateBacktrackingRaw(rows, cols);
const solution = algernon.solveAStarRaw(rawMaze, [0, 0], [rows - 1, cols - 1]);

const realWidth = getComputedStyle(document.querySelector(".container")).width;
const realHeight = getComputedStyle(document.querySelector(".container")).height;
const canvas = document.getElementById("labyrinth");
const canvasDim = Math.min(parseInt(realWidth), parseInt(realHeight));
canvas.width = canvasDim;
canvas.height = canvasDim;
const ctx = canvas.getContext("2d");
const dim = canvas.width / rows;
algernon.renderRawMazeToCanvas(ctx, dim, rawMaze);  //generate lab (optional value=solution), (20+=size of cell), (rawMaze=lab)

const nodeMatrix = algernon.convertRawToNodeMatrix(rawMaze);

function updateMaze(){
    algernon.renderRawMazeToCanvas(ctx, dim, rawMaze);
}

function showSolution(){
    algernon.renderRawMazeToCanvas(ctx, dim, rawMaze, solution);
}

export {nodeMatrix, rawMaze, solution, canvas, ctx, dim, updateMaze, showSolution}; 




