import * as THREE from '../../../node_modules/three/build/three.module.js';
import * as algernon from "https://cdn.jsdelivr.net/npm/algernon-js/dist/algernon.js";

const nCells = 10   //lab size
const [rows, cols] = [nCells, nCells];
const rawMaze = algernon.generateBacktrackingRaw(rows, cols);
const nodeMatrix = algernon.convertRawToNodeMatrix(rawMaze);
const bodyContent = document.getElementById("body-content");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.physicallyCorrectLights = true;
renderer.setSize( window.innerWidth, window.innerHeight );
bodyContent.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshNormalMaterial( );
const cube = new THREE.Mesh( geometry, material );


cube.position.set(0, 0, 0);

const cube2 = cube.clone();

cube2.position.set(-2, 0, 0);

camera.position.z = 5;
camera.position.y = 5;
camera.position.x = 5;

camera.lookAt(cube.position);

scene.add( cube , cube2 );

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();

window.addEventListener('resize', onWindowResize);
 

function onWindowResize() {

    const contenedor = document.getElementById("body-content");

    camera.aspect = contenedor.clientWidth / contenedor.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(contenedor.clientWidth, contenedor.clientHeight);
}


