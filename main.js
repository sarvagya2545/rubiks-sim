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

// Constants
const PIECE_SIZE = 3;
const ORIGIN = new THREE.Vector3(0, 0, 0);

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

const NEG_X_AXIS = new THREE.Vector3(-1, 0, 0);
const NEG_Y_AXIS = new THREE.Vector3(0, -1, 0);
const NEG_Z_AXIS = new THREE.Vector3(0, 0, -1);

const layerAxis = {
    'U': Y_AXIS,
    'R': X_AXIS,
    'F': Z_AXIS,
    'L': NEG_X_AXIS,
    'D': NEG_Y_AXIS,
    'B': NEG_Z_AXIS,
};

const layerCornerRotations = {
    'U': [
        [0, 2, 0],
        [2, 2, 0],
        [2, 2, 2],
        [0, 2, 2]
    ],
    'R': [
        [2, 2, 2],
        [2, 2, 0],
        [2, 0, 0],
        [2, 0, 2]
    ],
    'L': [
        [0, 0, 0],
        [0, 2, 0],
        [0, 2, 2],
        [0, 0, 2]
    ],
    'D': [
        [0, 0, 0],
        [0, 0, 2],
        [2, 0, 2],
        [2, 0, 0]
    ],
    'F': [
        [0, 2, 2],
        [2, 2, 2],
        [2, 0, 2],
        [0, 0, 2]
    ],
    'B': [
        [2, 2, 0],
        [0, 2, 0],
        [0, 0, 0],
        [2, 0, 0]
    ],
};

const layerEdgeRotations = {
    'U': [
        [1, 2, 0], [2, 2, 1], [1, 2, 2], [0, 2, 1]
    ],
    'R': [
        [2, 2, 1], [2, 1, 0], [2, 0, 1], [2, 1, 2]
    ],
    'F': [
        [1, 2, 2], [2, 1, 2], [1, 0, 2], [0, 1, 2]
    ],
    'B': [
        [1, 2, 0], [0, 1, 0], [1, 0, 0], [2, 1, 0]
    ],
    'D': [
        [1, 0, 0], [0, 0, 1], [1, 0, 2], [2, 0, 1]
    ],
    'L': [
        [0, 2, 1], [0, 1, 2], [0, 0, 1], [0, 1, 0]
    ],

}

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
            const piece = new Piece(PIECE_SIZE, colorsArray, insideColor);
            piece.setPosition(x * PIECE_SIZE, y * PIECE_SIZE, z * PIECE_SIZE);

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

function moveLayer(layer, clockwise = true) {
    const pieceCoors = layerPieceCoordinates[layer]

    const axis = layerAxis[layer];
    const angle = THREE.MathUtils.degToRad(90 * (clockwise ? -1 : 1));
    // rotate the selected pieces in UI
    pieceCoors.forEach(([x, y, z]) => {
        cubeList[x + 1][y + 1][z + 1].cube.rotateAroundWorldAxis(ORIGIN, axis, angle)
    })
    // console.log(pieces)
    // move around the data in the cubeList

    // rotate corners in the layer move
    const [c1, c2, c3, c4] = layerCornerRotations[layer];
    let [w, x, y, z] = [
        cubeList[c1[0]][c1[1]][c1[2]],
        cubeList[c2[0]][c2[1]][c2[2]],
        cubeList[c3[0]][c3[1]][c3[2]],
        cubeList[c4[0]][c4[1]][c4[2]]
    ];

    if (clockwise) {
        [
            cubeList[c1[0]][c1[1]][c1[2]],
            cubeList[c2[0]][c2[1]][c2[2]],
            cubeList[c3[0]][c3[1]][c3[2]],
            cubeList[c4[0]][c4[1]][c4[2]]
        ] = [z, w, x, y];
    } else {
        [
            cubeList[c1[0]][c1[1]][c1[2]],
            cubeList[c2[0]][c2[1]][c2[2]],
            cubeList[c3[0]][c3[1]][c3[2]],
            cubeList[c4[0]][c4[1]][c4[2]]
        ] = [x, y, z, w];
    }

    // rotate edges in layer move
    const [e1, e2, e3, e4] = layerEdgeRotations[layer];
    [w, x, y, z] = [
        cubeList[e1[0]][e1[1]][e1[2]],
        cubeList[e2[0]][e2[1]][e2[2]],
        cubeList[e3[0]][e3[1]][e3[2]],
        cubeList[e4[0]][e4[1]][e4[2]]
    ];

    if (clockwise) {
        [
            cubeList[e1[0]][e1[1]][e1[2]],
            cubeList[e2[0]][e2[1]][e2[2]],
            cubeList[e3[0]][e3[1]][e3[2]],
            cubeList[e4[0]][e4[1]][e4[2]]
        ] = [z, w, x, y];
    } else {
        [
            cubeList[e1[0]][e1[1]][e1[2]],
            cubeList[e2[0]][e2[1]][e2[2]],
            cubeList[e3[0]][e3[1]][e3[2]],
            cubeList[e4[0]][e4[1]][e4[2]]
        ] = [x, y, z, w];
    }
}

document.addEventListener('keydown', e => {
    // console.log(e.key.toUpperCase())
    if (Object.keys(layerAxis).some(val => val == e.key.toUpperCase())) {
        // console.log('Valid move');
        const upperCaseKey = e.key.toUpperCase();
        moveLayer(upperCaseKey, upperCaseKey !== e.key);
    }
})

// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);

    // update the scene
    controls.update();

    // render the updated scene
    renderer.render(scene, camera);
}

animate();