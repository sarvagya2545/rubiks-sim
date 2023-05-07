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

// pieces of layers
const layerPieceCoordinates = {
    'U': [
        [-1, 1, -1], [0, 1, -1], [1, 1, -1],
        [-1, 1, 0], [0, 1, 0], [1, 1, 0],
        [-1, 1, 1], [0, 1, 1], [1, 1, 1]
    ],
    'D': [
        [-1, -1, -1], [0, -1, -1], [1, -1, -1],
        [-1, -1, 0], [0, -1, 0], [1, -1, 0],
        [-1, -1, 1], [0, -1, 1], [1, -1, 1]
    ],
    'R': [
        [1, -1, -1], [1, 0, -1], [1, 1, -1],
        [1, -1, 0], [1, 0, 0], [1, 1, 0],
        [1, -1, 1], [1, 0, 1], [1, 1, 1]
    ],
    'L': [
        [-1, -1, -1], [-1, 0, -1], [-1, 1, -1],
        [-1, -1, 0], [-1, 0, 0], [-1, 1, 0],
        [-1, -1, 1], [-1, 0, 1], [-1, 1, 1]
    ],
    'F': [
        [-1, 1, 1], [0, 1, 1], [1, 1, 1],
        [-1, 0, 1], [0, 0, 1], [1, 0, 1],
        [-1, -1, 1], [0, -1, 1], [1, -1, 1]
    ],
    'B': [
        [-1, 1, -1], [0, 1, -1], [1, 1, -1],
        [-1, 0, -1], [0, 0, -1], [1, 0, -1],
        [-1, -1, -1], [0, -1, -1], [1, -1, -1]
    ]
}

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
        }
    }
}

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// create a new method to rotate a face
THREE.Object3D.prototype.rotateAroundWorldAxis = function () {

    // rotate object around axis in world space (the axis passes through point)
    // axis is assumed to be normalized
    // assumes object does not have a rotated parent

    let q = new THREE.Quaternion();

    return function rotateAroundWorldAxis(point, axis, angle) {

        q.setFromAxisAngle(axis, angle);

        this.applyQuaternion(q);

        this.position.sub(point);
        this.position.applyQuaternion(q);
        this.position.add(point);

        return this;

    }

}();

/**
 * Rotation of elements
 * E.g.
 * U moves for corners
 *      [-1,1,-1] -> [1,1,-1] -> [1,1,1] -> [-1,1,1]
 * U moves for edges
 *      [0,1,-1] -> [1,1,0] -> [0,1,1] -> [-1,1,0]
 * R moves for corners
 *      
 */

document.addEventListener('keydown', e => {
    if (e.key.toUpperCase() === 'U') {
        const pieceCoors = layerPieceCoordinates[e.key.toUpperCase()]

        const axis = new THREE.Vector3(0, -1, 0);
        const point = new THREE.Vector3(0, 0, 0);
        const angle = THREE.MathUtils.degToRad(90);
        // rotate the selected pieces in UI
        pieceCoors.forEach(([x, y, z]) => {
            cubeList[x + 1][y + 1][z + 1].cube.rotateAroundWorldAxis(point, axis, angle)
        })
        // console.log(pieces)
        // move around the data in the cubeList

        // rotate corners in U move
        let [w, x, y, z] = [
            cubeList[0][2][0],
            cubeList[2][2][0],
            cubeList[2][2][2],
            cubeList[0][2][2]
        ];

        [
            cubeList[0][2][0],
            cubeList[2][2][0],
            cubeList[2][2][2],
            cubeList[0][2][2]
        ] = [z, w, x, y];

        // rotate edges in U move
        [w, x, y, z] = [
            cubeList[1][2][0], cubeList[2][2][1], cubeList[1][2][2], cubeList[0][2][1]
        ];

        [
            cubeList[1][2][0], cubeList[2][2][1], cubeList[1][2][2], cubeList[0][2][1]
        ] = [z, w, x, y];
        // rotate(cubeList[1][2][0], cubeList[2][2][1], cubeList[1][2][2], cubeList[0][2][1]);
        // console.log(cubeList.flat().flat().map(piece => ({ id: piece.cube.uuid })));
        // console.log(cubeList);
    } else if (e.key.toUpperCase() === 'R') {
        const pieceCoors = layerPieceCoordinates[e.key.toUpperCase()]

        const axis = new THREE.Vector3(-1, 0, 0);
        const point = new THREE.Vector3(0, 0, 0);
        const angle = THREE.MathUtils.degToRad(90);
        // rotate the selected pieces in UI
        pieceCoors.forEach(([x, y, z]) => {
            cubeList[x + 1][y + 1][z + 1].cube.rotateAroundWorldAxis(point, axis, angle)
        })
        // console.log(pieces)
        // move around the data in the cubeList

        // rotate corners in R move
        let [w, x, y, z] = [
            cubeList[2][2][2],
            cubeList[2][2][0],
            cubeList[2][0][0],
            cubeList[2][0][2]
        ];

        [
            cubeList[2][2][2],
            cubeList[2][2][0],
            cubeList[2][0][0],
            cubeList[2][0][2]
        ] = [z, w, x, y];

        // // rotate edges in R move
        [w, x, y, z] = [
            cubeList[2][2][1], cubeList[2][1][0], cubeList[2][0][1], cubeList[2][1][2]
        ];

        [
            cubeList[2][2][1], cubeList[2][1][0], cubeList[2][0][1], cubeList[2][1][2]
        ] = [z, w, x, y];
    }
})

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