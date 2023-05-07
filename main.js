import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Piece from './objects/Piece';

let renderer, scene, camera;
function init() {
    // Setup three js scene, camera and renderer
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('bg')
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.setZ(30);
    renderer.render(scene, camera);
}

init();

// create cube geometry
const pieceSize = 3;

// Rubik's colors matrix
const rubiksColorsHex = [
    0xb71234, // R
    0xff5800, // L
    0xffffff, // U
    0xffd500, // D
    0x009b48, // F
    0x0046ad  // B
];
const insideColor = 0x000000;

// initialize 3x3 cube
const cubeList = [
    [[], [], []],
    [[], [], []],
    [[], [], []]
];

// function to remove invisible inside colors from the piece
function getColorsArray(rubiksColorsHex, insideColor, x, y, z) {
    // +x => R, -x => L
    // +y => U, -y => D
    // +z => F, -z => B
    // [R, L, U, D, F, B]
    const colors = [...rubiksColorsHex];
    if (x >= 0) colors[1] = insideColor;
    if (x <= 0) colors[0] = insideColor;

    if (y >= 0) colors[3] = insideColor;
    if (y <= 0) colors[2] = insideColor;

    if (z >= 0) colors[5] = insideColor;
    if (z <= 0) colors[4] = insideColor;

    return colors;
}

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            const colorsArray = getColorsArray(rubiksColorsHex, insideColor, x, y, z);
            const piece = new Piece(pieceSize, colorsArray, insideColor);
            piece.setPosition(x * pieceSize, y * pieceSize, z * pieceSize);

            scene.add(piece.cube);
            cubeList[x + 1][y + 1][z + 1] = piece;
            // cubeList.push(piece);
        }
    }
}

console.log(cubeList);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

function setCubeColor(mesh, colorVal) {
    const positionAttribute = mesh.geometry.getAttribute('position');
    const colorArray = [];
    for (let i = 0; i < positionAttribute.count; i += 3) {
        const color = new THREE.Color();
        color.set(colorVal);
        colorArray.push(...new Array(3).fill([color.r, color.b, color.g]).flat());
    }

    mesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorArray, 3))
}

// setCubeColor(cubeList[0][0][0].cube, 0x000000);

// Move controls
// document.addEventListener('keydown', e => {
//     let criteria = function (index) {
//         return index % 3 == 0;
//     };

//     if (e.key == 'r') {
//         console.log('r pressed')
//         cubeList.forEach((cube, index) => {
//             if (criteria(index)) {
//                 setCubeColor(cube, "red");
//             }
//         })
//     } else if (e.key == 's') {
//         cubeList.forEach((cube, index) => {
//             if (criteria(index)) {
//                 cube.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
//             }
//         })
//     }
// })

// Function to make a move on the cube
/**
 * f(move):
 *      pieces = getAllRotatingPieces(cubeList, move)
 *      // rotate in 3d
 *      rotationParent = // create a new invisible mesh with correct rotation and orientation
 *      // then add all pieces to be moved in the rotationParent
 *      pieces.forEach(piece => rotationParent.add(piece))
 *      // rotate the parent
 *      rotateParent(parent, move)
 *      pieces.forEach(piece => scene.add(piece))
 *      
 *      updatePieceMatrix(cubeList, move);
 */


// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);

    // update the scene
    controls.update();

    // render the updated scene
    renderer.render(scene, camera);
}

animate();